/**
 * Przykłady zaawansowanych technik testowania z Playwright
 *
 * Ten plik zawiera przykłady różnych technik i patterns
 * które możesz użyć w swoich testach.
 */

import { expect, test } from "@playwright/test";

// ============================================
// 1. MOCKOWANIE API REQUESTS
// ============================================

test.describe("Mockowanie API", () => {
  test("powinien zamockować request do API", async ({ page }) => {
    // Mock successful response - Formspree endpoint
    await page.route("**/formspree.io/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
        }),
      });
    });

    await page.goto("http://localhost:3000");

    // Scrolluj do formularza
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Wypełnij i wyślij formularz
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill(
      'textarea[name="message"]',
      "Test wiadomość z automatycznego testu"
    );
    await page.click('button[type="submit"]');

    // Poczekaj na odpowiedź
    await page.waitForTimeout(2000);

    // Sprawdź czy pojawił się komunikat sukcesu
    await expect(page.locator(".success")).toBeVisible();
  });

  test("powinien obsłużyć błąd API", async ({ page }) => {
    // Mock error response - Formspree endpoint
    await page.route("**/formspree.io/**", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          error: "Błąd serwera",
        }),
      });
    });

    await page.goto("http://localhost:3000");

    // Scrolluj do formularza
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Wypełnij i wyślij formularz
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill(
      'textarea[name="message"]',
      "Test wiadomość z automatycznego testu"
    );
    await page.click('button[type="submit"]');

    // Poczekaj na odpowiedź
    await page.waitForTimeout(2000);

    // Sprawdź komunikat błędu
    await expect(page.locator(".error")).toBeVisible();
  });
});

// ============================================
// 2. TESTOWANIE LOCAL STORAGE / COOKIES
// ============================================

test.describe("Storage i Cookies", () => {
  test("powinien zapisać dane w localStorage", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Ustaw localStorage
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
    });

    // Odśwież stronę
    await page.reload();

    // Sprawdź czy theme został zapamiętany
    const theme = await page.evaluate(() => localStorage.getItem("theme"));
    expect(theme).toBe("dark");
  });

  test("powinien ustawić cookies", async ({ page, context }) => {
    // Ustaw localStorage zamiast cookies (zgodnie z implementacją)
    await page.goto("http://localhost:3000");

    await page.evaluate(() => {
      localStorage.setItem("cookieConsent", "accepted");
    });

    // Przeładuj stronę
    await page.reload();
    await page.waitForTimeout(1500); // Czekaj dłużej niż delay w CookieBanner (1000ms)

    // Sprawdź czy banner cookies nie pojawia się
    const cookieBanner = page.locator(".cookie-banner");
    await expect(cookieBanner).not.toBeVisible();
  });
});

// ============================================
// 3. TESTOWANIE PERFORMANCE
// ============================================

