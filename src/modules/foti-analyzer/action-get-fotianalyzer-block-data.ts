import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { FotiAnalyzer, FotiAnalyzerModel } from '../../models/foti-analyzer/foti-analyzer';
import { FotiFileNameEnum } from '../../utils/enum';
import { EmailService } from '../../utils/email';

async function getFotiAnalyzerBlockData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'FOTI_ANALYZER_BLOCK';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getFotiAnalyzerBlockData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();

  try {
    const payload: FotiAnalyzerModel[] = await loadBlockFilesInDirectory({ pathDirectory: process.env.FOTI_ANALIZER_DIRECTORY_PATH, processingDate, serviceType });

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getFotiAnalyzerBlockData - ${processingDate} - error: ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - FotiAnalyzer Block Data Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error.message,
        method: 'getFotiAnalyzerBlockData',
        meta: 'Foti Analyzer Block Data',
      },
    });
  } finally {
    jobLogger.info(`getFotiAnalyzerBlockData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;
    await createLogService(log);
  }
}

export { getFotiAnalyzerBlockData };

async function loadBlockFilesInDirectory(props: { pathDirectory: string; processingDate?: Date; serviceType: string }) {
  return new Promise<any>((resolve, reject) => {
    const log: CronLogModel = {} as CronLogModel;
    const { pathDirectory, processingDate = null, serviceType } = props;

    try {
      jobLogger.info(`loadBlockFilesInDirectory Execute - ${processingDate}`);

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
                .map((file) => file.includes(FotiFileNameEnum.FOTI_BLOCK_FILE) && { file, mtime: fs.lstatSync(path.join(pathDirectory, file)).mtime })
                .filter(Boolean)
                .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())[0];

              //reading the file inside the folder

              if (latestFile) {
                const newPath: string = path.join(pathDirectory, latestFile.file);
                fs.readdirSync(newPath).forEach((file) => {
                  if (path.extname(file) !== '.csv') {
                    throw new Error('File is not a csv file');
                  }
                  if (!file.includes(FotiFileNameEnum.FOTI_BLOCK_FILE)) {
                    throw new Error('File is not a foti block file');
                  }

                  // reading the file
                  fs.createReadStream(path.join(newPath, file))
                    .pipe(csv({ headers: ['ID', 'Threat', 'Category', 'Threat Level', 'Threat Score', 'Incidents'], skipComments: true, skipLines: 2 }))
                    .on('data', (data: any) => {
                      try {
                        if (!_.isEmpty(data))
                          out.push({
                            processingDate,
                            threatId: Number(data?.['ID']?.trim()) ?? null,
                            threat: data?.['Threat'] ?? null,
                            category: data?.['Category'] ?? null,
                            threatLevel: data?.['Threat Level'] ?? null,
                            threatScore: Number(data?.['Threat Score']?.trim().replace(/,/g, '')) ?? null,
                            incidents: Number(data?.['Incidents']?.trim().replace(/,/g, '')) ?? null,
                          });

                        if (out.length === 30) {
                          FotiAnalyzer.bulkCreate(out)
                            .then(() => jobLogger.info(`loadBlockFilesInDirectory - bulkCreate - ${processingDate} - success`))
                            .catch((error) => {
                              jobLogger.error(`loadBlockFilesInDirectory - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
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
                          FotiAnalyzer.bulkCreate(out)
                            .then(() => jobLogger.info(`loadBlockFilesInDirectory - bulkCreate - ${processingDate} - success`))
                            .catch((error) => {
                              jobLogger.error(`loadBlockFilesInDirectory - bulkCreate Error - ${processingDate} - ${error.message}, ${error.stack}`);
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
          jobLogger.error(`loadBlockFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
          reject(error);
        }
      });
      jobLogger.info(`loadBlockFilesInDirectory Finish - ${processingDate}`);
    } catch (error) {
      jobLogger.error(`loadBlockFilesInDirectory Error - ${error.message} - ${error.stack} - ${processingDate}`);
      reject(error);
    }
  });
}
