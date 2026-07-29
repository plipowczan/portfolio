import { expect, test } from "@playwright/test";

/**
 * Regression guards for the two image-loading defects found in the 2026-07-28
 * SEO audit: the blog index shipped 30 eager card images (13.7s mobile LCP),
 * and the article cover image — the LCP element itself — was marked lazy.
 *
 * Both are single-attribute mistakes that are invisible in review and only
 * show up in a Lighthouse run, so they get asserted here instead.
 */

test.describe("blog index image loading", () => {
  test("only the first card image loads eagerly; the rest are lazy", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForSelector(".blog-card img");

    const imgs = page.locator(".blog-card img");
    const count = await imgs.count();
    expect(count).toBeGreaterThan(5); // guard: the fixture must be a real list

    // The first card is the LCP candidate — lazy-loading it is its own
    // Lighthouse penalty, so it must stay eager and priority-hinted.
    await expect(imgs.first()).toHaveAttribute("loading", "eager");
    await expect(imgs.first()).toHaveAttribute("fetchpriority", "high");

    // Every other card must be lazy. Images already inside the viewport still
    // fetch immediately, so this costs nothing above the fold.
    const notLazy = [];
    for (let i = 1; i < count; i++) {
      const loading = await imgs.nth(i).getAttribute("loading");
      if (loading !== "lazy") notLazy.push({ i, loading });
    }
    expect(notLazy, `card images missing loading="lazy": ${JSON.stringify(notLazy)}`).toEqual([]);
  });
});

test.describe("article cover image loading", () => {
  test("the cover image is eager and priority-hinted, not lazy", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForSelector(".blog-card");
    await page.locator(".blog-card h2 a").first().click();
    await page.waitForSelector("article img, main img");

    const cover = page.locator("main img").first();
    await expect(cover).toHaveAttribute("loading", "eager");
    await expect(cover).toHaveAttribute("fetchpriority", "high");
  });
});

test.describe("project card images (reference pattern)", () => {
  // BlogCard was the outlier: ProjectCard already lazy-loaded correctly, which
  // is what made the blog index defect easy to miss in review.
  test("project cards still lazy-load", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".project-card img");

    const imgs = page.locator(".project-card img");
    const count = await imgs.count();
    expect(count).toBeGreaterThan(3);

    for (let i = 0; i < count; i++) {
      await expect(imgs.nth(i)).toHaveAttribute("loading", "lazy");
    }
  });
});
