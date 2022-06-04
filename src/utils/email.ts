import nodemailer from 'nodemailer';
import Email from 'email-templates';
import 'dotenv/config';
import { logger } from './logger';

export class EmailService {
  private transporter: nodemailer.Transporter;
  _email: Email;
  errorTransporter: any;
  private _errorEmail: Email<any>;

  constructor() {
    //service like Gmail,SendGrid or any other
    this.transporter = nodemailer.createTransport({
      secure: Number(process.env.SMTP_PORT) == 465 ? true : false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      host: process.env.SMTP_ENDPOINT,
      tls: {
        rejectUnauthorized: false,
      },
    });
    this.errorTransporter = nodemailer.createTransport({
      secure: Number(process.env.SMTP_PORT) == 465 ? true : false, // true for 465, false for other ports
      auth: {
        user: process.env.ERROR_EMAIL_SMTP_USERNAME,
        pass: process.env.ERROR_EMAIL_SMTP_PASSWORD,
      },
      host: process.env.ERROR_EMAIL_SMTP_HOST,
      tls: {
        rejectUnauthorized: false,
      },
    });
    this._email = new Email({
      views: { root: './src/templates', options: { extension: 'twig' } },
      message: {
        from: process.env.EMAIL_FROM,
      },
      i18n: {},
      transport: this.transporter,
      preview: false,
      send: true,
    });
    this._errorEmail = new Email({
      views: { root: './src/templates', options: { extension: 'twig' } },
      message: {
        from: process.env.ERROR_EMAIL_FROM,
      },
      i18n: {},
      transport: this.errorTransporter,
      preview: false,
      send: true,
    });
  }

  async sendEmail(props: { template: string; nameFrom: string; from: string; to: string; subject: string; emailDetail: any; replyTo?: string; nameReply?: string }): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this._email
        .send({
          template: `${props.template}`,
          message: {
            from: { name: props.nameFrom, address: props.from },
            to: [props.to],
            replyTo: { name: props.nameReply, address: props.replyTo },
            subject: `${process.env.NODE_ENV != 'production' ? process.env.NODE_ENV : ''} ${props.subject}`,
          },
          locals: {
            ...props.emailDetail,
          },
        })
        .then((info) => {
          logger.info(`email send ${info}`);
          resolve(info);
        })
        .catch((error) => {
          logger.error(error);
          reject(error);
        });
    });
  }
}
