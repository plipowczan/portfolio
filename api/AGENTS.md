# AGENTS.md — api/

## Purpose

Server-side code deployed as Vercel Node functions. One function lives here:
`subscribe.js`, the LLM Wiki waitlist signup.

## Ownership

**Owns:** `subscribe.js` and its request contract.

**Does not own:** the form that calls it (`src/components/`), the CSP allowlist
(`vercel.json`), or the transactional email templates (`emails/`).

## Local Contracts

`POST /api/subscribe` writes one contact into a Resend Audience. It is called
same-origin, so it is covered by CSP `connect-src 'self'`.

Status contract — deviating from it is a behaviour change, not a refactor:

| Condition | Response |
| --- | --- |
| Method other than POST | 405 with an `Allow: POST` header |
| Non-empty honeypot field (`company`) | 200, nothing stored (silent bot drop) |
| Missing or invalid email | 400, Resend not called |
| Missing server configuration | 500 — fails closed, never a fake success |
| Contact created, or already exists | 2xx (idempotent) |
| Upstream network or non-2xx failure | 502 |

- Secrets stay server-side. The Resend API key is read from the environment and
  never reaches the browser.
- No `resend` npm dependency — the function uses global `fetch` (Node 18+).
- Email validation is anchored on purpose; an unanchored `\S+@\S+\.\S+` is too
  permissive for a server-side gate.

## Work Guidance

- A new endpoint is a new file in this folder, exporting a default
  `handler(req, res)`.
- Fail closed on missing configuration. A silent success that stores nothing is
  worse than a 500.
- Env var names belong in `.env.example` with a placeholder value.

## Verification

```bash
node --test tests/unit/subscribe.test.mjs   # 10 tests over the status contract
```

Not `npm run test:unit` — that form is broken on Node 24; see `tests/AGENTS.md`.

## Child DOX Index
