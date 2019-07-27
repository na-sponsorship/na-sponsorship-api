import { Injectable } from '@nestjs/common';

@Injectable()
export class MailgunService {
  constructor() {
    
  }

  async sendEmail(code: string) {
    console.log('sending email...' + code);
  }
}
