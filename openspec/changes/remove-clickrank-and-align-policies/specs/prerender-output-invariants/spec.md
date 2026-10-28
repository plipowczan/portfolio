## ADDED Requirements

### Requirement: The build rejects a static ClickRank script

`npm run build:prerender` SHALL fail when any HTML file in the build output carries an executable script that loads or references `clickrank.ai` — an external `<script>` whose source points at it, or an inline script whose code mentions it. The error SHALL name the files.

Only executable scripts count. A mention in visible text, in a code sample inside an article, or in a JSON-LD block is content, not a script, and SHALL NOT fail the build: a published case study describes the 2026-04 ClickRank deferral and quotes its loader.

The injector lived in `index.html`, and the prerender baked the tag it produced into every generated file, so one source line became two loaders on every page. A static file cannot report that it carries a removed script; the build is the only place that sees every file.

#### Scenario: A prerendered file carries the ClickRank tag

- **WHEN** an HTML file in the build output contains a `<script>` whose `src` points at a `clickrank.ai` host
- **THEN** the build fails with a non-zero exit code naming that file

#### Scenario: The template carries the ClickRank injector

- **WHEN** an HTML file in the build output contains an inline script whose code references `clickrank.ai`
- **THEN** the build fails with a non-zero exit code naming that file

#### Scenario: An article mentions ClickRank

- **WHEN** an HTML file mentions `clickrank.ai` only in visible text, a code sample, or a JSON-LD block
- **THEN** the check passes for that file
