# AGENTS.md — src/data/

## Purpose

The boundary between markdown files on disk and the rest of the application:
content loaders plus the hand-maintained static data modules.

## Ownership

**Owns:** `blogPosts.js`, `coursePosts.js`, `courseFaq.js`,
`coursePrerequisites.js`, `projects.js`, `skills.js`, `testimonials.js` — the
loading, validation, and shape of everything they export.

**Does not own:** the markdown itself (`src/content/`) or how the data is
rendered (`src/pages/`, `src/components/`).

`README.md` in this folder is the Polish human guide to the blog loader. Where
it and this file disagree, this file is binding.

## Local Contracts

### Loading mechanism

Content is loaded eagerly at build time with Vite glob imports — never with a
hand-maintained import list. Adding a markdown file is enough; no registry to
update.

```javascript
const blogFilesPl = import.meta.glob("../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
```

`blogPosts.js` globs `../content/blog/*.md` and `../content/blog/en/*.md`;
`coursePosts.js` globs `../content/kurs/*.md`.

### Exclusion rules

A globbed file is skipped when its filename:

- ends with `*_wsad.md` (input/draft files), or
- starts with `_` (templates and scratch), or
- is in `DOC_FILES` — `README.md`, `AGENTS.md`, `CLAUDE.md`.

`DOC_FILES` exists because documentation lives inside the content folders and is
also `.md`, so every glob catches it. Without the exclusion a doc is parsed as a
post or a lesson: the loaders log and drop it, but `scripts/update-sitemap.js`
dies outright on the missing `date` with `Invalid time value`.

The same set is repeated in `src/data/coursePosts.js`,
`scripts/update-sitemap.js`, `scripts/prerender.mjs`, and
`scripts/generate-llms-txt.js`. Adding a doc filename means updating all five.

### Boundary validation

Frontmatter is validated here, not by the caller, and the two loaders fail
differently on purpose:

- **Blog** — a missing required field or a non-numeric `id` throws; the error is
  caught per file, logged, and that post is dropped. One malformed post never
  takes the site down. Bad optional `description` or `modified` values warn and
  are ignored.
- **Course** — a missing `slug`, `order`, `title`, or `excerpt`, a non-numeric
  `order`, or a non-string `excerpt` throws, so a lesson can never ship with an
  empty meta description.

`getAlternatePost(slug, lang)` resolves a translation pair by slug **and**
language, because slugs are not unique across locales. Calling it without `lang`
logs an error and returns `null` — omitted metadata beats metadata pointing at
the wrong URL.

### Static data

`projects.js`, `skills.js`, `testimonials.js`, `courseFaq.js`, and
`coursePrerequisites.js` export plain arrays and objects. Treat loaded data as
immutable, keep numeric ids unique, and use `YYYY-MM-DD` for every date.

## Work Guidance

- Adding a field to the frontmatter schema means changing the validator here
  **and** the owning content doc (`src/content/blog/AGENTS.md` or
  `src/content/kurs/AGENTS.md`) in the same change.
- Never silently swallow a parse failure without logging which file failed.
- Polish copy inside `courseFaq.js` follows
  `.claude/rules/content/10-prosty-polski.md`.

## Verification

```bash
npm run build   # a loader throw fails the build
npm test        # Playwright, incl. the blog listing and hreflang specs
```

## Child DOX Index
