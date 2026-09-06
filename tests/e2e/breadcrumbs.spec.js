import { expect, test } from "@playwright/test";
import { testUrls } from "../fixtures/test-data.js";
import { waitForAnimations } from "../utils/test-helpers.js";

test.describe("Breadcrumbs", () => {
  test.beforeEach(({ page }) => {
    page.on("console", (msg) => console.log(`BROWSER: ${msg.text()}`));
  });

  test("powinny być widoczne na stronie bloga", async ({ page }) => {
    await page.goto(testUrls.blog);
    await waitForAnimations(page, 2000); // Increased wait

    // Check if H1 is visible
    await expect(page.locator("h1")).toBeVisible();

    const breadcrumbs = page.locator("nav[aria-label='Breadcrumb']");
    
    // Debugging
    if (!(await breadcrumbs.isVisible())) {
      console.log("Breadcrumbs not visible.");
      const navs = await page.locator("nav").all();
      console.log(`Found ${navs.length} nav elements.`);
      for (const nav of navs) {
        console.log("Nav HTML:", await nav.evaluate(el => el.outerHTML));
        console.log("Nav visible:", await nav.isVisible());
      }
    }

    await expect(breadcrumbs).toBeVisible();

    // Sprawdź elementy
    const items = breadcrumbs.locator("li");
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toHaveText("Home");
    await expect(items.nth(1)).toHaveText("Blog");
  });

  test("powinny być widoczne na stronie posta", async ({ page }) => {
    // Przejdź do pierwszego posta
    await page.goto(testUrls.blog);
    await waitForAnimations(page, 2000);
    
    const firstPostLink = page.locator(".blog-card h2 a").first();
    const postTitle = await firstPostLink.textContent();
    await firstPostLink.click();
    
    await waitForAnimations(page, 2000);

    const breadcrumbs = page.locator("nav[aria-label='Breadcrumb']");
    await expect(breadcrumbs).toBeVisible();

    // Sprawdź elementy
    const items = breadcrumbs.locator("li");
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toHaveText("Home");
    await expect(items.nth(1)).toHaveText("Blog");
    await expect(items.nth(2)).toHaveText(postTitle);
  });

  test("powinny mieć poprawne linki", async ({ page }) => {
    await page.goto(testUrls.blog);
    await waitForAnimations(page, 2000);

    const homeLink = page.locator("nav[aria-label='Breadcrumb'] a[href='/']");
    await expect(homeLink).toBeVisible();
    
    // Kliknij Home i sprawdź czy przenosi na stronę główną
    await homeLink.click();
    await expect(page).toHaveURL(/\/$/);
  });
  
});
