# Technical SEO Audit — pawel.lipowczan.pl (2026-09-05)

## Score: 88/100
Solid prerendered SPA implementation: reciprocal hreflang, real per-template
prerendered content, no cloaking, real 404s, clean canonicals. Deductions for
missing enforcing CSP (report-only only), minor duplicate-URL surface left to
canonical-only mitigation (no redirect), and a few image/CLS items owned by
the performance audit.

## Findings

### Critical
None found.

### High
- **CSP is report-only, not enforcing.** `Content-Security-Policy-Report-Only`
  header present on every response checked (home, /blog, 404); no enforcing
  `Content-Security-Policy` header. XSS/injection mitigation is currently
  advisory only. Fix: promote the report-only policy to an enforcing
  `Content-Security-Policy` header in `vercel.json` once report volume is
  clean.

### Medium
- **Trailing-slash and apex duplicate URLs are not redirected, only
  canonicalized.** `/blog/` returns HTTP 200 with identical bytes to `/blog`
  (`Content-Length: 192076` both), and `/projects/frontdesk-ai/` returns 200
  identical to `/projects/frontdesk-ai`. Each carries a correct self-referencing
  canonical to the non-slash form, so indexing risk is low, but crawl budget is
  spent on true duplicates and the pattern is inconsistent with `/en` (no
  slash) → canonicalizes to `/en/` (with slash) — i.e. the canonical trailing-
  slash convention differs between home-level and sub-level routes. Fix: add a
  Vercel redirect rule for trailing slash on non-root paths so the duplicate
  URL never resolves 200, rather than relying solely on canonical tags.
- **www subdomain has no DNS record at all** (`Could not resolve host:
  www.pawel.lipowczan.pl`). Not a duplicate-content risk since it can't be
  crawled, but if a visitor/backlink ever uses `www.`, they get a hard
  connection failure instead of a redirect. Fix: either add a CNAME + 308
  redirect to apex, or explicitly accept this as a non-issue (no `www.` links
  exist in the wild) — low effort either way, flagging for a decision.

### Low
- **llm-wiki / llm-wiki/kurs have no hreflang annotations** (PL-only feature,
  confirmed no `/en/llm-wiki*` in sitemap; `/en/llm-wiki` correctly 301s to
  `/llm-wiki`). Not a bug — no English version exists — but worth confirming
  this is the intended scope per the `llm-wiki-discoverable` capability rather
  than an oversight.
- **PL slugs survive under `/en/`** for `automatyzacje-dokumentow` and
  `integracja-systemow-phu-impex` (e.g.
  `https://pawel.lipowczan.pl/en/projects/automatyzacje-dokumentow`). Assessed
  as cosmetic, not a defect: canonical is self-referencing to the `/en/...`
  URL, hreflang reciprocity is correct and points back to the PL slug, and no
  duplicate-content or indexing risk exists. Recommend a URL-slug pass only if
  doing broader IA cleanup — not urgent.

## Verified Clean

- **Prerender integrity**: every sampled template (home, /en/, /blog, /en/blog,
  PL blog post, EN blog post, /llm-wiki, /llm-wiki/kurs, a lesson page, PL and
  EN project pages, PL and EN privacy policy) returns full prerendered HTML in
  the 22 KB–192 KB range — no empty SPA shells.
- **No cloaking**: Googlebot UA vs default UA returned byte-identical content
  on 4 sampled URLs (home, PL blog post, lesson page, EN project page) —
  identical file sizes in both fetches.
- **hreflang reciprocity**: 8 PL/EN pairs checked (home, blog index, a blog
  post, cookie-policy, terms-of-service, privacy-policy, and both flagged
  PL-slug projects). All are fully reciprocal, self-referencing, exactly one
  `x-default`, absolute URLs, correct `pl`/`en` codes. No missing or
  mismatched return tags found in the sample.
- **Canonicals**: present, absolute, one per page, self-referencing on every
  page sampled (including trailing-slash variants, which canonicalize to the
  clean form). No PL→EN or EN→PL cross-canonicalization found.
- **Indexability**: no `noindex`/`nofollow` meta robots and no `X-Robots-Tag`
  header on any page checked (home, blog, llm-wiki, lesson, project, privacy
  policy).
- **404 handling**: genuinely missing URLs return a real HTTP 404 with a
  79-byte plain-text body (`X-Vercel-Error: NOT_FOUND`), not a 200 SPA error
  screen — checked across PL blog, EN blog, EN project, and lesson namespaces.
- **Redirects**: http→https is a single 308 hop straight to the canonical
  https URL. No multi-hop chains observed anywhere in the sample.
- **Mobile**: `<meta name="viewport" content="width=device-width,
  initial-scale=1.0">` present on every page, no `user-scalable=no` zoom lock.
- **Structured data**: JSON-LD present and type-appropriate per template
  (Organization/Person site-wide; BlogPosting+FAQPage+BreadcrumbList on posts;
  SoftwareApplication+Offer on project pages; FAQPage on course lessons).
- **Sitemap↔reality**: sitemap carries 98 URLs with per-URL `xhtml:link`
  hreflang alternates (284 total) and a `<lastmod>` on every entry; all
  sampled URLs from every page type (home, blog, projects, policy, llm-wiki,
  lesson) return 200. No obvious template missing from the sitemap.
- **Previously established** (not re-verified this pass): clean robots.txt,
  HSTS/X-Content-Type-Options/X-Frame-Options/Referrer-Policy/Permissions-
  Policy all present.

## Not Verified / Out of Scope This Pass
- Real-world Core Web Vitals (LCP/INP/CLS) and image `width`/`height`
  completeness — owned by the performance agent in this run.
- Heading structure (`h1`/`h2` hierarchy) — owned by the content agent in this
  run.
- IndexNow protocol adoption (Bing/Yandex/Naver ping-on-publish) — not checked
  this pass; recommend a follow-up grep of `scripts/` for an IndexNow call and
  a manual submission test if absent.
- Full hreflang matrix (only 8 of ~44 PL/EN pairs spot-checked, though all
  templates were represented and 100% passed).
- Lighthouse/PSI-based rendering timing (browser-based, not source-inspectable
  via curl).
