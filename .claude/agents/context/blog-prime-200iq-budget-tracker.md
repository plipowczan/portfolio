# Blog Prime — 200IQ LABS Budget Tracker (NCP4 case study)

> **Generated:** 2026-05-09
> **Phase:** PRIME (research)
> **Next:** `/blog-article-writer:plan "<chosen angle>"`

---

## 1. Source materials analyzed

### Primary
- **`docs/blog/2026-05-08-system-finansow-200iq-blog-material.md`** — deep technical compilation (697 lines): system philosophy, 5 design principles, file structure, 3-layer separation (P&L / cash / financing), categories, budget plan, 6-phase close workflow, learning loop, caps, real April 2026 numbers, 7 YAML code samples (`budget-2026.yaml`, `rules.yaml`, `examples.yaml`, `caps.yaml`, `accrued-liabilities.yaml`, `cash-flow-2026.yaml`, `_dashboard.md`). Lists **6 candidate angles** (A–F) at section 13.
- **`docs/blog/ncp4-blog-pack/`** — talk-derived pack:
  - `04-presentation/brief.md` — full talk architecture with narrative beats, Backstory hook ("1 maja 2026 — zero, 3 maja działający system")
  - `04-presentation/draft.md` — 33 Marp slides (talk delivered 2026-05-07 at NoCode Poland #4, IKM Gdańsk)
  - `01-skill/SKILL.md` — `finances` skill definition (not yet read in detail; available)
  - `02-openspec/` — 4 capabilities (budget-plan, cash-flow, monthly-close, reporting)
  - `03-context/` — real `rules.yaml`, `_dashboard.md`, `_runway.md`, `_alerts.md`, monthly narrative
  - `04-presentation/assets/` — flagship video (`budget-process.mp4`), excalidraw diagrams (`finances-close-process.png`, `architecture.png`), 3 screenshots (monthly, dashboard, rules)
  - `05-tools/` — Stripe + Revolut Python wrappers

### Sensitive (excluded by source pack, do NOT include)
- raw `transactions/2026-*.yaml`, `accrued-liabilities.yaml` per-payee, `.env`, `privatecert.pem`

---

## 2. Key topics identified

### Core concepts
1. **Manual first, automate after pain** — first 2-3 closes by hand before scripting; without it you don't know what to automate
2. **Hybrid classification** — rules-first (deterministic) + LLM fallback (with few-shot examples); every human correction in REVIEW can become a rule via `[r]ule` option → system **converges to determinism**
3. **3-layer separation** — P&L (accrual) vs cash flow vs financing (equity, shareholder loans). Mixing is the #1 illusion in pre-revenue
4. **Plan as living document** — drift > 30% = revision required; not "plan once, hold the line"
5. **Mandatory narrative blocks close** — PHASE 5 COMMIT requires 3 sections (surprises / decisions / next-month plan) in `monthly/<YYYY-MM>.md`. Empty narrative = close cannot complete. Reflection is part of the process, not optional.
6. **Idempotent regeneration** — `<!-- AUTO:START -->` / `<!-- AUTO:END -->` markers protect manual notes from being overwritten
7. **Single source of truth via cross-references** — `opex/saas` plan = computed from `tech-stack/_dashboard.md`, not duplicated
8. **Caps with tolerance band** — variable categories only; post-close, not mid-month polling
9. **OpenSpec before code** — 4 capability specs preceded implementation
10. **Hybrid Python/MCP architecture** — *"Python skrypt zawsze, kiedy możemy. MCP, kiedy musimy."* Stripe/Revolut/Airtable = Python wrappers. infakt = MCP (forced). Qamera = MCP (we expose it)

### 6 candidate angles (from source §13)
- **A.** "Manual first, automate after pain" — building a finance system pre-revenue when you don't yet know what to automate
- **B.** "Hybrid classification: rules + LLM, convergence to determinism" — architectural alternative to pure-LLM and pure-rules
- **C.** "P&L vs cash flow vs financing — three separate ledgers" — the pre-revenue illusion trap, with concrete numbers
- **D.** "Plan as a living document" — drift > 30% rule, retroactive corrections with `note:` audit trail
- **E.** "Mandatory management narrative" — why reflection must block close
- **F.** "Single source of truth for SaaS — cross-references over duplication"

### Killer angle (talk-derived, hook-strongest)
**"2 dni od zera do działającego systemu finansowego"** — Event Driven Development™ where the event was the talk itself. Combines all the above into a single case study with real numbers from April 2026 close.

---

## 3. Real numbers ready to use

**Close April 2026 (first manual close, executed 2026-05-04):**

| Linia | Actual | Plan | Δ |
|---|---:|---:|---:|
| Revenue | 347 PLN | 598 PLN | −42% |
| Costs | 17 151 PLN | 14 242 PLN | +20% |
| EBITDA | −16 804 PLN | −13 644 PLN | −23% variance |
| `cogs/ai-generation` | 1 709 | 700 | +144% 🔴 |
| `opex/marketing` | 2 996 | 1 500 | +100% 🔴 |
| `opex/saas` | 2 112 | 1 633 | +29% 🟡 |

**Cash position:**
- Cumulative shareholder loans (Paweł, Feb–Apr): **74 300 PLN**
- Confirmed June equity issuance: **+100 000 PLN**
- Accrued liabilities (UoD Feb–Apr, payout May): **−24 000 PLN**
- End-April cash: **~+47 540 PLN**
- Run-rate burn: ~14–14.5k PLN/mc with UoD
- Runway after issuance: ~5–7 months

**Plan break-even target:** September 2026 (revenue 12 184 vs costs 12 842, EBITDA −658)

**Three decisions from the close:**
1. GCP +144% → plan was wrong (700), real run-rate 1000–1600. Plan May–Dec corrected upward to 1500–1800. Conscious decision NOT to optimize (some is content marketing).
2. Cursor billed 4×/mc (716 vs plan 217) → planned migration **Cursor → Claude** (predictable ~90 EUR/mc cap)
3. Meta Ads off from May → strategy was wrong; new direction TBD

**Learning loop:** first close generated **30+ rules from zero** in `rules.yaml`. Three rule patterns surfaced:
- by `memo` (Byteplus, Cursor, Meta Pay)
- by inFakt invoice prefix + `amount_range` (same vendor, two categories — `GCPLD` 200–500 = Workspace `opex/saas`, >500 = compute `cogs/ai-generation`)
- by reseller pattern (Paddle 24 EUR ≈ 100 PLN = n8n; other amounts → REVIEW)

---

## 4. Target audience profile

Primary: **technical founders / solo operators / small startup teams** who:
- run pre-revenue or early-revenue companies
- are comfortable with markdown, YAML, git, terminal
- already use AI agents (Claude Code, Cursor) for engineering and want to extend to ops
- struggle with the gap between formal accounting (compliance) and management accounting (decisions)
- have heard of "AI agents replacing departments" and are skeptical/curious

Secondary: **citizen developers / no-code practitioners** (NCP4 audience) who want to understand the architecture even if they won't build it themselves — leave with principles, not setup.

Knowledge level: assume reader knows P&L vs cash flow at a conceptual level but not necessarily accrual mechanics; assume reader knows what an LLM is but not necessarily what "few-shot examples" are.

---

## 5. Unique angle / value proposition

The article is **not** "another AI agent demo". The differentiator is the **convergence-to-determinism** architecture: a system that starts probabilistic (LLM classification) and **freezes its own learnings into rules**, with audit trail. Combined with:

- **real numbers from a real company** (Pawel's 200IQ LABS, not a toy example)
- **anti-patterns called out by name** (over-engineering early, mixing P&L with financing, automating before manual close, treating plan as sacred)
- **a 2-day timeline** that makes it credible (not "we built this over 6 months")
- **opinionated philosophy** — manual first, plan = living document, narrative blocks close

This sets the article apart from generic "I built an agent that does X" content. The depth and the willingness to publish actual EBITDA variance is the moat.

---

## 6. Pawel's writing style — observations from recent posts

**Read-through:** `pit-38-claude-code-case-study.md` (post #26, 14 min read, ~3500 words), plus `SKILL.md` style guide.

**Voice patterns:**
- First person, conversational opening ("Dziś jest 29 kwietnia 2026...")
- Concrete numbers in the **first paragraph** (5 430 transakcji, 174 895 PLN, 51,5 godziny przed deadlinem) — sets stakes immediately
- Self-deprecating asides ("Wolę wdrażać PR-y na produkcję niż zajmować się liczbami") — humanizes
- Direct, declarative sentence structure. Few hedges.
- Polish base + English technical terms in italics or just inline (LLM, accrual, REVIEW, run-rate, hybrid, run-rate)
- **Bold on key numbers and pivots**, not on whole sentences
- One-line emphatic punchlines as paragraph-of-one ("Działało.", "To zmienia stake'a artykułu.")

**Structural patterns:**
- Hook = concrete situation + numbers (not abstract statement)
- "Architektura" section comes early — diagram + naming convention
- Sub-sections numbered like list items even when prose ("### 1. Bufor...", "### 2. PIT-38 wersja...") — gives skim-readability
- "Czego nie polecam" / "Co nie zadziałało" sections — credibility through honest limitations
- CTA HTML block (Tailwind classes) BEFORE `## Przydatne zasoby` and `## FAQ`
- 4–6 FAQ items at end, each in `<details open>` accordion, 2–4 sentence answers, key info first
- "Przydatne zasoby" with 4–6 external links + cross-links to other portfolio blog posts
- One inline diagram (WebP) at the architecture moment

**Length norm:** 14 min read = roughly the high end. This article likely lands 12–16 min.

**FAQ pattern:** questions are full natural sentences (10–25 words), conversational, not keyword stuffed. Answers lead with the answer, then context.

**Title format:** results-first, dramatic ("Miałem 3 dni do PIT-38 bez księgowej. Wystarczyły 2 godziny."). Not "How to do X" — "I had X, here's what happened".

---

## 7. Technical concepts to cover (and accuracy notes)

No external libraries that need Context7 verification — the system is built on YAML + markdown + Python wrappers + Claude Code skills. References to:
- **Anthropic Claude API / Claude Code** — well-known, no verification needed
- **OpenSpec** — internal/conventional spec format, no public lib version
- **Stripe API, Revolut Business API, inFakt API** — vendor-stable, no version pinning needed in prose
- **MCP (Model Context Protocol)** — Anthropic-defined, generally stable

Accrual accounting and Polish tax/finance terminology should match what's in the source compilation (UoD, accrued liabilities, EBITDA, accrual basis vs cash basis, equity issuance, shareholder loan). Source material is authoritative — written by Pawel.

**Numbers must match source compilation exactly** — don't paraphrase or round inconsistently. Suggest reusing the table at §10 of the source compilation verbatim.

---

## 8. Existing article style patterns to mirror

From `pit-38-claude-code-case-study.md` (the closest stylistic precedent — same author, same type of "agent did expert work" case study):

- **Opening:** date stamp + concrete situation + numbers
- **Section after hook:** "Zwykle X robi Y. Teraz wyjątkowo zrobiłem to inaczej." — sets stakes
- **Architecture section:** code block of directory tree + 1-line per directory
- **Body:** 5–7 numbered "things I didn't expect" / "lessons" with H3 headers
- **Honest limitations:** "Czego nie polecam" + "kiedy LLM nie wystarcza"
- **Disclaimer about data:** parallel to "wrzuciłeś dane finansowe do LLM" — for finance audience this matters
- **Time-sensitive deadline framing** doesn't apply here (no 30.04 deadline) — replace with "2 dni od zera" framing or "what next month's close will look like"
- **CTA:** consultation offer, contextualized to topic (e.g., "Masz pre-revenue spółkę i myślisz o systemie zarządczym?")

---

## 9. Code examples to include

Recommended (all available verbatim in source compilation §15):

1. **Directory tree** — the `context/finances/` structure (top of §3) — sets the architecture
2. **`rules.yaml` with two `GCPLD` rules differing by `amount_range`** — the killer "same vendor, two categories" example (§15.2)
3. **`budget-2026.yaml` excerpt** with `note:` field showing retroactive correction (§15.1) — illustrates living-document philosophy
4. **`<!-- AUTO:START -->` markers** in `_dashboard.md` (§15.7) — illustrates idempotent regeneration
5. *(optional)* `examples.yaml` few-shot — illustrates rules+LLM hybrid (§15.3)
6. *(optional)* `caps.yaml` with tolerance band (§15.4) — illustrates cap monitoring philosophy

If article goes 6 angles deep → include 1, 2, 3, 4. If article focuses on hybrid classification (angle B) → 1, 2, 3, 5. If article focuses on 3-layer separation (angle C) → 1, 3, plus `cash-flow-2026.yaml` financing block.

---

## 10. Diagrams / images needed

Source pack has assets ready in `docs/blog/ncp4-blog-pack/04-presentation/assets/`:
- `architecture.png` (+ `.excalidraw`) — main agent + skille + Python tools + MCP
- `finances-close-process.png` (+ `.excalidraw`) — 6-phase close diagram
- `screenshot-monthly-2026-04.png` — narrative screenshot
- `screenshot-dashboard.png` — dashboard with red dots
- `screenshot-rules-sample.png` — rules.yaml snippet

For the blog article we will likely create a **funnel-style flow diagram** matching the pattern from PIT-38 post (single WebP, Polish caption). The 6-phase close diagram is the strongest candidate to reuse/redraw.

OG image: needs to be generated separately during the `:execute` phase (1200×630 WebP, brand-compliant).

---

## 11. Frontmatter targets

- `id: 27` (next after pit-38 = 26)
- `slug:` TBD per chosen angle. Candidates:
  - `200iq-budget-tracker-2-dni-od-zera` (case-study-led)
  - `hybrydowa-klasyfikacja-rules-llm-finanse` (angle B)
  - `system-finansowy-pre-revenue-startup` (angle A, broadest)
  - `accrual-vs-cash-flow-pre-revenue-pulapka` (angle C)
- `category: AI` or `category: Automatyzacja` (lean toward `AI` — system is agent-driven; pit-38 used `AI`)
- `date: 2026-05-09` (today)
- `readTime: 14 min` (estimate; finalize after draft)
- `image: /images/og-<slug>.webp`
- `tags:` likely include `Claude Code`, `AI`, `Workflow`, `Case Study`, `Automatyzacja`, plus topic-specific (`Finanse`, `OpenSpec`, `Pre-revenue`, `200IQ LABS`)
- `lang: pl`
- `alternateSlug:` **leave OUT initially** — EN translation is a separate deliberate step per `src/content/blog/AGENTS.md`. Add only after EN file exists with reciprocal pointer.

---

## 12. Locked angle (confirmed by user 2026-05-09)

**Meta angle: architecting agent systems, with the 200IQ budget tracker as the running case study.**

The article is structured around **three pillars**, each grounded in the architecture diagram (`docs/blog/ncp4-blog-pack/04-presentation/assets/architecture.png`):

### Pillar 1 — Automating processes via skills
Skills are the unit that turns an ad-hoc workflow into a repeatable command. Examples:
- `/finances close YYYY-MM` — 6-phase monthly close as one skill (PULL → CLASSIFY → REVIEW → ACCRUALS → COMMIT → REGENERATE)
- `/ingest` — input classification + routing (mentioned briefly to show the pattern generalizes)
- Skill = process + persona + tools binding. Each subagent in the diagram (CFO, Marketing, Legal, Tax Advisor, Business Consultant) is a skill+persona combo with a scoped `context/...` reference.

### Pillar 2 — Engineering determinism into the workflow
The rules+LLM hybrid is the showcase. Sub-points:
- **Cold start problem:** pure rules require manual seeding, pure LLM is non-audytowalny and probabilistyczny
- **Hybrid:** rules-first deterministic match → LLM fallback with few-shot examples
- **Learning loop:** REVIEW phase `[a]ccept / [c]hange / [r]ule / [s]kip` — `[r]ule` freezes LLM's guess into a deterministic rule. First close: 0 → 30+ rules
- **Killer example:** two `GCPLD` rules differing only by `amount_range` (200–500 → Workspace `opex/saas`, >500 → compute `cogs/ai-generation`). Same vendor, two categories, one deterministic rule.
- **Idempotent regeneration** as a related determinism mechanism: `<!-- AUTO:START/END -->` markers protect manual notes from auto-regenerated sections

### Pillar 3 — Shared substrate: context + tools + skills
The architecture diagram's bottom layer is the differentiator. Without it, "agents" are isolated chat windows.
- **CLAUDE.md** — project instructions loaded every conversation
- **MEMORY.md** — persistent across conversations (auto-memory)
- **`context/`** — structured knowledge base (`context/finances/`, `context/qamera/`, `context/clients/`, `context/projects/`)
- **Python tools (default)** — `tools/stripe/*.py`, `tools/revolut/*.py`, `tools/airtable/*.py`. Reasons: token-efficient, deterministic, trivial to author ("agent, generate me a wrapper for X")
- **External MCP (only when forced or when WE expose)** — inFakt MCP (forced; API blocked when accounting office is active). Qamera MCP (we expose it for outside agents).
- **Rule:** *Python skrypt zawsze, kiedy możemy. MCP, kiedy musimy.*

### Article spine
Each pillar opens with a reference to the architecture diagram, then dives into the concrete example from the budget tracker. Real April 2026 numbers (revenue 347, costs 17 151, EBITDA −16 804) appear in the case-study sidebar — they're proof, not the topic.

### Length target
**14–16 min read**, ~3000–3500 words. Comparable to pit-38 post in scope.

### Slug candidate
`agentowe-systemy-skills-rules-kontekst` or shorter `architektura-agentow-ai-skills-determinizm` — to be finalized in `:plan`.

### Diagram strategy
- **Hero image:** the architecture diagram itself (already exists at `docs/blog/ncp4-blog-pack/04-presentation/assets/architecture.png`) — copy to `public/images/`, optionally redraw cleaner version
- **Secondary diagram:** 6-phase close diagram (`finances-close-process.png`) for Pillar 1 example
- **Code samples:** `rules.yaml` (Pillar 2), directory tree of `context/finances/` (Pillar 3)

### Embedded video — `budget-process.mp4`

The full close-recording from the NCP4 talk (5.0 MB, source: `docs/blog/ncp4-blog-pack/04-presentation/assets/budget-process.mp4`) is a **strong "show, don't tell" anchor** for Pillar 1 (skills automate processes). The blog's markdown renderer uses `react-markdown` + `rehype-raw`, so raw `<video>` tags pass through.

**Placement:** in Pillar 1, right after the 6-phase close description and the `finances-close-process.png` diagram. Frame: *"Tak wygląda jeden close uruchomiony jako `/finances close 2026-04` — 6-8 minut, 6 faz, 2 iteracje QA zostają w nagraniu jako meta-przekaz: można korygować rozmową z agentem."*

**File deployment:**
- copy `docs/blog/ncp4-blog-pack/04-presentation/assets/budget-process.mp4` → `public/videos/budget-process.webm` (transcode to WebM/VP9 for size — likely 2–3 MB) and `public/videos/budget-process.mp4` (keep MP4 as fallback)
- new directory `public/videos/` (does not yet exist; `public/images/` is the only media folder today)

**Markup pattern (markdown):**
```html
<video controls preload="metadata" poster="/images/og-<slug>.webp" class="w-full rounded-lg my-6">
  <source src="/videos/budget-process.webm" type="video/webm" />
  <source src="/videos/budget-process.mp4" type="video/mp4" />
  Twoja przeglądarka nie obsługuje wideo HTML5. <a href="/videos/budget-process.mp4">Pobierz wideo</a>.
</video>
<p class="text-sm text-gray-400 text-center -mt-4 mb-8">Pełny close kwietnia 2026 — `/finances close 2026-04`. 6 faz, ~7 min. 2 iteracje QA zostają w nagraniu (meta-przekaz: korekta rozmową z agentem).</p>
```

**Caveats to handle in `:plan`:**
- **Prerendering:** the Puppeteer prerenderer must not block on `<video>` — `preload="metadata"` keeps the network footprint small for crawlers. To verify in `:validate`.
- **Lazy loading:** consider `<video preload="none">` if the video is below-the-fold and we want a lighter LCP. Trade-off: user has to click play before seeing thumbnail.
- **Poster:** reuse the OG image as a poster, or generate a dedicated frame (first frame of the video).
- **Fallback for prerendered HTML:** add a clear `<a href>` so search engines still see a clickable link to the asset.
- **Bandwidth:** 5 MB MP4 served from Vercel egress — acceptable, but transcoding to WebM (likely <3 MB) is worthwhile if `ffmpeg` is available locally.
- **CLS risk:** set explicit aspect ratio via Tailwind (`aspect-video`) on a wrapper div if the video element doesn't expose intrinsic dimensions during prerender.

### Code examples needed (refined from §9)
1. Directory tree showing `context/`, `skills/`, `tools/` separation
2. `rules.yaml` — both `GCPLD` rules side by side
3. `examples.yaml` — one few-shot example with `reasoning` field
4. `_dashboard.md` snippet showing AUTO markers
5. *(optional)* a Python tool stub from `tools/stripe/get_revenue.py` to anchor "Python > MCP" point

---

## 13. Success criteria — PRIME phase

- [x] All source materials identified and read (compilation + brief + draft + skill SKILL.md + recent precedent post)
- [x] Pawel's writing style observed (pit-38 article + skill style guide)
- [x] Portfolio copywriting guidelines reviewed (front matter, FAQ, CTA, length, structure)
- [x] Key topics extracted (6 candidate angles + cross-cutting concepts)
- [x] Real numbers cataloged with source references
- [x] Code examples mapped to article sections
- [x] Frontmatter draft prepared (id, slug candidates, tags)
- [x] Open decisions surfaced for `:plan`

**Ready for:** `/blog-article-writer:plan "<chosen angle and slug>"`
