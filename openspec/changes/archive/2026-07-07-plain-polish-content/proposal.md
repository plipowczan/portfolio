## Why

Two user complaints about the LLM Wiki course and blog content, plus an audit of the content-generating skills:

1. **Readers stumble on Polonized English and jargon.** Course lessons still contain borrowed verbs ("ingestowałeś"), false friends ("treść stale" reads as "constantly" in Polish while meaning English *stale*), inconsistent terminology ("merge" vs "scalenie" in the same lesson), a grammar error ("Jedno wiadomość"), and ornamental epithets ("arsenał komend", "zżyta baza", "dopieszczone skille"). The plain-Polish rule that produced commit `46f2182` lives only in a session memory — nothing in the repo prevents regression.
2. **Nobody says who the course is for.** The `/llm-wiki` landing collects signups without stating the target audience or prerequisite knowledge (e.g. what RAG or an agent is), so people subscribe blind.

The language rules themselves are scattered and contradictory: `portfolio-copywriting` says "deployment, staging, CI/CD — ZAWSZE po angielsku" while the goal is plain Polish; `blog-article-writer` keeps three separate copies of language guidance and its "No polonized terms" validation has no word list, so it cannot be checked mechanically.

## What Changes

- **NEW** shared rules file `.claude/rules/content/10-prosty-polski.md` — single source of truth for plain-Polish content rules: replacement table, keep-list (proper/product terms), banned Polonized verbs, ornament restraint, first-use definition format (parenthetical gloss), and a grep validation command with a forbidden-word list.
- **`portfolio-copywriting` skill**: flip the "English vs Polish" default (Polish when a natural equivalent exists; English only for names, commands, acronyms), add the first-use-definition rule and ornament restraint, and point at the shared rules file.
- **`blog-article-writer` skill**: replace its three inline language-rule copies with references to the shared rules file; add an automated glossary grep to `validate.md` (same pattern as the existing em-dash gate).
- **Course lessons `src/content/kurs/*.md`**: fix the grammar bug and the *stale* false friend, remove Polonized verbs and remaining borrowed nouns, unify merge→scalenie, translate "renderuje/rendery" to plain Polish, tone down epithets, and add parenthetical glosses at first use of hard terms. "vault" stays everywhere (Obsidian product term) but gets a gloss at first use.
- **Landing `/llm-wiki` + course hub `/llm-wiki/kurs`**: new "Dla kogo jest ten kurs" section — audience description plus a prerequisite-concept list where each concept carries a one-sentence plain-Polish definition. Single shared data source so the two pages cannot drift.

## Capabilities

### New Capabilities

- `course-content-style`: content-style guarantees for course lessons — plain-Polish vocabulary (no Polonized verbs, no false friends, consistent terminology), ornament restraint, and parenthetical first-use definitions.

### Modified Capabilities

- `blog-content-style`: extended with the shared plain-Polish rules file, the first-use-definition rule for blog articles, and a mechanical glossary validation gate in the article workflow.
- `llm-wiki-landing`: gains an audience-and-prerequisites section (who the course is for, what you should already know, each concept defined in one sentence).
- `llm-wiki-course`: the course hub gains the same audience-and-prerequisites section, fed from the same data source as the landing. **Note:** this capability's base spec lives in the in-flight change `add-llm-wiki-course` (not yet in `openspec/specs/`); this delta layers on top of it.

## Impact

- **Agent docs:** new `.claude/rules/content/10-prosty-polski.md`; edits to `.claude/skills/portfolio-copywriting/{SKILL.md,references/writing-style.md}` and `.claude/skills/blog-article-writer/{SKILL.md,subcommands/execute.md,subcommands/validate.md}`; CLAUDE.md rules index gains one line.
- **Content:** `src/content/kurs/1-zaloz-katalog.md` … `5-rozwoj-i-publikacja.md` (prose-only edits; commands, file names, tables, and structure unchanged — the `add-llm-wiki-course` "1:1 from deliverable" requirement already allows prose refinement).
- **UI:** `src/pages/LlmWikiLanding.jsx`, `src/pages/CourseHub.jsx`, plus one new shared data module (e.g. `src/data/coursePrerequisites.js`).
- **Tests:** E2E assertions for the new section on both pages; prerender smoke checks. Existing waitlist/course specs untouched otherwise.
- **Not touched:** blog post content (rules apply to the writing workflow going forward, not retroactively), EN blog mirror, `api/subscribe`, CSP, sitemap.
