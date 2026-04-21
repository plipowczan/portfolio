## Context

Portfolio pawel.lipowczan.pl to bilingual (PL/EN) SPA na React 19 + Vite 7, deployowana na Vercel z prerenderem Puppeteer (`scripts/prerender.mjs`). Audyt SEO z 2026-04-20 + spike weryfikacyjny z 2026-04-21 pokazały, że prerender działa poprawnie, ale drugi rzut findings (performance, schema, GEO, security, sitemap hygiene) wymaga interwencji. Ten change agreguje pięć niezależnych obszarów w jeden PR — projekt jest mały, single-maintainer, review całościowe jest prostsze niż pięć osobnych gałęzi.

## Goals / Non-Goals

**Goals:**
- Zmniejszyć koszt CWV skryptu `clickrank.ai` (zdjąć z krytycznej ścieżki renderu).
- Wzbogacić `BlogPosting` JSON-LD do poziomu, który przechodzi Rich Results Test bez ostrzeżeń.
- Wystawić portfolio jako AI-friendly w zgodzie ze spec llmstxt.org.
- Zmodernizować security headers (poziom 2026, bez deprecated).
- Przywrócić sygnał świeżości treści w `sitemap.xml`.

**Non-Goals:**
- CSP enforcing — ten change wprowadza tylko Report-Only, enforcing to osobny change po analizie logów.
- Migracja `StructuredData.jsx` z useEffect do Helmet — spike potwierdził, że Puppeteer łapie dynamicznie wstrzykiwane `<script type="application/ld+json">` do snapshotu, więc YAGNI.
- Refaktor całego systemu prerenderingu.
- Dodanie `alternateName`, `sameAs`, `knowsAbout` do Person schema (kiedyś, osobno).
- Usuwanie `priority`/`changefreq` z sitemap (harmless, Bing je czyta).

## Decisions

### 1. `clickrank.ai`: `requestIdleCallback` + `setTimeout(2000)` fallback

Obecny kod w `index.html` wstrzykuje `<script>` przez JS synchronicznie w `<head>`. Mimo `async=true` sam kod inline blokuje parser HTML i dodaje zadanie do event loopa przed First Paint.

**Rozwiązanie:** opakować injection w:
```js
const inject = () => { /* current logic */ };
if ('requestIdleCallback' in window) {
  requestIdleCallback(inject, { timeout: 3000 });
} else {
  setTimeout(inject, 2000);
}
```

**Rationale:** `requestIdleCallback` najlepiej kosztuje nic użytkownikowi (odpala się w pierwszej wolnej chwili przeglądarki). Timeout 2s w fallbacku dla Safari (wsparcie od 16.4 niepełne) zapewnia, że clickrank i tak się załaduje — tracking użytkowników zamykających stronę w <2s jest i tak szumem.

### 2. BlogPosting: `description` = frontmatter `description` || pierwszy akapit

Frontmatter może ale nie musi mieć pola `description` (nowe, opcjonalne). Jeśli autor je poda — używane 1:1. Jeśli nie — generator wyciąga pierwszy akapit treści (pierwsze `#` zakończone `\n\n`), trimuje do ~300 znaków na granicy słowa, dodaje `…` jeśli obciął.

**Rationale:** Autor dostaje pełną kontrolę tam gdzie chce ją mieć; pozostałe 25 postów nie wymaga migracji. `excerpt` zostaje bez zmian (używany jako SEO `<meta description>`), bo to inny use case — krótki summary dla SERP vs dłuższy semantyczny description dla schema.

### 3. BlogPosting: `dateModified` = frontmatter `modified` || `date`

Git mtime odrzucone (false positives przy kosmetycznych edycjach). Build timestamp odrzucone (fałszywy sygnał przy każdym deployu). `modified` we frontmatterze to świadoma decyzja autora — dokładnie ten sygnał, który Google chce widzieć.

**Rationale:** Żadnych zmian w istniejących postach (fallback do `date`), zero false positives, koszt: autor musi pamiętać o polu przy realnych zmianach treści. Spójność z `sitemap.xml` `lastmod` (ta sama logika).

### 4. Publisher: `Organization` z dedykowanym logo PNG

Dla personal brand `publisher` = `Organization { name: "Pawel Lipowczan", logo: ... }`. Google Rich Results Test wymaga `publisher.logo` jako `ImageObject` z URL do rastra (nie SVG). Obecny `public/logo.svg` nie spełnia wymagania.

