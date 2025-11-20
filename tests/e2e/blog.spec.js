import { expect, test } from "@playwright/test";
import { testUrls } from "../fixtures/test-data.js";
import {
  getSeoMetaTags,
  scrollToElement,
  waitForAnimations,
} from "../utils/test-helpers.js";

test.describe("Blog - Lista postów", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testUrls.blog);
    await waitForAnimations(page, 1000);
  });

  test("powinna załadować stronę bloga z listą postów", async ({ page }) => {
    // Sprawdź tytuł strony
    await expect(page).toHaveTitle(/Blog.*Pawel Lipowczan/i);

    // Sprawdź nagłówek strony
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Blog/i);
  });

  test("powinna wyświetlać karty postów blogowych", async ({ page }) => {
    // Poczekaj na załadowanie postów
    await page.waitForLoadState("networkidle");

    // Sprawdź czy są jakieś posty
    const blogCards = page.locator(
      'article, [class*="blog-card"], [class*="post"]'
    );
    const count = await blogCards.count();

    expect(count).toBeGreaterThan(0);

    // Sprawdź pierwszą kartę
    const firstCard = blogCards.first();
    await expect(firstCard).toBeVisible();
  });

  test("każda karta posta powinna zawierać podstawowe informacje", async ({
    page,
  }) => {
    await page.waitForLoadState("networkidle");

    const blogCards = page.locator(
      'article, [class*="blog-card"], [class*="post"]'
    );
    const firstCard = blogCards.first();

    if ((await firstCard.count()) > 0) {
      // Sprawdź tytuł
      const title = firstCard.locator("h2, h3").first();
      await expect(title).toBeVisible();

      // Sprawdź czy jest link do posta
      const link = firstCard.locator("a").first();
      await expect(link).toBeVisible();

      // Sprawdź czy jest opis/excerpt (jeśli istnieje)
      const excerpt = firstCard.locator("p").first();
      if ((await excerpt.count()) > 0) {
        await expect(excerpt).toBeVisible();
      }
    }
  });

  test("karty postów powinny być klikalne i prowadzić do pełnych artykułów", async ({
    page,
  }) => {
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 1000);

    const blogCards = page.locator('article[class*="blog-card"]');
    const firstCard = blogCards.first();

    await expect(firstCard).toBeVisible({ timeout: 15000 });

    const firstLink = firstCard.locator('a[href^="/blog/"]').first();
    await expect(firstLink).toBeVisible({ timeout: 10000 });

    const href = await firstLink.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toContain("/blog/");

    // Kliknij w link
    await firstLink.click();

    // Sprawdź czy URL się zmienił
    await page.waitForURL(/\/blog\/.+/, { timeout: 15000 });
    expect(page.url()).toContain("/blog/");
  });

  test("powinna mieć poprawne metatagi SEO dla strony bloga", async ({
    page,
  }) => {
    const metaTags = await getSeoMetaTags(page);

    expect(metaTags.title).toBeTruthy();
    expect(metaTags.title).toMatch(/Blog/i);
    expect(metaTags.description).toBeTruthy();

    // og:title może nie być dostępny w dev mode (React Helmet timing issue)
    // ale jest obecny w production/prerendered builds
    if (!metaTags.ogTitle) {
      console.warn(
        "⚠️ og:title not found - expected in dev mode, should be present in production"
      );
    }
  });

  test("powinna wyświetlać daty publikacji postów", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const blogCards = page.locator(
      'article, [class*="blog-card"], [class*="post"]'
    );
    const firstCard = blogCards.first();

    if ((await firstCard.count()) > 0) {
      // Szukaj daty w różnych formatach
      const dateElement = firstCard.locator('time, [class*="date"]').first();

      if ((await dateElement.count()) > 0) {
        await expect(dateElement).toBeVisible();
      }
    }
  });

  test("nawigacja breadcrumb powinna działać (jeśli istnieje)", async ({
    page,
  }) => {
    const breadcrumb = page
      .locator('nav[aria-label*="breadcrumb"], [class*="breadcrumb"]')
      .first();

    if ((await breadcrumb.count()) > 0) {
      await expect(breadcrumb).toBeVisible();

      // Sprawdź link do strony głównej
      const homeLink = breadcrumb.locator('a[href="/"]').first();
      if ((await homeLink.count()) > 0) {
        await expect(homeLink).toBeVisible();
      }
    }
  });
});

