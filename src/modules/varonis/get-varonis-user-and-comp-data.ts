import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { EmailService } from '../../utils/email';
import { convertStringToNumber } from '../../utils/common';
import { VaronisUserAndComputerKpi } from '../../models/varonis/varonis-file-user-and-computer';

async function getVaronisFileUserAndComputerData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'VARONIS_FILE_USER_AND_COMPUTER';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getVaronisFileUserAndComputerData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();

  try {
    const payload: any = await loadFilesInDirectory({ pathDirectory: process.env.VARONIS_DIRECTORY_PATH, processingDate });

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getVaronisFileUserAndComputerData - ${processingDate} - error: ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - Varonis User And Computer Block Data Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error.message,
        method: 'getVaronisFileUserAndComputerData',
        meta: 'Varonis - User And Computer Block Data',
      },
    });
  } finally {
    jobLogger.info(`getVaronisFileUserAndComputerData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;
    await createLogService(log);
  }
}

export { getVaronisFileUserAndComputerData };

async function loadFilesInDirectory(props: { pathDirectory: string; processingDate?: Date }) {
  return new Promise(async function (resolve, reject) {
    const { pathDirectory, processingDate } = props;

    let userAndComputer: any[] = [];

    try {
      jobLogger.info(`getVaronisData - loadFilesInDirectory Execute - ${processingDate}`);

      fs.stat(pathDirectory, (err, stat) => {
        try {
          if (!err) {
            if (stat.isDirectory()) {
              const latestFile: {
                file: string;
                mtime: Date;
              } = fs
                .readdirSync(pathDirectory)
                .filter((file) => fs.lstatSync(path.join(pathDirectory, file)))
                .map((file) => {
                  const currentData: string = dayjs().format('YYYY-MM-DD');
                  const fileCreateDate: string = dayjs(fs.lstatSync(path.join(pathDirectory, file)).mtime).format('YYYY-MM-DD');

                  return file.includes(process.env.VARONIS_FILES_USER_AND_COMPUTER) && dayjs(currentData).isSame(dayjs(fileCreateDate)) && { file, mtime: fs.lstatSync(path.join(pathDirectory, file)).mtime };
                })
                .filter(Boolean)
                .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())[0];

              if (latestFile) {
                const newPath: string = path.join(pathDirectory, latestFile.file);
                fs.readdirSync(newPath).forEach((file) => {
                  if (path.extname(file) !== '.csv') {
                    throw new Error(`file: ${file} is not a csv file `);
                  }

                  fs.createReadStream(path.join(pathDirectory, file))
                    .pipe(
                      csv({
                        headers: ['No_of_Users', 'No_of_Computer_Accounts', 'No_of_Disabled_Users'],
                        skipComments: true,
                        skipLines: 1,
                      }),
                    )
                    .on('data', (data: any) => {
                      if (!_.isEmpty(data))
                        userAndComputer.push({
                          processingDate,
                          noOfUsers: convertStringToNumber(data['No_of_Users']) ?? null,
                          noOfComputerAccounts: convertStringToNumber(data['No_of_Computer_Accounts']) ?? null,
                          noOfDisabledUsers: data['No_of_Disabled_Users'] ?? null,
                        });

                      if (userAndComputer.length === 30) {
                        VaronisUserAndComputerKpi.bulkCreate(userAndComputer)
                          .then(() => jobLogger.info(`VaronisUserAndComputerKpi - bulkCreate - ${processingDate} - success`))
                          .catch((error) => {
                            jobLogger.error(`VaronisUserAndComputerKpi - bulkCreate Error ${processingDate} - ${error.message}, ${error.stack}`);
                          });
                        userAndComputer = [];
                      }
                    })
                    .on('error', (error: any) => {
                      reject(error);
                    })
                    .on('end', () => {
                      try {
                        if (userAndComputer.length > 0) {
                          VaronisUserAndComputerKpi.bulkCreate(userAndComputer)
                            .then(() => jobLogger.info(`VaronisUserAndComputerKpi - bulkCreate - ${processingDate} - success`))
                            .catch((error) => {
                              jobLogger.error(`VaronisUserAndComputerKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                            });
                          userAndComputer = [];
                        }
                      } catch (error) {
                        reject(error);
                      }
                    });

                  // resolve(true);
                });
              } else {
                throw new Error('no latest file found');
              }
            }
          } else {
            throw new Error(err.message);
          }
        } catch (error) {
          jobLogger.error(`getVaronisFileUserAndComputerData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
          reject(error);
        }
        jobLogger.info(`getVaronisFileUserAndComputerData - loadFilesInDirectory Finish - ${processingDate}`);
        resolve(true);
      });
    } catch (error) {
      jobLogger.error(`getVaronisFileUserAndComputerData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
      reject(error);
    }
  });
}
