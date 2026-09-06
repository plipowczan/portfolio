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

- [x] 3.1 `npm test` na komplecie — metadane sprawdzane wciąż na buildzie produkcyjnym, czyli tak jak przed migracją
  - **Nie do domknięcia lokalnie.** Serwer deweloperski i preview padają w trakcie długich przebiegów (`ECONNREFUSED :3000` / `:4173`), niezależnie od zmiany — ta sama niestabilność ubiła też trzy zadania w tle. Dwa przebiegi tego samego projektu na **niezmienionym** kodzie dały 153 zdane / 0 błędów oraz 90 zdanych / 58 błędów, więc porównanie pełnych przebiegów nic nie rozstrzyga.
  - Co zostało potwierdzone: pełny projekt chromium (151 zdanych, 6 pominiętych — bramki sprzed zmiany), `seo-metadata-invariants.spec.js` 32/32 na chromium i webkit (po dwa przebiegi, bez ponowień).
  - Padnięcia na firefox i webkit odtworzone na plikach sprzed migracji (firefox: te same dwa testy; webkit: 6 błędów na bazie wobec 5 po zmianie) — nie są regresją.
  - **Do zrobienia na stabilnej maszynie albo w CI** (CI i tak dzieli suite na 4 shardy z `workers: 1`).
  - **Domknięte przez CI na PR #38**, zgodnie z planem: 357 zdanych, 0 błędów, 8 pominiętych. Pominięcia sprawdzone po nazwach - sześć to testy nagłówków działających wyłącznie na wdrożeniu (pokryte zielonym jobem "nagłówki na Preview"), dwa to jawny wcześniejszy skip w `ui-ux-audit` na pliku, którego ta zmiana nie dotyka. Przebieg: https://github.com/plipowczan/portfolio/actions/runs/34039198835
- [x] 3.2 `npm run build:prerender` — licznik błędów równy zero i brak ostrzeżeń „Brak metatagów SEO" dla którejkolwiek ze 98 tras
- [x] 3.3 Policz w kilku plikach z `dist/` elementy `<title>` i `<meta name="description">` — po jednym na plik (licz z pominięciem komentarzy HTML)
  - Sprawdzone na **wszystkich 98** plikach, nie na kilku: po jednym `<title>`, `<meta name="description">` i `<link rel="canonical">`.
  - **Pierwszy przebieg wykrył duplikaty na 97 z 98 stron.** Prerender zapisuje `/` do `dist/index.html`, czyli do pliku, który `vite preview` oddaje jako awaryjny dla każdej trasy bez własnego pliku. Renderowane jako pierwsze, zatruwało powłokę tytułem, opisem i canonicalem strony głównej; React 19 dokładał tagi trasy obok nich, więc artykuł niósł **canonical strony głównej jako pierwszy**. Helmet to maskował — usuwał zastane elementy z `data-rh`. Poprawka: `/` renderowane na końcu (`scripts/prerender.mjs`), plus stała bramka nad wyjściem prerenderu (potwierdzone: czerwona na zatrutym `dist/`, zielona po poprawce). Bramka trafiła ostatecznie do `scripts/verify-prerender-output.mjs`, a nie do testu — patrz 7.4.
- [x] 3.4 Sprawdź w `dist/` canonical i hreflang dla `/en/index.html` i jednego artykułu bloga — wartości identyczne jak przed migracją
  - Bramka sprawdza dodatkowo, że canonical każdego z 98 plików wskazuje na jego własny adres, oraz że żaden artykuł nie zapisał się z metadanymi strony „nie znaleziono".
- [x] 3.5 Sprawdź w `dist/` atrybut `lang` na `<html>` dla trasy polskiej i angielskiej
  - Sprawdzone na wszystkich 98 plikach: zero rozjazdów `lang`.
- [x] 3.6 Rozstrzygnij pytanie otwarte z design.md: czy `<title>` zostaje w `index.html` jako wartość zapasowa
  - **Rozstrzygnięcie: nie zostaje.** Pod Helmetem statyczny `<title>` był bezpieczny, bo Helmet nadpisywał jego treść. React 19 wstawia własny element, więc statyczny zostaje jako duplikat — na serwerze deweloperskim widać było dwa. Prerender zrzuca DOM, więc trafiłyby do każdego z 98 plików. Usunięty; `index.html` niesie teraz komentarz w tej samej konwencji co przy opisie. Koszt: pusta zakładka do zamontowania Reacta w dev — na produkcji nie występuje, bo prerenderowany plik ma tytuł Reacta.

