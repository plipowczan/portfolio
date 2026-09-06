# UI/UX Audit — Portfolio (pawel.lipowczan.pl)

**Date:** 2026-06-24
**Skill:** ui-ux-pro-max:ui-ux-pro-max v2.5.0
**Scope:** React 19 + Vite 7 + Tailwind 3 SPA. Dark theme, green accent (`primary-500` #00ff9d).
**Method:** Manual review against skill rule categories §1–§10 (CLI script unreachable via git-bash symlink path; full rule DB applied from SKILL.md).

Files reviewed: `Navigation.jsx`, `Hero.jsx`, `ContactForm.jsx`, `Modal.jsx`, `Projects.jsx`, `Testimonials.jsx`, `Layout.jsx`, `Breadcrumbs.jsx`, `index.css`, `tailwind.config.js`.

---

## Summary

Solid foundation. Modal a11y (focus trap, ESC, restore focus, `aria-modal`, scroll-lock) is textbook. Form has labels + `aria-invalid` + `aria-required`. Global `*:focus-visible` ring present. Brand system consistent via Tailwind tokens + `@layer components`.

Main gaps: **zero `prefers-reduced-motion` support** (violates project's own framer-motion rule), **no skip-link**, **nested `<a>` in `<a>`** in project cards, form errors not wired to screen readers, a few contrast + color-consistency misses.

---

## CRITICAL (§1 Accessibility, §2 Interaction)

### C1 — No `prefers-reduced-motion` anywhere
- **Where:** all Framer Motion usage (`Hero`, `Projects`, `ContactForm`, `Testimonials`, `Navigation` mobile menu) + CSS `animate-glow`, `animate-float`, `network-float`, `html{scroll-behavior:smooth}`.
- **Rule:** §1 `reduced-motion`, §7 — and project rule `.claude/rules/framer-motion/20-coding-standards.md` explicitly mandates `useReducedMotion()`.
- **Fix:** add `useReducedMotion()` to motion variants (zero duration / no transform when true); wrap CSS animations + smooth-scroll in `@media (prefers-reduced-motion: reduce)`.

### C2 — Nested anchors in project cards (invalid HTML)
- **Where:** `Projects.jsx:14` `<Link>` (renders `<a>`) wraps card containing `<a href=githubUrl>` + `<a href=liveUrl>` (lines 33, 44).
- **Problem:** `<a>` inside `<a>` is invalid; browser auto-closes outer anchor → broken DOM, unpredictable keyboard nav, hydration warnings. `stopPropagation` does not fix the nesting.
- **Fix:** make card a `<div>` with `onClick`/`useNavigate` for navigation, or move the github/live links outside the `<Link>`, or render them as `<button>` with handlers.

---

## HIGH

### H1 — No skip-link
- **Where:** `Layout.jsx` — `<main className="...pt-20">` has no `id`, no "skip to content" link.
- **Rule:** §1 `skip-links`. Keyboard users tab through full nav every page.
- **Fix:** add `<a href="#main" class="sr-only focus:not-sr-only ...">Skip to content</a>` + `id="main"` on `<main>`.

### H2 — Mobile menu button missing `aria-expanded`
- **Where:** `Navigation.jsx:170-177` — toggle has `aria-label="Toggle menu"` but no `aria-expanded` / `aria-controls`.
- **Rule:** §9 `nav-state-active`, a11y expanded state.
- **Fix:** `aria-expanded={isMobileMenuOpen}` + `aria-controls="mobile-menu"` (id on the menu panel).

### H3 — Form inputs kill focus ring, rely on color-only state
- **Where:** `ContactForm.jsx` inputs use `focus:outline-none focus:border-primary-500`.
- **Problem:** overrides global `*:focus-visible` ring; 1px border color-change is a weak, color-only focus + error indicator (§1 `focus-states`, `color-not-only`).
- **Fix:** keep a visible focus ring (`focus-visible:ring-2 ring-primary-500`); pair error border with an icon/text marker (already has error text — link it, see H4).

### H4 — Form errors not announced to screen readers
- **Where:** `ContactForm.jsx` — error `<p>` not linked to input; `aria-invalid` set but no `aria-describedby`; no `role="alert"` on field errors; on submit no focus moved to first invalid field.
- **Rule:** §8 `aria-live-errors`, `focus-management`, `error-summary`.
- **Fix:** `aria-describedby="name-error"` + `id="name-error"` on the `<p>`; add `role="alert"`; focus first invalid field after failed validate.

---

## MEDIUM

### M1 — Color contrast: `text-gray-500` on dark for small text
- **Where:** `Navigation.jsx:63` separator; `ContactForm.jsx:144` email label (`text-sm`).
- `#6b7280` on `#050810` ≈ **4.06:1** — fails AA (4.5:1) for normal/small text.
- **Fix:** use `text-gray-400` (#9ca3af ≈ 7:1) for labels.

### M2 — Color inconsistency: raw `green-500` vs brand `primary-500`
- **Where:** `Testimonials.jsx:41,51` use Tailwind default `green-500` (#22c55e) + `text-green-500/70`, not brand `primary-*` (#00ff9d).
- **Rule:** §4 `consistency`, §6 `color-semantic`. Two different greens on screen.
- **Fix:** swap to `primary-500` / `border-primary-500/30`. Also `text-green-500/70` on `text-xs` company line is low-contrast — verify ≥4.5:1.

### M3 — Validation on submit only, not on blur
- **Where:** `ContactForm.jsx` validates in `handleSubmit`; clears error on change.
- **Rule:** §8 `inline-validation` (validate on blur, not keystroke). Current model is acceptable but blur-validation improves UX.

### M4 — Images missing intrinsic `width`/`height`
- **Where:** `Projects.jsx:21`, `Testimonials.jsx:38`. Parents have fixed sizes (`h-48`, `w-12 h-12`) so CLS is mostly contained, but explicit `width`/`height` (or `aspect-ratio`) is the §3 `image-dimension` standard.

---

## LOW / Positive

**Positive (keep):**
- Modal: focus trap + ESC + restore focus + `aria-modal` + `aria-labelledby` + body scroll-lock + backdrop dismiss. Strong.
- Global `*:focus-visible` outline.
- Semantic Tailwind color tokens; `@layer components` for `.btn-*`, `.glass`, `.card`.
- SVG icons (react-icons), no emoji-as-icon.
- `loading="lazy"` on project/testimonial/blog images.
- Fixed nav offset reserved (`main pt-20`), `font-display: swap` on Google Fonts.
- Breadcrumbs use `aria-current="page"`.
- `noopener noreferrer` on external links; `mailto` + labelled social links.

**Low:**
- `html{scroll-behavior:smooth}` global — gate behind reduced-motion (folds into C1).
- LanguageSwitcher active state is color-only (PL/EN green vs gray) — add weight/underline for `color-not-only`.
- `btn-primary`/`btn-outline` use `hover:scale-105` — fine on web, but no reduced-motion guard (C1).

---

## Resolved (branch `fix/ui-ux-audit-reduced-motion-nested-anchors`)

- **C1** ✅ — `<MotionConfig reducedMotion="user">` in `App.jsx` (all Framer) + `@media (prefers-reduced-motion: reduce)` in `index.css` (CSS anims + smooth-scroll).
- **C2** ✅ — `Projects.jsx` rebuilt as stretched-link; external links are siblings at `z-20`, card `<Link>` at `z-10`. No nested `<a>`.
- **H1** ✅ — skip-link + `id="main"` in `Layout.jsx`.
- **H2** ✅ — `aria-expanded` + `aria-controls="mobile-menu"` on toggle; `id` on menu panel.
- **H3** ✅ — inputs now `focus-visible:ring-2 ring-primary-500` instead of bare `outline-none`.
- **H4** ✅ — field errors get `id` + `role="alert"`, inputs `aria-describedby`, first invalid field focused on submit.

Remaining: M1 (contrast `gray-500`), M2 (raw `green-500` in Testimonials), M3 (blur validation), M4 (img width/height), lows.

## Priority order
1. C1 reduced-motion (breadth + own-rule violation)
2. C2 nested anchors (invalid HTML / real bug)
3. H1 skip-link, H2 aria-expanded, H4 form SR errors, H3 focus ring
4. M1 contrast, M2 green consistency
5. M3/M4 + lows
