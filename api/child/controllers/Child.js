'use strict';

/**
 * Child.js controller
 *
 * @description: A set of functions called "actions" for managing `Child`.
 */

module.exports = {

  /**
   * Retrieve child records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.child.search(ctx.query);
    } else {
      return strapi.services.child.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a child record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.child.fetch(ctx.params);
  },

  needingSponsorship: async (ctx) => {

    return strapi.services.child.needingSponsorship();
  },

  count: async (ctx) => {
    return strapi.services.child.count(ctx.query);
  },

  /**
   * Create a/an child record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.child.add(ctx.request.body);
  },

  /**
   * Update a/an child record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.child.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an child record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.child.remove(ctx.params);
  },
};
