## Context

See `proposal.md` for why. This section records what the site did before the change, because the removal deletes the only evidence of it.

### Stan przed usunięciem (before-state, checked 2026-10-28)

Read-only check of production (`https://pawel.lipowczan.pl`, deployment built 2026-10-16 from `b563130`, the current `main`). Static HTML fetched with `curl`; behaviour measured with headless Chromium, each page loaded twice in a fresh context — once as served, once with every `clickrank.ai` request blocked — and the two final DOMs compared. Pages: `/`, `/en/`, `/blog`, `/cookie-policy`, `/llm-wiki`.

**The script loads twice on every page.** The prerendered HTML of every route carries a static `<script src="https://js.clickrank.ai/seo/<account>/script?1792171…" async>` — the tag the `index.html` injector created while the prerenderer was rendering, baked in with the build-time timestamp (2026-10-16 17:21–17:25 UTC). The same HTML still carries the injector, which adds a second tag with a fresh timestamp. Both execute: two `GET …/script` (11 219 bytes each) and two `POST …/optimization` per page view, ~0.3–0.5 s after navigation.

**What is sent.** Each `POST /optimization` body is the full page URL, e.g. `{"uris":"https%3A%2F%2Fpawel.lipowczan.pl%2Fblog"}`; the vendor also receives the visitor's IP and User-Agent with every request. Every response sets two vendor cookies on `js.clickrank.ai`: `XSRF-TOKEN` and `clickrankai_session` (HttpOnly), both `Secure; SameSite=Lax; Max-Age=7200`. No consent is asked; neither policy names the vendor.

**What it changes.**

| Page | `/optimization` response | Effect on the page |
| --- | --- | --- |
| `/` | `{"p":{"canonical":true}}` | adds canonical tags |
| `/en/` | `{"p":null}` | none |
| `/blog` | `{"p":{"canonical":true}}` | adds canonical tags |
| `/cookie-policy` | `{"p":{"canonical":true}}` | adds canonical tags |
| `/llm-wiki` | `{"p":null}` | none |

With ClickRank running, the DOM ends with four `rel="canonical"` links instead of two — one more per loaded copy of the script — all pointing at the page's own URL. Title, meta description, `<h1>`, image `alt` attributes, JSON-LD blocks, link count and visible text are identical with and without it on all five pages. The only thing ClickRank does on this site today is duplicate the canonical tag.

**Side observation, not caused by ClickRank:** with ClickRank blocked, the hydrated DOM still holds two `<title>`, two `meta[name=description]` and two canonical links — the prerendered set plus the set React hoists on mount. The static HTML has one of each (the build checks that). Out of scope here; noted for a follow-up.

**What else the site stores and contacts (no consent given, ClickRank blocked).** On load: no cookies; `localStorage.i18nextLng` (language); requests to `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js` (same origin). After "Odrzuć": `localStorage.cookieConsent`. After opening the booking window: requests to `app.zencal.io` and `meetendly.fra1.digitaloceanspaces.com` (the avatar image), no cookies, and the Zencal widget — rendered in the page, not in a frame — writes `redux-root`, `iconify-count` and `iconify-version` to `localStorage` and the last two to `sessionStorage` of the site's own origin.

### Constraints that shape the approach

- The legal pages already carry a `@sitemapUpdated YYYY-MM-DD` marker that `scripts/update-sitemap.js` reads and validates (`src/AGENTS.md`, Local Contracts). It is the repository's existing answer to "a date stored with the content".
- `tests/AGENTS.md` forbids tests that read `dist/`; a claim about build output belongs in `scripts/verify-prerender-output.mjs`.
- A published blog article and `public/llms-full.txt` quote the ClickRank loader as part of a case study, so the built HTML legitimately contains the string `clickrank` in prose and code samples.

## Goals / Non-Goals

**Goals:**

- No ClickRank request from any page, by any path, and a build that fails if one comes back.
- Policies that describe what the check above observed, in both languages.
- A last-updated date that changes only when someone changes it.

**Non-Goals:**

- Rewriting the policies' legal analysis. Lawful basis per processing, transfer safeguards and retention periods are questions for Paweł, raised in the pull request with the `ss:legal` review notes — not answered by this change.
- Fixing the duplicated head tags after hydration (see the side observation above).
- Editing the published case-study article.
- Changing what the Zencal widget stores; it is a vendor embed and is only described.

## Decisions

### D1 — Remove the injector; the static tag goes with it

The static tag is not authored anywhere: the prerenderer captures `document.head` after the injector ran. Deleting the injector from `index.html` removes both. No change to `scripts/prerender.mjs` is needed, and none is made — a filter there would hide the next reintroduction instead of failing on it.

