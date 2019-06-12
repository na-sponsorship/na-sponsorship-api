"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/guides/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  needingSponsorship: async ctx => {
    return strapi.services.child.needingSponsorship();
  },
  
  sponsorChild: async (ctx, next) => {
    return strapi.services.child.sponsorChild(ctx.request.body);
  },
  test: (ctx, next) => {
    return 'test'
  }
};
