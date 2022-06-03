import { jobLogger } from '../../utils/logger';
import {
  getAbnormalAccountCompromisedDbData,
  getAbnormalCaseDbData,
  getAbnormalThreatDbData,
  getAlertLogicDbData,
  getCrowdStrikeDbData,
  getFotiBlockConnectionDbData,
  getFotiMaliciousDbData,
  getKeyFactorDbData,
  getOktaAuthDbData,
  getOktaOtherDbData,
  getTenableVulnsDbData,
  getVaronisAccountDisablePasswordDbData,
  getVaronisExpiredPasswordDbData,
  getVaronisFileServerDbData,
  getVaronisUserAndComputerDbData,
} from './dal';
import { PercentageChangeModel } from '../../models/percentage-change/percentage-change';
import { CrowdStrikeModel } from '../../models/crowd-strike/crowd-strike';
import { OktaAuthDetailModel } from '../../models/okta/okta-auth-detail';
import { OktaOtherDetailModel } from '../../models/okta/okta-other-detail';
import { TenableVulnsModel } from '../../models/tenable/tenable-vulns';
import { VaronisUserAndComputerKpiModel } from '../../models/varonis/varonis-file-user-and-computer';
import { VaronisFileServerTotalKpiModel } from '../../models/varonis/varonis-file-server-total';
import { VaronisFileServerEnum } from '../../utils/enum';

export async function getAlertLogicPercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getAlertLogicPercentageData Execute - ${processingDate}`);

  jobLogger.info(`getAlertLogicPercentageData - fetch data start - ${processingDate}`);
  const initialResponse: number = await getAlertLogicDbData({ startDate, endDate: firstMiddleDate });
  const finalResponse: number = await getAlertLogicDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getAlertLogicPercentageData - fetch data end - ${processingDate}`);

  let percentageChange: string;

  if (initialResponse === 0 && finalResponse === 0) {
    percentageChange = '0.00';
  } else if (initialResponse === 0) {
    percentageChange = '100.00';
  } else percentageChange = (((finalResponse - initialResponse) / initialResponse) * 100).toFixed(2);

  jobLogger.info(`getAlertLogicPercentageData - calculate percentage - ${processingDate}`);
  return [
    {
      processingDate,
      keyName: 'ALERT_LOGIC',
      keyValue: percentageChange,
    },
  ] as PercentageChangeModel[];
}

export async function getCrowdStrikePercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getCrowdStrikePercentageData Execute - ${processingDate}`);

  jobLogger.info(`getCrowdStrikePercentageData - fetch data start - ${processingDate}`);
  const initialResponse: CrowdStrikeModel[] = await getCrowdStrikeDbData({ startDate, endDate: firstMiddleDate });
  const finalResponse: CrowdStrikeModel[] = await getCrowdStrikeDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getCrowdStrikePercentageData - fetch data end - ${processingDate}`);

  let csProtectedSystemInitialCount: number = 0;
  let csProtectedSystemFinalCount: number = 0;

  let csIncidentInitialCount: number = 0;
  let csIncidentFinalCount: number = 0;

  let csDetectInitialCount: number = 0;
  let csDetectFinalCount: number = 0;

  initialResponse.map((record) => {
    csProtectedSystemInitialCount += Number(record.protectedSystems) ?? 0;
    csIncidentInitialCount += Number(record.incidents) ?? 0;
    csDetectInitialCount += Number(record.detects) ?? 0;
  });

  finalResponse.map((record) => {
    csProtectedSystemFinalCount += Number(record.protectedSystems) ?? 0;
    csIncidentFinalCount += Number(record.incidents) ?? 0;
    csDetectFinalCount += Number(record.detects) ?? 0;
  });

  let systemPercentageChange: string;
  let incidentPercentageChange: string;
  let detectPercentageChange: string;

  if (csProtectedSystemInitialCount === 0 && csProtectedSystemFinalCount === 0) {
    systemPercentageChange = '0.00';
  } else if (csProtectedSystemInitialCount === 0) {
    systemPercentageChange = '100.00';
  } else {
    systemPercentageChange = (((csProtectedSystemFinalCount - csProtectedSystemInitialCount) / csProtectedSystemInitialCount) * 100).toFixed(2);
  }

  if (csIncidentInitialCount === 0 && csIncidentFinalCount === 0) {
    incidentPercentageChange = '0.00';
  } else if (csIncidentInitialCount === 0) {
    incidentPercentageChange = '100.00';
  } else {
    incidentPercentageChange = (((csIncidentFinalCount - csIncidentInitialCount) / csIncidentInitialCount) * 100).toFixed(2);
  }

  if (csDetectInitialCount === 0 && csDetectFinalCount === 0) {
    detectPercentageChange = '0.00';
  } else if (csDetectInitialCount === 0) {
    detectPercentageChange = '100.00';
  } else {
    detectPercentageChange = (((csDetectFinalCount - csDetectInitialCount) / csDetectInitialCount) * 100).toFixed(2);
  }

  jobLogger.info(`getCrowdStrikePercentageData - calculate percentage - ${processingDate}`);

  const payload: PercentageChangeModel[] = [
    {
      processingDate,
      keyName: 'CS_PROTECTED_SYSTEMS',
      keyValue: systemPercentageChange,
    },
    {
      processingDate,
      keyName: 'CS_INCIDENTS',
      keyValue: incidentPercentageChange,
    },
    {
      processingDate,
      keyName: 'CS_DETECTS',
      keyValue: detectPercentageChange,
    },
  ] as PercentageChangeModel[];
  return payload;
}

