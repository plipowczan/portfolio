#!/usr/bin/env node

/**
 * Sprawdzenie wyniku prerenderu.
 *
 * `scripts/prerender.mjs` kończy się kodem != 0, gdy trasa, o którą go
 * poproszono, nie wyrenderowała się. Nie zobaczy dwóch rzeczy: trasy, której
 * nigdy nie było na liście (lekcja dodana, ale niepodpięta), oraz strony,
 * która wyrenderowała się bez metadanych. To są dokładnie te dwie luki.
 *
 * Sprawdzenie siedzi w buildzie, nie w teście Playwrighta, bo `vercel.json`
 * ustawia `buildCommand: "npm run build:prerender"` — dzięki temu bramka
 * działa na każdym wdrożeniu preview i produkcyjnym, bez minuty CI.
 *
 * Da się uruchomić osobno, bez pełnego builda:
 *   node scripts/verify-prerender-output.mjs
 */

import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import {
  COURSE_BASE_PATH,
  getCourseLessons,
  listLessonFiles,
} from "./course-lessons.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_DIST = join(HERE, "..", "dist");

const DESCRIPTION_TAG = 'name="description"';

/** `/llm-wiki/kurs` → ["llm-wiki", "kurs"] — segmenty do złożenia ścieżki. */
const COURSE_SEGMENTS = COURSE_BASE_PATH.split("/").filter(Boolean);

/**
 * @param {string} distDir katalog z wynikiem builda
 * @returns {{ problems: string[], checked: string[] }}
 */
export function checkPrerenderOutput(distDir = DEFAULT_DIST) {
  const problems = [];
  const checked = [];

  const requirePage = (segments, label) => {
    const file = join(distDir, ...segments, "index.html");
    if (!existsSync(file)) {
      problems.push(`${label}: brak pliku ${file}`);
      return;
    }
    if (!readFileSync(file, "utf-8").includes(DESCRIPTION_TAG)) {
      problems.push(`${label}: ${file} nie zawiera <meta ${DESCRIPTION_TAG}>`);
      return;
    }
    checked.push(`${label} → ${join(...segments, "index.html")}`);
  };

  // Hub kursu.
  requirePage(COURSE_SEGMENTS, "hub kursu");

  // Lekcje. Pusta lista znaczy, że nie ma czego sprawdzać — a to samo w sobie
  // jest awarią: bez tego strażnika wszystkie asercje niżej przechodzą
  // pustym przebiegiem i sprawdzenie melduje sukces, nie sprawdziwszy nic.
  const lessons = getCourseLessons();
  if (lessons.length === 0) {
    problems.push(
      "nie znaleziono żadnej lekcji kursu w src/content/kurs — sprawdzenie nie miałoby czego weryfikować"
    );
  }

  // Plik, który kandydował na lekcję, ale nie ma poprawnego `slug`/`order`,
  // wypada z listy z samym ostrzeżeniem na konsoli. Nie prerenderuje się i nie
  // trafia do pętli niżej, więc bez tego porównania build przechodzi mimo
  // lekcji, której nikt nigdy nie zobaczy — czyli dokładnie przypadek „lekcja
  // dodana, ale niepodpięta", od którego jest ten inwariant.
  const parsed = new Set(lessons.map((lesson) => lesson.file));
  for (const file of listLessonFiles()) {
    if (!parsed.has(file)) {
      problems.push(
        `src/content/kurs/${file} wygląda na lekcję, ale nie ma poprawnego frontmatteru (\`slug\` i \`order\`), więc nie została prerenderowana`
      );
    }
  }
  for (const lesson of lessons) {
    requirePage([...COURSE_SEGMENTS, lesson.slug], `lekcja ${lesson.slug}`);
  }

  // Kurs jest PL-only: żadnego wariantu pod /en.
  const enMirror = join(distDir, "en", ...COURSE_SEGMENTS);
  if (existsSync(enMirror)) {
    problems.push(
      `kurs jest PL-only, a powstał wariant /en: ${enMirror} — usuń go albo popraw listę tras w scripts/prerender.mjs`
    );
  }

  return { problems, checked };
}

/**
 * Wypisuje wynik i rzuca wyjątkiem, gdy wyjście jest niekompletne.
 * @param {string} [distDir]
 */
export function verifyPrerenderOutput(distDir = DEFAULT_DIST) {
  const { problems, checked } = checkPrerenderOutput(distDir);

  if (problems.length > 0) {
    console.error("\n❌ Prerender wypuścił niekompletne wyjście:\n");
    for (const problem of problems) {
      console.error(`   • ${problem}`);
    }
    console.error("");
    throw new Error(
      `Sprawdzenie wyniku prerenderu: ${problems.length} ${
        problems.length === 1 ? "problem" : "problemów"
      }`
    );
  }

  console.log(`\n✅ Wynik prerenderu sprawdzony (${checked.length} stron):`);
  for (const page of checked) {
    console.log(`   • ${page}`);
  }
  console.log("");
}

// Uruchomienie bezpośrednie: `node scripts/verify-prerender-output.mjs`
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    verifyPrerenderOutput(process.argv[2]);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
