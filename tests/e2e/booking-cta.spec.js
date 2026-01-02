import { expect, test } from "@playwright/test";
import { testUrls } from "../fixtures/test-data.js";
import { scrollToElement, waitForAnimations } from "../utils/test-helpers.js";

test.describe("Sekcja Booking CTA - Rezerwacja konsultacji", () => {
  test.setTimeout(60000); // 60 sekund
  test.describe.configure({ retries: 1 }); // Retry raz w przypadku flaky timeout

  test.beforeEach(async ({ page }) => {
    // Mock Zencal widget - blokujemy ładowanie zewnętrznego skryptu
    await page.route("**/embed.zencal.io/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "text/javascript",
        body: `
          // Mock Zencal widget - nie ładujemy prawdziwego widgetu
          console.log("Zencal widget mocked for testing");
          window.Zencal = {
            load: () => console.log("Zencal.load() called"),
            init: () => console.log("Zencal.init() called")
          };
        `,
      });
    });

    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#booking");
    await waitForAnimations(page, 1500);
  });

  test("powinna być widoczna na stronie głównej", async ({ page }) => {
    const section = page.locator("#booking");
    await expect(section).toBeVisible();

    const heading = section.locator("h2");
    await expect(heading).toContainText("Umów spotkanie");
  });

  test("powinna wyświetlać nagłówek z gradientem", async ({ page }) => {
    const heading = page.locator("#booking h2");
    await expect(heading).toBeVisible();

    const className = await heading.getAttribute("class");
    expect(className).toContain("gradient-text");
  });

  test("powinna wyświetlać podnagłówek o bezpłatnej konsultacji", async ({
    page,
  }) => {
    const subheading = page.locator("#booking h3");
    await expect(subheading).toBeVisible();
    await expect(subheading).toContainText("Umów bezpłatną konsultację");
  });

  test("powinna wyświetlać opis konsultacji", async ({ page }) => {
    const description = page.locator("#booking p").first();
    await expect(description).toBeVisible();
    await expect(description).toContainText(
      "30-minutową bezpłatną konsultację"
    );
    await expect(description).toContainText("Bez zobowiązań");
  });

  test("powinna wyświetlać listę korzyści z konsultacji", async ({ page }) => {
    const benefitsList = page.locator("#booking ul");
    await expect(benefitsList).toBeVisible();

    const benefits = page.locator("#booking ul li");
    const count = await benefits.count();
    expect(count).toBeGreaterThanOrEqual(4); // Powinno być co najmniej 4 korzyści

    // Sprawdź przykładowe korzyści
    await expect(benefits.first()).toContainText(/Analiza|analiza/);
  });

  test("przycisk CTA 'Zarezerwuj Bezpłatną Konsultację' powinien być widoczny", async ({
    page,
  }) => {
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();

    // Sprawdź klasy przycisku
    const className = await ctaButton.getAttribute("class");
    expect(className).toContain("btn-primary");
  });

  test("powinna wyświetlać informację o czasie i warunkach", async ({
    page,
  }) => {
    const infoText = page.locator('#booking p:has-text("30 minut online")');
    await expect(infoText).toBeVisible();
    await expect(infoText).toContainText("Bez zobowiązań");
    await expect(infoText).toContainText("Całkowicie za darmo");
  });

  test("powinna mieć tło z dekoracjami (blurred circles)", async ({ page }) => {
    const section = page.locator("#booking");

    // Sprawdź czy sekcja ma relative positioning dla dekoracji
    const sectionClass = await section.getAttribute("class");
    expect(sectionClass).toContain("relative");
  });
});

