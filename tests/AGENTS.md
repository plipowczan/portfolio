# AGENTS.md — tests/

## Purpose

Playwright end-to-end tests plus a small Node unit suite. This is the only
automated gate the repository has.

## Ownership

**Owns:** `e2e/`, `unit/`, `utils/test-helpers.js`, `fixtures/test-data.js`, and
`projects.spec.js`.

**Does not own:** `playwright.config.js` at the repository root, or the CI
workflow in `.github/workflows/playwright.yml`.

`README.md` in this folder is the Polish human guide — a thorough walkthrough of
running and writing tests. Where it and this file disagree, this file is binding.

## Local Contracts

### Two servers, two purposes

- **:3000 (`npm run dev`)** — default `baseURL`, used for interface behaviour.
- **:4173 (`npm run build:test && npm run preview:test`)** — the production
  build, and the only place SEO metadata is visible. Under React 19,
  `react-helmet-async` does not inject `<meta>` or `<link>` into `<head>` while
  the app runs inside `React.StrictMode`, which is dev-only. Specs needing head
  tags set their own `test.use({ baseURL })` — see
  `e2e/seo-metadata-invariants.spec.js`.

### `dist/` vs `dist-test/`

The test build writes to `dist-test/` and leaves `dist/` alone. `dist/` holds
the prerendered output that ships and that the prerender assertions read.

**Trap:** `npm run build` (without `:prerender`) overwrites `dist/` with a plain
SPA build and silently undoes the prerender. The prerender tests then report as
**skipped, not failed** — a green run does not prove they executed. The marker
is `dist/blog/index.html`: a plain build produces only `dist/index.html`.
Check the skip count, or rebuild, before trusting a pass.

### Pre-merge gate

Before every merge to `main`, run both, in this order:

```bash
npm run build:prerender   # ~6.5 min, writes dist/
npm test                  # the prerender assertions now run instead of skipping
```

CI runs `npm test` alone across four shards; adding `build:prerender` would cost
6.5 minutes in each and blow the 30-minute job limit. So CI covers everything
except the prerendered output, and this manual step covers the rest. The same
gate is restated as a checklist step in `.claude/rules/11-git.md`.

### Conventions

- Prefer user-facing selectors: `getByRole`, `getByText`, `getByTestId`. Avoid
  CSS class selectors.
- Group with `test.describe`; set up with `test.beforeEach`. No shared state
  between tests.
- Shared helpers go in `utils/test-helpers.js`, shared data in
  `fixtures/test-data.js`.
- Locally, `workers` is unset; in CI it is 1 per job, because navigation-heavy
  blog specs are timing-fragile and only pass serially.

## Work Guidance

- New feature, new spec in `e2e/`. Name it after the feature, not the page.
- A test that needs the prerendered `dist/` must skip cleanly when it is absent,
  with a message naming `npm run build:prerender`.
- Known issue: webkit and Mobile Safari time out on `/llm-wiki/kurs/*` locally
  on Windows — tracked in `docs/TODO.md`, not a regression.

## Verification

```bash
npm test                                  # all Playwright projects
npm run test:ui                           # interactive, for development
node --test tests/unit/subscribe.test.mjs # the unit suite
```

**Trap:** `npm run test:unit` passes a *directory* to `node --test`. Node 24
resolves that as a CJS module path and dies with `MODULE_NOT_FOUND` before any
test runs — it looks like a failing suite but nothing executed. Pass the file
path until the script is fixed.

## Child DOX Index
