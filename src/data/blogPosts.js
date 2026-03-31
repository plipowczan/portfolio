import matter from "gray-matter";

// Import PL posts from root blog folder
const blogFilesPl = import.meta.glob("../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Import EN posts from blog/en/ subfolder
const blogFilesEn = import.meta.glob("../content/blog/en/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * Waliduje czy wszystkie wymagane pola istnieją w front matter
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

  if (typeof data.id !== "number") {
    throw new Error(`Invalid 'id' type in ${filename}: expected number`);
  }

  if (!Array.isArray(data.tags)) {
    console.warn(`Missing or invalid 'tags' in ${filename}, using empty array`);
  }
}

/**
 * Parsuje plik markdown z front matter i zwraca obiekt artykułu
 */
function parsePost(rawMarkdown, filename = "unknown") {
  try {
    const { data, content } = matter(rawMarkdown);

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
      lang: data.lang || "pl",
      alternateSlug: data.alternateSlug || null,
    };
  } catch (error) {
    console.error(`Error parsing blog post ${filename}:`, error.message);
    return null;
  }
}

function filterAndParse(files) {
  return Object.entries(files)
    .filter(([path]) => {
      const filename = path.split("/").pop();
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
    .filter((post) => post !== null);
}

const allPosts = [...filterAndParse(blogFilesPl), ...filterAndParse(blogFilesEn)].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

// Default export: all posts (backward compatible)
export const blogPosts = allPosts;

/**
 * Pobiera posty filtrowane po języku
 */
export function getPostsByLang(lang) {
  return allPosts
    .filter((post) => post.lang === lang)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Pobiera alternate post (tłumaczenie) dla danego slugu
 */
export function getAlternatePost(slug) {
  const post = allPosts.find((p) => p.slug === slug);
  if (!post?.alternateSlug) return null;
  return allPosts.find((p) => p.slug === post.alternateSlug) || null;
}

/**
 * Pobiera pojedynczy artykuł po slug
 */
export function getPostBySlug(slug) {
  return allPosts.find((post) => post.slug === slug) || null;
}

/**
 * Pobiera artykuły według kategorii
 */
export function getPostsByCategory(category) {
  return allPosts.filter((post) => post.category === category);
}

/**
 * Pobiera artykuły według tagu
 */
export function getPostsByTag(tag) {
  return allPosts.filter((post) => post.tags.includes(tag));
}

/**
 * Pobiera wszystkie unikalne kategorie
 */
export function getAllCategories() {
  return [...new Set(allPosts.map((post) => post.category))];
}

/**
 * Pobiera wszystkie unikalne tagi
 */
export function getAllTags() {
  const allTags = allPosts.flatMap((post) => post.tags);
  return [...new Set(allTags)];
}
