## MODIFIED Requirements

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
- **THEN** it names the hosting provider, the analytics providers, the provider that delivers contact-form messages, the mailing-list provider, the booking provider, and the receiver of browser security-violation reports, each with what it receives

#### Scenario: Forms that point to the privacy policy are covered by it

- **WHEN** a form on the site tells the visitor that details are in the privacy policy
- **THEN** the privacy policy describes the processing that form starts

#### Scenario: Services no longer used are not named

- **WHEN** either policy is read
- **THEN** it does not name Google Fonts, ClickRank or Formspree

#### Scenario: Removing a service updates the policies

- **WHEN** a third-party service is removed from the site
- **THEN** the same change removes it from both policies
