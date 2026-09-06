## ADDED Requirements

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
