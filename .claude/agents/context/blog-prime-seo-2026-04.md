# Blog Prime — SEO articles (April 2026 batch)

**Date:** 2026-04-26
**Source materials added in commit:** `4096eef` — both briefs sit in `docs/blog/`
**Status:** Two candidate articles, neither published yet

---

## Source materials analyzed

### Brief A — Portfolio SEO improvements (own project)
- File: `docs/blog/2026-04-22-portfolio-seo-improvements-brief.md` (409 lines, very rich `_wsad`)
- Scope: Pawel's own portfolio audit → 5 improvement pillars → merge
- Stack: Vite 7 + React 19 + Vercel
- Linked work: PR #2 (seo-improvements) + PR #3 (EN translation), OpenSpec archive `2026-04-22-seo-improvements`
- Working title (proposed): _Od audytu SEO do grade A — 5 zmian które zrobiłem w jedno popołudnie z Claude Code_
- Format target: 15–20 min read, long-form technical case study
- Category fit: **Code** (matches openclaw/opsx pattern) or **AI**
- Already prepared in brief: hook, 9-section outline, before/after table, FAQ proposals (5), internal links, screenshots list, takeaways

### Brief B — Qamera AI SEO foundation (client case study)
- File: `docs/blog/2026-04-22-qamera-seo-foundation-case-study.md` (179 lines, looser brief)
- Scope: Qamera AI SaaS, 9 spec-driven SEO changes in 5 days
- Stack: Next.js 16 App Router + Turborepo + Supabase + i18n EN/PL/UK
- Linked work: PRs #75/76/77/82/92/93/94/96 in Qamera repo
- Working titles: _9 changes in 5 days: how spec-driven SEO fixed a SaaS from 56/100_
- Format target: long-form, case-study, audience = tech leads/founders
- Category fit: **Code** or **AI**
- Brief is structured but less polished than A; needs more story crafting

---

## Pawel's writing style (confirmed from recent posts)

Read: `opsx-workflow-strukturyzowana-praca-z-ai.md` (id 19), `openclaw-bezpieczenstwo-agentow-ai.md` (id 20), `llm-knowledge-base-brain-karpathy.md` (id 24).

Patterns:
- **Opening hook:** 1–2 paragraphs with a concrete number or surprising claim (`150 tysięcy gwiazdek w 2 tygodnie`, `Karpathy opisał framework. Ja miałem żywy system`)
- **First-person narrative**, Polish + English technical terms inline
- **Quote/blockquote** of a key insight ~halfway in
- **Tables** for before/after, command lists, comparison
- **Code blocks** for actual snippets (HTML, JSON, YAML)
- **H2 sections** every ~300–500 words; H3 inside bigger sections
- **FAQ section** at end with `<details open>` accordion (per copywriting skill)
- **Internal links** to 2–4 prior posts
- **Frontmatter:** `lang: pl`, `alternateSlug` only if EN counterpart exists, `category` is one of {Code, AI, Automatyzacja, No-Code}, `readTime` realistic (12–15 min for long-form)
- Length: long-form posts hover around 2500–3500 words

---

## Frontmatter template (next IDs)

Highest existing PL ID: **24** (llm-knowledge-base-brain-karpathy).
Next free ID for first new article: **25**, second: **26**.

```yaml
---
id: 25  # or 26
slug: ...                # 4–6 lowercase words, hyphens
title: "..."
excerpt: "..."           # 150–160 chars
category: Code           # most likely fit
author: Pawel Lipowczan
date: 2026-04-26
readTime: 15 min
image: /images/og-<slug>.webp
tags:
  - SEO
  - ...
lang: pl
# alternateSlug: ONLY if symmetric EN file exists — omit otherwise
---
```

---

## Candidate article comparisons

| Dimension | A — Portfolio SEO | B — Qamera case study |
|---|---|---|
| Source brief depth | Very rich (409 lines, fully outlined) | Solid but looser (179 lines) |
| Personal angle | Strong (own project, my decisions) | Client work, needs anonymization care |
| Technical novelty | High: `requestIdleCallback` myth, llms.txt, CSP Report-Only via Sentry, sitemap lastmod, alternateSlug bug | High: spec-driven workflow, parallel worktrees, CLS 0.467→0.016, hreflang at sitemap level |
| Story arc | Clear: audit → 5 pillars → merge → bonus i18n bug | Clear: 56/100 score → 9 PRs in 5 days → results |
| Connects to prior posts | OPSX, Skills 2.0, Second Brain — 4 internal links ready | OPSX (spec-driven), would also reference Skills 2.0 |
| Audience | Solo devs/founders maintaining own sites | Tech leads/founders building SaaSes |
| Risk | Low (own project, all numbers verifiable) | Need to confirm what's OK to publish about Qamera |
| Effort to write | Medium — brief is almost a draft | Medium-high — needs more narrative shaping |

---

## Key topics by article

### Article A — uniquely valuable claims
1. `async=true` on dynamically-injected script in `<head>` is a myth — inline code still runs sync during HTML parse
2. `requestIdleCallback` + `setTimeout(2000)` Safari fallback as the real defer
3. BlogPosting schema enrichment: `articleBody: excerpt` is semantically wrong — drop it; add `publisher` (Org + raster logo), `dateModified`, `mainEntityOfPage`, `description` with first-paragraph fallback
4. CSP Report-Only > enforce as starting posture; Sentry's separate Security Reports bucket beats report-uri.com (no free tier in 2026)
5. Sitemap `lastmod` per page-type (post: frontmatter.modified, listing: max, legal: git mtime via `execFileSync`)
6. `llms.txt` / `llms-full.txt` build-time generator following llmstxt.org spec
7. Bonus: `alternateSlug === slug` self-reference bug in i18n — root cause + 3-level fix (data, code, process/skill)
8. Vercel gotchas: Deployment Protection blocks scanners; preview returns `X-Robots-Tag: noindex` — Rich Results Test needs Code mode

