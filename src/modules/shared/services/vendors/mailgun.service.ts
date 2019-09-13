import { Injectable, Logger } from '@nestjs/common';

import * as mailgun from 'mailgun-js';
import * as maizzle from '@maizzle/framework';
import * as path from 'path';
import * as fs from 'fs';
import * as deepmerge from 'deepmerge';
import * as tailwindConfig from '../../../../../emails/tailwind.config.js';
import * as maizzleConfigProduction from '../../../../../emails/config.production.js';
import * as maizzleConfigBase from '../../../../../emails/config.js';
import { SentryLogger } from '../../../../sentry.logger';

@Injectable()
export class MailgunService {
  private readonly mailgun: any;

  constructor(private logger: SentryLogger) {
    this.mailgun = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
  }

  async sendEmail(
    subject: string,
    to: string,
    emailInput: string,
    emailTemplate: string,
  ): Promise<boolean> {
    const ppp = path.join(`emails/src/templates/${emailTemplate}`);
    const file = fs.readFileSync(ppp, { encoding: 'utf-8' });

    const html = await maizzle.render(file, {
      tailwind: {
        config: tailwindConfig,
      },
      maizzle: {
        config: deepmerge(
          maizzleConfigBase,
          deepmerge(maizzleConfigProduction, { emailInput }),
        ),
      },
    });

    return await new Promise((resolve, reject) => {
      this.mailgun.messages().send(
        {
          from: `Noah's Arc <support@noahsarc.org>`,
          to,
          subject,
          html,
        },
        err => {
          if (err) {
            this.logger.warn(err.message);
            resolve(true);
          }
          resolve(true);
        },
      );
    });
  }
}
