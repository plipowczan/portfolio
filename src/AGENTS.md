# AGENTS.md — src/

## Purpose

Application source for the React SPA: routing, i18n bootstrap, pages, styling,
and the shared hooks and utilities behind them.

## Ownership

**Owns directly** — these folders have no doc of their own and are governed here:

- `pages/` — one component per route
- `hooks/` — shared hooks (`useLocalizedPath.js`, `usePageTracking.js`)
- `context/` — React context providers (`BookingContext.jsx`)
- `locales/pl/`, `locales/en/` — i18next translation resources
- `styles/` — `index.css` (global + custom animations) and `fonts.css`
- `utils/` — `analytics.js`, `constants.js`, `extractFirstParagraph.js`,
  `faqExtractor.js`
- `assets/fonts/` — self-hosted font files
- `App.jsx`, `main.jsx`, `i18n.js`

**Delegated to children:** `content/`, `components/`, `data/`.

## Local Contracts

General React, Tailwind, and router style is not repeated here — it lives in
`.claude/rules/`. What follows is specific to this repository.

- **No PropTypes.** `prop-types` is not a dependency; importing it breaks Vite
  module resolution and blanks the entire app. Document props with JSDoc and
  validate data at module boundaries instead.
- Routes are declared in `App.jsx`. A user-facing path is built with
  `useLocalizedPath` so the `/en` prefix stays consistent.
- Custom CSS goes in `styles/index.css` only, and only for what utilities cannot
  express. `styles/fonts.css` is generated territory — it pairs with the files
  `fetch-fonts.mjs` writes into `assets/fonts/`.
- Logic extracted out of a component goes to `hooks/`, not to `utils/`.
  `utils/` holds pure helpers with no React dependency.

## Work Guidance

- Technology-generic style lives in `.claude/rules/react/`,
  `.claude/rules/tailwindcss/`, `.claude/rules/react-router/`, and
  `.claude/rules/framer-motion/`. Follow those; do not restate them here.
- New user-visible strings go into both `locales/pl/` and `locales/en/`.
- Animate `transform` and `opacity` only; respect `prefers-reduced-motion`.
- Adding a route means updating `App.jsx`, the prerender route list in
  `scripts/prerender.mjs`, and `scripts/update-sitemap.js`.

## Verification

```bash
npm run dev     # localhost:5173
npm run build   # fast build, catches module-resolution breakage
npm test        # Playwright E2E
```

## Child DOX Index

- `src/content/AGENTS.md` — markdown content sources for the blog and the course.
- `src/components/AGENTS.md` — the component folders and what belongs in each.
- `src/data/AGENTS.md` — content loaders and static data modules.
