# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Pawel Lipowczan. React 19 + Vite 7 + Tailwind CSS 3 SPA with build-time prerendering for SEO.

**Live:** [https://pawel.lipowczan.pl](https://pawel.lipowczan.pl) (Vercel)

## Quick Reference - PIV Commands

| Command                                     | Purpose                                                            |
| ------------------------------------------- | ------------------------------------------------------------------ |
| `/core_piv_loop:prime`                      | Load codebase context and understanding                            |
| `/core_piv_loop:plan-feature "description"` | Create implementation plan                                         |
| `/core_piv_loop:execute`                    | Execute implementation plan                                        |
| `/validation:validate`                      | Run full validation pipeline ✨ _Runs automatically after execute_ |
| `/validation:code-review`                   | Technical code review on changed files                             |
| `/validation:execution-report`              | Generate execution report                                          |
| `/validation:system-review`                 | Analyze implementation vs plan                                     |

See [.claude/PIV-METHODOLOGY.md](.claude/PIV-METHODOLOGY.md) for complete methodology.

## Commands

```bash
# Development
npm run dev              # Start dev server (localhost:5173)
npm run build            # Fast build (no prerender)
npm run build:prerender  # Full production build with SEO prerendering
npm run preview          # Preview production build (localhost:4173)

# Testing
npm test                 # Run all Playwright E2E tests
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
- **[data-storage/00-overview.md](.claude/rules/data-storage/00-overview.md)**: Data handling (Markdown, static files).

### Technology Rules

Specific rules for project technologies:

- **React**: [.claude/rules/react/](.claude/rules/react/)
- **Tailwind CSS**: [.claude/rules/tailwindcss/](.claude/rules/tailwindcss/)
- **Vite**: [.claude/rules/vite/](.claude/rules/vite/)
- **Playwright**: [.claude/rules/playwright/](.claude/rules/playwright/)
- **Vercel**: [.claude/rules/vercel/](.claude/rules/vercel/)

**Agent Instruction:** Always check specific technology rules when working on related files.

## Documentation Structure

- **[.claude/](.claude/)**: Agent-facing documentation (Rules, Reference, Plans).
- **[docs/](docs/)**: User-facing documentation (Polish).
- **[AGENTS.md](AGENTS.md)**: High-level guide for AI agents.

## Architecture & Code Patterns

### Tech Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 3**
- **Framer Motion 12**
- **React Router 7**
- **React Helmet Async**

### Component Structure

- Functional components with hooks.
- PascalCase for components.
- Tailwind utility classes (mobile-first).

### SEO & Blog

- Prerendering via Puppeteer.
- Markdown blog posts in `src/content/blog/`.
- Frontmatter validation required.

## Agent Artifacts

PIV workflow creates artifacts in [.claude/agents/](.claude/agents/):

- `context/`
- `plans/`
- `reports/`
- `reviews/`

## Workflow Preferences

1. **Always Prime** (`/core_piv_loop:prime`) at start of session.
2. **Plan** complex features.
3. **Execute** & **Validate** (automatic).
