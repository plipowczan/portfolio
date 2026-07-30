## Why

Po wdrożeniu `perf-self-host-fonts` produkcja serwowała pliki fontów tak:

```
Cache-Control: public, max-age=0, must-revalidate
```

`vercel.json` nadaje `immutable` tylko ścieżce `/assets/(.*)`. Pliki leżały w `public/fonts/`, więc trafiały pod regułę zbiorczą `/(.*)` — czyli **rewalidacja każdego fontu przy każdym wejściu na stronę**. Zjadało to część zysku z samodzielnego hostowania: obcą domenę usunęliśmy, ale zostawiliśmy powracającym użytkownikom dodatkowe zapytanie na plik.

Błąd przeszedł niezauważony, bo testy sprawdzały treść nagłówka CSP i brak żądań do Google, a nagłówka `Cache-Control` na fontach nie sprawdzał nikt.

## What Changes

Pliki wędrują z `public/fonts/` do `src/assets/fonts/`, a `src/styles/fonts.css` wskazuje je ścieżką **względną**. To wystarcza, żeby Vite nadał im skrót treści i wyemitował do `/assets/` — czyli tam, gdzie reguła `immutable` już obowiązuje.

- `scripts/fetch-fonts.mjs` — zapisuje do `src/assets/fonts/`, generuje `url("../assets/fonts/…")` zamiast `url("/fonts/…")`. Ścieżka bezwzględna zniweczyłaby całość: Vite traktuje takie adresy jak wskazania do `public/` i zostawia je bez zmian.
- `vite.config.js` — nowy wtyk `preload-body-font` wstawia `<link rel="preload">` dla `inter-latin`. Wpisanie tego na sztywno w `index.html` przestało być możliwe, bo nazwa pliku po zbudowaniu zawiera skrót. W trybie deweloperskim wtyk podaje ścieżkę źródłową.
- `index.html` — usunięty wpisany na sztywno `preload`, zostaje komentarz wyjaśniający, gdzie się podział.
- `tests/e2e/perf-self-hosted-fonts.spec.js` — sprawdzenie `preload` przestaje zakładać stałą nazwę pliku i dopasowuje wzorzec; sprawdzenie źródła fontu porównuje teraz pochodzenie adresu zamiast szukać `/fonts/` w ścieżce.

**Bez zmian w `vercel.json`.** Reguła, której potrzebowaliśmy, istniała już wcześniej — pliki po prostu leżały poza jej zasięgiem.

Skrót w nazwie jest przy okazji tym, co czyni roczny cache bezpiecznym: po `npm run fonts:fetch` plik zmienia nazwę, więc powracający użytkownik nigdy nie dostanie starej wersji. Przy stałych nazwach `immutable` byłoby pułapką.

## Impact

**Kod:** `scripts/fetch-fonts.mjs`, `vite.config.js`, `index.html`, `src/styles/fonts.css`, `tests/e2e/perf-self-hosted-fonts.spec.js`; przeniesione `public/fonts/*` → `src/assets/fonts/*`.

**Zasięg:** wszystkie 98 adresów, przede wszystkim wejścia powracające.

**Zweryfikowane po zbudowaniu:** cztery pliki w `dist/assets/` ze skrótami w nazwach, `preload` na 98/98 stron, zero odwołań do domen Google, brak pozostałości po `dist/fonts/`. Prerendering 98/98. Pełny zestaw E2E: 162 przechodzi, 0 błędów.

**Złapane przy weryfikacji:** pierwsza wersja wtyku preloadowała `inter-latin-ext` (83,1 kB) zamiast `inter-latin` (47,1 kB) — wzorzec `inter-latin-` pasuje do obu nazw. Poprawione warunkiem wykluczającym; wtyk wybiera teraz właściwy plik, co widać w zbudowanym `index.html`.

**Poza zakresem:** podział paczki 757 kB (C6) i `opacity: 0` w prerenderowanym hero (H1) — to one trzymają LCP na ~6,5–6,9 s.
