import { Controller, Get } from '@nestjs/common';
import * as Stripe from 'stripe';

import { StripeService } from '../services/stripe.service';

@Controller('/stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @Get()
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
}