**Decyzja:** nowy asset `public/logo-schema.png` o wymiarach 600×60 (landscape, zgodne z wymaganiami Google dla `logo.url` w article schema — min 112px wysokości, szerokość elastyczna). Konwersja z istniejącego `logo.svg` w taskach.

**Rationale:** 600×60 to bezpieczny format (wchodzi w AMP/non-AMP limits jeśli kiedyś AMP), spełnia min 112px. Alternative 112×112 square byłoby OK ale brand jest tekstowy, landscape lepszy.

### 5. `llms.txt` + `llms-full.txt` auto-generowane z jednego skryptu

Spec llmstxt.org dopuszcza oba pliki równolegle. `llms.txt` to index (szybki dla LLM do orientacji), `llms-full.txt` to pełne treści (LLM nie musi crawlować).

**Decyzja:** nowy `scripts/generate-llms-txt.js`:
- Wejście: `src/content/blog/*.md` (gray-matter), `src/data/projects.js`, `SITE_CONFIG`.
- Wyjście: `public/llms.txt` + `public/llms-full.txt`.
- Uruchamiany z `scripts/build-with-prerender.mjs` przed buildami.
- Język: PL (główna wersja) + EN odnotowane jako alternate w linkach.

**Struktura `llms.txt`:**
```
# Pawel Lipowczan
> Architekt oprogramowania, technologia jako narzędzie biznesu...

## Blog
- [Tytuł posta](https://pawel.lipowczan.pl/blog/slug): jednozdaniowy opis
...

## Projekty
- [Projekt X](...): opis

## Kontakt
- email: pawel.lipowczan@gmail.com
```

**Struktura `llms-full.txt`:** ten sam index + `\n\n---\n\n# [Tytuł]\n\n[pełna treść markdown]` dla każdego posta.

**Rationale:** Jeden skrypt, dwa pliki, zero dodatkowej komplikacji. Backwards-compatible (to nowe pliki, nic nie psuje).

### 6. Security headers: CSP Report-Only + Sentry Security Reports

`Content-Security-Policy-Report-Only` zamiast enforcing daje zero ryzyka zepsucia strony. Violations wysyłane do Sentry Security Reports endpointa (`/api/<project>/security/?sentry_key=...`) — osobny bucket od errors, nie konsumuje quota errorów w free planie. Dodany także nowocześniejszy nagłówek `Reporting-Endpoints` + `report-to` (legacy `report-uri` zostaje dla kompatybilności).

**Uwaga:** `connect-src` musi zawierać host Sentry ingest (region DE: `https://o4511257435308032.ingest.de.sentry.io`), bo inaczej CSP blokuje sam raport.

