## Why

The project currently runs two parallel development workflows: PIV (Prime-Implement-Validate) and OpenSpec. Both cover ~70% of the same ground (planning, implementation, validation), creating cognitive overhead and duplicated tooling. OpenSpec provides superior artifact-driven traceability, an explore mode for thinking, and living specs - making PIV redundant. Consolidating to a single workflow simplifies onboarding and reduces the number of files in the repository.

## What Changes

- **BREAKING** Remove PIV methodology documentation (`.claude/PIV-METHODOLOGY.md`)
- **BREAKING** Remove PIV commands (`.claude/commands/piv_loop/` - prime, plan-feature, execute)
- **BREAKING** Remove bug_fix commands (`.claude/commands/bug_fix/` - rca, implement-fix) — bugs will be handled as OpenSpec changes
- Remove stale PIV-generated artifacts from `.claude/agents/` (plans, reports, reviews) while preserving blog-related contexts and OG prompts
- Update `CLAUDE.md` to replace PIV references with OpenSpec workflow as primary methodology
- Retain `.claude/commands/validation/` as an independent quality gate (not PIV-specific)
- Retain `.claude/commands/blog-article-writer/` as a standalone workflow

## Capabilities

### New Capabilities

- `openspec-primary-workflow`: Establish OpenSpec as the single development workflow, with updated CLAUDE.md documentation and command references

### Modified Capabilities

<!-- No existing OpenSpec specs are changing at the requirement level -->

## Impact

- **Commands removed**: `piv_loop:prime`, `piv_loop:plan-feature`, `piv_loop:execute`, `bug_fix:rca`, `bug_fix:implement-fix`
- **Commands retained**: All `validation:*` commands, all `opsx:*` commands, all `blog-article-writer:*` commands
- **Files deleted**: ~25 files (PIV methodology doc, 3 PIV commands, 2 bug_fix commands, ~9 old plans, ~13 old reports/reviews)
- **Files updated**: `CLAUDE.md` (primary entry point for agents)
- **No code changes**: This is purely a workflow/documentation migration
- **No impact on**: Application source code, tests, deployment, or production
