## MODIFIED Requirements

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

## ADDED Requirements

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
