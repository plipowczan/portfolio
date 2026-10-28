## 1. Remove ClickRank

- [x] 1.1 Delete the ClickRank injector `<script>` block from `index.html`; verify `grep -i clickrank index.html` returns nothing
- [x] 1.2 Remove `https://js.clickrank.ai` from `script-src` and `connect-src` of the Report-Only CSP in `vercel.json`; verify `grep -c clickrank vercel.json` is 0 and the file still parses as JSON
- [x] 1.3 Invert the CSP expectation in `tests/e2e/seo-security-headers.spec.js`: `connect-src` and `script-src` must not contain `https://js.clickrank.ai`; verify the file has no remaining positive ClickRank assertion
- [x] 1.4 Rewrite the `injectWhenIdle` comment in `src/utils/analytics.js` so it no longer cites ClickRank; verify `grep -ri clickrank src/utils` returns nothing
- [x] 1.5 Add a pure, exported check to `scripts/verify-prerender-output.mjs` that finds executable `<script>` elements (external `src` or inline code, skipping JSON-LD) referencing `clickrank.ai`, wire it into `checkPrerenderOutput`, and cover it with `tests/unit/verify-prerender-scripts.test.mjs` (static tag, inline injector, JSON-LD mention, code-sample mention, clean page); verify `npm run test:unit` passes
- [x] 1.6 Add `tests/e2e/third-party-scripts.spec.js`: on `/` and a blog post, no request reaches a `clickrank.ai` host past the 3 s idle window, and the CSP in `vercel.json` does not allowlist it; verify the spec passes on the default projects
- [x] 1.7 DOX: record the new prerender check in `scripts/AGENTS.md`; verify every path it cites exists

## 2. Fixed last-updated date

- [x] 2.1 Add a pure helper in `src/utils/` that formats an ISO `YYYY-MM-DD` date as that calendar day for a locale, in UTC; cover it with a unit test that sets a time zone behind UTC and asserts `pl-PL` and `en-US` output; verify `npm run test:unit` passes
- [x] 2.2 Declare `LAST_UPDATED` under the `@sitemapUpdated` marker in `PrivacyPolicy.jsx`, `TermsOfService.jsx` and `CookiePolicy.jsx`, render it through the helper instead of `new Date()`, and set privacy and cookie policy dates (marker and constant) to the day their copy changes; verify the pages show the declared date on the dev server in both languages
- [x] 2.3 Make `scripts/update-sitemap.js` fail when a page declares `LAST_UPDATED` that differs from its `@sitemapUpdated` marker; verify `npm run blog:sitemap` passes, then fails with a deliberately mismatched date (reverted afterwards)
- [x] 2.4 DOX: add the `LAST_UPDATED` rule to the `@sitemapUpdated` contract and the helper to the `utils/` list in `src/AGENTS.md`; verify the cited files exist

## 3. Policy copy

- [x] 3.1 Draft the cookie-policy and privacy-policy changes (PL and EN) from the inventory in `design.md`: Google Fonts and the "font size" example out; storage entries, Google Analytics after accept, Zencal on booking, Vercel Analytics and Speed Insights in; recipients named by service, LLM Wiki list as a purpose
- [x] 3.2 Review the draft with the `ss:legal` skill; apply remarks that correct a factual or wording error, and record every remark with its outcome for the pull request; verify no sentence asserts a lawful basis, transfer safeguard or retention period that the code or vendor documentation does not establish
- [x] 3.3 Apply the copy to `src/locales/pl/legal.json`, `src/locales/en/legal.json` and the page components; verify `/cookie-policy`, `/en/cookie-policy`, `/privacy-policy` and `/en/privacy-policy` render with no missing key and no mention of Google Fonts or ClickRank
- [x] 3.4 Run the plain-Polish vocabulary gate from `.claude/rules/content/10-prosty-polski.md` on the PL copy; verify no hit in prose
- [x] 3.6 Add to `tests/e2e/policy-pages.spec.js`: each legal page shows the date its file declares (PL and EN, no unresolved key), and the cookie and privacy policies name the services the site loads and none it removed; verify the spec passes on the default projects
- [x] 3.5 Run the `policy-pages`, `a11y-baseline` and `analytics-consent` specs; verify they pass

## 4. Scope move out of consolidate-ui-drift

- [x] 4.1 Remove task group 1, the cookie-policy bullets in `proposal.md` and `design.md`, and `specs/analytics-consent/` from `openspec/changes/consolidate-ui-drift/`, noting that the disclosure moved to this change; verify `openspec validate consolidate-ui-drift` passes

## 5. Integration

- [ ] 5.1 Run `npm run build:prerender`; verify the output check passes and `grep -ril clickrank dist --include=*.html` lists only the case-study article pages
- [ ] 5.2 Run `npm test` and `npm run test:unit`; verify both pass
- [x] 5.3 Run `openspec validate remove-clickrank-and-align-policies --strict`; verify it passes
