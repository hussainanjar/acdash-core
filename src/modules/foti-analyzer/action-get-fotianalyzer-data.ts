import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { getFotiAnalyzerBlockData } from './action-get-fotianalyzer-block-data';
import { getFotiAnalyzerMaliciousData } from './action-get-fotianalyzer-malicious-data';

async function getFotiAnalyzerData(): Promise<void> {
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(` ***** getFotiAnalyzerData - Execute - ${processingDate}`);

  try {
    await Promise.allSettled([getFotiAnalyzerBlockData(), getFotiAnalyzerMaliciousData()]);
  } catch (error) {
    const errorMsg: string = `getFotiAnalyzerData - ${processingDate} - error: ${error.message}, ${error.stack}`;
    jobLogger.error(errorMsg);
  }
}

export { getFotiAnalyzerData };
