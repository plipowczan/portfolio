## 1. Build-time content generator

- [ ] 1.1 Write the generator module that reads `src/content/blog/*.md`, `src/content/blog/en/*.md` and `src/content/kurs/*.md`, parses frontmatter with `gray-matter`, and emits `src/data/generated/index.js` plus one payload module per article and lesson; verify the generated index lists 33 blog entries and 10 lesson entries and that `README.md`, `AGENTS.md` and `CLAUDE.md` are excluded
- [ ] 1.2 Port the existing frontmatter validation into the generator so a missing required field, an unusable `slug`, or an unusable lesson `order` throws with the filename and the problem named; verify by temporarily removing `excerpt` from one article and confirming the build exits non-zero naming that file
- [ ] 1.3 Wrap the generator in a Vite plugin that runs on `buildStart` and watches `src/content/**` in dev; verify that adding a lesson file while `npm run dev` is running makes it appear on `/llm-wiki/kurs` without a restart
- [ ] 1.4 Add `src/data/generated/` to `.gitignore` and confirm a clean checkout builds without it present

## 2. Listings move to the index

- [ ] 2.1 Rewrite `src/data/blogPosts.js` and `src/data/coursePosts.js` to read the generated index, keeping every currently exported function signature (including `getAlternatePost`) so callers are untouched; verify `npm run test:unit` passes
- [ ] 2.2 Point `src/pages/Blog.jsx`, `src/pages/CourseHub.jsx`, the prev/next lesson links in `src/pages/CourseLesson.jsx`, and the language switcher in `src/components/layout/Navigation.jsx` at the index; verify the `blog`, `language-switcher-blog`, `llm-wiki-course` and `llm-wiki-discoverable` specs pass
- [ ] 2.3 Run `npm run build:prerender` and diff the listing HTML in `dist/blog/index.html` and `dist/llm-wiki/kurs/index.html` against a pre-change build; verify the only differences are asset hashes

## 3. Bodies move to on-demand payloads

- [ ] 3.1 Load the article body in `src/pages/BlogPostPage.jsx` and the lesson body in `src/pages/CourseLesson.jsx` via dynamic `import()` of the generated payload, with a pending state and an explicit failure state that offers a way back to the index; verify a throttled-network load shows the pending state and a forced import rejection shows the failure state rather than an empty article
- [ ] 3.2 Set the prerender readiness marker on the document once an article or lesson body has rendered; verify the marker is present in the browser on `/blog/<slug>` and `/llm-wiki/kurs/<slug>`
- [ ] 3.3 Make `scripts/prerender.mjs` wait for the readiness marker on article and lesson routes and exit non-zero naming the route if it does not appear within the timeout; verify by pointing one payload at a missing module and confirming the build fails instead of writing an empty page
- [ ] 3.4 Run `npm run build:prerender` and confirm `dist/blog/<slug>/index.html` and `dist/llm-wiki/kurs/<slug>/index.html` contain body text, not just title and metadata

## 4. Remove the eager path

- [ ] 4.1 Delete the `import.meta.glob(..., { eager: true, query: "?raw" })` calls and the client `gray-matter` import; verify `npm run build` no longer emits the `gray-matter/lib/engines.js` eval warning
- [ ] 4.2 Search the production bundle for a sentence that appears only in an article body and only in a lesson body; verify neither is found
- [ ] 4.3 Update `src/data/AGENTS.md` and `src/data/README.md`, which both document the eager glob as the loading mechanism; verify no doc still describes `eager: true` as current

## 5. Code splitting

- [ ] 5.1 Convert the page imports in `src/App.jsx` to `React.lazy` with a `Suspense` boundary that does not shift layout; verify every route still renders and the SEO metadata suite passes with `PW_PREVIEW=1`
- [ ] 5.2 Add `manualChunks` in `vite.config.js` for `framer-motion`, the `react-markdown`/`remark`/`rehype` group, and `react-icons`; verify the build reports no chunk above 500 kB
- [ ] 5.3 Record the measured gzipped initial homepage JavaScript in this file as task 5.3's result, for the ceiling in task 7.1

## 6. First paint is not gated by animation

- [ ] 6.1 Add the first-load flag module and pass `initial={false}` to the hero's motion elements on first load in `src/components/sections/Hero.jsx`; verify the hero heading's computed opacity never drops below 1 when sampled every 60 ms from navigation commit to 2 s after
- [ ] 6.2 Confirm the entrance animation still plays when navigating to `/` from another route inside the site, and that it stays suppressed under `prefers-reduced-motion: reduce`
- [ ] 6.3 Confirm below-the-fold scroll animations are unchanged on the homepage

## 7. Payload budget gate

- [ ] 7.1 Add the budget check to `npm run build:prerender`: sum the gzipped entry chunk and its static imports, compare against a single declared ceiling set to the task 5.3 measurement plus ~15%, and report measured-vs-ceiling on both pass and fail; verify the build passes at the current size and fails when the ceiling is temporarily lowered
- [ ] 7.2 Add the budget rule to `tests/AGENTS.md` alongside the existing "build-output claims belong to the invariant" note; verify the doc names the constant and where it lives

## 8. Chore and closeout

- [ ] 8.1 Run `npx update-browserslist-db@latest` and update `baseline-browser-mapping`; verify `npm run build` no longer prints the stale-data warnings
- [ ] 8.2 Run `PW_ALL=1 PW_PREVIEW=1 npm test`; verify the full matrix passes
- [ ] 8.3 Verify on a Vercel preview deployment that a blog post and a lesson both return complete HTML — this is the one failure mode local testing has historically missed
- [ ] 8.4 Run the DOX pass: update `src/data/AGENTS.md`, `scripts/AGENTS.md` and `tests/AGENTS.md` for the new generator, the readiness marker and the budget gate, or state explicitly that a doc is unchanged
