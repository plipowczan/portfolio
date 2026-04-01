## ADDED Requirements

### Requirement: Optional language prefix in URL
The system SHALL support an optional `/:lang?` route parameter where `/en/` serves English content and absence of prefix serves Polish content.

#### Scenario: Polish routes unchanged
- **WHEN** a user visits `/`, `/blog`, `/blog/:slug`, `/projects/:slug`, `/privacy-policy`, `/terms-of-service`, `/cookie-policy`
- **THEN** Polish content is displayed with no URL changes from current behavior

#### Scenario: English routes under /en/
- **WHEN** a user visits `/en/`, `/en/blog`, `/en/blog/:slug`, `/en/projects/:slug`, `/en/privacy-policy`, `/en/terms-of-service`, `/en/cookie-policy`
- **THEN** English content is displayed

#### Scenario: Invalid language prefix
- **WHEN** a user visits a URL with an unsupported prefix (e.g., `/fr/blog`)
- **THEN** the system redirects to the PL equivalent (e.g., `/blog`)

### Requirement: LocaleLayout wrapper
The system SHALL wrap all routes in a `LocaleLayout` component that reads the `:lang` parameter and configures i18next accordingly.

#### Scenario: LocaleLayout sets language from URL
- **WHEN** `LocaleLayout` renders with `:lang` = `"en"`
- **THEN** i18next language is set to `"en"` and `<html lang="en">` is applied via Helmet

#### Scenario: LocaleLayout defaults to PL
- **WHEN** `LocaleLayout` renders with `:lang` = `undefined`
- **THEN** i18next language is set to `"pl"` and `<html lang="pl">` is applied via Helmet

### Requirement: Language switcher in navigation
The system SHALL display a PL|EN toggle in the navigation bar on both desktop and mobile views.

#### Scenario: Switcher on static page
- **WHEN** a user is on `/` (PL) and clicks the EN toggle
- **THEN** the user is navigated to `/en/`

#### Scenario: Switcher on blog post with alternate
- **WHEN** a user is on `/blog/vibe-coding-przewodnik` (PL) and clicks the EN toggle
- **THEN** the user is navigated to `/en/blog/vibe-coding-guide` (the `alternateSlug` mapping)

#### Scenario: Switcher on blog post without alternate
- **WHEN** a user is on a blog post that has no English translation and clicks the EN toggle
- **THEN** the user is navigated to `/en/blog` (the blog listing page)

#### Scenario: Switcher on project page
- **WHEN** a user is on `/projects/note-taker-add-ons` (PL) and clicks the EN toggle
- **THEN** the user is navigated to `/en/projects/{english-slug}` using the project's `slugEn` mapping

#### Scenario: Mobile language switcher
- **WHEN** a user opens the mobile hamburger menu
- **THEN** the PL|EN toggle is visible and functional within the menu

### Requirement: Internal links respect current language
The system SHALL prefix internal links with `/en` when the current language is English.

#### Scenario: Navigation links in EN mode
- **WHEN** the site is in EN mode and navigation renders
- **THEN** all nav links are prefixed with `/en` (e.g., `/en/blog`, `/en/#about`)

#### Scenario: Blog post links in EN mode
- **WHEN** the blog listing page renders in EN mode
- **THEN** each post's "Read more" link points to `/en/blog/{en-slug}`
