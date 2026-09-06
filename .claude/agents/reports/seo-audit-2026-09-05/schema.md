# Structured Data Audit — pawel.lipowczan.pl

Date: 2026-09-05. Sources: live-fetched HTML in `scratchpad/seo/pages/*.html` and
`scratchpad/seo/home.html`, plus source inspection of `src/components/seo/`,
`src/pages/*.jsx`, `src/utils/faqExtractor.js`, `src/utils/constants.js`.

## 1. Inventory — what each page type emits today

Extracted with a single pass over every fetched HTML file
(`@type` values per `<script type="application/ld+json">` block):

| Page type | Blocks found | Notes |
|---|---|---|
| Home `/` and `/en/` | `Person` (nested `Organization` only as `worksFor` value) | `/en/` fetch shows the **same Person block twice** — duplicate. |
| Blog index `/blog`, `/en/blog` | `Person`, `BreadcrumbList` | Breadcrumb correct per-language (`/en/` home in the EN block). |
| Blog post (all samples: `vibe-coding-przewodnik`, `vibe-coding-guide`, `pit38`, `software30`, `zapier`, `airtable`, `gb_blogpl`) | `Person`, `FAQPage` (when post has an FAQ section), `BlogPosting`+nested `Person`/`WebPage`/`Organization`/`ImageObject`, `BreadcrumbList` | Most complete page type. See breakages below. |
| Project case study (`frontdesk-ai`, `automatyzacje-dokumentow`) | `Person`, `SoftwareApplication`+`Offer` | No `BreadcrumbList` JSON-LD (UI breadcrumb exists, not mirrored to JSON-LD). Wrong `@type` — see Critical #3. |
| Course landing `/llm-wiki` | `Person` only | No FAQ schema by design (comment in `LlmWikiLanding.jsx` says landing renders FAQ UI without markup — correct, avoids new-FAQPage-on-commercial-site problem). No `BreadcrumbList`, no `Course`. |
| Course hub `/llm-wiki/kurs` | `Person`, `FAQPage` | No `BreadcrumbList`, no `Course`/`CourseInstance`. |
| Course lesson (`1-zaloz-katalog`) | `Person`, `FAQPage` (when lesson has FAQ) | No `BreadcrumbList` JSON-LD (UI breadcrumb exists). No link to a `Course` entity. |
| Policy pages (PL + EN privacy) | `Person` only | No `WebPage`/`ContactPage`-class markup, no breadcrumb. |

**Person/Organization entity graph:** Not linked by `@id` anywhere in the
codebase or the live output. `Person` has no `@id`; `Organization` (Qamera AI)
is only ever an inline nested value inside `worksFor` (Home) or inside
`BlogPosting.publisher` (blog posts) — and these two `Organization` objects
are **different entities with the same generic shape but no shared `@id`**, so
Google/LLMs cannot tell they're the same publisher. `BlogPosting.author` is a
bare `{ "@type": "Person", name, url }` with no `@id` back-reference to the
homepage `Person` block either. Net: zero entity-graph coherence today — every
page's `Person`/`Organization` mention is a freestanding, disconnected blob.

**Discrepancy flagged, not resolved:** source code (`src/pages/Home.jsx`) only
renders the `Person` block on the homepage route (`<StructuredData
schema={personSchema} />` inside `Home.jsx`, nowhere else — verified by
grepping the whole `src/` tree for `personSchema`/`Organization`). But the
live fetches show `Person` on every page type, including pages with no such
code path (project pages, policy pages, course pages). This means either (a)
the deployed site is ahead of the checked-out `main`, or (b) there is a
global-layout injection this audit did not locate. **Unverified — flag for a
developer to reconcile before acting on the "duplicate on `/en/`" finding
below**, though the duplicate itself is directly observed in the fetched HTML
regardless of cause.

