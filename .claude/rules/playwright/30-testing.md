# Playwright Testing Strategies

## Isolation
Tests should run in isolation. Each test gets a fresh browser context.

## State Management
Don't share state between tests. If you need a logged-in state, do it in `beforeEach` or use global setup/storage state.

## Debugging
Use `--debug` flag or VS Code extension.
```bash
npx playwright test --debug
```

---

## Co uruchamiać lokalnie

**Domyślnie leci wąsko.** Poza CI `playwright.config.js` wystawia dwa projekty:
`chromium` i `Mobile Chrome`. Pełna szóstka włącza się jawnie:

```bash
npm test                      # chromium + Mobile Chrome
PW_ALL=1 npm test             # pełna macierz (z edge)
PW_PREVIEW=1 npm test         # dokłada serwer preview (produkcyjny build)
```

`Mobile Chrome` jest w domyślnym zestawie nie dla mobilności samej w sobie, tylko
dlatego, że to Chromium z viewportem telefonu — łapie klasę „działa na
desktopie, znika na telefonie", której sam `chromium` nie widzi.

**Serwer preview nie startuje bez `PW_PREVIEW=1`.** Playwright podnosi każdy
skonfigurowany serwer niezależnie od tego, które testy wybrałeś, więc
bezwarunkowy wpis dokładałby pełny `vite build` do przebiegu jednego spec-a.

Potrzebuje go dziś jeden blok: bramka zgody na hoście produkcyjnym z
`analytics-consent.spec.js`, która proxuje prawdziwy adres na ten build. Bez
zmiennej pomija się z komunikatem. Metadane SEO **już go nie potrzebują** —
React 19 hoistuje je przy zatwierdzeniu renderu, więc serwer deweloperski
pokazuje to samo co build.

## Które testy dotyczą mojej zmiany

Mapa niżej zawęża przebieg do zmienionych plików. **Reguła nadrzędna: jeśli
zmienionej ścieżki tu nie ma, uruchom całość na domyślnym zestawie.** Nigdy
odwrotnie — pominięcie testów, które trzeba było uruchomić, kończy się zielonym
przebiegiem, który niczego nie sprawdził.

| Zmieniona ścieżka | Uruchom |
| --- | --- |
| `src/pages/Home.jsx`, `src/components/sections/**` | `home`, `testimonials`, `booking-cta`, `contact-form`, `ui-ux-audit` |
| `src/pages/Blog*.jsx`, `src/content/blog/**`, `src/data/blogPosts.js` | `blog`, `language-switcher-blog`, `breadcrumbs` |
| `src/pages/Course*.jsx`, `src/content/kurs/**`, `src/data/course*.js` | `llm-wiki-course`, `llm-wiki-discoverable` |
| `src/pages/LlmWikiLanding.jsx` | `llm-wiki-landing`, `llm-wiki-discoverable` |
| `src/pages/{Privacy,Terms,Cookie}*.jsx` | `policy-pages` |
| `src/components/seo/**`, narzędzia od schematów | `seo-metadata-invariants`, `breadcrumbs`, `policy-pages`, `seo-llms-txt` |
| `src/components/layout/**` | `home`, `blog`, `llm-wiki-course` — nawigacja i stopka renderują się wszędzie, więc ten wiersz jest celowo szeroki |
| `src/data/projects.js` | `projects` |
| `public/fonts/**`, `scripts/fetch-fonts.mjs` | `perf-self-hosted-fonts` |
| `public/images/**` | `perf-image-loading` |
| `vercel.json` | **żaden przebieg lokalny tego nie pokrywa** — nagłówki widać dopiero na wdrożeniu, sprawdza je workflow `deployed-checks.yml` |
| `scripts/prerender*.mjs`, `scripts/build-*.mjs`, `scripts/generate-content.mjs`, `scripts/check-payload-budget.mjs`, `src/utils/prerenderMarker.js` | uruchom `npm run build:prerender` — kompletność wyjścia i rozmiar pierwszego ładunku sprawdza sam build |
| cokolwiek innego | całość na domyślnym zestawie |

## Testy niezależne od silnika

Pięć plików jest przypiętych do `chromium` przez `testIgnore` w
`playwright.config.js`: `seo-security-headers`, `perf-font-cache-headers`,
`seo-llms-txt`, `seo-metadata-invariants`, `perf-image-loading`.

**Kryterium dla nowych testów:** plik trafia na tę listę tylko wtedy, gdy
*żadna* jego asercja nie dotyczy widoczności, układu, focusu, animacji ani
viewportu. Nagłówek `Cache-Control` jest ten sam w każdej przeglądarce; użycie
`toBeVisible()` już nie.

`testIgnore` działa na poziomie pliku, nie testu. Plik mieszany zostaje na
pełnej macierzy. `breadcrumbs` był tego przykładem — jeden test o JSON-LD, który
by się kwalifikował, obok czterech `toBeVisible()`, które nie. Ten test przeniósł
się 2026-09-06 do `seo-metadata-invariants`, i nie z powodu tej listy, tylko
dlatego, że tamten plik jest właścicielem asercji o metadanych. `breadcrumbs`
został czysto wizualny.

Powód, dla którego wtedy musiał celować w build, już nie obowiązuje: dane
strukturalne szły przez Helmeta, a ten pod StrictMode nie wystawiał niczego na
serwerze deweloperskim. Dziś `StructuredData` renderuje `<script>` jako własny
węzeł w drzewie Reacta i widać go w dev tak samo jak każdy inny znacznik.

## Porty i worktree

Porty serwera dev i preview liczy `scripts/ports.mjs` z położenia katalogu, więc
każdy worktree ma własną parę i dwa worktree mogą testować równolegle. Nie
wpisuj portu na sztywno nigdzie — ani w teście, ani w skrypcie `package.json`.
Test potrzebujący adresu bezwzględnego bierze go z `baseURL` albo z tego modułu.

Jawne `DEV_PORT` / `PREVIEW_PORT` nadpisują wyliczenie, gdy zewnętrzne narzędzie
musi celować w znany adres.
