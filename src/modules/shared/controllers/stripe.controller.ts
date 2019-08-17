import { Controller, Post, Body, Headers, Req, Request } from '@nestjs/common';
import * as Stripe from 'stripe';

import { StripeService } from '../services/vendors/stripe.service';

@Controller('/stripe')
export class StripeController {
  private readonly stripeService: StripeService;

  constructor(stripeService: StripeService) {
    this.stripeService = stripeService;
  }

  @Post('/webhook')
  webhook(@Body() req: any, @Headers('stripe-signature') stripeSignature: any): void {
    const event: Stripe.events.IEvent = this.stripeService.verifyEvent(req, stripeSignature);

    switch (event.type) {
      case 'product.deleted':
        // Soft delte product
        break;
    }
  }
}