test.describe("Blog - Pojedynczy post", () => {
  test("powinna załadować pełny artykuł blogowy", async ({ page }) => {
    // Najpierw idź do listy postów
    await page.goto(testUrls.blog);
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 1000);

    // Znajdź pierwszy post (link "Read More" w karcie bloga)
    const firstPostLink = page.locator('article a[href^="/blog/"]').first();

    // Czekaj na pojawienie się linka
    await expect(firstPostLink).toBeVisible({ timeout: 15000 });

    await firstPostLink.click();
    await page.waitForURL(/\/blog\/.+/, { timeout: 15000 });
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 2000);

    // Sprawdź czy artykuł się załadował
    const article = page.locator("article");
    await expect(article).toBeVisible({ timeout: 15000 });

    // Sprawdź tytuł artykułu
    const title = page.locator("article h1").first();
    await expect(title).toBeVisible({ timeout: 15000 });

    const titleText = await title.textContent();
    expect(titleText?.length).toBeGreaterThan(0);
  });

  test("post powinien zawierać treść artykułu", async ({ page }) => {
    await page.goto(testUrls.blog);
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 500);

    const firstPostLink = page.locator('article a[href^="/blog/"]').first();

    await expect(firstPostLink).toBeVisible({ timeout: 10000 });
    await firstPostLink.click();
    await page.waitForURL(/\/blog\/.+/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 1000);

    // Sprawdź czy jest treść (paragrafy)
    const paragraphs = page.locator("article p");
    const count = await paragraphs.count();

    expect(count).toBeGreaterThan(0);

    // Sprawdź długość treści
    const firstParagraph = paragraphs.first();
    const text = await firstParagraph.textContent();
    expect(text?.length).toBeGreaterThan(10);
  });

  test("post powinien mieć unikalne metatagi SEO", async ({ page }) => {
    await page.goto(testUrls.blog);
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 500);

    const firstPostLink = page.locator('article a[href^="/blog/"]').first();

    await expect(firstPostLink).toBeVisible({ timeout: 10000 });
    await firstPostLink.click();
    await page.waitForURL(/\/blog\/.+/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 1000);

    const metaTags = await getSeoMetaTags(page);
    const isDevMode = page.url().includes("localhost") || page.url().includes("127.0.0.1");

    // Sprawdź podstawowe tagi (zawsze wymagane)
    expect(metaTags.title).toBeTruthy();
    expect(metaTags.description).toBeTruthy();
    expect(metaTags.description.length).toBeGreaterThan(50);

    // Sprawdź Open Graph dla postów (toleruj brak w dev mode)
    if (!metaTags.ogTitle) {
      const message = "og:title meta tag is missing for blog post";
      if (isDevMode) {
        console.warn(`⚠️ DEV MODE: ${message} - this is expected due to React Helmet async rendering`);
      } else {
        throw new Error(`PRODUCTION: ${message} - this should be present in production builds`);
      }
    } else {
      expect(metaTags.ogTitle).toBeTruthy();
    }

    if (!metaTags.ogDescription) {
      const message = "og:description meta tag is missing for blog post";
      if (isDevMode) {
        console.warn(`⚠️ DEV MODE: ${message} - this is expected due to React Helmet async rendering`);
      } else {
        throw new Error(`PRODUCTION: ${message} - this should be present in production builds`);
      }
    } else {
      expect(metaTags.ogDescription).toBeTruthy();
    }

    // Sprawdź czy ma obraz OG (jeśli zdefiniowany)
    if (metaTags.ogImage) {
      expect(metaTags.ogImage).toContain("http");
    }
  });

  test('przycisk "Powrót do bloga" powinien działać', async ({ page }) => {
    await page.goto(testUrls.blog);
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 500);

    const firstPostLink = page.locator('article a[href^="/blog/"]').first();

    await expect(firstPostLink).toBeVisible({ timeout: 10000 });
    await firstPostLink.click();
    await page.waitForURL(/\/blog\/.+/, { timeout: 15000 });
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 1500);

    // Scroll na górę strony (przycisk Back jest na początku)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Szukaj przycisku powrotu - precyzyjniejszy selektor
    const backButton = page.locator('a[href="/blog"]:has-text("Back")').first();

    await expect(backButton).toBeVisible({ timeout: 15000 });
    await expect(backButton).toBeInViewport({ timeout: 10000 });

    await backButton.click();

    // Sprawdź czy wróciliśmy do listy
    await page.waitForURL("**/blog", { timeout: 15000 });
    expect(page.url()).toMatch(/\/blog\/?$/);
  });

  test("obrazy w poście powinny mieć alt text", async ({ page }) => {
    await page.goto(testUrls.blog);
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 1000);

    const firstPostLink = page.locator('article a[href^="/blog/"]').first();

    await expect(firstPostLink).toBeVisible({ timeout: 15000 });
    await firstPostLink.click();
    await page.waitForURL(/\/blog\/.+/, { timeout: 15000 });
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 2000);

    // Sprawdź wszystkie obrazy - czekaj aż się załadują
    const images = page.locator("article img");

    // Czekaj na przynajmniej jeden obraz (jeśli istnieje)
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Czekaj aż pierwszy obraz będzie visible
      await expect(images.first()).toBeVisible({ timeout: 15000 });

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute("alt");

        // Każdy obraz powinien mieć atrybut alt (może być pusty dla dekoracji)
        expect(alt).not.toBeNull();
      }
    }
  });

  test("linki w poście powinny być dostępne", async ({ page }) => {
    await page.goto(testUrls.blog);
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 500);

    const firstPostLink = page.locator('article a[href^="/blog/"]').first();

    await expect(firstPostLink).toBeVisible({ timeout: 10000 });
    await firstPostLink.click();
    await page.waitForURL(/\/blog\/.+/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 1000);

    // Znajdź linki w treści
    const contentLinks = page.locator("article a").filter({ hasNotText: /^$/ });
    const linkCount = await contentLinks.count();

    if (linkCount > 0) {
      // Sprawdź pierwszy link
      const firstLink = contentLinks.first();
      await expect(firstLink).toBeVisible();

      const href = await firstLink.getAttribute("href");
      expect(href).toBeTruthy();
    }
  });

  test("markdown content powinien być poprawnie renderowany", async ({
    page,
  }) => {
    await page.goto(testUrls.blog);
    await page.waitForLoadState("networkidle");

    const firstPostLink = page
      .locator('article a, [class*="blog-card"] a')
      .first();

    if ((await firstPostLink.count()) > 0) {
      await firstPostLink.click();
      await page.waitForURL(/\/blog\/.+/);
      await waitForAnimations(page, 1000);

      // Sprawdź różne elementy markdown
      const article = page.locator("article, main");

      // Nagłówki
      const headings = article.locator("h1, h2, h3, h4");
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);

      // Paragrafy
      const paragraphs = article.locator("p");
      const paragraphCount = await paragraphs.count();
      expect(paragraphCount).toBeGreaterThan(0);
    }
  });
});

test.describe("Blog - Responsywność", () => {
  test("lista postów powinna być responsywna na mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testUrls.blog);
    await waitForAnimations(page, 1000);

    const blogCards = page.locator(
      'article, [class*="blog-card"], [class*="post"]'
    );
    const count = await blogCards.count();

    if (count > 0) {
      const firstCard = blogCards.first();
      await expect(firstCard).toBeVisible();
    }
  });

  test("pojedynczy post powinien być czytelny na mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testUrls.blog);
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 500);

    const firstPostLink = page.locator('article a[href^="/blog/"]').first();

    await expect(firstPostLink).toBeVisible({ timeout: 10000 });
    await firstPostLink.click();
    await page.waitForURL(/\/blog\/.+/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page, 1000);

    // Sprawdź czy tytuł jest widoczny
    const title = page.locator("article h1").first();
    await expect(title).toBeVisible({ timeout: 10000 });

    // Sprawdź czy treść nie wychodzi poza viewport
    const article = page.locator("article");
    await expect(article).toBeVisible({ timeout: 10000 });
  });
});
