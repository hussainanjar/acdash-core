import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import { logger } from '../../utils/logger';
import { HttpError } from '../../types/http-error';

export async function getAlertLogicAccessToken(): Promise<any> {
  try {
    logger.info(`getAlertLogicAccessToken Execute`);
    const httpCall: HttpCall = new HttpCall();

    const response: HttpCallResponse = await httpCall.post({
      url: process.env.AL_AUTH_URL,
      options: {
        auth: {
          username: process.env.AL_AUTH_USERNAME,
          password: process.env.AL_AUTH_PASSWORD,
        },
      },
    });

    return response.data;
  } catch (error) {
    const errorMsg: string = `getAlertLogicAccessToken Error: ${JSON.stringify(error.message)}`;
    logger.error(errorMsg);
    throw new HttpError(error.response.status, 'error processing request');
  }
}
