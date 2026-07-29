## Why

Audyt Google Search Console z 28.07.2026 pokazał **0 zindeksowanych stron** przy 98 URL w sitemapie. Główna przyczyna jest poza kodem (0 linków zewnętrznych → głód budżetu indeksowania: 100% odświeżanie, 0% odkrywanie), ale crawl 98 URL ujawnił cztery defekty, które psują sygnały wysyłane do wyszukiwarki i marnują i tak minimalny budżet:

- **Wszystkie 98 stron** serwuje dwa tagi `<meta name="description">` — statyczny z `index.html` (ten sam dla całej domeny) i właściwy z Helmeta. Parser biorący pierwszy widzi 98 identycznych opisów.
- **Wszystkie 60 URL bloga** ma hreflang wskazujący na adresy zwracające 404. Sitemap podaje poprawne pary, HTML zaprzecza sitemapie.
- **`/en/` i trzy strony prawne EN** kanonikalizują się do wersji PL, więc nie mogą trafić do indeksu, mimo że są w sitemapie jako osobne adresy.
- **Sekcja `/en/*` jest osierocona** w grafie linków — przełącznik języka to `<button>` z obsługą w JavaScripcie, więc w prerenderowanym HTML nie ma żadnego linku do wersji angielskiej.

Poprawki nie odblokują indeksacji same z siebie, ale bez nich każde późniejsze działanie linkowe trafia na stronę wysyłającą sprzeczne sygnały.

## What Changes

- Usunięcie statycznego `<meta name="description">` z `index.html` — jedynym źródłem opisu zostaje `SEO.jsx` (Helmet).
- `BlogPostPage.jsx` przekazuje `alternateUrl` do `<SEO>`, wyliczony z istniejącego `getAlternatePost()`. Gdy tłumaczenie nie istnieje — komponent `SEO` nie emituje pary hreflang zamiast zgadywać adres.
- `SEO.jsx` przestaje budować adresy alternatywne przez podmianę prefiksu w ścieżce. Brak `alternateUrl` = brak tagu `alternate`, nie zmyślony URL.
- `Home.jsx` przekazuje `path` do `<SEO>`; strony prawne (`PrivacyPolicy`, `TermsOfService`, `CookiePolicy`) używają `useLocalizedPath` zamiast twardo zakodowanej ścieżki PL. Każdy adres dostaje canonical wskazujący na siebie.
- `LanguageSwitcher` renderuje `<Link>`/`<a href>` z adresem policzonym podczas renderowania (nie w obsłudze kliknięcia), więc link do wersji alternatywnej trafia do prerenderowanego HTML.
- Test E2E pilnujący czterech niezmienników: jeden `<meta name="description">` na stronę, canonical równy adresowi strony, każdy `hreflang` wskazujący na adres obecny w sitemapie, obecność linku do wersji alternatywnej w HTML.

Nie ma zmian łamiących zgodność — żaden URL się nie zmienia, żadna trasa nie znika.

## Capabilities

### New Capabilities
- `seo-page-metadata`: niezmienniki metadanych na poziomie strony — pojedynczy opis, canonical wskazujący na siebie w obrębie wersji językowej, hreflang wyłącznie na istniejące adresy, link do wersji alternatywnej obecny w prerenderowanym HTML.

### Modified Capabilities
<!-- Brak. sitemap-lastmod i schema-blog-posting generują poprawne dane; defekty siedzą wyłącznie w warstwie renderowania metadanych. -->

## Impact

**Kod:**
- `index.html` — usunięcie jednej deklaracji `<meta>`
- `src/components/seo/SEO.jsx` — zmiana logiki hreflang (fallback po prefiksie → warunkowa emisja)
- `src/pages/BlogPostPage.jsx` — przekazanie `alternateUrl`
- `src/pages/Home.jsx` — przekazanie `path`
- `src/pages/PrivacyPolicy.jsx`, `TermsOfService.jsx`, `CookiePolicy.jsx` — lokalizowana ścieżka
- `src/components/layout/Navigation.jsx` — `LanguageSwitcher` jako link
- `tests/e2e/` — nowy plik z testami niezmienników

**Zasięg:** 98 adresów w sitemapie; 60 URL bloga odzyskuje poprawny hreflang, 4 adresy EN odzyskują własny canonical.

**Poza zakresem:** działania linkowe (osobny, nietechniczny tor), ręczne zgłaszanie adresów w GSC (po wdrożeniu), pełny audyt `claude-seo:seo-audit` (równolegle).

**Zweryfikowane, nie wymaga zmiany:** `http://pawel.lipowczan.pl/` zwraca 308 na HTTPS; sitemapa na produkcji jest identyczna z repozytorium i zawiera poprawne pary językowe; brak `noindex` i nagłówka `X-Robots-Tag`; wszystkie 98 adresów zwraca 200 z prerenderowaną treścią.
