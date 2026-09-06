# Core Web Vitals — pawel.lipowczan.pl (LAB DATA ONLY)

Measured 2026-09-05 via local Lighthouse 13.4.1 (Google Chrome v151, headless),
default Lighthouse mobile throttling profile (Slow 4G + 4x CPU slowdown,
simulated) and Lighthouse desktop preset. **No Google API credentials are
configured in this environment, so PageSpeed Insights and CrUX (field data)
were unavailable.** All numbers below are single-run lab measurements, not
28-day real-user percentiles. FID is not referenced anywhere (deprecated
2024-09-09); INP itself cannot be measured by Lighthouse (it requires real
interaction), so Total Blocking Time (TBT) is used as the INP-risk proxy per
standard lab-testing practice.

Raw Lighthouse JSON for all 8 runs (4 URLs x mobile/desktop) retained at
`scratchpad/seo/lh/*.json` for this session.

## Mobile results

| URL | Score | LCP | LCP element | CLS | TBT | FCP | TTFB | Transfer |
|---|---|---|---|---|---|---|---|---|
| `/` | 57 | 6.5s | `<h1>` "PAWEL LIPOWCZAN" hero heading (text) | 0 | 270ms | 5.6s | 30ms (108ms per LCP breakdown) | 1,095 KiB |
| `/blog` | 56 | 6.9s | `<p>` blog index intro paragraph (text) | 0 | 300ms | 5.6s | 30ms (96ms) | 1,283 KiB |
| `/blog/rag-ragowi-nierowny` | 44 | 6.9s | `<img>` article hero image | 0 | 736ms | 5.6s | 30ms (96ms) | 1,059 KiB |
| `/llm-wiki` | 50 | 6.7s | `<p>` landing intro paragraph (text) | 0 | 504ms | 5.6s | 30ms (122ms) | 988 KiB |

CLS is effectively 0 on every page in this lab run - no measurable layout
shift was recorded on any of the four URLs under Lighthouse's synthetic
navigation. This does not rule out shift from late/async content under real
user conditions/slower devices, but nothing was captured in lab.

TTFB is excellent everywhere (27-40ms server response, Vercel edge). FCP is
identical (5.6s) across all four pages on mobile - this is the dominant
problem, not TTFB.

## Desktop results (comparison — desktop CPU/network defaults, no extra throttling)

| URL | Score | LCP | CLS | TBT | FCP | Transfer |
|---|---|---|---|---|---|---|
| `/` | 95 | 1.4s | 0.002 | 6ms | 0.9s | 1,474 KiB |
| `/blog` | 92 | 1.6s | 0.002 | 22ms | 1.1s | 1,986 KiB |
| `/blog/rag-ragowi-nierowny` | 93 | 1.5s | 0.002 | 89ms | 1.0s | 1,059 KiB |
| `/llm-wiki` | 96 | 1.4s | 0.002 | 0ms | 0.3s | 988 KiB |

Desktop is comfortably "Good" on all three metrics for all four pages. The
entire problem measured here is mobile-CPU-bound.

## LCP breakdown (mobile, from `lcp-breakdown-insight`)

| URL | TTFB | Resource load delay | Resource load duration | Element render delay (reported) |
|---|---|---|---|---|
| `/` | 108ms | n/a (text LCP) | n/a | 2,185ms |
| `/blog` | 96ms | n/a | n/a | 1,823ms |
| `/blog/rag-ragowi-nierowny` | 96ms | 25ms | 56ms | 1,743ms |
| `/llm-wiki` | 122ms | n/a | n/a | 1,907ms |

**Note on the gap**: for the three text-node LCPs (`/`, `/blog`, `/llm-wiki`)
the reported subparts do not sum to the total LCP time (e.g. home:
108+2185 ~= 2.3s vs. reported LCP 6.5s). The remainder is main-thread
contention during hydration: the mobile CPU-throttled trace shows long tasks
running from ~0ms to ~1.3s (initial parse/hydrate) and again a cluster of
long tasks at 6.4-6.9s attributed to `index-BCzTzMH_.js`. Hydration script
execution is still displacing paint late into the timeline even though
prerendered HTML is present from TTFB. This is a SPA-hydration-bound LCP, not
a resource-loading-bound one, for the three text-LCP pages.

