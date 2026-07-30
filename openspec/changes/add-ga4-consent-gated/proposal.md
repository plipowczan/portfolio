## Why

Strona nie ma własnej analityki ruchu poza Vercel Analytics, która daje odsłony i Core Web Vitals, ale nie odpowiada na pytania „skąd przyszedł ten człowiek", „którą frazą" i „co czytał dalej". Bez tego nie da się zmierzyć, czy cokolwiek z prac SEO działa — a właśnie ruszają: audyt GSC z 28.07.2026 pokazał 0 zindeksowanych stron, więc każde następne działanie potrzebuje punktu odniesienia. GA4 (`G-7L4PXG8E8Z`) już istnieje po stronie Google; brakuje tylko tagu na stronie.

Wdrożenie gołego snippetu gtag byłoby jednak błędem, bo ten projekt łamie dwa założenia, na których snippet stoi:

- **Prerender.** `scripts/prerender.mjs` prowadzi Puppeteera przez ~98 tras na lokalnym serwerze podglądu. Gołe gtag nabiłoby ~98 fałszywych odsłon z hostem `localhost` przy każdym deployu — dane byłyby zatrute od pierwszego dnia.
- **Nawigacja SPA.** `gtag('config', ID)` wysyła odsłonę tylko przy wczytaniu dokumentu. React Router zmienia adres bez przeładowania, więc odsłony od drugiej w górę nigdy by nie poleciały. Zliczałaby się wyłącznie strona wejścia.

Jest też trzeci powód, niezależny od analityki. `src/components/ui/CookieBanner.jsx` zapisuje wybór użytkownika do `localStorage.cookieConsent`, ale **żaden plik w `src/` tej wartości nie czyta**. Banner jest dziś dekoracją — nieszkodliwą, bo Vercel Analytics działa bez ciasteczek, więc nie ma czego blokować. GA4 ustawia ciasteczka `_ga`. Wdrożenie go bez podłączenia bannera zamieniłoby przycisk „Odrzuć" w przycisk, który jawnie kłamie. GA4 zostaje więc pierwszym konsumentem zgody i przy okazji nadaje bannerowi sens.

## What Changes

- Nowy moduł `src/utils/analytics.js`: stała z measurement ID, bramka na host produkcyjny, bramka na zgodę, leniwe wstrzyknięcie gtag, wysyłka odsłony.
- gtag ładuje się **wyłącznie** gdy `localStorage.cookieConsent === "accepted"` **oraz** host to `pawel.lipowczan.pl`. Odrzucenie, brak decyzji, dev, podgląd Vercela i prerender = zero żądań do Google, zero ciasteczek `_ga`.
- Skrypt wstrzykiwany po `requestIdleCallback` (z zapasowym `setTimeout(2000)`), tym samym wzorcem, którym ładuje się dziś `clickrank.ai` — żeby nie wchodzić w drogę LCP.
- `gtag('config')` z `send_page_view: false`; odsłony wysyłane ręcznie z nasłuchu na zmianę trasy React Routera. Jedna ścieżka kodu dla wszystkich odsłon, więc pierwsza nie liczy się dwa razy.
- `CookieBanner.acceptCookies()` uruchamia analitykę od razu po kliknięciu, bez konieczności przeładowania strony.
- CSP w `vercel.json` uzupełniona o `https://www.googletagmanager.com` w `script-src` oraz hosty Google Analytics w `connect-src`. Polityka jest Report-Only, więc brak wpisu nie zablokowałby skryptu — zalałby endpoint Sentry raportami o naruszeniach, których sami jesteśmy sprawcą.
- Tekst zgody w `src/locales/{pl,en}/legal.json` (`cookies.section5.content`) przeredagowany. Dziś mówi „Kontynuując przeglądanie... wyrażasz zgodę" — to domniemana zgoda sprzed RODO, sprzeczna zarówno z twardą bramką, jak i z istnieniem przycisku „Odrzuć".
- Przycisk wycofania zgody w sekcji 5 strony polityki cookies. Bez niego twarda bramka jest połowiczna: zgody da się udzielić kliknięciem, a odwołać wyłącznie ręcznym czyszczeniem `localStorage` w narzędziach przeglądarki.
- Testy Playwright na niezmienniki: odrzucona zgoda = brak skryptu gtag i brak ciasteczek `_ga`; zaakceptowana = skrypt obecny; prerenderowany `dist/` nie zawiera gtag w statycznym HTML.

Bez zmian łamiących zgodność. Vercel Analytics i Speed Insights zostają nietknięte — GA4 je uzupełnia, nie zastępuje (są bezciasteczkowe, więc działają też dla użytkowników, którzy zgody nie dali).

## Capabilities

### New Capabilities

- `analytics-consent`: warunki, pod którymi strona wolno jej ładować analitykę ustawiającą ciasteczka — bramka zgody, bramka hosta, kompletność odsłon w SPA, oraz zgodność tekstu polityki cookies z rzeczywistym działaniem bramki.

### Modified Capabilities

- `security-headers`: wymóg „allowlist obejmuje każdy zewnętrzny zasób, który strona ładuje" wylicza dziś zawartość `script-src` i `connect-src` co do hosta. Dochodzą hosty Google Tag Manager i Google Analytics.
- `performance-third-party-scripts`: wymóg „skrypty śledzące stron trzecich schodzą ze ścieżki krytycznego renderowania" mówi dziś tylko o `clickrank.ai`. gtag podpada pod tę samą regułę i dodaje do niej warunek, którego clickrank nie ma — wolno go wstrzyknąć tylko po zgodzie.

## Impact

**Kod:**

- `src/utils/analytics.js` — nowy
- `src/hooks/usePageTracking.js` — nowy (nasłuch zmian trasy)
- `src/components/ui/CookieBanner.jsx` — `acceptCookies` uruchamia analitykę
- `src/App.jsx` — wywołanie hooka nasłuchu (musi być pod `BrowserRouter`)
- `src/pages/CookiePolicy.jsx` — przycisk wycofania zgody w sekcji 5
- `vercel.json` — CSP `script-src` + `connect-src`
- `src/locales/pl/legal.json`, `src/locales/en/legal.json` — `cookies.section5.content` + klucze przycisku wycofania
- `tests/e2e/analytics-consent.spec.js` — nowy

**Nietknięte:** `src/main.jsx` (Vercel Analytics), `index.html`, `scripts/prerender.mjs`. Bramka hosta działa bez zmian w prerenderze — to jej zaleta względem zmiennej środowiskowej.

**Zależności:** brak nowych pakietów. gtag ładowany z CDN Google, nie z npm.

**Poza zakresem:** Google Consent Mode v2 (świadomie odrzucony na rzecz twardej bramki; ścieżka rozwoju, gdy dane z bramki okażą się za skąpe). Klucze API Google dla agenta `seo-google` (`GOOGLE_API_KEY`, `GOOGLE_APPLICATION_CREDENTIALS`, `GSC_PROPERTY`, `GA4_PROPERTY_ID`) — to konfiguracja środowiska poza repozytorium, nie kod. Zgoda na `ad_storage` i cokolwiek marketingowego — strona nie prowadzi reklam.
