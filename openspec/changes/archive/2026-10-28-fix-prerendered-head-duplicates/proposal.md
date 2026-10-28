# Proposal

## Why

Once the app mounts, every page on production holds two of each head tag it ships. That is two `<title>`, two `<meta name="description">`, two `<link rel="canonical">`, two of every Open Graph and Twitter tag, and six hreflang links instead of three. The static file has one of each, so `scripts/verify-prerender-output.mjs` passes. The duplicates appear only in the DOM after React runs. That is the DOM Googlebot and any other JavaScript-rendering crawler indexes.

Measured on 2026-10-28 in headless Chromium against `https://pawel.lipowczan.pl`, with every third-party script blocked:

| Route | Static HTML (title / description / canonical / hreflang) | Mounted DOM |
| --- | --- | --- |
| `/` | 1 / 1 / 1 / 3 | 2 / 2 / 2 / 6 |
| `/en/` | 1 / 1 / 1 / 3 | 2 / 2 / 2 / 6 |
| `/blog` | 1 / 1 / 1 / 3 | 2 / 2 / 2 / 6 |
| `/blog/slabe-strony-claude-code` | 1 / 1 / 1 / 3 | 2 / 2 / 2 / 6 |

Client-side navigation makes it worse. After `/` → `/blog` the document holds two canonicals, `/` first and `/blog` second. The static set never leaves, so it keeps describing the page the visitor first landed on.

The cause is in React, not in the prerender. `src/main.jsx` mounts with `createRoot`. React 19 reuses an existing `<title>`, `<meta>` or `<link>` from the document only while it hydrates. On a plain client render it creates every hoisted tag new and inserts it beside whatever is already in `<head>`. In react-dom 19.2 the instance is created in `beginWork` whenever `isHydrating` is false, so the commit-time matching never runs. `react-helmet-async` used to hide this: it marked its tags with `data-rh` and removed pre-existing ones on mount. That migration (`2026-09-06-migrate-seo-to-react19-metadata`) dropped the sweep without replacing it.

## What Changes

- `<SEO>` marks every tag it emits with one data attribute, so the prerendered files carry the mark too.
- Before React renders, the app collects the marked tags already in `<head>`. At that moment every one of them came from the static file.
- `<SEO>` removes the collected tags in a layout effect, in the same commit that inserts its own. No frame holds two sets, and none holds zero. A lazy route whose page chunk is still loading keeps the prerendered set until it can replace it.
- A regression test in `tests/e2e/seo-metadata-invariants.spec.js` reproduces the prerender on the dev server. It captures a route's rendered document the way `scripts/prerender.mjs` does, serves that document back as the next navigation, and counts the tags once React owns them. It runs on a direct load (PL and EN, listing and article) and after a client-side navigation. It fails on current `main`.
- The comment on the `/`-last prerender order and its rule in `scripts/AGENTS.md` are updated. The order stays, but it is no longer the only thing keeping a stale home-page set out of other routes.

No URL, tag value or metadata content changes. Only the number of copies changes.

## Capabilities

### New Capabilities

<!-- None. -->

### Modified Capabilities

- `seo-metadata-rendering`: adds a requirement that the mounted document holds exactly one copy of each tag `<SEO>` emits on top of a prerendered file, on direct load and after client-side navigation. Today the spec only covers no duplicates after a route change and one copy in the static file. Neither covers static tags plus React's own.

## Impact

**Code:**

- `src/components/seo/SEO.jsx`: the mark on every emitted tag, plus the layout effect that removes the prerendered set.
- `src/utils/prerenderedHead.js` (new): the attribute name and the collect/remove pair, with no React dependency.
- `src/main.jsx`: collects the prerendered set before `createRoot(...).render`.
- `scripts/prerender.mjs`: comment on the route order only. The order itself does not change.
- `tests/e2e/seo-metadata-invariants.spec.js`: the regression block.
- Docs: `src/AGENTS.md`, `src/components/AGENTS.md`, `scripts/AGENTS.md`, `tests/AGENTS.md`.

**Considered and rejected: `hydrateRoot`.** The prerendered file is a Puppeteer DOM snapshot (`page.content()`), not React server output. It lacks the Suspense boundary comments and text separators that hydration matches against, and the lazy routes, consent banner, motion initial states and language detection would all diverge on the first render. React 19 would report recoverable errors, discard the server DOM, re-render on the client, and come back to the same duplicates. Real hydration would mean replacing the prerender with `react-dom/server`. That is a separate project, not a fix.

**Considered and rejected: removing the static tags before mount.** It is one line in `main.jsx`. On every lazy route, though, the document would have no title, description or canonical until the page chunk arrived, because `<SEO>` renders inside the page. The swap in a layout effect costs a few lines more and has no such window.

**Not affected:** JSON-LD. `StructuredData` renders inside `#root`, and `createRoot` clears the container on its first commit, so the prerendered block is replaced, not duplicated.
