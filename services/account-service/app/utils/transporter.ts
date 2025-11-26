import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  // @ts-expect-error - nodemailer irrelevant type error
  host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port: process.env.SMTP_PORT ?? '465',
  secure: true,
  auth: {
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
  },
});
