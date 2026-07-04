## 1. Config & environment (manual — Resend + Vercel dashboards)

- [x] 1.1 Use the existing **LLM Wiki** Audience in Resend (already created); copy its `audience_id`. Landing + course signups share the same form → `/api/subscribe`, so both land here automatically.
- [ ] 1.2 In Resend, create an API key with contacts + sending scope; copy it once
- [ ] 1.3 Add `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` to Vercel env for **Production and Preview** (server-only — never `VITE_`-prefixed)
- [ ] 1.4 Add the same two vars to local `.env` (gitignored) for running the endpoint unit test locally

## 2. Subscribe endpoint (TDD, unit-tested)

- [x] 2.1 Write failing unit test `tests/unit/subscribe.test.mjs` (built-in `node:test`, stub `globalThis.fetch`) covering: valid new email → Resend called + 2xx; duplicate email → 2xx, no error; missing/invalid email → 4xx, Resend NOT called; non-POST method → 405; non-empty honeypot → 2xx, Resend NOT called; upstream Resend failure → 5xx; response body never contains the API key
- [x] 2.2 Add `"test:unit": "node --test tests/unit"` script to `package.json` (no new dependency)
- [x] 2.3 Implement `api/subscribe.js` (Vercel Node function): guard method (POST only), parse JSON body, reject on non-empty honeypot (return 2xx, no store), validate email server-side, `fetch` `POST https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts` with `Authorization: Bearer ${RESEND_API_KEY}` and `{ email, unsubscribed: false }`, map duplicate/conflict → 2xx, map network/non-2xx → 5xx; read secrets from `process.env`; use only global `fetch` (no `resend` dep)
- [x] 2.4 Run `npm run test:unit` → all endpoint scenarios green

## 3. Landing form cutover

- [x] 3.1 In `src/pages/LlmWikiLanding.jsx`, repoint `handleSubmit` fetch from `FORMSPREE_ENDPOINT` to same-origin `/api/subscribe`; drop `_subject`; keep `email` + `source: "waitlist"` in the body
- [x] 3.2 Add a hidden honeypot input to the form (empty for humans — visually hidden + `tabindex="-1"` + `autocomplete="off"` + `aria-hidden`; NOT the email field); include its value in the POST body
- [x] 3.3 Confirm success/error branching still holds: any `response.ok` (incl. duplicate) → success screen; non-2xx or network error → inline error, form stays (existing `status` logic already does this)
- [x] 3.4 Remove the now-unused `FORMSPREE_ENDPOINT` constant from the landing (contact form keeps its own Formspree usage elsewhere)

## 4. E2E tests repoint (waitlist only)

- [x] 4.1 `tests/e2e/llm-wiki-landing.spec.js`: change both `page.route` mocks from `https://formspree.io/f/xblqpqab` to `**/api/subscribe`; assert POST body matches `{ email, source: "waitlist" }` (drop `_subject`)
- [x] 4.2 Add E2E scenarios: endpoint 2xx for an already-subscribed email → success screen shown; endpoint 500 → success screen NOT shown, inline error visible, form still present
- [x] 4.3 `tests/e2e/llm-wiki-course.spec.js`: repoint the waitlist-CTA mock to `**/api/subscribe`
- [x] 4.4 Do NOT modify `tests/e2e/contact-form.spec.js` or `tests/e2e/seo-security-headers.spec.js` (contact form + CSP allowlist keep Formspree)
- [x] 4.5 Run the affected E2E specs → green (19/19 after `build:prerender`; the course prerender test needs `dist/`)

## 5. Build & preview verification

- [x] 5.1 `npm run build:prerender` → `/llm-wiki` still prerenders (`dist/llm-wiki/index.html` has `rośnie sama` + meta), no EN mirror, no regressions
- [ ] 5.2 Deploy a Vercel **preview**; smoke-test `POST /api/subscribe` returns 2xx (confirms the `/(.*) → /index.html` rewrite does NOT swallow `/api/*`); if swallowed, add an explicit `/api/(.*)` rewrite exclusion in `vercel.json`
- [ ] 5.3 On preview, submit a real test email through the form → confirm the contact appears in the Resend Audience
- [x] 5.4 Confirm the built client bundle contains no `RESEND_API_KEY` value (grep of `dist/assets` clean)

## 6. Production cutover

- [ ] 6.1 Merge to `main` → production deploy
- [ ] 6.2 Verify one real signup end-to-end on production → contact lands in the Audience (rollback if not: revert fetch target to Formspree)

## 7. One-time import of existing 24 addresses (manual runbook)

- [x] 7.1 Build a CSV with an `email` header from `C:\Users\pawel\formspree_llmwiki_waitlist.txt` → `C:\Users\pawel\llmwiki_waitlist.csv` (24 lines → **22 unique** after dedup; kept out of the repo — PII)
- [ ] 7.2 Import via the Resend dashboard CSV upload into the **LLM Wiki** Audience; if the free tier lacks CSV import, run a one-time idempotent Node script (reads the `.txt`, POSTs each via the same REST call, skips existing)
- [ ] 7.3 Verify the **LLM Wiki** Audience holds 22 unique contacts (plus any test signups), no duplicates

## 8. Launch broadcast (manual runbook — GATED)

- [ ] 8.1 Create a Resend broadcast; paste the body from `2026-07-03_mail-waitlist-kurs-live.md`; set `From: …@lipowczan.pl` and `Reply-To:` the personal Gmail
- [ ] 8.2 Replace the "odpisz «stop»" footer with Resend's native `{{{RESEND_UNSUBSCRIBE_URL}}}`
- [ ] 8.3 Send a test to self → verify inbox placement, SPF/DKIM/DMARC = PASS, and the unsubscribe link works
- [ ] 8.4 **GATE:** confirm the course is live at `https://pawel.lipowczan.pl/llm-wiki/kurs`, then send the broadcast to the Audience
