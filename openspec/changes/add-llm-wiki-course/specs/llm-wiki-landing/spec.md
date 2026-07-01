## MODIFIED Requirements

### Requirement: Gated repo + onboarding delivery on success

The repo link and onboarding guide SHALL be hidden before signup and revealed only after a successful submit, in an in-place success screen (no navigation). The success header MUST contain "Jesteś na liście". The success screen SHALL additionally reveal a link to the free course hub (`/llm-wiki/kurs`), so a fresh signup gets the course link on-page. The course itself remains publicly reachable (ungated); this link is a convenience nudge, not a gate.

#### Scenario: Repo link gated before signup

- **WHEN** the landing first renders, before any successful submit
- **THEN** there is no link to `https://github.com/plipowczan/second-brain-template`
- **AND** there is no link to `/llm-wiki/kurs`

#### Scenario: Success screen reveals repo link and quick-start

- **WHEN** a valid email submission succeeds
- **THEN** the form is replaced in place by a success screen whose header contains "Jesteś na liście"
- **AND** a link to `https://github.com/plipowczan/second-brain-template` is present
- **AND** a "first 5 minutes" quick-start guide is shown

#### Scenario: Success screen links to the free course

- **WHEN** a valid email submission succeeds
- **THEN** the success screen contains a link to `/llm-wiki/kurs`
