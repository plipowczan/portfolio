## Context

`/llm-wiki` is a PL-only prerendered waitlist landing (spec `llm-wiki-landing`). We are adding a free 5-lesson course under it. Constraints from the deliverable + repo:

- Must be a **separate section, not blog** — dedicated hub + prev/next flow, product narrative, extensible per-lesson (screencast slot later).
- Must be a **visual sibling of the landing** — reuse `dark-800/700`, `primary-500`, `font-mono`, `[[wikilink]]` motif, `GrowingNetworkBackground`, `SEO`, `FADE_IN_UP`/`STAGGER_CONTAINER`, `btn-primary`.
- **PL-only**, prerendered, **zero backend** — content rendered statically; CTA links to the existing waitlist form rather than duplicating it.
- Content comes 1:1 from `SECOND_BRAIN_KURS/deliverables/2026-06-30_free-kurs-wsad-i-prompt.md` ("Wsad merytoryczny").

Relevant existing machinery:
- **Routing** (`App.jsx`): a `path="/:lang?"` optional-param route wraps everything in `LocaleLayout`. `/llm-wiki` resolves to `lang=""`+child `llm-wiki` (static ranks above the dynamic segment). `LocaleLayout` only auto-strips *invalid* lang prefixes; `en` is valid, so `/en/llm-wiki` needs an **explicit** redirect (already present).
- **Markdown pipeline** (`BlogPostPage.jsx`): `ReactMarkdown` + `remarkGfm` + `rehypeRaw` with a ~200-line components map styling headings/tables/code/`pre`/lists/links/blockquote — already renders the exact constructs the lessons need (command tables, the `kb-template/` tree, code fences).
- **Prerender** (`prerender.mjs`): blog routes are derived from files; `landingRoutes` is hardcoded and PL-only.
- **SEO** (`SEO.jsx`): passing `alternateUrl` = the page's own PL URL suppresses the `/en` hreflang — the landing's PL-only trick.

## Goals / Non-Goals

**Goals:**
- Six new prerendered PL routes (hub + 5 lessons) that look like `/llm-wiki` siblings.
- 1:1 content fidelity with the deliverable (commands, structure, tables, tree unchanged).
- Clean funnel: hub → lessons → hub; lessons prev/next; every lesson + hub → `/llm-wiki` CTA; repo linked on hub, L1, L5.
- No backend dependency; no EN content; internal renderer DRY without regressing blog.

**Non-Goals:**
- Paid bundles / Easy.tools / checkout.
- EN translation of course content — **deferred to a future separate change** (e.g. `add-llm-wiki-course-en`). This change stays PL-only; `/en/...` course paths redirect to PL. The EN work is a distinct deliverable (copywriting the 5 lessons) and reuses the existing blog i18n pattern (`content/blog/en/`, `alternateSlug`, `/en/` routes, EN prerender routes). The PL-only choices here are deliberately reversible — see Decision 4.
- Screencasts (leave an empty, styled slot in the lesson layout for later).
- Custom OG image generation (reuse site default, as the landing does).

## Decisions

**1. Content storage = markdown files (not JSX, not JS template strings).** *(User-confirmed.)*
Lessons live in `src/content/kurs/*.md` with frontmatter (`slug`, `order`, `title`, `excerpt`), loaded by `src/data/coursePosts.js` via `import.meta.glob` (eager, `?raw`), sorted by `order` to derive prev/next. Rationale: the wsad is already markdown with tables and a triple-backtick `kb-template/` tree — a JS template-literal store (Option C) would collide with the code fences; hard-coded JSX (Option B) makes tables/tree tedious and drifts from the source. Markdown files give 1:1 fidelity and trivial extensibility. "Separate section, not blog" is satisfied by a separate dir + separate loader + separate routes + dedicated hub/prev-next layout — independent of the storage format.

**2. Hub = JSX page; lessons = markdown articles (hybrid).**
The hub is a landing-style index (lesson cards + CTA + repo link over `GrowingNetworkBackground`), so it is a JSX page (`CourseHub.jsx`) reusing landing primitives — not prose. Lessons are article pages (`CourseLesson.jsx`) that render markdown through the shared renderer with course chrome (breadcrumb, "Lekcja n / 5", TOC, prev/next, CTA).

**3. Extract a shared `MarkdownContent` renderer; blog + course both use it.** *(User-confirmed — DRY.)*
Move the `ReactMarkdown` components map out of `BlogPostPage.jsx` into `src/components/ui/MarkdownContent.jsx` (accepting the markdown string + the `generateSlug` heading-id helper so TOC/anchor behaviour is preserved). Point blog and `CourseLesson` at it. Rationale: avoids ~200 lines of duplication; blog's existing e2e guards against regression. The heading-id slug logic (Polish-char normalization) moves with it so both sections get anchors + TOC.

