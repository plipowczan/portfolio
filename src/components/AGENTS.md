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
| `ui/` | reusable, page-agnostic primitives | `Modal.jsx`, `Breadcrumbs.jsx`, `MarkdownContent.jsx`, `ArticleTOC.jsx` |
| `seo/` | head and structured-data emitters | `SEO.jsx`, `StructuredData.jsx` |
| `animations/` | canvas and motion backgrounds | `NetworkBackground.jsx`, `GrowingNetworkBackground.jsx` |
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
- Text is translated through i18next; do not hardcode Polish or English strings
  in a component.
- Modals render through the shared `ui/Modal.jsx` portal so focus handling and
  accessibility stay consistent.

## Verification

```bash
npm test   # Playwright, incl. tests/e2e/ui-ux-audit.spec.js and the section specs
```

## Child DOX Index
