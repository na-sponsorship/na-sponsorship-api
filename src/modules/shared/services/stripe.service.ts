import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import * as Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly config: ConfigService;
  private readonly stripe: Stripe;

  constructor(config: ConfigService) {
    this.stripe = new Stripe(config.get('stripe').APIKEY);
    this.config = config;
  }

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
      this.config.get('stripe').WBHOOK_SIGNATURE,
    );
  }
}
