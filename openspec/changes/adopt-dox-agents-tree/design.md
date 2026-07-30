## Context

The repository runs four overlapping agent-context systems:

| System | Size | Load behavior |
|---|---|---|
| `CLAUDE.md` | 5 KB | every session |
| `.claude/rules/**` (25 files) | 45 KB | every session — zero files carry `paths:` frontmatter |
| `AGENTS.md` | 20 KB | never loaded by Claude Code; read by Codex |
| `openspec/specs/**` (14 capabilities) | — | on demand |

Plus five Polish `README.md` files in the folders that would receive an `AGENTS.md`, and `.agent/`, `.cursor/`, `.github/` which are OpenSpec-generated command mirrors rather than context.

The root `AGENTS.md` has drifted badly enough to be actively misleading — it cites `.cursorrules`, `src/utils/blogLoader.js`, `docs/maintenance/TODO.md`, and `docs/blog/BLOG_WORKFLOW.md`, none of which exist, and reports 8 blog posts against 61 on disk. It drifted because updating it was a suggestion with no trigger.

DOX (`agent0ai/dox`) is a ~40-line markdown contract, no dependencies: a hierarchy of `AGENTS.md` files, a read-before-editing traversal protocol, and an update-after-editing pass. This change adopts it.

**Hard constraint discovered during exploration.** Claude Code docs, verbatim: *"Claude Code reads `CLAUDE.md`, not `AGENTS.md`."* And: *"Claude also discovers `CLAUDE.md` and `CLAUDE.local.md` files in subdirectories under your current working directory. Instead of loading them at launch, they are included when Claude reads files in those subdirectories."*

That second sentence is DOX's core mechanic already implemented natively — but bound to the `CLAUDE.md` filename. A pure `AGENTS.md` tree would be fully honored by Codex and invisible to Claude Code. The design has to bridge that.

## Goals / Non-Goals

**Goals:**

- One `AGENTS.md` per durable folder boundary, faithful to the upstream DOX section shape, so the tree stays portable across Claude Code, Codex, and Cursor.
- The tree reaches Claude Code through the mechanism Claude Code actually supports, without duplicating content between two filenames.
- Kill the 20 KB of stale root context without losing the parts that only exist there.
- Each rule lives in exactly one system; the boundary between OpenSpec, DOX, and `.claude/rules` is written down in the rail.
- Skipping a DOX pass produces a visible warning instead of silent drift.

**Non-Goals:**

- Adding `paths:` frontmatter to `.claude/rules/**`. That is Claude Code's native answer to the same problem and would work, but it is not DOX and it is not portable. Separate change if wanted.
- Reducing total context size. The dissolved rules file saves ~5 KB always-on; the tree adds on-demand context per folder. The gain is relevance, not bytes.
- Rewriting `.claude/rules/` technology files, the five Polish READMEs, `openspec/specs/**`, or any application code.
- Blocking gates. The hook warns; it never fails a turn or a commit.

## Decisions

### 1. Audience: Claude Code first, but keep the tree portable

Claude Code does ~90% of the work here. The `codex:rescue` plugin is installed, and `.cursor/`, `.agent/`, `.github/` mirrors exist.

**Chosen:** build the `AGENTS.md` tree (portable, upstream-faithful) rather than a `CLAUDE.md`-only tree.

*Alternative rejected:* a tree of `CLAUDE.md` files carrying DOX content directly — 12 files instead of 24, auto-loaded, zero shim risk. Rejected because it makes the tree invisible to every other agent and stops being DOX in anything but spirit.

### 2. Bridge with `@AGENTS.md` import shims, not symlinks

Each folder gets `AGENTS.md` (content) plus a one-line `CLAUDE.md` containing `@AGENTS.md`. Claude Code loads the shim on demand when it touches files in that folder; the shim pulls in the real doc. Single source of truth, two filenames.

*Alternative rejected:* `ln -s AGENTS.md CLAUDE.md`. The Claude Code docs state this needs Administrator privileges or Developer Mode on Windows and recommend the import instead. The dev machine is Windows 11.

