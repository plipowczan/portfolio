import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, sendPageView } from "../utils/analytics";

/**
 * How long to wait before reading `document.title`.
 *
 * The delay used to be load-bearing for a second reason: react-helmet-async
 * wrote the title in an effect, after the route had already changed, so a page
 * view sent immediately carried the *previous* page's title and shifted every
 * report by one page. React 19 hoists `<title>` while committing the render,
 * so that race is gone.
 *
 * What remains is the reason the delay is kept: a route the visitor passed
 * through and left within this window never reports, because the pending send
 * is cancelled on cleanup. Shortening it would start counting those, and the
 * numbers would stop matching everything collected since July.
 */
const TITLE_SETTLE_MS = 300;

/**
 * Sends one GA4 page view per committed route change.
 *
 * Must be called under `BrowserRouter` (it is — see src/main.jsx). Called once,
 * from App, rather than from Layout: Layout does not wrap every route.
 *
 * Initialisation is re-attempted on every route change, which covers the
 * visitor who arrives with consent already stored. It is idempotent.
 *
 * React.StrictMode double-invokes effects, which would double the page views —
 * except the host gate in `initAnalytics` disables analytics on localhost, and
 * StrictMode only runs in development. That is a dependency, not a coincidence.
 */
const usePageTracking = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    initAnalytics();

    const timer = window.setTimeout(() => {
      // Read at send time, not when scheduling — otherwise the delay is pointless.
      sendPageView({ path: pathname, title: document.title });
    }, TITLE_SETTLE_MS);

    return () => window.clearTimeout(timer);
    // Depends on pathname alone: the full location object also changes identity
    // on a hash-only change, which is not a new page.
  }, [pathname]);
};

export default usePageTracking;
