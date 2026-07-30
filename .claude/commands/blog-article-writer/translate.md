# Command: /blog-article-writer:translate

## Purpose

Create EN translation of PL article. Mandatory step — every PL article must have EN counterpart.

## Phase

TRANSLATE - EN translation immediately after PL validation passes

## Trigger

Manually invoke after `/blog-article-writer:validate` completes successfully: `/blog-article-writer:translate`

Optional argument: PL slug (defaults to most recently created article in `src/content/blog/*.md`, excluding the `AGENTS.md` / `CLAUDE.md` / `README.md` docs).

## Prerequisites

- `/blog-article-writer:validate` completed with ✅ PASSED (no critical failures)
- PL article exists at `src/content/blog/{pl-slug}.md`
- Frontmatter has `lang: pl` and either has no `alternateSlug` or has a placeholder

## Steps

### 1. Load PL Article

- Read full PL article from `src/content/blog/{pl-slug}.md`
- Extract frontmatter (id, slug, title, excerpt, tags, image, date, etc.)
- Note all internal links `(/blog/<other-pl-slug>)` for mapping

### 2. Determine EN Slug

EN slug **must differ** from PL slug (URL collision otherwise). Generation rules:

- If PL slug ends in PL-specific stem (`-przewodnik`, `-zarzadzanie-firma`, `-strukturyzowana-praca-z-ai`), translate stem to EN equivalent (`-guide`, `-company-management`, `-structured-ai-work`)
- If PL slug is title transliteration, generate EN slug from EN title (lowercase, hyphens, 4-6 words, keep proper nouns like "qamera-ai", "claude-code")
- For case studies / generic topics, suffix with `-case-study` or `-en` to differentiate

Reference existing PL→EN slug pairs (consistency check):

| PL slug | EN slug |
|---|---|
| `opsx-workflow-strukturyzowana-praca-z-ai` | `opsx-workflow-structured-ai-work` |
| `skills-2-0-multi-agent-system-zarzadzanie-firma` | `skills-2-0-multi-agent-system-company-management` |
| `llm-knowledge-base-brain-karpathy` | `karpathy-llm-wiki-knowledge-base` |
| `vibe-coding-przewodnik` | `vibe-coding-guide` |
| `second-brain-obsidian-claude-code-skills` | `second-brain-obsidian-claude-code-skills` (same — already EN) |

**Confirm proposed EN slug with user** before writing the file. Show: PL slug, EN slug, EN title.

### 3. Translate Content

Translation is **adaptation, not literal**:

**Translate (PL → EN):**
- All narrative prose
- All H2 / H3 headings
- All FAQ questions and answers
- All table cell text
- All `<h3>` and `<p>` content inside CTA `<div>`
- All anchor text in inline links

**Preserve unchanged:**
- All code blocks (HTML, JSON, XML, bash, text blocks) — even if they contain English/Polish strings inside, code is treated as data
- All language tags on code blocks
- All `<details open><summary>` accordion structure
- Frontmatter `id`, `date`, `image`, `tags`, `readTime`
- All external link URLs
- All proper nouns: "Pawel Lipowczan", "Qamera AI", "Claude Code", "OpenSpec", framework names, package names

**Frontmatter changes:**
- `slug` → new EN slug
- `title` → EN title (translate fully)
- `excerpt` → EN translation (150-160 chars)
- `lang: pl` → `lang: en`
- `alternateSlug: <PL slug>` (bidirectional)
- All other fields unchanged

**Internal link mapping:**

For every PL internal link `(/blog/<pl-target-slug>)`, find the EN counterpart:

```bash
# For each <pl-target-slug> in PL article body
grep -E "^slug:|^alternateSlug:" src/content/blog/<pl-target-slug>.md
```

Then rewrite `(/blog/<pl-target-slug>)` → `(/en/blog/<en-target-slug>)`.

If a linked PL post has no EN counterpart, log a warning and **omit the link** (replace with plain text or remove sentence) — do not link to a 404.

### 4. Apply Canonical CTA Pattern (EN variant)

CTA must use canonical Tailwind structure (same as PL — see `.claude/skills/portfolio-copywriting/references/article-structure.md`):

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    [EN translation of PL CTA headline]
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    [EN translation of PL CTA description]
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>
```

Button text **always** `Book a free consultation` (canonical EN). Section title **always** `## Useful Resources` (PL "Przydatne zasoby").

### 5. Write EN Article

- Save to: `src/content/blog/en/{en-slug}.md`
- Verify file created

### 6. Update PL Article (Bidirectional alternateSlug)

Update PL article frontmatter:
- Add or update `alternateSlug: {en-slug}`

This closes the bilingual symmetry loop. Both files now point at each other.

### 7. Regenerate Sitemap

```bash
node scripts/update-sitemap.js
```

Verify: PL count increased by 1 (already there from earlier validate) AND EN count increased by 1. Total URL count increased by 1.

### 8. Trigger Validation on EN Article

Run validation against the new EN file:

```
/blog-article-writer:validate
```

(or run inline checks: frontmatter validity, code block language tags, canonical CTA pattern with `Book a free consultation` button text, FAQ section present, internal links resolve)

### 9. Generate Validation Report Update

Append to or update `.claude/agents/reports/validation-blog-{pl-slug}.md`:

```markdown
## EN Translation

- **EN file:** src/content/blog/en/{en-slug}.md
- **EN slug:** {en-slug}
- **Bidirectional alternateSlug:** ✅ both files point at each other
- **Sitemap:** PL ↔ EN symmetry restored ({total} URLs total)
- **Internal links mapped:** {N}/{N} resolved to EN counterparts (or {N} omitted because no EN counterpart)
- **CTA:** canonical pattern, "Book a free consultation"
- **EN validation:** ✅ PASSED / ⚠️ warnings / ❌ failures
```

## Success Criteria

- [ ] EN file created at `src/content/blog/en/{en-slug}.md`
- [ ] Frontmatter has `lang: en` + `alternateSlug` pointing at PL slug
- [ ] PL frontmatter updated with `alternateSlug` pointing at EN slug
- [ ] All internal links remapped to EN counterparts (or omitted if no EN counterpart)
- [ ] CTA uses canonical pattern with "Book a free consultation" button text
- [ ] Section title is `## Useful Resources` (not `## Przydatne zasoby` or `## Resources`)
- [ ] FAQ section preserved as `<details open>` accordion
- [ ] All code blocks unchanged (data, not prose)
- [ ] Sitemap regenerated, PL ↔ EN symmetry confirmed
- [ ] Validation report updated with EN translation section

## Failure Handling

If translation fails or produces low-quality output:

1. Do NOT commit partial translation
2. Document failure in validation report
3. Alert user with specific issues (e.g., "3 internal links have no EN counterpart and were dropped — please review semantic loss")
4. Wait for user decision (manual fix vs. retry)

## Common Pitfalls

- **Don't auto-set `alternateSlug` to PL slug itself** — that's the karpathy bug. Always set to the OTHER language's slug
- **Don't translate code blocks** — even if they contain prose-like content, treat as data
- **Don't link to non-existent EN posts** — verify EN counterpart exists before mapping link
- **Don't change `id`** — same numeric id across PL+EN (id 25 in both for spec-driven-seo example)
- **Don't reuse PL slug as EN slug** — URL collision

## Next Phase

After translate completes successfully:

- Both PL + EN articles validated
- Sitemap symmetric
- Ready for single commit covering both files
- Suggested commit message: `feat(blog): add post {N} (PL+EN) — {short title}`
