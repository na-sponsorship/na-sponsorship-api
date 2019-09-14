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
  async contact(@Body() emailInput: any, @Headers('recaptcha') token) {
    const captchaIsValid = await request({
      uri: 'https://www.google.com/recaptcha/api/siteverify',
      method: 'POST',
      form: {
        secret: process.env.RECAPTCHA_SECRET,
        response: token,
      },
      transform: body => JSON.parse(body),
    });

    if (!captchaIsValid.success) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    // Send email to Admin
    await this.mailgunService.sendEmail(
      'Noah\'s Arc: Contact Form',
      process.env.ADMIN_EMAIL,
      emailInput,
      'contact-form.njk',
    );

    // Send email to person that used contactform
    await this.mailgunService.sendEmail(
      'Thank you for contacting Noah\'s Arc',
      emailInput.email,
      emailInput,
      'contact-form-thankyou.njk',
    );
  }
}
