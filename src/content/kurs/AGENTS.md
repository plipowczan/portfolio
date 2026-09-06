# AGENTS.md — src/content/kurs/

## Purpose

Lessons of the free LLM Wiki course, served at `/llm-wiki/kurs` and
`/llm-wiki/kurs/:slug`. Polish only — the course has no English version.

## Ownership

**Owns:** lesson markdown and lesson ordering.

**Does not own:** the loader (`src/data/coursePosts.js`), the hub and lesson
views (`src/pages/CourseHub.jsx`, `src/pages/CourseLesson.jsx`), course FAQ copy
(`src/data/courseFaq.js`), or prerequisites (`src/data/coursePrerequisites.js`).

## Local Contracts

The system is file-derived: adding a lesson means dropping one `.md` file here.
Navigation, prerendering, `public/sitemap.xml`, and `public/llms.txt` all read
this folder and sort by `order`. Nothing else has to be registered.

The flip side: a non-lesson `.md` dropped here becomes a phantom lesson.
`README.md`, `AGENTS.md`, and `CLAUDE.md` are excluded by name in every reader —
see `src/data/AGENTS.md`.

Required frontmatter — a missing or mistyped field fails the build, naming this
file and the field:

```yaml
---
slug: 2-onboarding    # URL segment; match the filename
order: 2              # number, not a string; drives every derived list
updated: 2026-07-08   # YYYY-MM-DD; becomes this lesson's <lastmod> in the sitemap
title: Onboarding
excerpt: One-sentence summary          # string; feeds the hub card and the SEO description
---
```

`updated` is the date of the last meaningful change to the lesson, and it is
required. It used to be read from git history instead, which broke silently: the
build environment clones shallow, and in a shallow clone every file untouched
since the boundary commit reports the boundary date, so eight lessons shared one
wrong date. Change a lesson, change its `updated`.

Optional: `video` (primary WebM/VP9), `videoMp4` (H.264 fallback for Safari and
iOS), `poster` (still shown before play). All three are optional; a lesson
without a recording keeps its "Screencast wkrótce" placeholder.

**Trap:** an unquoted `excerpt` containing `: ` is parsed by YAML as a mapping
and breaks the build. Quote the value or use a `>-` block scalar.

## Work Guidance

- Plain-Polish rules for every lesson: `.claude/rules/content/10-prosty-polski.md`.
  Follow that file; do not restate its replacement table or keep-list here.
- `order` values decide lesson sequence across nav, prerender, and sitemap.
  Renumbering reorders the whole course — check the hub after changing one.
- Renaming a `slug` changes a live URL and needs a redirect in `vercel.json`.

## Verification

```bash
npm run build:prerender   # confirms each lesson route renders to static HTML
npm run blog:sitemap      # regenerates sitemap.xml, incl. lesson URLs
npm test                  # Playwright, incl. tests/e2e/llm-wiki-course.spec.js
```

Plus the plain-Polish vocabulary grep from
`.claude/rules/content/10-prosty-polski.md`, run against the lesson file.

## Child DOX Index