### Article B — uniquely valuable claims
1. Spec-driven SEO via OpenSpec — proposal/design/specs/tasks before code
2. Git worktrees for parallel SEO changes (Windows file-lock workaround)
3. CLS 0.467 → 0.016 via SSR initial Airtable grid (with bonus GEO benefit)
4. Product schema for SaaS: Merchant Listings false-positive — accept Product Snippets, plan migration to `SoftwareApplication`
5. Hreflang: `Metadata.alternates` head-level is not enough — sitemap-level `xhtml:link` + shared helper + drift-guard test
6. Per-locale preview verification catches a hardcoded-EN OG copy bug
7. AI bot allowlist (named `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`)
8. Tool chain: `claude-seo` plugin + Lighthouse MCP + GSC + PSI

---

## Technical accuracy notes

For Article A:
- `requestIdleCallback` browser support: Safari shipped it in 16.4 (March 2023). Fallback `setTimeout(2000)` claim is correct for Safari 16.3-.
- llmstxt.org spec exists since 2024 (Answer.AI / Jeremy Howard).
- Sentry CSP reporting endpoint format used in brief looks right; recommend re-checking the actual env var name with `vercel env` before publishing.

For Article B:
- Next.js 16 App Router `generateMetadata` is current API; `Metadata.alternates.languages` exists.
- Lighthouse MCP package name `@danielsogl/lighthouse-mcp` should be verified before mention.
- "Merchant Listings vs Product Snippets" distinction is real per Google docs.

→ Use Context7 MCP for Next.js 16 / Sentry / Vercel docs verification during the **plan** or **execute** phase, not now.

---

## Code / asset inventory needed

### Article A
- HTML snippet (before/after `requestIdleCallback`)
- JSON-LD before/after
- llms.txt structure example
- Security headers block (Permissions-Policy, HSTS, CSP)
- Bash/JS snippet for `execFileSync('git', [...])` mtime
- Screenshots: securityheaders.com (C→A), Rich Results panel, PSI, sitemap.xml diff, Sentry CSP dashboard
- New OG image: `/images/og-<slug>.webp` (1200×630)

### Article B
- Lighthouse before/after CLS visual
- JSON-LD blocks (SoftwareApplication, Product, Service, FAQPage)
- Sitemap `xhtml:link` snippet
- robots.txt AI allowlist
- llms.txt sample for SaaS
- Screenshots: Rich Results Test results, GSC, OpenSpec tasks.md
- New OG image: `/images/og-<slug>.webp`

---

## Meta-thesis (decided 2026-04-26 with author)

**Process-first case study + code-as-substrate argument.**

Kluczowa teza, która łączy oba projekty i odróżnia artykuł od typowych SEO postów:

> Pełna kontrola nad SEO i GEO jest możliwa tylko przy stacku opartym na kodzie. WordPress / Webflow / Wix dają wtyczki, nie dają `Content-Security-Policy`, nie dają sitemap-level `xhtml:link`, nie dają `llms.txt` na własnych warunkach, nie dają `requestIdleCallback` w head. Ten artykuł pokazuje, że kiedy substratem jest kod, **proces** (brainstorming → spec → execute → review → test) skraca optymalizację o kilkadziesiąt procent do **godzin, nie tygodni**. AI workflow działa, *bo* nic nie stoi na drodze.

Implikacje dla struktury:
- Sekcja wprowadzająca powinna postawić tę tezę explicite (ramy: "dlaczego ten artykuł nie jest dla użytkowników WordPressa")
- Każdy z deep-divów (CSP, llms.txt, hreflang, schema) powinien w jednym zdaniu pokazać: "tego nie zrobisz na X" — to dowód siły kodowego stacku
- Sekcja procesu powinna jasno powiedzieć: kompresja czasu do godzin **wymaga** dwóch rzeczy jednocześnie — kodowego stacku **i** dobrego workflow z AI; jedno bez drugiego nie wystarcza

Decyzje finalne dla plan phase:
- **Angle:** process-first case study, ale z code-as-substrate jako thesis frame
- **Kategoria:** Code
- **ID:** 25
- **Qamera:** po nazwie, linki do qamera.ai — element SEO entity dla własnego SaaS-a wspólnika
- **Tytuł roboczy do plan:** _"Spec-driven SEO na dwóch projektach — proces, którym zoptymalizowałem portfolio i Qamera AI"_ (lub wariant z naciskiem na "kod daje kontrolę")

---

## Recommended next step

Brief A is closer to a draft (the wsad already has section structure, before/after tables, quotes, FAQ proposals, internal links). Brief B needs more narrative shaping but offers a different audience (founders/tech leads vs. solo devs).

**Recommendation:** start with Article A — it's lower-risk, higher-density of unique technical claims, has 4 ready internal links to recent posts (OPSX, Skills 2.0, Second Brain, 15 cursor hacks), and is fully verifiable from the OpenSpec archive + PRs in this repo. Article B can follow as a second post or get its own dedicated session.

Both could later become an EN translation and form a 2-part series ("SEO for solo devs" + "SEO for SaaSes").

---

## Success criteria — checklist

- [x] All source materials identified and read
- [x] Pawel's writing style understood (3 recent posts read)
- [x] Portfolio copywriting guidelines reviewed (SKILL.md)
- [x] Key topics and technical concepts extracted (per article)
- [x] Prime artifact created with comprehensive context
- [x] Ready to proceed to planning phase
