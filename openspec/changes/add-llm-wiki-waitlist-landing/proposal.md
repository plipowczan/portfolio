## Why

Tribe #4 / Value Builders (25.06.2026) is the launch moment for the public `second-brain-template`. We need a public URL before the meeting to capture emails from that audience and seed a build-in-public channel. A single prerendered route under the existing domain (`pawel.lipowczan.pl/llm-wiki`) inherits domain authority immediately, reuses the existing stack/theme/Formspree/prerender, and ships in one deploy — no new service, no new account.

The page sells nothing (the paywall model is still open). Its one job is **capture an email** behind a generic promise: a free template now + "I'll let you know when the course and more materials launch."

## What Changes

- **New PL-only route `/llm-wiki`** — single screen, prerendered for SEO, not mirrored to `/en`.
- **Visual direction "Żywa nota"** — the hero reads as a living markdown note on a *growing* knowledge graph, leaning on the product's own materials (markdown, `[[wikilinks]]`, a numbered index, a node graph that accretes). Reuses the locked theme tokens and Fira Code mono as the accent voice. New background component `GrowingNetworkBackground` (fork of `NetworkBackground`) where nodes accrue while the visitor reads = "rośnie sama"; `prefers-reduced-motion` renders a static frame.
- **Email capture via existing Formspree `xblqpqab`** with hidden `source: waitlist` + `_subject`. Formspree only stores/notifies — it does not send campaigns; outbound mailing is a later (July) newsletter migration, out of scope here.
- **Gated repo delivery** — the repo link and the "first 5 minutes" onboarding are hidden before signup and revealed in an in-place success screen after a valid submit. This gives the email a reason to exist; the page hands over the template only for an address.

Out of scope (deferred): pricing/paywall, course teaser, EN/i18n, separate Formspree form, newsletter migration, autoresponder email, dedicated OG image.

## Capabilities

### New Capabilities
- `llm-wiki-landing`: a prerendered PL waitlist landing at `/llm-wiki` with a gated email-capture form (Formspree, `source: waitlist`), a "Żywa nota" hero, and an in-place success screen delivering the public repo link + a 5-step quick-start.

### Modified Capabilities
<!-- none -->

## Impact

- **Code:** new `src/pages/LlmWikiLanding.jsx`, new `src/components/animations/GrowingNetworkBackground.jsx`, route in `src/App.jsx`, route registration in `scripts/prerender.mjs` (PL-only).
- **Tests:** new `tests/e2e/llm-wiki-landing.spec.js` — content + growing-graph canvas + gate (no repo link pre-signup) + form validation + Formspree payload + success screen.
- **External:** Formspree `xblqpqab` receives waitlist entries tagged `source: waitlist` (filterable in dashboard). No campaign sending.
- **Risk:** Low. New isolated route; reuses existing patterns; no change to shared components (background is a separate fork, Home/Hero untouched). Report-Only CSP already allowlists `formspree.io`.
