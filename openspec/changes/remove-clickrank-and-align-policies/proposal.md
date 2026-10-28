## Why

The site loads ClickRank (`js.clickrank.ai`), an SEO plugin, on every page without consent, and neither the cookie policy nor the privacy policy names it. A live check on 2026-10-28 (see `design.md`, "Stan przed usunięciem") found it loading twice per page view, posting the page URL to the vendor each time, setting two vendor cookies, and changing nothing on the page except adding duplicate canonical tags. Paweł decided on 2026-10-28 (PL-463) to remove it.

The same reading showed that the policies describe a different site from the one that ships: the cookie policy names Google Fonts, self-hosted since 2026-07-29, and does not name Vercel Analytics, Speed Insights or the Zencal booking widget; the privacy policy names recipients only by category, and the `/llm-wiki` signup form points visitors to a privacy policy that never mentions the list. All three legal pages print "Ostatnia aktualizacja" from `new Date()` at render time, so the static HTML shows the build day and a visitor sees the day of the visit — never the day the text changed.

## What Changes

- **Remove ClickRank completely**: the injector in `index.html`, and with it the static `<script>` tag the prerender baked from it; the `js.clickrank.ai` entries in the CSP `script-src` and `connect-src` in `vercel.json`; the CSP test expectation; the ClickRank scenarios in the specs; the code comment in `src/utils/analytics.js` that cites it.
- **Keep it removed**: `npm run build:prerender` fails when any static HTML file carries an executable script referencing `clickrank.ai`, and an E2E spec asserts no request to it during a page view.
- **Cookie policy (PL and EN)** lists what is actually stored on the device and which third-party services load: the two `localStorage` entries the site writes, Google Analytics cookies only after "Akceptuję", the Zencal widget when the booking window opens, and the cookieless Vercel Analytics and Speed Insights. Google Fonts and the non-existent "font size" preference are removed.
- **Privacy policy (PL and EN)** names each recipient and what it receives: Vercel (hosting, cookieless measurement), Google (Analytics, after consent), Formspree (contact form), Resend (LLM Wiki list), Zencal (booking), Sentry (browser security-violation reports). The LLM Wiki list becomes a named purpose.
- **Fixed "Ostatnia aktualizacja"**: each legal page declares its date next to its existing `@sitemapUpdated` marker, renders it without depending on the render date or the visitor's time zone, and the sitemap step fails the build when the two dates disagree.
- **Scope moved from `consolidate-ui-drift`**: that change's cookie-policy disclosure of Vercel Analytics and Speed Insights (task group 1 and its `analytics-consent` delta) moves here, because this change rewrites the same policy sections. `consolidate-ui-drift` keeps only its refactors.

Policy wording is legal material. It is drafted from what the code and a live check establish, reviewed with the `ss:legal` skill, and anything that cannot be established from the code — lawful basis per processing, safeguards for transfers outside the EEA, retention periods — is raised as an open question in the pull request instead of being asserted in the policy.

## Capabilities

### New Capabilities

- `policy-pages`: the three legal documents show a fixed last-updated date stored with the document, and the cookie and privacy policies name every third-party service the site loads or sends visitor data to — and none it no longer uses.

### Modified Capabilities

- `performance-third-party-scripts`: the deferral requirement is replaced by one without the ClickRank example and its three ClickRank-only scenarios, so it governs the consent-gated `gtag.js` loader alone; a new requirement states that no page loads ClickRank.
- `security-headers`: the CSP allowlist no longer includes `https://js.clickrank.ai`; a scenario asserts its absence, and the list of self-loaded resources is brought up to date.
- `prerender-output-invariants`: the build fails when a static file carries an executable ClickRank script.
- `analytics-consent`: gains the requirement, moved from `consolidate-ui-drift`, that the cookie policy explains which measurement runs regardless of the consent choice and why.

## Impact

- **Code:** `index.html`, `vercel.json`, `src/utils/analytics.js` (comment), `src/pages/PrivacyPolicy.jsx`, `src/pages/TermsOfService.jsx`, `src/pages/CookiePolicy.jsx`, a new pure date formatter in `src/utils/`, `scripts/update-sitemap.js`, `scripts/verify-prerender-output.mjs`.
- **Copy:** `src/locales/pl/legal.json`, `src/locales/en/legal.json`.
- **Tests:** `tests/e2e/seo-security-headers.spec.js` (CSP expectation inverted), a new engine-independent E2E spec for third-party requests, new unit tests for the prerender check and the date formatter.
- **Other change:** `openspec/changes/consolidate-ui-drift/` loses task group 1 and its `analytics-consent` delta.
- **Docs:** `src/AGENTS.md` (legal-page date rule, utils list), `scripts/AGENTS.md` (new prerender check), `tests/AGENTS.md` if the engine-independent list changes.
- **Not touched:** the blog article that describes the 2026-04 ClickRank deferral as a case study (`src/content/blog/spec-driven-seo-portfolio-qamera-ai.md` and its EN translation) — it is published history, and whether to annotate it is left to Paweł. The ClickRank subscription itself, if one exists, is Paweł's to cancel outside the repository.
