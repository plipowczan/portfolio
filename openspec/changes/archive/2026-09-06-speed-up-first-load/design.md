## Context

See `proposal.md` — Why for the motivation and the measurements.

Three constraints shape the approach:

- **Prerendering is the SEO backbone.** `scripts/prerender.mjs` drives a headless browser over every route and writes the resulting HTML to `dist/`. Anything that moves content behind an asynchronous boundary risks capturing the page before that boundary resolves.
- **Content is file-derived by contract.** `src/content/blog/AGENTS.md` and `src/data/AGENTS.md` establish that adding an article or a lesson means dropping one markdown file — no registry to update. Whatever replaces the eager glob must preserve that.
- **Ports and servers are per-worktree.** `scripts/ports.mjs` derives them from the checkout path. Any new build step must not assume a fixed address.

## Goals / Non-Goals

**Goals:**

- Homepage initial JavaScript under a declared ceiling, enforced by the build.
- Article and lesson bodies fetched per route, with prerendered HTML still complete.
- Frontmatter parsing and validation moved to build time, keeping today's failure modes.
- First paint no longer gated by entrance animation.

**Non-Goals:**

- Changing any visual design, copy, layout, or route.
- A content management system, a database, or a content API. Markdown files stay the source of truth.
- Optimising images, fonts, or third-party scripts — those capabilities are already specified and already correct.
- Server-side rendering. Prerendering at build time stays the mechanism.

## Decisions

### D1 — Generated modules under `src/data/generated/`, not files in `public/`

The build step writes an index module and one payload module per article and lesson into `src/data/generated/`, and the app reaches them with a dynamic `import()`.

*Alternatives considered.* Writing JSON into `public/content/` and fetching it was the obvious shape, but files in `public/` are copied verbatim: no content hash, so they cannot take the immutable long-cache headers the hashed assets get, and a stale payload can outlive a deploy in a visitor's cache. Keeping `import.meta.glob` with `eager: false` was tempting for its small diff, but it leaves `gray-matter` in the client to strip frontmatter at runtime — which is most of the parser weight this change is trying to remove.

Generated modules get Vite's hashing, chunking, and cache headers for free, and no frontmatter parser reaches the browser. The generated directory is a build artifact and is gitignored.

### D2 — Generation runs as a Vite plugin, not a separate npm script

A small plugin generates the index and payloads in `buildStart`, and watches `src/content/**` during `dev` to regenerate on change.

*Alternative considered.* A `prebuild` npm script is simpler to read, but it splits into two truths: `npm run dev` would either need its own invocation or would serve whatever was generated last, and a contributor editing an article in dev would see nothing change. The plugin keeps the "drop a file, it appears" contract that `src/content/blog/AGENTS.md` states.

### D3 — Prerender waits for an explicit readiness signal, not for network idle

Article and lesson routes set a readiness marker on the document once their body has rendered. `scripts/prerender.mjs` waits for that marker on those routes before capturing, and fails the route if it does not appear within a timeout.

*Alternative considered.* Waiting on network idle is what the prerenderer effectively relies on today. It is a heuristic: it cannot distinguish "the content chunk finished loading" from "the analytics beacon finished", and it degrades silently into capturing an empty article. An explicit marker turns the failure into a build error, which is what the `prerender-output-invariants` capability already asks for.

### D4 — First-load detection via a module-scope flag and `initial={false}`

A tiny module exports whether the app has completed its first mount. The hero passes `initial={false}` to Framer Motion on first load — the library's own documented way to adopt the rendered state without animating — and passes its normal `initial` variants afterwards.

*Alternatives considered.* Reading React Router's navigation type conflates a browser back-navigation with a first load. Removing the animation entirely was rejected in the decision round: the animation is kept for client-side navigation. Shortening the delays only makes the flash briefer without unpinning Largest Contentful Paint from it.

### D5 — The budget measures the entry chunk plus its static imports

The gate reads Vite's bundle output, sums the entry chunk and everything it statically imports, gzips each, and compares the total against a ceiling declared as a single constant alongside the other prerender invariants.

Lazily-imported route chunks are deliberately excluded: counting them would punish exactly the code splitting this change introduces. The ceiling is set at the measured post-change value plus roughly 15% headroom. The design target is **≤ 200 kB gzipped**; the actual measured figure is recorded in `tasks.md` when it is known rather than guessed here.

### D6 — The index carries excerpts; bodies never reach a listing

`/blog` renders 30 cards from index entries. An index entry is small (slug, title, excerpt, date, category, cover, reading time, language, alternate slug), so 43 entries stay in the low tens of kilobytes — a rounding error against the 722 KB being removed, and the price of keeping listings synchronous and prerenderable without any fetch.

## Risks / Trade-offs

- **Prerendered articles ship empty.** The highest-consequence failure in this change: the site would look correct in a browser and be blank to crawlers. → D3's explicit marker plus a build failure; the SEO metadata suite and the `perf-image-loading` spec both read prerendered HTML and act as the regression net. Verify on a Vercel preview deployment before merge, not only locally.
- **Generated files drift from source in dev.** → D2's watcher; and the generator is idempotent, so a stale directory is corrected by any build.
- **A content payload fails to load for a real visitor** (deploy mid-session, flaky network). Previously impossible, because the content was already in the bundle. → The spec requires a visible pending state and a recoverable error state rather than an empty article shell.
- **Route splitting adds a request on first navigation to a lazy route.** A modest cost paid by people who navigate, in exchange for a large cost removed from everyone who lands. Preloading on link hover is available later if it proves noticeable; it is not in scope here.
- **The budget gate can block an unrelated deployment.** That is its purpose, but a legitimate dependency addition now needs a deliberate ceiling bump. D5 keeps that to one constant, so the bump is visible in review.
- **`gray-matter` stays a dependency.** It becomes build-only, so the `eval` warning leaves the client bundle but not the repository.

## Migration Plan

1. Land the generator and the index behind the existing loaders, with the eager glob still in place — the index is built and validated, but nothing consumes it yet.
2. Switch listings to the index. Prerender locally and diff `dist/` against a pre-change build: listing HTML should be identical apart from asset hashes.
3. Switch article and lesson routes to on-demand payloads together with D3's readiness marker. This is the step that can break prerendering; verify that `dist/` article HTML contains body text before going further.
4. Remove the eager glob and the client frontmatter parser.
5. Add route splitting and `manualChunks`, then the hero first-load change.
6. Add the budget gate last, with the ceiling set from the measured result.

**Rollback:** each step is independently revertable, and steps 1–2 change no user-visible behaviour. The riskiest step (3) is the one with an explicit build-time failure, so a bad deploy fails rather than publishing empty articles.
