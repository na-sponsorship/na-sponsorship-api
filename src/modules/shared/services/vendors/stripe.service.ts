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

  async createOrRetrieveCustomer(customer: Stripe.customers.ICustomerCreationOptions): Promise<Stripe.customers.ICustomer> {
    const existingCustomer: Stripe.customers.ICustomer = await (await this.stripe.customers.list({ limit: 1, email: customer.email })).data[0];

    // If same email and name, return existing customer
    if (existingCustomer && existingCustomer.name === customer.name) {
      return existingCustomer;
    }

    // Create a new customer
    return await this.createCustomer(customer);
  }

  async addPaymentSource(customer: Stripe.customers.ICustomer, token: string): Promise<Stripe.IStripeSource> {
    return await this.stripe.customers.createSource(customer.id, { source: token });
  }

  async createProduct(product: Stripe.products.IProductCreationOptions): Promise<string> {
    const PRODUCT = await this.stripe.products.create(product);

    return PRODUCT.id;
  }

  async deleteProduct(product: Stripe.products.IProduct): Promise<void> {
    await this.stripe.products.del(product.id);
  }

  async deletePricingPlan(plan: Stripe.plans.IPlan): Promise<void> {
    await this.stripe.plans.del(plan.id);
  }

  async cancelSubscription(subscription: Stripe.subscriptions.ISubscription): Promise<void> {
    await this.stripe.subscriptions.del(subscription.id);
  }

  async findProductById(id: string): Promise<Stripe.products.IProduct> {
    return await this.stripe.products.retrieve(id);
  }

  async findPlansByProductId(productId: string): Promise<Stripe.IList<Stripe.plans.IPlan>> {
    return await this.stripe.plans.list({ product: productId });
  }

  async findSubscriptionsByPlanId(planId: string): Promise<Stripe.IList<Stripe.subscriptions.ISubscription>> {
    return await this.stripe.subscriptions.list({ plan: planId });
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
