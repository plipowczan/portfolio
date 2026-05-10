## Context

The site was rebuilt from WordPress to React 19 + Vite 7 + Vercel ~6 months ago. The URL scheme changed completely: WordPress used taxonomy paths (`/portfolio_categories/<slug>/`), archive paths (`/portfolio-archive/<slug>/`), and standalone page slugs (`/my-career-path/`). The new site uses a flat React Router scheme: `/`, `/blog`, `/blog/:slug`, `/projects/:slug`, plus `/en/*` mirror.

Google Search Console (property added 2026-04-17) reports 0 indexed pages with two exclusion reasons: "Crawled – currently not indexed" and "Not found (404)". The 404 list pulled from GSC contains 6 URLs spanning four legacy patterns. There is no `redirects` array in the current `vercel.json` — every legacy URL returns a real `HTTP 404` from Vercel's filesystem 404 (verified live: catch-all `rewrites` rule does NOT mask filesystem 404s thanks to Vercel's filesystem-precedence rule).

Constraints:
- Must run at the edge (Vercel) before React Router — React Router cannot return real `HTTP 301`.
- Must not break existing prerendered routes (`/`, `/blog`, `/blog/<slug>`, etc.).
- Must coexist with the existing catch-all `rewrites` rule (`/(.*)` → `/index.html`).

## Goals / Non-Goals

