import { Sequelize } from 'sequelize';
import { logger } from '../../utils/logger';
import { appConfig } from './envResolver';

const dbHost: any = appConfig.mysql.host;
const dbPort: any = appConfig.mysql.port;
const dbName: any = appConfig.mysql.database;
const dbUsername: any = appConfig.mysql.username;
const dbPassword: any = appConfig.mysql.password;

const maxPool: number = process.env.POOL_MAX_CONNECTION ? Number(process.env.POOL_MAX_CONNECTION) : 5;
const minPool: number = process.env.POOL_MIN_CONNECTION ? Number(process.env.POOL_MIN_CONNECTION) : 1;

export const sequelize: Sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  dialect: 'mysql',
  host: dbHost,
  port: dbPort,
  logging: false,
  timezone: 'us/pacific',
  define: {
    freezeTableName: true,
  },
  dialectOptions: {
    decimalNumbers: true,
    useUTC: false,
  },
  pool: {
    max: maxPool,
    min: minPool,
    acquire: 15000,
    idle: 15000,
  },
  retry: {
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /ESOCKETTIMEDOUT/,
      /EHOSTUNREACH/,
      /EPIPE/,
      /EAI_AGAIN/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
    ],
    max: 5,
  },
});

(async function connection() {
  try {
    await sequelize.authenticate();
    logger.info('DB - mysql connection has been established successfully.');
  } catch (error) {
    logger.error(`Unable to connect to database: ${JSON.stringify(error)}`);
  }
})();
