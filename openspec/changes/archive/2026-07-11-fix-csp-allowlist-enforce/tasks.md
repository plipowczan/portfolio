## 1. Correct the allowlist in vercel.json (keep Report-Only)

- [x] 1.1 Keep the header key `Content-Security-Policy-Report-Only` (do NOT promote to enforcing)
- [x] 1.2 Set the policy value to the audited Report-Only policy from design.md: `default-src 'self'; script-src 'self' 'unsafe-inline' https://js.clickrank.ai https://vitals.vercel-insights.com https://va.vercel-scripts.com https://app.zencal.io https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://o4511257435308032.ingest.de.sentry.io https://js.clickrank.ai https://formspree.io https://app.zencal.io; frame-src 'self' https://app.zencal.io https://vercel.live; frame-ancestors 'none'; base-uri 'self'; report-uri https://o4511257435308032.ingest.de.sentry.io/api/4511257447432272/security/?sentry_key=35e235d76a965a67ed15c12671c3a01d; report-to csp-endpoint`
- [x] 1.3 Keep `report-uri`, `report-to`, the `Reporting-Endpoints` header, and the Sentry ingest host in `connect-src` unchanged
- [x] 1.4 (Optional hardening, per design Open Questions) Add `base-uri 'self'` to the policy

## 2. Update E2E tests

- [x] 2.1 In `tests/e2e/seo-security-headers.spec.js`, assert response still contains `Content-Security-Policy-Report-Only` and does NOT contain enforcing `Content-Security-Policy`
- [x] 2.2 Assert reporting retained: policy has `report-uri` + `report-to csp-endpoint`, response has `Reporting-Endpoints`
- [x] 2.3 Assert corrected allowlist values: `font-src` has `fonts.gstatic.com`; `style-src` has `fonts.googleapis.com`; `connect-src` has `js.clickrank.ai`, `formspree.io`, `app.zencal.io`; `script-src` has `app.zencal.io`; `frame-src` has `app.zencal.io`
- [x] 2.4 Update any existing assertion that referenced the old (incomplete) policy (existing `default-src 'self'` assertion remains valid)

## 3. Sentry-side quota guard

- [x] 3.1 Resolve the open issues in the `portfolio-csp` project (9/10 allowlist-covered resolved via Sentry MCP; CSP-H `frontend-cdn.perplexity.ai` left for inbound filter 3.2). 2026-07-11 re-triage of the 6 issues open in the last 7d: CSP-8/9/A resolved (policy-covered, silent 6d); CSP-7 (data: font), CSP-J (connect.facebook.net), CSP-K (wasm-eval) ignored forever — external client injection, none loaded by the site (grep of src/ + build = none), so not allowlisted by design.
- [~] 3.2 Add an inbound filter for known uncontrollable client-injected hosts — DEFERRED (blocked by Sentry free plan; custom inbound filters / delete-and-discard require a paid plan). `frontend-cdn.perplexity.ai` isolated as issue CSP-H. See design.md "Plan limitation".
- [~] 3.3 Enable spike protection / rate-limiting on the `portfolio-csp` project — DEFERRED (blocked by Sentry free plan; spike protection + DSN rate limits require a paid plan). Residual noise bounded instead by the allowlist fix (~2 events/mo). See design.md "Plan limitation".

## 4. Deploy and verify

- [x] 4.1 Push to a Vercel preview deployment and run `npm test` (Playwright) — all green — shipped via PR #5 (`d5ec52b`, merged to main → auto-deployed). Targeted header suite run against production (`SEO_HEADERS_URL=https://pawel.lipowczan.pl npx playwright test seo-security-headers`): 4/4 passing (2026-07-11).
- [x] 4.2 Promote to production; confirm responses carry the corrected `Content-Security-Policy-Report-Only` (curl -I) — confirmed 2026-07-11: prod header on `https://pawel.lipowczan.pl/` matches `vercel.json` byte-for-byte, incl. `Reporting-Endpoints`.
- [x] 4.3 Over the following days, confirm `portfolio-csp` event inflow drops to near-zero (only genuine anomalies remain) and quota is no longer being exhausted — confirmed 2026-07-11: allowlist-covered issues (CSP-8/9/A) silent 6d since deploy; only residual client-injected noise remains (CSP-7/J/K, 1–2 events each), matching the design's ~2 events/mo prediction.
