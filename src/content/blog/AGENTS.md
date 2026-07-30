# AGENTS.md — src/content/blog/

## Purpose

Markdown source for every blog article. Polish articles sit directly in this
folder; their English counterparts sit in `en/`. Nothing here is generated at
build time — these files are the source of truth for `/blog` and `/blog/:slug`.

## Ownership

**Owns:** article markdown, the frontmatter contract, the FAQ section shape, and
the PL↔EN pairing.

**Does not own:** parsing and validation (`src/data/blogPosts.js`, see
`src/data/AGENTS.md`), rendering (`src/pages/BlogPostPage.jsx`), sitemap
generation (`scripts/update-sitemap.js`), or OG image tooling (`scripts/`).

`README.md` in this folder is the Polish human guide. Where it and this file
disagree, this file is binding.

## Local Contracts

### Frontmatter — required

Every published `.md` file carries all nine fields. A missing field throws at
load time and the post disappears from the site.

```yaml
---
id: 1                                   # unique integer
slug: my-article-slug                   # URL-friendly, unique per language
title: Article Title
excerpt: Short summary (150-200 chars)  # SEO <meta description> and previews
category: Automation                    # single category
author: Pawel Lipowczan
date: 2025-11-15                        # YYYY-MM-DD, datePublished
readTime: 8 min
image: /images/og-my-article.webp       # absolute path into public/
tags:                                   # list; warns and falls back to [] if absent
  - Tag1
  - Tag2
---
```

### Frontmatter — optional

- `description` (string) — `BlogPosting.description` in JSON-LD. Absent, the
  schema generator takes the first paragraph (~300 chars, cut at a word
  boundary). `excerpt` remains the HTML `<meta description>` / SERP snippet;
  `description` is the longer semantic summary for schema consumers.
- `modified` (`YYYY-MM-DD`) — `BlogPosting.dateModified`,
  `<meta property="article:modified_time">`, and `<lastmod>` in `public/sitemap.xml`.
  Absent, all three fall back to `date`. Bump it on real content changes only,
  not cosmetic edits.
- `lang` (`pl` | `en`) — defaults to `pl`. Every file in `en/` sets `lang: en`.
- `alternateSlug` (string) — slug of the translated counterpart. Two hard rules:
  1. Set it **only** when a symmetric file exists in the other locale
     (`src/content/blog/en/<slug>.md` for a PL post, `src/content/blog/<slug>.md`
     for an EN post) **and** that file points back with its own
     `alternateSlug`. It may equal the post's own `slug` when the counterpart
     genuinely uses the same name — `getAlternatePost(slug, lang)` resolves the
     pair by slug *and* language, so identical names are fine. What is never
     acceptable is pointing at a slug with no file in the other locale: the pair
     resolves to nothing and the post loses its hreflang.
  2. Every post is PL-only by default. Translation is a deliberate separate
     step. Only once `src/content/blog/en/<en-slug>.md` exists do both sides get
     `alternateSlug`. Prefer omitting the field over guessing.

### FAQ section

Optional but recommended for AEO. `src/utils/faqExtractor.js` detects it by an
H2 heading containing "FAQ" or "Najczęściej zadawane pytania", reads H3 headings
as questions and the following paragraphs as answers, and emits FAQPage schema.

```markdown
## FAQ

### [Natural question in Polish, 10-25 words]

[Snippet-style answer, 2-4 sentences. Key info first.]
```

Full guidelines: `docs/faq/FAQ_TEMPLATE.md` and `docs/faq/FAQ_GUIDELINES.md`.

### Filenames

- `<slug>.md` is a published article. The filename slug and the `slug` field
  should match.
- Names starting with `_` and names ending in `*_wsad.md` are skipped by the
  loader, so they are safe as drafts or scratch. So are `README.md`,
  `AGENTS.md`, and `CLAUDE.md` — this folder is globbed as content, so its own
  documentation has to be excluded by name. Full rules in `src/data/AGENTS.md`.
- Anything scanning this folder must exclude those three. The schema example
  below contains a literal `id: 1` line, which a naive `grep "^id:"` reads as a
  real article — the `/blog-article-writer:*` commands filter it out.

## Work Guidance

- Articles are written through the `/blog-article-writer:*` skill chain (prime →
  plan → execute → validate → translate). It is the binding workflow; the Polish
  `README.md` here predates it.
- Plain-Polish rules for all PL prose are cross-cutting and live in
  `.claude/rules/content/10-prosty-polski.md`. Follow that file; do not copy any
  of it here.
- An article needs its OG image at the `image:` path in `public/images/` before
  it ships.

## Verification

```bash
npm run blog:sitemap   # regenerate sitemap.xml after adding or dating a post
npm run og:check       # confirm every referenced OG image exists and is sized
npm test               # Playwright, incl. blog, hreflang, and SEO metadata specs
```

Plus the plain-Polish vocabulary grep defined in
`.claude/rules/content/10-prosty-polski.md`, run against the article file.

## Child DOX Index
