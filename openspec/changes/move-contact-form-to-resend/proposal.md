## Why

The contact form on `/` posts straight from the browser to Formspree (`https://formspree.io/f/xblqpqab`). Formspree, Inc. operates in the US, and its public privacy policy names no mechanism for transfers out of the EEA: no Data Privacy Framework, no standard contractual clauses, no DPA. The privacy policy therefore lists Formspree as US-based and claims no safeguard for it, which the `ss:legal` review of PL-463 rated 🔴 (an EEA transfer with no basis under chapter V of the GDPR). The two ways out were a DPA with SCCs from Formspree or moving the form to the site's own endpoint. On 2026-10-28 Paweł chose to move it.

The `/llm-wiki` signup already works this way: a same-origin Vercel function (`api/subscribe.js`) calls Resend server-side, and Resend documents DPF and SCCs in its DPA. The contact form can use the same provider, so the site sends visitor data to one fewer US vendor and every remaining US vendor has a documented transfer mechanism.

## What Changes

- **New endpoint `POST /api/contact`** (Vercel Node function, `api/contact.js`): validates name, email, optional subject and message on the server, drops honeypot submissions silently, and sends the message as a plain-text email through the Resend REST API to Paweł's inbox, with the visitor's address as `Reply-To`. It fails closed on missing configuration and reports upstream failures as 5xx. No new npm dependency.
- **Configuration**: reuses `RESEND_API_KEY`; adds `CONTACT_FORM_FROM` (sender) and `CONTACT_FORM_TO` (recipient). Both are `pawel@lipowczan.pl` in production, set in Vercel, never in code.
- **Contact form** (`src/components/sections/ContactForm.jsx`) posts to `/api/contact` instead of Formspree. Fields, client validation, the success and error messages, and both languages stay as they are. It gains a hidden honeypot field, as the `/llm-wiki` form has, because Formspree's spam filtering goes away with Formspree. Inputs get a `maxLength` equal to the server's limits.
- **CSP**: `https://formspree.io` leaves `connect-src` in `vercel.json`; the form's request is same-origin and covered by `'self'`.
- **Privacy policy (PL and EN)**: Formspree is no longer named. Resend is named for both the LLM Wiki list and delivering contact-form messages. The transfer sentence lists Vercel, Google and Resend, all with DPF plus SCCs. The page's `LAST_UPDATED` and `@sitemapUpdated` move together.
- **Tests**: unit tests for the endpoint's status contract; the `contact-form` E2E spec mocks `/api/contact`, asserts the request it receives and the success and error states, and asserts nothing goes to Formspree; the CSP and policy specs assert Formspree's absence.

## Capabilities

### New Capabilities

- `contact-form-api`: the server-side contact endpoint, from request validation through delivery by Resend, including the honeypot and the rule that the Resend key and the recipient address never reach the browser. The contact form's switch to the endpoint is part of it.

### Modified Capabilities

- `security-headers`: the CSP allowlist no longer includes `https://formspree.io`; a scenario asserts its absence.
- `policy-pages`: the scenario for services no longer used adds Formspree. (The capability is introduced by `remove-clickrank-and-align-policies`, which archives first.)
- `llm-wiki-landing`: the signup requirement drops its closing sentence that the contact form's use of Formspree is unaffected, which stops being true.

## Impact

- **Code:** new `api/contact.js`; `src/components/sections/ContactForm.jsx`; `vercel.json` (CSP); `src/pages/PrivacyPolicy.jsx` (date pair).
- **Copy:** `src/locales/{pl,en}/legal.json` (§7 items and footer); `src/locales/{pl,en}/home.json` (honeypot label).
- **Tests:** new `tests/unit/contact.test.mjs`; `tests/e2e/contact-form.spec.js`; `tests/e2e/seo-security-headers.spec.js`; `tests/e2e/policy-pages.spec.js`.
- **Config and docs:** `.env.example`; `api/AGENTS.md` (second function and its contract); `.claude/rules/10-setup.md` (stale Formspree example variable); `docs/PRD.md` (contact form backend line).
- **Deployment:** Paweł sets `CONTACT_FORM_FROM` and `CONTACT_FORM_TO` in Vercel (Production and Preview) before merging, or the form answers 500 by design. The Formspree form itself is closed by Paweł outside the repository after the switch is live.
- **Depends on:** `remove-clickrank-and-align-policies` (PR #56), which rewrites the same `privacy.section7.*` keys and the same CSP requirement. This change is built on top of it.
- **Not in scope:** rate limiting or bot detection beyond the honeypot; naming Paweł's own mailbox provider in the policy (raised in the pull request).
