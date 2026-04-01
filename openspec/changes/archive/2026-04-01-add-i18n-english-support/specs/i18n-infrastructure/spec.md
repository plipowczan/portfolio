## ADDED Requirements

### Requirement: i18next initialization
The system SHALL initialize `i18next` with `react-i18next` and `i18next-browser-languagedetector` at application startup, before any component renders.

#### Scenario: Application boots with i18n configured
- **WHEN** the application starts
- **THEN** i18next is initialized with `pl` as the default/fallback language, detection order `[path, localStorage, navigator]`, and namespace `common` loaded by default

### Requirement: Translation namespaces
The system SHALL organize translations into four namespaces: `common`, `home`, `projects`, `legal`.

#### Scenario: Namespace structure
- **WHEN** translations are loaded
- **THEN** files exist at `src/locales/{pl,en}/{common,home,projects,legal}.json` with flat keys using dot-separated prefixes (e.g., `"hero.tagline"`)

#### Scenario: Component loads specific namespace
- **WHEN** a component calls `useTranslation('projects')`
- **THEN** only the `projects` namespace is loaded for the current language

### Requirement: Language detection and persistence
The system SHALL detect the user's preferred language on first visit and persist language choice across sessions.

#### Scenario: First visit — browser language detection
- **WHEN** a user visits `/` for the first time (no localStorage, no URL prefix)
- **THEN** the system detects `navigator.language` but displays PL content (no auto-redirect), and does NOT set localStorage until the user explicitly switches

#### Scenario: Language switch persisted
- **WHEN** a user switches language via the toggle
- **THEN** the choice is saved to `localStorage` key `i18nextLng`

#### Scenario: Returning visit with saved preference
- **WHEN** a user with `localStorage.i18nextLng = "en"` visits `/`
- **THEN** the URL takes precedence — PL content is displayed (URL `/` = PL)

### Requirement: Translation function available in all components
The system SHALL provide the `useTranslation` hook and `t()` function to all components via `I18nextProvider`.

#### Scenario: Component uses translation
- **WHEN** a component calls `const { t } = useTranslation('common')` and renders `t('nav.blog')`
- **THEN** the translated string for the current language is displayed
