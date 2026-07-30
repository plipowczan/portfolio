## TODO

- [ ] Add FAQ section
- [x] Sidebar navigation
- [ ] Related posts section (internal linking between posts)
- [ ] Add case studies
- [x] Complete cta for all blog posts - remove cta to Automation House
- [ ] Extend blog categories - add more categories
- [ ] Blog search
- [ ] Blog category filtering on `/blog`
- [ ] Complete live URLs for the automation projects in `src/data/projects.js`

### Performance

- [ ] Re-measure Core Web Vitals — the figures in [PROJECT_STATUS.md](./PROJECT_STATUS.md) are from 2026-01, before the self-hosted fonts and cache headers landed
- [ ] Reduce bundle size / route-based code splitting
- [ ] Image optimisation pass: WebP everywhere, lazy loading below the fold

### Accessibility & content quality

- [ ] Image alt text audit across posts and sections

### Social Media optimization

- [ ] Add share buttons to posts
- [ ] Pre-fill text for Twitter share
- [ ] Pinterest Rich Pins
- [ ] LinkedIn article sharing

### Testing

- [ ] Zbadać timeouty webkit/Mobile Safari na stronach lekcji `/llm-wiki/kurs/*` (Playwright, lokalny Windows). Testy lekcji wiszą ~1,1 min i padają; potwierdzone na `main` 2026-07-08, więc to nie regresja - hub i landing przechodzą. Podejrzani: element `<video>` (screencast) albo `networkidle` na webkit.
