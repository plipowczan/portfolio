# AGENTS.md — api/

## Purpose

Server-side code deployed as Vercel Node functions. Two functions live here:
`subscribe.js`, the LLM Wiki waitlist signup, and `contact.js`, the contact
form on `/`. Both call Resend.

## Ownership

**Owns:** `subscribe.js`, `contact.js`, and their request contracts.

**Does not own:** the forms that call them (`src/pages/LlmWikiLanding.jsx`,
`src/components/sections/ContactForm.jsx`), the CSP allowlist (`vercel.json`),
or the transactional email templates (`emails/`).

## Local Contracts

Both endpoints are called same-origin, so they are covered by CSP
`connect-src 'self'`. Each status contract below is part of the behaviour —
deviating from it is a behaviour change, not a refactor.

### `POST /api/subscribe`

Writes one contact into a Resend Audience.

| Condition | Response |
| --- | --- |
| Method other than POST | 405 with an `Allow: POST` header |
| Non-empty honeypot field (`company`) | 200, nothing stored (silent bot drop) |
| Missing or invalid email | 400, Resend not called |
| Missing server configuration | 500 — fails closed, never a fake success |
| Contact created, or already exists | 2xx (idempotent) |
| Upstream network or non-2xx failure | 502 |

### `POST /api/contact`

Sends one plain-text email from `CONTACT_FORM_FROM` to `CONTACT_FORM_TO`, with
the visitor's address as `reply_to` and `[pawel.lipowczan.pl]` before the
subject. The visitor's address never goes into `from`: Resend sends only from
a verified domain, and a foreign `from` fails DMARC.

| Condition | Response |
| --- | --- |
| Method other than POST | 405 with an `Allow: POST` header |
| Non-empty honeypot field (`gotcha`) | 200, nothing sent (silent bot drop) |
| Empty name, invalid email, message under 10 characters, or a field over its limit (name 200, email 254, subject 200, message 10,000) | 400, Resend not called |
| Missing server configuration | 500 — fails closed, never a fake success |
| Email accepted by Resend | 200 |
| Upstream network or non-2xx failure | 502, status logged without message content |

The contact honeypot is not named `company` on purpose: a form with name and
email fields invites a browser autofill profile to fill an organisation field,
which would drop a real visitor's message without a trace.

### Both endpoints

- Secrets stay server-side. The Resend API key and the contact recipient are
  read from the environment and never reach the browser or a response body.
- No `resend` npm dependency — the functions use global `fetch` (Node 18+).
- Email validation is anchored on purpose; an unanchored `\S+@\S+\.\S+` is too
  permissive for a server-side gate.

## Work Guidance

- A new endpoint is a new file in this folder, exporting a default
  `handler(req, res)`.
- Fail closed on missing configuration. A silent success that stores or sends
  nothing is worse than a 500.
- Env var names belong in `.env.example` with a placeholder value.

## Verification

```bash
node --test tests/unit/subscribe.test.mjs   # 10 tests over the subscribe contract
node --test tests/unit/contact.test.mjs     # 13 tests over the contact contract
```

`npm run test:unit` runs the whole unit suite, both files included, and CI runs
it too; see `tests/AGENTS.md`.

## Child DOX Index
