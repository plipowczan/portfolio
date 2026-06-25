# llm-wiki-landing Specification

## Purpose
TBD - created by archiving change add-llm-wiki-waitlist-landing. Update Purpose after archive.
## Requirements
### Requirement: Prerendered PL waitlist route at /llm-wiki
The site SHALL serve a single-screen PL landing at `/llm-wiki`, prerendered to static HTML for SEO, and SHALL NOT mirror it to `/en/llm-wiki`.

#### Scenario: Route renders the hero
- **WHEN** a client navigates to `/llm-wiki`
- **THEN** the page renders an `h1` containing "rośnie sama" and exactly three `h2` elements (the value-index entries)

#### Scenario: Prerendered HTML exists, no EN mirror
- **WHEN** `npm run build:prerender` runs
- **THEN** `dist/llm-wiki/index.html` exists and contains `rośnie sama` plus a `name="description"` meta tag
- **AND** `dist/en/llm-wiki` does NOT exist

### Requirement: Growing knowledge-graph background, reduced-motion safe
The landing SHALL render an ambient node-graph canvas that accretes nodes over time, without mutating the shared `NetworkBackground` used elsewhere. The canvas SHALL be decorative (`aria-hidden`).

#### Scenario: Canvas present
- **WHEN** the landing renders
- **THEN** a `canvas` element with `aria-hidden="true"` is present

#### Scenario: Reduced motion honored
- **WHEN** the user agent reports `prefers-reduced-motion: reduce`
- **THEN** the graph renders a single static frame and does not animate or spawn new nodes

### Requirement: Email capture via Formspree tagged as waitlist
The landing SHALL POST valid submissions to `https://formspree.io/f/xblqpqab` with a hidden `source: "waitlist"` field and a `_subject`, reusing the existing Formspree endpoint without sending any campaign.

#### Scenario: Invalid email is rejected client-side
- **WHEN** the visitor submits an input that is not a valid email
- **THEN** an inline error (`#waitlist-email-error`) is shown and no request is sent to Formspree

#### Scenario: Valid email is submitted with the waitlist tag
- **WHEN** the visitor submits a valid email
- **THEN** the request body to Formspree includes `email` and `source: "waitlist"`

### Requirement: Gated repo + onboarding delivery on success
The repo link and onboarding guide SHALL be hidden before signup and revealed only after a successful submit, in an in-place success screen (no navigation). The success header MUST contain "Jesteś na liście".

#### Scenario: Repo link gated before signup
- **WHEN** the landing first renders, before any successful submit
- **THEN** there is no link to `https://github.com/plipowczan/second-brain-template`

#### Scenario: Success screen reveals repo link and quick-start
- **WHEN** a valid email submission succeeds
- **THEN** the form is replaced in place by a success screen whose header contains "Jesteś na liście"
- **AND** a link to `https://github.com/plipowczan/second-brain-template` is present
- **AND** a "first 5 minutes" quick-start guide is shown

### Requirement: Consent copy reflects capture-only backend
The landing SHALL present a RODO/consent line referencing mail contact (not newsletter subscription) and linking to `/privacy-policy`, and SHALL hide that line once the success screen is shown.

#### Scenario: Consent line present before signup
- **WHEN** the landing first renders
- **THEN** a consent line links to `/privacy-policy`

#### Scenario: Consent line hidden after success
- **WHEN** the success screen is shown
- **THEN** the pre-signup consent line is no longer rendered

