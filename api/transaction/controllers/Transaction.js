'use strict';

/**
 * Transaction.js controller
 *
 * @description: A set of functions called "actions" for managing `Transaction`.
 */

module.exports = {

  /**
   * Retrieve transaction records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.transaction.search(ctx.query);
    } else {
      return strapi.services.transaction.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a transaction record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.transaction.fetch(ctx.params);
  },

  /**
   * Count transaction records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.transaction.count(ctx.query);
  },

  /**
   * Create a/an transaction record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.transaction.add(ctx.request.body);
  },

  /**
   * Update a/an transaction record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.transaction.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an transaction record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.transaction.remove(ctx.params);
  }
};
