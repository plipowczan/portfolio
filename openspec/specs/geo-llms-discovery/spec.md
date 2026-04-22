# geo-llms-discovery Specification

## Purpose
TBD - created by archiving change seo-improvements. Update Purpose after archive.
## Requirements
### Requirement: Site serves llms.txt index for AI crawlers
The site SHALL expose `/llms.txt` at the domain root, conforming to the llmstxt.org specification. The file SHALL contain an `H1` site title, a blockquote summary, and sections with links to blog posts and projects, each annotated with a one-sentence description.

#### Scenario: llms.txt is reachable
- **WHEN** an HTTP client requests `https://pawel.lipowczan.pl/llms.txt`
- **THEN** the response returns status 200 with `Content-Type: text/plain` (or compatible) and the body begins with `# Pawel Lipowczan`

#### Scenario: llms.txt lists all blog posts
- **WHEN** the file is generated during `npm run build:prerender`
- **THEN** every published blog post (excluding `*_wsad.md` and `_*.md`) has a corresponding entry under a `## Blog` section with its URL and a one-sentence description

#### Scenario: llms.txt is regenerated on every build
- **WHEN** a new post is added and the site is rebuilt
- **THEN** the regenerated `public/llms.txt` includes the new post without manual intervention

### Requirement: Site serves llms-full.txt with inline article content
The site SHALL expose `/llms-full.txt` at the domain root, containing the same index as `llms.txt` plus the full markdown content of every published blog post, separated by `\n\n---\n\n`.

#### Scenario: llms-full.txt is reachable
- **WHEN** an HTTP client requests `https://pawel.lipowczan.pl/llms-full.txt`
- **THEN** the response returns status 200 and the body contains both the index section and full post bodies

#### Scenario: llms-full.txt contains full post content
- **WHEN** a known post with body "Od ręcznych notatek..." exists
- **THEN** the `llms-full.txt` body contains that post's full markdown text verbatim

