'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/guides/services.html#core-services)
 * to customize this service
 */
const strapi = require('strapi');
const _ = require('lodash');
const dayjs = require('dayjs');

module.exports = {
  sponsorChild: async (child_id, sponsor_id) => {
    const stripe = require('stripe')(
      strapi.config.currentEnvironment['stripe_key']
    );

    let child = await strapi.services.child.fetch({ id: child_id });
    let sponsor = await strapi.services.sponsor.fetch({ id: sponsor_id });

    let child_pricing_plans = await stripe.plans.list({
      product: child.attributes.stripeProduct
    });

    return await stripe.subscriptions
      .create({
        customer: sponsor.attributes.stripeCustomer,
        items: [{ plan: child_pricing_plans.data[0].id }]
      })
      .then(async () => {
        // increase the child's sponsors count
        const activeSponsors = child.attributes.activeSponsors;
        child.attributes.activeSponsors = activeSponsors + 1;

        return child.save();
      });
  },

  addToGeneralFund: async sponsor_id => {
    const stripe = require('stripe')(
      strapi.config.currentEnvironment['stripe_key']
    );

    let sponsor = await strapi.services.sponsor.fetch({ id: sponsor_id });
    let general_pricing_plans = await stripe.plans.list({
      product: strapi.config.currentEnvironment['general_fund_product']
    });

    return await stripe.subscriptions.create({
      customer: sponsor.attributes.stripeCustomer,
      items: [{ plan: general_pricing_plans.data[0].id }]
    });
  },

  getCode: async email => {
    const sgMail = require('@sendgrid/mail');

    // generate a code
    const generateCode = () => {
      let numbers = '';

      for (let i = 0; i < 7; i++) {
        numbers += _.random(9);
      }

      return _.parseInt(numbers);
    };

    sgMail.setApiKey(strapi.config.currentEnvironment['sendgrid_key']);

    const code = generateCode();
    const msg = {
      to: email,
      from: 'eugenistoc@gmail.com',
      subject: "Verify Noah's Arc code",
      html: `
      <strong>Verify</strong>: Your code is ${code}
      <br>
      <a href="#">Click here to login</a>
      `
    };

    // Set User's temp code
    return Sponsor.query({ where: { email } })
      .fetch()
      .then(sponsor => {
        sponsor.set('temporaryPasscode', code);
        sponsor.set('passcodeGeneratedDate', dayjs());
        return sponsor.save().then(() => {
          return sgMail.send(msg);
        });
      });
  }
};
