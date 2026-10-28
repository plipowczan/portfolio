## Context

The contact form (`src/components/sections/ContactForm.jsx`) sends `{ name, email, subject, message }` from the browser to Formspree, which emails it on. `api/subscribe.js` already shows the house pattern for a server-side Resend call: a default-exported `handler(req, res)`, global `fetch`, a honeypot, fail-closed configuration, and a status contract tested in `tests/unit/subscribe.test.mjs` with a stubbed `fetch` and a mock response object. Vercel routes `/api/*` to functions before the SPA rewrite in `vercel.json`, which is how `/api/subscribe` already works in production.

DNS shows `lipowczan.pl` verified in Resend (`resend._domainkey.lipowczan.pl` carries a DKIM key; `send.lipowczan.pl` points to SES `eu-west-1`), and its MX is Microsoft (Outlook). Mail sent from `pawel@lipowczan.pl` through Resend is therefore DKIM-aligned.

This change is built on top of `remove-clickrank-and-align-policies` (PR #56), which rewrites the same `privacy.section7.*` keys, the CSP requirement and the `policy-pages` capability. The delta specs here are written against that change's versions.

## Goals / Non-Goals

**Goals:**

- The contact form keeps its exact visitor-facing behaviour (fields, validation, messages, languages) while its data leaves the browser only for the site's own origin.
- The endpoint has a status contract as explicit as `/api/subscribe`'s, covered by unit tests.

**Non-Goals:**

- Rate limiting or bot detection beyond the honeypot (for example Vercel BotID). Messages can only reach the configured recipient, so the endpoint cannot be used as an open relay; spam volume is the remaining risk and is watched after launch.
- An HTML email or a branded template. Plain text is enough for an inbox and removes the HTML-escaping surface.
- An auto-reply to the visitor.
- Naming Paweł's mailbox provider in the privacy policy (see Open Questions).

## Decisions

### D1 — Same-origin Vercel function calling the Resend REST API with `fetch`

`api/contact.js` mirrors `api/subscribe.js`: `POST https://api.resend.com/emails` with `Authorization: Bearer <RESEND_API_KEY>` and a JSON body `{ from, to: [to], reply_to, subject, text }`.

*Alternatives:* the `resend` SDK (adds a dependency the api folder explicitly avoids); a request from the browser to Resend (would expose the key); keeping Formspree with a DPA (Paweł chose the move on 2026-10-28).

### D2 — Configuration: one reused key, two address variables

Paweł chose on 2026-10-28: `RESEND_API_KEY` (already set for `/api/subscribe`; full access, so it may send), `CONTACT_FORM_FROM` and `CONTACT_FORM_TO`, both `pawel@lipowczan.pl` in production. `CONTACT_FORM_FROM` accepts Resend's `Name <address>` form, so a display name is a Vercel setting, not a code change. Missing any of the three answers 500 without calling Resend, as `/api/subscribe` does.

*Alternative rejected by Paweł:* a separate sending-only key. It would limit the damage of a leaked key to sending mail, but needs a new key in Resend.

### D3 — Reply-To is the visitor; sender and recipient are fixed

The visitor's address goes into `reply_to`, never into `from`: Resend only sends from a verified domain, and a visitor's address in `from` would fail DMARC. "Reply" in Outlook then answers the visitor directly. The recipient comes only from configuration, never from the request.

### D4 — Server validation mirrors the client and adds length limits

| Field | Rule |
| --- | --- |
| `name` | non-empty after trim; at most 200 characters |
| `email` | the anchored regex from `api/subscribe.js`; at most 254 characters |
| `subject` | optional; at most 200 characters; empty → `Wiadomość z formularza kontaktowego` |
| `message` | 10 to 10,000 characters after trim |
| honeypot | non-empty → 200, nothing sent |

The client already enforces the required fields, the email shape (HTML5 `type="email"` plus its own regex) and the 10-character minimum. The upper limits are new; the inputs get matching `maxLength` attributes so a visitor is stopped by the browser rather than by a generic server error. No real message comes near 10,000 characters.

Line breaks in `name` and `subject` are collapsed to spaces before they enter the subject line. Resend's JSON API would not let them become raw SMTP headers, but a single-line subject is what the spec promises regardless of the transport.

The email subject is `[pawel.lipowczan.pl] <subject>`. With sender and recipient both `pawel@lipowczan.pl`, the tag is what an inbox rule can match on.

### D5 — Honeypot named `gotcha`, placed after the submit button

`/llm-wiki` names its honeypot `company`. On a form that also has name and email, a browser autofill profile is likely to fill an organisation field, which would silently drop a real visitor's message. `gotcha` (Formspree's own convention) matches no autofill heuristic. It sits after the submit button so the existing E2E locators, which take the first `input[type="text"]`, still find the name field. It is off-screen, `aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`, exactly like the `/llm-wiki` one. Its label is localized in `home.json` because it is a string in the page, even if hidden.

