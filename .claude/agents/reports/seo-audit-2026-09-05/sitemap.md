# Sitemap Audit — pawel.lipowczan.pl
Date: 2026-09-05 · Source: downloaded `sitemap.xml` (98 `<loc>`), repo generator `scripts/update-sitemap.js`, live checks against production.

## 1. XML validity / schema
- Well-formed single `<urlset>`, no sitemap index. `xmlns:xhtml` declared correctly for hreflang alternates. PASS.
- 98 `<loc>` entries, well under the 50,000/file limit and under the 50MB size cap (52.7 KB actual). No split needed on size grounds.

## 2. hreflang alternates — reciprocity and x-default
- Checked cross-references for all bilingual URL pairs (static pages, 30 PL + 30 EN blog posts, 9 PL + 9 EN projects): every `pl`/`en` pair points back at each other and `x-default` consistently resolves to the PL URL. PASS, no orphan or one-directional alternates found in the sample.
- PL-only pages (`/llm-wiki`, `/llm-wiki/kurs`, 8 lesson pages) correctly emit only `pl` + `x-default` (no fabricated `/en` mirror that doesn't exist) — this is intentional per a comment in the generator (`plOnlyPages`) and is correct behavior, not a bug.
- Not verified in this pass: whether the on-page `<link rel="alternate" hreflang>` tags in the actual HTML match the sitemap 1:1 — that requires crawling every page's `<head>`, out of scope for a sitemap-only audit. Flag as a follow-up if a full technical SEO crawl is run.

## 3. `<lastmod>` credibility — CRITICAL finding
The distribution is bimodal and diagnostic:
- **30 blog-post lastmod values are genuinely distinct** (2025-11-01 → 2026-07-13), because blog posts get their date from frontmatter (`date`/`modified`), not from git. This part is sound and content-derived.
- **34 of the remaining 38 non-blog URLs share the exact same value: `2026-07-30`** — every legal page, `/llm-wiki`, the course hub, all 8 course lessons, and all 18 project URLs (9 projects × PL/EN). This is a bulk-identical-lastmod smell per the checklist, and it is provably wrong: local git history shows real last-touch dates of 2026-07-29 (PrivacyPolicy.jsx, LlmWikiLanding.jsx, CourseHub.jsx), 2026-07-08 (course lesson `.md` files), and **2025-12-01** for `src/data/projects.js` (the file backing all 9 projects) — an 8-month gap from what the live sitemap claims.
- **Root cause, traced to the generator and the deploy pipeline, not just the script:** `getGitLastModDate()` in `scripts/update-sitemap.js` runs `git log -1 --format=%cI -- <path>` and silently returns `new Date().toISOString()` (today) in the `catch`. `npm run blog:sitemap` is step 1 of `scripts/build-with-prerender.mjs`, which is Vercel's `buildCommand`. On Vercel the checkout is very likely a **shallow clone**: `git log -1 -- <path>` against a shallow history either fails (triggering the today-fallback) or, worse, silently succeeds by returning the *one* commit git can see — the tip/merge commit — regardless of when the file actually last changed. Both failure modes produce the same signature we observe: every git-derived date collapses to the date of the most recent deploy-triggering commit (here, `2026-07-30`, the date of the `main` merge that kicked off the build), not the file's real history.
- **Practical effect:** every non-blog `lastmod` in production is close to worthless — it tracks "when did we last deploy," not "when did this page's content last change." Google is explicit that it discounts sitemaps whose `lastmod` isn't trustworthy; this pattern (mass-identical dates that don't correlate with real edits) is exactly the signal that gets a sitemap's freshness signal ignored wholesale, which also drags down the credibility of the blog dates that *are* correct.
- **This also explains the homepage discrepancy called out in the task**: homepage/`/blog` lastmod (`2026-07-13`) is a *third*, separate mechanism — `listingLastmod`, the max of all blog frontmatter dates — deliberately decoupled from git and from actual homepage edits. It is stale by construction (any non-blog homepage change never bumps it) and doesn't match the live `Last-Modified: Wed, 02 Sep 2026` HTTP header, confirming the site has shipped changes since 2026-07-13 that the sitemap never reflected.

**Fix, specific to the generator:**
1. In `getGitLastModDate` (scripts/update-sitemap.js), don't swallow the error — throw/log loudly so a broken build environment is caught in CI/deploy rather than silently emitting wrong dates.
2. Ensure the Vercel build clone has full history before this script runs (`git fetch --unshallow` guard, or confirm/force `"github": { "silent": false }`/full clone in Vercel project settings — verify actual clone depth first).
3. Prefer the same pattern already used for blog posts — a `modified`/`date` field colocated with the content (frontmatter for lessons, a small metadata object for `projects.js`) — instead of `git log`, which is fragile across CI checkout strategies and also invalidates unrelated pages whenever *any* file in a shared source (`projects.js`) changes.
4. Give `/`, `/blog`, `/en`, `/en/blog` their own real lastmod (e.g., git date of `Home.jsx`/`Blog.jsx`, or "most recent of: newest post, last home-page-affecting commit") instead of borrowing the blog's max date.