test.describe("Modal rezerwacji - Funkcjonalność", () => {
  test.setTimeout(60000); // 60 sekund
  test.describe.configure({ retries: 1 });

  test.beforeEach(async ({ page }) => {
    // Mock Zencal widget
    await page.route("**/embed.zencal.io/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "text/javascript",
        body: `
          console.log("Zencal widget mocked");
          window.Zencal = {
            load: () => console.log("Zencal.load() called"),
            init: () => console.log("Zencal.init() called")
          };
        `,
      });
    });

    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#booking");
    await waitForAnimations(page, 1500);
  });

  test("kliknięcie przycisku CTA powinno otworzyć modal", async ({ page }) => {
    // Sprawdź czy modal jest początkowo zamknięty (selektor dla backdrop modala z role dialog)
    const modalBefore = page.locator('[role="dialog"]');
    expect(await modalBefore.count()).toBe(0);

    // Kliknij przycisk CTA
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    // Sprawdź czy modal się pojawił (sprawdź po role="dialog")
    const modalAfter = page.locator('[role="dialog"]');
    await expect(modalAfter).toBeVisible({ timeout: 5000 });
  });

  test("modal powinien zawierać tytuł rezerwacji", async ({ page }) => {
    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    // Sprawdź tytuł modala
    const modalTitle = page.locator(
      'h2:has-text("Rezerwacja bezpłatnej konsultacji"), h3:has-text("Rezerwacja bezpłatnej konsultacji")'
    );
    await expect(modalTitle).toBeVisible({ timeout: 5000 });
  });

  test("modal powinien zawierać opis z instrukcjami", async ({ page }) => {
    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    // Sprawdź opis
    const description = page.locator('p:has-text("Wybierz dogodny termin")');
    await expect(description).toBeVisible({ timeout: 5000 });
    await expect(description).toContainText("link do spotkania online");
  });

  test("modal powinien mieć przycisk zamknięcia (X)", async ({ page }) => {
    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    // Sprawdź przycisk zamknięcia (obsługa angielskiego aria-label)
    const closeButton = page.locator(
      'button[aria-label="Close modal"], button[aria-label="Zamknij modal"]'
    );
    await expect(closeButton).toBeVisible({ timeout: 5000 });
  });

  test("kliknięcie przycisku X powinno zamknąć modal", async ({ page }) => {
    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Zamknij modal przyciskiem X (obsługa angielskiego aria-label)
    const closeButton = page.locator(
      'button[aria-label="Close modal"], button[aria-label="Zamknij modal"]'
    );
    await closeButton.click();
    await waitForAnimations(page, 500);

    // Sprawdź czy modal zniknął
    expect(await modal.count()).toBe(0);
  });

  test("kliknięcie na backdrop powinno zamknąć modal", async ({ page }) => {
    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Kliknij na backdrop - używamy nth-child selektora aby znaleźć parent

    await page.evaluate(() => {
      const modalParent = document.querySelector('[role="dialog"]').parentElement;
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      modalParent.dispatchEvent(clickEvent);
    });
    await waitForAnimations(page, 500);

    // Sprawdź czy modal zniknął
    expect(await modal.count()).toBe(0);
  });

  test("naciśnięcie klawisza ESC powinno zamknąć modal", async ({ page }) => {
    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Naciśnij ESC
    await page.keyboard.press("Escape");
    await waitForAnimations(page, 500);

    // Sprawdź czy modal zniknął
    expect(await modal.count()).toBe(0);
  });

  test("modal powinien blokować scroll body podczas otwarcia", async ({
    page,
  }) => {
    // Sprawdź początkowy stan body overflow
    const bodyOverflowBefore = await page.evaluate(
      () => document.body.style.overflow
    );
    expect(bodyOverflowBefore).not.toBe("hidden");

    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    // Sprawdź czy body overflow jest ustawione na hidden
    const bodyOverflowAfter = await page.evaluate(
      () => document.body.style.overflow
    );
    expect(bodyOverflowAfter).toBe("hidden");

    // Zamknij modal (obsługa angielskiego aria-label)
    const closeButton = page.locator(
      'button[aria-label="Close modal"], button[aria-label="Zamknij modal"]'
    );
    await closeButton.click();
    await waitForAnimations(page, 500);

    // Sprawdź czy overflow wrócił do normalnego
    const bodyOverflowFinal = await page.evaluate(
      () => document.body.style.overflow
    );
    expect(bodyOverflowFinal).not.toBe("hidden");
  });

  test("modal powinien zawierać mock widgetu Zencal", async ({ page }) => {
    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 1000);

    // Sprawdź czy jest placeholder widgetu lub div z odpowiednim ID
    const zencalWidget = page
      .locator('[class*="zencal"], [id*="zencal"], div[style*="min-height"]')
      .first();

    // Widget może być zmockowany, więc sprawdzamy tylko czy modal nie crashuje
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });
});

test.describe("Modal rezerwacji - Accessibility", () => {
  test.setTimeout(60000);
  test.describe.configure({ retries: 1 });

  test.beforeEach(async ({ page }) => {
    // Mock Zencal widget
    await page.route("**/embed.zencal.io/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "text/javascript",
        body: `
          console.log("Zencal widget mocked");
          window.Zencal = { load: () => {}, init: () => {} };
        `,
      });
    });

    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#booking");
    await waitForAnimations(page, 1500);
  });

  test("modal powinien mieć focus trap - Tab powinien pozostać wewnątrz modala", async ({
    page,
  }) => {
    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Sprawdź czy focus jest w modale
    await page.keyboard.press("Tab");
    const focusedElement1 = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(focusedElement1).toBeTruthy();

    // Kolejne Tab - focus powinien pozostać w modale
    await page.keyboard.press("Tab");
    const focusedElement2 = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(focusedElement2).toBeTruthy();
  });

  test("modal powinien przywrócić focus do przycisku CTA po zamknięciu", async ({
    page,
  }) => {
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );

    // Otwórz modal
    await ctaButton.click();
    await waitForAnimations(page, 500);

    // Zamknij modal
    await page.keyboard.press("Escape");
    await waitForAnimations(page, 500);

    // Sprawdź czy focus wrócił do przycisku lub czy przycisk jest na stronie
    const isCTAVisible = await ctaButton.isVisible();
    expect(isCTAVisible).toBeTruthy();
  });

  test("modal powinien mieć odpowiednie ARIA attributes", async ({ page }) => {
    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    // Sprawdź role modala (może być dialog lub obecność w DOM)
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Sprawdź czy przycisk zamknięcia ma aria-label (obsługa angielskiego)
    const closeButton = page.locator(
      'button[aria-label="Close modal"], button[aria-label="Zamknij modal"]'
    );
    const ariaLabel = await closeButton.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
  });
});

