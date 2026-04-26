# Command: /blog-article-writer:validate

## Purpose

Validate blog article meets all quality standards.

## Phase

VALIDATE - Automatic quality checks

## Trigger

Manually invoke after `/blog-article-writer:execute` completes: `/blog-article-writer:validate`

## Validation Levels

### Level 1: File Structure

- [ ] Article file exists at `src/content/blog/{slug}.md`
- [ ] Frontmatter is valid YAML
- [ ] All required frontmatter fields present
- [ ] Blog ID is unique (not duplicate)
- [ ] Slug matches filename

### Level 2: Content Quality

**Frontmatter Validation:**

- [ ] id: integer, unique
- [ ] slug: lowercase, hyphens, matches filename
- [ ] title: 50-60 characters
- [ ] excerpt: 150-160 characters
- [ ] category: one of [AI, Automatyzacja, No-Code]
- [ ] author: "Pawel Lipowczan"
- [ ] date: YYYY-MM-DD format, valid date
- [ ] readTime: matches article length (~200 words/min)
- [ ] image: /images/og-{slug}.webp format
- [ ] tags: 3-5 tags in array

**Code Block Validation:**

- [ ] Grep for code blocks: ` grep -n '```' src/content/blog/{slug}.md `
- [ ] Check each block has language tag (not just ```)
- [ ] Verify no blocks without language specification

**Language Validation:**

- [ ] No inappropriately polonized terms
- [ ] Search for problematic patterns: grep "komendyfik\|skomendyfik" {file}
- [ ] Technical terms properly formatted (backticks where appropriate)

**Structure Validation:**

- [ ] H2 headers used for main sections (no lone H3s)
- [ ] Paragraphs are short (2-4 sentences)
- [ ] Key concepts bolded

**CTA Validation (canonical Tailwind pattern — see `.claude/skills/portfolio-copywriting/references/article-structure.md`):**

Run all checks below; **any failure is a critical issue** (blocks publication).

- [ ] **CTA exists** — exactly one match for `class="btn-primary inline-block"`:
      `grep -c 'class="btn-primary inline-block"' {file}` → must equal 1
- [ ] **Wrapper uses canonical Tailwind classes** — must contain `bg-dark-800/50 backdrop-blur-md`:
      `grep -c 'bg-dark-800/50 backdrop-blur-md' {file}` → must equal 1
- [ ] **Link target is `/#contact`** (not external like `automation.house/kontakt`):
      `grep -E 'href="/#contact"' {file}` → must match the CTA `<a>` line
- [ ] **Button text is canonical** — PL: `Umów bezpłatną konsultację`, EN: `Book a free consultation`:
      `grep -E '>(Umów bezpłatną konsultację|Book a free consultation)<' {file}` → must match
      Reject: `Umów konsultację →`, `Skontaktuj się`, `Get in touch`, custom variants
- [ ] **No deprecated patterns:**
      - `grep 'class="cta-section"' {file}` → must be empty (klasa nie istnieje w portfolio Tailwind)
      - `grep 'style="display: inline-block; background: #00ff9d' {file}` → must be empty (inline style fallback)
      - `grep 'style="background: linear-gradient' {file}` → must be empty (old wrapper style)
      - `grep -E 'automation\.house/kontakt' {file}` → must be empty in `<a href>` context (mention in body OK, but never as CTA target)
- [ ] **Section order:** CTA appears **before** `## Przydatne zasoby` (PL) / `## Useful Resources` (EN), which appears **before** `## FAQ`:
      verify line numbers via `grep -n '<div class="mt-10\|## Przydatne zasoby\|## Useful Resources\|## FAQ' {file}`

### Level 3: SEO Validation

- [ ] Title includes primary keyword
- [ ] Slug is SEO-friendly
- [ ] Excerpt is compelling
- [ ] Headers use semantic structure (H1 → H2 → H3)
- [ ] External links have proper format

### Level 4: Technical Accuracy

- [ ] Code examples syntactically valid (spot check)
- [ ] Version numbers specified where relevant
- [ ] No broken internal links
- [ ] External links return 200 (spot check)

### Level 5: Rendering Test

- [ ] Start dev server: `npm run dev` (in background)
- [ ] Navigate to article: /blog/{slug}
- [ ] Verify article displays without errors
- [ ] Check code blocks render as blocks (not inline)
- [ ] Verify frontmatter displays correctly

### Level 6: Post-Article Tasks

**Step 1: Generate OG Image Prompt (AUTOMATED)**

Run the automated prompt generation command:

```bash
/blog-article-writer:generate-og-prompt {slug}
```

This command will:
- Load article frontmatter from `src/content/blog/{slug}.md`
- Apply portfolio design tokens from `.claude/reference/design/design-tokens.json`
- Generate Gemini API optimized prompt with article context
- Save prompt to `.claude/agents/prompts/og-{slug}-prompt.txt`
- Display formatted prompt ready for copy-paste

**Manual Alternative (if command unavailable):**

If the command is not available, manually construct prompt following the template in `.claude/commands/blog-article-writer/generate-og-prompt.md` (Step 2: Build Optimized Gemini Prompt)

**Step 2: Use Generated Prompt with generate-image.js**

IMPORTANT: Requires GEMINI_API_KEY in .env file.

After receiving the generated prompt from Step 1, use it with the image generation script:

```bash
# The generated prompt from Step 1 should be used here
node scripts/generate-image.js \
  "{GENERATED_PROMPT_FROM_STEP_1}" \
  --filename og-{slug} \
  --output public/images \
  --model gemini-3-pro-image-preview
```

Script will save to: `public/images/og-{slug}.png`

**Convert to WebP:**

```
Copy PNG to public/images/og-{slug}.png
Run: node scripts/convert-to-webp.js public/images/og-{slug}.png
Remove PNG after conversion
```

**Update Sitemap:**

```
Run: node scripts/update-sitemap.js
Verify article appears in sitemap
```

## Validation Report

Create validation report: `.claude/agents/reports/validation-blog-{slug}.md`

```markdown
# Blog Article Validation Report: {title}

## Article Details

- **File**: src/content/blog/{slug}.md
- **Blog ID**: {id}
- **Date**: {date}
- **Read Time**: {readTime}
- **Word Count**: {calculated}

## Validation Results

### ✅ PASSED

- File structure valid
- Frontmatter complete and correct
- All code blocks have language tags
- No polonized terms found
- SEO optimized
- Renders correctly in dev server

### ⚠️ WARNINGS

[List any non-critical issues]

### ❌ FAILURES

[List any critical issues that must be fixed]

## Post-Article Tasks Completed

- [x] OG image prompt generated (based on design reference)
- [x] OG image generated: public/images/og-{slug}.webp
- [x] Image converted to WebP (93.5% size reduction)
- [x] Sitemap updated (article added)
- [x] Dev server test passed

## Overall Status

✅ VALIDATION PASSED - PL article validated, EN translation pending

## Next Step (MANDATORY)

After PL validation passes, **immediately invoke** the translate command:

```
/blog-article-writer:translate
```

This is **not optional**. Every PL article must have an EN counterpart in the same workflow run.

After translate completes:

1. Review both PL + EN in browser:
   - http://localhost:5173/blog/{pl-slug}
   - http://localhost:5173/en/blog/{en-slug}
2. Optional: peer review
3. Create single git commit covering both files: `feat(blog): add post {N} (PL+EN) — {short title}`
4. Deploy to production
```

## Success Criteria

- [ ] All validation levels pass
- [ ] Validation report generated
- [ ] OG image prompt generated (Step 1)
- [ ] OG image created and optimized (Step 2)
- [ ] Sitemap updated
- [ ] Dev server shows article correctly
- [ ] No critical failures

## Failure Handling

If validation fails:

1. Document failures in report
2. DO NOT proceed to post-article tasks
3. Present failures to user
4. Wait for fixes before retrying validation

## Completion

After successful validation:

- Validation report saved
- All post-article tasks completed
- User notified of success
- Article ready for git commit and deployment
````
