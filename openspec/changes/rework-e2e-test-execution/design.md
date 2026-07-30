## Context

Measured 2026-07-30. The suite is 17 spec files in `tests/e2e/` plus `tests/projects.spec.js`, ~153 `test()` declarations, `testDir: "./tests"`. `playwright.config.js` declares six projects (`chromium`, `edge` locally, `firefox`, `webkit`, `Mobile Chrome`, `Mobile Safari`), so a full run is ~850 executions. CI shards it four ways (`workers: 1` per job, ~15 min per shard, `timeout-minutes: 30`).

Four facts shape every decision below:

1. **Playwright starts all `webServer` entries regardless of test selection.** The `:4173` entry runs `npm run build:test && npm run preview:test` — a full production build — before a single test executes, even when the selection is one unrelated spec. Its only consumer is `seo-metadata-invariants.spec.js` (5 tests), which needs a non-StrictMode build because react-helmet-async 2.0.5 under React 19 does not populate `<head>` in dev.
2. **`--only-changed` cannot work here.** It resolves the import graph starting from spec files. Specs import `tests/utils/` and `tests/fixtures/` and nothing from `src/`. A change to `src/components/sections/Hero.jsx` selects zero tests — a silent, total miss.
3. **Vercel already runs the prerender build on every deployment.** `vercel.json` sets `buildCommand: "npm run build:prerender"`. The manual pre-merge gate in `.claude/rules/11-git.md` pays ~6.5 min for a build that Vercel performs anyway, to run a single filesystem-only describe block (`tests/e2e/llm-wiki-course.spec.js:311-349`).
4. **Seven tests have never run.** `seo-security-headers` (5) and `perf-font-cache-headers` (2) both gate on `SEO_HEADERS_URL`, which nothing sets — not locally, not in CI, not in the merge gate. They are the only automated coverage of `vercel.json`.

Constraints: no test's assertions may be rewritten; this change governs *what runs when*, not what is asserted. The repository is public, so GitHub Actions minutes are free — runner time is not a cost driver, wall-clock and laptop CPU are.

## Goals / Non-Goals

**Goals:**

- A local run costs seconds to a couple of minutes, and a forgotten flag cannot cost more than a few minutes.
- Parallel worktrees can test and prerender simultaneously, and a run can never silently exercise another worktree's application.
- The prerender assertion runs automatically, in a place that also protects production.
- The seven deployed-environment tests run somewhere.
- CI failures name the browser that broke.

**Non-Goals:**

- Rewriting or re-scoping any assertion.
- Automating local test selection with a script. Selection is a documented rule; the configuration bounds the cost of ignoring it.
- Cleaning up orphaned `@playwright/mcp` processes. That is agent tooling, not the suite; three overlapping browser MCP servers are installed and choosing among them is a separate decision. Only the `globalTimeout` fix, which addresses hung *test runs*, is in scope.
- Any scheduled/cron job.

## Decisions

### D1 — Full matrix on `main`, narrow on pull requests

Alternatives: keep the full matrix on PRs (today); narrow PRs and move the full matrix to a weekly cron.

Chosen: PRs run `chromium` + `Mobile Chrome`; pushes to `main` run everything. Runner minutes are free, so the argument for narrowing PRs is wall-clock only. The cost is real and accepted: a `firefox`/`webkit`/`Mobile Safari` regression surfaces after merge, and its fix is a separate commit on `main` rather than an amendment to the branch.

A weekly cron was rejected because every one of its would-be jobs found a better trigger — the matrix on merge, the prerender invariant on build, the header suites on deployment. A cron would only re-run what already ran.

### D2 — `chromium` + `Mobile Chrome` as the narrow set

`Mobile Chrome` is Chromium with a Pixel 5 viewport. The 2026-07-30 failure was nav visibility per viewport — chromium alone would have passed it. Adding a second *engine* (WebKit) to the narrow set was rejected: it roughly doubles the job and the remaining engine-specific risk is covered on `main`.

