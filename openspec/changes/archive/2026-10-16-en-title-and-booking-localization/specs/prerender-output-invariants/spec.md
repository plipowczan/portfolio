## ADDED Requirements

### Requirement: English routes carry no Polish metadata or booking text

The prerender build check SHALL fail when any route file under `dist/en/` has a `<title>`, `og:title`, `twitter:title`, `<meta name="description">` or `og:description` containing a Polish diacritic (`ą ć ę ł ń ó ś ź ż`, either case) that is not covered by the check's allow-list of names, or when its visible text contains any Polish value of a `booking.*` key from `locales/pl`. The error SHALL name the file and the offending field or string.

The check cannot recognise Polish prose in general. It guards the two ways the English site has already shipped Polish: a metadata fallback to a Polish default, and a hard-coded Polish section.

#### Scenario: English route falls back to a Polish title

- **WHEN** `dist/en/index.html` has `<title>Pawel Lipowczan | Twój Przewodnik Technologiczny</title>`
- **THEN** the build fails with a non-zero exit code
- **AND** the error names `en/index.html` and the title

#### Scenario: English route falls back to a Polish description

- **WHEN** a route file under `dist/en/` has a `<meta name="description">` containing Polish diacritics
- **THEN** the build fails and the error names the file

#### Scenario: Polish booking text on an English route

- **WHEN** the visible text of a route file under `dist/en/` contains a Polish `booking.*` string, for example "Umów spotkanie"
- **THEN** the build fails and the error names the file and the string

#### Scenario: Polish route may be Polish

- **WHEN** a file outside `dist/en/` carries Polish metadata or booking text
- **THEN** this check does not flag it

#### Scenario: Allow-listed name

- **WHEN** an English description contains a Polish proper name that is on the allow-list
- **THEN** that name alone does not fail the build

#### Scenario: English output is clean

- **WHEN** every route file under `dist/en/` has English metadata and no Polish booking text
- **THEN** the build completes and reports the number of English routes checked
