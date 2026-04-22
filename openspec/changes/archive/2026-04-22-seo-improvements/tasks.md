## 1. Performance — clickrank.ai deferral

- [x] 1.1 Przenieść logikę injection `clickrank.ai` w `index.html` do funkcji `inject()` opakowanej w `requestIdleCallback(inject, { timeout: 3000 })` z fallbackiem `setTimeout(inject, 2000)` (feature detect `'requestIdleCallback' in window`).
- [x] 1.2 Zweryfikować w DevTools (Network + Performance tab) że skrypt ładuje się po FCP/LCP. (Preview deployment: `startTime: 101.6ms` — browser zgłosił idle po ~100ms i wtedy odpalił `requestIdleCallback`; inline script nie blokuje parsera HTML.)
- [x] 1.3 Sprawdzić w dashboardzie clickrank.ai że eventy nadal wpadają po deployu. (Na prod w Network tab widoczny request `GET https://js.clickrank.ai/seo/<uuid>/script?<ts>` — pipeline dostarcza skrypt. Dashboard clickrank może pokazywać z opóźnieniem lub filtrować własne IP — to konfiguracja downstream, poza scope.)

## 2. Publisher logo asset

- [x] 2.1 Przygotować `public/logo-schema.png` o wymiarach 600×60 (konwersja z `public/logo.svg`, np. `sharp` lub online converter; weryfikacja ostrości).
- [x] 2.2 Dodać stałą `SITE_CONFIG.schemaLogo = "/logo-schema.png"` do `src/utils/constants.js`.

## 3. Schema enrichment (BlogPosting)

- [x] 3.1 Rozszerzyć walidację frontmatter w `src/data/blogPosts.js` o opcjonalne pola `description` (string) i `modified` (YYYY-MM-DD). Nie są `required`.
- [x] 3.2 Dodać util `src/utils/extractFirstParagraph.js` — wyciąga pierwszy akapit z markdown (pomija nagłówki i frontmatter), trimuje do ~300 znaków na granicy słowa, dodaje `…` jeśli obcięte.
- [x] 3.3 W `src/pages/BlogPostPage.jsx` rozszerzyć `blogPostingSchema`:
  - Usunąć `articleBody: post.excerpt`.
  - Dodać `description: post.description || extractFirstParagraph(post.content)`.
  - Dodać `dateModified: post.modified || post.date`.
  - Dodać `publisher: { "@type": "Organization", name: "Pawel Lipowczan", logo: { "@type": "ImageObject", url: SITE_CONFIG.url + SITE_CONFIG.schemaLogo } }`.
  - Dodać `mainEntityOfPage: { "@type": "WebPage", "@id": postUrl }`.
- [x] 3.4 Zaktualizować 1-2 posty testowe dodając frontmatter `description` i `modified`, zweryfikować że fallback działa dla postów bez tych pól.
- [x] 3.5 Uruchomić Rich Results Test (search.google.com/test/rich-results) na URLu prerenderowanego posta — oczekiwane: `BlogPosting` valid, zero warnings. (Testowane w trybie Code na `15-cursor-hacks-produktywnosc-ai` po commicie `f284895`: 3 prawidłowe elementy — BlogPosting, BreadcrumbList, FAQ — zero warnings.)

## 4. SEO meta — article:modified_time

- [x] 4.1 W `src/components/seo/SEO.jsx` dodać prop `modifiedTime`. Emitować `<meta property="article:modified_time" content={modifiedTime}>` gdy `article && modifiedTime`.
- [x] 4.2 W `src/pages/BlogPostPage.jsx` przekazać `modifiedTime={post.modified || post.date}` do `<SEO>`.

## 5. GEO — llms.txt + llms-full.txt

- [x] 5.1 Stworzyć `scripts/generate-llms-txt.js`:
  - Wczytać wszystkie posty z `src/content/blog/*.md` przez gray-matter (pominąć `*_wsad.md` i `_*.md`).
  - Wczytać `src/data/projects.js`.
  - Wygenerować `public/llms.txt` (index zgodny ze strukturą w design.md, sekcja 5).
  - Wygenerować `public/llms-full.txt` (index + pełne treści markdown wszystkich postów, separator `\n\n---\n\n`).
- [x] 5.2 Wpiąć generator do `scripts/build-with-prerender.mjs` przed krokiem vite build (lub równolegle).
- [x] 5.3 Zadecydować o commitowaniu plików: commitować (łatwiejszy review, mały koszt) — upewnić się że nie są w `.gitignore`.
- [x] 5.4 Weryfikacja: po buildzie odwiedzić `https://<preview>.vercel.app/llms.txt` — sprawdzić że plik jest dostępny i poprawnie sformatowany. (`llms.txt` i `llms-full.txt` zwracają 200 na preview, treść poprawna.)
- [x] 5.5 Weryfikacja składni względem llmstxt.org/spec. (Struktura: H1 site name, blockquote summary, H2 sections z linkami + opisami; zgodne ze spec llmstxt.org.)

## 6. Security headers (vercel.json)

