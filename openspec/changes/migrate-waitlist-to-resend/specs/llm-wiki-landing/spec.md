## RENAMED Requirements

- FROM: `### Requirement: Email capture via Formspree tagged as waitlist`
- TO: `### Requirement: Email capture via server endpoint into Resend`

## MODIFIED Requirements

### Requirement: Email capture via server endpoint into Resend

The landing SHALL POST valid submissions to the same-origin `/api/subscribe` endpoint (NOT to Formspree) with a JSON body containing `email` and a `source: "waitlist"` field, plus a hidden honeypot field that real users leave empty. The landing SHALL reject invalid emails client-side before sending any request, SHALL treat any 2xx response — including an already-subscribed email — as success (showing the success screen), and SHALL show an inline error without leaving the form on a non-2xx response or network failure. The contact form's separate use of Formspree is unaffected.

#### Scenario: Invalid email is rejected client-side
- **WHEN** the visitor submits an input that is not a valid email
- **THEN** an inline error (`#waitlist-email-error`) is shown and no request is sent to `/api/subscribe`

#### Scenario: Valid email is submitted to the subscribe endpoint with the waitlist tag
- **WHEN** the visitor submits a valid email
- **THEN** the request goes to the same-origin `/api/subscribe` endpoint
- **AND** the request body includes `email` and `source: "waitlist"`

#### Scenario: Already-subscribed email still shows success
- **WHEN** the endpoint responds 2xx for an email already on the list
- **THEN** the form is replaced in place by the success screen (identical to a first-time signup)

#### Scenario: Endpoint error keeps the form and shows an inline error
- **WHEN** the endpoint responds with a non-2xx status or the request fails
- **THEN** the success screen is NOT shown and an inline error message is displayed