export async function getKeyFactorPercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getKeyFactorPercentageData Execute - ${processingDate}`);

  jobLogger.info(`getKeyFactorPercentageData - fetch data start - ${processingDate}`);
  const initialResponse: number = await getKeyFactorDbData({ startDate, endDate: firstMiddleDate });
  const finalResponse: number = await getKeyFactorDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getKeyFactorPercentageData - fetch data end - ${processingDate}`);

  let percentageChange: string;

  if (initialResponse === 0 && finalResponse === 0) {
    percentageChange = '0.00';
  } else if (initialResponse === 0) {
    percentageChange = '100.00';
  } else percentageChange = (((finalResponse - initialResponse) / initialResponse) * 100).toFixed(2);

  jobLogger.info(`getKeyFactorPercentageData - calculate percentage - ${processingDate}`);
  return [
    {
      processingDate,
      keyName: 'KEYFACTOR',
      keyValue: percentageChange,
    },
  ] as PercentageChangeModel[];
}

export async function getFotiBlockConnectionPercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getFotiBlockConnectionPercentageData Execute - ${processingDate}`);

  jobLogger.info(`getFotiBlockConnectionPercentageData - fetch data start - ${processingDate}`);
  const initialResponse: number = await getFotiBlockConnectionDbData({ startDate, endDate: firstMiddleDate });
  const finalResponse: number = await getFotiBlockConnectionDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getFotiBlockConnectionPercentageData - fetch data end - ${processingDate}`);

  let percentageChange: string;

  if (initialResponse === 0 && finalResponse === 0) {
    percentageChange = '0.00';
  } else if (initialResponse === 0) {
    percentageChange = '100.00';
  } else percentageChange = (((finalResponse - initialResponse) / initialResponse) * 100).toFixed(2);

  jobLogger.info(`getFotiBlockConnectionPercentageData - calculate percentage - ${processingDate}`);
  return [
    {
      processingDate,
      keyName: 'FORTI_BLOCK_CONNECTIONS',
      keyValue: percentageChange,
    },
  ] as PercentageChangeModel[];
}

export async function getFotiMaliciousPercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getFotiMaliciousPercentageData Execute - ${processingDate}`);

  jobLogger.info(`getFotiMaliciousPercentageData - fetch data start - ${processingDate}`);
  const initialResponse: number = await getFotiMaliciousDbData({ startDate, endDate: firstMiddleDate });
  const finalResponse: number = await getFotiMaliciousDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getFotiMaliciousPercentageData - fetch data end - ${processingDate}`);

  let percentageChange: string;

  if (initialResponse === 0 && finalResponse === 0) {
    percentageChange = '0.00';
  } else if (initialResponse === 0) {
    percentageChange = '100.00';
  } else percentageChange = (((finalResponse - initialResponse) / initialResponse) * 100).toFixed(2);

  jobLogger.info(`getFotiMaliciousPercentageData - calculate percentage - ${processingDate}`);
  return [
    {
      processingDate,
      keyName: 'FORTI_MALACIOUS_WEBSITE',
      keyValue: percentageChange,
    },
  ] as PercentageChangeModel[];
}

