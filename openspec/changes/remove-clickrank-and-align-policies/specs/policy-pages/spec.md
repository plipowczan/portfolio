## Purpose

Keeps the privacy policy, terms of service and cookie policy truthful about the site that ships: what it loads, whom it sends visitor data to, and when each document last changed.

## ADDED Requirements

### Requirement: Each legal document shows a fixed last-updated date

The privacy policy, the terms of service and the cookie policy SHALL each show a "last updated" date that is declared together with the document's source and changed by hand when the document's text changes. The date SHALL NOT be derived from the moment the page is rendered, built or visited.

The date SHALL be the same as the `lastmod` the sitemap publishes for that document, so a crawler and a reader see one date. A disagreement between the two SHALL fail the build.

The date SHALL render as the same calendar day for every visitor, independent of the visitor's time zone, in the date format of the page's language.

This requirement exists because the pages printed the render date: the static HTML carried the build day, and a visitor saw the day of the visit. A legal document whose date moves on its own says nothing about when its terms changed.

#### Scenario: Date does not follow the render date

- **WHEN** a legal page is rendered on a day other than its declared date
- **THEN** the page shows the declared date

#### Scenario: Prerendered HTML carries the declared date

- **WHEN** the prerendered HTML of a legal page is read
- **THEN** it contains the declared date, not the day of the build

#### Scenario: Time zone does not shift the day

- **WHEN** the date is formatted in a time zone behind UTC
- **THEN** it shows the declared calendar day, not the day before

#### Scenario: Sitemap and page agree

- **WHEN** a legal page's declared date differs from the sitemap date declared for the same page
- **THEN** the build fails with a message naming the page and both dates

#### Scenario: Both languages show the same date

- **WHEN** a legal page is opened in Polish and in English
- **THEN** both show the same calendar day, each in its own language's format

### Requirement: The policies name every third-party service the site uses, and no other

The cookie policy SHALL name each third-party service that loads in the visitor's browser or stores information on the visitor's device, say when it loads (always, after consent, or on a specific action), and list what the site itself stores on the device.

The privacy policy SHALL name each service that receives visitor data — through the browser, a form, or the site's server — and what it receives.

Neither policy SHALL name a service the site no longer uses. Naming SHALL identify the service, not only its category ("analytics tools", "email providers").

A change that adds or removes a third-party service SHALL update both policies in the same change.

#### Scenario: Cookie policy matches what loads

- **WHEN** the cookie policy is read in Polish or in English
- **THEN** it names Google Analytics as loading only after an explicit accept, the Zencal booking widget as loading when the booking window opens, and Vercel Analytics and Speed Insights as loading for every visitor without cookies
- **AND** it lists the entries the site itself writes to the browser's storage

#### Scenario: Privacy policy names the recipients

- **WHEN** the privacy policy is read in Polish or in English
- **THEN** it names the hosting provider, the analytics providers, the contact-form provider, the mailing-list provider, the booking provider, and the receiver of browser security-violation reports, each with what it receives

#### Scenario: Forms that point to the privacy policy are covered by it

- **WHEN** a form on the site tells the visitor that details are in the privacy policy
- **THEN** the privacy policy describes the processing that form starts

#### Scenario: Services no longer used are not named

- **WHEN** either policy is read
- **THEN** it does not name Google Fonts or ClickRank

#### Scenario: Removing a service updates the policies

- **WHEN** a third-party service is removed from the site
- **THEN** the same change removes it from both policies

### Requirement: The privacy policy states a legal basis for each purpose

The privacy policy SHALL pair each purpose of processing it lists with the legal basis that applies to it, and SHALL name the legitimate interest wherever that is the basis. For a purpose that rests on consent it SHALL say how the consent is withdrawn and how long the data is kept.

The bases are the controller's own statement. They were set by Paweł on 2026-10-28 and SHALL NOT be changed by an agent without his decision.

#### Scenario: Every purpose has a basis

- **WHEN** the privacy policy is read in Polish or in English
- **THEN** each purpose listed in its purposes section has a legal basis with its GDPR article in the legal-basis section

#### Scenario: Consent-based mailing list says how to leave it

- **WHEN** the privacy policy is read in Polish or in English
- **THEN** it states that the LLM Wiki list address is kept until the subscriber unsubscribes, and how to unsubscribe
