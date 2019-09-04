import {
  Controller,
  Post,
  Body,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as request from 'request-promise';
import { MailgunService } from '../modules/shared/services/vendors/mailgun.service';

@Controller('app')
export class AppController {
  constructor(private readonly mailgunService: MailgunService) {}

  @Post('contact')
  async contact(@Body() message: any, @Headers('recaptcha') token) {
    const captchaIsValid = await request({
      uri: 'https://www.google.com/recaptcha/api/siteverify',
      method: 'POST',
      form: {
        secret: process.env.RECAPTCHA_SECRET,
        response: token,
      },
      transform: body => JSON.parse(body),
    }).then(({ success }) => success);

    if (!captchaIsValid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.mailgunService.sendEmail('Thank you', message.email, message.message);
  }
}
