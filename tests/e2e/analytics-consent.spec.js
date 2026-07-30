import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { MEASUREMENT_ID, PRODUCTION_HOST } from "../../src/utils/analytics.js";
import { SITE_CONFIG } from "../../src/utils/constants.js";
import { PREVIEW_URL } from "../../scripts/ports.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const PRODUCTION_ORIGIN = `https://${PRODUCTION_HOST}`;
/**
 * The production build that playwright.config.js starts under `PW_PREVIEW=1`.
 * The port is derived per worktree — see scripts/ports.mjs — so it must be
 * imported, never written out.
 */
const PREVIEW_ORIGIN = PREVIEW_URL;

/**
 * Longer than the loader's `requestIdleCallback` timeout (3 s) and its
 * `setTimeout` fallback (2 s). Every assertion that something was *not*
 * injected has to outlast the deferral, or it passes before the code it is
 * meant to catch has had a chance to run.
 */
const PAST_INJECTION_WINDOW_MS = 3500;

/** In-page navigation target: a footer link, so it exists on every viewport. */
const SECOND_ROUTE_LINK = "Polityka cookies";

const isGoogleAnalyticsHost = (url) =>
  url.hostname === "www.googletagmanager.com" ||
  url.hostname.endsWith("google-analytics.com") ||
  url.hostname.endsWith("analytics.google.com");

/**
 * Serves the production origin from the local preview build.
 *
 * The host gate compares `window.location.hostname` against a constant, and page
 * script cannot fake that — `location` is unforgeable. Routing the real hostname
 * to the local build is therefore the only way to exercise the consent gate at
 * all: on localhost the host gate short-circuits first, so every "no script
 * without consent" assertion would pass without proving anything.
 */
const serveProductionOrigin = async (page) => {
  const previewHost = new URL(PREVIEW_ORIGIN).host;

  await page.route(
    (url) => url.hostname === PRODUCTION_HOST,
    async (route) => {
      const { pathname, search } = new URL(route.request().url());
      try {
        // The Host header has to be rewritten explicitly. Chromium and WebKit
        // derive it from the rewritten URL, but Firefox forwards the original,
        // and `vite preview` rejects an unknown Host with "Blocked request".
        const response = await route.fetch({
          url: `${PREVIEW_ORIGIN}${pathname}${search}`,
          headers: { ...route.request().headers(), host: previewHost },
        });
        await route.fulfill({ response });
      } catch {
        // The page can close while a proxied request is still in flight. That
        // is teardown, not a failure, so the rejection is swallowed here.
        await route.abort().catch(() => {});
      }
    },
  );
};

/**
 * Releases route handlers that may still be mid-flight.
 *
 * Without this, Playwright surfaces a cancelled proxy request as a test
 * failure even when every assertion passed — visible only under load, which is
 * why an isolated run of this spec looks clean and a full run does not.
 */
const releaseRoutes = async (page) => {
  await page.unrouteAll({ behavior: "ignoreErrors" });
};

/**
 * Intercepts Google's origins so the suite never touches the network, and
 * returns the list of attempted URLs.
 *
 * The loader is fulfilled with an empty body on purpose: the real gtag.js would
 * drain `window.dataLayer`, and leaving the queue intact is what makes the sent
 * page views readable from the test.
 */
const captureGoogleRequests = async (page) => {
  const attempted = [];
  await page.route(isGoogleAnalyticsHost, async (route) => {
    attempted.push(route.request().url());
    await route
      .fulfill({
        status: 200,
        contentType: "application/javascript",
        body: "",
      })
      .catch(() => {});
  });
  return attempted;
};

/** Runs before app script on every document in this page, including reloads. */
const seedConsent = (page, value) =>
  page.addInitScript((consent) => {
    window.localStorage.setItem("cookieConsent", consent);
  }, value);

/**
 * The loader is a `<script>`, not a user-facing element, so there is no role to
 * locate it by. Everything the visitor can see is addressed by role and name.
 */
