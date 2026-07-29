import { expect, test } from "@playwright/test";
import { waitForAnimations } from "../utils/test-helpers.js";

const PL_SLUG = "srodowisko-agentowe-ai-dwie-firmy";
const EN_SLUG = "agentic-ai-environment-two-companies";

test.describe("Language Switcher - Blog Posts", () => {
  test("PL→EN: navigates to correct EN slug on blog post", async ({ page }) => {
    await page.goto(`/blog/${PL_SLUG}`);
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 1000);

    // Verify we're on the PL article
    const article = page.locator("article");
    await expect(article).toBeVisible({ timeout: 15000 });

    // Click language switcher — pick the VISIBLE one (desktop + mobile nav each
    // render a switcher; `.first()` would grab the hidden desktop copy on mobile)
    const langButton = page.locator('a[aria-label="Switch to English"]:visible').first();
    await expect(langButton).toBeVisible({ timeout: 10000 });
    await langButton.click();

    // Should navigate to EN version with different slug
    await page.waitForURL(`**/en/blog/${EN_SLUG}`, { timeout: 15000 });
    expect(page.url()).toContain(`/en/blog/${EN_SLUG}`);

    // Verify article loaded
    await expect(page.locator("article")).toBeVisible({ timeout: 15000 });
  });

  test("EN→PL: navigates to correct PL slug on blog post", async ({ page }) => {
    await page.goto(`/en/blog/${EN_SLUG}`);
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 1000);

    const article = page.locator("article");
    await expect(article).toBeVisible({ timeout: 15000 });

    // Click language switcher — pick the VISIBLE one (see note above)
    const langButton = page.locator('a[aria-label="Przełącz na polski"]:visible').first();
    await expect(langButton).toBeVisible({ timeout: 10000 });
    await langButton.click();

    // Should navigate to PL version with different slug
    await page.waitForURL(`**/blog/${PL_SLUG}`, { timeout: 15000 });
    expect(page.url()).toContain(`/blog/${PL_SLUG}`);
    expect(page.url()).not.toContain("/en/");

    await expect(page.locator("article")).toBeVisible({ timeout: 15000 });
  });

  test("non-blog pages: prefix-based switching still works", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 1000);

    // Switch to EN — pick the VISIBLE switcher (desktop/mobile both render one)
    const langButton = page.locator('a[aria-label="Switch to English"]:visible').first();
    await expect(langButton).toBeVisible({ timeout: 10000 });
    await langButton.click();

    await page.waitForURL("**/en/blog", { timeout: 15000 });
    expect(page.url()).toContain("/en/blog");

    // Switch back to PL
    const langButtonBack = page.locator('a[aria-label="Przełącz na polski"]:visible').first();
    await expect(langButtonBack).toBeVisible({ timeout: 10000 });
    await langButtonBack.click();

    await page.waitForURL(/\/blog\/?$/, { timeout: 15000 });
    expect(page.url()).not.toContain("/en/");
  });
});
