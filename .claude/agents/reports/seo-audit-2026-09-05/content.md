# Content Quality & E-E-A-T Audit — pawel.lipowczan.pl
Date: 2026-09-05. Source: repo markdown (`src/content/blog/**`, `src/content/kurs/**`, `src/data/projects.js`, `src/locales/{pl,en}/projects.json`), `src/components/seo/SEO.jsx`, `src/pages/Home.jsx`, plus a 13-page live HTML sample in `<scratchpad>/seo/pages/`.

**Not covered (turn-budget cut):** live-rendered heading/alt-text audit across all 98 URLs (only homepage + 13 sampled pages checked), full readability/Flesch scoring, freshness audit of every `modified` field, deep cannibalization SERP-overlap check (only title/topic clustering done).

---

## 1. Thin content (quality-gate thresholds: blog 1,500w, product/case-study 400w, service 800w)

### Blog posts (30 PL, gate: 1,500 words) — measured by stripping YAML frontmatter, counting body words
Below threshold:
- `/blog/automatyzacja-email-frontdesk-ai` — **689 words** (EN twin `/en/blog/email-automation-frontdesk-ai` — 763w, also short)
- `/blog/no-code-lead-generation` — **841 words** (EN twin same slug — 901w, also short)

Close to threshold but technically short:
- `/blog/chatboty-ai-od-koncepcji-do-wdrozenia` — 1,005w
- `/blog/kazda-firma-dziala-nieoptymalnie` — 1,047w
- `/blog/kodowanie-w-2025-ai-portfolio` — 1,196w
- `/blog/hackathon-hacknation-analiza-doswiadczen` — 1,419w

All other 24 PL posts clear 1,500w (up to 4,435w for `15-cursor-hacks-produktywnosc-ai`). Full ranked list is in the raw data below.

### Case studies (9 live, not 10 — sitemap inventory overstated by one; gate: use Product/Service floor, 400–800w)
Measured from `src/locales/{pl,en}/projects.json` (description + fullDescription + features + benefits — the entire prose payload of the page):
| Slug | PL words | EN words |
|---|---|---|
| note-taker-addons | 217 | 234 |
| lead-generator | 192 | 200 |
| context-based-chatbot | 177 | 174 |
| integracja-systemow-phu-impex | 187 | 194 |
| frontdesk-ai | 164 | 178 |
| automatyzacje-dokumentow | 171 | 180 |
| system-hrm | 156 | 157 |
| lead-enrichment | 177 | 191 |
| ankiety-badania-satysfakcji | 178 | 180 |

**All 9 case studies fail even the 400-word Product Page floor** (they average ~180 words), and fail the 800-word Service Page floor outright. Every one of `/projects/note-taker-addons`, `/projects/lead-generator`, `/projects/context-based-chatbot`, `/projects/integracja-systemow-phu-impex`, `/projects/frontdesk-ai`, `/projects/automatyzacje-dokumentow`, `/projects/system-hrm`, `/projects/lead-enrichment`, `/projects/ankiety-badania-satysfakcji` (and their `/en/projects/...` twins) is thin. This is the single biggest thin-content problem on the site: these are the pages that should carry the most E-E-A-T weight (first-hand case studies) and instead read like feature-list teasers, not case studies with a described problem → approach → measurable result.

### Course lessons (8, no dedicated gate — judged as tutorial/service content, 800w floor is the closest analogue)
- `/llm-wiki/kurs/0-trzy-pojecia` — 194w
- `/llm-wiki/kurs/0-co-to-drugi-mozg` — 271w
- `/llm-wiki/kurs/0-uruchom-w-swoim-narzedziu` — 503w
- `/llm-wiki/kurs/5-rozwoj-i-publikacja` — 961w
- `/llm-wiki/kurs/3-pierwszy-ingest` — 1,103w
- `/llm-wiki/kurs/4-pytania-i-zarzadzanie` — 1,128w
- `/llm-wiki/kurs/2-onboarding` — 1,249w
- `/llm-wiki/kurs/1-zaloz-katalog` — 2,169w

The three `0-*` lessons are conceptual primers (194–503w) — thin if judged as standalone landing pages, but plausibly intentional as short "before you start" framing steps ahead of the longer numbered lessons. Flag, don't necessarily fix.