### D3 — Selection by documented rule, not by script

Alternatives: a `test:changed` script reading `git diff` against a glob map; tags in test titles; status quo.

Chosen: a source-path → spec map documented in `.claude/rules/playwright/30-testing.md`. No new code, nothing to keep in sync with the runner. The weakness is obvious — a rule cannot enforce itself — and D4 exists precisely to bound what happens when it is ignored.

The map is written fail-open. An unrecognised path means *run everything on the narrow set*, never *run nothing*. Silent under-selection is the only failure mode of this design that produces a false green, so it is designed out rather than mitigated.

Initial map (paths → specs):

| Source path | Specs |
|---|---|
| `src/pages/Home.jsx`, `src/components/sections/**` | `home`, `testimonials`, `booking-cta`, `contact-form`, `ui-ux-audit` |
| `src/pages/Blog*.jsx`, `src/content/blog/**`, `src/data/blogPosts.js` | `blog`, `language-switcher-blog`, `breadcrumbs` |
| `src/pages/Course*.jsx`, `src/content/kurs/**`, `src/data/course*.js` | `llm-wiki-course`, `llm-wiki-discoverable` |
| `src/pages/LlmWikiLanding.jsx` | `llm-wiki-landing`, `llm-wiki-discoverable` |
| `src/pages/{Privacy,Terms,Cookie}*.jsx` | `policy-pages` |
| `src/components/seo/**`, schema utilities | `seo-metadata-invariants` (needs preview opt-in), `breadcrumbs`, `policy-pages`, `seo-llms-txt` |
| `src/components/layout/**` | `home`, `blog`, `llm-wiki-course` — nav and footer render everywhere, so this lane is deliberately broad |
| `src/data/projects.js` | `projects` |
| `public/fonts/**`, `scripts/fetch-fonts.mjs` | `perf-self-hosted-fonts` |
| `public/images/**` | `perf-image-loading` |
| `vercel.json` | **no local run covers this** — the deployment-triggered check does |
| `scripts/prerender*.mjs`, `scripts/build-*.mjs` | requires `npm run build:prerender`; the invariant checks it |
| anything else | fail open — whole suite, narrow project set |

### D4 — The configuration narrows itself outside CI

Alternatives: leave six projects as the default and rely on the rule; add a `test:quick` script alongside a full `npm test`.

Chosen: `playwright.config.js` builds its project list conditionally, the same shape already used to exclude `edge` in CI. Outside CI and without the opt-in variable, the list is `chromium` + `Mobile Chrome`.

This is what makes D3 survivable. With a doc-only selection rule, the config is the only thing standing between a forgotten instruction and a 40-minute pegged CPU. Leaving the shortest command (`npm test`) as the most expensive one would have kept the original problem one lapse away.

### D5 — The preview server becomes opt-in

Gated on `CI` or an explicit variable. Without it, `seo-metadata-invariants.spec.js` skips with a message naming the variable — the same skip-guard pattern already used by the prerender block in `llm-wiki-course.spec.js`, so the repository gains no new idiom.

A separate `playwright.preview.config.js` was rejected: a second config is a second thing CI can forget, and forgetting it means five tests that run nowhere.

### D6 — Ports derived from the working directory

Alternatives: per-worktree `.env` files; keep hardcoded ports and disable `reuseExistingServer`.

Chosen: one module computes both ports from the absolute working directory path — an even base port in a fixed range for dev, the next odd port for preview. Consumers: `vite.config.js` (`server.port`, `preview.port`, `strictPort`), `playwright.config.js` (`baseURL`, both `webServer.url`), `scripts/prerender.mjs` (`BASE_URL`, currently hardcoded at line 89), and the two specs holding `localhost:` literals.

`.env` files were rejected because they are untracked: a new worktree without one reverts to today's collision, and nothing reminds you.

An explicit environment override takes precedence over the derived value, for cases needing a fixed port (external tooling pointed at a known URL). Derivation is the default, not the only option.

