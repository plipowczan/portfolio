# security-headers Specification

## Purpose
TBD - created by archiving change seo-improvements. Update Purpose after archive.
## Requirements
### Requirement: Site does not emit deprecated X-XSS-Protection header
The site SHALL NOT return the `X-XSS-Protection` header in HTTP responses. This header is deprecated and can introduce vulnerabilities in legacy browsers.

#### Scenario: X-XSS-Protection absent from response
- **WHEN** an HTTP client fetches any URL on the site
- **THEN** the response does NOT contain an `X-XSS-Protection` header

### Requirement: Site emits Referrer-Policy header
The site SHALL return `Referrer-Policy: strict-origin-when-cross-origin` on all responses.

#### Scenario: Referrer-Policy present
- **WHEN** an HTTP client fetches any URL on the site
- **THEN** the response contains `Referrer-Policy: strict-origin-when-cross-origin`

### Requirement: Site emits Permissions-Policy header denying unused capabilities
The site SHALL return `Permissions-Policy` denying browser capabilities that the site does not use (geolocation, camera, microphone, payment, usb, magnetometer, gyroscope).

#### Scenario: Permissions-Policy present with denials
- **WHEN** an HTTP client fetches any URL on the site
- **THEN** the response contains `Permissions-Policy` with `geolocation=()`, `camera=()`, `microphone=()`, `payment=()`, `usb=()`, `magnetometer=()`, and `gyroscope=()`

### Requirement: Site emits HSTS header
The site SHALL return `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` on all responses.

#### Scenario: HSTS header present with two-year max-age
- **WHEN** an HTTP client fetches any URL on the site
- **THEN** the response contains `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

### Requirement: Site emits CSP in Report-Only mode
The site SHALL return `Content-Security-Policy-Report-Only` with a policy covering `default-src`, `script-src`, `style-src`, `img-src`, `font-src`, `connect-src`, `frame-src`, `frame-ancestors`, and a `report-uri` (plus `report-to`) pointing to the external Sentry CSP reporting endpoint. The site SHALL NOT emit the enforcing `Content-Security-Policy` header in this change.

The allowlist SHALL cover every external resource the site loads, so that reported violations represent genuine anomalies rather than self-inflicted noise. It SHALL include at minimum:
- `script-src`: `'self' 'unsafe-inline' https://js.clickrank.ai https://vitals.vercel-insights.com https://va.vercel-scripts.com https://app.zencal.io https://vercel.live`
- `style-src`: `'self' 'unsafe-inline' https://fonts.googleapis.com`
- `font-src`: `'self' https://fonts.gstatic.com`
- `img-src`: `'self' data: https:`
- `connect-src`: `'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://o4511257435308032.ingest.de.sentry.io https://js.clickrank.ai https://formspree.io https://app.zencal.io`
- `frame-src`: `'self' https://app.zencal.io https://vercel.live`
- `frame-ancestors`: `'none'`

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
- **THEN** `style-src` includes `https://fonts.googleapis.com` and `font-src` includes `https://fonts.gstatic.com`
- **AND** `connect-src` includes `https://js.clickrank.ai`, `https://formspree.io`, and `https://app.zencal.io`
- **AND** `script-src` includes `https://app.zencal.io`
- **AND** `frame-src` includes `https://app.zencal.io`

#### Scenario: Genuine anomalies are still captured
- **WHEN** a page load triggers a CSP violation for a resource NOT in the allowlist
- **THEN** the browser issues a POST to the `report-uri` endpoint and the violation is visible in Sentry
- **AND** the resource still loads (Report-Only does not block it)

### Requirement: CSP reporting pipeline is protected against quota exhaustion
The Sentry `portfolio-csp` project receiving CSP reports SHALL be protected so that uncontrollable client-injected violations (browser extensions, AI browsers) cannot exhaust the event quota.

On the current (free) Sentry plan the protection SHALL consist of: (a) a corrected allowlist that eliminates self-inflicted violations — the dominant volume — and (b) per-issue muting (`ignore forever`) of known client-injected hosts as they surface. Project-level inbound filters and spike protection / rate-limiting require a paid Sentry plan; when the project runs on such a plan the protection SHALL additionally include an inbound filter for known client-injected hosts and spike protection / rate-limiting.

#### Scenario: Self-inflicted violations are eliminated
- **WHEN** the corrected allowlist is live in production
- **THEN** resources the site loads itself (Google Fonts, clickrank, Zencal, Formspree) no longer generate CSP reports

#### Scenario: Known client-injected host is muted (free plan)
- **WHEN** a CSP report references a known uncontrollable client-injected host (e.g. `connect.facebook.net`, `wasm-eval:`, a `data:` font)
- **THEN** the corresponding Sentry issue is set to `ignore forever` so it stops consuming triage attention and alerts

#### Scenario: Report spikes are rate-limited (paid plan)
- **WHEN** the project runs on a paid Sentry plan **AND** inbound CSP reports spike well above normal volume
- **THEN** spike protection / rate-limiting caps ingestion so the plan quota is not exhausted

#### Scenario: Known client-injected host is filtered at ingest (paid plan)
- **WHEN** the project runs on a paid Sentry plan **AND** a CSP report references a known client-injected host (e.g. `frontend-cdn.perplexity.ai`)
- **THEN** an inbound filter drops the report before it consumes quota

