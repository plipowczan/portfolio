## 1. Course content (markdown, 1:1 from deliverable)

- [x] 1.1 Create `src/content/kurs/1-zaloz-katalog.md` with frontmatter (`slug: 1-zaloz-katalog`, `order: 1`, `title`, `excerpt`) and L1 body from the wsad (koncept, "Weź szablon", `kb-template/` tree, 3-warstwy table, 3 indeksy, pułapka). Link the repo `github.com/plipowczan/second-brain-template`.
- [x] 1.2 Create `src/content/kurs/2-onboarding.md` (`order: 2`) — L2 body (`/onboard` wywiad, generowanie schema/folderów/indeksów, `.kb-onboard.json`, "dzień zerowy").
- [x] 1.3 Create `src/content/kurs/3-pierwszy-ingest.md` (`order: 3`) — L3 body (`/ingest`, frontmatter `type`/OKF, 3 indeksy, surowe pliki vs wiki, pułapki).
- [x] 1.4 Create `src/content/kurs/4-pytania-i-zarzadzanie.md` (`order: 4`) — L4 body (`/qa`, `/lint`, `/reindex`, qa vs research, full command table, zasady jakości, anty-wzorce).
- [x] 1.5 Create `src/content/kurs/5-rozwoj-i-publikacja.md` (`order: 5`) — L5 body (Quartz publikacja, OKF/przenośność, ścieżka rozwoju multi-brain/MCP, miękki most do paid, repo link).
- [x] 1.6 Verify each file: commands, structure, tables, and the tree are unchanged vs the deliverable (only prose/style polish).

## 2. Content loader

- [x] 2.1 Create `src/data/coursePosts.js` — `import.meta.glob("../content/kurs/*.md", { eager, query: "?raw", import: "default" })`, parse frontmatter with `gray-matter`, validate `slug`/`order`/`title`, export lessons sorted by `order`.
- [x] 2.2 Export helpers: `getLessonBySlug(slug)` and `getPrevNext(slug)` (returns `{ prev, next }` from ordered list).

## 3. Shared markdown renderer (DRY, no blog regression)

- [x] 3.1 Create `src/components/ui/MarkdownContent.jsx` — the `ReactMarkdown` (`remarkGfm` + `rehypeRaw`) + full components map lifted verbatim from `BlogPostPage.jsx`, plus the Polish-aware `generateSlug` heading-id logic. Props: `content`, optional `contentRef`.
- [x] 3.2 Refactor `BlogPostPage.jsx` to render `<MarkdownContent content={post.content} contentRef={contentRef} />`; keep TOC extraction working against the same heading ids.
- [x] 3.3 Confirm no visual/behavioural change to blog (existing blog e2e stays green).

## 4. Course pages

- [x] 4.1 Create `src/pages/CourseHub.jsx` — landing-style JSX: title + subtitle from the Hub wsad, five lesson cards (title + 1-line + link), repo link, `btn-primary` CTA → `/llm-wiki`, `GrowingNetworkBackground`, `SEO`, `FADE_IN_UP`/`STAGGER_CONTAINER`.
- [x] 4.2 Create `src/pages/CourseLesson.jsx` — read `:slug`, load lesson; render breadcrumb (Home → Kurs → title), "Lekcja n / 5" progress, `<MarkdownContent>`, reused scroll-spy TOC (sidebar + mobile drawer), an empty styled screencast slot (placeholder), prev/next nav, bottom CTA → `/llm-wiki`.
- [x] 4.3 Handle unknown slug: render a "nie znaleziono" state with a link back to `/llm-wiki/kurs` (mirror blog post-not-found).
- [x] 4.4 In `src/pages/LlmWikiLanding.jsx`, add a "→ Wejdź w darmowy kurs" link to `/llm-wiki/kurs` on the post-signup success screen (alongside the existing repo link). Keep it revealed only on success; course stays ungated/public.

## 5. Routing + PL-only redirects

- [x] 5.1 In `src/App.jsx`, nest `/llm-wiki` into `index` (landing), `kurs` (hub), `kurs/:slug` (lesson); import the two new pages.
- [x] 5.2 Add `StripEnRedirect` (reads `*` splat, `Navigate`s to `/llm-wiki/<splat>`, preserving deep path) and route `path="/en/llm-wiki/*"`; keep the existing exact `/en/llm-wiki` redirect. **(Impl note:** the splat alone is out-ranked by the nested `/:lang?/llm-wiki/kurs/:slug` route, so explicit `/en/llm-wiki/kurs` + `/en/llm-wiki/kurs/:slug` redirects were added too — they win the ranking tie by declaration order, exactly like the existing landing redirect — plus the splat as a catch-all. `StripEnRedirect` reads the full location, not just the `*` splat, so one component serves all three.)

