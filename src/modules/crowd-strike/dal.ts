import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import { logger } from '../../utils/logger';
import { HttpError } from '../../types/http-error';
import qs from 'querystring';

export async function getCrowdLogicToken(): Promise<any> {
  try {
    logger.info(`getCrowdLogicToken Execute`);
    const httpCall: HttpCall = new HttpCall();

    const data: { [key: string]: string } = {
      // eslint-disable-next-line camelcase
      grant_type: process.env.CS_GRANT_TYPE,
      // eslint-disable-next-line camelcase
      client_id: process.env.CS_CLIENT_ID,
      // eslint-disable-next-line camelcase
      client_secret: process.env.CS_CLIENT_SECRET,
    };

    const response: HttpCallResponse = await httpCall.post({ url: process.env.CS_AUTH_ENDPOINT, headers: { 'content-type': 'application/x-www-form-urlencoded' }, data: qs.stringify(data) });

    return response.data?.access_token;
  } catch (error) {
    const errorMsg: string = `getCrowdLogicToken Error: ${JSON.stringify(error.message)}`;
    logger.error(error);
    throw new HttpError(error.response.status, 'error processing request');
  }
}
