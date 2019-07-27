import { Controller, Post, Body, Headers, Req, Request } from '@nestjs/common';
import * as Stripe from 'stripe';

import { StripeService } from '../services/vendors/stripe.service';

@Controller('/stripe')
export class StripeController {
  private readonly stripeService: StripeService;

  constructor(stripeService: StripeService) {
    this.stripeService = stripeService;
  }

  @Post()
  getHello(): string {
    const customer: Stripe.customers.ICustomer = {
      address: null,
      created: 0,
      currency: null,
      default_source: null,
      delinquent: false,
      livemode: false,
      shipping: null,
      subscriptions: null,
      metadata: null,
      id: null,
      object: null,
    };
    return this.stripeService.createCustomer(customer);
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
