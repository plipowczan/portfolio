import matter from "gray-matter";

// Import course lessons from the dedicated kurs folder (separate from blog).
const courseFiles = import.meta.glob("../content/kurs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * Waliduje wymagane pola front matter lekcji kursu.
 */
function validateFrontMatter(data, filename) {
  const requiredFields = ["slug", "order", "title", "excerpt"];
  const missingFields = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null || data[field] === ""
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields in ${filename}: ${missingFields.join(", ")}`
    );
  }

  if (typeof data.order !== "number") {
    throw new Error(`Invalid 'order' type in ${filename}: expected number`);
  }

  // excerpt feeds the hub card fallback and the lesson SEO description —
  // fail fast on a non-string so a page can't ship an empty meta description.
  if (typeof data.excerpt !== "string") {
    throw new Error(`Invalid 'excerpt' type in ${filename}: expected string`);
  }
}

/**
 * Parsuje plik markdown lekcji i zwraca obiekt lekcji.
 */
function parseLesson(rawMarkdown, filename = "unknown") {
  try {
    const { data, content } = matter(rawMarkdown);

    validateFrontMatter(data, filename);

    return {
      slug: data.slug,
      order: data.order,
      title: data.title,
      excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
      // Optional screencast wired into the lesson's top slot when present.
      // `video` = primary source (WebM/VP9), `videoMp4` = optional H.264
      // fallback for Safari/iOS, `poster` = still shown before play
      // (defaults to the shared course OG in the view). All optional — a
      // lesson without a recording keeps the "Screencast wkrótce" placeholder.
      video: typeof data.video === "string" ? data.video : null,
      videoMp4: typeof data.videoMp4 === "string" ? data.videoMp4 : null,
      poster: typeof data.poster === "string" ? data.poster : null,
      content: content.trim(),
    };
  } catch (error) {
    console.error(`Error parsing course lesson ${filename}:`, error.message);
    return null;
  }
}

const allLessons = Object.entries(courseFiles)
  .filter(([path]) => {
    const filename = path.split("/").pop();
    return !filename.startsWith("_") && filename !== "README.md";
  })
  .map(([path, content]) => {
    const filename = path.split("/").pop();
    return parseLesson(content, filename);
  })
  .filter((lesson) => lesson !== null)
  .sort((a, b) => a.order - b.order);

// All lessons, ordered by `order`.
export const coursePosts = allLessons;

/**
 * Pobiera pojedynczą lekcję po slug.
 */
export function getLessonBySlug(slug) {
  return allLessons.find((lesson) => lesson.slug === slug) || null;
}

/**
 * Zwraca poprzednią i następną lekcję względem podanego slug.
 * { prev, next } — null gdy brak sąsiada (pierwsza/ostatnia lekcja).
 */
export function getPrevNext(slug) {
  const index = allLessons.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? allLessons[index - 1] : null,
    next: index < allLessons.length - 1 ? allLessons[index + 1] : null,
  };
}
