## Why

The `/llm-wiki` waitlist landing (PR #7) captures emails but has nothing to send people to *do* right now — the funnel is "leave email → wait." The free "LLM Wiki" course fills that gap: a 5-lesson, hands-on walkthrough of building a second brain on the free `second-brain-template`, sitting under the same `/llm-wiki` umbrella and funnelling readers back to the waitlist.

It must be a **separate course section, not blog posts** (owner decision, per the deliverable): a dedicated hub + prev/next lesson flow keeps a coherent lesson → waitlist funnel and product narrative that blog entries would dilute. The section must read as a **sibling of `/llm-wiki`** — same dark/`primary-500`/mono design language, `GrowingNetworkBackground`, `SEO` component — not a foreign element.

The article content already exists as markdown in the source deliverable (`2026-06-30_free-kurs-wsad-i-prompt.md`, "Wsad merytoryczny": Hub + L1–L5) and is reused 1:1 (commands, structure, tables, the `kb-template/` tree unchanged; only prose/styling polished).

## What Changes

- **New hub route `/llm-wiki/kurs`** — title, subtitle, five linked lesson cards, repo link, CTA to the waitlist (`/llm-wiki`). Landing-style JSX page (cards + CTA, not article prose).
- **Five new lesson routes**, each its own prerendered article with prev/next, breadcrumb, "Lekcja n / 5" progress, in-page TOC, and a bottom CTA to `/llm-wiki`:
  - `/llm-wiki/kurs/1-zaloz-katalog`
  - `/llm-wiki/kurs/2-onboarding`
  - `/llm-wiki/kurs/3-pierwszy-ingest`
  - `/llm-wiki/kurs/4-pytania-i-zarzadzanie`
  - `/llm-wiki/kurs/5-rozwoj-i-publikacja`
- **Markdown-backed content**: lessons stored as `src/content/kurs/*.md` with frontmatter (`slug`, `order`, `title`, `excerpt`), loaded via a `src/data/coursePosts.js` glob loader (mirrors `blogPosts.js`), ordered for prev/next.
- **Shared markdown renderer**: extract the `ReactMarkdown` components map currently inline in `BlogPostPage.jsx` into a reusable `MarkdownContent` component; point **both** blog and course at it (DRY, no behavioural change to blog).
- **Routing**: nest `/llm-wiki` into `index` (landing) + `kurs` (hub) + `kurs/:slug` (lesson); add a splat redirect `/en/llm-wiki/*` → PL equivalent (preserves deep path) alongside the existing `/en/llm-wiki` redirect.
- **Prerender**: derive the six course routes from the content files and add them to `allRoutes`, PL-only (no `/en` mirror), consistent with the existing `landingRoutes` treatment.
- **SEO per page**: unique `<title>` + meta description; `alternateUrl` pointed at each page's own PL URL so no `/en` hreflang leaks (same PL-only trick the landing uses). Hub + all lessons share **one dedicated course OG image** (`/images/og-llm-wiki-kurs.webp`) for recognisable LinkedIn/social share cards; falls back to the site default until the asset is produced (non-blocking).
- **Landing → course link on success**: the `/llm-wiki` post-signup success screen gains a "→ Wejdź w darmowy kurs" link to `/llm-wiki/kurs`, connecting the waitlist to the (ungated, public) course in the UI. The course is a free lead magnet; it stays publicly reachable — signup is a nudge, not a gate.

## Capabilities

### New Capabilities
- `llm-wiki-course`: a PL-only, prerendered free-course section under `/llm-wiki/kurs` (hub + five markdown-driven lessons) that reuses the landing design system and funnels to the `/llm-wiki` waitlist.

### Modified Capabilities
- `llm-wiki-landing`: the post-signup success screen additionally reveals a link to the course hub (`/llm-wiki/kurs`). The existing gating behaviour (repo/quick-start revealed only on success) is unchanged; this adds one more revealed link so a fresh signup gets the free course link on-page.

(The shared-renderer extraction is an internal refactor with no change to blog behaviour or spec.)

## Impact

- **Code (new):** `src/pages/CourseHub.jsx`, `src/pages/CourseLesson.jsx`, `src/data/coursePosts.js`, `src/components/ui/MarkdownContent.jsx`, `src/components/routing/StripEnRedirect.jsx` (or inline), `src/content/kurs/*.md` (5 files).
- **Code (edit):** `src/App.jsx` (nest `/llm-wiki`, add course routes + `/en` splat redirect), `src/pages/BlogPostPage.jsx` (swap inline components map for `MarkdownContent`), `scripts/prerender.mjs` (add derived course routes), `src/pages/LlmWikiLanding.jsx` (success-screen course link).
- **Tests:** new Playwright e2e — six routes render, prerender emits `dist/llm-wiki/kurs/**/index.html`, no `dist/en/llm-wiki/kurs`, prev/next + CTA present, blog rendering unregressed.
- **Assets:** one new shared course OG image `public/images/og-llm-wiki-kurs.webp` (1200×630, WebP).
- **Content:** sourced 1:1 from the `SECOND_BRAIN_KURS` deliverable; no meaning/command/structure changes.
- **Out of scope:** paid bundles / Easy.tools / checkout; EN translation of course content (redirects only); screencasts (leave an empty slot in the lesson layout for later).
- **Risk:** Low. Additive routes + an internal renderer refactor guarded by existing blog e2e. No backend dependency (CTA links to the existing waitlist form; no Formspree duplication).
