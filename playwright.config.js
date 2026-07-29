import { defineConfig, devices } from "@playwright/test";

/**
 * Konfiguracja Playwright dla testów E2E portfolio
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Katalog z testami
  testDir: "./tests",

  // Maksymalny czas na jeden test (zwiększony dla Firefox)
  timeout: 60 * 1000,

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
    // URL bazowy dla testów
    baseURL: "http://localhost:3000",

    // Zbieraj ślady przy pierwszym retry testu który failuje
    trace: "on-first-retry",

    // Screenshoty przy failach
    screenshot: "only-on-failure",

    // Video przy failach
    video: "retain-on-failure",
  },

  // Konfiguracja dla różnych przeglądarek
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
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
          },
        ]),
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    // Testy mobilne
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  // Dwa serwery, bo dwa różne cele testów:
  //
  // 3000 (dev) — domyślny baseURL dla testów zachowania interfejsu.
  //
  // 4173 (preview) — produkcyjny build, jedyne miejsce, gdzie widać metadane
  // SEO. react-helmet-async 2.0.5 pod React 19 nie wstawia <meta> ani <link>
  // do <head>, gdy aplikacja siedzi w <React.StrictMode>: podwójne
  // zamontowanie efektów w trybie deweloperskim kończy się sprzątaniem, które
  // wygrywa z wstawianiem. StrictMode działa tylko w dev, więc build ma
  // komplet tagów. Testy z tests/e2e/seo-metadata-invariants.spec.js celują
  // więc w 4173 (własne `test.use({ baseURL })`).
  //
  // Build testowy idzie do `dist-test/`, nie do `dist/`. Inaczej `npm test`
  // nadpisywałby prerenderowany katalog zwykłym buildem SPA — a z niego idzie
  // wdrożenie i na nim opierają się testy prerenderu w llm-wiki-course.spec.js.
  // Pełnego `build:prerender` tu nie ma celowo: trwa ~6,5 min, co w czterech
  // shardach CI przekroczyłoby limit 30 min na zadanie.
  webServer: [
    {
      command: "npm run dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: "npm run build:test && npm run preview:test",
      url: "http://localhost:4173",
      reuseExistingServer: !process.env.CI,
      timeout: 180 * 1000,
    },
  ],
});
