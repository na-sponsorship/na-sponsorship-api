import { Injectable } from '@nestjs/common';
import * as mailgun from 'mailgun-js';

@Injectable()
export class MailgunService {
  private readonly mailgun: any;

  constructor() {
    this.mailgun = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
  }

  async sendEmail(subject: string, to: string, text: string) {
    return await new Promise((resolve, reject) => {
      this.mailgun.messages().send(
        {
          from: `Noah's Arc Support <support@noahsarc.org>`,
          to,
          subject,
          text,
          html: `<b>html format</b>`,
        },
        (err, blah) => {
          if (err) {
            reject(err);
          }
          resolve(blah);
        },
      );
    });
  }
}
