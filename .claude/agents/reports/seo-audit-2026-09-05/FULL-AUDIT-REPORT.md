# Full SEO Audit — pawel.lipowczan.pl

Run 2026-09-05 against live production, cross-referenced with the source at
`C:\Projects\portfolio` (local `main` level with `origin/main`, last commit
2026-07-30).

**Business type:** independent consultant / agency portfolio with a heavy
publisher component. `/projects/*` case studies, 30 PL + 30 EN blog posts, a
course funnel at `/llm-wiki`. No local-business, SaaS, or e-commerce signals.

## SEO Health Score: 63 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Content Quality | 23% | 62 | 14.26 |
| Technical SEO | 22% | 88 | 19.36 |
| On-Page SEO | 20% | 54 | 10.80 |
| Schema / Structured Data | 10% | 46 | 4.60 |
| Performance (CWV) | 10% | 45 | 4.50 |
| AI Search Readiness | 10% | 68 | 6.80 |
| Images | 5% | 58 | 2.90 |
| **Total** | | | **63.2** |

Performance is scored on mobile, which is what mobile-first indexing measures.
Desktop scores 92–96 and would be misleading here.

## Read this before the score: the site is not indexed

Added after Google credentials were configured, later the same day. Full detail:
`gsc-indexation.md`.

Search Console reports **98 URLs submitted, 0 indexed**. Over the last 90 days
the entire site drew **1 click and 57 impressions**, all of them on the homepage,
against two branded queries (`lipowczan`, `plsoft`). Not one of the 60 blog
posts, 9 case studies, or course pages recorded a single impression.

URL Inspection shows two distinct problems: `/`, `/blog` and the project pages
are "Crawled – currently not indexed" — Google fetched them and declined to index
— while the individual blog posts, `/llm-wiki` and the course pages are "URL is
unknown to Google", never fetched at all. `/projects/frontdesk-ai` was last
crawled 2026-01-11.

This reframes everything below. The category scores measure how well the site is
built for search; they do not measure whether it participates in search, and it
currently does not. Titles, schema, internal linking and speed all matter — after
indexation, not before it.

Nothing technical is blocking this. robots.txt allows everything, there is no
`noindex` anywhere, canonicals are correct and the sitemap is error-free — all
verified independently in `technical.md`. "Crawled – currently not indexed" is a
value judgement by Google, and the most likely driver is the domain's near-total
absence of inbound links (see `backlinks.md`), compounded by thin pages.

The first action is therefore diagnostic, not corrective: manually request
indexing for a handful of URLs and see whether they stay in the index. That
answers whether this is a discovery problem or a quality problem, and the answer
changes the plan. See `ACTION-PLAN.md`.

## What is genuinely good

This is a well-built site, and the audit should say so plainly before the
findings. Technical SEO scores 88 because the fundamentals are right:

- hreflang is fully reciprocal across 8 PL/EN pairs checked — self-referencing,
  single x-default, absolute URLs, correct codes. Zero mismatches. That is rare.
- Real HTTP 404s for missing URLs, not 200 SPA shells.
- No cloaking: Googlebot and default UA get byte-identical responses.
- Canonicals self-reference correctly on every template; no PL/EN cross-canonical.
- Full security header set — HSTS with preload, X-Frame-Options DENY, nosniff,
  Referrer-Policy, Permissions-Policy.
- 30 PL posts each have a genuine EN counterpart, always equal or longer
  (1.04x–1.20x). No stub translations anywhere.
- Sitemap coverage reconciles exactly against source: zero orphans, zero omissions.
- `llms.txt` and `llms-full.txt` are spec-conformant, current, and generated from
  the same pipeline as the sitemap.
- CLS is ~0 on every page measured, mobile and desktop.

The failures below are concentrated in the build pipeline and in content
structure, not in SEO fundamentals.

## Critical

### 1. The prerendered HTML ships invisible

Full detail: `prerender-invisible-html.md`

The homepage serves 74 elements at inline `opacity: 0` and one at `opacity: 1`.
`/en/` serves 75 invisible and zero visible. The `<h1>` — Lighthouse's mobile LCP
element — is served as `style="opacity: 0; transform: translateY(13.8694px)"`.

Two causes, both in `scripts/prerender.mjs`:

