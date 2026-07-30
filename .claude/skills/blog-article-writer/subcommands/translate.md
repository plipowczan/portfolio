---
name: translate
description: Generate EN translation of PL article — mandatory step after validate. Bidirectional alternateSlug, internal-link remapping, canonical EN CTA pattern, sitemap regeneration.
---

# Translate Subcommand

Mandatory translation step after PL article validation passes. Every PL article gets EN counterpart in the same workflow run.

## When to Use

After `/blog-article-writer:validate` returns ✅ PASSED on the PL article. Same session — do not split across sessions.

## Inputs

- PL slug (defaults to most recent `src/content/blog/*.md` not in `en/` subdirectory,
  excluding `AGENTS.md`, `CLAUDE.md`, and `README.md` — those are docs, not articles)
- Optional: explicit EN slug override

## Workflow

### Step 1: Load PL article and propose EN slug

```bash
# Find PL article
PL_FILE="src/content/blog/{pl-slug}.md"

# Extract frontmatter for context
grep -E "^slug:|^title:|^excerpt:|^id:|^date:|^tags:" "$PL_FILE"
```

EN slug naming rules:
- Translate PL stems: `-przewodnik` → `-guide`, `-zarzadzanie-firma` → `-company-management`
- Or generate from EN title (4-6 lowercase words, hyphens, keep proper nouns)
- Suffix `-case-study` if needed for differentiation
- **Must differ from PL slug** (URL collision)

**Confirm with user before writing.**

### Step 2: Translate content

Translate prose, headings, FAQ Q&A, table cells, CTA text, anchor text.

Preserve unchanged: code blocks (with language tags), accordion structure, frontmatter `id`/`date`/`image`/`tags`/`readTime`, external URLs, proper nouns.

Frontmatter changes:
- `slug` → EN slug
- `title` → EN title
- `excerpt` → EN translation (150-160 chars)
- `lang: pl` → `lang: en`
- Add `alternateSlug: <PL slug>`

### Step 3: Remap internal links

For each `(/blog/<pl-target-slug>)` in PL article body:

```bash
# Find EN counterpart slug
EN_TARGET=$(grep "^alternateSlug:" src/content/blog/<pl-target-slug>.md | awk '{print $2}')
```

Replace `(/blog/<pl-target-slug>)` → `(/en/blog/$EN_TARGET)`.

If `EN_TARGET` is empty (no EN version exists), **omit the link** and rephrase the sentence — never link to a 404.

### Step 4: Apply canonical EN CTA

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    [EN headline]
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    [EN description]
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>
```

Section title: `## Useful Resources` (NOT `## Przydatne zasoby` or `## Resources`).

### Step 5: Write EN file

```bash
EN_FILE="src/content/blog/en/{en-slug}.md"
# Write file
```

### Step 6: Update PL article alternateSlug (bidirectional symmetry)

Edit PL frontmatter to add `alternateSlug: {en-slug}`. Both files now point at each other.

### Step 7: Regenerate sitemap

```bash
node scripts/update-sitemap.js
```

Verify counts: PL +0 (already there), EN +1, total +1.

### Step 8: Run EN validation

Run all CTA validation checks (see `validate.md`) but with EN canonical: button text `Book a free consultation`, section title `## Useful Resources`.

### Step 9: Update validation report

Append "## EN Translation" section to `.claude/agents/reports/validation-blog-{pl-slug}.md` with EN file path, EN slug, link mapping results, validation status.

## Reject Patterns (apply same as PL validation, with EN variants)

- Button text other than `Book a free consultation`
- Section title `## Resources` (use `## Useful Resources`)
- `alternateSlug` pointing at own slug (karpathy bug)
- `alternateSlug` pointing at non-existent file
- Internal link to non-existent EN post

## Reference

- `.claude/skills/portfolio-copywriting/references/article-structure.md` — canonical CTA pattern
- `.claude/commands/blog-article-writer/translate.md` — full command spec
- `src/content/blog/AGENTS.md` — `alternateSlug` rules (post-karpathy fix)
