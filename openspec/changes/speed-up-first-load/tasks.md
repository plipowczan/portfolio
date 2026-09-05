## 1. Build-time content generator

- [x] 1.1 Write the generator module that reads `src/content/blog/*.md`, `src/content/blog/en/*.md` and `src/content/kurs/*.md`, parses frontmatter with `gray-matter`, and emits `src/data/generated/index.js` plus one payload module per article and lesson; verify the generated index lists 33 blog entries and 10 lesson entries and that `README.md`, `AGENTS.md` and `CLAUDE.md` are excluded

  **Result:** `scripts/generate-content.mjs`. The index lists **60 blog entries and 8 lesson entries**, not the 33/10 in the task line — those were raw `.md` file counts including `README.md`, `AGENTS.md` and `CLAUDE.md`, and counting `blog/` without `blog/en/`. Actual: 30 PL + 30 EN articles, 8 lessons. The three doc files are excluded from every folder.

- [x] 1.2 Port the existing frontmatter validation into the generator so a missing required field, an unusable `slug`, or an unusable lesson `order` throws with the filename and the problem named; verify by temporarily removing `excerpt` from one article and confirming the build exits non-zero naming that file

  **Result:** exit 1 with `Generator treści: Missing required fields in vibe-coding-przewodnik.md: excerpt`. Note the deliberate behaviour change for the blog: the old loader caught per file, logged, and dropped the post; the generator fails the build, as `performance-content-delivery` requires.

- [x] 1.3 Wrap the generator in a Vite plugin that runs on `buildStart` and watches `src/content/**` in dev; verify that adding a lesson file while `npm run dev` is running makes it appear on `/llm-wiki/kurs` without a restart

  **Result:** with `npm run dev` running, dropping `src/content/kurs/9-probny-watcher.md` regenerated the index within seconds and `/llm-wiki/kurs` listed `[[Lekcja probna watchera]]` alongside the eight real lessons. Deleting the file removed the index entry and pruned its payload module — back to 8. The dev server was never restarted.

- [x] 1.4 Add `src/data/generated/` to `.gitignore` and confirm a clean checkout builds without it present

  **Result:** `src/data/generated/` deleted, then `npm run build:prerender` run from scratch — the plugin regenerates it in `buildStart`, and the build completed.

## 2. Listings move to the index

- [x] 2.1 Rewrite `src/data/blogPosts.js` and `src/data/coursePosts.js` to read the generated index, keeping every currently exported function signature (including `getAlternatePost`) so callers are untouched; verify `npm run test:unit` passes

  **Result:** every signature kept, plus `loadPostContent` / `loadLessonContent`. Unit suite run as `node --test tests/unit/subscribe.test.mjs` (the `test:unit` script passes a directory, which Node 24 rejects — the trap already recorded in `tests/AGENTS.md`): 10 pass, 0 fail.

- [x] 2.2 Point `src/pages/Blog.jsx`, `src/pages/CourseHub.jsx`, the prev/next lesson links in `src/pages/CourseLesson.jsx`, and the language switcher in `src/components/layout/Navigation.jsx` at the index; verify the `blog`, `language-switcher-blog`, `llm-wiki-course` and `llm-wiki-discoverable` specs pass

  **Result:** no change needed in those four files — they consume the loaders, whose signatures 2.1 kept, so pointing the loaders at the index pointed them at it too.
- [x] 2.3 Run `npm run build:prerender` and diff the listing HTML in `dist/blog/index.html` and `dist/llm-wiki/kurs/index.html` against a pre-change build; verify the only differences are asset hashes

  **Result:** a pre-change `dist/` was captured before any source change and compared after the whole change landed, so the diff covers groups 2–7, not group 2 alone. `/llm-wiki/kurs` rendered body: **byte-identical** after normalising asset hashes. `/blog` rendered body: identical except that four cards in the pre-change capture were frozen mid-stagger (`opacity: 0; transform: translateY(0.28px)`) because the prerenderer snapshot caught the animation running; they are now settled (`opacity: 1; transform: none`). That is the `performance-hydration-paint` requirement doing its job, not a listing regression. In `<head>`, the added tags are `modulepreload` links for the new chunks. Third-party scripts (clickrank, Vercel analytics, speed-insights) are present in both.

