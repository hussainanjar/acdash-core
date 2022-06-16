import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { EmailService } from '../../utils/email';
import { VaronisUserExpiredPasswordKpi } from '../../models/varonis/varonis-user-expired-password';

async function getVaronisFileUserExpPassData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'VARONIS_USER_EXPIRE_PASSWORD';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getVaronisFileUserExpPassData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();

  try {
    const payload: any = await loadFilesInDirectory({ pathDirectory: process.env.VARONIS_DIRECTORY_PATH, processingDate });

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getVaronisFileUserExpPassData - ${processingDate} - error: ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - Varonis User Expire Password Block Data Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error.message,
        method: 'getVaronisFileUserExpPassData',
        meta: 'Varonis - User Expire Password Block Data',
      },
    });
  } finally {
    jobLogger.info(`getVaronisFileUserExpPassData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;
    await createLogService(log);
  }
}

export { getVaronisFileUserExpPassData };

async function loadFilesInDirectory(props: { pathDirectory: string; processingDate?: Date }) {
  return new Promise(async function (resolve, reject) {
    const { pathDirectory, processingDate } = props;

    let userExpiredPassword: any[] = [];

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

                  return file.includes(process.env.VARONIS_FILES_USER_EXPIRED_PASSWORD) && dayjs(currentData).isSame(dayjs(fileCreateDate)) && { file, mtime: fs.lstatSync(path.join(pathDirectory, file)).mtime };
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
                        headers: ['Type', 'Domain_Name', 'OU_Name', 'User_Group', 'Logon_Name', 'PwdLastSet'],
                        skipComments: true,
                        skipLines: 1,
                      }),
                    )
                    .on('data', (data: any) => {
                      if (!_.isEmpty(data))
                        userExpiredPassword.push({
                          processingDate,
                          type: data['Type'] ?? null,
                          domainName: data['Domain_Name'] ?? null,
                          ouName: data['OU_Name'] ?? null,
                          userGroup: data['User_Group'] ?? null,
                          logonName: data['Logon_Name'] ?? null,
                          PwdLastSet: data['PwdLastSet'] ? dayjs(data['PwdLastSet']).toDate() : null,
                        });

                      if (userExpiredPassword.length === 30) {
                        VaronisUserExpiredPasswordKpi.bulkCreate(userExpiredPassword)
                          .then(() => jobLogger.info(`VaronisUserExpiredPasswordKpi - bulkCreate - ${processingDate} - success`))
                          .catch((error) => {
                            jobLogger.error(`VaronisUserExpiredPasswordKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                          });
                        userExpiredPassword = [];
                      }
                    })
                    .on('error', (error: any) => {
                      reject(error);
                    })
                    .on('end', () => {
                      try {
                        if (userExpiredPassword.length > 0) {
                          VaronisUserExpiredPasswordKpi.bulkCreate(userExpiredPassword)
                            .then(() => jobLogger.info(`VaronisUserExpiredPasswordKpi - bulkCreate - ${processingDate} - success`))
                            .catch((error) => {
                              jobLogger.error(`VaronisUserExpiredPasswordKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                            });
                          userExpiredPassword = [];
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
          jobLogger.error(`getVaronisFileUserExpPassData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
          reject(error);
        }
        jobLogger.info(`getVaronisFileUserExpPassData - loadFilesInDirectory Finish - ${processingDate}`);
        resolve(true);
      });
    } catch (error) {
      jobLogger.error(`getVaronisFileUserExpPassData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
      reject(error);
    }
  });
}
