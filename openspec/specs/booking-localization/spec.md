# booking-localization Specification

## Purpose
Keeps the consultation booking in the visitor's language. The home-page booking section, the booking modal and the Zencal calendar widget are rendered from locale keys and follow the language of the route, so a visitor who arrives on `/en/` is not met by a Polish section and a Polish calendar.

Both languages book the same free consultation; an English visitor gets the English Zencal interface, not a separate event. The event's own name and description are content stored in Zencal and are outside this capability.

## Requirements

### Requirement: The booking section, modal and widget follow the route language

The booking section on the home page, the booking modal (title and description) and the loading text of the calendar SHALL be rendered from locale keys, in Polish on Polish routes and in English under `/en/`. The Zencal widget SHALL be initialised with the same language through its `data-lang` attribute. Both languages SHALL book the same free consultation (`konsultacja`); this requirement does not introduce a separate English event type.

#### Scenario: English home page shows the booking section in English

- **WHEN** a visitor opens `/en/` and scrolls to `#booking`
- **THEN** the section heading, subheading, description, benefits, button and note are English
- **AND** none of them is Polish

#### Scenario: English visitor opens the booking modal

- **WHEN** a visitor on `/en/` clicks the booking button
- **THEN** the modal title and description are English
- **AND** the Zencal widget element carries `data-lang="en"`

#### Scenario: Polish visitor is unaffected

- **WHEN** a visitor opens `/` and opens the booking modal
- **THEN** the section, the modal title ("Rezerwacja bezpłatnej konsultacji") and the description are the existing Polish text
- **AND** the Zencal widget element carries `data-lang="pl"`

#### Scenario: Booking opened from an English blog post

- **WHEN** a visitor on `/en/blog/<slug>` opens the booking modal from the article
- **THEN** the modal and the widget are English, as on the home page

### Requirement: Booking strings exist in both languages

Every `booking.*` key present in `locales/pl` SHALL be present in `locales/en`, with a translated value.

#### Scenario: A booking string is added to one language only

- **WHEN** a `booking.*` key exists in `locales/pl` and not in `locales/en`
- **THEN** the English route would render the key name, which is a defect to fix before merge
