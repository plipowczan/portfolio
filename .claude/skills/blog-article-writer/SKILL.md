---
name: blog-article-writer
description: Complete blog article creation workflow with automatic OG image generation and mandatory EN translation. Use for creating new blog articles - supports prime (research), plan, execute, validate, translate, and generate-og-prompt subcommands. Automatically generates OG images using Gemini API if GEMINI_API_KEY is configured. Every PL article gets EN counterpart in the same workflow run.
license: Apache-2.0
---

# Blog Article Writer

Complete workflow for creating blog articles on pawel.lipowczan.pl with automatic OG image generation.

## Quick Reference

### Available Subcommands

| Command                                   | Purpose                                                        |
| ----------------------------------------- | -------------------------------------------------------------- |
| `/blog-article-writer:prime`              | Research and analyze source materials                          |
| `/blog-article-writer:plan`               | Create detailed article plan                                   |
| `/blog-article-writer:execute`            | Write article following approved plan                          |
| `/blog-article-writer:validate`           | Validate article + generate OG image + update sitemap          |
| `/blog-article-writer:translate`          | **Mandatory** EN translation after PL validation passes        |
| `/blog-article-writer:archive`            | Archive source materials from `docs/blog/` after publishing    |
| `/blog-article-writer:generate-og-prompt` | Generate Gemini API prompt for OG image                        |

### Workflow Overview

```text
1. /blog-article-writer:prime
   ↓ (Research source materials, analyze style)

2. /blog-article-writer:plan
   ↓ (Create detailed implementation plan)

3. USER APPROVAL of plan
   ↓

4. /blog-article-writer:execute
   ↓ (Write PL article using portfolio-copywriting skill)

5. /blog-article-writer:validate (invoke after execute)
   ↓ (Validate PL quality, generate OG image, update sitemap)

6. /blog-article-writer:translate (MANDATORY — run after validate ✅ PASSED)
   ↓ (Generate EN translation, bidirectional alternateSlug,
      remap internal links, regenerate sitemap, validate EN)

7. /blog-article-writer:archive (MANUAL, SKIPPABLE — run after translate)
   ↓ (Move docs/blog/* → docs/blog/_archive/{slug}/ via git mv,
      auto-generate MANIFEST.md. Skip if you plan a follow-up
      article from the same source pack.)

8. Done — both PL and EN articles ready for single commit
```

**Note:** translate step is **not optional**. Every PL article must have an EN counterpart in the same workflow run. This guarantees bilingual symmetry across the blog (PL count = EN count in `sitemap.xml`).

## Prerequisites

- Source materials in `docs/blog/` (top-level only — see `_archive/` rule below)
- GEMINI_API_KEY in `.env` file (for OG image generation)
- `scripts/generate-image.js` available
- Dev server available (`npm run dev`)

## Context hygiene: `docs/blog/_archive/` is OFF-LIMITS

`docs/blog/_archive/` holds source materials for **past, already-published** articles and exists only to preserve provenance and history. It is **not** a knowledge base, **not** a reference, and **not** a source of inspiration for the current article.

**The agent MUST NOT read from `docs/blog/_archive/` during any subcommand other than `/blog-article-writer:archive`.** This applies to `prime`, `plan`, `execute`, `validate`, `translate`, and `generate-og-prompt`. Reading from `_archive/` (with `Read`, `Grep`, `Glob`, `cat`, `ls -R`, etc.) pollutes the working context with off-topic material and degrades plan quality.

When listing `docs/blog/`, always filter out `_archive`:

```bash
ls docs/blog/ | grep -v '^_archive$'      # bash
```

```powershell
Get-ChildItem docs/blog -Force | Where-Object { $_.Name -ne '_archive' }   # PowerShell
```

The only subcommand that touches `_archive/` is `/blog-article-writer:archive`, and it **writes** (creates `_archive/{slug}/` and `MANIFEST.md`) — it does not read from existing archive folders either.

## File Locations

| Artifact           | Path                                               |
| ------------------ | -------------------------------------------------- |
| Prime Context      | `.claude/agents/context/blog-prime-{topic}.md`     |
| Plans              | `.claude/agents/plans/blog-{slug}.md`              |
| Articles           | `src/content/blog/{slug}.md`                       |
| Validation Reports | `.claude/agents/reports/validation-blog-{slug}.md` |
| OG Images          | `public/images/og-{slug}.webp`                     |
| OG Prompts         | `.claude/agents/prompts/og-{slug}-prompt.txt`      |