- The snapshot is taken mid-animation. `Hero.jsx` staggers to ~1.6s; the script
  waits `IS_VERCEL ? 1000 : 2000` ms (line 199). On Vercel that lands inside the
  animation — the fractional `13.8694px` is a frame, not a state. It also means
  local builds look better than deployed ones.
- Six homepage sections animate via `whileInView`. The prerenderer never scrolls,
  so they never trigger and are captured at `initial` permanently.

Consequence: 30ms TTFB and prerendered markup that paints nothing. Mobile FCP
5.6s, LCP 6.5–6.9s across all four pages measured. The site pays for prerendering
and discards the user-facing benefit. With JS slow or blocked, the homepage is
blank rather than degraded.

### 2. Case studies are 156–234 words

All nine `/projects/*` pages sit far below even a 400-word product-page floor.
These should be the strongest first-hand Experience signal on a consultancy site
and are currently its weakest layer. The SXO analysis found the same pages failing
the "automatyzacja procesów AI" SERP, which resolves partly with service pages.

### 3. No author or about page exists

No `/o-mnie`, no `/about` — confirmed absent from `src/pages`. The `Person` schema
has no `@id` and no human-readable page behind it. For a solo consultancy this is
the weakest E-E-A-T axis and, per the GEO analysis, the single highest-leverage
change for AI citation: every other fix improves one post, this one gives every
page a resolvable entity to attribute claims to.

### 4. Conversion paths are dead ends

`</article>` closes straight into the sitewide footer on every post — no author
bio, no related posts, no contextual CTA. Zero internal links in either direction
between blog posts and case studies. 13 of 30 PL posts have no in-body links at
all. Both funnels the blog is meant to feed are unconnected to it.

On `/llm-wiki`, the "Zapisz mnie" signup sits 2048px down on mobile and 1601px
down on desktop. On `/`, the 261px cookie banner sits directly on top of the
"Skontaktuj się" CTA.

## High

### 5. Sitemap lastmod is fabricated for ~35% of URLs

Full detail: `sitemap.md`

34 of 38 non-blog URLs share the identical date `2026-07-30`, including all 18
project pages — whose backing file `src/data/projects.js` last changed
2025-12-01, an eight-month gap. `getGitLastModDate()` in
`scripts/update-sitemap.js` falls back to `new Date()` on any error, and the
Vercel checkout likely cannot see enough history. Google discounts an entire
sitemap's lastmod when it proves unreliable.

Separately, `/`, `/blog`, `/en`, `/en/blog` borrow lastmod from the newest blog
post (2026-07-13) rather than their own history.

### 6. JSON-LD leaks across routes

Full detail: `prerender-jsonld-leak.md`

`/privacy-policy` serves the homepage's byte-identical `Person` schema despite
containing no schema code; `/en/` serves it twice. `StructuredData.jsx` appends to
`document.head` imperatively instead of via Helmet, so it is not route-scoped.

The prerender guard added after the 2026-07-29 head-leak incident (the one its own
comment at `prerender.mjs:152` documents) validates canonical, description and
og:title — all Helmet-managed. It cannot see JSON-LD. Same class of bug, surviving
in the one part of `<head>` the guard does not inspect.

### 7. Entity graph has no @id anywhere

