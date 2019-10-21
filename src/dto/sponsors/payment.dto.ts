import { Expose } from "class-transformer";

export const enum PAYMENT_TYPES {
  recurring = 'recurring',
  single = 'single',
}

export class PaymentDTO {
  @Expose() readonly type: PAYMENT_TYPES;
  @Expose() readonly singleDonationAmount: number;
  @Expose() readonly stripeToken: string;
  @Expose() readonly extraAmount: boolean;
}
