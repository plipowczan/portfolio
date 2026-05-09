# blog-archive-workflow Specification

## Purpose
TBD - created by syncing change blog-archive-step. Update Purpose after archive.

## Requirements

### Requirement: Archive subcommand availability

The blog-article-writer skill SHALL expose an `/blog-article-writer:archive` subcommand as the seventh and final step of the blog article authoring workflow, runnable manually after `/blog-article-writer:translate` succeeds.

#### Scenario: Subcommand listed in skill quick reference

- **WHEN** a user reads `.claude/skills/blog-article-writer/SKILL.md`
- **THEN** the Quick Reference subcommand table includes a row for `/blog-article-writer:archive` with a one-line purpose description, and the Workflow Overview lists archive as step 7

#### Scenario: Subcommand documentation file exists

- **WHEN** the skill is loaded
- **THEN** the file `.claude/skills/blog-article-writer/subcommands/archive.md` exists and documents the subcommand's purpose, prerequisites, steps, inputs, outputs, and edge cases

### Requirement: Archive scope

When invoked with a published article slug, the subcommand SHALL move every top-level entry inside `docs/blog/` into `docs/blog/_archive/{slug}/`, except entries on a fixed exclusion list.

The exclusion list is:

- `_archive` (the archive root itself)
- `README.md`
- `.gitkeep`

#### Scenario: Mixed content gets archived

- **WHEN** `docs/blog/` contains `2026-05-08-foo-blog-material.md`, `ncp4-blog-pack/`, `_archive/`, and `README.md`, and the user runs the archive subcommand for slug `system-agentow-ai-skills-rules-kontekst`
- **THEN** `2026-05-08-foo-blog-material.md` and `ncp4-blog-pack/` are moved to `docs/blog/_archive/system-agentow-ai-skills-rules-kontekst/`, while `_archive/` and `README.md` remain untouched at the top level of `docs/blog/`

#### Scenario: Whitelist entry is preserved

- **WHEN** `docs/blog/.gitkeep` exists and the subcommand runs
- **THEN** `.gitkeep` remains at `docs/blog/.gitkeep` and is not moved into the archive

### Requirement: Move via git mv

The subcommand SHALL move entries using `git mv` so that git history is preserved and `git log --follow` can trace archived files back to their original location.

#### Scenario: History preserved after archival

- **WHEN** a tracked file `docs/blog/foo.md` is archived to `docs/blog/_archive/{slug}/foo.md`
- **THEN** `git log --follow docs/blog/_archive/{slug}/foo.md` includes the commits that originally introduced `docs/blog/foo.md`

#### Scenario: Untracked entries are also moved

- **WHEN** `docs/blog/` contains an untracked file or folder (not yet added to git)
- **THEN** the subcommand still moves it into `docs/blog/_archive/{slug}/` using a filesystem move, so that no untracked sources are left behind

### Requirement: Manifest generation

The subcommand SHALL generate `docs/blog/_archive/{slug}/MANIFEST.md` automatically as part of every successful archival run. The manifest MUST contain:

- The archival date in `YYYY-MM-DD` format.
- The slug being archived.
- A relative link to the PL article at `src/content/blog/{slug}.md`.
- A relative link to the EN counterpart, resolved by reading the `alternateSlug` field from the PL article's frontmatter and pointing to `src/content/blog/en/{alternateSlug}.md` when both the field is present and the target file exists. If the `alternateSlug` field is missing, or if the resolved EN file does not exist, the manifest MUST record the explicit literal "(no EN translation)" instead of a link.
- A bullet list of the top-level entries that were moved into this archive (names only, not the full recursive tree).

#### Scenario: Manifest written for fully bilingual article

- **WHEN** the PL article `src/content/blog/{slug}.md` has an `alternateSlug: en-slug` field and `src/content/blog/en/en-slug.md` exists, and the subcommand archives `material.md` and `pack/`
- **THEN** `docs/blog/_archive/{slug}/MANIFEST.md` is created with the date, slug, a PL link to `src/content/blog/{slug}.md`, an EN link to `src/content/blog/en/en-slug.md` (resolved from the PL frontmatter), and a bullet list containing `material.md` and `pack/`

#### Scenario: Manifest written when EN translation is missing

- **WHEN** `src/content/blog/{slug}.md` exists but either lacks an `alternateSlug` field or its resolved EN file `src/content/blog/en/{alternateSlug}.md` does not exist, and the subcommand archives entries
- **THEN** the manifest is still created, the EN link is replaced by the literal "(no EN translation)" note, and the subcommand also emits a warning to the user that EN translation is missing but proceeds with archival

### Requirement: Empty source directory is a no-op

When `docs/blog/` contains no entries other than the exclusion list (`_archive`, `README.md`, `.gitkeep`), the subcommand SHALL exit successfully without creating `_archive/{slug}/` and without creating a manifest, and SHALL print a clear message indicating that there is nothing to archive.

#### Scenario: Nothing to archive

- **WHEN** `docs/blog/` contains only `_archive/` and `README.md`, and the user runs the archive subcommand
- **THEN** no new directory is created under `_archive/`, no manifest is written, and the user sees a message such as "Nothing to archive in docs/blog/"

### Requirement: Pre-existing archive folder is refused

If `docs/blog/_archive/{slug}/` already exists when the subcommand runs, the subcommand SHALL refuse to proceed and exit with a clear error, unless the user explicitly passes a `--force` flag. Refusal MUST occur before any `git mv` is executed, so the working tree remains unchanged on refusal.

#### Scenario: Archive collision without force

- **WHEN** `docs/blog/_archive/{slug}/` already exists and the user runs the archive subcommand without `--force`
- **THEN** the subcommand exits with an error explaining the collision, no files in `docs/blog/` are moved, and no manifest is overwritten

#### Scenario: Archive collision with force

- **WHEN** `docs/blog/_archive/{slug}/` already exists and the user runs the archive subcommand with `--force`
- **THEN** the subcommand proceeds, moves new entries into the existing archive folder, and overwrites the manifest with one that lists the entries moved in this run

### Requirement: Article existence precondition

Before moving any files, the subcommand SHALL verify that the published PL article `src/content/blog/{slug}.md` exists. If it does not exist, the subcommand SHALL exit with an error and leave the working tree unchanged.

#### Scenario: Slug does not match a published article

- **WHEN** the user runs the archive subcommand with a slug for which `src/content/blog/{slug}.md` does not exist
- **THEN** the subcommand exits with an error such as "No published article found for slug '{slug}'", does not create any directory under `_archive/`, and does not move any files
