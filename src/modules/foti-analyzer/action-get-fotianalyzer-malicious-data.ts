import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { FotiAnalyzerMaliciousDetails, FotiAnalyzerMaliciousDetailsModel } from '../../models/foti-analyzer/foti-malicious';
import { FotiFileNameEnum } from '../../utils/enum';
import { EmailService } from '../../utils/email';

async function getFotiAnalyzerMaliciousData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'FOTI_ANALYZER_MALICIOUS';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getFotiAnalyzerMaliciousData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();

  try {
    const payload: FotiAnalyzerMaliciousDetailsModel[] = await loadMaliciousFilesInDirectory({ pathDirectory: process.env.FOTI_ANALIZER_DIRECTORY_PATH, processingDate });

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getFotiAnalyzerMaliciousData - ${processingDate} - error: ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - FotiAnalyzer Malicious Data Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error.message,
        method: 'getFotiAnalyzerMaliciousData',
        meta: 'Foti Analyzer Malicious Data',
      },
    });
  } finally {
    jobLogger.info(`getFotiAnalyzerMaliciousData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getFotiAnalyzerMaliciousData };

async function loadMaliciousFilesInDirectory(props: { pathDirectory: string; processingDate?: Date }) {
  return new Promise<any>((resolve, reject) => {
    const log: CronLogModel = {} as CronLogModel;
    const { pathDirectory, processingDate = null } = props;

    try {
      jobLogger.info(`loadMaliciousFilesInDirectory Execute - ${processingDate}`);

      let out: any[] = [];
      fs.stat(pathDirectory, (err, stat) => {
        try {
          if (!err) {
            if (stat.isDirectory()) {
              // finding the latest folder
              const latestFile: {
                file: string;
                mtime: Date;
              } = fs
                .readdirSync(pathDirectory)
                .filter((file) => fs.lstatSync(path.join(pathDirectory, file)))
                .map((file) => {
                  const currentData: string = dayjs().format('YYYY-MM-DD');
                  const fileCreateDate: string = dayjs(fs.lstatSync(path.join(pathDirectory, file)).mtime).format('YYYY-MM-DD');

                  return file.includes(FotiFileNameEnum.FOTI_MALICIOUS_FILE) && dayjs(currentData).isSame(dayjs(fileCreateDate)) && { file, mtime: fs.lstatSync(path.join(pathDirectory, file)).mtime };
                })
                .filter(Boolean)
                .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())[0];
              //reading the file inside the folder
              let hasJunk: boolean = false;

              if (latestFile) {
                const newPath: string = path.join(pathDirectory, latestFile.file);
                fs.readdirSync(newPath).forEach((file) => {
                  if (path.extname(file) !== '.csv') {
                    throw new Error('file is not a csv file');
                  }
                  if (!file.includes(FotiFileNameEnum.FOTI_MALICIOUS_FILE)) {
                    throw new Error('file is not a foti malicious file');
                  }

                  fs.createReadStream(path.join(newPath, file))
                    .pipe(csv({ headers: ['ID', 'Device', 'User', 'Destination IP'], skipComments: true, skipLines: 2 }))
                    .on('data', (data: any) => {
                      try {
                        if (Object.values(data).indexOf('###Report Filters(Logic: Any)###') == 0) {
                          hasJunk = true;
                        }

                        if (!_.isEmpty(data) && !hasJunk) {
                          out.push({
                            processingDate,
                            device: data?.['Device'] ?? null,
                            user: data?.['User'] ?? null,
                            destination: data?.['Destination IP'] ?? null,
                          });
                        }

                        if (out.length === 30) {
                          FotiAnalyzerMaliciousDetails.bulkCreate(out)
                            .then(() => jobLogger.info(`loadMaliciousFilesInDirectory - bulkCreate - ${processingDate} - success`))
                            .catch((error) => {
                              jobLogger.error(`loadMaliciousFilesInDirectory - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                            });
                          out = [];
                        }
                      } catch (error) {
                        reject(error);
                      }
                    })
                    .on('error', (error: any) => {
                      reject(error);
                    })
                    .on('end', () => {
                      try {
                        if (out.length > 0) {
                          FotiAnalyzerMaliciousDetails.bulkCreate(out)
                            .then(() => jobLogger.info(`loadMaliciousFilesInDirectory - bulkCreate - ${processingDate} - success`))
                            .catch((error) => {
                              jobLogger.error(`loadMaliciousFilesInDirectory - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
                            });
                        }
                        resolve(out);
                      } catch (error) {
                        reject(error);
                      }
                    });
                });
              } else {
                throw new Error('no latest file found');
              }
            }
          } else {
            throw new Error(err.message);
          }
        } catch (error) {
          jobLogger.error(`loadMaliciousFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
          reject(error);
        }
      });
      jobLogger.info(`loadMaliciousFilesInDirectory Finish - ${processingDate}`);
    } catch (error) {
      jobLogger.error(`loadMaliciousFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
      reject(error);
    }
  });
}
