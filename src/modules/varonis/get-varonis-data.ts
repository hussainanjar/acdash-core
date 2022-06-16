import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import { getVaronisFileUserExpPassData } from './get-varonis-file-user-exp-pass-data';
import { getVaronisFileAccountDisableData } from './get-varonis-file-account-disable-data';
import { getVaronisFileDisableComputerData } from './get-varonis-file-disable-comp-data';
import { getVaronisFileServerTotalData } from './get-varonis-file-server-total-data';
import { getVaronisFileSharepointTotalKpiData } from './get-varonis-sharepoint-total-kpi-data';
import { getVaronisFileUserAndComputerData } from './get-varonis-user-and-comp-data';

async function getVaronisData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'VARONIS';
  const processingDate: Date = dayjs().toDate();

  try {
    await Promise.allSettled([
      getVaronisFileUserExpPassData(),
      getVaronisFileAccountDisableData(),
      getVaronisFileDisableComputerData(),
      getVaronisFileServerTotalData(),
      getVaronisFileSharepointTotalKpiData(),
      getVaronisFileUserAndComputerData(),
    ]);

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getVaronisData - error - ${processingDate}: ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);
  } finally {
    jobLogger.info(`getVaronisData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getVaronisData };
