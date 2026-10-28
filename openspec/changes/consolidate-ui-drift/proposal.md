## Why

The audit found the same shape three times: something was extracted or forked, improved in its new home, and the original was left behind.

- `TableOfContentsSidebar`, `FloatingTOCButton` and `TableOfContentsDrawer` exist twice — once in `src/components/ui/ArticleTOC.jsx`, which `CourseLesson.jsx` imports, and once copied inline into `src/pages/BlogPostPage.jsx`, which is where they were extracted from. Roughly 180 duplicated lines that must now be fixed twice, and will not be.
- The brand green has four sources of truth: `tailwind.config.js`, seven raw `rgba(0, 255, 157, …)` declarations in `src/styles/index.css`, four more inside the canvas components, and a `data-primary` attribute on the Zencal widget. A rebrand would miss some of them.
- Two Framer Motion animations contradict a rule this repository states about itself. `.claude/rules/framer-motion/20-coding-standards.md` says to avoid animating `width`, `height`, `top` and `left`; `Skills.jsx` animates `width` on every skill bar and `Navigation.jsx` animates `height` on every mobile menu open.

One smaller inconsistency belongs with them. `Modal.jsx` returns `null` before `AnimatePresence` can run, so the exit variants written on both motion elements are unreachable — the booking modal opens with an animation and snaps shut. The cookie policy's missing disclosure of Vercel Analytics and Speed Insights, once part of this change, moved to `remove-clickrank-and-align-policies` (2026-10-28), which rewrites the same policy sections.

## What Changes

- `BlogPostPage.jsx` imports `ArticleTOC` instead of carrying its own copy; the three duplicated components are deleted.
- The brand green is declared once and referenced everywhere — the CSS literals, the canvas fill colours, and the widget attribute all read from that one declaration.
- `Skills.jsx` animates `scaleX` from a left origin instead of `width`; `Navigation.jsx`'s mobile menu animates opacity and transform instead of `height`.
- `Modal.jsx` lets `AnimatePresence` own the mounting decision, so the close animation runs.

Every item is a refactor: no route, no copy, no layout, and no rendered result changes. The animation changes alter how a transition is produced, not what it looks like.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The change is a refactor, so `.openspec.yaml` sets `skip_specs: true`.

## Impact

- **Code:** `src/pages/BlogPostPage.jsx` (delete ~180 lines, add one import), `src/components/ui/ArticleTOC.jsx` (accept the blog's label), `src/styles/index.css` and `tailwind.config.js` and the canvas components and `src/components/widgets/ZencalWidget.jsx` (single colour source), `src/components/sections/Skills.jsx`, `src/components/layout/Navigation.jsx`, `src/components/ui/Modal.jsx`.
- **Tests:** the existing `blog` and `breadcrumbs` specs cover the blog TOC and are the regression net for the deduplication; no new spec is needed.
- **Sequencing:** this change touches `Navigation.jsx`, `Skills.jsx` and the canvas components, which `meet-wcag-aa-baseline` also touches. It is sequenced third for that reason.
- **Not touched:** the palette's values, any visual design, routing, data loading, or the consent gate itself.
