import { expect, test } from "@playwright/test";
import { testUrls } from "../fixtures/test-data.js";
import {
  scrollToElement,
  waitForAnimations,
} from "../utils/test-helpers.js";

// Zwiększ timeout dla testów testimonials (animacje Framer Motion)
test.describe("Sekcja Testimonials - Opinie", () => {
  test.setTimeout(60000); // 60 sekund
  test.describe.configure({ retries: 1 }); // Retry raz w przypadku flaky timeout

  test.beforeEach(async ({ page }) => {
    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#testimonials");
    await waitForAnimations(page, 1500);
  });

  test("powinna być widoczna na stronie głównej", async ({ page }) => {
    const section = page.locator("#testimonials");
    await expect(section).toBeVisible();

    const heading = section.locator("h2");
    await expect(heading).toContainText("Co mówią o współpracy");
  });

  test("powinna wyświetlać nagłówek z gradientem", async ({ page }) => {
    const heading = page.locator("#testimonials h2");
    await expect(heading).toBeVisible();

    const className = await heading.getAttribute("class");
    expect(className).toContain("gradient-text");
  });

  test("powinna wyświetlać opis sekcji", async ({ page }) => {
    const description = page.locator("#testimonials p").first();
    await expect(description).toContainText("Opinie od współpracowników");
  });

  test("powinna wyświetlać karty testimoniali", async ({ page }) => {
    // Karty zawierają obrazy avatarów
    const avatars = page.locator("#testimonials img");
    const count = await avatars.count();
    expect(count).toBeGreaterThan(0);
  });

  test("karta testimonial powinna zawierać avatar w formacie WebP", async ({ page }) => {
    const avatars = page.locator("#testimonials img");
    const count = await avatars.count();
    expect(count).toBeGreaterThan(0);

    const firstAvatar = avatars.first();
    await expect(firstAvatar).toBeVisible();

    const src = await firstAvatar.getAttribute("src");
    expect(src).toContain("/images/testimonials/");
    expect(src).toContain(".webp");
  });

  test("karta testimonial powinna mieć link do LinkedIn", async ({ page }) => {
    const linkedInLinks = page.locator('#testimonials a[href*="linkedin.com/in/"]');
    const count = await linkedInLinks.count();
    expect(count).toBeGreaterThan(0);

    const firstLink = linkedInLinks.first();
    await expect(firstLink).toBeVisible();

    const target = await firstLink.getAttribute("target");
    expect(target).toBe("_blank");

    const rel = await firstLink.getAttribute("rel");
    expect(rel).toContain("noopener");
  });

  test("LinkedIn CTA button powinien być widoczny", async ({ page }) => {
    const ctaButton = page.locator('#testimonials a:has-text("Zobacz wszystkie rekomendacje")');
    await expect(ctaButton).toBeVisible();

    const href = await ctaButton.getAttribute("href");
    expect(href).toContain("linkedin.com/in/pawellipowczan");
    expect(href).toContain("recommendations");
  });

  test("przyciski nawigacji karuzeli powinny istnieć", async ({ page }) => {
    // Strzałki nawigacji (prev/next)
    const buttons = page.locator("#testimonials button");
    const count = await buttons.count();

    // Powinno być więcej niż 0 przycisków (strzałki + kropki)
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Sekcja Testimonials - Responsywność", () => {
  test.setTimeout(60000); // 60 sekund
  test.describe.configure({ retries: 1 }); // Retry raz w przypadku flaky timeout

  test("sekcja powinna być widoczna na mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#testimonials");
    await waitForAnimations(page, 1500);

    const section = page.locator("#testimonials");
    await expect(section).toBeVisible();

    // Sprawdź czy avatar jest widoczny
    const avatar = page.locator("#testimonials img").first();
    await expect(avatar).toBeVisible();
  });

  test("sekcja powinna być widoczna na desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#testimonials");
    await waitForAnimations(page, 1500);

    const section = page.locator("#testimonials");
    await expect(section).toBeVisible();

    // Na desktop powinny być widoczne avatary
    const avatars = page.locator("#testimonials img");
    const count = await avatars.count();
    expect(count).toBeGreaterThan(0);
  });

  test("LinkedIn CTA powinien być widoczny na mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#testimonials");
    await waitForAnimations(page, 1500);

    const ctaButton = page.locator('#testimonials a:has-text("Zobacz wszystkie rekomendacje")');
    await expect(ctaButton).toBeVisible();
  });
});

test.describe("Sekcja Testimonials - Integracja", () => {
  test.setTimeout(60000); // 60 sekund
  test.describe.configure({ retries: 1 }); // Retry raz w przypadku flaky timeout

  test("sekcja powinna być między Skills a Contact", async ({ page }) => {
    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1000);

    const sectionOrder = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll("section[id]"));
      return sections.map((section) => section.id);
    });

    const skillsIndex = sectionOrder.indexOf("skills");
    const testimonialsIndex = sectionOrder.indexOf("testimonials");
    const contactIndex = sectionOrder.indexOf("contact");

    expect(testimonialsIndex).toBeGreaterThan(skillsIndex);
    expect(testimonialsIndex).toBeLessThan(contactIndex);
  });

  test("obrazki avatarów powinny mieć lazy loading", async ({ page }) => {
    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#testimonials");
    await waitForAnimations(page, 1500);

    const firstAvatar = page.locator("#testimonials img").first();
    const loading = await firstAvatar.getAttribute("loading");

    expect(loading).toBe("lazy");
  });

  test("link Opinie w nawigacji powinien istnieć", async ({ page }) => {
    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1000);

    // Znajdź link do testimonials w nawigacji (desktop)
    const navLink = page.locator('a[href="/#testimonials"]');
    const count = await navLink.count();

    // Link powinien istnieć
    expect(count).toBeGreaterThan(0);
  });
});
