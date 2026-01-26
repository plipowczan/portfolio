# Subcommand: generate-og-prompt

## Purpose

Generate an optimized prompt for Google Gemini API that creates abstract Open Graph images matching the portfolio's design identity.

## Usage

```text
/blog-article-writer:generate-og-prompt {slug}
```

**Example:**
```text
/blog-article-writer:generate-og-prompt second-brain-obsidian-claude-code-skills
```

## Prerequisites

- Article exists at `src/content/blog/{slug}.md`
- Frontmatter contains: title, category, slug

## Execution Steps

### Step 1: Load Article Metadata

Read frontmatter from `src/content/blog/{slug}.md`:

```javascript
const matter = require('gray-matter');
const content = fs.readFileSync(`src/content/blog/${slug}.md`, 'utf8');
const { data } = matter(content);

const title = data.title;
const category = data.category;
const slug = data.slug;
```

**If file not found:**
```text
❌ Error: Blog article not found
   Path: src/content/blog/{slug}.md

   Available articles:
   - article-1.md
   - article-2.md
   ...
```

### Step 2: Load Design Tokens

Read from `.claude/reference/design/design-tokens.json`:

```javascript
const colors = {
  primary: '#00ff9d',    // Green accent
  secondary: '#00b8ff',  // Cyan accent
  darkBg1: '#0a0e1a',    // Darkest
  darkBg2: '#151b2b'     // Dark gradient end
};
```

**Fallback if file missing:** Use hardcoded values above.

### Step 3: Build Gemini Prompt

Construct prompt using template:

```text
Create an abstract Open Graph image (1200x630px aspect ratio) for a blog article about [{category}] with this exact visual specification:

**Article Context:**
- Title: {title}
- Topic: {category}
- Theme: Professional developer blog focused on {category_description}

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

**Category descriptions:**
- AI: "AI, machine learning, and intelligent automation"
- Automatyzacja: "business process automation and workflow optimization"
- No-Code: "no-code tools and low-code development"

### Step 4: Save Prompt Artifact

Create directory if needed:
```bash
mkdir -p .claude/agents/prompts
```

Save to `.claude/agents/prompts/og-{slug}-prompt.txt`:

```text
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
  "{ESCAPED_PROMPT}" \
  --filename og-{slug} \
  --output public/images \
  --model gemini-3-pro-image-preview
```

### Step 5: Display Output

```text
✅ OG Image Prompt Generated for: {title}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 GENERATED PROMPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{FULL_PROMPT_TEXT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Run the image generation command:

   node scripts/generate-image.js \
     "Create an abstract Open Graph image..." \
     --filename og-{slug} \
     --output public/images \
     --model gemini-3-pro-image-preview

2. Convert to WebP:
   node scripts/convert-to-webp.js public/images/og-{slug}.png

3. Remove PNG:
   rm public/images/og-{slug}.png

4. Verify image: public/images/og-{slug}.webp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Prompt saved to: .claude/agents/prompts/og-{slug}-prompt.txt
```

## Error Handling

### File Not Found

```text
❌ Error: Blog article not found
   Path: src/content/blog/{slug}.md

   💡 Available articles:
   [list from src/content/blog/*.md]
```

### Missing Frontmatter Fields

```text
❌ Error: Invalid frontmatter in article
   Missing required fields: title, category

   Required fields: title, category, slug
```

### Design Tokens Not Found

```text
⚠️ Warning: Design tokens file not found
   Path: .claude/reference/design/design-tokens.json

   Using fallback colors:
   - Primary: #00ff9d
   - Secondary: #00b8ff
   - Dark BG: #0a0e1a, #151b2b
```

## Notes

- This command generates the prompt only; it does NOT execute `generate-image.js`
- User must run the script separately (allows prompt review/modification)
- For fully automated flow, use `/blog-article-writer:validate` instead
- Requires `GEMINI_API_KEY` in `.env` for subsequent image generation

## Success Criteria

- [ ] Article frontmatter loaded successfully
- [ ] Design tokens applied (or fallback used)
- [ ] Prompt generated with article context
- [ ] NO TEXT constraint emphasized
- [ ] Prompt formatted for copy-paste
- [ ] Artifact saved to `.claude/agents/prompts/`
- [ ] Clear next steps displayed
