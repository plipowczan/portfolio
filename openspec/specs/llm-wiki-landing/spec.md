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

The landing SHALL render an ambient node-graph canvas that accretes nodes over time. The canvas SHALL be decorative (`aria-hidden`).

The original requirement added "without mutating the shared `NetworkBackground` used elsewhere". That clause existed to stop the landing's growth behaviour from changing the homepage, at a time when the only way to get it was to fork the component. The fork then gained a reduced-motion branch, an `aria-hidden` and a resize repaint that were never carried back, so the homepage kept an unbounded animation loop that ignores the system preference — the outcome the clause was written to prevent, arriving by the route it left open.

One parameterised component reaches the same guarantee by construction: the landing's growth is opt-in through props, and the homepage cannot silently inherit it. What the clause protected is therefore stated directly instead.

#### Scenario: Canvas present
- **WHEN** the landing renders
- **THEN** a `canvas` element with `aria-hidden="true"` is present

#### Scenario: Reduced motion honored
- **WHEN** the user agent reports `prefers-reduced-motion: reduce`
- **THEN** the graph renders a single static frame and does not animate or spawn new nodes

#### Scenario: Growth is opt-in, not inherited
- **WHEN** `NetworkBackground` is rendered without growth parameters, as on the homepage
- **THEN** it seeds an ambient field sized to the viewport and does not accrete nodes

### Requirement: Email capture via server endpoint into Resend

The landing SHALL POST valid submissions to the same-origin `/api/subscribe` endpoint (NOT to Formspree) with a JSON body containing `email` and a `source: "waitlist"` field, plus a hidden honeypot field that real users leave empty. The landing SHALL reject invalid emails client-side before sending any request, SHALL treat any 2xx response — including an already-subscribed email — as success (showing the success screen), and SHALL show an inline error without leaving the form on a non-2xx response or network failure. The contact form's separate use of Formspree is unaffected.

#### Scenario: Invalid email is rejected client-side
- **WHEN** the visitor submits an input that is not a valid email
- **THEN** an inline error (`#waitlist-email-error`) is shown and no request is sent to `/api/subscribe`

#### Scenario: Valid email is submitted with the waitlist tag
- **WHEN** the visitor submits a valid email
- **THEN** the request goes to the same-origin `/api/subscribe` endpoint
- **AND** the request body includes `email` and `source: "waitlist"`

#### Scenario: Already-subscribed email still shows success
- **WHEN** the endpoint responds 2xx for an email already on the list
- **THEN** the form is replaced in place by the success screen (identical to a first-time signup)

#### Scenario: Endpoint error keeps the form and shows an inline error
- **WHEN** the endpoint responds with a non-2xx status or the request fails
- **THEN** the success screen is NOT shown and an inline error message is displayed

### Requirement: Gated repo + onboarding delivery on success

The repo link and onboarding guide SHALL be hidden before signup and revealed only after a successful submit, in an in-place success screen (no navigation). The signup endpoint sends no email, so the success screen is the visitor's only confirmation: its header MUST state that the address is saved and contain "Adres zapisany", and its text SHALL say that news about further materials arrives by email. The success screen SHALL additionally reveal a link to the free course hub (`/llm-wiki/kurs`). The course is publicly reachable (ungated) and the landing links to it below the signup form before signup as well, so neither course link is a gate; the repo link and the onboarding guide are the only items hidden until signup.

#### Scenario: Repo link gated before signup

- **WHEN** the landing first renders, before any successful submit
- **THEN** there is no link to `https://github.com/plipowczan/second-brain-template`
- **AND** the onboarding quick-start is not shown

#### Scenario: Course link reachable before signup

- **WHEN** the landing first renders, before any successful submit
- **THEN** a link to `/llm-wiki/kurs` is present below the signup form

#### Scenario: Success screen reveals repo link and quick-start

- **WHEN** a valid email submission succeeds
- **THEN** the form is replaced in place by a success screen whose header contains "Adres zapisany"
- **AND** a link to `https://github.com/plipowczan/second-brain-template` is present
- **AND** a "first 5 minutes" quick-start guide is shown

#### Scenario: Success screen links to the free course

- **WHEN** a valid email submission succeeds
- **THEN** the success screen contains a link to `/llm-wiki/kurs`

### Requirement: Signup copy describes what the list delivers, not a course launch