### D6 — Status contract

| Condition | Response |
| --- | --- |
| Method other than POST | 405 with `Allow: POST` |
| Non-empty honeypot | 200, nothing sent |
| Invalid or oversized field | 400, Resend not called |
| Missing server configuration | 500, Resend not called |
| Resend 2xx | 200 |
| Resend non-2xx, or network failure | 502 |

The client treats any 2xx as success and anything else as the existing error state, so no client change depends on which 4xx or 5xx is returned. Failures are logged with `console.error` (status only, no message content), because a misconfigured sender is otherwise invisible to Paweł: the visitor sees an error and nothing reaches the inbox.

### D7 — Privacy policy copy

§7 drops the Formspree item. The Resend item names both purposes: the LLM Wiki list (email address) and delivering contact-form messages (contact details and the message). The footer names Vercel, Google and Resend as the US vendors, all with DPF plus SCCs, so the "for some of them" qualifier from PR #56 disappears. The `LAST_UPDATED` / `@sitemapUpdated` pair moves to the day the text changes; if this merges after 2026-10-28, both move to the merge day.

## Risks / Trade-offs

- **[Configuration not set before merge]** → The form answers 500 and visitors see the error message with the email address. Mitigation: the PR lists the two variables and asks Paweł to set them first; the Preview deployment lets him send one real message before merging.
- **[The existing key lacks sending permission]** → Same symptom as above; Resend answers 401/403, logged by D6. Mitigation: a test message on the Preview deployment.
- **[Spam without Formspree's filtering]** → Honeypot only. Mitigation: watch the inbox after launch; BotID or a rate limit is a follow-up if needed.
- **[Mail from `pawel@lipowczan.pl` to itself is filtered]** → Outlook may file it oddly. Mitigation: the `[pawel.lipowczan.pl]` subject tag for an inbox rule; changing the sender is a Vercel setting.
- **[Stacked on an unmerged PR]** → Rebase onto `main` once PR #56 merges; this change's `policy-pages` and `security-headers` deltas assume that change is archived first.

## Migration Plan

1. Paweł sets `CONTACT_FORM_FROM` and `CONTACT_FORM_TO` in Vercel (Production and Preview); `RESEND_API_KEY` is already there.
2. On the Preview deployment, send one message through the form and check it arrives with a working Reply-To.
3. Merge. After the switch is live, close or delete the Formspree form `xblqpqab` and export or delete what Formspree still stores (Paweł, outside the repository).

Rollback: revert the merge commit. The Formspree form keeps working until step 3, so a rollback before then needs nothing else.

## Open Questions

- Paweł's mailbox (`pawel@lipowczan.pl`, MX at Microsoft) receives every contact message, and did so under Formspree too. The `policy-pages` rule says the privacy policy names each service that receives visitor data through a form. Whether the controller's own mailbox provider is named, and with which transfer mechanism, is Paweł's decision; it does not change this change's code.
