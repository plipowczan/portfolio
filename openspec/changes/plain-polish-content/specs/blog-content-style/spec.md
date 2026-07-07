## ADDED Requirements

### Requirement: Shared plain-Polish rules file governs content skills

A shared rules file `.claude/rules/content/10-prosty-polski.md` SHALL exist and be the single source of truth for plain-Polish content rules: a replacement table (borrowed term → plain Polish), a keep-list (terms the reader sees in a tool's UI or file system: vault, frontmatter, markdown, git, RAG, OKF, command names, technology names), banned Polonized verbs (ingestować, mergować, renderować, deployować, commitować in prose), ornament restraint (an adjective needs a number or an example; maximum one metaphor per section), the first-use gloss format, and a validation grep command with a forbidden-word list. The `portfolio-copywriting` and `blog-article-writer` skills SHALL reference this file instead of carrying their own language lists, and the `portfolio-copywriting` "English vs Polish" guidance SHALL default to Polish whenever a natural Polish equivalent exists (English only for names, commands, and acronyms).

#### Scenario: Skills reference the shared file

- **WHEN** `.claude/skills/portfolio-copywriting/references/writing-style.md` or `.claude/skills/blog-article-writer/subcommands/execute.md` is inspected
- **THEN** it links to `.claude/rules/content/10-prosty-polski.md` for vocabulary rules
- **AND** it no longer contains a standalone list that contradicts the shared file (e.g. "deployment, staging, CI/CD — ZAWSZE po angielsku")

#### Scenario: Keep-list term is allowed but generic jargon is not

- **WHEN** an author checks whether a term may stay in English
- **THEN** the rules file resolves it by the UI/file-system test: "vault" (visible in Obsidian) stays, "renderować" (prose-only) is translated

### Requirement: Blog articles define hard terms at first use

New blog articles SHALL define each difficult or specialist term at its first occurrence in the article, as a parenthetical gloss directly after the term (or a single follow-up sentence when the definition is too long for a parenthesis). Keep-list English terms are NOT exempt — staying in English does not exempt a term from being explained.

#### Scenario: First occurrence carries a gloss

- **WHEN** a new article introduces a term such as RAG
- **THEN** the first occurrence reads like `RAG (technika, w której model przed odpowiedzią czyta Twoje dokumenty)` and later occurrences appear bare

#### Scenario: Skill guidance documents the format

- **WHEN** an author consults the `portfolio-copywriting` writing-style guidance
- **THEN** it documents the parenthetical-gloss rule with a ✅/❌ example pair, consistent with the existing AI-tells sections

### Requirement: Glossary validation gate in the article workflow

The `blog-article-writer:validate` subcommand SHALL run a mechanical vocabulary check against the article being validated, using the forbidden-word list from the shared rules file (same mechanism as the existing em-dash gate). A match SHALL fail validation before OG-image generation, listing the offending lines.

#### Scenario: Polonized verb fails validation

- **WHEN** a validated article contains a forbidden term (e.g. "zingestować" or "robi merge" in prose)
- **THEN** the validation report lists the line and the suggested replacement, and the article does not proceed to OG generation

#### Scenario: Clean article passes

- **WHEN** the validated article contains no forbidden-list matches in prose
- **THEN** the vocabulary gate reports pass and validation continues
