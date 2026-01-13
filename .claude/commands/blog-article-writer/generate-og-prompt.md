---
description: Generate Gemini API prompt for blog article OG image creation
---

# Command: /blog-article-writer:generate-og-prompt

## Purpose

Automatically generate an optimized prompt for Google Gemini API (gemini-3-pro-image-preview) that creates abstract Open Graph images matching the portfolio's design identity.

## Phase

SUPPORT - Supporting task for VALIDATE phase (Level 6, Step 1)

## When to Use

- During `/blog-article-writer:validate` execution (before OG image generation)
- When regenerating OG image for existing article
- When testing different image generation prompts

## Input Requirements

**Required Parameter:**
- `slug`: Blog article slug (e.g., "15-cursor-hacks-produktywnosc-ai")

**Automatic Reads:**
- Article frontmatter from `src/content/blog/{slug}.md`
- Design tokens from `.claude/reference/design/design-tokens.json`

## Steps

### 1. Load Article Metadata

Read frontmatter from `src/content/blog/{slug}.md`:
- Extract `title` (for context)
- Extract `category` (AI, Automatyzacja, No-Code)
- Extract `slug` (for validation)

If file not found:
```
❌ Error: Blog article not found
   Path: src/content/blog/{slug}.md

   💡 Available articles:
   [List files from src/content/blog/*.md]
```

If frontmatter invalid or missing required fields:
```
❌ Error: Invalid frontmatter in article
   Missing required fields: {fields}

   Required fields: title, category, slug
```

### 2. Build Optimized Gemini Prompt

Using the extracted metadata and portfolio design tokens from `.claude/reference/design/design-tokens.json`:
- Primary green: `colors.primary.500` (#00ff9d)
- Secondary cyan: `colors.secondary.500` (#00b8ff)
- Dark backgrounds: `colors.dark.800` (#0a0e1a), `colors.dark.700` (#151b2b)

Construct prompt following this exact template:

```
Create an abstract Open Graph image (1200x630px aspect ratio) for a blog article about [{category}] with this exact visual specification:

**Article Context:**
- Title: {title}
- Topic: {category}
- Theme: Professional developer blog focused on {category}

**Visual Design Requirements:**

Background:
- Deep dark gradient from #0a0e1a (bottom) to #151b2b (top)
- Smooth, professional gradient transition matching portfolio aesthetic

Primary Visual Elements (bright green #00ff9d):
- Abstract geometric shapes suggesting code/technology
- Neural network node patterns with connecting lines
- Circuit board inspired pathways
- Floating hexagons and triangular elements
- Subtle glow effects on key elements

Secondary Visual Elements (cyan #00b8ff):
- Complementary geometric shapes
- Lightning bolt accents
- Terminal window outlines (no text inside)
- Data flow visualization patterns

Style & Effects:
- Glassmorphism-inspired transparency on some elements
- Subtle blur effects creating depth
- Modern tech aesthetic matching portfolio website
- Professional, high-end, minimalist composition
- Clean, uncluttered layout with breathing room

**CRITICAL CONSTRAINTS:**
- ABSOLUTELY NO TEXT, LETTERS, NUMBERS, WORDS, OR CHARACTER GLYPHS
- Pure abstract visual art only
- NO readable symbols, NO typography, NO linguistic characters
- Focus on shapes, patterns, gradients, and geometric elements
- Professional enough for LinkedIn/Twitter social previews
- Must work as a thumbnail (recognizable at small sizes)

**Aspect Ratio:** 1200x630 pixels (Open Graph standard)

**Mood:** Innovative, professional, cutting-edge, trustworthy, expert
```

### 3. Generate Output

**Console Display:**

```
✅ OG Image Prompt Generated for: {title}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 GENERATED PROMPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{FULL_PROMPT_TEXT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Copy the prompt above
2. Run the image generation command:

   node scripts/generate-image.js \
     "Create an abstract Open Graph image..." \
     --filename og-{slug} \
     --output public/images \
     --model gemini-3-pro-image-preview

3. Convert to WebP:
   node scripts/convert-to-webp.js public/images/og-{slug}.png

4. Verify image created: public/images/og-{slug}.webp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Prompt saved to: .claude/agents/prompts/og-{slug}-prompt.txt
```

### 4. Save Artifact

Create directory if not exists: `.claude/agents/prompts/`

Save prompt to: `.claude/agents/prompts/og-{slug}-prompt.txt`

**Artifact Content:**
```
Generated: {YYYY-MM-DD HH:MM}
Article: {title}
Slug: {slug}
Category: {category}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GEMINI API PROMPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{FULL_PROMPT_TEXT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

node scripts/generate-image.js \
  "{FULL_PROMPT_TEXT}" \
  --filename og-{slug} \
  --output public/images \
  --model gemini-3-pro-image-preview
```

## Integration with Validation Workflow

This command is designed to be invoked at **Level 6, Step 1** of `/blog-article-writer:validate`.

**Current Workflow:**
```
Level 6: Post-Article Tasks
├── Step 1: Generate Prompt (MANUAL) ❌
├── Step 2: Use generate-image.js
├── Convert to WebP
└── Update Sitemap
```

**Updated Workflow:**
```
Level 6: Post-Article Tasks
├── Step 1: /blog-article-writer:generate-og-prompt {slug} ✅ AUTOMATED
├── Step 2: Use generate-image.js (copy-paste from output)
├── Convert to WebP
└── Update Sitemap
```

## Command Invocation Examples

**Standalone Usage:**
```bash
/blog-article-writer:generate-og-prompt 15-cursor-hacks-produktywnosc-ai
```

**Within Validation:**
The validate command can reference this command:
```markdown
**Step 1: Generate OG Image Prompt**

Run: `/blog-article-writer:generate-og-prompt {slug}`

This will:
- Load article frontmatter
- Apply portfolio design tokens
- Generate Gemini API optimized prompt
- Save to .claude/agents/prompts/og-{slug}-prompt.txt
```

## Success Criteria

- [ ] Article frontmatter loaded successfully
- [ ] Design tokens applied (#00ff9d, #00b8ff, #0a0e1a, #151b2b)
- [ ] Prompt generated with article context
- [ ] NO TEXT constraint prominently emphasized
- [ ] Prompt formatted for direct copy-paste
- [ ] Artifact saved to `.claude/agents/prompts/og-{slug}-prompt.txt`
- [ ] Clear usage instructions displayed
- [ ] Next steps clearly communicated

## Error Handling

**File Not Found:**
- Show clear error message with path
- List available blog articles from `src/content/blog/`
- Exit gracefully

**Missing Frontmatter:**
- Identify missing required fields
- Show required fields list
- Exit with error

**Design Tokens Missing:**
- Show warning
- Use fallback values (#00ff9d, #00b8ff, #0a0e1a, #151b2b)
- Continue execution

## Notes

- This command generates the prompt only; it does NOT execute `generate-image.js`
- User must manually copy the prompt and run the script
- This design allows review and modification of the prompt before generation
- Requires `GEMINI_API_KEY` in `.env` for subsequent image generation
- Image generation typically takes 10-30 seconds depending on API load

## Related Commands

- `/blog-article-writer:validate` - Full validation pipeline (invokes this command at Level 6)
- `/blog-article-writer:execute` - Article creation (comes before validation)

## Next Steps

After running this command:
1. Copy the generated prompt
2. Run `node scripts/generate-image.js` with the prompt
3. Convert PNG to WebP using `scripts/convert-to-webp.js`
4. Continue with remaining validation steps
