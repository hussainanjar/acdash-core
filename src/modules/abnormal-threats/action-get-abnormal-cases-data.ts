import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService, getAppEnv, EnvReturnType } from '../../utils/dal';
import * as queryString from 'query-string';
import { abnormalCaseDataModifier } from '../../utils/modifier';
import { AbnormalCasesModel, AbnormalCases } from '../../models/abnormal-threats/abnormal-cases';
import { EnvType } from '../../utils/enum';

async function getAbnormalCaseData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'ABNORMAL_CASES';
  const processingDate: Date = dayjs().toDate();

  jobLogger.info(`getAbnormalCaseData - Execute - ${processingDate}`);

  try {
    const httpCall: HttpCall = new HttpCall();
    const appStorageData: EnvReturnType = await getAppEnv([EnvType.SWITCH_WEEKLY_TO_DAILY_TIME_SLOT, EnvType.SWITCH_WEEKLY_TO_MONTHLY_TIME_SLOT]);

    let currentDate: string = '';
    let prevDate: string = '';

    if (Number(appStorageData.SWITCH_WEEKLY_TO_MONTHLY_TIME_SLOT)) {
      currentDate = `${dayjs().format('YYYY-MM-DD')}T23:59:59Z`;
      prevDate = `${dayjs().subtract(30, 'day').format('YYYY-MM-DD')}T00:00:00Z`;
    } else {
      currentDate = `${dayjs().day(5).format('YYYY-MM-DD')}T00:00:00Z`;
      prevDate = `${dayjs().subtract(1, 'week').day(5).format('YYYY-MM-DD')}T00:00:00Z`;
    }

    const abnormalApiParams: { [key: string]: string } = {
      pageSize: '100',
      pageNumber: '1',
      filter: `createdTime gte ${prevDate} lte ${currentDate}`,
    };

    jobLogger.info(`getAbnormalCaseData - params - ${abnormalApiParams}`);

    const abnormalCaseUrl: string = `${process.env.ABNORMAL_ENDPOINT}/v1/cases?${queryString.stringify(abnormalApiParams)}`;

    jobLogger.info(`getAbnormalCaseData - API URL - ${abnormalCaseUrl}`);

    jobLogger.info(`getAbnormalCaseData - get api data start - ${processingDate}`);
    const totalCases: AbnormalCasesModel[] = await getAbnormalCaseApiData(currentDate, prevDate, abnormalCaseUrl, httpCall, processingDate);
    jobLogger.info(`getAbnormalCaseData - get api data end - ${processingDate}`);

    await AbnormalCases.bulkCreate(totalCases);

    log.response = `abnormalCases records: ${totalCases.length}`;
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getAbnormalCaseData - ${processingDate} - ${error?.response?.data ? JSON.stringify(error?.response?.data) : error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);
  } finally {
    jobLogger.info(`getAbnormalCaseData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getAbnormalCaseData };

async function getAbnormalCaseApiData(currentDate: string, prevDate: string, url: string, httpCall: HttpCall, processingDate: Date, totalCases: any = []): Promise<AbnormalCasesModel[]> {
  totalCases.length === 0 && jobLogger.info(`getAbnormalCaseApiData - Execute - ${url}`);
  const headers: { [key: string]: string } = {
    Authorization: `Bearer ${process.env.ABNORMAL_TOKEN}`,
  };

  return new Promise((resolve, reject) => {
    httpCall
      .get({ url, headers })
      .then((doc: HttpCallResponse) => {
        const nextPageNum: string = doc?.data?.nextPageNumber?.toString() ?? null;

        const abnormalApiParams: { [key: string]: string } = {
          pageSize: '100',
          pageNumber: nextPageNum,
          filter: `createdTime gte ${prevDate} lte ${currentDate}`,
        };

        const newUrl: string = `${process.env.ABNORMAL_ENDPOINT}/v1/cases?${queryString.stringify(abnormalApiParams)}`;
        const modifiedResponse: AbnormalCasesModel[] = abnormalCaseDataModifier(doc?.data?.cases ?? [], processingDate);

        totalCases = [...totalCases, ...modifiedResponse];

        if (nextPageNum) return resolve(getAbnormalCaseApiData(currentDate, prevDate, newUrl, httpCall, processingDate, totalCases));

        return resolve(totalCases);
      })
      .catch((error) => reject(error));
  });
}
