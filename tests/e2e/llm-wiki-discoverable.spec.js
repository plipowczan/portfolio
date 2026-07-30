import { expect, test } from "@playwright/test";

/**
 * The 2026-07-28 SEO audit found /llm-wiki and its 8 course lessons — 10 URLs
 * including the site's main lead magnet — with zero internal inbound links.
 * Not from the nav, the footer, the homepage or the blog index. Reachable only
 * via sitemap.xml, which is the weakest possible discovery signal.
 *
 * The section is Polish-only. Before this change /en/llm-wiki returned a hard
 * 404; it now resolves through a 301 in vercel.json, which exists as a safety
 * net for external and legacy links. Nothing on the site should link there —
 * the course links belong on PL routes, without an /en prefix.
 */

const PL_ROUTES = ["/", "/blog", "/blog/slabe-strony-claude-code"];

for (const path of PL_ROUTES) {
  test(`${path} links to /llm-wiki`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('a[href="/llm-wiki"]').first()).toBeAttached();
  });
}

test("the nav exposes the course on Polish routes", async ({ page, isMobile }) => {
  await page.goto("/");

  // One instance in the markup: the desktop bar. The mobile menu renders the
  // same items, but AnimatePresence only mounts them once the menu is open —
  // so this count is also what a crawler sees.
  const navLink = page.locator('nav a[href="/llm-wiki"]');
  await expect(navLink).toHaveCount(1);

  if (isMobile) {
    // The desktop bar is `hidden md:flex`, so on a phone viewport the link is
    // attached but not visible. Reaching it means opening the menu.
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await expect(page.locator('#mobile-menu a[href="/llm-wiki"]')).toBeVisible();
  } else {
    await expect(navLink).toBeVisible();
  }
});

test("the footer exposes the course on Polish routes", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('footer a[href="/llm-wiki"]')).toHaveCount(1);
});

test("the nav and footer omit the course on English routes", async ({ page }) => {
  await page.goto("/en/");

  // Scoped to the chrome we control. Individual translated posts may still link
  // to the Polish course from their prose — that is an editorial call in the
  // markdown, not something this navigation logic should silently override.
  await expect(page.locator('nav a[href="/llm-wiki"]')).toHaveCount(0);
  await expect(page.locator('footer a[href="/llm-wiki"]')).toHaveCount(0);
});

test("no page links to the /en-prefixed course URL", async ({ page }) => {
  // /en/llm-wiki only resolves via a redirect, so nothing should link to it —
  // including the language switcher on the course pages themselves, which is
  // where all ten of these came from.
  for (const path of [...PL_ROUTES, "/en/", "/en/blog", "/llm-wiki", "/llm-wiki/kurs"]) {
    await page.goto(path);
    const bad = await page.locator('a[href*="/en/llm-wiki"]').count();
    expect(bad, `${path} links to /en/llm-wiki, which only exists as a redirect`).toBe(0);
  }
});

test("the language switcher offers the English home from course pages", async ({ page }) => {
  await page.goto("/llm-wiki/kurs");
  // Rendered twice — once in the desktop bar, once beside the mobile menu
  // button — so assert on every instance rather than assuming one.
  const switcher = page.locator('nav a[aria-label*="English"]');
  await expect(switcher).toHaveCount(2);

  for (const href of await switcher.evaluateAll((els) => els.map((e) => e.getAttribute("href")))) {
    expect(href).toBe("/en/");
  }
});

test("the course hub is reachable from the landing page", async ({ page }) => {
  // /llm-wiki itself was reachable only via sitemap; confirm the hop onward to
  // the lessons exists too, so the whole subtree is connected.
  await page.goto("/llm-wiki");
  await expect(page.locator('a[href^="/llm-wiki/kurs"]').first()).toBeAttached();
});