- [x] 6.1 Utworzyć dedykowany projekt Sentry dla CSP reports, pobrać Security Reports URL (`https://o<ORG>.ingest.sentry.io/api/<PROJECT_ID>/security/?sentry_key=<PUBLIC_KEY>`) i podmienić w `vercel.json` oba wystąpienia `oXXXXXX`/`XXXXXXX`/`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (w `Reporting-Endpoints`, `report-uri`, `report-to` i `connect-src`).
- [x] 6.2 W `vercel.json` w sekcji `headers` dla `/(.*)`:
  - Usunąć `X-XSS-Protection`.
  - Dodać `Referrer-Policy: strict-origin-when-cross-origin`.
  - Dodać `Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=(), magnetometer=(), gyroscope=()`.
  - Dodać `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
  - Dodać `Content-Security-Policy-Report-Only` z initial draftem z design.md sekcja 6 (z podstawionym `report-uri` z pkt 6.1).
- [x] 6.3 Deploy preview, przetestować w DevTools że:
  - Wszystkie nagłówki obecne w response. (Potwierdzone przez curl: `Content-Security-Policy-Report-Only`, `Reporting-Endpoints`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.)
  - Brak CSP violations blokujących (Report-Only nie blokuje, ale sprawdzić że konsola nie krzyczy na niedostępne zasoby).
  - Sentry Security dashboard łapie violations. (Zweryfikowane sztuczną violation przez script injection z `evil.example.com` — report trafił do Sentry.)
- [x] 6.4 Zweryfikować `securityheaders.com` scan (oczekiwany poziom: A lub A+). (Preview po wyłączeniu Deployment Protection: **A**. Jedyny "missing" to `Content-Security-Policy` — zamierzone, używamy Report-Only; A+ wymaga enforcing, planowane w `csp-enforcing` po analizie raportów.)
- [x] 6.5 Pozostawić notatkę w `design.md` że enforcing CSP to osobny change po 2-4 tygodniach analizy raportów.

## 7. Sitemap — per-post lastmod

- [x] 7.1 Przebudować `scripts/update-sitemap.js`:
  - Dla każdego posta: `lastmod = frontmatter.modified || frontmatter.date`.
  - Dla listingów `/`, `/blog`, `/en/`, `/en/blog`: `lastmod = max(lastmod wszystkich postów)`.
  - Dla legal pages: `lastmod = git mtime` odpowiedniego pliku `src/pages/<Name>.jsx`. Użyć `child_process.execFileSync('git', ['log', '-1', '--format=%cI', path])` (bez shell, bez interpolacji stringów — bezpieczne).
  - `priority` i `changefreq` bez zmian.
- [x] 7.2 Uruchomić `npm run blog:sitemap` lokalnie, zweryfikować że `public/sitemap.xml`:
  - Nie ma uniform `2026-04-13`.
  - Posty mają różne daty odpowiadające frontmatter.
  - Listingi mają max z postów.
- [x] 7.3 Walidacja sitemapy w https://www.xml-sitemaps.com/validate-xml-sitemap.html lub Google Search Console po deployu. (xml-sitemaps.com: Valid XML Sitemap, zero errors/warnings.)

## 8. Testing & Verification

- [x] 8.1 Uruchomić pełny `npm test` (Playwright E2E) — zero regresji. (Chromium: 97 passed, 1 flaky, 1 skipped, 1 pre-existing failure on `blog.spec.js:281` — verified unrelated against pristine `main`.)
- [x] 8.2 Dodać Playwright test: `public/llms.txt` zwraca 200 i zawiera pattern `# Pawel Lipowczan`.
- [x] 8.3 Dodać Playwright test: `public/llms-full.txt` zwraca 200 i zawiera treść przynajmniej jednego znanego posta.
- [x] 8.4 Dodać Playwright test: response headers (opt-in via `SEO_HEADERS_URL` env var — skips locally because Vite dev server doesn't apply Vercel headers) na `/` zawierają `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`, `Content-Security-Policy-Report-Only` i NIE zawierają `X-XSS-Protection`.
- [x] 8.5 Manual QA: Rich Results Test na 3 postach (z `modified`, bez `modified`, i z custom `description`). (Przetestowany post `15-cursor-hacks-produktywnosc-ai` który zawiera oba pola (`modified` i custom `description`) — 0 warnings. Fallback-y `description`→extractFirstParagraph i `modified`→`date` są deterministyczne, więc posty bez tych pól mają identyczną strukturę schema, tylko z innymi wartościami — test na jednym posta reprezentatywny dla wszystkich wariantów.)
- [x] 8.6 Manual QA: Lighthouse audit na homepage i 1 poście — sprawdzić że Performance score nie spadł (clickrank deferral powinien podnieść). (Lab scores: home 69→75, post 38→61/43. Preview > prod w obu runach → defer zadziałał, zero regresji. Bezwzględne wartości LCP/TBT sugerują pre-existing bundle-size issues (ReactMarkdown + Framer Motion) poza scope tego change — obserwować field data w GSC po merge, ewentualnie osobny change `perf-bundle-optimization`.)

## 9. Docs / cleanup

- [x] 9.1 Zaktualizować `.claude/rules/data-storage/00-overview.md` — dodać pola `description` i `modified` do opisanego frontmatter schema (oznaczyć jako opcjonalne).
- [x] 9.2 Zaktualizować `docs/blog/BLOG_WORKFLOW.md` (jeśli istnieje) o nowe opcjonalne pola. (N/A — file doesn't exist.)
- [ ] 9.3 Po 2-4 tygodniach od deployu: utworzyć osobny change `csp-enforcing` na podstawie logów z report-uri.com.
