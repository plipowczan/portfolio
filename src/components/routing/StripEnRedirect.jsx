import { Navigate, useLocation } from "react-router-dom";

/**
 * Redirects any `/en/llm-wiki/...` path to its PL counterpart, preserving the
 * deep path (plus query + hash). The LLM Wiki course is PL-only; this keeps a
 * single, reversible seam for a future EN course (remove/narrow this redirect).
 *
 * Reads the full location rather than a `*` splat so the same component works
 * for the exact/param routes (`/en/llm-wiki/kurs`, `/en/llm-wiki/kurs/:slug`)
 * and the catch-all splat (`/en/llm-wiki/*`) alike.
 */
const StripEnRedirect = () => {
  const { pathname, search, hash } = useLocation();
  // Strip a single leading /en segment (followed by "/" or end of path).
  const target = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return <Navigate to={`${target}${search}${hash}`} replace />;
};

export default StripEnRedirect;
