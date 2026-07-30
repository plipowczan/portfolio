import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { MEASUREMENT_ID, PRODUCTION_HOST } from "../../src/utils/analytics.js";
import { SITE_CONFIG } from "../../src/utils/constants.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIST = join(ROOT, "dist");

const PRODUCTION_ORIGIN = `https://${PRODUCTION_HOST}`;
/** The production build that playwright.config.js already starts for SEO tests. */
const PREVIEW_ORIGIN = "http://localhost:4173";

/**
 * Longer than the loader's `requestIdleCallback` timeout (3 s) plus its
 * `setTimeout` fallback (2 s). Every assertion that something was *not*
 * injected has to outlast the deferral, or it passes before the code it is
 * meant to catch has even had a chance to run.
 */
const PAST_INJECTION_WINDOW_MS = 3500;

const isGoogleAnalyticsHost = (url) =>
  url.hostname === "www.googletagmanager.com" ||
  url.hostname.endsWith("google-analytics.com") ||
  url.hostname.endsWith("analytics.google.com");

/**
 * Serves the production origin from the local preview build.
 *
 * The host gate compares `window.location.hostname` against a constant, and
 * page script cannot fake that — `location` is unforgeable. Routing the real
 * hostname to the local build is therefore the only way to exercise the consent
 * gate at all: on localhost the host gate short-circuits first, so every "no
 * script without consent" assertion would pass without proving anything.
 */
const serveProductionOrigin = async (page) => {
  await page.route(
    (url) => url.hostname === PRODUCTION_HOST,
    async (route) => {
      const { pathname, search } = new URL(route.request().url());
      const response = await route.fetch({
        url: `${PREVIEW_ORIGIN}${pathname}${search}`,
      });
      await route.fulfill({ response });
    },
  );
};

/**
 * Intercepts Google's origins so the suite never touches the network, and
 * returns the list of attempted URLs.
 *
 * The loader is fulfilled with an empty body on purpose: the real gtag.js would
 * drain `window.dataLayer`, and leaving it queued is what makes the page views
 * readable from the test.
 */
const captureGoogleRequests = async (page) => {
  const attempted = [];
  await page.route(isGoogleAnalyticsHost, async (route) => {
    attempted.push(route.request().url());
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "",
    });
  });
  return attempted;
};

const seedConsent = (page, value) =>
  page.addInitScript((consent) => {
    if (consent === null) {
      window.localStorage.removeItem("cookieConsent");
    } else {
      window.localStorage.setItem("cookieConsent", consent);
    }
  }, value);

const gtagScripts = (page) =>
  page.locator('script[src*="googletagmanager.com"]');

const readPageViews = (page) =>
  page.evaluate(() =>
    (window.dataLayer || [])
      .filter((entry) => entry && typeof entry.length === "number")
      .map((entry) => Array.from(entry))
      .filter((args) => args[0] === "event" && args[1] === "page_view")
      .map((args) => args[2]),
  );

const readConsent = (page) =>
  page.evaluate(() => window.localStorage.getItem("cookieConsent"));

