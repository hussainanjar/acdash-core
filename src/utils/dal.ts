import { jobLogger } from './logger';
import { Op } from 'sequelize';
import { CronLog, CronLogModel } from './../models/cron-log/cron-log';
import { ApplicationStorageInstance, ApplicationStorage, ApplicationStorageModel } from '../models/common/application-storage';
import { parseDbObject } from './common';

export async function createLogService(data: CronLogModel): Promise<void> {
  try {
    jobLogger.info('createLogService - Execute');
    await CronLog.create(data);
  } catch (e) {
    const errorMsg: string = `Job Log Service - Error: ${e.message}, ${e.stack}`;
    jobLogger.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export type EnvReturnType = {
  [key: string]: string;
};

export async function getAppEnv(source: string[]): Promise<EnvReturnType> {
  const appStorageData: ApplicationStorageInstance[] = parseDbObject(
    await ApplicationStorage.findAll({
      where: {
        keyName: { [Op.or]: source },
      },
      attributes: ['keyName', 'value'],
    }),
  );

  const envList: EnvReturnType = {};

  appStorageData.map((payload: ApplicationStorageModel) => {
    envList[payload.keyName] = payload.value;
  });

  return envList;
}
