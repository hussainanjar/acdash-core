import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import { getTenablePublicAndSystemData } from './get-vulns-func';
import { getTenableSlaWorkStationData } from './get-sla-workstation-func';
import { getTenableSlaServerData } from './get-sla-server-func';
import { getTenableVprData } from './get-vpr-func';

async function getTenableData(): Promise<void> {
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getTenableData - Execute - ${processingDate}`);

  try {
    jobLogger.info('getTenableData - Promise Call Start');
    await Promise.allSettled([getTenablePublicAndSystemData(), getTenableSlaWorkStationData(), getTenableSlaServerData(), getTenableVprData()]);
    jobLogger.info('getTenableData - Promise Call End');
  } catch (error) {
    const errorMsg: string = `getTenableData - ${processingDate} - error: ${error.message}, ${error.stack}`;
    jobLogger.error(errorMsg);
  }
}

export { getTenableData };