## Critical Requirements

### Code Blocks

- ALL code blocks MUST have language tag
- Use `text` if no specific language applies
- Validation will fail if blocks lack tags

### Language

Single source of truth: **`.claude/rules/content/10-prosty-polski.md`** (replacement table, keep-list, forbidden-word grep). Core rules:

- Plain Polish by default; English stays only when the reader sees the term in a tool's UI or file system (commit, frontmatter, vault, command names, technology names)
- NEVER polonize verbs: "ingestować", "mergować", "commitować" → Polish verb or "robić commit"
- Define every hard term (keep-list included) in parentheses at first use in the article

### Style

- Pawel's voice: direct, practical, personal
- Short paragraphs (2-4 sentences)
- Bold key concepts on first mention
- First-person perspective

### FAQ Section (Required)

- 4-6 questions optimized for LLM discovery
- Natural Polish questions (10-25 words each)
- Snippet-style answers (2-4 sentences)
- Use `<details open>` accordion format
- See `docs/faq/FAQ_TEMPLATE.md` for structure

### OG Images

- NO TEXT (abstract visual design only)
- Uses portfolio design tokens (#00ff9d, #00b8ff, #0a0e1a, #151b2b)
- Generated via `scripts/generate-image.js` + Gemini API
- Auto-converted to WebP

## Subcommand Details

### /blog-article-writer:prime

**Purpose:** Research and analyze source materials before writing.

**Steps:**

1. Check `docs/blog/` for source materials
2. Read 2-3 recent articles from `src/content/blog/`
3. Review portfolio-copywriting skill guidelines
4. Extract key topics and concepts
5. Create prime artifact: `.claude/agents/context/blog-prime-{topic}.md`

**Output:** Prime artifact with comprehensive context

---

### /blog-article-writer:plan

**Purpose:** Create detailed implementation plan.

**Prerequisites:** Prime completed

**Steps:**

1. Load prime context
2. Determine next blog ID (grep existing IDs)
3. Design frontmatter (title, excerpt, slug, tags)
4. Plan article structure (H2 sections, word counts)
5. Plan FAQ questions (4-6)
6. Create plan artifact: `.claude/agents/plans/blog-{slug}.md`

**Output:** Complete plan ready for user approval

---

### /blog-article-writer:execute

**Purpose:** Write complete blog article following approved plan.

**Prerequisites:** Plan approved by user

**Steps:**

1. Load plan from `.claude/agents/plans/blog-{slug}.md`
2. Check for user feedback in plan
3. Use `portfolio-copywriting` skill to write article
4. Save to `src/content/blog/{slug}.md`
5. Notify user to run validate

**Output:** Complete article markdown file

---

### /blog-article-writer:validate

**Purpose:** Validate article and generate OG image.

**Prerequisites:** Article exists in `src/content/blog/`

**Steps:**

**Level 1: File Structure**

- Article file exists
- Frontmatter valid YAML
- All required fields present
- Blog ID unique

**Level 2: Content Quality**

- Code blocks have language tags
- No polonized terms
- FAQ section present
- CTA section present

**Level 3: Generate OG Image**

```bash
# 1. Generate prompt (internally)
# Uses article metadata + design tokens

# 2. Call generate-image.js
node scripts/generate-image.js "{PROMPT}" \
  --filename og-{slug} \
  --output public/images \
  --model gemini-3-pro-image-preview

# 3. Convert to WebP
node scripts/convert-to-webp.js public/images/og-{slug}.png

# 4. Remove PNG (keep only WebP)
```

**Level 4: Update Sitemap**

```bash
node scripts/update-sitemap.js
```

**Level 5: Create Validation Report**

- Save to `.claude/agents/reports/validation-blog-{slug}.md`

**Output:** Validation report + OG image generated

---

### /blog-article-writer:archive

**Purpose:** Move source materials from `docs/blog/` into a per-article archive folder after publishing.

**Prerequisites:**

- Published PL article exists at `src/content/blog/{slug}.md`
- (Recommended) Published EN article exists at `src/content/blog/en/{slug}.md` — missing EN warns but does not block

**Inputs:** `{slug}` (required), `--force` (optional, allow re-archive into existing `_archive/{slug}/`)

**Steps:**

1. Verify `src/content/blog/{slug}.md` exists (else abort, working tree unchanged)
2. Verify `docs/blog/_archive/{slug}/` does not exist unless `--force` (else abort)
3. Enumerate top-level entries in `docs/blog/`, excluding whitelist (`_archive`, `README.md`, `.gitkeep`)
4. If list is empty → no-op with `Nothing to archive in docs/blog/`
5. `mkdir -p docs/blog/_archive/{slug}/`
6. For each entry: `git mv` (with `mv` fallback for untracked entries) into the archive folder
7. Resolve EN counterpart by reading `alternateSlug` from PL frontmatter and checking `src/content/blog/en/{alternateSlug}.md`; if either is missing, emit warning
8. Write `docs/blog/_archive/{slug}/MANIFEST.md` with date, slug, PL/EN article links, and bullet list of moved top-level entries
9. Print summary; suggest user reviews `git status` before committing

**Output:**

- Source materials moved into `docs/blog/_archive/{slug}/` (history preserved via `git mv`)
- `docs/blog/_archive/{slug}/MANIFEST.md` auto-generated

**Edge cases:** empty source → no-op; archive folder collision → refuse without `--force`; missing EN translation → warn + record `(no EN translation)` in manifest; unknown slug → refuse before any move.

This step is **manual and skippable.** Skip when planning a follow-up article from the same source pack.

---

### /blog-article-writer:generate-og-prompt

**Purpose:** Generate Gemini API prompt for OG image.

**Input:** Article slug

**Steps:**

1. Read article frontmatter from `src/content/blog/{slug}.md`
2. Load design tokens from `.claude/reference/design/design-tokens.json`
3. Build Gemini-optimized prompt
4. Save to `.claude/agents/prompts/og-{slug}-prompt.txt`
5. Display prompt and usage instructions

**Prompt Template:**

```text
Create an abstract Open Graph image (1200x630px aspect ratio) for a blog article about [{category}]:

**Article Context:**
- Title: {title}
- Topic: {category}

**Visual Design Requirements:**

Background:
- Deep dark gradient from #0a0e1a (bottom) to #151b2b (top)

Primary Visual Elements (bright green #00ff9d):
- Abstract geometric shapes suggesting code/technology
- Neural network node patterns
- Circuit board pathways
- Floating hexagons

Secondary Visual Elements (cyan #00b8ff):
- Complementary geometric shapes
- Terminal window outlines (no text)
- Data flow visualization

**CRITICAL CONSTRAINTS:**
- ABSOLUTELY NO TEXT, LETTERS, NUMBERS, WORDS
- Pure abstract visual art only
- Professional enough for LinkedIn/Twitter previews

**Aspect Ratio:** 1200x630 pixels
```

## Integration with Scripts

### generate-image.js

Located at: `scripts/generate-image.js`

**Usage:**

```bash
node scripts/generate-image.js "prompt text" \
  --filename og-slug-name \
  --output public/images \
  --model gemini-3-pro-image-preview
```

**Requirements:**

- GEMINI_API_KEY in `.env`
- Default model: gemini-3-pro-image-preview

### convert-to-webp.js

Located at: `scripts/convert-to-webp.js`

**Usage:**

```bash
node scripts/convert-to-webp.js public/images/og-slug.png
```

### update-sitemap.js

Located at: `scripts/update-sitemap.js`

**Usage:**

```bash
node scripts/update-sitemap.js
```

## Error Handling

### Missing GEMINI_API_KEY

If API key not configured:

1. Skip automatic OG generation
2. Generate prompt and save to file
3. Notify user to generate manually or add API key

### Image Generation Failure

If Gemini API fails:

1. Log error details
2. Save prompt for manual retry
3. Continue with other validation steps
4. Mark OG image as pending in report

### Article Validation Failure

If validation finds issues:

1. List all failures
2. DO NOT proceed with OG generation
3. Wait for user fixes
4. Re-run validation after fixes

## See Also

- **Portfolio Copywriting:** `.claude/skills/portfolio-copywriting/SKILL.md`
- **Design Tokens:** `.claude/reference/design/design-tokens.json`
- **FAQ Guidelines:** `docs/faq/FAQ_TEMPLATE.md`
- **Article Examples:** `src/content/blog/`

---

**Last Updated:** 2026-05-09
**Status:** Active
