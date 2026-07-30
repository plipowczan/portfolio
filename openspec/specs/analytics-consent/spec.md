# analytics-consent Specification

## Purpose
TBD - created by archiving change add-ga4-consent-gated. Update Purpose after archive.
## Requirements
### Requirement: Cookie-setting analytics loads only after explicit consent

The site SHALL NOT load any analytics that sets cookies until the visitor has explicitly accepted them. The stored consent value written by the cookie banner (`localStorage.cookieConsent`) SHALL be the single source of truth, and `"accepted"` SHALL be the only value that permits loading. Absence of a value counts as refusal, so a visitor who has not answered the banner is treated exactly like one who declined.

This requirement exists because the banner already offered a "Reject" button while nothing read its result. Any cookie-setting analytics added without honouring that value would make the button misrepresent what the site does.

#### Scenario: Visitor has not answered the banner

- **WHEN** a visitor loads any page with no `cookieConsent` value in `localStorage`
- **THEN** no `<script>` element with a `googletagmanager.com` source is present in the document
- **AND** no network request is issued to `googletagmanager.com` or `google-analytics.com`
- **AND** no `_ga` cookie is set

#### Scenario: Visitor declined

- **WHEN** a visitor loads any page with `cookieConsent` set to `"rejected"`
- **THEN** no `<script>` element with a `googletagmanager.com` source is present in the document
- **AND** no `_ga` cookie is set

#### Scenario: Visitor accepted

- **WHEN** a visitor loads any page with `cookieConsent` set to `"accepted"` on the production host
- **THEN** a `<script>` element with a `googletagmanager.com` source is injected

#### Scenario: Analytics starts on acceptance without a reload

- **WHEN** a visitor clicks the banner's accept button on the production host
- **THEN** analytics initialises during that same page view
- **AND** an initial page view for the current route is sent

#### Scenario: Closing the banner does not grant consent

- **WHEN** a visitor dismisses the banner with the close control rather than the accept button
- **THEN** the stored consent value is `"rejected"`
- **AND** analytics does not load

### Requirement: Analytics is confined to the production host

Analytics SHALL initialise only when `window.location.hostname` exactly equals the production host. Any other host — the prerender's preview server, the development server, and Vercel preview deployments — SHALL receive no analytics.

Matching SHALL be an exact comparison against a single declared host constant, not a suffix or substring test, so that no subdomain can silently start reporting into the production property.

This requirement is what keeps build-time output of the measured data. The prerenderer drives a headless browser across every route of the site against a local preview server; without this gate each build would register one page view per route.

#### Scenario: Prerendered output contains no analytics

- **WHEN** the prerendered `dist/` is searched for `googletagmanager.com`
- **THEN** no static HTML file contains a reference to it

#### Scenario: Prerender run sends no page views

- **WHEN** the prerender step renders every route through the preview server
- **THEN** no request to `googletagmanager.com` or `google-analytics.com` is issued, regardless of any stored consent value

#### Scenario: Development server does not report

- **WHEN** a page is loaded from the development server with `cookieConsent` set to `"accepted"`
- **THEN** analytics does not initialise, because the hostname is not the production host

#### Scenario: Host constant agrees with the configured site URL

- **WHEN** the production host constant is compared with the hostname of the site URL in the shared site configuration
- **THEN** the two are identical

### Requirement: Every client-side navigation produces exactly one page view

Automatic page-view sending SHALL be disabled at configuration time, and every page view — including the first of a session — SHALL be sent through one explicit call. This keeps a single code path, so the first page of a session carries the same parameters as every later one and cannot be counted twice.

A page view SHALL be sent for each committed route change. Sending SHALL be deferred far enough for the document title to reflect the new route, because the title is set asynchronously after navigation and a page view sent immediately would carry the previous page's title. A deferred send SHALL be cancelled if another navigation commits before it fires, so that routes a visitor passed through without seeing are not reported.

#### Scenario: Second page of a session is recorded

- **WHEN** a visitor with accepted consent navigates from one route to another using in-page navigation
- **THEN** a second page view is sent
- **AND** its page location is the new route's URL

#### Scenario: Page view carries the new route's title

- **WHEN** a page view is sent for a route change
- **THEN** its page title is the title of the route being entered, not of the route being left

#### Scenario: First page view is not duplicated

- **WHEN** analytics initialises and the route listener mounts in the same render
- **THEN** exactly one page view is sent for the entry route

#### Scenario: Rapid navigation reports only the settled route

- **WHEN** a visitor navigates through an intermediate route and leaves it before the deferred send fires
- **THEN** no page view is sent for the intermediate route

### Requirement: Initialisation is idempotent

Initialisation SHALL be safe to invoke more than once. It is called both when a page mounts with consent already stored and when the visitor accepts the banner during a page view; a repeat invocation SHALL NOT inject a second loader script or re-run configuration.

#### Scenario: Accepting when analytics already runs

- **WHEN** initialisation is invoked a second time within one page view
- **THEN** the document still contains exactly one `googletagmanager.com` script element

### Requirement: Consent can be withdrawn from within the site

The site SHALL offer a control that withdraws analytics consent, reachable from the cookie policy page. Activating it SHALL clear the stored consent value so that analytics no longer loads and the banner asks again.

The control SHALL NOT claim to delete cookies already placed by the analytics provider, because it cannot reach them. The cookie policy SHALL state this limitation rather than imply full erasure.

This requirement exists because consent granted by one click must be withdrawable with comparable ease; requiring a visitor to clear browser storage by hand does not meet that bar.

#### Scenario: Withdrawing consent stops analytics

- **WHEN** a visitor with accepted consent activates the withdrawal control on the cookie policy page
- **THEN** the stored consent value is cleared
- **AND** analytics does not load on subsequent page loads
- **AND** the cookie banner is shown again

#### Scenario: Withdrawal control is present in both languages

- **WHEN** the cookie policy page is opened in Polish and in English
- **THEN** each renders the withdrawal control with translated text and no missing translation key

### Requirement: The cookie policy describes the consent gate as implemented

The cookie policy's consent section SHALL describe the behaviour the site actually implements: that analytics runs only after an explicit accept, that declining or dismissing the banner loads nothing, and how consent is withdrawn.

It SHALL NOT assert that continued browsing constitutes consent. That wording predates the current gate and contradicts both the accept-only rule and the presence of a reject button.

#### Scenario: Implied-consent wording is gone

- **WHEN** the cookie policy consent section is read in Polish or in English
- **THEN** it does not state that continuing to browse the site grants consent
- **AND** it states that analytics loads only after an explicit accept

### Requirement: Cookieless analytics remains available without consent

Analytics that sets no cookies and identifies no individual SHALL remain active regardless of the consent value, so that the site keeps a baseline traffic and performance measurement covering all visitors.

Consequently the two measurements SHALL report different totals: the cookieless one counts every visitor, the consent-gated one only those who accepted. This gap is expected and SHALL NOT be treated as a defect.

#### Scenario: Declining leaves cookieless measurement running

- **WHEN** a visitor declines cookies
- **THEN** the cookieless analytics and performance scripts still load
- **AND** no cookie-setting analytics loads