## Third-party cost (from `third-parties-insight`, mobile)

| Third party | Transfer | Main-thread time |
|---|---|---|
| clickrank.ai | 10.3-15.5 KB (3 requests: two `.../script` + one `.../optimization`) | 2.1-4.4ms across all four pages |

clickrank.ai's CPU cost is negligible - under 5ms of main-thread time on
every page, and the transferred payload is a few KB. It is not a TBT/INP
contributor. Its only measurable cost is network: it is a cold third-party
origin (RTT 99.6ms recorded to `js.clickrank.ai`, vs. 13ms to the site's own
origin) and Lighthouse's `network-dependency-tree-insight` flags it as a
preconnect candidate worth an estimated ~473ms of LCP-critical-path savings
on the homepage if a `<link rel="preconnect">` were added, because the
browser does a cold DNS+TCP+TLS handshake to that origin during initial load.
No GTM/GA4, Sentry, Vercel Analytics/Speed Insights, or Zencal main-thread
costs were broken out by name in this run - the `third-parties-insight` table
only surfaced clickrank.ai as its own entity on every page; the rest either
did not load in a fresh headless run (GA4 is consent-gated behind an
"Akceptuje" click) or executed below the entity-grouping threshold.

## Render-blocking & CSS

Only one render-blocking resource on every page: the built stylesheet
`assets/index-DN7Souvw.css` (~8.5 KB). No render-blocking JS was flagged.
`font-display-insight` returned zero items on all four pages - no
font-display savings opportunity was detected, i.e. self-hosted fonts are not
causing a measurable FOIT/FOUT-driven CLS/paint delay in this run (consistent
with CLS ~= 0 everywhere).

## JS bundle / hydration cost

- Main bundle `assets/index-BCzTzMH_.js`: 753,772 bytes; 26% (196.7 KB)
  reported as unused by `unused-javascript` on the homepage run.
- `bootup-time`: 1,123ms total script cost attributed to this bundle on
  mobile (660ms scripting + compile), the single largest bootup-time
  contributor on every page.
- Six long tasks recorded on the homepage mobile trace; the two largest
  (253ms, 212ms) both attributed to this bundle - one during initial parse,
  one again ~6.4-6.9s in, i.e. after paint should already have been possible
  from the prerendered DOM. This is the hydration cost of the React 19 SPA
  re-mounting over Puppeteer-prerendered HTML on a throttled mobile CPU, and
  it directly explains why FCP/LCP are ~5.6s/6.5-6.9s on mobile despite
  ~100ms TTFB and static content already present in the initial document.

## DOM size

Homepage: 601 total elements, max depth 17, max children 9 - well under the
1,500-element "excessive DOM" threshold. Not a contributor here.

## Known issue folded in from a parallel finding (not independently re-measured here)

A parallel agent established that inline article images ship at full source
resolution with no `srcSet` anywhere in the codebase: `hacknation-team.webp`
(6528x4896, 2,036 KB) and `karpathy-paradigm-software-3-0.webp` (6360x7360,
800 KB). The measured article, `/blog/rag-ragowi-nierowny`, did not surface
an oversized image in `image-delivery-insight` (returned empty) - its own
hero image loads in 56ms and is not the bottleneck on this specific article.
The hackathon article and the Karpathy Software 3.0 article are the pages
actually carrying this cost; they were not in this measurement's URL list and
were not independently re-verified here.

## Scoring

Mobile Lighthouse Performance scores: `/` 57, `/blog` 56,
`/blog/rag-ragowi-nierowny` 44, `/llm-wiki` 50 - all "Needs
Improvement"/"Poor" band per Lighthouse's mobile scoring curve, driven almost
entirely by LCP under CPU throttling. Desktop scores: 95, 92, 93, 96 - all
"Good".
