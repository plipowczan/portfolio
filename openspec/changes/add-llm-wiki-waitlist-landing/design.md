## Context

Single-screen PL waitlist landing under the existing Vite/React portfolio. The product is `LLM Wiki` — a markdown second-brain that grows itself (Karpathy concept, OKF standard, index-first, `git clone`-portable). Audience: Tribe #4 builders — technical, terminal-native, PL. The portfolio already ships a neon-on-near-black theme, `gradient-text`/`glow`, Fira Code mono, and a `NetworkBackground` node-graph canvas — the strongest available metaphor for "a knowledge base that grows."

## Goals / Non-Goals

**Goals:** capture emails before Tribe #4; a visually distinctive page (not a templated centered SaaS hero); reuse locked theme + Formspree + prerender; deliver the template + quick-start on signup.

**Non-Goals:** selling, pricing, EN mirror, outbound mailing/autoresponder, dedicated OG image, new dependencies.

## Decisions

### Visual direction — "Żywa nota" (the living note)
The hero is a markdown note on a growing graph. Rejected the plan's original centered hero + 3 equal cards as the templated default (no POV, ignores the product's native materials, leaves mono and the graph metaphor unused).

- **Palette:** locked tokens only — ink `#050810`, panel `dark-700/800`, signal `primary-500 #00ff9d`, link `secondary-500 #00b8ff`, mute `gray-400`. No new colors.
- **Type:** H1 in Inter `gradient-text` prefixed by a mono green `#` (bridges site DNA + markdown). Fira Code (`font-mono`) is the accent voice: eyebrow, the index block, `[[wikilinks]]`, the slash-commands. Mono used as signal, not for paragraphs.
- **Eyebrow:** `second-brain/llm-wiki.md  ● live` — announces the note without fake OS window chrome.
- **Signature element:** an `index.md` block rendering the 3 value props as numbered entries `00 / 01 / 02 ◍ [[Prose title]]`. Numbering is earned (mirrors the repo's real OKF numbered notes; prop #1 is literally "index-first"), not decoration.
- **Motion (one beat):** `GrowingNetworkBackground` accretes nodes while the visitor reads = "rośnie sama" shown, not told. `STAGGER_CONTAINER` reveals the note. `prefers-reduced-motion` ⇒ single static frame, no spawn, no drift.

### GrowingNetworkBackground — separate fork, not a mutation
`NetworkBackground` is shared by Home/Hero. To avoid regression we fork it into a new file. New behavior: seed ~12 nodes, spawn one new node near an existing one every ~1.2s up to a cap (~40), new nodes fade in, edges auto-form via the existing distance<150 logic. `aria-hidden`. Reduced-motion branch draws one frame and skips the rAF loop + spawn timer.

### Gated delivery (A, clean gate)
The repo link is hidden before signup and revealed only in the success screen. This makes the email a real exchange ("zostaw maila → dostaniesz szablon") and maximizes capture. No escape-hatch link for non-signers (repo is still public on GitHub for anyone who hunts; the page just doesn't hand it over for free). Considered B (page + autoresponder email) — deferred because Formspree autoresponse is a paid feature; outbound mailing lands with the July newsletter migration.

### Email backend = Formspree, capture-only
Reuse `xblqpqab` with hidden `source: waitlist` + `_subject: "LLM Wiki — waitlist"`. Formspree stores entries and notifies the owner; it does **not** send campaigns. RODO copy says "zgoda na kontakt mailowy", not "zapis do newslettera", to match reality.

### Success screen copy
Source of truth: `2026-06-25_landing-success-screen-copy.md`. Header MUST contain "Jesteś na liście" (Playwright dependency). Body = repo button (`Weź szablon na GitHubie →`) + "Od zera do pierwszego pytania — 5 minut" 5-step guide; slash-commands (`/onboard`, `/ingest`, `/qa`, `/lint`) rendered in Fira Code mono green to match the hero. RODO line is hidden once `status === "success"` (consent already given).

## Risks / Trade-offs

- **Canvas growth not deterministically testable** in E2E — covered indirectly by asserting the `<canvas aria-hidden>` renders; growth + reduced-motion verified manually post-deploy.
- **Gated repo link absent from prerendered HTML** — intentional; the success screen is client-only. Bots index the hook + index block (genuine page content); the repo link is deliberately behind the gate.
- **Single screen vs "obszerna instrukcja"** — resolved by putting the full 5-step guide on the post-signup screen rather than a separate route; the README remains the canonical deep guide, not duplicated on the page beyond the quick-start.

## Migration Plan

Additive only — new route, new component, two registration edits. No data migration. Rollback = remove the route + prerender entry.

## Open Questions

- Dedicated OG image for the campaign (currently inherits `SITE_CONFIG.ogImage`) — optional, post-launch.
- Newsletter/autoresponder migration (July) will later send the repo link to inboxes; the on-page success screen is the today delivery.