The signup copy on the landing — the paragraph above the form, the success screen, and the page's meta description — SHALL describe the mailing list by what it delivers (news about further materials, sent by email) and SHALL NOT announce a course start, either as upcoming ("gdy ruszy kurs") or as just happened ("kurs już ruszył"). The course is public and linked from the page, so a launch announcement contradicts the page itself. The copy SHALL NOT say what "will be in the course" either; the course is live and its content is stated by the course. It SHALL NOT assert that no confirmation email will be sent, so that adding a welcome mail later does not leave a false sentence behind.

#### Scenario: Copy above the form names the delivery, not a launch

- **WHEN** the landing first renders, before any successful submit
- **THEN** the paragraph above the form says that news about further materials arrives by email
- **AND** neither that paragraph nor the page's meta description contains wording that announces the course start

#### Scenario: Success screen confirms the saved address and announces no launch

- **WHEN** a valid email submission succeeds
- **THEN** the success screen says the address was saved and that news arrives by email
- **AND** it contains no sentence announcing the course start or saying what will be in the course

### Requirement: Consent copy reflects capture-only backend
The landing SHALL present a RODO/consent line referencing mail contact (not newsletter subscription) and linking to `/privacy-policy`, and SHALL hide that line once the success screen is shown.

#### Scenario: Consent line present before signup
- **WHEN** the landing first renders
- **THEN** a consent line links to `/privacy-policy`

#### Scenario: Consent line hidden after success
- **WHEN** the success screen is shown
- **THEN** the pre-signup consent line is no longer rendered

### Requirement: Landing states the audience and prerequisites before signup

The `/llm-wiki` landing SHALL present, before the waitlist form is reached in document order, a "Dla kogo jest ten kurs" section containing: (a) a short plain-Polish description of who benefits from the course, and (b) a list of prerequisite concepts where each concept carries a one-sentence plain-Polish definition. The concept list SHALL be derived from terms actually used in the lessons (at minimum: LLM, agent, markdown, git, Claude Code) and SHALL be sourced from a data module shared with the course hub so the two pages cannot drift.

#### Scenario: Section visible with defined concepts

- **WHEN** a visitor scrolls the `/llm-wiki` landing
- **THEN** a "Dla kogo jest ten kurs" section is visible before the waitlist form
- **AND** each listed prerequisite concept is followed by a one-sentence definition in plain Polish

#### Scenario: Section is prerendered

- **WHEN** `npm run build:prerender` runs
- **THEN** `dist/llm-wiki/index.html` contains the audience section's heading text

#### Scenario: Shared source with the course hub

- **WHEN** the prerequisite list is edited in the shared data module
- **THEN** both the landing and the course hub render the updated list without further edits

### Requirement: Landing addresses the build-vs-buy objection below the form

The landing at `/llm-wiki` SHALL address the "why pay if I can build it myself" objection in two layers: (1) a 1–2 sentence TLDR near the signup CTA (free method vs paid ready-made notes), and (2) a full Q&A block rendered **below** the signup form in the living-note aesthetic, sourced from the same shared data module as the hub FAQ (`src/data/courseFaq.js`). Landing entries SHALL render as an accordion collapsed by default (question visible, answer expands on demand) so the block stays compact on the conversion page. The landing SHALL NOT emit FAQPage JSON-LD (the hub is the canonical FAQ page). The block SHALL NOT contain links to the template repo or to `/llm-wiki/kurs`, preserving the pre-signup gating requirement. All copy SHALL follow the plain-Polish rules.

#### Scenario: TLDR appears near the CTA

- **WHEN** the landing renders before any successful submit
- **THEN** the copy near the signup form states that the method/template is free and payment covers ready-made, processed notes

#### Scenario: Objections block renders below the form

- **WHEN** the landing renders before any successful submit
- **THEN** an objections Q&A block is present after the signup form block in document order
- **AND** it contains at least the build-vs-buy question and answer

#### Scenario: Entries collapsed by default, expandable

- **WHEN** the objections block renders
- **THEN** each entry shows its question with the answer hidden
- **WHEN** the visitor activates a question
- **THEN** that entry's answer becomes visible

#### Scenario: No FAQPage schema on the landing

- **WHEN** the landing page's structured data is inspected
- **THEN** no `FAQPage` JSON-LD block is present

#### Scenario: Gating preserved

- **WHEN** the landing renders before any successful submit
- **THEN** the objections block contains no link to `https://github.com/plipowczan/second-brain-template` and no link to `/llm-wiki/kurs`

#### Scenario: Objections block is prerendered

- **WHEN** `npm run build:prerender` runs
- **THEN** `dist/llm-wiki/index.html` contains the build-vs-buy question text

