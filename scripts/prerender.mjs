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
function getBlogPosts() {
  const blogDir = join(__dirname, "..", "src", "content", "blog");

  if (!existsSync(blogDir)) {
    console.warn("⚠️  Folder blog nie istnieje, pomijam posty blogowe");
    return [];
  }

  const files = readdirSync(blogDir).filter(
    (file) =>
      file.endsWith(".md") && !file.startsWith("_") && file !== "README.md"
  );

  const posts = files.map((file) => {
    const filePath = join(blogDir, file);
    const content = readFileSync(filePath, "utf-8");
    const { data } = matter(content);
    return {
      slug: data.slug,
      id: data.id,
    };
  });

  return posts;
}

import { projects } from "../src/data/projects.js";

const blogPosts = getBlogPosts();

// Konfiguracja
const BASE_URL = "http://localhost:4173"; // Vite preview port
const DIST_DIR = join(__dirname, "..", "dist");

// Wykrywanie środowiska Vercel
const IS_VERCEL = process.env.VERCEL === "1";

// Wszystkie strony do pre-renderowania
const staticRoutes = [
  "/",
  "/blog",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
];

const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);
const projectRoutes = projects.map((project) => `/projects/${project.slug}`);
const allRoutes = [...staticRoutes, ...blogRoutes, ...projectRoutes];

/**
 * Prerenderuje pojedynczą stronę
 */
async function prerenderPage(browser, route) {
  const page = await browser.newPage();

  try {
    const url = `${BASE_URL}${route}`;
    console.log(`  📄 Renderuję: ${route}`);

    if (IS_VERCEL) {
      // Puppeteer setup
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36"
      );
    }

    // Otwórz stronę i poczekaj na pełne załadowanie
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
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
        { timeout: 15000 }
      );
    } catch (e) {
      console.error(`  ⚠️  Timeout: Brak metatagów SEO dla ${route} (kontynuuję generowanie)`);
      metaTagsFound = false;
    }

    // Dodatkowy czas na animacje i lazy loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
    console.error(`  ❌ Błąd dla ${route}:`, error.message);
    return false;
  } finally {
    await page.close();
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
      browser = await chromium.launch({
        headless: true,
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
