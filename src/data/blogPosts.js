import { blogIndex, loadBlogBody } from "./generated/index.js";

/**
 * Warstwa dostępu do artykułów bloga.
 *
 * Indeks (`src/data/generated/index.js`) powstaje w buildzie —
 * `scripts/generate-content.mjs` parsuje frontmatter i waliduje go tam, więc
 * do przeglądarki nie trafia ani parser frontmattera, ani treść artykułów.
 * Wpis indeksu ma wszystkie pola poza `content`; treść pobiera się osobno
 * przez `loadPostContent`, dopiero dla otwartego artykułu.
 */

// Wszystkie artykuły, od najnowszego. Indeks przychodzi już posortowany.
export const blogPosts = blogIndex;

/**
 * Pobiera treść artykułu. Jeden `import()` na artykuł, więc pobiera się tylko
 * ten, który ktoś otworzył.
 *
 * @param {"pl"|"en"} lang język artykułu
 * @param {string} slug slug artykułu
 * @returns {Promise<string>} treść w markdown
 */
export const loadPostContent = loadBlogBody;

/**
 * Pobiera posty filtrowane po języku
 */
export function getPostsByLang(lang) {
  return blogIndex.filter((post) => post.lang === lang);
}

/**
 * Pobiera alternate post (tłumaczenie) dla danego slugu.
 *
 * Para rozwiązuje się przez slug ORAZ język, bo slug sam w sobie nie jest
 * unikalny: część artykułów ma tę samą nazwę po obu stronach (np.
 * `no-code-lead-generation` istnieje w `blog/` i w `blog/en/`). Szukanie po
 * samym slugu trafiało wtedy w losową z dwóch wersji.
 *
 * Odpowiednikiem jest wpis o slugu z `alternateSlug` w INNYM języku. Ten
 * warunek zastępuje wcześniejsze odrzucanie `alternateSlug === slug`: artykuł
 * wskazujący sam na siebie i tak nie znajdzie wersji w drugim języku, a para o
 * identycznych slugach rozwiązuje się poprawnie.
 *
 * `lang` jest wymagany. Bez niego wyszukiwanie po samym slugu jest
 * niejednoznaczne dokładnie w tych przypadkach, dla których ta funkcja
 * powstała, i cicho zwracałoby wersję z drugiego języka. Brak języka to błąd
 * w kodzie wywołującym, więc zgłaszamy go w konsoli i zwracamy null: metadane
 * pominięte są mniej szkodliwe niż metadane wskazujące na zły adres.
 *
 * @param {string} slug slug artykułu
 * @param {"pl"|"en"} lang język tego artykułu
 * @returns {object|null} artykuł w drugim języku albo null
 */
export function getAlternatePost(slug, lang) {
  if (!lang) {
    console.error(
      `getAlternatePost("${slug}") wywołane bez języka - slug nie jest unikalny między wersjami, więc para nie zostanie rozwiązana.`,
    );
    return null;
  }
  const post = blogIndex.find((p) => p.slug === slug && p.lang === lang);
  if (!post?.alternateSlug) return null;
  const alternate = blogIndex.find(
    (p) => p.slug === post.alternateSlug && p.lang !== post.lang,
  );
  return alternate ?? null;
}

/**
 * Pobiera pojedynczy artykuł po slug
 */
export function getPostBySlug(slug) {
  return blogIndex.find((post) => post.slug === slug) || null;
}

/**
 * Pobiera artykuły według kategorii
 */
export function getPostsByCategory(category) {
  return blogIndex.filter((post) => post.category === category);
}

/**
 * Pobiera artykuły według tagu
 */
export function getPostsByTag(tag) {
  return blogIndex.filter((post) => post.tags.includes(tag));
}

/**
 * Pobiera wszystkie unikalne kategorie
 */
export function getAllCategories() {
  return [...new Set(blogIndex.map((post) => post.category))];
}

/**
 * Pobiera wszystkie unikalne tagi
 */
export function getAllTags() {
  return [...new Set(blogIndex.flatMap((post) => post.tags))];
}
