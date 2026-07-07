# Subcommand: validate

## Purpose

Validate blog article meets all quality standards, generate OG image automatically, and update sitemap.

## Usage

```text
/blog-article-writer:validate {slug}
```

**Example:**
```text
/blog-article-writer:validate second-brain-obsidian-claude-code-skills
```

## Prerequisites

- Article exists at `src/content/blog/{slug}.md`
- GEMINI_API_KEY in `.env` (for OG image generation)

## Execution Steps

### Step 1: Validate Article Structure

**Check file exists:**
```bash
# Verify article file
test -f src/content/blog/{slug}.md
```

**Parse frontmatter and validate:**
```javascript
// Required fields
const required = ['id', 'slug', 'title', 'excerpt', 'category', 'author', 'date', 'readTime', 'image', 'tags'];

// Validate each field
// - id: integer, unique
// - slug: lowercase, hyphens, matches filename
// - title: 50-60 characters
// - excerpt: 150-160 characters
// - category: AI | Automatyzacja | No-Code
// - author: "Pawel Lipowczan"
// - date: YYYY-MM-DD format
// - readTime: X min format
// - image: /images/og-{slug}.webp
// - tags: 3-5 tags array
// - lang: "pl" (required; EN posts live in src/content/blog/en/ with lang: "en")

// Optional fields
// - description: string (BlogPosting JSON-LD description; fallback = first paragraph)
// - modified: YYYY-MM-DD (sitemap lastmod + dateModified; fallback = date)
// - alternateSlug: slug of the translated counterpart — see i18n rule below
```

**i18n / alternateSlug validation (critical):**

`alternateSlug` jest **opcjonalne**. Jeśli jest ustawione w pliku PL, oznacza to obietnicę: "istnieje symetryczny plik EN z tym slug-iem w `src/content/blog/en/`, i ten plik EN wskazuje z powrotem na mnie". Naruszenie tej obietnicy produkuje bug "Post not found" przy przełączaniu języka. Skrypt walidujący musi sprawdzić:

```bash
# 1. self-reference — zawsze bug
awk -F': ' '$1=="slug"{s=$2} $1=="alternateSlug"{a=$2} END{if(a && a==s) exit 1}' src/content/blog/{slug}.md

# 2. jeśli alternateSlug ustawione, plik EN musi istnieć
# (zamień kierunek gdy walidujesz plik EN-owy — wtedy szukaj w src/content/blog/)
alt=$(awk -F': ' '/^alternateSlug:/{print $2}' src/content/blog/{slug}.md | tr -d ' "')
if [ -n "$alt" ]; then
  test -f "src/content/blog/en/${alt}.md" || echo "FAIL: alternateSlug=$alt ale src/content/blog/en/${alt}.md nie istnieje"
fi

# 3. symetria — plik EN musi wskazywać z powrotem
if [ -n "$alt" ] && [ -f "src/content/blog/en/${alt}.md" ]; then
  back=$(awk -F': ' '/^alternateSlug:/{print $2}' "src/content/blog/en/${alt}.md" | tr -d ' "')
  [ "$back" = "{slug}" ] || echo "FAIL: plik EN ma alternateSlug=$back, oczekiwano {slug}"
fi
```

**Reguła:** dla PL-only postów (najczęstszy przypadek w tym projekcie) **nie dodawaj** `alternateSlug` w ogóle. Pole dodajemy dopiero gdy plik EN realnie powstał. Subcommand `/blog-article-writer:execute` tworzy wyłącznie wersję PL — EN to świadoma, osobna decyzja autora.

### Step 2: Validate Content Quality

**Code blocks validation:**
```bash
# Find all code blocks
grep -n '```' src/content/blog/{slug}.md

