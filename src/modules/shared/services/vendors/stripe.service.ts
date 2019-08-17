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
  ): Promise<Stripe.customers.ICustomer> {
    return await this.stripe.customers.create(customer);
  }

  async createProduct(
    product: Stripe.products.IProductCreationOptions,
  ): Promise<string> {
    const PRODUCT = await this.stripe.products.create(product);

    return PRODUCT.id;
  }

  async addPricingPlan(amount: number, productId: string): Promise<void> {
    const PLAN: Stripe.plans.IPlanCreationOptions = {
      currency: 'USD',
      interval: 'month',
      product: productId,
      amount,
    };

    await this.stripe.plans.create(PLAN);
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
