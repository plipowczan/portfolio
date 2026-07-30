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

- [x] 4.1 Potwierdzić na wdrożeniu, że fonty wychodzą z `Cache-Control: public, max-age=31536000, immutable`
  - Potwierdzone 2026-07-30 na `https://pawel.lipowczan.pl/assets/inter-latin-Dx4kXJAl.woff2`: `Cache-Control: public, max-age=31536000, immutable`, `Content-Type: font/woff2`, `X-Vercel-Cache: HIT`. Adres wzięty z `<link rel="preload">` w prerenderowanym HTML, czyli z tego, co strona faktycznie zamawia.
- [x] 4.2 Rozważyć test na wdrożonym adresie (jak `seo-security-headers.spec.js`), który pilnuje nagłówka cache na fontach — teraz nie pilnuje go nic
  - Dodany `tests/e2e/perf-font-cache-headers.spec.js`. Wchodzi na tej samej zmiennej co testy nagłówków bezpieczeństwa (`SEO_HEADERS_URL`), bo odpowiada na to samo pytanie: co naprawdę wysyła CDN.
  - Adres fontu bierze z `<link rel="preload">` w HTML, nie z zapisanej na sztywno ścieżki — nazwa nosi skrót treści, więc zmienia się przy każdym `npm run fonts:fetch`. Ścieżka wpisana na sztywno przechodziłaby do pierwszego odświeżenia fontów, a potem sprawdzała nagłówek na odpowiedzi 404.
  - Pilnuje obu połów niezmiennika razem: kształtu adresu (`/assets/inter-latin-<skrót>.woff2`) **i** nagłówka. Roczny `immutable` jest bezpieczny wyłącznie dzięki skrótowi w nazwie — po powrocie fontów do `public/fonts/` nazwy stają się dosłowne i ten sam nagłówek przypina wracającemu gościowi przeterminowany plik na rok.
  - Że test faktycznie pilnuje: reguła zbiorcza `/(.*)` w `vercel.json` daje `max-age=0, must-revalidate` (sprawdzone na `/`). Regresja, o którą tu chodzi — font wypadający z reguły `/assets/(.*)` — trafiłby więc na tę wartość i wywrócił `toContain("max-age=31536000")`.
  - Przebieg na produkcji: 1 przechodzi.