# Each opening ``` must have language tag
# Valid: ```javascript, ```yaml, ```text, ```bash
# Invalid: ``` (no tag)
```

**Language validation (vocabulary gate — critical, blocks publication):**

Uses the forbidden-word list from `.claude/rules/content/10-prosty-polski.md` (single source of truth — if the lists diverge, the rules file wins):

```bash
# Vocabulary gate: polonized verbs, false friends, banned borrowed nouns.
# MUST return no results; any match = ❌ FAILURE (list line + suggested
# replacement from the rules-file table) and validation stops before OG generation.
grep -niP '(komendyfik|ingestow|ingestuj|inge\x{15b}ci|ingestu\b|ingestem|mergow|merguj|robi\w* merge|renderow|renderuj|\brendery\b|\brenderu\b|deployow|deployuj|commitow|commituj|klastrow|klastruj|fallback|bundl|arsena\x{142}|z\x{17c}yt[aey]|dopieszczon|tre\x{15b}\x{107} stale|(?<!_)graveyard)' src/content/blog/{slug}.md
```

Matches inside code blocks or backticked file paths are acceptable — review manually and note in the report; matches in prose always fail.

**Structure validation:**
- H2 headers for main sections
- FAQ section present (## FAQ)
- Paragraphs are short

**CTA validation (canonical Tailwind pattern — critical, blocks publication):**

Run all checks below; any failure must be reported as ❌ FAILURE in report:

```bash
# 1. Canonical button class exists exactly once
test "$(grep -c 'class="btn-primary inline-block"' src/content/blog/{slug}.md)" = "1"

# 2. Canonical wrapper Tailwind classes
grep -q 'bg-dark-800/50 backdrop-blur-md' src/content/blog/{slug}.md

# 3. Link target is /#contact (not external)
grep -q 'href="/#contact" class="btn-primary' src/content/blog/{slug}.md

# 4. Canonical button text (PL or EN)
grep -qE '>(Umów bezpłatną konsultację|Book a free consultation)<' src/content/blog/{slug}.md

# 5. No deprecated patterns
! grep -q 'class="cta-section"' src/content/blog/{slug}.md
! grep -q 'style="display: inline-block; background: #00ff9d' src/content/blog/{slug}.md
! grep -q 'style="background: linear-gradient' src/content/blog/{slug}.md
! grep -qE 'href="https?://automation\.house' src/content/blog/{slug}.md

# 6. Section order: CTA before "Przydatne zasoby"/"Useful Resources" before FAQ
# Compare line numbers from: grep -n '<div class="mt-10\|## Przydatne zasoby\|## Useful Resources\|## FAQ' {file}
```

**Reject patterns (any of these = critical failure):**
- `<div class="cta-section">` — klasa nie istnieje w portfolio Tailwind config
- `style="display: inline-block; background: #00ff9d` — inline-style fallback link
- `style="background: linear-gradient` — old inline-styled wrapper
- Button text other than canonical: "Umów konsultację →", "Skontaktuj się", "Get in touch", custom variants
- `href="https://automation.house/kontakt"` jako CTA target (wzmianka w treści OK)

**Reference:** `.claude/skills/portfolio-copywriting/references/article-structure.md` (sekcja "Call to Action (CTA)")

### Step 3: Generate OG Image

**3a. Build Gemini prompt:**

Read article frontmatter and construct prompt:

```text
Create an abstract Open Graph image (1200x630px aspect ratio) for a blog article about [{category}]:

**Article Context:**
- Title: {title}
- Topic: {category}
- Theme: Professional developer blog

**Visual Design Requirements:**

Background:
- Deep dark gradient from #0a0e1a (bottom) to #151b2b (top)
- Smooth, professional gradient transition

Primary Visual Elements (bright green #00ff9d):
- Abstract geometric shapes suggesting code/technology
- Neural network node patterns with connecting lines
- Circuit board inspired pathways
- Floating hexagons and triangular elements
- Subtle glow effects

Secondary Visual Elements (cyan #00b8ff):
- Complementary geometric shapes
- Terminal window outlines (no text inside)
- Data flow visualization patterns

Style & Effects:
- Glassmorphism-inspired transparency
- Subtle blur effects creating depth
- Modern tech aesthetic
- Professional, minimalist composition

**CRITICAL CONSTRAINTS:**
- ABSOLUTELY NO TEXT, LETTERS, NUMBERS, WORDS, OR CHARACTER GLYPHS
- Pure abstract visual art only
- NO readable symbols, NO typography
- Professional enough for LinkedIn/Twitter social previews
- Must work as a thumbnail

**Aspect Ratio:** 1200x630 pixels

**Mood:** Innovative, professional, cutting-edge
```

