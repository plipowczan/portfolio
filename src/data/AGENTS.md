# AGENTS.md — src/data/

## Purpose

The boundary between markdown files on disk and the rest of the application:
content loaders plus the hand-maintained static data modules.

## Ownership

**Owns:** `blogPosts.js`, `coursePosts.js`, `courseFaq.js`,
`coursePrerequisites.js`, `projects.js`, `skills.js`, `testimonials.js` — the
loading, validation, and shape of everything they export.

**Does not own:** the markdown itself (`src/content/`), the generator that reads
it (`scripts/generate-content.mjs`, owned by `scripts/AGENTS.md`), or how the
data is rendered (`src/pages/`, `src/components/`).

`README.md` in this folder is the Polish human guide to the blog loader. Where
it and this file disagree, this file is binding.

## Local Contracts

### Loading mechanism

Content is read at **build time** by `scripts/generate-content.mjs`, a Vite
plugin that runs on `buildStart` and watches `src/content/**` in dev. It writes
`src/data/generated/`:

- `index.js` — every frontmatter field **except** the body, plus one lazy
  `import()` per article and lesson,
- `blog/<lang>-<slug>.js` and `kurs/<slug>.js` — one module per body.

`blogPosts.js` and `coursePosts.js` read that index. `loadPostContent(lang, slug)`
and `loadLessonContent(slug)` resolve a single body; components reach them
through `src/hooks/useContentBody.js`, never directly.

Adding a markdown file is still enough — no registry to update, no import list.

**No markdown body and no frontmatter parser ship in the client bundle.** The
eager `import.meta.glob(..., { eager: true, query: "?raw" })` that used to do
this compiled all 43 files into the initial payload; every visitor paid for the
whole library on every route. `src/data/generated/` is a build artifact and is
gitignored — the generator is idempotent, so any build corrects a stale one.

Two contracts hang off that boundary and are enforced elsewhere:

- Prerendered article and lesson HTML must contain the body. A route with a body
  sets `data-content-ready` on `<html>` (`src/utils/prerenderMarker.js`) and
  `scripts/prerender.mjs` fails the build if it does not appear.
- The initial payload has a ceiling: `scripts/check-payload-budget.mjs`.

### Exclusion rules

A candidate file is skipped when its filename:

- ends with `*_wsad.md` (input/draft files), or
- starts with `_` (templates and scratch), or
- is in `DOC_FILES` — `README.md`, `AGENTS.md`, `CLAUDE.md`.

`DOC_FILES` exists because documentation lives inside the content folders and is
also `.md`, so every reader catches it. Without the exclusion a doc is parsed as
a post or a lesson and fails validation, and `scripts/update-sitemap.js` dies
outright on the missing `date` with `Invalid time value`.

The same set is repeated in `scripts/generate-content.mjs`,
`scripts/course-lessons.mjs`, `scripts/update-sitemap.js`,
`scripts/prerender.mjs`, and `scripts/generate-llms-txt.js`. Adding a doc
filename means updating all five.

### Boundary validation

Frontmatter is validated in `scripts/generate-content.mjs`, at build time, and
a violation **fails the build** naming the file and the problem:

- **Blog** — a missing required field, a non-numeric `id`, or an unusable `slug`.
  Bad optional `description` or `modified` values warn and are ignored.
- **Course** — a missing `slug`, `order`, `title`, or `excerpt`, a non-numeric
  `order`, or a non-string `excerpt`, so a lesson can never ship with an empty
  meta description.

The blog loader used to catch per file, log, and drop the malformed post. That
was strictly worse: validation running in the browser can only fail after the
page has already shipped, and the dropped post disappeared silently.

`getAlternatePost(slug, lang)` resolves a translation pair by slug **and**
language, because slugs are not unique across locales. Calling it without `lang`
logs an error and returns `null` — omitted metadata beats metadata pointing at
the wrong URL.

### Static data

`projects.js`, `skills.js`, `testimonials.js`, `courseFaq.js`, and
`coursePrerequisites.js` export plain arrays and objects. Treat loaded data as
immutable, keep numeric ids unique, and use `YYYY-MM-DD` for every date.

## Work Guidance

- Adding a field to the frontmatter schema means changing the validator in
  `scripts/generate-content.mjs`, the index entry it emits, **and** the owning
  content doc (`src/content/blog/AGENTS.md` or `src/content/kurs/AGENTS.md`) in
  the same change.
- A field a listing, the sitemap, or a metadata surface reads belongs in the
  index. Anything only the article page needs stays in the body.
- Never silently swallow a parse failure without naming the file that failed.
- Polish copy inside `courseFaq.js` follows
  `.claude/rules/content/10-prosty-polski.md`.

## Verification

```bash
node scripts/generate-content.mjs   # regenerates the index; a bad file throws
npm run build                       # generator runs on buildStart
npm test                            # Playwright, incl. blog listing and hreflang
```

## Child DOX Index
