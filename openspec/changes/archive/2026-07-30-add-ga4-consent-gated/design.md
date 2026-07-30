## Context

Projekt to SPA (React 19 + React Router 7) z prerenderowaniem przez Puppeteera na etapie budowania. Analityka dziś: Vercel Analytics + Speed Insights, obie bezciasteczkowe, montowane w `src/main.jsx:16-17`. Zgoda na ciasteczka: `src/components/ui/CookieBanner.jsx` zapisuje `localStorage.cookieConsent` = `accepted` | `rejected`, ale nikt tej wartości nie czyta — banner nie ma dziś konsumenta.

Ograniczenia, które kształtują to rozwiązanie:

- **Prerender przechodzi po ~98 trasach na lokalnym serwerze podglądu** (`scripts/prerender.mjs:158`). Cokolwiek wyśle żądanie do Google podczas budowania, zatruje dane.
- **Nawigacja jest po stronie klienta.** Dokument wczytuje się raz; adres zmienia się bez przeładowania.
- **Tytuł strony ustawia `react-helmet-async`** — asynchronicznie, po zmianie trasy. `document.title` bezpośrednio po zmianie adresu to jeszcze tytuł poprzedniej strony.
- **CSP działa w trybie Report-Only** (`vercel.json:140`) z raportowaniem do Sentry na darmowym planie. Braki w allowliście nie blokują niczego, ale zjadają limit zdarzeń.
- **Jeden host produkcyjny.** `www.pawel.lipowczan.pl` nie ma wpisu DNS (sprawdzone: brak połączenia), więc `pawel.lipowczan.pl` jest jedynym adresem, pod którym strona się renderuje.
- **Measurement ID `G-7L4PXG8E8Z` nie jest sekretem** — trafia do źródła każdej strony, którą pobierze dowolny użytkownik.

## Goals / Non-Goals

**Goals:**

- GA4 zbiera odsłony wyłącznie od osób, które kliknęły „Akceptuję".
- Dane w GA4 od pierwszego dnia wolne od artefaktów: żadnych odsłon z prerenderu, dev-serwera ani podglądów Vercela.
- Każda nawigacja w SPA daje dokładnie jedną odsłonę — pierwsza nie liczy się dwa razy, kolejne nie gubią się.
- Banner cookies przestaje być dekoracją: jego wybór po raz pierwszy coś robi, a przycisk „Odrzuć" naprawdę odrzuca.
- Tekst polityki cookies opisuje faktyczne działanie bramki, a nie stan z 2017 roku.
- Zgodę da się wycofać tak samo łatwo, jak się jej udziela.

**Non-Goals:**

- Google Consent Mode v2 — rozważony i odrzucony (D1).
- Zdarzenia własne (kliknięcia CTA, wysyłki formularza, przewinięcia). Ten change dowozi odsłony i szkielet; zdarzenia to osobna decyzja, gdy będzie wiadomo, czego mierzyć.
- Zgoda na `ad_storage`, remarketing, Google Ads. Strona nie prowadzi reklam.
- Klucze API Google dla agenta `seo-google`. Konfiguracja środowiska, nie kod.
- Zmiany w Vercel Analytics / Speed Insights. Są bezciasteczkowe i działają też bez zgody — celowo zostają jako pomiar bazowy.

## Decisions

### D1: Twarda bramka zgody, nie Consent Mode v2

gtag ładuje się dopiero, gdy `localStorage.cookieConsent === "accepted"`. Bez zgody nie leci ani jedno żądanie do Google.

**Rozważone alternatywy:**

- **Consent Mode v2** — gtag ładuje się od razu ze stanem `denied`, wysyła bezciasteczkowe pingi, po akceptacji dostaje `gtag('consent','update')`. Daje więcej danych (Google modeluje brakujące) i jest zgodny z RODO. Odrzucony: skrypt Google ładuje się wtedy **przed** zgodą, co przy jednoosobowym portfolio bez celów konwersji kupuje modelowanie, którego nie ma czym karmić. Wracamy do tego, gdy dane z twardej bramki okażą się za skąpe — moduł jest tak ułożony, że to zmiana wewnątrz `initAnalytics`, nie przebudowa.
- **Brak bramki** — najwięcej danych, najmniej kodu. Odrzucony: strona ustawiałaby ciasteczka `_ga` bez zgody, a przycisk „Odrzuć" jawnie by kłamał.

**Koszt przyjęty świadomie:** banner wyskakuje po sekundzie opóźnienia (`CookieBanner.jsx:16`), więc ruch, który wychodzi szybciej, nie zostanie zmierzony. Realnie tracimy odsłony osób ignorujących banner. To cena zgodności, nie błąd do naprawienia.

### D2: Bramka na host produkcyjny, nie zmienna środowiskowa

`initAnalytics` przerywa działanie, gdy `window.location.hostname !== "pawel.lipowczan.pl"`.

