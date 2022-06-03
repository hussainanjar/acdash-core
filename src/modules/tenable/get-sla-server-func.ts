import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import { saveSlaServerData } from './dal';

async function getTenableSlaServerData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'TENABLE_SLA_SERVER';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getTenableSlaServerData - Execute - ${processingDate}`);

  try {
    const httpCall: HttpCall = new HttpCall();

    jobLogger.info(`getTenableSlaServerData - API Call start - ${processingDate}`);
    const slaServerResponse: HttpCallResponse = await getSlaServer({ httpCall });
    jobLogger.info(`getTenableSlaServerData - API Call end - ${processingDate}`);

    jobLogger.info(`getTenableSlaServerData - Data Save start - ${processingDate}`);
    await saveSlaServerData({ slaServerResponse, processingDate });
    jobLogger.info(`getTenableSlaServerData - Data Save end - ${processingDate}`);

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getTenableSlaServerData - ${processingDate} - error: ${error?.response?.data ? JSON.stringify(error?.response?.data) : error.message}, ${error.stack}`;

    log.response = JSON.stringify(errorMsg);
    log.isSuccess = false;
    jobLogger.error(errorMsg);
  } finally {
    jobLogger.info(`getTenableSlaServerData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getTenableSlaServerData };

async function getSlaServer(props: { httpCall: HttpCall }): Promise<HttpCallResponse> {
  const { httpCall } = props;
  const url: string = `${process.env.TENABLE_ENDPOINT}/rest/dashboard/55/component/391`;
  const headers: { [key: string]: string } = {
    'x-apikey': `accesskey=${process.env.TENABLE_TOKEN}`,
  };
  return httpCall.get({ headers, url, timeout: 10000 });
}
