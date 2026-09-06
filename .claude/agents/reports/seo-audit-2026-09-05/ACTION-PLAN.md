# Action Plan — pawel.lipowczan.pl

Ordered by leverage, not by severity label. Effort is rough dev time.

## Step 0 — before anything else: find out why nothing is indexed

Added after Google credentials were configured. Search Console reports 98 URLs
submitted and **0 indexed**; 1 click in 90 days. Detail in `gsc-indexation.md`.

Every other item on this list optimises a site that does not currently appear in
search results. That does not make them wrong — it makes them second.

### Z1. Run the diagnostic — Critical, ~15 minutes, no code

In Search Console, open URL Inspection and click **Request Indexing** for five
URLs: `/`, `/blog`, and the three strongest posts (suggest
`software-3-0-agentic-engineering`, `rag-ragowi-nierowny`,
`system-agentow-ai-skills-rules-kontekst`).

Then wait roughly a week and re-inspect. The result splits the problem:

- **They index and stay** → this is a discovery and crawl-budget problem. Fix by
  earning links and improving internal linking (B1), and the rest of this plan
  proceeds as written.
- **They do not index, or index then drop** → this is a value judgement. Thin
  pages (B3) and external authority (Z2) become the whole game, and the
  on-page work below is premature.

Do not use the Indexing API for this. Google only accepts job postings and
livestreams through it.

### Z2. Start earning real external links — Critical, ongoing

The domain does not appear in the Common Crawl graph and has no confirmed
inbound links beyond its own profiles, one of which is `nofollow`. This is the
most likely single cause of the indexation verdict and the slowest thing to fix,
which is why it starts now rather than after the code work. Concrete, non-spammy
angles are listed in `backlinks.md`.

## Then — one change, four failing pages fixed

### A1. Stop the prerenderer baking invisible HTML — Critical, ~half a day

`scripts/prerender.mjs` captures mid-animation and never scrolls, so 74 elements
on `/` and 75 on `/en/` ship at inline `opacity: 0`, including the LCP `<h1>`.

Do **not** fix by lengthening the wait or scripting a scroll — both are
timing-dependent and the existing 1000/2000ms split is already why local and
Vercel disagree. Instead:

1. Neutralise motion initial states during the prerender pass. `App.jsx:27`
   already wraps the tree in `<MotionConfig reducedMotion="user">` — that is the
   seam. Detect the prerender pass and render with `initial={false}`.
   Alternative: strip leftover inline `opacity`/`transform` from the captured
   HTML after `page.content()` in `prerender.mjs`.
2. Add an assertion to `scripts/verify-prerender-output.mjs` that fails the build
   when a snapshot contains inline `opacity: 0` above a small threshold.

Step 2 is what stops the regression recurring — the same move already made for
the canonical guard after the 2026-07-29 incident, applied to the failure mode
that guard cannot see.

Expected: mobile FCP and LCP drop from ~5.6s/6.5s toward the desktop profile
(1.4–1.6s). This is the largest single win available.

### A2. Add an end-of-article module to the blog template — Critical, ~half a day

One template change repairs all 60 posts. Include: author bio card linking the
new about page, 2–3 related posts, one contextual case-study link, and a CTA that
varies by topic. Today `</article>` closes straight into the footer.

### A3. Create the author/about page — Critical, ~half a day plus copy

`/o-mnie` (and `/en/about`) with credentials, scope, years, photo, business
identity. Then give `Person` an `@id` and reference it from every
`BlogPosting.author`. Highest-leverage change for both E-E-A-T and AI citation.

### A4. Fix the two blocked CTAs — Critical, ~2 hours

- `/` mobile: the 261px cookie banner sits on top of "Skontaktuj się". Reserve
  safe-area padding or shrink the banner.
- `/llm-wiki`: pull "Zapisz mnie" above the fold. It is currently 2048px down on
  mobile on the site's main conversion page.

## Do next — a week

### B1. Wire up Cluster D — High, ~an afternoon

Nine business-automation/no-code posts have zero internal links in or out. No new
content needed; the linking matrix is in `cluster.md`. Also link blog posts to
their matching case studies in both directions (e.g.
`automatyzacja-email-frontdesk-ai` to `/projects/frontdesk-ai`).

### B2. Fix sitemap lastmod — High, ~2 hours

