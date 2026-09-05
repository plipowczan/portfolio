## Why

The audit found the same shape three times: something was extracted or forked, improved in its new home, and the original was left behind.

- `TableOfContentsSidebar`, `FloatingTOCButton` and `TableOfContentsDrawer` exist twice — once in `src/components/ui/ArticleTOC.jsx`, which `CourseLesson.jsx` imports, and once copied inline into `src/pages/BlogPostPage.jsx`, which is where they were extracted from. Roughly 180 duplicated lines that must now be fixed twice, and will not be.
- The brand green has four sources of truth: `tailwind.config.js`, seven raw `rgba(0, 255, 157, …)` declarations in `src/styles/index.css`, four more inside the canvas components, and a `data-primary` attribute on the Zencal widget. A rebrand would miss some of them.
- Two Framer Motion animations contradict a rule this repository states about itself. `.claude/rules/framer-motion/20-coding-standards.md` says to avoid animating `width`, `height`, `top` and `left`; `Skills.jsx` animates `width` on every skill bar and `Navigation.jsx` animates `height` on every mobile menu open.

Two smaller inconsistencies belong with them. `Modal.jsx` returns `null` before `AnimatePresence` can run, so the exit variants written on both motion elements are unreachable — the booking modal opens with an animation and snaps shut. And the cookie policy never names Vercel Analytics or Speed Insights, although the `analytics-consent` capability already establishes that cookieless analytics keeps running for visitors who decline. The behaviour is specified and correct; the policy page just does not say so, which leaves the site's own documentation incomplete on the one point a visitor who declined would want to check.

## What Changes

- `BlogPostPage.jsx` imports `ArticleTOC` instead of carrying its own copy; the three duplicated components are deleted.
- The brand green is declared once and referenced everywhere — the CSS literals, the canvas fill colours, and the widget attribute all read from that one declaration.
- `Skills.jsx` animates `scaleX` from a left origin instead of `width`; `Navigation.jsx`'s mobile menu animates opacity and transform instead of `height`.
- `Modal.jsx` lets `AnimatePresence` own the mounting decision, so the close animation runs.
- The cookie policy names Vercel Analytics and Speed Insights as the cookieless measurement that runs regardless of the consent choice, in both languages.

Everything except the last item is a refactor: no route, no copy, no layout, and no rendered result changes. The animation changes alter how a transition is produced, not what it looks like.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `analytics-consent`: gains a requirement that the cookie policy names the cookieless tools it runs. The existing requirement "Cookieless analytics remains available without consent" already permits them to run; this adds the disclosure obligation that goes with it, so the policy page and the code stop describing different sites.

## Impact

- **Code:** `src/pages/BlogPostPage.jsx` (delete ~180 lines, add one import), `src/components/ui/ArticleTOC.jsx` (accept the blog's label), `src/styles/index.css` and `tailwind.config.js` and the canvas components and `src/components/widgets/ZencalWidget.jsx` (single colour source), `src/components/sections/Skills.jsx`, `src/components/layout/Navigation.jsx`, `src/components/ui/Modal.jsx`, `src/pages/CookiePolicy.jsx`.
- **Copy:** new cookie-policy sentences in `src/locales/pl` and `src/locales/en`.
- **Tests:** the existing `blog` and `breadcrumbs` specs cover the blog TOC and are the regression net for the deduplication; no new spec is needed.
- **Sequencing:** this change touches `Navigation.jsx`, `Skills.jsx` and the canvas components, which `meet-wcag-aa-baseline` also touches. It is sequenced third for that reason.
- **Not touched:** the palette's values, any visual design, routing, data loading, or the consent gate itself.
