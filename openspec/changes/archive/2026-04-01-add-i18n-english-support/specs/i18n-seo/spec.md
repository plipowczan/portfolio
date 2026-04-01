## ADDED Requirements

### Requirement: Dynamic html lang attribute
The system SHALL set the `<html lang>` attribute to match the current page language.

#### Scenario: PL page lang attribute
- **WHEN** a user visits any PL page (e.g., `/`, `/blog`)
- **THEN** `<html lang="pl">` is rendered

#### Scenario: EN page lang attribute
- **WHEN** a user visits any EN page (e.g., `/en/`, `/en/blog`)
- **THEN** `<html lang="en">` is rendered

### Requirement: Hreflang alternate links
The system SHALL include `<link rel="alternate" hreflang="...">` tags on every page that has a counterpart in the other language.

#### Scenario: Static page hreflang
- **WHEN** a user visits `/` (PL)
- **THEN** the page includes `<link rel="alternate" hreflang="pl" href="https://pawel.lipowczan.pl/">`, `<link rel="alternate" hreflang="en" href="https://pawel.lipowczan.pl/en/">`, and `<link rel="alternate" hreflang="x-default" href="https://pawel.lipowczan.pl/">`

#### Scenario: Blog post hreflang with alternate
- **WHEN** a user visits `/blog/vibe-coding-przewodnik` which has `alternateSlug: vibe-coding-guide`
- **THEN** the page includes hreflang links pointing to both `/blog/vibe-coding-przewodnik` (pl) and `/en/blog/vibe-coding-guide` (en)

#### Scenario: Blog post without alternate — no EN hreflang
- **WHEN** a user visits a blog post that has no English translation
- **THEN** the page includes only `<link rel="alternate" hreflang="pl">` and `<link rel="alternate" hreflang="x-default">` — no EN hreflang

### Requirement: Canonical URL per language
The system SHALL set `<link rel="canonical">` to the current language version URL.

#### Scenario: PL canonical
- **WHEN** a user visits `/blog/vibe-coding-przewodnik`
- **THEN** canonical is `https://pawel.lipowczan.pl/blog/vibe-coding-przewodnik`

#### Scenario: EN canonical
- **WHEN** a user visits `/en/blog/vibe-coding-guide`
- **THEN** canonical is `https://pawel.lipowczan.pl/en/blog/vibe-coding-guide`

### Requirement: Bilingual sitemap with alternates
The system SHALL generate a sitemap.xml containing both PL and EN URLs with `xhtml:link` alternates.

#### Scenario: Sitemap includes both language versions
- **WHEN** the sitemap is generated
- **THEN** each URL entry includes `<xhtml:link rel="alternate" hreflang="pl" href="..."/>` and `<xhtml:link rel="alternate" hreflang="en" href="..."/>` for pages that exist in both languages

#### Scenario: Sitemap includes EN-only static pages
- **WHEN** the sitemap is generated
- **THEN** EN static pages (`/en/`, `/en/blog`, `/en/privacy-policy`, etc.) are present as URL entries

### Requirement: Prerendering both language versions
The system SHALL prerender all pages for both PL and EN during the build process.

#### Scenario: PL pages prerendered unchanged
- **WHEN** `npm run build:prerender` runs
- **THEN** all existing PL pages are prerendered at their current paths (e.g., `dist/blog/vibe-coding-przewodnik/index.html`)

#### Scenario: EN pages prerendered under /en/
- **WHEN** `npm run build:prerender` runs
- **THEN** all EN pages are prerendered at `/en/` paths (e.g., `dist/en/blog/vibe-coding-guide/index.html`)

### Requirement: Localized meta titles and descriptions
The system SHALL render localized `<title>` and `<meta name="description">` based on current language.

#### Scenario: PL meta tags
- **WHEN** the homepage renders in PL
- **THEN** the title includes "Twój Przewodnik Technologiczny" and description is in Polish

#### Scenario: EN meta tags
- **WHEN** the homepage renders in EN
- **THEN** the title includes "Your Tech Guide" and description is in English
