import { expect, test } from "@playwright/test";

/**
 * Cache headers come from vercel.json, so they only exist on a deployment —
 * neither the dev server nor `vite preview` applies them. Reuses the same
 * opt-in variable as seo-security-headers.spec.js: both suites answer the same
 * question ("what does the CDN actually send?") and there is no reason to make
 * the reader remember two names.
 *
 * Example:
 *   SEO_HEADERS_URL=https://pawel.lipowczan.pl npx playwright test perf-font-cache-headers
 */
const DEPLOYED_URL = process.env.SEO_HEADERS_URL;

test.describe("Perf — font cache headers on deployed site", () => {
  test.skip(
    !DEPLOYED_URL,
    "Set SEO_HEADERS_URL to a deployed URL (Vercel) to run this suite.",
  );

  test("preloadowany font wychodzi z rocznym, niezmiennym cache", async ({
    request,
  }) => {
    const page = await request.get(DEPLOYED_URL, { maxRedirects: 5 });
    expect(page.status(), `GET ${DEPLOYED_URL} should succeed`).toBeLessThan(
      400,
    );
    const html = await page.text();

    // Taking the href from the page instead of hardcoding it is what makes
    // this test survive `npm run fonts:fetch`: the filename carries a content
    // hash, so it changes whenever the font is regenerated.
    const preload = html.match(
      /<link[^>]+rel="preload"[^>]+href="([^"]+\.woff2)"/,
    );
    expect(
      preload,
      "index HTML must preload a .woff2 — the preload-body-font plugin injects it",
    ).not.toBeNull();

    const href = preload[1];

    // The two halves of the invariant are one thing, not two: a year-long
    // immutable cache is only safe because the name is fingerprinted. Served
    // from public/fonts/ the names stay literal, and the same header would pin
    // a stale font in every returning visitor's cache for a year.
    expect(
      href,
      "font must be a fingerprinted /assets/ URL, not a literal /fonts/ path",
    ).toMatch(/^\/assets\/inter-latin-[^/.]+\.woff2$/);

    const font = await request.get(new URL(href, DEPLOYED_URL).toString());
    expect(font.status(), `GET ${href} should succeed`).toBe(200);

    const headers = font.headers();
    expect(headers["cache-control"]).toContain("max-age=31536000");
    expect(headers["cache-control"]).toContain("immutable");
    expect(headers["content-type"]).toBe("font/woff2");
  });
});