**FAQPage:** present on most blog posts and both course hub/lesson pages —
all on a commercial site. Per the plugin's Aug-2023 restriction, this is
**Info priority**, not Critical: no Google rich-result benefit, but real
upside for AI/LLM citation (ChatGPT, Perplexity, AI Overviews), which fits a
course/portfolio site optimizing for AI discoverability. No action required;
do not remove.

**WebSite + SearchAction:** no internal search feature exists on the site
(grepped layout/navigation/Home — no search input, no search route). Correctly
absent; do not add.

**HowTo / SpecialAnnouncement / CourseInfo:** absent, correctly so — these are
deprecated and out of scope for new markup.

## 2. Validation failures on existing blocks

| Block | Issue | Severity |
|---|---|---|
| Home `Person` (EN page) | Rendered twice, byte-identical, on `/en/` | **Critical** |
| Person/Organization site-wide | No `@id` on either entity; two independent `Organization` shapes (Home `worksFor`, BlogPosting `publisher`) never reconciled | **Critical** |
| `ProjectPage.jsx` `SoftwareApplication` | Case studies are not installable software products. `Offer{price:"0", priceCurrency:"USD"}` is a fabricated free-offer that Google's Merchant/Product guidelines treat as commerce data — misleading for a portfolio case study, and `price: "0"` is very close to placeholder-shaped data | **High** |
| `BlogPostPage.jsx` `BreadcrumbList` | Hardcoded English label `"Home"` even on PL posts (should use `t("blog.home")`, as `Blog.jsx` already does) | **Medium** |
| `BlogPostPage.jsx` `BreadcrumbList` / `mainEntityOfPage` / `postUrl` for EN posts | Item URLs are built as `${SITE_CONFIG.url}/blog/${post.slug}` with no `/en` prefix — an EN post's breadcrumb and `mainEntityOfPage.@id` point at the PL URL path even when the post is the English one | **High** |
| `CourseLesson.jsx` `Breadcrumbs` UI | `{ label: "Home", path: "/" }` hardcoded, and never mirrored into JSON-LD at all | **Medium** |
| `BlogPosting.dateModified` | Falls back to `post.date` when no `modified` frontmatter exists, so `datePublished === dateModified` on ~most of the 60 posts — schema-valid but signals a site that never updates content | **Low** |
| All `inLanguage` | Never emitted on any block (`BlogPosting`, `FAQPage`, `Person`, `WebPage`) | **Medium** |

## 3. Missing opportunities, priority order

1. **Critical — fix the entity graph, not add to it.** Give the homepage
   `Person` and `Organization` stable `@id`s and reuse those `@id`s (as
   `{"@id": "..."}` references, not re-declared objects) in every
   `BlogPosting.author` / `BlogPosting.publisher`, and eventually in
   `Course.provider`. This is the single highest-leverage change on the site —
   it turns 60+ disconnected blog posts and a course into one coherent graph
   pointing at one Person/Organization Google and LLMs can build a knowledge
   panel from.
2. **High — `BreadcrumbList` on every page type that lacks it**: project case
   studies, `/llm-wiki`, `/llm-wiki/kurs`, course lessons, policy pages. The
   UI component (`Breadcrumbs.jsx`) already renders the trail visually on
   most of these; only the JSON-LD mirror is missing.
3. **High — `Course` for `/llm-wiki/kurs`**, with lessons related back to it
   (`hasPart`, each an `@id`-referenced `LearningResource`/`Article`-shaped
   entry, not a full duplicate `Course` per lesson).
4. **Medium — `ProfilePage`** wrapping the `Person` as `mainEntity`, placed on
   the homepage (no separate `/about` route exists) for E-E-A-T.
5. **Medium — `inLanguage`** on `BlogPosting`, `Course`, and `WebSite`-level
   markup: `"pl-PL"` on the PL tree, `"en-US"` on the `/en/` tree. Ready
   templates below use this.
