## Why

Three build scripts emit output that does not match what the source says, and all
three reached production unnoticed because nothing asserts the claim they break.

An SEO audit on 2026-09-05 measured the live site. Its detailed reports are a
local working artifact and are not in the repository — `.gitignore` excludes
`reports/` — so every figure this proposal relies on is stated inline below and
re-derivable by fetching the URLs named. Production serves:

| URL | `opacity: 0` | `opacity: 1` |
|---|---|---|
| `/` | 74 | 1 |
| `/en/` | 75 | 0 |
| `/blog` | 27 | 7 |

PR #29 (`perf/speed-up-first-load`) fixes the above-the-fold half of this while
this proposal is being written. By passing `initial={false}` to Framer Motion on
direct navigation across five components, it removes the race rather than tuning
around it. Its local build measures `/` at 67/8 with the hero `<h1>` at
`opacity: 1; transform: none`, and `/blog` at 0/34.

What survives that fix is the below-the-fold half, and it is not a timing
problem. Six sections animate with `whileInView` — `#about`, `#projects`,
`#skills`, `#testimonials`, `#contact` — and `scripts/prerender.mjs` never
scrolls the page. They therefore never enter the viewport, never animate, and are
captured at their `initial` state permanently. That is the bulk of the 67
remaining invisible elements on `/`, and no wait duration reaches them.

Two unrelated defects sit alongside it:

- `/privacy-policy` serves the homepage's byte-identical `Person` JSON-LD despite
  `PrivacyPolicy.jsx` containing no schema code, and `/en/` serves that block
  twice. `StructuredData.jsx` appends to `document.head` imperatively rather than
  through `react-helmet-async`, so it is not route-scoped.
- 34 of 38 non-blog sitemap URLs carry the identical `lastmod` `2026-07-30`,
  including all 18 project URLs backed by `src/data/projects.js`, whose last
  commit is `2025-12-01`. This already violates a written requirement:
  `sitemap-lastmod` states legal-page `lastmod` SHALL equal the git committer
  date of the corresponding source file.

All three share a failure mode this repository has already survived once.
`prerender.mjs:152` carries a guard added after the 2026-07-29 deploy shipped
`/privacy-policy`, `/terms-of-service` and `/llm-wiki` with the homepage's
`<head>`; its own comment records that asserting tag *presence* let it through.
That guard checks canonical, description and og:title — all Helmet-managed. It
cannot see JSON-LD, which lives outside Helmet, and it cannot see whether
captured content is visible.

Why now: the audit also found Search Console reporting 98 URLs submitted and 0
indexed. This change does not claim to fix that and should not be read as
claiming it. But shipping half-invisible HTML, structured data attributed to the
wrong page, and dates Google is documented to distrust are worth not doing while
that is diagnosed.

## What Changes

- The prerenderer captures below-the-fold content in its settled state. Sections
  gated on `whileInView` must enter the viewport during capture, so the static
  file contains them. This does not change the scroll animation itself — real
  visitors still get it on hydration — it changes only what the crawler and a
  no-JavaScript visitor receive.
- JSON-LD becomes route-scoped, emitted through the same Helmet path as every
  other head tag rather than by imperative `document.head` mutation. A page
  serves the structured data its route declares, and nothing else.
- `lastmod` resolution stops silently substituting the current date.
  `getGitLastModDate()` swallows every error and returns `new Date()`, which is
  what turns an unavailable git history into a plausible-looking lie. Failure
  becomes loud.
- Three build assertions are added so each defect fails the build instead of
  reaching production: prerendered output must not ship primary content hidden,
  must not contain duplicate or route-foreign structured-data blocks, and
  `lastmod` must not be fabricated. `prerender-output-invariants` already rules
  that claims about build output belong to the invariant rather than to a
  Playwright test, so the first two land there.

Not in scope, and deliberately so:

- **Above-the-fold snapshot fidelity, hydration, entry animation, bundle size.**
  PR #29 owns these and has already implemented the first. The boundary is above
  the fold versus below it, not hydration versus snapshot — an earlier draft of
  this proposal drew it wrongly and was corrected by the session working on #29.
- `<priority>` and `<changefreq>` stay as they are. `sitemap-lastmod` requires
  them preserved, and the audit's suggestion to drop them was raised without
  reading that requirement.
- Listing-page `lastmod` continues to track the freshest post rather than its own
  source file. That is the existing "Listing page lastmod reflects freshest post"
  requirement working as written, not the defect the audit first took it for.
- `waitTime = IS_VERCEL ? 1000 : 2000` is left alone. It is the reason local and
  Vercel builds disagreed, but once `initial={false}` and scrolled capture remove
  the races that depended on it, tuning it buys nothing.

## Capabilities

### New Capabilities

None. Every claim here belongs to a capability that already exists.

### Modified Capabilities

- `prerender-output-invariants`: gains two build-output invariants — prerendered
  HTML SHALL NOT serve primary content in a hidden state, and SHALL NOT contain
  duplicate or route-foreign structured-data blocks. **Conflict point:** PR #29
  adds one requirement to this same capability (a JavaScript payload budget).
  Whichever change merges second reconciles the delta.
- `seo-page-metadata`: extends its per-page metadata rules to structured data.
  The capability already requires exactly one description per page and a
  canonical pointing at the page's own URL; JSON-LD is head metadata and SHALL be
  scoped to its route on the same terms.
- `sitemap-lastmod`: gains a requirement that `lastmod` resolution SHALL fail
  rather than fall back to the current date when a source date cannot be
  determined. The existing legal-page and per-post requirements are unchanged —
  they are violated by the implementation, not wrong.

## Impact

- **Depends on PR #29.** `scripts/prerender.mjs` is already modified on
  `perf/speed-up-first-load`, which adds `CONTENT_ROUTES` and a wait on a
  `data-content-ready` marker for article and lesson routes. This change branches
  from there, not from `main`, or it conflicts in that file.
- **The hidden-content gate cannot be enabled until both changes land.** On
  `main` today it fails every route. On `perf/speed-up-first-load` `/blog` passes
  and `/` still fails, because the `whileInView` sections this change fixes are
  still captured hidden. Sequencing the gate is part of the work, not an
  afterthought.
- **Code:** `scripts/prerender.mjs` (scrolled capture),
  `scripts/verify-prerender-output.mjs` (three assertions),
  `src/components/seo/StructuredData.jsx` (Helmet instead of `document.head`),
  `scripts/update-sitemap.js` (`getGitLastModDate` error handling). Pages
  rendering `StructuredData` — `Home.jsx`, `Blog.jsx`, `BlogPostPage.jsx`,
  `CourseHub.jsx`, `CourseLesson.jsx` — are affected only if the component's
  contract changes. Several of these are also touched by #29, so rebasing matters.
- **Build:** `npm run build:prerender` is Vercel's build command, so a regression
  becomes a failed deployment rather than a silent bad deploy. Expect the first
  run to fail if the Vercel checkout cannot resolve git history — that is the
  point, and ensuring full history is available is part of the work.
- **Not touched:** routing, i18n, content, styling, security headers, scroll
  animation behaviour for real visitors, and any test other than the build
  invariant.
