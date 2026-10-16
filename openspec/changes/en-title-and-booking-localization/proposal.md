# Proposal

## Why

The English version of the site (`/en/…`, 31 articles and 9 projects, all in the sitemap) has two gaps that reach exactly the visitors it was built for (PL-465).

1. **The English home page has a Polish title.** `/en/` ships `<title>` and `og:title` "Pawel Lipowczan | Twój Przewodnik Technologiczny" next to an English description. `SEO` falls back to `SITE_CONFIG.title`, a hard-coded Polish string, whenever a page passes no `title`, and the home page passes none. The English tagline already exists as the locale key `siteConfig.title` ("Your Tech Guide"); nothing reads it.
2. **Booking is Polish everywhere.** The "Umów spotkanie" section, the modal title and description, the Zencal loading text and the Zencal widget (`data-lang="pl"`) are hard-coded Polish. `locales/en` has no booking keys at all. A visitor who arrives from search on `/en/` lands on a Polish section and a Polish calendar.

The review of the other `/en/*` routes found no further gap today: the article, project, list and policy pages already carry English titles and descriptions (47 `/en/*` files in the 2026-10-15 `dist/`, one Polish). Nothing stops the gap from coming back, though. A page without its own title or description silently falls back to Polish, and the build says nothing.

## What Changes

- `SEO` takes its default title and default description from the active language's `siteConfig.title` and `siteConfig.description` keys instead of the Polish `SITE_CONFIG` constants. The two now-unused constants are removed. English home page: "Pawel Lipowczan | Your Tech Guide".
- The booking section, the modal title and description and the loading text move into `locales/pl` and `locales/en` (`booking.*` keys). The Polish values are the current strings verbatim.
- `ZencalWidget` takes its language from the route (the i18n language) instead of the constant `pl`: the same free consultation, English Zencal interface under `/en/`. The embed reads the `data-lang` attribute; it does not read a `?lang=` query, which is a parameter of the hosted booking page.
- `verify-prerender-output.mjs` fails the build when a route under `/en/` carries a Polish title, `og:title`, description or booking text. The check is a pure function, covered by a unit test.

No separate English meeting (euro price, English wording) is created; that stays in PL-368.

## Capabilities

### New Capabilities

- `booking-localization`: the booking section, modal and Zencal widget follow the language of the route.

### Modified Capabilities

- `seo-page-metadata`: the default title is localised and the default description comes from the active language.
- `prerender-output-invariants`: a new requirement, English routes carry no Polish metadata or booking text.

## Impact

- **Code:** `src/components/seo/SEO.jsx`, `src/components/sections/BookingCTA.jsx`, `src/components/booking/BookingModalContent.jsx`, `src/components/layout/Layout.jsx`, `src/components/widgets/ZencalWidget.jsx`, `src/pages/Home.jsx` (drops a now-redundant prop and a stale comment), `src/utils/constants.js` (two fields removed), `src/locales/{pl,en}/{common,home}.json`.
- **Build:** `scripts/verify-prerender-output.mjs` gains one exported check.
- **Tests:** `tests/unit/verify-prerender-english.test.mjs` (new), `tests/e2e/booking-cta.spec.js` (English block), `tests/e2e/seo-metadata-invariants.spec.js` (English home title).
- **Docs:** `src/components/AGENTS.md` (widget language trap), `scripts/AGENTS.md` (the new check).
- **Not touched:** Polish pages, the PL booking behaviour, the Zencal event type (`konsultacja`), PL-368.
