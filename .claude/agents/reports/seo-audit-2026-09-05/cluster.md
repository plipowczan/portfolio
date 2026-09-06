# Semantic cluster analysis — pawel.lipowczan.pl blog (PL + EN)

Method: full-text/frontmatter read of all 30 PL posts (`src/content/blog/*.md`) and
their 30 EN counterparts (`src/content/blog/en/*.md`), plus targeted SERP checks
(WebSearch) for the highest-stakes head terms to calibrate winnability. Internal
link graph built by grepping `/blog/` and `/en/blog/` references across every
post — this is exact, not estimated. Clustering is content/entity-based
(topic, tool, intent) rather than the site's current three-category taxonomy
(AI / Automatyzacja / No-Code / Code), which mixes unrelated intents under one
label.

SERP checks run: "Claude Code tips and tricks productivity", "Claude Code
weaknesses limitations", "building a second brain with AI knowledge base",
"Zapier vs Make vs n8n comparison", "Claude Code po polsku poradnik",
"agentic engineering multi-agent business system case study". Findings below
cite these where relevant; the rest of the architecture (cluster membership,
cannibalization pairs) is derived from direct content overlap, which is the
same signal SERP overlap approximates and is more reliable at this content
scale (30 posts, thin PL search volume) than trying to force a 10-blue-links
comparison for every pair.

---

## Cluster A — Claude Code / AI coding-assistant practice (8 posts)

Broadest cluster on the site by post count and by how much of the "personal
brand" content sits here. All are practitioner-level: tips, weaknesses, case
studies of using Claude Code (or Cursor) to do a specific job.

| Post | Angle |
|---|---|
| `5-technik-pracy-z-claude-code` | 5 general techniques |
| `5-repozytoriow-github-claude-code` | 5 GitHub repos worth using |
| `slabe-strony-claude-code` | 5 weaknesses + mitigations |
| `15-cursor-hacks-produktywnosc-ai` | 15 Cursor hacks (adjacent tool, same intent: "get more out of my AI coding assistant") |
| `opsx-workflow-strukturyzowana-praca-z-ai` | structured workflow methodology (OpenSpec) |
| `kodowanie-w-2025-ai-portfolio` | case study: building this portfolio with AI |
| `spec-driven-seo-portfolio-qamera-ai` | case study: spec-driven SEO on two projects |
| `pit-38-claude-code-case-study` | case study: tax filing with Claude Code |

**Pillar: MISSING.** No post answers "what is Claude Code and how do I get
good at it" as a standalone hub. `5-technik-pracy-z-claude-code` currently
absorbs that role by default (8 incoming links, the second-highest in the
corpus) but it's a spoke-shaped post (5 numbered tips, 14 min read) wearing a
pillar's traffic, not a 2500-4000 word hub that sections out to the other
seven. This is the single highest-value structural gap on the site: it's the
cluster the site's actual expertise lives in, and it has no page built to
rank for the head term and route everything else.

**SERP reality check:** "Claude Code tips and tricks" is contested — Anthropic's
own docs, Builder.io, a 1500-hour-usage Substack, and a 45+-tip GitHub repo all
outrank a solo consultancy blog on the English head term. Polish is thinner but
not empty: `blog.jsystems.pl` runs a 29-lesson free Claude Code course,
`claudecodelab.pl` sells a 16h workshop, `vita.edu.pl` has a full PL tutorial.
A PL pillar can still win on specificity (business-process angle, not
developer-tooling angle) but "Claude Code — kompletny przewodnik" as a bare
head term is not a realistic PL win either.

**Recommended pillar shape:** not a generic "Claude Code guide" (loses to
docs/tutorials by default) but **"Jak używam Claude Code do prowadzenia
biznesu, nie tylko do kodu"** — the differentiated angle no competitor above
is running, and the one this corpus already has case-study proof for (PIT-38,
portfolio SEO, agent systems in cluster B).

### Cannibalization inside Cluster A

