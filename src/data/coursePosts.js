import { courseIndex, loadCourseBody } from "./generated/index.js";

/**
 * Warstwa dostępu do lekcji kursu LLM Wiki.
 *
 * Indeks (`src/data/generated/index.js`) powstaje w buildzie —
 * `scripts/generate-content.mjs` parsuje i waliduje frontmatter tam, więc plik
 * lekcji bez `slug`, `order`, `title` albo `excerpt` przewraca build, a nie
 * wychodzi na produkcję z pustym opisem. Wpis indeksu ma wszystkie pola poza
 * `content`; treść pobiera `loadLessonContent`.
 */

// Wszystkie lekcje, wg `order`. Indeks przychodzi już posortowany.
export const coursePosts = courseIndex;

/**
 * Pobiera treść lekcji. Jeden `import()` na lekcję, więc pobiera się tylko ta,
 * którą ktoś otworzył.
 *
 * @param {string} slug slug lekcji
 * @returns {Promise<string>} treść w markdown
 */
export const loadLessonContent = loadCourseBody;

/**
 * Pobiera pojedynczą lekcję po slug.
 */
export function getLessonBySlug(slug) {
  return courseIndex.find((lesson) => lesson.slug === slug) || null;
}

/**
 * Zwraca poprzednią i następną lekcję względem podanego slug.
 * { prev, next } — null gdy brak sąsiada (pierwsza/ostatnia lekcja).
 */
export function getPrevNext(slug) {
  const index = courseIndex.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? courseIndex[index - 1] : null,
    next: index < courseIndex.length - 1 ? courseIndex[index + 1] : null,
  };
}
