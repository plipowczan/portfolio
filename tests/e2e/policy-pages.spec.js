import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { formatCalendarDate } from "../../src/utils/formatCalendarDate.js";
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

// Requirement: openspec/specs/policy-pages — the date and the inventory.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** The date a legal page declares next to its sitemap marker. */
const declaredDate = (file) => {
  const source = readFileSync(join(ROOT, "src", "pages", file), "utf-8");
  const date = source.match(/\bLAST_UPDATED\s*=\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
  if (!date) throw new Error(`${file} declares no LAST_UPDATED`);
  return date;
};

const LEGAL_PAGES = [
  { path: "/privacy-policy", file: "PrivacyPolicy.jsx" },
  { path: "/terms-of-service", file: "TermsOfService.jsx" },
  { path: "/cookie-policy", file: "CookiePolicy.jsx" },
];

const LANGUAGES = [
  {
    prefix: "",
    locale: "pl-PL",
    label: "Ostatnia aktualizacja",
    bases: ["art. 6 ust. 1 lit. a", "art. 6 ust. 1 lit. b", "art. 6 ust. 1 lit. f"],
    unsubscribe: /do czasu wypisania/,
  },
  {
    prefix: "/en",
    locale: "en-US",
    label: "Last updated",
    bases: ["Art. 6(1)(a)", "Art. 6(1)(b)", "Art. 6(1)(f)"],
    unsubscribe: /until you unsubscribe/,
  },
];

test.describe("Policy Pages - fixed last-updated date", () => {
  for (const { path, file } of LEGAL_PAGES) {
    for (const { prefix, locale, label } of LANGUAGES) {
      test(`${prefix}${path} shows its declared date, not today's`, async ({ page }) => {
        await page.goto(`${prefix}${path}`);

        const expected = formatCalendarDate(declaredDate(file), locale);
        await expect(page.getByText(`${label}: ${expected}`)).toBeVisible();
        // A key i18next could not resolve renders as the key itself.
        await expect(page.locator("main, body").first()).not.toContainText(
          /\b(privacy|terms|cookies)\.section\d/
        );
      });
    }
  }
});

test.describe("Policy Pages - services named match what the site loads", () => {
  for (const { prefix, bases, unsubscribe } of LANGUAGES) {
    test(`${prefix}/cookie-policy names every service it loads, and no removed one`, async ({
      page,
    }) => {
      await page.goto(`${prefix}/cookie-policy`);
      const body = page.locator("body");

      for (const name of ["Google Analytics", "Zencal", "Vercel Web Analytics", "Speed Insights"]) {
        await expect(body).toContainText(name);
      }
      await expect(body).not.toContainText(/Google Fonts|ClickRank/i);
    });

    test(`${prefix}/privacy-policy names every recipient, and no removed one`, async ({
      page,
    }) => {
      await page.goto(`${prefix}/privacy-policy`);
      const body = page.locator("body");

      for (const name of ["Vercel", "Google", "Formspree", "Resend", "Zencal", "Sentry", "LLM Wiki"]) {
        await expect(body).toContainText(name);
      }
      // Each purpose is paired with its basis; the consent-based list says how to leave it.
      for (const basis of bases) {
        await expect(body).toContainText(basis);
      }
      await expect(body).toContainText(unsubscribe);
      await expect(body).not.toContainText(/Google Fonts|ClickRank/i);
    });
  }
});
