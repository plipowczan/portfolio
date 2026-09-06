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

// Dokumentacja mieszkająca w folderach z treścią. To pliki `.md`, więc
// readdir je łapie, a bez frontmattera wywracają generowanie (brak `date`
// kończy się "Invalid time value"). `README.md` to przewodnik po polsku,
// `AGENTS.md` to kontrakt DOX dla agentów, `CLAUDE.md` to jego shim.
const DOC_FILES = new Set(["README.md", "AGENTS.md", "CLAUDE.md"]);

/**
 * Zwraca git committer date (ISO 8601, date-only) dla pliku.
 *
 * Rzuca, gdy daty nie da się ustalić. Wcześniej wracała wtedy dzisiejsza data,
 * przez co sitemap niósł datę wdrożenia zamiast prawdziwej: 34 z 38 adresów
 * spoza bloga miały identyczne `2026-07-30`, w tym 18 adresów projektów, choć
 * `src/data/projects.js` ostatnio zmieniał się 2025-12-01. Niewiarygodny
 * `lastmod` jest gorszy niż jego brak — Google przestaje ufać całej sitemapie,
 * a nie tylko jednemu wpisowi. Dlatego brak daty ma zatrzymać build, a nie
 * wyprodukować wiarygodnie wyglądającą nieprawdę.
 *
 * Dwie drogi awarii, obie wcześniej ciche:
 *  - `git log` rzuca — brak gita, brak repozytorium;
 *  - `git log` kończy się sukcesem i nie wypisuje **nic**. Tak zachowuje się
 *    płytki klon, który nie ma commita dotykającego tego pliku. To ta droga
 *    odpalała się na Vercelu, bo nie rzucała wyjątku i nie zostawiała śladu.
 */
/**
 * Czy repozytorium ma skróconą historię (shallow clone).
 *
 * To jest sedno usterki, a nie pusty wynik `git log`. W skróconym klonie commit
 * graniczny jest traktowany jak korzeń — nie ma rodzica — więc każdy plik
 * nietknięty od tej granicy wygląda, jakby **powstał** właśnie w niej.
 * `git log -1 -- <plik>` zwraca wtedy datę graniczną: wynik niepusty,
 * wiarygodnie wyglądający i nieprawdziwy. Żadne sprawdzanie pustki tego nie
 * złapie.
 *
 * Zmierzone na wdrożeniu podglądowym 2026-09-06: build serwerowy wypuścił 33
 * adresy z identycznym `2026-07-30`, mimo że w commicie leżała poprawna mapa,
 * a te same ścieżki lokalnie dają daty od 2025-12-01. Granicą był poprzedni
 * szczyt gałęzi głównej.
 */
let shallowChecked = false;

function assertFullGitHistory() {
  if (shallowChecked) return;
  shallowChecked = true;

  let shallow;
  try {
    shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
      cwd: ROOT,
      encoding: "utf-8",
    }).trim();
  } catch (error) {
    throw new Error(
      `Nie udało się sprawdzić, czy repozytorium ma pełną historię: ${error.message}`,
    );
  }

  if (shallow !== "true") return;

  // Próba samonaprawy: bez pełnej historii daty są zmyślone, więc lepiej ją
  // dociągnąć niż wywrócić build. Jeśli się nie uda, dopiero wtedy błąd.
  try {
    execFileSync("git", ["fetch", "--unshallow", "--quiet"], {
      cwd: ROOT,
      encoding: "utf-8",
      stdio: "pipe",
    });
  } catch {
    throw new Error(
      `Repozytorium ma skróconą historię, a dociągnięcie pełnej nie powiodło się. ` +
        `Bez pełnej historii daty w sitemapie byłyby zmyślone: każdy plik ` +
        `nietknięty od granicy skrótu dostałby datę tej granicy. ` +
        `Ustaw pełne klonowanie w środowisku budowania.`,
    );
  }

  const stillShallow = execFileSync(
    "git",
    ["rev-parse", "--is-shallow-repository"],
    { cwd: ROOT, encoding: "utf-8" },
  ).trim();

  if (stillShallow === "true") {
    throw new Error(
      `Repozytorium nadal ma skróconą historię po próbie jej dociągnięcia. ` +
        `Daty w sitemapie byłyby zmyślone, więc przerywam.`,
    );
  }
}

