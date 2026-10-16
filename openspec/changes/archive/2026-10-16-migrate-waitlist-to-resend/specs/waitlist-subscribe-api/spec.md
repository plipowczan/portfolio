## ADDED Requirements

### Requirement: Waitlist subscribe endpoint upserts contact into Resend

The system SHALL expose a server-side endpoint at `POST /api/subscribe` that accepts a JSON body `{ email, source, <honeypot> }`, and SHALL idempotently create the email as a contact in the configured Resend Audience (`unsubscribed: false`). The endpoint SHALL call the Resend REST API server-side using `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` from server environment variables, without adding a new npm dependency.

#### Scenario: Valid new email is added to the audience
- **WHEN** a client POSTs a valid, previously-unseen email to `/api/subscribe`
- **THEN** the endpoint creates a contact in the Resend Audience
- **AND** responds with a 2xx status

#### Scenario: Already-subscribed email resolves to success
- **WHEN** a client POSTs an email that already exists in the Audience
- **THEN** the endpoint does NOT create a duplicate and responds with a 2xx status (idempotent), indistinguishable from a first-time signup

#### Scenario: Invalid email is rejected
- **WHEN** the POST body has a missing or malformed email
- **THEN** the endpoint responds with a 4xx status and does NOT call the Resend API

#### Scenario: Only POST is accepted
- **WHEN** the endpoint is called with any method other than POST
- **THEN** it responds with 405 Method Not Allowed and does NOT call the Resend API

#### Scenario: Upstream failure surfaces as an error
- **WHEN** the Resend API call fails (network or non-2xx from Resend)
- **THEN** the endpoint responds with a 5xx status so the client can show an error state

### Requirement: Bot submissions are silently dropped via honeypot

The endpoint SHALL treat a non-empty honeypot field as a bot submission: it SHALL NOT create a contact, and SHALL return a success-shaped (2xx) response so the bot receives no signal that it was filtered.

#### Scenario: Honeypot filled by a bot
- **WHEN** the POST body includes a non-empty honeypot field
- **THEN** the endpoint does NOT call the Resend API
- **AND** responds with a 2xx status (no error, no contact created)

#### Scenario: Honeypot empty for a real user
- **WHEN** the POST body includes the honeypot field empty (or absent) and a valid email
- **THEN** the endpoint proceeds to create the contact

### Requirement: Resend API key is never exposed to the client

The Resend API key SHALL exist only in server-side environment variables (never prefixed `VITE_` and never bundled into client assets), and SHALL never appear in any endpoint response body.

#### Scenario: Key stays server-side
- **WHEN** the client receives any response from `/api/subscribe`
- **THEN** the response contains no API key or Resend credential
- **AND** the built client bundle contains no `RESEND_API_KEY` value
