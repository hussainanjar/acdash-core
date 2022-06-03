import { AbnormalThreatsModel } from '../models/abnormal-threats/abnormal-threats';
import { AbnormalCasesModel } from '../models/abnormal-threats/abnormal-cases';
import { TenableVprCvssModel } from '../models/tenable/tenable-vpr-cvss';
import { TenableVprFdvModel } from '../models/tenable/tenable-vpr-fdv';
import { TenableVprMitigateModel } from '../models/tenable/tenable-vpr-mitigate';
import { HttpCall, HttpCallResponse } from './http-call';

export function tenableVprCvssDataModifier(data: any[], processingDate: Date): TenableVprCvssModel {
  return {
    processingDate,
    cvssLowVprLow: data?.[0]?.text ?? null,
    cvssLowVprMedium: data?.[1]?.text ?? null,
    cvssLowVprHigh: data?.[2]?.text ?? null,
    cvssLowVprCritical: data?.[3]?.text ?? null,
    cvssMediumVprLow: data?.[4]?.text ?? null,
    cvssMediumVprMedium: data?.[5]?.text ?? null,
    cvssMediumVprHigh: data?.[6]?.text ?? null,
    cvssMediumVprCritical: data?.[7]?.text ?? null,
    cvssHighVprLow: data?.[8]?.text ?? null,
    cvssHighVprMedium: data?.[9]?.text ?? null,
    cvssHighVprHigh: data?.[10]?.text ?? null,
    cvssHighVprCritical: data?.[11]?.text ?? null,
    cvssCriticalVprLow: data?.[12]?.text ?? null,
    cvssCriticalVprMedium: data?.[13]?.text ?? null,
    cvssCriticalVprHigh: data?.[14]?.text ?? null,
    cvssCriticalVprCritical: data?.[15]?.text ?? null,
  } as TenableVprCvssModel;
}

export function tenableVprFdvDataModifier(data: any[], processingDate: Date): TenableVprFdvModel {
  return {
    processingDate,
    currentMonthVprLow: data?.[0]?.text ?? null,
    currentMonthVprMedium: data?.[1]?.text ?? null,
    currentMonthVprHigh: data?.[2]?.text ?? null,
    currentMonthVprCritical: data?.[3]?.text ?? null,
    lastMonthVprLow: data?.[4]?.text ?? null,
    lastMonthVprMedium: data?.[5]?.text ?? null,
    lastMonthVprHigh: data?.[6]?.text ?? null,
    lastMonthVprCritical: data?.[7]?.text ?? null,
    currentQuarterVprLow: data?.[8]?.text ?? null,
    currentQuarterVprMedium: data?.[9]?.text ?? null,
    currentQuarterVprHigh: data?.[10]?.text ?? null,
    currentQuarterVprCritical: data?.[11]?.text ?? null,
    lastQuarterVprLow: data?.[12]?.text ?? null,
    lastQuarterVprMedium: data?.[13]?.text ?? null,
    lastQuarterVprHigh: data?.[14]?.text ?? null,
    lastQuarterVprCritical: data?.[15]?.text ?? null,
    overDaysVprLow: data?.[16]?.text ?? null,
    overDaysVprMedium: data?.[17]?.text ?? null,
    overDaysVprHigh: data?.[18]?.text ?? null,
    overDaysVprCritical: data?.[19]?.text ?? null,
  } as TenableVprFdvModel;
}

export function tenableVprMitigateDataModifier(data: any[], processingDate: Date): TenableVprMitigateModel {
  return {
    processingDate,
    currentMonthVprLow: data?.[0]?.text ?? null,
    currentMonthVprMedium: data?.[1]?.text ?? null,
    currentMonthVprHigh: data?.[2]?.text ?? null,
    currentMonthVprCritical: data?.[3]?.text ?? null,
    lastMonthVprLow: data?.[4]?.text ?? null,
    lastMonthVprMedium: data?.[5]?.text ?? null,
    lastMonthVprHigh: data?.[6]?.text ?? null,
    lastMonthVprCritical: data?.[7]?.text ?? null,
    currentQuarterVprLow: data?.[8]?.text ?? null,
    currentQuarterVprMedium: data?.[9]?.text ?? null,
    currentQuarterVprHigh: data?.[10]?.text ?? null,
    currentQuarterVprCritical: data?.[11]?.text ?? null,
    lastQuarterVprLow: data?.[12]?.text ?? null,
    lastQuarterVprMedium: data?.[13]?.text ?? null,
    lastQuarterVprHigh: data?.[14]?.text ?? null,
    lastQuarterVprCritical: data?.[15]?.text ?? null,
    overDaysVprLow: data?.[16]?.text ?? null,
    overDaysVprMedium: data?.[17]?.text ?? null,
    overDaysVprHigh: data?.[18]?.text ?? null,
    overDaysVprCritical: data?.[19]?.text ?? null,
  } as TenableVprMitigateModel;
}

export async function abnormalMessageDataModifier(messages: any[], processingDate: Date, httpCall: HttpCall, headers: { [key: string]: string }): Promise<AbnormalThreatsModel[]> {
  const payload: any[] = [];

  for (const message of messages) {
    const url: string = `${process.env.ABNORMAL_ENDPOINT}/v1/employee/${message?.recipientAddress ?? null}`;
    const [response]: any = await Promise.allSettled([httpCall.get({ headers, url, timeout: 10000 })]);

    payload.push({
      processingDate,
      threatId: message?.threatId ?? null,
      abxMessageId: message?.abxMessageId ?? null,
      abxPortalUrl: message?.abxPortalUrl ?? null,
      subject: message?.subject ?? null,
      fromAddress: message?.fromAddress ?? null,
      fromName: message?.fromName ?? null,
      toAddresses: message?.toAddresses ?? null,
      recipientAddress: message?.recipientAddress ?? null,
      receivedTime: message?.receivedTime ?? null,
      sentTime: message?.sentTime ?? null,
      internetMessageId: message?.internetMessageId ?? null,
      autoRemediated: message?.autoRemediated ?? null,
      postRemediated: message?.postRemediated ?? null,
      attackType: message?.attackType ?? null,
      attackStrategy: message?.attackStrategy ?? null,
      returnPath: message?.returnPath ?? null,
      replyToEmails: JSON.stringify(message?.replyToEmails ?? ''),
      impersonatedParty: message?.impersonatedParty ?? null,
      attackVector: message?.attackVector ?? null,
      summaryInsights: JSON.stringify(message?.summaryInsights ?? ''),
      remediationTimestamp: message?.remediationTimestamp ?? null,
      isRead: message?.isRead ?? null,
      attackedParty: message?.attackedParty ?? null,
      recipientName: response?.value?.data?.name ?? null,
      recipientTitle: response?.value?.data?.title ?? null,
    });
  }

  return payload;
}

export function abnormalCaseDataModifier(data: any[], processingDate: Date): AbnormalCasesModel[] {
  const payload: AbnormalCasesModel[] = [];

  data.map((value) => {
    payload.push({
      processingDate,
      caseId: value?.caseId ?? null,
      description: value?.description ?? null,
    } as AbnormalCasesModel);
  });

  return payload;
}
