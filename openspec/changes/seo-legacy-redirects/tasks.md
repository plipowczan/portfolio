## 1. Edit `vercel.json`

- [x] 1.1 Add a top-level `redirects` array to `vercel.json` (sibling of existing `rewrites` and `headers`).
- [x] 1.2 Add tier A (specific 1:1) redirect: `/en/blog/vibe-coding-przewodnik` → `/en/blog/vibe-coding-guide`, `statusCode: 301`.
- [x] 1.3 Add tier B (section-anchor) redirects: `/projects/` → `/#projects`, `/my-career-path/` → `/#about`. Both `statusCode: 301`. Include both trailing-slash and no-slash variants for each.
- [x] 1.4 Add tier C (wildcard) redirects, all `statusCode: 301`, all destination `/`:
  - `/portfolio_categories/:rest*`
  - `/portfolio-archive/:rest*`
  - `/category/:rest*`
  - `/tag/:rest*`
  - `/author/:rest*`
  - `/wp-content/:rest*`
  - `/wp-admin/:rest*`
  - `/wp-login.php`
  - `/feed`, `/feed/`, `/comments/feed/`
- [x] 1.5 Verify array order: tier A entries first, then tier B, then tier C. Confirm no tier-C wildcard precedes a tier-A or tier-B entry.
- [x] 1.6 Validate JSON syntax (`node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"`).

## 2. Local sanity check

- [x] 2.1 Run `npm run build:prerender` and confirm build succeeds (redirects don't affect build, but verify no regression).
- [x] 2.2 Confirm `dist/` contains the expected prerendered routes (`index.html`, `blog/index.html`, etc.) — redirects must not have removed any.

## 3. Deploy to preview

- [x] 3.1 Commit changes with message `feat(seo): add 301 redirects for legacy WordPress URLs`.
- [x] 3.2 Push to a feature branch `feature/seo-legacy-redirects` and let Vercel build a preview deployment.
- [x] 3.3 Capture the preview URL for the verification matrix.

## 4. Verification matrix on preview

For each row, run `curl -I <preview-url><path>` and assert the expected response. Mark each task done only after seeing the actual HTTP status and Location header.

- [x] 4.1 `/en/blog/vibe-coding-przewodnik` → `301`, `Location: /en/blog/vibe-coding-guide`
- [x] 4.2 `/projects/` → `301`, `Location: /#projects`
- [x] 4.3 `/my-career-path/` → `301`, `Location: /#about`
- [x] 4.4 `/portfolio_categories/foo` → `301`, `Location: /`
- [x] 4.5 `/portfolio_categories/gallery/` → `301`, `Location: /`
- [x] 4.6 `/portfolio-archive/anything/` → `301`, `Location: /`
- [x] 4.7 `/category/foo` → `301`, `Location: /`
- [x] 4.8 `/tag/foo` → `301`, `Location: /`
- [x] 4.9 `/author/foo` → `301`, `Location: /`
- [x] 4.10 `/wp-content/uploads/foo.jpg` → `301`, `Location: /`
- [x] 4.11 `/wp-admin/` → `301`, `Location: /`
- [x] 4.12 `/wp-login.php` → `301`, `Location: /`
- [x] 4.13 `/feed/` → `301`, `Location: /`
- [x] 4.14 **Regression:** `/` → `200`
- [x] 4.15 **Regression:** `/blog` → `200`
- [x] 4.16 **Regression:** `/blog/vibe-coding-przewodnik` → `200`
- [x] 4.17 **Regression:** `/en/` → `200`
- [x] 4.18 **Regression:** `/random-nonexistent-url-xyz` → `404` (must NOT redirect)
- [x] 4.19 **Regression:** `/blog/this-post-does-not-exist` → `404` (must NOT redirect)

## 5. Promote to production

- [ ] 5.1 Merge feature branch to `main` (or promote preview to production via Vercel dashboard).
- [ ] 5.2 After production deploy completes, repeat verification matrix (tasks 4.1 – 4.19) against `https://pawel.lipowczan.pl`. Spot-check at least 4.1, 4.4, 4.11, 4.14, 4.18.
- [ ] 5.3 In Google Search Console, navigate to Pages → "Not found (404)" → click "Validate fix" to trigger Google's revalidation crawl.

## 6. Sanity check after deploy

- [ ] 6.1 Confirm `https://pawel.lipowczan.pl/sitemap.xml` is still served (`200`, `application/xml`) and unchanged.
- [ ] 6.2 Confirm `https://pawel.lipowczan.pl/robots.txt` is still served (`200`, `text/plain`).
- [ ] 6.3 In Vercel deployment logs, confirm no errors related to redirect parsing.
