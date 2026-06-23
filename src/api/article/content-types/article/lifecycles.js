'use strict';

const { errors } = require('@strapi/utils');

const { ApplicationError } = errors;
const UID = 'api::article.article';

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

const ensureUniqueArticleSlug = async (event, existing) => {
  const data = event.params?.data || {};
  const slug = data.slug || existing?.slug;

  if (!slug) {
    return;
  }

  const locale = resolveRecordLocale(data, existing);
  const categoryId = readRelationId(data.category) || existing?.category?.id;

  if (!categoryId) {
    return;
  }

  const currentId = existing?.id || null;

  const conflict = await strapi.db.query(UID).findOne({
    where: {
      slug,
      locale,
      category: { id: categoryId },
      ...(currentId ? { id: { $ne: currentId } } : {}),
    },
    select: ['id'],
  });

  if (conflict) {
    throw new ApplicationError(
      `Article slug \"${slug}\" already exists in this category for locale \"${locale}\".`
    );
  }
};

module.exports = {
  async beforeCreate(event) {
    await ensureUniqueArticleSlug(event, null);
  },

  async beforeUpdate(event) {
    const where = event.params?.where || {};

    const existing = await strapi.db.query(UID).findOne({
      where,
      select: ['id', 'slug', 'locale'],
      populate: {
        category: {
          select: ['id'],
        },
      },
    });

    if (!existing) {
      return;
    }

    await ensureUniqueArticleSlug(event, existing);
  },
};
