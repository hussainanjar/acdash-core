import { TenableVulnsModel } from '../../models/tenable/tenable-vulns';
import { TenableVulns } from '../../models/tenable/tenable-vulns';
import { jobLogger } from '../../utils/logger';
import { TenableSlaWorkstationModel } from '../../models/tenable/tenable-sla-workstation';
import { TenableSlaWorkstation } from '../../models/tenable/tenable-sla-workstation';
import { TenableSlaServer } from '../../models/tenable/tenable-sla-server';
import { TenableVprDashboardNameEnum } from '../../utils/enum';
import { TenableVprCvssModel, TenableVprCvss } from '../../models/tenable/tenable-vpr-cvss';
import { TenableVprFdvModel, TenableVprFdv } from '../../models/tenable/tenable-vpr-fdv';
import { TenableVprMitigateModel, TenableVprMitigate } from '../../models/tenable/tenable-vpr-mitigate';
import { tenableVprMitigateDataModifier, tenableVprFdvDataModifier, tenableVprCvssDataModifier } from '../../utils/modifier';

export async function saveVulnsData(props: { systemResponse: any; publicResponse: any; processingDate: Date }): Promise<boolean> {
  const { systemResponse, publicResponse, processingDate } = props;
  try {
    const vulnsPayload: TenableVulnsModel = {
      processingDate,
      systemKnownVulns: systemResponse?.data?.response?.totalRecords ?? null,
      publicServersVulns: publicResponse?.data?.response?.totalRecords ?? null,
    } as TenableVulnsModel;

    await TenableVulns.create(vulnsPayload);
    return true;
  } catch (error) {
    const errorMsg: string = `saveVulnsData - ${processingDate} - error: ${error.message}, ${error.stack}`;
    jobLogger.error(errorMsg);
    throw new Error(error);
  }
}

export async function saveSlaWorkstationData(props: { slaWorkstationResponse: any; processingDate: Date }): Promise<boolean> {
  const { slaWorkstationResponse, processingDate } = props;
  try {
    const slaWorkstationPayload: TenableSlaWorkstationModel = {
      processingDate,
      totalVulnsCritical: slaWorkstationResponse?.data?.response?.data?.[0]?.text ?? null,
      withinSlaVulnsCritical: slaWorkstationResponse?.data?.response?.data?.[1]?.text ?? null,
      overdueVulnsCritical: slaWorkstationResponse?.data?.response?.data?.[2]?.text ?? null,
      totalVulnsHigh: slaWorkstationResponse?.data?.response?.data?.[3]?.text ?? null,
      withinSlaVulnsHigh: slaWorkstationResponse?.data?.response?.data?.[4]?.text ?? null,
      overdueVulnsHigh: slaWorkstationResponse?.data?.response?.data?.[5]?.text ?? null,
      totalVulnsMedium: slaWorkstationResponse?.data?.response?.data?.[6]?.text ?? null,
      withinSlaVulnsMedium: slaWorkstationResponse?.data?.response?.data?.[7]?.text ?? null,
      overdueVulnsMedium: slaWorkstationResponse?.data?.response?.data?.[8]?.text ?? null,
    } as TenableSlaWorkstationModel;

    await TenableSlaWorkstation.create(slaWorkstationPayload);
    return true;
  } catch (error) {
    const errorMsg: string = `saveSlaWorkstationData - ${processingDate} - error: ${error.message}, ${error.stack}`;
    jobLogger.error(errorMsg);
    throw new Error(error);
  }
}

export async function saveSlaServerData(props: { slaServerResponse: any; processingDate: Date }): Promise<boolean> {
  const { slaServerResponse, processingDate } = props;

  try {
    const slaServerPayload: TenableSlaWorkstationModel = {
      processingDate,
      totalVulnsCritical: slaServerResponse?.data?.response?.data?.[0]?.text ?? null,
      withinSlaVulnsCritical: slaServerResponse?.data?.response?.data?.[1]?.text ?? null,
      overdueVulnsCritical: slaServerResponse?.data?.response?.data?.[2]?.text ?? null,
      totalVulnsHigh: slaServerResponse?.data?.response?.data?.[3]?.text ?? null,
      withinSlaVulnsHigh: slaServerResponse?.data?.response?.data?.[4]?.text ?? null,
      overdueVulnsHigh: slaServerResponse?.data?.response?.data?.[5]?.text ?? null,
      totalVulnsMedium: slaServerResponse?.data?.response?.data?.[6]?.text ?? null,
      withinSlaVulnsMedium: slaServerResponse?.data?.response?.data?.[7]?.text ?? null,
      overdueVulnsMedium: slaServerResponse?.data?.response?.data?.[8]?.text ?? null,
    } as TenableSlaWorkstationModel;

    await TenableSlaServer.create(slaServerPayload);
    return true;
  } catch (error) {
    const errorMsg: string = `saveSlaServerData - ${processingDate} - error: ${error.message}, ${error.stack}`;
    jobLogger.error(errorMsg);
    throw new Error(error);
  }
}

export async function saveVprData(props: { vprResponse: any; processingDate: Date }): Promise<boolean> {
  const { vprResponse, processingDate } = props;

  try {
    const dashboardComponents: any[] = vprResponse?.data?.response?.dashboardComponents ?? [];
    const vprCvssData: any[] = [];
    const vprFdvData: any[] = [];
    const vprMitigateData: any[] = [];

    dashboardComponents.map((component) => {
      const componentName: string = component?.name?.toUpperCase() ?? null;

      switch (componentName) {
        case TenableVprDashboardNameEnum.TENEABLE_VPR_CVSS:
          vprCvssData.push(...(component?.data ?? []));
          break;

        case TenableVprDashboardNameEnum.TENEABLE_VPR_FDV:
          vprFdvData.push(...(component?.data ?? []));
          break;

        case TenableVprDashboardNameEnum.TENEABLE_VPR_MITIGATE:
          vprMitigateData.push(...(component?.data ?? []));
          break;
      }
    });

    const vprCvssPayload: TenableVprCvssModel = tenableVprCvssDataModifier(vprCvssData, processingDate);
    const vprFdvPayload: TenableVprFdvModel = tenableVprFdvDataModifier(vprFdvData, processingDate);
    const vprMitigatePayload: TenableVprMitigateModel = tenableVprMitigateDataModifier(vprMitigateData, processingDate);

    await Promise.all([TenableVprCvss.create(vprCvssPayload), TenableVprFdv.create(vprFdvPayload), TenableVprMitigate.create(vprMitigatePayload)]);

    return true;
  } catch (error) {
    jobLogger.error(`saveVprData - ${processingDate} - error: ${error.message}, ${error.stack}`);
    throw new Error(error);
  }
}
