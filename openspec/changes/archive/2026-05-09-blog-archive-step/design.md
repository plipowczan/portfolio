## Context

The `blog-article-writer` skill has six subcommands (`prime`, `plan`, `execute`, `validate`, `translate`, `generate-og-prompt`) that walk an author from raw inputs in `docs/blog/` to a published, validated, bilingual article in `src/content/blog/`. After a successful run, the source materials in `docs/blog/` are no longer needed for that article but currently stay in place. Over the course of multiple articles, `docs/blog/` accumulates a mix of "current" and "spent" materials with no convention for distinguishing them.

The user has already published 26+ articles using this workflow and confirmed the working discipline: at any given time, `docs/blog/` holds materials for exactly one article in flight. That assumption simplifies mapping — everything in `docs/blog/` (modulo a small whitelist) belongs to the article being archived.

This is a tooling change inside `.claude/skills/blog-article-writer/`. The skill is markdown instructions executed by an agent, not application code; there is no compiler or runtime to integrate with.

## Goals / Non-Goals

**Goals:**

- Add a deterministic, reversible archival step that runs after `:translate`.
- Preserve git history for moved files so authorship and timeline of source materials remain inspectable.
- Produce a small per-article manifest that answers "what raw materials produced this article?" two years from now without grepping git log.
- Keep the step opt-in (manual invocation), so the existing six-step workflow continues to work for authors who prefer to defer or skip archival.

**Non-Goals:**

- No automatic detection of "which subset of `docs/blog/` belongs to which article". The user-confirmed convention is "all of `docs/blog/`, minus a whitelist".
- No compression (`.tar.gz`, `.zip`). Archives stay as plain folders so they are diff-able, grep-able, and reviewable in PRs.
- No archival of artefacts under `.claude/agents/` (those are already named after the slug and are agent scratch space, not author-facing source material).
- No changes to sitemap, prerender, or any build step. The archive lives outside `src/content/blog/` and is invisible to the build.
- No moving of archives out of the repository. They stay in-tree under `docs/blog/_archive/`.

## Decisions

### Decision 1: Archive location is `docs/blog/_archive/{slug}/`

Per-article subfolder, named after the article slug, under a single `_archive/` root inside `docs/blog/`.

**Rationale:** Slug is the unambiguous primary key for an article (URL slug, filename of `src/content/blog/{slug}.md`, also of `src/content/blog/en/{slug}.md`). Putting the archive root inside `docs/blog/` keeps source materials and their archive co-located, so a reader of `docs/blog/` immediately sees both "fresh inputs" and "history". The leading underscore sorts `_archive/` ahead of dated source files in alphabetical listings, which keeps fresh materials visually prominent.

**Alternatives considered:**

- `docs/blog/_archive/{YYYY}/{slug}/` (year-grouped). Rejected: extra nesting with no payoff at current volume (~26 posts), and slug remains globally unique anyway.
- `docs/blog/_archive/{slug}.tar.gz` (compressed). Rejected: hides contents from PR review and grep; saves negligible disk at this scale.
- Out-of-repo archive (`~/blog-archive/`). Rejected: loses cross-machine sync via git and decouples archive from the article it belongs to.

### Decision 2: Move with `git mv`, not copy

The subcommand uses `git mv` for tracked files and a filesystem move (e.g., `mv` / `Move-Item`) for untracked entries.

**Rationale:** `git mv` preserves history and lets future readers run `git log --follow` on an archived file. Copying would double the on-disk footprint and break the "single source of truth" property. Falling back to a plain move for untracked entries handles the realistic case where an author has already populated `docs/blog/` but not yet committed those inputs when they finish the article.

**Alternatives considered:**

- Copy then delete original. Rejected: not atomic, breaks `git log --follow`, and creates a window where both copies coexist.
- Move only tracked files, leave untracked behind. Rejected: violates the "leave `docs/blog/` clean" goal and surprises users who routinely add inputs without committing them first.

### Decision 3: All-or-nothing scope, with a small whitelist

The subcommand archives every top-level entry in `docs/blog/`, except `_archive`, `README.md`, and `.gitkeep`.

**Rationale:** The user confirmed the working discipline: one article at a time, so everything in `docs/blog/` belongs to the article being archived. This eliminates pattern-matching by slug, date, or keyword (which would fail anyway — e.g., `ncp4-blog-pack/` shares no substring with the slug `system-agentow-ai-skills-rules-kontekst`). The whitelist protects two conventional files: a folder-level `README.md` (if it ever describes the `docs/blog/` workflow itself) and `.gitkeep` (used to keep otherwise-empty directories tracked).

**Alternatives considered:**

- Pattern-match by slug/date. Rejected: shown to fail on real materials in this repo.
- Skill scans and proposes, user confirms each. Rejected: more friction with no upside given the one-at-a-time discipline.
- User passes explicit paths. Rejected: more typing for the common case; the user can still curate `docs/blog/` before running the subcommand if a specific entry should be excluded.

### Decision 4: Manifest is auto-generated, not user-edited

The subcommand writes `MANIFEST.md` automatically with date, slug, PL/EN article links, and a flat list of top-level archived entries (no recursive tree).

**Rationale:** Two-year-from-now readability without ceremony. Auto-generation means zero extra prompts in the workflow. The flat list is enough — anyone who wants the full tree can `ls _archive/{slug}/` directly.

