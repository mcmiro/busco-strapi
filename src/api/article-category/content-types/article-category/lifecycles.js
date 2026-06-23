'use strict';

const { errors } = require('@strapi/utils');

const { ApplicationError } = errors;
const UID = 'api::article-category.article-category';

const resolveRecordLocale = (data, existing) =>
  data.locale || existing?.locale || strapi.config.get('plugin.i18n.defaultLocale', 'en');

const ensureUniqueCategorySlug = async (event, existing) => {
  const data = event.params?.data || {};
  const slug = data.slug || existing?.slug;

  if (!slug) {
    return;
  }

  const locale = resolveRecordLocale(data, existing);
  const currentId = existing?.id || null;

  const conflict = await strapi.db.query(UID).findOne({
    where: {
      slug,
      locale,
      ...(currentId ? { id: { $ne: currentId } } : {}),
    },
    select: ['id'],
  });

  if (conflict) {
    throw new ApplicationError(`Category slug \"${slug}\" already exists for locale \"${locale}\".`);
  }
};

module.exports = {
  async beforeCreate(event) {
    await ensureUniqueCategorySlug(event, null);
  },

  async beforeUpdate(event) {
    const where = event.params?.where || {};
    const existing = await strapi.db.query(UID).findOne({
      where,
      select: ['id', 'slug', 'locale'],
    });

    if (!existing) {
      return;
    }

    await ensureUniqueCategorySlug(event, existing);
  },
};
