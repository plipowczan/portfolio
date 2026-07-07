## Context

Content-language rules are scattered across four places and partly contradict each other. `portfolio-copywriting/references/writing-style.md` has a good AI-tells section (punctuation + phrasing) but its "English vs Polish" section defaults to English ("deployment, staging, CI/CD — ZAWSZE po angielsku"). `blog-article-writer` duplicates language guidance in `SKILL.md`, `execute.md`, and `validate.md`, and the validate step's "No polonized terms" check has no word list. Course lessons (`src/content/kurs/*.md`) have no rules in the repo at all — the plain-Polish cleanup of commit `46f2182` was driven by a session memory and can silently regress.

User feedback added two requirements: state who the course is for (with prerequisite concepts explained) before signup, and define every hard term at first use — on the blog as well as in the course.

All decisions below were confirmed with the user in a decision sweep (2026-07-07).

## Goals / Non-Goals

**Goals:**
- One repo-tracked source of truth for plain-Polish content rules, referenced by both content skills.
- Mechanical validation (grep word list) so regressions fail a gate instead of relying on reviewer attention.
- Course lessons cleaned of the remaining Polonized English, false friends, and ornament stacking.
- Audience + prerequisites visible on the `/llm-wiki` landing and the course hub, sharing one data source.

**Non-Goals:**
- Retroactive rewrite of published blog posts (rules bind the writing workflow going forward).
- Renaming commands, file names, or repo terms (`/ingest`, `vault-map.md`, `render.py`, `_graveyard/` as paths).
- EN translations of the course or landing (course is PL-only by spec).
- New visual design for the landing (the new section reuses the existing section styling).

## Decisions

### D1 — Audience/prerequisites section on the landing AND the course hub (not lesson 1)
User decision. The landing converts signups, so the information must appear before the form; the hub is where enrolled users land, so it repeats there. Lesson 1 stays untouched by this section. A single shared data module (e.g. `src/data/coursePrerequisites.js`) feeds both pages so copy cannot drift.
- *Alternatives:* landing only (returning users never see it); lesson 1 only (doesn't help before signup — the actual complaint).

### D2 — Prerequisites as a concept list with one-sentence definitions
User decision. Not a bare list ("musisz znać: RAG, embeddings") and not a soft level description. Each concept gets a plain-Polish definition in one sentence, so a reader who doesn't know the term learns it on the spot instead of bouncing. The concept list is derived from terms actually used in the lessons (LLM, agent, markdown, git, terminal/Claude Code, RAG), not from a generic AI syllabus.

### D3 — First-use definitions as parenthetical glosses, rule for blog + course
User decision. Format: term followed by a definition in parentheses at its first occurrence in a given lesson/article — e.g. `RAG (technika, w której model przed odpowiedzią czyta Twoje dokumenty)`. For long definitions, a separate sentence directly after the term is allowed. No end-of-page glossary, no callout boxes (readers skip them; boxes break text rhythm and need style work). The rule lands in the shared rules file, so it binds blog articles and course lessons alike.

### D4 — Glossary boundary: product terms stay, generic jargon is translated
Synthesis of two user decisions ("vault" stays everywhere; "renderuje/rendery" goes fully Polish). The testable rule: **a term stays in English if the reader will see it in a tool's UI or file system** (vault in Obsidian, frontmatter, markdown, git, RAG, OKF, command names, file names); **it is translated if it exists only in our prose** (renderować→wypełniać szablon, ingestować→wczytywać, mergować→scalać, fallback→awaryjnie, stale→przeterminowany). Keep-list terms still get a D3 gloss at first use — staying English does not exempt a term from being explained.

### D5 — Single shared rules file at `.claude/rules/content/10-prosty-polski.md`
Follows the repo convention that all rules live under `.claude/rules/` (CLAUDE.md: "All project rules are centralized in .claude/rules/"). Both skills replace their own (contradictory) language lists with a reference to this file. Content: writing principles (sentence ≤ ~20 words average, one thought per sentence), the replacement table, the keep-list, banned Polonized verbs, ornament rules, the D3 gloss format, and the validation grep.

### D6 — Mechanical validation gate: grep word list
Same mechanism as the proven em-dash gate (`grep -nP '[\x{2014}\x{2013}\x{2026}]'`). The rules file carries a forbidden-word regex (Polonized verbs + false friends + banned borrowed nouns in prose); `blog-article-writer:validate` runs it against the article being validated, and the course lessons must pass it as part of this change. The word list checks prose vocabulary only — it cannot catch ornament stacking or missing glosses; those stay reviewer/skill responsibilities.

### D7 — Ornament restraint as a rule, not a purge
Adjective/epithet must be backed by a number or an example, otherwise cut ("dopieszczone skille" → "sprawdzone skille"). Maximum one metaphor per section; a good one stays ("to kompas, nie koparka"). This extends the existing "Puste wzmacniacze" row of the AI-tells table into a general rule.

### D8 — One change, ordered rules → skills → lessons → UI
User decision (one change instead of two). Tasks are sequenced so the rules file exists before skills reference it and before lessons are edited against it; the UI section comes last since it is independent of the language work.

## Risks / Trade-offs

- **Word-list false positives** (e.g. "merge" inside a code block or command table) → the grep gate targets prose; scope the regex with word boundaries and verify hits manually on first run; code blocks and file paths in backticks are acceptable hits to whitelist by rewording the regex or the prose.
- **Glosses bloat sentences** → D3 allows a follow-up sentence for long definitions; the ≤20-words guideline applies after the gloss is treated as an aside.
- **`llm-wiki-course` delta layers on an unarchived base spec** (`add-llm-wiki-course` is still in flight) → the delta only ADDs a requirement, no conflict with pending requirements; archive order: `add-llm-wiki-course` first, then this change.
- **Landing copy grows above the fold** → the section goes below the existing value list, before/near the form; prerender test asserts presence, visual check on preview deploy.
