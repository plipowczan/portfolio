## Context

See `proposal.md` — Why. This change is mostly refactor, so the design is short by intention; only three points need a decision recorded.

The sequencing constraint matters more than any single decision here. `meet-wcag-aa-baseline` touches `Navigation.jsx`, `Skills.jsx` and both canvas components, and it collapses the two canvases into one. This change touches the same files. Landing it third means the animation and colour work is applied to the components that already exist after the accessibility change, instead of being written twice.

## Goals / Non-Goals

**Goals:**

- One implementation of the article table of contents.
- One declaration of the brand colour.
- Animations that comply with the repository's own stated motion rule.
- A cookie policy that matches what the site loads.

**Non-Goals:**

- Any change to how anything looks. A reviewer comparing screenshots before and after should find no difference outside the cookie policy's text.
- Changing palette values, spacing, typography, or layout.
- Extracting further shared components. The duplication being removed is the one the audit measured; hunting for more is a different change.
- Adding a design-token system. One colour has four sources of truth; that is a specific defect, not an argument for a token layer.

## Decisions

### D1 — The blog adopts `ArticleTOC`; `ArticleTOC` is not rewritten to suit the blog

`ArticleTOC` was extracted *from* `BlogPostPage`, so the copy left behind is the ancestor, and the extracted version has since been the one under maintenance. The blog therefore adopts the extracted component, and any difference is resolved in the blog's favour only where the blog's behaviour is deliberate.

The one known difference is the heading label, which `ArticleTOC` already accepts as a `tocLabel` prop — the seam is present and was designed for exactly this.

*Alternative considered.* Merging the two implementations field by field would be more careful, but it treats a copy and its original as two equal designs. The extracted component is the maintained one.

### D2 — The brand green is declared as a CSS custom property, read by both CSS and JavaScript

A custom property on the root declares the colour once. The Tailwind config references it, the CSS literals reference it, and the canvas components read it via `getComputedStyle` rather than hard-coding a fill string.

*Alternatives considered.* Declaring it in JavaScript and injecting it into CSS inverts the dependency and makes the stylesheet depend on the bundle having run. Leaving the canvases hard-coded and fixing only the CSS covers seven of twelve occurrences and leaves the pattern in place, which is the defect rather than its symptom.

The canvases build `rgba()` strings with computed alpha per particle, so what they need is the channel values, not a colour string. The custom property is declared as space-separated channels with a companion property for the composed colour, which is the standard shape for this and keeps both consumers simple.

### D3 — `Skills.jsx` uses `scaleX` with a left origin; the track keeps its measured width

Animating `scaleX` on a fill that already occupies the full track, with `transform-origin: left`, produces the same visual growth without a layout pass per frame. The percentage stays as the scale factor, so the data model does not change.

The visible caveat: scaling a fill also scales anything painted inside it. The fill is a plain gradient with a rounded cap, so there is nothing to distort — worth stating because it is the reason this substitution is safe here and would not be for a fill containing a label.

### D4 — The mobile menu animates opacity and transform on a clipped wrapper

`height: auto` cannot be animated cheaply because the target is not known until layout. A wrapper with `overflow: hidden` and a transform-translated panel produces the same reveal with no layout work.

*Alternative considered.* Framer Motion's `layout` prop handles auto-height correctly and is the library's own answer. It was rejected because it opts the subtree into layout projection to solve a problem a translate already solves, and the menu's contents are a fixed list.

## Risks / Trade-offs

- **The blog TOC loses a behaviour the copy had.** The two implementations may have drifted in a way that a line count does not reveal. → Diff the two before deleting either, and treat the existing `blog` and `breadcrumbs` specs as the acceptance gate; scroll-spy behaviour in particular is verified by hand on a long article.
- **The canvas reads a custom property at runtime.** If the stylesheet has not applied when the component mounts, `getComputedStyle` returns an empty string and the particles render invisible. → Read once with a literal fallback, and verify on a cold load rather than only on a hot reload.
- **`scaleX` distorts a rounded cap** at very low fill values. → Inspect the bars at their smallest configured level; this is a visual check, not an assertable one.
- **Merge conflicts with `meet-wcag-aa-baseline`** across four shared files. → The sequencing in Context; rebase rather than merge, and land this change only after the accessibility change is on `main`.
- **Cookie policy wording is a legal-adjacent text.** → It states what the code does and nothing more; it makes no new claim about lawful basis or retention.

## Migration Plan

1. Cookie policy disclosure — independent of every other item, no shared files, can land alone.
2. Brand colour consolidation — mechanical, verified by grep plus a visual check.
3. Modal exit animation — one-line structural fix, verified by watching the booking modal close.
4. Animation substitutions — after `meet-wcag-aa-baseline` is on `main`.
5. Table of contents deduplication — largest deletion, kept last so a revert touches nothing else.

**Rollback:** each step is independently revertable. Steps 2–5 change no rendered output, so a regression shows up as a visual or behavioural difference rather than as a data problem.
