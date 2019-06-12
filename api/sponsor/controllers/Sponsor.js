"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/guides/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  getCode: async (ctx, next) => {
    return strapi.services.sponsor.getCode(ctx.request.body.email);
  }
};
