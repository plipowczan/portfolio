# Delta: llm-wiki-landing (add-course-objections-faq)

## ADDED Requirements

### Requirement: Landing addresses the build-vs-buy objection below the form

The landing at `/llm-wiki` SHALL address the "why pay if I can build it myself" objection in two layers: (1) a 1–2 sentence TLDR near the signup CTA (free method vs paid ready-made notes), and (2) a full Q&A block rendered **below** the signup form in the living-note aesthetic, sourced from the same shared data module as the hub FAQ (`src/data/courseFaq.js`). The landing SHALL NOT emit FAQPage JSON-LD (the hub is the canonical FAQ page). The block SHALL NOT contain links to the template repo or to `/llm-wiki/kurs`, preserving the pre-signup gating requirement. All copy SHALL follow the plain-Polish rules.

#### Scenario: TLDR appears near the CTA

- **WHEN** the landing renders before any successful submit
- **THEN** the copy near the signup form states that the method/template is free and payment covers ready-made, processed notes

#### Scenario: Objections block renders below the form

- **WHEN** the landing renders before any successful submit
- **THEN** an objections Q&A block is present after the signup form block in document order
- **AND** it contains at least the build-vs-buy question and answer

#### Scenario: No FAQPage schema on the landing

- **WHEN** the landing page's structured data is inspected
- **THEN** no `FAQPage` JSON-LD block is present

#### Scenario: Gating preserved

- **WHEN** the landing renders before any successful submit
- **THEN** the objections block contains no link to `https://github.com/plipowczan/second-brain-template` and no link to `/llm-wiki/kurs`

#### Scenario: Objections block is prerendered

- **WHEN** `npm run build:prerender` runs
- **THEN** `dist/llm-wiki/index.html` contains the build-vs-buy question text
