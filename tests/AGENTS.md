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

### What runs by default

Outside CI the config exposes **two** projects: `chromium` and `Mobile Chrome`.
The full six-project matrix is opt-in.

```bash
npm test                 # chromium + Mobile Chrome
PW_ALL=1 npm test        # full matrix
PW_PREVIEW=1 npm test    # also starts the preview server
```

Narrowing a run to the change at hand is a documented rule, not a script —
the source-path → spec map lives in `.claude/rules/playwright/30-testing.md`.
It fails open: an unmapped path means run everything, never run nothing.

### Two servers, two purposes

Both ports are **derived from the checkout location** by `scripts/ports.mjs`, so
each git worktree gets its own pair and two worktrees can test in parallel.
Never hardcode a port in a spec — take the URL from `baseURL` or that module.

- **dev (`npm run dev`)** — default `baseURL`, used for interface behaviour.
  Always started.
- **preview (`npm run build:test && npm run preview:test`)** — the production
  build, and the only place SEO metadata is visible. Under React 19,
  `react-helmet-async` does not inject `<meta>` or `<link>` into `<head>` while
  the app runs inside `React.StrictMode`, which is dev-only. Specs needing head
  tags set their own `test.use({ baseURL })` — see
  `e2e/seo-metadata-invariants.spec.js`.

  **Started only under `PW_PREVIEW=1`.** Playwright starts every configured
  server regardless of which tests were selected, so an unconditional entry
  charged a full production build to every run — including a single-spec run.
  Without the variable, the blocks that need it skip with a message naming it:
  `seo-metadata-invariants.spec.js`, and the production-host block of
  `analytics-consent.spec.js`, which proxies the real hostname to that build
  because `window.location.hostname` cannot be faked from page script.

  CI sets the variable in every job — the analytics block is not
  engine-independent, so it runs on the full matrix.

`PW_DEPLOYED=1` starts neither server: the target is a deployment, addressed
through `SEO_HEADERS_URL`.

### `dist/` vs `dist-test/`

The test build writes to `dist-test/` and leaves `dist/` alone. `dist/` holds
the prerendered output that ships.

No test reads `dist/`. The assertions that did — hub and lesson HTML with a
meta description, no `/en` mirror, and no `googletagmanager` reference in any
static file — now live in `scripts/verify-prerender-output.mjs`, which
`npm run build:prerender` runs as its last step. Since that command is
`vercel.json`'s `buildCommand`, the check runs on every preview and production
deployment, and a broken prerender fails the deployment instead of waiting for
someone to remember a local build.

**Do not add a test that reads `dist/`.** It can only skip on a normal run, so
it looks green while proving nothing. A claim about build output belongs in the
invariant, where it runs every time the build does.

The same rule now carries a second gate. `scripts/check-payload-budget.mjs`
sums the entry chunk and its static imports out of Vite's manifest, gzips them,
and fails `npm run build:prerender` when the total exceeds
`INITIAL_JS_BUDGET_GZIP_BYTES` — the single declared constant in that file.
Measured and ceiling are printed whether it passes or fails. Because it runs
inside the build, a payload regression fails the Vercel deployment and shows up
on the pull request; there is no Playwright spec for bundle size, and adding one
would be the mistake this section already names.

### What gates a merge

Nothing manual. Three automated runs cover it, each on a different trigger:

| Trigger | Runs | Covers |
| --- | --- | --- |
| Pull request | `chromium` + `Mobile Chrome`, 2 shards each | the obvious breakage, before merge |
| Push to `main` | full matrix, one job per browser | the remaining engines |
| Vercel deployment finished | `seo-security-headers`, `perf-font-cache-headers` against the deployment URL | headers from `vercel.json`, which exist only on a deployment |

The prerender output is checked by the build itself, so it needs no CI job and
no local step. Full-matrix failures land after merge by design — fix forward on
`main` rather than pretending the PR run caught them.

There used to be a manual gate here: `npm run build:prerender` plus the whole
suite before every merge. It cost 6.5 minutes to run a single filesystem
assertion that now lives in the build.

### Conventions

- Prefer user-facing selectors: `getByRole`, `getByText`, `getByTestId`. Avoid
  CSS class selectors.
- Group with `test.describe`; set up with `test.beforeEach`. No shared state
  between tests.
- Shared helpers go in `utils/test-helpers.js`, shared data in
  `fixtures/test-data.js`.
- Locally, `workers` is unset; in CI it is 1 per job, because navigation-heavy
  blog specs are timing-fragile and only pass serially.
- A spec whose result cannot depend on the rendering engine may be pinned to
  `chromium` through `ENGINE_INDEPENDENT` in `playwright.config.js`. The bar is
  strict: *no* assertion about visibility, layout, focus, animation or viewport.
  `testIgnore` works per file, so one such assertion keeps the whole file on the
  full matrix.

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
