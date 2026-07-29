# seo-page-metadata Specification

## Purpose
Page-level metadata invariants: one description per page, a canonical that points at the page itself, hreflang only for URLs that exist, and a link to the alternate language version present in the prerendered HTML.
## Requirements
### Requirement: Exactly one page description

Every HTML document the site serves SHALL contain exactly one `<meta name="description">` tag. The `SEO` component SHALL be its only source. The `index.html` template SHALL NOT declare a description of its own, because a static one is served alongside the component's and a parser taking the first tag would read a single description for the whole domain.

#### Scenario: Blog post serves its own description

- **WHEN** a crawler fetches the prerendered HTML of any blog post
- **THEN** the document contains exactly one `<meta name="description">` tag
- **AND** its content comes from that post's `excerpt` field, not from the site-wide description

#### Scenario: Page without its own description

- **WHEN** the `SEO` component renders without a `description` prop
- **THEN** the document still contains exactly one `<meta name="description">` tag
- **AND** its content is the default from `SITE_CONFIG.description`

### Requirement: Canonical points at the page's own URL

Every URL SHALL declare a `<link rel="canonical">` pointing at itself, preserving the language prefix. An English page SHALL NOT canonicalise to its Polish counterpart, which would contradict the sitemap listing both as separate URLs.

#### Scenario: English home page

- **WHEN** a crawler fetches `https://pawel.lipowczan.pl/en/`
- **THEN** the canonical points at `https://pawel.lipowczan.pl/en/`

#### Scenario: English legal pages

- **WHEN** a crawler fetches `/en/privacy-policy`, `/en/terms-of-service` or `/en/cookie-policy`
- **THEN** each canonical carries the `/en` prefix and points at the URL that was fetched

#### Scenario: Polish home page

- **WHEN** a crawler fetches `https://pawel.lipowczan.pl/`
- **THEN** the canonical points at `https://pawel.lipowczan.pl/`
- **AND** carries no language prefix

### Requirement: Hreflang only for URLs that exist

`<link rel="alternate" hreflang="...">` tags SHALL point only at URLs returning 200. The `SEO` component SHALL NOT build an alternate URL by adding or removing the `/en` prefix of the current path. When no translation exists, the hreflang pair SHALL NOT be emitted — a guessed URL that 404s costs more than a missing tag.

#### Scenario: Post with an existing translation

- **WHEN** a crawler fetches `/blog/slabe-strony-claude-code`, whose `alternateSlug` names `claude-code-weak-spots`
- **THEN** `hreflang="en"` points at `https://pawel.lipowczan.pl/en/blog/claude-code-weak-spots`
- **AND** `hreflang="pl"` and `hreflang="x-default"` point at `https://pawel.lipowczan.pl/blog/slabe-strony-claude-code`

#### Scenario: Post without a translation

- **WHEN** a crawler fetches a post that has no `alternateSlug`, or whose named counterpart does not exist
- **THEN** the document contains no `alternate` tag for the other language
- **AND** no URL is formed by combining the other language's prefix with the current slug

#### Scenario: Post sharing an identical slug across languages

- **WHEN** a crawler fetches a post whose counterpart exists in the other language under an identical slug, so `alternateSlug` equals the post's own slug
- **THEN** the hreflang pair is emitted normally, carrying the `/en` prefix on the English side
- **AND** the identical name is not treated as the post pointing at itself

#### Scenario: Agreement with the sitemap

- **WHEN** the hreflang pairs in the HTML are compared with the `xhtml:link` pairs in `sitemap.xml` for any URL
- **THEN** both declarations point at the same addresses

#### Scenario: Reverse translation direction

- **WHEN** a crawler fetches `/en/blog/claude-code-weak-spots`
- **THEN** `hreflang="pl"` and `hreflang="x-default"` point at `https://pawel.lipowczan.pl/blog/slabe-strony-claude-code`

### Requirement: Link to the alternate language version in prerendered HTML

The language switcher SHALL render an anchor element whose `href` points at the alternate version of the current page. The URL SHALL be resolved during render rather than in a click handler, so that it lands in the prerendered HTML and the `/en/*` section is reachable in the crawler's link graph.

#### Scenario: Post with a translation

- **WHEN** a crawler fetches the prerendered HTML of a post that has a counterpart in the other language
- **THEN** the document contains an `<a>` element whose `href` points at that counterpart

#### Scenario: Page without a one-to-one counterpart

- **WHEN** a crawler fetches a page for which no counterpart exists
- **THEN** the switcher leads to the blog listing in the other language, or to the corresponding prefixed path
- **AND** the target URL returns 200

#### Scenario: Client-side navigation preserved

- **WHEN** a user clicks the language switcher in a browser
- **THEN** the transition happens without a full page reload
- **AND** lands on the same URL that appears in the `href` attribute
