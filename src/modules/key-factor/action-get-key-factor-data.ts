import { HttpCall, HttpCallResponse } from '../../utils/http-call';
import dayjs from 'dayjs';
import { jobLogger } from '../../utils/logger';
import _ from 'lodash';
import { CronLogModel } from '../../models/cron-log/cron-log';
import { createLogService } from '../../utils/dal';
import { KeyFactor, KeyFactorModel } from '../../models/key-factor/key-factor';
import { EmailService } from '../../utils/email';

async function getKeyFactorData(): Promise<void> {
  const log: CronLogModel = {} as CronLogModel;
  const serviceType: string = 'KEY_FACTOR';
  const processingDate: Date = dayjs().toDate();
  jobLogger.info(`getKeyFactorData - Execute - ${processingDate}`);

  // create email service instance
  const emailService: EmailService = new EmailService();
  try {
    const httpCall: HttpCall = new HttpCall();

    const headers: { [key: string]: string } = {
      Authorization: `Basic ${process.env.KF_API_TOKEN}`,
    };

    const response: HttpCallResponse = await httpCall.get({
      url: process.env.KF_CERTIFICATE_URL,
      headers,
    });

    const keyFactorDataToInsert: KeyFactorModel[] = response.data.map((data: any) => {
      return {
        processingDate,
        keyFactorId: data.Id,
        thumbPrint: data.Thumbprint,
        serialNumber: data.SerialNumber,
        issuedDn: data.IssuedDN,
        issuedCn: data.IssuedCN,
        notBefore: data.NotBefore ? dayjs(data.NotBefore).toDate() : null,
        notAfter: data.NotAfter ? dayjs(data.NotAfter).toDate() : null,
        issuerDn: data.IssuerDN,
        principalId: data.PrincipalId,
        templateId: data.TemplateId,
        certState: data.CertState,
        keySizeInBits: data.KeySizeInBits,
        keyType: data.KeyType,
        requesterId: data.RequesterId,
        issuedOu: data.IssuedOU,
        issuedEmail: data.IssuedEmail,
        keyUsage: data.KeyUsage,
        signingAlgorithm: data.SigningAlgorithm,
        certStateString: data.CertStateString,
        keyTypeString: data.KeyTypeString,
        revocationEffDate: data.RevocationEffDate ? dayjs(data.RevocationEffDate).toDate() : null,
        revocationReason: data.RevocationReason,
        revocationComment: data.RevocationComment,
        certificateAuthorityId: data.CertificateAuthorityId,
        certificateAuthorityName: data.CertificateAuthorityName,
        templateName: data.TemplateName,
        archivedKey: data.ArchivedKey,
        hasPrivateKey: data.HasPrivateKey,
        principalName: data.PrincipalName,
        certRequestId: data.CertRequestId,
        requesterName: data.RequesterName,
      };
    });

    await KeyFactor.bulkCreate(keyFactorDataToInsert);

    log.response = `keyFactor records: ${keyFactorDataToInsert.length}`;
    log.isSuccess = true;
  } catch (error) {
    const errorMsg: string = `getKeyFactorData - error - ${processingDate} : ${error.message}, ${error.stack}`;

    log.response = errorMsg;
    log.isSuccess = false;
    jobLogger.error(errorMsg);

    await emailService.sendEmail({
      template: 'job-error',
      subject: 'Error - Key Factor Job',
      nameFrom: process.env.EMAIL_SENDER_NAME,
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: process.env.EMAIL_RECEIVER_ADDRESS,
      emailDetail: {
        processingDate,
        errorMsg: error?.response?.data ? JSON.stringify(error?.response?.data) : error.message,
        method: 'getKeyFactorData',
        meta: 'Key Factor Data',
      },
    });
  } finally {
    jobLogger.info(`getKeyFactorData - Execute Final Block - ${processingDate}`);
    log.serviceType = serviceType;
    log.processingDate = processingDate;

    await createLogService(log);
  }
}

export { getKeyFactorData };
