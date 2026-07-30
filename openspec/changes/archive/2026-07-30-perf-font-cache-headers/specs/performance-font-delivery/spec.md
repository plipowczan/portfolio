## ADDED Requirements

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

## MODIFIED Requirements

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
