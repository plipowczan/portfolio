# Subcommand: execute

## Purpose

Write complete blog article following the approved plan.

## Usage

```text
/blog-article-writer:execute {slug}
```

**Example:**
```text
/blog-article-writer:execute second-brain-obsidian-claude-code-skills
```

## Prerequisites

- Plan approved by user
- Plan artifact exists: `.claude/agents/plans/blog-{slug}.md`

## Execution Steps

### Step 1: Load Plan

Read plan artifact:
```bash
cat .claude/agents/plans/blog-{slug}.md
```

**IMPORTANT:** Check for:
- "User Feedback & Comments" section
- HTML comments (`<!-- -->`)
- Blockquotes with feedback
- Inline edits

Incorporate ALL user feedback into the article.

### Step 2: Load Prime Context (if needed)

If plan references prime artifact:
```bash
cat .claude/agents/context/blog-prime-{topic}.md
```

### Step 3: Invoke Portfolio Copywriting Skill

Use the portfolio-copywriting skill to write the article:

```text
Skill: portfolio-copywriting

Args: Write blog article following plan at .claude/agents/plans/blog-{slug}.md

Key requirements:
- Follow exact frontmatter from plan
- Use approved article structure
- Incorporate ALL user feedback from plan
- Include FAQ section (4-6 questions)
  - Natural Polish questions (10-25 words)
  - Snippet-style answers (2-4 sentences)
  - Use <details open> accordion format
- ALL code blocks must have language tags
- Never polonize English technical terms
- Pawel's voice: direct, practical, personal
- Polish language with English technical terms
- Short paragraphs (2-4 sentences)
- Bold key concepts on first mention

Output: Complete markdown file
```

### Step 4: Write Article to File

Save generated content to:
```bash
src/content/blog/{slug}.md
```

Verify:
- File created successfully
- Frontmatter valid YAML
- Content complete

### Step 5: Quick Validation

Before triggering full validation, quick check:

```bash
# Check file exists
test -f src/content/blog/{slug}.md && echo "OK"

# Check frontmatter
head -30 src/content/blog/{slug}.md

# Check word count
wc -w src/content/blog/{slug}.md
```

### Step 6: Notify for Validation

After successfully writing:

```text
✅ Article Written Successfully

File: src/content/blog/{slug}.md
Word Count: ~{n} words

Quick Checks:
- [x] File created
- [x] Frontmatter present
- [x] Content complete

Next Step: /blog-article-writer:validate {slug}

This will:
- Validate content quality
- Generate OG image (if GEMINI_API_KEY configured)
- Update sitemap
- Create validation report
```

## Article Writing Guidelines

### Frontmatter

Must match plan exactly:
```yaml
---
id: {from plan}
slug: {from plan}
title: "{from plan}"
excerpt: "{from plan}"
category: {from plan}
author: Pawel Lipowczan
date: {from plan}
readTime: {from plan}
image: /images/og-{slug}.webp
tags:
  - {from plan}
lang: pl
# Optional — set ONLY if a corresponding EN file exists in src/content/blog/en/
# NEVER point alternateSlug at this post's own slug. If no EN translation
# exists, omit the field entirely.
# alternateSlug: {en-slug}
---
```

### Bilingual rule (important)

- Każdy nowy post domyślnie jest **PL-only**. Pole `alternateSlug` **NIE jest ustawiane** dopóki nie istnieje plik `src/content/blog/en/<en-slug>.md`.
- Self-reference (`alternateSlug: <ten sam slug co slug:>`) to bug — powoduje że przełącznik języka produkuje URL `/en/blog/<pl-slug>` który nie istnieje → "Post not found".
- Jeśli autor chce EN wersję: najpierw utwórz `src/content/blog/en/<en-slug>.md` z `lang: en` i `alternateSlug: <pl-slug>`, **potem** dodaj `alternateSlug: <en-slug>` do pliku PL. Symetria wymagana.

### Code Blocks

**ALL code blocks MUST have language tags:**

```javascript
// Good
const x = 1;
```

```text
// Good - use 'text' for plain text
folder/
├── file1
└── file2
```

```yaml
# Good
key: value
```

**NEVER:**
```
// Bad - no language tag
code here
```

### FAQ Section

**Required format:**

```markdown
## FAQ

<details open>
<summary>

### Naturalne pytanie po polsku, 10-25 słów?

</summary>

Snippet-style odpowiedź, 2-4 zdania. Kluczowa informacja w pierwszym zdaniu. Konkretne fakty i liczby.

</details>

<details open>
<summary>

### Kolejne pytanie...?

</summary>

Odpowiedź...

</details>
```

### CTA Section

Use HTML format:

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    {CTA headline}
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    {CTA description}
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

### Language Guidelines

**Keep English:**
- Technology names (React, Claude Code, Obsidian)
- Technical terms (API, workflow, skills)
- Established concepts (second brain, MCP)

**Use Polish:**
- Explanations
- Descriptions
- Narrative

**NEVER polonize:**
- ❌ "komendyfikacja" → ✅ "commandification" or describe in Polish
- ❌ "skillsy" → ✅ "skills"

## Error Handling

### Plan Not Found

```text
❌ Error: Plan not found
   Path: .claude/agents/plans/blog-{slug}.md

   Available plans:
   [list from .claude/agents/plans/blog-*.md]
```

### Write Failed

```text
❌ Error: Failed to write article
   Path: src/content/blog/{slug}.md
   Reason: {error}

   Check permissions and path.
```

## Success Criteria

- [ ] Plan loaded and understood
- [ ] User feedback incorporated
- [ ] Article written following plan structure
- [ ] Saved to src/content/blog/{slug}.md
- [ ] FAQ section included (4-6 questions)
- [ ] All code blocks have language tags
- [ ] No polonized English terms
- [ ] Matches Pawel's writing style
- [ ] Frontmatter complete and correct
- [ ] Ready for validation
