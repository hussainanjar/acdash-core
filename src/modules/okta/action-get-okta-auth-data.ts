import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import * as queryString from 'query-string';
import { OktaAuthDetail, OktaAuthDetailModel } from '../../models/okta/okta-auth-detail';

async function getOktaAuthData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'OKTA';
  const processingDate: Date = dayjs().toDate();

  jobLogger.info(`getOktaAuthData - Execute - ${processingDate}`);

  try {
    const httpCall: HttpCall = new HttpCall();
    const oktaAuthParams: { [key: string]: string } = {
      // eslint-disable-next-line camelcase
      since: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      // eslint-disable-next-line camelcase
      until: dayjs().format('YYYY-MM-DD'),
      limit: '500',
      sortOrder: 'DESCENDING',
      filter: 'eventType sw "user.authentication.auth"',
    };

    const oktaAuthUrl: string = `${process.env.OKTA_ENDPOINT}?${queryString.stringify(oktaAuthParams)}`;

    jobLogger.info(`getOktaAuthData - get api data start - ${processingDate}`);
    const authActivityTotal: number = await getAuthApiData(oktaAuthUrl, httpCall, processingDate);
    jobLogger.info(`getOktaAuthData - get api data end - ${processingDate}`);

    await OktaAuthDetail.create({ processingDate, authActivityTotal } as OktaAuthDetailModel);

    log.response = `authActivityTotal: ${authActivityTotal}`;
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getOktaAuthData - ${processingDate} - ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);
  } finally {
    jobLogger.info(`getOktaAuthData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getOktaAuthData };

async function getAuthApiData(url: string, httpCall: HttpCall, processingDate: Date, totalRecords: number = 0): Promise<number> {
  totalRecords === 0 && jobLogger.info(`getAuthApiData - Execute - ${processingDate}`);
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

        if (newUrl) return resolve(getAuthApiData(newUrl, httpCall, processingDate, totalRecords));

        return resolve(totalRecords);
      })
      .catch((error) => reject(error));
  });
}
