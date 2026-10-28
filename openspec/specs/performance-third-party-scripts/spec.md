# performance-third-party-scripts Specification

## Purpose
TBD - created by archiving change seo-improvements. Update Purpose after archive.

## Requirements

### Requirement: Tracking scripts load off the critical rendering path
Third-party tracking scripts (today the Google Tag Manager `gtag.js` loader) SHALL NOT be injected synchronously in `<head>`. They SHALL be deferred to after the browser signals idle or first interaction, using `requestIdleCallback` where supported with a `setTimeout(2000)` fallback.

Scripts SHALL be injected at most once per page view. An injection routine that can be invoked more than once — for example one that runs both on mount and in response to a visitor action — SHALL guard against adding a second element for the same script.

A tracking script that requires cookie consent SHALL additionally satisfy the consent gate before injection; deferral to idle does not by itself authorise loading it. The two conditions compose: consent decides *whether* the script loads, idle deferral decides *when*.

#### Scenario: gtag.js loader is deferred to idle
- **WHEN** a visitor with accepted consent loads a page on the production host
- **THEN** the `googletagmanager.com` script is injected via `requestIdleCallback`, or via the `setTimeout(..., 2000)` fallback where that API is unavailable
- **AND** its request occurs after First Contentful Paint

#### Scenario: Consent gate is checked before deferral, not after
- **WHEN** a visitor without accepted consent stays on a page beyond the idle and fallback windows
- **THEN** no `googletagmanager.com` script has been injected

#### Scenario: Repeat invocation injects no duplicate
- **WHEN** the analytics injection routine is invoked twice within one page view
- **THEN** exactly one `googletagmanager.com` script element exists in the document

#### Scenario: Queued calls survive the deferral
- **WHEN** analytics configuration or a page view is issued before the deferred loader script has finished loading
- **THEN** the call is queued and takes effect once the script loads, rather than being lost

### Requirement: The site loads no ClickRank script

The site SHALL NOT load the ClickRank script (`clickrank.ai`) on any page, neither from a static tag in the HTML nor from a script injected at runtime.

ClickRank ran on every page without consent and was named in neither policy. Its static tag survived in the prerendered HTML next to the runtime injector, so it loaded twice per page view. It was removed on 2026-10-28 (PL-463); this requirement keeps it from returning through either path.

#### Scenario: No request to ClickRank during a page view

- **WHEN** a visitor loads a page and stays beyond the idle and fallback windows
- **THEN** no network request to a `clickrank.ai` host has been issued
