@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The line above imports the DOX rail — the binding work contract. This file adds
the Claude Code specifics: the OpenSpec command table and the `.claude/rules/`
index.

## Project Overview

Personal portfolio website for Pawel Lipowczan. React 19 + Vite 7 + Tailwind CSS 3 SPA with build-time prerendering for SEO.

**Live:** [https://pawel.lipowczan.pl](https://pawel.lipowczan.pl) (Vercel)

## Quick Reference - OpenSpec Commands

| Command                        | Purpose                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| `/opsx:explore`                | Think through ideas, investigate problems                  |
| `/opsx:new "description"`     | Start a new change with structured artifacts               |
| `/opsx:continue`              | Create the next artifact for an active change              |
| `/opsx:ff`                    | Fast-forward: create all artifacts in one go               |
| `/opsx:apply`                 | Implement tasks from a change                              |
| `/opsx:verify`                | Verify implementation matches change artifacts             |
| `/opsx:archive`               | Archive a completed change                                 |
| `/opsx:sync`                  | Sync delta specs to main specs                             |
| `/opsx:bulk-archive`          | Archive multiple completed changes                         |
| `/opsx:onboard`               | Guided onboarding walkthrough                              |
| `/validation:validate`        | Run full validation pipeline                               |
| `/validation:code-review`     | Technical code review on changed files                     |
| `/validation:code-review-fix` | Fix issues found in code review                            |
| `/validation:execution-report`| Generate execution report                                  |
| `/validation:system-review`   | Analyze implementation vs plan                             |

## Commands

```bash
# Development
npm run dev              # Start dev server (port derived per worktree - see scripts/ports.mjs)
npm run build            # Fast build (no prerender)
npm run build:prerender  # Full production build with SEO prerendering + output check
npm run preview          # Preview production build (port derived per worktree)

# Testing
npm test                 # Playwright E2E: chromium + Mobile Chrome (narrow default)
PW_ALL=1 npm test        # Full browser matrix
PW_PREVIEW=1 npm test    # Also start the preview server (needed by the consent gate suite)
npm run test:headed      # Run with visible browser
npm run test:ui          # Interactive test UI

# Content
npm run blog:sitemap     # Update sitemap.xml with blog posts
npm run img:convert      # Convert images to WebP format
```

## Rules System

All project rules are centralized in **[.claude/rules/](.claude/rules/)**.

### Universal Rules

- **[00-universal-overview.md](.claude/rules/00-universal-overview.md)**: Core principles, coding style, file organization.
- **[10-setup.md](.claude/rules/10-setup.md)**: Environment setup and configuration.
- **[11-git.md](.claude/rules/11-git.md)**: Git workflow and conventions.
- **[content/10-prosty-polski.md](.claude/rules/content/10-prosty-polski.md)**: Plain-Polish vocabulary and style rules for all PL content (blog, course lessons, landings).

Blog frontmatter, FAQ structure, and loader conventions are **not** here — they
live with the folders that own them: [src/content/blog/AGENTS.md](src/content/blog/AGENTS.md)
and [src/data/AGENTS.md](src/data/AGENTS.md).

### Technology Rules

Specific rules for project technologies:

- **React**: [.claude/rules/react/](.claude/rules/react/)
- **Tailwind CSS**: [.claude/rules/tailwindcss/](.claude/rules/tailwindcss/)
- **Vite**: [.claude/rules/vite/](.claude/rules/vite/)
- **Playwright**: [.claude/rules/playwright/](.claude/rules/playwright/)
- **Vercel**: [.claude/rules/vercel/](.claude/rules/vercel/)

**Agent Instruction:** Always check specific technology rules when working on related files.

## Documentation Structure

- **[AGENTS.md](AGENTS.md)**: The DOX rail — the binding work contract, plus the Child DOX Index of every folder-level `AGENTS.md`.
- **[.claude/](.claude/)**: Agent-facing documentation (Rules, Reference, Plans).
- **[docs/](docs/)**: User-facing documentation (Polish), plus [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) and [TODO.md](docs/TODO.md).

## Architecture & Code Patterns

### Tech Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 3**
- **Framer Motion 12**
- **React Router 7**

### Component Structure

- Functional components with hooks.
- PascalCase for components.
- Tailwind utility classes (mobile-first).

### SEO & Blog

- Prerendering via Puppeteer.
- Markdown blog posts in `src/content/blog/`.
- Frontmatter validation required.

## Agent Artifacts

OpenSpec change artifacts are stored in `openspec/changes/<name>/`.

Validation reports are written to [.claude/agents/](.claude/agents/):

- `context/` — blog priming contexts
- `reports/` — validation reports
- `prompts/` — OG image generation prompts

## Workflow Preferences

1. **Explore** (`/opsx:explore`) to think through ideas before starting.
2. **New change** (`/opsx:new`) for structured feature development.
3. **Apply** (`/opsx:apply`) to implement, then **Verify** (`/opsx:verify`).
4. **Validate** (`/validation:validate`) for code quality checks.
