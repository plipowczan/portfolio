# AGENTS.md — src/content/

## Purpose

Markdown source for everything the site publishes as an article or a lesson.
Two independent content systems live here: the blog and the LLM Wiki course.

## Ownership

**Owns:** the rule that both subtrees share — the plain-Polish standard and the
frontmatter-is-a-contract principle.

**Does not own:** parsing (`src/data/`), rendering (`src/pages/`), or any
per-system schema. Those belong to the children below.

## Local Contracts

- Every Polish text in this subtree follows
  `.claude/rules/content/10-prosty-polski.md`. That file is the single source of
  truth for vocabulary and style and is cross-cutting — it also governs course
  FAQ copy in `src/data/courseFaq.js`. Link it; never copy any part of it into a
  folder doc.
- Frontmatter is a contract, not metadata. Both loaders validate it at the
  boundary and fail or skip the file when it does not hold.
- A `slug` is a live URL. Renaming one requires a redirect.

## Work Guidance

- Markdown is parsed with `gray-matter` and rendered with `react-markdown`
  (`src/components/ui/MarkdownContent.jsx`).
- Blog and course are separate systems with different required fields. Read the
  child doc for the system you are touching before editing a file.

## Verification

```bash
npm test   # Playwright, incl. the blog and course page specs
```

Plus the plain-Polish vocabulary grep defined in
`.claude/rules/content/10-prosty-polski.md`.

## Child DOX Index

- `src/content/blog/AGENTS.md` — blog articles, PL in the folder and EN in `blog/en/`.
- `src/content/kurs/AGENTS.md` — LLM Wiki course lessons, Polish only.
