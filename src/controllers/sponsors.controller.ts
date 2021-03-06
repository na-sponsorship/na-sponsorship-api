import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, HttpException, HttpStatus } from '@nestjs/common';
import * as Stripe from 'stripe';
import * as dayjs from 'dayjs';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';

import { MailgunService } from '../modules/shared/services/vendors/mailgun.service';
import { StripeService } from '../modules/shared/services/vendors/stripe.service';
import { CreateSponsorDTO } from '../dto/sponsors/createSponsor.dto';
import { ChildrenService } from '../modules/shared/services/children.service';
import { Child } from '../entities/child.entity';
import { PAYMENT_TYPES } from '../dto/sponsors/payment.dto';
import { CloudinaryService } from '../modules/shared/services/vendors/cloudinary.service';
import { INewSubscriptionEmail } from '../interfaces/new-subscription-email.interface';
import { Repository } from 'typeorm';
import { Sponsor } from '../entities/sponsor.entity';
import { InjectRepository } from '@nestjs/typeorm';

dayjs.extend(advancedFormat);
@Controller('sponsors')
export class SponsorsController {
  constructor(
    private readonly childrenService: ChildrenService,
    private readonly mailerService: MailgunService,
    private readonly stripeService: StripeService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Child) private readonly childRepository: Repository<Child>,
    @InjectRepository(Sponsor) private readonly sponsorRepository: Repository<Sponsor>,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() sponsor: CreateSponsorDTO) {
    const child: Child = await this.childRepository.findOne(sponsor.childId);
    const childPricingPlan: Stripe.plans.IPlan = await this.childrenService.getPricingPlan(child);

    if (child.archived) {
      throw new HttpException('Sponsorship not allowed', HttpStatus.FORBIDDEN);
    }

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
        };
        const stripeCustomer = await this.stripeService.createOrRetrieveCustomer(CUSTOMER);

        const paymentSource = await this.stripeService.addPaymentSource(stripeCustomer, sponsor.payment.stripeToken);

        const SUBSCRIPTION: Stripe.subscriptions.ISubscriptionCreationOptions = {
          customer: stripeCustomer.id,
          items: [{ plan: childPricingPlan.id }],
          default_source: paymentSource.id,
        };

        if (sponsor.payment.extraAmount) {
          SUBSCRIPTION.items.push({ plan: process.env.NA_GENERAL_FUND_PLAN });
        }

        await this.stripeService.createSubscription(SUBSCRIPTION);

        // Send Welcome email
        const email: INewSubscriptionEmail = {
          childName: child.name,
          childImage: await this.cloudinaryService.getImageUrl(child.image),
          firstPaymentDate: dayjs().format('MMMM D, YYYY'),
          recurringPaymentDate: dayjs().format('Do'),
          amount: Math.floor(childPricingPlan.amount / 100),
          summary: `Child Sponsorship${sponsor.payment.extraAmount ? ' + $5 ministry donation' : ''}`,
        };

        await this.mailerService.sendEmail("Welcome to Noah's Arc", sponsor.sponsor.email, email, 'new-sponsor-welcome-recurring.njk');

        // Create sponsor on local db if not exisiting
        let newSponsor: Sponsor = await this.sponsorRepository.findOne({
          where: { email: sponsor.sponsor.email, firstName: sponsor.sponsor.firstName, lastName: sponsor.sponsor.lastName },
        });

        if (!newSponsor) {
          newSponsor = this.sponsorRepository.create({
            email: sponsor.sponsor.email,
            stripeCustomer: stripeCustomer.id,
            firstName: sponsor.sponsor.firstName,
            lastName: sponsor.sponsor.lastName,
          });

          await this.sponsorRepository.save(newSponsor);
        }

        child.sponsors.push(newSponsor);

        break;
      }
      case PAYMENT_TYPES.single: {
        const CHARGE: Stripe.charges.IChargeCreationOptions = {
          // Stripe doesn't take decimals, so the last two digits are always the cents
          amount: Number(sponsor.payment.singleDonationAmount + '00'),
          currency: 'USD',
          description: `${sponsor.sponsor.firstName} ${sponsor.sponsor.lastName} single donation`,
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

    child.activeSponsors += 1;

    if (child.activeSponsors >= child.sponsorsNeeded) {
      child.archived = true;
    }
    this.childrenService.save(child);
  }
}
