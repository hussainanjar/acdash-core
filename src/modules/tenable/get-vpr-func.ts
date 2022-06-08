import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import { saveVprData } from './dal';
import { EmailService } from '../../utils/email';

async function getTenableVprData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'TENABLE_VPR';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getTenableVprData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();
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

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - Tenable Vpr Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error?.response?.data ? JSON.stringify(error?.response?.data) : error.message,
        method: 'getTenableVprData',
        meta: 'Tenable Vpr Data ',
      },
    });
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
