import { Injectable } from '@nestjs/common';
import * as Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {}

  createCustomer(customer: Stripe.customers.ICustomer): string {
    // const customer = await Stripe.resources.
    return 'create customer';
    // no-op
  }

  createProduct(product: Stripe.products.IProduct) {
    // no-op
  }

  public verifyEvent(
    rawEvent: string,
    signature: string,
  ): Stripe.events.IEvent {
    return this.stripe.webhooks.constructEvent(
      rawEvent,
      signature,
      process.env.STRIPE_WBHOOK_SIGNATURE,
    );
  }
}
