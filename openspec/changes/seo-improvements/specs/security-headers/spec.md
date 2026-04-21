## ADDED Requirements

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
The site SHALL return `Content-Security-Policy-Report-Only` with a policy covering `default-src`, `script-src`, `style-src`, `img-src`, `font-src`, `connect-src`, `frame-ancestors`, and a `report-uri` pointing to an external violation reporting endpoint. The site SHALL NOT emit the enforcing `Content-Security-Policy` header in this change.

#### Scenario: CSP-Report-Only present, enforcing CSP absent
- **WHEN** an HTTP client fetches any URL on the site
- **THEN** the response contains `Content-Security-Policy-Report-Only` but does NOT contain `Content-Security-Policy`

#### Scenario: CSP includes report-uri
- **WHEN** the CSP-Report-Only header is inspected
- **THEN** it contains a `report-uri` directive pointing to a valid HTTPS endpoint (report-uri.com account)

#### Scenario: Violations are captured
- **WHEN** a page load triggers a CSP violation (e.g. an unexpected inline script)
- **THEN** the browser issues a POST to the `report-uri` endpoint, and the violation is visible in the report-uri.com dashboard
