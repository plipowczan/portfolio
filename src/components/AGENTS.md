# AGENTS.md — src/components/

## Purpose

Every React component that is not a route. Routes live in `src/pages/`.

## Ownership

**Owns:** the folder split below and the decision of where a new component goes.

**Does not own:** general React and Tailwind conventions — those are in
`src/AGENTS.md` and `.claude/rules/`.

## Local Contracts

One folder per role. A new component goes in exactly one of them:

| Folder | Holds | Examples |
| --- | --- | --- |
| `layout/` | page chrome that wraps routes | `Layout.jsx`, `LocaleLayout.jsx`, `Navigation.jsx`, `Footer.jsx` |
| `sections/` | full-width blocks composed into a page | `Hero.jsx`, `About.jsx`, `Projects.jsx`, `CourseFaq.jsx` |
| `ui/` | reusable, page-agnostic primitives | `Modal.jsx`, `Breadcrumbs.jsx`, `MarkdownContent.jsx`, `ContentBody.jsx`, `ArticleTOC.jsx` |
| `seo/` | head and structured-data emitters | `SEO.jsx`, `StructuredData.jsx` |
| `animations/` | canvas and motion backgrounds | `NetworkBackground.jsx` |
| `widgets/` | third-party embed wrappers | `ZencalWidget.jsx` |
| `booking/` | consultation-booking flow pieces | `BookingModalContent.jsx` |
| `routing/` | redirect and navigation behaviour components | `StripEnRedirect.jsx` |

- A component reused by two pages belongs in `ui/`, not in the folder of
  whichever page needed it first.
- A component wrapping an external script belongs in `widgets/`, so the CSP and
  third-party-performance rules stay in one place.
- Nothing in `sections/` imports from `src/pages/`.

## Work Guidance

- Head tags and JSON-LD go through `seo/`, never inline in a page.
- Every tag `seo/SEO.jsx` emits spreads `seoTag` (the `data-seo` mark) last.
  The mark is how the prerendered copy of a tag is found and removed on mount
  (`src/utils/prerenderedHead.js`). A tag without it survives next to React's
  own, and the page carries two once JavaScript runs. React 19 reuses an
  existing head tag only while hydrating, and the app mounts with
  `createRoot`. That is how every production page carried two of each until
  2026-10-28. The replay block in `tests/e2e/seo-metadata-invariants.spec.js`
  fails on any repeated head tag.
- Text is translated through i18next; do not hardcode Polish or English strings
  in a component.
- Modals render through the shared `ui/Modal.jsx` portal so focus handling and
  accessibility stay consistent.
- The booking copy (home section, modal title and description, calendar loading
  text) lives in the `booking.*` locale keys. It was hard-coded Polish, so
  `/en/` showed a Polish section and a Polish calendar.
- `widgets/ZencalWidget.jsx` takes its interface language from `data-lang`,
  set from the route language. The embed reads that attribute and ignores a
  `?lang=` query, which only the hosted booking page understands. It reads the
  attribute once at load, so `BookingModalContent` keys the widget by language.

## Verification

```bash
npm test   # Playwright, incl. tests/e2e/ui-ux-audit.spec.js and the section specs
```

## Child DOX Index
