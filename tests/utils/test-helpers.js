/**
 * Test Helpers - funkcje pomocnicze dla testów Playwright
 */

/**
 * Czeka na zakończenie animacji Framer Motion
 * @param {import('@playwright/test').Page} page
 * @param {number} timeout - czas oczekiwania w ms
 */
export async function waitForAnimations(page, timeout = 1000) {
  await page.waitForTimeout(timeout);
}

/**
 * Sprawdza czy element jest widoczny w viewport
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - selektor CSS elementu
 */
export async function isInViewport(page, selector) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Scrolluje do elementu
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - selektor CSS elementu
 */
export async function scrollToElement(page, selector) {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, selector);
  await waitForAnimations(page, 500);
}

/**
 * Sprawdza czy gradient text jest zastosowany
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - selektor CSS elementu
 */
export async function hasGradientText(page, selector) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;

    const styles = window.getComputedStyle(element);
    return (
      styles.backgroundClip === "text" || styles.webkitBackgroundClip === "text"
    );
  }, selector);
}

/**
 * Pobiera wszystkie linki nawigacyjne
 * @param {import('@playwright/test').Page} page
 */
export async function getNavigationLinks(page) {
  return await page.$$eval("nav a", (links) =>
    links.map((link) => ({
      text: link.textContent?.trim(),
      href: link.getAttribute("href"),
    }))
  );
}

/**
 * Sprawdza czy strona jest responsywna
 * @param {import('@playwright/test').Page} page
 * @param {number} width - szerokość viewport
 * @param {number} height - wysokość viewport
 */
export async function setViewportSize(page, width, height) {
  await page.setViewportSize({ width, height });
  await waitForAnimations(page, 300);
}

/**
 * Sprawdza kontrast kolorów (podstawowa wersja)
 * @param {string} foreground - kolor pierwszoplanowy (hex)
 * @param {string} background - kolor tła (hex)
 */
export function checkColorContrast(foreground, background) {
  // Prosta implementacja - w produkcji użyj dedykowanej biblioteki
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return ratio;
}

/**
 * Sprawdza dostępność formularza
 * @param {import('@playwright/test').Page} page
 * @param {string} formSelector - selektor formularza
 */
export async function checkFormAccessibility(page, formSelector) {
  return await page.evaluate((selector) => {
    const form = document.querySelector(selector);
    if (!form) return { valid: false, errors: ["Formularz nie znaleziony"] };

    const errors = [];
    const inputs = form.querySelectorAll("input, textarea, select");

    inputs.forEach((input) => {
      // Sprawdź czy ma label lub aria-label
      const id = input.getAttribute("id");
      const ariaLabel = input.getAttribute("aria-label");
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);

      if (!hasLabel && !ariaLabel) {
        errors.push(`Input ${input.name || input.type} nie ma etykiety`);
      }

      // Sprawdź czy wymagane pola mają oznaczenie
      if (
        input.hasAttribute("required") &&
        !input.getAttribute("aria-required")
      ) {
        errors.push(
          `Wymagany input ${input.name || input.type} nie ma aria-required`
        );
      }
    });

    return { valid: errors.length === 0, errors };
  }, formSelector);
}

/**
 * Testuje nawigację klawiaturą
 * @param {import('@playwright/test').Page} page
 * @param {string} startSelector - element początkowy
 * @param {number} tabCount - liczba naciśnięć Tab
 */
export async function testKeyboardNavigation(
  page,
  startSelector,
  tabCount = 5
) {
  await page.focus(startSelector);
  const focusedElements = [];

  for (let i = 0; i < tabCount; i++) {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName,
        id: el?.id,
        class: el?.className,
        text: el?.textContent?.trim().substring(0, 50),
      };
    });
    focusedElements.push(focused);
  }

  return focusedElements;
}

/**
 * Pobiera metatagi SEO z retry pattern
 * @param {import('@playwright/test').Page} page
 */
export async function getSeoMetaTags(page) {
  // Czekaj na kompletne załadowanie strony
  await page.waitForLoadState("networkidle");

  // Strategia retry - czekaj aż React Helmet ustawi wszystkie tagi
  let retries = 0;
  const maxRetries = 5;

  // Inicjalizuj z domyślnymi wartościami - zapobiega crashom
  let tags = {
    title: null,
    description: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    twitterCard: null,
    canonical: null,
  };

  while (retries < maxRetries) {
    const currentAttempt = retries + 1;
    console.log(
      `🔍 Attempting to load meta tags (${currentAttempt}/${maxRetries})...`
    );

    // Czekaj na title
    await page
      .waitForFunction(
        () => {
          const title = document.title;
          const hasDescription = document.querySelector(
            'meta[name="description"]'
          );
          return (
            title &&
            title.length > 0 &&
            !title.includes("Vite") &&
            hasDescription
          );
        },
        { timeout: 20000 }
      )
      .catch(() => {
        // waitForFunction timeout - kontynuuj do sprawdzenia tagów
      });

    // Dodatkowy czas
    await page.waitForTimeout(2000);

    // Pobierz tagi
    tags = await page.evaluate(() => {
      const getMetaContent = (name) => {
        const meta =
          document.querySelector(`meta[name="${name}"]`) ||
          document.querySelector(`meta[property="${name}"]`);
        return meta?.getAttribute("content") || null;
      };

      return {
        title: document.title,
        description: getMetaContent("description"),
        ogTitle: getMetaContent("og:title"),
        ogDescription: getMetaContent("og:description"),
        ogImage: getMetaContent("og:image"),
        twitterCard: getMetaContent("twitter:card"),
        canonical:
          document.querySelector('link[rel="canonical"]')?.href || null,
      };
    });

    // Sprawdź czy mamy przynajmniej title i description
    if (tags.title && tags.description) {
      console.log(
        `✅ Meta tags loaded successfully on attempt ${currentAttempt}/${maxRetries}`
      );
      break;
    }

    // Jeśli nie udało się i to nie ostatnia próba
    if (currentAttempt < maxRetries) {
      console.log(
        `⚠️ Attempt ${currentAttempt}/${maxRetries} failed - missing tags, retrying...`
      );
      await page.waitForTimeout(2000);
    }

    retries++;
  }

  // Jeśli po wszystkich retry wciąż nie ma tagów, zaloguj ostrzeżenie
  if (!tags.title || !tags.description) {
    console.warn(
      `⚠️ WARNING: Failed to load meta tags after ${maxRetries} retries`
    );
    console.warn(`Current tags:`, tags);
  }

  return tags;
}
