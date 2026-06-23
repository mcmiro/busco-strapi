'use strict';

const { errors } = require('@strapi/utils');

const { ApplicationError } = errors;
const UID = 'api::nested-article.nested-article';

const resolveRecordLocale = (data, existing) =>
  data.locale || existing?.locale || strapi.config.get('plugin.i18n.defaultLocale', 'en');

const readRelationId = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return Number(value);
  }

  if (typeof value === 'object') {
    if (typeof value.id === 'number') {
      return value.id;
    }

    if (Array.isArray(value.connect) && value.connect[0]) {
      return value.connect[0].id || null;
    }
  }

  return null;
};

const ensureUniqueNestedSlug = async (event, existing) => {
  const data = event.params?.data || {};
  const slug = data.slug || existing?.slug;

  if (!slug) {
    return;
  }

  const locale = resolveRecordLocale(data, existing);
  const parentArticleId = readRelationId(data.parentArticle) || existing?.parentArticle?.id;

  if (!parentArticleId) {
    return;
  }

  const currentId = existing?.id || null;

  const conflict = await strapi.db.query(UID).findOne({
    where: {
      slug,
      locale,
      parentArticle: { id: parentArticleId },
      ...(currentId ? { id: { $ne: currentId } } : {}),
    },
    select: ['id'],
  });

  if (conflict) {
    throw new ApplicationError(
      `Nested article slug \"${slug}\" already exists under this article for locale \"${locale}\".`
    );
  }
};

module.exports = {
  async beforeCreate(event) {
    await ensureUniqueNestedSlug(event, null);
  },

  async beforeUpdate(event) {
    const where = event.params?.where || {};

    const existing = await strapi.db.query(UID).findOne({
      where,
      select: ['id', 'slug', 'locale'],
      populate: {
        parentArticle: {
          select: ['id'],
        },
      },
    });

    if (!existing) {
      return;
    }

    await ensureUniqueNestedSlug(event, existing);
  },
};