## 6. Prerender registration

- [x] 6.1 In `scripts/prerender.mjs`, load course slugs from `src/content/kurs/*.md` (reuse a file read like `getBlogPosts`, ordered) and build `courseRoutes = ["/llm-wiki/kurs", ...slugs.map(s => `/llm-wiki/kurs/${s}`)]`.
- [x] 6.2 Add `courseRoutes` to `allRoutes` (PL-only, no `/en` variants).

## 7. SEO per page

- [x] 7.1 Hub `SEO`: unique title + description; `alternateUrl` = `${SITE_CONFIG.url}/llm-wiki/kurs`; `image="/images/og-llm-wiki-kurs.webp"`. **(Impl note:** `image` omitted for now — see 7.3 — so pages fall back to the site default; SEO title/description/self-referential `alternateUrl` are wired.)
- [x] 7.2 Each lesson `SEO`: title from lesson `title`, description from `excerpt`; `alternateUrl` = the lesson's own PL URL; same shared `image="/images/og-llm-wiki-kurs.webp"`. **(Impl note:** `image` omitted for now — see 7.3.)
- [x] 7.4 Register the course in the generated SEO surface: `scripts/update-sitemap.js` now emits `/llm-wiki/kurs` + the five lessons as PL-only `sitemap.xml` entries (pl + x-default hreflang, no `/en`); `scripts/generate-llms-txt.js` adds a "Kurs LLM Wiki (PL)" section to `llms.txt` and the full lesson bodies to `llms-full.txt`. Regenerated `public/{sitemap.xml,llms.txt,llms-full.txt}`.
- [x] 7.3 Produced the shared course OG asset `public/images/og-llm-wiki-kurs.webp` (1200×630, dark #0a0e14 + emerald #22c55e node-graph of linked markdown cards, no text) via the blog OG pipeline (`node scripts/generate-image.js … --filename og-llm-wiki-kurs` → sharp resize to 1200×630 → WebP; prompt saved at `.claude/agents/prompts/og-llm-wiki-kurs-prompt.md`). Wired `image="/images/og-llm-wiki-kurs.webp"` into both `CourseHub` and `CourseLesson` `SEO`.

## 8. Tests (Playwright e2e)

- [x] 8.1 New spec: hub `/llm-wiki/kurs` renders title + five lesson links; each lesson route renders its `h1` + a CTA link to `/llm-wiki`; prev/next present and correctly ordered.
- [x] 8.2 Assert `/llm-wiki` landing is behaviourally unchanged (still renders "rośnie sama" + 3 value h2).
- [x] 8.3 Prerender assertions: `dist/llm-wiki/kurs/index.html` + all five `dist/llm-wiki/kurs/<slug>/index.html` exist with a `name="description"` meta; `dist/en/llm-wiki/kurs` does NOT exist. **(Impl note:** the block `test.skip`s when `dist/` is absent so a build-less `npm test`/CI run doesn't fail; it asserts after `npm run build:prerender`.)
- [x] 8.4 Landing regression: assert the success screen (after a valid submit) shows a link to `/llm-wiki/kurs`, and that this link is NOT present before signup (course link revealed on success, like the repo link).

## 9. Build + verify

- [x] 9.1 `npm run build:prerender` — 91 pages, 0 errors. All 6 course pages emitted (`dist/llm-wiki/kurs/index.html` + 5 lessons), each with a `name="description"` meta and PL-self hreflang; no `dist/en/llm-wiki/**` course pages. OG falls back to `og-home.webp` (image omitted, see 7.3).
- [x] 9.2 Redirect + route rendering verified via e2e (dev server has SPA fallback like preview): `/en/llm-wiki/kurs/2-onboarding` → PL path, `/en/llm-wiki/kurs` → PL path; all 6 routes render. Prerendered `dist/**/index.html` spot-checked for title/description/content. **(Note:** `npm run preview` not manually opened — equivalent coverage via prerender-HTML inspection + e2e.)
- [x] 9.3 `npx playwright test --project=chromium` — **127 passed, 5 skipped (pre-existing conditionals), 0 failed**, incl. new course specs, `/en` redirects, prerender assertions, and unregressed blog. (Full cross-browser matrix runs in CI — chromium/firefox/webkit/mobile × 4 shards.)
- [x] 9.4 Verified against artifacts (every spec scenario mapped to a passing e2e + the build:prerender/dist checks above). Branch `feat/llm-wiki-kurs` created, committed, pushed; **PR #9** opened with scope description (https://github.com/plipowczan/portfolio/pull/9). **(Note:** verification done inline via the build + full chromium suite rather than the interactive `/opsx:verify` skill — run `/opsx:verify` separately if a formal artifact pass is wanted before archive.)
