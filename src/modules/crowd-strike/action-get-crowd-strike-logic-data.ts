import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import { getCrowdLogicToken } from './dal';
import _ from 'lodash';
import { CrowdStrikeModel, CrowdStrike } from '../../models/crowd-strike/crowd-strike';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';

async function getCrowdStrikeData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'CROWD_STRIKE';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getCrowdStrikeData - Execute - ${processingDate}`);

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

    const response: string = JSON.stringify({
      systemResponse: systemResponse.status === 'rejected' ? systemResponse.reason.message : 'success',
      incidentResponse: incidentResponse.status === 'rejected' ? incidentResponse.reason.message : 'success',
      detectResponse: detectResponse.status === 'rejected' ? detectResponse.reason.message : 'success',
    });

    const payload: CrowdStrikeModel = {
      processingDate,
      protectedSystems: systemResponse?.value?.data?.meta?.pagination?.total ?? null,
      incidents: incidentResponse?.value?.data?.meta?.pagination?.total ?? null,
      detects: detectResponse?.value?.data?.meta?.pagination?.total ?? null,
    } as CrowdStrikeModel;

    await CrowdStrike.create(payload);

    log.response = response;
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
