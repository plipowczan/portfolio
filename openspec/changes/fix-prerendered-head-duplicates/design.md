# Design

## Context

See `proposal.md` for the measurement and the root cause. Five facts constrain the approach:

- `src/main.jsx` mounts with `createRoot`. In react-dom 19.2, a hoistable `<title>`, `<meta>` or `<link>` gets its DOM node in `beginWork` whenever the render is not hydrating. At commit, `mountHoistable` inserts that node. The matching path that would adopt an existing node (`getHydratableHoistableCache`) runs only when the fiber reaches commit without a node, which happens only under `hydrateRoot`.
- A `<title>` React inserts goes *before* the existing `head > title`. So `document.title` already shows React's value, and the stale copy is the second one. Meta and link nodes are appended, so there the static copy comes first. A parser that takes the first canonical reads the static one. On a direct load that is still correct. After a client-side navigation it points at the wrong page.
- `<SEO>` (`src/components/seo/SEO.jsx`) is the only component that emits hoisted head tags. It renders inside each page component, and every page except `Home` is `lazy`. A direct load of `/blog` therefore commits a `Suspense` fallback first and `<SEO>` only after the page chunk arrives.
- `createRoot` clears `#root` on its first commit. Body content, including the JSON-LD `<script>` from `StructuredData`, is replaced, never duplicated. Only `<head>` accumulates.
- `scripts/verify-prerender-output.mjs` reads the static files with regular expressions that expect `rel` before `href` on the canonical, and `name` before `content` on the description. Whatever the static markup gains must not reorder those.

## Goals / Non-Goals

**Goals:**

- One copy of every `<SEO>` tag in the mounted document, on direct load and after client-side navigation, in PL and EN.
- At no point a document with zero copies while a lazy route loads.
- A regression test that runs in the default suite and fails on the code before this change.

**Non-Goals:**

- Hydrating the prerendered body. The flash where the body is rebuilt on mount is a separate topic, partly covered by `performance-hydration-paint`.
- Changing any metadata value or the set of tags `<SEO>` emits.
- Changing the prerender route order.

## Decisions

### D1. Swap the prerendered set for React's own instead of hydrating

`hydrateRoot` would make React adopt the static head tags. It would also make React hydrate the whole body against a file it never server-rendered. `page.content()` writes a DOM snapshot with no Suspense boundary comments and no text-node separators. On the client, the first render differs from the captured one in the lazy routes, the motion initial states, the consent banner and the detected language. React 19 recovers from a mismatch by client-rendering the root, which leads straight back to `createRoot` behaviour and the same duplicates, plus console errors. Hydration is only sound on output from `react-dom/server`, and moving to that is far more than this fix needs.

The swap leaves the render path alone. React keeps creating its own nodes, and the app deletes the static copies at the moment React's copies exist.

### D2. Identify the static copies by a mark that `<SEO>` itself emits

Every tag `<SEO>` renders carries one data attribute, defined once in `src/utils/prerenderedHead.js`. The prerendered file is a capture of that render, so its copies carry the attribute too.

Alternatives:

- **A selector list mirroring `<SEO>`'s output** (`title`, `meta[name="description"]`, `meta[property^="og:"]`, …). This is a second list that has to follow `<SEO>` by hand. If it drifts, a static tag stays.
- **Dedupe against what React rendered** (remove a static node when a React node with the same key now exists). This fails when the first client render differs from the captured one. `BlogPostPage` can briefly render its not-found branch on a direct EN load while i18n settles, and that branch emits no hreflang. A static hreflang set nobody re-rendered would never be removed and would go stale on the next navigation.
- **React internals** (a node without `__reactFiber$…` is static). These keys are not an API, and production code must not depend on them.

The mark has the same drift risk as the selector list: a new tag added without it would duplicate. The difference is that the mark sits on the tag itself, in the one file that renders it. The regression test also checks that no `<SEO>` tag appears twice, not only the three named ones, so a missing mark fails a test either way.

