import { Injectable } from '@nestjs/common';
import * as Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_APIKEY);
  }

  async createCustomer(
    customer: Stripe.customers.ICustomerCreationOptions,
  ): Promise<string> {
    const CUSTOMER = await this.stripe.customers.create(customer);

    return CUSTOMER.id;
  }

  async createProduct(
    product: Stripe.products.IProductCreationOptions,
  ): Promise<string> {
    const PRODUCT = await this.stripe.products.create(product);

    return PRODUCT.id;
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
