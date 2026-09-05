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
      await page.goto(path);
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

      // Sprawdź Canonical Tag.
      //
      // Na serwerze deweloperskim canonical nie jest dowodem na nic — ani gdy
      // go nie ma, ani gdy jest. Pod React 19 w <React.StrictMode> podwójne
      // montowanie efektów sprawia, że react-helmet-async gubi aktualizację:
      // zostaje wartość z pierwszego renderu, sprzed ustalenia języka. Dla
      // przeglądarki z angielskim `navigator.language` daje to canonical z
      // prefiksem /en na polskiej trasie, przy `<html lang="pl">`. Który
      // wariant wypadnie, zależy od wyścigu i różni się między silnikami.
      //
      // Sprawdzone na buildzie produkcyjnym (bez StrictMode) w Firefoksie z
      // `navigator.languages = en-US`: `/terms-of-service`, `/cookie-policy`,
      // `/privacy-policy`, `/blog` i `/` mają canonical bez prefiksu, czyli
      // poprawny. Prerenderowany HTML w `dist/` też.
      //
      // Metadane sprawdza więc `seo-metadata-invariants.spec.js` na buildzie
      // produkcyjnym; tutaj canonical jest asercją tylko poza trybem
      // deweloperskim.
      if (!isDevMode) {
        if (!metaTags.canonical) {
          throw new Error(
            `PRODUCTION: canonical tag missing for ${path} - required for SEO`
          );
        }
        expect(metaTags.canonical).toBe(canonical);
      } else if (metaTags.canonical !== canonical) {
        console.warn(
          `⚠️ DEV MODE: canonical for ${path} is ${
            metaTags.canonical ?? "missing"
          } - expected due to the React Helmet + StrictMode limitation`
        );
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
    await page.goto("/privacy-policy");
    await waitForAnimations(page, 1000);

    // Sprawdź czy strona się załadowała
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();

    // Sprawdź czy jest treść
    const content = page.locator("section, main, article").first();
    await expect(content).toBeVisible();
  });
});
