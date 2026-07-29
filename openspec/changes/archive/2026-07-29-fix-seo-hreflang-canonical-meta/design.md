## Context

Audyt GSC (28.07.2026): 0 zindeksowanych stron, 30 znanych adresów z 98 w sitemapie, 498 żądań robota w 90 dni, z czego 100% na odświeżanie i 0% na odkrywanie. Linki zewnętrzne: 0. Test na żywo potwierdza, że Google ma dostęp do stron i potrafi je zindeksować — nic nie blokuje ich technicznie.

Crawl wszystkich 98 adresów ujawnił cztery defekty w warstwie renderowania metadanych. Wszystkie mają wspólny mianownik: **komponent `SEO` zgaduje adresy zamiast dostawać je od strony, która wie**.

Obecny stan `src/components/seo/SEO.jsx:36-42`:

```js
const plUrl = currentLang === "en"
  ? (alternateUrl || canonicalUrl.replace("/en/", "/").replace("/en", "/"))
  : canonicalUrl;
const enUrl = currentLang === "en"
  ? canonicalUrl
  : (alternateUrl || `${siteUrl}/en${formattedPath}`);
```

Fallback zakłada, że wersje językowe różnią się wyłącznie prefiksem. Dla stron statycznych to prawda. Dla bloga nie — tam slug jest tłumaczony (`slabe-strony-claude-code` ↔ `claude-code-weak-spots`). `BlogPostPage.jsx:480` nie przekazuje `alternateUrl`, więc fallback produkuje adresy 404 na wszystkich 60 URL bloga.

Dane potrzebne do poprawnego wyliczenia **już istnieją**: pole `alternateSlug` jest w 30 plikach PL i 30 EN, a `getAlternatePost()` w `src/data/blogPosts.js:147` je rozwiązuje. Korzysta z tego `LanguageSwitcher` (`Navigation.jsx:32`) — ale dopiero w obsłudze kliknięcia, więc wynik nigdy nie trafia do HTML.

Ograniczenia: brak zmian adresów (każdy 301 kosztuje budżet, którego nie ma), brak nowych zależności, prerendering przez Puppeteer musi widzieć efekt w statycznym HTML.

## Goals / Non-Goals

**Goals:**
- Jedno źródło prawdy dla opisu strony: `SEO.jsx`.
- Adresy alternatywne pochodzą z danych (`alternateSlug`), nigdy z manipulacji łańcuchem znaków.
- Każdy adres kanonikalizuje się do siebie w obrębie swojej wersji językowej.
- Sekcja `/en/*` wchodzi do grafu linków widocznego dla robota.
- Testy E2E pilnujące tych niezmienników po każdym wdrożeniu.

**Non-Goals:**
- Zdobywanie linków zewnętrznych — osobny, nietechniczny tor.
- Przycinanie sitemapy ani usuwanie wersji EN — rozważane i odrzucone w decyzji 2.
- Zmiana schematu adresów, nazw slugów czy struktury tras.
- Poprawa treści pod kątem jakości — czeka na wynik audytu `claude-seo:seo-audit`.

## Decisions

### D1: Brak adresu alternatywnego oznacza brak tagu, nie zgadnięty adres

Fallback po prefiksie znika. `SEO` emituje parę hreflang tylko wtedy, gdy dostanie `alternateUrl` albo gdy strona jawnie zadeklaruje, że wersje różnią się wyłącznie prefiksem.

*Alternatywy:* (a) zostawić fallback i naprawić tylko blog — odrzucone, bo ten sam błąd wróci przy każdej nowej stronie z tłumaczonym slugiem; (b) trzymać mapę tłumaczeń adresów w jednym pliku konfiguracyjnym — odrzucone, bo duplikuje dane, które już są we frontmatterze.

*Konsekwencja:* strona bez tłumaczenia nie ma hreflang w ogóle. To poprawne — hreflang bez pary zwrotnej i tak jest ignorowany przez Google.

### D2: Adres alternatywny liczy strona, nie komponent SEO

`BlogPostPage` woła `getAlternatePost(slug)` i przekazuje gotowy adres. `SEO` przyjmuje go i emituje bez przeróbek.

*Dlaczego:* `SEO` nie ma dostępu do danych artykułu i nie powinien go mieć. Strona zna swój kontekst; komponent metadanych jest głupim renderem. To ta sama zasada, którą już stosują `CourseLesson.jsx:89` i `LlmWikiLanding.jsx:89` — wzorzec istnieje, blog go po prostu nie używa.

### D3: Przełącznik języka jako kotwica, nie przycisk

`LanguageSwitcher` przenosi wyliczenie adresu z `switchLanguage()` do fazy renderowania i zwraca `<Link to={target}>`. Logika rozwiązywania celu zostaje bez zmian — to ta sama funkcja, tylko wywołana wcześniej.

*Alternatywy:* (a) dodać ukryty `<link rel="alternate">` do nawigacji — odrzucone, bo `<link>` w `<body>` nie jest linkiem w grafie; (b) dodać widoczną listę wersji językowych w stopce — odrzucone jako zmiana interfejsu wykraczająca poza zakres.

