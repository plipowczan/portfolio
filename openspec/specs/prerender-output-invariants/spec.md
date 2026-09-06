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

### Requirement: The build enforces a JavaScript payload budget

`npm run build:prerender` SHALL compare the gzipped JavaScript required for the initial render of the homepage against a declared ceiling, and SHALL exit non-zero when the ceiling is exceeded. The ceiling and the measured value SHALL both appear in the build output, whether the check passes or fails.

Why a failure and not a warning: before this gate existed, the build emitted everything in one chunk of roughly 2.4 MB — about 780 kB gzipped — and reported it only as an advisory Rollup warning, which nothing acted on. Deliberately approximate: the exact pre-gate figures were measured twice, in the planning round and again against the baseline build, and they differ slightly because the content moved between them. Both are recorded with their provenance in `openspec/changes/archive/2026-09-06-speed-up-first-load/`; this spec states the motivation, not the measurement. A budget expressed as a build failure is what stops the payload from creeping back — and because `vercel.json` sets `buildCommand: "npm run build:prerender"`, it gates every deployment at no CI cost. This follows the rule already stated in this capability: a claim about the contents of `dist/` belongs to the build check, not to a Playwright spec that skips on a normal run.

#### Scenario: Payload exceeds the ceiling

- **WHEN** the prerender build finishes and the homepage's initial gzipped JavaScript exceeds the declared ceiling
- **THEN** the build exits non-zero
- **AND** the error reports the measured size and the ceiling

#### Scenario: Payload is within the ceiling

- **WHEN** the prerender build finishes and the payload is within the ceiling
- **THEN** the build succeeds
- **AND** reports the measured size and the ceiling

#### Scenario: Vercel deployment fails on a payload regression

- **WHEN** Vercel builds a deployment whose payload exceeds the ceiling
- **THEN** the deployment fails
- **AND** the failure is visible on the pull request before merge

#### Scenario: Ceiling is declared in one place

- **WHEN** a contributor needs to change the ceiling
- **THEN** it is edited in a single declared constant
- **AND** raising it is a visible change in the diff rather than a silent drift

### Requirement: Prerendered output serves its primary content visible

The prerendered HTML written to `dist/` SHALL present each route's primary
content in a visible state without requiring JavaScript to execute. Content
whose appearance is gated on entering the viewport SHALL be brought into view
during capture, so that the static file reflects the settled page rather than a
state the visitor never sees.

Primary content means the document's `<h1>` and the content of every landmark
section the route declares. Elements that are legitimately hidden by design —
a closed dialog, a collapsed menu, a decorative layer — are outside this
requirement.

This exists because the guard already present in the prerender step asserts only
that Helmet-managed head tags belong to the route. It says nothing about whether
the captured body is visible, which is how a homepage whose sections were served
hidden reached production. The measurements behind that are in the change
proposal and its archive, deliberately not here — a count in a spec is stale the
first time the page changes.

#### Scenario: Sections that animate on scroll

- **WHEN** the homepage is prerendered and its `#about`, `#projects`, `#skills`,
  `#testimonials` and `#contact` sections reveal themselves on viewport entry
- **THEN** the written HTML contains those sections in a visible state
- **AND** the build does not depend on how long the capture waits before writing

#### Scenario: A route serves its heading hidden

- **WHEN** a prerendered document's `<h1>` carries an inline style that renders
  it invisible
- **THEN** the build fails and names the route and the offending element
- **AND** nothing is written for that route

#### Scenario: A section is visible but its content is not

- **WHEN** a landmark section is captured visible while the elements inside it
  are hidden
- **THEN** the build fails, naming the section and how many of its elements are
  hidden

This scenario exists because asserting the section tag alone is not enough, and
that gap was reached in practice: one revision of the capture produced a homepage
whose headings were all visible and whose content beneath them was not, and the
build was green. A tolerance separates one element mid-animation — the
testimonials carousel always has one — from a section that never revealed.

#### Scenario: A deliberately hidden element

- **WHEN** a route contains an element hidden by design, such as a closed mobile
  menu
- **THEN** the build does not fail on account of that element

#### Scenario: Scroll animation for real visitors is unchanged

- **WHEN** a visitor with JavaScript loads a route whose sections animate on
  scroll
- **THEN** those sections still animate as they enter the viewport
- **AND** the change to prerendered output does not alter that behaviour

### Requirement: Structured data is emitted through the route-scoped head layer

Structured data SHALL be emitted through the same route-scoped mechanism as the
rest of the document head, rather than written to the document directly. A
document SHALL therefore contain only the blocks its own route declares.

The existing prerender guard validates canonical, description and og:title —
tags the head layer manages. Structured data was written outside it, so the guard
could not observe it, which is how `/privacy-policy` came to serve the homepage's
`Person` block and `/en/` came to serve it twice.

Belonging-to-the-route is guaranteed structurally by that mechanism, not by an
after-the-fact check. A build-time assertion cannot decide it: knowing which
blocks a route "should" declare would need a hand-maintained route-to-schema map,
and such a map drifts from the code it describes.

#### Scenario: A page that declares no structured data

- **WHEN** the prerendered output for a route whose page declares no structured
  data is inspected
- **THEN** it contains no structured-data block

#### Scenario: A page carries exactly what it declares

- **WHEN** a prerendered blog post is inspected
- **THEN** it contains the blocks its route declares, and no others

### Requirement: The build rejects duplicate or malformed structured data

The build SHALL fail when a prerendered document contains the same
structured-data block more than once, or a block that is not valid JSON, naming
the document and the block's type.

This is the part that *is* decidable from the output alone, and it catches the
observable symptom of head content escaping its route.

#### Scenario: The same block appears twice in one document

- **WHEN** a prerendered document contains two identical structured-data blocks
- **THEN** the build fails, naming the document and the duplicated type

#### Scenario: A block is not valid JSON

- **WHEN** a prerendered document contains a structured-data block that does not
  parse
- **THEN** the build fails, naming the document and the parse error

#### Scenario: Every block is unique and parses

- **WHEN** every structured-data block across the output is valid and unique
  within its document
- **THEN** the build succeeds
