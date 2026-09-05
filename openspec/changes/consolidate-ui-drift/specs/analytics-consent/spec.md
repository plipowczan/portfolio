## ADDED Requirements

### Requirement: The cookie policy names the cookieless measurement that runs without consent

The cookie policy SHALL name the measurement tools that run regardless of the consent choice, state what they collect, and state why they are not behind the consent gate.

This capability already permits cookieless analytics to keep running for a visitor who declines, so that the site retains a baseline traffic and performance measurement. A visitor who has just clicked "Reject" has no way to learn that anything still measures them unless the policy says so, and the policy currently names only the cookie-setting analytics. The gap is not in the behaviour — it is that the site's own documentation describes a narrower site than the one that ships.

Naming SHALL be specific enough to identify the tools, not a generic reference to "analytics tools".

#### Scenario: Policy names the cookieless tools

- **WHEN** the cookie policy is read in Polish or in English
- **THEN** it names the cookieless traffic and performance measurement the site loads for every visitor
- **AND** states that it sets no cookies and identifies no individual

#### Scenario: Policy explains why they are not gated

- **WHEN** the cookie policy's consent section is read
- **THEN** it states that the cookieless measurement runs regardless of the consent choice
- **AND** distinguishes it from the cookie-setting analytics that requires an explicit accept

#### Scenario: Disclosure is present in both languages

- **WHEN** the cookie policy is opened in Polish and in English
- **THEN** each renders the disclosure with translated text and no missing translation key

#### Scenario: Adding a cookieless tool updates the policy

- **WHEN** a further measurement tool is added outside the consent gate
- **THEN** the cookie policy names it in the same change
