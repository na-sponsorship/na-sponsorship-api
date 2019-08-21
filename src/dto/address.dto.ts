
import * as Stripe from 'stripe';

// tslint:disable: variable-name
export class AddressDTO implements Stripe.IAddress {
  readonly line1: string;
  readonly city: string;
  readonly postal_code: string;
  readonly state: string;
}