const gtagScripts = (page) =>
  page.locator('script[src*="googletagmanager.com"]');

const cookieBanner = (page) =>
  page.getByRole("heading", { name: "Używamy plików cookie" });

const acceptButton = (page) =>
  page.getByRole("button", { name: "Zaakceptuj cookies" });

const closeBannerButton = (page) =>
  page.getByRole("button", { name: "Zamknij banner cookies" });

const withdrawButton = (page) =>
  page.getByRole("button", { name: /Wycofaj zgodę/ });

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

const countGaCookies = async (page) =>
  (await page.context().cookies()).filter((c) => c.name.startsWith("_ga"))
    .length;

test.describe("Analytics — bramka zgody na hoście produkcyjnym", () => {
  test.use({ baseURL: PRODUCTION_ORIGIN });

  // Ten blok proxuje host produkcyjny na serwer preview, a ten startuje tylko
  // pod `PW_PREVIEW=1` (patrz playwright.config.js). Bez niego każde `goto`
  // kończy się `net::ERR_FAILED`, więc blok pomija się z nazwą zmiennej
  // zamiast wywracać przebieg na odmowie połączenia.
  test.skip(
    !process.env.PW_PREVIEW,
    "Serwer preview nie działa — uruchom z PW_PREVIEW=1, żeby wykonać ten blok."
  );

  test.afterEach(async ({ page }) => {
    await releaseRoutes(page);
  });

  test("brak decyzji: gtag się nie wstrzykuje i nie leci żądanie do Google", async ({
    page,
  }) => {
    const attempted = await captureGoogleRequests(page);
    await serveProductionOrigin(page);

    await page.goto("/");
    await page.waitForTimeout(PAST_INJECTION_WINDOW_MS);

    expect(await readConsent(page)).toBeNull();
    await expect(gtagScripts(page)).toHaveCount(0);
    expect(attempted).toEqual([]);

    // `_ga` follows from the assertion above rather than standing on its own:
    // the cookie is set by a script this test proves never loads.
    expect(await countGaCookies(page)).toBe(0);
  });

  test("zgoda odrzucona: gtag się nie wstrzykuje", async ({ page }) => {
    const attempted = await captureGoogleRequests(page);
    await serveProductionOrigin(page);
    await seedConsent(page, "rejected");

    await page.goto("/");
    await page.waitForTimeout(PAST_INJECTION_WINDOW_MS);

    await expect(gtagScripts(page)).toHaveCount(0);
    expect(attempted).toEqual([]);
    expect(await countGaCookies(page)).toBe(0);
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

  test("kliknięcie akceptacji uruchamia analitykę bez przeładowania", async ({
    page,
  }) => {
    await captureGoogleRequests(page);
    await serveProductionOrigin(page);

    await page.goto("/");
    await expect(cookieBanner(page)).toBeVisible();
    await expect(gtagScripts(page)).toHaveCount(0);

    await acceptButton(page).click();

    expect(await readConsent(page)).toBe("accepted");
    await expect(gtagScripts(page)).toHaveCount(1);

    // The page the visitor consented on must be recorded: the route hook has
    // already fired for it, so without an explicit send it would go missing.
    await expect
      .poll(async () => (await readPageViews(page)).length)
      .toBeGreaterThan(0);
  });

  test("zamknięcie bannera to odrzucenie, nie zgoda", async ({ page }) => {
    const attempted = await captureGoogleRequests(page);
    await serveProductionOrigin(page);

    await page.goto("/");
    await expect(cookieBanner(page)).toBeVisible();

    await closeBannerButton(page).click();

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
    await expect.poll(async () => (await readPageViews(page)).length).toBe(1);
    const [firstView] = await readPageViews(page);

    await page.getByRole("link", { name: SECOND_ROUTE_LINK }).click();
    await page.waitForURL("**/cookie-policy");

    await expect.poll(async () => (await readPageViews(page)).length).toBe(2);
    const [, secondView] = await readPageViews(page);

    expect(secondView.page_path).toBe("/cookie-policy");
    expect(secondView.page_location).toContain("/cookie-policy");
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

    // Each route change re-runs the hook's effect, which calls initAnalytics
    // again — the production path for a repeat invocation.
    await page.getByRole("link", { name: SECOND_ROUTE_LINK }).click();
    await page.waitForURL("**/cookie-policy");
    await page.goBack();
    await page.waitForTimeout(PAST_INJECTION_WINDOW_MS);

    await expect(gtagScripts(page)).toHaveCount(1);
  });

  test("wycofanie zgody kasuje wybór i przywraca banner", async ({ page }) => {
    await captureGoogleRequests(page);
    await serveProductionOrigin(page);

    // Consent is written through the page rather than via addInitScript: an init
    // script re-runs on every document, so it would re-grant consent during the
    // reload that the withdrawal button triggers.
    await page.goto("/cookie-policy");
    await page.evaluate(() =>
      window.localStorage.setItem("cookieConsent", "accepted"),
    );
    await page.reload();

    await expect(gtagScripts(page)).toHaveCount(1);
    await withdrawButton(page).click();

    // The handler reloads, so what follows is asserted on a fresh document.
    await expect(cookieBanner(page)).toBeVisible();
    expect(await readConsent(page)).toBeNull();
    await expect(gtagScripts(page)).toHaveCount(0);
  });

  test("przycisk wycofania nie pojawia się bez decyzji", async ({ page }) => {
    await captureGoogleRequests(page);
    await serveProductionOrigin(page);

    await page.goto("/cookie-policy");
    await expect(page.getByText("Twój obecny wybór: brak decyzji")).toBeVisible();
    await expect(withdrawButton(page)).toHaveCount(0);
  });
});

test.describe("Analytics — bramka hosta", () => {
  test.afterEach(async ({ page }) => {
    await releaseRoutes(page);
  });

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
    // Guards the one failure mode the host gate cannot signal itself: a domain
    // change would silently stop all reporting instead of breaking anything.
    expect(PRODUCTION_HOST).toBe(new URL(SITE_CONFIG.url).hostname);
  });

  test("CSP w vercel.json dopuszcza hosty Google w script-src i connect-src", () => {
    const config = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf-8"));
    const allHeaders = config.headers.flatMap((entry) => entry.headers ?? []);
    const csp = allHeaders.find(
      (h) => h.key === "Content-Security-Policy-Report-Only",
    )?.value;

    expect(csp, "Report-Only CSP must be declared in vercel.json").toBeDefined();

    const directive = (name) =>
      csp.match(new RegExp(`(?:^|;)\\s*${name}\\s+([^;]+)`))?.[1] ?? "";

    expect(directive("script-src")).toContain(
      "https://www.googletagmanager.com",
    );

    const connectSrc = directive("connect-src");
    expect(connectSrc).toContain("https://www.googletagmanager.com");
    expect(connectSrc).toContain("https://www.google-analytics.com");
    expect(connectSrc).toContain("https://*.google-analytics.com");
    expect(connectSrc).toContain("https://*.analytics.google.com");

    // Report-Only must stay Report-Only: an enforcing header would start
    // blocking on the very origins this change just allowlisted.
    expect(
      allHeaders.some((h) => h.key === "Content-Security-Policy"),
    ).toBe(false);
  });
});

// Asercja o wyjściu prerenderu — „żaden statyczny HTML nie odwołuje się do
// googletagmanager" — mieszka w `scripts/verify-prerender-output.mjs`, które
// `npm run build:prerender` wywołuje jako ostatni krok. Tutaj pomijałaby się
// przy każdym przebiegu bez wcześniejszego builda; tam jest bramką na każdym
// wdrożeniu Vercela, bo to jego `buildCommand`.
