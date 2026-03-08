# Capability: OpenSpec Primary Workflow

## Purpose

Defines the requirements for OpenSpec being the primary development workflow in the portfolio project, replacing the previous PIV methodology.

## Requirements

### Requirement: CLAUDE.md references OpenSpec as primary workflow

CLAUDE.md SHALL contain an OpenSpec command reference table listing all `/opsx:*` commands with their purpose. CLAUDE.md SHALL NOT contain references to PIV methodology, `/core_piv_loop:*` commands, or `PIV-METHODOLOGY.md`.

#### Scenario: Agent reads CLAUDE.md for workflow guidance

- **WHEN** an agent reads CLAUDE.md to understand available workflows
- **THEN** the document SHALL list OpenSpec commands (`/opsx:explore`, `/opsx:new`, `/opsx:continue`, `/opsx:apply`, `/opsx:verify`, `/opsx:ff`, `/opsx:archive`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`) and validation commands (`/validation:validate`, `/validation:code-review`, `/validation:code-review-fix`, `/validation:execution-report`, `/validation:system-review`)

#### Scenario: No PIV references remain in CLAUDE.md

- **WHEN** an agent searches CLAUDE.md for "PIV", "piv_loop", or "core_piv"
- **THEN** zero matches SHALL be found

### Requirement: PIV command files are removed

The repository SHALL NOT contain `.claude/commands/piv_loop/` directory or any files within it. The repository SHALL NOT contain `.claude/PIV-METHODOLOGY.md`.

#### Scenario: PIV commands unavailable

- **WHEN** an agent attempts to invoke `/piv_loop:prime`, `/piv_loop:plan-feature`, or `/piv_loop:execute`
- **THEN** the command SHALL not be found (no command file exists)

### Requirement: Bug fix commands are removed

The repository SHALL NOT contain `.claude/commands/bug_fix/` directory or any files within it.

#### Scenario: Bug fix handled via OpenSpec

- **WHEN** a user wants to fix a bug
- **THEN** they SHALL use `/opsx:new "fix-<bug-name>"` to create an OpenSpec change

### Requirement: Stale PIV artifacts are cleaned up

The `.claude/agents/plans/` directory SHALL contain only `.gitkeep`. The `.claude/agents/reports/` directory SHALL contain only `.gitkeep`. The `.claude/agents/reviews/` directory SHALL contain only `.gitkeep`.

Blog-related context files (`context/blog-prime-*.md`) and prompt files (`prompts/*.md`) SHALL be preserved.

#### Scenario: Agents directory after cleanup

- **WHEN** listing `.claude/agents/` contents
- **THEN** `context/` SHALL contain `.gitkeep` and `blog-prime-*.md` files
- **AND** `plans/` SHALL contain only `.gitkeep`
- **AND** `reports/` SHALL contain only `.gitkeep`
- **AND** `reviews/` SHALL contain only `.gitkeep`
- **AND** `prompts/` SHALL contain all existing prompt files

### Requirement: Independent modules are preserved

The `.claude/commands/validation/` directory SHALL remain unchanged with all 5 command files (validate, code-review, code-review-fix, execution-report, system-review). The `.claude/commands/blog-article-writer/` directory SHALL remain unchanged.

#### Scenario: Validation commands still work

- **WHEN** an agent invokes `/validation:validate` or `/validation:code-review`
- **THEN** the command SHALL execute normally (files exist and are unmodified)
