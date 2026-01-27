# Command: /blog-article-writer:execute

## Purpose

Write complete blog article following the approved plan.

## Phase

IMPLEMENT (Execution) - Write article content

## Prerequisites

- `/blog-article-writer:prime` completed
- `/blog-article-writer:plan` completed and APPROVED by user
- Plan artifact exists: `.claude/agents/plans/blog-{slug}.md`

## Steps

### 1. Load Plan

- Read plan artifact: `.claude/agents/plans/blog-{slug}.md`
- **IMPORTANT:** Check for "User Feedback & Comments" section and incorporate all requested changes
- Review structure, frontmatter, style guidelines
- Note any HTML comments (`<!-- -->`), blockquotes, or inline edits in plan
- Load prime context if needed for details

### 2. Invoke Portfolio Copywriting Skill

Use the Skill tool to leverage portfolio-copywriting:

```
Skill(
  skill: "portfolio-copywriting",
  args: "Write blog article following plan at .claude/agents/plans/blog-{slug}.md

  Key requirements:
  - Follow exact frontmatter from plan
  - Use approved article structure
  - **CRITICAL:** Incorporate ALL user feedback and comments from plan (check for 'User Feedback & Comments' section, HTML comments, and inline edits)
  - **REQUIRED:** Include FAQ section following docs/faq/FAQ_TEMPLATE.md
    - 4-6 questions optimized for LLM discovery
    - Natural Polish questions (10-25 words each)
    - Snippet-style answers (2-4 sentences, key info first)
    - Wrap each Q&A in `<details open>` accordion
    - H2 header: '## FAQ'
    - Questions as H3 inside `<summary>`, answers as paragraphs in details body
  - ALL code blocks must have language tags (use 'text' if no specific language)
  - Never polonize English technical terms (no 'komendyfikacja')
  - Pawel's voice: direct, practical, personal
  - Polish language with natural English technical terms
  - Short paragraphs (2-4 sentences)
  - Bold key concepts on first mention

  Output: Complete markdown file ready for src/content/blog/{slug}.md"
)
```

### 3. Write Article to File

After skill generates content:

- Save to: `src/content/blog/{slug}.md`
- Verify file created successfully

### 4. Trigger Validation

After successfully writing the article, IMMEDIATELY invoke validation:

```
/blog-article-writer:validate
```

This will:

- Validate all content quality checks
- Generate OG image (if GEMINI_API_KEY is available)
- Convert to WebP
- Update sitemap
- Create validation report

## Success Criteria

- [ ] Article written following plan structure
- [ ] Saved to `src/content/blog/{slug}.md`
- [ ] FAQ section included (4-6 questions)
- [ ] All code blocks have language tags
- [ ] No polonized English terms
- [ ] Matches Pawel's writing style
- [ ] Frontmatter complete and correct
- [ ] Automatic validation triggered

## Next Phase

MANUAL: Invoke `/blog-article-writer:validate` immediately after execute completes