## 3. Bodies move to on-demand payloads

- [x] 3.1 Load the article body in `src/pages/BlogPostPage.jsx` and the lesson body in `src/pages/CourseLesson.jsx` via dynamic `import()` of the generated payload, with a pending state and an explicit failure state that offers a way back to the index; verify a throttled-network load shows the pending state and a forced import rejection shows the failure state rather than an empty article

  **Result:** `src/hooks/useContentBody.js` (three states + the readiness marker) and `src/components/ui/ContentBody.jsx` (rendering for each). Verified in Chromium against `/blog/vibe-coding-przewodnik`:
  - payload request aborted → `role="alert"`: *"Nie udało się wczytać treści tego artykułu…"* with a link to `/blog`; the readiness marker stays unset; no empty article body.
  - payload delayed 4 s → `aria-busy="true"` skeleton with *"Wczytuję treść artykułu…"*, replaced by the body once it lands, marker then set.

- [x] 3.2 Set the prerender readiness marker on the document once an article or lesson body has rendered; verify the marker is present in the browser on `/blog/<slug>` and `/llm-wiki/kurs/<slug>`

  **Result:** `data-content-ready` on `<html>`, name shared with the prerenderer through `src/utils/prerenderMarker.js`. Present in the browser and in the prerendered HTML for both route families.
- [x] 3.3 Make `scripts/prerender.mjs` wait for the readiness marker on article and lesson routes and exit non-zero naming the route if it does not appear within the timeout; verify by pointing one payload at a missing module and confirming the build fails instead of writing an empty page

  **Result:** the wait applies to `CONTENT_ROUTES` only — article and lesson routes. The hub and the blog listing render from the index, synchronously, and are not gated.

  Verified by replacing the built payload `dist/assets/2-onboarding-*.js` with a module that throws, then running the prerender against it:

  ```
  📄 Renderuję: /llm-wiki/kurs/2-onboarding
  ⚠️  Treść nie doszła dla trasy /llm-wiki/kurs/2-onboarding — brak znacznika data-content-ready na <html>, strona wyszłaby bez tekstu
  ⚠️  Ponawiam /llm-wiki/kurs/2-onboarding (pozostało 2 prób)...
  ```

  After both retries: `❌ Błąd dla /llm-wiki/kurs/2-onboarding: …`, summary `✅ Sukces: 97 stron / ❌ Błędy: 1 stron`, **exit code 1**. The throw happens before `writeFileSync`, so nothing was written for that route — the previous, complete HTML was still on disk afterwards. No empty article reaches `dist/`.
- [x] 3.4 Run `npm run build:prerender` and confirm `dist/blog/<slug>/index.html` and `dist/llm-wiki/kurs/<slug>/index.html` contain body text, not just title and metadata

  **Result:** stronger than asked — `dist/blog/vibe-coding-przewodnik/index.html` and `dist/llm-wiki/kurs/2-onboarding/index.html` have rendered bodies **byte-identical** to the pre-change build (asset hashes normalised). All 98 routes rendered, 0 failures.

## 4. Remove the eager path

- [x] 4.1 Delete the `import.meta.glob(..., { eager: true, query: "?raw" })` calls and the client `gray-matter` import; verify `npm run build` no longer emits the `gray-matter/lib/engines.js` eval warning

  **Result:** `npm run build` emits no warnings at all — the `eval` warning and the 500 kB chunk warning are both gone.

- [x] 4.2 Search the production bundle for a sentence that appears only in an article body and only in a lesson body; verify neither is found

  **Result:** searched the entry chunk plus its static imports (`index-*.js`, `vendor-motion-*.js`, `vendor-icons-*.js`). Probe from `vibe-coding-przewodnik.md` — not found. Probe from `kurs/2-onboarding.md` — not found.

- [x] 4.3 Update `src/data/AGENTS.md` and `src/data/README.md`, which both document the eager glob as the loading mechanism; verify no doc still describes `eager: true` as current

  **Result:** both rewritten. A repository-wide grep found a third stale doc the task line did not name — `docs/SRS.md` §3.7 still described the eager glob as the implementation — so it was corrected too. What is left is article prose in `src/content/blog/**`, which describes a past state of the code rather than a current rule, and this change's own artifacts.

