import matter from "gray-matter";

// Automatyczny import wszystkich plików markdown z folderu blog
// Pomija pliki _wsad.md, _template.md i README.md
// Import as string explicitly to preserve UTF-8 encoding
const blogFiles = import.meta.glob("../content/blog/*.md", {
  eager: true,
  as: "raw",
});

/**
 * Waliduje czy wszystkie wymagane pola istnieją w front matter
 * @param {Object} data - Dane z front matter
 * @param {string} filename - Nazwa pliku (dla error message)
 * @throws {Error} - Jeśli brakuje wymaganych pól
 */
function validateFrontMatter(data, filename) {
  const requiredFields = [
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

  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields in ${filename}: ${missingFields.join(", ")}`
    );
  }

  // Walidacja typów
  if (typeof data.id !== "number") {
    throw new Error(`Invalid 'id' type in ${filename}: expected number`);
  }

  if (!Array.isArray(data.tags)) {
    console.warn(`Missing or invalid 'tags' in ${filename}, using empty array`);
  }
}

/**
 * Parsuje plik markdown z front matter i zwraca obiekt artykułu
 * @param {string} rawMarkdown - Surowa treść pliku markdown
 * @param {string} filename - Nazwa pliku (dla error handling)
 * @returns {Object|null} - Obiekt artykułu z metadanymi i treścią, lub null jeśli parsowanie się nie powiodło
 */
function parsePost(rawMarkdown, filename = "unknown") {
  try {
    const { data, content } = matter(rawMarkdown);

    // Waliduj front matter
    validateFrontMatter(data, filename);

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: content.trim(),
      category: data.category,
      author: data.author,
      date:
        data.date instanceof Date
          ? data.date.toISOString().split("T")[0]
          : data.date,
      readTime: data.readTime,
      image: data.image,
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
  } catch (error) {
    console.error(`Error parsing blog post ${filename}:`, error.message);
    return null;
  }
}

// Automatycznie parsuj wszystkie artykuły z folderu
const parsedPosts = Object.entries(blogFiles)
  .filter(([path]) => {
    const filename = path.split("/").pop();
    // Pomijaj pliki wsadowe, template i README
    return (
      !filename.endsWith("_wsad.md") &&
      !filename.startsWith("_") &&
      filename !== "README.md"
    );
  })
  .map(([path, content]) => {
    const filename = path.split("/").pop();
    return parsePost(content, filename);
  })
  .filter((post) => post !== null); // Usuń niepoprawne posty

// Sortuj od najnowszych
export const blogPosts = parsedPosts.sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

/**
 * Pobiera pojedynczy artykuł po slug
 * @param {string} slug - Slug artykułu
 * @returns {Object|null} - Obiekt artykułu lub null jeśli nie znaleziono
 */
export function getPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug) || null;
}

/**
 * Pobiera artykuły według kategorii
 * @param {string} category - Kategoria artykułów
 * @returns {Array} - Tablica artykułów z danej kategorii
 */
export function getPostsByCategory(category) {
  return blogPosts.filter((post) => post.category === category);
}

/**
 * Pobiera artykuły według tagu
 * @param {string} tag - Tag artykułów
 * @returns {Array} - Tablica artykułów z danym tagiem
 */
export function getPostsByTag(tag) {
  return blogPosts.filter((post) => post.tags.includes(tag));
}

/**
 * Pobiera wszystkie unikalne kategorie
 * @returns {Array} - Tablica unikalnych kategorii
 */
export function getAllCategories() {
  return [...new Set(blogPosts.map((post) => post.category))];
}

/**
 * Pobiera wszystkie unikalne tagi
 * @returns {Array} - Tablica unikalnych tagów
 */
export function getAllTags() {
  const allTags = blogPosts.flatMap((post) => post.tags);
  return [...new Set(allTags)];
}
