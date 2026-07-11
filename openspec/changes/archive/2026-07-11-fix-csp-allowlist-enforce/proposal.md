## Why

The `portfolio-csp` Sentry project blew past the 5,000-event plan quota in ~30 days. Investigation showed this is **not an attack and not Sentry over-logging** — the `Content-Security-Policy-Report-Only` policy in `vercel.json` omits allowlist entries for resources the site loads itself. Google Fonts (imported by `src/styles/index.css`) violates `font-src`/`style-src` on **every page view** (~7,300 reports); `js.clickrank.ai` violates `connect-src` (~410). Report-Only fires a report per violation per pageview indefinitely until the allowlist is corrected.

Correcting the allowlist alone removes ~99.7% of the volume and ends the quota burn. We deliberately **keep Report-Only mode and reporting**: once the self-inflicted noise is gone, every remaining report becomes genuine signal — an alert that something unexpected tried to load. Report-Only never blocks resources, so the site keeps working while we retain visibility. A Sentry-side guard caps the residual, uncontrollable client-injected noise (browser extensions, AI browsers) so it can never re-exhaust the quota.

## What Changes

- **Correct the CSP allowlist** to cover every resource the site actually loads, silencing self-inflicted violations:
  - `style-src`: add `https://fonts.googleapis.com`
  - `font-src`: add `https://fonts.gstatic.com`
  - `connect-src`: add `https://js.clickrank.ai`, `https://formspree.io`, `https://app.zencal.io`
  - `script-src`: add `https://app.zencal.io`, `https://vercel.live`
  - add a `frame-src` directive: `'self' https://app.zencal.io https://vercel.live` (none exists today)
- **Keep `Content-Security-Policy-Report-Only`** (no promotion to enforcing in this change) — preserves "site always works + I get alerted" behaviour.
- **Keep reporting** (`report-uri`, `report-to`, `Reporting-Endpoints` header, Sentry ingest in `connect-src`) so genuine anomalies still surface as Sentry issues.
- **Add a Sentry-side guard** on the `portfolio-csp` project: inbound filter for known uncontrollable client-injected hosts (e.g. `frontend-cdn.perplexity.ai`) plus spike protection / rate-limit, so residual noise cannot re-exhaust the quota.
- Resolve the existing open CSP issues in the `portfolio-csp` project (operational cleanup).

Promotion to an enforcing `Content-Security-Policy` is explicitly **out of scope** and deferred to a future change once we are confident the allowlist is complete.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `security-headers`: The "Site emits CSP in Report-Only mode" requirement is retained but tightened — the allowlist MUST cover the site's real resource set (Google Fonts, clickrank, Zencal, Formspree) so reported violations represent genuine anomalies rather than self-inflicted noise. The reporting endpoint reference is corrected to the actual Sentry CSP endpoint. A new requirement adds quota protection on the reporting pipeline.

## Impact

- **Code:** `vercel.json` (CSP `Content-Security-Policy-Report-Only` directive value only — header name and reporting config unchanged).
- **Tests:** `tests/e2e/seo-security-headers.spec.js` — assert Report-Only retained, reporting retained, and the corrected allowlist values present.
- **External:** Sentry `portfolio-csp` project — add inbound filter + spike protection; resolve existing issues. Event inflow drops to genuine-anomaly levels.
- **Risk:** Low. Report-Only does not block, so no production feature can break from this change. Residual client-injected noise is bounded by the Sentry-side guard, not by the policy.
