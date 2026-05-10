## Why

Google Search Console reports 0 indexed pages for `pawel.lipowczan.pl` and lists "Not found (404)" as one of two reasons URLs are excluded. The 404s are legacy paths from the previous WordPress version of the site (e.g. `/portfolio_categories/*`, `/portfolio-archive/*`, `/my-career-path/`, `/projects/`) and an EN blog post with a Polish slug (`/en/blog/vibe-coding-przewodnik`) that exists under a translated slug. Without 301 redirects, Google keeps wasting crawl budget on dead URLs and we lose any historical link equity those URLs accumulated.

## What Changes

- Add HTTP 301 redirects in `vercel.json` for legacy URL patterns from the previous WordPress site, mapping each to the closest equivalent on the current React/Vite site.
- Cover three classes of redirects:
  - **1:1 specific** — known legacy URLs with a direct counterpart (e.g. `/en/blog/vibe-coding-przewodnik` → `/en/blog/vibe-coding-guide`).
  - **Section anchors** — legacy listing/CV pages mapped to the corresponding home-page section (e.g. `/projects/` → `/#projects`, `/my-career-path/` → `/#about`).
  - **Wildcard catch-alls** — legacy WordPress patterns with no equivalent content, redirected to `/` (e.g. `/portfolio_categories/*`, `/portfolio-archive/*`, plus preventive coverage for `/category/*`, `/tag/*`, `/author/*`, `/wp-content/*`, `/wp-admin/*`, `/wp-login.php`, `/feed`, `/comments/feed/`).
- Verify each redirect resolves with `301` (not `302` / not `200`) and a correct `Location` header.

## Capabilities

### New Capabilities

- `legacy-redirects`: HTTP 301 redirect rules for legacy URLs from the previous WordPress version of the site, declared in `vercel.json`. Covers known 404 URLs from GSC and preventive WordPress URL patterns. Ensures dead legacy paths return 301 with the correct `Location` instead of 404.

### Modified Capabilities

(none)

## Impact

- **Code**: `vercel.json` (add `redirects` array — currently absent).
- **No app code changes**: redirects are handled by Vercel edge before reaching React; no changes to React Router, prerender script, or sitemap.
- **No content changes**: existing routes, slugs, and prerender output stay as-is.
- **Behavioral**: requests to legacy paths become `301` instead of `404`; this is a Googlebot-visible change but harmless for end users (they land on a valid page).
- **Out of scope**: GSC manual actions (request indexing, sitemap re-submission, external link signals, monitoring) — those are operational, not code, and tracked separately in the explore session that initiated this change.
