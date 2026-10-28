# AGENTS.md — src/

## Purpose

Application source for the React SPA: routing, i18n bootstrap, pages, styling,
and the shared hooks and utilities behind them.

## Ownership

**Owns directly** — these folders have no doc of their own and are governed here:

- `pages/` — one component per route
- `hooks/` — shared hooks (`useLocalizedPath.js`, `usePageTracking.js`,
  `useContentBody.js`, `useFirstLoad.js`)
- `context/` — React context providers (`BookingContext.jsx`)
- `locales/pl/`, `locales/en/` — i18next translation resources
- `styles/` — `index.css` (global + custom animations) and `fonts.css`
- `utils/` — `analytics.js`, `constants.js`, `extractFirstParagraph.js`,
  `faqExtractor.js`, `formatCalendarDate.js`, `prerenderMarker.js`,
  `prerenderedHead.js`, `serializeJsonLd.js`
- `assets/fonts/` — self-hosted font files
- `App.jsx`, `main.jsx`, `i18n.js`

**Delegated to children:** `content/`, `components/`, `data/`.

## Local Contracts

General React, Tailwind, and router style is not repeated here — it lives in
`.claude/rules/`. What follows is specific to this repository.

- **A page in the sitemap that is not backed by markdown carries an
  `@sitemapUpdated YYYY-MM-DD` marker** in a comment at the top of its own
  `.jsx`. Today that is `PrivacyPolicy`, `TermsOfService`, `CookiePolicy`,
  `LlmWikiLanding` and `CourseHub`. `scripts/update-sitemap.js` reads it and
  fails the build when it is missing, so a new route of this kind cannot ship
  without a date. The marker exists because the date used to come from
  `git log`, which the shallow clone in the build environment turns into the
  same wrong date for every untouched file. Change the page's content, change
  the marker.
- **The three legal pages show that same date as "Ostatnia aktualizacja".**
  Each declares `const LAST_UPDATED = "YYYY-MM-DD"` under its marker and renders
  it with `utils/formatCalendarDate.js`, which formats in UTC so a visitor west
  of UTC does not see the day before. `scripts/update-sitemap.js` fails the
  build when `LAST_UPDATED` and the marker differ. Never render `new Date()`
  there: the static HTML then carried the build day and each visitor saw the
  day of the visit, so the date said nothing about when the text changed.
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
- `<SEO>` without a `title` or `description` falls back to the `siteConfig.*`
  keys of the page's language. There is no Polish constant to fall back to: one
  used to be, and `/en/` shipped a Polish `<title>`. The build now fails on
  Polish metadata under `/en/` (`scripts/verify-prerender-output.mjs`).
- Animate `transform` and `opacity` only; respect `prefers-reduced-motion`.
- Adding a route means updating `App.jsx`, the prerender route list in
  `scripts/prerender.mjs`, and `scripts/update-sitemap.js`.
- Pages are lazy in `App.jsx` — except `Home`, which is a static import on
  purpose. It is the route this repository optimises for, and it is what the
  build's payload budget measures (`scripts/check-payload-budget.mjs`). Making
  it lazy would add a round trip to its critical path and hide it from the gate.
- `main.jsx` calls `collectPrerenderedHead()` before `createRoot(...).render`.
  It must stay ahead of the render: at that moment every marked head tag came
  from the prerendered file, and `<SEO>` removes exactly those on mount. The
  marking rule lives in `src/components/AGENTS.md`. Do not switch to
  `hydrateRoot` to get the tags adopted. The prerendered file is a Puppeteer
  DOM snapshot, not React server output, so hydration mismatches and falls back
  to a client render, which brings the duplicates back.
- A route whose body arrives asynchronously must set the readiness marker
  (`utils/prerenderMarker.js`), or the prerenderer will fail that route. The
  marker is handled for you by `hooks/useContentBody.js`.
- The `/llm-wiki` signup copy (the paragraph above the form, the success screen
  and the meta description) describes the list by what it delivers, never by a
  launch of the course. The course is public and linked from the page, so "gdy
  ruszy kurs" and "kurs już ruszył" both went stale and contradicted each other.
  The rule is the `llm-wiki-landing` requirement "Signup copy describes what the
  list delivers, not a course launch". The endpoint sends no email, so the
  success screen is the only confirmation; do not write there that no mail will
  follow — a welcome mail may be added.

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
