# Tasks

## 1. Obrazki indeksu bloga

- [x] 1.1 `BlogCard` w `src/pages/Blog.jsx` przyjmuje `isFirst`; pierwsza karta zostaje `loading="eager"` + `fetchPriority="high"`, reszta `loading="lazy"`
- [x] 1.2 `posts.map` przekazuje `isFirst={index === 0}`
- [x] 1.3 Sprawdzone w `dist/blog/index.html` i `dist/en/blog/index.html`: 30 obrazków, 29 `lazy`, 1 `eager`

## 2. Okładka wpisu

- [x] 2.1 `src/pages/BlogPostPage.jsx` — okładka z `loading="eager"` + `fetchPriority="high"` zamiast `loading="lazy"`
- [x] 2.2 Sprawdzone w `dist/blog/slabe-strony-claude-code/index.html`

## 3. Testy

- [x] 3.1 `tests/e2e/perf-image-loading.spec.js` — testy napisane przed poprawką i potwierdzone jako czerwone
- [x] 3.2 Wszystkie przechodzą po poprawce
- [x] 3.3 Pełny zestaw E2E bez regresji
- [x] 3.4 `npm run build:prerender` — 98/98 stron

## 4. Fonty — zamknięte bez wdrożenia

- [x] 4.1 Poprawka napisana i zmierzona (`preconnect` + jeden `<link>` zamiast dwóch `@import`)
- [x] 4.2 Ustalone przez eliminację, że lokalny wzrost LCP powoduje `preconnect`, nie obrazki i nie przeniesienie `@import`
- [x] 4.3 Ustalone, że lokalny `preview` nie nadaje się do oceny `preconnect` (brak opóźnienia sieci dla plików aplikacji)
- [x] 4.4 Zmiana wycofana z tej zmiany; analiza i tabela pomiarów zapisane w `proposal.md`

## 5. Do zrobienia po wdrożeniu

- [ ] 5.1 Zmierzyć Lighthouse na produkcji i porównać z wartościami z audytu (`/blog` LCP 13,7 s / TBT 3780 ms)
- [ ] 5.2 Wrócić do fontów osobną zmianą, mierząc na wdrożeniu podglądowym albo na danych CrUX; rozważyć samodzielne hostowanie plików fontów zamiast `preconnect`
