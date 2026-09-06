# JSON-LD leaks across routes during prerender

Traced by the orchestrator after the schema agent flagged an unexplained
discrepancy between source and live HTML.

## Observed on the live site

| URL | ld+json blocks | Person blocks | Types present |
|---|---|---|---|
| `/` | 1 | 1 | Person, Organization |
| `/en/` | 2 | **2** | Person, Organization |
| `/privacy-policy` | 1 | 1 | Person, Organization |
| `/projects/frontdesk-ai` | 2 | 1 | SoftwareApplication, Offer, Person, Organization |
| `/llm-wiki/kurs/2-onboarding` | 2 | 1 | FAQPage, Question, Answer, Person, Organization |

The `Person` block served on `/privacy-policy` is byte-identical to the one in
`src/pages/Home.jsx` — same `jobTitle`, same `sameAs`, same `knowsAbout`, same
`worksFor: Qamera AI`.

## Why that is a bug

`StructuredData` is imported by exactly five pages:

    src/pages/Home.jsx   src/pages/Blog.jsx   src/pages/BlogPostPage.jsx
    src/pages/CourseHub.jsx   src/pages/CourseLesson.jsx

`PrivacyPolicy.jsx` contains no schema code at all, and `Home` is mounted only on
the index route (`src/App.jsx:43`, `<Route index element={<Home />} />`). Local
`main` is level with `origin/main`, so the deployed build matches this source.
The homepage's Person schema therefore has no legitimate route by which to appear
on `/privacy-policy`. It is leaking.

`/en/` emitting it twice is the same defect showing its other face.

## Root cause

`src/components/seo/StructuredData.jsx` does not use react-helmet-async. It
appends the script imperatively in a `useEffect`:

    script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

Because the node is attached outside React's render tree, it is not route-scoped
the way `SEO.jsx` (which does use `<Helmet>`) is. `scripts/prerender.mjs`
captures whatever is in `document.head` at snapshot time via `page.content()`.

## Why the existing guard does not catch it

`scripts/prerender.mjs:152-170` already carries a hard guard, added after a real
incident its own comment records: the 2026-07-29 deploy shipped
`/privacy-policy`, `/terms-of-service` and `/llm-wiki` with the homepage's
`<head>`, and the build passed because the check only asserted that tags existed.
The fix was to require that the canonical's pathname match `location.pathname`.

That guard validates canonical, description, and og:title — all Helmet-managed.
JSON-LD is injected outside Helmet, so the guard cannot see it. This is the same
class of head-leakage as the July incident, surviving in the one part of `<head>`
the guard does not inspect.

## Fix

1. Move `StructuredData` onto `<Helmet>` so JSON-LD is route-scoped like every
   other head tag, rather than an imperative `document.head` mutation.
2. Extend the prerender guard to assert JSON-LD as well — at minimum that the
   block count matches what the route should emit, and that no two blocks are
   identical. The guard's own design note ("canonical is the only reliable
   witness") stops being true once JSON-LD is Helmet-managed and route-bound.
3. `verify-prerender-output.mjs` is the natural home for the duplicate-block
   assertion, so a regression fails the Vercel build rather than shipping.

Severity: High. It does not block indexing — Google tolerates a stray Person
entity — but `/en/` currently emits a duplicate identical entity, the entity graph
is incoherent site-wide (see schema.md), and the underlying mechanism is a
known-recurring prerender fault that has already reached production once.
