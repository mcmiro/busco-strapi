'use strict';

/**
 * town service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::town.town');
