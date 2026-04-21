## ADDED Requirements

### Requirement: BlogPosting schema includes publisher as Organization
Each blog post page SHALL emit `BlogPosting` JSON-LD whose `publisher` field is an `Organization` with `name` and a raster `logo` (ImageObject).

#### Scenario: Publisher appears in prerendered HTML
- **WHEN** the build runs `npm run build:prerender` and prerender snapshots a blog post page
- **THEN** the output HTML contains JSON-LD with `"@type":"BlogPosting"` and `"publisher":{"@type":"Organization","name":"Pawel Lipowczan","logo":{"@type":"ImageObject","url":"https://pawel.lipowczan.pl/logo-schema.png"}}`

#### Scenario: Rich Results Test recognizes the publisher
- **WHEN** Google Rich Results Test is run on a prerendered blog post URL
- **THEN** no warning about missing `publisher` or `publisher.logo` is reported

### Requirement: BlogPosting schema includes dateModified
Each blog post page SHALL emit `dateModified` in the `BlogPosting` JSON-LD. The value SHALL come from frontmatter field `modified` if present, otherwise fall back to `date`.

#### Scenario: Post with explicit modified date
- **WHEN** a post has `modified: 2026-04-15` in frontmatter
- **THEN** the emitted `BlogPosting` contains `"dateModified":"2026-04-15"`

#### Scenario: Post without modified date
- **WHEN** a post has no `modified` field in frontmatter but has `date: 2026-04-01`
- **THEN** the emitted `BlogPosting` contains `"dateModified":"2026-04-01"` (equal to `datePublished`)

### Requirement: BlogPosting schema includes mainEntityOfPage
Each blog post page SHALL emit `mainEntityOfPage` pointing to the canonical URL of the post.

#### Scenario: mainEntityOfPage uses canonical URL
- **WHEN** a blog post is rendered at `https://pawel.lipowczan.pl/blog/example-slug`
- **THEN** the emitted `BlogPosting` contains `"mainEntityOfPage":{"@type":"WebPage","@id":"https://pawel.lipowczan.pl/blog/example-slug"}`

### Requirement: BlogPosting schema uses semantic description (not excerpt)
Each blog post page SHALL emit `description` instead of `articleBody: excerpt`. The `description` value SHALL come from frontmatter `description` if present, otherwise be auto-extracted from the first paragraph of the post content, trimmed to approximately 300 characters on a word boundary.

#### Scenario: Post with frontmatter description
- **WHEN** a post has `description: "Custom semantic summary"` in frontmatter
- **THEN** the emitted `BlogPosting` contains `"description":"Custom semantic summary"` and does NOT contain the field `articleBody`

#### Scenario: Post without frontmatter description falls back to first paragraph
- **WHEN** a post has no `description` field and its first markdown paragraph is "Od ręcznych notatek w Obsidian do systemu, w którym agent pilnuje struktury..."
- **THEN** the emitted `BlogPosting` `description` starts with that paragraph (trimmed to ~300 chars on word boundary, ending with `…` if truncated)

#### Scenario: articleBody field is removed
- **WHEN** any prerendered blog post HTML is inspected
- **THEN** the `BlogPosting` JSON-LD does NOT contain an `articleBody` field

### Requirement: OpenGraph article:modified_time reflects dateModified
Each blog post page SHALL emit `<meta property="article:modified_time">` matching the BlogPosting `dateModified` value.

#### Scenario: Meta tag matches schema
- **WHEN** a blog post page with `dateModified: 2026-04-15` is prerendered
- **THEN** the HTML `<head>` contains `<meta property="article:modified_time" content="2026-04-15">`

### Requirement: Frontmatter accepts optional description and modified fields
The blog post data loader SHALL accept optional frontmatter fields `description` (string) and `modified` (ISO 8601 date string). Their absence SHALL NOT cause validation failures.

#### Scenario: Post without new fields loads successfully
- **WHEN** a post has only the existing required frontmatter (`id`, `slug`, `title`, `excerpt`, `category`, `author`, `date`, `readTime`, `image`, `tags`)
- **THEN** the post loads without error and its `description` / `modified` properties are `undefined`

#### Scenario: Post with new fields loads successfully
- **WHEN** a post has both `description: "..."` and `modified: 2026-04-15` in frontmatter
- **THEN** the post loads without error and its `description` and `modified` properties are populated
