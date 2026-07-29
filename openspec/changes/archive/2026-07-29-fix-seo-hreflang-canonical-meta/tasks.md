## 1. Pojedynczy opis strony

- [x] 1.1 Usuń tag `<meta name="description">` z `index.html` (linie 7-10)
- [x] 1.2 Sprawdź, czy `SITE_CONFIG.description` w `src/utils/constants.js` niesie sensowny opis zapasowy dla stron bez własnego `description`
- [x] 1.3 Uruchom `npm run dev` i potwierdź w narzędziach przeglądarki, że strona główna ma dokładnie jeden tag opisu
  - **Niewykonalne w tej postaci; cel zweryfikowany inaczej.** Na serwerze deweloperskim strona główna ma **zero** tagów opisu, i to niezależnie od tej zmiany: `react-helmet-async` 2.0.5 pod React 19 nie wstawia `<meta>` ani `<link>` do `<head>`, gdy aplikacja siedzi w `<React.StrictMode>` (podwójne montowanie efektów, sprzątanie wygrywa ze wstawianiem). Sprawdzone przez tymczasowe zdjęcie `StrictMode` — tagi wracają. Wcześniej ten jeden opis w dev pochodził ze statycznego tagu w `index.html`, czyli dokładnie z tego, co ta zmiana usuwa.
  - **Zweryfikowano zamiast tego** na buildzie produkcyjnym (`StrictMode` działa tylko w dev): dokładnie jeden tag opisu na stronę — zadanie 6.2 oraz `tests/e2e/seo-metadata-invariants.spec.js`.

## 2. Hreflang oparty na danych

- [x] 2.1 W `src/components/seo/SEO.jsx` usuń fallback budujący adres przez podmianę prefiksu (linie 36-42)
- [x] 2.2 Dodaj do `SEO` jawny tryb dla stron, których wersje różnią się wyłącznie prefiksem `/en` (nowy prop, domyślnie wyłączony) — bez niego brak `alternateUrl` oznacza brak tagów `alternate`
- [x] 2.3 Emituj `hreflang="pl"`, `hreflang="en"` i `x-default` tylko wtedy, gdy adres alternatywny jest znany; w przeciwnym razie nie renderuj żadnego z nich
- [x] 2.4 W `src/pages/BlogPostPage.jsx` (okolice linii 480) wylicz adres alternatywny przez `getAlternatePost(post.slug)` i przekaż go do `<SEO alternateUrl={...}>`
- [x] 2.5 Obsłuż przypadek braku tłumaczenia w `BlogPostPage` — `alternateUrl` pozostaje niezdefiniowany, tagi `alternate` nie powstają
- [x] 2.6 Włącz tryb z zadania 2.2 na stronach, których wersje różnią się tylko prefiksem: `Blog`, `ProjectPage`, `PrivacyPolicy`, `TermsOfService`, `CookiePolicy`, `Home`

## 3. Canonical na własny adres

- [x] 3.1 W `src/pages/Home.jsx` (linia 57) przekaż `path` do `<SEO>` przez `useLocalizedPath()`, żeby `/en/` kanonikalizowało się do siebie
- [x] 3.2 W `src/pages/PrivacyPolicy.jsx` zamień twardo zakodowane `path="/privacy-policy"` na ścieżkę z `useLocalizedPath()`
- [x] 3.3 To samo w `src/pages/TermsOfService.jsx`
- [x] 3.4 To samo w `src/pages/CookiePolicy.jsx`
- [x] 3.5 Sprawdź w `src/pages/Blog.jsx` i `src/pages/ProjectPage.jsx`, czy `path` już uwzględnia prefiks językowy; popraw, jeśli nie

## 4. Link do wersji alternatywnej w HTML

- [x] 4.1 W `src/components/layout/Navigation.jsx` wydziel z `switchLanguage()` (linie 25-54) czystą funkcję zwracającą adres docelowy dla bieżącej ścieżki i języka
- [x] 4.2 Wywołaj tę funkcję podczas renderowania `LanguageSwitcher` i zamień `<button>` na `<Link to={target}>`
- [x] 4.3 Przenieś klasy Tailwind na `<Link>` i dodaj `inline-flex`, żeby układ nagłówka się nie zmienił
- [x] 4.4 Zachowaj `aria-label` opisujący docelowy język
- [x] 4.5 Zweryfikuj wizualnie obie instancje przełącznika — desktopową (linia 164) i mobilną (linia 169)

## 5. Testy niezmienników

