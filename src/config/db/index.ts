import { Sequelize } from 'sequelize';
import { logger } from '../../utils/logger';
import { appConfig } from './envResolver';

const dbHost: any = appConfig.mssql.host;
const dbPort: any = appConfig.mssql.port;
const dbName: any = appConfig.mssql.database;
const dbUsername: any = appConfig.mssql.username;
const dbPassword: any = appConfig.mssql.password;

export const sequelize: Sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  dialect: 'mssql',
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
});

(async function connection() {
  try {
    await sequelize.authenticate();
    logger.info('DB - mssql connection has been established successfully.');
  } catch (error) {
    logger.error(`Unable to connect to database: ${JSON.stringify(error)}`);
  }
})();
