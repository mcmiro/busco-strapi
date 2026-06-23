'use strict';

module.exports = {
  async resolve(ctx) {
    const path = (ctx.query.path || '').toString();

    if (!path.trim()) {
      return ctx.badRequest('Query parameter "path" is required.');
    }

    const service = strapi.service('api::article-silo.article-silo');
    const locale = service.resolveLocale(ctx.query.locale, ctx.request.headers['accept-language']);
    const result = await service.resolve(path, locale);

    if (!result) {
      return ctx.notFound('No published article silo content found for the provided path.');
    }

    ctx.body = {
      data: result,
    };
  },

  async categories(ctx) {
    const service = strapi.service('api::article-silo.article-silo');
    const locale = service.resolveLocale(ctx.query.locale, ctx.request.headers['accept-language']);
    const result = await service.listCategories(locale, ctx.query);

    ctx.body = {
      data: result.items,
      meta: result.meta,
    };
  },

  async articles(ctx) {
    const service = strapi.service('api::article-silo.article-silo');
    const locale = service.resolveLocale(ctx.query.locale, ctx.request.headers['accept-language']);
    const categorySlug = (ctx.query.categorySlug || '').toString();

    if (!categorySlug.trim()) {
      return ctx.badRequest('Query parameter "categorySlug" is required.');
    }

    const result = await service.listArticles(locale, categorySlug, ctx.query);

    ctx.body = {
      data: result.items,
      meta: result.meta,
    };
  },

  async nestedArticles(ctx) {
    const service = strapi.service('api::article-silo.article-silo');
    const locale = service.resolveLocale(ctx.query.locale, ctx.request.headers['accept-language']);
    const categorySlug = (ctx.query.categorySlug || '').toString();
    const articleSlug = (ctx.query.articleSlug || '').toString();

    if (!categorySlug.trim() || !articleSlug.trim()) {
      return ctx.badRequest('Query parameters "categorySlug" and "articleSlug" are required.');
    }

    const result = await service.listNestedArticles(locale, categorySlug, articleSlug, ctx.query);

    ctx.body = {
      data: result.items,
      meta: result.meta,
    };
  },
};
