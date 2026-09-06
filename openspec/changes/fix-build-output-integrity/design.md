## Context

See `proposal.md` — Why. Three constraints shape the approach.

**This change branches from `perf/speed-up-first-load`, not `main`.** PR #29 has
already modified `scripts/prerender.mjs`: it adds `CONTENT_ROUTES` (line 114) and
waits for a `data-content-ready` marker on `<html>` for article and lesson routes
(line 214), because those pages now load their body through a separate
`import()`. Branching from `main` conflicts in that file.

**`getGitLastModDate()` has two silent failure paths, not one.** The visible one
is `catch {}`. The more likely one on Vercel is quieter:

```js
const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", relativePath], …).trim();
if (iso) return iso.split("T")[0];
// falls through
return new Date().toISOString().split("T")[0];
```

**Corrected 2026-09-06, after measuring a real Vercel build.** The empty-output
path above is real but is *not* what fires. A shallow clone does not make
`git log` return nothing — it makes it return a plausible wrong date.

In a shallow clone the boundary commit is grafted as parentless, so every file
untouched since that boundary looks as though it was *introduced* there.
`git log -1 --format=%cI -- <path>` then returns the boundary date for all of
them. Verified in a `--depth 1` clone of this repository:

```
git log -1 --format=%cI -- src/data/projects.js       2026-09-06   (really 2025-12-01)
git log -1 --format=%cI -- src/pages/PrivacyPolicy.jsx 2026-09-06   (really 2026-07-29)
```

Non-empty, well-formed, and wrong. That is why 34 URLs shared one date, why
nothing appeared in the build log, and why the first version of this fix — which
only guarded the empty case — passed a preview build on Vercel while still
emitting 33 fabricated dates.

The usable signal is `git rev-parse --is-shallow-repository`, not the shape of
`git log` output.

The function is called at seven sites — three legal pages, the llm-wiki landing,
the course hub, each lesson, and `src/data/projects.js` (line 265) whose single
date stamps all eighteen project URLs.

**Nothing can be verified on a deployment right now.** The Vercel integration has
produced no deployment since 2026-07-30 and posts no status on PR #29. This does
not block implementation, but it does block the final confidence check, and the
build gates only bite where the build runs.

## Goals / Non-Goals

**Goals:**

- Prerendered HTML that a crawler or a JavaScript-less visitor sees as the site
  actually looks, for the below-the-fold half PR #29 does not cover.
- Structured data that belongs to the page serving it, enforced by the same
  mechanism as the rest of the document head.
- A sitemap that either states a true date or fails.
- Each of the three enforced in the build, so a regression is a red build rather
  than a quiet bad deploy.

**Non-Goals:**

- Changing scroll-animation behaviour for real visitors. The animation stays; only
  what gets captured changes.
- Touching `Hero.jsx`, `App.jsx`, the content loaders or `vite.config.js` — PR #29
  owns those.
- Tuning `waitTime`. See Decision 1.
- Moving `lastmod` to content-colocated metadata. Worth doing, larger than this
  change; noted under Open Questions.

## Decisions

### 1. Scroll the page during capture, rather than lengthening the wait or stripping styles

The six affected sections (`#about`, `#skills`, `#projects`, `#testimonials`,
`#contact`, and the booking CTA) animate on viewport entry. The prerenderer never
scrolls, so they never enter the viewport and are captured at their initial
state. No wait duration reaches them — this is not a race, it is an event that
never fires.

Chosen: drive the page through a full scroll before capturing, then return to the
top.

**Ordering constraint, from the session working on #29:** the scroll pass must run
*after* the `data-content-ready` wait, not before. On article and lesson routes
the body arrives via `import()`, so scrolling earlier measures a document whose
main content does not exist yet and stops short. The homepage has no such marker
because `Home` is static, but the ordering must hold generally.

*Alternative — raise `waitTime` from 1000 to 2000 on Vercel:* rejected. It would
not help at all here, since the sections never animate regardless of waiting. It
is also the mechanism that made local and deployed builds disagree, and #29
already removes the above-the-fold dependency on it. Leave it alone.

*Alternative — strip inline `opacity`/`transform` from the captured HTML:*
rejected. It is cheaper, but it makes the static file assert something the
running page did not produce. An element that is genuinely meant to be hidden
would be revealed, and the artifact would stop being a faithful capture — which
is the property this whole change exists to restore.

*Alternative — pass `initial={false}` to the `whileInView` sections too:*
rejected. It would suppress the scroll animation on first load for real visitors,
contradicting task 6.3 of #29, and it touches components in that change's scope.

