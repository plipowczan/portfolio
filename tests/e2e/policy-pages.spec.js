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

      expect(metaTags.title).toBeTruthy();
      expect(metaTags.title).toMatch(title);

      expect(metaTags.description).toBeTruthy();
      expect(metaTags.canonical).toBe(canonical);
      expect(metaTags.ogTitle).toBeTruthy();
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