6. **Low — replace `SoftwareApplication`+fake `Offer`** on `/projects/*` with
   a `CreativeWork` (or the closest fit, since Schema.org has no
   `CaseStudy` type) — drop the invented `$0` offer entirely.

Per the plugin's hard rules: **no `HowTo`** anywhere (deprecated Sept 2023),
and **no new `FAQPage`** recommended on `/llm-wiki` for Google benefit — the
existing FAQ UI there without markup is the correct call already made in the
code comment.

## 4. Ready-to-paste JSON-LD

### 4a. Person + Organization with stable `@id` (site-wide entity anchor)

Place this on the homepage (`/` and `/en/`, swap `inLanguage` only) **instead
of** the current unlinked `personSchema` in `Home.jsx`. Every other page's
`author`/`publisher` should then reference `{"@id": "https://pawel.lipowczan.pl/#person"}`
/ `{"@id": "https://pawel.lipowczan.pl/#organization"}` rather than
re-declaring the objects.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://pawel.lipowczan.pl/#person",
      "name": "Pawel Lipowczan",
      "jobTitle": "Software Architect & Technology Advisor",
      "url": "https://pawel.lipowczan.pl",
      "image": "https://pawel.lipowczan.pl/images/pawel-lipowczan.webp",
      "email": "pawel@lipowczan.pl",
      "sameAs": [
        "https://github.com/plipowczan",
        "https://linkedin.com/in/pawellipowczan",
        "https://twitter.com/pawellipowczan",
        "https://hachyderm.io/@pawellipowczan"
      ],
      "knowsAbout": ["AI", "Automation", "No-Code", "Software Architecture"],
      "worksFor": { "@id": "https://qamera.ai/#organization" }
    },
    {
      "@type": "Organization",
      "@id": "https://qamera.ai/#organization",
      "name": "Qamera AI",
      "url": "https://qamera.ai"
    }
  ]
}
```

Note: `image` above uses a placeholder filename — replace with the real
absolute headshot URL before shipping; do not paste as-is if that file does
not exist.

Then every `BlogPosting` (in `BlogPostPage.jsx`) changes `author`/`publisher`
to:

```json
"author": { "@id": "https://pawel.lipowczan.pl/#person" },
"publisher": { "@id": "https://pawel.lipowczan.pl/#person" }
```

(There is no separate publishing organization worth modeling here — the
`Organization` in `BlogPosting.publisher` today is Qamera AI, which is the
author's employer, not the site's publisher. If the intent is "this site
publishes under Pawel's own name," point `publisher` at the `#person` `@id`
too, as above. If Qamera AI should remain the publisher of record, use
`{"@id": "https://qamera.ai/#organization"}` instead — a product decision, not
a schema one.)

### 4b. BreadcrumbList — generic templates for the pages that lack one

Project case study (`/projects/frontdesk-ai` shown; swap slug/title):

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pawel.lipowczan.pl/" },
    { "@type": "ListItem", "position": 2, "name": "Projekty", "item": "https://pawel.lipowczan.pl/#projects" },
    { "@type": "ListItem", "position": 3, "name": "Frontdesk AI", "item": "https://pawel.lipowczan.pl/projects/frontdesk-ai" }
  ]
}
```

Course hub (`/llm-wiki/kurs`):

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pawel.lipowczan.pl/" },
    { "@type": "ListItem", "position": 2, "name": "LLM Wiki", "item": "https://pawel.lipowczan.pl/llm-wiki" },
    { "@type": "ListItem", "position": 3, "name": "Kurs", "item": "https://pawel.lipowczan.pl/llm-wiki/kurs" }
  ]
}
```

