# Prompt: `/opsx:explore` — strategia testowania lokalnego

**Do czego:** wklej treść z sekcji „Prompt" niżej po wywołaniu `/opsx:explore` w nowej sesji.
**Zebrane:** 2026-07-30, przy okazji PR #23. Liczby zmierzone wtedy — jeśli minęło sporo czasu, przelicz przed użyciem.

---

## Prompt

Chcę przemyśleć strategię testowania E2E w tym repo. Obecna zabija mi maszynę przy każdej zmianie.

### Problem

Każda lokalna weryfikacja zmiany uruchamia całą suite Playwrighta na wszystkich projektach przeglądarkowych. Procesor idzie pod 100%, przebieg trwa kilkadziesiąt minut, a zmiana dotyczy zwykle jednego–dwóch plików. Chcę, żeby lokalnie leciały tylko testy związane ze zmianą, a pełna suite chodziła cyklicznie (raz w tygodniu wystarczy) na osobnej maszynie przez scheduler — nie na moim laptopie.

### Stan faktyczny (zmierzony 2026-07-30, nie zgaduj — to jest punkt wyjścia)

**Rozmiar suite:** 17 plików w `tests/e2e/` + `tests/projects.spec.js`. 153 deklaracje `test()`. `testDir: "./tests"`.

Największe: `booking-cta` 26, `blog` 16, `llm-wiki-course` 15, `home` 15, `testimonials` 14, `ui-ux-audit` 13, `contact-form` 12.

**Projekty w `playwright.config.js`:** chromium, edge (warunkowo), firefox, webkit, Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12). Czyli ~153 × 5–6 przebiegów. W CI shard 3/4 raportuje 212 testów, więc całość to ~850 wykonań.

**Dwa webServery w konfiguracji:**

- `:3000` — `npm run dev`, domyślny `baseURL`, testy zachowania UI
- `:4173` — `npm run build:test && npm run preview:test` (build do `dist-test/`), tylko dla `seo-metadata-invariants.spec.js`, bo react-helmet-async 2.0.5 pod React 19 w StrictMode nie wstawia tagów do `<head>` w trybie dev

`reuseExistingServer: !process.env.CI`. Lokalnie to znaczy: przebieg podłącza się do cudzego serwera, jeśli port zajęty.

**CI:** `.github/workflows/playwright.yml`, matrix 4 shardy, `fail-fast: false`, `timeout-minutes: 30`, ubuntu-latest, `workers: 1` per job. ~15 min na shard, ~60 min gdyby serialnie.

**Brama merge z `.claude/rules/11-git.md`** każe przed każdym merge do `main` uruchomić `npm run build:prerender` (~6,5 min) + `npm test`. Uzasadnienie w regule mówi o „several tests" czytających zbudowany `dist/` — **to jest nieaktualne**. Grep po `tests/` pokazuje jeden blok: `llm-wiki-course.spec.js:311-349`, `test.describe("Kurs LLM Wiki — prerender (PL-only)")`, ze skip-guardem na markerze `dist/blog/index.html`. `seo-metadata-invariants.spec.js` przeniesiono na preview `dist-test/` (`:4173`), który `npm test` stawia sobie sam — więc CI go pokrywa i brama go nie dotyczy.

### Trzy konkretne bóle zaobserwowane 2026-07-30

1. **Kolizja portów między worktree.** Repo ma 4 worktree. `npm run preview` to `vite preview --port 4173 --strictPort`, a `scripts/prerender.mjs:89` ma `const BASE_URL = "http://localhost:4173"` zaszyte na sztywno, bez override z env. Dwa worktree nie zrobią testów ani prerenderu równolegle. Gorzej: przy `reuseExistingServer` przebieg w worktree A potrafi cicho testować aplikację serwowaną z worktree B.

2. **Wycieki procesów.** Naliczone 22 osierocone procesy `@playwright/mcp` (11 par npx+node, narastały przez ~1,5 godziny) oraz przebieg `@playwright/test` wiszący 63 minuty razem z dwoma serwerami vite. Nic tego nie sprząta.

3. **Krok instalacji przeglądarek w CI potrafi zawisnąć.** W runie 30489037702 shard 4 zginął na `timeout-minutes: 30` w trakcie `npx playwright install --with-deps` — 30 minut na samej instalacji. Nie było to fail-fast (`fail-fast: false`), tylko limit joba. Brak cache'owania przeglądarek między runami.

### Czego oczekuję od przemyślenia

**Cel główny:** lokalnie ma się wykonywać tylko podzbiór związany ze zmianą; pełna macierz — cyklicznie na osobnej maszynie.

Rzeczy do rozstrzygnięcia, kolejność dowolna:

- **Jak wyznaczyć „testy związane ze zmianą"?** Ręczna mapa plik-źródłowy → spec? Konwencja nazw? Adnotacje/tagi w testach? Coś opartego o `git diff`? Każda opcja ma inny koszt utrzymania i inne ryzyko przeoczenia.
- **Ile projektów przeglądarkowych lokalnie?** Fail z 2026-07-30 dotyczył wyłącznie Mobile Chrome/Safari, więc sam chromium by go przepuścił. Jaki jest sensowny domyślny zestaw, a co dobierać świadomie?
- **Co znaczy „osobna maszyna"?** GitHub Actions z `schedule:` (runnery już są, zero nowego sprzętu) czy faktyczny self-hosted runner? Co dochodzi, gdy trzeba prerenderu i Puppeteera.
- **Czy CI na PR ma zostać pełne?** Dziś ~15 min × 4 shardy przy każdym pushu. Jeśli lokalnie tniemy do podzbioru, PR jest ostatnią bramą przed mergem — czy zostawić pełne, czy też zawęzić i oprzeć się na tygodniowym przebiegu.
- **Co zrobić z bramą prerenderu w `11-git.md`?** Skoro to jeden blok testowy: zautomatyzować, przepisać regułę pod stan faktyczny, czy przenieść tę asercję gdzie indziej.
- **Izolacja worktree.** Porty z env zamiast na sztywno, czy inne podejście.
- **Sprzątanie procesów.** Czy to w ogóle wchodzi w zakres tej zmiany, czy osobno.

### Poza zakresem

Nie chcę przepisywać samych testów ani zmieniać tego, co asertują. Rzecz dotyczy tego, **co i kiedy się uruchamia**, nie treści testów.

### Kontekst

Repo: portfolio (React 19 + Vite 7 + Tailwind 3, prerender przez Puppeteer, deploy na Vercel). Reguły w `.claude/rules/`, istotne: `11-git.md` (brama merge), `playwright/30-testing.md`. Konfiguracja: `playwright.config.js`, `.github/workflows/playwright.yml`, `package.json` (skrypty `test:*`, `build:prerender`).
