import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import { saveSlaWorkstationData } from './dal';
import { EmailService } from '../../utils/email';

async function getTenableSlaWorkStationData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'TENABLE_SLA_WORKSTATION';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getTenableSlaWorkStationData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();
  try {
    const httpCall: HttpCall = new HttpCall();

    jobLogger.info(`getTenableSlaWorkStationData - API Call start - ${processingDate}`);
    const slaWorkstationResponse: HttpCallResponse = await getSlaWorkstation({ httpCall });
    jobLogger.info(`getTenableSlaWorkStationData - API Call end - ${processingDate}`);

    jobLogger.info(`getTenableSlaWorkStationData - Data Save start - ${processingDate}`);
    await saveSlaWorkstationData({ slaWorkstationResponse, processingDate });
    jobLogger.info(`getTenableSlaWorkStationData - Data Save end - ${processingDate}`);

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getTenableSlaWorkStationData - ${processingDate} - error: ${error?.response?.data ? JSON.stringify(error?.response?.data) : error.message}, ${error.stack}`;

    log.response = JSON.stringify(errorMsg);
    log.isSuccess = false;
    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - Tenable Sla WorkStation Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error?.response?.data ? JSON.stringify(error?.response?.data) : error.message,
        method: 'getTenableSlaWorkStationData',
        meta: 'Tenable Sla WorkStation Data ',
      },
    });
  } finally {
    jobLogger.info(`getTenableSlaWorkStationData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getTenableSlaWorkStationData };

async function getSlaWorkstation(props: { httpCall: HttpCall }): Promise<HttpCallResponse> {
  const { httpCall } = props;
  const url: string = `${process.env.TENABLE_ENDPOINT}/rest/dashboard/57/component/419`;
  const headers: { [key: string]: string } = {
    'x-apikey': `accesskey=${process.env.TENABLE_TOKEN}`,
  };
  return httpCall.get({ headers, url, timeout: 10000 });
}
