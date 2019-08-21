import {
  Controller,
  Post,
  Body,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import * as Stripe from 'stripe';

import { SponsorsService } from '../modules/shared/services/sponsors.service';
import { MailgunService } from '../modules/shared/services/vendors/mailgun.service';
import { StripeService } from '../modules/shared/services/vendors/stripe.service';
import { CreateSponsorDTO } from '../dto/sponsors/createSponsor.dto';
import { ChildrenService } from '../modules/shared/services/children.service';
import { Child } from '../entities/child.entity';
import { PAYMENT_TYPES } from 'src/dto/sponsors/payment.dto';

@Controller('sponsors')
export class SponsorsController {
  constructor(
    private readonly sponsorService: SponsorsService,
    private readonly childrenService: ChildrenService,
    private readonly mailerService: MailgunService,
    private readonly stripeService: StripeService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() sponsor: CreateSponsorDTO) {
    const child: Child = await this.childrenService.findOne(sponsor.childId);
    const childPricingPlan: Stripe.plans.IPlan = await this.childrenService.getPricingPlan(
      child,
    );
    /**
     * @TODO Don't allow multiple customers with same email address
     * 1. Save sponsors (stripeCustomerId and email) on our end
     * 2. In future when we roll acounts, its easier to manage children and payment info
     */

    switch (sponsor.payment.type) {
      case PAYMENT_TYPES.recurring: {
        /**
         * 1 Create stripe customer
         * Subscribe customer to the child's product pricing plan
         */
        const CUSTOMER: Stripe.customers.ICustomerCreationOptions = {
          name: `${sponsor.sponsor.firstName} ${sponsor.sponsor.lastName}`,
          email: sponsor.sponsor.email,
          address: sponsor.sponsor.address,
          source: sponsor.payment.stripeToken,
        };
        const stripeCustomer = await this.stripeService.createCustomer(
          CUSTOMER,
        );
        const SUBSCRIPTION: Stripe.subscriptions.ISubscriptionCreationOptions = {
          customer: stripeCustomer.id,
          items: [{ plan: childPricingPlan.id }],
        };
        if (sponsor.payment.extraAmount) {
          SUBSCRIPTION.items.push({ plan: process.env.NA_GENERAL_FUND_PLAN });
        }

        await this.stripeService.createSubscription(SUBSCRIPTION);

        // Save this sponsor to our db for future account feature and to prevent duplicate customers
        break;
      }
      case PAYMENT_TYPES.single: {
        const CHARGE: Stripe.charges.IChargeCreationOptions = {
          // Stripe doesn't take decimals, so the last two digits are always the cents
          amount: Number(sponsor.payment.singleDonationAmount + '00'),
          currency: 'USD',
          description: `${sponsor.sponsor.firstName} ${
            sponsor.sponsor.lastName
          } single donation`,
          metadata: {
            Child: `${child.firstName} ${child.lastName}`,
          },
          receipt_email: sponsor.sponsor.email,
          source: sponsor.payment.stripeToken,
          statement_descriptor: `noahs-arc-${child.firstName}`,
        };

        if (sponsor.payment.extraAmount) {
          CHARGE.amount += 500;
        }

        await this.stripeService.createCharge(CHARGE);
        break;
      }
    }
  }
  // @UseInterceptors(ClassSerializerInterceptor)

  // @Post('/requestCode')
  // async requestCode(@Body() requestCodeDTO: requestCodeDTO) {
  //   const code: string = await this.sponsorService.generateCode(requestCodeDTO);

  //   await this.mailerService.sendEmail(code);
  //   // schedule a task to remove the temp code to disable login (10 min?)
  //   return 'requesting code';
  // }

  // @Post('/verifyCode')
  // async verifyCode(@Body() verifyCodeDTO: VerifyCodeDTO) {
  //   if (await this.sponsorService.maximumLoginAttemptsReached(verifyCodeDTO)) {
  //     return 'maximum login attempts';
  //   }

  //   return await this.sponsorService.verifyCode(verifyCodeDTO);
  // }
}