*Efekt uboczny, pożądany:* przełącznik zyskuje działanie środkowym przyciskiem myszy, otwieranie w nowej karcie i podgląd adresu w pasku stanu. Dziś `<button>` tego nie daje.

*Uwaga dostępnościowa:* `aria-label` zostaje; rola zmienia się z `button` na `link`, co jest zgodne z tym, co element faktycznie robi.

### D4: Ścieżka lokalizowana zamiast twardo zakodowanej na stronach prawnych

`PrivacyPolicy`, `TermsOfService`, `CookiePolicy` używają `useLocalizedPath()` przy budowie `path` dla `SEO`. `Home.jsx` przekazuje `localizedPath("/")`.

*Dlaczego nie zostawić kanonikalizacji EN → PL:* strony prawne EN mają przetłumaczoną treść i siedzą w sitemapie jako osobne adresy. Deklarowanie ich jako duplikatów PL jest sprzeczne z sitemapą — dokładnie ten sam rodzaj konfliktu co przy hreflang.

### D5: Testy jako brama, nie jako dokumentacja

Nowy plik `tests/e2e/seo-metadata-invariants.spec.js` przechodzi po reprezentatywnym zestawie adresów (strona główna PL i EN, lista bloga, artykuł z tłumaczeniem, artykuł bez, strona prawna EN, strona projektu) i sprawdza cztery niezmienniki ze specyfikacji.

*Dlaczego E2E, a nie testy jednostkowe komponentu:* defekt z podwójnym opisem jest niewidoczny na poziomie komponentu — powstaje dopiero ze złożenia `index.html` i Helmeta. Łapie go wyłącznie test na zbudowanym dokumencie.

*Rozszerzenie:* test porównuje hreflang z HTML z parami z `public/sitemap.xml`, więc rozjazd między tymi dwoma źródłami zapala się od razu.

## Risks / Trade-offs

**[Usunięcie fallbacku zabiera hreflang stronom, które dziś go mają poprawnie]** → Strony statyczne (`/privacy-policy`, `/llm-wiki`, projekty) faktycznie różnią się tylko prefiksem i fallback działał dla nich dobrze. Mitygacja: `SEO` dostaje jawny tryb dla par różniących się wyłącznie prefiksem, ustawiany przez stronę. Nic nie traci hreflang po cichu — test pilnuje, że każdy adres z sitemapy ma komplet par.

**[Zmiana `<button>` na `<Link>` psuje układ nagłówka]** → Klasy Tailwind przenoszą się bez zmian; `<Link>` renderuje `<a>`, które trzeba ustawić na `inline-flex`. Mitygacja: wizualna weryfikacja na desktopie i mobile, obie instancje przełącznika (`Navigation.jsx:164` i `:169`).

**[Poprawki nie zmienią liczby zindeksowanych stron]** → Bardzo prawdopodobne. Przyczyną zerowej indeksacji jest brak linków zewnętrznych, nie te defekty. Mitygacja: oczekiwanie ustawione wprost — miarą sukcesu tej zmiany są niezmienniki w HTML, a nie licznik w GSC. Efekt w indeksie mierzymy dopiero po zdobyciu pierwszych linków.

**[Ręczne zgłoszenia w GSC zużyte na starą wersję]** → Zgłaszanie adresów przed wdrożeniem oznaczałoby, że Google zobaczy stronę z wadliwym hreflang. Mitygacja: zgłoszenia dopiero po wdrożeniu (decyzja 6).

**[Prerender nie odświeży wszystkich stron]** → Build prerenderuje wszystkie trasy z listy, ale zmiana w `index.html` wpływa na każdy wynikowy dokument. Mitygacja: po zbudowaniu sprawdzić liczbę tagów opisu w `dist/` na kilku plikach, zanim cokolwiek pójdzie na produkcję.

## Migration Plan

1. Zmiany w kodzie, testy przechodzą lokalnie (`npm test`).
2. `npm run build:prerender`, weryfikacja na plikach w `dist/`: dokładnie jeden `<meta name="description">`, canonical zgodny ze ścieżką pliku, hreflang zgodny z sitemapą.
3. Wdrożenie na produkcję.
4. Weryfikacja na żywo: crawl 98 adresów tym samym skryptem co w audycie, porównanie z wynikiem sprzed zmiany.
5. Dopiero teraz ręczne zgłoszenia w GSC — 10 adresów dziennie, kolejność: strona główna, lista bloga, najnowsze artykuły.

**Wycofanie:** zmiana dotyka siedmiu plików i nie rusza tras ani danych. Cofnięcie commita przywraca stan sprzed. Żaden adres nie znika, więc wycofanie nie generuje 404.

## Open Questions

- Czy `SITE_CONFIG.description` (używany jako opis zapasowy) powinien zostać taki sam jak usuwany tag z `index.html`, czy dostać własną treść? Na razie zostaje bez zmian — to nie wpływa na niezmiennik „jeden opis na stronę".
- Czy strony projektów (`/projects/*` i `/en/projects/*`) mają identyczne tytuły w obu wersjach celowo? Crawl pokazał 8 par z tym samym tytułem. Poza zakresem tej zmiany, ale warto rozstrzygnąć przy okazji audytu treści.