### D2 — Guard executable scripts, not the string

The new build check parses `<script>` elements of every built HTML file and fails on a `src` or inline body that references `clickrank.ai`, skipping `type="application/ld+json"`. A plain substring test (the approach the existing `googletagmanager` check uses) would fail the build on the case-study article, whose body quotes the loader. The logic is a pure exported function with a unit test, following `findPolishInEnglishPages`.

Alternative considered: a generic "no third-party script in static HTML" rule. Rejected for now — Vercel's same-origin scripts and future embeds would need an allowlist whose design is a change of its own. The named check is what the removal needs.

A second, runtime guard lives in a new E2E spec: load a page, wait past the 3 s idle timeout, assert no request reached a `clickrank.ai` host. It covers a reintroduction through application code, which the static check cannot see. It asserts only on network requests and would qualify for `ENGINE_INDEPENDENT`; it stays on the default projects so the pinned list and the rule that documents it stay untouched.

### D3 — The visible date reuses the sitemap marker's date, enforced by the sitemap step

Each legal page declares `const LAST_UPDATED = "YYYY-MM-DD"` directly under its `@sitemapUpdated` comment, and renders that constant. `scripts/update-sitemap.js`, which already reads the marker, also reads `LAST_UPDATED` when a file declares it and fails the build when the two differ.

Alternatives considered:
- A date per document in `legal.json`. Rejected: two locale files plus the marker make three places to change, and the PL and EN copies of one document could drift apart.
- A shared data module read by both the pages and the sitemap script. Rejected: it would move three pages off the marker contract that `src/AGENTS.md` documents and the sitemap script enforces, for no gain over a five-line equality check.
- Dropping the marker for legal pages and reading only the constant. Rejected for the same reason — the marker contract covers five pages, and a special case for three of them is a rule in two places.

### D4 — Format the ISO date as a calendar day, in UTC

`new Date("2026-10-28")` is midnight UTC; formatted in a time zone behind UTC it prints the 27th. The app mounts with `createRoot`, so each visitor's browser re-renders the date in its own time zone. A pure helper in `src/utils/` formats with `timeZone: "UTC"` for the page's locale (`pl-PL`, `en-US`, as the pages use today). One helper, three callers.

### D5 — Policy content follows the observed inventory

The cookie policy gains a concrete list — what the site writes to storage, Google Analytics after accept, Zencal on booking, Vercel Analytics and Speed Insights for everyone — replacing the Google Fonts entry and the "font size" example. The privacy policy names each recipient by service and what it receives, and adds the LLM Wiki list, which its signup form already sends readers to the privacy policy for.

Statements about the cookieless tools follow Vercel's own documentation (no cookies; visitors recognised by a hash of the request, discarded after 24 hours; data used in aggregate). Nothing is claimed about a vendor that was not observed or documented.

### D6 — The Vercel disclosure moves here from `consolidate-ui-drift`

That change's task group 1 and its `analytics-consent` delta are removed there and absorbed here (`specs/analytics-consent/spec.md`, reworded so the general naming rule lives once, in `policy-pages`). Two changes editing the same policy paragraphs would conflict, and the requirement would be specified twice. The move is a separate commit so it can be reverted alone if Paweł prefers the original split.

## Risks / Trade-offs

- **The removal discards whatever ClickRank's server had stored for this site.** → Measured above: its only effect was a duplicate canonical tag. Nothing to preserve. Any paid subscription is cancelled by Paweł outside the repository.
- **Policy wording without a lawyer.** → Drafted from observed facts only, reviewed with `ss:legal`; open legal questions are listed in the pull request rather than resolved in copy.
- **The E2E spec waits ~4 s per test.** → One spec file, two routes; about 12 s per project locally.
- **The `LAST_UPDATED` / marker pairing is two values in one file.** → The sitemap step fails the build on disagreement, so the pair cannot drift silently.
- **Zencal may change what it stores.** → The policy describes the widget's category of storage and links the vendor, not a frozen key list.

## Migration Plan

1. ClickRank removal (index.html, CSP, test, comment) plus the two guards — independent of the copy, revertable alone.
2. Fixed date helper and the three pages, with the sitemap equality check.
3. Policy copy in both languages.
4. Scope move out of `consolidate-ui-drift` — separate commit.

Rollback: revert the commit. Reintroducing ClickRank would also require reverting the build check, which is the point.

## Open Questions

- Whether to annotate the 2026-04 case-study article that ClickRank has since been removed. Does not affect this change.
