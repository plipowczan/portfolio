## 1. Remove PIV Files

- [x] 1.1 Delete `.claude/PIV-METHODOLOGY.md`
- [x] 1.2 Delete `.claude/commands/piv_loop/` directory (prime.md, plan-feature.md, execute.md)
- [x] 1.3 Delete `.claude/commands/bug_fix/` directory (rca.md, implement-fix.md)

## 2. Clean Up Stale Artifacts

- [x] 2.1 Delete all `.md` files from `.claude/agents/plans/` (keep `.gitkeep`)
- [x] 2.2 Delete all `.md` files from `.claude/agents/reports/` (keep `.gitkeep`)
- [x] 2.3 Delete all `.md` files from `.claude/agents/reviews/` (keep `.gitkeep`)

## 3. Update CLAUDE.md

- [x] 3.1 Replace "Quick Reference - PIV Commands" section with "Quick Reference - OpenSpec Commands" listing all `/opsx:*` commands
- [x] 3.2 Remove link to `.claude/PIV-METHODOLOGY.md`
- [x] 3.3 Replace "Agent Artifacts" section to reflect OpenSpec workflow instead of PIV
- [x] 3.4 Replace "Workflow Preferences" section to reference OpenSpec commands instead of PIV

## 4. Verify

- [x] 4.1 Confirm no PIV/piv_loop/core_piv references remain in CLAUDE.md
- [x] 4.2 Confirm `.claude/commands/validation/` is intact (5 files)
- [x] 4.3 Confirm `.claude/commands/blog-article-writer/` is intact (5 files)
- [x] 4.4 Confirm `.claude/agents/context/blog-prime-*.md` files are preserved
- [x] 4.5 Confirm `.claude/agents/prompts/` files are preserved
