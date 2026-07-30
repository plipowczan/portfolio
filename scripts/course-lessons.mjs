import { existsSync, readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

/**
 * Lista lekcji kursu LLM Wiki, wyliczona z plików markdown.
 *
 * Kurs jest sterowany plikami: lekcję dodaje się, wrzucając jeden `.md`.
 * Dlatego zarówno prerender, jak i sprawdzenie jego wyniku muszą czytać ten
 * sam katalog. Ręcznie utrzymywana lista w którymkolwiek z nich przechodziłaby
 * na zielono, podczas gdy nowa lekcja po cichu nigdy by się nie prerenderowała.
 */

const HERE = dirname(fileURLToPath(import.meta.url));

// Dokumentacja mieszkająca w folderze z treścią. To pliki `.md`, więc readdir
// je łapie, a bez frontmattera stałyby się trasami-widmo. Ta sama lista co w
// `scripts/prerender.mjs` i `scripts/update-sitemap.js` — kanon w
// `src/data/AGENTS.md`.
const DOC_FILES = new Set(["README.md", "AGENTS.md", "CLAUDE.md"]);

export const COURSE_CONTENT_DIR = join(HERE, "..", "src", "content", "kurs");

/** Bazowa ścieżka kursu. Kurs jest PL-only — nie ma wariantu /en. */
export const COURSE_BASE_PATH = "/llm-wiki/kurs";

/**
 * Pliki, które w tym katalogu w ogóle kandydują na lekcję: markdown, nie szkic
 * (`_` na początku), nie dokumentacja.
 *
 * Wydzielone, bo sprawdzenie wyniku prerenderu musi umieć porównać, ile plików
 * kandydowało, z tym, ile z nich dało poprawną lekcję. Bez tego porównania plik
 * z uszkodzonym frontmatterem wypada po cichu: nie prerenderuje się i nie ma go
 * na liście, którą sprawdza inwariant, więc build przechodzi.
 *
 * @param {string} [dir]
 * @returns {string[]} nazwy plików
 */
export function listLessonFiles(dir = COURSE_CONTENT_DIR) {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir).filter(
    (file) =>
      file.endsWith(".md") && !file.startsWith("_") && !DOC_FILES.has(file)
  );
}

/**
 * @param {string} [dir] katalog z lekcjami (domyślnie `src/content/kurs`)
 * @returns {{ file: string, slug: string, order: number }[]} lekcje wg `order`
 */
export function getCourseLessons(dir = COURSE_CONTENT_DIR) {
  const files = listLessonFiles(dir);

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
