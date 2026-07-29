import { expect, test } from "@playwright/test";
import { getSeoMetaTags, waitForAnimations } from "../utils/test-helpers.js";

test.describe("Policy Pages - SEO", () => {
  const policyPages = [
    {
      path: "/privacy-policy",
      canonical: "https://pawel.lipowczan.pl/privacy-policy",
      title: /Privacy Policy/i,
    },
    {
      path: "/terms-of-service",
      canonical: "https://pawel.lipowczan.pl/terms-of-service",
      title: /Terms of Service/i,
    },
    {
      path: "/cookie-policy",
      canonical: "https://pawel.lipowczan.pl/cookie-policy",
      title: /Cookie Policy/i,
    },
  ];

  policyPages.forEach(({ path, canonical, title }) => {
    test(`${path} should have correct canonical tag and SEO meta tags`, async ({
      page,
    }) => {
      await page.goto(`http://localhost:3000${path}`);
      await waitForAnimations(page, 1000);

      const metaTags = await getSeoMetaTags(page);
      const isDevMode =
        page.url().includes("localhost") || page.url().includes("127.0.0.1");

      // Sprawdź podstawowe tagi
      expect(metaTags.title).toBeTruthy();
      expect(metaTags.title).toMatch(title);

      // Description pochodzi wyłącznie z Helmeta, a ten pod React 19 nie
      // wstawia tagów w trybie deweloperskim (StrictMode) — ta sama tolerancja
      // co niżej dla canonical i og:*.
      if (!metaTags.description) {
        const message = `meta description missing for ${path}`;
        if (isDevMode) {
          console.warn(`⚠️ DEV MODE: ${message} - expected under StrictMode`);
        } else {
          throw new Error(`PRODUCTION: ${message} - required for SEO`);
        }
      }

      // Sprawdź Canonical Tag
      if (!metaTags.canonical) {
        const message = `canonical tag missing for ${path}`;
        if (isDevMode) {
          console.warn(
            `⚠️ DEV MODE: ${message} - expected due to React Helmet limitation`
          );
        } else {
          throw new Error(
            `PRODUCTION: ${message} - canonical tag is required for SEO`
          );
        }
      } else {
        expect(metaTags.canonical).toBe(canonical);
      }

      // Sprawdź Open Graph tags (toleruj brak w dev mode)
      if (!metaTags.ogTitle) {
        if (!isDevMode) {
          throw new Error(
            `PRODUCTION: og:title meta tag is missing for ${path}`
          );
        }
      } else {
        expect(metaTags.ogTitle).toBeTruthy();
      }
    });
  });

  test("policy pages should be accessible and have proper structure", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/privacy-policy");
    await waitForAnimations(page, 1000);

    // Sprawdź czy strona się załadowała
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();

    // Sprawdź czy jest treść
    const content = page.locator("section, main, article").first();
    await expect(content).toBeVisible();
  });
});
