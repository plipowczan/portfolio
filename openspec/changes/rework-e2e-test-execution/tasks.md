## 0. Open questions to resolve first

- [x] 0.1 Confirm whether Vercel emits a deployment event GitHub Actions can trigger on for this project, and whether it carries the deployment URL. Record the answer in `design.md`; if unavailable, switch task group 7 to a scheduled run against production. — **Yes**: `vercel[bot]` creates GitHub deployments for `Preview` and `Production`; statuses carry `state: "success"` and `environment_url`, and that URL answers publicly (200).
- [x] 0.2 Confirm whether the `develop` branch is still in use, since the current workflow triggers on it and the PR/`main` split must decide whether to keep it. — **No**: absent locally and on `origin`; its triggers are dropped.
- [x] 0.3 Read the assertions in each engine-independent candidate (`seo-security-headers`, `perf-font-cache-headers`, `seo-llms-txt`, `seo-metadata-invariants`, `policy-pages`, `breadcrumbs`, `perf-image-loading`, `perf-self-hosted-fonts`, `projects`, `llm-wiki-discoverable`) and record the confirmed list for task 5.4. Exclude anything asserting layout, focus, animation or viewport behaviour. — Confirmed list (17 tests, 5 files) recorded in `design.md` D8; five candidates rejected.

## 1. Port derivation module

- [x] 1.1 Create the shared port module under `scripts/`: derive an even dev port in a fixed range from the absolute working directory path, with the preview port as the next odd number; allow an explicit environment override to take precedence over the derived value. — `scripts/ports.mjs`, FNV-1a over the checkout path, 100 even slots in 3000–3198, `DEV_PORT` / `PREVIEW_PORT` overrides.
- [x] 1.2 Consume it in `vite.config.js` for `server.port`, `preview.port` and `strictPort`, replacing the hardcoded `3000` at line 58. — added a `preview` block; `strictPort: true` on both.
- [x] 1.3 Remove `--port 4173` from the `preview` and `preview:test` scripts in `package.json`, keeping `--strictPort`.
- [x] 1.4 Replace the hardcoded `BASE_URL` in `scripts/prerender.mjs:89` with the module's preview URL.
- [x] 1.5 Consume it in `playwright.config.js` for `use.baseURL` and both `webServer.url` entries.
- [x] 1.6 Replace the hardcoded `http://localhost:3000` literals in `tests/e2e/policy-pages.spec.js` (lines 27 and 82) with relative paths resolved against `baseURL`.
- [x] 1.7 Replace the hardcoded `test.use({ baseURL: "http://localhost:4173" })` in `tests/e2e/seo-metadata-invariants.spec.js:127` with the module's preview URL.
- [x] 1.8 Grep the repository for remaining `3000` / `4173` / `5173` port literals in configs, scripts, tests and `package.json`; resolve or document each hit. — one live hit beyond the planned ones: `scripts/build-with-prerender.mjs` detected preview readiness by matching the literal `"4173"` in stdout; now derived. Remaining hits are prose in `docs/`, `.claude/skills/` and rules — task group 8.
- [x] 1.9 Verify: start `npm run dev` in two worktrees simultaneously and confirm both serve on distinct ports; run a spec in each and confirm each hits its own application. — derivation verified as deterministic (3108/3109 here, 3162/3163 for a different path, identical across runs, override honoured); dev server confirmed bound to 3108 and released on kill. Incidental finding: `:3000` is currently serving an unrelated Next.js app, which is exactly the foreign server the old config would have silently tested against.

## 2. Prerender output invariant

