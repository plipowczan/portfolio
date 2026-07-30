/**
 * Google Analytics 4, gated on explicit cookie consent.
 *
 * Two conditions must both hold before a single request reaches Google: the
 * visitor accepted cookies, and the page is served from the production host.
 * Neither answer is cached, so consent granted mid-session takes effect without
 * a reload, and no build-time or preview environment can leak into the data.
 *
 * Nothing here touches `window` at module scope — the constants are imported by
 * tests running in plain Node.
 *
 * Requirements: openspec/specs/analytics-consent/spec.md
 */

/**
 * Measurement ID of the GA4 property.
 *
 * Public by construction: it ends up in the loader URL that every visitor's
 * browser fetches, so moving it to an environment variable would add a
 * deployment step and hide nothing.
 */
export const MEASUREMENT_ID = "G-7L4PXG8E8Z";

/**
 * The only hostname allowed to report.
 *
 * Matched exactly, never by suffix: a suffix test would let any future
 * subdomain report into the production property. This single constant is what
 * keeps the prerenderer out of the data — it drives a headless browser across
 * every route against a localhost preview server, which without this gate
 * would register one page view per route on every deploy. It also covers
 * `npm run dev` and Vercel preview deployments, which an environment variable
 * would not: Vercel exposes variables to Preview by default.
 */
export const PRODUCTION_HOST = "pawel.lipowczan.pl";

/** Written by CookieBanner; this module is its first reader. */
const CONSENT_STORAGE_KEY = "cookieConsent";
const CONSENT_GRANTED = "accepted";

/**
 * Guards against a second loader script. `initAnalytics` has two callers — the
 * route hook on mount, and the banner's accept handler — and either can run
 * first.
 */
let initialised = false;

/**
 * Reads the stored consent decision.
 *
 * Any stored value other than `"accepted"` counts as a refusal, mirroring
 * `CookieBanner`, which treats any stored value as an answer and stops asking.
 *
 * @returns {"accepted" | "rejected" | "none"}
 */
export const getConsentState = () => {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === CONSENT_GRANTED) return "accepted";
    return stored ? "rejected" : "none";
  } catch {
    // Private-mode Safari and hardened browser profiles throw on
    // localStorage access. An unreadable decision is not consent.
    return "none";
  }
};

/**
 * @returns {boolean} True only when the visitor explicitly accepted cookies.
 */
export const hasAnalyticsConsent = () => getConsentState() === CONSENT_GRANTED;

/**
 * @returns {boolean} True only on the production host.
 */
export const isProductionHost = () =>
  typeof window !== "undefined" &&
  window.location.hostname === PRODUCTION_HOST;

/**
 * Creates `window.dataLayer` and `window.gtag` if they are absent.
 *
 * Runs before the loader script is injected, on purpose: `gtag` only pushes its
 * arguments onto `dataLayer`, so configuration and page views issued while the
 * loader is still in flight are queued instead of lost.
 */
const bootstrapDataLayer = () => {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // Pushes the `arguments` object itself, not an array copy — gtag.js
      // reads `arguments` and ignores plain arrays.
      window.dataLayer.push(arguments);
    };
  }
};

const injectLoader = () => {
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);
};

/**
 * Defers injection off the critical rendering path, the same way `index.html`
 * loads clickrank.ai. Required by openspec/specs/performance-third-party-scripts.
 */
const injectWhenIdle = () => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(injectLoader, { timeout: 3000 });
  } else {
    window.setTimeout(injectLoader, 2000);
  }
};

/**
 * Starts analytics if — and only if — both gates pass. Safe to call repeatedly.
 *
 * Automatic page views are switched off here so that every view, including the
 * first of a session, travels through `sendPageView`. One code path means the
 * entry page cannot be counted twice and carries the same parameters as every
 * later one.
 *
 * @returns {boolean} True if this call started analytics.
 */
export const initAnalytics = () => {
  if (initialised) return false;
  if (!isProductionHost()) return false;
  if (!hasAnalyticsConsent()) return false;

  initialised = true;
  bootstrapDataLayer();
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
  injectWhenIdle();
  return true;
};

/**
 * Sends one page view. No-op unless analytics is running and consent still holds.
 *
 * Consent is re-read rather than assumed from initialisation, so withdrawing it
 * stops the data flow even in a session where gtag.js is already loaded.
 *
 * @param {{ path?: string, title?: string }} [view] Defaults to the current
 *   location and document title.
 */
export const sendPageView = ({ path, title } = {}) => {
  if (!initialised) return;
  if (!hasAnalyticsConsent()) return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_path: path ?? window.location.pathname,
    page_location: window.location.href,
    page_title: title ?? document.title,
  });
};

/**
 * Clears the stored consent, so analytics does not load on the next page load
 * and the banner asks again.
 *
 * Cannot reach `_ga` cookies Google already set — they belong to the analytics
 * provider and expire on their own. The cookie policy says so rather than
 * implying full erasure.
 */
export const withdrawAnalyticsConsent = () => {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Unreadable storage held no consent to withdraw.
  }
};
