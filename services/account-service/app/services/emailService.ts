import { Logger } from 'shared-backend';
import { nodemailerTransporter } from '../utils/nodemailerTransporter';
import { AppError } from 'shared-backend';
import { EResponseStatus } from 'shared-types';

export interface IEmailOptions {
  email: string;
  subject: string;
  html: string;
}

export const sendMail = async (options: IEmailOptions) => {
  const { email, subject, html } = options;

  await nodemailerTransporter
    .sendMail({
      from: process.env.APP_NAME,
      to: email,
      subject,
      html,
    })
    .then(() => {
      Logger.info(`Email successfully sent to: ${email}`);
    })
    .catch((err: string) => {
      Logger.error('Error occured while sending the email - ' + err);

      throw new AppError(
        500,
        EResponseStatus.ERROR_EMAIL_SEND_FAILED,
        'Error occured while sending the email, please try again later.',
      );
    });
};