The attribute is written last on each element, so the existing order is unchanged: `rel`/`href` on the canonical, `name`/`content` on the description. `verify-prerender-output.mjs` needs no change.

### D3. Collect before render, remove in `<SEO>`'s layout effect

`main.jsx` calls `collectPrerenderedHead()` immediately before `createRoot(...).render`. At that moment, any marked node in `<head>` came from the file, because React has rendered nothing yet. `<SEO>` calls `removePrerenderedHead()` from `useLayoutEffect`.

Why a layout effect: hoisted nodes are inserted during the commit's mutation phase, and layout effects run in the same commit before the browser paints. The static set and React's set are never visible together, and the document is never empty. That is also why removal does not happen before mount. On a lazy route, removing first would leave the page without a title, description and canonical for the length of a chunk download.

Why collection is an explicit call in `main.jsx` and not a side effect of importing the module: the entry module never hot-updates. A module-level capture inside a hot-reloaded module would, on the next edit, collect React's own live nodes and delete them.

Both functions are idempotent. `removePrerenderedHead()` empties the list it removed. `<React.StrictMode>` runs layout effects twice in development, and every later `<SEO>` mount, after each route change, finds nothing left to remove.

### D4. Test by replaying a captured document on the dev server

The dev server serves no prerendered tags. `PW_PREVIEW=1` does not help either: `build:test` is a plain `vite build`, not a prerender. Reading `dist/` from a spec is ruled out by `tests/AGENTS.md`. The test therefore produces the prerendered input itself:

1. Load the route normally and wait until the page's own metadata is in place (and `data-content-ready` on an article).
2. Read `page.content()`, the call `scripts/prerender.mjs` uses to write the file.
3. Make the next document request for that route return the captured HTML (`page.route(..., { times: 1 })`), then navigate to it again.
4. Wait until a `<link rel="canonical">` *owned by React* points at the route, and only then count.

Step 4 is the trap. Before the application mounts, the replayed document already holds exactly one of each tag, so a count taken too early passes on broken code. Ownership is read from the `__reactFiber$…` key React sets on every node it manages. That key is internal, which is acceptable in a test (D2 keeps it out of production code), and the helper's comment names it as the reason the wait exists.

The block lives in `seo-metadata-invariants.spec.js`, which owns metadata assertions and is already pinned to `chromium` as engine-independent. Nothing in the new block concerns visibility, layout or viewport, so it keeps that status.

### D5. Keep `/` last in the prerender

The swap also clears a shell that already carries the home page's marked tags, so the order is no longer the only guard against the poisoning that `scripts/AGENTS.md` describes. It stays anyway. It costs nothing, it keeps the shell clean without depending on client code, and `verify-prerender-output.mjs` still checks the result. The comment in `prerender.mjs` and the rule in `scripts/AGENTS.md` change from "the only guard" to "one of two guards".

## Risks / Trade-offs

- [A future head tag added to `<SEO>` without the mark duplicates again.] → The regression test fails on any repeated `<SEO>` tag, not just the three named ones. The mark is also applied through one shared object in `SEO.jsx`, so a new tag copies it from its neighbours.
- [A route that never renders `<SEO>` keeps its static set.] → That set is the page's own, single and correct. On the next navigation to a page that does render `<SEO>`, the set is removed. Every route in the sitemap renders `<SEO>` today.
- [A static marked tag on a page whose `<SEO>` never mounts because its chunk fails to load.] → The prerendered head is the best the page can show in that state. Keeping it is the intended fallback.
- [The test depends on React's internal fiber key.] → If a React upgrade renames it, the wait times out and the test fails loudly, never silently green. The comment says what to update.
- [Replaying a dev-server capture is not byte-identical to a production file.] → The behaviour under test does not depend on the bundle. It depends on marked tags being in `<head>` before `createRoot` renders, and the capture reproduces that exactly. The before/after counts in the pull request are measured on real `npm run build:prerender` output to confirm it.

## Migration Plan

None. The change ships with the next deployment. Rollback is a revert. The static files and the client code change together in the same build, so no deployment mixes marked files with unmarked code.
