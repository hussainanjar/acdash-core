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
      grant_type: 'client_credentials',
      // eslint-disable-next-line camelcase
      client_id: '7aac8f2c91a545489d6c40c699a17cf0',
      // eslint-disable-next-line camelcase
      client_secret: 'gcwztFJho16HCSNr0fu5v7d3IjpRXAL9ek28nQG4',
    };

    const response: HttpCallResponse = await httpCall.post({ url: 'https://api.us-2.crowdstrike.com/oauth2/token', headers: { 'content-type': 'application/x-www-form-urlencoded' }, data: qs.stringify(data) });

    return response.data?.access_token;
  } catch (error) {
    const errorMsg: string = `getCrowdLogicToken Error: ${JSON.stringify(error.message)}`;
    logger.error(error);
    throw new HttpError(error.response.status, 'error processing request');
  }
}
