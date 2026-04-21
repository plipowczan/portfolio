import { execFileSync } from "child_process";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { fileURLToPath } from "url";
import { projects } from "../src/data/projects.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://pawel.lipowczan.pl";
const ROOT = path.join(__dirname, "..");

/**
 * Zwraca git committer date (ISO 8601, date-only) dla pliku.
 * Fallback do dzisiejszej daty jeśli git nie jest dostępny albo plik nie jest śledzony.
 */
function getGitLastModDate(relativePath) {
  try {
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", relativePath],
      { cwd: ROOT, encoding: "utf-8" },
    ).trim();
    if (iso) return iso.split("T")[0];
  } catch {
    // ignore
  }
  return new Date().toISOString().split("T")[0];
}

/**
 * Pobiera wszystkie artykuły z folderu blog (PL i EN)
 */
function getAllBlogPosts(lang, blogDir) {
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs
    .readdirSync(blogDir)
    .filter(
      (f) =>
        f.endsWith(".md") &&
        !f.endsWith("_wsad.md") &&
        !f.startsWith("_") &&
        f !== "README.md"
    );

  return files
    .map((file) => {
      const content = fs.readFileSync(path.join(blogDir, file), "utf-8");
      const { data } = matter(content);

      const dateStr =
        typeof data.date === "string"
          ? data.date
          : new Date(data.date).toISOString().split("T")[0];

      let modifiedStr = null;
      if (data.modified) {
        modifiedStr =
          data.modified instanceof Date
            ? data.modified.toISOString().split("T")[0]
            : typeof data.modified === "string" &&
                /^\d{4}-\d{2}-\d{2}$/.test(data.modified)
              ? data.modified
              : null;
      }

      return {
        slug: data.slug,
        date: dateStr,
        modified: modifiedStr,
        lastmod: modifiedStr || dateStr,
        title: data.title,
        lang: data.lang || lang,
        alternateSlug: data.alternateSlug || null,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Generuje XML sitemap z hreflang alternates
 */
function generateSitemap() {
  const blogDirPl = path.join(__dirname, "..", "src", "content", "blog");
  const blogDirEn = path.join(__dirname, "..", "src", "content", "blog", "en");

  const postsPl = getAllBlogPosts("pl", blogDirPl);
  const postsEn = getAllBlogPosts("en", blogDirEn);

  const today = new Date().toISOString().split("T")[0];

  // Max lastmod across all posts — used for listing pages (/, /blog, /en, /en/blog)
  const allLastmods = [...postsPl, ...postsEn].map((p) => p.lastmod);
  const listingLastmod =
    allLastmods.length > 0
      ? allLastmods.sort().slice(-1)[0]
      : today;

  // Legal pages: lastmod = git mtime of corresponding .jsx
  const legalLastmods = {
    "privacy-policy": getGitLastModDate("src/pages/PrivacyPolicy.jsx"),
    "terms-of-service": getGitLastModDate("src/pages/TermsOfService.jsx"),
    "cookie-policy": getGitLastModDate("src/pages/CookiePolicy.jsx"),
  };

  // Static pages — mix of listing and legal, each with its own lastmod
  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly", lastmod: listingLastmod },
    { url: "blog", priority: "0.9", changefreq: "weekly", lastmod: listingLastmod },
    { url: "privacy-policy", priority: "0.3", changefreq: "monthly", lastmod: legalLastmods["privacy-policy"] },
    { url: "terms-of-service", priority: "0.3", changefreq: "monthly", lastmod: legalLastmods["terms-of-service"] },
    { url: "cookie-policy", priority: "0.3", changefreq: "monthly", lastmod: legalLastmods["cookie-policy"] },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // Static pages — PL and EN with alternates
  staticPages.forEach((page) => {
    const plUrl = `${SITE_URL}/${page.url}`;
    const enUrl = `${SITE_URL}/en/${page.url}`;

    // PL version
    xml += "  <url>\n";
    xml += `    <loc>${plUrl}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${plUrl}"/>\n`;
    xml += "  </url>\n";

    // EN version
    xml += "  <url>\n";
    xml += `    <loc>${enUrl}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${plUrl}"/>\n`;
    xml += "  </url>\n";
  });

  // Blog posts — PL with EN alternates
  postsPl.forEach((post) => {
    const plUrl = `${SITE_URL}/blog/${post.slug}`;

    xml += "  <url>\n";
    xml += `    <loc>${plUrl}</loc>\n`;
    xml += `    <lastmod>${post.lastmod}</lastmod>\n`;
    xml += "    <changefreq>monthly</changefreq>\n";
    xml += "    <priority>0.7</priority>\n";
    xml += `    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>\n`;
    if (post.alternateSlug) {
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en/blog/${post.alternateSlug}"/>\n`;
    }
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${plUrl}"/>\n`;
    xml += "  </url>\n";
  });

  // Blog posts — EN with PL alternates
  postsEn.forEach((post) => {
    const enUrl = `${SITE_URL}/en/blog/${post.slug}`;

    xml += "  <url>\n";
    xml += `    <loc>${enUrl}</loc>\n`;
    xml += `    <lastmod>${post.lastmod}</lastmod>\n`;
    xml += "    <changefreq>monthly</changefreq>\n";
    xml += "    <priority>0.7</priority>\n";
    if (post.alternateSlug) {
      xml += `    <xhtml:link rel="alternate" hreflang="pl" href="${SITE_URL}/blog/${post.alternateSlug}"/>\n`;
    }
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/blog/${post.alternateSlug || post.slug}"/>\n`;
    xml += "  </url>\n";
  });

  // Projects — PL and EN (lastmod = git mtime of projects.js as best proxy)
  const projectsLastmod = getGitLastModDate("src/data/projects.js");
  projects.forEach((project) => {
    const plUrl = `${SITE_URL}/projects/${project.slug}`;
    const enUrl = `${SITE_URL}/en/projects/${project.slug}`;

    // PL
    xml += "  <url>\n";
    xml += `    <loc>${plUrl}</loc>\n`;
    xml += `    <lastmod>${projectsLastmod}</lastmod>\n`;
    xml += "    <changefreq>monthly</changefreq>\n";
    xml += "    <priority>0.8</priority>\n";
    xml += `    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${plUrl}"/>\n`;
    xml += "  </url>\n";

    // EN
    xml += "  <url>\n";
    xml += `    <loc>${enUrl}</loc>\n`;
    xml += `    <lastmod>${projectsLastmod}</lastmod>\n`;
    xml += "    <changefreq>monthly</changefreq>\n";
    xml += "    <priority>0.8</priority>\n";
    xml += `    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${plUrl}"/>\n`;
    xml += "  </url>\n";
  });

  xml += "</urlset>";

  return { xml, postsPl, postsEn };
}

/**
 * Zapisuje sitemap do pliku
 */
function saveSitemap() {
  console.log("🗺️  Generowanie sitemap.xml...\n");

  const { xml, postsPl, postsEn } = generateSitemap();
  const outputPath = path.join(__dirname, "..", "public", "sitemap.xml");

  fs.writeFileSync(outputPath, xml, "utf-8");

  const staticCount = 5 * 2; // PL + EN
  const blogCount = postsPl.length + postsEn.length;
  const projectCount = projects.length * 2; // PL + EN

  console.log("✅ Sitemap wygenerowany pomyślnie!\n");
  console.log(`📄 Plik: public/sitemap.xml`);
  console.log(`📊 Strony statyczne: ${staticCount} (${staticCount / 2} PL + ${staticCount / 2} EN)`);
  console.log(`📝 Artykuły blogowe: ${blogCount} (${postsPl.length} PL + ${postsEn.length} EN)`);
  console.log(`💼 Projekty: ${projectCount} (${projects.length} PL + ${projects.length} EN)`);
  console.log(`🔗 Łącznie URLi: ${staticCount + blogCount + projectCount}\n`);

  console.log(`\n🌐 Sitemap dostępny pod: ${SITE_URL}/sitemap.xml`);
}

// CLI usage
const args = process.argv.slice(2);

if (args[0] === "--help" || args[0] === "-h") {
  console.log(`
🗺️  Skrypt aktualizacji sitemap.xml

Użycie:
  node scripts/update-sitemap.js

Opis:
  Automatycznie generuje sitemap.xml z hreflang alternates na podstawie:
  - Statycznych stron aplikacji (PL + EN)
  - Wszystkich artykułów z src/content/blog/ i src/content/blog/en/
  - Wszystkich projektów

Wynik:
  - Plik sitemap.xml w folderze public/
  `);
  process.exit(0);
}

try {
  saveSitemap();
} catch (error) {
  console.error("❌ Błąd podczas generowania sitemap:", error.message);
  process.exit(1);
}
