'use strict';

/**
 * Sponsor.js controller
 *
 * @description: A set of functions called "actions" for managing `Sponsor`.
 */

module.exports = {

  /**
   * Retrieve sponsor records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.sponsor.search(ctx.query);
    } else {
      return strapi.services.sponsor.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a sponsor record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.sponsor.fetch(ctx.params);
  },

  /**
   * Count sponsor records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.sponsor.count(ctx.query);
  },

  /**
   * Create a/an sponsor record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.sponsor.add(ctx.request.body);
  },

  /**
   * Update a/an sponsor record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.sponsor.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an sponsor record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.sponsor.remove(ctx.params);
  }
};
