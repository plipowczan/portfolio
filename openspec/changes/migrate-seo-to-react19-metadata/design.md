## Context

`react-helmet-async` 2.0.5 działa w tym projekcie tylko na produkcji. Pod `<React.StrictMode>` React 19 montuje efekty dwukrotnie — mount, cleanup, mount — a implementacja Helmeta kończy ten cykl z pustym `<head>`. `StrictMode` działa wyłącznie w trybie deweloperskim, więc build produkcyjny ma komplet tagów i defekt nigdy nie dotarł do robota.

Objaw jest ostry: na `localhost:3000` strona nie ma opisu, canonicala ani hreflang. Jedyne, co przechodzi, to `<title>` — Helmet nadpisuje tekst istniejącego elementu z `index.html` zamiast dodawać nowy, więc ta jedna ścieżka przeżywa cykl sprzątania. To mylące: powierzchowne sprawdzenie „tytuł się zmienia, czyli Helmet działa" prowadzi w złą stronę.

Rozpoznane podczas zmiany `fix-seo-hreflang-canonical-meta`. Koszt: cztery testy przewrócone przy usunięciu statycznego opisu z `index.html` (bramka w `getSeoMetaTags` czekała na tag, który po usunięciu nie mógł już powstać), skierowanie testów metadanych na osobny serwer preview i tolerancja na brakujące metadane w trzech plikach testowych. Wszystko to są podpórki pod jedną wadę biblioteki.

Weryfikacja przyczyny: tymczasowe zdjęcie `<React.StrictMode>` z `src/main.jsx` przywraca komplet tagów na serwerze deweloperskim. Przywrócone natychmiast — `StrictMode` nie jest tu do negocjacji.

React 19 hoistuje `<title>`, `<meta>` i `<link>` renderowane w dowolnym miejscu drzewa do `<head>`. Robi to jako część renderowania, nie w efekcie, więc `StrictMode` nie ma czego zepsuć.

Ograniczenia: żaden adres ani żadna wartość metadanych nie może się zmienić; prerendering przez Puppeteer musi widzieć komplet tagów przed zrzutem; `StrictMode` zostaje.

## Goals / Non-Goals

**Goals:**

- Metadane widoczne w trybie deweloperskim, identycznie jak na produkcji.
- Zero zależności od nieutrzymywanej paczki w warstwie SEO.
- Cofnięcie podpórek testowych, które istnieją wyłącznie z powodu tej wady.
- Dowód, że przy zmianie trasy nie zostają tagi po poprzedniej stronie.

**Non-Goals:**

- Zmiana treści albo zestawu metadanych — wartości zostają co do znaku.
- `StructuredData.jsx` — nie używa Helmeta i działa poprawnie pod `StrictMode`.
- Rezygnacja z `<React.StrictMode>`.
- Zmiana sposobu prerenderowania.

## Decisions

### D1: Natywne hoistowanie React 19 zamiast biblioteki

`SEO.jsx` zwraca tagi bezpośrednio, jako zwykły fragment. React przenosi je do `<head>` sam.

*Alternatywy:* (a) zdjąć `StrictMode` — leczy objaw, wyłączając czujnik, który wykrywa efekty bez sprzątania; (b) przenieść `HelmetProvider` ponad `StrictMode` — działa, ale zostawia nieutrzymywaną zależność i nie tłumaczy się nikomu poza autorem obejścia; (c) zamienić na inną bibliotekę metadanych — dokłada zależność tam, gdzie framework ma już własne API.

*Konsekwencja:* znika warstwa pośrednia. Tagi są częścią drzewa Reacta, więc podlegają zwykłym regułom montowania i odmontowania.

### D2: Atrybut `lang` poza mechanizmem hoistowania

Hoistowanie w React 19 obejmuje `<title>`, `<meta>` i `<link>`. **Nie** obejmuje atrybutów `<html>`, a `LocaleLayout.jsx` używa dziś Helmeta właśnie do `<html lang>`. Ustawiamy go efektem na `document.documentElement`.

*Dlaczego to jest w porządku:* `lang` to atrybut istniejącego elementu, nie wstawiany węzeł — nie ma czego zamontować ani odmontować, więc podwójne wywołanie efektu pod `StrictMode` daje ten sam wynik co pojedyncze. To ta sama własność, dzięki której `StructuredData.jsx` działa dziś poprawnie.

*Alternatywy:* (a) ustawić `lang` w `index.html` na sztywno — błędne dla `/en/*`; (b) zostawić Helmet wyłącznie do tego jednego zastosowania — trzyma całą zależność dla jednego atrybutu, który i tak nie działa w dev.

### D3: Usuwanie tagów przy zmianie trasy zostawiamy Reactowi, ale dowodzimy testem

React 19 hoistuje, ale **nie** deduplikuje `<meta>` po atrybucie `name` — dwa komponenty renderujące opis dają dwa tagi. W tej aplikacji `SEO` renderuje się raz na trasę i odmontowuje przy zmianie, więc React powinien posprzątać poprzednie tagi. „Powinien" to za mało dla warstwy, która właśnie okazała się cicho zepsuta.

*Decyzja:* nie dokładamy własnego usuwania. Zamiast tego test pokrywa nawigację po stronie klienta: artykuł → artykuł, przełączenie języka, wejście na stronę bez pary hreflang. Jeśli duplikaty jednak powstają, dopiero wtedy sięgamy po rozwiązanie — i wiemy dokładnie, w którym przypadku.

*Dlaczego nie profilaktycznie:* ręczne usuwanie tagów obok mechanizmu Reacta to dokładnie ta klasa obejścia, która doprowadziła do obecnego stanu.