*Alternative rejected:* duplicating content into both files. Guaranteed drift, and DOX explicitly forbids duplication.

**Cost accepted:** 24 files instead of 12, and two files to keep aligned per folder. The shim is one line and never changes, which bounds that cost.

### 3. Verify the shim mechanic on one folder before writing the other ten

The docs describe import expansion for files *loaded at launch*. Whether `@AGENTS.md` expands inside a subdirectory `CLAUDE.md` loaded *on demand* is not documented and not verified.

**Chosen:** `src/content/blog/` is the pilot inside this change. Write both files, edit a post, run `/context`, confirm the child appears under Memory files and the `AGENTS.md` content is in context. Only then write the remaining ten pairs.

*Fallback if it fails:* content goes directly into each `CLAUDE.md`, and `AGENTS.md` is kept as the Codex-facing copy generated from it. That reintroduces duplication, so it is a fallback and not the plan — and it would be recorded in the rail as a known deviation from upstream DOX.

### 4. Rail keeps the contract; `docs/` keeps the status

The DOX rail is only useful if it stays short enough to re-read every session. Cap: 120 lines.

Everything currently in `AGENTS.md` splits three ways:
- **Derivable from the repo** (folder tree, dependency versions, npm scripts, routing table, component hierarchy) → deleted. An agent reads `package.json` faster than it reads a stale copy.
- **Non-derivable** (Core Web Vitals measurements, deployment status, rejected-ideas record) → `docs/PROJECT_STATUS.md`.
- **Roadmap / priorities** → merged into the existing `docs/TODO.md`. A new roadmap file would be the fifth place roadmap items live.

### 5. Dissolve `data-storage`, keep `prosty-polski`

`.claude/rules/` holds two files that are repository-specific rather than technology-generic. They are not symmetric:

| | `data-storage/00-overview.md` | `content/10-prosty-polski.md` |
|---|---|---|
| Scope | `src/content/blog/` + `src/data/` | blog **+** kurs **+** `src/data/courseFaq.js` |
| Referenced by specs | no spec names the file path | `blog-content-style` requires this exact path as *"the single source of truth"*; also cited by `course-content-style` and `llm-wiki-course` |
| Referenced by `.claude/` | — | 10 files (skills, subcommands, agent artifacts) |

**Chosen:** dissolve `data-storage/00-overview.md` into `src/content/blog/AGENTS.md` and `src/data/AGENTS.md`, then delete it. Leave `10-prosty-polski.md` exactly where it is and link to it from the tree.

*Rationale beyond the spec lock:* the plain-Polish rules span three sibling branches, so no single folder owns them. DOX itself says to put broad rules in parent docs and concrete details in child docs — and the only DOX node above all three branches is the root. Hoisting a 6 KB vocabulary table into the rail would blow the 120-line cap.

*Alternative rejected:* move it to `src/content/AGENTS.md` and rewrite three specs plus ten `.claude/` references. Consistent with "one rule, one place", but it grows the change by roughly half and fights an explicit spec requirement for no functional gain.

### 6. `AGENTS.md` is the contract, `README.md` is the guide

The repo already declares "English for AI agents, Polish for human users". Five target folders already have a Polish `README.md` totalling 35 KB, including a genuinely good 12 KB Playwright guide.

**Chosen:** different genres, so not duplication. `AGENTS.md` states what is binding — ownership, contracts, verification commands — in concise English. `README.md` stays the Polish tutorial. Each `AGENTS.md` links its README and labels which document governs.

*Alternative rejected:* absorb the READMEs and delete them. Loses 35 KB of human documentation to save a file per folder.

### 7. Hook reads git state, not the transcript

A `Stop` hook runs a Node script that:
1. collects changed paths from `git status --porcelain` plus `git diff --name-only`,
2. for each changed path, walks up to the nearest `AGENTS.md`,
3. warns for every owning doc that is not itself in the changed set.