No `@id` on `Person` or `Organization`. Two unlinked `Organization` shapes exist
(Home's `worksFor` vs `BlogPosting.publisher`), and `BlogPosting.author` never
references the homepage `Person`. For a personal-brand site this is the
highest-value schema work and is currently at zero. EN blog posts also build
`BreadcrumbList` and `mainEntityOfPage.@id` without the `/en` prefix.

`ProjectPage.jsx` uses `SoftwareApplication` plus a fabricated `Offer{price:"0"}`
for case studies that are not installable software.

### 8. Comparison posts have no comparison tables

`airtable-vs-excel-migracja` has zero `<table>` elements. The SERP for these
queries is table-shaped. `zapier-vs-make-vs-n8n-wybor-narzedzia` is a 3,284-word
narrative essay with a prose decision guide — it does have a pricing table, and is
the model the others should follow.

### 9. Cluster D is entirely unlinked

Nine business-automation/no-code posts have zero internal links in or out — the
largest structural defect in the link graph, and the cheapest to fix since no new
content is needed. 12 of 30 PL posts have zero incoming links; 7 of those 12 are
this cluster.

Cluster A (8 Claude Code posts) has no pillar page at all.

### 10. Bundle and image weight

Main bundle 753,772 bytes with ~197 KB unused on the homepage run.
`hacknation-team.webp` is 6528x4896 at 2,036 KB;
`karpathy-paradigm-software-3-0.webp` is 6360x7360 at 800 KB. No `srcSet` or
`<picture>` anywhere on the site, so phones download full-resolution files. The
hackathon article alone carries ~2.9 MB.

### 11. 29 of 30 titles exceed 60 characters

Worst: `kazda-firma-dziala-nieoptymalnie` at 112 chars,
`spec-driven-seo-portfolio-qamera-ai` at 107. The `" | Pawel Lipowczan"` suffix
pushes nearly every post over.

## Medium

- CSP is `Content-Security-Policy-Report-Only` on every response — no enforcing
  header. XSS mitigation is advisory only.
- Trailing-slash duplicates return 200 rather than redirecting (`/blog/` is
  byte-identical to `/blog`). Canonicals point to the clean form, so indexing risk
  is low; it is wasted crawl budget.
- Mobile code blocks in articles truncate mid-word with no scroll affordance.
- `dateModified` equals `datePublished` on every post — no update tracking.
- `inLanguage` never emitted anywhere.
- Meta descriptions inconsistent: 60–70 chars on three posts, 177–226 on three
  others.
- Author name inconsistent: "Pawel Lipowczan" vs "Paweł Lipowczan" in
  `kazda-firma-dziala-nieoptymalnie.md`.
- No business-identity markers (NIP, address) anywhere — weak Trustworthiness for
  a paid-service site.
- `llms.txt` never links `llms-full.txt`.
- 12 filename-style alt attributes (`![hero]`, `![speed_insights]`,
  `![playwright_report]`, `![cursor_usage]`, `![web_analytics]`,
  `![og-zapier-vs-make-vs-n8n-wybor-narzedzia]`).
- Two blog posts below the 1,500-word gate in both languages:
  `automatyzacja-email-frontdesk-ai` (689w) and `no-code-lead-generation` (841w).

## Low

- No `preconnect` to clickrank.ai (~473ms estimated LCP-path saving). Its own CPU
  cost is negligible at 2–4ms.
- Missing intrinsic `width`/`height` on four `<img>` sites; contained by
  fixed-height containers, so a robustness fix rather than an active CLS bug.
- `public/images/linkedin-cover.jpeg` — 791 KB, referenced nowhere.
- Tap targets under 44px: cookie-banner close (32px), "Dowiedz się więcej" (17px
  tall), language switcher (34px).
- `www.pawel.lipowczan.pl` has no DNS record — a future www link fails hard rather
  than redirecting.
- `changefreq`/`priority` on every sitemap URL; Google ignores both.

## Not measurable this run

- **No field performance data — now confirmed, not merely unavailable.**
  Credentials were configured later the same day. CrUX returns 404 for both the
  origin and the homepage: the site sits below Google's reporting threshold, so
  no field data exists to compare against until traffic grows. Every performance
  number here is lab data from local Lighthouse 13.4.1 under Slow 4G + 4x CPU
  throttling, single run each. GSC and GA4 are now connected and produced the
  indexation findings in `gsc-indexation.md`; PageSpeed and CrUX add nothing
  beyond the local runs.
- **No backlink profile.** Tier 0 only (Common Crawl + verify). No Moz, Bing or
  DataForSEO, so no DA/PA, no spam score, no referring-domain index. The domain is
  absent from the current Common Crawl release, which means "not sampled", not
  "low authority". No toxic-link screening was possible.
- GA4/GTM, Sentry, Vercel Analytics and Zencal did not appear as attributed
  main-thread cost, most likely because GA4 is consent-gated and never fired in a
  headless load. Their real-world cost is unmeasured.
- Roughly 36 of 44 PL/EN pairs were not individually spot-checked (all templates
  were covered; the 8 sampled pairs were 100% clean).
- SERP captures for the "automatyzacja procesów AI" and Obsidian clusters rest on
  known patterns rather than a fresh capture.

## Source reports

`technical.md` · `content.md` · `schema.md` · `sitemap.md` · `performance.md`
(plus `lh/` raw Lighthouse JSON) · `visual.md` (plus 25 screenshots) · `geo.md` ·
`sxo.md` · `cluster.md` · `backlinks.md` · `images.md` ·
`prerender-invisible-html.md` · `prerender-jsonld-leak.md`
