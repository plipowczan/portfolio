#!/usr/bin/env node

/**
 * Prerender Script
 *
 * Generuje statyczne HTML dla wszystkich stron portfolio,
 * aby poprawić SEO poprzez dostarczenie pełnej treści dla botów.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import matter from "gray-matter";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Funkcja do wczytywania postów bezpośrednio z plików markdown
function getBlogPosts(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const files = readdirSync(dir).filter(
    (file) =>
      file.endsWith(".md") &&
      !file.endsWith("_wsad.md") &&
      !file.startsWith("_") &&
      file !== "README.md"
  );

  return files.map((file) => {
    const filePath = join(dir, file);
    const content = readFileSync(filePath, "utf-8");
    const { data } = matter(content);
    return {
      slug: data.slug,
      id: data.id,
    };
  });
}

// Funkcja do wczytywania lekcji kursu (PL-only) bezpośrednio z plików markdown
function getCourseLessons(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const files = readdirSync(dir).filter(
    (file) =>
      file.endsWith(".md") && !file.startsWith("_") && file !== "README.md"
  );

  return files
    .map((file) => {
      const { data } = matter(readFileSync(join(dir, file), "utf-8"));
      return { file, slug: data.slug, order: data.order };
    })
    .filter((lesson) => {
      const valid =
        typeof lesson.slug === "string" &&
        lesson.slug.length > 0 &&
        typeof lesson.order === "number";
      if (!valid) {
        console.warn(
          `  ⚠️  Pomijam lekcję kursu bez poprawnego slug/order: ${lesson.file}`
        );
      }
      return valid;
    })
    .sort((a, b) => a.order - b.order);
}

import { projects } from "../src/data/projects.js";

const blogPostsPl = getBlogPosts(join(__dirname, "..", "src", "content", "blog"));
const blogPostsEn = getBlogPosts(join(__dirname, "..", "src", "content", "blog", "en"));
const courseLessons = getCourseLessons(
  join(__dirname, "..", "src", "content", "kurs")
);

// Konfiguracja
const BASE_URL = "http://localhost:4173"; // Vite preview port
const DIST_DIR = join(__dirname, "..", "dist");

// Wykrywanie środowiska Vercel
const IS_VERCEL = process.env.VERCEL === "1";

// PL routes (unchanged)
const staticRoutesPl = [
  "/",
  "/blog",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
];

const blogRoutesPl = blogPostsPl.map((post) => `/blog/${post.slug}`);
const projectRoutesPl = projects.map((project) => `/projects/${project.slug}`);

// PL-only waitlist landing — intentionally NOT mirrored to /en (PL-only page)
const landingRoutes = ["/llm-wiki"];

// PL-only free course — hub + one route per lesson (derived from files),
// intentionally NOT mirrored to /en (see StripEnRedirect).
const courseRoutes = [
  "/llm-wiki/kurs",
  ...courseLessons.map((lesson) => `/llm-wiki/kurs/${lesson.slug}`),
];

// EN routes (under /en/ prefix)
const staticRoutesEn = staticRoutesPl.map((route) => `/en${route}`);
const blogRoutesEn = blogPostsEn.map((post) => `/en/blog/${post.slug}`);
const projectRoutesEn = projects.map((project) => `/en/projects/${project.slug}`);

const allRoutes = [
  ...staticRoutesPl,
  ...landingRoutes,
  ...courseRoutes,
  ...blogRoutesPl,
  ...projectRoutesPl,
  ...staticRoutesEn,
  ...blogRoutesEn,
  ...projectRoutesEn,
];

/**
 * Prerenderuje pojedynczą stronę z retry logic
 */