With per-worktree ports, `reuseExistingServer: !CI` stops being a hazard and returns to being an optimisation: the only server on that port is this worktree's. `strictPort` stays on, so an unrelated process squatting the derived port fails the run loudly.

### D7 — The prerender assertion becomes a build invariant

Alternatives: a dedicated CI job that builds and runs the existing test block; both; rewrite only the rule text.

Chosen: move the assertion into `scripts/build-with-prerender.mjs`, after `scripts/prerender.mjs` returns. Because Vercel's `buildCommand` is `npm run build:prerender`, the check then runs on every preview deployment, every production deployment, and every local prerender build — at zero CI minutes. A broken prerender fails the deployment instead of shipping.

`scripts/prerender.mjs` already exits non-zero when a route it was asked to render fails, and `build-with-prerender.mjs` propagates that. The invariant covers the two gaps that exit code cannot see: a route that was never on the list (a lesson added but not wired), and a page that rendered while losing its metadata.

The lesson list must come from the same source that drives routing and prerendering. A lesson is added by dropping a markdown file, so a hand-maintained list in the check would keep passing while the new lesson silently never prerenders.

This is the one place the change touches a test file: the describe block leaves `llm-wiki-course.spec.js` once its assertions live in the build. Assertion content is unchanged.

### D8 — Engine-independent tests pinned to `chromium`

Implemented as `testIgnore` on the non-chromium projects, so no test file is edited. A `Cache-Control` header, the body of `llms.txt`, and a `loading` attribute in the markup do not vary by rendering engine.

The list was confirmed by reading every candidate's assertions (task 0.3), which cut it to a third of the initial estimate. Confirmed engine-independent — 17 tests across 5 files:

| File | Tests | Why |
|---|---|---|
| `seo-security-headers` | 5 | `request` fixture, response headers only |
| `perf-font-cache-headers` | 2 | `request` fixture, response headers only |
| `seo-llms-txt` | 2 | `request` fixture, file bodies |
| `seo-metadata-invariants` | 5 | meta tags, hreflang, sitemap — no visibility assertion anywhere |
| `perf-image-loading` | 3 | asserts the `loading` / `fetchpriority` attributes in the markup, never whether a fetch occurred |

Rejected, with the assertion that disqualified each: `breadcrumbs` and `policy-pages` (`toBeVisible()` — visibility is CSS, and CSS is engine behaviour); `perf-self-hosted-fonts` (`document.fonts`, and whether Inter actually renders Polish diacritics — as engine-dependent as it gets); `llm-wiki-discoverable` (branches on `isMobile`, asserts viewport-conditional nav); `projects` (`toBeVisible()` plus navigation).

`testIgnore` works per file, so a file mixing both kinds stays on the full matrix — `breadcrumbs` has one JSON-LD test that would qualify, but four visibility tests that do not.

Revised saving: 17 × 4 redundant projects ≈ 68 executions removed from ~850, not the ~190 first estimated. Smaller than hoped, still free.

### D9 — CI matrix keyed by browser, not by shard

Alternatives: keep four count-based shards; a two-dimensional browser × shard matrix.

Chosen for `main`: one job per browser project. Each installs only its own binary, which shortens the step that hung for 30 minutes in run 30489037702. A red job reads "Mobile Safari", not "shard 3" — the exact attribution missing from the 2026-07-30 failure.

Load is even after D8: `chromium` ~153 tests, the other four ~118 each. At the observed ~14 executions/min that is roughly 11 min and 8.5 min per job.

For pull requests, one job per project would put the `chromium` job at ~11 min — worse than the 5–7 min this change promises. The PR run therefore uses project × 2 shards, four jobs, ~6 min each. Four runners on a PR, the same as today, for a third of the wall clock.

### D10 — Deployed-environment checks trigger on deployment

Alternatives: a weekly cron against production; both.

Chosen: a workflow reacting to a successful deployment, setting `SEO_HEADERS_URL` to that deployment's URL. Preview deployments cover pull requests, so a `vercel.json` edit is checked *before* merge — which is where the change that would break these headers actually originates. Production deployments cover `main`.

