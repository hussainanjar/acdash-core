export enum JobSchedulerEnum {
  'JOB_SCHEDULER' = 'JOB_SCHEDULER',
  'OKTA_AUTH_JOB_SCHEDULER' = 'OKTA_AUTH_JOB_SCHEDULER',
}

export enum TenableVprDashboardNameEnum {
  'TENEABLE_VPR_CVSS' = 'VPR SUMMARY - CVSS TO VPR HEAT MAP',
  'TENEABLE_VPR_FDV' = 'VPR SUMMARY - FIRST DISCOVERED VULNERABILITIES',
  'TENEABLE_VPR_MITIGATE' = 'VPR SUMMARY - MITIGATED VULNERABILITIES',
}

export enum VaronisFileServerEnum {
  'GOFS' = 'gofs05',
  'APPFS' = 'appfs1',
  'TOTAL_FILE_SERVER' = 'Total of selected file servers',
  'SHAREPOINT' = 'https://actrans.sharepoint.com',
}

export enum FotiFileNameEnum {
  'FOTI_BLOCK_FILE' = 'Blocked Connection Attempts',
  'FOTI_MALICIOUS_FILE' = 'Blocked Malicious Websites',
}

export enum AbnormalCaseDescriptionEnum {
  'ACCOUNT_COMPROMISED' = 'Account Compromised',
}

export enum EnvType {
  'SWITCH_WEEKLY_TO_DAILY_TIME_SLOT' = 'SWITCH_WEEKLY_TO_DAILY_TIME_SLOT',
  'SWITCH_WEEKLY_TO_MONTHLY_TIME_SLOT' = 'SWITCH_WEEKLY_TO_MONTHLY_TIME_SLOT',
}

export enum CrowdStrikeResponseEnum {
  'SYSTEM_RESPONSE' = 'systemResponse',
  'INCIDENT_RESPONSE' = 'incidentResponse',
  'DETECT_RESPONSE' = 'detectResponse',
}

export enum VaronisFileTypeEnum {
  userExpiredPassword = 'userExpiredPassword',
  fileServerTotals = 'fileServerTotals',
  userAndComputer = 'userAndComputer',
  userAccountDisable = 'userAccountDisable',
  disabledComputers = 'disabledComputers',
  sharepointTotalKpi = 'sharepointTotalKpi',
}