**4. PL-only via a splat redirect + self-referential `alternateUrl`.**
Add `<Route path="/en/llm-wiki/*" element={<StripEnRedirect/>}/>` where `StripEnRedirect` reads the `*` splat and `Navigate`s to `/llm-wiki/<splat>` (preserving the deep path, e.g. `/en/llm-wiki/kurs/2-onboarding` → `/llm-wiki/kurs/2-onboarding`). One route covers hub + all lessons + future lessons, vs six exact redirects. Keep the existing exact `/en/llm-wiki` redirect. Each page passes `alternateUrl` = its own PL URL so no `/en` hreflang is emitted, and prerender never generates `/en/**` course pages.

**Reversible seam for future EN.** This `/en/llm-wiki/*` splat redirect is the *only* thing actively blocking an EN course, and it is a single, clean point to undo. When the deferred EN change ships, it removes/narrows this redirect and switches to the blog i18n pattern: an `content/kurs/en/` dir, `alternateSlug`-style linking between PL/EN counterparts, per-page `alternateUrl` pointing at the real EN URL, and EN course routes added to prerender. Nothing else in this design needs rework — the markdown loader, shared renderer, and page components are locale-agnostic. So PL-only now is not a one-way door.

**5. Routing shape — nest `/llm-wiki`.**
```
<Route path="/en/llm-wiki/*" element={<StripEnRedirect/>}/>   // new, splat
<Route path="/en/llm-wiki"   element={<Navigate to="/llm-wiki" replace/>}/>  // keep
<Route path="/:lang?" element={<LocaleLayout/>}>
  <Route path="llm-wiki">
    <Route index            element={<LlmWikiLanding/>}/>   // /llm-wiki unchanged
    <Route path="kurs"      element={<CourseHub/>}/>
    <Route path="kurs/:slug" element={<CourseLesson/>}/>
  </Route>
  ...
```
`/llm-wiki` stays a leaf render (now via `index`), so the landing is behaviourally unchanged.

**6. CTA = link to `/llm-wiki`, never a duplicated form.**
Bottom-of-lesson and hub CTAs are styled `btn-primary` links/buttons to `/llm-wiki` (the single Formspree source). Keeps "zero backend dependency" and avoids a second waitlist form to maintain.

**7. One shared course OG image; TOC on lessons.** *(User-confirmed.)*
Hub + all five lessons pass the **same** `image="/images/og-llm-wiki-kurs.webp"` — a single dedicated OG (Open Graph share image) for the whole course section, rather than the site default or per-lesson images. Rationale: the course will be promoted via a LinkedIn build-in-public series, so course links need a recognisable, on-brand share card (the default `og-home.webp` reads as "home page"); one shared asset covers 6 pages at the cost of one. Per-lesson OGs stay out of scope (6 images). The asset is produced with the existing OG pipeline (`blog-article-writer:generate-og-prompt` prompt + `npm run img:convert` → WebP), styled like the landing (dark, `primary-500`, node-graph, mono). **Non-blocking:** until the asset exists, `image` is omitted and the pages fall back to the site default, so code work is not gated on the graphic. Lessons also reuse the blog scroll-spy TOC (sidebar + mobile drawer) for readability.

**8. Prerender = derive from files, PL-only.**
`courseRoutes = ["/llm-wiki/kurs", ...coursePosts.map(p => `/llm-wiki/kurs/${p.slug}`)]`, pushed into `allRoutes` with no `/en` variants. Expect exactly **6** new prerendered pages; smoke-check their `dist/**/index.html`.

**9. Course is ungated (public); the landing success screen links to it.** *(User-confirmed.)*
Funnel model: the free course is a **lead magnet**. Course pages are public + prerendered — gating them would kill SEO (a bot can't get past a form) and contradict "publicly available". The owner drives *promoted* traffic to `/llm-wiki` (signup) to collect emails, then emails the course link; *organic* visitors land on the course directly (SEO) and are nudged to sign up via the CTA. The signup → email → course-link delivery is **email-ops outside this codebase** — no code gate or automation is added. On-page, the two are also connected: the landing's post-signup **success screen gains a "→ Wejdź w darmowy kurs" link to `/llm-wiki/kurs`**, so a fresh signup gets the course link immediately in the UI. This modifies the `llm-wiki-landing` capability (one added revealed link on success). The waitlist collects emails for future *paid* bundles; the course itself stays free.

## Open Questions

- **Unknown lesson `<slug>` handling**: `CourseLesson` for a slug with no file should render a "nie znaleziono" state + link back to `/llm-wiki/kurs` (mirror blog's post-not-found). Confirmed as in-scope for robustness.
- **Hub in nav/menu**: wiring `/llm-wiki/kurs` into the site menu / landing CTA is listed as a *post-implementation manual step* in the deliverable — left out of this change's code scope unless requested.
