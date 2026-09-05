# AGENTS.md — scripts/

## Purpose

Node build and content tooling. Everything here runs outside the browser, at
build time or on demand from an npm script.

## Ownership

**Owns:** content generation, prerendering, sitemap generation,
`public/llms.txt` generation, font fetching, OG image checks and resizing, and
WebP conversion.

**Does not own:** application code (`src/`) or Vercel runtime code (`api/`).

`README.md` in this folder is the Polish human guide. Where it and this file
disagree, this file is binding — the README predates several of these scripts.

## Local Contracts

| Script | npm script | Role |
| --- | --- | --- |
| `build-with-prerender.mjs` | `build:prerender` | orchestrates `vite build`, the prerender pass, then the output check and the payload budget; this is the production build |
| `generate-content.mjs` | — | Vite plugin: parses and validates content frontmatter, emits `src/data/generated/`; also runnable alone |
| `prerender.mjs` | `prerender:run` | Puppeteer pass writing static HTML for every route |
| `verify-prerender-output.mjs` | — | fails the build when the prerender output is incomplete; also runnable alone against a `dist/` |
| `check-payload-budget.mjs` | — | fails the build when the homepage's initial gzipped JS exceeds the declared ceiling; also runnable alone against a `dist/` |
| `course-lessons.mjs` | — | the course lesson list, read by both the prerender and the output check |
| `ports.mjs` | — | dev and preview ports, derived from the checkout location |
| `update-sitemap.js` | `blog:sitemap` | rebuilds `public/sitemap.xml` with `lastmod` from git |
| `generate-llms-txt.js` | — | writes `public/llms.txt`; invoked from the build chain |
| `fetch-fonts.mjs` | `fonts:fetch` | downloads self-hosted font files into `src/assets/fonts/` |
| `check-og-images.mjs` | `og:check` | verifies every referenced OG image exists at the right size |
| `resize-og-image.mjs` | `og:resize` | resizes a single OG image |
| `apply-og-resize.mjs` | `og:apply` | applies resizing across the OG image set |
| `resize-og-images-preview.mjs` | `og:preview` | dry-run preview of the resize pass |
| `convert-to-webp.js` | `img:convert` | converts source images to WebP |
| `generate-image.js` | `img:generate` | generates an image through the Gemini API |
| `kurs-media.ps1` | — | PowerShell helper for course screencast media |
| `dox-pass-check.mjs` | — | `Stop` hook: warns when edited files' owning `AGENTS.md` was not updated |

`dox-pass-check.mjs` is the one script here that is not build tooling. It is
registered in `.claude/settings.json` and always exits 0 — a warning must never
fail a turn or block a commit. A moved file flags both folders: the one it left
and the one it landed in.

- Route lists are derived from the filesystem, not hardcoded: the prerender and
  sitemap scripts read `src/content/kurs/` and the blog folders directly. Keep
  it that way — a hardcoded route list is how pages go missing.
- Because those folders also hold `README.md`, `AGENTS.md`, and `CLAUDE.md`,
  every reader filters them through a local `DOC_FILES` set. Skip it and a doc
  becomes a phantom article — `update-sitemap.js` fails with
  `Invalid time value`. The canonical list is in `src/data/AGENTS.md`.
- Scripts are ES modules (`"type": "module"`). New Node tooling uses `.mjs`.
- Ports are never hardcoded. `ports.mjs` derives the dev and preview ports from
  the checkout location so parallel worktrees do not collide, and `vite.config.js`,
  `playwright.config.js` and `prerender.mjs` all read from it.
- `prerender.mjs` exits non-zero only for routes it was *asked* to render.
  `verify-prerender-output.mjs` covers what that cannot see: a route never on
  the list, and a page that rendered but lost its metadata.
- Article and lesson bodies arrive through a dynamic `import()`, so those routes
  are captured only after `data-content-ready` appears on `<html>`
  (`src/utils/prerenderMarker.js`). Waiting on network idle instead cannot tell
  "the content chunk arrived" from "the analytics beacon arrived", and degrades
  silently into writing an empty article. Never swap the marker for a sleep.
- `generate-content.mjs` carries no shebang on purpose: `vite.config.js` imports
  it, and the esbuild pass that bundles the config would put `#!` mid-file and
  break the build.
- The payload ceiling is one constant, `INITIAL_JS_BUDGET_GZIP_BYTES` in
  `check-payload-budget.mjs`. Raising it is meant to show up in a diff.
- A script that needs an API key reads it from the environment and fails with a
  clear message when it is absent. Never inline a key.

## Work Guidance

- Adding a route to the site means adding it to `prerender.mjs` and
  `update-sitemap.js` unless it is derived from a content folder already.
- `npm run build:prerender` takes roughly 6.5 minutes. Use `npm run build` while
  iterating; Vercel runs the full one on every deployment, so it is not a manual
  pre-merge step.

## Verification

```bash
npm run build:prerender   # the real exercise of this folder
npm run blog:sitemap
npm run og:check
```

## Child DOX Index
