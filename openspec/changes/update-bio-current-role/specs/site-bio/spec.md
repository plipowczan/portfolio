## ADDED Requirements

### Requirement: Bio identifies current professional role

The home page About section SHALL identify the site owner's current professional role as (a) an independent consultant in business process optimization and technology, AND (b) co-founder and CTO at Qamera AI. Both roles MUST appear in the first paragraph of the About section, in both Polish and English locales.

#### Scenario: Polish home page mentions independent consultant role
- **WHEN** a client requests `https://pawel.lipowczan.pl/`
- **THEN** the rendered About section contains the phrase "niezależny konsultant"

#### Scenario: Polish home page mentions Qamera AI CTO role
- **WHEN** a client requests `https://pawel.lipowczan.pl/`
- **THEN** the rendered About section contains both "współzałożyciel" and "Qamera AI"

#### Scenario: English home page mentions independent consultant role
- **WHEN** a client requests `https://pawel.lipowczan.pl/en/`
- **THEN** the rendered About section contains the phrase "independent consultant"

#### Scenario: English home page mentions Qamera AI CTO role
- **WHEN** a client requests `https://pawel.lipowczan.pl/en/`
- **THEN** the rendered About section contains both "co-founder" and "Qamera AI"

### Requirement: Bio includes Qamera AI product description

The bio SHALL include a one-sentence description of Qamera AI (virtual photo studio for e-commerce brands, fashion focus, replacing product photo shoots with generative AI).

#### Scenario: Polish bio describes Qamera AI product
- **WHEN** a client requests `https://pawel.lipowczan.pl/`
- **THEN** the rendered About section contains the phrase "wirtualne studio fotograficzne"
- **AND** mentions "e-commerce" and at least one of "swimwear" / "bielizna"

#### Scenario: English bio describes Qamera AI product
- **WHEN** a client requests `https://pawel.lipowczan.pl/en/`
- **THEN** the rendered About section contains the phrase "virtual photo studio"
- **AND** mentions "e-commerce" and at least one of "swimwear" / "lingerie"

### Requirement: Bio does not present stale employer as current role

The bio SHALL NOT present "Tigers" or "Automation House" as the site owner's current role. Historical mention is permitted only when explicitly framed as past experience (e.g. "previously", "wcześniej").

#### Scenario: Polish bio does not state current employment at Tigers/AH
- **WHEN** a client requests `https://pawel.lipowczan.pl/`
- **THEN** the rendered About section does NOT contain "Jako Technical Lead w Tigers" (current-tense framing)
- **AND** any mention of Tigers/Automation House is preceded by a past-tense marker like "wcześniej", "uprzednio", or "był"

#### Scenario: English bio does not state current employment at Tigers/AH
- **WHEN** a client requests `https://pawel.lipowczan.pl/en/`
- **THEN** the rendered About section does NOT contain "As a Technical Lead at Tigers" (current-tense framing)
- **AND** any mention of Tigers/Automation House is preceded by a past-tense marker like "previously" or "earlier"

### Requirement: Bio articulates analysis-first operating principle

The bio SHALL articulate the operating principle that analysis and business processes take precedence over technology choice (i.e. tools are picked to fit the problem, not the other way around).

#### Scenario: Polish bio includes process-over-tech principle
- **WHEN** a client requests `https://pawel.lipowczan.pl/`
- **THEN** the rendered About section contains text expressing that analysis/processes come first and technology is secondary (e.g. "kluczowa jest analiza i procesy", "technologia jest wtórna")

#### Scenario: English bio includes process-over-tech principle
- **WHEN** a client requests `https://pawel.lipowczan.pl/en/`
- **THEN** the rendered About section contains text expressing that analysis/processes come first and technology is secondary (e.g. "analysis and processes come first", "technology is secondary")

### Requirement: Person schema includes Qamera AI as employer

The JSON-LD Person object on the home page SHALL include a `worksFor` property identifying Qamera AI as the current organization.

#### Scenario: Person schema includes worksFor Qamera AI
- **WHEN** the prerendered HTML for `/` is parsed for `application/ld+json` script tags
- **THEN** at least one Person object contains `"worksFor": { "@type": "Organization", "name": "Qamera AI" }` (with optional `url` property)

### Requirement: Documentation templates reflect current role

User-facing documentation that includes ready-to-paste bio text (e.g. `docs/seo/github-profile-readme-template.md`) SHALL match the live bio's framing of current and past roles.

#### Scenario: GitHub profile README template reflects current role
- **WHEN** `docs/seo/github-profile-readme-template.md` is read
- **THEN** the file mentions "Qamera AI" and "independent consultant" / "niezależny konsultant"
- **AND** does NOT present "Technical Lead at Tigers/Automation House" as the current role