**Why git state over transcript parsing:** the transcript would need tool-call extraction and would miss edits made outside the session. Git state is one command, cross-platform, and self-clearing — the warning stops once the DOX pass is committed alongside the change.

**Accepted imperfection:** it also flags files left dirty by an earlier session. For a non-blocking warning that is a feature, not a bug — dirty-and-undocumented is exactly the state worth surfacing.

Language: `.mjs` under `scripts/`, matching `prerender.mjs` and the other Node build scripts. Registered in `.claude/settings.json` — which does not exist yet; only `settings.local.json` does — so the hook is shared through version control rather than living on one machine.

### 8. Ownership boundary goes in the rail

Three systems will drift toward each other again unless the split is written where every agent reads it:

```
openspec/specs/**   WHAT the system must do    behavior, versioned by change
AGENTS.md tree      HOW to work in this folder ownership, contracts, verification
.claude/rules/**    technology style           no repository knowledge
```

Rule that fits two systems: written in one, linked from the others.

## Risks / Trade-offs

**`@AGENTS.md` does not expand in an on-demand subdirectory `CLAUDE.md`** → pilot one folder first (decision 3); documented fallback puts content in `CLAUDE.md` with `AGENTS.md` as the Codex copy.

**24 files is enough surface to rot** → the hook (decision 7) is the counter-pressure, and the shims are one immutable line each, so only 12 files carry real content.

**The DOX pass becomes a 7th gate that gets skipped** → this repo already runs `/opsx:verify`, `/validation:validate`, and a manual `build:prerender` before merge. The honest read is that instruction-only enforcement already failed once here, which is why decision 7 exists rather than trusting the contract.

**Child docs restate their parents** → the spec requires empty sections over duplicated prose, and the closeout checklist requires removing contradictions in the same pass.

**Cross-cutting rules get copied into two folders** → decision 5 sets the precedent explicitly: cross-cutting means link, never copy.

**Losing content in the 20 KB rewrite** → migration happens before deletion (decision 4), and `git show HEAD:AGENTS.md` remains the recovery path.

## Migration Plan

1. Extract non-derivable content from `AGENTS.md` → `docs/PROJECT_STATUS.md` and `docs/TODO.md`. Nothing is deleted before this lands.
2. Rewrite root `AGENTS.md` as the rail with an empty Child DOX Index. Add `@AGENTS.md` to the top of root `CLAUDE.md`.
3. Pilot: `src/content/blog/AGENTS.md` + `CLAUDE.md`. Verify with `/context` that the child loads and the import expands.
4. On success, write the remaining ten pairs. On failure, apply the decision-3 fallback and record the deviation in the rail.
5. Relocate `data-storage/00-overview.md` content into `src/content/blog/AGENTS.md` and `src/data/AGENTS.md`; delete the rules file; drop it from the `CLAUDE.md` rules index.
6. Populate every Child DOX Index; cross-check that each doc is named by exactly one parent.
7. Add the hook script and register it in `.claude/settings.json`.
8. Run the tree-accuracy check: resolve every path and `npm run` script cited across all `AGENTS.md` files.

**Rollback:** `git revert` the change. No application code, build config, or spec is touched, so nothing depends on the tree existing. The only externally-visible artifacts are documentation files and one hook registration.

## Open Questions

- Does `@AGENTS.md` expand in an on-demand subdirectory `CLAUDE.md`? Resolved empirically at step 3; the answer decides whether the change ships upstream-faithful or with the recorded fallback.
- Do `src/hooks/`, `src/context/`, `src/locales/`, and `src/styles/` deserve their own docs later? Each holds 1–4 files today, so they stay covered by `src/AGENTS.md`. Adding one later is a one-line index update in the parent.
- Should `.claude/rules/**` eventually get `paths:` frontmatter on top of the tree? Genuinely useful and orthogonal to DOX, but out of scope here — it is the alternative rejected in Non-Goals, not a follow-on requirement.
