/**
 * Generator treści budowany raz, przy buildzie.
 *
 * Czyta markdown z `src/content/blog/`, `src/content/blog/en/` i
 * `src/content/kurs/`, parsuje frontmatter `gray-matter`, po czym zapisuje do
 * `src/data/generated/`:
 *
 * - `index.js` — lekki indeks (wszystko poza treścią) plus mapy leniwych
 *   importów treści,
 * - `blog/<lang>-<slug>.js` i `kurs/<slug>.js` — po jednym module na artykuł
 *   i lekcję, z samą treścią.
 *
 * Dzięki temu w bundlu klienta nie ląduje ani treść artykułów, ani parser
 * frontmattera. Katalog wyjściowy to artefakt buildu — jest w `.gitignore`,
 * a generator jest idempotentny, więc nieaktualny katalog naprawia dowolny
 * build.
 *
 * Walidacja frontmattera jest tutaj, nie w przeglądarce: walidacja odpalana w
 * przeglądarce może zawieść dopiero po wypuszczeniu strony.
 *
 * Bez shebanga celowo: `vite.config.js` importuje ten plik, a esbuild sklejający
 * konfigurację wstawiłby `#!` w środek pliku i wywrócił build.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import matter from "gray-matter";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

export const CONTENT_DIR = join(ROOT, "src", "content");
export const GENERATED_DIR = join(ROOT, "src", "data", "generated");

// Dokumentacja mieszkająca w folderach z treścią. To pliki `.md`, więc readdir
// je łapie, a bez frontmattera przewróciłyby walidację. `README.md` to
// przewodnik po polsku, `AGENTS.md` to kontrakt DOX dla agentów, `CLAUDE.md`
// to jego shim. Kanon listy: `src/data/AGENTS.md`.
const DOC_FILES = new Set(["README.md", "AGENTS.md", "CLAUDE.md"]);

const BLOG_REQUIRED = [
  "id",
  "slug",
  "title",
  "excerpt",
  "category",
  "author",
  "date",
  "readTime",
  "image",
];

const LESSON_REQUIRED = ["slug", "order", "title", "excerpt", "updated"];

/**
 * Pliki, które w danym katalogu kandydują na treść: markdown, nie szkic
 * (`_` na początku, `_wsad.md` na końcu), nie dokumentacja.
 *
 * @param {string} dir
 * @returns {string[]}
 */
function listContentFiles(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isFile())
    .map((item) => item.name)
    .filter(
      (file) =>
        file.endsWith(".md") &&
        !file.endsWith("_wsad.md") &&
        !file.startsWith("_") &&
        !DOC_FILES.has(file),
    )
    .sort();
}

/** Data z frontmattera → `YYYY-MM-DD`. YAML zwraca `Date` dla dat bez cudzysłowów. */
function toIsoDate(value) {
  if (value instanceof Date) return value.toISOString().split("T")[0];
  return value;
}

