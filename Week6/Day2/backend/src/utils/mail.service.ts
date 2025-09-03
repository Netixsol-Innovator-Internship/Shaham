import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER;

    const info = await this.transporter.sendMail({
      from: `"My App" <${fromAddress}>`,
      to,
      subject,
      text,
      html,
    });

    this.logger.log('Email sent: ' + info.messageId);
    return info;
  }
}
