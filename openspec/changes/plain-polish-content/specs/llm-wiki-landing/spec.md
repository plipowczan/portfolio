## ADDED Requirements

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
