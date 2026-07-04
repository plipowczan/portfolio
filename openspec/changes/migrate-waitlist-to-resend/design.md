## Context

The `/llm-wiki` landing (`src/pages/LlmWikiLanding.jsx`) captures waitlist emails with a client-side `fetch` POST to `https://formspree.io/f/xblqpqab`, sending `{ email, source: "waitlist", _subject }`. The same Formspree endpoint also backs the site's contact form — the two are distinguished only by the `source` field. Formspree stores submissions but cannot send campaigns, and its free tier offers no CSV export (the existing list was hand-collected into a `.txt`).

The project has committed to Resend for both capture and sending. Resend does not host forms: contacts must be created via its API, which requires a secret key that must never reach the browser. The app is a Vite SPA deployed on Vercel with build-time prerender; there is currently no `api/` directory. `vercel.json` uses `framework: vite`, `cleanUrls`, a catch-all rewrite `/(.*) → /index.html`, and a **Report-Only** CSP that allowlists `formspree.io`. The sending domain `lipowczan.pl` is already verified in Resend (DNS confirmed).

A separate in-flight change, `fix-csp-allowlist-enforce`, is moving the CSP from Report-Only to enforced — so the capture path must stay compatible with an enforced `connect-src`.

## Goals / Non-Goals

**Goals:**
- New signups from `/llm-wiki` land in a Resend Audience with no client-exposed secret.
- End the waitlist's dependency on Formspree (hard cutover).
- Preserve the existing landing UX, SEO/prerender, and success-screen behavior exactly.
- Keep the contact form on Formspree, untouched.
- Stay on the Resend free tier and add zero new npm dependencies.

**Non-Goals:**
- Double opt-in / confirmation email (single opt-in — consent already given on the waitlist).
- Rate limiting, CAPTCHA/Turnstile (list is tiny; honeypot suffices).
- Sending the broadcast from code (done via the Resend dashboard).
- Migrating the contact form.
- Building durable import infrastructure (the 24-address import is one-time ops).

## Decisions

### D1 — Same-origin Vercel Node function `api/subscribe` (not Edge, not client-direct)
The browser cannot call Resend directly (the API key would leak). A Vercel serverless function on the default **Fluid Compute / Node runtime** hosts the Resend call server-side. Node (not Edge) per current Vercel guidance (Edge is de-emphasized; Fluid Compute gives regular Node with reduced cold starts). Same-origin path `/api/subscribe` means the request is covered by CSP `connect-src 'self'` — **no CSP change**, even once `fix-csp-allowlist-enforce` enforces the policy.
- *Alternatives:* client-direct (rejected — secret leak); Edge runtime (rejected — no benefit here, weaker Node compat); a third-party form host again (rejected — the thing we're leaving).

### D2 — Hard cutover, no Formspree fallback for the waitlist
The landing's `fetch` target changes from Formspree to `/api/subscribe`; nothing dual-writes. The endpoint is simple, so failure risk is low, and one source of truth avoids drift. Formspree remains live for the contact form, so rollback is a one-line revert of the fetch target.
- *Alternative:* soft cutover writing to both during a bedding-in window (rejected — extra code for a 24-person list; low stakes).

### D3 — Plain `fetch` to the Resend REST API, no SDK
The endpoint issues one HTTPS request to `https://api.resend.com/audiences/{RESEND_AUDIENCE_ID}/contacts` with `Authorization: Bearer ${RESEND_API_KEY}`. Node 18+ has global `fetch`, so no `resend` npm dependency is added — consistent with the landing's "no new deps" constraint.
- *Alternative:* official `resend` SDK (rejected — nicer ergonomics but an added dependency for a single call).

### D4 — Sender identity: root domain `lipowczan.pl` (already verified)
Broadcasts send `From: …@lipowczan.pl`. DMARC (`p=quarantine`) passes via alignment: Resend's DKIM signs `d=lipowczan.pl` (aligned) and SPF/Return-Path run under `send.lipowczan.pl` (relaxed-aligned subdomain). `Reply-To` is set to the personal Gmail so replies ("tell me what works") reach a real inbox. Verified live: root MX (Microsoft) intact, single root SPF record, `resend._domainkey.lipowczan.pl` present; a test send scored SPF/DKIM/DMARC = PASS.

### D5 — Spam defense: honeypot + server-side validation
A hidden honeypot field (empty for humans) plus server-side email validation replace Formspree's filter. A filled honeypot returns a 2xx without storing (no signal to the bot). No rate limiting (serverless in-memory counters don't share state across instances, and the list is tiny).

### D6 — Idempotent capture (duplicate → success)
Re-submitting an existing email must not error or leak "you're already on the list" — the endpoint resolves duplicates to the same 2xx as a first signup. Exact `contacts` API duplicate behavior is verified in implementation and both paths (Resend returns existing vs. returns a conflict) map to success.

### D7 — Import via dashboard CSV, idempotent script as fallback
The 24 addresses are imported by uploading a CSV (`email` header) in the Resend dashboard. If the free tier lacks CSV import, a one-time idempotent Node script (reads the `.txt`, POSTs each via the same REST call, skips existing) is the fallback. Import needs only the API key — not domain verification.

### D8 — Broadcast via dashboard with native unsubscribe
The launch email is sent as a Resend broadcast to the Audience. The mail's "reply STOP" footer is replaced with Resend's native `{{{RESEND_UNSUBSCRIBE_URL}}}` (also sets the `List-Unsubscribe` header). A test send goes to self before the audience send.

## Risks / Trade-offs

- **Catch-all rewrite could swallow `/api/*`** → Vercel resolves filesystem/functions before user `rewrites`, so `/api/subscribe` should win. Mitigation: smoke-test on a preview deploy before cutover; if swallowed, add an explicit rewrite exclusion for `/api/(.*)`.
- **Cold-start latency on first hit** → Fluid Compute reduces it; the form already shows an `isSubmitting` loading state, so UX degrades gracefully.
- **Lost Formspree spam filter** → honeypot + validation cover the common case; monitor the Audience for junk and add Turnstile only if abuse appears.
- **Missing/incorrect env var in production** → endpoint fails closed (5xx → inline error, no false success). Mitigation: set `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` in Vercel for Production *and* Preview before deploy; verify with the preview smoke test.
- **Resend free-tier daily cap (~100/day)** → irrelevant at 24 contacts; revisit only if the list grows past a single-day send.
- **Duplicate-handling assumption wrong** → covered by D6 verification; a failing case surfaces in E2E/manual test before cutover.

## Migration Plan

1. Add `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` to Vercel (Production + Preview).
2. Implement `api/subscribe` + honeypot field on the landing; repoint waitlist E2E mocks (TDD: red → green).
3. Deploy a preview; smoke-test `POST /api/subscribe` (confirms rewrite doesn't swallow it) and submit a real test email → confirm the contact appears in the Resend Audience.
4. Merge to `main` → production; verify one production signup end-to-end.
5. Import the 24 existing addresses (dashboard CSV; script fallback).
6. Prepare the broadcast: paste mail body, swap footer for `{{{RESEND_UNSUBSCRIBE_URL}}}`, set `Reply-To`; send a test to self.
7. **GATE:** confirm the course is live at `/llm-wiki/kurs`, then send the broadcast to the Audience.

**Rollback:** revert the landing's `fetch` target to `https://formspree.io/f/xblqpqab` (Formspree endpoint remains live); no data loss for the contact form at any point.

## Open Questions

- Exact `contacts` API response on a duplicate email (resolve during implementation — both outcomes must map to success).
- Whether the Resend free tier exposes CSV import in the dashboard (resolve during the import step; script fallback ready either way).
