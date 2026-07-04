## Why

The `/llm-wiki` waitlist currently POSTs signups to Formspree, which only stores submissions — it cannot send a campaign to the collected list. The first broadcast (the "free LLM Wiki course is live" email) is now due, and the project has committed to Resend as the mailing platform. Formspree's free tier also has no CSV export, so the list cannot even be moved out cleanly. This change captures new signups directly into a Resend Audience and ends the waitlist's dependency on Formspree.

## What Changes

- **NEW** server endpoint `api/subscribe` (Vercel Node function): validates the email, checks a honeypot, and creates a contact in a Resend Audience via the Resend REST API (plain `fetch`, no new npm dependency). Returns success for both new and already-subscribed emails (idempotent), and an error status otherwise.
- **BREAKING (waitlist capture path):** the landing form stops POSTing to `https://formspree.io/f/xblqpqab` and instead POSTs to same-origin `/api/subscribe`. Hard cutover — no Formspree fallback for the waitlist.
- The **contact form keeps using Formspree** (`xblqpqab`) unchanged. Only the waitlist submission migrates. The two were distinguished by the `source` field.
- Spam defense moves from Formspree's built-in filter to a **honeypot field + server-side validation** in the endpoint (no Turnstile / rate-limit — the list is small).
- E2E test mocks for the waitlist repoint from `formspree.io/f/xblqpqab` to `**/api/subscribe`. The contact-form test and the CSP allowlist test are left untouched.
- **Runbook (one-time ops, not persistent code):** import the 24 existing addresses into the Audience (dashboard CSV, idempotent Node script as fallback), then send the launch broadcast with a native Resend unsubscribe link.

## Capabilities

### New Capabilities
- `waitlist-subscribe-api`: server endpoint that accepts a waitlist signup, rejects bots/invalid input, and idempotently upserts the contact into the Resend Audience — never exposing the Resend API key to the client.

### Modified Capabilities
- `llm-wiki-landing`: the "Email capture via Formspree tagged as waitlist" requirement changes — the landing now POSTs to the same-origin `/api/subscribe` endpoint instead of Formspree, and treats an already-subscribed email as success. All other landing requirements (prerender, graph, gated repo, consent copy) are unchanged.

## Impact

- **Code:** new `api/subscribe.js`; `src/pages/LlmWikiLanding.jsx` (one `fetch` target + honeypot field); waitlist E2E specs (`llm-wiki-landing.spec.js`, `llm-wiki-course.spec.js`).
- **Config:** new Vercel env vars `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` (server-only, never `VITE_`-prefixed).
- **Not touched:** CSP (capture is same-origin, covered by `connect-src 'self'`; Formspree stays allowlisted for the contact form), prerender pipeline, `/llm-wiki/kurs` course section, the contact form and its test.
- **External:** Resend Audience (Resend free tier — 24 contacts + one broadcast is far within limits); sending domain `lipowczan.pl` already verified in Resend (DNS confirmed: root MX intact, DKIM `resend._domainkey.lipowczan.pl`, SPF/Return-Path under `send.lipowczan.pl`, DMARC `p=quarantine` passes via alignment).
- **Verify during implementation:** the `vercel.json` catch-all rewrite `/(.*) → /index.html` must not swallow `/api/*` (smoke-test on a preview deploy); exact `contacts.create` behavior on a duplicate (must resolve to success); CSV import availability on the free tier.
