#!/usr/bin/env node
/**
 * Generates public/llms.txt and public/llms-full.txt per llmstxt.org spec.
 *
 * - llms.txt: index of blog posts + projects with 1-sentence descriptions.
 * - llms-full.txt: same index + full markdown content of every post,
 *   separated by `\n\n---\n\n`.
 *
 * Runs in build-with-prerender.mjs before vite build.
 */
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { fileURLToPath } from "url";
import { projects } from "../src/data/projects.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");

const SITE_URL = "https://pawel.lipowczan.pl";
const SITE_NAME = "Pawel Lipowczan";
const SITE_SUMMARY =
  "Architekt oprogramowania i doradca ds. technologii — agnostyczny dobór narzędzi do problemu, optymalizacja procesów biznesowych przez automatyzację i inteligentne rozwiązania no-code oraz AI.";
const CONTACT_EMAIL = "pawel@lipowczan.pl";

function readPosts(blogDir) {
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter(
      (f) =>
        f.endsWith(".md") &&
        !f.endsWith("_wsad.md") &&
        !f.startsWith("_") &&
        f !== "README.md",
    )
    .map((file) => {
      const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
      const { data, content } = matter(raw);
      const dateStr =
        data.date instanceof Date
          ? data.date.toISOString().split("T")[0]
          : data.date;
      return {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt || "",
        description: data.description || "",
        date: dateStr,
        lang: data.lang || "pl",
        alternateSlug: data.alternateSlug || null,
        content: content.trim(),
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function oneLine(text, maxChars = 200) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= maxChars) return t;
  const slice = t.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + "…";
}

function buildIndex(postsPl, postsEn) {
  let out = "";
  out += `# ${SITE_NAME}\n\n`;
  out += `> ${SITE_SUMMARY}\n\n`;

  out += `## Blog (PL)\n\n`;
  for (const p of postsPl) {
    const desc = oneLine(p.description || p.excerpt);
    out += `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${desc}\n`;
  }
  out += "\n";

  if (postsEn.length > 0) {
    out += `## Blog (EN)\n\n`;
    for (const p of postsEn) {
      const desc = oneLine(p.description || p.excerpt);
      out += `- [${p.title}](${SITE_URL}/en/blog/${p.slug}): ${desc}\n`;
    }
    out += "\n";
  }

  out += `## Projekty\n\n`;
  for (const proj of projects) {
    const desc = oneLine(proj.description);
    out += `- [${proj.title}](${SITE_URL}/projects/${proj.slug}): ${desc}\n`;
  }
  out += "\n";

  out += `## Kontakt\n\n`;
  out += `- email: ${CONTACT_EMAIL}\n`;
  out += `- strona: ${SITE_URL}\n`;
  return out;
}

function buildFull(index, postsPl, postsEn) {
  let out = index;
  const allPosts = [...postsPl, ...postsEn];
  for (const p of allPosts) {
    const url =
      p.lang === "en"
        ? `${SITE_URL}/en/blog/${p.slug}`
        : `${SITE_URL}/blog/${p.slug}`;
    out += `\n\n---\n\n`;
    out += `# ${p.title}\n\n`;
    out += `Source: ${url}\n`;
    out += `Published: ${p.date}\n\n`;
    out += p.content;
    out += "\n";
  }
  return out;
}

function main() {
  console.log("📝 Generating llms.txt + llms-full.txt...");

  const postsPl = readPosts(path.join(root, "src", "content", "blog"));
  const postsEn = readPosts(path.join(root, "src", "content", "blog", "en"));

  const index = buildIndex(postsPl, postsEn);
  const full = buildFull(index, postsPl, postsEn);

  const outDir = path.join(root, "public");
  fs.writeFileSync(path.join(outDir, "llms.txt"), index, "utf-8");
  fs.writeFileSync(path.join(outDir, "llms-full.txt"), full, "utf-8");

  console.log(
    `✅ llms.txt (${index.length} chars) + llms-full.txt (${full.length} chars) written to public/`,
  );
  console.log(
    `   Posts: ${postsPl.length} PL + ${postsEn.length} EN, Projects: ${projects.length}`,
  );
}

try {
  main();
} catch (err) {
  console.error("❌ Error generating llms.txt:", err);
  process.exit(1);
}
