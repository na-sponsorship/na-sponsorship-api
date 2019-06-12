"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/guides/services.html#core-services)
 * to customize this service
 */

module.exports = {
  needingSponsorship: () => {
    return Child.query()
      .select()
      .whereRaw("?? < ??", ["activeSponsors", "sponsorsNeeded"])
      .count()
      .then(result => {
        return result[0].count;
      });
  },

  sponsorChild: async sponsorship => {
    return strapi.services.sponsor.add(sponsorship);
  },

  createStripeProduct: async child => {
    const stripe = require("stripe")(
      strapi.config.currentEnvironment["stripe_key"]
    );

    return await stripe.products.create({
      name: `${child.firstName} ${child.lastName} (Child)`,
      type: "service",
      statement_descriptor: "NoahsArc-ChildSponsor"
    });
  },

  addPricingPlan: async child_product_id => {
    const stripe = require("stripe")(
      strapi.config.currentEnvironment["stripe_key"]
    );

    // Create plan
    await stripe.plans.create({
      amount: 3000,
      currency: "usd",
      interval: "month",
      product: child_product_id
    });
  }
};
