## Context

The `LanguageSwitcher` component in `src/components/layout/Navigation.jsx` switches languages by prepending/removing `/en` from the current URL path. Blog posts have different slugs per language (e.g., PL: `srodowisko-agentowe-ai-dwie-firmy`, EN: `agentic-ai-environment-two-companies`), linked via `alternateSlug` in frontmatter. The data layer already supports this via `getAlternatePost()` and `getPostBySlug()` in `src/data/blogPosts.js`. The switcher just doesn't use it.

## Goals / Non-Goals

**Goals:**
- LanguageSwitcher navigates to the correct translated blog post URL when on a blog post page
- Fallback gracefully when no translation exists (stay on blog listing)

**Non-Goals:**
- Changing the data layer or frontmatter schema
- Handling language switching for non-blog dynamic routes (none exist currently)
- Adding visual indicators for missing translations

## Decisions

### 1. Detect blog post route by URL pattern matching

Extract the slug from the current path using a regex match on `/blog/:slug` or `/en/blog/:slug`, rather than importing React Router's `useParams` (which only works inside the matching route component).

**Rationale:** `LanguageSwitcher` lives in `Navigation`, which is outside the blog route hierarchy. `useParams` won't have the `slug` param. URL parsing is simpler and has no coupling to route config.

### 2. Lookup alternate post via existing `getPostBySlug` + `getAlternatePost`

When a blog slug is detected, call `getPostBySlug(slug)` to get the current post, then `getAlternatePost(slug)` to find the translation. Navigate to the alternate post's slug with the appropriate language prefix.

**Rationale:** Reuses existing, tested data functions. No new abstractions needed.

### 3. Fallback to blog listing if no alternate post found

If `getAlternatePost` returns null (no translation exists), navigate to `/en/blog` or `/blog` instead of showing a 404.

**Rationale:** Better UX than a dead page. User can find other content in the target language.

## Risks / Trade-offs

- **[Tight coupling to URL structure]** → If blog URL pattern changes, the regex needs updating. Mitigated by the fact that route structure is stable and defined in `App.jsx`.
- **[Import cost in Navigation]** → Importing from `blogPosts.js` in the navigation adds the blog data module to the nav bundle. Mitigated by the fact that blog data is already eagerly loaded at build time and shared across the app.