**Dlaczego nie `VITE_GA_MEASUREMENT_ID`:** zmienna musiałaby być ustawiona w panelu Vercela i **wyłączona osobno dla środowiska Preview**, bo domyślnie Vercel podaje zmienne wszystkim środowiskom. Jeden nieuważny klik i podglądy zaczynają raportować do produkcyjnej właściwości. Bramka hosta załatwia cztery przypadki naraz — prerender (`localhost`), `npm run dev` (`localhost`), podglądy Vercela (`*.vercel.app`), produkcję (przechodzi) — bez ani jednego kroku poza repozytorium. ID i tak jest publiczne, więc ukrywanie go w zmiennej nic nie chroni.

**Dopasowanie jest dokładne, nie po sufiksie.** `hostname.endsWith("lipowczan.pl")` przepuściłoby dowolną poddomenę; `www` nie istnieje w DNS, więc nie ma czego dopuszczać.

### D3: `send_page_view: false` i wszystkie odsłony wysyłane ręcznie

`gtag('config', ID, { send_page_view: false })`, a potem każda odsłona — również pierwsza — leci przez to samo wywołanie `gtag('event', 'page_view', {...})` z nasłuchu na trasę.

**Alternatywa:** pozwolić `config` wysłać pierwszą odsłonę automatycznie i dosyłać tylko kolejne. Odrzucona z dwóch powodów. Pierwszy: automatyczna odsłona leci w momencie wywołania `config`, a nasłuch trasy odpala się w tym samym cyklu renderowania — trafiłyby dwie odsłony tej samej strony. Drugi: automatyczna odsłona ma inny zestaw parametrów niż ta wysyłana ręcznie, więc pierwsza strona sesji wyglądałaby w raportach inaczej niż każda następna. Jedna ścieżka kodu = jeden kształt danych.

### D4: Odsłona wysyłana z opóźnieniem, żeby złapać właściwy tytuł

To najmniej oczywista część projektu. `react-helmet-async` ustawia `document.title` w efekcie, asynchronicznie po zmianie trasy. Odsłona wysłana natychmiast po zmianie adresu dostałaby **tytuł poprzedniej strony** — a `page_title` to główny wymiar raportów GA4, więc dane byłyby przesunięte o jedną stronę i praktycznie nie do odczytania.

Rozwiązanie: efekt nasłuchujący trasy planuje wysyłkę przez `setTimeout(..., 300)` i **czyści ten timeout w funkcji porządkującej**. Skutki:

- Helmet ma czas dopisać tytuł, zanim odczytamy `document.title`.
- Szybkie przeskoki między trasami nie wysyłają odsłon stron, których użytkownik nie zobaczył — timeout poprzedniej trasy zostaje anulowany przy zmianie.

**Rozważone alternatywy:** `setTimeout(..., 0)` — nie ma gwarancji, że wyprzedzi wsad Helmeta. Nasłuch `MutationObserver` na `<title>` — poprawny, ale nieproporcjonalnie skomplikowany do problemu, którego stawką jest ułamek sekundy w analityce. Przekazywanie tytułu przez kontekst z komponentu `SEO` — wiąże analitykę z SEO i psuje oba.

### D5: Nasłuch trasy jako hook wywołany w `App.jsx`

`usePageTracking()` w `src/hooks/`, wywołany raz w `App.jsx`. Wymaga bycia pod `BrowserRouter` (jest — `main.jsx:14`), bo używa `useLocation`.

**Alternatywa:** komponent `<PageTracking />` renderujący `null`, montowany w `Layout`. Odrzucona: to hook przebrany za komponent, a `Layout` nie owija wszystkich tras. Hook w `App` łapie każdą trasę i nie udaje elementu interfejsu.

**Uwaga o `React.StrictMode`:** w trybie rozwojowym StrictMode uruchamia efekty dwa razy, co podwoiłoby odsłony. Bramka hosta (D2) i tak wyłącza analitykę na `localhost`, więc problem nie występuje — ale warto wiedzieć, dlaczego nie występuje, bo to zależność, nie zbieg okoliczności.

### D6: Wstrzyknięcie leniwe, wzorcem clickrank

Skrypt wstawiany przez `requestIdleCallback` z zapasowym `setTimeout(2000)` — dokładnie jak `clickrank.ai` w `index.html:18-34`, co spec `performance-third-party-scripts` już wymaga od skryptów śledzących. `window.dataLayer` i funkcja `gtag` powstają **przed** wstrzyknięciem: gtag kolejkuje wywołania do `dataLayer`, więc `config` i odsłony wywołane przed dojściem skryptu nie giną, tylko czekają.

`initAnalytics` musi być **idempotentne** — wywołuje je i montaż hooka, i `acceptCookies`. Flaga modułowa pilnuje, żeby skrypt wstrzyknął się raz.

### D7: Zgodę da się wycofać z poziomu strony

Twarda bramka bez wycofania jest połowiczna: RODO wymaga, by zgodę odwoływało się tak łatwo, jak się jej udziela, a dziś jedyną drogą byłoby ręczne czyszczenie `localStorage` w narzędziach przeglądarki. Sekcja 5 polityki cookies (`CookiePolicy.jsx:155-158`) mówi o zgodzie, więc tam trafia przycisk kasujący `cookieConsent` i przeładowujący stronę — po przeładowaniu banner pojawia się na nowo, a gtag nie wstaje.

