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
import { VaronisFileServerTotalKpi } from '../../models/varonis/varonis-file-server-total';

async function getVaronisFileServerTotalData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'VARONIS_FILE_SERVER_TOTAL';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getVaronisFileServerTotalData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();

  try {
    const payload: any = await loadFilesInDirectory({ pathDirectory: process.env.VARONIS_DIRECTORY_PATH, processingDate });

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getVaronisFileServerTotalData - ${processingDate} - error: ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - Varonis File Server Total Block Data Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error.message,
        method: 'getVaronisFileServerTotalData',
        meta: 'Varonis - File Server Total Block Data',
      },
    });
  } finally {
    jobLogger.info(`getVaronisFileServerTotalData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;
    await createLogService(log);
  }
}

export { getVaronisFileServerTotalData };

async function loadFilesInDirectory(props: { pathDirectory: string; processingDate?: Date }) {
  return new Promise(async function (resolve, reject) {
    const { pathDirectory, processingDate } = props;

    let fileServerTotals: any[] = [];

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

                  return file.includes(process.env.VARONIS_FILES_FILE_SERVER_TOTALS) && dayjs(currentData).isSame(dayjs(fileCreateDate)) && { file, mtime: fs.lstatSync(path.join(pathDirectory, file)).mtime };
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
                        headers: ['File_Server', 'No_of_Folders', 'No_of_Files', 'No_of_Permission_Entries', 'Size_of_all_Files_and_Folders_GB_'],
                        skipComments: true,
                        skipLines: 1,
                      }),
                    )
                    .on('data', (data: any) => {
                      if (!_.isEmpty(data))
                        fileServerTotals.push({
                          processingDate,
                          fileServer: data['File_Server'] ?? null,
                          noOfFolders: convertStringToNumber(data['No_of_Folders']) ?? null,
                          noOfFiles: convertStringToNumber(data['No_of_Files']) ?? null,
                          noOfPermissionEntries: convertStringToNumber(data['No_of_Permission_Entries']) ?? null,
                          sizeOfAllFilesAndFoldersGb: convertStringToNumber(data['Size_of_all_Files_and_Folders_GB_']) ?? null,
                        });

                      if (fileServerTotals.length === 30) {
                        VaronisFileServerTotalKpi.bulkCreate(fileServerTotals)
                          .then(() => jobLogger.info(`VaronisFileServerTotalKpi - bulkCreate - ${processingDate} - success`))
                          .catch((error) => {
                            jobLogger.error(`VaronisFileServerTotalKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                          });
                        fileServerTotals = [];
                      }
                    })
                    .on('error', (error: any) => {
                      reject(error);
                    })
                    .on('end', () => {
                      try {
                        if (fileServerTotals.length > 0) {
                          VaronisFileServerTotalKpi.bulkCreate(fileServerTotals)
                            .then(() => jobLogger.info(`VaronisFileServerTotalKpi - bulkCreate - ${processingDate} - success`))
                            .catch((error) => {
                              jobLogger.error(`VaronisFileServerTotalKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                            });
                          fileServerTotals = [];
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
          jobLogger.error(`getVaronisFileServerTotalData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
          reject(error);
        }
        jobLogger.info(`getVaronisFileServerTotalData - loadFilesInDirectory Finish - ${processingDate}`);
        resolve(true);
      });
    } catch (error) {
      jobLogger.error(`getVaronisFileServerTotalData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
      reject(error);
    }
  });
}
