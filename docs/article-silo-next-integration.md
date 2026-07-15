# Navigation Integration (Strapi Plugin)

The previous custom article silo handling was removed.

Removed:

- Custom API `article-silo`
- Custom API `page-tree`
- Custom recursive `page` collection
- Custom lifecycle logic for `article-category`, `article`, and `nested-article`

Current direction:

- Use `strapi-plugin-navigation` for hierarchical navigation/page tree handling.

## What this means

1. No custom resolver endpoint exists anymore for nested article paths.
2. Hierarchy should now be managed in the Navigation plugin UI.
3. Article collections are no longer linked by custom parent/child relations.

## Recommended Next.js integration path

1. Query navigation structure from the plugin API.
2. Resolve routes on frontend using navigation items.
3. Fetch content entries separately by their target content type and slug.

## Note

If you still need strict URL-to-content resolving in one API call, add it later as a thin adapter around plugin data, not as a custom nested collection architecture.
