import { parseDbObject } from '../../utils/common';
import { AlertLogic } from '../../models/alert-logic/alert-logic';
import { Op } from 'sequelize';
import { CrowdStrike, CrowdStrikeModel } from '../../models/crowd-strike/crowd-strike';
import { KeyFactor } from '../../models/key-factor/key-factor';
import { FotiAnalyzer } from '../../models/foti-analyzer/foti-analyzer';
import { OktaAuthDetail, OktaAuthDetailModel } from '../../models/okta/okta-auth-detail';
import { OktaOtherDetail, OktaOtherDetailModel } from '../../models/okta/okta-other-detail';
import { TenableVulns } from '../../models/tenable/tenable-vulns';
import { TenableVulnsModel } from '../../models/tenable/tenable-vulns';
import { VaronisUserExpiredPasswordKpi } from '../../models/varonis/varonis-user-expired-password';
import { VaronisUserAccountDisableKpi } from '../../models/varonis/varonis-user-account-disable';
import { VaronisUserAndComputerKpi, VaronisUserAndComputerKpiModel } from '../../models/varonis/varonis-file-user-and-computer';
import { VaronisFileServerTotalKpi, VaronisFileServerTotalKpiModel } from '../../models/varonis/varonis-file-server-total';
import { FotiAnalyzerMaliciousDetails } from '../../models/foti-analyzer/foti-malicious';
import { AbnormalThreats } from '../../models/abnormal-threats/abnormal-threats';
import { AbnormalCases } from '../../models/abnormal-threats/abnormal-cases';
import { AbnormalCaseDescriptionEnum } from '../../utils/enum';

export async function getAlertLogicDbData(props: { startDate: Date; endDate: Date }): Promise<number> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await AlertLogic.count({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getCrowdStrikeDbData(props: { startDate: Date; endDate: Date }): Promise<CrowdStrikeModel[]> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await CrowdStrike.findAll({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getKeyFactorDbData(props: { startDate: Date; endDate: Date }): Promise<number> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await KeyFactor.count({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getFotiBlockConnectionDbData(props: { startDate: Date; endDate: Date }): Promise<number> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await FotiAnalyzer.count({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getFotiMaliciousDbData(props: { startDate: Date; endDate: Date }): Promise<number> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await FotiAnalyzerMaliciousDetails.count({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getOktaAuthDbData(props: { startDate: Date; endDate: Date }): Promise<OktaAuthDetailModel[]> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await OktaAuthDetail.findAll({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getOktaOtherDbData(props: { startDate: Date; endDate: Date }): Promise<OktaOtherDetailModel[]> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await OktaOtherDetail.findAll({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getTenableVulnsDbData(props: { startDate: Date; endDate: Date }): Promise<TenableVulnsModel[]> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await TenableVulns.findAll({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getVaronisExpiredPasswordDbData(props: { startDate: Date; endDate: Date }): Promise<number> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await VaronisUserExpiredPasswordKpi.count({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getVaronisAccountDisablePasswordDbData(props: { startDate: Date; endDate: Date }): Promise<number> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await VaronisUserAccountDisableKpi.count({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getVaronisUserAndComputerDbData(props: { startDate: Date; endDate: Date }): Promise<VaronisUserAndComputerKpiModel[]> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await VaronisUserAndComputerKpi.findAll({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getVaronisFileServerDbData(props: { startDate: Date; endDate: Date }): Promise<VaronisFileServerTotalKpiModel[]> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await VaronisFileServerTotalKpi.findAll({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getAbnormalThreatDbData(props: { startDate: Date; endDate: Date }): Promise<number> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await AbnormalThreats.count({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getAbnormalCaseDbData(props: { startDate: Date; endDate: Date }): Promise<number> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await AbnormalCases.count({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    }),
  );
}

export async function getAbnormalAccountCompromisedDbData(props: { startDate: Date; endDate: Date }): Promise<number> {
  const { startDate, endDate } = props;

  return parseDbObject(
    await AbnormalCases.count({
      where: {
        processingDate: {
          [Op.between]: [startDate, endDate],
        },
        description: AbnormalCaseDescriptionEnum.ACCOUNT_COMPROMISED,
      },
    }),
  );
}
