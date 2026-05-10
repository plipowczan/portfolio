## ADDED Requirements

### Requirement: Edge-level 301 redirects for legacy URLs

The system SHALL return an `HTTP 301 Moved Permanently` response with a `Location` header pointing to a live URL on the current site, for every legacy URL pattern declared as a redirect rule. Redirects MUST be evaluated by the Vercel edge layer before any application code (React Router, prerender, SPA fallback) executes.

#### Scenario: Legacy EN blog post slug redirects to translated counterpart
- **WHEN** a client requests `https://pawel.lipowczan.pl/en/blog/vibe-coding-przewodnik`
- **THEN** the response is `HTTP 301` with `Location: /en/blog/vibe-coding-guide`

#### Scenario: Legacy projects listing redirects to home section anchor
- **WHEN** a client requests `https://pawel.lipowczan.pl/projects/`
- **THEN** the response is `HTTP 301` with `Location: /#projects`

#### Scenario: Legacy CV page redirects to home about anchor
- **WHEN** a client requests `https://pawel.lipowczan.pl/my-career-path/`
- **THEN** the response is `HTTP 301` with `Location: /#about`

### Requirement: Wildcard redirects for legacy WordPress URL patterns

The system SHALL match common WordPress URL patterns inherited from the previous site version with wildcard rules and redirect them to the homepage. Patterns MUST cover, at minimum: WordPress taxonomy paths, archive paths, default category/tag/author archives, RSS feed endpoints, and admin paths.

#### Scenario: WordPress taxonomy URL redirects to home
- **WHEN** a client requests any URL matching `/portfolio_categories/<anything>` (with or without trailing slash)
- **THEN** the response is `HTTP 301` with `Location: /`

#### Scenario: WordPress archive URL redirects to home
- **WHEN** a client requests any URL matching `/portfolio-archive/<anything>`
- **THEN** the response is `HTTP 301` with `Location: /`

#### Scenario: WordPress category archive redirects to home
- **WHEN** a client requests any URL matching `/category/<anything>`
- **THEN** the response is `HTTP 301` with `Location: /`

#### Scenario: WordPress tag archive redirects to home
- **WHEN** a client requests any URL matching `/tag/<anything>`
- **THEN** the response is `HTTP 301` with `Location: /`

#### Scenario: WordPress author archive redirects to home
- **WHEN** a client requests any URL matching `/author/<anything>`
- **THEN** the response is `HTTP 301` with `Location: /`

#### Scenario: WordPress wp-content path redirects to home
- **WHEN** a client requests any URL matching `/wp-content/<anything>`
- **THEN** the response is `HTTP 301` with `Location: /`

#### Scenario: WordPress wp-admin path redirects to home
- **WHEN** a client requests any URL matching `/wp-admin/<anything>` or exactly `/wp-login.php`
- **THEN** the response is `HTTP 301` with `Location: /`

#### Scenario: WordPress feed endpoint redirects to home
- **WHEN** a client requests `/feed`, `/feed/`, or `/comments/feed/`
- **THEN** the response is `HTTP 301` with `Location: /`

### Requirement: Specific redirects evaluated before wildcards

Redirect rules SHALL be ordered so that specific 1:1 mappings and section-anchor mappings are evaluated before wildcard catch-alls. The first matching rule MUST win.

#### Scenario: Specific EN blog redirect not swallowed by wildcard
- **WHEN** a client requests `/en/blog/vibe-coding-przewodnik`
- **THEN** the response targets `/en/blog/vibe-coding-guide` (not `/`)

#### Scenario: Section anchor redirect not swallowed by wildcard
- **WHEN** a client requests `/projects/`
- **THEN** the response targets `/#projects` (not `/projects/:slug` and not `/`)

### Requirement: Redirects do not affect live routes

Redirect rules SHALL NOT match any URL that resolves to a live page on the current site. Existing prerendered routes, blog posts, project pages, and locale mirrors MUST continue to return `HTTP 200`.

#### Scenario: Home page is unaffected
- **WHEN** a client requests `/`
- **THEN** the response is `HTTP 200`

#### Scenario: Blog index is unaffected
- **WHEN** a client requests `/blog`
- **THEN** the response is `HTTP 200`

#### Scenario: Existing PL blog post is unaffected
- **WHEN** a client requests `/blog/vibe-coding-przewodnik`
- **THEN** the response is `HTTP 200`

#### Scenario: EN locale root is unaffected
- **WHEN** a client requests `/en/`
- **THEN** the response is `HTTP 200`

### Requirement: Unknown URLs continue to return 404

Redirects SHALL NOT mask legitimate 404s. Requests to URLs that match neither a redirect rule nor a live route MUST return `HTTP 404`.

#### Scenario: Random unknown URL still returns 404
- **WHEN** a client requests `/this-url-does-not-exist-12345`
- **THEN** the response is `HTTP 404`

#### Scenario: Unknown blog slug still returns 404
- **WHEN** a client requests `/blog/this-post-does-not-exist`
- **THEN** the response is `HTTP 404`
