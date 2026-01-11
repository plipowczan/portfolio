# Blog Article Writer Workflow

**Purpose:** Documentation for creating blog articles using PIV methodology with commands.

## ⚠️ Important: Do NOT Use as Agent

This is workflow documentation, NOT an invokable agent.

**Correct Usage:** Invoke commands sequentially in main conversation
**Incorrect Usage:** `@agent-blog-article-writer` via Task tool (file access restrictions)

---

## PIV Workflow Overview

```
1. /blog-article-writer:prime
   ↓ (Research source materials, analyze style)

2. /blog-article-writer:plan
   ↓ (Create detailed implementation plan)

3. USER APPROVAL of plan
   ↓

4. /blog-article-writer:execute
   ↓ (Write article using portfolio-copywriting skill)

5. /blog-article-writer:validate (AUTOMATIC)
   ↓ (Validate quality, generate OG image, update sitemap)

6. Validation report → User
```

## Quick Start

### Prerequisites
- Source materials in `docs/blog/`
- GEMINI_API_KEY configured in .env file
- scripts/generate-image.js available (uses gemini-3-pro-image-preview)
- Dev server available (npm run dev)

### Execution

**Step 1: Prime**
```
Run /blog-article-writer:prime

Source materials at docs/blog/[your-file].md
Topic: [describe article topic]
Target audience: [who is this for]
```

**Step 2: Plan**
```
Run /blog-article-writer:plan
```
Review plan output, approve or request changes.

**Step 3: Execute** (after approval)
```
Run /blog-article-writer:execute
```

**Step 4: Validate** (automatic)
Validation runs automatically and will:
- Check quality (code tags, language, structure)
- Generate OG image (NO TEXT, Gemini 3 Pro)
- Convert to WebP
- Update sitemap
- Test in dev server

## File Locations

- **Prime Context:** `.claude/agents/context/blog-prime-{topic}.md`
- **Plans:** `.claude/agents/plans/blog-{slug}.md`
- **Articles:** `src/content/blog/{slug}.md`
- **Validation Reports:** `.claude/agents/reports/validation-blog-{slug}.md`
- **OG Images:** `public/images/og-{slug}.webp`

## Critical Requirements

### Code Blocks
- ALL code blocks MUST have language tag
- Use `text` if no specific language applies
- Validation will fail if blocks lack tags

### Language
- Polish + natural English technical terms
- NEVER polonize: "komendyfikacja" → use "commandification" or describe
- Keep English: React, API, hooks, deployment

### Style
- Pawel's voice: direct, practical, personal
- Short paragraphs (2-4 sentences)
- Bold key concepts
- First-person perspective

### OG Images
- NO TEXT (abstract visual design only)
- Generated with scripts/generate-image.js using gemini-3-pro-image-preview
- Dark gradient background
- Portfolio colors: cyan #00b8ff, green #00ff9d

## Common Issues

**Issue:** Commands can't access .claude/ folders
**Solution:** Commands must run in main conversation context (not subagent)

**Issue:** OG image has unwanted text
**Solution:** validate.md prompt explicitly states "NO TEXT AT ALL" multiple times

**Issue:** Image quality low
**Solution:** Ensure scripts/generate-image.js uses --model gemini-3-pro-image-preview (default)

## See Also

- **Full Workflow:** `docs/BLOG_WORKFLOW.md`
- **Commands:** `.claude/commands/blog-article-writer/*.md`
- **Copywriting Skill:** `.claude/skills/portfolio-copywriting/SKILL.md`

---

**Last Updated:** 2026-01-11
**Status:** Active - Use commands, not agent invocation
