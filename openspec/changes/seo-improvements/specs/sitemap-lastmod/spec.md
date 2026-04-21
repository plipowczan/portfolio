## ADDED Requirements

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
Legal page URLs (`/privacy-policy`, `/cookie-policy`, `/terms-of-service`) in `sitemap.xml` SHALL have `<lastmod>` equal to the git `committer date` of the corresponding React source file (`src/pages/PrivacyPolicy.jsx`, `src/pages/CookiePolicy.jsx`, `src/pages/TermsOfService.jsx`).

#### Scenario: Legal page tracks its source file
- **WHEN** `src/pages/PrivacyPolicy.jsx` was last committed on `2026-03-10T14:22:00Z`
- **THEN** the sitemap entry for `/privacy-policy` contains `<lastmod>2026-03-10</lastmod>` (date portion of the commit timestamp)

### Requirement: priority and changefreq are preserved
The sitemap generator SHALL continue to emit `<priority>` and `<changefreq>` for each URL as before. These values are not removed by this change.

#### Scenario: priority and changefreq remain
- **WHEN** the sitemap is generated
- **THEN** each URL entry contains both `<priority>` and `<changefreq>` elements (values unchanged from the previous version)