**3b. Generate image:**

```bash
# Check if GEMINI_API_KEY exists
if [ -z "$GEMINI_API_KEY" ]; then
  echo "Warning: GEMINI_API_KEY not set. Skipping OG generation."
  # Save prompt for manual generation
else
  # Generate image
  node scripts/generate-image.js "{PROMPT}" \
    --filename og-{slug} \
    --output public/images \
    --model gemini-3-pro-image-preview
fi
```

**3c. Convert to WebP:**

```bash
# Convert PNG to WebP
node scripts/convert-to-webp.js public/images/og-{slug}.png

# Verify WebP created
test -f public/images/og-{slug}.webp

# Remove PNG (keep only WebP)
rm public/images/og-{slug}.png
```

### Step 4: Update Sitemap

```bash
node scripts/update-sitemap.js
```

Verify article appears in output.

### Step 5: Test Build

```bash
npm run build
```

Ensure no build errors related to new article.

### Step 6: Create Validation Report

Save to `.claude/agents/reports/validation-blog-{slug}.md`:

```markdown
# Blog Article Validation Report: {title}

**Date:** {timestamp}
**Article:** src/content/blog/{slug}.md

## Article Details

- **Blog ID:** {id}
- **Slug:** {slug}
- **Category:** {category}
- **Read Time:** {readTime}
- **Word Count:** {calculated}

## Validation Results

### File Structure
- [x] Article file exists
- [x] Frontmatter valid YAML
- [x] All required fields present
- [x] Blog ID unique

### Content Quality
- [x] All code blocks have language tags
- [x] Vocabulary gate clean (forbidden-word grep from 10-prosty-polski.md)
- [x] FAQ section present ({n} questions)
- [x] CTA section present
- [x] Short paragraphs

### SEO
- [x] Title optimized ({n} chars)
- [x] Excerpt compelling ({n} chars)
- [x] Headers semantic

## Post-Article Tasks

- [x] OG image generated: public/images/og-{slug}.webp
- [x] Image converted to WebP
- [x] Sitemap updated
- [x] Build passed

## Overall Status

✅ VALIDATION PASSED - Article ready for publication

## Next Steps

1. Review article: http://localhost:5173/blog/{slug}
2. Create git commit
3. Deploy to production
```

## Output

Display summary:

```text
✅ Blog Article Validation Complete

Article: {title}
File: src/content/blog/{slug}.md
Word Count: {n} words

Validation Results:
- File Structure: ✅ PASS
- Content Quality: ✅ PASS
- SEO: ✅ PASS

Post-Article Tasks:
- OG Image: ✅ Generated (public/images/og-{slug}.webp)
- Sitemap: ✅ Updated
- Build: ✅ Passed

Report: .claude/agents/reports/validation-blog-{slug}.md

Ready for: git commit -m "feat: Add blog article {title}"
```

## Error Handling

### Validation Failures

If any validation fails:
1. List all failures with details
2. DO NOT proceed to OG generation
3. Stop and report failures

```text
❌ Blog Article Validation Failed

Failures:
- Code block at line 45 missing language tag
- FAQ section not found

Fix these issues and run validation again.
```

### OG Generation Failures

If OG generation fails:
1. Save prompt to `.claude/agents/prompts/og-{slug}-prompt.txt`
2. Log error details
3. Continue with other steps
4. Mark as pending in report

```text
⚠️ OG Image Generation Failed

Error: GEMINI_API_KEY not configured
Prompt saved to: .claude/agents/prompts/og-{slug}-prompt.txt

To generate manually:
1. Set GEMINI_API_KEY in .env
2. Run: node scripts/generate-image.js "..." --filename og-{slug}
```

## Success Criteria

- [ ] All validation levels pass
- [ ] OG image generated and converted to WebP
- [ ] Sitemap updated
- [ ] Build passes
- [ ] Validation report created
