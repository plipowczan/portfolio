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

### Requirement: Prerendered output contains no duplicate or route-foreign structured data

Each prerendered document SHALL contain only the structured-data blocks its own
route declares, and SHALL contain each of them exactly once. A document SHALL
NOT carry a block that another route declares.

The existing prerender guard validates canonical, description and og:title. Those
are managed by the head-tag layer; structured data is not, so the guard cannot
observe it. That gap is how `/privacy-policy` came to serve the homepage's
`Person` block and `/en/` came to serve it twice.

#### Scenario: A route carries another route's structured data

- **WHEN** the prerendered `/privacy-policy` contains a `Person` block that only
  the homepage route declares
- **THEN** the build fails, naming the route and the block's `@type`

#### Scenario: A route carries the same block twice

- **WHEN** a prerendered document contains two structured-data blocks with
  identical content
- **THEN** the build fails, naming the route and the duplicated `@type`

#### Scenario: A route carries exactly what it declares

- **WHEN** a prerendered blog post contains the `BlogPosting`, `BreadcrumbList`
  and `Person` blocks its route declares, each once
- **THEN** the build succeeds