**Alternatives considered:**

- No manifest, rely on folder name. Rejected: folder name maps to slug but loses archival date and bilingual link context.
- Recursive tree in manifest. Rejected: noisy, duplicates filesystem state, drifts if anyone hand-edits the archive later.
- Hand-curated description field. Rejected: extra prompt per archival, and the user already wrote the article — no one is going to write a second mini-summary.

### Decision 5: Pre-existing `_archive/{slug}/` is a hard refuse, with `--force` escape hatch

If `_archive/{slug}/` already exists, the subcommand aborts before moving anything. `--force` overrides.

**Rationale:** Default-safe. The likely cause of a collision is operator error (re-running archive after the materials were already archived), not legitimate intent. `--force` is the documented escape hatch for the rare case where new materials were added after the first archival pass and need to be folded into the existing archive.

**Alternatives considered:**

- Auto-merge into existing archive. Rejected: silent overwrite of `MANIFEST.md` is the kind of magic that bites later.
- Append a timestamp suffix on collision (`_archive/{slug}-2/`). Rejected: pollutes the archive with sibling folders and breaks the "slug is the primary key" invariant.

### Decision 6: Missing EN translation is a warning, not a block; EN slug comes from PL frontmatter

If the EN counterpart cannot be resolved, the subcommand prints a warning and proceeds; the manifest records "(no EN translation)".

The EN counterpart is resolved by reading the `alternateSlug` field from the PL article's frontmatter and looking for `src/content/blog/en/{alternateSlug}.md` — **not** by assuming `src/content/blog/en/{slug}.md`. EN articles in this repo use translated slugs (e.g., PL `system-agentow-ai-skills-rules-kontekst` ↔ EN `ai-agent-system-skills-rules-shared-context`), per `.claude/rules/data-storage/00-overview.md`. A literal-slug-match would systematically fail to find existing EN counterparts.

The "missing EN" branch covers two sub-cases that are treated identically: the PL article has no `alternateSlug` field at all, or it has one but the target file does not exist on disk.

**Rationale:** The `:translate` step is mandatory in the documented workflow, but archival is a separate user decision and should not re-enforce the bilingual contract. The warning is visible enough that an author who genuinely forgot translation will catch it; an author who deliberately archives a PL-only post (rare, but possible) is not blocked.

### Decision 7: Subcommand is manual (step 7), not chained from `:translate`

`/blog-article-writer:archive` is invoked explicitly by the user.

**Rationale:** Three reasons. (1) `:translate` already has its own failure modes; folding archival into it expands the failure surface and complicates "what state is the workflow in?" debugging. (2) Some authors will want to keep materials around briefly to draft a follow-up article from the same pack. (3) An explicit subcommand is trivially reversible by `git restore` / `git mv` back; an implicit one is harder to reason about.

## Risks / Trade-offs

- **[Risk] Author runs archive before `:translate` completes.** → Mitigation: subcommand emits a warning when `en/{slug}.md` is missing; archival proceeds but the manifest records the gap. The author can still run `:translate` afterward against the archived sources if needed (translate reads from `src/content/blog/`, not `docs/blog/`, so this works).
- **[Risk] Author runs archive with the wrong slug.** → Mitigation: precondition check requires `src/content/blog/{slug}.md` to exist; a typo therefore fails fast with a clear error and an unchanged working tree. Recovery from a wrong-but-existing slug is `git restore -SW docs/blog/` plus `rm -r docs/blog/_archive/{wrong-slug}/`.
- **[Risk] `git mv` fails partway through (e.g., a permission issue on Windows).** → Mitigation: the subcommand documents that on partial failure the user runs `git status` to see what moved and `git mv` / `git restore` to finish or roll back. No special transaction logic; `git mv` is already idempotent enough at the per-entry level.
- **[Trade-off] In-repo archive grows the repository.** → Accepted: at current volume (26 posts × a few MB of source material) this is comfortably below any practical git limit. If volume becomes a concern years out, a future change can migrate `_archive/` to a separate repository or tarball-on-archive — both compatible with the slug-keyed layout chosen here.
- **[Trade-off] Whitelist is hard-coded in the subcommand.** → Accepted: the whitelist is short (`_archive`, `README.md`, `.gitkeep`) and editing the subcommand markdown is trivial if a new convention emerges.

## Migration Plan

This is a pure addition. No existing files move, no existing commands change behavior, no public surface is broken.

**Rollout:**

1. Land the new `subcommands/archive.md` and the `SKILL.md` edits in a single commit.
2. Verify by running `/blog-article-writer:archive` against the next article that completes the workflow (the in-flight `system-agentow-ai-skills-rules-kontekst` post is a natural first candidate, since `docs/blog/` already holds its sources).
3. No backfill: prior articles' source materials, if still in `docs/blog/`, can be archived case-by-case using the same subcommand. There is no migration script.

**Rollback:**

If the subcommand turns out to be wrong-shaped, revert the introducing commit. The `_archive/{slug}/` folders left on disk by any successful runs are inert — they hurt nothing if the subcommand goes away — and can be moved back with `git mv` or simply left as a historical curiosity.

## Open Questions

None. All design decisions were resolved during the explore session preceding this change.
