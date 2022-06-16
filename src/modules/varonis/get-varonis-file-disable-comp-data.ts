import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { EmailService } from '../../utils/email';
import { VaronisDisabledComputerKpi } from '../../models/varonis/varonis-disabled-computer';

async function getVaronisFileDisableComputerData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'VARONIS_FILE_DISABLE_COMPUTER';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getVaronisFileDisableComputerData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();

  try {
    const payload: any = await loadFilesInDirectory({ pathDirectory: process.env.VARONIS_DIRECTORY_PATH, processingDate });

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getVaronisFileDisableComputerData - ${processingDate} - error: ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - Varonis File Disable Computer Kpi Data Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error.message,
        method: 'getVaronisFileDisableComputerData',
        meta: 'Varonis - File Disable Computer Kpi Data',
      },
    });
  } finally {
    jobLogger.info(`getVaronisFileDisableComputerData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;
    await createLogService(log);
  }
}

export { getVaronisFileDisableComputerData };

async function loadFilesInDirectory(props: { pathDirectory: string; processingDate?: Date }) {
  return new Promise(async function (resolve, reject) {
    const { pathDirectory, processingDate } = props;

    let disabledComputers: any[] = [];

    try {
      jobLogger.info(`getVaronisFileDisableComputerData - loadFilesInDirectory Execute - ${processingDate}`);

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

                  return file.includes(process.env.VARONIS_FILES_DISABLED_COMPUTER_KPI) && dayjs(currentData).isSame(dayjs(fileCreateDate)) && { file, mtime: fs.lstatSync(path.join(pathDirectory, file)).mtime };
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
                        headers: ['Disabled_accounts', 'name'],
                        skipComments: true,
                        skipLines: 1,
                      }),
                    )
                    .on('data', (data: any) => {
                      if (!_.isEmpty(data))
                        disabledComputers.push({
                          processingDate,
                          disabledAccounts: data['Disabled_accounts'] ?? null,
                          name: data['name'] ?? null,
                        });

                      if (disabledComputers.length === 30) {
                        VaronisDisabledComputerKpi.bulkCreate(disabledComputers)
                          .then(() => jobLogger.info(`VaronisDisabledComputerKpi - bulkCreate - ${processingDate} - success`))
                          .catch((error) => {
                            jobLogger.error(`VaronisDisabledComputerKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                          });
                        disabledComputers = [];
                      }
                    })
                    .on('error', (error: any) => {
                      reject(error);
                    })
                    .on('end', () => {
                      try {
                        if (disabledComputers.length > 0) {
                          VaronisDisabledComputerKpi.bulkCreate(disabledComputers)
                            .then(() => jobLogger.info(`VaronisDisabledComputerKpi - bulkCreate - ${processingDate} - success`))
                            .catch((error) => {
                              jobLogger.error(`VaronisDisabledComputerKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                            });
                          disabledComputers = [];
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
          jobLogger.error(`getVaronisFileDisableComputerData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
          reject(error);
        }
        jobLogger.info(`getVaronisFileDisableComputerData - loadFilesInDirectory Finish - ${processingDate}`);
        resolve(true);
      });
    } catch (error) {
      jobLogger.error(`getVaronisFileDisableComputerData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
      reject(error);
    }
  });
}