`getGitLastModDate()` in `scripts/update-sitemap.js` swallows errors and falls
back to `new Date()`. Stop swallowing; ensure the Vercel build has full git
history; prefer content-colocated metadata over `git log`, especially for
`projects.js` where one file currently stamps 18 URLs. Drop `changefreq` and
`priority` while in there.

### B3. Expand the nine case studies — High, ~a day each with copy

156–234 words today. Shape each as problem, approach, named client or metric,
result, CTA. This is the site's strongest potential Experience signal and is also
what the "automatyzacja procesów AI" SERP wants.

### B4. Resize the oversized images and add srcSet — High, ~3 hours

Cap the longest edge at ~1600px for inline article images: `hacknation-team.webp`
(6528x4896, 2,036 KB), `hacknation-end.webp` (891 KB),
`karpathy-paradigm-software-3-0.webp` (6360x7360, 800 KB). Add the dimension cap
to `scripts/convert-to-webp.js` so the next photo does not repeat it. Then add
`srcSet` at 480/960/1600 for article and card images.

### B5. Route JSON-LD through Helmet — High, ~2 hours

`StructuredData.jsx` appends to `document.head` imperatively, which is why
`/privacy-policy` carries the homepage `Person` and `/en/` carries it twice. Move
it onto `<Helmet>`, then extend the prerender guard to assert block counts and
reject duplicates.

### B6. Shorten titles — High, ~2 hours

29 of 30 exceed 60 chars. Either drop the `" | Pawel Lipowczan"` suffix on long
titles or shorten the titles themselves.

## Do this month

- **C1.** Add comparison tables to `airtable-vs-excel-migracja` and any other
  "X vs Y" post, following the pattern already working in
  `zapier-vs-make-vs-n8n-wybor-narzedzia`.
- **C2.** Build the Cluster A pillar page — 8 Claude Code posts with nothing
  aggregating them. `cluster.md` confirms the business-use angle is uncontested in
  Polish search.
- **C3.** Code-split the 753 KB bundle (~197 KB unused on the homepage).
- **C4.** Add `BreadcrumbList` JSON-LD to project, course, llm-wiki and policy
  pages; add `Course`/`hasCourseInstance` for `/llm-wiki/kurs`; replace the fake
  `SoftwareApplication`/`Offer` on project pages with `CreativeWork`; emit
  `inLanguage` site-wide; fix the missing `/en` prefix in EN breadcrumbs.
- **C5.** Promote CSP from Report-Only to enforcing once report data is clean.
- **C6.** Fix the 12 filename-style alt attributes and normalise the
  "Pawel"/"Paweł" author name.
- **C7.** Add a `dateModified` frontmatter field and surface it.
- **C8.** Add business-identity markers (NIP, address) for Trustworthiness.
- **C9.** Add mobile scroll affordance (fade or shadow) to article code blocks.
- **C10.** Link `llms-full.txt` from `llms.txt` — one line in the generator.

## Backlog

- Trailing-slash redirects for non-root paths.
- `preconnect` to clickrank.ai.
- Intrinsic `width`/`height` on the four `<img>` sites missing them.
- Delete the unreferenced 791 KB `linkedin-cover.jpeg`.
- Enlarge sub-44px tap targets.
- Decide on `www` DNS.
- Expand `automatyzacja-email-frontdesk-ai` (689w) and `no-code-lead-generation`
  (841w) past the 1,500w gate.

## Instrumentation — done 2026-09-05

Both blind spots were closed the same day the audit ran:

1. **Google API credentials** — configured, Tier 2 (full). PageSpeed, CrUX, CrUX
   History, Search Console, Indexing API and GA4 (property `271626485`,
   measurement ID `G-7L4PXG8E8Z`) all authenticate. This is what surfaced the
   indexation finding in Step 0. Note that CrUX holds no data for this domain, so
   field CWV remains unavailable until traffic grows.
2. **Drift baseline** — captured for `https://pawel.lipowczan.pl`. Future deploys
   can be diffed with `python scripts/drift_compare.py https://pawel.lipowczan.pl`.
   Worth re-running right after the prerender fix lands, since that is exactly the
   kind of build-pipeline regression it exists to catch.

Housekeeping spotted while configuring: GA4 holds a second property for the same
site, `271631950` with measurement ID `G-8ESMCJ0B2R`, which the site does not
use. Probably an abandoned earlier setup. Not an SEO problem, but worth deleting
so nobody reads the wrong dashboard later.
