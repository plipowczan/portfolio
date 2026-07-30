# AGENTS.md — openspec/

## Purpose

OpenSpec is the primary development workflow for this repository. This folder
holds the behaviour contracts (`specs/`) and the in-flight and archived changes
(`changes/`).

## Ownership

**Owns:** capability specs, change artifacts, and `config.yaml`.

**Does not own:** how to work inside a code folder — that is the `AGENTS.md`
tree. See the ownership boundary in the root `AGENTS.md`.

## Local Contracts

- `specs/**` states **what** the system must do. It is not hand-edited. A spec
  changes by writing a change under `changes/<name>/` and syncing it with
  `/opsx:sync`, or by `/opsx:archive` at the end.
- A change directory carries the artifacts its schema requires — for
  `spec-driven` that is `proposal.md`, `design.md`, `specs/**/*.md`, and
  `tasks.md`.
- Delta specs under `changes/<name>/specs/` use `## ADDED Requirements`,
  `## MODIFIED Requirements`, or `## REMOVED Requirements`, with each
  requirement followed by at least one `#### Scenario:`.
- `changes/archive/` is dated history. Do not edit an archived change to reflect
  later reality; write a new change instead.
- `.agent/`, `.cursor/`, and `.github/` contain OpenSpec-generated command
  mirrors. They are generated, not authored.

## Work Guidance

- Explore first (`/opsx:explore`), then `/opsx:new`, then `/opsx:continue` or
  `/opsx:ff`, then `/opsx:apply`, then `/opsx:verify`, then `/opsx:archive`.
- Every task in `tasks.md` is checked off as it lands, not in a batch at the end.
- Implementation that contradicts an artifact is a signal to update the artifact,
  not to quietly diverge.

## Verification

```bash
openspec status --change "<name>" --json   # artifact completeness
openspec list --json                       # active changes
```

Plus `/opsx:verify` before archiving and `/validation:validate` for code quality.

## Child DOX Index
