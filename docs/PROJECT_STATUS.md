# Project Status

Non-derivable project state: measurements, environment facts, and decisions that
cannot be read back out of the repository. Everything derivable from the code
(dependency versions, folder layout, routes, npm scripts) is deliberately absent —
read `package.json`, `src/App.jsx`, and the tree instead.

Roadmap and open work live in [TODO.md](./TODO.md), not here.

**Last reviewed:** 2026-07-30

---

## Deployment

- **Platform:** Vercel, production
- **Domain:** <https://pawel.lipowczan.pl>
- **Repository:** <https://github.com/plipowczan/portfolio>
- **Production build command:** `npm run build:prerender`
- **Node:** 20.x
- **Trigger:** automatic deploy on push to `main`; every PR gets a preview URL
- **Owner:** Pawel Lipowczan (<pawel@lipowczan.pl>, GitHub `plipowczan`)

## Performance measurements

Lab measurements, **taken 2026-01**. Predate the self-hosted-font and
cache-header work, so treat them as the last recorded baseline, not as current
numbers. Re-measure before citing.

| Metric | Measured 2026-01 | Target |
| --- | --- | --- |
| First Contentful Paint (FCP) | 5.3 s | < 1.8 s |
| Largest Contentful Paint (LCP) | 5.8 s | < 2.5 s |
| Total Blocking Time (TBT) | 78 ms | < 200 ms |
| Cumulative Layout Shift (CLS) | 0 | < 0.1 |

Also recorded 2026-01: JS bundle 483 KB, main-thread work 2.3 s.

**Initial JavaScript, measured 2026-09-05** (entry chunk plus its static
imports, gzipped): **200.7 kB**, down from **778.71 kB** in a single 2 429.90 kB
chunk. Blog and course markdown no longer ships with the app — bodies load per
route — and the routes are split. The figure is now enforced by the build:
`scripts/check-payload-budget.mjs` fails `npm run build:prerender`, and
therefore the Vercel deployment, when it drifts past the declared ceiling.

## SEO status

Shipped and in production:

- Build-time prerendering for every route (Puppeteer)
- Structured data (JSON-LD: Person, BlogPosting, FAQPage)
- Meta tags: Open Graph, Twitter Cards, canonical, hreflang
- Generated `sitemap.xml` with `lastmod`
- `robots.txt` and `llms.txt`
- Legacy URL redirects

## Deliberately rejected or deprioritised

Recorded so they are not re-proposed as new ideas. Each was considered and set
aside; reopening one is a decision, not an oversight.

- **Blog comments system** — moderation cost outweighs value on a portfolio site.
- **Google Analytics** — Vercel Analytics + Speed Insights already cover the need
  without a second consent surface.
- **Admin panel for blog management** — posts are markdown files in git; an admin
  panel would add a backend the site otherwise does not need.
- **Dark/light mode toggle** — the site commits to a single dark brand identity.

## Historical note

Content on this page was migrated out of the root `AGENTS.md` on 2026-07-30, when
that file became the DOX rail. The pre-migration version is recoverable with
`git show <pre-migration-commit>:AGENTS.md`.
