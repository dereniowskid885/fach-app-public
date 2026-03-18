import Logger from '@shared/utils/Logger';
import { transporter } from './transporter';
import { AppError } from '@shared/utils/AppError';
import { EResponseStatus } from '@shared/enums/responseStatus';

export interface IEmailOptions {
  email: string;
  subject: string;
  html: string;
}

export const sendMail = async (options: IEmailOptions) => {
  const { email, subject, html } = options;

  await transporter
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