**Goals:**
- Every legacy URL identified in GSC returns `HTTP 301` with a `Location` header pointing to a live page.
- Preventive coverage for unseen WordPress URL patterns (so future GSC discoveries don't bloat the 404 list).
- Zero changes to application code (only `vercel.json`).
- Fix is deployable in a single commit and verifiable with `curl -I`.

**Non-Goals:**
- Restoring legacy content (archives, portfolio categories) — content is gone, not coming back.
- Sitemap edits — legacy URLs are not in the sitemap and should not be added.
- Soft-404 hardening — verified non-issue (real 404 already returned for unknown paths).
- GSC operational steps (request indexing, external links, monitoring) — out of scope, tracked in the originating explore session.

## Decisions

### Decision 1: Use Vercel `redirects` (not `rewrites`, not framework-level redirects)

`vercel.json` `redirects` is the only mechanism that returns a real `HTTP 301`/`308` from the edge before any application code runs. Alternatives rejected:
- **`rewrites`**: keeps the URL bar unchanged and serves a different file with `200 OK`. Wrong for SEO — Google needs the redirect signal.
- **React Router `<Navigate>`**: runs client-side after a `200 OK` HTML response. Googlebot would see the legacy URL as a valid page with a JS redirect — at best soft-redirect, at worst soft-404.
- **`<meta http-equiv="refresh">`**: deprecated SEO signal, slow.

### Decision 2: Status code `301` (permanent), not `308` or `302`

Vercel's `redirects` defaults to `308` (permanent redirect, preserves method). For SEO we explicitly want `301`:
- `301` is the canonical "moved permanently" signal Google has consumed for 25 years and is the primary trigger for transferring link equity.
- `308` is semantically equivalent for browsers but historically Googlebot treats `301` as the strongest signal.
- All legacy URLs are `GET` only, so the method-preservation difference between `301` and `308` is moot.

Set explicitly via `"permanent": true` (= 308 by default in Vercel, but we override with `"statusCode": 301` per redirect).

### Decision 3: Three-tier redirect taxonomy

| Tier | Pattern type | Example | Destination strategy |
|------|--------------|---------|----------------------|
| **A. Specific 1:1** | Exact path with known counterpart | `/en/blog/vibe-coding-przewodnik` | Direct mapping to translated slug |
| **B. Section anchor** | Legacy listing/CV page | `/projects/`, `/my-career-path/` | Home + fragment (`/#projects`, `/#about`) |
| **C. Wildcard catch-all** | Legacy WP pattern with no equivalent | `/portfolio_categories/*`, `/wp-admin/*` | Home (`/`) |

Tier A redirects are evaluated before tier B before tier C — Vercel matches `redirects` array top-to-bottom, first match wins.

### Decision 4: Preventive WordPress patterns

Beyond the 6 URLs from the current GSC export, add wildcard redirects for common WP patterns Google may surface in coming weeks:

| Pattern | Why |
|---------|-----|
| `/portfolio_categories/(.*)` | seen in export |
| `/portfolio-archive/(.*)` | seen in export |
| `/category/(.*)` | WP default taxonomy |
| `/tag/(.*)` | WP default taxonomy |
| `/author/(.*)` | WP default author archive |
| `/wp-content/(.*)` | WP uploads / themes — also blocks bots probing for vulnerabilities |
| `/wp-admin/(.*)` | WP admin — same as above |
| `/wp-login.php` | WP admin entry — same as above |
| `/feed`, `/feed/`, `/comments/feed/` | WP RSS endpoints |

All redirect to `/`. The `wp-admin` / `wp-login` redirects double as a small security-hygiene nicety (returning `301` to `/` instead of `404` for bot probes is fine; we're not pretending to be WordPress).

### Decision 5: Trailing slash handling

Legacy URLs all have trailing slashes (WP convention). New site uses no trailing slashes (`cleanUrls: true` in `vercel.json`). Redirects must match the trailing-slash form. We do NOT add `cleanUrls`-style automatic trailing-slash stripping because the new site already serves canonical URLs without trailing slashes — the issue is only about matching legacy URLs as literally as Google saw them.

### Decision 6: Hash fragments in redirect destinations

Vercel `redirects` accepts hash fragments in `destination` (e.g. `/#projects`). The fragment is sent to the browser in the `Location` header; the browser preserves it across the redirect and scrolls on arrival. For Googlebot, only the path-without-fragment counts — Google sees the destination as `/`, which is fine since `/#projects` is just a UX nicety.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Wildcard redirect order matters: a too-broad earlier wildcard could swallow a specific URL | Order array tier A → tier B → tier C; verify with `curl -I` after deploy |
| `wp-content/(.*)` could match a legitimate path if we ever add `/wp-content` content (we won't) | Acceptable — pattern is extremely unlikely to collide with intentional content |
| Hash fragment in `Location` header is non-standard for some old clients | Modern browsers all preserve fragments; affects ~0% of Googlebot traffic |
| Adding 10+ redirects increases edge config size (no measurable perf impact) | Fine — Vercel handles thousands of redirects without issue |
| `301` vs `308` choice is debated; some SEOs prefer `308` | Pick `301` and stop debating; both transfer equity in practice |
| Legacy URL list from GSC is incomplete (more 404s may surface in 2-4 weeks) | Preventive WP wildcards (Decision 4) cover ~95% of likely patterns; remaining stragglers can be added in a follow-up change |

## Migration Plan

1. Add `redirects` array to `vercel.json` (no removal of existing keys).
2. Commit, push, Vercel auto-deploys preview.
3. On the preview URL, run a verification matrix (covered by `tasks.md`):
   ```
   curl -I <preview>/en/blog/vibe-coding-przewodnik          → 301 → /en/blog/vibe-coding-guide
   curl -I <preview>/projects/                               → 301 → /#projects
   curl -I <preview>/my-career-path/                         → 301 → /#about
   curl -I <preview>/portfolio_categories/foo                → 301 → /
   curl -I <preview>/portfolio-archive/anything/             → 301 → /
   curl -I <preview>/category/foo                            → 301 → /
   curl -I <preview>/tag/foo                                 → 301 → /
   curl -I <preview>/author/foo                              → 301 → /
   curl -I <preview>/wp-admin/                               → 301 → /
   curl -I <preview>/wp-login.php                            → 301 → /
   curl -I <preview>/feed/                                   → 301 → /
   curl -I <preview>/blog                                    → 200 (regression check — must NOT redirect)
   curl -I <preview>/                                        → 200 (regression check)
   curl -I <preview>/blog/vibe-coding-przewodnik             → 200 (PL post, must not be caught)
   curl -I <preview>/random-nonexistent-url                  → 404 (must NOT redirect — preserves legitimate 404)
   ```
4. Promote to production.
5. **Rollback**: revert the commit; redirects disappear, status quo restored. No data migration, no schema change, no risk.

## Open Questions

None. All routing decisions and target URLs were confirmed during the originating explore session.
