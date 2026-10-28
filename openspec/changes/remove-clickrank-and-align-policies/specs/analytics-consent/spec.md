## ADDED Requirements

### Requirement: The cookie policy explains the measurement that runs without consent

The cookie policy SHALL name the measurement tools that run regardless of the consent choice, state that they set no cookies, and state that they run whatever the visitor answers in the cookie banner, as distinct from the cookie-setting analytics that requires an explicit accept.

This capability already permits cookieless analytics to keep running for a visitor who declines, so that the site keeps a baseline traffic and performance measurement. A visitor who has just clicked "Reject" has no way to learn that anything still measures them unless the policy says so.

Naming SHALL identify the tools, not refer generically to "analytics tools". The general rule that both policies name every third-party service lives in the `policy-pages` capability; this requirement adds only what the consent gate makes necessary to say.

#### Scenario: Policy names the cookieless tools

- **WHEN** the cookie policy is read in Polish or in English
- **THEN** it names the cookieless traffic and performance measurement the site loads for every visitor
- **AND** states that it sets no cookies

#### Scenario: Policy explains why they are not gated

- **WHEN** the cookie policy's consent section is read
- **THEN** it states that the cookieless measurement runs regardless of the consent choice
- **AND** distinguishes it from the cookie-setting analytics that requires an explicit accept

#### Scenario: Disclosure is present in both languages

- **WHEN** the cookie policy is opened in Polish and in English
- **THEN** each renders the disclosure with translated text and no missing translation key
