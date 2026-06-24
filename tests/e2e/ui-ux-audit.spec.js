import { expect, test } from "@playwright/test";
import { testUrls } from "../fixtures/test-data.js";
import { waitForAnimations } from "../utils/test-helpers.js";

/**
 * Regression tests for the 2026-06-24 UI/UX audit fixes.
 * Report: .claude/agents/reports/ui-ux-audit-2026-06-24.md
 *
 * Each describe maps to an audit finding (C1/C2/H1/H2/H4/M3) so a failure
 * points straight at the change that regressed.
 */

// C2 — project cards must navigate, with NO invalid nested <a> and external
// links that don't hijack card navigation.
test.describe("C2 — project card links (stretched-link, no nested anchors)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testUrls.home);
    await waitForAnimations(page, 500);
  });

  test("clicking a card body navigates to the project page", async ({
    page,
  }) => {
    const card = page.locator(".project-card").first();
    const title = await card.locator("h3").innerText();

    await card.click();

    await expect(page).toHaveURL(/\/projects\//);
    await expect(page.locator("h1")).toHaveText(title);
  });

  test("no nested <a> inside project cards (valid HTML)", async ({ page }) => {
    // <a> inside <a> is invalid and was the bug. Must be zero.
    const nestedAnchors = await page.locator(".project-card a a").count();
    expect(nestedAnchors).toBe(0);
  });

  test("external project links open in a new tab and are safe", async ({
    page,
  }) => {
    const externalLinks = page.locator(
      '.project-card a[target="_blank"]'
    );
    const count = await externalLinks.count();

    // The current projects dataset exposes no github/live links, so the
    // overlay never renders. Skip explicitly instead of passing vacuously —
    // when links are added this test starts guarding them automatically.
    test.skip(
      count === 0,
      "no external project links in current data (overlay not rendered)"
    );

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      await expect(link).toHaveAttribute("rel", /noopener/);
      await expect(link).toHaveAttribute("href", /^https?:\/\//);
    }
  });
});

// H1 — skip link is the first tabbable element and targets #main.
test.describe("H1 — skip to content link", () => {
  test("first Tab focuses a skip link pointing at #main", async ({ page }) => {
    await page.goto(testUrls.home);
    await waitForAnimations(page, 300);

    await page.keyboard.press("Tab");

    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName,
        href: el?.getAttribute("href"),
        text: el?.textContent?.trim(),
      };
    });

    expect(focused.tag).toBe("A");
    expect(focused.href).toBe("#main");
    expect(focused.text).toContain("treści");
  });

  test("a <main id='main'> target exists", async ({ page }) => {
    await page.goto(testUrls.home);
    await expect(page.locator("main#main")).toHaveCount(1);
  });
});

// H2 — mobile menu toggle exposes aria-expanded state.
test.describe("H2 — mobile menu aria-expanded", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("toggle reflects open/closed state and controls the menu", async ({
    page,
  }) => {
    await page.goto(testUrls.home);
    await waitForAnimations(page, 500);

    const toggle = page.getByRole("button", { name: "Toggle menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toHaveAttribute("aria-controls", "mobile-menu");

    await toggle.click();
    await waitForAnimations(page, 400);

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#mobile-menu")).toBeVisible();
  });
});

// M3 + H4 — contact form validates on blur and wires errors to a11y.
test.describe("M3/H4 — contact form blur validation + a11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testUrls.home);
    await waitForAnimations(page, 500);
    await page.locator("#contact").scrollIntoViewIfNeeded();
  });

  test("blurring an empty name field shows an alert error", async ({
    page,
  }) => {
    const name = page.locator('input[name="name"]');
    await name.focus();
    await name.blur();

    const error = page.locator("#name-error");
    await expect(error).toBeVisible();
    await expect(error).toHaveAttribute("role", "alert");
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAttribute("aria-describedby", "name-error");
  });

  test("a valid name on blur produces no error", async ({ page }) => {
    const name = page.locator('input[name="name"]');
    await name.fill("Jan Kowalski");
    await name.blur();

    await expect(page.locator("#name-error")).toHaveCount(0);
  });

  test("invalid email on blur shows an email error", async ({ page }) => {
    const email = page.locator('input[name="email"]');
    await email.fill("not-an-email");
    await email.blur();

    await expect(page.locator("#email-error")).toBeVisible();
  });

  test("submit with a too-short message focuses the invalid field", async ({
    page,
  }) => {
    // All required fields are filled so native validation passes and the
    // custom validator (message < 10 chars) runs, exercising focus management.
    await page.locator('input[name="name"]').fill("Jan Kowalski");
    await page.locator('input[name="email"]').fill("jan@example.com");
    await page.locator('textarea[name="message"]').fill("hi");

    await page.getByRole("button", { name: /wyśl|send|submit/i }).click();

    await expect(page.locator("#message-error")).toBeVisible();

    const focusedName = await page.evaluate(
      () => document.activeElement?.getAttribute("name")
    );
    expect(focusedName).toBe("message");
  });
});

// C1 — reduced-motion preference is honored for CSS-driven motion.
test.describe("C1 — prefers-reduced-motion", () => {
  test("smooth scrolling is disabled", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(testUrls.home);

    const scrollBehavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior
    );
    expect(scrollBehavior).toBe("auto");
  });

  test("CSS animations are effectively disabled", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(testUrls.home);

    // The hero logo uses .animate-glow (2s by default).
    const durationSeconds = await page.evaluate(() => {
      const el = document.querySelector(".animate-glow");
      if (!el) return null;
      return parseFloat(getComputedStyle(el).animationDuration);
    });

    expect(durationSeconds).not.toBeNull();
    expect(durationSeconds).toBeLessThan(0.1);
  });
});