Course lesson (`2-onboarding` shown; swap slug/title, derive from
`lesson.order`/`lesson.title` in `CourseLesson.jsx`):

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pawel.lipowczan.pl/" },
    { "@type": "ListItem", "position": 2, "name": "Kurs", "item": "https://pawel.lipowczan.pl/llm-wiki/kurs" },
    { "@type": "ListItem", "position": 3, "name": "Onboarding", "item": "https://pawel.lipowczan.pl/llm-wiki/kurs/2-onboarding" }
  ]
}
```

Policy page (repeat per page, swapping name/URL):

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pawel.lipowczan.pl/" },
    { "@type": "ListItem", "position": 2, "name": "Polityka prywatności", "item": "https://pawel.lipowczan.pl/privacy-policy" }
  ]
}
```

### 4c. Course / CourseInstance for `/llm-wiki/kurs`

Uses the existing `coursePosts` data (`src/data/coursePosts.js`) to build
`hasPart`. `provider` reuses the `@id` from 4a rather than re-declaring
Qamera AI/Person.

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://pawel.lipowczan.pl/llm-wiki/kurs#course",
  "name": "LLM Wiki - darmowy kurs: zbuduj własny second brain",
  "description": "Od «Use this template» do bazy wiedzy, która kumuluje się sama i zasila Twojego agenta. Krok po kroku, na darmowym szablonie.",
  "url": "https://pawel.lipowczan.pl/llm-wiki/kurs",
  "provider": {
    "@type": "Person",
    "@id": "https://pawel.lipowczan.pl/#person"
  },
  "inLanguage": "pl-PL",
  "isAccessibleForFree": true,
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT2H",
    "inLanguage": "pl-PL"
  },
  "hasPart": [
    {
      "@type": "LearningResource",
      "name": "Załóż katalog",
      "url": "https://pawel.lipowczan.pl/llm-wiki/kurs/1-zaloz-katalog",
      "position": 1
    },
    {
      "@type": "LearningResource",
      "name": "Onboarding",
      "url": "https://pawel.lipowczan.pl/llm-wiki/kurs/2-onboarding",
      "position": 2
    }
  ]
}
```

`hasPart` above shows the pattern for two lessons — generate the remaining
entries from `coursePosts` (`slug`, `title`, `order`) rather than hand-listing
all eight; do not hand-maintain a duplicate list that drifts from the data
module (see `src/data/AGENTS.md` on file-derived content).

### 4d. ProfilePage wrapping the Person (homepage E-E-A-T)

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": { "@id": "https://pawel.lipowczan.pl/#person" },
  "name": "Pawel Lipowczan — Software Architect & Technology Advisor",
  "url": "https://pawel.lipowczan.pl",
  "inLanguage": "pl-PL"
}
```

EN homepage: same block with `"url": "https://pawel.lipowczan.pl/en/"` and
`"inLanguage": "en-US"`.

## 5. Bilingual `inLanguage` handling

- PL tree (`/`, `/blog/...`, `/projects/...`, `/llm-wiki/...`, policy pages):
  `"inLanguage": "pl-PL"` on every content-bearing block (`BlogPosting`,
  `Course`, `WebPage`/`ProfilePage`).
- EN tree (`/en/`, `/en/blog/...`, `/en/projects/...`): `"inLanguage": "en-US"`.
  `/llm-wiki` has no EN mirror (confirmed in `LlmWikiLanding.jsx`/`CourseHub.jsx`
  comments — PL-only, `/en/llm-wiki*` redirects to the PL canonical), so no EN
  `Course`/lesson schema is needed until that mirror exists.
- The shared entity graph (`Person`, `Organization`) is **language-neutral and
  must not fork** — one `@id` pair, reused from both trees, with no
  `inLanguage` property on the `Person`/`Organization` nodes themselves
  (`inLanguage` belongs on the content nodes, not the entity nodes).
- `BreadcrumbList.itemListElement[].name` must localize (this audit found the
  opposite bug live: hardcoded `"Home"` on PL blog posts and PL course
  lessons) while `.item` URLs must resolve to the correct `/en/` or bare path
  per language (this audit found the opposite bug live: EN blog post
  breadcrumbs/`mainEntityOfPage` pointing at PL-path URLs).
