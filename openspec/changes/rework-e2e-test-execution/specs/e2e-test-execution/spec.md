## ADDED Requirements

### Requirement: Narrow browser projects by default outside CI

Outside CI, the Playwright configuration SHALL expose only `chromium` and `Mobile Chrome`. The full project set SHALL remain available through an explicit opt-in environment variable and SHALL be used automatically in CI.

The pair is deliberate: `Mobile Chrome` shares Chromium's engine but a phone viewport, so it covers the "works on desktop, breaks on mobile" class of failure that a chromium-only run misses.

#### Scenario: Local run without opt-in

- **WHEN** `npm test` runs on a developer machine with no opt-in variable set
- **THEN** only the `chromium` and `Mobile Chrome` projects execute
- **AND** `firefox`, `webkit`, `Mobile Safari` and `edge` do not execute

#### Scenario: Local run with explicit opt-in

- **WHEN** `npm test` runs with the full-matrix environment variable set
- **THEN** every project defined for the local environment executes, including `edge`

#### Scenario: CI run

- **WHEN** Playwright runs with `CI` set
- **THEN** the full project set is available for selection by the workflow
- **AND** `edge` remains excluded, because the msedge channel is not installed on CI runners

### Requirement: Preview web server starts only when needed

The preview server (`build:test` + `preview:test`) SHALL start only under an explicit opt-in environment variable. Tests that require it SHALL skip with a message naming the variable when it is absent, rather than fail. CI SHALL set the variable for the jobs that run those tests, and only for those.

Playwright starts every configured `webServer` regardless of test selection, so an unconditional preview server charges a full production build to every run — including runs of a single unrelated spec. Keying it on `CI` alone would repeat that cost in every browser job, while the tests needing it are pinned to one project.

#### Scenario: Local run without the preview opt-in

- **WHEN** a developer runs any subset of the suite with no preview opt-in
- **THEN** no `vite build` into `dist-test/` is performed
- **AND** no server is started on the preview port
- **AND** `tests/e2e/seo-metadata-invariants.spec.js` reports as skipped with a message naming the opt-in variable

#### Scenario: Run with the preview opt-in

- **WHEN** the suite runs with the preview opt-in set
- **THEN** the preview server starts
- **AND** `tests/e2e/seo-metadata-invariants.spec.js` executes its assertions

#### Scenario: CI browser job that cannot run those tests

- **WHEN** a CI job runs a project the preview-dependent tests are excluded from
- **THEN** that job does not set the opt-in variable
- **AND** does not pay for a production build it would not read

### Requirement: Every run is time-bounded

The Playwright configuration SHALL set a `globalTimeout` so that a stalled run terminates itself, releasing its web servers and ports, instead of running indefinitely.

#### Scenario: Run exceeds the bound

- **WHEN** a run's total duration reaches the configured `globalTimeout`
- **THEN** Playwright terminates the run
- **AND** the web servers it started are shut down
- **AND** the ports they occupied become free

### Requirement: Engine-independent tests execute on one project only

Tests whose outcome cannot depend on the rendering engine — those asserting HTTP response headers, files written to disk, JSON-LD payloads, or document metadata — SHALL execute under `chromium` only, in every environment including the full matrix. This SHALL be configured through per-project `testIgnore`, leaving the tests themselves untouched.

#### Scenario: Full matrix run

- **WHEN** the full browser matrix runs
- **THEN** engine-independent specs appear in the report exactly once, under `chromium`
- **AND** they do not appear under `firefox`, `webkit`, `Mobile Chrome` or `Mobile Safari`

#### Scenario: Engine-dependent tests are unaffected

- **WHEN** the full browser matrix runs
- **THEN** specs asserting layout, interaction, animation or viewport behaviour execute under every project in the matrix

### Requirement: Change-scoped selection is documented, not automated

