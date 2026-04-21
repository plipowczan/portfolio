import { expect, test } from "@playwright/test";

/**
 * Security headers are enforced by Vercel (vercel.json), not by the Vite dev server.
 * This test opts into hitting a deployed URL. Set SEO_HEADERS_URL (e.g. to a
 * Vercel preview URL or the production site) to run it; otherwise it skips.
 *
 * Example:
 *   SEO_HEADERS_URL=https://pawel.lipowczan.pl npx playwright test seo-security-headers
 */
const DEPLOYED_URL = process.env.SEO_HEADERS_URL;

test.describe("SEO — security headers on deployed site", () => {
  test.skip(
    !DEPLOYED_URL,
    "Set SEO_HEADERS_URL to a deployed URL (Vercel) to run this suite.",
  );

  test("response headers na / zawierają nowoczesny security set i brak X-XSS-Protection", async ({
    request,
  }) => {
    const res = await request.get(DEPLOYED_URL, { maxRedirects: 5 });
    expect(res.status(), `GET ${DEPLOYED_URL} should succeed`).toBeLessThan(400);
    const headers = res.headers();

    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["permissions-policy"]).toContain("geolocation=()");
    expect(headers["content-security-policy-report-only"]).toContain(
      "default-src 'self'",
    );
    expect(headers["x-xss-protection"]).toBeUndefined();
  });
});
