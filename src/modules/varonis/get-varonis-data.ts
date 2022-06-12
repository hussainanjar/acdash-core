import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { convertStringToNumber } from '../../utils/common';
import { VaronisUserExpiredPasswordKpi } from '../../models/varonis/varonis-user-expired-password';
import { VaronisFileServerTotalKpi } from '../../models/varonis/varonis-file-server-total';
import { VaronisUserAndComputerKpi } from '../../models/varonis/varonis-file-user-and-computer';
import { VaronisUserAccountDisableKpi } from '../../models/varonis/varonis-user-account-disable';
import { VaronisDisabledComputerKpi } from '../../models/varonis/varonis-disabled-computer';
import { VaronisFileTypeEnum } from '../../utils/enum';
import { EmailService } from '../../utils/email';

async function getVaronisData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'VARONIS';
  const processingDate: Date = dayjs().toDate();

  const emailService: EmailService = new EmailService();
  try {
    const payload: any = await loadFilesInDirectory({ pathDirectory: process.env.VARONIS_DIRECTORY_PATH, processingDate });

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getVaronisData - error - ${processingDate}: ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - Varonis Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error.message,
        method: 'getVaronisData - loadFilesInDirectory',
        meta: 'Varonis Data',
      },
    });
  } finally {
    jobLogger.info(`getVaronisData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getVaronisData };

async function loadFilesInDirectory(props: { pathDirectory: string; processingDate?: Date }) {
  return new Promise(async function (resolve, reject) {
    const { pathDirectory, processingDate } = props;

    let userExpiredPassword: any[] = [];
    let fileServerTotals: any[] = [];
    let userAndComputer: any[] = [];
    let userAccountDisable: any[] = [];
    let disabledComputers: any[] = [];

    try {
      jobLogger.info(`getVaronisData - loadFilesInDirectory Execute - ${processingDate}`);

      fs.stat(pathDirectory, (err, stat) => {
        try {
          if (!err) {
            if (stat.isDirectory()) {
              fs.readdirSync(pathDirectory).forEach((file) => {
                if (
                  _.includes(
                    [
                      process.env.VARONIS_FILES_USER_EXPIRED_PASSWORD,
                      process.env.VARONIS_FILES_FILE_SERVER_TOTALS,
                      process.env.VARONIS_FILES_USER_AND_COMPUTER,
                      process.env.VARONIS_FILES_ACCOUNT_DISABLED,
                      process.env.VARONIS_FILES_SHAREPOINT_TOTAL_KPI,
                      process.env.VARONIS_FILES_DISABLED_COMPUTER_KPI,
                    ],
                    file,
                  )
                ) {
                  if (path.extname(file) !== '.csv') {
                    throw new Error(`file: ${file} is not a csv file `);
                  }

                  fs.createReadStream(path.join(pathDirectory, file))
                    .pipe(
                      csv({
                        ...(process.env.VARONIS_FILES_USER_EXPIRED_PASSWORD == file && { headers: ['Type', 'Domain_Name', 'OU_Name', 'User_Group', 'Logon_Name', 'PwdLastSet'], skipComments: true, skipLines: 1 }),
                        ...(process.env.VARONIS_FILES_FILE_SERVER_TOTALS == file && {
                          headers: ['File_Server', 'No_of_Folders', 'No_of_Files', 'No_of_Permission_Entries', 'Size_of_all_Files_and_Folders_GB_'],
                          skipComments: true,
                          skipLines: 1,
                        }),
                        ...(process.env.VARONIS_FILES_USER_AND_COMPUTER == file && { headers: ['No_of_Users', 'No_of_Computer_Accounts', 'No_of_Disabled_Users'], skipComments: true, skipLines: 1 }),
                        ...(process.env.VARONIS_FILES_ACCOUNT_DISABLED == file && {
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
                        ...(process.env.VARONIS_FILES_SHAREPOINT_TOTAL_KPI == file && {
                          headers: ['File_Server', 'No_of_Folders', 'Size_of_all_Files_and_Folders_GB_', 'No_of_Permission_Entries', 'No_of_Files'],
                          skipComments: true,
                          skipLines: 1,
                        }),
                        ...(process.env.VARONIS_FILES_DISABLED_COMPUTER_KPI == file && {
                          headers: ['Disabled_accounts', 'name'],
                          skipComments: true,
                          skipLines: 1,
                        }),
                      }),
                    )
                    .on('data', (data: any) => {
                      switch (file) {
                        case process.env.VARONIS_FILES_USER_EXPIRED_PASSWORD:
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

                          break;

                        case process.env.VARONIS_FILES_FILE_SERVER_TOTALS:
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
                          break;

                        case process.env.VARONIS_FILES_USER_AND_COMPUTER:
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
                          break;

                        case process.env.VARONIS_FILES_ACCOUNT_DISABLED:
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

                          break;

                        case process.env.VARONIS_FILES_SHAREPOINT_TOTAL_KPI:
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
                              .then(() => jobLogger.info(`VaronisFileSharepointServerTotalKpi - bulkCreate - ${processingDate} - success`))
                              .catch((error) => {
                                jobLogger.error(`VaronisFileSharepointServerTotalKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                              });
                            fileServerTotals = [];
                          }
                          break;

                        case process.env.VARONIS_FILES_DISABLED_COMPUTER_KPI:
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
                          break;
                      }
                    })
                    .on('error', (error: any) => {
                      reject(error);
                    })
                    .on('end', () => {
                      try {
                        switch (file) {
                          case process.env.VARONIS_FILES_USER_EXPIRED_PASSWORD:
                            if (userExpiredPassword.length > 0) {
                              VaronisUserExpiredPasswordKpi.bulkCreate(userExpiredPassword)
                                .then(() => jobLogger.info(`VaronisUserExpiredPasswordKpi - bulkCreate - ${processingDate} - success`))
                                .catch((error) => {
                                  jobLogger.error(`VaronisUserExpiredPasswordKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                                });
                              userExpiredPassword = [];
                            }
                            break;

                          case process.env.VARONIS_FILES_FILE_SERVER_TOTALS:
                            if (fileServerTotals.length > 0) {
                              VaronisFileServerTotalKpi.bulkCreate(fileServerTotals)
                                .then(() => jobLogger.info(`VaronisFileServerTotalKpi - bulkCreate - ${processingDate} - success`))
                                .catch((error) => {
                                  jobLogger.error(`VaronisFileServerTotalKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                                });
                              fileServerTotals = [];
                            }
                            break;

                          case process.env.VARONIS_FILES_USER_AND_COMPUTER:
                            if (userAndComputer.length > 0) {
                              VaronisUserAndComputerKpi.bulkCreate(userAndComputer)
                                .then(() => jobLogger.info(`VaronisUserAndComputerKpi - bulkCreate - ${processingDate} - success`))
                                .catch((error) => {
                                  jobLogger.error(`VaronisUserAndComputerKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                                });
                              userAndComputer = [];
                            }
                            break;

                          case process.env.VARONIS_FILES_ACCOUNT_DISABLED:
                            if (userAccountDisable.length > 0) {
                              VaronisUserAccountDisableKpi.bulkCreate(userAccountDisable)
                                .then(() => jobLogger.info(`VaronisUserAccountDisableKpi - bulkCreate - ${processingDate} - success`))
                                .catch((error) => {
                                  jobLogger.error(`VaronisUserAccountDisableKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                                });
                              userAccountDisable = [];
                            }
                            break;

                          case process.env.VARONIS_FILES_SHAREPOINT_TOTAL_KPI:
                            if (fileServerTotals.length > 0) {
                              VaronisFileServerTotalKpi.bulkCreate(fileServerTotals)
                                .then(() => jobLogger.info(`VaronisFileSharepointServerTotalKpi - bulkCreate - ${processingDate} - success`))
                                .catch((error) => {
                                  jobLogger.error(`VaronisFileSharepointServerTotalKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                                });
                              fileServerTotals = [];
                            }
                            break;

                          case process.env.VARONIS_FILES_DISABLED_COMPUTER_KPI:
                            if (disabledComputers.length > 0) {
                              VaronisDisabledComputerKpi.bulkCreate(disabledComputers)
                                .then(() => jobLogger.info(`VaronisDisabledComputerKpi - bulkCreate - ${processingDate} - success`))
                                .catch((error) => {
                                  jobLogger.error(`VaronisDisabledComputerKpi - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                                });
                              disabledComputers = [];
                            }
                            break;

                          default:
                            break;
                        }
                      } catch (error) {
                        reject(error);
                      }
                    });

                  // resolve(true);
                }
              });
            }
          } else {
            throw new Error(err.message);
          }
        } catch (error) {
          jobLogger.error(`getVaronisData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
          reject(error);
        }
        jobLogger.info(`getVaronisData - loadFilesInDirectory Finish - ${processingDate}`);
        resolve(true);
      });
    } catch (error) {
      jobLogger.error(`getVaronisData - loadFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
      reject(error);
    }
  });
}
