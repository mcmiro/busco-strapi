import type { Schema, Attribute } from '@strapi/strapi';

export interface PagesSeo extends Schema.Component {
  collectionName: 'components_pages_seos';
  info: {
    displayName: 'SEO';
    icon: 'bulletList';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
    ogImage: Attribute.Media;
    jsonLd: Attribute.Text;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'pages.seo': PagesSeo;
    }
  }
}
