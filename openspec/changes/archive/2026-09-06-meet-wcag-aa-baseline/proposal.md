## Why

An audit measured the rendered site in Chromium at 1440×900 and 393×852 across five routes. The accessibility work already in the codebase is real — a skip link, a correct dialog with a focus trap, fully wired form ARIA, a central reduced-motion configuration — but it has been applied per component rather than as a floor, and the gaps that remain include two **Level A** failures:

- The testimonials carousel advances every 5 s. It pauses on hover and touch but not on keyboard focus — verified: the slide changed while a control held focus. Auto-updating content with no pause mechanism fails WCAG 2.2.2, and there is no live region, so the change is silent to screen readers.
- `NetworkBackground`, the homepage hero canvas, runs an unbounded `requestAnimationFrame` loop with no reduced-motion branch and no `aria-hidden`. Its own fork, `GrowingNetworkBackground`, already implements exactly the right static-frame fallback — the fix exists in the repository and was never brought back to the original.

Measured AA failures on top of that: text at **2.60:1** where 4.5:1 is required (`index.md` / `podstawy.md` section labels and the `01` / `0.2` lesson numbers on `/llm-wiki` and `/llm-wiki/kurs`), text at **4.07:1** (the RODO consent line under the waitlist form, and lesson metadata), form input borders at **1.58:1** against a 3:1 minimum, and carousel dots rendering at **8×8 px** against a 24×24 minimum.

The contrast failures cluster: Home, `/blog` and `/en/` each produce one, both LLM Wiki surfaces produce five and six. The newest visual world was built on a darker grey ramp than the rest of the site.

## What Changes

- **New capability `accessibility-baseline`** — the floor stops being per-component judgement and becomes a stated contract covering text contrast, non-text contrast, target size, motion, status messages, and landmark naming.
- Text contrast: `text-gray-600` stops carrying content. Section labels and lesson numbers on the LLM Wiki surfaces move to `text-gray-400` (measured 7.58:1 on the same ground, still clearly secondary). `text-gray-500` content, including the consent line, moves the same way.
- Decorative `[[ ]]` bracket framing keeps its de-emphasis but is lifted from 2.60:1 to roughly 3.5:1 — it stays below the title in the hierarchy while becoming legible on a bright screen. It is `aria-hidden` and therefore exempt from the requirement; this is a legibility decision, not a compliance one.
- Non-text contrast: form input borders and the language switcher pill reach 3:1 at rest. The cookie banner's "Reject" control gets a boundary of the same weight as "Accept".
- Target size: carousel dots gain a 44×44 hit area around the 8 px visual dot; carousel arrows and footer social links reach 44×44.
- Motion: the carousel pauses on keyboard focus, gains a visible pause control, does not auto-advance under `prefers-reduced-motion`, and announces slide changes politely. `NetworkBackground` gains the reduced-motion branch and the `aria-hidden` its fork already has.
- Status messages: the cookie banner announces itself when it appears.
- Naming: the primary navigation gains an accessible name and marks the current page. Skill level meters expose their value.
- Layout: hero sections use `100svh` instead of `100vh`, so a full-height hero does not overflow past a visible mobile URL bar.

## Capabilities

### New Capabilities

- `accessibility-baseline`: the WCAG 2.2 AA floor every surface of the site meets — contrast for text and for interface components, minimum target size, motion that can be paused and that honours the system preference, announced status messages, and named landmarks.

### Modified Capabilities

- `llm-wiki-landing`: its "Growing knowledge-graph background" requirement currently forbids mutating the shared `NetworkBackground`. Decision D4 collapses the fork back into that shared component, so the clause is replaced by the guarantee it was protecting — growth is opt-in through props, and the homepage cannot inherit it. The accretion and `aria-hidden` requirements are unchanged. **This was missed when the proposal was written:** the section said "None" while D4 planned exactly the mutation the requirement rules out, and the contradiction surfaced during implementation.

`llm-wiki-course` is untouched — it describes routes, capture and gating, and none of its requirements change. The contrast, target-size and motion rules apply site-wide and belong to the new capability.

## Impact

- **Code:** `src/components/sections/Testimonials.jsx` (motion, targets, live region), `src/components/animations/NetworkBackground.jsx` (reduced motion, `aria-hidden`), `src/pages/LlmWikiLanding.jsx` and `src/pages/CourseHub.jsx` and `src/pages/CourseLesson.jsx` and `src/components/sections/CourseFaq.jsx` and `src/components/sections/CourseAudience.jsx` (contrast), `src/components/sections/ContactForm.jsx` (input borders), `src/components/ui/CookieBanner.jsx` (announcement, control weight, close target), `src/components/layout/Navigation.jsx` (landmark name, current page, switcher border), `src/components/layout/Footer.jsx` (target size), `src/components/sections/Hero.jsx` and the other `min-h-screen` hero sections, `src/components/sections/Skills.jsx` (meter semantics).
- **Copy:** new translation keys for the carousel pause control in both languages.
- **Tests:** a new spec asserting the measurable floor — contrast, target size, and carousel pause behaviour — so the gate is automated rather than re-audited by hand.
- **Not touched:** the brand palette itself, layout, information architecture, routes, or any copy other than the new control label. No colour outside the grey ramp changes.
