## Why

Audyt SEO (`/claude-seo:seo`) z 2026-04-20 zidentyfikował 10 findings. Spike weryfikacyjny potwierdził, że prerender Puppeteer działa poprawnie (73 pliki HTML, `lang` przełącza się przez Helmet, schema JSON-LD obecna w snapshotach, Googlebot dostaje pełny HTML z live URL). Pozostałe gapy są realne i dotyczą:

- **Performance** — skrypt `clickrank.ai` ładuje się synchronicznie w `<head>`, uderzając w LCP/INP na każdej stronie.
- **Schema enrichment** — `BlogPosting` jest ubogi: `articleBody` zawiera skrócony `excerpt` (semantycznie błędne), brak `publisher`, `dateModified`, `mainEntityOfPage`. Rich Results Test zgłasza ostrzeżenia.
- **GEO / AI search** — brak `llms.txt`/`llms-full.txt`. Treść portfolio jest silnie AI-focused (25 artykułów o Claude Code, LLM-ach, automatyzacji), więc discoverability dla Perplexity/ChatGPT/Claude crawlers to wysoki ROI.
- **Security headers** — `X-XSS-Protection` jest deprecated; brak `Referrer-Policy`, `Permissions-Policy`, HSTS, CSP.
- **Sitemap hygiene** — wszystkie 73 URLe mają identyczny `lastmod: 2026-04-13`, co zakopuje sygnał świeżości dla Google.

Wszystkie zmiany są additive i backwards-compatible.

## What Changes

### Performance
- Przenieść injection `clickrank.ai` z synchronicznego `<script>` w `<head>` do lazy-loaded poprzez `requestIdleCallback` z fallbackiem `setTimeout(2000)`.

### Schema (BlogPosting w `src/pages/BlogPostPage.jsx`)
- **Usunąć** `articleBody: post.excerpt` (semantycznie błędne).
- **Dodać** `description` pobierane z frontmatter `description` lub fallback do pierwszego akapitu treści (~300 znaków).
- **Dodać** `dateModified` z frontmatter `modified` lub fallback do `date`.
- **Dodać** `publisher` jako `Organization` z nazwą `Pawel Lipowczan` i logo (nowy asset `public/logo-schema.png`, min 112×112).
- **Dodać** `mainEntityOfPage`.
- **Dodać** prop `modifiedTime` w `src/components/seo/SEO.jsx` dla generowania `<meta property="article:modified_time">`.

### GEO / AI Discoverability
- Nowy skrypt `scripts/generate-llms-txt.js` uruchamiany w `npm run build:prerender`.
- Generuje **oba** pliki zgodnie ze specyfikacją llmstxt.org:
  - `public/llms.txt` — index z linkami i jednozdaniowymi opisami wszystkich postów i projektów.
  - `public/llms-full.txt` — index + pełne treści artykułów inline.

### Security Headers (`vercel.json`)
- **Usunąć** `X-XSS-Protection` (deprecated).
- **Dodać** `Referrer-Policy: strict-origin-when-cross-origin`.
- **Dodać** `Permissions-Policy` z minimalnym allowlistem (geolocation/camera/microphone/payment: `()`).
- **Dodać** `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
- **Dodać** `Content-Security-Policy-Report-Only` z `report-uri`/`report-to` wskazującym na Sentry Security Reports endpoint (osobne konto, osobny bucket od errorów; setup w taskach).

### Sitemap (`scripts/update-sitemap.js`)
- Posty: `lastmod` = `modified || date` z frontmatter.
- Listingi (`/`, `/blog`, `/en/`, `/en/blog`): `lastmod` = max z `lastmod` wszystkich postów.
- Legal pages (`/privacy-policy`, `/cookie-policy`, `/terms-of-service`): `lastmod` = git mtime odpowiedniego pliku `.jsx`.
- `priority` i `changefreq` pozostają bez zmian.

## Capabilities

### New Capabilities

- `schema-blog-posting-rich`: BlogPosting JSON-LD zawiera publisher (Organization + logo), dateModified, mainEntityOfPage i description zamiast articleBody.
- `performance-third-party-scripts-deferred`: Skrypty third-party (clickrank.ai) ładują się lazy, nie blokują initial render.
- `geo-llms-discovery`: Serwis eksponuje `llms.txt` i `llms-full.txt` zgodne z llmstxt.org.
- `security-headers-modern`: `vercel.json` stosuje nowoczesny zestaw security headers (bez deprecated, z Referrer-Policy, Permissions-Policy, HSTS, CSP Report-Only).
- `sitemap-accurate-lastmod`: `sitemap.xml` zawiera dokładne daty modyfikacji odzwierciedlające rzeczywistą świeżość treści na poziomie pojedynczych URLi.

### Modified Capabilities

_None — wszystkie zmiany to nowe wymagania, nie modyfikują istniejących specs._

## Impact

- **Kod**:
  - `index.html` (przenosiny skryptu clickrank.ai)
  - `src/pages/BlogPostPage.jsx` (enrichment BlogPosting schema)
  - `src/components/seo/SEO.jsx` (nowy prop `modifiedTime`)
  - `scripts/update-sitemap.js` (nowa logika `lastmod`)
  - Nowy: `scripts/generate-llms-txt.js`
  - `scripts/build-with-prerender.mjs` (wpięcie generatora llms.txt)
  - `vercel.json` (headers)
- **Assety**:
  - Nowy: `public/logo-schema.png` (do przygotowania)
  - Nowe: `public/llms.txt`, `public/llms-full.txt` (generowane)
- **Frontmatter (opcjonalne pola, bez breaking changes)**:
  - `description` (string, opcjonalne) — jeśli brak, fallback do pierwszego akapitu
  - `modified` (YYYY-MM-DD, opcjonalne) — jeśli brak, `dateModified` = `date`
- **External dependencies**: dedykowany projekt Sentry (free tier) dla CSP Security Reports endpointa.
- **Risk**: Średnie. CSP Report-Only nie blokuje (brak ryzyka zepsucia strony). Schema enrichment jest additive — stare klienty widzą tę samą podstawę. Główne ryzyko: generator llms.txt musi poprawnie escapować markdown/specjalne znaki w treściach postów.
- **Out of scope (osobne change'e później)**:
  - CSP enforcing (po analizie raportów z Report-Only)
  - `llms-full.txt` content tuning jeśli okaże się za duży
  - Pełna migracja `StructuredData.jsx` do Helmet (spike potwierdził, że obecne rozwiązanie działa w prerenderze).
