## Context

See `proposal.md` — Why. Three constraints shape the approach.

**Base branch.** PR #29 modified `scripts/prerender.mjs`, adding `CONTENT_ROUTES`
and a wait on a `data-content-ready` marker for article and lesson routes, whose
bodies now arrive through a separate `import()`. It merged on 2026-09-06, so this
change branches from `main` (`10c0e59`) and both markers are already present.

**`lastmod` cannot be derived from git in this build environment.** The full
account is in Decision 4, including the two attempts that failed before the
working one. The short version: the build clones shallow, a shallow clone reports
its boundary date for every untouched file, and the result is non-empty and
well-formed, so nothing downstream can tell it from a real date.

**Deployments work again.** The Vercel integration was silent between 2026-07-30
and 2026-09-06; it now produces previews on push and a production deployment on
merge. That is what made Decision 4 resolvable — the first two attempts both
looked correct locally and were only disproved by a real build.

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
- Changing where blog post dates come from. Frontmatter already carries them and
  already worked; only the non-markdown routes move.

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

**Superseded 2026-09-06 by measurement.** Two earlier attempts are recorded here
because each looked right until it met the real build.

*Attempt 1 — guard the empty result.* Never fired. Shallow clones return a
plausible wrong date, not an empty one. A Vercel preview built from it passed and
still emitted 33 fabricated dates.

*Attempt 2 — detect the shallow state and `git fetch --unshallow`.* The detection
worked; the repair did not. On Vercel the fetch returned success and left the
repository shallow, so the guard threw and the build failed. Correct behaviour,
unusable outcome: it blocks every deployment, and no build-environment setting was
found that fixes it.

**Chosen: take git out of the question entirely.** Every date lives with the thing
it describes, as blog frontmatter already did:

| Source | Where the date lives |
|---|---|
| blog posts | `date` / `modified` in frontmatter (unchanged) |
| course lessons | `updated` in frontmatter, required by the content validator |
| projects | `updated` on each entry in `src/data/projects.js` |
| pages without markdown | `@sitemapUpdated YYYY-MM-DD` marker in the page's own `.jsx` |

`getGitLastModDate` and the shallow guard are both deleted; the script no longer
imports `child_process`. A missing date fails the build, naming the file.

This also fixes a defect the git approach hid: all nine project URLs shared one
date taken from the single file backing them, so touching one project claimed the
other eight had changed. Per-entry dates end that.

The cost is that dates are now maintained by hand. That is mitigated where it
matters — the content validator rejects a lesson without `updated`, and the
sitemap generator rejects a page without its marker — so the failure mode is a
red build, not a quiet lie.

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
- **Local success does not predict the build environment** → proven twice in this
  change: attempt 1 passed locally and on a real preview while still emitting 33
  fabricated dates, and attempt 2 passed locally and failed the deployment. The
  environments differ precisely where the defects live — clone depth and
  animation timing. Every claim here is verified on a Vercel preview before the
  task is ticked, not only in `npm run build:prerender` locally.
- **Hand-maintained dates go stale** → the mitigation is that forgetting one is a
  red build, not a wrong date: the content validator rejects a lesson without
  `updated` and the sitemap generator rejects a page without its marker. Nothing
  catches a date that is present but not refreshed after an edit; that is the
  residual cost of this approach and it is accepted, because the alternative is a
  date that is confidently wrong on every deployment.
- **`prerender-output-invariants` was edited by both changes** → #29 merged first
  and added a JavaScript payload budget as its fifth requirement, so this change
  reconciles by appending its two output invariants as the sixth and seventh.
  They do not overlap in content.

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

None. The one that stood here — whether `lastmod` should move from git history to
content-colocated metadata — was forced by measurement rather than deferred:
git-derived dates cannot be made correct in this build environment, so the move
happened inside this change rather than a later one. See Decision 4.
