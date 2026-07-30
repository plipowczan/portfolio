## 1. Moduł analityki

- [ ] 1.1 Utwórz `src/utils/analytics.js` ze stałymi `MEASUREMENT_ID = "G-7L4PXG8E8Z"` i `PRODUCTION_HOST = "pawel.lipowczan.pl"` (nazwane eksporty, bez domyślnego — reguła projektu)
- [ ] 1.2 Dodaj `hasAnalyticsConsent()` czytające `localStorage.getItem("cookieConsent") === "accepted"`, opakowane w `try/catch` (dostęp do `localStorage` rzuca wyjątek w trybie prywatnym niektórych przeglądarek — cichy wyjątek zabiłby cały montaż)
- [ ] 1.3 Dodaj `isProductionHost()` z **dokładnym** porównaniem `window.location.hostname === PRODUCTION_HOST` (D2 — nie `endsWith`, nie `includes`)
- [ ] 1.4 Dodaj bootstrap `window.dataLayer` + funkcję `gtag` **przed** wstrzyknięciem skryptu, żeby wywołania kolejkowały się do `dataLayer` i nie ginęły (D6)
- [ ] 1.5 Dodaj `initAnalytics()`: przerwij gdy nie `isProductionHost()`, przerwij gdy nie `hasAnalyticsConsent()`, przerwij gdy flaga modułowa mówi, że już zainicjowano (idempotencja, D6)
- [ ] 1.6 W `initAnalytics()` wstrzyknij `https://www.googletagmanager.com/gtag/js?id=<ID>` z `async` przez `requestIdleCallback` z zapasowym `setTimeout(..., 2000)` — tym samym wzorcem co `clickrank.ai` w `index.html:18-34`
- [ ] 1.7 Wywołaj `gtag("js", new Date())` i `gtag("config", MEASUREMENT_ID, { send_page_view: false })` (D3 — automatyczne odsłony wyłączone)
- [ ] 1.8 Dodaj `sendPageView({ path, title })` wysyłające `gtag("event", "page_view", { page_path, page_location, page_title })`; funkcja przerywa gdy analityka nieaktywna
- [ ] 1.9 Dodaj `withdrawAnalyticsConsent()` kasujące klucz `cookieConsent` z `localStorage` (D7)
- [ ] 1.10 Dodaj `getConsentState()` zwracające `"accepted" | "rejected" | "none"` — potrzebne stronie polityki do pokazania obecnego wyboru

## 2. Odsłony przy nawigacji SPA

- [ ] 2.1 Utwórz `src/hooks/usePageTracking.js` używające `useLocation` z React Routera
- [ ] 2.2 W efekcie hooka wywołaj `initAnalytics()` — obsługuje przypadek wejścia na stronę ze zgodą już zapisaną
- [ ] 2.3 Zaplanuj `sendPageView` przez `setTimeout(..., 300)` i **anuluj timeout w funkcji porządkującej efektu** (D4 — to jednocześnie daje Helmetowi czas na tytuł i gubi trasy przelotowe)
- [ ] 2.4 Odczytaj `document.title` **w momencie wysyłki**, nie przy planowaniu — inaczej opóźnienie nie ma sensu
- [ ] 2.5 Ustaw zależność efektu na `location.pathname` (nie na cały obiekt `location`, który zmienia tożsamość także przy zmianie samego hasza)
- [ ] 2.6 Wywołaj `usePageTracking()` raz w `src/App.jsx` — jest pod `BrowserRouter` z `main.jsx:14` (D5)

## 3. Podłączenie bannera zgody

- [ ] 3.1 W `src/components/ui/CookieBanner.jsx` wywołaj `initAnalytics()` w `acceptCookies()` po zapisie do `localStorage` — kolejność ma znaczenie, bo `initAnalytics` czyta tę wartość
- [ ] 3.2 Wyślij pierwszą odsłonę zaraz po `initAnalytics()` w `acceptCookies()`, żeby zgoda udzielona w trakcie przeglądania nie gubiła bieżącej strony
- [ ] 3.3 Potwierdź, że `rejectCookies()` (używane też przez przycisk zamknięcia, linie 69 i 86) nie uruchamia analityki — zamknięcie komunikatu to brak zgody
- [ ] 3.4 Nie ruszaj `src/main.jsx` — Vercel Analytics i Speed Insights zostają bez zmian

## 4. Wycofanie zgody na stronie polityki

- [ ] 4.1 W `src/pages/CookiePolicy.jsx`, w sekcji 5 (linie 155-158), dodaj wiersz z obecnym stanem zgody z `getConsentState()`
- [ ] 4.2 Dodaj przycisk wywołujący `withdrawAnalyticsConsent()` i przeładowujący stronę, żeby gtag nie wstał, a banner pokazał się na nowo
- [ ] 4.3 Nadaj przyciskowi `aria-label` i styl spójny z istniejącymi (`btn-primary` albo obramowany wariant jak w bannerze — dopasuj do sąsiedztwa, nie wprowadzaj nowego wariantu)
- [ ] 4.4 Ukryj przycisk, gdy stan to `"none"` — nie ma czego wycofywać

## 5. Teksty polityki cookies (PL + EN)

