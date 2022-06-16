import * as schedule from 'node-schedule';
import { JobScheduler, JobSchedulerModel } from '../models/job/job-scheduler';
import { parseDbObject } from '../utils/common';
import { jobLogger } from '../utils/logger';
import { JobSchedulerEnum } from '../utils/enum';
import { getAlertLogicData } from '../modules/alert-logic/action-get-alert-logic-data';
import { getCrowdStrikeData } from '../modules/crowd-strike/action-get-crowd-strike-logic-data';
import { getKeyFactorData } from '../modules/key-factor/action-get-key-factor-data';
import { getFotiAnalyzerData } from '../modules/foti-analyzer/action-get-fotianalyzer-data';
import { getVaronisData } from '../modules/varonis/get-varonis-data';
import { getOktaOtherData } from '../modules/okta/action-get-okta-other-data';
import { getOktaAuthData } from '../modules/okta/action-get-okta-auth-data';
import { Op } from 'sequelize';
import { getTenableData } from '../modules/tenable/action-get-tenable-data';
import { getAbnormalData } from '../modules/abnormal-threats/action-get-abnormal-data';
import { getPercentageChangeData } from '../modules/percentage-change/action-get-percentage-data';
import { getAbnormalCaseData } from '../modules/abnormal-threats/action-get-abnormal-cases-data';

// when you update cron job in database, you need to restrat the server.
export default async function execute(): Promise<void> {
  try {
    let schedulerData: JobReturnType = await getJobScheduler();

    let jobScheduler: JobSchedulerModel = schedulerData.JOB_SCHEDULER;
    let oktaAuthScheduler: JobSchedulerModel = schedulerData.OKTA_AUTH_JOB_SCHEDULER;

    // run pattern for weekly jobs.
    schedule.scheduleJob(jobScheduler.runPattern, async function () {
      schedulerData = await getJobScheduler();
      jobScheduler = schedulerData.JOB_SCHEDULER;

      const id: number = jobScheduler.id;
      const isProcessing: boolean = jobScheduler.isProcessing;
      if (isProcessing) {
        jobLogger.debug('job already processing...');
        return;
      }

      try {
        jobLogger.debug('job executing...');
        await JobScheduler.update({ isProcessing: true }, { where: { id } });

        await Promise.allSettled([getAlertLogicData(), getCrowdStrikeData(), getKeyFactorData(), getVaronisData(), getOktaOtherData(), getTenableData(), getAbnormalData(), getAbnormalCaseData()]);
        await Promise.allSettled([getPercentageChangeData()]);
      } catch (e) {
        const errorMsg: string = `job processing - error: ${e.message}, ${e.stack}`;
        jobLogger.error(errorMsg);

        await JobScheduler.update({ isProcessing: false }, { where: { id } });
      } finally {
        jobLogger.debug('job completed...');
        await JobScheduler.update({ isProcessing: false }, { where: { id } });
      }
    });

    // run pattern for daily jobs.
    schedule.scheduleJob(oktaAuthScheduler.runPattern, async function () {
      schedulerData = await getJobScheduler();
      oktaAuthScheduler = schedulerData.JOB_SCHEDULER;

      const id: number = oktaAuthScheduler.id;
      const isProcessing: boolean = oktaAuthScheduler.isProcessing;
      if (isProcessing) {
        jobLogger.debug('oktaAuthScheduler job already processing...');
        return;
      }

      try {
        jobLogger.debug('oktaAuthScheduler job executing...');
        await JobScheduler.update({ isProcessing: true }, { where: { id } });
        await Promise.allSettled([getOktaAuthData(), getFotiAnalyzerData()]);
      } catch (e) {
        const errorMsg: string = `oktaAuthScheduler job processing - error: ${e.message}, ${e.stack}`;
        jobLogger.error(errorMsg);

        await JobScheduler.update({ isProcessing: false }, { where: { id } });
      } finally {
        jobLogger.debug('oktaAuthScheduler job completed...');
        await JobScheduler.update({ isProcessing: false }, { where: { id } });
      }
    });
  } catch (e) {
    const errorMsg: string = `job execute - error: ${e.message}, ${e.stack}`;
    jobLogger.error(errorMsg);
  }
}

type JobReturnType = {
  [key: string]: JobSchedulerModel;
};

async function getJobScheduler(): Promise<JobReturnType> {
  const data: JobSchedulerModel[] = parseDbObject(await JobScheduler.findAll({ where: { name: { [Op.or]: [JobSchedulerEnum.JOB_SCHEDULER, JobSchedulerEnum.OKTA_AUTH_JOB_SCHEDULER] } } }));

  const jobs: JobReturnType = {};

  data.map((payload: JobSchedulerModel) => {
    jobs[payload.name] = payload;
  });

  return jobs;
}