No cron. Its only unique coverage is drift not caused by us (a platform-side change to how Vercel serves headers), against the cost of a job that reports on a codebase nobody touched.

### D11 — `globalTimeout`, and nothing else about process hygiene

A bounded run terminates itself and releases its Vite servers. The orphaned `@playwright/mcp` processes come from agent tooling, not from the suite, and their root cause — three installed browser MCP servers — is a configuration decision outside this repository.

## Risks / Trade-offs

- **A documented selection rule cannot enforce itself** → D4 bounds the blast radius: ignoring the rule costs a few minutes on two projects, not forty on six. Accepted deliberately.
- **`seo-metadata-invariants` skips by default locally, and skips read as green** → the skip message names the opt-in variable; CI and `main` run it unconditionally. This mirrors an existing repository pattern rather than introducing a new way to be quietly uncovered.
- **Engine-specific regressions surface after merge** → direct consequence of D1, accepted. Mitigation is process: fix forward on `main` or revert, rather than pretending the PR job caught it.
- **The `testIgnore` list drifts as tests are added** → keep it as one named array with a comment stating the criterion, and state the criterion in the testing rule so new specs are classified when written.
- **A derived port collides with an unrelated local service** → `strictPort` fails loudly and the environment override provides an escape hatch. No silent fallback to another port.
- **Removing the manual merge gate before the invariant works** → sequencing, see Migration Plan. The gate is removed only after the invariant is verified by deliberately breaking prerender output.
- ~~**The deployment trigger may not carry a usable URL**~~ → resolved in task 0.1: `deployment_status` carries `environment_url` for both Preview and Production, and the URL answers publicly. No fallback needed.
- **Changing the dev port changes a documented URL** → `CLAUDE.md` says `localhost:5173` while `vite.config.js` says 3000, so the documentation is already wrong. Both get corrected to describe the derivation instead of a fixed number.

## Migration Plan

Order matters; two steps are gates on later ones.

1. **Port module first.** Nothing else depends on it, and it makes every subsequent local verification trustworthy. Verified by running dev servers in two worktrees at once.
2. **Prerender invariant, and verify it fails.** Delete a lesson's output from `dist/` and confirm a non-zero exit; strip a meta description and confirm the same. An invariant that has never failed has not been tested.
3. **Remove the manual merge gate** in `.claude/rules/11-git.md` — only after step 2 is verified, and after one real Vercel preview deployment has exercised it.
4. **Playwright config**: conditional projects, conditional preview server, `globalTimeout`, per-project `testIgnore`.
5. **CI workflows**: split PR and `main`, add the browser cache and the install-step timeout.
6. **Deployment-triggered workflow**, once the trigger is confirmed to carry a URL.
7. **Documentation last**: the selection map, `tests/README.md`, `CLAUDE.md`'s dev-server URL.

Rollback: every step is independent and revertible on its own. The riskiest, step 3, is reverted by restoring one section of a markdown rule.

## Open Questions

**Resolved during implementation (task group 0):**

- *Does Vercel emit a deployment event GitHub Actions can trigger on, carrying the URL?* **Yes.** `vercel[bot]` creates GitHub deployments for both `Preview` and `Production` environments. Their statuses carry `state: "success"` and `environment_url` pointing at the deployment. The deployment URL answers publicly (HTTP 200), so no deployment-protection bypass is needed. D10 stands as designed; no cron fallback.
- *Is the `develop` branch still in use?* **No.** It exists neither locally nor on `origin`. The current workflow triggers on a branch that does not exist; those triggers are removed rather than carried over.
- *The exact engine-independent test list.* **Confirmed** — see the table in D8. Reading the assertions cut the list from ten candidate files to five, and from ~35 tests to 17.

**Still open:**

- Should the primary worktree pin the dev port to a fixed value via the override, so external tooling aimed at a known URL keeps working?