test.describe("Analytics — bramka zgody na hoście produkcyjnym", () => {
  test.use({ baseURL: PRODUCTION_ORIGIN });

  test("brak decyzji: gtag się nie wstrzykuje i nie leci żądanie do Google", async ({
    page,
  }) => {
    const attempted = await captureGoogleRequests(page);
    await serveProductionOrigin(page);
    await seedConsent(page, null);

    await page.goto("/");
    await page.waitForTimeout(PAST_INJECTION_WINDOW_MS);

    await expect(gtagScripts(page)).toHaveCount(0);
    expect(attempted).toEqual([]);

    // `_ga` follows from the assertion above rather than standing on its own:
    // the cookie is set by a script this test proves never loads.
    const cookies = await page.context().cookies();
    expect(cookies.filter((c) => c.name.startsWith("_ga"))).toEqual([]);
  });

  test("zgoda odrzucona: gtag się nie wstrzykuje", async ({ page }) => {
    const attempted = await captureGoogleRequests(page);
    await serveProductionOrigin(page);
    await seedConsent(page, "rejected");

    await page.goto("/");
    await page.waitForTimeout(PAST_INJECTION_WINDOW_MS);

    await expect(gtagScripts(page)).toHaveCount(0);
    expect(attempted).toEqual([]);

    const cookies = await page.context().cookies();
    expect(cookies.filter((c) => c.name.startsWith("_ga"))).toEqual([]);
  });

  test("zgoda udzielona: gtag się wstrzykuje z właściwym measurement ID", async ({
    page,
  }) => {
    await captureGoogleRequests(page);
    await serveProductionOrigin(page);
    await seedConsent(page, "accepted");

    await page.goto("/");

    await expect(gtagScripts(page)).toHaveCount(1);
    await expect(gtagScripts(page)).toHaveAttribute(
      "src",
      `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`,
    );
  });

  test("kliknięcie „Akceptuję\" uruchamia analitykę bez przeładowania", async ({
    page,
  }) => {
    await captureGoogleRequests(page);
    await serveProductionOrigin(page);
    await seedConsent(page, null);

    await page.goto("/");
    const banner = page.locator(".cookie-banner");
    await expect(banner).toBeVisible();
    await expect(gtagScripts(page)).toHaveCount(0);

    await banner.locator(".btn-primary").click();

    expect(await readConsent(page)).toBe("accepted");
    await expect(gtagScripts(page)).toHaveCount(1);

    // The page the visitor consented on must be recorded; the route hook has
    // already fired for it by now.
    await expect
      .poll(async () => (await readPageViews(page)).length)
      .toBeGreaterThan(0);
  });

  test("zamknięcie bannera przyciskiem X to odrzucenie, nie zgoda", async ({
    page,
  }) => {
    const attempted = await captureGoogleRequests(page);
    await serveProductionOrigin(page);
    await seedConsent(page, null);

    await page.goto("/");
    const banner = page.locator(".cookie-banner");
    await expect(banner).toBeVisible();

    // Both locales spell the close control's aria-label with "banner".
    await banner.locator('button[aria-label*="banner"]').click();

    expect(await readConsent(page)).toBe("rejected");
    await page.waitForTimeout(PAST_INJECTION_WINDOW_MS);
    await expect(gtagScripts(page)).toHaveCount(0);
    expect(attempted).toEqual([]);
  });

  test("dwie nawigacje dają dwie odsłony, druga z własnym tytułem", async ({
    page,
  }) => {
    await captureGoogleRequests(page);
    await serveProductionOrigin(page);
    await seedConsent(page, "accepted");

    await page.goto("/");
    await expect
      .poll(async () => (await readPageViews(page)).length)
      .toBe(1);
    const [firstView] = await readPageViews(page);

    // In-page navigation via a footer link: present on every viewport, unlike
    // the header nav, which collapses into a menu on mobile projects.
    await page.locator('a[href="/blog"]').first().click();
    await page.waitForURL("**/blog");

    await expect
      .poll(async () => (await readPageViews(page)).length)
      .toBe(2);
    const [, secondView] = await readPageViews(page);

    expect(secondView.page_path).toBe("/blog");
    expect(secondView.page_location).toContain("/blog");
    // The regression this guards: react-helmet-async writes the title
    // asynchronously, so an undeferred send would repeat the previous title.
    expect(secondView.page_title).not.toBe(firstView.page_title);
  });

  test("powtórne wywołanie initAnalytics nie dubluje skryptu", async ({
    page,
  }) => {
    await captureGoogleRequests(page);
    await serveProductionOrigin(page);
    await seedConsent(page, "accepted");

    await page.goto("/");
    await expect(gtagScripts(page)).toHaveCount(1);

    // Re-entering the same route re-runs the hook's effect, which calls
    // initAnalytics again — the production path for a repeat invocation.
    await page.locator('a[href="/blog"]').first().click();
    await page.waitForURL("**/blog");
    await page.goBack();
    await page.waitForTimeout(PAST_INJECTION_WINDOW_MS);

    await expect(gtagScripts(page)).toHaveCount(1);
  });

  test("wycofanie zgody kasuje wybór i przywraca banner", async ({ page }) => {
    await captureGoogleRequests(page);
    await serveProductionOrigin(page);
    await seedConsent(page, "accepted");

    await page.goto("/cookie-policy");

    const withdraw = page.locator(
      'button[aria-label*="Google Analytics"], button[aria-label*="analytics consent"]',
    );
    await expect(withdraw).toHaveCount(1);
    await withdraw.click();

    // The handler reloads, so the assertions below run against a fresh document.
    await expect(page.locator(".cookie-banner")).toBeVisible();
    expect(await readConsent(page)).toBeNull();
    await expect(gtagScripts(page)).toHaveCount(0);
  });
});

