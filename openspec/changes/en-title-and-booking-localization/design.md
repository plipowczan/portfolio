# Design

## Context

See `proposal.md`. Facts the design rests on:

- Language is `i18n.language`, set from the route by `LocaleLayout` (`/en/…` → `en`, anything else → `pl`). `SEO`, `useLocalizedPath` and the page copy already read it, so it is the single source for "the language of the route".
- `SEO` builds the title as `${title} | ${name}` when a page passes a title, and `${name} | ${SITE_CONFIG.title}` when it does not. Only the home page passes none. Every other page passes an English or locale-resolved title, which the 2026-10-15 `dist/` confirms.
- The Zencal embed script (`app.zencal.io/js/embed.js`) hands `element.dataset.lang` to its app as the interface language. It reads no query parameter. `?lang=en`, which the consultation pages use, belongs to the hosted booking page, not to the embed.
- The booking modal is not in the prerendered HTML (it renders on click, through a portal). The booking *section* on the home page is.
- `Modal` and `ZencalWidget` are mounted by `Layout` for every page, so the modal is reachable from blog posts as well as the home page.

## Goals / Non-Goals

**Goals:**

- `/en/` has an English `<title>`, `og:title`, `twitter:title` and description.
- Every visible booking string, and the Zencal interface, follow the route language.
- A future `/en/*` route that falls back to Polish metadata, or that reintroduces Polish booking text, fails the build.

**Non-Goals:**

- A separate English event type (euro price, English event wording). PL-368.
- Translating anything else on the Polish site, or auditing `/en/*` body copy beyond booking.
- A language detector for prose. The check is deliberately narrow (see Decisions).

## Decisions

### D1. The default title and description come from locale keys, and the constants go

`SEO` reads `t("siteConfig.title")` and `t("siteConfig.description")`. The keys already exist in both `common.json` files with the right values; `SITE_CONFIG.title` and `SITE_CONFIG.description` duplicated the Polish ones and had no other consumer, so they are removed. One copy of each string, in the place translations live.

Alternative considered: pass `title` from `Home`. Rejected: `SEO` would then format it `${title} | ${name}` ("Your Tech Guide | Pawel Lipowczan"), reversing the Polish order and creating a second title format for one page.

`Home` stops passing `description` and loses the comment explaining that the fallback was Polish; the fallback is now correct, so the prop is redundant.

### D2. Booking copy lives in `home.json` and `common.json`

The section strings (title, subtitle, description, four benefits, button, note) are `home` namespace, like the other sections. The modal title, the modal description and the loading text are `common`, because `Layout` and the widget use them on every page. Polish values are today's strings, unchanged, so the Polish e2e assertions keep passing.

### D3. `ZencalWidget` derives its language from i18n, and remounts when it changes

The widget reads `i18n.language` and renders `data-lang="en"` or `"pl"`. The embed reads the attribute once at load, so `BookingModalContent` gives the widget `key={lang}`: a language change while the modal is open remounts it, the existing cleanup clears the embed and the effect loads it again. The modal normally closes before the language can change, so this is cheap insurance, not a feature.

### D4. The prerender check is narrow on purpose

Detecting Polish in arbitrary prose reliably needs a language model. The check does two things that need none:

1. **Polish diacritics** (`ąćęłńóśźż`, either case) in `<title>`, `og:title`, `twitter:title`, `<meta name="description">` and `og:description` of every route file under `dist/en/`. English metadata has no reason to contain them. Polish proper names are handled by an exported allow-list, empty today, so a legitimate name costs one line and not a disabled check.
2. **Polish booking strings.** The Polish values of every `booking.*` key in `locales/pl` are read at check time and must not appear in the visible text of any route file under `dist/en/`. The check reads the locale files instead of keeping a copy of the strings, so a reworded Polish string is covered without touching the check.

What this does not catch: a Polish title without diacritics, or Polish body copy outside booking. It catches the failure that happened (home title) and the one that was reported (booking), and it fails loudly if the fallback to Polish defaults ever comes back.

The check is a pure function over `{ file, html }` pairs, exported separately from the filesystem walk, so a unit test can feed it synthetic HTML. A test that reads `dist/` is ruled out by `tests/AGENTS.md`.

### D5. E2E covers what the build cannot see

The prerender check owns "no Polish in `/en/*` output". The E2E additions are what the static HTML does not show: the English booking section, the modal (not in the static HTML) and `data-lang="en"` on the widget. One assertion on the English home title sits in the existing metadata spec, which runs against dev.

## Risks / Trade-offs

- **Allow-list drift.** If an English description legitimately needs "Paweł", the build fails until the name is allow-listed. The failure message names the file, the field and the fix.
- **Zencal ignores `data-lang="en"`.** Then `/en/` still shows a Polish calendar. Mitigation: the attribute is read in the embed source; task 5.3 confirms the real widget in a browser.
- **Translation quality.** The English strings are a faithful rendering of the Polish ones. They need the owner's eye in review.
