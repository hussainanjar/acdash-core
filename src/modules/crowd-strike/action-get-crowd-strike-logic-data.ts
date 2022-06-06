import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import { getCrowdLogicToken } from './dal';
import _ from 'lodash';
import { CrowdStrikeModel, CrowdStrike } from '../../models/crowd-strike/crowd-strike';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import { EmailService } from '../../utils/email';
import { CrowdStrikeResponseEnum } from '../../utils/enum';

async function getCrowdStrikeData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'CROWD_STRIKE';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getCrowdStrikeData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();
  try {
    const httpCall: HttpCall = new HttpCall();
    const token: string = await getCrowdLogicToken();

    const headers: { [key: string]: string } = {
      Authorization: `Bearer ${token}`,
    };

    const [systemResponse, incidentResponse, detectResponse]: any = await Promise.allSettled([
      httpCall.get({ url: process.env.CS_SYSTEM_ENDPOINT, headers }),
      httpCall.get({ url: process.env.CS_INCIDENT_ENDPOINT, headers }),
      httpCall.get({ url: process.env.CS_DETECT_ENDPOINT, headers }),
    ]);

    const response: any = {
      systemResponse: systemResponse.status === 'rejected' ? systemResponse.reason.message : 'success',
      incidentResponse: incidentResponse.status === 'rejected' ? incidentResponse.reason.message : 'success',
      detectResponse: detectResponse.status === 'rejected' ? detectResponse.reason.message : 'success',
    };

    const payload: CrowdStrikeModel = {
      processingDate,
      protectedSystems: systemResponse?.value?.data?.meta?.pagination?.total ?? null,
      incidents: incidentResponse?.value?.data?.meta?.pagination?.total ?? null,
      detects: detectResponse?.value?.data?.meta?.pagination?.total ?? null,
    } as CrowdStrikeModel;

    await CrowdStrike.create(payload);

    for (const key of response) {
      let currResponse: any = null;
      let currSubject: string = '';
      if (response[key] === 'rejected') {
        switch (key) {
          case CrowdStrikeResponseEnum.SYSTEM_RESPONSE:
            currSubject = 'Error - Crowd Strike - System';
            currResponse = systemResponse;
            break;

          case CrowdStrikeResponseEnum.INCIDENT_RESPONSE:
            currSubject = 'Error - Crowd Strike - Incident';
            currResponse = incidentResponse;
            break;

          case CrowdStrikeResponseEnum.DETECT_RESPONSE:
            currSubject = 'Error - Crowd Strike - Detect';
            currResponse = detectResponse;
            break;
        }

        await emailService.sendEmail({
          template: 'job-error',
          subject: 'Error - Abnormal Cases',
          nameFrom: process.env.EMAIL_SENDER_NAME,
          from: process.env.EMAIL_SENDER_ADDRESS,
          to: process.env.EMAIL_RECEIVER_ADDRESS,
          emailDetail: {
            processingDate,
            errorCode: currResponse.reason.message,
            errorMsg: currResponse.reason.message,
            method: 'getCrowdStrikeData',
          },
        });
      }
    }

    log.response = JSON.stringify(response);
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getCrowdStrikeData - ${processingDate} - error: ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);
  } finally {
    jobLogger.info(`getCrowdStrikeData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getCrowdStrikeData };
