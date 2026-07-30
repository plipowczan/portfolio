## Why

Audyt `claude-seo:seo-audit` z 28.07.2026 zmierzył Lighthouse'em na produkcji dwa defekty ładowania obrazków. Oba są błędem jednego atrybutu:

- **`/blog` i `/en/blog` serwują po 30 obrazków bez `loading="lazy"`** — około 2,17 MB pobierane przed pierwszym malowaniem. To najgorsza strona serwisu: LCP 13,7 s i TBT 3780 ms na mobile. `ProjectCard` ustawia ten atrybut poprawnie, karta bloga nie — dlatego defekt łatwo przeoczyć w przeglądzie.
- **Okładka artykułu ma `loading="lazy"`, choć jest elementem LCP** — leży na górze wpisu, więc opóźniany jest dokładnie ten obrazek, na którym mierzy się metrykę.

Zmiana nie dotyka dwóch głównych przyczyn słabego LCP — jednej paczki JavaScriptu 757 kB bez podziału na trasy i sekcji hero z `opacity: 0` w prerenderowanym HTML. Te siedzą w osobnych pozycjach audytu (C6, H1) i wymagają większej pracy.

## What Changes

- `Blog.jsx`: `BlogCard` dostaje `isFirst`. Pierwsza karta zostaje `loading="eager"` z `fetchPriority="high"` (jest kandydatem na LCP — oznaczenie jej jako `lazy` to osobna kara w Lighthouse), pozostałe 29 dostaje `loading="lazy"`. Obrazki w widocznym obszarze i tak pobierają się od razu, więc nic nie tracimy nad zgięciem.
- `BlogPostPage.jsx`: okładka wpisu przechodzi z `loading="lazy"` na `loading="eager"` + `fetchPriority="high"`.
- Nowy test E2E pilnujący trzech niezmienników: pierwsza karta bloga nie jest `lazy`, pozostałe są, okładka artykułu nie jest `lazy`. Czwarty test pilnuje karty projektu, żeby wzorzec odniesienia sam nie uciekł.

Żaden adres się nie zmienia.

## Impact

**Kod:** `src/pages/Blog.jsx`, `src/pages/BlogPostPage.jsx`, `tests/e2e/perf-image-loading.spec.js` (nowy).

**Zasięg:** 2 adresy indeksu bloga (po 30 obrazków), 60 wpisów blogowych (okładka).

**Zweryfikowane po zbudowaniu:** `dist/blog/index.html` i `dist/en/blog/index.html` mają 30 obrazków, 29 `lazy` i 1 `eager`; okładka wpisu ma `loading="eager" fetchpriority="high"`. Pełny zestaw E2E bez regresji. Prerendering: 98/98 stron.

**Pomiar (Lighthouse mobile, lokalny `npm run preview`, po 3 przebiegi, `/blog`):** TBT spada z 342 ms do 215 ms (−37%), LCP bez zmian. Lokalny `preview` serwuje pliki bez opóźnienia sieci, więc oszczędność 2,17 MB transferu jest tu prawie niewidoczna — na prawdziwym łączu mobilnym to główny zysk tej zmiany. Potwierdzić na produkcji.

## Fonty — sprawdzone i świadomie odrzucone

Audyt wskazywał też trzecią pozycję: fonty ładowane przez `@import` w spakowanym CSS, bez `preconnect`, wycenione przez Lighthouse na produkcji na ~1920–1950 ms. Poprawka została napisana (dwa `preconnect` + jeden `<link rel="stylesheet">` łączący obie rodziny, zamiast dwóch `@import`) i **wycofana z tej zmiany** po pomiarach:

| Wariant | LCP `/blog` |
| --- | --- |
| stan wyjściowy (`@import`, bez `preconnect`) | 7,22 s |
| `preconnect` + `<link>` | 8,08 s |
| `preconnect` + `<link>`, wszystkie obrazki z powrotem `eager` | 8,09 s |
| sam `preconnect`, `@import` zostawiony | 8,30 s |

Winowajcą jest `preconnect`, nie obrazki (trzeci wiersz) i nie przeniesienie `@import` do `<link>` (czwarty wiersz jest gorszy od drugiego).

Ten pomiar jest jednak obciążony i nie przenosi się wprost na produkcję: lokalny `preview` oddaje pliki aplikacji bez opóźnienia sieci, więc jedynym prawdziwym kosztem sieciowym w całym śladzie jest domena Google. Wcześniejsze otwarcie do niej połączenia wygląda wtedy na czysty narzut. `preconnect` zarabia dokładnie wtedy, gdy pliki aplikacji i pliki zewnętrzne konkurują o to samo łącze — czyli na produkcji, nigdy na `localhost`. Lokalne porównanie A/B jest więc nieodpowiednim narzędziem do oceny `preconnect`.

Decyzja: nie wdrażamy zmiany, której nie umiemy tu zweryfikować. Wraca jako osobna zmiana, gdy będzie czym ją zmierzyć — najlepiej po podpięciu `GOOGLE_API_KEY` (dane CrUX) albo przez pomiar na wdrożeniu podglądowym Vercela, a nie na `localhost`.

Warto przy tym rozważyć wariant mocniejszy niż `preconnect`: **samodzielne hostowanie plików fontów**. Znika wtedy cała trzecia domena, a z nią pytanie o `preconnect` — koszt DNS i TLS nie istnieje, zamiast być przyspieszany.

**Poza zakresem:** podział paczki na trasy (C6), `opacity: 0` w prerenderowanym hero (H1), fonty (wyżej), `ProjectPage.jsx` (obrazek jest już `eager`, brakuje tylko `fetchPriority`).
