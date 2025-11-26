import Logger from '@shared/helpers/Logger';
import { transporter } from './transporter';

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
      console.error('Error occured while sending the email: ' + err);

      throw err;
    });
};
