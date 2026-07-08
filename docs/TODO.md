## TODO

- [ ] Add FAQ section
- [x] Sidebar navigation
- [ ] Related posts section
- [ ] Add case studies
- [x] Complete cta for all blog posts - remove cta to Automation House
- [ ] Extend blog categories - add more categories

### Social Media optimization

- [ ] Add share buttons to posts
- [ ] Pre-fill text for Twitter share
- [ ] Pinterest Rich Pins
- [ ] LinkedIn article sharing

### Testing

- [ ] Zbadać timeouty webkit/Mobile Safari na stronach lekcji `/llm-wiki/kurs/*` (Playwright, lokalny Windows). Testy lekcji wiszą ~1,1 min i padają; potwierdzone na `main` 2026-07-08, więc to nie regresja - hub i landing przechodzą. Podejrzani: element `<video>` (screencast) albo `networkidle` na webkit.