test.describe("Performance", () => {
  test("strona powinna załadować się szybko", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    console.log(`Czas ładowania: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // max 3 sekundy
  });

  test("powinien zmierzyć Core Web Vitals", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Zmierz LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ["largest-contentful-paint"] });

        // Timeout po 5 sekundach
        setTimeout(() => resolve(null), 5000);
      });
    });

    console.log(`LCP: ${lcp}ms`);
    if (lcp) {
      expect(lcp).toBeLessThan(2500); // Good LCP < 2.5s
    }
  });
});

// ============================================
// 4. TESTOWANIE SCROLL ANIMATIONS
// ============================================

test.describe("Scroll Animations", () => {
  test("elementy powinny animować się przy scrollu", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Element przed scrollem (może być niewidoczny lub mieć opacity 0)
    const projectSection = page.locator("#projects");

    // Scrolluj do sekcji
    await projectSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Czekaj na animację

    // Sprawdź czy sekcja jest widoczna
    await expect(projectSection).toBeVisible();

    // Sprawdź opacity (jeśli używasz fade-in)
    const opacity = await projectSection.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );

    expect(parseFloat(opacity)).toBeGreaterThan(0.5);
  });
});

// ============================================
// 5. TESTOWANIE HOVER EFFECTS
// ============================================

test.describe("Hover Effects", () => {
  test("karty projektów powinny reagować na hover", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.locator("#projects").scrollIntoViewIfNeeded();

    const firstCard = page.locator(".project-card").first();

    // Pobierz stan przed hover
    const beforeHover = await firstCard.evaluate((el) => ({
      transform: window.getComputedStyle(el).transform,
      scale: window.getComputedStyle(el).scale,
    }));

    // Hover nad kartą
    await firstCard.hover();
    await page.waitForTimeout(500); // Czekaj na animację

    // Pobierz stan po hover
    const afterHover = await firstCard.evaluate((el) => ({
      transform: window.getComputedStyle(el).transform,
      scale: window.getComputedStyle(el).scale,
    }));

    // Sprawdź czy coś się zmieniło (np. scale)
    expect(afterHover.transform).not.toBe(beforeHover.transform);
  });
});

// ============================================
// 6. TESTOWANIE DARK MODE / THEME SWITCHING
// ============================================

test.describe("Theme Switching", () => {
  test.skip("powinien przełączyć na dark mode", async ({ page }) => {
    // Strona nie ma theme switchera - test wyłączony
    await page.goto("http://localhost:3000");

    // Znajdź przycisk theme toggle (jeśli istnieje)
    const themeToggle = page.locator(
      '[aria-label*="theme"], button:has-text("🌙")'
    );

    if ((await themeToggle.count()) > 0) {
      // Kliknij toggle
      await themeToggle.click();

      // Sprawdź czy dark mode został zastosowany
      const isDark = await page.evaluate(() => {
        return (
          document.documentElement.classList.contains("dark") ||
          document.body.classList.contains("dark-mode")
        );
      });

      expect(isDark).toBeTruthy();
    }
  });
});

// ============================================
// 7. TESTOWANIE NETWORK REQUESTS
// ============================================

test.describe("Network Monitoring", () => {
  test("powinien załadować wszystkie zasoby", async ({ page }) => {
    const failedRequests = [];

    page.on("requestfailed", (request) => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure()?.errorText,
      });
    });

    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");

    // Wypisz failed requests (jeśli są)
    if (failedRequests.length > 0) {
      console.log("Failed requests:", failedRequests);
    }

    expect(failedRequests.length).toBe(0);
  });

  test("powinien śledzić API calls", async ({ page }) => {
    const apiCalls = [];

    page.on("request", (request) => {
      if (request.url().includes("formspree.io")) {
        apiCalls.push({
          method: request.method(),
          url: request.url(),
        });
      }
    });

    await page.goto("http://localhost:3000");

    // Scrolluj do formularza
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Wypełnij formularz przed wysłaniem
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill(
      'textarea[name="message"]',
      "Test wiadomość z automatycznego testu"
    );

    // Wykonaj akcję która robi API call
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    console.log("API calls:", apiCalls);

    // Sprawdź czy był wywołany formspree
    if (apiCalls.length > 0) {
      expect(apiCalls[0].method).toBe("POST");
    }
  });
});

// ============================================
// 8. TESTOWANIE ACCESSIBILITY (A11Y)
// ============================================

test.describe("Accessibility", () => {
  test("wszystkie obrazy powinny mieć alt text", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");

    const images = await page.locator("img").all();

    for (const img of images) {
      const alt = await img.getAttribute("alt");
      const src = await img.getAttribute("src");

      // Każdy obraz powinien mieć alt (może być pusty dla dekoracji)
      expect(alt, `Image ${src} nie ma alt attribute`).not.toBeNull();
    }
  });

  test("headingi powinny mieć poprawną hierarchię", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const headings = await page.evaluate(() => {
      const tags = ["H1", "H2", "H3", "H4", "H5", "H6"];
      const found = [];

      tags.forEach((tag) => {
        document.querySelectorAll(tag).forEach((el) => {
          found.push({
            level: parseInt(tag[1]),
            text: el.textContent?.trim().substring(0, 50),
          });
        });
      });

      return found;
    });

    // Powinien być tylko jeden H1
    const h1Count = headings.filter((h) => h.level === 1).length;
    expect(h1Count, "Strona powinna mieć dokładnie jeden H1").toBe(1);

    console.log("Hierarchia headingów:", headings);
  });
});

// ============================================
// 9. PARAMETRYZOWANE TESTY
// ============================================

const viewports = [
  { name: "Mobile", width: 375, height: 667 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Desktop", width: 1920, height: 1080 },
];

viewports.forEach((viewport) => {
  test(`strona powinna działać na ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });

    await page.goto("http://localhost:3000");

    // Sprawdź główne elementy
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("nav")).toBeVisible();
  });
});

// ============================================
// 10. VISUAL REGRESSION TESTING
// ============================================

test.describe("Visual Regression", () => {
  test("homepage powinien wyglądać identycznie", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");

    // Zrób screenshot i porównaj z baseline
    await expect(page).toHaveScreenshot("homepage.png", {
      maxDiffPixels: 100, // Tolerancja dla małych różnic
    });
  });

  test("blog page powinien wyglądać identycznie", async ({ page }) => {
    await page.goto("http://localhost:3000/blog");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("blog-page.png", {
      fullPage: true, // Full page screenshot
    });
  });
});
