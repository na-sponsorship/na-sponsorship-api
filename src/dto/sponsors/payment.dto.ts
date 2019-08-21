export const enum PAYMENT_TYPES {
  recurring = 'recurring',
  single = 'single',
}

export class PaymentDTO {
  readonly type: PAYMENT_TYPES;
  readonly singleDonationAmount: number;
  readonly stripeToken: string;
  readonly extraAmount: boolean;
}