- [x] 2.1 Identify the source that drives lesson routing and prerendering (the same list `ALL_LESSONS` is built from) so the check derives its lesson set rather than hardcoding it. — extracted `getCourseLessons` from `scripts/prerender.mjs` into `scripts/course-lessons.mjs`; both the prerender and the check now read `src/content/kurs/`.
- [x] 2.2 Add the output check to `scripts/build-with-prerender.mjs`, running after `scripts/prerender.mjs` returns: hub HTML exists with a `name="description"` tag; every lesson's HTML exists with the same tag; `dist/en/llm-wiki/kurs` does not exist. — check lives in `scripts/verify-prerender-output.mjs` (also runnable standalone), called as step 6/6.
- [x] 2.3 Make failures exit non-zero with a message naming the missing file, slug or tag; on success, log the pages verified. — plus a guard against a vacuous pass: an empty lesson list is itself reported as a problem.
- [x] 2.4 Verify the invariant actually fails: delete a lesson's `index.html` from `dist/` and re-run the check; strip a meta description and re-run; confirm a non-zero exit in both cases. — all four failure paths exercised against a synthetic tree: missing lesson, missing meta description, missing hub, and an `/en` mirror. Each exits 1 and names the offending path.
- [x] 2.5 Verify the passing path: run a full `npm run build:prerender` and confirm it completes and reports the verified pages. — full build succeeded end to end and reported 9 verified pages (hub + 8 lessons). Note: the build also regenerates `public/sitemap.xml` and `public/llms*.txt`; those byproducts were reverted, as they belong to a content change, not this one.
- [x] 2.6 Remove the `Kurs LLM Wiki — prerender (PL-only)` describe block from `tests/e2e/llm-wiki-course.spec.js` (lines ~311-349), together with the `PRERENDERED` marker and any imports (`existsSync`, `readFileSync`, `DIST`) it alone used. — replaced with a comment pointing at the build check; `fs`, `path` and `url` imports dropped with it.

## 3. Merge gate removal

- [ ] 3.1 Confirm one real Vercel preview deployment has run the invariant from task 2 before proceeding.
- [ ] 3.2 Rewrite the "Before Merging" section of `.claude/rules/11-git.md`: remove the manual `build:prerender` + `npm test` requirement and its now-false "several tests read `dist/`" justification; state that CI and deployment checks are the gate.
- [ ] 3.3 Remove the accompanying warning about `npm run build` overwriting `dist/` and prerender tests reporting as skipped, which no longer describes anything real.

## 4. Playwright run-time bounds and servers

- [x] 4.1 Add `globalTimeout` to `playwright.config.js` — 20 min outside CI, 25 min in CI.
- [x] 4.2 Make the `:4173` `webServer` entry conditional on `CI` or an explicit opt-in variable. — gated on `PW_PREVIEW` **only**, not on `CI`: with a per-browser CI matrix, keying on `CI` would charge a production build to the firefox, webkit and mobile jobs, which cannot run the tests that read it. The workflow sets the variable in the chromium job. Spec updated accordingly.
- [x] 4.3 Add a `test.skip` guard to `tests/e2e/seo-metadata-invariants.spec.js` naming the opt-in variable, following the skip-guard pattern the prerender block used.
- [x] 4.4 Verify: run a single unrelated spec locally and confirm no `vite build` into `dist-test/` happens, no preview port is opened, and `seo-metadata-invariants` reports as skipped with the variable named. — `breadcrumbs` ran in 14.2 s with only the dev server; `seo-metadata-invariants` reported 14 skipped with no build.
- [x] 4.5 Verify: run with the opt-in set and confirm the preview server starts and those five tests execute. — `PW_PREVIEW=1` → 14 passed in 29.5 s (the file parameterises into 14 tests, not 5).

## 5. Playwright project selection

- [x] 5.1 Make the `projects` array conditional: outside CI and without the full-matrix opt-in, expose `chromium` and `Mobile Chrome` only.
- [x] 5.2 Keep the full set — including `edge` locally, excluding it in CI — under the opt-in variable and under `CI`, preserving today's `edge` behaviour.
- [x] 5.3 Verify: `npm test` locally runs two projects; `npm test` with the opt-in runs the full local set. — default 328 tests across 2 projects; `PW_ALL=1` 936 across 6; `CI=1` 784 across 5 (no `edge`).
- [x] 5.4 Add `testIgnore` to `firefox`, `webkit`, `Mobile Chrome` and `Mobile Safari` for the engine-independent list confirmed in task 0.3, as one named array with a comment stating the criterion. — `edge` included too; it is Chromium, so duplicating there buys nothing either.
- [x] 5.5 Verify: a full-matrix run reports each engine-independent spec exactly once, under `chromium`, and reports engine-dependent specs under every project. — the five pinned files contribute 24 tests, all under `chromium` only; control check: `breadcrumbs` still 4 tests under each of the 6 projects. Saving is larger than designed (24 tests, not 17, because several files parameterise): 120 executions locally, 96 in CI.

## 6. CI workflow split

