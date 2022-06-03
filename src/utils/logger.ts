import winston from 'winston';
import fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = winston.format;

const logDir: string = 'log';
const jobDir: string = `${logDir}/job`;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
if (!fs.existsSync(jobDir)) {
  fs.mkdirSync(jobDir);
}

// general
const transport: DailyRotateFile = new DailyRotateFile({
  dirname: logDir,
  filename: `%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  json: true,
});

export const logger: winston.Logger = winston.createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    printf((info) => {
      return `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`;
    }),
  ),
  transports: [transport, new winston.transports.Console()],
});

// jobs
const transportJob: DailyRotateFile = new DailyRotateFile({
  dirname: jobDir,
  filename: `%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  json: true,
});

export const jobLogger: winston.Logger = winston.createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    printf((info) => {
      return `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`;
    }),
  ),
  transports: [transportJob, new winston.transports.Console()],
});