- **`5-technik-pracy-z-claude-code` vs `slabe-strony-claude-code` vs
  `5-repozytoriow-github-claude-code`** — all three are "how to get more out
  of Claude Code" listicles at 11-17 min read, same primary entity, same
  intent (informational, practitioner). They already cross-link each other
  (confirmed in the link graph) so they aren't actively fighting for the same
  SERP slot today, but they are the same query cluster and will compete once
  a pillar exists above them, because Google will have three near-duplicate
  candidates for "Claude Code sposoby na" if none of them is marked
  canonical-for-the-topic. **Recommendation: differentiate, don't merge.**
  Keep all three — they cover distinct sub-intents (general techniques /
  known limitations / third-party tooling) — but each needs a tighter,
  non-overlapping title once the pillar exists, and the pillar becomes the
  thing that ranks for the bare head term while these three own their
  specific angles.
- **`kodowanie-w-2025-ai-portfolio` vs `spec-driven-seo-portfolio-qamera-ai`**
  — both are case studies about building/improving *this same portfolio* with
  AI. Real overlap risk: same site, same tool, overlapping timeframe (Dec
  2025 vs Apr 2026). **Recommendation: differentiate explicitly** — the first
  should stay "can AI build a portfolio from scratch" (build narrative), the
  second should stay "spec-driven SEO iteration" (optimization narrative).
  Cross-link them as a before/after pair rather than letting them read as two
  versions of the same story.
- **`15-cursor-hacks-produktywnosc-ai` vs the Claude Code trio** — different
  tool (Cursor vs Claude Code), same intent shape. Low cannibalization risk
  today (distinct entity in the query), but it is the most isolated post in
  the cluster (1 incoming link) and reads as an orphan of a different product
  era. **Leave alone editorially, fix by linking**, not by merging or cutting.

---

## Cluster B — Agentic engineering / multi-agent business systems (6 posts)

| Post | Angle |
|---|---|
| `software-3-0-agentic-engineering` | Karpathy's Software 3.0 framing, philosophy/taxonomy |
| `system-agentow-ai-skills-rules-kontekst` | 200IQ LABS case study: 5 agent roles replacing a team |
| `srodowisko-agentowe-ai-dwie-firmy` | "AI OS" across two companies, 8 agents |
| `skills-2-0-multi-agent-system-zarzadzanie-firma` | Skills 2.0 architecture for company management |
| `openclaw-bezpieczenstwo-agentow-ai` | agent security lessons from the OpenClaw incident |
| `trendy-ai-2026-od-eksperymentow-do-operacjonalizacji` | 2026 industry trends, agentic AI section |

**Pillar: MISSING**, but this cluster is closer to having one than it looks.
`software-3-0-agentic-engineering` is the conceptual/framework post (Karpathy's
three paradigms) that the other four architecture posts implicitly build on,
and the link graph already shows it acting as a soft hub for cluster C
(`llm-knowledge-base-brain-karpathy`, `vibe-coding-przewodnik`). But it doesn't
itself link to the three case-study posts (`system-agentow`, `srodowisko-agentowe`,
`skills-2-0`) and has **zero incoming links** — nothing points a reader from the
case studies back up to the framework. It's positioned as a spoke, functions
like a pillar, and gets none of a pillar's link equity.

**Recommendation:** promote `software-3-0-agentic-engineering` to the cluster
pillar with a light rewrite (add sections that explicitly map to each of the
three case studies + the security post), and add the missing mandatory
spoke→pillar links from all four other posts.

### Cannibalization inside Cluster B

