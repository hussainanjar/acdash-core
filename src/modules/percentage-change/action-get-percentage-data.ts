import dayjs, { Dayjs } from 'dayjs';
import { jobLogger } from '../../utils/logger';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService, EnvReturnType, getAppEnv } from '../../utils/dal';
import { PercentageChange } from '../../models/percentage-change/percentage-change';
import { EnvType } from '../../utils/enum';
import {
  getAlertLogicPercentageData,
  getCrowdStrikePercentageData,
  getKeyFactorPercentageData,
  getFotiBlockConnectionPercentageData,
  getFotiMaliciousPercentageData,
  getOkaPercentageData,
  getTenableVulnsPercentageData,
  getVaronisExpiredPasswordPercentageData,
  getVaronisAccountDisablePercentageData,
  getVaronisUserAndComputerPercentageData,
  getVaronisFileServerPercentageData,
  getAbnormalThreatPercentageData,
  getAbnormalCasePercentageData,
} from './percentage-data-func';

async function getPercentageChangeData(startingDate?: Dayjs, endingDate?: Dayjs): Promise<void> {
  startingDate = startingDate ?? dayjs();
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'PERCENTAGE_CHANGE';
  const processingDate: Date = dayjs(startingDate).toDate();
  jobLogger.info(`getPercentageChangeData - Execute - ${processingDate}`);

  try {
    const appStorageData: EnvReturnType = await getAppEnv([EnvType.SWITCH_WEEKLY_TO_DAILY_TIME_SLOT]);

    let startDate: any = '';
    let firstMiddleDate: any = '';
    let secondMiddleDate: any = '';
    let endDate: any = '';

    if (Number(appStorageData.SWITCH_WEEKLY_TO_DAILY_TIME_SLOT)) {
      startDate = `${dayjs(startingDate).subtract(1, 'day').format('YYYY-MM-DD')}T00:00:00-07:00`;
      firstMiddleDate = `${dayjs(startingDate).subtract(1, 'day').format('YYYY-MM-DD')}T23:59:59-07:00`;
      secondMiddleDate = `${dayjs(startingDate).format('YYYY-MM-DD')}T00:00:00-07:00`;
      endDate = `${dayjs(startingDate).format('YYYY-MM-DD')}T23:59:59-07:00`;
    } else {
      startDate = `${dayjs().subtract(2, 'week').day(5).format('YYYY-MM-DD')}T00:00:00Z`;
      firstMiddleDate = `${dayjs().subtract(1, 'week').day(5).format('YYYY-MM-DD')}T00:00:00Z`;
      secondMiddleDate = `${dayjs().subtract(1, 'week').day(5).format('YYYY-MM-DD')}T00:00:01Z`;
      endDate = `${dayjs().day(5).format('YYYY-MM-DD')}T00:00:00Z`;
    }

    const [
      alertLogicResponse,
      crowdStrikeResponse,
      keyFactorResponse,
      FotiBlockConnectionResponse,
      FotiMaliciousResponse,
      oktaResponse,
      tenableVulnsResponse,
      varonisExpPassResponse,
      varonisAccDisableResponse,
      varonisUserComputerRespone,
      varonisFileResponse,
      abnormalThreatResponse,
      abnormalCaseResponse,
    ]: any = await Promise.all([
      getAlertLogicPercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getCrowdStrikePercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getKeyFactorPercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getFotiBlockConnectionPercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getFotiMaliciousPercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getOkaPercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getTenableVulnsPercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getVaronisExpiredPasswordPercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getVaronisAccountDisablePercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getVaronisUserAndComputerPercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getVaronisFileServerPercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getAbnormalThreatPercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
      getAbnormalCasePercentageData({ startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate }),
    ]);

    await PercentageChange.bulkCreate([
      ...alertLogicResponse,
      ...crowdStrikeResponse,
      ...keyFactorResponse,
      ...FotiBlockConnectionResponse,
      ...FotiMaliciousResponse,
      ...oktaResponse,
      ...tenableVulnsResponse,
      ...varonisExpPassResponse,
      ...varonisAccDisableResponse,
      ...varonisUserComputerRespone,
      ...varonisFileResponse,
      ...abnormalThreatResponse,
      ...abnormalCaseResponse,
    ]);

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getPercentageChangeData - ${processingDate} - error: ${error.message}, ${error.stack}`;
    log.isSuccess = false;
    log.response = errorMsg;

    jobLogger.error(errorMsg);
  } finally {
    jobLogger.info(`getPercentageChangeData - Execute Final Block - ${processingDate}`);

    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getPercentageChangeData };
