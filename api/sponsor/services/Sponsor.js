/* global Sponsor */
'use strict';

const strapi = require('strapi');

/**
 * Sponsor.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

// Strapi utilities.
const utils = require('strapi-hook-bookshelf/lib/utils/');
const { convertRestQueryParams, buildQuery } = require('strapi-utils');


module.exports = {

  /**
   * Promise to fetch all sponsors.
   *
   * @return {Promise}
   */

  fetchAll: (params, populate) => {
    // Select field to populate.
    const withRelated = populate || Sponsor.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    const filters = convertRestQueryParams(params);

    return Sponsor.query(buildQuery({ model: Sponsor, filters }))
      .fetchAll({ withRelated })
      .then(data => data.toJSON());
  },

  /**
   * Promise to fetch a/an sponsor.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Sponsor.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Sponsor.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    });
  },

  /**
   * Promise to count a/an sponsor.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = convertRestQueryParams(params);

    return Sponsor.query(buildQuery({ model: Sponsor, filters: _.pick(filters, 'where') })).count();
  },

  /**
   * Promise to add a/an sponsor.
   *
   * @return {Promise}
   */

  add: async (sponsorData) => {
    const stripe = require('stripe')(strapi.config.currentEnvironment['stripe_key']);

    let customer = {
      address: sponsorData.address,
      email: sponsorData.email,
      description: 'Child Sponsor',
      source: sponsorData.payment.token,
      name: `${sponsorData.firstName} ${sponsorData.lastName}`
    };

    // Create a stripe customer
    return stripe.customers.create(customer).then(async (stripeCustomer) => {
      let subscription;

      let data = {
        stripeCustomer: stripeCustomer.id,
        email: sponsorData.email,
      };

      const newSponsor = await Sponsor.forge(data).save();

      // Sponsor child
      subscription = await strapi.services.sponsor.sponsorChild(sponsorData.child_id, newSponsor.id);

      // Contribute to general fund if the selected the option
      if (sponsorData.payment.extraMonthly) {
        return strapi.services.sponsor.addToGeneralFund(newSponsor.id);
      } else {
        return subscription;
      }
    });
  },

  sponsorChild: async (child_id, sponsor_id) => {
    const stripe = require('stripe')(strapi.config.currentEnvironment['stripe_key']);

    let child = await strapi.services.child.fetch({ id: child_id });
    let sponsor = await strapi.services.sponsor.fetch({ id: sponsor_id });

    let child_pricing_plans = await stripe.plans.list({ product: child.attributes.stripeProduct });

    return await stripe.subscriptions.create({
      customer: sponsor.attributes.stripeCustomer,
      items: [
        { plan: child_pricing_plans.data[0].id }
      ]
    }).then(async () => {
      // increase the child's sponsors count
      const activeSponsors = child.attributes.activeSponsors;
      child.attributes.activeSponsors = activeSponsors + 1;

      return child.save();
    });
  },

  addToGeneralFund: async (sponsor_id) => {
    const stripe = require('stripe')(strapi.config.currentEnvironment['stripe_key']);

    let sponsor = await strapi.services.sponsor.fetch({ id: sponsor_id });
    let general_pricing_plans = await stripe.plans.list({ product: strapi.config.currentEnvironment['general_fund_product'] });


    return await stripe.subscriptions.create({
      customer: sponsor.attributes.stripeCustomer,
      items: [
        { plan: general_pricing_plans.data[0].id }
      ]
    });
  },

  /**
   * Promise to edit a/an sponsor.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Sponsor.associations.map(ast => ast.alias));
    const data = _.omit(values, Sponsor.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Sponsor.forge(params).save(data);

    // Create relational data and return the entry.
    return Sponsor.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an sponsor.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Sponsor.associations.map(association => {
      switch (association.nature) {
        case 'oneWay':
        case 'oneToOne':
        case 'manyToOne':
        case 'oneToManyMorph':
          params.values[association.alias] = null;
          break;
        case 'oneToMany':
        case 'manyToMany':
        case 'manyToManyMorph':
          params.values[association.alias] = [];
          break;
        default:
      }
    });

    await Sponsor.updateRelations(params);

    return Sponsor.forge(params).destroy();
  },

  /**
   * Promise to search a/an sponsor.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('sponsor', params);
    // Select field to populate.
    const populate = Sponsor.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    const associations = Sponsor.associations.map(x => x.alias);
    const searchText = Object.keys(Sponsor._attributes)
      .filter(attribute => attribute !== Sponsor.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['string', 'text'].includes(Sponsor._attributes[attribute].type));

    const searchInt = Object.keys(Sponsor._attributes)
      .filter(attribute => attribute !== Sponsor.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['integer', 'decimal', 'float'].includes(Sponsor._attributes[attribute].type));

    const searchBool = Object.keys(Sponsor._attributes)
      .filter(attribute => attribute !== Sponsor.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['boolean'].includes(Sponsor._attributes[attribute].type));

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Sponsor.query(qb => {
      if (!_.isNaN(_.toNumber(query))) {
        searchInt.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query)}`);
        });
      }

      if (query === 'true' || query === 'false') {
        searchBool.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query === 'true')}`);
        });
      }

      // Search in columns with text using index.
      switch (Sponsor.client) {
        case 'mysql':
          qb.orWhereRaw(`MATCH(${searchText.join(',')}) AGAINST(? IN BOOLEAN MODE)`, `*${query}*`);
          break;
        case 'pg': {
          const searchQuery = searchText.map(attribute =>
            _.toLower(attribute) === attribute
              ? `to_tsvector(${attribute})`
              : `to_tsvector('${attribute}')`
          );

          qb.orWhereRaw(`${searchQuery.join(' || ')} @@ to_tsquery(?)`, query);
          break;
        }
      }

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      if (filters.skip) {
        qb.offset(_.toNumber(filters.skip));
      }

      if (filters.limit) {
        qb.limit(_.toNumber(filters.limit));
      }
    }).fetchAll({
      withRelated: populate
    });
  }
};