### 2. The visibility gate asserts named elements, not a count

A gate that counts inline `opacity: 0` would be brittle: it fails on legitimately
hidden UI (a closed mobile menu, a dialog) and its threshold drifts with every
component added.

Chosen: assert that the document's `<h1>` and each landmark section the route
declares are captured visible. Landmark sections are the ones the site's own
navigation targets by `id`, so the list is derived from the nav rather than
maintained by hand.

This keeps the check meaningful — it fails exactly when a visitor would see a
blank region — and lets deliberately hidden elements pass without an allowlist.

### 3. Structured data moves onto Helmet

`StructuredData.jsx` builds a `<script>` node and appends it to `document.head` in
a `useEffect`, with a cleanup that removes it. Being outside React's render tree
makes it invisible both to route scoping and to the prerender guard.

Chosen: render the script through `<Helmet>`, the same path `SEO.jsx` already
uses for every other head tag. Route scoping then comes for free — Helmet removes
what a departing route declared — and the guard at `prerender.mjs:152` can see it,
which closes the specific blind spot that let the 2026-07-29 incident recur in a
new form.

JSON must be escaped so a `<` inside a string cannot terminate the script
element.

*Alternative — keep the imperative append and fix cleanup ordering:* rejected. It
might stop the duplication, but the data stays outside the guard's view, so the
class of defect stays unobservable. The point is not only to fix these two pages.

### 4. `lastmod` failure is loud, and covers the empty-output path

Chosen: check `git rev-parse --is-shallow-repository` once before resolving any
date. On a shallow checkout, attempt `git fetch --unshallow`; if that leaves the
repository shallow, or fails, throw. Separately `getGitLastModDate` still throws
when git errors or returns nothing, naming the path.

Self-healing rather than failing outright, because the alternative blocks every
deployment until a build-environment setting changes — and there may be no such
setting to change. Fetching the history the build already has access to is
cheaper and keeps deployments working; the throw remains as the floor when it
cannot.

Verified in a `--depth 1` clone: the guard detects the shallow state, unshallows,
and the same two paths then resolve to 2025-12-01 and 2026-07-29 instead of one
shared boundary date.

### 5. Gate sequencing

The visibility gate cannot be switched on before both changes land. Measured
today: on `main` it fails every route; on `perf/speed-up-first-load` `/blog`
passes and `/` still fails, because the sections this change fixes are still
captured hidden.

Chosen: implement the check together with the scroll fix, on a branch based on
#29, so the two arrive together and the gate is green the moment it is active.
If merge order reverses, the gate must not be enabled by the earlier merge.

## Risks / Trade-offs

- **Scrolling changes prerender timing and could destabilise capture** → run the
  scroll after the existing readiness wait, and assert the document reached its
  full height before capturing rather than assuming a fixed scroll count.
- **A failing `lastmod` lookup breaks the Vercel build** → intended, but it means
  the first deploy after this change fails until git history is available. Land
  the sitemap change with the history fix, not before it.
- **JSON-LD through Helmet may render differently than the manual append** → the
  prerender guard and the duplicate check both assert on the output, so a
  regression here fails the build rather than shipping.
- **Nothing can be verified on a preview deployment** → the Vercel integration has
  been silent since 2026-07-30. Every claim in this change is verifiable in a
  local `npm run build:prerender`, which is the same script Vercel runs, so this
  degrades confidence rather than blocking work. It does mean the gates go
  unexercised in their real environment until deployments return.
- **Two changes edit `prerender-output-invariants`** → whichever merges second
  reconciles the delta. #29 adds a JavaScript payload budget; this change adds two
  output invariants. They do not overlap in content.

## Migration Plan

1. Branch from `perf/speed-up-first-load`.
2. Sitemap first — it is independent of the other two and of #29. Loud failure
   plus whatever the Vercel build needs to resolve git history.
3. `StructuredData.jsx` onto Helmet, and the duplicate/foreign-block gate. Also
   independent of #29.
4. Scrolled capture, then the visibility gate, last — this is the part that only
   goes green once #29 is in.
5. Rollback is per-step: each of the three is separately revertible, and the gates
   are additive assertions rather than changes to what the build produces.

## Open Questions

- Whether `lastmod` should move from git history to content-colocated metadata,
  as blog frontmatter already does. It would remove the dependency on checkout
  depth entirely and give `src/data/projects.js` per-project dates instead of one
  shared date. Deferring this does not change these specs or the task breakdown —
  the loud-failure requirement holds either way — so it belongs in its own change.
