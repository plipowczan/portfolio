## Why

Every local verification runs the full Playwright suite across all six browser projects — ~153 tests × 5–6 projects ≈ 850 executions, tens of minutes at 100% CPU, for a change that usually touches one or two files. On top of that, Playwright starts **every** configured `webServer` before any run, so even `npx playwright test home.spec.js` first pays a full `vite build` into `dist-test/`. The suite is unusable as a feedback loop, so it gets skipped or run wholesale — both bad outcomes.

Three concrete failures observed 2026-07-30 make this urgent: worktree port collisions silently test the wrong application, orphaned processes accumulate for hours, and a CI shard died on `timeout-minutes: 30` inside `npx playwright install --with-deps`. Meanwhile seven tests (`seo-security-headers`, `perf-font-cache-headers`) skip in every environment because `SEO_HEADERS_URL` is never set — they have never run.

## What Changes

**Local runs become cheap by default**

- `playwright.config.js` narrows its project list outside CI to `chromium` + `Mobile Chrome`. The full six-project matrix stays available behind an explicit opt-in env var and runs automatically in CI.
- The `:4173` preview `webServer` (`build:test` + `preview:test`) becomes conditional — it starts in CI and under an explicit env var only. Without it, `seo-metadata-invariants.spec.js` skips with a readable message, mirroring the existing prerender skip-guard pattern in `llm-wiki-course.spec.js`.
- A `globalTimeout` bounds every run so a hung suite terminates instead of holding ports and dev servers indefinitely.
- Which spec files to run for a given source change is documented as a rule (source-path → spec mapping) in `.claude/rules/playwright/30-testing.md`, with an explicit fail-open instruction: unrecognised path → run the whole suite on the narrow project set. No selection script is introduced.

**Worktree isolation**

- Dev and preview ports are derived from the working directory instead of hardcoded. A single shared module is consumed by `vite.config.js`, `playwright.config.js` and `scripts/prerender.mjs`; the `--port` flags disappear from `package.json`. Two hardcoded `localhost:` literals inside specs (`policy-pages.spec.js`, `seo-metadata-invariants.spec.js`) move to the same source. With per-worktree ports, `reuseExistingServer` stops being a silent-wrong-app hazard.

**Prerender gate moves into the build**

- The `dist/` assertions currently living in `tests/e2e/llm-wiki-course.spec.js` (the `Kurs LLM Wiki — prerender (PL-only)` describe block) move into `scripts/build-with-prerender.mjs` as a post-prerender output check that fails the build. Since `vercel.json` sets `buildCommand: "npm run build:prerender"`, this check then runs on every Vercel preview deployment and every production deployment, at zero CI cost.
- **BREAKING (workflow, not code)**: the manual merge gate in `.claude/rules/11-git.md` — `npm run build:prerender` (~6.5 min) + `npm test` before every merge to `main` — is removed. Its stated justification ("several tests" reading `dist/`) was already false; there was exactly one such block.

**CI split by trigger**

- Pull requests run a narrow job: `chromium` + `Mobile Chrome` only.
- Pushes to `main` run the full matrix, sharded **by browser project** instead of by test count. Each job installs only its own browser, and a red job names the engine rather than a shard number.
- Tests whose result cannot depend on the rendering engine (HTTP headers, filesystem reads, JSON-LD, meta tags — ~35 tests) are pinned to `chromium` via per-project `testIgnore`, removing ~190 redundant executions from the full matrix.
- The Playwright browser cache is keyed on the `@playwright/test` version, and the install step gets its own `timeout-minutes` so a hang fails fast instead of consuming the job budget.

**Deployed-environment checks finally run**

- A workflow triggered by completed Vercel deployments sets `SEO_HEADERS_URL` to the deployment URL and runs the two header suites. Preview deployments cover pull requests; production deployments cover `main`. No scheduled/cron run is introduced.

## Capabilities

### New Capabilities

- `e2e-test-execution`: when and where the Playwright suite runs — the default local project set, conditional web servers, run-time bounds, the source-path → spec selection rule, the PR vs `main` CI split, and the engine-independent test pinning.
- `worktree-port-isolation`: dev and preview ports derive from the working directory so parallel worktrees never collide and never silently serve each other's application.
- `prerender-output-invariants`: `npm run build:prerender` fails when its own output is incomplete, making the check run on every Vercel deployment.

### Modified Capabilities

None. `llm-wiki-course` already specifies the prerendered-output requirements being enforced (`Scenario: Hub prerendered, no EN mirror`, `Scenario: Lessons prerendered, no EN mirror`); this change relocates *where* they are checked without altering what is required. No assertion content changes anywhere in the suite.

## Impact

**Configuration**

- `playwright.config.js` — conditional `projects`, conditional second `webServer`, `globalTimeout`, per-project `testIgnore`, ports from the shared module.
- `vite.config.js`, `package.json` — ports from the shared module; `--port` flags removed from `preview` / `preview:test`.
- New shared port module under `scripts/`.

**Scripts**

- `scripts/prerender.mjs` — `BASE_URL` (line 89) sourced from the port module.
- `scripts/build-with-prerender.mjs` — gains the prerender output invariant.

**Tests** (execution and wiring only; no assertion is rewritten)

- `tests/e2e/llm-wiki-course.spec.js` — the prerender describe block is removed after its assertions land in the build script.
- `tests/e2e/seo-metadata-invariants.spec.js`, `tests/e2e/policy-pages.spec.js` — hardcoded `localhost:3000` / `localhost:4173` replaced with the shared port source.

**CI**

- `.github/workflows/playwright.yml` — split into a narrow PR job and a full per-browser `main` matrix; browser caching; step-level install timeout.
- New workflow reacting to completed deployments, running the `SEO_HEADERS_URL` suites.

**Rules and docs**

- `.claude/rules/11-git.md` — the manual prerender merge gate is removed and the section rewritten to reflect reality.
- `.claude/rules/playwright/30-testing.md` — gains the source-path → spec selection map and the fail-open instruction.
- `tests/README.md` — commands and configuration description updated.

**Out of scope**

- Orphaned `@playwright/mcp` processes. These originate from the agent's MCP tooling (three overlapping browser servers are installed), not from the test suite. Handled separately; only the `globalTimeout` fix, which addresses hung *test runs* and their Vite servers, is in scope here.
- Rewriting any test's assertions.

**Verification needed during design**

- That Vercel emits a deployment event GitHub Actions can trigger on, carrying the deployment URL. If it does not, the deployed-environment checks fall back to a scheduled run against production.
