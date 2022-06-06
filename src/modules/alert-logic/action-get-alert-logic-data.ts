import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import { getAlertLogicAccessToken } from './dal';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import { AlertLogicModel, AlertLogic } from '../../models/alert-logic/alert-logic';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService, EnvReturnType, getAppEnv } from '../../utils/dal';
import { EnvType } from '../../utils/enum';
import { EmailService } from '../../utils/email';

async function getAlertLogicData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'ALERT_LOGIC';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getAlertLogicData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();
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

    const tokenData: any = await getAlertLogicAccessToken();
    const accessToken: string = tokenData['authentication']['token'];

    const headers: { [key: string]: string } = {
      'x-aims-auth-token': accessToken,
    };

    const params: { [key: string]: string } = {
      // eslint-disable-next-line camelcase
      start_time: prevDate,
      // eslint-disable-next-line camelcase
      end_time: currentDate,
    };

    const response: HttpCallResponse = await httpCall.get({ url: process.env.AL_INCIDENT_URL, headers, options: { params } });
    jobLogger.info(`getAlertLogicData - Fetch API Data - ${processingDate}`);

    const alertLogicDataToInsert: AlertLogicModel[] = response.data.map((data: any) => {
      return {
        processingDate,
        accountId: data.accountId,
        assetDeploymentType: data.asset_deployment_type,
        assetHostName: data.asset_host_name,
        associatedEventCount: data.associatedEventCount,
        associatedLogCount: data.associatedLogCount,
        autoClosed: data.autoClosed,
        autoClosedBy: data.autoClosed_by,
        autoClosedUserName: data.autoClosed_userName,
        createTime: data.createTime,
        createTimeStr: data.createTime ? dayjs(data.createTime).toDate() : null,
        customerFeedbackNoteCount: data.customer_feedback_note_count,
        customerStatusReasonCode: data.customer_status?.reason_code,
        customerStatus: data.customer_status?.status,
        customerStatusChangeTime: data.customer_status?.status_change_time ? dayjs(data.customer_status?.status_change_time).toDate() : null,
        customerStatusUserId: data.customer_status?.user_id,
        customerStatusUserName: data.customer_status?.user_name,
        hasAssets: data.has_assets,
        humanFriendlyId: data.humanFriendlyId,
        incidentId: data.incidentId,
        incidentThreatRating: data.incident?.threatRating,
        incidentAtttackClassId: data.incident?.attackClassId,
        incidentAtttackClassIdStr: data.incident?.attackClassId_str,
        incidentEscalated: data.incident?.escalated,
        incidentEscalationTime: data.incident?.escalationTime ? dayjs(data.incident?.escalationTime).toDate() : null,
        noteCount: data.note_count,
        snoozeStatusSnoozed: data.snooze_status_snoozed,
        updateTime: data.updateTime,
        updateTimeStr: data.updateTime ? dayjs(data.updateTime).toDate() : null,
      };
    });

    await AlertLogic.bulkCreate(alertLogicDataToInsert);

    log.response = `alertLogic records: ${alertLogicDataToInsert.length}`;
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getAlertLogicData - ${processingDate} - error: ${error.message}, ${error.stack}`;
    log.isSuccess = false;
    log.response = errorMsg;

    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - Alert Logic Data',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorCode: error.status || error.code,
        errorMsg: error?.response?.data ? JSON.stringify(error?.response?.data) : error.message,
        method: 'getAlertLogicData',
      },
    });
  } finally {
    jobLogger.info(`getAlertLogicData - Execute Final Block - ${processingDate}`);

    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getAlertLogicData };
