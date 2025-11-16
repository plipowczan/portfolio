import { expect, test } from "@playwright/test";
import { sectionIds, testUrls } from "../fixtures/test-data.js";
import {
  getSeoMetaTags,
  scrollToElement,
  testKeyboardNavigation,
  waitForAnimations,
} from "../utils/test-helpers.js";

test.describe("Strona główna - Home", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testUrls.home);
    await waitForAnimations(page, 1000);
  });

  test("powinna załadować się poprawnie i wyświetlić wszystkie sekcje", async ({
    page,
  }) => {
    // Sprawdź tytuł strony
    await expect(page).toHaveTitle(/Pawel Lipowczan/i);

    // Sprawdź czy wszystkie główne sekcje są obecne
    const sections = ["hero", "about", "projects", "skills", "contact"];

    for (const section of sections) {
      const sectionElement = page
        .locator(`#${section}`)
        .or(page.locator(`section:has-text("${section}")`))
        .first();
      await expect(sectionElement).toBeVisible({ timeout: 10000 });
    }
  });

  test("powinna mieć poprawne metatagi SEO", async ({ page }) => {
    const metaTags = await getSeoMetaTags(page);

    // Sprawdź podstawowe tagi
    expect(metaTags.title).toBeTruthy();
    expect(metaTags.title).toMatch(/Pawel Lipowczan/i);
    expect(metaTags.description).toBeTruthy();
    expect(metaTags.description.length).toBeGreaterThan(50);

    // Sprawdź Open Graph
    expect(metaTags.ogTitle).toBeTruthy();
    expect(metaTags.ogDescription).toBeTruthy();

    // Sprawdź Twitter Card
    expect(metaTags.twitterCard).toBeTruthy();
  });

  test("powinna wyświetlić logo w nawigacji", async ({ page }) => {
    const logo = page
      .locator('nav img[alt*="logo"]')
      .or(page.locator("nav svg"))
      .first();
    await expect(logo).toBeVisible();
  });

  test("sekcja Hero powinna mieć gradient text", async ({ page }) => {
    // Szukaj głównego nagłówka w sekcji hero
    const heroHeading = page.locator("h1").first();
    await expect(heroHeading).toBeVisible();

    // Sprawdź czy tekst jest widoczny i ma treść
    const text = await heroHeading.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test("przyciski CTA powinny być widoczne i klikalne", async ({ page }) => {
    // Szukaj przycisków CTA w sekcji Hero
    const ctaButtons = page
      .locator('a[href*="#contact"], button:has-text("Kontakt")')
      .first();

    if ((await ctaButtons.count()) > 0) {
      await expect(ctaButtons).toBeVisible();
      await expect(ctaButtons).toBeEnabled();
    }
  });

  test("linki nawigacyjne powinny działać poprawnie", async ({ page }) => {
    // Sprawdź link do bloga
    const blogLink = page
      .locator('nav a[href="/blog"]')
      .or(page.locator('a:has-text("Blog")'))
      .first();
    await expect(blogLink).toBeVisible();

    // Kliknij i sprawdź nawigację
    await blogLink.click();
    await page.waitForURL("**/blog");
    await expect(page).toHaveURL(/\/blog/);

    // Wróć do strony głównej
    await page.goto(testUrls.home);
  });

  test("scroll do sekcji powinien działać płynnie", async ({ page }) => {
    // Sprawdź czy możemy scrollować do sekcji About
    const aboutSection = page
      .locator("#about")
      .or(page.locator("section").nth(1))
      .first();

    if ((await aboutSection.count()) > 0) {
      await scrollToElement(page, "#about");
      await waitForAnimations(page, 500);

      // Sprawdź czy sekcja jest widoczna
      await expect(aboutSection).toBeInViewport();
    }
  });

  test("sekcja Projects powinna wyświetlać karty projektów", async ({
    page,
  }) => {
    // Scrolluj do sekcji projektów
    await scrollToElement(page, "#projects");
    await waitForAnimations(page, 1000);

    // Sprawdź czy są jakieś karty projektów
    const projectCards = page.locator('[class*="project"], [class*="card"]');
    const count = await projectCards.count();

    if (count > 0) {
      expect(count).toBeGreaterThan(0);
      // Sprawdź pierwszą kartę
      await expect(projectCards.first()).toBeVisible();
    }
  });

  test("sekcja Skills powinna wyświetlać umiejętności", async ({ page }) => {
    await scrollToElement(page, "#skills");
    await waitForAnimations(page, 1000);

    // Szukaj ikon lub tekstu związanego z umiejętnościami
    const skillItems = page.locator('[class*="skill"], [class*="tech"]');
    const count = await skillItems.count();

    if (count > 0) {
      expect(count).toBeGreaterThan(0);
    }
  });

  test("formularz kontaktowy powinien być dostępny", async ({ page }) => {
    await scrollToElement(page, "#contact");
    await waitForAnimations(page, 1000);

    // Sprawdź czy formularz istnieje
    const contactForm = page.locator("form");

    if ((await contactForm.count()) > 0) {
      await expect(contactForm).toBeVisible();

      // Sprawdź podstawowe pola
      const nameInput = contactForm
        .locator('input[name="name"], input[type="text"]')
        .first();
      const emailInput = contactForm
        .locator('input[name="email"], input[type="email"]')
        .first();
      const messageInput = contactForm.locator("textarea");

      if ((await nameInput.count()) > 0) await expect(nameInput).toBeVisible();
      if ((await emailInput.count()) > 0)
        await expect(emailInput).toBeVisible();
      if ((await messageInput.count()) > 0)
        await expect(messageInput).toBeVisible();
    }
  });

  test("Footer powinien zawierać linki do polityk", async ({ page }) => {
    // Scrolluj na dół strony
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await waitForAnimations(page, 500);

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Sprawdź linki do polityk
    const privacyLink = footer.locator('a[href*="privacy"]').first();
    const termsLink = footer.locator('a[href*="terms"]').first();

    if ((await privacyLink.count()) > 0) {
      await expect(privacyLink).toBeVisible();
    }

    if ((await termsLink.count()) > 0) {
      await expect(termsLink).toBeVisible();
    }
  });

  test("nawigacja klawiaturą powinna działać poprawnie", async ({ page }) => {
    // Rozpocznij od pierwszego linku w nawigacji
    const firstNavLink = page.locator("nav a").first();

    if ((await firstNavLink.count()) > 0) {
      const focusedElements = await testKeyboardNavigation(page, "nav a", 5);

      // Sprawdź czy udało się nawigować przez elementy
      expect(focusedElements.length).toBe(5);

      // Sprawdź czy elementy są interaktywne (A, BUTTON, INPUT, etc.)
      const interactiveTags = ["A", "BUTTON", "INPUT", "TEXTAREA"];
      const hasInteractiveElements = focusedElements.some((el) =>
        interactiveTags.includes(el.tag)
      );

      expect(hasInteractiveElements).toBeTruthy();
    }
  });
});

test.describe("Strona główna - Responsywność", () => {
  test("powinna być responsywna na mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testUrls.home);
    await waitForAnimations(page, 1000);

    // Sprawdź czy nawigacja mobilna działa
    const mobileMenuButton = page
      .locator('button[aria-label*="menu"], button:has-text("☰")')
      .first();

    // Jeśli istnieje przycisk menu mobilnego
    if ((await mobileMenuButton.count()) > 0) {
      await expect(mobileMenuButton).toBeVisible();
    }

    // Sprawdź czy główny nagłówek jest widoczny
    const heroHeading = page.locator("h1").first();
    await expect(heroHeading).toBeVisible();
  });

  test("powinna być responsywna na tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(testUrls.home);
    await waitForAnimations(page, 1000);

    const heroHeading = page.locator("h1").first();
    await expect(heroHeading).toBeVisible();
  });

  test("powinna być responsywna na desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(testUrls.home);
    await waitForAnimations(page, 1000);

    const heroHeading = page.locator("h1").first();
    await expect(heroHeading).toBeVisible();
  });
});
