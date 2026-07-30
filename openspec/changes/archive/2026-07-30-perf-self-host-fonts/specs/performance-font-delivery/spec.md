## ADDED Requirements

### Requirement: Fonts are served from the site's own origin

Web fonts SHALL be served from the site's own origin. No page SHALL issue a request to `fonts.googleapis.com` or `fonts.gstatic.com`, and the CSP SHALL NOT permit either origin. Loading them via `@import` puts two cold TLS handshakes to third-party hosts at the end of a serial chain that the browser cannot even begin until the application CSS has been fetched and parsed.

The absence of those requests is the invariant worth guarding, not the presence of local files: a stray `@import` or a re-added `<link>` reverts the whole change while the page looks identical.

#### Scenario: No third-party font requests

- **WHEN** any page type loads — home, blog index, blog post, course lesson
- **THEN** the browser issues zero requests to `fonts.googleapis.com` or `fonts.gstatic.com`

#### Scenario: CSP does not permit Google font origins

- **WHEN** the deployed site's Content-Security-Policy is inspected
- **THEN** `font-src` is `'self'`
- **AND** `style-src` does not list `https://fonts.googleapis.com`

#### Scenario: Built CSS carries no external font references

- **WHEN** the bundled CSS in a production build is searched for Google origins
- **THEN** it contains none

### Requirement: Polish diacritics are covered by the shipped subsets

Both the `latin` and `latin-ext` subsets SHALL be shipped for every family. `latin-ext` carries ą ć ę ł ń ó ś ź ż; without it most Polish text falls back to a system font while ASCII still renders correctly, so the regression is invisible to anyone reading the page in English.

Variable font files SHALL be used in place of one file per weight, covering the weights the site actually uses (Inter 300–700, Fira Code 400–600).

#### Scenario: Polish glyphs render in the intended family

- **WHEN** a page containing Polish diacritics is loaded
- **THEN** `document.fonts.check` reports the intended family as available for that text

#### Scenario: Subsets present in the build

- **WHEN** the emitted font assets are listed
- **THEN** both a `latin` and a `latin-ext` file exist for each family

### Requirement: The body font is preloaded

The body font's `latin` subset SHALL be preloaded with `crossorigin`. Fonts are fetched in CORS mode even same-origin, so omitting the attribute makes the browser discard the preload and download the file a second time.

Only the `latin` subset is preloaded. `latin-ext` is another ~83 kB, goes unused on the English routes, and is left to load on demand through its `unicode-range`.

#### Scenario: Preload present on every page

- **WHEN** the prerendered HTML of any of the site's routes is inspected
- **THEN** it contains a `<link rel="preload">` for the body font's `latin` subset
- **AND** the link carries `crossorigin`

#### Scenario: The extended subset is not preloaded

- **WHEN** the preload links are inspected
- **THEN** no preload targets the `latin-ext` file
