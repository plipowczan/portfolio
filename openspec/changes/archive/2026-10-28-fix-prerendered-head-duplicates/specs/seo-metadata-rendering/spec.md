# Spec Delta

## ADDED Requirements

### Requirement: The mounted document replaces the prerendered head, never adds to it

When a prerendered page loads and the application mounts, the document SHALL end up holding exactly one copy of each metadata tag the page emits: one `<title>`, one `<meta name="description">`, one `<link rel="canonical">`, one of each Open Graph and Twitter tag, and one hreflang link per language. The tags written into the static file at build time SHALL NOT stay alongside the ones the application renders. After a client-side navigation, the document SHALL hold only the tags of the page now shown. None of the static tags of the page the visitor first loaded SHALL remain.

The static file already holds exactly one of each, and the build checks that. This requirement covers the document after JavaScript runs, which is what a rendering crawler indexes. Measured before this requirement existed: two of each on every route, and after `/` → `/blog` the home page's canonical still came first.

The application SHALL NOT leave the document without these tags while a route's code is still loading. Until the page renders its own set, the prerendered set stays.

#### Scenario: Direct load of a prerendered Polish page

- **WHEN** a visitor loads `/` or `/blog` from its prerendered file and the application has rendered its own metadata
- **THEN** the document contains exactly one `<title>`, one `<meta name="description">` and one `<link rel="canonical">`
- **AND** the canonical points at the loaded address

#### Scenario: Direct load of a prerendered English page

- **WHEN** a visitor loads `/en/` from its prerendered file and the application has rendered its own metadata
- **THEN** the document contains exactly one `<title>`, one `<meta name="description">` and one `<link rel="canonical">`
- **AND** the canonical points at the `/en/` address

#### Scenario: Direct load of a prerendered article

- **WHEN** a visitor loads a blog post from its prerendered file and the application has rendered its own metadata
- **THEN** no metadata tag the page emits appears more than once
- **AND** the document carries exactly three hreflang links, as the static file does

#### Scenario: Client-side navigation after a prerendered load

- **WHEN** a visitor loads `/` from its prerendered file and then moves to `/blog` without a document load
- **THEN** the document contains exactly one `<link rel="canonical">`, pointing at `/blog`
- **AND** no tag carrying the home page's title or description remains

#### Scenario: Client-side navigation in English

- **WHEN** a visitor loads `/en/` from its prerendered file and then moves to `/en/blog` without a document load
- **THEN** the document contains exactly one `<link rel="canonical">`, pointing at `/en/blog`

#### Scenario: Checked without a production build

- **WHEN** the automated suite verifies this requirement
- **THEN** it reproduces the prerendered file from the running application the way the prerender step captures it, and serves that file as the next document load
- **AND** it runs on the default development server, with no `PW_PREVIEW` and no read of `dist/`
- **AND** it counts the tags only after the application has inserted its own, so a document that has not mounted yet cannot pass
