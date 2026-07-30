# prerender-output-invariants Specification

## Purpose

Makes the prerender build check its own output, so a broken `dist/` fails the build instead of shipping.

The alternative — a test that reads `dist/` — can only skip on a normal run, which looks green while proving nothing. Because `vercel.json` sets `buildCommand: "npm run build:prerender"`, putting the check inside the build turns it into a gate on every deployment at no CI cost.

## Requirements

### Requirement: The prerender build verifies its own output

`npm run build:prerender` SHALL verify the contents of `dist/` after prerendering and SHALL exit non-zero when the output is incomplete or wrong.

`scripts/prerender.mjs` already exits non-zero when a route it was asked to render fails. It cannot detect a route that was never on the list, nor a page that rendered but lost its metadata. Those are the gaps this check closes.

#### Scenario: Course hub is missing or bare

- **WHEN** the prerender build finishes and `dist/llm-wiki/kurs/index.html` is absent, or exists without a `name="description"` meta tag
- **THEN** the build fails with a non-zero exit code
- **AND** the error names the missing file or the missing tag

#### Scenario: A lesson page is missing or bare

- **WHEN** the prerender build finishes and any lesson's `dist/llm-wiki/kurs/<slug>/index.html` is absent, or exists without a `name="description"` meta tag
- **THEN** the build fails with a non-zero exit code
- **AND** the error names the lesson slug

#### Scenario: An EN mirror of the course appears

- **WHEN** the prerender build finishes and `dist/en/llm-wiki/kurs` exists
- **THEN** the build fails with a non-zero exit code

#### Scenario: A static file would load analytics before consent

- **WHEN** any HTML file in the build output references `googletagmanager`
- **THEN** the build fails with a non-zero exit code naming the files

Analytics is consent-gated and injected at runtime. A tag baked into static HTML would load before any decision, which removes the gate entirely — and the static file has no way to report that itself.

#### Scenario: Output is complete

- **WHEN** the hub and every lesson exist with a meta description, no EN mirror is present, and no static file references an analytics host
- **THEN** the build completes successfully and reports the pages it verified

### Requirement: The lesson list checked matches the lesson list published

The set of lessons the invariant checks SHALL be derived from the same source that drives routing and prerendering, not from a separate hardcoded list.

A lesson is added by dropping a markdown file; a hand-maintained checklist would keep passing while the new lesson silently never prerenders.

#### Scenario: A lesson is added

- **WHEN** a new lesson file is added and the prerender build runs
- **THEN** the invariant checks the new lesson's output too, with no change to the check itself

#### Scenario: A lesson file has malformed frontmatter

- **WHEN** a file in the course content folder looks like a lesson but lacks a usable `slug` or `order`
- **THEN** the build fails with a non-zero exit code naming that file
- **AND** does not pass merely because the loader dropped the file from the list it checks

#### Scenario: No lesson is found at all

- **WHEN** the course content folder yields no parsable lesson
- **THEN** the build fails rather than reporting success on a check that verified nothing

### Requirement: The invariant runs wherever the prerender build runs

The check SHALL live inside the prerender build, so it executes in every environment that runs `npm run build:prerender`, including Vercel deployments.

#### Scenario: Vercel preview deployment

- **WHEN** Vercel builds a preview deployment for a pull request and the prerender output is incomplete
- **THEN** the deployment fails
- **AND** the failure is visible on the pull request before merge

#### Scenario: Vercel production deployment

- **WHEN** Vercel builds a production deployment and the prerender output is incomplete
- **THEN** the deployment fails and the broken output is not published

#### Scenario: Local prerender build

- **WHEN** a contributor runs `npm run build:prerender` locally
- **THEN** the same check runs, with no separate command to remember

### Requirement: Claims about build output belong to the invariant, not to a test

A new assertion about the contents of `dist/` SHALL be added to the build check rather than to a Playwright spec.

A spec reading `dist/` has to skip when no prerender build has run, which is the normal case — it then reports green without having verified anything.

#### Scenario: A new build-output claim is added

- **WHEN** a contributor wants to assert something about the prerendered output
- **THEN** the assertion goes into the build check, where it runs on every build
- **AND** `tests/AGENTS.md` states this rule so the choice is not left to judgement
