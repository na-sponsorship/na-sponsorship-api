import { Module } from '@nestjs/common';

import { StripeController } from './controllers/stripe.controller';
import { StripeService } from './services/vendors/stripe.service';
import { MailgunService } from './services/vendors/mailgun.service';

@Module({
  controllers: [StripeController],
  providers: [
  ],
  controllers: [StripeController],
  providers: [StripeService, MailgunService, ChildrenService, SponsorsService],
  exports: [MailgunService, StripeService, ChildrenService, SponsorsService],
})
export class SharedModule { }
