# sitemap-lastmod Specification

## Purpose
TBD - created by archiving change seo-improvements. Update Purpose after archive.

## Requirements

### Requirement: Blog post URLs have accurate per-post lastmod
Each blog post URL in `sitemap.xml` SHALL have a `<lastmod>` matching the post's `modified` frontmatter field if present, otherwise its `date` field.

#### Scenario: Post with explicit modified field
- **WHEN** a post has `date: 2026-04-01` and `modified: 2026-04-15` in frontmatter
- **THEN** its sitemap entry contains `<lastmod>2026-04-15</lastmod>`

#### Scenario: Post without modified field
- **WHEN** a post has `date: 2026-04-01` and no `modified` field
- **THEN** its sitemap entry contains `<lastmod>2026-04-01</lastmod>`

#### Scenario: Different posts have different lastmod
- **WHEN** the sitemap is inspected
- **THEN** blog post entries have varied `<lastmod>` values reflecting their individual publication or modification dates, not a uniform build timestamp

### Requirement: Listing page lastmod reflects freshest post
Listing page URLs (`/`, `/blog`, `/en/`, `/en/blog`) in `sitemap.xml` SHALL have `<lastmod>` equal to the maximum `lastmod` across all blog posts.

#### Scenario: Listing reflects latest post
- **WHEN** the most recent blog post has `modified: 2026-04-20` and no other post has a later date
- **THEN** the sitemap entries for `/`, `/blog`, `/en/`, and `/en/blog` all contain `<lastmod>2026-04-20</lastmod>`

### Requirement: Legal page lastmod reflects source file modification time

Legal page URLs (`/privacy-policy`, `/cookie-policy`, `/terms-of-service`) in
`sitemap.xml` SHALL have `<lastmod>` equal to the modification date recorded in the
corresponding React source file (`src/pages/PrivacyPolicy.jsx`,
`src/pages/CookiePolicy.jsx`, `src/pages/TermsOfService.jsx`) as an
`@sitemapUpdated YYYY-MM-DD` marker. The generator SHALL fail, naming the file,
when the marker is absent.

This replaces reading the date from the file's git committer date. That worked
locally and failed silently where it mattered: the build environment clones with
a shallow history, and a shallow clone grafts its boundary commit as parentless,
so every file untouched since that boundary reports the boundary date. The value
came back non-empty and well-formed, so no emptiness check could catch it, and
`git fetch --unshallow` returned success without deepening the history.

#### Scenario: Legal page tracks its source file

- **WHEN** `src/pages/PrivacyPolicy.jsx` records `@sitemapUpdated 2026-07-29`
- **THEN** the sitemap entry for `/privacy-policy` contains `<lastmod>2026-07-29</lastmod>`

#### Scenario: The date is missing

- **WHEN** a legal page's source file carries no `@sitemapUpdated` marker
- **THEN** the build fails and names that file
- **AND** no sitemap is written

#### Scenario: The build environment has no usable history

- **WHEN** the sitemap is generated in a checkout with a shallow git history
- **THEN** the dates are unaffected, because none of them is derived from git

### Requirement: priority and changefreq are preserved
The sitemap generator SHALL continue to emit `<priority>` and `<changefreq>` for each URL as before. These values are not removed by this change.

#### Scenario: priority and changefreq remain
- **WHEN** the sitemap is generated
- **THEN** each URL entry contains both `<priority>` and `<changefreq>` elements (values unchanged from the previous version)

### Requirement: Every lastmod is derived from the content it describes

No `<lastmod>` in the sitemap SHALL be derived from repository history. Each date
SHALL come from the thing it describes: blog posts from their frontmatter, course
lessons from an `updated` field in their frontmatter, projects from an `updated`
field on their own entry, and pages without markdown from a marker in their own
source file.

Per-entry dates also stop one change restating unrelated pages as fresh. All
nine project URLs previously shared a single date taken from the one file backing
them, so editing one project claimed the other eight had changed too.

#### Scenario: A course lesson carries its own date

- **WHEN** a lesson's frontmatter records `updated: 2026-07-08`
- **THEN** that lesson's sitemap entry contains `<lastmod>2026-07-08</lastmod>`

#### Scenario: A project carries its own date

- **WHEN** one project's `updated` changes and the others are untouched
- **THEN** only that project's `<lastmod>` changes

#### Scenario: A new lesson arrives without a date

- **WHEN** a lesson is added whose frontmatter has no `updated` field
- **THEN** the content build fails and names the file and the missing field

### Requirement: lastmod is never fabricated

When the generator cannot determine a modification date for a URL from its
declared source, it SHALL fail and name the URL and the source it could not read.
It SHALL NOT substitute the current date, the build date, or any other
placeholder.

A silent fallback turns an unreadable source into a date that looks deliberate,
which is worse than no entry at all — Google discounts a sitemap's dates
wholesale once they prove unreliable, so one fabricated date costs every real one.
Thirty-four of thirty-eight non-blog URLs carrying one identical date was the
observable result.

#### Scenario: A declared source cannot be read

- **WHEN** the generator cannot read the date a URL declares
- **THEN** the build fails and names the URL and the source
- **AND** no sitemap is written

#### Scenario: All sources resolve

- **WHEN** every URL's date is readable
- **THEN** the sitemap is written and the build succeeds