## 5. Code splitting

- [x] 5.1 Convert the page imports in `src/App.jsx` to `React.lazy` with a `Suspense` boundary that does not shift layout; verify every route still renders and the SEO metadata suite passes with `PW_PREVIEW=1`

  **Deviation, deliberate: `Home` stays a static import.** Lazy-loading it would put a network round trip on the critical path of the one route this change exists to speed up, and would move it out of the budget's reach — the gate measures the entry chunk and its static imports, so a lazy `Home` would make the number look better while the homepage got slower. This is also what design D5 assumes when it says the gate measures "the entry chunk and everything it statically imports". Every other page is lazy, which is where the win is: `react-markdown` + `remark`/`rehype` (99 kB gzipped) now load only on an article or a lesson.

  **Result:** `Suspense` fallback is a `min-h-screen` block, matching every page's own root height, so the footer does not jump. Full chromium run with `PW_PREVIEW=1`: **184 passed, 7 skipped** (the skips are the deployment-only header specs), including the whole `seo-metadata-invariants` suite. Every route renders.
- [x] 5.2 Add `manualChunks` in `vite.config.js` for `framer-motion`, the `react-markdown`/`remark`/`rehype` group, and `react-icons`; verify the build reports no chunk above 500 kB

  **Result:** `vendor-motion` 125.94 kB, `vendor-markdown` 328.86 kB, `vendor-icons` 19.67 kB, entry `index` 491.08 kB. Largest chunk 491.08 kB — the build prints no chunk-size warning.

- [x] 5.3 Record the measured gzipped initial homepage JavaScript in this file as task 5.3's result, for the ceiling in task 7.1

  **Result: 205 467 B = 200.7 kB gzipped** — entry `index` 152.8 kB + `vendor-motion` 40.9 kB + `vendor-icons` 7.0 kB. Before the change: **778.71 kB gzipped** in one 2 429.90 kB chunk. A 74 % reduction, and at the design target of ≤ 200 kB to within a kilobyte.

## 6. First paint is not gated by animation

- [x] 6.1 Add the first-load flag module and pass `initial={false}` to the hero's motion elements on first load in `src/components/sections/Hero.jsx`; verify the hero heading's computed opacity never drops below 1 when sampled every 60 ms from navigation commit to 2 s after

  **Note on the flag's trigger.** The design's "has the app completed its first mount" flips too early once routes are lazy: a page loaded from an `import()` mounts long after the app does, and would read as a client-side navigation on a direct entry. `src/hooks/useFirstLoad.js` therefore flips on the **first pathname change**, which is the property the requirement actually names.

  **Scope beyond the task line.** `performance-hydration-paint` says "WHEN **any** route is entered by direct navigation THEN no element that the prerendered HTML rendered visible plays an entrance animation". Hero alone does not satisfy that, so the same flag also drives the above-the-fold wrapper in `Blog.jsx`, `CourseHub.jsx`, `BlogPostPage.jsx` and `CourseLesson.jsx`. Task 2.3's `/blog` diff shows why it was needed: the pre-change capture froze cards mid-fade.

