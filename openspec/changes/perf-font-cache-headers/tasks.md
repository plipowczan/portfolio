# Tasks

## 1. Przeniesienie pod kontrolę Vite

- [x] 1.1 `public/fonts/*` → `src/assets/fonts/*` (przez `git mv`, historia zachowana)
- [x] 1.2 `scripts/fetch-fonts.mjs` zapisuje do nowej lokalizacji
- [x] 1.3 `src/styles/fonts.css` używa ścieżek względnych `../assets/fonts/…`
- [x] 1.4 Sprawdzone: cztery pliki w `dist/assets/` mają skrót treści w nazwie

## 2. Preload

- [x] 2.1 Wtyk `preload-body-font` w `vite.config.js`; w trybie deweloperskim ścieżka źródłowa, w buildzie nazwa ze skrótem
- [x] 2.2 Usunięty wpisany na sztywno `<link rel="preload">` z `index.html`
- [x] 2.3 Poprawiony wzorzec — pierwsza wersja wybierała `inter-latin-ext` (83,1 kB) zamiast `inter-latin` (47,1 kB)
- [x] 2.4 Sprawdzone w `dist/index.html`: preload wskazuje `inter-latin-<skrót>.woff2`

## 3. Testy

- [x] 3.1 Sprawdzenie `preload` nie zakłada już stałej nazwy pliku
- [x] 3.2 Sprawdzenie źródła fontu porównuje pochodzenie adresu zamiast szukać `/fonts/`
- [x] 3.3 Pełny zestaw E2E: 162 przechodzi, 0 błędów
- [x] 3.4 `npm run build:prerender` — 98/98 stron

## 4. Do zrobienia po wdrożeniu

- [ ] 4.1 Potwierdzić na wdrożeniu, że fonty wychodzą z `Cache-Control: public, max-age=31536000, immutable`
- [ ] 4.2 Rozważyć test na wdrożonym adresie (jak `seo-security-headers.spec.js`), który pilnuje nagłówka cache na fontach — teraz nie pilnuje go nic
