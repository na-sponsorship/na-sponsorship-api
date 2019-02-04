'use strict';

/**
 * Sponsorship.js controller
 *
 * @description: A set of functions called "actions" for managing `Sponsorship`.
 */

module.exports = {

  /**
   * Retrieve sponsorship records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.sponsorship.search(ctx.query);
    } else {
      return strapi.services.sponsorship.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a sponsorship record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.sponsorship.fetch(ctx.params);
  },

  /**
   * Count sponsorship records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.sponsorship.count(ctx.query);
  },

  /**
   * Create a/an sponsorship record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.sponsorship.add(ctx.request.body);
  },

  /**
   * Update a/an sponsorship record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.sponsorship.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an sponsorship record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.sponsorship.remove(ctx.params);
  }
};
