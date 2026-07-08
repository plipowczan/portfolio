# Delta: llm-wiki-course (add-course-objections-faq)

## ADDED Requirements

### Requirement: Course hub renders an objections FAQ with FAQPage schema

The course hub at `/llm-wiki/kurs` SHALL render a FAQ section addressing customer objections (at minimum: "what's the point / what if it breaks", "why pay if I can build it myself", and a condensed "grep vs index"), sourced from a shared data module (`src/data/courseFaq.js`). The hub SHALL emit FAQPage JSON-LD generated directly from that data. Among course surfaces, the hub SHALL be the only page other than lessons emitting FAQPage schema (blog posts keep their own pre-existing FAQ markup; the landing emits none). All FAQ copy SHALL follow the plain-Polish rules (`.claude/rules/content/10-prosty-polski.md`), including term definitions at first use.

#### Scenario: Hub renders the objections FAQ section

- **WHEN** a client navigates to `/llm-wiki/kurs`
- **THEN** a FAQ section is rendered in the living-note aesthetic with at least three question/answer entries
- **AND** the entries cover the "why at all", "build vs buy", and "grep vs index" objections

#### Scenario: Hub emits FAQPage JSON-LD from data

- **WHEN** the hub page's structured data is inspected
- **THEN** a `FAQPage` JSON-LD block is present whose `mainEntity` questions match the rendered FAQ entries

#### Scenario: Hub FAQ is prerendered

- **WHEN** `npm run build:prerender` runs
- **THEN** `dist/llm-wiki/kurs/index.html` contains the FAQ section's question texts and the `FAQPage` JSON-LD

### Requirement: Lesson FAQs address retrieval objections

Lesson 1 (`1-zaloz-katalog`) SHALL include a FAQ entry answering the "grep is enough — why an index?" objection (index-first, grep-second; index narrows scope, grep pinpoints inside it; honest "when grep alone suffices" admission). Lesson 4 (`4-pytania-i-zarzadzanie`) SHALL answer the "`/qa` vs asking the agent directly" objection within its existing `/qa` FAQ entry (training-memory answers vs grounded citations, retrieval discipline, repeatability) without introducing a duplicate question. Both SHALL pass the shared plain-Polish vocabulary gate.

#### Scenario: Lesson 1 answers grep vs index

- **WHEN** lesson 1's FAQ section is read
- **THEN** it contains a question addressing why an index beats raw grep at scale
- **AND** the answer concedes when grep alone suffices (small base, known exact string)

#### Scenario: Lesson 4 answers /qa vs direct prompt without duplication

- **WHEN** lesson 4's FAQ section is read
- **THEN** the existing "`/qa` vs chat" entry explains grounding/citations and retrieval discipline
- **AND** no second near-duplicate question about `/qa` vs chat exists in the same FAQ

#### Scenario: FAQPage schema picks up the new entries

- **WHEN** lesson 1 renders in a client
- **THEN** the emitted FAQPage JSON-LD includes the new grep-vs-index question

## MODIFIED Requirements

### Requirement: Course content sourced 1:1 from the deliverable

The course content SHALL reproduce the "Wsad merytoryczny" (Hub + L1–L5) from the `SECOND_BRAIN_KURS` deliverable without changing meaning, commands, or structure; only prose and styling MAY be refined. In addition, lesson FAQ sections MAY contain objection-derived entries adapted from the `SECOND_BRAIN_KURS` objections file (`data/obiekcje-klientow.md`), provided the adaptations pass the course content-style gates and do not alter deliverable-sourced content.

#### Scenario: Commands and structure preserved

- **WHEN** any lesson is compared against the deliverable's corresponding section
- **THEN** the commands (`/onboard`, `/ingest`, `/qa`, `/lint`, `/reindex`, …), the `kb-template/` tree, the layer/command tables, and the section order match the source

#### Scenario: Objection-derived FAQ additions are allowed

- **WHEN** a lesson FAQ contains an entry adapted from the objections file
- **THEN** the entry passes the plain-Polish vocabulary gate
- **AND** deliverable-sourced sections of the lesson remain unchanged in meaning, commands, and structure
