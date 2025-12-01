import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { fileURLToPath } from "url";
import { projects } from "../src/data/projects.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://pawel.lipowczan.pl";

/**
 * Pobiera wszystkie artykuły z folderu blog
 */
function getAllBlogPosts() {
  const blogDir = path.join(__dirname, "..", "src", "content", "blog");
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

      // Ensure date is in ISO format (YYYY-MM-DD)
      const dateStr =
        typeof data.date === "string"
          ? data.date
          : new Date(data.date).toISOString().split("T")[0];

      return {
        slug: data.slug,
        date: dateStr,
        title: data.title,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Generuje XML sitemap
 */
function generateSitemap() {
  const posts = getAllBlogPosts();

  // Statyczne strony
  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly" },
    { url: "blog", priority: "0.9", changefreq: "weekly" },
    { url: "privacy-policy", priority: "0.3", changefreq: "monthly" },
    { url: "terms-of-service", priority: "0.3", changefreq: "monthly" },
    { url: "cookie-policy", priority: "0.3", changefreq: "monthly" },
  ];

  const today = new Date().toISOString().split("T")[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Dodaj statyczne strony
  staticPages.forEach((page) => {
    xml += "  <url>\n";
    xml += `    <loc>${SITE_URL}/${page.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += "  </url>\n";
  });

  // Dodaj artykuły blogowe
  posts.forEach((post) => {
    // Formatuj datę do ISO 8601 (YYYY-MM-DD)
    const postDate = new Date(post.date);
    const formattedDate = postDate.toISOString().split("T")[0];

    xml += "  <url>\n";
    xml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${formattedDate}</lastmod>\n`;
    xml += "    <changefreq>monthly</changefreq>\n";
    xml += "    <priority>0.7</priority>\n";
    xml += "  </url>\n";
  });

  // Dodaj projekty
  projects.forEach((project) => {
    xml += "  <url>\n";
    xml += `    <loc>${SITE_URL}/projects/${project.slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += "    <changefreq>monthly</changefreq>\n";
    xml += "    <priority>0.8</priority>\n";
    xml += "  </url>\n";
  });

  xml += "</urlset>";

  return xml;
}

/**
 * Zapisuje sitemap do pliku
 */
function saveSitemap() {
  console.log("🗺️  Generowanie sitemap.xml...\n");

  const sitemap = generateSitemap();
  const outputPath = path.join(__dirname, "..", "public", "sitemap.xml");

  fs.writeFileSync(outputPath, sitemap, "utf-8");

  const posts = getAllBlogPosts();

  console.log("✅ Sitemap wygenerowany pomyślnie!\n");
  console.log(`📄 Plik: public/sitemap.xml`);
  console.log(`📊 Strony statyczne: 9`);
  console.log(`📝 Artykuły blogowe: ${posts.length}`);
  console.log(`💼 Projekty: ${projects.length}`);
  console.log(`🔗 Łącznie URLi: ${9 + posts.length + projects.length}\n`);

  console.log("📋 Artykuły w sitemap:");
  posts.forEach((post) => {
    console.log(`   - ${post.title}`);
    console.log(`     Slug: ${post.slug}`);
    console.log(`     Data: ${post.date}`);
  });

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
  Automatycznie generuje sitemap.xml na podstawie:
  - Statycznych stron aplikacji
  - Wszystkich artykułów z src/content/blog/

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
