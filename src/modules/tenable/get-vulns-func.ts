import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import { saveVulnsData } from './dal';

async function getTenablePublicAndSystemData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'TENABLE_VULNS';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getTenablePublicAndSystemData - Execute - ${processingDate}`);

  try {
    const httpCall: HttpCall = new HttpCall();

    jobLogger.info(`getTenablePublicAndSystemData - API Call start - ${processingDate}`);
    const [systemResponse, publicResponse]: HttpCallResponse[] = await Promise.all([getSystemVulnsData({ httpCall }), getPublicServerData({ httpCall })]);
    jobLogger.info(`getTenablePublicAndSystemData - API Call end - ${processingDate}`);

    jobLogger.info(`getTenablePublicAndSystemData -Data Save start - ${processingDate}`);
    await saveVulnsData({ systemResponse, publicResponse, processingDate });
    jobLogger.info(`getTenablePublicAndSystemData -Data Save end - ${processingDate}`);

    log.response = 'success';
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getTenablePublicAndSystemData - ${processingDate} - error: ${JSON.stringify(error?.response?.data) ?? error.message}, ${error.stack}`;

    log.response = JSON.stringify(errorMsg);
    log.isSuccess = false;
    jobLogger.error(errorMsg);
  } finally {
    jobLogger.info(`getTenablePublicAndSystemData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getTenablePublicAndSystemData };

async function getSystemVulnsData(props: { httpCall: HttpCall }): Promise<HttpCallResponse> {
  const { httpCall } = props;

  const data: any = {
    query: {
      name: '',
      description: '',
      context: '',
      status: -1,
      createdTime: 0,
      modifiedTime: 0,
      groups: [],
      type: 'vuln',
      tool: 'listvuln',
      sourceType: 'cumulative',
      startOffset: 0,
      endOffset: 50,
      filters: [
        {
          id: 'vprScore',
          filterName: 'vprScore',
          operator: '=',
          type: 'vuln',
          isPredefined: true,
          value: '8-10',
        },
      ],
      vulnTool: 'listvuln',
    },
    sourceType: 'cumulative',
    columns: [],
    type: 'vuln',
  };

  const url: string = `${process.env.TENABLE_ENDPOINT}/rest/analysis`;

  const headers: { [key: string]: string } = {
    'x-apikey': `accesskey=${process.env.TENABLE_TOKEN}`,
  };

  return httpCall.post({ headers, url, data, timeout: 10000 });
}

async function getPublicServerData(props: { httpCall: HttpCall }): Promise<HttpCallResponse> {
  const { httpCall } = props;

  const data: any = {
    query: {
      name: '',
      description: '',
      context: '',
      status: -1,
      createdTime: 0,
      modifiedTime: 0,
      groups: [],
      type: 'vuln',
      tool: 'listvuln',
      sourceType: 'cumulative',
      startOffset: 0,
      endOffset: 50,
      filters: [
        {
          filterName: 'asset',
          operator: '=',
          value: {
            id: '315',
            name: 'ACT - Public Facing Servers',
          },
        },
        {
          id: 'vprScore',
          filterName: 'vprScore',
          operator: '=',
          type: 'vuln',
          isPredefined: true,
          value: '8-10',
        },
      ],
      vulnTool: 'listvuln',
    },
    sourceType: 'cumulative',
    columns: [],
    type: 'vuln',
  };

  const url: string = `${process.env.TENABLE_ENDPOINT}/rest/analysis`;
  const headers: { [key: string]: string } = {
    'x-apikey': `accesskey=${process.env.TENABLE_TOKEN}`,
  };

  return httpCall.post({ headers, url, data, timeout: 10000 });
}
