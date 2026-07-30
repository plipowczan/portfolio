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

- [x] 5.1 Zmierzyć Lighthouse na produkcji i sprawdzić, czy wzrost LCP o 0,40 s utrzymuje się poza `localhost`
  - **Zmierzone, ale delty nie da się odizolować.** Lighthouse 12, ustawienie mobilne, 2026-07-30: `/` LCP 6,5 s / TBT 560 ms / CLS 0, `/blog` LCP 6,8 s / TBT 900 ms / CLS 0.
  - Dlaczego nie da się: wzrost 0,40 s zmierzono wobec podstawy `893cd3d` na `localhost`. Na produkcji siedzą już trzy zmiany razem (ta, `perf-blog-lazy-images-font-preconnect`, `perf-font-cache-headers`), a wdrożenia bez własnych fontów nie ma. Rozdzielenie wymagałoby wdrożenia podglądowego cofniętego do `893cd3d` — poza zakresem tej zmiany.
  - Co produkcja jednak mówi: wartości bezwzględne są znacznie poniżej progu audytu (`/blog` 13,7 s → 6,8 s), a odstęp FCP → LCP na `/` to 0,9 s. Nic nie wskazuje na to, żeby fonty zostawiły na produkcji koszt wart osobnej zmiany.
- [x] 5.2 Jeśli tak — ustalić element LCP przed i po; hipoteza mówi, że zmienia się na późniejsze, poprawnie złożone malowanie
  - Element LCP na produkcyjnej `/` to `<h1 class="text-5xl …">`, czyli **tekst** — złożony docelowym krojem, przy CLS 0 i LCP 0,9 s po FCP. Zgodne z hipotezą: kandydatem LCP jest poprawnie złożone malowanie tekstu, nie wcześniejsza klatka bez właściwego fontu.
  - To zgodność, nie dowód. Strony „przed" na produkcji nie ma, więc porównanie elementu przed/po pozostaje niedomknięte — i takie zostaje, bo koszt odtworzenia (wdrożenie podglądowe z `893cd3d`) przewyższa wartość odpowiedzi.
- [x] 5.3 Zaplanować odświeżanie fontów (`npm run fonts:fetch`) przy większych aktualizacjach rodzin
  - Zapisane w `src/assets/fonts/README.md`: pliki `.woff2` i `src/styles/fonts.css` generuje `npm run fonts:fetch`, nie wolno ich ruszać ręcznie. README wyjaśnia też, dlaczego fonty muszą siedzieć pod `src/` (skrót treści w nazwie) i że `latin-ext` jest obowiązkowy, bo niesie polskie znaki.
  - Odświeżanie jest bezpieczne bez dodatkowych kroków: nowy plik dostaje nową nazwę, więc roczny `immutable` nie przypina nikomu przeterminowanego fontu. Pilnuje tego `tests/e2e/perf-font-cache-headers.spec.js`.
