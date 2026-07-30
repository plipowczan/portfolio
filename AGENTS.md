# AGENTS.md

DOX is installed in this repository and is binding for every agent.

This file is the rail: the contract for working here. No project status, no
dependency list, no folder tree, no routing table, no command reference — those
are derivable or live in `docs/`. Folder rules live in the children indexed below.

## Core Contract

- Read the DOX chain before editing. Update it after editing.
- The nearest `AGENTS.md` governs local detail; parent docs govern
  repository-wide rules. On conflict the closer doc wins, and the conflict is
  resolved in the docs rather than left standing.
- No child doc weakens this contract.
- One rule lives in exactly one place. A rule that fits two systems is written
  once and linked from the other.
- Docs describe what is true now; stale text is deleted, not annotated.
- Never cite a file, directory, or npm script that does not exist.

## Read Before Editing

1. Read this file.
2. Walk from the repository root down to each path you are about to touch,
   reading every `AGENTS.md` on the route.
3. Re-read the chain this session; recall from an earlier one does not count.

Editing `src/content/blog/<post>.md` means reading `AGENTS.md`, `src/AGENTS.md`,
`src/content/AGENTS.md`, and `src/content/blog/AGENTS.md` first.

## Update After Editing

Update the closest owning `AGENTS.md` when a change touches purpose, scope,
ownership, responsibilities, durable structure, contracts, workflows, operating
rules, required inputs or outputs, constraints, artifacts, recorded preferences,
or the creation, deletion, move, rename, or index membership of an `AGENTS.md`.

- Parent docs change when parent-level structure, ownership, workflow, or the
  child index changes.
- Child docs change when a parent change alters a local rule.
- A change that alters no behaviour and no contract may leave docs untouched —
  but the pass still runs, and the decision to change nothing is stated.

## Hierarchy

- One `AGENTS.md` per durable folder boundary, not one per folder.
- Every `AGENTS.md` has a sibling `CLAUDE.md` whose only non-empty line is
  `@AGENTS.md`. Claude Code reads `CLAUDE.md`, not `AGENTS.md`, and loads a
  subdirectory `CLAUDE.md` on demand when it reads files there; the import is
  what makes this tree reachable without duplicating it. Never a symlink —
  creating one on Windows requires Administrator or Developer Mode.
- Every `AGENTS.md` is named by exactly one parent's Child DOX Index, and every
  indexed path exists.
- Adding, moving, or deleting a doc updates the parent index in the same change.

### Ownership boundary

Three systems carry rules here. Each rule belongs to exactly one of them.

| System | Owns | Example |
| --- | --- | --- |
| `openspec/specs/**` | behaviour contracts — what the system must do, versioned through changes | every blog post emits a canonical URL |
| `AGENTS.md` tree | folder work contracts — how to work in a folder, what it owns, how to verify it | blog frontmatter requires `slug`, `excerpt`, and `image` |
| `.claude/rules/**` | technology-generic style, carrying no repository knowledge | animate `transform` and `opacity`, never `width` |

A rule fitting more than one system is written in one and linked from the others.
`.claude/rules/content/10-prosty-polski.md` is the standing example: it spans
blog, course, and course FAQ data, so folder docs link it and never restate it.

## Child Doc Shape

Every child `AGENTS.md` uses this section order, each one an `##` heading:
**Purpose, Ownership, Local Contracts, Work Guidance, Verification, Child DOX
Index.**

- A section with nothing to say is present and empty — never omitted, never
  padded with placeholder prose.
- Verification names only checks that already exist: an npm script, a grep gate,
  a test file. Never a check that would have to be built first.
- A folder holding a `README.md` links it and labels it the Polish human guide;
  `AGENTS.md` is the binding contract.

## Style

- English in `AGENTS.md`, `CLAUDE.md`, `docs/PRD.md`, `docs/SRS.md`, and
  `openspec/**`. Polish in every `README.md` and the rest of `docs/`. The root
  `README.md` is the Polish human overview; this file is binding.
- Concise and declarative. State the rule, not the reasoning — unless the
  reasoning is what stops the next agent reverting it.
- Record traps: the mistake already made here once.

## Closeout

Before reporting a change complete:

- [ ] The DOX pass ran; every owning doc is updated, or explicitly unchanged.
- [ ] No doc contradicts a parent or a sibling.
- [ ] Every path and script cited in a touched doc resolves.
- [ ] Child DOX Index entries and the docs on disk match, both directions.

`scripts/dox-pass-check.mjs` warns on stop when an owning doc went untouched — a reminder, never a gate.

## User Preferences

- OpenSpec is the primary workflow. Structured work runs through `/opsx:*`; the
  command table is in `CLAUDE.md`.
- Feature branches and Conventional Commits. Never commit straight to `main`.
- No manual test pass before merging. Read the PR's checks, Vercel included —
  see `tests/AGENTS.md`.
- Project state and measurements: `docs/PROJECT_STATUS.md`. Open work:
  `docs/TODO.md`.

## Child DOX Index

- `src/AGENTS.md` — application source: routing, i18n, pages, hooks, styles, utils.
- `scripts/AGENTS.md` — Node build and content tooling: prerender, sitemap, images, fonts.
- `tests/AGENTS.md` — Playwright E2E and unit suites, and which automated run gates what.
- `api/AGENTS.md` — Vercel Node functions; today just the waitlist endpoint.
- `openspec/AGENTS.md` — the primary workflow: capability specs and change artifacts.
- `remotion/AGENTS.md` — Remotion video project, built and released separately.
