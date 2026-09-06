## 1. Branch setup

- [x] 1.1 Branch from a base that already carries PR #29 and verify `scripts/prerender.mjs` contains `CONTENT_ROUTES` and the `data-content-ready` wait — if either is absent, the base is wrong and the prerender work will conflict. **#29 merged 2026-09-06, so the base is now `main` (`10c0e59`) rather than `perf/speed-up-first-load`; both markers confirmed present.**

## 2. Sitemap lastmod

Independent of PR #29 and of the other two defects. Land first.

- [x] 2.1 Make `getGitLastModDate()` in `scripts/update-sitemap.js` throw instead of returning `new Date()`, covering **both** silent paths — the `catch` and the empty-stdout fall-through — with a message naming the path and which path failed; verify by calling it with a path git does not track and observing a named failure rather than today's date
- [x] 2.2 Ensure the build can resolve git history where it runs. **Scope corrected after measuring a real Vercel build:** the failure is not an unresolvable file. A shallow clone grafts its boundary commit as parentless, so every file untouched since then reports the boundary date — non-empty, well-formed and wrong, which is why the 2.1 guard alone passed a preview build that still emitted 33 fabricated dates. Detect the shallow state with `git rev-parse --is-shallow-repository`, attempt `git fetch --unshallow`, and throw only if the repository is still shallow. Verified in a `--depth 1` clone: before the guard both `src/data/projects.js` and `src/pages/PrivacyPolicy.jsx` reported the same boundary date; after it, 2025-12-01 and 2026-07-29
- [x] 2.3 Regenerate the sitemap and verify the three legal pages carry the commit dates of `PrivacyPolicy.jsx`, `TermsOfService.jsx` and `CookiePolicy.jsx`, and that the eighteen project URLs carry the commit date of `src/data/projects.js` — none of them `2026-07-30` unless that is genuinely the commit date
- [x] 2.4 Verify `<priority>` and `<changefreq>` are still emitted on every URL and listing pages still track the freshest post, per the existing `sitemap-lastmod` requirements this change does not alter

## 3. Structured data

Independent of PR #29. Can land in parallel with group 2.

- [ ] 3.1 Move `src/components/seo/StructuredData.jsx` from the `document.head` append onto `<Helmet>`, escaping JSON so a `<` inside a string cannot terminate the script element; verify the component still renders valid JSON-LD on a blog post
- [ ] 3.2 Run `npm run build:prerender` and verify `dist/privacy-policy/index.html` contains no `Person` block, and `dist/en/index.html` contains exactly one
- [ ] 3.3 Verify each page type still carries the blocks its route declares — blog post keeps `BlogPosting`, `BreadcrumbList` and `FAQPage`; project page keeps its own; course lesson keeps `FAQPage`
- [ ] 3.4 Add the duplicate-and-foreign-block assertion to `scripts/verify-prerender-output.mjs`; verify it fails, naming route and `@type`, against a deliberately broken fixture, and passes on a clean build
- [ ] 3.5 Run the test rows `tests/AGENTS.md` maps to `src/components/seo/**` — `seo-metadata-invariants` (needs `PW_PREVIEW=1`), `breadcrumbs`, `policy-pages`, `seo-llms-txt` — and verify they pass unchanged

## 4. Scrolled capture

Depends on group 1. The gate in 4.4 only goes green once PR #29 is in the base.

- [ ] 4.1 Add a scroll pass to `scripts/prerender.mjs` that runs **after** the `data-content-ready` wait, driving the page to full height and returning to the top; verify on an article route that the document height measured after the pass includes the article body
- [ ] 4.2 Run `npm run build:prerender` and verify the homepage output drops from 67 elements at inline `opacity: 0` to none in the six `whileInView` sections (`#about`, `#skills`, `#projects`, `#testimonials`, `#contact`, booking CTA)
- [ ] 4.3 Verify scroll animation is unchanged for real visitors — the sections still animate on viewport entry in a browser with JavaScript, so PR #29's task 6.3 is not violated
- [ ] 4.4 Add the visibility assertion to `scripts/verify-prerender-output.mjs`, asserting the document `<h1>` and each nav-targeted landmark section are captured visible, deriving the section list from the navigation rather than hardcoding it; verify it fails on a deliberately broken fixture and that a legitimately hidden element (closed mobile menu) does not trip it

## 5. Integration and closeout

- [ ] 5.1 Run `npm run build:prerender` end to end and verify it completes green with all three new assertions active
- [ ] 5.2 Run the default Playwright set (`npm test`) and verify no regression; run `npm run build:prerender` as the check for the `scripts/prerender*` row in `tests/AGENTS.md`
- [ ] 5.3 Reconcile the `prerender-output-invariants` delta with PR #29 — whichever change merges second merges the delta; verify the merged spec carries both #29's JavaScript payload budget requirement and this change's two output invariants
- [ ] 5.4 Run the DOX pass — check whether `scripts/AGENTS.md` and `src/components/AGENTS.md` need updating for the changed prerender contract and the `StructuredData` component contract; state explicitly if nothing changes
- [ ] 5.5 Verify on a Vercel preview deployment that the built site serves visible sections, route-scoped structured data and truthful sitemap dates — **blocked while the Vercel integration produces no deployments**; if it is still silent, record that this step went unverified rather than marking it done