function getGitLastModDate(relativePath) {
  assertFullGitHistory();

  let iso;

  try {
    iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", relativePath],
      { cwd: ROOT, encoding: "utf-8" },
    ).trim();
  } catch (error) {
    throw new Error(
      `Nie udało się odczytać daty commita dla "${relativePath}": ` +
        `polecenie git zakończyło się błędem (${error.message}).`,
    );
  }

  if (!iso) {
    throw new Error(
      `Brak daty commita dla "${relativePath}": git zakończył się sukcesem, ` +
        `ale nie zwrócił żadnej daty. Najczęstsza przyczyna to płytki klon bez ` +
        `historii sięgającej commita, który dotknął tego pliku — w takim ` +
        `środowisku build musi mieć pełną historię. Sitemap nie zostanie ` +
        `zapisany z podstawioną datą.`,
    );
  }

  return iso.split("T")[0];
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
        !DOC_FILES.has(f)
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
 * Pobiera lekcje kursu (PL-only) z src/content/kurs, posortowane po `order`.
 */
function getCourseLessons(kursDir) {
  if (!fs.existsSync(kursDir)) {
    return [];
  }

  return fs
    .readdirSync(kursDir)
    .filter(
      (f) => f.endsWith(".md") && !f.startsWith("_") && !DOC_FILES.has(f)
    )
    .map((file) => {
      const { data } = matter(
        fs.readFileSync(path.join(kursDir, file), "utf-8")
      );
      return { file, slug: data.slug, order: data.order };
    })
    .filter(
      (l) =>
        typeof l.slug === "string" &&
        l.slug.length > 0 &&
        typeof l.order === "number"
    )
    .sort((a, b) => a.order - b.order);
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

  // PL-only pages — emitted WITHOUT an /en mirror or en-hreflang (single locale)
  const plOnlyPages = [
    {
      url: "llm-wiki",
      priority: "0.8",
      changefreq: "monthly",
      lastmod: getGitLastModDate("src/pages/LlmWikiLanding.jsx"),
    },
  ];

  // PL-only free course — hub + one entry per lesson (derived from files)
  const courseLessons = getCourseLessons(
    path.join(__dirname, "..", "src", "content", "kurs")
  );
  if (courseLessons.length > 0) {
    plOnlyPages.push({
      url: "llm-wiki/kurs",
      priority: "0.7",
      changefreq: "monthly",
      lastmod: getGitLastModDate("src/pages/CourseHub.jsx"),
    });
    for (const lesson of courseLessons) {
      plOnlyPages.push({
        url: `llm-wiki/kurs/${lesson.slug}`,
        priority: "0.6",
        changefreq: "monthly",
        lastmod: getGitLastModDate(`src/content/kurs/${lesson.file}`),
      });
    }
  }

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

  // PL-only pages — single PL URL, no en alternate (avoids leaking a
  // non-existent /en mirror to crawlers)
  plOnlyPages.forEach((page) => {
    const plUrl = `${SITE_URL}/${page.url}`;
    xml += "  <url>\n";
    xml += `    <loc>${plUrl}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>\n`;
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

  return { xml, postsPl, postsEn, plOnlyCount: plOnlyPages.length };
}

/**
 * Zapisuje sitemap do pliku
 */
function saveSitemap() {
  console.log("🗺️  Generowanie sitemap.xml...\n");

  const { xml, postsPl, postsEn, plOnlyCount } = generateSitemap();
  const outputPath = path.join(__dirname, "..", "public", "sitemap.xml");

  fs.writeFileSync(outputPath, xml, "utf-8");

  const staticCount = 5 * 2; // PL + EN
  const blogCount = postsPl.length + postsEn.length;
  const projectCount = projects.length * 2; // PL + EN

  console.log("✅ Sitemap wygenerowany pomyślnie!\n");
  console.log(`📄 Plik: public/sitemap.xml`);
  console.log(`📊 Strony statyczne: ${staticCount} (${staticCount / 2} PL + ${staticCount / 2} EN)`);
  console.log(`📄 Strony PL-only: ${plOnlyCount}`);
  console.log(`📝 Artykuły blogowe: ${blogCount} (${postsPl.length} PL + ${postsEn.length} EN)`);
  console.log(`💼 Projekty: ${projectCount} (${projects.length} PL + ${projects.length} EN)`);
  console.log(`🔗 Łącznie URLi: ${staticCount + plOnlyCount + blogCount + projectCount}\n`);

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
