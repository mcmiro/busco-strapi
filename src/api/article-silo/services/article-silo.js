'use strict';

const CATEGORY_UID = 'api::article-category.article-category';
const ARTICLE_UID = 'api::article.article';
const NESTED_UID = 'api::nested-article.nested-article';

const BASE_PAGINATION = {
  page: 1,
  pageSize: 25,
};

const SHARED_POPULATE = {
  seo: {
    populate: {
      ogImage: true,
    },
  },
  authorBox: {
    populate: {
      avatar: true,
    },
  },
  sections: {
    populate: {
      image: true,
      cta: true,
    },
  },
  coverImage: true,
  gallery: true,
};

const parseAcceptLanguage = (acceptLanguage) => {
  if (!acceptLanguage || typeof acceptLanguage !== 'string') {
    return null;
  }

  const first = acceptLanguage.split(',')[0] || '';
  const normalized = first.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  return normalized.split('-')[0] || null;
};

const parsePathSegments = (path) =>
  path
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);

const toPositiveInt = (value, fallback) => {
  const numeric = Number.parseInt(value, 10);

  if (Number.isNaN(numeric) || numeric <= 0) {
    return fallback;
  }

  return numeric;
};

const buildPagination = (query) => {
  const page = toPositiveInt(query.page, BASE_PAGINATION.page);
  const pageSize = toPositiveInt(query.pageSize, BASE_PAGINATION.pageSize);
  const start = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    start,
    limit: pageSize,
  };
};

const buildMeta = (total, page, pageSize) => ({
  pagination: {
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
    total,
  },
});

const mapCategoryPayload = (category) => ({
  id: category.id,
  documentId: category.documentId,
  locale: category.locale,
  type: 'category',
  title: category.title,
  slug: category.slug,
  canonicalPath: `/${category.slug}`,
  summary: category.summary || null,
  content: category.content || null,
  seo: category.seo || null,
  authorBox: category.authorBox || null,
  coverImage: category.coverImage || null,
  sections: category.sections || [],
});

const mapArticlePayload = (category, article) => ({
  id: article.id,
  documentId: article.documentId,
  locale: article.locale,
  type: 'article',
  title: article.title,
  slug: article.slug,
  canonicalPath: `/${category.slug}/${article.slug}`,
  summary: article.summary || null,
  content: article.content || null,
  seo: article.seo || null,
  authorBox: article.authorBox || null,
  coverImage: article.coverImage || null,
  gallery: article.gallery || [],
  sections: article.sections || [],
});

const mapNestedPayload = (category, article, nestedArticle) => ({
  id: nestedArticle.id,
  documentId: nestedArticle.documentId,
  locale: nestedArticle.locale,
  type: 'nested-article',
  title: nestedArticle.title,
  slug: nestedArticle.slug,
  canonicalPath: `/${category.slug}/${article.slug}/${nestedArticle.slug}`,
  summary: nestedArticle.summary || null,
  content: nestedArticle.content || null,
  seo: nestedArticle.seo || null,
  authorBox: nestedArticle.authorBox || null,
  coverImage: nestedArticle.coverImage || null,
  gallery: nestedArticle.gallery || [],
  sections: nestedArticle.sections || [],
});

