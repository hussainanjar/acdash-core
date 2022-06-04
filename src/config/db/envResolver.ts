import 'dotenv/config';

export type ConfigMapType = {
  [name: string]: () => IConfig;
};

export interface IConfig {
  name: string;
  port: number;
  isLocal?: boolean;
  httpTimeout: number;
  isTesting?: boolean;
  isProduction?: boolean;
  isDevelopment?: boolean;
  mysql: {
    username?: string;
    password?: string;
    database?: string;
    host?: string;
    port?: number;
    dialect?: string;
    [key: string]: string | number;
  };
  encryptionKey: string;
}

const nodeEnv: string = process.env.NODE_ENV || 'development';
export const development: any = (): IConfig => {
  return {
    isLocal: false,
    isTesting: false,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    name: process.env.APP_NAME || 'ac_transit_api',
    port: parseInt(process.env.PORT || '3000') || 0,
    httpTimeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT) || 10000,
    mysql: {
      username: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
      database: process.env.DATABASE,
      host: process.env.DBHOST,
      port: parseInt(process.env.DBPORT || '3306') || 0,
      dialect: 'mysql',
    },
    encryptionKey: process.env.ENCRYPTION_KEY,
  };
};

export const test: any = (): IConfig => {
  return {
    isLocal: false,
    isTesting: true,
    isDevelopment: false,
    isProduction: false,
    name: process.env.APP_NAME || 'ac_transit_api',
    port: parseInt(process.env.PORT || '3000') || 0,
    httpTimeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT) || 10000,
    mysql: {
      username: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
      database: process.env.DATABASE,
      host: process.env.DBHOST,
      port: parseInt(process.env.DBPORT || '3306') || 0,
      dialect: process.env.DIALECT,
    },
    encryptionKey: process.env.ENCRYPTION_KEY,
  };
};

export const production: any = (): IConfig => {
  return {
    isLocal: false,
    isTesting: false,
    isDevelopment: false,
    isProduction: true,
    name: process.env.APP_NAME || 'ac_transit_api',
    port: parseInt(process.env.PORT || '3000') || 0,
    httpTimeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT) || 10000,
    mysql: {
      username: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
      database: process.env.DATABASE,
      host: process.env.DBHOST,
      port: parseInt(process.env.DBPORT || '3306') || 0,
      dialect: process.env.DIALECT,
    },
    encryptionKey: process.env.ENCRYPTION_KEY,
  };
};

const configMap: ConfigMapType = {
  test,
  development,
  production,
};

export const appConfig: IConfig = configMap[nodeEnv]();
