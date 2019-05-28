import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import * as Stripe from 'stripe';

@Injectable()
export class StripeService {
  stripe: Stripe;

  constructor(private readonly config: ConfigService) {
    this.stripe = new Stripe(config.get('stripe').apiKey);
  }

  createCustomer(customer: Stripe.customers.ICustomer): string {
    return 'create customer';
    // no-op
  }

  createProduct(product: Stripe.products.IProduct) {
    // no-op
  }
}
