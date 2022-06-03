import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService, EnvReturnType, getAppEnv } from '../../utils/dal';
import * as queryString from 'query-string';
import { OktaOtherDetail, OktaOtherDetailModel } from '../../models/okta/okta-other-detail';
import { EnvType } from '../../utils/enum';

async function getOktaOtherData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'OKTA';
  const processingDate: Date = dayjs().toDate();

  jobLogger.info(`getOktaOtherData - Execute - ${processingDate}`);

  try {
    const httpCall: HttpCall = new HttpCall();

    const appStorageData: EnvReturnType = await getAppEnv([EnvType.SWITCH_WEEKLY_TO_DAILY_TIME_SLOT]);

    let currentDate: string = '';
    let prevDate: string = '';

    if (Number(appStorageData.SWITCH_WEEKLY_TO_DAILY_TIME_SLOT)) {
      currentDate = `${dayjs().subtract(1, 'day').format('YYYY-MM-DD')}T23:59:59Z`;
      prevDate = `${dayjs().subtract(1, 'day').format('YYYY-MM-DD')}T00:00:00Z`;
    } else {
      currentDate = `${dayjs().day(5).format('YYYY-MM-DD')}T00:00:00Z`;
      prevDate = `${dayjs().subtract(1, 'week').day(5).format('YYYY-MM-DD')}T00:00:00Z`;
    }

    const oktaOutsideUsaParams: { [key: string]: string } = {
      // eslint-disable-next-line camelcase
      since: prevDate,
      // eslint-disable-next-line camelcase
      until: currentDate,
      limit: '500',
      sortOrder: 'DESCENDING',
      filter: 'outcome.reason eq "NETWORK_ZONE_BLACKLIST"',
    };

    const oktaSuspiciousParams: { [key: string]: string } = {
      // eslint-disable-next-line camelcase
      since: prevDate,
      // eslint-disable-next-line camelcase
      until: currentDate,
      limit: '500',
      sortOrder: 'DESCENDING',
      filter: 'eventType eq "user.account.report_suspicious_activity_by_enduser"',
    };

    const oktaLockedParams: { [key: string]: string } = {
      // eslint-disable-next-line camelcase
      since: prevDate,
      // eslint-disable-next-line camelcase
      until: currentDate,
      limit: '500',
      sortOrder: 'DESCENDING',
      filter: 'outcome.reason eq "NETWORK_ZONE_BLACKLIST"',
    };

    const oktaOutsideUrl: string = `${process.env.OKTA_ENDPOINT}?${queryString.stringify(oktaOutsideUsaParams)}`;
    const oktaSuspiciousUrl: string = `${process.env.OKTA_ENDPOINT}?${queryString.stringify(oktaSuspiciousParams)}`;
    const oktaLockedUrl: string = `${process.env.OKTA_ENDPOINT}?${queryString.stringify(oktaLockedParams)}`;

    const [outsideUsaTotal, suspiciousRecordTotal, lockedRecordTotal]: number[] = await Promise.all([
      getOutsideUsaData(oktaOutsideUrl, httpCall, processingDate),
      getSuspiciousData(oktaSuspiciousUrl, httpCall, processingDate),
      getLockedData(oktaLockedUrl, httpCall, processingDate),
    ]);

    await OktaOtherDetail.create({ processingDate, outsideUsaTotal, suspiciousRecordTotal, lockedRecordTotal } as OktaOtherDetailModel);

    log.response = `outsideUsaTotal: ${outsideUsaTotal} , suspiciousRecordTotal: ${suspiciousRecordTotal}, lockedRecordTotal: ${lockedRecordTotal}`;
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getOktaOtherData - ${processingDate} - ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);
  } finally {
    jobLogger.info(`getOktaOtherData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

async function getOutsideUsaData(url: string, httpCall: HttpCall, processingDate: Date, totalRecords: number = 0): Promise<number> {
  totalRecords === 0 && jobLogger.info(`getOutsideUsaData - Execute -${processingDate}`);
  const headers: { [key: string]: string } = {
    Authorization: `SSWS ${process.env.OKTA_API_TOKEN}`,
  };

  return new Promise((resolve, reject) => {
    httpCall
      .get({ url, headers })
      .then((doc: HttpCallResponse) => {
        const newUrl: string =
          doc.headers['link']
            .split(',')
            .map((link) => link.trim())
            .find((link) => link.includes('next'))
            ?.match(/<(.*?)>/)[1] ?? null;

        totalRecords += doc.data.length;

        if (newUrl) return resolve(getOutsideUsaData(newUrl, httpCall, processingDate, totalRecords));

        return resolve(totalRecords);
      })
      .catch((error) => reject(error.message));
  });
}

async function getSuspiciousData(url: string, httpCall: HttpCall, processingDate: Date, totalRecords: number = 0): Promise<number> {
  totalRecords === 0 && jobLogger.info(`getSuspiciousData - Execute - ${processingDate}`);
  const headers: { [key: string]: string } = {
    Authorization: `SSWS ${process.env.OKTA_API_TOKEN}`,
  };

  return new Promise((resolve, reject) => {
    httpCall
      .get({ url, headers })
      .then((doc: HttpCallResponse) => {
        const newUrl: string =
          doc.headers['link']
            .split(',')
            .map((link) => link.trim())
            .find((link) => link.includes('next'))
            ?.match(/<(.*?)>/)[1] ?? null;

        totalRecords += doc.data.length;

        if (newUrl) return resolve(getSuspiciousData(newUrl, httpCall, processingDate, totalRecords));

        return resolve(totalRecords);
      })
      .catch((error) => reject(error.message));
  });
}

async function getLockedData(url: string, httpCall: HttpCall, processingDate: Date, totalRecords: number = 0): Promise<number> {
  totalRecords === 0 && jobLogger.info(`getLockedData - Execute - ${processingDate}`);
  const headers: { [key: string]: string } = {
    Authorization: `SSWS ${process.env.OKTA_API_TOKEN}`,
  };

  return new Promise((resolve, reject) => {
    httpCall
      .get({ url, headers })
      .then((doc: HttpCallResponse) => {
        const newUrl: string =
          doc.headers['link']
            .split(',')
            .map((link) => link.trim())
            .find((link) => link.includes('next'))
            ?.match(/<(.*?)>/)[1] ?? null;

        totalRecords += doc.data.length;

        if (newUrl) return resolve(getLockedData(newUrl, httpCall, processingDate, totalRecords));

        return resolve(totalRecords);
      })
      .catch((error) => reject(error.message));
  });
}
export { getOktaOtherData };
