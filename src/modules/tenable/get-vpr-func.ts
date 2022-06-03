import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import { saveVprData } from './dal';

async function getTenableVprData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'TENABLE_VPR';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getTenableVprData - Execute - ${processingDate}`);

  try {
    const httpCall: HttpCall = new HttpCall();

    jobLogger.info(`getTenableVprData - API Call start - ${processingDate}`);
    const vprResponse: HttpCallResponse = await getVpr({ httpCall });
    jobLogger.info(`getTenableVprData - API Call end - ${processingDate}`);

    jobLogger.info(`getTenableVprData - Data Save start - ${processingDate}`);
    await saveVprData({ vprResponse, processingDate });
    jobLogger.info(`getTenableVprData - Data Save end - ${processingDate}`);

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getTenableVprData - ${processingDate} - error: ${JSON.stringify(error?.response?.data) ?? error.message}, ${error.stack}`;

    log.response = JSON.stringify(errorMsg);
    log.isSuccess = false;
    jobLogger.error(errorMsg);
  } finally {
    jobLogger.info(`getTenableVprData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getTenableVprData };

async function getVpr(props: { httpCall: HttpCall }): Promise<HttpCallResponse> {
  const { httpCall } = props;
  const url: string = `${process.env.TENABLE_ENDPOINT}/rest/dashboard/29?expand=dashboardComponents`;
  const headers: { [key: string]: string } = {
    'x-apikey': `accesskey=${process.env.TENABLE_TOKEN}`,
  };
  return httpCall.get({ headers, url, timeout: 10000 });
}
