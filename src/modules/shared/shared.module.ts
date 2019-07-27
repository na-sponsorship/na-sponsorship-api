import { Module } from '@nestjs/common';

import { StripeController } from './controllers/stripe.controller';
import { StripeService } from './services/vendors/stripe.service';
import { MailgunService } from './services/vendors/mailgun.service';
import { ChildrenService } from './services/children.service';
import { SponsorsService } from './services/sponsors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child } from '../../entities/child.entity';
import { Sponsor } from '../../entities/sponsor.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Child, Sponsor]),
  ],
  controllers: [StripeController],
  providers: [StripeService, MailgunService, ChildrenService, SponsorsService],
  exports: [MailgunService, StripeService, ChildrenService, SponsorsService],
})
export class SharedModule {}
