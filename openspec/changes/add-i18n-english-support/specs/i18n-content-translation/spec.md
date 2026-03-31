## ADDED Requirements

### Requirement: All UI strings extracted to i18n
The system SHALL have zero hardcoded Polish strings in React components — all user-facing text MUST come from translation files.

#### Scenario: Navigation labels translated
- **WHEN** the navigation renders in EN
- **THEN** links display "Home", "About", "Projects", "Skills", "Testimonials", "Blog", "Contact"

#### Scenario: Footer translated
- **WHEN** the footer renders in EN
- **THEN** all text (quick links, legal links, social media section, copyright) is in English

#### Scenario: Contact form translated
- **WHEN** the contact form renders in EN
- **THEN** all labels ("Full Name", "Email", "Subject", "Message"), placeholders, validation errors, and success/error messages are in English

#### Scenario: Cookie banner translated
- **WHEN** the cookie banner renders in EN
- **THEN** all text and button labels are in English

### Requirement: Hero and About sections translated
The system SHALL display translated content for the Hero and About sections based on current language.

#### Scenario: Hero section in EN
- **WHEN** the homepage renders in EN
- **THEN** the tagline, description, and CTA buttons ("See Projects", "Get in Touch") are in English

#### Scenario: About section in EN
- **WHEN** the homepage renders in EN
- **THEN** the full About Me text, bio paragraphs, and consultation CTA are in English

### Requirement: Skills section translated
The system SHALL display translated skill labels and highlights based on current language.

#### Scenario: Skills highlights in EN
- **WHEN** the skills section renders in EN
- **THEN** highlights display "17+ Years of Experience", "100+ Completed Projects", "50+ Satisfied Clients", "10+ Technologies & Platforms"

### Requirement: Testimonials use correct language field
The system SHALL display `contentOriginal` (English) for EN and `content` (Polish) for PL in testimonials.

#### Scenario: Testimonials in EN
- **WHEN** the testimonials section renders in EN
- **THEN** the `contentOriginal` field is displayed for each testimonial

#### Scenario: Testimonials in PL
- **WHEN** the testimonials section renders in PL
- **THEN** the `content` field is displayed (current behavior)

### Requirement: Project data translated
The system SHALL display translated project titles, descriptions, features, and benefits based on current language.

#### Scenario: Project card in EN
- **WHEN** a project card renders in EN
- **THEN** the title, description, features, and benefits are in English (from `projects.json` namespace)

#### Scenario: Project detail page in EN
- **WHEN** a user visits `/en/projects/{en-slug}`
- **THEN** the full project detail page shows English content

### Requirement: Legal pages translated
The system SHALL display Privacy Policy, Terms of Service, and Cookie Policy in the current language.

#### Scenario: Privacy Policy in EN
- **WHEN** a user visits `/en/privacy-policy`
- **THEN** all sections of the privacy policy are displayed in English

#### Scenario: Terms of Service in EN
- **WHEN** a user visits `/en/terms-of-service`
- **THEN** all sections of the terms of service are displayed in English

#### Scenario: Cookie Policy in EN
- **WHEN** a user visits `/en/cookie-policy`
- **THEN** all sections of the cookie policy are displayed in English

### Requirement: All 22 blog posts translated to English
The system SHALL have an English translation for each existing Polish blog post in `src/content/blog/en/`.

#### Scenario: Complete blog translation coverage
- **WHEN** the English blog listing page renders
- **THEN** 22 posts are displayed (one for each existing Polish post)

#### Scenario: Each EN post has valid frontmatter
- **WHEN** an English blog post is parsed
- **THEN** it has all required frontmatter fields (`id`, `slug`, `title`, `excerpt`, `category`, `author`, `date`, `readTime`, `image`, `tags`, `lang`, `alternateSlug`)

### Requirement: Blog post dates use locale-appropriate formatting
The system SHALL format dates according to the current language locale.

#### Scenario: PL date format
- **WHEN** a blog post date renders in PL
- **THEN** the date is formatted in Polish locale (e.g., "15 marca 2025")

#### Scenario: EN date format
- **WHEN** a blog post date renders in EN
- **THEN** the date is formatted in English locale (e.g., "March 15, 2025")