module.exports = ({ strapi }) => ({
  resolveLocale(explicitLocale, acceptLanguage) {
    if (explicitLocale && typeof explicitLocale === 'string') {
      return explicitLocale;
    }

    return parseAcceptLanguage(acceptLanguage) || strapi.config.get('plugin.i18n.defaultLocale', 'en');
  },

  async resolve(path, locale) {
    const segments = parsePathSegments(path);

    if (segments.length < 1 || segments.length > 3) {
      return null;
    }

    const [categorySlug, articleSlug, nestedSlug] = segments;

    const category = await strapi.db.query(CATEGORY_UID).findOne({
      where: {
        slug: categorySlug,
        locale,
        publishedAt: {
          $notNull: true,
        },
      },
      populate: SHARED_POPULATE,
    });

    if (!category) {
      return null;
    }

    if (segments.length === 1) {
      return {
        nodeType: 'category',
        canonicalPath: `/${category.slug}`,
        breadcrumbs: [
          {
            type: 'category',
            title: category.title,
            slug: category.slug,
            path: `/${category.slug}`,
          },
        ],
        category: mapCategoryPayload(category),
      };
    }

    const article = await strapi.db.query(ARTICLE_UID).findOne({
      where: {
        slug: articleSlug,
        locale,
        publishedAt: {
          $notNull: true,
        },
        category: {
          id: category.id,
        },
      },
      populate: {
        ...SHARED_POPULATE,
        category: {
          select: ['id', 'slug', 'title'],
        },
      },
    });

    if (!article) {
      return null;
    }

    if (segments.length === 2) {
      return {
        nodeType: 'article',
        canonicalPath: `/${category.slug}/${article.slug}`,
        breadcrumbs: [
          {
            type: 'category',
            title: category.title,
            slug: category.slug,
            path: `/${category.slug}`,
          },
          {
            type: 'article',
            title: article.title,
            slug: article.slug,
            path: `/${category.slug}/${article.slug}`,
          },
        ],
        category: mapCategoryPayload(category),
        article: mapArticlePayload(category, article),
      };
    }

    const nestedArticle = await strapi.db.query(NESTED_UID).findOne({
      where: {
        slug: nestedSlug,
        locale,
        publishedAt: {
          $notNull: true,
        },
        parentArticle: {
          id: article.id,
        },
      },
      populate: {
        ...SHARED_POPULATE,
        parentArticle: {
          select: ['id', 'slug', 'title'],
        },
      },
    });

    if (!nestedArticle) {
      return null;
    }

    return {
      nodeType: 'nested-article',
      canonicalPath: `/${category.slug}/${article.slug}/${nestedArticle.slug}`,
      breadcrumbs: [
        {
          type: 'category',
          title: category.title,
          slug: category.slug,
          path: `/${category.slug}`,
        },
        {
          type: 'article',
          title: article.title,
          slug: article.slug,
          path: `/${category.slug}/${article.slug}`,
        },
        {
          type: 'nested-article',
          title: nestedArticle.title,
          slug: nestedArticle.slug,
          path: `/${category.slug}/${article.slug}/${nestedArticle.slug}`,
        },
      ],
      category: mapCategoryPayload(category),
      article: mapArticlePayload(category, article),
      nestedArticle: mapNestedPayload(category, article, nestedArticle),
    };
  },

  async listCategories(locale, query) {
    const pagination = buildPagination(query);

    const [items, total] = await strapi.db.query(CATEGORY_UID).findWithCount({
      where: {
        locale,
        publishedAt: {
          $notNull: true,
        },
      },
      select: ['id', 'documentId', 'title', 'slug', 'summary', 'locale'],
      orderBy: {
        title: 'asc',
      },
      offset: pagination.start,
      limit: pagination.limit,
    });

    return {
      items,
      meta: buildMeta(total, pagination.page, pagination.pageSize),
    };
  },

  async listArticles(locale, categorySlug, query) {
    const category = await strapi.db.query(CATEGORY_UID).findOne({
      where: {
        slug: categorySlug,
        locale,
        publishedAt: {
          $notNull: true,
        },
      },
      select: ['id', 'slug', 'title'],
    });

    if (!category) {
      return {
        items: [],
        meta: buildMeta(0, 1, BASE_PAGINATION.pageSize),
      };
    }

    const pagination = buildPagination(query);

    const [items, total] = await strapi.db.query(ARTICLE_UID).findWithCount({
      where: {
        locale,
        category: {
          id: category.id,
        },
        publishedAt: {
          $notNull: true,
        },
      },
      select: ['id', 'documentId', 'title', 'slug', 'summary', 'locale'],
      orderBy: {
        title: 'asc',
      },
      offset: pagination.start,
      limit: pagination.limit,
    });

    const mapped = items.map((item) => ({
      ...item,
      canonicalPath: `/${category.slug}/${item.slug}`,
    }));

    return {
      items: mapped,
      meta: buildMeta(total, pagination.page, pagination.pageSize),
    };
  },

  async listNestedArticles(locale, categorySlug, articleSlug, query) {
    const category = await strapi.db.query(CATEGORY_UID).findOne({
      where: {
        slug: categorySlug,
        locale,
        publishedAt: {
          $notNull: true,
        },
      },
      select: ['id', 'slug'],
    });

    if (!category) {
      return {
        items: [],
        meta: buildMeta(0, 1, BASE_PAGINATION.pageSize),
      };
    }

    const article = await strapi.db.query(ARTICLE_UID).findOne({
      where: {
        slug: articleSlug,
        locale,
        category: {
          id: category.id,
        },
        publishedAt: {
          $notNull: true,
        },
      },
      select: ['id', 'slug'],
    });

    if (!article) {
      return {
        items: [],
        meta: buildMeta(0, 1, BASE_PAGINATION.pageSize),
      };
    }

    const pagination = buildPagination(query);

    const [items, total] = await strapi.db.query(NESTED_UID).findWithCount({
      where: {
        locale,
        parentArticle: {
          id: article.id,
        },
        publishedAt: {
          $notNull: true,
        },
      },
      select: ['id', 'documentId', 'title', 'slug', 'summary', 'locale'],
      orderBy: {
        title: 'asc',
      },
      offset: pagination.start,
      limit: pagination.limit,
    });

    const mapped = items.map((item) => ({
      ...item,
      canonicalPath: `/${category.slug}/${article.slug}/${item.slug}`,
    }));

    return {
      items: mapped,
      meta: buildMeta(total, pagination.page, pagination.pageSize),
    };
  },
});
