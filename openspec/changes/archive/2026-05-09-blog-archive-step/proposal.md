## Why

After publishing a blog article, source materials accumulate in `docs/blog/` (input briefs, knowledge packs, draft assets) with no formal archival step. Over time this folder becomes a mixed pile of "in-progress" and "already used" materials, making it hard to know which inputs belonged to which published article and bloating future workflow context.

## What Changes

- Add a new subcommand `/blog-article-writer:archive` as **step 7** in the blog article workflow (after `:translate`, before final commit).
- The subcommand moves every top-level entry in `docs/blog/` (files and folders), except the `_archive/` folder itself and a small whitelist (`README.md`, `.gitkeep`), into `docs/blog/_archive/{slug}/` using `git mv` to preserve history.
- The subcommand auto-generates `docs/blog/_archive/{slug}/MANIFEST.md` containing archival date, links to the PL article (`src/content/blog/{slug}.md`) and EN article (`src/content/blog/en/{slug}.md` if present), and a list of archived top-level entries.
- Edge cases handled by the subcommand: empty `docs/blog/` is a no-op with a clear message; a pre-existing `docs/blog/_archive/{slug}/` is refused unless `--force` is passed; missing `en/{slug}.md` produces a warning but does not block archival.
- `SKILL.md` is updated: subcommand table gets a new row, Workflow Overview gains step 7, and Subcommand Details gains a new section for `:archive`.

## Capabilities

### New Capabilities

- `blog-archive-workflow`: Defines the archival step in the blog article authoring workflow — what gets archived, where it goes, how it's mapped to a published article, and how the manifest is produced.

### Modified Capabilities

<!-- None. The existing blog authoring workflow lives entirely inside the `.claude/skills/blog-article-writer/` skill directory, which is tooling rather than a tracked openspec capability. No requirements in `openspec/specs/` change. -->

## Impact

- **Skill files** (tooling, not application code):
  - New: `.claude/skills/blog-article-writer/subcommands/archive.md`
  - Edited: `.claude/skills/blog-article-writer/SKILL.md` (Quick Reference table, Workflow Overview, Subcommand Details, Last Updated date)
- **Repository layout**: introduces a new conventional folder `docs/blog/_archive/{slug}/` that will accumulate per-article subfolders going forward.
- **No application code changes.** No changes to `src/`, `scripts/`, build, prerender, sitemap, or tests.
- **No runtime impact** on the deployed site. The archive lives outside `src/content/blog/` and is invisible to the build.
- **No breaking changes.** Existing articles and existing materials in `docs/blog/` are untouched until the user explicitly runs `/blog-article-writer:archive` for a given slug.
