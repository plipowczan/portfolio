import { defineConfig, devices } from "@playwright/test";
import { DEV_URL, PREVIEW_URL } from "./scripts/ports.mjs";

/**
 * Pełna macierz przeglądarek. Poza CI włącza ją `PW_ALL=1`.
 *
 * Domyślnie lokalnie lecą tylko dwa projekty. Pełna szóstka to ~850 wykonań i
 * kilkadziesiąt minut przy 100% procesora — koszt, którego nie da się
 * uzasadnić przy zmianie jednego pliku. Wybór testów pod zmianę opisuje
 * `.claude/rules/playwright/30-testing.md`; ten warunek pilnuje, żeby
 * zapomnienie tamtej reguły kosztowało minuty, a nie godzinę.
 */
const FULL_MATRIX = !!process.env.CI || !!process.env.PW_ALL;

/**
 * Serwer preview (produkcyjny build) startuje tylko pod `PW_PREVIEW=1`.
 *
 * Playwright podnosi każdy skonfigurowany `webServer` niezależnie od tego,
 * które testy wybrano — bezwarunkowy wpis dokłada pełny `vite build` do
 * każdego przebiegu, także przebiegu jednego niezwiązanego spec-a.
 *
 * Warunek celowo NIE obejmuje samego `CI` — zmienną ustawia workflow, jawnie,
 * per job. Dziś we wszystkich, bo preview potrzebują dwa zestawy: metadane SEO
 * (przypięte do chromium) i bramka zgody na hoście produkcyjnym, która proxuje
 * ten host na build i leci na każdej przeglądarce. Gdyby kiedyś został tylko
 * ten pierwszy, wystarczy zdjąć zmienną z pozostałych jobów.
 */
const WITH_PREVIEW = !!process.env.PW_PREVIEW;

/**
 * Przebieg przeciw wdrożeniu (`PW_DEPLOYED=1`) nie potrzebuje żadnego serwera
 * lokalnego: testy nagłówków pytają adres z wdrożenia, wzięty z
 * `SEO_HEADERS_URL`. Bez tego warunku job po deployu i tak stawiałby serwer
 * dev, żeby nikt do niego nie zajrzał.
 */
const WITH_DEV_SERVER = !process.env.PW_DEPLOYED;

/**
 * Testy, których wynik nie może zależeć od silnika renderującego: nagłówki
 * odpowiedzi, treść plików, metadane i atrybuty w znaczniku. Nagłówek
 * `Cache-Control` jest ten sam w Firefoksie i w Safari, więc mnożenie ich
 * przez projekty kupuje wyłącznie czas.
 *
 * Kryterium: plik trafia tu tylko wtedy, gdy ŻADNA jego asercja nie dotyczy
 * widoczności, układu, focusu, animacji ani viewportu. `testIgnore` działa na
 * poziomie pliku, więc jedna taka asercja dyskwalifikuje cały plik —
 * `breadcrumbs` ma test o JSON-LD, który by się kwalifikował, ale i cztery
 * `toBeVisible()`, które nie.
 */
const ENGINE_INDEPENDENT = [
  "**/seo-security-headers.spec.js",
  "**/perf-font-cache-headers.spec.js",
  "**/seo-llms-txt.spec.js",
  "**/seo-metadata-invariants.spec.js",
  "**/perf-image-loading.spec.js",
];

const chromium = {
  name: "chromium",
  use: { ...devices["Desktop Chrome"] },
};

// Mobile Chrome to Chromium z viewportem Pixel 5. Razem z chromium łapie
// klasę „działa na desktopie, znika na telefonie" — to był fail z 2026-07-30,
// którego sam chromium by nie zobaczył. Stąd para jako domyślny zestaw.
const mobileChrome = {
  name: "Mobile Chrome",
  use: { ...devices["Pixel 5"] },
  testIgnore: ENGINE_INDEPENDENT,
};

