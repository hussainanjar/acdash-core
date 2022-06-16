import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService, EnvReturnType, getAppEnv } from '../../utils/dal';
import * as queryString from 'query-string';
import { abnormalMessageDataModifier } from '../../utils/modifier';
import { AbnormalThreats, AbnormalThreatsModel } from '../../models/abnormal-threats/abnormal-threats';
import { EnvType } from '../../utils/enum';
import { EmailService } from '../../utils/email';
import { HttpError } from '../../types/http-error';

async function getAbnormalData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'ABNORMAL_THREATS';
  const processingDate: Date = dayjs().toDate();

  jobLogger.info(`getAbnormalData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();

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
      filter: `receivedTime gte ${prevDate} lte ${currentDate}`,
    };

    const abnormalThreatsUrl: string = `${process.env.ABNORMAL_ENDPOINT}/v1/threats?${queryString.stringify(abnormalApiParams)}`;

    jobLogger.info(`getAbnormalData - get api data start - ${processingDate}`);
    const threatsResponse: number = await getThreatsApiData({ httpCall, processingDate, url: abnormalThreatsUrl, prevDate, currentDate });
    jobLogger.info(`getAbnormalData - get api data end - ${processingDate}`);

    log.response = `abnormalThreats records: ${threatsResponse}`;
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getAbnormalData - ${processingDate} - ${error?.response?.data ? JSON.stringify(error?.response?.data) : error.message}, ${error.stack}`;
    jobLogger.error(`getAbnormalData error resp - ${processingDate}`);

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - Abnormal Thread Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error?.response?.data ? JSON.stringify(error?.response?.data) : error.message,
        method: 'getAbnormalData',
        meta: 'Abnormal Thread and Threat Info Job',
      },
    });
  } finally {
    jobLogger.info(`getAbnormalData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getAbnormalData };

async function getThreadInfoApiData(props: { threatId: string; httpCall: HttpCall; processingDate: Date; url: string; apiRequestNumber?: number }): Promise<void> {
  let { threatId, httpCall, processingDate, url, apiRequestNumber = 0 } = props;

  apiRequestNumber === 0 && jobLogger.info(`getThreadInfoApiData - Execute - threatId: ${threatId}`);

  const headers: { [key: string]: string } = {
    Authorization: `Bearer ${process.env.ABNORMAL_TOKEN}`,
  };

  return new Promise(async (resolve, reject) => {
    jobLogger.info(`getThreadInfoApiData - API threat detail call start - ${threatId} - apiRequestNumber: ${apiRequestNumber}`);

    httpCall
      .get({ url, headers, timeout: 10000 })
      .then(async (doc: HttpCallResponse) => {
        jobLogger.info(`getThreadInfoApiData - API threat detail call end - ${threatId} - apiRequestNumber: ${apiRequestNumber}`);

        const payload: AbnormalThreatsModel[] = await abnormalMessageDataModifier(doc?.data?.messages ?? [], processingDate, httpCall, headers);

        jobLogger.info(`getThreadInfoApiData - save data - ${threatId} - apiRequestNumber: ${apiRequestNumber}`);
        await AbnormalThreats.bulkCreate(payload);

        const nextPageNum: string = doc?.data?.nextPageNumber?.toString() ?? null;

        const abnormalApiParams: { [key: string]: string } = {
          pageSize: '100',
          pageNumber: nextPageNum,
        };

        const newUrl: string = `${process.env.ABNORMAL_ENDPOINT}/v1/threats/${threatId}?${queryString.stringify(abnormalApiParams)}`;

        if (nextPageNum) {
          apiRequestNumber += 1;
          return resolve(getThreadInfoApiData({ threatId, httpCall, processingDate, url: newUrl, apiRequestNumber }));
        }

        return resolve();
      })
      .catch((error) => {
        jobLogger.error(`getThreadInfoApiData - Error - ${threatId} - apiRequestNumber: ${apiRequestNumber} - ${error.message}`);
        return reject(error);
      });
  });
}

async function getThreatsApiData(props: { httpCall: HttpCall; processingDate: Date; url: string; apiRequestNumber?: number; prevDate?: string; currentDate?: string; totalLength?: number }): Promise<number> {
  let { httpCall, processingDate, url, apiRequestNumber = 0, prevDate, currentDate, totalLength = 0 } = props;

  apiRequestNumber === 0 && jobLogger.info(`getThreatsApiData - Execute - ${processingDate}`);

  const headers: { [key: string]: string } = {
    Authorization: `Bearer ${process.env.ABNORMAL_TOKEN}`,
  };

  return new Promise(async (resolve, reject) => {
    jobLogger.info(`getThreatsApiData - API threat call start - apiRequestNumber: ${apiRequestNumber}`);

    httpCall
      .get({ url, headers, timeout: 10000 })
      .then(async (threatsResponse: HttpCallResponse) => {
        jobLogger.info(`getThreatsApiData - API threat call end - apiRequestNumber: ${apiRequestNumber}`);

        //------------ThreatInfoCall Block Start---------------
        const threats: any[] = threatsResponse.data?.threats ?? [];
        jobLogger.info(`getThreatsApiData - data length - apiRequestNumber: ${apiRequestNumber} - threats: ${threats.length}`);

        const promise: any[] = [];
        const abnormalInfoApiParams: { [key: string]: string } = {
          pageSize: '100',
          pageNumber: '1',
        };

        threats.map((value) => {
          const url: string = `${process.env.ABNORMAL_ENDPOINT}/v1/threats/${value.threatId}?${queryString.stringify(abnormalInfoApiParams)}`;
          promise.push(getThreadInfoApiData({ threatId: value.threatId, httpCall, processingDate, url }));
        });

        await Promise.all(promise);
        //------------ThreatInfoCall Block End---------------

        const nextPageNum: string = threatsResponse?.data?.nextPageNumber?.toString() ?? null;

        const abnormalApiParams: { [key: string]: string } = {
          pageSize: '100',
          pageNumber: nextPageNum,
          filter: `receivedTime gte ${prevDate} lte ${currentDate}`,
        };

        const newUrl: string = `${process.env.ABNORMAL_ENDPOINT}/v1/threats?${queryString.stringify(abnormalApiParams)}`;

        if (nextPageNum) {
          apiRequestNumber += 1;
          totalLength += threats.length;
          return resolve(getThreatsApiData({ httpCall, processingDate, url: newUrl, apiRequestNumber, prevDate, currentDate, totalLength }));
        }

        return resolve(totalLength);
      })
      .catch((error) => {
        console.log(error);
        jobLogger.error(`getThreatsApiData - Error - apiRequestNumber: ${apiRequestNumber} - ${error.message}`);
        return reject(error);
      });
  });
}
