## MODIFIED Requirements

### Requirement: Exactly one page description

Every HTML document the site serves SHALL contain exactly one `<meta name="description">` tag. The `SEO` component SHALL be its only source. The `index.html` template SHALL NOT declare a description of its own, because a static one is served alongside the component's and a parser taking the first tag would read a single description for the whole domain.

#### Scenario: Blog post serves its own description

- **WHEN** a crawler fetches the prerendered HTML of any blog post
- **THEN** the document contains exactly one `<meta name="description">` tag
- **AND** its content comes from that post's `excerpt` field, not from the site-wide description

#### Scenario: Page without its own description

- **WHEN** the `SEO` component renders without a `description` prop
- **THEN** the document still contains exactly one `<meta name="description">` tag
- **AND** its content is the `siteConfig.description` locale value of the page's language, not a Polish constant on an English route

## ADDED Requirements

### Requirement: The default title is localised

A page that passes no `title` to `SEO` SHALL get the title `<site name> | <siteConfig.title>`, with `siteConfig.title` taken from the locale of the page's language. `<title>`, `og:title` and `twitter:title` SHALL carry the same string.

#### Scenario: English home page title

- **WHEN** a crawler fetches `/en/`
- **THEN** `<title>`, `og:title` and `twitter:title` are "Pawel Lipowczan | Your Tech Guide"

#### Scenario: Polish home page title is unchanged

- **WHEN** a crawler fetches `/`
- **THEN** `<title>`, `og:title` and `twitter:title` are "Pawel Lipowczan | Twój Przewodnik Technologiczny"
