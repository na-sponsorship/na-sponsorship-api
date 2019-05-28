import { Module } from '@nestjs/common';

import { StripeController } from './controllers/stripe.controller';
import { StripeService } from './services/stripe.service';

@Module({
  imports: [],
  controllers: [StripeController],
  providers: [
    StripeService,
  ],
})
export class SharedModule { }
