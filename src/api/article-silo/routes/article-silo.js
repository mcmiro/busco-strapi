'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/article-silo/resolve',
      handler: 'article-silo.resolve',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/article-silo/categories',
      handler: 'article-silo.categories',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/article-silo/articles',
      handler: 'article-silo.articles',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/article-silo/nested-articles',
      handler: 'article-silo.nestedArticles',
      config: {
        auth: false,
      },
    },
  ],
};
