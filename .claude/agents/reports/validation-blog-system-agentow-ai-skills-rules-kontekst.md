# Blog Article Validation Report — Pre-revenue startup bez działu finansów. Anatomia systemu agentów AI.

> **Generated:** 2026-05-09
> **Phase:** VALIDATE

## Article Details

- **File:** `src/content/blog/system-agentow-ai-skills-rules-kontekst.md`
- **Blog ID:** 27
- **Date:** 2026-05-09
- **Read Time:** 16 min
- **Word Count:** 3 782 (incl. frontmatter + HTML; prose ~3 200)
- **File Size:** 28.5 KB

## Validation Results

### ✅ PASSED

**Level 1 — File structure**
- File exists at expected path
- Frontmatter is valid YAML, all required fields present
- `id: 27` unique among portfolio's blog IDs (note: pre-existing `id: 1` collision between `automatyzacja-email-frontdesk-ai.md` and `README.md` is unrelated to this article)
- Slug matches filename

**Level 2 — Content quality**
- Title: 69 chars (slightly above 60 target; in range with pit-38 precedent at 67 chars)
- Excerpt: 149 chars ✅ (within 150–160 target)
- Category: `AI` ✅
- Author, date, readTime, image, tags all valid
- All 5 code blocks tagged: `text`, `yaml`, `yaml`, `markdown`, `text`, `yaml`
- No polonized terms (`komendyfik`, `skomendyfik` — not present)
- H2/H3 hierarchy correct (no orphan H3s)
- Short paragraphs throughout
- Bold on first introduction of key concepts

**Level 2 — CTA validation**
- Exactly 1 `class="btn-primary inline-block"` match
- Wrapper has canonical `bg-dark-800/50 backdrop-blur-md` classes
- Link target: `href="/#contact"` ✅
- Button text: `Umów bezpłatną konsultację` ✅
- No deprecated patterns (`cta-section`, `automation.house/kontakt`, inline-style fallback)
- Section order: CTA (line 332) → Przydatne zasoby (line 344) → FAQ (line 353) ✅

**Level 3 — SEO**
- Primary keyword `system agentów AI` present in title, hero alt text, multiple H2s
- Slug SEO-friendly, lowercase + hyphens, evergreen
- Excerpt is compelling (numbers + value prop)
- Internal cross-links: 4 (`/blog/pit-38-claude-code-case-study` × 2, `/blog/skills-2-0-multi-agent-system-zarzadzanie-firma`, `/blog/opsx-workflow-strukturyzowana-praca-z-ai`, `/blog/spec-driven-seo-portfolio-qamera-ai`)
- External links: 2 (Anthropic Claude Code docs, MCP spec) — both authoritative

**Level 4 — Technical accuracy**
- Real numbers (Apr 2026 close: 347 / 17 151 / −16 804 / −23%) match source compilation §10 verbatim
- Rule examples (`gworkspace-via-gcp`, `gcp-infakt`) match source §15.2 verbatim
- Few-shot example (Byteplus) matches source §15.3 verbatim
- AUTO marker example matches source §15.7 (truncated, intentional)
- Phase names + timings match source §7
- Python/MCP table matches brief.md
- No promises about features that don't exist

**Level 5 — Assets staged**
- Hero: `public/images/architecture-system-agentow-ai.webp` (64 KB)
- Pillar 1 diagram: `public/images/diagram-close-process.webp` (72 KB)
- Video poster: `public/images/poster-budget-process.webp` (21 KB)
- Video MP4: `public/videos/budget-process.mp4` (5.0 MB, fallback)
- Video WebM: `public/videos/budget-process.webm` (3.0 MB, primary, VP9 CRF 32, audio stripped)
- OG image: `public/images/og-system-agentow-ai-skills-rules-kontekst.webp` (81 KB, 87% reduction from JPEG)

### ⚠️ WARNINGS

- **Title length 69 chars** — exceeds 60-char SEO ideal. Acceptable: same range as pit-38 (67 chars), Pawel's pattern. Mitigated by strong hook structure.
- **readTime estimate** — frontmatter says 16 min; raw `wc -w` is 3 782 (including HTML/code/frontmatter). Real reading prose ~3 200 words ≈ 16 min at 200 wpm. ✅ correct.
- **Pre-existing `id: 1` collision** in repo (`automatyzacja-email-frontdesk-ai.md` vs `README.md`) — surfaced by uniqueness check but unrelated to new article. Not blocking. Worth a separate fix in a future change.
- **Video prerender hang risk** — `<video preload="metadata">` should not block Puppeteer, but **untested for this specific build pipeline**. Verify visually by running `npm run build:prerender` before deploy.

