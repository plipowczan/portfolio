## 1. GrowingNetworkBackground (accreting graph, reduced-motion safe)

- [x] 1.1 Create `src/components/animations/GrowingNetworkBackground.jsx` — fork of `NetworkBackground`: seed ~12 nodes, spawn 1 node near an existing one every ~1.2s up to cap ~40, new nodes fade in (opacity ramp), edges auto-form via existing distance<150 logic
- [x] 1.2 Render `<canvas aria-hidden="true" className="absolute inset-0 z-0">` with the same dark gradient background
- [x] 1.3 Respect `prefers-reduced-motion`: draw one static seeded frame, skip the rAF loop + spawn timer; clean up listeners/timers on unmount
- [x] 1.4 Do NOT modify the shared `NetworkBackground` (Home/Hero must stay unchanged)

## 2. Landing page + route + static content ("Żywa nota")

- [x] 2.1 Write failing E2E `tests/e2e/llm-wiki-landing.spec.js` (content): `h1` contains "rośnie sama"; exactly 3 `h2` (index entries); `canvas[aria-hidden='true']` visible; privacy link → `/privacy-policy`; GATE: zero links matching `/Weź szablon/i`
- [x] 2.2 Create `src/pages/LlmWikiLanding.jsx`: `SEO` meta, `GrowingNetworkBackground`, eyebrow `second-brain/llm-wiki.md ● live`, H1 with mono `#` prefix + `gradient-text`, `index.md` block (3 props as `00/01/02 ◍ [[Title]]`, titles are the 3 `<h2>`), RODO line → `/privacy-policy`. No repo link (gate). Static CTA placeholder for the form (added in task 3)
- [x] 2.3 Wire route in `src/App.jsx`: import `LlmWikiLanding`, add `<Route path="llm-wiki" element={<LlmWikiLanding />} />` after the index route inside the locale layout
- [x] 2.4 Run content test — PASS

## 3. Waitlist form + gated success screen

- [x] 3.1 Append failing E2E (form + gate): invalid email → `#waitlist-email-error` visible, no POST; valid email → POST body matches `{ email, source: "waitlist" }`, success text `/Jesteś na liście/i` visible, repo link `/Weź szablon/i` now present with correct href, `/pierwszego pytania/i` visible; assert repo link absent before submit
- [x] 3.2 Add `useState` form logic + `handleSubmit` (email validation, POST to `https://formspree.io/f/xblqpqab` with `source: waitlist` + `_subject`, `isSubmitting`/`success`/`error` states)
- [x] 3.3 Replace the static CTA with the form; render the success screen on `status === "success"` per `2026-06-25_landing-success-screen-copy.md` (header "Jesteś na liście", repo button, 5-step guide with mono slash-commands, footer)
- [x] 3.4 Hide the RODO line when `status === "success"`
- [x] 3.5 Run form tests + full file — all green (still exactly 3 `h2`)

## 4. Prerender registration (PL-only) + SEO verification

- [x] 4.1 In `scripts/prerender.mjs` add `/llm-wiki` to `allRoutes` (PL-only, no `/en` mirror)
- [x] 4.2 `npm run build:prerender` — `/llm-wiki` rendered (local chromium binary absent → ran via `PRERENDER_CHANNEL=msedge`, opt-in env added to prerender.mjs; Vercel path unchanged)
- [x] 4.3 Verify `dist/llm-wiki/index.html`: FILE OK, H1 ("rośnie sama") OK, META OK, index.md block OK, GATE OK (no `second-brain-template` in static HTML), NO-EN OK

## 5. Verify

- [x] 5.1 `npm test` (or the landing spec) green across the suite — 3/3 pass on Edge (chromium binary unavailable locally; Edge project added to playwright.config.js)
- [ ] 5.2 Manual post-deploy: growing graph, reduced-motion static frame, full signup → success flow on mobile + desktop
