# llm-wiki-course Specification

## Purpose
TBD - created by archiving change add-llm-wiki-course. Update Purpose after archive.
## Requirements
### Requirement: Prerendered PL course hub at /llm-wiki/kurs

The site SHALL serve a PL course hub at `/llm-wiki/kurs`, prerendered to static HTML, listing the five lessons and linking to the waitlist and the template repo. It SHALL NOT be mirrored to `/en/llm-wiki/kurs`.

#### Scenario: Hub renders lesson index

- **WHEN** a client navigates to `/llm-wiki/kurs`
- **THEN** the page renders a hub title and links to all five lesson routes (`/llm-wiki/kurs/1-zaloz-katalog` … `/llm-wiki/kurs/5-rozwoj-i-publikacja`)
- **AND** a CTA links to `/llm-wiki`
- **AND** a link to `https://github.com/plipowczan/second-brain-template` is present

#### Scenario: Hub prerendered, no EN mirror

- **WHEN** `npm run build:prerender` runs
- **THEN** `dist/llm-wiki/kurs/index.html` exists and contains a `name="description"` meta tag
- **AND** `dist/en/llm-wiki/kurs` does NOT exist

### Requirement: Five prerendered PL lesson routes with prev/next

The site SHALL serve five markdown-driven lesson articles, each at its own route under `/llm-wiki/kurs/`, prerendered to static HTML, with previous/next navigation derived from lesson order. None SHALL be mirrored to `/en/`.

#### Scenario: Each lesson renders its content and CTA

- **WHEN** a client navigates to any `/llm-wiki/kurs/<slug>` lesson route
- **THEN** the page renders the lesson title as an `h1` and the lesson body (headings, lists, command tables, code/tree blocks)
- **AND** a CTA links to `/llm-wiki`

#### Scenario: Prev/next reflect lesson order

- **WHEN** lesson 2 (`2-onboarding`) is rendered
- **THEN** a "previous" link points to `/llm-wiki/kurs/1-zaloz-katalog` and a "next" link points to `/llm-wiki/kurs/3-pierwszy-ingest`

#### Scenario: First and last lessons omit the missing neighbour

- **WHEN** lesson 1 is rendered
- **THEN** no "previous" lesson link is shown
- **WHEN** lesson 5 is rendered
- **THEN** no "next" lesson link is shown

#### Scenario: Lessons prerendered, no EN mirror

- **WHEN** `npm run build:prerender` runs
- **THEN** `dist/llm-wiki/kurs/<slug>/index.html` exists for all five lessons, each with a `name="description"` meta tag
- **AND** no `dist/en/llm-wiki/kurs/**` files exist

#### Scenario: Unknown lesson slug degrades gracefully

- **WHEN** a client navigates to `/llm-wiki/kurs/<nonexistent-slug>`
- **THEN** a "not found" state is shown with a link back to `/llm-wiki/kurs`
- **AND** no crash or blank screen occurs

### Requirement: Course content sourced 1:1 from the deliverable

The course content SHALL reproduce the "Wsad merytoryczny" (Hub + L1–L5) from the `SECOND_BRAIN_KURS` deliverable without changing meaning, commands, or structure; only prose and styling MAY be refined.

#### Scenario: Commands and structure preserved

- **WHEN** any lesson is compared against the deliverable's corresponding section
- **THEN** the commands (`/onboard`, `/ingest`, `/qa`, `/lint`, `/reindex`, …), the `kb-template/` tree, the layer/command tables, and the section order match the source

### Requirement: Course section is PL-only with EN paths redirected

The course SHALL be PL-only. Requests under `/en/llm-wiki/kurs...` SHALL redirect to the corresponding PL path, and no `/en` hreflang alternate SHALL be emitted for course pages.

#### Scenario: EN course path redirects to PL, preserving the deep path

- **WHEN** a client navigates to `/en/llm-wiki/kurs/2-onboarding`
- **THEN** it is redirected to `/llm-wiki/kurs/2-onboarding`

#### Scenario: No EN hreflang leak

- **WHEN** a course page's `<head>` is inspected
- **THEN** the `hreflang` alternates point at the page's own PL URL (no `/en/llm-wiki/kurs` URL is advertised to crawlers)

### Requirement: Course reuses the landing design system and the shared markdown renderer

The hub and lessons SHALL reuse the landing's visual language (dark surfaces, `primary-500` accents, mono motif, `GrowingNetworkBackground`, `SEO` component). Lesson markdown SHALL be rendered through a shared renderer also used by the blog, without changing blog rendering behaviour.

#### Scenario: Shared renderer does not regress blog

- **WHEN** the blog markdown renderer is extracted into a shared component and adopted by the course
- **THEN** existing blog posts render identically (existing blog e2e passes) and lesson pages render tables, code blocks, and the tree correctly

#### Scenario: No backend dependency

- **WHEN** a lesson or the hub CTA is activated
- **THEN** it navigates to the `/llm-wiki` waitlist form (no duplicated Formspree form and no server call originates from the course pages themselves)

### Requirement: Course hub shows the audience and prerequisites

The course hub at `/llm-wiki/kurs` SHALL render the same "Dla kogo jest ten kurs" content as the landing — audience description plus prerequisite concepts with one-sentence plain-Polish definitions — sourced from the same shared data module. The section SHALL NOT push the lesson index below the fold on desktop.

#### Scenario: Hub renders the audience section

- **WHEN** a client navigates to `/llm-wiki/kurs`
- **THEN** the "Dla kogo jest ten kurs" section is rendered with the same concept list as the landing

#### Scenario: Hub section is prerendered

- **WHEN** `npm run build:prerender` runs
- **THEN** `dist/llm-wiki/kurs/index.html` contains the audience section's heading text

