## Context

The project has two coexisting development workflows:

1. **PIV (Prime-Implement-Validate)** — documented in `.claude/PIV-METHODOLOGY.md`, commands in `.claude/commands/piv_loop/` and `.claude/commands/validation/`. Generates artifacts into `.claude/agents/{context,plans,reports,reviews}/`.
2. **OpenSpec** — configured in `openspec/config.yaml`, commands in `.claude/commands/opsx/`, skills in `.claude/skills/openspec-*/`. Generates artifacts into `openspec/changes/<name>/`.

Both are active, but OpenSpec has become the preferred workflow. PIV artifacts have accumulated (9 plans, 13 reports, 1 review) but are not actively referenced.

Key constraint: `validation/` commands and `blog-article-writer/` commands share the PIV pattern (prime/plan/execute/validate) but are functionally independent — they don't import or depend on PIV commands.

## Goals / Non-Goals

**Goals:**
- Remove PIV-specific files (methodology doc, piv_loop commands, bug_fix commands)
- Clean up stale PIV artifacts from `.claude/agents/`
- Update `CLAUDE.md` to reference OpenSpec as the primary workflow
- Preserve all independent modules (validation, blog-article-writer)

**Non-Goals:**
- Modifying OpenSpec itself (no changes to `openspec/` config or commands)
- Changing application source code, tests, or deployment
- Migrating historical PIV artifacts into OpenSpec format
- Modifying `AGENTS.md` (contains no PIV references)
- Changing `validation/` commands to integrate with OpenSpec

## Decisions

### 1. Validation pipeline stays independent

**Decision**: Keep `.claude/commands/validation/` as-is, not integrated into OpenSpec.

**Rationale**: Validation commands (validate, code-review, code-review-fix, execution-report, system-review) are a quality gate layer that works with any workflow. Integrating them into OpenSpec's verify step would reduce flexibility and couple two independent concerns.

**Alternative considered**: Merge into `/opsx:verify` — rejected because verify checks artifact compliance while validation checks code quality (build, lint, tests). Different concerns.

### 2. Bug fixes become OpenSpec changes

**Decision**: Remove `.claude/commands/bug_fix/` entirely. Bugs are handled via `/opsx:new "fix-<bug-name>"`.

**Rationale**: OpenSpec's change model (proposal → design → tasks → apply → verify) works for bugs too. The RCA step from bug_fix can be done in `/opsx:explore` before creating a change.

**Alternative considered**: Keep bug_fix as independent module — rejected because it duplicates OpenSpec's structured approach without adding unique value.

### 3. Selective cleanup of `.claude/agents/`

**Decision**: Delete stale PIV artifacts (plans, reports, reviews) but preserve blog-related contexts and OG prompts.

**Rationale**:
- `context/blog-prime-*.md` — actively used by blog-article-writer skill
- `prompts/*.md` — reference material for OG image generation
- `plans/*.md` — historical, not referenced by any active workflow
- `reports/*.md` — historical validation reports, not referenced
- `reviews/*.md` — single RCA file, not referenced

Preserve `.gitkeep` files to maintain directory structure for validation commands that still write to `reports/`.

### 4. Minimal CLAUDE.md update

**Decision**: Replace PIV command table and references with OpenSpec equivalents. Keep the same structure/format.

**Rationale**: CLAUDE.md is the primary entry point for agents. It must accurately reflect available commands. Minimal change = less risk of breaking agent behavior.

## Risks / Trade-offs

- **[Lost bug_fix RCA template]** → Users who relied on the structured RCA prompt lose it. Mitigation: `/opsx:explore` serves the same thinking-first purpose.
- **[Lost prime concept]** → PIV's explicit "prime the codebase" step disappears. Mitigation: OpenSpec's explore mode and blog-article-writer's prime subcommand cover this. General priming can be done ad-hoc.
- **[Stale skill references]** → `piv_loop:*` and `bug_fix:*` skills will still appear in Claude Code's skill list until the command files are deleted. Mitigation: Deleting the command files removes the skills automatically.
- **[Historical knowledge loss]** → Deleting plans/reports removes context about past decisions. Mitigation: These are one-shot artifacts, not living documents. Git history preserves them if ever needed.
