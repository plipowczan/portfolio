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
- Review structure, frontmatter, style guidelines
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

### 4. Validation Triggers Automatically
After execution, `/blog-article-writer:validate` runs AUTOMATICALLY (see validate.md)

## Success Criteria
- [ ] Article written following plan structure
- [ ] Saved to `src/content/blog/{slug}.md`
- [ ] All code blocks have language tags
- [ ] No polonized English terms
- [ ] Matches Pawel's writing style
- [ ] Frontmatter complete and correct
- [ ] Automatic validation triggered

## Next Phase
AUTOMATIC: `/blog-article-writer:validate` (no manual invocation needed)
