## Context

See `proposal.md` — Why for the measurements and the two Level A failures.

Two facts about the codebase shape this design:

- **The knowledge is already present, the application is not.** `Modal.jsx` is a correct dialog; `ContactForm.jsx` has complete field ARIA; `MotionConfig reducedMotion="user"` is wired at the app root; `GrowingNetworkBackground` handles reduced motion properly. The gaps are not ignorance — they are places the existing standard was not carried across. That argues for an automated floor rather than another round of hand fixes.
- **Contrast failures are concentrated, not diffuse.** Home, `/blog` and `/en/` produce one decorative failure each; `/llm-wiki` and `/llm-wiki/kurs` produce eleven between them. This is one grey ramp used differently on one visual world, not a site-wide palette problem.

## Goals / Non-Goals

**Goals:**

- Clear both Level A failures and every measured AA failure.
- Leave the floor enforced by a test, so the next surface built inherits it.
- Preserve the LLM Wiki world's identity while making it legible.

**Non-Goals:**

- Changing the brand palette. The green, the two blues and the dark ramp stay exactly as they are; only which grey carries content changes.
- Redesigning the testimonials section. The decision round chose to keep the carousel and make it pausable, not to replace it with a grid.
- AAA conformance, or a light theme.
- Auditing content inside blog articles. This covers the application shell and its components.

## Decisions

### D1 — `gray-400` becomes the floor for secondary text; `gray-600` stops carrying content

Measured on this palette against the composited backgrounds actually used: `gray-400` is 6.76–7.89:1, `gray-500` is 3.55–4.14:1, `gray-600` is 2.27–2.65:1.

So `gray-500` fails at every body size on every background in this design — there is no background here where it is safe, which makes "use `gray-500` for de-emphasis" a trap rather than a choice. The ramp is therefore split by role: `gray-400` and lighter for anything that conveys meaning, `gray-500` and darker for decoration only.

*Alternative considered.* Lightening the dark backgrounds instead would rescue `gray-500` and require no text changes, but it alters the whole site's ground to fix eleven labels on two routes, and the dark ground is the most recognisable thing about the design.

### D2 — Decoration gets a floor and a ceiling

The `[[ ]]` framing moves to roughly 3.5:1 — above the 3:1 legibility floor this change sets for decoration, below the content it frames.

*Alternative considered.* Leaving it at 2.60:1 is defensible on compliance grounds, since it is `aria-hidden` and therefore exempt. It was rejected on craft grounds: a signature device nobody can see is not a signature device. Raising it to 4.5:1 was rejected in the decision round for flattening the hierarchy.

### D3 — Hit area is expanded with padding; painted marks keep their size

Small visual indicators are correct here — an 8 px dot reads as a position indicator in a way a 44 px dot does not. The target grows via transparent padding and negative margin so the layout does not shift.

*Alternative considered.* Enlarging the painted dots meets the requirement with less code and makes the indicator row visually heavy enough to compete with the testimonials it indexes.

### D4 — One `NetworkBackground`, parameterised, rather than two forks kept in step

`GrowingNetworkBackground` was forked from `NetworkBackground` and then gained a reduced-motion branch, an `aria-hidden`, and a resize-repaint fix. None came back. Rather than copying three fixes into the original and leaving two files to drift again, the two collapse into one component with props for seeding, growth and cap.

*Alternative considered.* Backporting the three fixes is a smaller diff and preserves the exact separation the fork's own comment argues for ("kept as a separate file so the shared NetworkBackground is untouched"). It was rejected because the audit found the same fork-and-abandon pattern twice in this codebase; the second instance is being collapsed in `consolidate-ui-drift` for the same reason.

### D5 — The carousel gets an explicit pause control, not only focus-pausing

Pausing on focus satisfies the letter of 2.2.2 for keyboard users, but it is invisible: nothing tells a visitor the content will keep moving, or that they can stop it. A visible toggle also serves pointer users who want to finish reading a testimonial, which hover-pause only serves accidentally.

Under `prefers-reduced-motion` the carousel does not auto-advance at all, so the toggle starts in its stopped state and the manual controls carry the interaction.

### D6 — The floor is enforced by a Playwright spec that measures, not by review

A new spec walks the audited routes at a desktop and a phone viewport and asserts, computationally: composited text contrast for every visible text node, resting-state boundary contrast for interactive components, hit-area size for every interactive target, and that the carousel does not advance while a control holds focus.

This is the load-bearing decision of the change. Every finding here was found by measurement and would have been missed by review, and without the spec the same drift reappears on the next surface.

The spec is pinned to `chromium` via the existing `testIgnore` list in `playwright.config.js`, since contrast and geometry do not vary by engine — except the target-size and overflow assertions, which are viewport-dependent and therefore run on `Mobile Chrome` too. Per the criterion in `.claude/rules/playwright/30-testing.md`, a file mixing both stays on the default set; this file is written to run on both projects rather than being pinned.

## Risks / Trade-offs

- **The measuring spec produces false positives.** Composited-background computation walks ancestors for the first opaque colour and cannot see gradients, images, or canvas beneath text. → Restrict the assertion to nodes over solid backgrounds and maintain a small, commented allowlist for the hero, where text sits over the canvas. An allowlist that grows is a signal the approach needs revisiting, so its entries carry reasons.
- **The spec becomes slow or flaky** across five routes × two viewports × every text node. → It runs in the default local set, so keep it to the five audited routes and measure once per route after load rather than polling.
- **Collapsing the two canvases regresses `/llm-wiki`,** which has a spec requirement for its growing graph and its reduced-motion behaviour. → The `llm-wiki-landing` requirements "Growing knowledge-graph background, reduced-motion safe" and its scenarios are the acceptance test for D4; run that spec before and after.
- **`100svh` is not understood by older Safari.** → Keep `min-h-screen` as the declared fallback and let `min-h-[100svh]` override it where supported; the failure mode is today's behaviour, not a broken layout.
- **Lifting the greys flattens the LLM Wiki hierarchy.** The whole point of that world is quiet, file-like restraint. → D2's ceiling and the ordering scenario; review the two routes visually at both viewports after the change, not only by measurement.

## Migration Plan

Order is chosen so the enforcement lands before the surfaces it protects:

1. Add the measuring spec first, with the current failures listed as expected. It documents the starting state and turns each subsequent step into a visible reduction.
2. Contrast (D1, D2) — the largest count of findings, no structural risk.
3. Non-text contrast and target size (D3) — mechanical, verified by the spec from step 1.
4. Motion: carousel (D5), then the canvas collapse (D4). The canvas step is the only one that touches a spec-covered behaviour.
5. Naming, status messages, and `svh`.
6. Remove the expected-failure list from the spec; it must pass clean.

**Rollback:** every step is independently revertable and none changes routing, data, or copy beyond one new control label.
