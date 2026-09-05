## 1. Cookie policy disclosure

- [ ] 1.1 Add the cookieless-measurement disclosure to `src/pages/CookiePolicy.jsx`, naming Vercel Analytics and Speed Insights, stating that they set no cookies and identify no individual, and distinguishing them from the consent-gated analytics; verify the section renders on `/cookie-policy`
- [ ] 1.2 Add the matching keys to `src/locales/pl/*.json` and `src/locales/en/*.json`; verify `/cookie-policy` and `/en/cookie-policy` both render with no missing translation key
- [ ] 1.3 Run the `policy-pages` spec; verify it passes

## 2. One brand colour

- [ ] 2.1 Declare the brand green once as a root custom property, as space-separated channels plus a composed colour, and point `tailwind.config.js` at it; verify a production build produces the same rendered colours
- [ ] 2.2 Replace the seven raw `rgba(0, 255, 157, …)` declarations in `src/styles/index.css` with references to the custom property; verify the grid background, glow, and glow-text effects are visually unchanged
- [ ] 2.3 Read the channel values from the custom property in the canvas component with a literal fallback, replacing the hard-coded fill strings; verify particles and connections render on a cold load, not only after a hot reload
- [ ] 2.4 Point `data-primary` and `data-secondary` in `src/components/widgets/ZencalWidget.jsx` at the same source; verify the booking widget renders in brand colours
- [ ] 2.5 Grep the repository for `00ff9d` and `0, 255, 157`; verify the only remaining occurrence is the single declaration and its documented fallback

## 3. Modal exit animation

- [ ] 3.1 Remove the early `return null` in `src/components/ui/Modal.jsx` so `AnimatePresence` owns the mount decision; verify the booking modal animates on close as well as on open, and that the body scroll lock is still released
- [ ] 3.2 Confirm the focus trap, Escape handling, and focus restoration are unaffected; verify by opening the booking modal, tabbing to the end, pressing Escape, and checking focus returns to the trigger

## 4. Animation substitutions

- [ ] 4.1 Confirm `meet-wcag-aa-baseline` is merged to `main` and rebase this branch onto it; verify the four shared files carry the accessibility changes before proceeding
- [ ] 4.2 Replace the `width` animation in `src/components/sections/Skills.jsx` with `scaleX` from a left origin; verify the bars grow identically and inspect the lowest-level bar for cap distortion
- [ ] 4.3 Replace the `height` animation of the mobile menu in `src/components/layout/Navigation.jsx` with opacity and transform on a clipped wrapper; verify the menu opens and closes identically at a phone viewport and does not clip its last link
- [ ] 4.4 Grep the codebase for animations on `width`, `height`, `top` and `left`; verify none remain, so the repository matches the rule in `.claude/rules/framer-motion/20-coding-standards.md`

## 5. One table of contents

- [ ] 5.1 Diff `src/pages/BlogPostPage.jsx` lines 18–199 against `src/components/ui/ArticleTOC.jsx` and record every behavioural difference found; verify the list is explicit before anything is deleted
- [ ] 5.2 Resolve each recorded difference in `ArticleTOC`, or record why the blog's variant is not being carried over; verify no difference is left unaccounted for
- [ ] 5.3 Import `ArticleTOC` in `src/pages/BlogPostPage.jsx` with the blog's `tocLabel` and delete the three local components; verify the blog post page renders its sidebar TOC, floating button, and drawer
- [ ] 5.4 Verify scroll-spy by hand on a long article at a desktop viewport: the active heading tracks the scroll position and the drawer closes on selection
- [ ] 5.5 Run the `blog`, `breadcrumbs` and `llm-wiki-course` specs; verify all pass

## 6. Closeout

- [ ] 6.1 Compare the homepage, a blog post, a course lesson and `/llm-wiki` against pre-change screenshots at both viewports; verify nothing outside the cookie policy has changed visually
- [ ] 6.2 Run `PW_ALL=1 PW_PREVIEW=1 npm test`; verify the full matrix passes
- [ ] 6.3 Run the DOX pass: update the owning `AGENTS.md` for the shared TOC component and the single colour declaration, or state explicitly that a doc is unchanged