- [ ] 5.1 Podmień `cookies.section5.content` w `src/locales/pl/legal.json` na: „Analitykę uruchamiamy tylko wtedy, gdy klikniesz „Akceptuję" w komunikacie o plikach cookies. Kliknięcie „Odrzuć" albo zamknięcie komunikatu oznacza brak zgody — Google Analytics się wtedy nie wczyta i nie zapisze żadnych ciasteczek. Zgodę wycofasz w każdej chwili przyciskiem poniżej. Przycisk nie usuwa ciasteczek zapisanych wcześniej przez Google — te wygasają same albo skasujesz je w ustawieniach przeglądarki."
- [ ] 5.2 Podmień `cookies.section5.content` w `src/locales/en/legal.json` na odpowiednik: "We only start analytics once you click \"Accept\" in the cookie notice. Clicking \"Reject\" or dismissing the notice means no consent — Google Analytics will not load and will not store any cookies. You can withdraw consent at any time with the button below. The button does not remove cookies Google has already stored; those expire on their own, or you can clear them in your browser settings."
- [ ] 5.3 Dodaj `cookies.section5.withdraw` — PL „Wycofaj zgodę na analitykę", EN "Withdraw analytics consent"
- [ ] 5.4 Dodaj `cookies.section5.status.accepted` / `.rejected` / `.none` — PL „Twój obecny wybór: zgoda udzielona" / „...: zgoda odrzucona" / „...: brak decyzji"; EN "Your current choice: consent granted" / "...: consent declined" / "...: no decision yet"
- [ ] 5.5 Sprawdź, że oba pliki `legal.json` mają identyczny zestaw kluczy (brakujący klucz w EN daje surowy klucz na ekranie, nie błąd)
- [ ] 5.6 Uruchom bramę prostego polskiego z `.claude/rules/content/10-prosty-polski.md` na nowym tekście PL — grep słownikowy plus ręczna kontrola długości zdań (≤ ~20 słów) i strony czynnej

## 6. CSP

- [ ] 6.1 Dopisz `https://www.googletagmanager.com` do `script-src` w `vercel.json` (linia 140)
- [ ] 6.2 Dopisz do `connect-src`: `https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com`
- [ ] 6.3 Nie ruszaj `img-src` — jest już `'self' data: https:`, co pokrywa piksele Google
- [ ] 6.4 Potwierdź, że nagłówek zostaje w trybie `Content-Security-Policy-Report-Only` i nie dochodzi wariant wymuszający

## 7. Testy

- [ ] 7.1 Utwórz `tests/e2e/analytics-consent.spec.js`
- [ ] 7.2 Test: brak wartości `cookieConsent` → w dokumencie nie ma elementu `<script>` z `googletagmanager.com`, nie ma ciasteczka `_ga`
- [ ] 7.3 Test: `cookieConsent = "rejected"` → to samo co wyżej
- [ ] 7.4 Test: `cookieConsent = "accepted"` przy nadpisanym hoście na produkcyjny → skrypt gtag obecny (nadpisanie hosta przez `page.route`/`addInitScript`, bo `localhost` jest z definicji zablokowany — D2)
- [ ] 7.5 Test: kliknięcie „Akceptuję" w bannerze uruchamia analitykę bez przeładowania
- [ ] 7.6 Test: zamknięcie bannera przyciskiem X zapisuje `"rejected"` i nie uruchamia analityki
- [ ] 7.7 Test: dwie nawigacje po trasach dają dwie odsłony, druga z **własnym** tytułem (przechwyć wywołania przez podstawiony `window.dataLayer`)
- [ ] 7.8 Test: `initAnalytics()` wywołane dwukrotnie daje dokładnie jeden element skryptu
- [ ] 7.9 Test: przycisk wycofania kasuje `cookieConsent` i po przeładowaniu banner wraca
- [ ] 7.10 Test: `PRODUCTION_HOST` zgadza się z hostem z `SITE_CONFIG.siteUrl` (ochrona przed cichą śmiercią analityki po zmianie domeny — ryzyko z design)
- [ ] 7.11 Test na prerenderowanym `dist/` (warunkowy, wzorcem istniejących testów prerenderu): żaden statyczny plik HTML nie zawiera `googletagmanager`
- [ ] 7.12 Test: nagłówek CSP zawiera hosty Google w `script-src` i `connect-src` (dopisz do istniejącego zestawu testów nagłówków, jeśli taki jest — nie duplikuj)

## 8. Weryfikacja przed scaleniem

- [ ] 8.1 `npm test` — wszystko zielone, testy zgody działają bez prerenderu
- [ ] 8.2 `npm run build:prerender` (~6.5 min) — wymóg z `.claude/rules/11-git.md`
- [ ] 8.3 `npm test` ponownie — potwierdź, że testy prerenderu **wykonały się**, a nie zostały pominięte (sprawdź licznik `skipped`)
- [ ] 8.4 `grep -rc "googletagmanager" dist/ --include=*.html` → oczekiwane zero trafień
- [ ] 8.5 Przejrzyj diff pod kątem reguł projektu: nazwane eksporty, brak `prop-types`, JSDoc na nowych funkcjach publicznych
- [ ] 8.6 Commit na gałęzi `feature/ga4-consent-gated`, konwencjonalny opis

## 9. Weryfikacja po wdrożeniu

- [ ] 9.1 Wejdź na `https://pawel.lipowczan.pl`, kliknij „Akceptuję", potwierdź trafienie w GA4 → Raporty → Czas rzeczywisty
- [ ] 9.2 Przejdź na drugą podstronę i potwierdź w GA4, że druga odsłona ma **swój** tytuł, nie tytuł pierwszej — to jedyna weryfikacja D4, której testy nie domykają
- [ ] 9.3 W trybie prywatnym kliknij „Odrzuć": w narzędziach przeglądarki zero żądań do `googletagmanager.com`, zero ciasteczek `_ga`
- [ ] 9.4 Otwórz politykę cookies, wycofaj zgodę, potwierdź powrót bannera i brak gtag
- [ ] 9.5 Sprawdź Sentry po dobie: brak nowych naruszeń CSP z hostami Google
- [ ] 9.6 Odnotuj datę pierwszych danych w GA4 — od niej liczy się okno porównawcze dla prac SEO