## 2. PL/EN parity
Checked **all 30 pairs** (not just a sample of 5), by word count. Every single EN post is **equal to or longer than** its PL original (ratio 1.04×–1.20×, consistent with English's higher word count per unit of meaning — articles, prepositions). No stub or truncated translation found anywhere in the blog. Same result for all 9 case studies via the locale JSON: EN total ≥ PL total in 8 of 9 cases, with `context-based-chatbot` EN marginally shorter (174 vs 177w — noise, not a stub). **Parity is a strength, not a gap.**

## 3. Internal linking and orphans (grep across `src/content/blog/*.md` for `(/blog/...)` links)

- **13 of 30 posts have zero outbound contextual links** to other posts: `5-technik-pracy-z-claude-code`, `airtable-vs-excel-migracja`, `automatyzacja-email-frontdesk-ai`, `chatboty-ai-od-koncepcji-do-wdrozenia`, `dane-jako-paliwo-biznesu`, `el-padre-automatyzacja-ofert-ai`, `hackathon-hacknation-analiza-doswiadczen`, `kazda-firma-dziala-nieoptymalnie`, `kodowanie-w-2025-ai-portfolio`, `no-code-lead-generation`, `trendy-ai-2026-od-eksperymentow-do-operacjonalizacji`, `vibe-coding-przewodnik`, `zapier-vs-make-vs-n8n-wybor-narzedzia`.
- **13 of 30 posts never receive an inbound contextual link** from any other post (found only via `/blog` index, not from within article bodies): `15-cursor-hacks-produktywnosc-ai`, `airtable-vs-excel-migracja`, `automatyzacja-email-frontdesk-ai`, `chatboty-ai-od-koncepcji-do-wdrozenia`, `dane-jako-paliwo-biznesu`, `el-padre-automatyzacja-ofert-ai`, `hackathon-hacknation-analiza-doswiadczen`, `kodowanie-w-2025-ai-portfolio`, `no-code-lead-generation`, `slabe-strony-claude-code`, `software-3-0-agentic-engineering`, `system-agentow-ai-skills-rules-kontekst`, `zapier-vs-make-vs-n8n-wybor-narzedzia`.
- Overlap: `airtable-vs-excel-migracja`, `automatyzacja-email-frontdesk-ai`, `chatboty-ai-od-koncepcji-do-wdrozenia`, `dane-jako-paliwo-biznesu`, `el-padre-automatyzacja-ofert-ai`, `hackathon-hacknation-analiza-doswiadczen`, `kodowanie-w-2025-ai-portfolio`, `no-code-lead-generation`, `zapier-vs-make-vs-n8n-wybor-narzedzia` are **both** unlinked-from and unlinked-to — 9 posts sit fully outside the contextual link graph, reachable only through `/blog`'s paginated index.
- **Zero links in either direction between blog posts and case studies.** No `/projects/*` page's `fullDescription`/features/benefits links to a blog post, and no blog post links to `/projects/*`. Given several posts describe systems that map directly to a case study (e.g. `automatyzacja-email-frontdesk-ai` ↔ `/projects/frontdesk-ai`, `no-code-lead-generation` ↔ `/projects/lead-generator`), this is a concrete, named, easy fix — not a vague "improve interlinking" note.
- Where linking exists, it clusters around a few hub posts: `5-technik-pracy-z-claude-code` (5 inbound), `second-brain-obsidian-claude-code-skills` (7 inbound), `llm-knowledge-base-brain-karpathy` (5 inbound), `opsx-workflow-strukturyzowana-praca-z-ai` (5 inbound). The graph is a hub-and-spoke around the "AI agent tooling" cluster; the earlier business/ops posts (frontdesk, lead-gen, airtable, Zapier/Make/n8n, Hacknation, "każda firma") are excluded from it entirely.

## 4. E-E-A-T for a solo practitioner

**Present (strengths):**
- Every blog post frontmatter carries `author` and `date` (`src/content/blog/*.md`), and `BlogPostPage.jsx` emits a `Person` schema per article (line ~470).
- Homepage (`src/pages/Home.jsx`, line ~35) emits a site-wide `Person` schema with `jobTitle: "Software Architect & Technology Advisor"` and `sameAs: ["https://linkedin.com/in/pawellipowczan", ...]` — a real entity anchor.
- Testimonials (`src/components/sections/Testimonials.jsx`) link to real, named third-party LinkedIn profiles (`linkedin.com/in/dagmara-modrzejewska`, `linkedin.com/in/renata-kulagowska`, `linkedin.com/in/szymon-ruchwa`) — genuine external corroboration, not generic "Jan K., city" testimonials.
- Case studies and several blog posts describe first-hand, named client work (PIT-38 case study, El Padre, Hacknation) — real experience signal.
- `modified` dates exist on some posts (`llm-knowledge-base-brain-karpathy`, `15-cursor-hacks-produktywnosc-ai`) showing active freshness maintenance, but this is inconsistent — most posts have no `modified` field at all, so `dateModified` silently falls back to `date` per the loader contract (`src/content/blog/AGENTS.md`).

**Missing (gaps, concrete):**
- **No dedicated author/about/bio page.** No `/about`, `/o-mnie`, or equivalent route exists (`find src/pages -iname "*about*"` returns nothing). The `Person` schema on the homepage is structured data only — there is no human-readable page a visitor or an AI crawler can land on that states credentials, years of experience, or scope of expertise. This is the largest Authoritativeness/Expertise gap on the site.
- **Author name is inconsistent**: frontmatter uses "Pawel Lipowczan" almost everywhere but "Paweł Lipowczan" (diacritic) in `kazda-firma-dziala-nieoptymalnie.md`. Minor, but it fragments the entity signal for anything doing exact-string author matching.
- **No visible business identity/trust markers** (NIP, registered address, company name) found anywhere in `src` (`grep -rn "NIP|regon|adres siedziby" src` — zero hits). For a consultant selling paid services (the course, contracting), this is a Trustworthiness gap the QRG weighs at 30%.
- **No credentials/certifications section** — no mention of formal qualifications, only project outcomes. Acceptable for a "hands-on practitioner" positioning but worth an explicit call-out since Expertise is 25% of the score and currently rests entirely on the work shown, not on any credentialing.
- Case studies (see §1) are too thin to carry real Experience signal — no described before/after metrics, no client name, no timeline. This compounds the case-study thin-content finding: it's not just short, it's short on exactly the specificity (dates, numbers, named clients) that both E-E-A-T and AI-citation readiness need.

## 5. Titles and meta descriptions (from frontmatter `title`/`excerpt`, rendered as `${title} | Pawel Lipowczan` per `src/components/seo/SEO.jsx`)

No duplicate or templated-identical titles found across the 30 posts — each is topically distinct. But **title length control is not enforced**: adding the `| Pawel Lipowczan` suffix (+19 chars) pushes 29 of 30 rendered `<title>` tags past the plugin's 60-character gate. Worst offenders (rendered title length, actual text):
- `kazda-firma-dziala-nieoptymalnie` — **112 chars**: "Każda firma działa nieoptymalnie - jak przestać kłamać pracownikom i zacząć naprawiać procesy? | Pawel Lipowczan"
- `spec-driven-seo-portfolio-qamera-ai` — **107 chars**: "Spec-driven SEO na portfolio i Qamera AI... | Pawel Lipowczan" (base title 89 chars)
- `automatyzacja-email-frontdesk-ai` — **100 chars**: "Automatyzacja poczty email z AI - Jak Frontdesk AI rewolucjonizuje obsługę klienta | Pawel Lipowczan"
- `no-code-lead-generation` — **100 chars**: "No-Code Lead Generation - Jak zbudować system generowania leadów bez programowania | Pawel Lipowczan"
- `kodowanie-w-2025-ai-portfolio` — **98 chars**

Only `dane-jako-paliwo-biznesu` lands at exactly 60 chars; every other post overflows, most into the 70–90 char range where Google will truncate the tail in the SERP snippet.

Meta descriptions (`excerpt`, gate: 120–160 chars) are inconsistent in both directions:
- Too short: `pit-38-claude-code-case-study` (62 chars), `rag-ragowi-nierowny` (60 chars), `system-agentow-ai-skills-rules-kontekst` (70 chars), `el-padre-automatyzacja-ofert-ai` (74 chars), `okf-standard-przenosnosc-bazy-wiedzy-ai` (74 chars), `software-3-0-agentic-engineering` (71 chars) — these under-use the SERP snippet space.
- Too long (will be truncated at ~155-160 by Google): `zapier-vs-make-vs-n8n-wybor-narzedzia` (226 chars), `kodowanie-w-2025-ai-portfolio` (213 chars), `kazda-firma-dziala-nieoptymalnie` / `hackathon-hacknation-analiza-doswiadczen` (177 chars each), `trendy-ai-2026-od-eksperymentow-do-operacjonalizacji` / `llm-knowledge-base-brain-karpathy` (172 chars each), `vibe-coding-przewodnik` (167 chars), `airtable-vs-excel-migracja` (166 chars).

No missing titles/excerpts — the frontmatter contract (`src/content/blog/AGENTS.md`) makes both required fields, and the loader throws at build time if absent, so this class of error is structurally prevented.

## 6. Heading structure, AI citation readiness
Not audited page-by-page at scale (turn budget). Spot-checked frontmatter/FAQ convention: `src/utils/faqExtractor.js` looks for an H2 "FAQ" section with H3 questions — a good AEO pattern — but not all 30 posts were checked for its presence. Recommend a follow-up pass specifically grepping `## FAQ` across all posts to quantify FAQ-schema coverage.

## 7. Cannibalization clusters (by topic, from titles — not a SERP-overlap check)
- **Claude Code cluster (4 posts):** `5-repozytoriow-github-claude-code`, `5-technik-pracy-z-claude-code`, `slabe-strony-claude-code`, `pit-38-claude-code-case-study` — different angles (tools, techniques, weaknesses, case study) so likely complementary rather than competing, but worth confirming target queries don't overlap on "Claude Code" head terms.
- **Agent-system cluster (4 posts):** `system-agentow-ai-skills-rules-kontekst`, `skills-2-0-multi-agent-system-zarzadzanie-firma`, `srodowisko-agentowe-ai-dwie-firmy`, `openclaw-bezpieczenstwo-agentow-ai` — real risk of query overlap on "system agentów AI".
- **Knowledge-base/second-brain cluster (4 posts):** `second-brain-obsidian-claude-code-skills`, `llm-knowledge-base-brain-karpathy`, `okf-standard-przenosnosc-bazy-wiedzy-ai`, `rag-ragowi-nierowny` — these are also the best-interlinked cluster on the site (see §3), which mitigates cannibalization risk since Google can see they're a deliberate series.

---

## Raw data: full PL blog word counts (sorted)
```
689  automatyzacja-email-frontdesk-ai.md
841  no-code-lead-generation.md
1005 chatboty-ai-od-koncepcji-do-wdrozenia.md
1047 kazda-firma-dziala-nieoptymalnie.md
1196 kodowanie-w-2025-ai-portfolio.md
1419 hackathon-hacknation-analiza-doswiadczen.md
1513 el-padre-automatyzacja-ofert-ai.md
1561 opsx-workflow-strukturyzowana-praca-z-ai.md
1608 airtable-vs-excel-migracja.md
1741 5-repozytoriow-github-claude-code.md
1774 animacje-apple-ai-cursor.md
1843 second-brain-obsidian-claude-code-skills.md
1986 vibe-coding-przewodnik.md
2074 openclaw-bezpieczenstwo-agentow-ai.md
2111 okf-standard-przenosnosc-bazy-wiedzy-ai.md
2191 slabe-strony-claude-code.md
2293 software-3-0-agentic-engineering.md
2459 rag-ragowi-nierowny.md
2523 remotion-explainer-videos-ai.md
2607 skills-2-0-multi-agent-system-zarzadzanie-firma.md
2790 srodowisko-agentowe-ai-dwie-firmy.md
2959 dane-jako-paliwo-biznesu.md
3114 trendy-ai-2026-od-eksperymentow-do-operacjonalizacji.md
3232 pit-38-claude-code-case-study.md
3312 spec-driven-seo-portfolio-qamera-ai.md
3656 zapier-vs-make-vs-n8n-wybor-narzedzia.md
3895 system-agentow-ai-skills-rules-kontekst.md
3953 llm-knowledge-base-brain-karpathy.md
3999 5-technik-pracy-z-claude-code.md
4435 15-cursor-hacks-produktywnosc-ai.md
```
(EN counterparts run 4–20% longer across the board — see §2.)

---

## Scores

**Content Quality: 62/100** — strong experience/expertise signal in the blog (24/30 posts clear 1,500w, PL/EN parity is genuinely solid across all 30 pairs) dragged down hard by the case-study layer: all 9 case studies average ~180 words against a 400w floor, and there is no author/about page to anchor Authoritativeness/Trust.

**On-Page SEO: 54/100** — titles are unique and excerpts always present (no missing/templated tags — the frontmatter contract prevents that structurally), but 29/30 rendered title tags exceed 60 characters, meta description length is inconsistent in both directions on ~14 posts, and internal linking leaves 9 posts fully outside the contextual link graph plus zero links between the blog and the case-study section that would reinforce topical authority.