## 4. Usunięcie zależności

- [x] 4.1 Usuń `react-helmet-async` z `package.json` i uruchom instalację
  - Zniknęło też z `package-lock.json`.
- [x] 4.2 Potwierdź brak wystąpień `helmet` w `src/` (poza komentarzami wyjaśniającymi historię)
  - **Odhaczone przedwcześnie.** W chwili sprawdzania było prawdą, ale po rebase `StructuredData.jsx` importował Helmeta — PR #34 przepiął go dzień wcześniej. Domknięte dopiero przez 7.2.
  - Stan końcowy: w `src/` zero importów, zostają trzy komentarze objaśniające historię (`SEO.jsx`, `StructuredData.jsx`, `usePageTracking.js`).
- [x] 4.3 `npm run build` — build przechodzi bez zależności
  - **Pierwsze odhaczenie było fałszywą zielenią** — patrz 7.3. Build przechodził, bo Node rozwiązywał pakiet z `node_modules` repozytorium nadrzędnego. Potwierdzone ponownie po 7.2, tym razem bez ani jednego importu Helmeta w drzewie.

## 5. Zdjęcie podpórek testowych

- [x] 5.1 ~~W `playwright.config.js` usuń drugi `webServer` (preview) i wróć do jednego serwera deweloperskiego~~ — **zawężone: serwer preview zostaje**
  - Przesłanka padła między napisaniem planu a realizacją. PR #26 dołożył `analytics-consent.spec.js`, którego blok „bramka zgody na hoście produkcyjnym" proxuje prawdziwy adres na serwer preview — `window.location.hostname` nie da się podmienić ze skryptu strony. Usunięcie serwera wywaliłoby ten zestaw.
  - Zrobione zamiast tego: `seo-metadata-invariants.spec.js` przestaje być jego konsumentem, a komentarz w `playwright.config.js` przestaje uzasadniać serwer nieistniejącym już powodem.
- [x] 5.2 W `tests/e2e/seo-metadata-invariants.spec.js` usuń `test.use({ baseURL })` oraz komentarz o `StrictMode`
  - Zniknęła też bramka `test.skip(!process.env.PW_PREVIEW, ...)` i import `PREVIEW_URL`.
