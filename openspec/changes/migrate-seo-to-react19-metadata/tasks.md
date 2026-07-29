## 1. Migracja komponentów

- [x] 1.1 W `src/components/seo/SEO.jsx` usuń import i opakowanie `<Helmet>` — komponent zwraca te same tagi jako fragment, bez zmiany wartości i warunków emisji
- [x] 1.2 W `src/components/layout/LocaleLayout.jsx` zamień `<Helmet><html lang={...} /></Helmet>` na efekt ustawiający `document.documentElement.lang`
- [x] 1.3 W `src/main.jsx` usuń `HelmetProvider`, zostawiając `<React.StrictMode>` bez zmian
- [x] 1.4 Uruchom `npm run dev` i potwierdź w narzędziach przeglądarki, że strona główna ma jeden opis, canonical i komplet hreflang — czyli to, czego przed migracją w dev nie było w ogóle

## 2. Dowód na brak duplikatów

- [x] 2.1 Dodaj do `tests/e2e/seo-metadata-invariants.spec.js` blok nawigacji po stronie klienta (podpórki testowe wciąż na miejscu — patrz decyzja D4)
- [x] 2.2 Test: przejście `/blog/<slug-a>` → `/blog/<slug-b>` zostawia dokładnie jeden `<meta name="description">`, z treścią artykułu docelowego
- [x] 2.3 Test: przełączenie języka zostawia dokładnie jeden `<link rel="canonical">`, wskazujący na bieżącą wersję językową
- [x] 2.4 Test: przejście ze strony z parą hreflang na stronę bez tłumaczenia (lekcja kursu) nie zostawia żadnego `<link rel="alternate" hreflang>`
- [x] 2.5 Test: liczba elementów `<title>` w dokumencie wynosi jeden — Helmet nadpisywał tytuł z `index.html`, React 19 wstawia własny
- [x] 2.6 Uruchom te testy i doprowadź do zieleni; jeśli duplikaty jednak powstają, zatrzymaj się i rozstrzygnij sposób usuwania przed dalszymi krokami
  - **Wynik: duplikatów metadanych nie ma.** React odmontowuje `<SEO>` przy zmianie trasy i zabiera ze sobą wstawione tagi — hreflang schodzi z 3 do 0, opis i canonical zostają pojedyncze. Własne usuwanie tagów niepotrzebne, D3 zamknięte.
  - Jedyny duplikat dotyczył `<title>` i pochodził ze statycznego tagu w `index.html`, nie z Reacta — usunięty w kroku 3.6.
  - Uwaga do testów: adres zmienia się przed zatwierdzeniem renderu, więc asercje muszą być ponawiane (`toHaveAttribute`, `toHaveTitle`, `expect.poll`). Pojedynczy odczyt `getAttribute` łapie stan poprzedniej trasy i daje test niestabilny.

## 3. Weryfikacja przed zdjęciem podpórek

- [ ] 3.1 `npm test` na komplecie — metadane sprawdzane wciąż na buildzie produkcyjnym, czyli tak jak przed migracją
- [ ] 3.2 `npm run build:prerender` — licznik błędów równy zero i brak ostrzeżeń „Brak metatagów SEO" dla którejkolwiek ze 98 tras
- [ ] 3.3 Policz w kilku plikach z `dist/` elementy `<title>` i `<meta name="description">` — po jednym na plik (licz z pominięciem komentarzy HTML)
- [ ] 3.4 Sprawdź w `dist/` canonical i hreflang dla `/en/index.html` i jednego artykułu bloga — wartości identyczne jak przed migracją
- [ ] 3.5 Sprawdź w `dist/` atrybut `lang` na `<html>` dla trasy polskiej i angielskiej
- [x] 3.6 Rozstrzygnij pytanie otwarte z design.md: czy `<title>` zostaje w `index.html` jako wartość zapasowa
  - **Rozstrzygnięcie: nie zostaje.** Pod Helmetem statyczny `<title>` był bezpieczny, bo Helmet nadpisywał jego treść. React 19 wstawia własny element, więc statyczny zostaje jako duplikat — na serwerze deweloperskim widać było dwa. Prerender zrzuca DOM, więc trafiłyby do każdego z 98 plików. Usunięty; `index.html` niesie teraz komentarz w tej samej konwencji co przy opisie. Koszt: pusta zakładka do zamontowania Reacta w dev — na produkcji nie występuje, bo prerenderowany plik ma tytuł Reacta.

## 4. Usunięcie zależności

- [ ] 4.1 Usuń `react-helmet-async` z `package.json` i uruchom instalację
- [ ] 4.2 Potwierdź brak wystąpień `helmet` w `src/` (poza komentarzami wyjaśniającymi historię)
- [ ] 4.3 `npm run build` — build przechodzi bez zależności

## 5. Zdjęcie podpórek testowych

- [ ] 5.1 W `playwright.config.js` usuń drugi `webServer` (preview na 4173) i wróć do jednego serwera deweloperskiego
- [ ] 5.2 W `tests/e2e/seo-metadata-invariants.spec.js` usuń `test.use({ baseURL })` oraz komentarz o `StrictMode`
- [ ] 5.3 W `tests/utils/test-helpers.js` usuń obejście oparte na `data-rh` i przywróć opis do bramki `waitForFunction`
- [ ] 5.4 W `tests/e2e/home.spec.js` przywróć twarde `expect(metaTags.description)` zamiast tolerancji `isDevMode`
- [ ] 5.5 To samo w `tests/e2e/blog.spec.js` (dwa miejsca) i `tests/e2e/policy-pages.spec.js`
- [ ] 5.6 Rozważ przywrócenie twardych asercji dla `canonical` i `og:*` w tych plikach — po migracji te tagi są w dev obecne; każde padnięcie traktuj jako osobne ustalenie, nie regresję migracji
- [ ] 5.7 Usuń skrypty `build:test` i `preview:test` z `package.json` oraz `dist-test` z `.gitignore`, jeśli nic innego ich nie używa
- [ ] 5.8 Zostaw listę wykluczeń watchera w `vite.config.js` — obserwowanie katalogów buildu było błędem niezależnym od tej zmiany

## 6. Kontrola końcowa

- [ ] 6.1 `npm test` na komplecie, teraz w całości na serwerze deweloperskim
- [ ] 6.2 Porównaj metadane dla jednej trasy z serwera deweloperskiego i z buildu produkcyjnego — te same nazwy tagów i te same wartości (scenariusz parzystości ze specyfikacji)
- [ ] 6.3 Rozstrzygnij pytanie otwarte z design.md: czy test parzystości zostaje na stałe, czy był kontrolą jednorazową
- [ ] 6.4 `npm run build:prerender` po zdjęciu podpórek — ponownie zero błędów
- [ ] 6.5 Zaktualizuj sekcję „Before Merging" w `.claude/rules/11-git.md`, jeśli zmienił się zestaw komend