const PROJECTS = FULL_MATRIX
  ? [
      chromium,
      // Local-only convenience: run the system Edge (msedge channel) when a
      // Playwright chromium binary isn't installed. Excluded in CI, where
      // `playwright install --with-deps` provides chromium but not the msedge
      // channel (which would otherwise fail at launch).
      ...(process.env.CI
        ? []
        : [
            {
              name: "edge",
              use: { ...devices["Desktop Chrome"], channel: "msedge" },
              testIgnore: ENGINE_INDEPENDENT,
            },
          ]),
      {
        name: "firefox",
        use: { ...devices["Desktop Firefox"] },
        testIgnore: ENGINE_INDEPENDENT,
      },
      {
        name: "webkit",
        use: { ...devices["Desktop Safari"] },
        testIgnore: ENGINE_INDEPENDENT,
      },
      mobileChrome,
      {
        name: "Mobile Safari",
        use: { ...devices["iPhone 12"] },
        testIgnore: ENGINE_INDEPENDENT,
      },
    ]
  : [chromium, mobileChrome];

/**
 * Konfiguracja Playwright dla testów E2E portfolio
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Katalog z testami
  testDir: "./tests",

  // Maksymalny czas na jeden test (zwiększony dla Firefox)
  timeout: 60 * 1000,

  // Górna granica całego przebiegu. Bez niej zawieszony przebieg potrafi wisieć
  // godzinami razem z serwerami Vite i trzymać porty — zaobserwowane 2026-07-30
  // (63 min i dwa żywe serwery). Limit kończy przebieg i zwalnia porty.
  globalTimeout: (process.env.CI ? 25 : 20) * 60 * 1000,

  // Ustawienia dla expect
  expect: {
    timeout: 10000,
  },

  // Konfiguracja uruchamiania testów
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // 1 worker per CI job: some navigation-heavy blog tests are timing-fragile
  // and only pass serially (in-job parallelism overloads the shared Vite dev
  // server and times them out). CI speed comes from sharding across runners
  // instead — see .github/workflows/playwright.yml (matrix shard 1..4).
  workers: process.env.CI ? 1 : undefined,

  // Reporter - HTML dla lokalnego użycia
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],

  // Współdzielona konfiguracja dla wszystkich projektów
  use: {
    // URL bazowy dla testów — port per worktree, patrz scripts/ports.mjs
    baseURL: DEV_URL,

    // Zbieraj ślady przy pierwszym retry testu który failuje
    trace: "on-first-retry",

    // Screenshoty przy failach
    screenshot: "only-on-failure",

    // Video przy failach
    video: "retain-on-failure",
  },

  projects: PROJECTS,

  // Dwa serwery, bo dwa różne cele testów. Porty obu liczy scripts/ports.mjs
  // z położenia katalogu — każdy worktree ma własną parę.
  //
  // dev — domyślny baseURL dla testów zachowania interfejsu.
  //
  // preview — produkcyjny build, jedyne miejsce, gdzie widać metadane
  // SEO. react-helmet-async 2.0.5 pod React 19 nie wstawia <meta> ani <link>
  // do <head>, gdy aplikacja siedzi w <React.StrictMode>: podwójne
  // zamontowanie efektów w trybie deweloperskim kończy się sprzątaniem, które
  // wygrywa z wstawianiem. StrictMode działa tylko w dev, więc build ma
  // komplet tagów. Testy z tests/e2e/seo-metadata-invariants.spec.js celują
  // więc w preview (własne `test.use({ baseURL })`).
  //
  // Build testowy idzie do `dist-test/`, nie do `dist/`. Inaczej `npm test`
  // nadpisywałby prerenderowany katalog zwykłym buildem SPA, z którego idzie
  // wdrożenie. Pełnego `build:prerender` tu nie ma celowo: trwa ~6,5 min, a
  // kompletność jego wyjścia pilnuje sam build (scripts/verify-prerender-output.mjs).
  //
  // Serwer preview jest warunkowy (WITH_PREVIEW), bo Playwright podnosi
  // wszystkie serwery niezależnie od selekcji testów — bez tego warunku każdy
  // lokalny przebieg zaczynałby się od produkcyjnego builda.
  webServer: [
    ...(WITH_DEV_SERVER
      ? [
          {
            command: "npm run dev",
            url: DEV_URL,
            reuseExistingServer: !process.env.CI,
            timeout: 120 * 1000,
          },
        ]
      : []),
    ...(WITH_PREVIEW
      ? [
          {
            command: "npm run build:test && npm run preview:test",
            url: PREVIEW_URL,
            reuseExistingServer: !process.env.CI,
            timeout: 180 * 1000,
          },
        ]
      : []),
  ],
});