- [x] 5.3 W `tests/utils/test-helpers.js` usuń obejście oparte na `data-rh` i przywróć opis do bramki `waitForFunction`
- [x] 5.4 W `tests/e2e/home.spec.js` przywróć twarde `expect(metaTags.description)` zamiast tolerancji `isDevMode`
- [x] 5.5 To samo w `tests/e2e/blog.spec.js` (dwa miejsca) i `tests/e2e/policy-pages.spec.js`
- [x] 5.6 Rozważ przywrócenie twardych asercji dla `canonical` i `og:*`
  - Przywrócone. To odwraca `cef34b4` z `main` („stop asserting canonical on the dev server"), który wyłączył je z powodu Helmeta: pod `StrictMode` canonical zostawał z pierwszego renderu, sprzed ustalenia języka, więc przeglądarka z angielskim `navigator.language` dostawała `/en` na trasie polskiej.
  - **Potwierdzone przebiegiem, nie rozumowaniem:** `policy-pages`, `home` i `blog` na chromium — 35 zdanych, 0 błędów.
- [x] 5.7 ~~Usuń skrypty `build:test` i `preview:test` z `package.json` oraz `dist-test` z `.gitignore`~~ — **wycofane**
  - Warunek z treści zadania („jeśli nic innego ich nie używa") nie jest spełniony: używa ich warunkowy serwer preview, którego potrzebuje 5.1.
- [x] 5.8 Zostaw listę wykluczeń watchera w `vite.config.js` — bez zmian

## 6. Kontrola końcowa

- [x] 6.1 `npm test` na komplecie, teraz w całości na serwerze deweloperskim
  - Uruchomione celowanymi przebiegami, nie jednym pełnym — z powodu zapisanego w 3.1. `seo-metadata-invariants` 20/20 na chromium, w tym oba testy danych strukturalnych, które przed tą zmianą wymagały produkcyjnego builda. `policy-pages` + `home` + `blog` 35/35. Zestaw jednostkowy 14/14.
- [x] 6.2 Porównaj metadane dla jednej trasy z serwera deweloperskiego i z buildu produkcyjnego
  - Wykonane jako kontrola jednorazowa, zgodnie z 6.3. Zestaw niezmienników przechodzi na dev, a `verify-prerender-output.mjs` potwierdza te same wartości na 98 plikach tras w `dist/`.
- [x] 6.3 Rozstrzygnij pytanie otwarte: czy test parzystości zostaje na stałe
  - **Rozstrzygnięcie: kontrola jednorazowa.** Parzystości pilnują pośrednio dwie bramki, obie porównujące wartości z tą samą `sitemap.xml`: `seo-metadata-invariants.spec.js` na serwerze deweloperskim i `scripts/verify-prerender-output.mjs` na `dist/`. Stały test byłby ich powtórzeniem i wymagałby produkcyjnego builda w każdym przebiegu.
- [x] 6.4 `npm run build:prerender` po zdjęciu podpórek — ponownie zero błędów
  - **98 stron zapisanych, 0 błędów.** Strona główna zapisana jako ostatnia, zgodnie z poprawką z 3.3.
  - Sprawdzenie wyjścia: 98 plików tras z jednym kompletem metadanych i canonicalem na własny adres, 208 bloków danych strukturalnych bez duplikatów, 99 plików bez odwołań do `googletagmanager`, 112 nagłówków i sekcji widocznych bez JavaScriptu.
- [x] 6.5 Zaktualizuj sekcję „Before Merging" w `.claude/rules/11-git.md`, jeśli zmienił się zestaw komend
  - **Bez zmian — sekcja została już przepisana na `main`.** Nie ma tam dziś ręcznej bramki ani listy komend; odsyła do `tests/AGENTS.md`. Zestaw komend tej zmiany nie rusza.
  - Przebieg DOX objął za to dokumenty, które po tej zmianie mówiłyby nieprawdę — patrz 7.5.

## 7. Kolizja z pracą równoległą i jej skutki

Sekcja dopisana w trakcie realizacji. Gałąź powstała tydzień przed domknięciem, a `main` urósł w tym czasie o około 70 commitów — w tym o dwie zmiany dotykające dokładnie tej warstwy.

- [x] 7.1 Rebase na `origin/main` (`445cf56`)
  - Konflikty rozstrzygnięte w `index.html`, `scripts/prerender.mjs` (dwa razy) i `tests/e2e/seo-metadata-invariants.spec.js`. W `prerender.mjs` wzięty kształt z `main` — bramka na kanoniczny adres z incydentu 29.07 — plus nałożona ponownie poprawka „strona główna renderowana na końcu".
  - `public/sitemap.xml` świadomie nietknięta. Commit `revert: restore sitemap lastmod dates` wyszedł po rebase pusty i wypadł.
- [x] 7.2 Zmigruj `StructuredData.jsx` — **wymuszone, nie planowane**
  - PR #34 przepiął ten komponent na Helmeta dzień wcześniej, żeby związać blok JSON-LD z trasą. Bez migracji `package.json` bez `react-helmet-async` nie da się zbudować. Uzasadnienie i odrzucone warianty: D6 w `design.md`.
- [x] 7.3 Napraw fałszywą zieleń zadania 4.3
  - `npm run build` przechodził mimo usuniętej zależności, bo worktree leży **wewnątrz** głównego checkoutu, a Node rozwiązuje moduły w górę drzewa katalogów i znajdował `react-helmet-async` w `node_modules` repozytorium nadrzędnego. Na Vercelu, przy czystym `npm ci`, build by padł.
  - Po migracji z 7.2 w `src/` nie ma ani jednego importu Helmeta, a bundle wejściowy schudł o 24 kB.
- [x] 7.4 Przenieś bramkę metadanych `dist/` z testu do skryptu budującego
  - `tests/e2e/prerender-metadata.spec.js` powstał przed scaleniem PR #34, który wyprowadził wszystkie sprawdzenia czytające `dist/` do `scripts/verify-prerender-output.mjs`. `tests/AGENTS.md` zapisuje to jako zakaz wprost: „Do not add a test that reads `dist/`. It can only skip on a normal run, so it looks green while proving nothing".
  - Cztery asercje przeniesione do skryptu buildu: po jednym `<title>`, opisie i canonicalu na plik, canonical na własny adres, brak metadanych „nie znaleziono", `lang` zgodny z trasą. Spec usunięty, przypięcie do chromium cofnięte jako niepotrzebne.
  - Sprawdzenie obejmuje wyłącznie pliki tras. Pierwszy przebieg zgłosił trzy problemy na `email-signature.html` — statycznym pliku z `public/`, który nie jest stroną aplikacji i z założenia nie ma canonicala ani atrybutu `lang`.
  - Zysk: bramka leci przy każdym wdrożeniu na Vercelu, bo `build:prerender` to `buildCommand`. Wcześniejszy wariant pomijał się, dopóki ktoś nie zrobił lokalnie 6,5-minutowego prerenderu.
- [x] 7.5 Przebieg DOX po dokumentach, które ta zmiana unieważniła
  - Reguły i kontrakty: `tests/AGENTS.md`, `tests/README.md`, `.claude/rules/playwright/30-testing.md`, `.claude/rules/10-setup.md`, `CLAUDE.md`, `scripts/AGENTS.md` (dopisany kontrakt „strona główna renderowana na końcu", bo łatwo go złamać nieświadomie).
  - Dokumentacja dla ludzi: `README.md`, `docs/SRS.md`, `docs/PRD.md`, `docs/seo/SEO_VERIFICATION.md`, `docs/faq/FAQ_GUIDELINES.md`.
  - Skille i szablony **generujące kod** — najgroźniejsze, bo produkowałyby dziś błędny komponent: `portfolio-frontend-design` (SKILL.md oraz `assets/templates/page-component.jsx`, które uczyły pisać `<Helmet>` wprost w stronie), `portfolio-code-review`, `portfolio-testing` (dwa pliki referencyjne), `.agent/rules/antigravity-code-style-guide.md`.
  - `src/components/AGENTS.md` sprawdzony — **bez zmian**. Opisuje `seo/` jako „head and structured-data emitters" i wymaga, żeby znaczniki szły przez `seo/`, nigdy wprost w stronie. Oba zdania są nadal prawdziwe.
  - Bramka `scripts/dox-pass-check.mjs` wskazała jeszcze root `AGENTS.md` i `openspec/AGENTS.md` jako właścicieli edytowanych plików. Oba sprawdzone — **bez zmian**: pierwszy nie opisuje warstwy dostarczania metadanych (zero trafień na „helmet", „PW_PREVIEW", „preview:test"), drugi opisuje sam proces OpenSpec, nie treść tej zmiany.
  - Raporty w `.claude/agents/reports/` zostawione bez zmian: to datowane zapisy stanu z 5 września, nie dokumentacja bieżąca.
- [x] 7.6 Zabezpiecz ucieczkę znaków w JSON-LD
  - Ucieczka pękła po cichu w trakcie tej zmiany: podwójny ukośnik w jej zapisie zamienił się w pojedynczy, przez co JavaScript odczytał go jako sam znak mniejszości i `replace` stał się operacją pustą. Wartość ze schematu zawierająca znacznik zamykający wyszłaby wtedy z bloku `<script>` do prerenderowanego pliku.
  - **Nie złapał tego żaden test** — prawdziwe schematy w repozytorium nie zawierają tego znaku, więc każdy przebieg był zielony. Wyłapał automatyczny przegląd bezpieczeństwa.
  - Ucieczka wydzielona do `src/utils/serializeJsonLd.js` z testem jednostkowym karmiącym ją wrogimi danymi.
  - `npm run test:unit` **w ogóle nie działał**: `node --test tests/unit` każe Node 22+ rozwiązać katalog jako moduł, więc zestaw wywalał się na `MODULE_NOT_FOUND` przed pierwszym testem i wyglądał na czerwony, choć nic się nie wykonało. Naprawiony na wzorzec i wpięty do CI jako job `unit`.
