# Spec Delta

## Purpose

Server-side delivery for the contact form on `/`. The endpoint validates the message, drops bot submissions without a signal, and sends it to the site owner's inbox through Resend, so neither the Resend API key nor the recipient address reaches the browser and no third-party form service receives visitor data.

## ADDED Requirements

### Requirement: Contact endpoint delivers the message through Resend

The system SHALL expose a server-side endpoint at `POST /api/contact` that accepts a JSON body `{ name, email, subject, message, <honeypot> }` and, for a valid submission, SHALL send exactly one plain-text email through the Resend REST API. The email SHALL go from the sender configured in `CONTACT_FORM_FROM` to the recipient configured in `CONTACT_FORM_TO`, SHALL carry the visitor's email address as its reply-to address, and SHALL contain the visitor's name, email, subject and message. The endpoint SHALL authenticate with `RESEND_API_KEY` from server environment variables and SHALL NOT add a new npm dependency.

#### Scenario: Valid message is sent

- **WHEN** a client POSTs a valid name, email and message to `/api/contact`
- **THEN** the endpoint sends one email to the configured recipient from the configured sender
- **AND** the email's reply-to address is the visitor's email
- **AND** the email body contains the visitor's name, email and message
- **AND** the endpoint responds with a 2xx status

#### Scenario: Subject is carried

- **WHEN** the POST body has a non-empty subject
- **THEN** the email subject contains it

#### Scenario: Empty subject is defaulted

- **WHEN** the POST body has no subject or an empty one
- **THEN** the email still has a non-empty default subject

#### Scenario: Only POST is accepted

- **WHEN** the endpoint is called with any method other than POST
- **THEN** it responds with 405 Method Not Allowed and an `Allow: POST` header, and does NOT call the Resend API

#### Scenario: Missing configuration fails closed

- **WHEN** `RESEND_API_KEY`, `CONTACT_FORM_FROM` or `CONTACT_FORM_TO` is not set
- **THEN** the endpoint responds with a 5xx status and does NOT call the Resend API

#### Scenario: Upstream failure surfaces as an error

- **WHEN** the Resend API call fails (network error or a non-2xx response)
- **THEN** the endpoint responds with a 5xx status so the form can show its error state

### Requirement: Contact endpoint validates its input on the server

The endpoint SHALL reject a submission with a 4xx status, without calling the Resend API, when the name is empty after trimming or longer than 200 characters, when the email is not a single well-formed address or is longer than 254 characters, when the subject is longer than 200 characters, or when the message is shorter than 10 or longer than 10,000 characters after trimming. Line breaks in the name or the subject SHALL NOT reach the email's header fields.

#### Scenario: Missing or malformed fields are rejected

- **WHEN** the POST body has an empty name, a malformed email, or a message shorter than 10 characters
- **THEN** the endpoint responds with a 4xx status and does NOT call the Resend API

#### Scenario: Oversized fields are rejected

- **WHEN** a field exceeds its limit
- **THEN** the endpoint responds with a 4xx status and does NOT call the Resend API

#### Scenario: Line breaks cannot inject header content

- **WHEN** the subject or the name contains a carriage return or a line feed
- **THEN** the email's subject is a single line

### Requirement: Bot submissions to the contact endpoint are silently dropped

The endpoint SHALL treat a non-empty honeypot field as a bot submission: it SHALL NOT send an email, and SHALL return a success-shaped (2xx) response so the bot receives no signal that it was filtered.

#### Scenario: Honeypot filled by a bot

- **WHEN** the POST body includes a non-empty honeypot field
- **THEN** the endpoint does NOT call the Resend API
- **AND** responds with a 2xx status

#### Scenario: Honeypot empty for a real visitor

- **WHEN** the honeypot field is empty or absent and the rest of the submission is valid
- **THEN** the endpoint sends the email

### Requirement: Contact credentials and recipient stay server-side

The Resend API key and the recipient address SHALL exist only in server-side environment variables (never prefixed `VITE_` and never bundled into client assets), and SHALL never appear in any response body of the endpoint.

#### Scenario: Responses carry no secret

- **WHEN** the client receives any response from `/api/contact`
- **THEN** the response body contains neither the API key nor the recipient address

### Requirement: Contact form submits to the same-origin endpoint

The contact form on `/` and `/en/` SHALL send valid submissions to the same-origin `/api/contact` endpoint as JSON containing `name`, `email`, `subject` (the visitor's, or the localized default subject when left empty), `message`, and a hidden honeypot field that real visitors leave empty and that is outside the keyboard tab order and the accessibility tree. The form SHALL send no request to a third-party form service.

The form's fields, client-side validation, success message and error message SHALL stay as they were before the endpoint existed: a 2xx response shows the success message and clears the fields; a non-2xx response or a network failure shows the error message with the site's email address and keeps what the visitor typed.

#### Scenario: Valid submission goes to the endpoint

- **WHEN** the visitor fills in name, email and message and submits
- **THEN** one POST request goes to the same-origin `/api/contact` with those values and an empty honeypot
- **AND** no request goes to `formspree.io`

#### Scenario: Success clears the form

- **WHEN** the endpoint responds with a 2xx status
- **THEN** the success message is shown and the fields are empty

#### Scenario: Error keeps the visitor's text

- **WHEN** the endpoint responds with a non-2xx status or the request fails
- **THEN** the error message naming the site's email address is shown
- **AND** the fields still hold what the visitor typed

#### Scenario: Invalid input sends nothing

- **WHEN** the visitor submits with a required field empty or an invalid email
- **THEN** a validation message is shown and no request goes to `/api/contact`
