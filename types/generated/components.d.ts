import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsBenefit extends Struct.ComponentSchema {
  collectionName: 'components_elements_benefits';
  info: {
    displayName: 'Benefit';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsCta extends Struct.ComponentSchema {
  collectionName: 'components_elements_ctas';
  info: {
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsHashtag extends Struct.ComponentSchema {
  collectionName: 'components_elements_hashtags';
  info: {
    displayName: 'hashtag';
    icon: 'hashtag';
  };
  attributes: {
    tag: Schema.Attribute.String;
  };
}

export interface ElementsHorizontalCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_horizontal_cards';
  info: {
    displayName: 'Horizontal Card';
  };
  attributes: {
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    cta: Schema.Attribute.Component<'elements.cta', false>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    tags: Schema.Attribute.Component<'elements.hashtag', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PagesHeadlineTextImage extends Struct.ComponentSchema {
  collectionName: 'components_pages_headline_text_images';
  info: {
    description: '';
    displayName: 'Headline Text Image';
  };
  attributes: {
    content: Schema.Attribute.Text;
    cta: Schema.Attribute.Component<'elements.cta', false>;
    headline: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    subline: Schema.Attribute.String;
  };
}

export interface PagesHeadlineTextSingle extends Struct.ComponentSchema {
  collectionName: 'components_pages_headline_text_single_s';
  info: {
    description: '';
    displayName: 'Headline Text';
  };
  attributes: {
    content: Schema.Attribute.Text;
    headline: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PagesHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_pages_hero_sections';
  info: {
    description: '';
    displayName: 'Hero Section';
  };
  attributes: {
    benefits: Schema.Attribute.Component<'elements.benefit', true>;
    headline: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    rating: Schema.Attribute.Decimal;
    subline: Schema.Attribute.String;
  };
}

export interface PagesSeo extends Struct.ComponentSchema {
  collectionName: 'components_pages_seos';
  info: {
    displayName: 'SEO';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    jsonLd: Schema.Attribute.Text;
    ogImage: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.benefit': ElementsBenefit;
      'elements.cta': ElementsCta;
      'elements.hashtag': ElementsHashtag;
      'elements.horizontal-card': ElementsHorizontalCard;
      'pages.headline-text-image': PagesHeadlineTextImage;
      'pages.headline-text-single': PagesHeadlineTextSingle;
      'pages.hero-section': PagesHeroSection;
      'pages.seo': PagesSeo;
    }
  }
}