async function prerenderPage(browser, route, retries = 2) {
  const page = await browser.newPage();
  let pageClosed = false;

  try {
    const url = `${BASE_URL}${route}`;
    console.log(`  📄 Renderuję: ${route}`);

    if (IS_VERCEL) {
      // Puppeteer setup
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36"
      );
    }

    // Dla Vercel używamy dłuższego timeoutu i mniej restrykcyjnego waitUntil
    const timeout = IS_VERCEL ? 120000 : 60000; // 120s na Vercel, 60s lokalnie
    // Używamy 'load' zamiast 'networkidle0' - szybsze i bardziej niezawodne na Vercel
    // 'load' czeka na załadowanie wszystkich zasobów, ale nie wymaga 500ms bez requestów
    const waitUntil = IS_VERCEL ? "load" : "networkidle0";

    // Otwórz stronę i poczekaj na pełne załadowanie
    await page.goto(url, {
      waitUntil: waitUntil,
      timeout: timeout,
    });

    // Czekaj na React Helmet - sprawdź czy metatagi są w DOM
    let metaTagsFound = true;
    try {
      await page.waitForFunction(
        () => {
          const ogTitle = document.querySelector('meta[property="og:title"]');
          const description = document.querySelector(
            'meta[name="description"]'
          );
          return ogTitle && description;
        },
        { timeout: 20000 } // Zwiększony timeout dla metatagów
      );
    } catch (e) {
      console.error(`  ⚠️  Timeout: Brak metatagów SEO dla ${route} (kontynuuję generowanie)`);
      metaTagsFound = false;
    }

    // Dodatkowy czas na animacje i lazy loading (zmniejszony dla Vercel)
    const waitTime = IS_VERCEL ? 1000 : 2000;
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // Pobierz pełny HTML po renderowaniu
    const html = await page.content();

    // Określ ścieżkę do zapisu
    let outputPath;
    if (route === "/") {
      outputPath = join(DIST_DIR, "index.html");
    } else {
      // Dla innych tras tworzymy folder i index.html
      const routePath = route.endsWith("/") ? route.slice(0, -1) : route;
      const dirPath = join(DIST_DIR, routePath);

      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }

      outputPath = join(dirPath, "index.html");
    }

    // Zapisz prerenderowany HTML
    writeFileSync(outputPath, html, "utf-8");
    console.log(`  ✅ Zapisano: ${outputPath.replace(DIST_DIR, "")}`);

    return true;
  } catch (error) {
    // Retry logic dla timeoutów
    if (retries > 0 && error.message.includes("timeout")) {
      console.error(`  ⚠️  Timeout dla ${route}, ponawiam próbę (pozostało ${retries} prób)...`);
      // Zamknij stronę bezpiecznie - nawet jeśli się nie powiedzie, kontynuuj retry
      try {
        await page.close();
        pageClosed = true; // Oznacz stronę jako zamkniętą tylko jeśli zamknięcie się powiodło
      } catch (closeError) {
        // Jeśli zamknięcie się nie powiodło, strona może być już zamknięta lub uszkodzona
        // Oznacz jako zamkniętą, aby finally nie próbował ponownie
        pageClosed = true;
        console.error(`  ⚠️  Błąd przy zamykaniu strony przed retry (ignoruję): ${closeError.message}`);
      }
      // Krótka przerwa przed retry
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return prerenderPage(browser, route, retries - 1);
    }
    
    console.error(`  ❌ Błąd dla ${route}:`, error.message);
    return false;
  } finally {
    // Zamknij stronę tylko jeśli nie została już zamknięta (np. w retry)
    if (!pageClosed) {
      try {
        await page.close();
      } catch (closeError) {
        // Ignoruj błędy zamykania (strona może być już zamknięta)
        // To może się zdarzyć w edge cases, ale nie powinno przerwać procesu
      }
    }
  }
}

/**
 * Główna funkcja prerenderingu
 */
async function main() {
  let browser;
  let successCount = 0;
  let failCount = 0;

  try {
    console.log(`🚀 Rozpoczynam prerendering ${allRoutes.length} stron...\n`);

    // Sprawdź czy dist folder istnieje
    if (!existsSync(DIST_DIR)) {
      throw new Error(
        `Folder dist nie istnieje! Najpierw uruchom: npm run build`
      );
    }

    console.log(`📦 Używam dist folder: ${DIST_DIR}`);
    console.log(`🌐 Preview URL: ${BASE_URL}`);

    if (IS_VERCEL) {
      console.log("▲ Wykryto środowisko Vercel - używam puppeteer-core + sparticuz/chromium");
      console.log("⚙️  Konfiguracja: timeout=120s, waitUntil=load (zoptymalizowane dla Vercel)");
      const chromium = await import("@sparticuz/chromium");
      const puppeteer = await import("puppeteer-core");

      // Konfiguracja dla Vercel/AWS Lambda
      browser = await puppeteer.default.launch({
        args: chromium.default.args,
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(),
        headless: chromium.default.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      console.log("💻 Wykryto środowisko Lokalne - używam Playwright");
      const { chromium } = await import("@playwright/test");
      // Opt-in: ustaw PRERENDER_CHANNEL=msedge|chrome, by użyć systemowej
      // przeglądarki zamiast pobranej binarki Playwright (np. gdy brak chromium).
      // Bez env zachowanie bez zmian (pobrany chromium).
      browser = await chromium.launch({
        headless: true,
        channel: process.env.PRERENDER_CHANNEL || undefined,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    console.log("🤖 Browser uruchomiony\n");

    // Prerenderuj każdą stronę
    for (const route of allRoutes) {
      const success = await prerenderPage(browser, route);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log(`\n📊 Podsumowanie:`);
    console.log(`   ✅ Sukces: ${successCount} stron`);
    console.log(`   ❌ Błędy: ${failCount} stron`);
    console.log(`\n🎉 Prerendering zakończony!`);

    if (failCount > 0) {
      console.log(
        `\n⚠️  Niektóre strony nie zostały prerenderowane. Sprawdź logi powyżej.`
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Krytyczny błąd:`, error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Uruchom
main().catch((error) => {
  console.error("Nieoczekiwany błąd:", error);
  process.exit(1);
});
