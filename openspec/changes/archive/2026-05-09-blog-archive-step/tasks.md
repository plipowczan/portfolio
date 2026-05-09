## 1. Author archive subcommand

- [x] 1.1 Create `.claude/skills/blog-article-writer/subcommands/archive.md` with frontmatter (`name`, `description`) and these sections: Purpose, Prerequisites, Inputs (slug + optional `--force`), Steps, Output, Edge Cases, See Also.
- [x] 1.2 In Steps, document the exact command sequence: precondition check (`src/content/blog/{slug}.md` exists), collision check (`docs/blog/_archive/{slug}/` does not exist unless `--force`), enumeration of `docs/blog/` top-level entries minus the whitelist (`_archive`, `README.md`, `.gitkeep`), `mkdir -p docs/blog/_archive/{slug}/`, per-entry `git mv` for tracked entries with filesystem-move fallback for untracked entries, manifest generation, final summary.
- [x] 1.3 In Edge Cases, document each scenario from the spec: empty source directory (no-op + clear message), pre-existing archive folder (refuse without `--force`, proceed with `--force` and overwrite manifest), missing `en/{slug}.md` (warn + proceed, manifest records "no EN translation"), unknown slug (refuse before any move, leave working tree clean).
- [x] 1.4 In Output, specify the manifest schema verbatim so the agent generates a consistent `MANIFEST.md`: archival date in `YYYY-MM-DD`, slug, link `[PL article](../../../../src/content/blog/{slug}.md)`, link to EN article or "(no EN translation)", bullet list of moved top-level entries by name only.

## 2. Wire archive into SKILL.md

- [x] 2.1 Edit `.claude/skills/blog-article-writer/SKILL.md`: add a row for `/blog-article-writer:archive` to the Quick Reference subcommand table with the one-line purpose "Archive source materials from `docs/blog/` after publishing".
- [x] 2.2 Edit Workflow Overview: insert a step 7 for archive between the existing translate step and "Done", and renumber the trailing "Done" line to step 8. Note in step 7 that the step is manual and skippable.
- [x] 2.3 Add a new "/blog-article-writer:archive" subsection under Subcommand Details mirroring the structure of existing subsections (Purpose, Prerequisites, Steps summary, Output, edge-case notes), and bump the `Last Updated` date at the bottom of the file.

## 3. Local verification

- [x] 3.1 Dry-run the documented steps mentally against the current `docs/blog/` (which contains `2026-05-08-system-finansow-200iq-blog-material.md`, `ncp4-blog-pack/`) for the in-flight slug `system-agentow-ai-skills-rules-kontekst` — confirm the command list, manifest content, and post-condition match the spec scenarios.
- [x] 3.2 Re-run mental dry-runs for the empty-source, collision-without-force, collision-with-force, missing-EN, and wrong-slug scenarios and verify the documented behavior matches each spec scenario one-for-one.
- [x] 3.3 Read the edited `SKILL.md` end-to-end and confirm the subcommand table, workflow overview, and detail section are mutually consistent (same step number, same purpose phrasing, same prerequisites).

## 4. Validate change against OpenSpec

- [x] 4.1 Run `openspec validate blog-archive-step --strict` and resolve any reported issues.
- [x] 4.2 Run `openspec status --change blog-archive-step` and confirm all artifacts report `done`.
