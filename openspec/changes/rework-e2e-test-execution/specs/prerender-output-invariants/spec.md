## ADDED Requirements

### Requirement: The prerender build verifies its own output

`npm run build:prerender` SHALL verify the contents of `dist/` after prerendering and SHALL exit non-zero when the output is incomplete or wrong.

`scripts/prerender.mjs` already exits non-zero when a route it was asked to render fails. It cannot detect a route that was never on the list, nor a page that rendered but lost its metadata. Those are the gaps this check closes — the same gaps the Playwright block at `tests/e2e/llm-wiki-course.spec.js` covered, from a place that only ran when someone remembered to run it.

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

#### Scenario: Output is complete

- **WHEN** the hub and every lesson exist with a meta description, and no EN mirror is present
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

### Requirement: The invariant runs wherever the prerender build runs

The check SHALL live inside the prerender build, so it executes in every environment that runs `npm run build:prerender`, including Vercel deployments.

`vercel.json` sets `buildCommand: "npm run build:prerender"`, so this places the gate on every preview and production deployment at no CI cost.

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
