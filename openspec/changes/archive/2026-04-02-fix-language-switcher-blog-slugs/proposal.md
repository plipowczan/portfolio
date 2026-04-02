## Why

The `LanguageSwitcher` component naively prepends/removes the `/en` prefix from the current URL path. This works for static pages (`/` → `/en/`, `/blog` → `/en/blog`) but breaks on blog post pages where the slug differs between languages. For example, switching from `/blog/srodowisko-agentowe-ai-dwie-firmy` navigates to `/en/blog/srodowisko-agentowe-ai-dwie-firmy` which doesn't exist — the correct English URL is `/en/blog/agentic-ai-environment-two-companies`. This affects 19 out of 22 blog posts (only 3 have identical PL/EN slugs).

## What Changes

- Modify `LanguageSwitcher` to detect when user is on a blog post page (`/blog/:slug` or `/en/blog/:slug`)
- When on a blog post page, look up the `alternateSlug` via existing `getAlternatePost()` function and navigate to the correct translated URL
- For all other pages, keep the current prefix-based behavior unchanged

## Capabilities

### New Capabilities

- `language-aware-blog-navigation`: LanguageSwitcher resolves blog post alternate slugs when switching languages, using the existing `alternateSlug` frontmatter field and `getAlternatePost()` utility

### Modified Capabilities

_None — no existing spec-level requirements change._

## Impact

- **Code**: `src/components/layout/Navigation.jsx` — `LanguageSwitcher` component
- **Data dependency**: `src/data/blogPosts.js` — `getAlternatePost()`, `getPostBySlug()` (already exist, no changes needed)
- **Risk**: Low — change is isolated to navigation logic, data layer is untouched