Przycisk nie usuwa ciasteczek `_ga` już ustawionych w przeglądarce — te są w domenie `.pawel.lipowczan.pl` i wygasają same. Polityka mówi o tym wprost, zamiast obiecywać więcej, niż przycisk robi.

### D8: Measurement ID jako stała modułowa

`const MEASUREMENT_ID = "G-7L4PXG8E8Z"` w `src/utils/analytics.js`. ID jest publiczne przez konstrukcję — trafia do adresu skryptu, który pobiera każda przeglądarka. Zmienna środowiskowa dodałaby krok konfiguracyjny bez zysku (patrz D2).

## Risks / Trade-offs

- **Bramka hosta cicho wyłącza analitykę, jeśli domena się zmieni** → Stała `PRODUCTION_HOST` w jednym miejscu, test Playwright sprawdzający, że wartość zgadza się z `SITE_CONFIG.siteUrl`. Zmiana domeny bez zmiany tej stałej daje wtedy czerwony test, nie ciszę w raportach.
- **Nie da się przetestować produkcyjnej ścieżki lokalnie** — bramka hosta wyłącza gtag na `localhost`, więc „czy naprawdę wysyła?" sprawdzi się dopiero po wdrożeniu → Testy sprawdzają obecność i brak elementu `<script src="...googletagmanager...">` przez wstrzyknięcie nadpisania hosta w kontekście testu; weryfikacja rzeczywistego trafienia w GA4 to krok po wdrożeniu (raport Realtime).
- **300 ms opóźnienia gubi odsłony przy natychmiastowym wyjściu** → Przyjęte. Sesja krótsza niż 300 ms nie jest odczytem strony, a `beforeunload` do dosyłania takich odsłon jest zawodny i psuje dane bardziej, niż naprawia.
- **Dwie analityki naliczają różne liczby** — Vercel Analytics widzi wszystkich, GA4 tylko tych po zgodzie, więc GA4 pokaże mniej i będzie to wyglądać na błąd → Udokumentowane w design; różnica jest miarą współczynnika akceptacji bannera, a nie usterką.
- **Braki w CSP zjadają darmowy limit Sentry** — spec `security-headers` wprost stawia wymóg „allowlist obejmuje każdy zasób, który strona ładuje", bo już raz się o to potknięto → Hosty Google dopisane w tym samym change co skrypt, nigdy osobno; scenariusz w delta specu to utrwala.
- **Nowy tekst zgody musi przejść bramę prostego polskiego** (`.claude/rules/content/10-prosty-polski.md`) → Tekst pisany od razu pod tę regułę; grep słownikowy w zadaniach.

## Migration Plan

1. Kod + testy na gałęzi `feature/ga4-consent-gated`.
2. `npm test` — testy zgody działają bez prerenderu.
3. `npm run build:prerender` + `npm test` przed scaleniem (wymóg z `.claude/rules/11-git.md`). Krytyczne właśnie tutaj: sprawdza, że prerenderowany `dist/` nie zawiera gtag.
4. `grep -c "googletagmanager" dist/**/*.html` → oczekiwane 0.
5. Scalenie, deploy Vercela.
6. **Po wdrożeniu:** wejść na stronę, kliknąć „Akceptuję", potwierdzić trafienie w GA4 → Raporty → Czas rzeczywisty. Potem przejść na drugą podstronę i sprawdzić, że druga odsłona ma **swój** tytuł, nie tytuł pierwszej (to weryfikacja D4 — jedynej decyzji, której testy nie potwierdzą do końca).
7. Sprawdzić Sentry: brak nowych naruszeń CSP z hostami Google.
8. Osobno, w trybie prywatnym: kliknąć „Odrzuć", potwierdzić w narzędziach przeglądarki brak żądań do `googletagmanager.com` i brak ciasteczek `_ga`.

**Wycofanie:** revert jednego commita. Brak migracji danych, brak zmian schematu, brak nowych zależności. Najgorszy przypadek to brak analityki — czyli stan sprzed change.

## Open Questions

- **Czy dosyłać zdarzenie po udzieleniu zgody, żeby zmierzyć współczynnik akceptacji bannera?** Kuszące, bo różnica GA4 vs Vercel Analytics i tak ją pokazuje pośrednio. Odłożone: wymagałoby wysyłki w momencie, gdy zgody jeszcze formalnie nie ma. Do rozstrzygnięcia, gdy pojawią się zdarzenia własne.
- **Czy `cookies.section3.item2` („Google Fonts") jest jeszcze prawdą?** Spec `performance-font-delivery` mówi, że czcionki są hostowane u nas (`font-src: 'self'`), a CSP tego nie dopuszcza. Wygląda na nieaktualny wpis w polityce, ale to inny defekt niż ten change — do zgłoszenia osobno, żeby nie rozdymać zakresu.