### D4: Kolejność — najpierw migracja, potem zdjęcie podpórek

Podpórki testowe (serwer preview na 4173, `dist-test/`, tolerancja na brakujący opis, obejście na `data-rh`) zdejmujemy **po** potwierdzeniu, że migracja działa. Nie w tym samym kroku.

*Dlaczego:* to jedyna siatka bezpieczeństwa, jaką mamy. Zdjęta razem z migracją zostawiłaby zmianę warstwy metadanych bez żadnej kontroli w najbardziej ryzykownym momencie.

### D5: Testy metadanych wracają na serwer deweloperski

Po migracji dev i produkcja renderują metadane tym samym mechanizmem, więc serwer deweloperski jest reprezentatywny. `seo-metadata-invariants.spec.js` traci własny `baseURL`, a `playwright.config.js` wraca do jednego serwera.

*Co przez to tracimy:* kontrolę metadanych na buildzie produkcyjnym w CI. *Czym to zastępujemy:* scenariusz parzystości dev/produkcja ze specyfikacji — jeden test porównujący oba źródła — plus istniejąca reguła uruchamiania testów prerenderu przed scaleniem (`.claude/rules/11-git.md`).

*Efekt uboczny:* `npm test` przestaje budować cokolwiek, więc znikają `build:test`, `preview:test` i katalog `dist-test/`. Lista wykluczeń watchera w `vite.config.js` zostaje — obserwowanie katalogów buildu było złym pomysłem niezależnie od tej zmiany.

## Risks / Trade-offs

**[React 19 nie deduplikuje metadanych po `name`]** → Największe ryzyko tej zmiany. Mitygacja: test nawigacji po stronie klienta obejmujący trzy przejścia (artykuł→artykuł, przełączenie języka, strona bez tłumaczenia) — patrz D3. Test powstaje **przed** zdjęciem podpórek.

**[Prerender może nie zdążyć zobaczyć tagów]** → `scripts/prerender.mjs:163` czeka do 20 s na `og:title` i `description`, po czym generuje plik z ostrzeżeniem. Hoistowanie dzieje się przy zatwierdzeniu renderu, czyli nie później niż efekt Helmeta, ale to trzeba potwierdzić, a nie założyć. Mitygacja: pełny przebieg `build:prerender` i sprawdzenie licznika błędów oraz braku ostrzeżeń o metatagach dla wszystkich 98 tras.

**[`<title>` zachowuje się inaczej niż dotąd]** → Helmet nadpisywał tekst elementu z `index.html`; React 19 wstawia własny. Możliwy przejściowy stan z dwoma tytułami albo z tytułem z `index.html` w zrzucie prerenderu. Mitygacja: sprawdzić liczbę elementów `<title>` w kilku plikach z `dist/`, tak jak przy poprzedniej zmianie sprawdzaliśmy liczbę opisów.

**[Zdjęcie tolerancji odsłoni inne, dotąd ukryte braki]** → Testy w `home.spec.js`, `blog.spec.js` i `policy-pages.spec.js` tolerują dziś brak `canonical` i `og:*`, nie tylko opisu. Po migracji te tagi mają być obecne, więc przywrócenie twardych asercji może pokazać braki niezwiązane z Helmetem. Mitygacja: przywracać asercje po jednej i traktować każde padnięcie jako osobne ustalenie, nie jako regresję migracji.

**[Zmiana dotyka warstwy, która właśnie została naprawiona]** → `fix-seo-hreflang-canonical-meta` wszedł chwilę wcześniej. Mitygacja: żadna wartość metadanych się nie zmienia, a `seo-metadata-invariants.spec.js` porównuje je z `sitemap.xml` — rozjazd zapali się natychmiast.

## Migration Plan

1. `SEO.jsx` bez `<Helmet>`, `LocaleLayout.jsx` z `lang` na `document.documentElement`, `main.jsx` bez `HelmetProvider`. Podpórki testowe **zostają**.
2. Test nawigacji po stronie klienta (D3) — pisany na tym etapie, żeby ryzyko duplikatów było zamknięte przed dalszymi krokami.
3. `npm test` na komplecie: metadane sprawdzane wciąż na buildzie produkcyjnym, czyli tak jak przed migracją.
4. `npm run build:prerender` i kontrola `dist/`: liczba elementów `<title>` i `<meta name="description">` na plik, canonical zgodny ze ścieżką, hreflang zgodny z sitemapą.
5. Usunięcie `react-helmet-async` z `package.json`.
6. Zdjęcie podpórek: `playwright.config.js` do jednego serwera, `seo-metadata-invariants.spec.js` bez własnego `baseURL`, twarde asercje w trzech plikach testowych, `getSeoMetaTags` bez obejścia na `data-rh`, skrypty `build:test` i `preview:test` do usunięcia.
7. `npm test` ponownie — teraz w całości na serwerze deweloperskim.

**Wycofanie:** zmiana nie rusza tras, danych ani wartości metadanych. Cofnięcie commita przywraca stan sprzed, łącznie z zależnością. Żaden adres nie znika, więc wycofanie nie generuje 404.

## Open Questions

- Czy po migracji `index.html` powinien nadal zawierać `<title>`? Dziś jest tam jako wartość zapasowa widoczna przed zamontowaniem Reacta. Do rozstrzygnięcia w kroku 4, na podstawie tego, co faktycznie znajdzie się w `dist/`.
- Czy scenariusz parzystości dev/produkcja ma być testem stałym, czy jednorazową kontrolą przy migracji? Test stały wymaga obu serwerów, czyli częściowo utrzymuje to, co D5 usuwa.
