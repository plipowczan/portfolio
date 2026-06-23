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

  test("CSP pozostaje w trybie Report-Only (nie jest egzekwowane)", async ({
    request,
  }) => {
    const res = await request.get(DEPLOYED_URL, { maxRedirects: 5 });
    const headers = res.headers();

    // Report-Only retained, enforcing CSP must NOT be present.
    expect(headers["content-security-policy-report-only"]).toBeDefined();
    expect(headers["content-security-policy"]).toBeUndefined();
  });

  test("CSP zachowuje konfigurację raportowania", async ({ request }) => {
    const res = await request.get(DEPLOYED_URL, { maxRedirects: 5 });
    const headers = res.headers();
    const csp = headers["content-security-policy-report-only"];

    expect(csp).toContain("report-uri ");
    expect(csp).toContain("report-to csp-endpoint");
    expect(headers["reporting-endpoints"]).toContain("csp-endpoint=");
  });

  test("CSP allowlist pokrywa realne zasoby strony", async ({ request }) => {
    const res = await request.get(DEPLOYED_URL, { maxRedirects: 5 });
    const csp = res.headers()["content-security-policy-report-only"];

    const directive = (name) => {
      const match = csp.match(new RegExp(`(?:^|;)\\s*${name}\\s+([^;]+)`));
      return match ? match[1] : "";
    };

    expect(directive("font-src")).toContain("https://fonts.gstatic.com");
    expect(directive("style-src")).toContain("https://fonts.googleapis.com");

    const connectSrc = directive("connect-src");
    expect(connectSrc).toContain("https://js.clickrank.ai");
    expect(connectSrc).toContain("https://formspree.io");
    expect(connectSrc).toContain("https://app.zencal.io");

    expect(directive("script-src")).toContain("https://app.zencal.io");
    expect(directive("frame-src")).toContain("https://app.zencal.io");
  });
});