export async function getOkaPercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getOkaPercentageData Execute - ${processingDate}`);

  jobLogger.info(`getOkaPercentageData - fetch data start - ${processingDate}`);
  const oktaAuthInitialResponse: OktaAuthDetailModel[] = await getOktaAuthDbData({ startDate, endDate: firstMiddleDate });
  const oktaAuthFinalResponse: OktaAuthDetailModel[] = await getOktaAuthDbData({ startDate: secondMiddleDate, endDate });

  const oktaOtherInitialResponse: OktaOtherDetailModel[] = await getOktaOtherDbData({ startDate, endDate: firstMiddleDate });
  const oktaOtherFinalResponse: OktaOtherDetailModel[] = await getOktaOtherDbData({ startDate: secondMiddleDate, endDate });

  jobLogger.info(`getOkaPercentageData - fetch data end - ${processingDate}`);

  let oktaAuthInitialCount: number = 0;
  let oktaAuthFinalCount: number = 0;

  let oktaSuspiciousInitialCount: number = 0;
  let oktaSuspiciousFinalCount: number = 0;

  let oktaUsaInitialCount: number = 0;
  let oktaUsaFinalCount: number = 0;

  let oktaLockedInitialCount: number = 0;
  let oktaLockedFinalCount: number = 0;

  oktaAuthInitialResponse.map((record) => {
    oktaAuthInitialCount += Number(record.authActivityTotal) ?? 0;
  });

  oktaAuthFinalResponse.map((record) => {
    oktaAuthFinalCount += Number(record.authActivityTotal) ?? 0;
  });

  oktaOtherInitialResponse.map((record) => {
    oktaSuspiciousInitialCount += Number(record.suspiciousRecordTotal);
    oktaUsaInitialCount += Number(record.outsideUsaTotal);
    oktaLockedInitialCount += Number(record.lockedRecordTotal);
  });

  oktaOtherFinalResponse.map((record) => {
    oktaSuspiciousFinalCount += Number(record.suspiciousRecordTotal);
    oktaUsaFinalCount += Number(record.outsideUsaTotal);
    oktaLockedFinalCount += Number(record.lockedRecordTotal);
  });

  let oktaAuthPercentageChange: string;
  let oktaSuspiciousPercentageChange: string;
  let oktaUsaPercentageChange: string;
  let oktaLockedPercentageChange: string;

  if (oktaAuthInitialCount === 0 && oktaAuthFinalCount === 0) {
    oktaAuthPercentageChange = '0.00';
  } else if (oktaAuthInitialCount === 0) {
    oktaAuthPercentageChange = '100.00';
  } else {
    oktaAuthPercentageChange = (((oktaAuthFinalCount - oktaAuthInitialCount) / oktaAuthInitialCount) * 100).toFixed(2);
  }

  if (oktaSuspiciousInitialCount === 0 && oktaSuspiciousFinalCount === 0) {
    oktaSuspiciousPercentageChange = '0.00';
  } else if (oktaSuspiciousInitialCount === 0) {
    oktaSuspiciousPercentageChange = '100.00';
  } else {
    oktaSuspiciousPercentageChange = (((oktaSuspiciousFinalCount - oktaSuspiciousInitialCount) / oktaSuspiciousInitialCount) * 100).toFixed(2);
  }

  if (oktaUsaInitialCount === 0 && oktaUsaFinalCount === 0) {
    oktaUsaPercentageChange = '0.00';
  } else if (oktaUsaInitialCount === 0) {
    oktaUsaPercentageChange = '100.00';
  } else {
    oktaUsaPercentageChange = (((oktaUsaFinalCount - oktaUsaInitialCount) / oktaUsaInitialCount) * 100).toFixed(2);
  }

  if (oktaLockedInitialCount === 0 && oktaLockedFinalCount === 0) {
    oktaLockedPercentageChange = '0.00';
  } else if (oktaLockedInitialCount === 0) {
    oktaLockedPercentageChange = '100.00';
  } else {
    oktaLockedPercentageChange = (((oktaLockedFinalCount - oktaLockedInitialCount) / oktaLockedInitialCount) * 100).toFixed(2);
  }

  jobLogger.info(`getOkaPercentageData - calculate percentage - ${processingDate}`);

  const payload: PercentageChangeModel[] = [
    {
      processingDate,
      keyName: 'OKTA_AUTH_ACTIVITY',
      keyValue: oktaAuthPercentageChange,
    },
    {
      processingDate,
      keyName: 'OKTA_SUPICIOUS',
      keyValue: oktaSuspiciousPercentageChange,
    },
    {
      processingDate,
      keyName: 'OKTA_OUTSIDE_USA',
      keyValue: oktaUsaPercentageChange,
    },
    {
      processingDate,
      keyName: 'OKTA_LOCKED',
      keyValue: oktaLockedPercentageChange,
    },
  ] as PercentageChangeModel[];
  return payload;
}

export async function getTenableVulnsPercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getTenableVulnsPercentageData Execute - ${processingDate}`);

  jobLogger.info(`getTenableVulnsPercentageData - fetch data start - ${processingDate}`);
  const initialResponse: TenableVulnsModel[] = await getTenableVulnsDbData({ startDate, endDate: firstMiddleDate });
  const finalResponse: TenableVulnsModel[] = await getTenableVulnsDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getTenableVulnsPercentageData - fetch data end - ${processingDate}`);

  let tenableVulnsSystemInitialCount: number = 0;
  let tenableVulnsSystemFinalCount: number = 0;

  let tenableVulnsPublicInitialCount: number = 0;
  let tenableVulnsPublicFinalCount: number = 0;

  initialResponse.map((record) => {
    tenableVulnsSystemInitialCount += Number(record.systemKnownVulns) ?? 0;
    tenableVulnsPublicInitialCount += Number(record.publicServersVulns) ?? 0;
  });

  finalResponse.map((record) => {
    tenableVulnsSystemFinalCount += Number(record.systemKnownVulns) ?? 0;
    tenableVulnsPublicFinalCount += Number(record.publicServersVulns) ?? 0;
  });

  let systemPercentageChange: string;
  let publicPercentageChange: string;

  if (tenableVulnsSystemInitialCount === 0 && tenableVulnsSystemFinalCount === 0) {
    systemPercentageChange = '0.00';
  } else if (tenableVulnsSystemInitialCount === 0) {
    systemPercentageChange = '100.00';
  } else {
    systemPercentageChange = (((tenableVulnsSystemFinalCount - tenableVulnsSystemInitialCount) / tenableVulnsSystemInitialCount) * 100).toFixed(2);
  }

  if (tenableVulnsPublicInitialCount === 0 && tenableVulnsPublicFinalCount === 0) {
    publicPercentageChange = '0.00';
  } else if (tenableVulnsPublicInitialCount === 0) {
    publicPercentageChange = '100.00';
  } else {
    publicPercentageChange = (((tenableVulnsPublicFinalCount - tenableVulnsPublicInitialCount) / tenableVulnsPublicInitialCount) * 100).toFixed(2);
  }

  jobLogger.info(`getTenableVulnsPercentageData - calculate percentage - ${processingDate}`);

  const payload: PercentageChangeModel[] = [
    {
      processingDate,
      keyName: 'TENABLE_VULNS_SYSTEM_KOWN',
      keyValue: systemPercentageChange,
    },
    {
      processingDate,
      keyName: 'TENABLE_VULNS_PUBLIC_SERVER',
      keyValue: publicPercentageChange,
    },
  ] as PercentageChangeModel[];
  return payload;
}

export async function getVaronisExpiredPasswordPercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getVaronisExpiredPasswordPercentageData Execute - ${processingDate}`);

  jobLogger.info(`getVaronisExpiredPasswordPercentageData - fetch data start - ${processingDate}`);
  const initialResponse: number = await getVaronisExpiredPasswordDbData({ startDate, endDate: firstMiddleDate });
  const finalResponse: number = await getVaronisExpiredPasswordDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getVaronisExpiredPasswordPercentageData - fetch data end - ${processingDate}`);

  let percentageChange: string;

  if (initialResponse === 0 && finalResponse === 0) {
    percentageChange = '0.00';
  } else if (initialResponse === 0) {
    percentageChange = '100.00';
  } else {
    percentageChange = (((finalResponse - initialResponse) / initialResponse) * 100).toFixed(2);
  }

  jobLogger.info(`getVaronisExpiredPasswordPercentageData - calculate percentage - ${processingDate}`);

  const payload: PercentageChangeModel[] = [
    {
      processingDate,
      keyName: 'VARONIS_EXPIRED_PASSWORD',
      keyValue: percentageChange,
    },
  ] as PercentageChangeModel[];
  return payload;
}

export async function getVaronisAccountDisablePercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getVaronisAccountDisablePercentageData Execute - ${processingDate}`);

  jobLogger.info(`getVaronisAccountDisablePercentageData - fetch data start - ${processingDate}`);
  const initialResponse: number = await getVaronisAccountDisablePasswordDbData({ startDate, endDate: firstMiddleDate });
  const finalResponse: number = await getVaronisAccountDisablePasswordDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getVaronisAccountDisablePercentageData - fetch data end - ${processingDate}`);

  let percentageChange: string;

  if (initialResponse === 0 && finalResponse === 0) {
    percentageChange = '0.00';
  } else if (initialResponse === 0) {
    percentageChange = '100.00';
  } else {
    percentageChange = (((finalResponse - initialResponse) / initialResponse) * 100).toFixed(2);
  }

  jobLogger.info(`getVaronisAccountDisablePercentageData - calculate percentage - ${processingDate}`);

  const payload: PercentageChangeModel[] = [
    {
      processingDate,
      keyName: 'VARONIS_ACCOUNT_DISABLED',
      keyValue: percentageChange,
    },
  ] as PercentageChangeModel[];
  return payload;
}

export async function getVaronisUserAndComputerPercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getVaronisUserAndComputerPercentageData Execute - ${processingDate}`);

  jobLogger.info(`getVaronisUserAndComputerPercentageData - fetch data start - ${processingDate}`);
  const initialResponse: VaronisUserAndComputerKpiModel[] = await getVaronisUserAndComputerDbData({ startDate, endDate: firstMiddleDate });
  const finalResponse: VaronisUserAndComputerKpiModel[] = await getVaronisUserAndComputerDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getVaronisUserAndComputerPercentageData - fetch data end - ${processingDate}`);

  let initialCount: number = 0;
  let finalCount: number = 0;

  initialResponse.map((record) => {
    initialCount += Number(record.noOfComputerAccounts) ?? 0;
  });

  finalResponse.map((record) => {
    finalCount += Number(record.noOfComputerAccounts) ?? 0;
  });

  let percentageChange: string;

  if (initialCount === 0 && finalCount === 0) {
    percentageChange = '0.00';
  } else if (initialCount === 0) {
    percentageChange = '100.00';
  } else {
    percentageChange = (((finalCount - initialCount) / initialCount) * 100).toFixed(2);
  }

  jobLogger.info(`getVaronisUserAndComputerPercentageData - calculate percentage - ${processingDate}`);

  const payload: PercentageChangeModel[] = [
    {
      processingDate,
      keyName: 'VARONIS_NUMBER_COMPUTER_ACCOUNTS',
      keyValue: percentageChange,
    },
  ] as PercentageChangeModel[];
  return payload;
}

export async function getVaronisFileServerPercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getVaronisFileServerPercentageData Execute - ${processingDate}`);

  jobLogger.info(`getVaronisFileServerPercentageData - fetch data start - ${processingDate}`);
  const initialResponse: VaronisFileServerTotalKpiModel[] = await getVaronisFileServerDbData({ startDate, endDate: firstMiddleDate });
  const finalResponse: VaronisFileServerTotalKpiModel[] = await getVaronisFileServerDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getVaronisFileServerPercentageData - fetch data end - ${processingDate}`);

  let serverFolderInitialCount: number = 0;
  let serverFolderFinalCount: number = 0;

  let serverFilesInitialCount: number = 0;
  let serverFilesFinalCount: number = 0;

  let serverSizeInitialCount: number = 0;
  let serverSizeFinalCount: number = 0;

  // let serverSharePointFolderInitialCount: number = 0;
  // let serverSharePointFolderFinalCount: number = 0;

  // let serverSharePointFilesInitialCount: number = 0;
  // let serverSharePointFilesFinalCount: number = 0;

  // let serverSharePointSizeInitialCount: number = 0;
  // let serverSharePointSizeFinalCount: number = 0;

  let sharePointFolderInitialCount: number = 0;
  let sharePointFolderFinalCount: number = 0;

  let sharePointFilesInitialCount: number = 0;
  let sharePointFilesFinalCount: number = 0;

  let sharePointSizeInitialCount: number = 0;
  let sharePointSizeFinalCount: number = 0;

  initialResponse.map((record) => {
    switch (record.fileServer) {
      case VaronisFileServerEnum.TOTAL_FILE_SERVER:
        serverFolderInitialCount += Number(record.noOfFolders);
        serverFilesInitialCount += Number(record.noOfFiles);
        serverSizeInitialCount += Number(record.sizeOfAllFilesAndFoldersGb);
        break;

      // case VaronisFileServerEnum.SHAREPOINT:
      //   serverSharePointFolderInitialCount += Number(record.noOfFolders);
      //   serverSharePointFilesInitialCount += Number(record.noOfFiles);
      //   serverSharePointSizeInitialCount += Number(record.sizeOfAllFilesAndFoldersGb);
      //   break;

      case VaronisFileServerEnum.SHAREPOINT:
        sharePointFolderInitialCount += Number(record.noOfFolders);
        sharePointFilesInitialCount += Number(record.noOfFiles);
        sharePointSizeInitialCount += Number(record.sizeOfAllFilesAndFoldersGb);
        break;
    }
  });

  finalResponse.map((record) => {
    switch (record.fileServer) {
      case VaronisFileServerEnum.TOTAL_FILE_SERVER:
        serverFolderFinalCount += Number(record.noOfFolders);
        serverFilesFinalCount += Number(record.noOfFiles);
        serverSizeFinalCount += Number(record.sizeOfAllFilesAndFoldersGb);
        break;

      // case VaronisFileServerEnum.APPFS:
      //   serverSharePointFolderFinalCount += Number(record.noOfFolders);
      //   serverSharePointFilesFinalCount += Number(record.noOfFiles);
      //   serverSharePointSizeFinalCount += Number(record.sizeOfAllFilesAndFoldersGb);
      //   break;

      case VaronisFileServerEnum.SHAREPOINT:
        sharePointFolderFinalCount += Number(record.noOfFolders);
        sharePointFilesFinalCount += Number(record.noOfFiles);
        sharePointSizeFinalCount += Number(record.sizeOfAllFilesAndFoldersGb);
        break;
    }
  });

  let serverFolderPercentageChange: string;
  let serverFilesPercentageChange: string;
  let serverSizePercentageChange: string;

  // let serverSharePointFolderPercentageChange: string;
  // let serverSharePointFilesPercentageChange: string;
  // let serverSharePointSizePercentageChange: string;

  let sharePointFolderPercentageChange: string;
  let sharePointFilesPercentageChange: string;
  let sharePointSizePercentageChange: string;

  // Varonis File Server calculation
  if (serverFolderInitialCount === 0 && serverFolderFinalCount === 0) {
    serverFolderPercentageChange = '0.00';
  } else if (serverFolderInitialCount === 0) {
    serverFolderPercentageChange = '100.00';
  } else {
    serverFolderPercentageChange = (((serverFolderFinalCount - serverFolderInitialCount) / serverFolderInitialCount) * 100).toFixed(2);
  }

  if (serverFilesInitialCount === 0 && serverFilesFinalCount === 0) {
    serverFilesPercentageChange = '0.00';
  } else if (serverFilesInitialCount === 0) {
    serverFilesPercentageChange = '100.00';
  } else {
    serverFilesPercentageChange = (((serverFilesFinalCount - serverFilesInitialCount) / serverFilesInitialCount) * 100).toFixed(2);
  }

  if (serverSizeInitialCount === 0 && serverSizeFinalCount === 0) {
    serverSizePercentageChange = '0.00';
  } else if (serverSizeInitialCount === 0) {
    serverSizePercentageChange = '100.00';
  } else {
    serverSizePercentageChange = (((serverSizeFinalCount - serverSizeInitialCount) / serverSizeInitialCount) * 100).toFixed(2);
  }

  // if (serverSharePointFolderInitialCount === 0 && serverSharePointFolderFinalCount === 0) {
  //   serverSharePointFolderPercentageChange = '0.00';
  // } else if (serverSharePointFolderInitialCount === 0) {
  //   serverSharePointFolderPercentageChange = '100.00';
  // } else {
  //   serverSharePointFolderPercentageChange = (((serverSharePointFolderFinalCount - serverSharePointFolderInitialCount) / serverSharePointFolderInitialCount) * 100).toFixed(2);
  // }

  // if (serverSharePointFilesInitialCount === 0 && serverSharePointFilesFinalCount === 0) {
  //   serverSharePointFilesPercentageChange = '0.00';
  // } else if (serverSharePointFilesInitialCount === 0) {
  //   serverSharePointFilesPercentageChange = '100.00';
  // } else {
  //   serverSharePointFilesPercentageChange = (((serverSharePointFilesFinalCount - serverSharePointFilesInitialCount) / serverSharePointFilesInitialCount) * 100).toFixed(2);
  // }

  // if (serverSharePointSizeInitialCount === 0 && serverSharePointSizeFinalCount === 0) {
  //   serverSharePointSizePercentageChange = '0.00';
  // } else if (serverSharePointSizeInitialCount === 0) {
  //   serverSharePointSizePercentageChange = '100.00';
  // } else {
  //   serverSharePointSizePercentageChange = (((serverSharePointSizeFinalCount - serverSharePointSizeInitialCount) / serverSharePointSizeInitialCount) * 100).toFixed(2);
  // }

  // SharePoint calculation

  if (sharePointFolderInitialCount === 0 && sharePointFolderFinalCount === 0) {
    sharePointFolderPercentageChange = '0.00';
  } else if (sharePointFolderInitialCount === 0) {
    sharePointFolderPercentageChange = '100.00';
  } else {
    sharePointFolderPercentageChange = (((sharePointFolderFinalCount - sharePointFolderInitialCount) / sharePointFolderInitialCount) * 100).toFixed(2);
  }

  if (sharePointFilesInitialCount === 0 && sharePointFilesFinalCount === 0) {
    sharePointFilesPercentageChange = '0.00';
  } else if (sharePointFilesInitialCount === 0) {
    sharePointFilesPercentageChange = '100.00';
  } else {
    sharePointFilesPercentageChange = (((sharePointFilesFinalCount - sharePointFilesInitialCount) / sharePointFilesInitialCount) * 100).toFixed(2);
  }

  if (sharePointSizeInitialCount === 0 && sharePointSizeFinalCount === 0) {
    sharePointSizePercentageChange = '0.00';
  } else if (sharePointSizeInitialCount === 0) {
    sharePointSizePercentageChange = '100.00';
  } else {
    sharePointSizePercentageChange = (((sharePointSizeFinalCount - sharePointSizeInitialCount) / sharePointSizeInitialCount) * 100).toFixed(2);
  }

  jobLogger.info(`getVaronisFileServerPercentageData - calculate percentage - ${processingDate}`);

  const payload: PercentageChangeModel[] = [
    {
      processingDate,
      keyName: 'VARONIS_SERVER_FOLDERS',
      keyValue: serverFolderPercentageChange,
    },
    {
      processingDate,
      keyName: 'VARONIS_SERVER_FILES',
      keyValue: serverFilesPercentageChange,
    },
    {
      processingDate,
      keyName: 'VARONIS_SERVER_SIZE',
      keyValue: serverSizePercentageChange,
    },
    {
      processingDate,
      keyName: 'VARONIS_SHAREPOINT_FOLDERS',
      keyValue: sharePointFolderPercentageChange,
    },
    {
      processingDate,
      keyName: 'VARONIS_SHAREPOINT_FILES',
      keyValue: sharePointFilesPercentageChange,
    },
    {
      processingDate,
      keyName: 'VARONIS_SHAREPOINT_SIZE',
      keyValue: sharePointSizePercentageChange,
    },
    // {
    //   processingDate,
    //   keyName: 'VARONIS_SHAREPOINT_KPI_FOLDERS',
    //   keyValue: sharePointFolderPercentageChange,
    // },
    // {
    //   processingDate,
    //   keyName: 'VARONIS_SHAREPOINT_KPI_FILES',
    //   keyValue: sharePointFilesPercentageChange,
    // },
    // {
    //   processingDate,
    //   keyName: 'VARONIS_SHAREPOINT_KPI_SIZE',
    //   keyValue: sharePointSizePercentageChange,
    // },
  ] as PercentageChangeModel[];
  return payload;
}

export async function getAbnormalThreatPercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getAbnormalThreatPercentageData Execute - ${processingDate}`);

  jobLogger.info(`getAbnormalThreatPercentageData - fetch data start - ${processingDate}`);
  const initialResponse: number = await getAbnormalThreatDbData({ startDate, endDate: firstMiddleDate });
  const finalResponse: number = await getAbnormalThreatDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getAbnormalThreatPercentageData - fetch data end - ${processingDate}`);

  let percentageChange: string;

  if (initialResponse === 0 && finalResponse === 0) {
    percentageChange = '0.00';
  } else if (initialResponse === 0) {
    percentageChange = '100.00';
  } else percentageChange = (((finalResponse - initialResponse) / initialResponse) * 100).toFixed(2);

  jobLogger.info(`getAbnormalThreatPercentageData - calculate percentage - ${processingDate}`);
  return [
    {
      processingDate,
      keyName: 'ABNORMAL_THREATS',
      keyValue: percentageChange,
    },
  ] as PercentageChangeModel[];
}

export async function getAbnormalCasePercentageData(props: { startDate: Date; firstMiddleDate: Date; secondMiddleDate: Date; endDate: Date; processingDate: Date }): Promise<PercentageChangeModel[]> {
  const { startDate, firstMiddleDate, secondMiddleDate, endDate, processingDate } = props;

  jobLogger.info(`getAbnormalCasePercentageData Execute - ${processingDate}`);

  jobLogger.info(`getAbnormalCasePercentageData - fetch data start - ${processingDate}`);
  const abnormalCaseInitialResponse: number = await getAbnormalCaseDbData({ startDate, endDate: firstMiddleDate });
  const abnormalCaseFinalResponse: number = await getAbnormalCaseDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getAbnormalCasePercentageData - fetch data end - ${processingDate}`);

  jobLogger.info(`getAbnormalCasePercentageData - fetch data start - ${processingDate}`);
  const abnormalCaseAccCompromisedInitialResponse: number = await getAbnormalAccountCompromisedDbData({ startDate, endDate: firstMiddleDate });
  const abnormalCaseAccCompromisedFinalResponse: number = await getAbnormalAccountCompromisedDbData({ startDate: secondMiddleDate, endDate });
  jobLogger.info(`getAbnormalCasePercentageData - fetch data end - ${processingDate}`);

  let abnormalThreatPercentageChange: string;
  let abnormalCaseAccCompromisedPercentageChange: string;

  if (abnormalCaseInitialResponse === 0 && abnormalCaseFinalResponse === 0) {
    abnormalThreatPercentageChange = '0.00';
  } else if (abnormalCaseInitialResponse === 0) {
    abnormalThreatPercentageChange = '100.00';
  } else abnormalThreatPercentageChange = (((abnormalCaseFinalResponse - abnormalCaseInitialResponse) / abnormalCaseInitialResponse) * 100).toFixed(2);

  if (abnormalCaseAccCompromisedInitialResponse === 0 && abnormalCaseAccCompromisedFinalResponse === 0) {
    abnormalCaseAccCompromisedPercentageChange = '0.00';
  } else if (abnormalCaseAccCompromisedInitialResponse === 0) {
    abnormalCaseAccCompromisedPercentageChange = '100.00';
  } else abnormalCaseAccCompromisedPercentageChange = (((abnormalCaseAccCompromisedFinalResponse - abnormalCaseAccCompromisedInitialResponse) / abnormalCaseAccCompromisedInitialResponse) * 100).toFixed(2);

  jobLogger.info(`getAbnormalCasePercentageData - calculate percentage - ${processingDate}`);
  return [
    {
      processingDate,
      keyName: 'ABNORMAL_CASES',
      keyValue: abnormalThreatPercentageChange,
    },
    {
      processingDate,
      keyName: 'ABNORMAL_CASES_ACCOUNT_COMPROMISED',
      keyValue: abnormalCaseAccCompromisedPercentageChange,
    },
  ] as PercentageChangeModel[];
}
