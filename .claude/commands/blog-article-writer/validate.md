# Command: /blog-article-writer:validate

## Purpose
Validate blog article meets all quality standards.

## Phase
VALIDATE - Automatic quality checks

## Trigger
AUTOMATICALLY invoked after `/blog-article-writer:execute` completes.

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
- [ ] Grep for code blocks: `grep -n '```' src/content/blog/{slug}.md`
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
- [ ] CTA section present

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

**Generate OG Image:**

IMPORTANT: Requires GEMINI_API_KEY in .env file.

Use scripts/generate-image.js to generate abstract image:
```bash
node scripts/generate-image.js \
  "Create abstract tech OG image (1200x630px) - NO TEXT AT ALL, pure visual design.

  VISUAL STYLE:
  - Dark gradient background (charcoal to navy blue)
  - Minimalist, professional developer aesthetic
  - Modern tech design inspired by code editor themes

  VISUAL ELEMENTS ONLY (NO TEXT):
  - Floating code brackets < > symbols
  - AI brain/neural network icon (purple/blue gradient)
  - Lightning bolt symbols (bright cyan #00b8ff and green #00ff9d)
  - Terminal window shapes (minimal outlines)
  - Abstract circuit board patterns
  - Geometric shapes (triangles, hexagons)

  COMPOSITION:
  - Centered but dynamic arrangement
  - Icons floating at various sizes
  - Depth through overlapping and glow effects
  - Professional tech aesthetic

  IMPORTANT: NO TEXT whatsoever - no words, letters, or numbers" \
  --filename og-{slug} \
  --output public/images \
  --model gemini-3-pro-image-preview
```

Script will save to: public/images/og-{slug}.png

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
- [x] OG image generated: public/images/og-{slug}.webp
- [x] Image converted to WebP (93.5% size reduction)
- [x] Sitemap updated (article added)
- [x] Dev server test passed

## Overall Status
✅ VALIDATION PASSED - Article ready for publication

## Next Steps
1. Review article in browser: http://localhost:3000/blog/{slug}
2. Optional: Request peer review
3. Create git commit: git commit -m "feat: Add blog article {title}"
4. Deploy to production
```

## Success Criteria
- [ ] All validation levels pass
- [ ] Validation report generated
- [ ] OG image created and optimized
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