function isIsoDateLike(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * Waliduje frontmatter artykułu. Rzuca z nazwą pliku i nazwą problemu.
 *
 * Pola opcjonalne (`tags`, `description`, `modified`) zostają przy ostrzeżeniu
 * — zły typ jest ignorowany, nie wywraca buildu.
 */
function validatePost(data, filename) {
  const missing = BLOG_REQUIRED.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields in ${filename}: ${missing.join(", ")}`);
  }

  if (typeof data.id !== "number") {
    throw new Error(`Invalid 'id' type in ${filename}: expected number`);
  }

  if (typeof data.slug !== "string" || data.slug.trim() === "") {
    throw new Error(`Invalid 'slug' in ${filename}: expected a non-empty string`);
  }

  if (!Array.isArray(data.tags)) {
    console.warn(`  ⚠️  Missing or invalid 'tags' in ${filename}, using empty array`);
  }

  if (data.description !== undefined && typeof data.description !== "string") {
    console.warn(
      `  ⚠️  Invalid optional 'description' type in ${filename}: expected string, ignoring`,
    );
  }

  if (
    data.modified !== undefined &&
    !(data.modified instanceof Date) &&
    !isIsoDateLike(data.modified)
  ) {
    console.warn(
      `  ⚠️  Invalid optional 'modified' in ${filename}: expected YYYY-MM-DD string or Date, ignoring`,
    );
  }
}

/** Waliduje frontmatter lekcji. Rzuca z nazwą pliku i nazwą problemu. */
function validateLesson(data, filename) {
  const missing = LESSON_REQUIRED.filter(
    (field) => data[field] === undefined || data[field] === null || data[field] === "",
  );
  if (missing.length > 0) {
    throw new Error(`Missing required fields in ${filename}: ${missing.join(", ")}`);
  }

  if (typeof data.slug !== "string" || data.slug.trim() === "") {
    throw new Error(`Invalid 'slug' in ${filename}: expected a non-empty string`);
  }

  if (typeof data.order !== "number") {
    throw new Error(`Invalid 'order' type in ${filename}: expected number`);
  }

  // `excerpt` zasila kartę na hubie i opis SEO lekcji — nie-string przewraca
  // build, żeby strona nie wyszła z pustym meta description.
  if (typeof data.excerpt !== "string") {
    throw new Error(`Invalid 'excerpt' type in ${filename}: expected string`);
  }

  // `updated` zasila <lastmod> w sitemapie. Kiedyś brało się z historii gita,
  // ale środowisko budujące klonuje repozytorium ze skróconą historią i każdy
  // plik nietknięty od granicy skrótu raportował tę samą, fałszywą datę.
  // Data mieszka więc przy treści, a walidacja jest tutaj, żeby nowa lekcja bez
  // daty przewróciła build od razu, a nie dopiero przy generowaniu sitemapy.
  const updatedIso =
    data.updated instanceof Date
      ? data.updated.toISOString().slice(0, 10)
      : data.updated;
  if (typeof updatedIso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(updatedIso)) {
    throw new Error(
      `Invalid 'updated' in ${filename}: expected YYYY-MM-DD, got ${String(data.updated)}`,
    );
  }
}

/** @returns {{ entry: object, body: string }} */
function parsePost(raw, filename, lang) {
  const { data, content } = matter(raw);
  validatePost(data, filename);

  return {
    entry: {
      id: data.id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      author: data.author,
      date: toIsoDate(data.date),
      readTime: data.readTime,
      image: data.image,
      tags: Array.isArray(data.tags) ? data.tags : [],
      lang: data.lang || lang,
      alternateSlug: data.alternateSlug || null,
      description: typeof data.description === "string" ? data.description : null,
      modified:
        data.modified instanceof Date || isIsoDateLike(data.modified)
          ? toIsoDate(data.modified)
          : null,
    },
    body: content.trim(),
  };
}

/** @returns {{ entry: object, body: string }} */
function parseLesson(raw, filename) {
  const { data, content } = matter(raw);
  validateLesson(data, filename);

  return {
    entry: {
      slug: data.slug,
      order: data.order,
      updated:
        data.updated instanceof Date
          ? data.updated.toISOString().slice(0, 10)
          : data.updated,
      title: data.title,
      excerpt: data.excerpt,
      // Opcjonalny screencast wpięty w górny slot lekcji. `video` = źródło
      // główne (WebM/VP9), `videoMp4` = opcjonalny fallback H.264 dla
      // Safari/iOS, `poster` = klatka przed odtworzeniem.
      video: typeof data.video === "string" ? data.video : null,
      videoMp4: typeof data.videoMp4 === "string" ? data.videoMp4 : null,
      poster: typeof data.poster === "string" ? data.poster : null,
    },
    body: content.trim(),
  };
}

/**
 * Literał stringa dla wygenerowanego modułu.
 *
 * `JSON.stringify` nie escapuje U+2028/U+2029. W literale JS są legalne od
 * ES2019, ale escapujemy je jawnie — plik przechodzi przez kilka narzędzi i
 * nie ma powodu polegać na najnowszym parserze w każdym z nich.
 */
function jsString(value) {
  return JSON.stringify(value).replace(/[\u2028\u2029]/g, (char) =>
    char === "\u2028" ? "\\u2028" : "\\u2029",
  );
}

const HEADER = `// PLIK GENEROWANY — nie edytuj.
// Źródło: src/content/**, generator: scripts/generate-content.mjs
`;

/** Zapisuje tylko przy zmianie: generator ma być idempotentny. */
function writeIfChanged(file, contents) {
  if (existsSync(file) && readFileSync(file, "utf-8") === contents) return false;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents, "utf-8");
  return true;
}

/** Usuwa moduły treści, których źródłowy markdown już nie istnieje. */
function pruneStale(dir, keep) {
  if (!existsSync(dir)) return;
  for (const file of readdirSync(dir)) {
    if (file.endsWith(".js") && !keep.has(file)) {
      rmSync(join(dir, file));
    }
  }
}

/**
 * Przewraca build, gdy dwa pliki dają tę samą wartość klucza.
 *
 * Nazwa modułu z treścią bierze się ze `slug`, więc dwa artykuły o tym samym
 * slugu w jednym języku nadpisywały się nawzajem — po cichu, bo indeks nadal
 * miał dwa wpisy i wszystko wyglądało poprawnie. Ten sam problem dotyczy
 * `order` lekcji: napędza kolejność na hubie oraz linki poprzednia/następna,
 * a przy remisie kolejność zależy od sortowania, nie od autora.
 *
 * @param {{ file: string }[]} items
 * @param {(item: any) => string} keyOf
 * @param {string} label nazwa klucza w komunikacie
 */
function assertUnique(items, keyOf, label) {
  const seen = new Map();
  for (const item of items) {
    const key = keyOf(item);
    const previous = seen.get(key);
    if (previous) {
      throw new Error(
        `Duplicate ${label} "${key}" in ${item.file} and ${previous} — ` +
          `each one must be unique, the content module is named after it`,
      );
    }
    seen.set(key, item.file);
  }
}

/**
 * Buduje indeks i moduły treści.
 *
 * @param {{ contentDir?: string, outDir?: string, quiet?: boolean }} [options]
 * @returns {{ blogIndex: object[], courseIndex: object[] }}
 */
export function generateContent(options = {}) {
  const contentDir = options.contentDir ?? CONTENT_DIR;
  const outDir = options.outDir ?? GENERATED_DIR;

  const courseDir = join(contentDir, "kurs");

  const posts = [];
  for (const [dir, lang] of [
    [join(contentDir, "blog"), "pl"],
    [join(contentDir, "blog", "en"), "en"],
  ]) {
    for (const file of listContentFiles(dir)) {
      const parsed = parsePost(readFileSync(join(dir, file), "utf-8"), file, lang);
      posts.push({
        ...parsed,
        file,
        module: `${parsed.entry.lang}-${parsed.entry.slug}.js`,
      });
    }
  }

  const lessons = listContentFiles(courseDir).map((file) => {
    const parsed = parseLesson(readFileSync(join(courseDir, file), "utf-8"), file);
    return { ...parsed, file, module: `${parsed.entry.slug}.js` };
  });

  assertUnique(posts, (p) => `${p.entry.lang}/${p.entry.slug}`, "slug");
  assertUnique(lessons, (l) => l.entry.slug, "slug lekcji");
  assertUnique(lessons, (l) => String(l.entry.order), "order lekcji");

  // Ta sama kolejność, którą wcześniej ustalały loadery: artykuły od
  // najnowszego, lekcje wg `order`.
  posts.sort((a, b) => new Date(b.entry.date) - new Date(a.entry.date));
  lessons.sort((a, b) => a.entry.order - b.entry.order);

  const blogOut = join(outDir, "blog");
  const courseOut = join(outDir, "kurs");

  for (const post of posts) {
    writeIfChanged(
      join(blogOut, post.module),
      `${HEADER}export const content = ${jsString(post.body)};\n`,
    );
  }
  for (const lesson of lessons) {
    writeIfChanged(
      join(courseOut, lesson.module),
      `${HEADER}export const content = ${jsString(lesson.body)};\n`,
    );
  }

  pruneStale(blogOut, new Set(posts.map((p) => p.module)));
  pruneStale(courseOut, new Set(lessons.map((l) => l.module)));

  const blogLoaders = posts
    .map(
      (p) =>
        `  ${jsString(`${p.entry.lang}/${p.entry.slug}`)}: () => import("./blog/${p.module}"),`,
    )
    .join("\n");
  const courseLoaders = lessons
    .map((l) => `  ${jsString(l.entry.slug)}: () => import("./kurs/${l.module}"),`)
    .join("\n");

  const index = `${HEADER}
/** Wpisy bloga bez treści, od najnowszego. */
export const blogIndex = ${JSON.stringify(
    posts.map((p) => p.entry),
    null,
    2,
  )};

/** Lekcje kursu bez treści, wg \`order\`. */
export const courseIndex = ${JSON.stringify(
    lessons.map((l) => l.entry),
    null,
    2,
  )};

// Każdy wpis to osobny \`import()\`, więc Rollup robi z niego osobny chunk.
// Treść pobiera się dopiero przy otwarciu artykułu albo lekcji.
const blogBodies = {
${blogLoaders}
};

const courseBodies = {
${courseLoaders}
};

/**
 * @param {"pl"|"en"} lang
 * @param {string} slug
 * @returns {Promise<string>} treść artykułu w markdown
 */
export function loadBlogBody(lang, slug) {
  const load = blogBodies[\`\${lang}/\${slug}\`];
  if (!load) {
    return Promise.reject(new Error(\`Brak treści artykułu: \${lang}/\${slug}\`));
  }
  return load().then((module) => module.content);
}

/**
 * @param {string} slug
 * @returns {Promise<string>} treść lekcji w markdown
 */
export function loadCourseBody(slug) {
  const load = courseBodies[slug];
  if (!load) {
    return Promise.reject(new Error(\`Brak treści lekcji: \${slug}\`));
  }
  return load().then((module) => module.content);
}
`;

  writeIfChanged(join(outDir, "index.js"), index);

  if (!options.quiet) {
    console.log(
      `  📚 Wygenerowano indeks treści: ${posts.length} artykułów, ${lessons.length} lekcji`,
    );
  }

  return {
    blogIndex: posts.map((p) => p.entry),
    courseIndex: lessons.map((l) => l.entry),
  };
}

/**
 * Wtyczka Vite: generuje przed buildem i pilnuje `src/content/**` w dev.
 *
 * Osobny skrypt `prebuild` byłby prostszy w czytaniu, ale rozdwajałby prawdę:
 * `npm run dev` serwowałby to, co wygenerował ostatni build, więc autor
 * edytujący artykuł nie zobaczyłby niczego. Wtyczka trzyma kontrakt „wrzuć
 * plik, pojawi się", który deklaruje `src/content/blog/AGENTS.md`.
 */
export function contentGenerator() {
  return {
    name: "generate-content",
    buildStart() {
      generateContent();
    },
    configureServer(server) {
      // `src/content/**` nie jest już importowane przez aplikację, więc watcher
      // Vite sam z siebie tych plików nie obserwuje.
      server.watcher.add(CONTENT_DIR);

      const regenerate = (file) => {
        const posix = file.replace(/\\/g, "/");
        if (!posix.includes("/src/content/") || !posix.endsWith(".md")) return;
        try {
          generateContent({ quiet: true });
        } catch (error) {
          server.config.logger.error(`❌ Generator treści: ${error.message}`, {
            timestamp: true,
          });
        }
      };

      server.watcher.on("add", regenerate);
      server.watcher.on("change", regenerate);
      server.watcher.on("unlink", regenerate);
    },
  };
}

// Uruchomienie bezpośrednie: `node scripts/generate-content.mjs`
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    generateContent();
  } catch (error) {
    console.error(`❌ Generator treści: ${error.message}`);
    process.exit(1);
  }
}
