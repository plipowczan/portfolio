## Why

Every visitor downloads the entire content library on every route. `src/data/blogPosts.js` and `src/data/coursePosts.js` use `import.meta.glob(..., { eager: true, query: "?raw" })`, so all 33 blog posts and 10 course lessons — 722 KB of raw markdown — are compiled into the client bundle. A production build emits **one 2,417.80 kB chunk, 779.92 kB gzipped**, with no code splitting anywhere (`React.lazy` appears in no file). Someone landing on the homepage pays for the whole blog and the whole course before they can interact.

The same page then throws away the work the prerenderer did. Measured from navigation commit in Chromium: the hero `<h1>` is served visible (`style="opacity: 1"` baked into the prerendered HTML), hydration applies Framer Motion's `initial` at ~380 ms and snaps it to `opacity: 0`, and it reaches full opacity again only at **~1.45 s**. The largest text on the site visibly disappears and fades back, and because Largest Contentful Paint ignores zero-opacity elements, the metric is pinned to the end of a decorative animation rather than to the paint that already happened.

Both problems get worse on their own: the bundle grows with every article published, and the animation delay is fixed cost on the most-visited route.

## What Changes

- **BREAKING (content loading path):** blog and course markdown stop being inlined into the client bundle. A build-time step emits a lightweight index (slug, title, date, excerpt, cover, category, order, language, alternate-slug) plus one JSON payload per article and lesson. The index ships with the app; a payload is fetched only when its article or lesson is opened.
- `gray-matter` is removed from the client. Frontmatter parsing and frontmatter validation move to the build step, which fails the build on a malformed file exactly as the loader does today. This also removes the `eval` warning Rollup currently emits for `gray-matter/lib/engines.js`.
- Route-level code splitting via `React.lazy` + `Suspense`, and explicit `manualChunks` for the three large vendors (`framer-motion`, `react-markdown` + `rehype`/`remark`, `react-icons`).
- Above-the-fold entrance animations no longer gate first paint. On a page's first load the hero renders in its settled state — matching what the prerenderer already baked in — and the entrance animation plays only on client-side navigation into the route.
- `npm run build:prerender` gains a JavaScript payload budget: the build fails when the initial route's JavaScript exceeds a declared gzipped ceiling.
- Chore: refresh `caniuse-lite` (10 months stale) and `baseline-browser-mapping`, so autoprefixer targets the current browser matrix.

## Capabilities

### New Capabilities

- `performance-content-delivery`: how blog and course markdown reaches the browser — an index built at build time, article and lesson bodies fetched on demand, and no markdown parser in the client bundle.
- `performance-hydration-paint`: hydration SHALL NOT hide content the prerenderer already painted; entrance animation is reserved for client-side navigation.

### Modified Capabilities

- `prerender-output-invariants`: gains a JavaScript payload budget check. That spec already rules that a new claim about `dist/` belongs to the build check rather than to a Playwright spec, so the bundle ceiling is enforced there, on every build including Vercel's.

## Impact

- **Code:** `src/data/blogPosts.js`, `src/data/coursePosts.js` (loader rewrite); a new build script emitting the index and payloads; `src/pages/BlogPostPage.jsx`, `src/pages/CourseLesson.jsx`, `src/pages/Blog.jsx`, `src/pages/CourseHub.jsx` (consume index / await payload); `src/App.jsx` (lazy routes); `src/components/sections/Hero.jsx` (first-load animation); `vite.config.js` (`manualChunks`); `scripts/build-with-prerender.mjs` (budget gate).
- **Dependencies:** `gray-matter` moves from a client import to a build-only import. It stays in `package.json` because the build step still uses it.
- **Prerender:** the prerenderer drives a real browser, so a fetched payload must resolve during prerender. If it does not, prerendered article HTML would come back empty — this is the single highest-risk part of the change and is called out in `design.md`.
- **Tests:** `perf-image-loading` and the SEO metadata suite read prerendered HTML and must keep passing unchanged — they are the regression net for the prerender risk above.
- **Not touched:** fonts, images, third-party script deferral, security headers, routing, i18n, any visual design.