- [x] 5.1 Utwórz `tests/e2e/seo-metadata-invariants.spec.js`
- [x] 5.2 Test: każdy sprawdzany adres ma dokładnie jeden `<meta name="description">`, a jego treść nie jest identyczna dla dwóch różnych adresów
- [x] 5.3 Test: canonical jest równy adresowi strony, z zachowaniem prefiksu `/en`
- [x] 5.4 Test: każdy `href` z tagu `alternate` odpowiada adresowi obecnemu w `public/sitemap.xml`
- [x] 5.5 Test: pary hreflang z HTML zgadzają się z parami `xhtml:link` z sitemapy dla tego samego adresu
- [x] 5.6 Test: prerenderowany HTML artykułu z tłumaczeniem zawiera `<a href>` prowadzący do odpowiednika
- [x] 5.7 Zestaw adresów do testu: `/`, `/en/`, `/blog`, `/blog/slabe-strony-claude-code`, `/en/blog/claude-code-weak-spots`, `/en/privacy-policy`, `/projects/frontdesk-ai`, jeden artykuł bez tłumaczenia
- [x] 5.8 Uruchom `npm test` i doprowadź do zieleni

## 6. Weryfikacja przed wdrożeniem

- [x] 6.1 `npm run build:prerender`
- [x] 6.2 Policz tagi `<meta name="description">` w kilku plikach z `dist/` — musi być dokładnie jeden na plik
- [x] 6.3 Sprawdź w `dist/` canonical i hreflang dla `/en/index.html` oraz dla jednego artykułu bloga
- [x] 6.4 Potwierdź, że w `dist/blog/<slug>.html` istnieje `<a href>` do wersji angielskiej

## 7. Weryfikacja po wdrożeniu

- [x] 7.1 Wdrożenie na produkcję
  - PR #18 (`b82880c`) nie wywołał builda na Vercelu — trzeba było pchnąć pustym commitem `893cd3d`. Przy PR #20 to samo już się nie powtórzyło, więc wygląda na przypadek jednorazowy, nie na wadę konfiguracji.
- [x] 7.2 Uruchom crawl 98 adresów z sitemapy i porównaj z wynikiem sprzed zmiany: zero zduplikowanych opisów, zero hreflang spoza sitemapy, zero niezgodnych canonicali
  - **Przed:** 98/98 adresów z problemem — 98 z dwoma opisami, 81 hreflang spoza sitemapy, 14 niezgodnych z sitemapą, 4 błędne canonicale, 98 bez linku do wersji alternatywnej.
  - **Po tej zmianie:** 9 adresów z problemem. Ujawniły dwa defekty: regresję hreflang na 6 URL (artykuły o identycznym slugu w obu językach) i 3 strony z poprawnym `<body>`, ale `<head>` strony głównej.
  - **Po naprawie (PR #20):** **0/98**. Kryterium spełnione w całości.
- [x] 7.3 Sprawdź w GSC narzędziem sprawdzania adresu jeden artykuł — czy „Adres kanoniczny wybrany przez Google" zgadza się z zadeklarowanym
  - Nie ma czego porównywać: „Adres URL jest Google nieznany", skanowanie „Nie dotyczy". Raport indeksowania pokazuje za to **29 stron „zeskanowana, ale nie zindeksowana"** — czyli problemem nie jest odkrywanie adresów, tylko ocena wartości. Plus 1 błąd przekierowania: `/en/blog/vibe-coding-przewodnik`, adres spoza sitemapy, który Google mógł poznać wyłącznie z wadliwego hreflang.
- [x] 7.4 Zgłoś ręcznie do indeksacji 10 adresów dziennie, zaczynając od strony głównej, listy bloga i najnowszych artykułów
  - Zmniejszone do małej partii (strona główna, lista bloga, jeden artykuł z odzyskanym hreflang). Powód: 29 stron Google już zeskanował i odrzucił, więc ponowne zgłaszanie całej puli bez zmiany sygnałów zużyłoby limit bez efektu. Mała partia sprawdza, czy poprawki wystarczyły.
- [x] 7.5 Zanotuj datę wdrożenia, żeby za 4 tygodnie porównać liczby w raporcie indeksowania
  - **Wdrożenie: 2026-07-29** (naprawa uzupełniająca z PR #20 tego samego dnia). Porównanie: **2026-08-26**. Stan wyjściowy do porównania: 0 zindeksowanych, 29 „zeskanowana, nie zindeksowana", 1 błąd przekierowania, 30 adresów znanych Google ze 98 w sitemapie.

## Ustalenia do dalszej pracy

Nie są zadaniami tej zmiany — wyszły przy weryfikacji i mają własne tory.

- **Defekt „poprawne `<body>`, cudzy `<head>`"** wystąpił na produkcji na 3 stronach, nigdy lokalnie. Po naprawie z PR #20 crawl go nie wykrywa. Nie wiadomo, czy zniknął, czy jest maskowany przez utwardzoną bramkę prerenderu, która ponawia trasę z niepasującymi metadanymi. Rozstrzyga log builda `4c0dc9d` na Vercelu — obecność linii `Metadane nie należą do trasy`.
- **Wyjście z `react-helmet-async`** na natywne API metadanych React 19 — zmiana `migrate-seo-to-react19-metadata`. Przenosi metadane z efektu do renderowania, co eliminuje klasę wyścigu stojącą za powyższym, i naprawia niewidoczność metadanych na serwerze deweloperskim (patrz 1.3).