- [x] 6.1 Split `.github/workflows/playwright.yml` into a pull-request job and a `main`-push job, honouring the task 0.2 decision about `develop`. — `develop` dropped from both triggers.
- [x] 6.2 Pull-request job: matrix of `chromium` and `Mobile Chrome` × 2 shards, four jobs.
- [x] 6.3 `main` job: matrix of one job per browser project (`chromium`, `firefox`, `webkit`, `Mobile Chrome`, `Mobile Safari`), no count-based sharding, `fail-fast: false`.
- [x] 6.4 Install only the browser each job needs, instead of `npx playwright install --with-deps` for the full set. — matrix carries a `browser` field, because `Mobile Chrome` needs chromium and `Mobile Safari` needs webkit.
- [x] 6.5 Cache `~/.cache/ms-playwright`, keyed on runner OS and the installed `@playwright/test` version read from its `package.json`. — key also carries the browser, since each job installs only one.
- [x] 6.6 Add a step-level `timeout-minutes` to the install step, shorter than the job timeout, so a stalled install fails while job time remains. — 10 min on install, against a 20/30 min job.
- [x] 6.7 Name jobs by browser so a failure identifies the engine; keep report and screenshot artifact names unique per job. — artifact names use a slug field (`mobile-chrome`), since project names contain spaces.
- [ ] 6.8 Verify on a throwaway branch: open a PR and confirm four narrow jobs run; confirm the artifact names do not collide. — **blocked**: requires pushing the branch.

## 7. Deployed-environment checks

- [x] 7.1 Add a workflow triggered by successful deployments (or the task 0.1 fallback), guarded so it does not run on failed or pending deployments. — `.github/workflows/deployed-checks.yml`, `on: deployment_status` with `if: state == 'success'`.
- [x] 7.2 Set `SEO_HEADERS_URL` to the deployment URL and run `seo-security-headers.spec.js` and `perf-font-cache-headers.spec.js` under `chromium` only. — URL from `environment_url`; `PW_DEPLOYED=1` suppresses both local servers, since the target is remote.
- [ ] 7.3 Verify against a preview deployment: confirm the seven tests execute rather than skip, and that the result is visible on the pull request. — **blocked**: requires pushing the branch.
- [ ] 7.4 Verify the negative path: confirm the workflow does not report a pass when a deployment fails. — **blocked**: requires pushing the branch.

## 8. Documentation

- [x] 8.1 Add the source-path → spec map from `design.md` to `.claude/rules/playwright/30-testing.md`, including the fail-open instruction and the two entries no local run covers (`vercel.json`, prerender scripts).
- [x] 8.2 Document the `testIgnore` criterion in the same rule, so new specs are classified when written.
- [x] 8.3 Update `tests/README.md`: derived ports, the narrow default project set and its opt-in, the preview-server opt-in, and the CI section, which currently shows a workflow that no longer matches reality. — CI section replaced with the three real triggers; added a port section and an environment-variable table.
- [x] 8.4 Fix the dev-server URL in `CLAUDE.md`, which says `localhost:5173` while the configuration says otherwise; describe the derivation rather than a fixed number.
- [x] 8.5 Update `.claude/rules/10-setup.md`, which also documents fixed ports.
- [x] 8.6 Also fix `AGENTS.md`, which carried the same wrong `localhost:5173` / `localhost:4173` in three places, including an example test using an absolute URL.

## 9. Final verification

- [x] 9.1 Run the narrow local set on a clean worktree and record the wall-clock time as the new baseline. — **6.4 min** for the entire suite on the default projects: 305 passed, 21 skipped (14 preview-gated + 7 deployment-gated), 2 flaky that passed on retry, exit 0. Narrowed further by the selection rule, a typical change costs seconds.
- [x] 9.2 Run the full matrix locally under the opt-in and confirm no test that previously passed now fails or silently disappears. — scope reduced by agreement: running 936 tests locally is the cost this change exists to remove. Instead `breadcrumbs` ran across all six projects (24 passed, 1.1 min), proving every engine still launches and passes; disappearance is covered by 9.3, and the full matrix runs on `main` regardless.
- [x] 9.3 Compare the total test count before and after: engine-independent specs should drop from 5-6 executions to 1, with no test lost from the run entirely. — full local matrix 1056 → 936 executions (−120); CI 880 → 784 (−96). The 24 pinned tests still run, once, under `chromium`. No test disappeared from the run: the same 19 files and the same set of test titles are present.
- [x] 9.4 Confirm no orphaned Vite or Playwright process survives a run that hits `globalTimeout`. — forced with `--global-timeout=20000`: the run reported "Timed out waiting 20s for the test suite to run", exited 1, and both derived ports were free immediately afterwards.