test.describe("Analytics — bramka hosta", () => {
  test("zgoda na localhost nie uruchamia analityki", async ({ page }) => {
    const attempted = await captureGoogleRequests(page);
    await seedConsent(page, "accepted");

    // Default baseURL: the dev server. Consent is granted, so the only thing
    // that can stop the loader here is the host gate.
    await page.goto("/");
    await page.waitForTimeout(PAST_INJECTION_WINDOW_MS);

    expect(await readConsent(page)).toBe("accepted");
    await expect(gtagScripts(page)).toHaveCount(0);
    expect(attempted).toEqual([]);
  });
});

test.describe("Analytics — niezmienniki konfiguracji", () => {
  test("PRODUCTION_HOST zgadza się z hostem z SITE_CONFIG.url", () => {
    // Guards the failure mode the host gate cannot signal itself: a domain
    // change would silently stop all reporting instead of breaking anything.
    expect(PRODUCTION_HOST).toBe(new URL(SITE_CONFIG.url).hostname);
  });

  test("CSP w vercel.json dopuszcza hosty Google w script-src i connect-src", () => {
    const config = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf-8"));
    const csp = config.headers
      .flatMap((entry) => entry.headers ?? [])
      .find((h) => h.key === "Content-Security-Policy-Report-Only")?.value;

    expect(csp, "Report-Only CSP must be declared in vercel.json").toBeDefined();

    const directive = (name) =>
      csp.match(new RegExp(`(?:^|;)\\s*${name}\\s+([^;]+)`))?.[1] ?? "";

    expect(directive("script-src")).toContain("https://www.googletagmanager.com");

    const connectSrc = directive("connect-src");
    expect(connectSrc).toContain("https://www.googletagmanager.com");
    expect(connectSrc).toContain("https://www.google-analytics.com");
    expect(connectSrc).toContain("https://*.google-analytics.com");
    expect(connectSrc).toContain("https://*.analytics.google.com");

    // Report-Only must stay Report-Only: an enforcing header would start
    // blocking on the very origins this change just allowlisted.
    expect(
      config.headers
        .flatMap((entry) => entry.headers ?? [])
        .some((h) => h.key === "Content-Security-Policy"),
    ).toBe(false);
  });
});

// Reads the built `dist/`, so it is skipped unless `npm run build:prerender`
// ran first. The marker is `dist/blog/index.html`: a plain `npm run build`
// leaves only `dist/index.html`, so the directory's existence alone would let
// this pass without a prerender having happened.
const PRERENDERED = existsSync(join(DIST, "blog", "index.html"));

test.describe("Analytics — prerender", () => {
  test.skip(
    !PRERENDERED,
    "dist/ bez prerenderu - uruchom `npm run build:prerender` przed tym testem",
  );

  test("żaden statyczny plik HTML nie odwołuje się do googletagmanager", () => {
    const htmlFiles = readdirSync(DIST, { recursive: true })
      .map(String)
      .filter((name) => name.endsWith(".html"));

    expect(htmlFiles.length).toBeGreaterThan(1);

    const offenders = htmlFiles.filter((name) =>
      readFileSync(join(DIST, name), "utf-8").includes("googletagmanager"),
    );

    expect(offenders).toEqual([]);
  });
});