- **`system-agentow-ai-skills-rules-kontekst` vs `srodowisko-agentowe-ai-dwie-firmy`
  vs `skills-2-0-multi-agent-system-zarzadzanie-firma`** — this is the real risk
  the brief flagged. All three describe the same underlying system (Skills +
  rules + shared context, multi-agent, replacing specialist roles) from
  slightly different cuts: one company (200IQ LABS) vs two companies vs the
  "Skills 2.0" version of the architecture itself. Chronologically they read
  as one evolving story (Mar → May → 2026 dates), which is good practice
  content but bad for a single query — a search for "system agentów AI do
  zarządzania firmą" has three legitimate, competing landing candidates from
  the same domain. **Recommendation: consolidate the narrative, not the
  posts.** Don't merge (each has distinct case-study value and already
  cross-links reasonably: 4-5 outgoing links each). Instead, make the
  chronology explicit in the copy ("this is v1 / this is the two-company
  scale-up / this is the reusable architecture") so Google and the reader see
  a progression, not three answers to one question. Retitle
  `skills-2-0-multi-agent-system-zarzadzanie-firma` to foreground "architektura"
  over "zarządzanie firmą" so it stops competing head-on with `srodowisko-
  agentowe-ai-dwie-firmy` for the generic query.
- **`openclaw-bezpieczenstwo-agentow-ai`** does not cannibalize anything — it's
  the only security-angle post on the whole site and should stay differentiated
  and get more, not fewer, links from the other four.
- **`trendy-ai-2026-...`** is thin in this cluster (one subsection on agentic
  AI trends) and has zero incoming links. It's closer to a cross-cluster
  connector post than a true Cluster B member — treat it as the "state of the
  industry" piece that links out to A, B, and D, not as competing content.

**SERP reality check:** "agentic engineering multi-agent business system case
study" in English is owned by IBM, arxiv papers, and enterprise vendors
(Infor, multimodal.dev) — not winnable for a personal domain at the head term.
The Polish-language, founder-scale angle ("jak mały zespół zbudował system
agentów zamiast zatrudniać dział") has essentially no direct competition in
the searches run for this report — this is the most defensible long-tail
position on the site.

---

## Cluster C — Knowledge base / second brain / RAG (4 posts + course)

| Post | Angle |
|---|---|
| `second-brain-obsidian-claude-code-skills` | Obsidian + Claude Code + Skills, general second-brain setup |
| `llm-knowledge-base-brain-karpathy` | LLM Wiki concept (Karpathy), formalizing the system |
| `okf-standard-przenosnosc-bazy-wiedzy-ai` | discovering the second brain matches Google's OKF standard |
| `rag-ragowi-nierowny` | RAG isn't one technique — matching retrieval mechanism to material |

**Pillar: EXISTS, but off-blog and under-linked.** `/llm-wiki/kurs` is an
8-lesson course that is exactly the pillar this cluster needs — more complete
than any single blog post could be — but it lives outside `src/content/blog/`
and only 3 of the cluster's 4 posts even mention "llm-wiki" as a term
(`llm-knowledge-base-brain-karpathy`, `rag-ragowi-nierowny`,
`slabe-strony-claude-code`), and none of the four confirms linking to
`/llm-wiki/kurs` itself in the grep (the mentions found are prose references
to the *concept*, not confirmed hyperlinks to the course route). This is a
distinct structural gap from Cluster A/B's "no pillar exists" — here the hub
exists and simply isn't wired into the cluster's internal links.

This cluster is otherwise the best-linked group on the site:
`second-brain-obsidian-claude-code-skills` (8 incoming) and
`llm-knowledge-base-brain-karpathy` (5 incoming) are the two best-connected
posts in the entire 30-post corpus.

**No cannibalization** — the four posts have genuinely distinct angles
(setup / concept-naming / standards-compliance / retrieval-mechanism choice)
and the SERP check for "building a second brain with AI knowledge base"
confirms the market default (MindStudio, vector-embedding tutorials) is a
different, more generic take than this site's file-based, agent-governed
angle — good differentiation, not overlap.

**Action:** add explicit `/llm-wiki/kurs` links from all four posts (mandatory
spoke→pillar, even though the "pillar" is a course, not a post), and add a
"start here" course→post backlink for at least the two best-fitting lessons.

---

## Cluster D — Business process automation / no-code (9 posts)

| Post | Angle |
|---|---|
| `zapier-vs-make-vs-n8n-wybor-narzedzia` | tool comparison — natural pillar |
| `no-code-lead-generation` | n8n + Airtable lead-gen system |
| `airtable-vs-excel-migracja` | Airtable vs Excel migration |
| `automatyzacja-email-frontdesk-ai` | Make + OpenAI email automation |
| `el-padre-automatyzacja-ofert-ai` | case study: event agency offer automation |
| `chatboty-ai-od-koncepcji-do-wdrozenia` | VAPI/n8n/RAG chatbot build guide |
| `dane-jako-paliwo-biznesu` | data-to-value narrative, no-code + agents |
| `kazda-firma-dziala-nieoptymalnie` | process-mapping thesis, Infoshare talk |
| `hackathon-hacknation-analiza-doswiadczen` | hackathon retrospective, GovTech |

**Pillar: EXISTS but completely disconnected.** `zapier-vs-make-vs-n8n-wybor-
narzedzia` is the right pillar shape (16 min, broad tool comparison,
highest-intent commercial query in the cluster) — but the link graph shows
**zero outgoing and zero incoming `/blog/` links for every single post in this
cluster.** This is the only cluster on the site with no internal cross-linking
at all — nine posts, thematically coherent, structurally invisible to each
other and to the rest of the site. This is a bigger and cheaper fix than
Cluster A's missing pillar: the content already exists, nothing needs to be
written, only linked.

**No cannibalization** — each post targets a distinct tool, use case, or
case study; overlap between `no-code-lead-generation` and
`automatyzacja-email-frontdesk-ai` (both n8n/Make + business process) is
angle-level, not query-level (lead gen vs inbound email triage are different
searches).

**SERP reality check:** "Zapier vs Make vs n8n" in English is owned by the
vendors themselves plus comparison-aggregator sites (Parseur, Contabo,
digidop) — not winnable at the head term in English. In Polish this comparison
has materially less saturation; combined with this being a genuinely
commercial-intent query (tool selection, not "what is"), this is a plausible
PL commercial-intent win once the cluster is linked up.

---

## Cluster E — AI-assisted creative/design tooling (3 posts)

| Post | Angle |
|---|---|
| `vibe-coding-przewodnik` | vibe coding for UI without design skill |
| `animacje-apple-ai-cursor` | Apple-style scroll animations via AI |
| `remotion-explainer-videos-ai` | Remotion + Claude for explainer video |

**Pillar: not needed at this size.** Three posts is below the 2-4-per-cluster
floor for standing up a dedicated pillar; treat this as a satellite cluster
that hangs off Cluster A (all three are "Claude Code / AI coding assistant,
applied to a non-code craft" — the same underlying entity, narrower intent).
They already interlink reasonably (`remotion-explainer-videos-ai` →
`vibe-coding-przewodnik` and `animacje-apple-ai-cursor`;
`software-3-0-agentic-engineering` → `vibe-coding-przewodnik`).
**Action:** link this trio from the Cluster A pillar once built, and from
`slabe-strony-claude-code` (which already namechecks "blind at video, design"
as one of Claude Code's five weaknesses — the natural bridge post).

---

## Orphans (zero incoming `/blog/` links today)

12 of 30 PL posts have no other post pointing to them:

`15-cursor-hacks-produktywnosc-ai`, `airtable-vs-excel-migracja`,
`chatboty-ai-od-koncepcji-do-wdrozenia`, `dane-jako-paliwo-biznesu`,
`el-padre-automatyzacja-ofert-ai`, `hackathon-hacknation-analiza-doswiadczen`,
`kodowanie-w-2025-ai-portfolio`, `no-code-lead-generation`,
`slabe-strony-claude-code`, `software-3-0-agentic-engineering`,
`system-agentow-ai-skills-rules-kontekst`, `zapier-vs-make-vs-n8n-wybor-narzedzia`.

Seven of these twelve are all of Cluster D — confirming that cluster's total
isolation is the single largest link-equity problem on the site, bigger than
any individual missing pillar. `zapier-vs-make-vs-n8n-wybor-narzedzia`, the
should-be pillar of a 9-post cluster, currently has the same link authority
as a random orphan spoke.

The EN corpus mirrors this shape almost exactly (38 total outgoing `/en/blog/`
links across 30 posts vs a comparable count in PL) — the linking gaps were
built in on both trees at the same time, most likely because posts get
published without a pass to backfill links from siblings once the corpus grew
past ~15 posts.

---

## Internal linking matrix — concrete additions

Format: `source → target` (add this hyperlink). "M" = mandatory (spoke↔pillar),
"R" = recommended (spoke↔spoke within cluster), "O" = optional (cross-cluster).
Apply the same list to the EN tree via `alternateSlug` mapping unless the EN
pruning decision below says otherwise.

### Cluster A (pillar to be built: "Claude Code dla biznesu, nie tylko dla kodu")

- M `[new pillar]` → `5-technik-pracy-z-claude-code`, `slabe-strony-claude-code`,
  `5-repozytoriow-github-claude-code`, `15-cursor-hacks-produktywnosc-ai`,
  `opsx-workflow-strukturyzowana-praca-z-ai`, `kodowanie-w-2025-ai-portfolio`,
  `spec-driven-seo-portfolio-qamera-ai`, `pit-38-claude-code-case-study`
- M `5-technik-pracy-z-claude-code` → `[new pillar]`
- M `slabe-strony-claude-code` → `[new pillar]`
- M `5-repozytoriow-github-claude-code` → `[new pillar]`
- M `15-cursor-hacks-produktywnosc-ai` → `[new pillar]`
- M `opsx-workflow-strukturyzowana-praca-z-ai` → `[new pillar]`
- M `kodowanie-w-2025-ai-portfolio` → `[new pillar]`
- M `spec-driven-seo-portfolio-qamera-ai` → `[new pillar]`
- M `pit-38-claude-code-case-study` → `[new pillar]`
- R `kodowanie-w-2025-ai-portfolio` → `spec-driven-seo-portfolio-qamera-ai`
  (before/after pairing, currently missing)
- R `spec-driven-seo-portfolio-qamera-ai` → `kodowanie-w-2025-ai-portfolio`
- R `15-cursor-hacks-produktywnosc-ai` → `5-technik-pracy-z-claude-code`
  (currently the only outgoing link from this post is not to this cluster —
  add this one)
- R `pit-38-claude-code-case-study` → `5-technik-pracy-z-claude-code`
- O `slabe-strony-claude-code` → `vibe-coding-przewodnik`,
  `animacje-apple-ai-cursor`, `remotion-explainer-videos-ai` (already partly
  present — confirm all three, not just one, are linked; today only two of
  three are)

### Cluster B (promote `software-3-0-agentic-engineering` to pillar)

- M `software-3-0-agentic-engineering` → `system-agentow-ai-skills-rules-kontekst`,
  `srodowisko-agentowe-ai-dwie-firmy`, `skills-2-0-multi-agent-system-zarzadzanie-firma`,
  `openclaw-bezpieczenstwo-agentow-ai` (none of these four exist today — add all)
- M `system-agentow-ai-skills-rules-kontekst` → `software-3-0-agentic-engineering`
- M `srodowisko-agentowe-ai-dwie-firmy` → `software-3-0-agentic-engineering`
- M `skills-2-0-multi-agent-system-zarzadzanie-firma` → `software-3-0-agentic-engineering`
- M `openclaw-bezpieczenstwo-agentow-ai` → `software-3-0-agentic-engineering`
- R `openclaw-bezpieczenstwo-agentow-ai` → `system-agentow-ai-skills-rules-kontekst`
  (security angle should reach the architecture case studies it's warning about)
- R `openclaw-bezpieczenstwo-agentow-ai` → `srodowisko-agentowe-ai-dwie-firmy`
- O `trendy-ai-2026-od-eksperymentow-do-operacjonalizacji` → `software-3-0-agentic-engineering`,
  `zapier-vs-make-vs-n8n-wybor-narzedzia` (connector post, link into both B and D)

### Cluster C (wire the existing course in as the pillar)

- M `second-brain-obsidian-claude-code-skills` → `/llm-wiki/kurs`
- M `llm-knowledge-base-brain-karpathy` → `/llm-wiki/kurs`
- M `okf-standard-przenosnosc-bazy-wiedzy-ai` → `/llm-wiki/kurs`
- M `rag-ragowi-nierowny` → `/llm-wiki/kurs`
- R course lesson `0-co-to-drugi-mozg` → `second-brain-obsidian-claude-code-skills`
  (or `llm-knowledge-base-brain-karpathy` — whichever is the better "why"
  companion to the course's opening lesson)

### Cluster D (the cheap win — zero links exist today, all additions are new)

- M `zapier-vs-make-vs-n8n-wybor-narzedzia` → `no-code-lead-generation`,
  `airtable-vs-excel-migracja`, `automatyzacja-email-frontdesk-ai`,
  `el-padre-automatyzacja-ofert-ai`, `chatboty-ai-od-koncepcji-do-wdrozenia`,
  `dane-jako-paliwo-biznesu`
- M `no-code-lead-generation` → `zapier-vs-make-vs-n8n-wybor-narzedzia`
- M `airtable-vs-excel-migracja` → `zapier-vs-make-vs-n8n-wybor-narzedzia`
- M `automatyzacja-email-frontdesk-ai` → `zapier-vs-make-vs-n8n-wybor-narzedzia`
- M `el-padre-automatyzacja-ofert-ai` → `zapier-vs-make-vs-n8n-wybor-narzedzia`
- M `chatboty-ai-od-koncepcji-do-wdrozenia` → `zapier-vs-make-vs-n8n-wybor-narzedzia`
- M `dane-jako-paliwo-biznesu` → `zapier-vs-make-vs-n8n-wybor-narzedzia`
- R `no-code-lead-generation` → `automatyzacja-email-frontdesk-ai` (same tool
  stack, adjacent use case)
- R `el-padre-automatyzacja-ofert-ai` → `chatboty-ai-od-koncepcji-do-wdrozenia`
  (both agency-facing case studies)
- R `kazda-firma-dziala-nieoptymalnie` → `dane-jako-paliwo-biznesu` (thesis →
  applied version)
- R `dane-jako-paliwo-biznesu` → `kazda-firma-dziala-nieoptymalnie`
- O `hackathon-hacknation-analiza-doswiadczen` → `kazda-firma-dziala-nieoptymalnie`
  (both process/digitalization-thesis posts, loosest fit in the cluster)
- O `kazda-firma-dziala-nieoptymalnie` → `zapier-vs-make-vs-n8n-wybor-narzedzia`

### Cluster E

- R `vibe-coding-przewodnik` → `animacje-apple-ai-cursor` (currently only the
  reverse direction exists via `remotion-explainer-videos-ai`; add the direct
  link)
- O `remotion-explainer-videos-ai` → `slabe-strony-claude-code` (the weakness
  post that names video as a gap this post fills)

Net effect if all of the above lands: every post in Clusters A-E has at least
3 incoming links (currently true for only 2 of 30 posts:
`5-technik-pracy-z-claude-code` and `second-brain-obsidian-claude-code-skills`),
and Cluster D goes from 0 to fully connected.

---

## Content gaps (prioritised by realistic winnability, not head-term size)

**P0 — build now (thin/no competition found, matches proven expertise):**

1. **Cluster A pillar post** — "Claude Code dla biznesu, nie tylko dla kodu."
   Not competing with docs/tutorial sites because it's not a how-to-install
   piece; it's the aggregation layer the other 7 posts already justify.
2. **PL long-tail: "system agentów AI dla małej firmy / jednoosobowej firmy"**
   — the SERP check found no direct competitor running this founder-scale
   framing; Cluster B's three case studies are proof this site can write it
   credibly. A short "start here" companion post or the promoted
   `software-3-0-agentic-engineering` pillar covers this.
3. **Cluster D pillar wiring** — not new content, pure linking work (see
   matrix above), but the ROI is highest here because the content already
   exists and is currently earning zero internal equity.

**P1 — worth writing, moderate competition:**

4. **"n8n vs Make dla polskich firm — ceny, RODO, hosting"** — the EN
   comparison market is saturated by vendor content and aggregators; a
   PL-specific angle (GDPR/RODO hosting requirements, PLN pricing, Polish
   payment integrations) is a real gap none of the English comparison sites
   address and this site's Cluster D already has the base comparison post to
   extend.
5. **A genuine "Claude Code vs Cursor" post** — the site has deep content on
   both tools separately (Cluster A + the Cursor-hacks post) but never
   compares them head-to-head, which is a distinct, common query neither
   existing post answers.

**P2 — do not chase:**

6. Generic English "AI automation" / "agentic AI" head terms. The SERP checks
   for both the coding-assistant angle and the multi-agent-business angle
   confirm this space is owned by Anthropic itself, IBM, enterprise vendors,
   and arxiv papers. A personal domain will not out-rank that inventory of
   authority regardless of content quality — the EN strategy should not target
   these terms even indirectly through generic titles.

---

## Bilingual (PL/EN) architecture decision

**Do not build the same cluster architecture on both trees.** The PL corpus
should get the full 5-cluster treatment above, because Polish-language SERPs
for this content (Claude Code practice, agent systems for small companies,
n8n/Make comparisons) are thinner and the founder-scale, RODO-aware framing
is genuinely differentiated. The English corpus is competing against
Anthropic's own docs, IBM, enterprise consultancies, and comparison
aggregators on nearly every head term checked — full pillar-building effort
there is effort spent to lose.

**Recommendation for EN:**
- Mirror the **linking matrix** in full (it's free — pure internal-link
  hygiene, no ranking risk either way, and a well-linked site helps every
  page regardless of authority).
- Mirror the **Cluster C pillar wiring** (course links) and **Cluster D
  internal cross-linking** as-is — these are structural fixes, not
  competitive plays.
- **Prune pillar-building ambition** for Cluster A and Cluster B on the EN
  side: do not invest in an English "Claude Code for business" pillar page
  competing against Anthropic's own best-practices docs. If an English
  Cluster A/B pillar is built at all, title and structure it around the
  specific case studies (200IQ LABS, two-company AI OS, PIT-38-equivalent
  workflow) rather than the generic head term — case-study-specific queries
  ("AI agent system replaced my finance team case study") have far less
  authority-site competition than "agentic engineering guide."
- Cluster D's EN pillar (`zapier-vs-make-vs-n8n-tool-choice`) is the one
  place where even the EN tree faces vendor-owned SERPs with no
  jurisdiction-specific escape hatch (RODO doesn't translate to an EN
  differentiator) — deprioritize new EN writing here entirely; linking-only.

---

## Where to invest first

**Cluster D's linking fix, then Cluster A's pillar.**

Cluster D is the highest-ROI single action on the site: nine finished,
thematically coherent posts with zero internal linking, including a post
(`zapier-vs-make-vs-n8n-wybor-narzedzia`) that is both the natural pillar and a
commercial-intent query with real business value, sitting at zero incoming
links today. This is an afternoon of edits, no new content, and it fixes the
single largest structural defect found in this audit.

Cluster A's pillar is the second priority and the larger lift (net-new 2500+
word page) because it's where the site's actual differentiated expertise
concentrates — eight posts of real practitioner content with no page
aggregating them — and because the PL SERP check shows a specific,
winnable angle (business use of Claude Code, not developer tooling) that no
competitor found in this research is running. Cluster B's pillar promotion
is nearly free (mostly linking, minor rewrite of one existing post) and
should follow immediately after — it protects against the cannibalization
risk identified in the three multi-agent-system case studies before that
risk compounds with more posts in the same vein.
