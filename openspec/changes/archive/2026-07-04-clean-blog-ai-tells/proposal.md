## Why

Every published blog post (26 files, PL + EN) is riddled with typographic AI-tells: 1354 em dashes (`—`) and 150 en dashes (`–`). This already violates the `portfolio-copywriting` skill's own punctuation rule, whose validation `grep` currently fails on every affected article. The rule also only covers punctuation — it says nothing about the rhetorical phrasing patterns ("It's not just X, it's Y", empty openers/closers, forced rule-of-three) that flag text as machine-written. We fix both the existing content and the generator that produces future content, so the tell is designed out at the source.

## What Changes

- Replace `—` and `–` with a plain hyphen `-` across `src/content/blog/**/*.md` (PL + EN). Space-wrapped dashes ` — ` / ` – ` become ` - `; numeric ranges `2020–2025` become `2020-2025` (no surrounding spaces). Ellipsis `…` is already absent (0 occurrences) — no action needed.
- Preserve Polish quotation marks `„ "` — correct typography, not an AI-tell.
- Extend `portfolio-copywriting` skill (`references/writing-style.md`) with a new subsection listing forbidden AI phrasing constructions (PL + EN) in the existing ✅/❌ table format.
- Enforce a validation gate: `grep -nP '[\x{2014}\x{2013}\x{2026}]'` over `src/content/blog/**` must return empty after the change.

## Capabilities

### New Capabilities

- `blog-content-style`: Human-authored voice guardrails for blog content — forbidden typographic characters (em/en dash, ellipsis) and forbidden rhetorical AI-tell phrasing constructions, plus the validation gate that enforces them.

### Modified Capabilities

<!-- None. No existing spec governs blog content style. -->

## Impact

- **Content**: 26 markdown files under `src/content/blog/` and `src/content/blog/en/` (~1504 character replacements). No frontmatter keys or code touched; `modified` dates left as-is (cosmetic edit, per blog rules).
- **Skill**: `.claude/skills/portfolio-copywriting/references/writing-style.md` (new phrasing subsection).
- **Build/SEO**: None expected — prerendering, sitemap, schema unaffected by character swaps. Verify E2E blog tests still pass.
- **Risk**: Low. Mechanical replace on space-wrapped dashes (0 glued em dashes confirmed). Main watch-item: en dash inside numeric ranges must not gain spaces.
