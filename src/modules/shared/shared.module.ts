import { Module } from '@nestjs/common';

import { StripeController } from './controllers/stripe.controller';
import { StripeService } from './services/stripe.service';
import { MailerService } from './services/mailer.service';

@Module({
  imports: [],
  controllers: [StripeController],
  providers: [
    StripeService,
    MailerService,
  ],
  exports: [MailerService]
})
export class SharedModule { }
