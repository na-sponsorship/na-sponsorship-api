import { Injectable } from '@nestjs/common';
import * as Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_APIKEY);
  }

  async createCustomer(customer: Stripe.customers.ICustomerCreationOptions): Promise<Stripe.customers.ICustomer> {
    return await this.stripe.customers.create(customer);
  }

  async createProduct(product: Stripe.products.IProductCreationOptions): Promise<string> {
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

  async getPlans(productId: string): Promise<Stripe.IList<Stripe.plans.IPlan>> {
    return await this.stripe.plans.list({
      limit: 1,
      product: productId,
    });
  }

  async createSubscription(subscription: Stripe.subscriptions.ISubscriptionCreationOptions): Promise<Stripe.subscriptions.ISubscription> {
    return await this.stripe.subscriptions.create(subscription);
  }

  async createCharge(charge: Stripe.charges.IChargeCreationOptions): Promise<Stripe.charges.ICharge> {
    return await this.stripe.charges.create(charge);
  }

  public verifyEvent(rawEvent: string, signature: string): Stripe.events.IEvent {
    return this.stripe.webhooks.constructEvent(rawEvent, signature, process.env.STRIPE_WBHOOK_SIGNATURE);
  }
}