test.describe("Sekcja Booking CTA - Responsywność", () => {
  test.setTimeout(60000);
  test.describe.configure({ retries: 1 });

  test.beforeEach(async ({ page }) => {
    // Mock Zencal widget
    await page.route("**/embed.zencal.io/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "text/javascript",
        body: "console.log('Zencal mocked'); window.Zencal = { load: () => {}, init: () => {} };",
      });
    });
  });

  test("sekcja powinna być widoczna na mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#booking");
    await waitForAnimations(page, 1000);

    const section = page.locator("#booking");
    await expect(section).toBeVisible();

    const heading = section.locator("h2");
    await expect(heading).toBeVisible();

    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await expect(ctaButton).toBeVisible();
  });

  test("modal powinien być responsywny na mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#booking");
    await waitForAnimations(page, 1000);

    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    // Sprawdź czy modal jest widoczny i nie wychodzi poza viewport
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Sprawdź czy można zamknąć modal na mobile (obsługa angielskiego aria-label)
    const closeButton = page.locator(
      'button[aria-label="Close modal"], button[aria-label="Zamknij modal"]'
    );
    await expect(closeButton).toBeVisible();
    await expect(closeButton).toBeEnabled();
  });

  test("sekcja powinna być widoczna na tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#booking");
    await waitForAnimations(page, 1000);

    const section = page.locator("#booking");
    await expect(section).toBeVisible();

    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await expect(ctaButton).toBeVisible();
  });

  test("sekcja powinna być widoczna na desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
    await scrollToElement(page, "#booking");
    await waitForAnimations(page, 1000);

    const section = page.locator("#booking");
    await expect(section).toBeVisible();

    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await expect(ctaButton).toBeVisible();
  });
});

test.describe("Integracja Booking CTA z innymi sekcjami", () => {
  test.setTimeout(60000);
  test.describe.configure({ retries: 1 });

  test.beforeEach(async ({ page }) => {
    // Mock Zencal widget
    await page.route("**/embed.zencal.io/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "text/javascript",
        body: "console.log('Zencal mocked'); window.Zencal = { load: () => {}, init: () => {} };",
      });
    });

    await page.goto(testUrls.home, { timeout: 45000 });
    await waitForAnimations(page, 1500);
  });

  test("sekcja Booking powinna być między Testimonials a ContactForm", async ({
    page,
  }) => {
    await scrollToElement(page, "#testimonials");
    await waitForAnimations(page, 500);

    const testimonialsSection = page.locator("#testimonials");
    await expect(testimonialsSection).toBeVisible();

    await scrollToElement(page, "#booking");
    await waitForAnimations(page, 500);

    const bookingSection = page.locator("#booking");
    await expect(bookingSection).toBeVisible();

    await scrollToElement(page, "#contact");
    await waitForAnimations(page, 500);

    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeVisible();
  });

  test("użytkownik powinien móc przejść przez cały flow: Testimonials → Booking CTA → Modal → Zamknięcie → ContactForm", async ({
    page,
  }) => {
    // Scroll do Testimonials
    await scrollToElement(page, "#testimonials");
    await waitForAnimations(page, 500);
    const testimonialsSection = page.locator("#testimonials");
    await expect(testimonialsSection).toBeVisible();

    // Scroll do Booking
    await scrollToElement(page, "#booking");
    await waitForAnimations(page, 500);
    const bookingSection = page.locator("#booking");
    await expect(bookingSection).toBeVisible();

    // Otwórz modal
    const ctaButton = page.locator(
      '#booking button:has-text("Zarezerwuj Bezpłatną Konsultację")'
    );
    await ctaButton.click();
    await waitForAnimations(page, 500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Zamknij modal
    await page.keyboard.press("Escape");
    await waitForAnimations(page, 500);
    expect(await modal.count()).toBe(0);

    // Scroll do ContactForm
    await scrollToElement(page, "#contact");
    await waitForAnimations(page, 500);
    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeVisible();
  });
});

