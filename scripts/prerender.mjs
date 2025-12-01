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
import puppeteer from "puppeteer";
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

console.log(`🚀 Rozpoczynam prerendering ${allRoutes.length} stron...\n`);

/**
 * Prerenderuje pojedynczą stronę
 */
async function prerenderPage(browser, route) {
  const page = await browser.newPage();

  try {
    const url = `${BASE_URL}${route}`;
    console.log(`  📄 Renderuję: ${route}`);

    // Otwórz stronę i poczekaj na pełne załadowanie
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Czekaj na React Helmet - sprawdź czy metatagi są w DOM
    await page
      .waitForFunction(
        () => {
          const ogTitle = document.querySelector('meta[property="og:title"]');
          const description = document.querySelector(
            'meta[name="description"]'
          );
          return ogTitle && description;
        },
        { timeout: 15000 }
      )
      .catch(() => {
        console.warn(`  ⚠️  Timeout oczekiwania na React Helmet dla ${route}`);
      });

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
    // Sprawdź czy dist folder istnieje
    if (!existsSync(DIST_DIR)) {
      throw new Error(
        `Folder dist nie istnieje! Najpierw uruchom: npm run build`
      );
    }

    console.log(`📦 Używam dist folder: ${DIST_DIR}`);
    console.log(`🌐 Preview URL: ${BASE_URL}\n`);

    // Uruchom Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    console.log("🤖 Puppeteer uruchomiony\n");

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
