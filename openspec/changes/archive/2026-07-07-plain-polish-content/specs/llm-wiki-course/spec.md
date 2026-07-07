## ADDED Requirements

### Requirement: Course hub shows the audience and prerequisites

The course hub at `/llm-wiki/kurs` SHALL render the same "Dla kogo jest ten kurs" content as the landing — audience description plus prerequisite concepts with one-sentence plain-Polish definitions — sourced from the same shared data module. The section SHALL NOT push the lesson index below the fold on desktop.

#### Scenario: Hub renders the audience section

- **WHEN** a client navigates to `/llm-wiki/kurs`
- **THEN** the "Dla kogo jest ten kurs" section is rendered with the same concept list as the landing

#### Scenario: Hub section is prerendered

- **WHEN** `npm run build:prerender` runs
- **THEN** `dist/llm-wiki/kurs/index.html` contains the audience section's heading text