- [x] 6.2 Confirm the entrance animation still plays when navigating to `/` from another route inside the site, and that it stays suppressed under `prefers-reduced-motion: reduce`
- [x] 6.3 Confirm below-the-fold scroll animations are unchanged on the homepage

  **Measured on the deployed site, after a parallel session flagged it.** The premise in `proposal.md` was taken from a local build and does not hold on Vercel, where `scripts/prerender.mjs` waits 1000 ms instead of 2000 ms and the snapshot catches the hero's ~1600 ms stagger mid-flight. Fetched from production on 2026-09-05: homepage 74 inline `opacity: 0` against 1 `opacity: 1`, hero `<h1 … style="opacity: 0; transform: translateY(13.8694px)">`; `/blog` 27 against 7. The build this change produces, same script and same local 2000 ms: homepage 67 against 8 with the hero at `opacity: 1; transform: none`, and **`/blog` at 0 against 34**. The fix is structural rather than a retune — with `initial={false}` there is no animation for the prerenderer to catch, so the wait time stops mattering above the fold. What stays invisible in the snapshot is the six `whileInView` sections, which the prerenderer never scrolls into view; task 6.3 requires leaving those alone, and they belong to the parallel `fix-build-output-integrity` change. `proposal.md` now records both measurements and the two contact points with that change.

  **All three verified by `tests/e2e/hydration-paint.spec.js`**, added because `tests/AGENTS.md` requires a new spec for a new feature and because these scenarios are otherwise ungated. It samples opacity and `transform` inside the page — a CDP round trip per sample would miss the sub-second dip — and covers: direct load never dips and never moves; client-side navigation both dips and moves; reduced motion does not move; `#about` still animates on scroll. **8/8 green with `--repeat-each=2`.**

  **Two findings from writing it, both real:**
  - Flipping the flag in an effect was too late. `App` renders before the route, but effects run after the whole tree, so the *first* client-side navigation to `/` still read as a direct entry and skipped the animation. The flag now flips during render — a one-way write derived only from router state, so `StrictMode`'s double render is harmless.
  - Under `prefers-reduced-motion: reduce`, Framer's `reducedMotion="user"` suppresses **movement, not the fade**: the hero's `opacity` still animates 0 → 1, `transform` stays put. That is Framer's own behaviour and predates this change, so the spec asserts what the site actually contracts — no movement — rather than an opacity claim that was never true. Framer does render one frame in the `initial` state before dropping it, so the assertion counts *distinct* off-target positions (≤ 1 = a frozen frame, > 3 = a running tween) instead of counting samples, which was flaky under load.

## 7. Payload budget gate

- [x] 7.1 Add the budget check to `npm run build:prerender`: sum the gzipped entry chunk and its static imports, compare against a single declared ceiling set to the task 5.3 measurement plus ~15%, and report measured-vs-ceiling on both pass and fail; verify the build passes at the current size and fails when the ceiling is temporarily lowered

  **Result:** `scripts/check-payload-budget.mjs`, wired in as step 7/7 of `build:prerender`. Ceiling `INITIAL_JS_BUDGET_GZIP_BYTES = 236_000` (205 467 + 15 %). Pass: `200.7 kB po gzipie, pułap 230.5 kB (87 %)`, exit 0. Ceiling temporarily set to 100 000: exit 1 with `200.7 kB po gzipie, pułap 97.7 kB (205 %)` and the file and constant named. Input is Vite's `build.manifest`, not `index.html` — Vite's preload helper injects `modulepreload` at runtime, so the prerendered HTML also lists lazy-route chunks.

- [x] 7.2 Add the budget rule to `tests/AGENTS.md` alongside the existing "build-output claims belong to the invariant" note; verify the doc names the constant and where it lives

## 8. Chore and closeout

- [x] 8.1 Run `npx update-browserslist-db@latest` and update `baseline-browser-mapping`; verify `npm run build` no longer prints the stale-data warnings

  **Result:** `caniuse-lite` refreshed, `baseline-browser-mapping@^2.11.21` added to devDependencies. `npm run build` now prints no warnings of any kind.
