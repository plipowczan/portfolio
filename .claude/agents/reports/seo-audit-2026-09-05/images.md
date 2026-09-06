# Image SEO — pawel.lipowczan.pl

Measured 2026-09-05 against the repo at C:\Projects\portfolio (source of truth for
what ships) plus the live site.

## Inventory

- 97 files in `public/images`, **9.6 MB total**
- 95 `.webp`, 1 `.jpg`, 1 `.jpeg` — format discipline is good
- 52 markdown image references across PL blog, EN blog, and course lessons

## CRITICAL — source-resolution images shipped to phones

Three files are shipped at raw capture/export resolution and scaled down in CSS.
No `srcSet` and no `<picture>` exists anywhere in the codebase (0 occurrences),
so a 390px phone downloads the full-resolution file.

| File | Bytes | Dimensions | Where |
|---|---|---|---|
| `hacknation-team.webp` | **2,036 KB** | **6528 × 4896** | inline in `hackathon-hacknation-analiza-doswiadczen` + EN twin |
| `hacknation-end.webp` | 891 KB | 3072 × 4096 | same two articles |
| `karpathy-paradigm-software-3-0.webp` | 800 KB | **6360 × 7360** | `software-3-0-agentic-engineering` + EN twin |

The hackathon article alone carries ~2.9 MB of images. `hacknation-team.webp` is
6528px wide for a container that is at most ~800px — roughly 64× the pixels
actually rendered.

Fix: cap the longest edge at ~1600px for inline article images and re-encode.
Expect 2036 KB → under 200 KB with no visible difference. Then add `srcSet` with
480/960/1600 widths for the article and card images. `scripts/convert-to-webp.js`
converts format but does not appear to enforce a maximum dimension — adding that
cap is the durable fix, since the next photo dropped in will repeat this.

## HIGH — filename-style alt text

Twelve alt attributes (6 unique images × PL and EN) use the filename or slug
instead of a description:

`![hero]`, `![speed_insights]`, `![web_analytics]`, `![playwright_report]`,
`![cursor_usage]`, `![og-zapier-vs-make-vs-n8n-wybor-narzedzia]`

This is the whole of the weak alt text — no image anywhere has an empty alt.
Worth noting the contrast: the Karpathy diagram carries a long, genuinely
descriptive alt in both languages. The standard is already set in this repo;
these six images just fall below it.

## MEDIUM — missing intrinsic dimensions

Only `Testimonials.jsx` sets `width`/`height` (48×48). These do not:

- `src/pages/Blog.jsx:24` — card image
- `src/components/sections/Projects.jsx:20` — card image
- `src/pages/ProjectPage.jsx:149` — project hero
- `src/pages/BlogPostPage.jsx:587` — article featured image

CLS risk is partly contained because each sits in a fixed-height container
(`h-96`, `w-full h-full object-cover`), so this is a robustness fix rather than
an active layout-shift bug.

## LOW

- `public/images/linkedin-cover.jpeg` — 791 KB, referenced nowhere in `src`.
  Dead asset in the deployed bundle.
- `src/pages/ProjectPage.jsx:149` hero has no `fetchPriority="high"`. It is the
  LCP element of every project page. (`loading` is correctly left unset, which
  defaults to eager — no bug there.)

## Verified clean

- WebP throughout; the one `.jpeg` is an unreferenced leftover.
- `BlogPostPage.jsx` featured image is `loading="eager"` + `fetchPriority="high"`,
  with a source comment recording that it used to be `loading="lazy"` and why that
  was wrong. The LCP-lazy trap was already found and fixed here.
- `Blog.jsx` correctly makes only the first card eager/high-priority and lazies
  the rest.
- No empty alt attributes anywhere in the content.
- OG images are a consistent 1200 × 630.
