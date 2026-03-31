## ADDED Requirements

### Requirement: Bilingual blog file structure
The system SHALL store Polish blog posts in `src/content/blog/` (unchanged) and English posts in `src/content/blog/en/`.

#### Scenario: PL posts location unchanged
- **WHEN** the blog loader scans for posts
- **THEN** Polish posts are found at `src/content/blog/*.md` (excluding `_wsad.md`, `_`-prefixed, and `README.md`)

#### Scenario: EN posts in subdirectory
- **WHEN** the blog loader scans for posts
- **THEN** English posts are found at `src/content/blog/en/*.md`

### Requirement: Extended frontmatter with language fields
The system SHALL require `lang` and `alternateSlug` fields in blog post frontmatter.

#### Scenario: PL post frontmatter
- **WHEN** a Polish post is parsed
- **THEN** it has `lang: pl` and `alternateSlug` pointing to the English slug (e.g., `alternateSlug: vibe-coding-guide`)

#### Scenario: EN post frontmatter
- **WHEN** an English post is parsed
- **THEN** it has `lang: en` and `alternateSlug` pointing to the Polish slug (e.g., `alternateSlug: vibe-coding-przewodnik`)

#### Scenario: Backward compatibility for missing lang field
- **WHEN** a post does not have a `lang` field
- **THEN** it defaults to `pl`

### Requirement: Language-filtered blog queries
The system SHALL provide functions to query blog posts filtered by language.

#### Scenario: Get posts by language
- **WHEN** `getPostsByLang('en')` is called
- **THEN** only posts with `lang: en` are returned, sorted by date descending

#### Scenario: Get alternate post
- **WHEN** `getAlternatePost('vibe-coding-przewodnik')` is called for a PL post
- **THEN** the EN post with slug `vibe-coding-guide` is returned (via `alternateSlug` mapping)

#### Scenario: No alternate exists
- **WHEN** `getAlternatePost(slug)` is called for a post without a translation
- **THEN** `null` is returned

### Requirement: Blog listing page respects language
The system SHALL display only posts matching the current language on the blog listing page.

#### Scenario: PL blog listing
- **WHEN** a user visits `/blog`
- **THEN** only Polish posts are displayed

#### Scenario: EN blog listing
- **WHEN** a user visits `/en/blog`
- **THEN** only English posts are displayed

### Requirement: Blog post page resolves by language and slug
The system SHALL resolve blog post pages using both language context and slug.

#### Scenario: PL post by slug
- **WHEN** a user visits `/blog/vibe-coding-przewodnik`
- **THEN** the Polish post with that slug is displayed

#### Scenario: EN post by slug
- **WHEN** a user visits `/en/blog/vibe-coding-guide`
- **THEN** the English post with that slug is displayed

#### Scenario: Wrong language slug combination
- **WHEN** a user visits `/en/blog/vibe-coding-przewodnik` (Polish slug under EN prefix)
- **THEN** a 404 / "post not found" state is shown
