# Code Review: speed-up-first-load

**Date:** 2026-09-05
**Branch:** `perf/speed-up-first-load` (PR #29)
**Base:** `origin/main` @ `4b29ec7`
**Reviewer note:** self-review of code generated in this session, run before handing the pull request over for merge.

## Stats

- Files modified: 31
- Files added: 8
- Files deleted: 0
- Commits: 8

## Summary

The change removes blog and course markdown from the client bundle, splits routes, stops hydration re-animating above-the-fold content, and adds a payload budget to the build. Initial homepage JavaScript goes from 778.71 kB gzipped to 200.7 kB.

The review looked for defects rather than style. Three candidates were investigated; **one was a real gap and is fixed, two were false alarms and are recorded below so the next reader does not re-open them.**

## Issues Found

### High Priority

#### Issue 1: the generator did not enforce slug and order uniqueness — FIXED

**severity:** high
**file:** `scripts/generate-content.mjs`
**issue:** Two content files sharing a slug silently overwrote each other's content module.
**detail:** A payload module is named after its slug (`blog/<lang>-<slug>.js`, `kurs/<slug>.js`). Two articles with the same `slug` in the same language, or two lessons with the same `slug`, produced two index entries but **one** payload file — the second write won. Nothing failed, nothing warned, and one article silently served another's body. The same applies to a duplicate lesson `order`, which drives hub ordering and the previous/next links: on a tie the order depends on the sort, not on the author.

This gap mattered more after this change than before it. The generator is now the only place frontmatter is validated, and the specification requires an unusable slug to fail the build.

**fix applied:** `assertUnique()` runs over posts (`lang/slug`), lesson slugs, and lesson `order` before anything is written, and throws naming **both** files.

```
❌ Generator treści: Duplicate slug lekcji "2-onboarding" in dup-test.md and
   2-onboarding.md — each one must be unique, the content module is named after it
```

**verified:** duplicating a lesson file exits 1 with the message above; removing it returns the build to green (60 articles, 8 lessons). Current content has no duplicates on any of the three keys.

## Investigated and dismissed

Recorded because both looked like regressions and cost real time to rule out.

### Not an issue: the article meta description

`BlogPostPage` computes `postDescription` as `post.description || (content ? extractFirstParagraph(content) : post.excerpt)`, which depends on the asynchronously loaded body. Suspected regression: the first render emits `excerpt`, and `react-helmet-async` under React 19 is known in this repository to keep the value from the first render.

Checked on the deployed preview against production, for an article with no `description` frontmatter field:

- `<meta name="description">` — identical on both. It was never derived from the body: `<SEO>` is called with `description={post.excerpt}`.
- `BlogPosting` JSON-LD `description` — identical on both, and equal to the article's first paragraph, so the value does settle after the body arrives.

No change in output. The claim in task 3.1 that prerendered metadata is unchanged is correct and now demonstrated rather than asserted.

### Not an issue: the cookie banner in prerendered HTML

`/blog` on the preview still carries one element at `opacity: 0` — the cookie banner, captured mid slide-in. Raised with the parallel `fix-build-output-integrity` session, which correctly declined it: its invariant targets the document `<h1>` and the landmark sections a route declares, not an element count, so a decorative or dialog layer is out of scope by design. A consent banner also should not be visible in static HTML before the consent logic runs.

## Positive findings

- **The riskiest mechanism is proven in the environment that matters.** Article and lesson bodies now load asynchronously, which could have shipped empty pages to crawlers. The readiness marker plus a hard build failure was verified twice: by breaking a payload on purpose (exit 1, 97/98 routes, nothing written for the failing route) and on a real Vercel build (98 routes, 0 failures, `data-content-ready="true"` in the served HTML).
- **The budget gate measures honestly.** `Home` is deliberately left as a static import so the entry chunk still represents the homepage; a lazy `Home` would have improved the number while making the page slower. Input is Vite's manifest rather than the prerendered HTML, because Vite's preload helper injects `modulepreload` at runtime.
- **Failure states are visible.** A failed content fetch renders an alert with a route back, never an empty article shell; the pending state reserves vertical space so nothing jumps.
- **Traps are written down where the next person will hit them:** the missing shebang in `generate-content.mjs` (esbuild bundles it into the Vite config), the `waitForFunction` signature difference between Playwright and Puppeteer, and the rule never to swap the readiness marker for a sleep.
- **Two pre-existing test defects were found and fixed rather than worked around** — an asymmetric dev-mode tolerance in `policy-pages`, and a missing wait in `ui-ux-audit`.

## Standards compliance

- [x] Functional components, arrow functions, destructured props, no PropTypes
- [x] JSDoc on new hooks, components and script exports
- [x] Only `transform` and `opacity` animated; `prefers-reduced-motion` behaviour unchanged
- [x] New Node tooling is `.mjs`; no hardcoded ports; no inlined secrets
- [x] New user-facing strings added to both `locales/pl` and `locales/en`
- [x] DOX pass complete — eleven docs updated, unchanged ones stated explicitly

## Conclusion

**Overall assessment: PASS** (after the fix in Issue 1, which is committed on this branch).

One real defect found and closed; two suspected regressions disproved against the deployed site. Twenty-five of twenty-six tasks are checked; task 8.2 is deliberately left open with its reasoning recorded, because one WebKit test fails locally for a Windows platform reason and CI runs WebKit on Linux.

**Next step:** review and merge are the repository owner's; nothing here blocks them.
