# Tasks

## 1. Regression test, red first

- [x] 1.1 Add the replay block to `tests/e2e/seo-metadata-invariants.spec.js` per design D4: capture a route with `page.content()`, serve it as the next document load, wait for a React-owned canonical on the route, then count. Cover direct loads of `/`, `/en/`, `/blog` and one blog post, plus `/` → `/blog` and `/en/` → `/en/blog` without a document load. Assert one `<title>`, one description and one canonical, the canonical pointing at the current route, and no `<SEO>` tag repeated. Verify: `npx playwright test tests/e2e/seo-metadata-invariants.spec.js --project=chromium -g "prerendered"` fails on the unmodified code, and the failure output shows the counts of 2.

## 2. Swap the prerendered head

- [x] 2.1 Add `src/utils/prerenderedHead.js` with the mark attribute and `collectPrerenderedHead` / `removePrerenderedHead` (design D2, D3), with no React import. Verify: `npm run build` succeeds.
- [x] 2.2 Mark every tag `<SEO>` emits, attribute written last, and remove the collected set in a `useLayoutEffect`. Call `collectPrerenderedHead()` in `src/main.jsx` immediately before `createRoot(...).render`. Verify: the block from 1.1 passes, and the rest of `seo-metadata-invariants.spec.js` still passes on `chromium`.
- [x] 2.3 Update the docs this changes. Record the marking rule in `src/components/AGENTS.md` (it governs `seo/SEO.jsx`). In `src/AGENTS.md` (it governs `main.jsx` and `utils/`), record the `collectPrerenderedHead()` call order, the new util, and why not `hydrateRoot`. In `scripts/AGENTS.md` and the comment above `orderedRoutes` in `scripts/prerender.mjs`, say that `/`-last is now one of two guards. In `tests/AGENTS.md`, describe the replay technique and why it waits on React ownership. Verify: every path cited in the touched docs resolves.

## 3. Integration

- [x] 3.1 Run `npm run build:prerender` on the change and confirm it passes, including `verify-prerender-output.mjs`. Then measure the mounted DOM on `/`, `/en/`, `/blog` and `/blog/slabe-strony-claude-code`, plus both client-side navigations, against `vite preview` of that `dist/`. Request each route at its trailing-slash URL: without the slash, `vite preview` falls back to `dist/index.html`, the home page. For the before column, use production, which serves `main` @ b563130 and each route's own file. A local `main` build gave the same counts. Verify: every after count is 1 (3 for hreflang), and the before/after table is in the pull request.
- [x] 3.2 Run the default suite. Per the map in `.claude/rules/playwright/30-testing.md`, `src/main.jsx` and `src/utils/prerenderedHead.js` are unmapped, so the whole default set runs, not just the `src/components/seo/**` row. Also run `npm run test:unit`. Verify: all green on `chromium` and `Mobile Chrome`.
