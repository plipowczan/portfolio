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

  // Uruchom dev server przed testami
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
