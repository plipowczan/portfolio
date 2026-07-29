import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

/**
 * Metadata in the generated `dist/` — what a crawler receives without running
 * a single line of JavaScript (openspec: migrate-seo-to-react19-metadata).
 *
 * This exists because the prerenderer serves and writes the same directory.
 * `/` is written to dist/index.html, which `vite preview` also returns for any
 * route whose file does not exist yet. Rendering `/` before the rest left every
 * other page with two titles, two descriptions and two canonicals — the home
 * page's first, its own second. react-helmet-async had masked it by removing
 * pre-existing `data-rh` elements on mount; React 19 marks nothing it hoists,
 * so the ordering in scripts/prerender.mjs is what keeps this correct.
 *
 * Reads files, never a server: these assertions are about the bytes on disk.
 */

const DIST = fileURLToPath(new URL("../../dist", import.meta.url));

/** Comments are stripped so a commented-out tag is never counted. */
const strip = (html) => html.replace(/<!--[\s\S]*?-->/g, "");

const collectPages = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectPages(full, out);
    else if (entry === "index.html") out.push(full);
  }
  return out;
};

// Same marker the course spec uses: a plain `vite build` produces only
// dist/index.html, so dist/blog/index.html means a real prerender ran.
const PRERENDERED = (() => {
  try {
    return statSync(join(DIST, "blog", "index.html")).isFile();
  } catch {
    return false;
  }
})();

const rel = (file) => file.replace(DIST, "").replace(/\\/g, "/");

test.describe("Prerender — metadane w dist/", () => {
  test.skip(
    !PRERENDERED,
    "dist/ bez prerenderu — uruchom `npm run build:prerender` przed tym testem",
  );

  test("każdy wygenerowany plik ma po jednym title, description i canonical", () => {
    const pages = collectPages(DIST);
    expect(pages.length).toBeGreaterThan(0);

    const offenders = [];

    for (const file of pages) {
      const html = strip(readFileSync(file, "utf8"));
      const count = (re) => (html.match(re) ?? []).length;

      const counts = {
        title: count(/<title[\s>]/g),
        description: count(/<meta[^>]+name="description"/g),
        canonical: count(/<link[^>]+rel="canonical"/g),
      };

      if (
        counts.title !== 1 ||
        counts.description !== 1 ||
        counts.canonical !== 1
      ) {
        offenders.push({ page: rel(file), ...counts });
      }
    }

    expect(
      offenders,
      `duplicated metadata in dist/ — is "/" still prerendered last?\n${JSON.stringify(offenders, null, 2)}`,
    ).toEqual([]);
  });

  test("canonical w pliku wskazuje na jego własny adres", () => {
    const pages = collectPages(DIST);
    const mismatches = [];

    for (const file of pages) {
      const html = strip(readFileSync(file, "utf8"));
      const canonical = html.match(
        /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/,
      )?.[1];

      // dist/blog/x/index.html → /blog/x, dist/index.html → /
      const path = rel(file).replace(/\/index\.html$/, "") || "/";
      const expected = `https://pawel.lipowczan.pl${path}`;

      const normalize = (url) => (url ?? "").replace(/\/+$/, "") || "/";
      if (normalize(canonical) !== normalize(expected)) {
        mismatches.push({ page: path, canonical, expected });
      }
    }

    expect(
      mismatches,
      `canonical does not point at the page itself\n${JSON.stringify(mismatches, null, 2)}`,
    ).toEqual([]);
  });

  test("żaden artykuł nie zostaje z metadanymi strony 'nie znaleziono'", () => {
    // <BlogPostPage> resolves the post with getPostsByLang(i18n.language) and
    // i18n settles its language in an effect, so an early snapshot can catch
    // the not-found branch — which carries og:title and description, the two
    // tags the prerenderer waits for. This asserts none of that reached disk.
    const notFound = [];

    for (const file of collectPages(DIST)) {
      const html = strip(readFileSync(file, "utf8"));
      const description =
        html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/)?.[1] ??
        "";

      if (/could not be found|nie został znaleziony|nie znaleziono/i.test(description)) {
        notFound.push({ page: rel(file), description });
      }
    }

    expect(notFound, JSON.stringify(notFound, null, 2)).toEqual([]);
  });
});
