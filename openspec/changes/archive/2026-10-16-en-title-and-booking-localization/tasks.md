## 1. Locale keys

- [x] 1.1 Add `booking.title`, `booking.subtitle`, `booking.description`, `booking.benefit1`–`booking.benefit4`, `booking.cta`, `booking.note` to `src/locales/pl/home.json` (current Polish strings verbatim) and `src/locales/en/home.json` (English)
- [x] 1.2 Add `booking.modalTitle`, `booking.modalDescription`, `booking.loading` to `src/locales/pl/common.json` (current Polish strings verbatim) and `src/locales/en/common.json`

## 2. Components

- [x] 2.1 `BookingCTA.jsx`: read every string from `t("booking.…")` (`home` namespace); benefits built from `benefit1`–`benefit4`
- [x] 2.2 `Layout.jsx`: modal `title` from `t("booking.modalTitle")`
- [x] 2.3 `BookingModalContent.jsx`: description from `t("booking.modalDescription")`; render `<ZencalWidget key={lang} />`
- [x] 2.4 `ZencalWidget.jsx`: `data-lang` from the i18n language (`en` or `pl`); loading text from `t("booking.loading")`
- [x] 2.5 `SEO.jsx`: default title and description from the `siteConfig.title` / `siteConfig.description` locale keys; remove `SITE_CONFIG.title` and `SITE_CONFIG.description` from `src/utils/constants.js`
- [x] 2.6 `Home.jsx`: drop the redundant `description` prop and the stale comment

## 3. Prerender check

- [x] 3.1 Write `tests/unit/verify-prerender-english.test.mjs` first: Polish title, Polish description and Polish booking string each fail; clean English passes; a Polish route is not flagged; an allow-listed name passes
- [x] 3.2 Implement the exported pure check in `scripts/verify-prerender-output.mjs` and wire it into `checkPrerenderOutput` over `dist/en/**/index.html`
- [x] 3.3 `npm run test:unit` is green

## 4. E2E

- [x] 4.1 `tests/e2e/booking-cta.spec.js`: an English block on `/en/`: section text, modal title and description in English, widget `data-lang="en"`; one Polish assertion for `data-lang="pl"`
- [x] 4.2 `tests/e2e/seo-metadata-invariants.spec.js`: `/en/` title and `og:title` are "Pawel Lipowczan | Your Tech Guide"

## 5. Verify

- [x] 5.1 `npm run build:prerender` passes, including the new check; `dist/en/index.html` has the English title
- [x] 5.2 Mutation check: run the check against a doctored copy of the output (Polish title, Polish booking text) and confirm it fails
- [x] 5.3 In a browser on `/en/`: the booking section and modal are English and the real Zencal widget renders in English — checked on the production build: the widget interface is English ("Meeting details", "Pick dates", "Hosts"); the event's own name and description are Polish, because they are content stored in Zencal, not interface
- [x] 5.4 Run `booking-cta`, `home`, `seo-metadata-invariants`, `a11y-baseline`, `language-switcher-blog` (chromium + Mobile Chrome) — plus `ui-ux-audit`, `contact-form`, `testimonials`, `breadcrumbs`: 276 passed, 2 flaky on the first attempt under load (a heading-class check, an SEO meta-tag timeout), both green on re-run in isolation

## 6. Docs

- [x] 6.1 `src/components/AGENTS.md`: the widget takes its language from `data-lang`, not a query parameter; booking copy lives in locale keys
- [x] 6.2 `scripts/AGENTS.md`: `verify-prerender-output.mjs` also checks `/en/*` for Polish metadata and booking text
- [x] 6.3 `openspec validate en-title-and-booking-localization --strict`
