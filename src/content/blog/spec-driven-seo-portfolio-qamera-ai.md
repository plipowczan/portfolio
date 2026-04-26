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
alternateSlug: spec-driven-seo-portfolio-qamera-ai-case-study
---

## Dwa projekty, dwa stacki, jedna pętla pracy

W ciągu dwóch tygodni zoptymalizowałem SEO na dwóch radikalnie różnych projektach. **Portfolio** ([pawel.lipowczan.pl](https://pawel.lipowczan.pl)) — Vite 7 + React 19 SPA z prerenderem. Audyt znalazł 10 findings, naprawiłem pięć z nich w jedno popołudnie. Securityheaders.com przeszedł z **C na A**, Rich Results Test z **5 warnings na 0**, sitemap dostał per-URL `lastmod` zamiast jednego build timestampa dla 73 URL-i.

**Qamera AI** ([qamera.ai](https://qamera.ai)) — mój SaaS do AI product photography, Next.js 16 App Router + Turborepo + Vercel + Supabase + i18n EN/PL/UK. Audyt zwrócił health score **56/100**. W pięć dni roboczych zamknąłem **dziewięć spec-driven changes** (siedem planowanych + dwa wykryte po drodze), które rozwiązały wszystkie "Critical" findings. CLS na `/marketplace/styles` spadł z **0.467 do 0.016** — 27× poprawa. Hreflang pokrycie urosło z "tylko docs" do **20 static marketing paths plus docs**. Homepage dostał trzy bloki JSON-LD (Organization + WebSite + SoftwareApplication), pricing kolejne trzy (Product × 2 + FAQPage).

Centralna teza tego artykułu jest prosta i niewygodna dla części czytelników: **pełna kontrola nad SEO i GEO jest możliwa tylko przy stacku opartym na kodzie**. WordPress, Webflow i Wix dają wtyczki — nie dają nagłówka `Content-Security-Policy` z reportingiem do Sentry, nie dają `xhtml:link` na poziomie sitemapy, nie dają `requestIdleCallback` w `<head>`, nie dają `llms.txt` generowanego z własną logiką build-time. Drugi multiplikator: dobry **AI workflow** — brainstorm → spec → execute → review → test. Sam kodowy stack bez procesu = dwa tygodnie ręcznej pracy. Sam AI workflow na zamkniętej platformie = uderzasz w sufit pluginów. Razem = godziny.

Pokażę proces na obu projektach. Zobaczysz, co transferuje się 1:1, a co wymaga innych decyzji per stack.

## Dlaczego "platforma vs kod" to dziś nie debata o cenie hostingu

Pięć lat temu wybór między WordPressem a własnym kodem był pragmatyczny. WordPress dawał motywy, pluginy, ekosystem, panel dla nietechnicznego klienta. Vercel z własnym frameworkiem był overkillem dla 80% projektów.

W 2026 te proporcje się przesunęły. **SEO przesunęło się w stronę GEO** (Generative Engine Optimization) — ChatGPT web search, Perplexity, Claude Search i Gemini Deep Research czytają twoje strony, ale inaczej niż Googlebot. Respektują [llmstxt.org](https://llmstxt.org/) spec, ważą `author.name` i `datePublished` w JSON-LD przy wyborze źródeł, preferują "factual-definition opener" w pierwszych 150 słowach. Security headers stały się sygnałem zaufania. Core Web Vitals weryfikuje field data z CrUX, nie lab score z Lighthouse. Schema enrichment przekłada się na rich results w SERP.

Co WordPress / Webflow daje w 2026: SEO plugin (Yoast, Rank Math), basic schema dla Article i Product, sitemap generowany automatycznie, redirecty, `meta description`. To około **80% potrzeb** dla typowej strony firmowej.

Czego nie daje (lub daje z bardzo dużą walką):

```text
- Content-Security-Policy Report-Only z reportingiem do Sentry
- Permissions-Policy per-page (geolocation, camera, microphone, payment)
- requestIdleCallback dla third-party scriptów zamiast async=true
- xhtml:link w sitemapie (nie tylko hreflang w head)
- llms.txt / llms-full.txt z własną logiką generacji
- BlogPosting z mainEntityOfPage + publisher (raster logo) + ISO 8601 datetime
- Per-bot reguły w robots.txt (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- Sitemap lastmod per page-type (post: frontmatter.modified, listing: max, legal: git mtime)
```

To jest top 20% kontroli. I to dokładnie ten zakres, w którym dziś wygrywasz pozycje — w klasycznym SERP i w odpowiedziach LLM-ów. Pluginy domykają top 80%. Top 20% wymaga edycji nagłówków HTTP, struktury HTML w `<head>`, własnego buildera artefaktów. Tego nie robisz w admin panelu — bo admin panel celowo nie odsłania tych warstw.

## Toolchain — pięć narzędzi, jedna pętla

Używam tych samych pięciu narzędzi na każdym projekcie SEO. Każde z osobna jest zwykłe. Razem tworzą pętlę, która kompresuje czas o 80-90%.

| Narzędzie                                                        | Rola                                                                                            |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **`claude-seo`** plugin (20+ sub-skilli)                         | Audyt jako pierwsza komenda — technical, GEO, schema, performance, hreflang, AI discoverability |
| **OPSX / OpenSpec**                                              | Spec-driven workflow — `proposal.md` → `design.md` → `specs/` → `tasks.md` przed kodem          |
| **Lighthouse MCP**                                               | Lab CWV i LCP opportunities z poziomu agenta, bez przełączania kontekstu do PageSpeed           |
| **Rich Results Test + securityheaders.com + Sentry CSP Reports** | Weryfikacja na każdym kroku                                                                     |
| **Git worktrees**                                                | Równoległa praca nad niezależnymi changes (gdy projekt na to pozwala)                           |

OPSX opisałem szerzej w [osobnym artykule o strukturyzowanym podejściu do AI workflow](/blog/opsx-workflow-strukturyzowana-praca-z-ai). `claude-seo` to przykład **specjalizowanego skilla** w sensie z [posta o Skills 2.0](/blog/skills-2-0-multi-agent-system-zarzadzanie-firma) — domain-specific knowledge plus checklist plus pre-built sub-skille.

Pętla pracy wygląda tak samo na każdym projekcie:

```text
┌─────────┐    ┌──────────┐    ┌────────┐    ┌───────┐
│  Audit  │ →  │ Proposal │ →  │ Design │ →  │ Specs │
└─────────┘    └──────────┘    └────────┘    └───────┘
                                                  │
┌─────────┐    ┌────────┐    ┌──────────┐    ┌───▼───┐
│ Archive │ ←  │ Verify │ ←  │ Implement│ ←  │ Tasks │
└─────────┘    └────────┘    └──────────┘    └───────┘
```

Typowa sekwencja komend:

```bash
# Faza 1: audyt
/claude-seo:seo

# Faza 2: change proposal
/opsx:new "seo-improvements"
/opsx:ff   # fast-forward — wszystkie planning artifacts naraz

# Faza 3: implementacja
/opsx:apply

# Faza 4: weryfikacja
/opsx:verify
# manualnie: securityheaders.com, Rich Results Test, Lighthouse MCP

# Faza 5: archiwizacja
/opsx:archive
```

Każde z tych narzędzi działa **dlatego, że substratem jest kod**. Audyt może czytać dowolny plik źródłowy i raw output `<head>`. OPSX może edytować `vite.config.js`, `next.config.ts`, `vercel.json`, `robots.txt` w jednej sesji. Weryfikatory dostają pełny output bez sandboxa. To nie jest przypadek — to konsekwencja architektury.

## Audyt — co znajduje claude-seo na dwóch radikalnie różnych projektach

Pierwsza obserwacja, która mnie zaskoczyła: **claude-seo zwraca ten sam zestaw kategorii znalezisk niezależnie od stacku**. Różny jest tylko sposób ich naprawy.

| Projekt   | Stack                           | Findings                                            | Stan początkowy                            |
| --------- | ------------------------------- | --------------------------------------------------- | ------------------------------------------ |
| Portfolio | Vite 7 + React 19 + Vercel      | 10 (4 perf, 2 schema, 2 security, 1 sitemap, 1 GEO) | securityheaders C, Rich Results 5 warnings |
| Qamera AI | Next.js 16 + Turborepo + Vercel | 7 + 2 wykryte podczas                               | health score 56/100                        |

Wspólne kategorie znalezisk, które transferują się 1:1 między stackami:

- **Brak lub niekompletny `llms.txt`** — biggest miss na GEO readiness w obu projektach
- **Schema enrichment** — brakujący `publisher`, `dateModified`, `mainEntityOfPage`, ISO 8601 datetime
- **Hreflang tylko head-level**, brak `xhtml:link` w sitemap dla klasteryzacji wariantów językowych
- **Security headers** — deprecated `X-XSS-Protection`, brak `Permissions-Policy`, brak HSTS preload, brak CSP
- **AI bot allowlist** to wildcard — co dla `Google-Extended` i `GPTBot` oznacza "brak sygnału", nie "allow"

Stack-specific findings, które wymagają innych decyzji:

- **Portfolio:** `clickrank.ai` synchroniczny w `<head>` blokuje parser przed First Paint, sitemap z 73 URL-ami i jedną datą `lastmod`, `articleBody: post.excerpt` semantycznie błędne w `BlogPosting`
- **Qamera:** CLS 0.467 na `/marketplace/styles` przez client-side fetch z Airtable bez zarezerwowanych wymiarów kart, hardcoded EN strings w `root-metadata.ts` (PL/UK użytkownicy dostawali angielski OG na każdej marketingowej), Merchant Listings false-positive na pricing

Wspólny zestaw znalezisk to **pierwszy dowód, że proces jest transferowalny**. Zna mnie kilka pluginów SEO i każdy z nich na obu projektach zwróciłby fundamentalnie różne raporty, bo każdy jest zwiazany z konkretną platformą. Audyt agenta na neutralnym substracie — kodzie — zwraca uniwersalny obraz.

## Od audytu do change proposal — kiedy bundlować, kiedy splitować

Dwa projekty, dwie różne strategie packagingu zmian.

**Portfolio** dostało jeden change `seo-improvements` z pięcioma filarami w jednym PR-ze ([#2](https://github.com/plipowczan/portfolio/pull/2)). Single-maintainer, brak ryzyka konfliktu plików, łatwiejszy review całości — bo zmiany są logicznie związane tematycznie.

**Qamera** dostała dziewięć osobnych changes, osiem PR-ów (#75/76/77/82/92/93/94/96), pracowanych równolegle na worktree'ach git. Multi-developer, monorepo, disjoint file sets. Worktrees pozwoliły każdej zmianie mieć własne `node_modules` i własny port dev servera — zero konfliktu state.

Kryterium decyzyjne, którego używam:

| Czynnik                   | One-PR (portfolio) | Multi-PR (Qamera)              |
| ------------------------- | ------------------ | ------------------------------ |
| Liczba maintainerów       | 1                  | 2+                             |
| Ryzyko konfliktu plików   | niskie             | wysokie                        |
| Cykl review               | self-review        | code review przez wspólnika    |
| Rozkład czasowy           | jedno popołudnie   | 5 dni roboczych                |
| Rollback granularity      | całość lub nic     | per-feature                    |
| Dev environment isolation | nie potrzebna      | worktree + osobne node_modules |

Wspólne dla obu: każda zmiana = OPSX `proposal.md` + `design.md` + `specs/` + `tasks.md` **przed** kodem. To nie biurokracja. To **feedback loop dla AI**: review specu kosztuje minuty, review 200 linii wygenerowanego kodu w niewłaściwym miejscu kosztuje godziny. Spec-driven daje ci punkt weta, zanim zapłacisz koszt implementacji.

```text
## Tasks — seo-improvements

- [x] Move clickrank inline to requestIdleCallback (+ setTimeout fallback)
- [x] Generate dedicated raster logo (600×60 PNG via sharp)
- [x] Add publisher / dateModified / mainEntityOfPage to BlogPosting
- [x] Drop articleBody: excerpt (semantically wrong)
- [x] Build llms.txt / llms-full.txt generator (scripts/generate-llms-txt.js)
- [x] Replace X-XSS-Protection with Permissions-Policy + HSTS preload
- [x] Configure CSP Report-Only → Sentry Security Reports bucket
- [x] Per-page-type lastmod (post: frontmatter.modified, listing: max, legal: git mtime)
```

Każdy task w `tasks.md` to jedna jednostka pracy o znanym scope i znanym sposobie weryfikacji. Po implementacji checkbox jest dowodem, że task został wykonany — nie deklaracją.

## Co transferuje się 1:1 (i dlaczego to argument za kodem)

Cztery rzeczy, które zaimplementowałem w identycznym wzorcu na portfolio i w Qamerze. Każda byłaby trudna lub niemożliwa na zamkniętej platformie.

### A. `llms.txt` jako własny artefakt build-time

Spec [llmstxt.org](https://llmstxt.org/) istnieje od 2024 roku (Answer.AI / Jeremy Howard). W 2026 ChatGPT web search, Perplexity, Claude Search i Gemini Deep Research go respektują. Plik to skrócony index treści dla LLM, z opcjonalnym `llms-full.txt` zawierającym pełną treść do single-token ingest.

Na portfolio mam `scripts/generate-llms-txt.js` uruchamiany w `build:prerender`. Czyta `src/content/blog/*.md` (PL + EN) przez `gray-matter`, plus `src/data/projects.js`. Generuje `public/llms.txt` (~16 KB index) i `public/llms-full.txt` (~800 KB pełna treść z separatorem `\n\n---\n\n`).

```text
# Pawel Lipowczan

> Architekt oprogramowania i doradca ds. technologii...

## Blog (PL)
- [Tytuł](url): jednozdaniowy opis
...

## Blog (EN)
- [Title](url): one-line description
...

## Kontakt
- email: ...
```

W Qamerze bliźniaczy skrypt w workspace `apps/web` generuje `llms.txt` z marketingowych stron, blog postów i public docs. Logika jest inna (źródła danych, struktura sekcji), ale wzorzec — build-time generator zgodny ze spec — identyczny.

**Tego nie zrobisz w panelu:** plugin WordPressa może wyplunąć statyczny `llms.txt`, ale nie zaintegrujesz go z własnym CMS-em na własnych warunkach (kolejność sekcji per język, fallback dla brakujących `description`, paginacja przy 100+ artykułach).

### B. Schema enrichment — `articleBody: excerpt` to semantyczny błąd

Mój stary `BlogPosting` miał sześć pól. Rich Results Test pokazywał pięć non-critical warnings. Po enrichmencie — jedenaście pól, zero warnings.

```json
{
  "@type": "BlogPosting",
  "headline": "...",
  "description": "pierwsze 300 znaków contentu lub frontmatter.description",
  "author": {
    "@type": "Person",
    "name": "Pawel Lipowczan",
    "url": "https://pawel.lipowczan.pl"
  },
  "datePublished": "2026-01-15T00:00:00Z",
  "dateModified": "2026-04-21T00:00:00Z",
  "image": "...",
  "url": "...",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "..." },
  "publisher": {
    "@type": "Organization",
    "name": "Pawel Lipowczan",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pawel.lipowczan.pl/logo-schema.png"
    }
  }
}
```

Trzy nieoczywiste detale: `articleBody: post.excerpt` jest **semantycznie błędne** (spec wymaga pełnej treści, nie skrótu) — wyciąłem to pole zupełnie. `publisher.logo` musi być **rasterem** (PNG 600×60), nie SVG. ISO 8601 z `Z` lub offsetem, nie `2026-01-15` bez strefy. W Qamerze identyczny zestaw zmian dotknął `Article` na `/blog`, `Service` na `/offer/*` i `Product` na `/pricing`.

**Tego nie zrobisz w panelu:** SEO pluginy ustawiają top sześć pól. `mainEntityOfPage`, `publisher.logo` jako oddzielny raster, ISO datetime, `description` z fallback do pierwszego akapitu — to ręczna robota w generatorze schema.

### C. Hreflang na poziomie sitemapy, nie tylko `<head>`

Next.js `Metadata.alternates.languages` to head-level signal. Google preferuje **sitemap-level `xhtml:link`** dla klasteryzacji wariantów językowych. W Qamerze rozwiązaliśmy to wspólnym helperem `buildLanguageAlternates(pathname)` używanym z dwóch miejsc — `sitemap.ts` i każdego `generateMetadata` per page.

```xml
<url>
  <loc>https://qamera.ai/pricing</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://qamera.ai/pricing"/>
  <xhtml:link rel="alternate" hreflang="pl" href="https://qamera.ai/pl/pricing"/>
  <xhtml:link rel="alternate" hreflang="uk" href="https://qamera.ai/uk/pricing"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://qamera.ai/pricing"/>
</url>
```

Drift-guard test w CI failuje, gdy ktoś doda ścieżkę do sitemap, a nie doda `alternates` do `page.tsx`. To zabezpieczenie przed silent regression — bardzo łatwo dodać nowy landing i zapomnieć o jego wariancie językowym.

**Tego nie zrobisz w panelu:** Yoast generuje hreflang w head. Sitemap-level wymaga edycji generatora sitemapy plus drift-guard — czyli kodu w CI.

### D. AI bot allowlist — named rules zamiast wildcard

`robots.txt` z osobnymi blokami dla `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` i `CCBot`. Wildcard = "brak sygnału" — bot interpretuje to konserwatywnie. Named allow = "explicit yes" — bot wie, że może crawl-ować i indeksować dla swojego pipeline.

**Tego nie zrobisz w panelu:** WordPress pisze do `robots.txt` przez plugin, ale per-bot reguły wymagają edycji pliku fizycznego — czyli dostępu do filesystem, którego nie masz w typowym shared hostingu.

## Co jest stack-specific (i czego nauczył mnie każdy projekt osobno)

### Portfolio — `async=true` na inline script to mit

Ten finding zaskoczył mnie najbardziej, bo wszyscy się mylą. Skrypt `clickrank.ai` w `<head>` wyglądał tak:

```html
<script>
  var s = document.createElement("script");
  s.src = "https://js.clickrank.ai/...";
  s.async = true;
  document.head.appendChild(s);
</script>
```

Pułapka: `async=true` dotyczy **ściągania** skryptu, ale sam inline kod, który go tworzy, wykonuje się **synchronicznie podczas parsowania HTML**. Dodaje microtask do event loopa, zanim browser wyrenderuje cokolwiek.

Fix — `requestIdleCallback` plus fallback dla Safari 16.3 i starszych:

```html
<script>
  (function () {
    var inject = function () {
      /* current logic */
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(inject, { timeout: 3000 });
    } else {
      setTimeout(inject, 2000);
    }
  })();
</script>
```

Weryfikacja po deploy na prod: `performance.getEntriesByType('resource').filter(r => r.name.match(/clickrank/))` → `startTime: 101.6ms`. Browser zgłosił idle po ~100ms i dopiero wtedy odpalił callback. Lighthouse lab score variance pozostała duża (post: prod 38 → preview 61 → drugi run 43) — **lab score ≠ field data**. Prawdziwa weryfikacja to CrUX z Google Search Console po 2-4 tygodniach.

### Qamera — CLS 0.467 → 0.016 przez SSR initial grid

`/marketplace/styles` pokazywał karty stylów ładowane client-side z Airtable. Bez zarezerwowanych wymiarów grid layout shiftował się 4× ponad próg failing (0.467 vs cel ≤ 0.1). Trzy opcje fixu — SSR initial grid, reserved card dimensions, combined. Wybraliśmy **SSR**: bonus dla GEO (non-JS crawlers widzą content) plus eliminacja CLS u źródła.

Rezultat: **CLS 0.016** (27× poprawa), LCP 2.4s → 1.6s. Twist post-deploy: PageSpeed Insights pokazał LCP 14.4s (cold Vercel function), Lighthouse MCP równolegle 1.6s (warm). **Jedna metryka z PSI to sampling.** Zawsze re-run lub weryfikuj lokalnie.

## Bug, którego audyt nie szukał — i dlaczego to argument za regularnymi audytami

Audyt SEO portfolio wyrzucił finding, którego się nie spodziewałem: hreflang alternatywy dla posta `llm-knowledge-base-brain-karpathy` wskazywały na `/en/blog/<pl-slug>`, który zwraca "Post not found".

Root cause: post był **PL-only** (brak EN wersji), ale jego frontmatter miał `alternateSlug: llm-knowledge-base-brain-karpathy` — wskazujący sam na siebie. Efekt wcześniejszej iteracji blog-article-writer skilla, który **autouzupełnił pole bez walidacji**. Łańcuch zdarzeń:

1. User na PL poście klika przełącznik języka
2. `getAlternatePost(currentSlug)` zwraca... ten sam PL post
3. LanguageSwitcher buduje `/en/blog/<pl-slug>` i nawiguje
4. `BlogPostPage` filtruje `getPostsByLang("en")` → brak match → "Post not found"
5. Sitemap dziedziczy ten bug jako bad hreflang, propaguje do Google

Trzy-poziomowa naprawa: **data fix** (usunięcie pola), **code defense** (`getAlternatePost` odrzuca self-reference i same-lang candidates), **process fix** (reguła w `.claude/rules/data-storage/` plus update walidatora w blog-article-writer skillu).

Meta-lekcja jest mocna: audyt SEO uruchamia bug-i, **które nie były jego celem**. Nigdy bym nie znalazł tego bez claude-seo. To argument za regularnym audytem nawet na małym projekcie.

Drugi meta-poziom — bug został **wprowadzony przez AI workflow** (blog-article-writer skill), naprawiony przez **inny AI workflow** (audyt + spec-driven fix + reguła w skillu). To pętla samokorygująca pod warunkiem, że jest proces. Bez procesu — bug żyłby tygodniami. Pokrewny wątek o tym, jak agent pilnuje swoich własnych standardów, opisałem szerzej w [poście o LLM Wiki Karpathy'ego](/blog/llm-knowledge-base-brain-karpathy) i [Second Brain z Obsidian i Claude Code](/blog/second-brain-obsidian-claude-code-skills).

## Kompresja czasu jest multiplikatywna, nie addytywna

Liczbowo:

- **Portfolio:** audyt 15 min + 4h implementacji + 30 min weryfikacji = **5h** dla 5 zmian
- **Qamera:** **5 dni roboczych** dla 9 zmian (siedmiu planowanych + dwóch wykrytych po drodze)
- **Drugi projekt = ~30% czasu pierwszego** dzięki transferowi wzorców (llms.txt, schema enrichment, hreflang sitemap, AI bot allowlist)

Multiplikator: **kodowy stack × dobry AI workflow = godziny**. Każdy z osobna nie wystarczy. Sam kodowy stack bez procesu = dwa tygodnie ręcznej pracy z forami i Stack Overflow. Sam AI workflow na zamkniętej platformie = uderzasz w sufit pluginów po pół godziny. Razem dają kompresję o 80-90%. To nie jest addytywne — to mnożenie. Argument, dla którego coraz częściej wybieram kodowe rozwiązania, opisałem też w [przewodniku po vibe codingu](/blog/vibe-coding-przewodnik).

Sześć takeaways z obu projektów:

1. **Kodowy stack daje top 20% kontroli, której pluginy nie dają** — i to ten zakres dziś wygrywa pozycje
2. **Spec-driven jako feedback loop dla AI** — review specu kosztuje minuty, review 200 linii kodu kosztuje godziny
3. **Transferowalne 1:1 między stackami:** llms.txt, schema enrichment, hreflang sitemap-level, AI bot allowlist
4. **Stack-specific:** każdy framework ma swoje pułapki performance i własne API metadata — tu zaoszczędzisz najmniej
5. **Audyt znajduje bug-i poza swoim scopem** — `alternateSlug === slug` nigdy nie był na liście, znalazłem przez claude-seo
6. **Drugi projekt = 30% czasu pierwszego** — pod warunkiem dokumentacji wzorców

Jeśli zostajesz na WordPressie — ten artykuł nie zmienia twojego życia. Jeśli rozważasz przejście na własny stack, to argument, którego potrzebowałeś.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Potrzebujesz audytu SEO + GEO na własnym stacku?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Robię to samo na projektach klientów — od audytu przez spec-driven changes po post-deploy verification. Omówimy twój stack i realny scope w 30 minut.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Przydatne zasoby

- [llmstxt.org](https://llmstxt.org/) — spec llms.txt
- [securityheaders.com](https://securityheaders.com/) — skaner nagłówków bezpieczeństwa
- [Rich Results Test](https://search.google.com/test/rich-results) — walidator structured data Google
- [PageSpeed Insights](https://pagespeed.web.dev/) — Core Web Vitals lab + field data
- [MDN — requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [MDN — Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [Sentry Security Reports](https://docs.sentry.io/product/security-policy-reporting/) — CSP reports via Sentry
- [Google Search Central — Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Qamera AI](https://qamera.ai) — projekt opisany w case study

## FAQ

<details open>
<summary>

### Czy każda strona oparta na kodzie jest automatycznie lepsza pod SEO niż WordPress?

</summary>

Nie — kodowy stack daje **kontrolę**, nie wynik. Bez procesu (audyt → spec → execute → weryfikacja) skończysz z gorszą stroną niż dobrze skonfigurowany WordPress z Yoastem. Argument tego artykułu jest taki: kodowy stack **pozwala** zoptymalizować top 20% (CSP, llms.txt, sitemap-level hreflang, schema enrichment), których platformy nie odsłaniają. Czy to wykorzystasz, zależy od twojego workflow.

</details>

<details open>
<summary>

### Co to jest spec-driven development w kontekście SEO?

</summary>

Spec-driven oznacza, że każda zmiana zaczyna się od artefaktów: `proposal.md` (co i dlaczego), `design.md` (jak), `specs/` (kontrakty), `tasks.md` (lista kroków) — **przed** napisaniem kodu. W SEO sprawdza się szczególnie, bo zmiany dotykają wielu warstw (HTTP headers, HTML head, structured data, sitemap), a brak specu = AI generuje 200 linii kodu w niewłaściwym miejscu. Używam OpenSpec / OPSX workflow — szczegóły w [osobnym artykule](/blog/opsx-workflow-strukturyzowana-praca-z-ai).

</details>

<details open>
<summary>

### Czy llms.txt ma sens w 2026, jeśli moja strona nie jest tutorialem AI?

</summary>

Tak, ale ROI jest niższy. `llms.txt` najmocniej działa dla treści, które LLM-y cytują (tutoriale, dokumentacja, case studies). Dla e-commerce lub portfolio impact jest mniejszy, ale wciąż dodatni — koszt to 100-200 linii skryptu Node, korzyść to obecność w grounding ChatGPT, Perplexity i Claude Search. Plik `llms-full.txt` przy 100+ artykułach robi się ciężki — wtedy paginacja albo `top-articles-only`.

</details>

<details open>
<summary>

### Jak wybrać między jednym dużym PR-em a wieloma małymi przy zmianach SEO?

</summary>

Single-PR ma sens przy single-maintainerze i tematycznie spójnych zmianach (jak portfolio: 5 filarów SEO w jednym PR-ze, 4h pracy). Multi-PR jest konieczny przy wielu maintainerach, monorepo i równoległej pracy (jak Qamera: 9 zmian, 8 PR-ów, 5 dni). Kryterium: czy zmiany dotykają tych samych plików (konflikt = split) i czy review całości jest realny w jednym przejściu (>500 linii diff = split).

</details>

<details open>
<summary>

### Czy AI workflow zastępuje code review przy zmianach SEO?

</summary>

Nie — uzupełnia. W Qamerze Copilot review na PR złapał trzy trafne issues (placeholder Sentry DSN, brak preview env var, unused import), których spec-driven workflow nie złapał. AI workflow przyspiesza generację kodu zgodnego ze specem, ale **drugi pair of eyes** (człowiek lub AI reviewer) wciąż łapie różnicę między "kod robi to, co spec mówi" a "kod robi to, co spec mówi, w sposób bezpieczny dla produkcji".

</details>
