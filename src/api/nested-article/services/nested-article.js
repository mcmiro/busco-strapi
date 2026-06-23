'use strict';

/**
 * nested-article service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::nested-article.nested-article');
