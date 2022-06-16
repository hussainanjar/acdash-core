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
import { VaronisUserAccountDisableKpi } from '../../models/varonis/varonis-user-account-disable';

async function getVaronisFileAccountDisableData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'VARONIS_FILE_ACCOUNT_DISABLE';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getVaronisFileAccountDisableData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();

  try {
    const payload: any = await loadFilesInDirectory({ pathDirectory: process.env.VARONIS_DIRECTORY_PATH, processingDate });

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getVaronisFileAccountDisableData - ${processingDate} - error: ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - Varonis File Account Disable Block Data Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error.message,
        method: 'getVaronisFileAccountDisableData',
        meta: 'Varonis - File Account Disable Block Data',
      },
    });
  } finally {
    jobLogger.info(`getVaronisFileAccountDisableData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;
    await createLogService(log);
  }
}

export { getVaronisFileAccountDisableData };

async function loadFilesInDirectory(props: { pathDirectory: string; processingDate?: Date }) {
  return new Promise(async function (resolve, reject) {
    const { pathDirectory, processingDate } = props;

    let userAccountDisable: any[] = [];

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

                  return file.includes(process.env.VARONIS_FILES_ACCOUNT_DISABLED) && dayjs(currentData).isSame(dayjs(fileCreateDate)) && { file, mtime: fs.lstatSync(path.join(pathDirectory, file)).mtime };
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
                        headers: [
                          'Operation_Source',
                          'Event_Time',
                          'File_Server_Domain',
                          'Object_Type',
                          'Path',
                          'Object',
                          'Event_Operation',
                          'Event_Type',
                          'Event_Status',
                          'Operation_By',
                          'Event_Description',
                          'File_Type',
                          'Event_Count',
                          'Last_Occurrence',
                          'Device_IP_Address_',
                          'Device_Name',
                          'Mail_Source',
                          'Mail_Recipients',
                          'Mail_Date',
                          'Attachment_Name',
                        ],
                        skipComments: true,
                        skipLines: 1,
                      }),
                    )
                    .on('data', (data: any) => {
                      if (!_.isEmpty(data))
                        userAccountDisable.push({
                          processingDate,
                          operationSource: data['Operation_Source'] ?? null,
                          eventTime: data['Event_Time'] ? dayjs(data['Event_Time']).toDate() : null,
                          fileServerDomain: data['File_Server_Domain'] ?? null,
                          objectType: data['Object_Type'] ?? null,
                          path: data['Path'] ?? null,
                          object: data['Object'] ?? null,
                          eventOperation: data['Event_Operation'] ?? null,
                          eventType: data['Event_Type'] ?? null,
                          eventStatus: data['Event_Status'] ?? null,
                          operationBy: data['Operation_By'] ?? null,
                          eventDescription: data['Event_Description'] ?? null,
                          fileType: data['File_Type'] ?? null,
                          eventCount: convertStringToNumber(data['Event_Count']) ?? null,
                          lastOccurrence: data['Last_Occurrence'] ? dayjs(data['Last_Occurrence']).toDate() : null,
                          deviceIpAddress: data['Device_IP_Address_'] ?? null,
                          deviceName: data['Device_Name'] ?? null,
                          mailSource: data['Mail_Source'] ?? null,
                          mailRecipients: data['Mail_Recipients'] ?? null,
                          mailDate: data['Mail_Date'] ? dayjs(data['Mail_Date']).toDate() : null,
                          attachmentName: data['Attachment_Name'] ?? null,
                        });

                      if (userAccountDisable.length === 30) {
                        VaronisUserAccountDisableKpi.bulkCreate(userAccountDisable)
                          .then(() => jobLogger.info(`VaronisUserAccountDisableKpi - bulkCreate - ${processingDate} - success`))
                          .catch((error) => {
                            jobLogger.error(`VaronisUserAccountDisableKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                          });
                        userAccountDisable = [];
                      }
                    })
                    .on('error', (error: any) => {
                      reject(error);
                    })
                    .on('end', () => {
                      try {
                        if (userAccountDisable.length > 0) {
                          VaronisUserAccountDisableKpi.bulkCreate(userAccountDisable)
                            .then(() => jobLogger.info(`VaronisUserAccountDisableKpi - bulkCreate - ${processingDate} - success`))
                            .catch((error) => {
                              jobLogger.error(`VaronisUserAccountDisableKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                            });
                          userAccountDisable = [];
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
          jobLogger.error(`getVaronisFileAccountDisableData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
          reject(error);
        }
        jobLogger.info(`getVaronisFileAccountDisableData - loadFilesInDirectory Finish - ${processingDate}`);
        resolve(true);
      });
    } catch (error) {
      jobLogger.error(`getVaronisFileAccountDisableData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
      reject(error);
    }
  });
}
