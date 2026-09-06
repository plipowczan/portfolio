# performance-content-delivery Specification

## Purpose

How blog and course markdown reaches the browser: an index built once at build time carries what listings need, article and lesson bodies arrive only when opened, and no frontmatter parser ships to the client.

The renderer is a separate matter and stays in the browser: `react-markdown` with `remark` and `rehype` turns a body into elements, and gets its own chunk so it loads only on an article or a lesson. What leaves the client is frontmatter parsing — `gray-matter` — which now runs at build time.

## Requirements

### Requirement: Article and lesson bodies are not inlined into the client bundle

The client JavaScript bundle SHALL NOT contain the body text of blog articles or course lessons. A visitor who opens one route SHALL NOT download the content of the others.

The bundle today carries all 43 markdown files because the content loaders glob them eagerly. That cost is paid on every route by every visitor, and it grows with each article published — the failure is silent and cumulative, which is why it is stated as an invariant rather than left to review.

#### Scenario: Homepage does not carry article text

- **WHEN** the production JavaScript bundle is searched for a sentence that appears only in the body of a blog article
- **THEN** it is not found

#### Scenario: Homepage does not carry lesson text

- **WHEN** the production JavaScript bundle is searched for a sentence that appears only in the body of a course lesson
- **THEN** it is not found

#### Scenario: Publishing an article does not grow the initial payload

- **WHEN** a new article is added and the site is rebuilt
- **THEN** the JavaScript downloaded for the homepage grows by at most the article's index entry, not by its body

### Requirement: A build-time index carries everything listings need

The build SHALL emit an index of articles and lessons containing exactly the fields the listing, navigation, sitemap, and metadata surfaces read — including at minimum slug, title, excerpt, date, category, cover image, reading time, language, lesson order, and the alternate-language slug.

Rendering `/blog`, `/llm-wiki/kurs`, the previous/next lesson links, and the language switcher SHALL require only the index, never an article or lesson body.

#### Scenario: Blog index renders from the index alone

- **WHEN** `/blog` is rendered
- **THEN** every card's title, excerpt, date, category, and cover image are present
- **AND** no request for an article body has been issued

#### Scenario: Course hub renders from the index alone

- **WHEN** `/llm-wiki/kurs` is rendered
- **THEN** every lesson row shows its order number, title, and blurb
- **AND** no request for a lesson body has been issued

#### Scenario: Language switch resolves without a body

- **WHEN** the language switcher computes its target on a blog post route
- **THEN** it resolves the alternate slug from the index

### Requirement: A body is fetched only for the route that displays it

Opening an article or lesson SHALL fetch that one body. The fetch SHALL have a visible pending state and a recoverable failure state; a failed fetch SHALL NOT render as an empty article.

#### Scenario: Opening an article fetches one body

- **WHEN** a visitor opens a blog post from the index
- **THEN** exactly one content payload is requested
- **AND** it is the payload for the opened slug

#### Scenario: Fetch failure is reported, not swallowed

- **WHEN** an article's content payload fails to load
- **THEN** the page states that the article could not be loaded and offers a way back to the index
- **AND** does not present an article shell with an empty body

#### Scenario: Navigating between lessons fetches only the new lesson

- **WHEN** a visitor follows the next-lesson link
- **THEN** only the next lesson's payload is requested

### Requirement: Frontmatter is parsed and validated at build time

Markdown frontmatter SHALL be parsed during the build, not in the browser. No markdown frontmatter parser SHALL be present in the client bundle.

Frontmatter validation SHALL keep the guarantees the runtime loader provides today: a content file missing a required field, or carrying an unusable slug or lesson order, SHALL fail the build with a message naming the file and the problem.

This moves an existing check earlier rather than removing it. A validation that runs in the browser can only fail after the page has already shipped.

#### Scenario: Malformed frontmatter fails the build

- **WHEN** a content file is missing a required frontmatter field and the site is built
- **THEN** the build exits non-zero
- **AND** the error names the file and the missing field

#### Scenario: Unusable lesson order fails the build

- **WHEN** a lesson file carries no usable `slug` or `order` and the site is built
- **THEN** the build exits non-zero naming that file
- **AND** the lesson is not silently dropped from the index

#### Scenario: No frontmatter parser in the client

- **WHEN** the production JavaScript bundle is inspected
- **THEN** it contains no markdown frontmatter parsing library

#### Scenario: Documentation files in content folders are still excluded

- **WHEN** the build indexes a content folder containing `README.md`, `AGENTS.md`, or `CLAUDE.md`
- **THEN** those files are excluded from the index without failing the build

### Requirement: Prerendered article and lesson pages carry their full text

Prerendering SHALL resolve content payloads, so the HTML written to `dist/` for an article or lesson contains the article's or lesson's rendered body.

On-demand fetching moves content behind an asynchronous boundary. If the prerenderer captures the page before that boundary resolves, every article page ships as an empty shell to crawlers while looking correct in a browser — the regression is invisible without this stated as a contract.

#### Scenario: Prerendered blog post contains its body

- **WHEN** the prerendered HTML of a blog post is fetched
- **THEN** it contains text from the article body, not only its title and metadata

#### Scenario: Prerendered lesson contains its body

- **WHEN** the prerendered HTML of a course lesson is fetched
- **THEN** it contains text from the lesson body

#### Scenario: Prerender fails rather than emitting an empty article

- **WHEN** a content payload cannot be resolved during prerendering
- **THEN** the build exits non-zero naming the route
- **AND** no empty article page is written to `dist/`
