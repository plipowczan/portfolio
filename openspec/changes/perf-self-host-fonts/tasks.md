# Tasks

## 1. Pobieranie fontów

- [x] 1.1 `scripts/fetch-fonts.mjs` — pobiera warianty zmienne, zostawia tylko `latin` i `latin-ext`, generuje `src/styles/fonts.css`
- [x] 1.2 `npm run fonts:fetch` w `package.json`
- [x] 1.3 Cztery pliki `.woff2` w `public/fonts/` (178 kB łącznie)
- [x] 1.4 Licencje SIL OFL 1.1 obu rodzin plus `README.md` obok plików

## 2. Wpięcie

- [x] 2.1 `src/styles/index.css` — dwa `@import` do Google zastąpione lokalnym `@import "./fonts.css"`
- [x] 2.2 `index.html` — `preload` `inter-latin.woff2` z `crossorigin`
- [x] 2.3 `vercel.json` — usunięte `fonts.googleapis.com` ze `style-src` i `fonts.gstatic.com` z `font-src`

## 3. Testy

- [x] 3.1 `tests/e2e/perf-self-hosted-fonts.spec.js` — 7 testów, w tym przeczący (zero żądań do Google) i sprawdzenie polskich znaków przez `document.fonts.check`
- [x] 3.2 Wszystkie przechodzą
- [x] 3.3 Pełny zestaw E2E bez regresji: 157 przechodzi, 0 błędów
- [x] 3.4 `npm run build:prerender` — 98/98 stron
- [x] 3.5 W `dist`: 0/98 stron odwołuje się do domen Google, 0 odwołań w CSS, `preload` na 98/98

## 4. Pomiar

- [x] 4.1 Zmierzone na tej samej podstawie (893cd3d), po 3 przebiegi: FCP −1,18 s, TBT −67%, wynik +13,4, LCP +0,40 s
- [x] 4.2 Sprawdzone, że `preload` nie odpowiada za wzrost LCP (bez niego TBT rośnie do 695–829 ms, LCP się rozjeżdża)

## 5. Do zrobienia po wdrożeniu

- [ ] 5.1 Zmierzyć Lighthouse na produkcji i sprawdzić, czy wzrost LCP o 0,40 s utrzymuje się poza `localhost`
- [ ] 5.2 Jeśli tak — ustalić element LCP przed i po; hipoteza mówi, że zmienia się na późniejsze, poprawnie złożone malowanie
- [ ] 5.3 Zaplanować odświeżanie fontów (`npm run fonts:fetch`) przy większych aktualizacjach rodzin
