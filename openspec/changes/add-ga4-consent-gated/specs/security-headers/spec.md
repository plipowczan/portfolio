## MODIFIED Requirements

### Requirement: Site emits CSP in Report-Only mode
The site SHALL return `Content-Security-Policy-Report-Only` with a policy covering `default-src`, `script-src`, `style-src`, `img-src`, `font-src`, `connect-src`, `frame-src`, `frame-ancestors`, and a `report-uri` (plus `report-to`) pointing to the external Sentry CSP reporting endpoint. The site SHALL NOT emit the enforcing `Content-Security-Policy` header in this change.

The allowlist SHALL cover every external resource the site loads, so that reported violations represent genuine anomalies rather than self-inflicted noise. It SHALL include at minimum:
- `script-src`: `'self' 'unsafe-inline' https://js.clickrank.ai https://vitals.vercel-insights.com https://va.vercel-scripts.com https://app.zencal.io https://vercel.live https://www.googletagmanager.com`
- `style-src`: `'self' 'unsafe-inline'`
- `font-src`: `'self'` — fonts are self-hosted from `public/fonts/`, so no third-party font origin is allowed
- `img-src`: `'self' data: https:`
- `connect-src`: `'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://o4511257435308032.ingest.de.sentry.io https://js.clickrank.ai https://formspree.io https://app.zencal.io https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com`
- `frame-src`: `'self' https://app.zencal.io https://vercel.live`
- `frame-ancestors`: `'none'`

The Google Tag Manager and Google Analytics origins SHALL be allowlisted in the same change that introduces the script that contacts them, never in a later one. Because the policy runs in Report-Only mode a missing entry blocks nothing, so the only symptom would be self-inflicted violation reports consuming the Sentry event quota — the exact failure the allowlist-completeness rule above exists to prevent.

These origins SHALL remain allowlisted even though the script that uses them loads only after a visitor accepts cookies. A response header cannot vary by a client-side consent value, and an allowlist entry grants no capability by itself: no request is made until the gated script exists.

#### Scenario: CSP-Report-Only present, enforcing CSP absent
- **WHEN** an HTTP client fetches any URL on the site
- **THEN** the response contains `Content-Security-Policy-Report-Only` but does NOT contain `Content-Security-Policy`

#### Scenario: CSP includes report-uri to the Sentry endpoint
- **WHEN** the CSP-Report-Only header is inspected
- **THEN** it contains a `report-uri` directive pointing to the Sentry security/CSP HTTPS endpoint
- **AND** it contains a `report-to csp-endpoint` directive
- **AND** the response contains a `Reporting-Endpoints` header defining `csp-endpoint`

#### Scenario: Allowlist covers self-loaded resources
- **WHEN** the CSP-Report-Only header is inspected
- **THEN** `font-src` is exactly `'self'` and `style-src` does NOT include `https://fonts.googleapis.com`
- **AND** `connect-src` includes `https://js.clickrank.ai`, `https://formspree.io`, and `https://app.zencal.io`
- **AND** `script-src` includes `https://app.zencal.io`
- **AND** `frame-src` includes `https://app.zencal.io`

#### Scenario: Allowlist covers the analytics origins
- **WHEN** the CSP-Report-Only header is inspected
- **THEN** `script-src` includes `https://www.googletagmanager.com`
- **AND** `connect-src` includes `https://www.google-analytics.com` and a wildcard for `google-analytics.com` subdomains
- **AND** `connect-src` includes a wildcard for `analytics.google.com` subdomains

#### Scenario: Accepted consent produces no CSP violations
- **WHEN** a visitor on the production host accepts cookies and browses more than one route
- **THEN** the analytics loader script and its data requests complete
- **AND** no CSP violation report referencing a Google Tag Manager or Google Analytics origin reaches Sentry

#### Scenario: Genuine anomalies are still captured
- **WHEN** a page load triggers a CSP violation for a resource NOT in the allowlist
- **THEN** the browser issues a POST to the `report-uri` endpoint and the violation is visible in Sentry
- **AND** the resource still loads (Report-Only does not block it)
