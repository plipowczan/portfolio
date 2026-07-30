# performance-font-delivery Specification

## Purpose
How web fonts reach the browser: served from our own origin rather than Google's, shipping the subsets Polish text needs, preloaded for the body face, and cached for a year because the filenames carry content hashes.
## Requirements
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

The preload link SHALL be injected at build time by looking the emitted asset up in the bundle, because the fingerprinted filename is not knowable until the bundle exists and therefore cannot be declared in `index.html`. During `vite dev`, where nothing is hashed, the source path is used instead.

The lookup SHALL exclude the `latin-ext` file explicitly. `inter-latin-ext-<hash>.woff2` also begins with `inter-latin-`, so a naive prefix match selects the 83 kB extended subset over the 47 kB one — and preloading it pulls the Polish diacritics on every route, including the English ones that never use them.

#### Scenario: Preload present on every page

- **WHEN** the prerendered HTML of any of the site's routes is inspected
- **THEN** it contains a `<link rel="preload">` for the body font's `latin` subset
- **AND** the link carries `crossorigin`

#### Scenario: The extended subset is not preloaded

- **WHEN** the preload links are inspected
- **THEN** no preload targets the `latin-ext` file

#### Scenario: Preload survives a font refresh

- **WHEN** the fonts are regenerated and the build produces new content hashes
- **THEN** the preload points at the new filename without any source edit

### Requirement: Font files are cached for a year and never revalidated

Font files SHALL be served with `Cache-Control: public, max-age=31536000, immutable`. Reaching that header is not a matter of adding a rule — `vercel.json` already grants it to `/assets/(.*)`. It is a matter of the files being emitted there, which means they SHALL be referenced from CSS by a **relative** path so that Vite fingerprints them. An absolute `/fonts/…` URL defeats this: Vite treats such paths as public-dir references and passes them through untouched, so the files fall through to the catch-all `/(.*)` rule and go out as `max-age=0, must-revalidate` — one revalidation round trip per font on every visit.

The content hash in the filename is what makes a year-long cache safe, so the two are one invariant rather than two. Regenerating a font changes its name, so a returning visitor is never served a stale file. Under literal filenames the same header becomes a trap with no way to bust it.

#### Scenario: Deployed font carries the immutable header

- **WHEN** the font URL that a deployed page preloads is requested
- **THEN** the response carries `Cache-Control: public, max-age=31536000, immutable`
- **AND** its `Content-Type` is `font/woff2`

#### Scenario: Font URL is fingerprinted

- **WHEN** the preloaded font's URL is inspected
- **THEN** it is an `/assets/` path whose filename carries a content hash
- **AND** it is not a literal `/fonts/…` path

#### Scenario: Emitted assets are hashed

- **WHEN** the font files in a production build are listed
- **THEN** each filename carries a content hash

