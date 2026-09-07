## 1. Enforcement first

- [x] 1.1 Add `tests/e2e/a11y-baseline.spec.js` measuring, on `/`, `/blog`, `/llm-wiki`, `/llm-wiki/kurs` and `/en/` at a desktop and a phone viewport: composited text contrast per visible text node, resting-state boundary contrast for inputs and buttons, and hit-area size for every interactive target; verify it runs on both default projects and currently reports the known failures
- [x] 1.2 Add the carousel assertion: focus a carousel control, wait longer than one advance interval, and assert the displayed testimonial has not changed; verify it fails against the current implementation
- [x] 1.3 Record the known failures as an explicit expected-failure list inside the spec with a comment naming this change; verify the suite is green so the branch starts from a passing baseline
- [x] 1.4 Add the hero text-over-canvas allowlist entry with its reason; verify no other allowlist entry is needed

## 2. Text contrast

- [x] 2.1 Move the file-name section labels on `src/pages/CourseHub.jsx`, `src/pages/LlmWikiLanding.jsx`, `src/components/sections/CourseFaq.jsx` and `src/components/sections/CourseAudience.jsx` from `text-gray-600` to `text-gray-400`; verify the spec reports at least 4.5:1 for each
- [x] 2.2 Move the lesson ordinals in `src/pages/CourseHub.jsx` and `src/pages/LlmWikiLanding.jsx` to `text-gray-400`; verify measured contrast
- [x] 2.3 Move `text-gray-500` content to `text-gray-400` in `src/pages/LlmWikiLanding.jsx` (consent notice and note) and `src/pages/CourseLesson.jsx` (lesson metadata), and raise the consent notice to `text-sm`; verify measured contrast
- [x] 2.4 Raise the decorative `[[ ]]` framing to approximately 3.5:1 wherever it appears; verify it measures at least 3:1 and lower than the title it frames
- [x] 2.5 Remove the corresponding entries from the expected-failure list; verify the text-contrast assertions pass clean on all five routes

## 3. Non-text contrast and target size

> **Threshold settled 2026-09-06.** The enforced floor is 24×24 (WCAG 2.2 AA,
> SC 2.5.8), not 44×44 — that is SC 2.5.5 at Level AAA, which `design.md` lists
> as a non-goal. The four controls in 3.4–3.6 go to 44×44 anyway as a comfort
> decision. Measured at 44 the floor would have pulled the entire desktop
> navigation, every footer link, the breadcrumbs and each FAQ summary into a
> change whose proposal puts layout out of scope.

- [x] 3.1 Raise the resting border of the contact-form inputs and the waitlist input to at least 3:1, keeping the existing focus treatment; verify the spec's boundary assertion passes
- [x] 3.2 Give the cookie banner's reject control a boundary of the same weight as accept and at least 3:1; verify both measure alike
- [x] 3.3 Raise the language switcher pill border to at least 3:1 and the `|` separator to at least 3:1; verify measured contrast
- [x] 3.4 Wrap the carousel position indicators in a 44×44 hit area with the 8 px painted dot unchanged; verify hit area at both viewports and that the indicator row's layout has not shifted
- [x] 3.5 Size the carousel arrows and the footer social links to a 44×44 hit area with no overlap between adjacent links; verify at the phone viewport
- [x] 3.6 Size the cookie banner close control to 44×44; verify it does not overlap the banner heading at the phone viewport
- [x] 3.7 Bring the targets measured below the 24×24 floor up to it — footer quick links (17 px tall), footer legal links (16 px), breadcrumb links (20 px) and the LLM Wiki inline-flex course link (20 px) — using padding rather than font size, so no type scale changes; verify the floor assertion passes on all five routes at both viewports
- [x] 3.8 Remove the corresponding expected-failure entries; verify the size and boundary assertions pass clean

## 4. Motion

- [x] 4.1 Pause the testimonials auto-advance on `focusin` and resume on `focusout`; verify the carousel assertion from task 1.2 passes
- [x] 4.2 Add a visible, keyboard-operable pause/play control with translated labels in both locales; verify it stops and restarts the advance and that neither locale reports a missing translation key
- [x] 4.3 Suppress auto-advance entirely under `prefers-reduced-motion: reduce`, with the control starting in its stopped state; verify with an emulated reduced-motion context
- [x] 4.4 Wrap the testimonial track in a polite live region so slide changes are announced; verify the accessible name of the region and that it does not announce on every render
- [x] 4.5 Collapse `GrowingNetworkBackground` and `NetworkBackground` into one parameterised component carrying the reduced-motion branch, the `aria-hidden`, and the resize repaint; verify the homepage renders a single static frame under reduced motion and redraws it on resize
- [x] 4.6 Run the `llm-wiki-landing` spec before and after task 4.5; verify the "Growing knowledge-graph background, reduced-motion safe" scenarios still pass

## 5. Naming, status, and viewport

- [x] 5.1 Give the primary `<nav>` in `src/components/layout/Navigation.jsx` a translated accessible name and mark the current page; verify every navigation landmark on a page has a distinct name
- [x] 5.2 Expose the cookie banner as a named, politely-announced region without moving focus; verify it is announced on appearance and that focus stays where it was
- [x] 5.3 Expose the skill level meters' value and range in `src/components/sections/Skills.jsx`; verify the value is readable by assistive technology
- [x] 5.4 Switch the full-height hero sections in `src/components/sections/Hero.jsx`, `src/pages/LlmWikiLanding.jsx` and `src/pages/CourseHub.jsx` to `min-h-[100svh]` with `min-h-screen` retained as the fallback; verify the hero call to action is within the visible viewport at a phone viewport and that no route scrolls horizontally

## 6. Closeout

- [x] 6.1 Delete the expected-failure list from `a11y-baseline.spec.js`; verify the whole spec passes clean with no exclusions beyond the documented hero allowlist entry
- [x] 6.2 Review `/llm-wiki` and `/llm-wiki/kurs` visually at both viewports; confirm the file-like hierarchy still reads and the bracket motif has not become louder than the titles
- [~] 6.3 Run `PW_ALL=1 PW_PREVIEW=1 npm test`; verify the full matrix passes
  - **Not run as written, and deliberately.** `tests/AGENTS.md` states that nothing manual gates a merge: the pull request runs `chromium` + `Mobile Chrome`, the push to `main` runs the full matrix, and full-matrix failures are fixed forward on `main` by design. A local six-project run also cannot finish — `globalTimeout` is 20 minutes outside CI, and this machine kills the run for memory before that: one attempt died after 302 green tests with no failures.
  - **What did run**, on `chromium` and `Mobile Chrome` — the same pair that gates the pull request — against `main` at `c3990d4`, after the rebase that brought in the React 19 metadata migration:
    - `a11y-baseline`, `testimonials`, `llm-wiki-landing`, `home`, `llm-wiki-course`, `breadcrumbs` — **190 passed, 0 failed**
    - `contact-form`, `booking-cta`, `ui-ux-audit`, `blog`, `analytics-consent`, `llm-wiki-discoverable`, `hydration-paint`, `policy-pages`, `projects`, `language-switcher-blog`, `perf-image-loading`, `seo-llms-txt`, `perf-self-hosted-fonts`, `seo-metadata-invariants` — **215 passed, 0 failed, 20 skipped** (the blocks that ask for `PW_PREVIEW=1`, and the webkit-only skips)
  - That is the whole default suite, split in two so the machine could hold it. The full matrix runs on the push to `main`, per the rule above.