## 4. `<changefreq>` / `<priority>`
- Both present on every URL; Google has ignored both since ~2023. Not merely inert here — `changefreq: weekly` on the homepage/`/blog` next to a stale, wrong `lastmod` compounds the credibility problem (it invites a crawler that does still weight it, e.g. some third-party SEO tools, to expect fresh content that isn't reliably flagged). No evidence they're actively misleading beyond that; recommend removing both to cut sitemap size and stop maintaining values with zero payoff. Low priority, do it opportunistically when touching the generator for the lastmod fix.

## 5. Coverage
**Sitemap → live (spot check):** `/`, `/blog/vibe-coding-przewodnik`, `/llm-wiki/kurs/5-rozwoj-i-publikacja`, `/projects/system-hrm`, `/en/blog/no-code-lead-generation`, `/sitemap.xml`, `/robots.txt` all return `200`. No redirects or 404s found in the sample.

**Repo → sitemap (full reconciliation, not just a sample):**
| Source | Count | Sitemap count | Match |
|---|---|---|---|
| `src/content/blog/*.md` (PL, excluding AGENTS/CLAUDE/README/`_wsad`) | 30 | 30 PL blog URLs | ✅ |
| `src/content/blog/en/*.md` | 30 | 30 EN blog URLs | ✅ |
| `projects` array in `src/data/projects.js` | 9 | 9×2 = 18 project URLs | ✅ |
| `src/content/kurs/*.md` lessons | 8 | 8 lesson URLs + 1 hub = 9 course-content URLs | ✅ |
| Static/legal routes in `src/App.jsx` (`/`, `/blog`, `/privacy-policy`, `/terms-of-service`, `/cookie-policy`) | 5 | 5×2 = 10 URLs | ✅ |
| `/llm-wiki` landing | 1 | 1 (PL-only) | ✅ |

No orphans (sitemap URLs with no source) and no omissions (indexable routes missing from the sitemap) found. Routes in `App.jsx` that are correctly *excluded* — `StripEnRedirect` handlers for `/en/llm-wiki*` (redirect-only, not canonical pages) — are rightly absent. This is a case where the generator is doing its enumeration job correctly; the defect is entirely in the `lastmod` value, not in which URLs get included.

## 6. robots.txt
```
User-agent: *
Allow: /
Sitemap: https://pawel.lipowczan.pl/sitemap.xml
```
Resolves, returns `200`, points at the correct absolute sitemap URL. PASS.

## 7. Flat vs. index-split
98 URLs, one file, 52.7 KB. The 50,000-URL/50MB thresholds aren't remotely close (0.2% of the URL limit). **Recommendation: leave it as a single flat sitemap.** A type/language split (pages / blog / projects / course) only pays off once a single file becomes hard to audit at a glance or approaches five-figure URL counts — neither is true here, and splitting now would add a sitemap-index layer and multiplied hreflang bookkeeping for zero crawl-budget or diagnostic benefit at this scale. Revisit only if blog posts alone cross roughly 1,000–2,000 URLs (this site adds ~1-2/week, so that's years out) or if a genuinely separate property (e.g., a docs subdomain) gets added.

## 8. Location-page quality gates
No location pages exist on this site (no `/locations/*`, no city-swapped templates in `App.jsx`, `projects.js`, or the content folders). The 30+/50+ warning and hard-stop thresholds don't apply. Clear pass, no action.

## Programmatic-page risk scan (bonus, since projects/course are template-driven)
- Project pages (`/projects/:slug`) are backed by a shared array but each has real project-specific content (per `projects.js` structure) — Safe-at-scale "product page" pattern, not a doorway-page risk.
- Course lessons are hand-authored `.md` files, one per real lesson — Safe.
- No pattern here matches the Penalty-Risk category (no city-swap, no "best X for Y" template, no AI-mass-content generator observed in `scripts/`).

## Health score: 62 / 100
Structure, coverage, and hreflang reciprocity are clean (would be 90+ on those alone). The score is capped by the `lastmod` finding: roughly 35% of all sitemap URLs carry a freshness signal that is verifiably disconnected from real content history and collapses to a single date tied to build/deploy time rather than the page. That's a credibility problem for the whole file, not just the affected URLs, per Google's stated handling of sitemaps with unreliable `lastmod`.