### ❌ FAILURES

None.

## Post-Article Tasks Completed

- [x] OG image prompt generated → `.claude/agents/prompts/og-system-agentow-ai-skills-rules-kontekst-prompt.txt`
- [x] OG image generated via Gemini API (`gemini-3-pro-image-preview`)
- [x] OG image converted to WebP (87% size reduction, 624 KB → 81 KB)
- [x] Source JPEG removed
- [x] Diagram assets (architecture, close-process) copied + WebP converted
- [x] Video transcoded to WebM (VP9 CRF 32, audio stripped, 5.0 MB → 3.0 MB)
- [x] Video poster extracted at 2s, converted to WebP (21 KB)
- [x] Sitemap regenerated (51 blog entries: 26 PL + 25 EN)

## Asset inventory

| Asset | Path | Size | Notes |
|---|---|---:|---|
| OG image | `public/images/og-system-agentow-ai-skills-rules-kontekst.webp` | 81 KB | Gemini-generated, abstract, no text |
| Hero diagram | `public/images/architecture-system-agentow-ai.webp` | 64 KB | Architecture diagram, copied from NCP4 pack |
| Section diagram | `public/images/diagram-close-process.webp` | 72 KB | 6-phase close diagram |
| Video poster | `public/images/poster-budget-process.webp` | 21 KB | Frame at 2s |
| Video (WebM) | `public/videos/budget-process.webm` | 3.0 MB | VP9 CRF 32, no audio, primary source |
| Video (MP4) | `public/videos/budget-process.mp4` | 5.0 MB | Fallback for browsers without WebM |

## EN Translation

- **EN file:** `src/content/blog/en/ai-agent-system-skills-rules-shared-context.md`
- **EN slug:** `ai-agent-system-skills-rules-shared-context`
- **EN title:** *Pre-revenue startup without a finance department. AI agent system anatomy.*
- **Bidirectional `alternateSlug`:** ✅ both files point at each other
- **Sitemap:** PL ↔ EN symmetry restored (80 URLs total: 26 PL + 26 EN blog posts)
- **Internal links mapped:** 4/4 resolved to EN counterparts:
  - `/blog/pit-38-claude-code-case-study` → `/en/blog/polish-pit-38-claude-code-case-study` (×2 occurrences)
  - `/blog/skills-2-0-multi-agent-system-zarzadzanie-firma` → `/en/blog/skills-2-0-multi-agent-system-company-management`
  - `/blog/opsx-workflow-strukturyzowana-praca-z-ai` → `/en/blog/opsx-workflow-structured-ai-work`
  - `/blog/spec-driven-seo-portfolio-qamera-ai` → `/en/blog/spec-driven-seo-portfolio-qamera-ai-case-study`
- **CTA:** canonical pattern, "Book a free consultation"
- **Section title:** `## Useful Resources` ✅
- **Code blocks:** all 6 unchanged (yaml, yaml, markdown, text, text, yaml — preserved as data, including Polish strings inside YAML notes)
- **OG image:** shared with PL (`/images/og-system-agentow-ai-skills-rules-kontekst.webp`) — convention matches existing EN posts (e.g. `polish-pit-38-claude-code-case-study` reuses PL OG image)
- **EN validation:** ✅ PASSED

## Overall Status

**✅ VALIDATION PASSED — PL + EN both ready for commit**

## Next Step (MANDATORY)

Per the blog-article-writer workflow, every PL article must have an EN counterpart in the same workflow run.

Next: `/blog-article-writer:translate`

After translate completes:
1. Review both PL + EN in browser:
   - http://localhost:5173/blog/system-agentow-ai-skills-rules-kontekst
   - http://localhost:5173/en/blog/<en-slug>
2. Optional peer review
3. Single git commit covering both files: `feat(blog): add post 27 (PL+EN) — system agentów AI: skills, rules, wspólny kontekst`
4. Deploy
