import type { Schema, Attribute } from '@strapi/strapi';

export interface ElementsBenefit extends Schema.Component {
  collectionName: 'components_elements_benefits';
  info: {
    displayName: 'Benefit';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
  };
}

export interface ElementsCta extends Schema.Component {
  collectionName: 'components_elements_ctas';
  info: {
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    url: Attribute.String & Attribute.Required;
  };
}

export interface ElementsHashtag extends Schema.Component {
  collectionName: 'components_elements_hashtags';
  info: {
    displayName: 'hashtag';
    icon: 'hashtag';
  };
  attributes: {
    tag: Attribute.String;
  };
}

export interface ElementsHorizontalCard extends Schema.Component {
  collectionName: 'components_elements_horizontal_cards';
  info: {
    displayName: 'Horizontal Card';
  };
  attributes: {
    tags: Attribute.Component<'elements.hashtag', true>;
    image: Attribute.Media & Attribute.Required;
    title: Attribute.String & Attribute.Required;
    content: Attribute.Text & Attribute.Required;
    cta: Attribute.Component<'elements.cta'>;
  };
}

export interface PagesHeadlineTextImage extends Schema.Component {
  collectionName: 'components_pages_headline_text_images';
  info: {
    displayName: 'Headline Text Image';
    description: '';
  };
  attributes: {
    headline: Attribute.String & Attribute.Required;
    content: Attribute.Text;
    image: Attribute.Media;
    subline: Attribute.String;
    cta: Attribute.Component<'elements.cta'>;
  };
}

export interface PagesHeadlineTextSingle extends Schema.Component {
  collectionName: 'components_pages_headline_text_single_s';
  info: {
    displayName: 'Headline Text';
    description: '';
  };
  attributes: {
    headline: Attribute.String & Attribute.Required;
    content: Attribute.Text;
  };
}

export interface PagesHeroSection extends Schema.Component {
  collectionName: 'components_pages_hero_sections';
  info: {
    displayName: 'Hero Section';
    description: '';
  };
  attributes: {
    subline: Attribute.String;
    headline: Attribute.String & Attribute.Required;
    rating: Attribute.Decimal;
    image: Attribute.Media & Attribute.Required;
    benefits: Attribute.Component<'elements.benefit', true>;
  };
}

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
