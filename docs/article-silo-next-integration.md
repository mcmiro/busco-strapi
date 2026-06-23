# Article Silo Integration (Strapi -> Next.js)

This project now includes a 3-level article silo content architecture for SEO-first pages:

- `/{category}`
- `/{category}/{article-slug}`
- `/{category}/{article-slug}/{nested-article}`

Locale is not part of the path and should be sent via query/header.

## 1. Content Model

### Collections

1. `article-category`
- Top-level silo category
- Optional page content + sections
- Includes `seo` and `authorBox`

2. `article`
- Child of `article-category`
- Optional page content + sections
- Includes `seo` and `authorBox`

3. `nested-article`
- Child of `article`
- Optional page content + sections
- Includes `seo` and `authorBox`

### Component Reuse

- Existing SEO component: `pages.seo`
- Existing visual section block: `pages.headline-text-image`
- New author component: `elements.author-box`

## 2. Slug Rules

Slug uniqueness is enforced in lifecycle hooks:

- `article-category.slug` unique per `locale`
- `article.slug` unique per `category + locale`
- `nested-article.slug` unique per `parentArticle + locale`

## 3. Public API Endpoints

Base: `/api`

### Resolve path to page payload

`GET /api/article-silo/resolve?path={category}/{article}/{nested?}&locale=de`

- `path` is required
- `locale` optional
- if locale is missing, resolver uses `Accept-Language` header, otherwise default locale
- draft parent blocks child visibility automatically because resolver only returns published chain items

#### Example (article level)

`GET /api/article-silo/resolve?path=travel-guides/airport-transfer&locale=de`

Response shape:

```json
{
  "data": {
    "nodeType": "article",
    "canonicalPath": "/travel-guides/airport-transfer",
    "breadcrumbs": [
      {
        "type": "category",
        "title": "Travel Guides",
        "slug": "travel-guides",
        "path": "/travel-guides"
      },
      {
        "type": "article",
        "title": "Airport Transfer",
        "slug": "airport-transfer",
        "path": "/travel-guides/airport-transfer"
      }
    ],
    "category": { "...": "category payload" },
    "article": { "...": "article payload" }
  }
}
```

### List categories

`GET /api/article-silo/categories?locale=de&page=1&pageSize=25`

### List articles in category

`GET /api/article-silo/articles?locale=de&categorySlug=travel-guides&page=1&pageSize=25`

### List nested articles in article

`GET /api/article-silo/nested-articles?locale=de&categorySlug=travel-guides&articleSlug=airport-transfer&page=1&pageSize=25`

## 4. Next.js App Router Integration

Use a catch-all route:

- `app/[...slug]/page.tsx`

### Request strategy

1. Join route segments into `path`
2. Request resolver endpoint with locale
3. Render by `nodeType`

Minimal example:

```ts
const path = params.slug.join('/');
const locale = searchParams.locale ?? 'de';

const res = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/article-silo/resolve?path=${encodeURIComponent(path)}&locale=${locale}`,
  { next: { revalidate: 300 } }
);

if (!res.ok) {
  notFound();
}

const { data } = await res.json();
```

### Metadata mapping

Use `seo` from resolved node:

- `seo.title` -> `metadata.title`
- `seo.description` -> `metadata.description`
- `seo.ogImage` -> `openGraph.images`
- `seo.jsonLd` -> inject as JSON-LD script in page

Canonical URL should use `data.canonicalPath`.

## 5. Rendering Rules

All content fields are optional by design. Frontend should guard null values:

- `content` may be null
- `sections` may be empty
- `authorBox` may be null
- `coverImage` and `gallery` may be absent

Recommended rendering order:

1. Hero/title
2. Author box
3. Main rich content
4. Headline-text-image sections
5. Related links from listing endpoints

## 6. Editorial Workflow

1. Create/publish category first
2. Create article under category
3. Create nested article under article
4. Fill SEO on every level (strongly recommended)
5. Publish from top to bottom to ensure the resolver chain is visible

## 7. SEO Checklist

For each category/article/nested page:

1. Fill `seo.title` (unique and intent-matching)
2. Fill `seo.description`
3. Set `seo.ogImage`
4. Add structured data to `seo.jsonLd` where relevant
5. Keep slugs short, readable, and stable
6. Avoid changing slugs after indexing (or set redirects in frontend)