**Initial CSP draft (do walidacji w testach):**
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://js.clickrank.ai https://vitals.vercel-insights.com https://va.vercel-scripts.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://o<ORG>.ingest.<REGION>.sentry.io;
frame-ancestors 'none';
report-uri https://o<ORG>.ingest.<REGION>.sentry.io/api/<PROJECT_ID>/security/?sentry_key=<PUBLIC_KEY>;
report-to csp-endpoint;
```

Dodatkowo nagłówek `Reporting-Endpoints: csp-endpoint="<ten_sam_URL>"` dla nowego standardu (Chromium). Uwaga: **bez** `sentry_environment=production` — inaczej raporty z preview deploymentów Vercela zanieczyszczają dane prodowe (Vercel nie wspiera interpolacji env vars w `vercel.json`).

**Rationale:** `'unsafe-inline'` dla script-src to zło, ale z Vercel Analytics + Speed Insights + Helmet inline `<script type="application/ld+json">` + framer-motion inline styles trudno od razu się go pozbyć. Report-Only to krok pośredni — po 2-4 tygodniach analizy raportów zobaczymy co realnie używa inline i albo dodamy `nonce`, albo hashujemy JSON-LD, albo zostanie pragmatyczny kompromis. Enforcing = osobny change.

> **Note (post-implementation):** CSP enforcing jest świadomie wyłączony z tego change. Po 2-4 tygodniach od deployu, na podstawie logów z Sentry (Security → CSP Reports), należy utworzyć osobny change `csp-enforcing`, który zamieni `Content-Security-Policy-Report-Only` na `Content-Security-Policy` po wyeliminowaniu fałszywych pozytywów i ewentualnym dodaniu nonce/hash dla inline scripts.

**Permissions-Policy draft:**
```
Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=(), magnetometer=(), gyroscope=()
```
Tylko denial (nie używamy żadnej z tych funkcjonalności).

**HSTS:** `max-age=63072000; includeSubDomains; preload` — 2 lata, subdomeny (pawel.lipowczan.pl jest root), preload flag. Domena może być dodana do hstspreload.org po deployu.

### 7. Sitemap `lastmod`: hybrid per page-type

Posty → `modified || date`.
Listingi (`/`, `/blog`, `/en/`, `/en/blog`) → `max(lastmod)` wszystkich postów (listing jest "świeży" gdy jest świeża treść).
Legal pages (`/privacy-policy`, `/cookie-policy`, `/terms-of-service`) → git mtime pliku `src/pages/<Name>.jsx` (ale uwaga: w zdefiniowaniu generatora — ścieżka może się zmienić).

**Rationale:** Każdy typ strony dostaje semantycznie poprawne źródło świeżości. Uczciwy sygnał dla Google.

## Risks / Trade-offs

- **[CSP Report-Only fałszywie pozytywne]** — Initial CSP może generować dużo violations od clickrank/Vercel, zalewając dashboard. Mitigacja: zaczynamy od permissive draft powyżej, zaostrzamy po analizie.
- **[llms.txt rozmiar / spam risk]** — `llms-full.txt` może urosnąć do setek KB przy 25 postach. Spec llmstxt.org nie definiuje limitu, ale przy 100+ postach można będzie rozważyć paginację albo wariant "top articles only". Obecnie: OK.
- **[Logo PNG jakość]** — konwersja SVG → PNG musi zachować ostrość przy 600×60. Tasks: używamy sharp albo narzędzia, weryfikujemy wizualnie.
- **[Frontmatter field pollution]** — dodajemy opcjonalne `description` i `modified`. Schema loadera (`src/data/blogPosts.js`) musi tolerować ich brak. Nie nakładamy walidacji `required`.
- **[Generator llms.txt i escape'owanie]** — markdown w postach zawiera backticki, fences, linki, obrazki. `llms-full.txt` ma być czysto markdownowe, więc treść wkleja się 1:1. Zero escape'owania wymaga tylko poprawnej separacji (np. `\n\n---\n\n` między postami).
- **[requestIdleCallback w iOS Safari]** — wsparcie od Safari 16.4, niepełne. Fallback setTimeout(2000) łapie starsze wersje i pre-16.4. Tracking loss: marginalny.
- **[HSTS preload]** — po dodaniu nagłówka i czasie (~kilka tygodni bez HTTPS issues) domenę można zgłosić do hstspreload.org. Decyzja na preload robiona ręcznie, nagłówek sam nie dołącza do listy.
- **[Sentry dependency]** — jeśli Sentry padnie, przeglądarki dostaną błąd POST'a do endpointa (ale przy Report-Only nic się użytkownikowi nie dzieje). Akceptowalne.

## Migration Plan

Change nie wymaga migracji — wszystko additive:

1. Merge nie wpływa na istniejące posty (nowe pola frontmatter opcjonalne).
2. `public/logo-schema.png` dodawany jako nowy asset.
3. `llms.txt`/`llms-full.txt` — nowe pliki generowane w buildzie.
4. Security headers — additive + jedno usunięcie (`X-XSS-Protection`) które i tak jest deprecated.
5. Sitemap generator — zmienia zawartość `sitemap.xml`, ale format XML się nie zmienia, Google regeneruje cache.

## Rollback Strategy

Każdy z obszarów jest niezależny i odwracalny:
- Revert commita zmiany `index.html` → powrót do synchronicznego clickrank.
- Revert `BlogPostPage.jsx` → powrót do obecnego schematu.
- Usunięcie skryptu `generate-llms-txt.js` i wpięcia w build → pliki przestają być generowane (zostają ostatnie z buildu — usuwamy ręcznie z `dist/`).
- Revert `vercel.json` → powrót do starych nagłówków.
- Revert `update-sitemap.js` → powrót do uniform `lastmod`.

Pojedyncze reverts są prostsze niż cały change. Przy większym problemie: cały PR revert.
