import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  constructor() {
    console.log('initializing mailer')
  }

  async sendEmail(code: string) {
    console.log('sending email...' + code);
  }
}