- [ ] 8.2 Run `PW_ALL=1 PW_PREVIEW=1 npm test`; verify the full matrix passes

  The six projects cannot run together on this machine: with ~800 MB of 32 GB free, Playwright's workers were killed for memory twice before finishing. Run per project instead, `--workers=1`.

  - **chromium — 184 passed, 7 skipped** (the skips are the deployment-only header specs).
  - **firefox — 167 passed, 1 skipped, 0 failed** (17.0 min).
  - **webkit — 165 passed, 1 flaky (green on retry), 1 skipped, 1 failed.** The failure is `ui-ux-audit` H1: the first `Tab` lands on a carousel button instead of the skip link. Probed on webkit: the skip link **is** the first focusable element in the DOM — Playwright's Windows webkit build follows the macOS rule where `Tab` does not visit links, so it walks to the first `<button>`. Nothing in this change touches the skip link, `Layout`, or the DOM order. Same family as the Windows-local webkit issue already recorded in `docs/TODO.md`; CI runs webkit on Linux, where it passed on `main`.
  - **Worth recording: the documented webkit timeout on `/llm-wiki/kurs/*` did not reproduce.** All eight lesson routes passed on webkit. The lesson pages are exactly what this change made lighter.
  - **Mobile Safari — 165 passed, 1 flaky, 1 skipped, 1 failed** (12.5 min). Same H1 skip-link failure as webkit.
  - **edge — 167 passed, 1 skipped, 0 failed** (11.6 min).
  - **Mobile Chrome — covered by the CI shards** (green), not re-run locally.
  - **CI on the pull request — all four shards green** (chromium ×2, Mobile Chrome ×2), on every commit.

  **A second real fix.** `ui-ux-audit` C1 read `.animate-glow` immediately after `goto`; on the dev server the homepage renders client-side, so the element was not in the DOM yet and the query returned `null` — the assertion that matters (`duration < 0.1s`) never ran. Flaky on webkit, failing on Mobile Safari. Added the missing wait; green twice over on chromium, webkit and Mobile Safari.

  **What remains red locally:** the H1 skip-link test on the two WebKit projects, for the platform reason above. Every other project is green.

  **One real failure found and fixed.** Firefox failed `policy-pages.spec.js` on the canonical tag for `/terms-of-service` and `/cookie-policy`: the page rendered `<html lang="pl">` but its canonical still carried the `/en` prefix. Diagnosed rather than assumed — on the **production build** in Firefox with `navigator.languages = en-US`, `/`, `/blog`, `/privacy-policy`, `/terms-of-service` and `/cookie-policy` all emit an unprefixed canonical, and `dist/` matches, so nothing wrong ships. The stale tag is the documented React 19 + `react-helmet-async` + `StrictMode` behaviour, dev-server only: the tag from the first render survives, and route splitting moved when a policy page mounts relative to i18next settling, which flipped which side of that race Firefox lands on. The spec already forgave a *missing* canonical in dev but not a *stale* one; the tolerance is now symmetric, and canonical is asserted only outside dev — where `seo-metadata-invariants.spec.js` already covers it. Both engines green afterwards.
- [ ] 8.3 Verify on a Vercel preview deployment that a blog post and a lesson both return complete HTML — this is the one failure mode local testing has historically missed

  Needs the pull request to exist first: the check reads the Vercel preview deployment.
- [x] 8.4 Run the DOX pass: update `src/data/AGENTS.md`, `scripts/AGENTS.md` and `tests/AGENTS.md` for the new generator, the readiness marker and the budget gate, or state explicitly that a doc is unchanged

  **Updated:**
  - `src/data/AGENTS.md` — loading mechanism, exclusion-rule reader list, build-time validation (including the blog's drop → fail change), work guidance, verification commands.
  - `scripts/AGENTS.md` — ownership, script table (`generate-content.mjs`, `check-payload-budget.mjs`), the readiness-marker rule, the no-shebang trap, the single-constant ceiling.
  - `tests/AGENTS.md` — the budget gate, next to the existing "build-output claims belong to the invariant" rule.
  - `src/AGENTS.md` — `hooks/` and `utils/` inventories, the static-`Home` rule, the readiness-marker rule for async routes.
  - `src/components/AGENTS.md` — `ContentBody.jsx` in the `ui/` examples.
  - `src/content/AGENTS.md`, `src/content/blog/AGENTS.md`, `src/content/kurs/AGENTS.md` — frontmatter is validated at build time and a bad file now fails the build instead of being dropped.
  - `src/data/README.md`, `src/content/blog/README.md` — Polish human guides, rewritten for the generator.
  - `docs/SRS.md` §3.7 — still described the eager glob as the implementation.
  - `docs/PROJECT_STATUS.md` — the new payload measurement, dated.
  - `.claude/rules/playwright/30-testing.md` — the source-path → spec map now routes the new build scripts and the marker module to `npm run build:prerender`.

  **Deliberately unchanged:** the root `AGENTS.md` (no folder doc added, moved or deleted; the Child DOX Index and the ownership boundary are untouched), `api/AGENTS.md`, `openspec/AGENTS.md`, `remotion/AGENTS.md`, `scripts/README.md` and `tests/README.md` (nothing they describe changed).