The repository SHALL document, in `.claude/rules/playwright/30-testing.md`, a mapping from source paths to the spec files that cover them, so that a local run can be narrowed to the change at hand. The mapping SHALL fail open: an unrecognised path means run the whole suite on the default project set, never a narrower selection.

Playwright's own `--only-changed` is not usable here — specs import nothing from `src/`, so a component change resolves to zero tests.

#### Scenario: Recognised source path

- **WHEN** a contributor changes a file under `src/pages/` or an equivalent mapped path
- **THEN** the rule names the spec files covering it

#### Scenario: Unrecognised source path

- **WHEN** a contributor changes a file the mapping does not cover
- **THEN** the rule instructs running the whole suite on the default project set

#### Scenario: Path coverable only on a deployment

- **WHEN** a contributor changes `vercel.json` or another deployment-only concern
- **THEN** the rule states explicitly that no local run covers it, and names the deployment-triggered check that does

### Requirement: Pull request CI runs the narrow set

Pull request runs SHALL execute `chromium` and `Mobile Chrome` only.

#### Scenario: Push to a pull request branch

- **WHEN** a commit is pushed to an open pull request
- **THEN** CI runs the suite under `chromium` and `Mobile Chrome`
- **AND** does not run `firefox`, `webkit` or `Mobile Safari`

### Requirement: Main-branch CI runs the full matrix split by browser

Pushes to `main` SHALL run the full browser matrix as one job per browser project. Each job SHALL install only the browser it needs.

#### Scenario: Push to main

- **WHEN** a commit lands on `main`
- **THEN** one CI job runs per browser project
- **AND** each job installs only its own browser binary

#### Scenario: A browser-specific failure

- **WHEN** a test fails under one browser only
- **THEN** the failing job is identified by the browser name, not by a shard number

### Requirement: Browser installation is cached and bounded

The CI workflow SHALL cache the Playwright browser directory, keyed on the installed `@playwright/test` version, and SHALL bound the install step with its own timeout shorter than the job timeout.

Without this, a hung install consumes the whole job budget and the tests never run at all.

#### Scenario: Cache hit

- **WHEN** a job runs with an unchanged `@playwright/test` version
- **THEN** browser binaries are restored from cache instead of downloaded

#### Scenario: Install stalls

- **WHEN** the install step exceeds its own timeout
- **THEN** that step fails while job time remains
- **AND** the failure is attributed to installation, not to the test run

### Requirement: Deployed-environment checks run after each deployment

The suites requiring `SEO_HEADERS_URL` SHALL run automatically against a completed deployment, with the variable set to that deployment's URL. Preview deployments cover pull requests; production deployments cover `main`. No scheduled run is introduced.

These seven tests currently skip everywhere, because nothing sets the variable. They are the only automated coverage of `vercel.json`.

#### Scenario: Preview deployment completes

- **WHEN** a preview deployment for a pull request finishes successfully
- **THEN** `seo-security-headers.spec.js` and `perf-font-cache-headers.spec.js` run against that preview URL
- **AND** their result is visible on the pull request

#### Scenario: Production deployment completes

- **WHEN** a production deployment finishes successfully
- **THEN** the same two suites run against the production URL

#### Scenario: Failed deployment

- **WHEN** a deployment does not finish successfully
- **THEN** the checks do not run, and do not report a false pass

#### Scenario: No local server for a remote target

- **WHEN** the suite runs against a deployment
- **THEN** neither the dev server nor the preview build is started
- **AND** the run pays only for the requests it makes to the deployment

### Requirement: Merging requires no manual local test run

The documented pre-merge procedure SHALL rely on automated checks. It SHALL NOT require a contributor to run `npm run build:prerender` or the full suite locally before merging to `main`.

#### Scenario: Preparing a merge

- **WHEN** a contributor prepares to merge a pull request into `main`
- **THEN** `.claude/rules/11-git.md` names CI and deployment checks as the gate
- **AND** describes no manual prerender-plus-full-suite step
