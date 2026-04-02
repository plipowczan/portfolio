## 1. Core Fix

- [x] 1.1 Modify `LanguageSwitcher` in `src/components/layout/Navigation.jsx` to detect blog post URLs via regex (`/blog/:slug` and `/en/blog/:slug`), look up the alternate post using `getPostBySlug` + `getAlternatePost`, and navigate to the correct translated URL
- [x] 1.2 Add fallback: if no alternate post found, navigate to blog listing in target language (`/en/blog` or `/blog`)

## 2. Testing

- [x] 2.1 Add Playwright E2E test: switching PL→EN on a blog post with different slug navigates to correct EN URL
- [x] 2.2 Add Playwright E2E test: switching EN→PL on a blog post navigates to correct PL URL
- [x] 2.3 Add Playwright E2E test: switching language on non-blog pages still works (prefix behavior unchanged)
- [x] 2.4 Run full test suite to verify no regressions
