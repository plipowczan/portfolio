# Plan — Blog Article: Spec-driven SEO (Portfolio + Qamera AI)

**Phase:** PLAN
**Created:** 2026-04-26
**Prime artifact:** `.claude/agents/context/blog-prime-seo-2026-04.md`
**Source briefs:** `docs/blog/2026-04-22-portfolio-seo-improvements-brief.md` + `docs/blog/2026-04-22-qamera-seo-foundation-case-study.md`

---

## Frontmatter (final)

```yaml
---
id: 25
slug: spec-driven-seo-portfolio-qamera-ai
title: "Dlaczego nie da się tego zrobić na WordPressie — spec-driven SEO na portfolio i Qamera AI"
excerpt: "Audyt SEO, spec-driven changes i AI workflow zoptymalizowały dwa projekty w godziny, nie tygodnie. Case study z portfolio i Qamera AI."
category: Code
author: Pawel Lipowczan
date: 2026-04-26
readTime: 16 min
image: /images/og-spec-driven-seo-portfolio-qamera-ai.webp
tags:
  - SEO
  - GEO
  - OpenSpec
  - Claude Code
  - Next.js
  - Vercel
lang: pl
# alternateSlug: omit — no EN counterpart yet
---
```

**Notes:**
- Title length: 99 chars (over the 50-60 SEO target, but matches Pawel's recent style: id 19 = 75 chars, id 20 = 70 chars). Provocative hook beats keyword-cramming for this audience.
- Excerpt: 158 chars. Hits "spec-driven", "SEO", "AI workflow", "Qamera AI", "portfolio".
- Slug: 5 words, hits qamera + spec-driven + seo.
- No `description` field for now — schema will fall back to first paragraph (acceptable per data-storage rules).
- No `modified` field — date = today.
- `alternateSlug` deliberately omitted (rule from CLAUDE.md after the karpathy bug fix).

---

## Target metrics

| Metric | Target |
|---|---|
| Total word count | 3000–3400 (PL) |
| Read time | 16 min (200 wpm) |
| H2 sections | 8 |
| Code blocks | 6–8 (with language tags) |
| Tables | 3 |
| Internal links | 5–6 |
| External links | 8–10 |
| FAQ questions | 5 |

---

## Content structure

### 0. Title + opening hook (no H2)
**~250 words**

- Otworzenie: konkretne liczby z obu projektów (portfolio C → A, 5 zmian, popołudnie / Qamera 56/100 → green, 9 zmian, 5 dni)
- Centralna teza: pełna kontrola nad SEO+GEO wymaga **kodowego stacku**. WordPress, Webflow, Wix dają wtyczki — nie dają nagłówka `Content-Security-Policy`, nie dają `xhtml:link` na poziomie sitemapy, nie dają `requestIdleCallback` w `<head>`, nie dają `llms.txt` na własnych warunkach.
- Drugi multiplikator: dobry workflow z AI (brainstorm → spec → execute → review → test). Sam kodowy stack bez procesu = 2 tygodnie. Sam AI workflow na zamkniętej platformie = sufit.
- Value preview: pokażę proces na dwóch projektach o radykalnie różnych stackach (Vite SPA vs Next.js 16 monorepo) — i zobaczysz, co transferuje się 1:1, a co nie.

**Frame setting:** "Jeśli twoja strona stoi na WordPressie / Webflow / Wix — ten artykuł nie jest tutorialem dla ciebie. Może być argumentem za przejściem na własny stack."

---

### 1. H2: Dlaczego "platforma vs kod" to dziś nie debata o cenie hostingu
**~350 words**

- Krótka historia: 5 lat temu wybór WordPress był pragmatyczny (motywy, pluginy, ecosystem)
- Co się zmieniło w 2026: SEO przesunęło się w stronę GEO (LLM crawlers, llms.txt, structured data jako sygnał dla AI Overviews), security headers stały się ranking factorem, Core Web Vitals weryfikuje field data nie lab
- Co WordPress/Webflow daje w 2026: SEO plugin (Yoast/Rank Math), basic schema, sitemap, redirecty
- Czego nie daje (lub daje z bardzo dużą walką): `Content-Security-Policy` Report-Only z reportingiem do Sentry, `Permissions-Policy` per-page, `requestIdleCallback` zamiast `async=true`, `xhtml:link` w sitemap a nie tylko hreflang w head, `llms.txt` z własną logiką generacji, `articleBody` schema bez excerpt jako semantyczny błąd, ISO 8601 datetime w JSON-LD
- **Konkluzja sekcji:** "Pluginy domykają top 80%. Top 20% — czyli ten zakres, w którym dziś wygrywasz pozycje — wymaga edycji nagłówków HTTP, struktury HTML w `<head>`, własnego buildera artefaktów. Tego nie robisz w admin panelu."

**Code block 1 (text):** lista nagłówków, których nie ustawisz w typowym hostingu WordPress.

---

### 2. H2: Toolchain — pięć narzędzi, jedna pętla
**~400 words**

- Wprowadzenie do narzędzi (każde 1-2 zdania):
  - **`claude-seo` plugin** (20+ sub-skilli) — audyt jako pierwsza komenda
  - **OPSX / OpenSpec** — proposal → design → specs → tasks **przed** kodem; link do [`/blog/opsx-workflow-strukturyzowana-praca-z-ai`](/blog/opsx-workflow-strukturyzowana-praca-z-ai)
  - **Lighthouse MCP** (`@danielsogl/lighthouse-mcp`) — lab CWV z poziomu agenta
  - **Rich Results Test + Sentry CSP Reports + securityheaders.com** — weryfikacja
  - **Git worktrees** (gdy projekt na to pozwala) — równoległe niezależne zmiany
- **Diagram pętli (text block):** Audit → Proposal → Design → Specs → Tasks → Implement → Review → Verify → Archive
- Krótki argument: każde z tych narzędzi działa **bo substratem jest kod**. Audyt może czytać `<head>`, OPSX może edytować dowolny plik, weryfikatory dostają pełny output.

**Code block 2 (text):** ASCII diagram pętli.
**Code block 3 (bash):** typowa sekwencja komend (`claude-seo:seo` → `/opsx:new` → `/opsx:ff` → `/opsx:apply` → `/opsx:verify` → `/opsx:archive`).

---

### 3. H2: Audyt — co znajduje `claude-seo` na dwóch radikalnie różnych projektach
**~450 words**

Tabela + narracja:

| Projekt | Stack | Findings | Health score |
|---|---|---|---|
| Portfolio | Vite 7 + React 19 + Vercel | 10 (4 perf, 2 schema, 2 security, 1 sitemap, 1 GEO) | implicit — grade C → A target |
| Qamera AI | Next.js 16 + Turborepo + Vercel + Supabase | 7 + 2 wykryte podczas | 56/100 → green |

- **Wspólne kategorie znalezisk** (transferują się 1:1):
  - brak / niekompletne `llms.txt` / `llms-full.txt`
  - schema enrichment (`publisher`, `dateModified`, `mainEntityOfPage`)
  - hreflang (head vs sitemap-level)
  - security headers (CSP, HSTS, Permissions-Policy)
  - AI bot allowlist (named rules dla GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot, CCBot)
- **Stack-specific** (różne):
  - Portfolio: `requestIdleCallback` zamiast `async=true` w `<head>`, sitemap lastmod per page-type
  - Qamera: CLS 0.467 → 0.016 przez SSR initial Airtable grid, `generateMetadata` per-locale, hardcoded EN OG copy

- **Wniosek sekcji:** audyt zwrócił uniwersalny zestaw findings — **różny był tylko sposób ich naprawienia**, nie sama natura problemu. To pierwszy dowód, że proces jest transferowalny.

---

### 4. H2: Od audytu do change proposal — kiedy bundlować, kiedy splitować
**~400 words**

- **Portfolio** = jeden change `seo-improvements` z 5 filarami w jednym PR. Single-maintainer, brak ryzyka konfliktu, łatwiejszy review całości.
- **Qamera** = dziewięć osobnych changes na osobnych worktree'ach, 8 PR-ów. Multi-developer, monorepo, disjoint file sets, równoległa praca.
- **Kryterium decyzyjne (mała tabela):**

| Czynnik | One-PR (portfolio) | Multi-PR (Qamera) |
|---|---|---|
| Liczba maintainerów | 1 | 2+ |
| Ryzyko konfliktu plików | niskie | wysokie |
| Cykl review | self-review | code review przez wspólnika |
| Rozkład czasowy | jedno popołudnie | 5 dni roboczych |
| Rollback granularity | całość lub nic | per-feature |

- Wspólne dla obu: każda zmiana = OPSX `proposal.md` + `design.md` + `specs/` + `tasks.md` **przed** kodem. To nie biurokracja — to feedback loop dla AI: spec dostaje review zanim wygenerujesz 200 linii kodu, którego nie chcesz.

**Code block 4 (text):** fragment `tasks.md` z portfolio (kilka tasków [x]) jako ilustracja.

---

### 5. H2: Co transferuje się 1:1 (i dlaczego to argument za kodem)
**~550 words**

Cztery rzeczy, każda z mini-deep-dive (~120 słów + przykład) i sygnałem "tego nie zrobisz na X":

#### A. `llms.txt` / `llms-full.txt` jako własny artefakt build-time
- llmstxt.org spec, ChatGPT/Perplexity/Claude Search respektują
- Skrypt Node generuje z `import.meta.glob` blogposts + `src/data/projects.js`
- Portfolio: `scripts/generate-llms-txt.js`. Qamera: bliźniaczy skrypt w workspace docs/marketing
- **"Tego nie zrobisz w panelu":** WordPress plugin może generować statyczny `llms.txt`, ale nie zaintegrujesz go z twoim CMS-em na własnych warunkach (kolejność sekcji, język, fallback)

**Code block 5 (text):** przykład struktury `llms.txt`

#### B. Schema enrichment — `articleBody: excerpt` to semantyczny błąd
- Stary schema: 6 pól. Po enrichmenu: 11 pól (+ `publisher` z raster logo, `dateModified`, `mainEntityOfPage`, ISO 8601, `description` z fallback do pierwszego akapitu)
- Identyczny pattern w Qamerze dla `Article` / `BlogPosting` na `/blog`
- Rich Results Test: 5 warnings → 0
- **"Tego nie zrobisz w panelu":** SEO pluginy ustawiają top 6 pól. `mainEntityOfPage`, `publisher.logo` jako oddzielny raster 600×60, ISO datetime z `Z` — to ręczna robota w kodzie

**Code block 6 (json):** before/after JSON-LD diff

#### C. Hreflang na poziomie sitemapy, nie tylko `<head>`
- `Metadata.alternates.languages` w Next.js to head-level, Google preferuje `xhtml:link` w sitemap dla klasteryzacji
- Wspólny helper `buildLanguageAlternates(pathname)` używany **z dwóch miejsc** — `sitemap.ts` i każdy `generateMetadata`
- Drift-guard test: CI failuje gdy ktoś doda ścieżkę do sitemap, a nie doda alternates do page.tsx
- **"Tego nie zrobisz w panelu":** Yoast generuje hreflang w head. Sitemap-level wymaga edycji generatora sitemapy

**Code block 7 (xml):** fragment sitemap z `xhtml:link`

#### D. AI bot allowlist — named rules zamiast wildcard
- `robots.txt` z osobnymi regułami dla `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`
- Wildcard = "brak sygnału", named allow = "explicit yes"
- Identyczny pattern w obu projektach
- **"Tego nie zrobisz w panelu":** WordPress pisze do `robots.txt` przez plugin, ale modyfikacja per-bot wymaga ingerencji w plik fizyczny

---

### 6. H2: Co jest stack-specific (i czego nauczył mnie każdy projekt osobno)
**~400 words**

Dwa pod-przykłady, każdy ~200 słów:

#### Portfolio — `async=true` na inline script to mit
- Pułapka: `s.async = true` dotyczy ściągania, nie inline kodu który tworzy `<script>` w `<head>`
- Inline kod wykonuje się synchronicznie podczas parsowania HTML
- Fix: `requestIdleCallback` + fallback `setTimeout(2000)` dla Safari 16.3-
- Weryfikacja: `performance.getEntriesByType('resource')` → `startTime: 101.6ms`
- **Lekcja:** "lab score ≠ field data" — Lighthouse prod 38 → preview 61 → drugi run 43. Variance jest normalny. Prawdziwa weryfikacja: CrUX z GSC po 2-4 tygodniach.

**Code block 8 (html):** before/after `requestIdleCallback`

#### Qamera — CLS 0.467 → 0.016 przez SSR initial grid
- Marketplace ładował style cards client-side z Airtable bez zarezerwowanych wymiarów
- Trzy opcje: SSR initial grid / reserved card dimensions / combined
- Wybór: SSR — bonus dla GEO (non-JS crawlers widzą content)
- **Lekcja:** "jedna metryka z PSI to sampling" — post-deploy PSI pokazał LCP 14.4s (cold function), Lighthouse MCP: 1.6s (warm). Zawsze re-run lub weryfikuj lokalnie.

---

### 7. H2: Bug, którego audyt nie szukał — i dlaczego to argument za regularnymi audytami
**~300 words**

- Audyt SEO portfolio pokazał, że hreflang post `llm-knowledge-base-brain-karpathy` wskazuje na `/en/blog/<pl-slug>` → "Post not found"
- Root cause: post był PL-only, ale frontmatter miał `alternateSlug: <własny-slug>` — efekt wcześniejszej iteracji blog-article-writer skilla, który autouzupełnił pole bez walidacji
- Łańcuch zdarzeń: user klika przełącznik języka → `getAlternatePost` zwraca ten sam post → LanguageSwitcher buduje `/en/blog/<pl-slug>` → 404
- **Trzy-poziomowa naprawa:** data fix (usuń pole), code defense (`getAlternatePost` odrzuca self-reference + same-lang candidates), process fix (rule w `.claude/rules/data-storage/`)
- **Meta-lekcja (mocna):** audyt SEO uruchamia bug-i, które **nie były jego celem**. Nigdy bym nie znalazł tego bez claude-seo. Argument za regularnym audytem nawet na małym projekcie.
- **Drugi meta-poziom:** bug został wprowadzony przez AI workflow (skill autouzupełnił bez walidacji). Naprawiony przez inny AI workflow (audyt + spec-driven fix + reguła w skillu). To pętla samokorygująca — pod warunkiem, że jest proces.

---

### 8. H2: Wnioski — kompresja czasu jest multiplikatywna, nie addytywna
**~350 words**

- Liczbowo:
  - Portfolio: audyt 15 min + 4h implementacji + 30 min weryfikacji = **5h** dla 5 zmian
  - Qamera: 5 dni roboczych dla 9 zmian. Drugi projekt = ~30% czasu pierwszego dzięki transferowi wzorców
- **Multiplikator:** kodowy stack × dobry AI workflow = godziny. Każdy z osobna nie wystarczy:
  - Sam kodowy stack bez procesu = 2 tygodnie ręcznej pracy
  - Sam AI workflow na zamkniętej platformie = uderzasz w sufit pluginów
  - Razem = kompresja o 80-90%
- 6 takeaways (numbered):
  1. **Kodowy stack daje top 20% kontroli, której pluginy nie dają** — i to ten zakres dziś wygrywa pozycje
  2. **Spec-driven jako feedback loop dla AI** — review specu kosztuje minuty, review 200 linii kodu kosztuje godziny
  3. **Transferowalne (1:1):** llms.txt, schema enrichment, hreflang sitemap-level, AI bot allowlist
  4. **Stack-specific:** każdy framework ma swoje pułapki performance i własne API metadata — tu zaoszczędzisz najmniej
  5. **Audyt znajduje bug-i poza scopem** — `alternateSlug === slug` nigdy nie był na liście, znalazłem przez claude-seo
  6. **Drugi projekt = 30% czasu pierwszego** — pod warunkiem dokumentacji wzorców
- Closing line: "Jeśli zostajesz na WordPressie, ten artykuł nie zmienia twojego życia. Jeśli rozważasz przejście na własny stack, to argument którego potrzebowałeś."

---

### 9. CTA (po wnioskach, przed Resources)

```html
<div class="cta-section">
  <p><strong>Potrzebujesz audytu SEO + GEO na własnym stacku?</strong></p>
  <p>Robię to samo na projektach klientów. <a href="/#contact">Umów konsultację</a> — 30 min, omówimy twój stack i realny scope.</p>
</div>
```

---

### 10. Resources

External:
- [llmstxt.org](https://llmstxt.org/) — spec llms.txt
- [securityheaders.com](https://securityheaders.com/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [MDN — requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [MDN — Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [Sentry Security Reports](https://docs.sentry.io/product/security-policy-reporting/)
- [Google Search Central — Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Qamera AI](https://qamera.ai) — projekt opisany w case study

Internal (już zaplanowane do osadzenia w sekcjach):
- [/blog/opsx-workflow-strukturyzowana-praca-z-ai](/blog/opsx-workflow-strukturyzowana-praca-z-ai) — w sekcji 2 (toolchain)
- [/blog/skills-2-0-multi-agent-system-zarzadzanie-firma](/blog/skills-2-0-multi-agent-system-zarzadzanie-firma) — w sekcji 2 (claude-seo jako specjalizowany skill)
- [/blog/second-brain-obsidian-claude-code-skills](/blog/second-brain-obsidian-claude-code-skills) — w sekcji 7 (proces dokumentowania wzorców)
- [/blog/llm-knowledge-base-brain-karpathy](/blog/llm-knowledge-base-brain-karpathy) — w sekcji 7 (post który złapał alternateSlug bug)
- [/blog/vibe-coding-przewodnik](/blog/vibe-coding-przewodnik) — w sekcji 8 (AI + kontrola = supermoc)

---

## FAQ section (5 questions, ~500 words total)

Each in `<details open><summary><h3>...</h3></summary>...</details>` accordion structure.

1. **Czy każda strona oparta na kodzie jest automatycznie lepsza pod SEO niż WordPress?**
   _Nie — kodowy stack daje **kontrolę**, nie wynik. Bez procesu (audyt → spec → execute → weryfikacja) skończysz z gorszą stroną niż dobrze skonfigurowany WordPress. Argument tego artykułu jest taki: kodowy stack **pozwala** zoptymalizować top 20% (CSP, llms.txt, sitemap-level hreflang, schema enrichment), których platformy nie odsłaniają. Czy to wykorzystasz, zależy od twojego workflow._

2. **Co to jest spec-driven development w kontekście SEO?**
   _Spec-driven = każda zmiana zaczyna się od artefaktów: `proposal.md` (co i dlaczego), `design.md` (jak), `specs/` (kontrakty), `tasks.md` (lista kroków) — **przed** napisaniem kodu. W SEO sprawdza się szczególnie, bo zmiany dotykają wielu warstw (HTTP headers, HTML head, structured data, sitemap), a brak specu = AI generuje 200 linii kodu w niewłaściwym miejscu. Używam OpenSpec / OPSX workflow — szczegóły w [osobnym artykule](/blog/opsx-workflow-strukturyzowana-praca-z-ai)._

3. **Czy `llms.txt` ma sens w 2026, jeśli moja strona nie jest tutorialem AI?**
   _Tak, ale ROI jest niższy. `llms.txt` najmocniej działa dla treści, które LLM-y cytują (tutoriale, dokumentacja, case studies). Dla e-commerce / portfolio impact jest mniejszy, ale wciąż dodatni — koszt to 100-200 linii skryptu Node, korzyść to obecność w grounding ChatGPT / Perplexity / Claude Search. Plik `llms-full.txt` przy 100+ artykułach robi się ciężki — wtedy paginacja albo `top-articles-only`._

4. **Jak wybrać między jednym dużym PR-em a wieloma małymi przy zmianach SEO?**
   _Single-PR ma sens przy single-maintainerze i tematycznie spójnych zmianach (jak portfolio: 5 filarów SEO w jednym PR-ze, 4h pracy). Multi-PR jest konieczny przy wielu maintainerach, monorepo i równoległej pracy (jak Qamera: 9 zmian, 8 PR-ów, 5 dni). Kryterium: czy zmiany dotykają tych samych plików (konflikt = split) i czy review całości jest realny w jednym przejściu (>500 linii diff = split)._

5. **Czy AI workflow zastępuje code review przy zmianach SEO?**
   _Nie — uzupełnia. W Qamerze Copilot review na PR złapał 3 trafne issues (placeholder Sentry DSN, brak preview env var, unused import), których spec-driven workflow nie złapał. AI workflow przyspiesza generację kodu zgodnego ze specem, ale **drugi pair of eyes** (człowiek lub AI reviewer) wciąż łapie różnicę między "kod robi to, co spec mówi" a "kod robi to, co spec mówi, w sposób bezpieczny dla produkcji"._

---

## Code blocks inventory (with language tags)

| # | Section | Language | Content |
|---|---|---|---|
| 1 | §1 | `text` | Lista nagłówków HTTP, których nie ustawisz w typowym hostingu WordPress |
| 2 | §2 | `text` | ASCII diagram pętli OPSX |
| 3 | §2 | `bash` | Sekwencja komend (claude-seo + opsx) |
| 4 | §4 | `text` | Fragment `tasks.md` z portfolio |
| 5 | §5A | `text` | Struktura `llms.txt` |
| 6 | §5B | `json` | Before/after JSON-LD diff |
| 7 | §5C | `xml` | Sitemap fragment z `xhtml:link` |
| 8 | §6 (portfolio) | `html` | Before/after `requestIdleCallback` |

**8 code blocks total, all with language tags.** No bare ` ``` ` blocks.

---

## SEO keywords

- **Primary:** `spec-driven SEO`, `Qamera AI`, `WordPress SEO ograniczenia`
- **Secondary:** `llms.txt`, `OpenSpec workflow`, `Claude Code SEO`, `Next.js 16 SEO`, `Vite SEO`, `GEO 2026`, `Content-Security-Policy`, `hreflang sitemap`
- **Long-tail (z briefów):** `audyt SEO Claude Code`, `spec-driven SEO workflow`, `AI bot allowlist`, `requestIdleCallback inline script`

Keywords w nagłówkach H2:
- §1: "platforma vs kod"
- §2: "Toolchain"
- §3: "audyt", "claude-seo"
- §5: "transferuje się 1:1"
- §6: "stack-specific"
- §8: "kompresja czasu"

Title: zawiera `WordPress`, `spec-driven SEO`, `portfolio`, `Qamera AI` — cztery różne intencje wyszukiwania.

---

## Language guidelines

- Polish narrative + English technical terms inline (matches Pawel's style)
- **Nigdy nie polonizować:** `requestIdleCallback`, `Content-Security-Policy`, `xhtml:link`, `generateMetadata`, `claude-seo`, `OpenSpec`, `worktree`, `feedback loop`, `multiplikator` (← to jest OK po polsku)
- **Polonizować:** opisy procesu, narracja, lessons learned, FAQ
- **Pogrubienia:** kluczowe pojęcia przy pierwszym użyciu (**spec-driven**, **toolchain**, **multiplikator**, etc.) i kluczowe liczby (**5h**, **30%**, **80-90%**)
- **Akapity:** 2-4 zdania
- **First-person** (`zoptymalizowałem`, `znalazłem`, `użyłem`)

---

## Technical accuracy checklist

- [ ] `requestIdleCallback` Safari support: 16.4+ (March 2023) — fallback `setTimeout(2000)` claim correct for older Safari
- [ ] llmstxt.org spec exists since 2024 (Answer.AI / Jeremy Howard) — confirm via [llmstxt.org](https://llmstxt.org/) before publish
- [ ] Sentry CSP reporting endpoint URL pattern — confirm with `vercel env ls` output
- [ ] `@danielsogl/lighthouse-mcp` package exists — verify via npm before mention
- [ ] Next.js 16 `Metadata.alternates.languages` API — verify via Context7 or [Next.js docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [ ] `xhtml:link` in sitemap — Google official spec confirmation
- [ ] AI bot user-agent strings (`GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`) — verify against latest provider docs
- [ ] Numbers from briefs cross-checked against actual PRs (#2, #3 in portfolio repo; #75-96 in Qamera repo)

→ Verify during execute phase, not now.

---

## Asset prep

- **OG image:** `public/images/og-spec-driven-seo-portfolio-qamera-ai.webp` (1200×630)
  - Generate via `/blog-article-writer:generate-og-prompt` (Gemini API) after execute
  - Alternative: hand-crafted Figma → PNG → `node scripts/convert-to-webp.js`
- **Optional inline images:**
  - securityheaders.com before/after (C → A) — z PR #2 verification
  - Rich Results Test panel — 0 warnings
  - sitemap.xml diff visualization

---

## Internal cross-links to add (in body)

| Anchor | Target | Section |
|---|---|---|
| OPSX workflow | `/blog/opsx-workflow-strukturyzowana-praca-z-ai` | §2 + FAQ Q2 |
| Skills 2.0 | `/blog/skills-2-0-multi-agent-system-zarzadzanie-firma` | §2 |
| Second Brain | `/blog/second-brain-obsidian-claude-code-skills` | §7 |
| Karpathy LLM Wiki | `/blog/llm-knowledge-base-brain-karpathy` | §7 (the post that triggered the bug) |
| Vibe coding | `/blog/vibe-coding-przewodnik` | §8 |

---

## Word count budget (verify in execute)

| Section | Target |
|---|---|
| Hook (no H2) | 250 |
| §1 Platforma vs kod | 350 |
| §2 Toolchain | 400 |
| §3 Audyt | 450 |
| §4 Change proposal | 400 |
| §5 Transferowalne | 550 |
| §6 Stack-specific | 400 |
| §7 Bug bonus | 300 |
| §8 Wnioski | 350 |
| FAQ | 500 |
| **Total** | **3950** |

**Note:** target 3000-3400, current plan 3950. **Cut targets in execute:** §3 → 350, §5 → 450, §8 → 280. Final ~3300.

---

## Success criteria — checklist

- [x] Plan artifact created with full structure
- [x] Next blog ID determined (25)
- [x] Frontmatter completely specified
- [x] All main sections outlined with word targets
- [x] FAQ section planned (5 questions)
- [x] Code examples identified with language tags (8 blocks)
- [x] Language guidelines noted (no polonization rules)
- [x] SEO keywords identified
- [x] Internal links mapped
- [x] Ready for execution phase

## Next command

```
/blog-article-writer:execute
```
