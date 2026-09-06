# Blog Article Validation Report: Zmierzone, nie założone. Trzy wnioski, które sam obaliłem

> **Data walidacji:** 2026-09-06
> **Faza:** VALIDATE
> **Plan:** `.claude/agents/plans/blog-zmierzone-nie-zalozone.md`
> **Prime:** `.claude/agents/context/blog-prime-zmierzone-nie-zalozone.md`

## Article Details

- **File**: `src/content/blog/zmierzone-nie-zalozone.md`
- **Blog ID**: 32 (unikalny)
- **Date**: 2026-09-06
- **Read Time**: 16 min
- **Word Count**: 3132 (2680 prozy + 452 FAQ)
- **Rundy**: pierwotna redakcja + runda uwag operatora z 2026-09-06 (patrz „Uwagi wdrożone")

## Validation Results

### ✅ PASSED

**Level 1 — struktura pliku**

- Plik istnieje pod `src/content/blog/zmierzone-nie-zalozone.md`
- Frontmatter parsuje się: `node scripts/generate-content.mjs` zwrócił 61 artykułów bez błędu
- `id: 32` unikalny (poprzednie maksimum: 31)
- `slug` zgodny z nazwą pliku

**Level 2 — jakość treści**

| Pole | Wartość | Wymóg | Wynik |
|---|---|---|---|
| title | 57 znaków | 50-60 | ✅ |
| excerpt | 169 znaków | 150-200 (`src/content/blog/AGENTS.md`) | ✅ |
| category | `Code` | kategoria z `article-structure.md` | ✅ |
| tags | 5 | 3-5 | ✅ |
| image | `/images/og-zmierzone-nie-zalozone.webp` | format `og-{slug}.webp` | ✅ |
| readTime | 16 min | ~200 słów/min | ✅ |

- **Bloki kodu:** jeden blok, znacznik `text`. Grep `^```[[:space:]]*$` daje jedno trafienie i jest to klamra zamykająca, nie blok bez znacznika.
- **Brama słownikowa** (`.claude/rules/content/10-prosty-polski.md`): zero trafień.
- **Brama znaków** (em dash / en dash / wielokropek Unicode): zero trafień.
- **Brama nazw wykluczonych** (osoby, klienci, dostawcy, wystawcy, identyfikatory zadań): zero trafień.
- **Struktura:** 11 nagłówków H2, H3 wyłącznie w FAQ wewnątrz `<summary>`. Brak osieroconych H3.

**CTA — wszystkie sprawdzenia kanoniczne**

| Sprawdzenie | Oczekiwane | Wynik |
|---|---|---|
| `class="btn-primary inline-block"` | 1 | ✅ 1 |
| `bg-dark-800/50 backdrop-blur-md` | 1 | ✅ 1 |
| `href="/#contact"` | 1 | ✅ 1 |
| tekst przycisku „Umów bezpłatną konsultację" | 1 | ✅ 1 |
| wzorce przestarzałe (`cta-section`, style inline, `automation.house/kontakt`) | 0 | ✅ 0 |
| kolejność: CTA (176) → Przydatne zasoby (186) → FAQ (195) | rosnąca | ✅ |

**Level 3 — SEO**

- Fraza główna („pomiar oznaczania treści AI") niesiona przez tytuł, lead i nagłówki reguł.
- Frazy poboczne w nagłówkach: kontrolka negatywna, mechanizm zamiast korelacji, warstwa krucha / odporna.
- Hierarchia H1 → H2 → H3 zachowana.

**Level 4 — poprawność techniczna**

- Linki wewnętrzne — wszystkie trzy cele istnieją jako pliki:
  `srodowisko-agentowe-ai-dwie-firmy`, `system-agentow-ai-skills-rules-kontekst`,
  `okf-standard-przenosnosc-bazy-wiedzy-ai`.
- Linki zewnętrzne — wszystkie zwracają `200`:
  `qamera.ai`, `qamera.ai/tools/verify-image`, `verify.contentauthenticity.org`,
  `spec.c2pa.org/specifications/specifications/2.1/index.html`.
- **Fakty zweryfikowane u źródła** - główny wsad pomiarowy w prywatnej bazie wiedzy, sekcje
  4c, 4f, 4f-ter, 4h, 7a.3, 7a.4, 7a.4-bis, 7a.4-ter, 7a.5. Szczegół w sekcji „Odstępstwa" niżej.

**Level 5 — render w przeglądarce**

Sprawdzone na `http://localhost:3128/blog/zmierzone-nie-zalozone`:

- `document.title` i H1 zgodne z frontmatterem
- 11 nagłówków H2, jeden blok kodu wyrenderowany jako `<pre>` (nie inline)
- 6 akordeonów `<details>`, wszystkie z atrybutem `open`
- JSON-LD: `BlogPosting`, `BreadcrumbList`, `FAQPage` z **6** pytaniami (ekstraktor złapał komplet)
- CTA: tekst „Umów bezpłatną konsultację", `href="/#contact"`
- Jedyny błąd w konsoli: brak `/images/og-zmierzone-nie-zalozone.webp` (patrz FAILURES)

## ⚠️ WARNINGS

1. **`npm run og:check` nie wykrywa brakującego obrazu.** Skrypt iteruje po plikach
   w `public/images/`, a nie po polach `image:` z frontmatterów, więc kończył się kodem 0
   mimo braku obrazu dla tego artykułu. Raportuje przy okazji 20 wcześniej istniejących
   obrazów w złych wymiarach - dług sprzed tej zmiany, poza zakresem, ale jego przyczyna
   jest już znana: patrz sekcja „Obraz OG", podsekcja o rozjeździe dokumentacji ze skryptem.
2. **Duplikat `id: 1`** przy naiwnym grepie po `src/content/blog/*.md` pochodzi z przykładu
   schematu w `README.md`, nie z prawdziwego artykułu. Pułapka opisana wprost
   w `src/content/blog/AGENTS.md`. Nie jest kolizją.
3. ~~Brak linku do bliźniaczego artykułu biznesowego na blogu qamera.ai.~~ **Domknięte
   w rundzie trzeciej** - adres podała sesja `portfolio-23`, link jest w „Przydatnych
   zasobach". Zamienia się jednak w blokadę scalenia, bo cel zwraca dziś `404`.
4. **`alternateSlug` nieustawiony i tak ma zostać** do czasu powstania pliku w `blog/en/`.

## ❌ FAILURES

Brak. Jedyna blokada (brakujący obraz OG) została zdjęta - patrz niżej.

## Obraz OG - domknięty 2026-09-06

`.env` skopiowany z głównego checkoutu (`C:\Projects\portfolio\.env`); jest w `.gitignore`
(reguła w linii 29), więc nie wchodzi do commita - sprawdzone `git check-ignore` przed
kopiowaniem i `git status` po.

Wynik: `public/images/og-zmierzone-nie-zalozone.webp`, **1200x630 px, 56,70 KB**, przechodzi
`node scripts/check-og-images.mjs` (liczba poprawnych 21 → 22). W przeglądarce obraz ładuje
się w naturalnym rozmiarze 1200x630, a `og:image` i `twitter:image` wskazują
`https://pawel.lipowczan.pl/images/og-zmierzone-nie-zalozone.webp`.

### Rozjazd dokumentacji z zachowaniem skryptu (przyczyna 20 obrazów w złych wymiarach)

Instrukcja w `/blog-article-writer:validate` zakłada, że `generate-image.js` zapisuje
`.png` gotowy do konwersji. **Zapisuje `.jpeg` w wymiarach 1424x752**, czyli dokładnie
w tych, które `check-og-images.mjs` odrzuca. To wyjaśnia 20 wcześniej istniejących obrazów
oznaczonych ❌: nie są zaniedbaniem, tylko wyjściem domyślnym tego potoku.

Działająca sekwencja to trzy kroki, nie dwa:

```bash
node scripts/generate-image.js "$(cat .claude/agents/prompts/og-<slug>-prompt.txt)" \
  --filename og-<slug> --output public/images --model gemini-3-pro-image-preview
node scripts/convert-to-webp.js public/images/og-<slug>.jpeg
node scripts/resize-og-image.mjs og-<slug>.webp
rm public/images/og-<slug>.jpeg
```

**Pułapka Windows:** `resize-og-image.mjs` kończy się `EPERM` przy podmianie pliku, gdy
działa serwer deweloperski - trzyma uchwyt do `public/images/`. Przeskalowany plik zostaje
wtedy jako `<nazwa>.webp.tmp` i wystarczy go podmienić ręcznie (`mv -f`), bo treść jest
poprawna. Alternatywa: zatrzymać serwer na czas skalowania.

## Uwagi wdrożone (runda operatora, 2026-09-06)

1. **Lead nazywa i linkuje projekt.** Pierwszy akapit mówi wprost, czym jest
   [Qamera](https://qamera.ai) (generowanie zdjęć i wideo produktowych dla sklepów) i jaka
   jest w niej moja rola. Drugi akapit opisuje drogę pliku w e-commerce: sklep, miniatury
   i warianty, potem media społecznościowe i porównywarki.
2. **Poprawiona rama czasowa.** Poprzednia wersja („przez ostatnie pół roku prowadziłem
   projekt") myliła wiek projektu z wiekiem wątku AI Act. Jest: temat wszedł w połowie lipca,
   analizy na przełomie lipca i sierpnia, ostatni domiar 5 września. Zgadza się z datami
   pomiarów w tekście (6.08 - 5.09).
3. **AI Act nazwany z nazwy** i wyjaśniony jednym zdaniem („unijne rozporządzenie wymagające
   oznaczania treści generowanych przez AI"), z zastrzeżeniem, że to nie jest tekst prawny.
   Bez numerów przepisów, zgodnie z zakazem z prime.
4. **Rola agenta ujawniona.** Nowy akapit rozdziela, co wykonał agent (lokalne instancje,
   pełna ścieżka wgrywania, odczyt manifestów, skan bajtów) od tego, czego wykonać nie mógł
   (publikacja na platformach wymaga człowieka z kontem). Wzmacnia oś tekstu, bo zdanie
   „pewność nie jest pomiarem" pada tuż po tym rozdziale.
5. **Definicja znaku wodnego uogólniona** z „przeżywający przeskalowanie" na „odporny na
   przekształcenia samego pliku" - przeskalowanie było tylko jednym z mierzonych wariantów.
6. **Usunięte podwojenie** w zdaniu „Przed pomiarem miałem na ten temat zdanie. Wszyscy
   w projekcie mieliśmy to samo zdanie".
7. **Linki zewnętrzne wpuszczone do prozy**, nie tylko do „Przydatnych zasobów": weryfikator
   Content Authenticity i własny odczyt Qamery w kickerze, specyfikacja C2PA przy pierwszej
   definicji manifestu.

**Błąd rzeczowy znaleziony przy okazji uwagi 5 i naprawiony.** Kicker twierdził, że warstwa
odporna „przeżywa przeskalowanie, konwersję formatu, obrót i odbicie... na dziesięciu
przekształceniach". Macierz dziesięciu transformacji dotyczy **manifestu** (zginął 10/10,
sekcja 4d). Znak wodny mierzono na **pięciu** i przeszedł 5/5, ale obrót i konwersja formatu
nie były wśród nich. Kicker podaje teraz obie liczby rozdzielnie i wymienia wyłącznie
przekształcenia faktycznie zmierzone na tej warstwie.

## Przegląd sesji `portfolio-23` (2026-09-06, runda trzecia)

Sesja, która przygotowała wsad i plan oraz napisała bliźniaczy tekst na blogu qamera.ai,
porównała artykuł ze źródłami. Potwierdziła niezależnie: 8/8 w edytorze, 5/5 dla znaku
wodnego, 10/10 dla manifestu, próg 2560 px, wymiary i wagi PrestaShopa, daty pomiarów Meta
oraz trzynaście wzorców bajtowych. Zgłosiła cztery rzeczy.

1. **Link do bliźniaka wstawiony** - `## Przydatne zasoby`, w ramie „te same pomiary od
   strony sklepu". Adres był w planie celowo pominięty, bo nie był wtedy potwierdzony.
   **Wprowadza nową blokadę scalenia** - patrz sekcja niżej.
2. **Naprawione urwane zdanie w leadzie.** „W połowie lipca przestało być jak" → „W połowie
   lipca to przestało wystarczać". Defekt powstał przy rundzie uwag operatora: pierwotne
   „machnąć ręką nie było jak" zostało przeredagowane i straciło orzeczenie. Bramy tego nie
   łapią, bo grep sprawdza słownictwo i znaki, nie składnię.
3. **Tytuł pozostaje bez zmian, świadomie** - uzasadnienie w „Odstępstwach", punkt 7.
4. **Liczenie dziewięciu kanałów** - bez zmian, zdanie w leadzie jest jednoznaczne co do
   składu (trzy silniki sklepowe, cztery platformy, dwa edytory). Zgłaszający sam ocenił,
   że nie wymaga poprawki.

## ❌ BLOKADA SCALENIA (nie walidacji)

**Link do bliźniaka zwraca dziś `404`.** Sprawdzone:

```text
404  https://qamera.ai/blog/co-zostaje-z-oznaczenia-zdjecia-na-drodze-do-kupujacego
```

Tekst qamerowy nie jest jeszcze opublikowany, a publikacja obu idzie w jednym oknie.
Artykuł jest gotowy, ale **PR nie może zostać scalony, zanim tamten wpis nie wyjdzie** -
inaczej portfolio wystawia martwy link w „Przydatnych zasobach". Przed scaleniem powtórzyć
`curl` na ten adres i wymagać `200`.

## Odstępstwa od planu (świadome, z uzasadnieniem)

1. **`readTime: 16 min` zamiast `12 min` z planu.** Plan wyliczył 12 min z założonej
   objętości ~3520 słów, co przy deklarowanych ~200 słowach na minutę daje ~17 min - rachunek
   w planie był wewnętrznie niespójny. Konwencja repozytorium: 2191 słów = 11 min,
   2810 słów = 14 min, czyli ~200 słów/min. Przy 3132 słowach wychodzi 16 min.

2. **Reguła 3 opisuje odwrócenie wniosku inaczej, niż zapisano w tabeli faktów planu.**
   Plan (sekcja 4) niesie wiersz „karta produktu renderuje 600 px i tak bez manifestu".
   To jest brzmienie **sprzed** domiaru z 2026-08-22. Źródło (`4f-ter`) mówi wprost, że
   zdanie jest prawdziwe **wyłącznie o manifeście**, bo pakiet XMP dojeżdża do każdej
   pochodnej, łącznie z kartą produktu. Artykuł podaje wersję po korekcie - inaczej reguła
   „mierz na własnym artefakcie" ilustrowałaby samą siebie nieaktualnym wnioskiem.

3. **Objętość 3132 słowa wobec ~3520 z budżetu planu.** Wszystkie zaplanowane sekcje są
   obecne w komplecie; proza jest ciaśniejsza, co reguły prostego polskiego nagradzają
   („jeśli zdanie da się skreślić bez straty informacji - skreśl je"). Plan wyznaczał
   wyłącznie górny limit (~3800, po którym tnie się sekcję 2).

6. **Trzy odwołania do Qamery zamiast jednego linku do narzędzia.** Plan (sekcja 11) mówi
   „nie sprzedawać Qamery: jeden link do narzędzia, jeden do artykułu biznesowego". Operator
   poprosił wprost o nazwanie i podlinkowanie projektu w leadzie oraz o wpuszczanie linków
   do prozy, więc w tekście są dziś: `qamera.ai` (lead, jedno zdanie o tym, czym jest),
   `qamera.ai/tools/verify-image` (kicker plus FAQ) i wpis w „Przydatnych zasobach".
   Ton pozostaje opisowy - akapit w kickerze mówi wprost, że własne narzędzie **ma to samo
   ograniczenie** co cudze, więc nie jest to sprzedaż. Doszedł czwarty odnośnik: link do
   bliźniaczego tekstu biznesowego, przewidziany przez plan od początku.

7. **Tytuł „Trzy wnioski, które sam obaliłem" zostaje**, mimo uwagi sesji `portfolio-23`,
   że reguła 4 opisuje przypadek, w którym werdykt się nie zmienił. Uwaga jest trafna co do
   werdyktu i nietrafna co do wniosku. W regule 4 zapisanym i następnie wycofanym wnioskiem
   było zdanie **„zabija przebudowa kontenera"** - i ono było fałszywe. Przetrwał werdykt
   („ginie 8 na 8"), który jest inną tezą i tekst rozróżnia je wprost, w leadzie („raz
   werdykt został ten sam, a rozsypało się uzasadnienie") i w samej regule („werdykt się nie
   zmienił, uzasadnienie owszem"). Tytuł mówi o wnioskach, nie o werdyktach, więc jest
   ścisły. Gdyby brzmiał „trzy werdykty, które obaliłem", byłby nieprawdziwy.
   Alternatywa z planu na wypadek zmiany zdania: „Zmierzone, nie założone. Trzy razy
   pomyliłem się o ten sam plik" (mocniejszy hak, słabszy w wyszukiwarce).

4. **Edytor wideo nie jest nazwany z nazwy**, zgodnie z brzmieniem planu i sekcji ograniczeń
   („jeden edytor, nie klasa edytorów"). Nazwa nie jest na liście wykluczeń, ale nazwanie
   go zmieniłoby ton z opisowego na recenzencki, czego plan zakazuje.

5. **Wątek zaufania do wystawcy certyfikatu pominięty w całości** przy regule 2, mimo że
   to on tłumaczy, czemu etykieta stanęła na jednym z dwóch plików. Prime wyklucza całą
   warstwę certyfikatu i klucza podpisującego. Artykuł zaznacza istnienie wątku jednym
   zdaniem i go nie otwiera.

## Post-Article Tasks

- [x] Prompt obrazu OG wygenerowany: `.claude/agents/prompts/og-zmierzone-nie-zalozone-prompt.txt`
- [x] Obraz OG wygenerowany (`gemini-3-pro-image-preview`)
- [x] Konwersja do WebP (512,5 KB → 66,7 KB, oszczędność 87,0%)
- [x] Przeskalowanie do 1200x630 (finalnie 56,70 KB), plik źródłowy `.jpeg` usunięty
- [x] Sitemap zaktualizowany (`public/sitemap.xml`, 61 artykułów, 99 URLi)
- [x] Test renderowania na serwerze deweloperskim przeszedł, konsola bez błędów

## EN Translation

- **EN file:** `src/content/blog/en/measured-not-assumed.md`
- **EN slug:** `measured-not-assumed` (potwierdzony z operatorem przed zapisem pliku)
- **EN title:** „Measured, Not Assumed. Three Conclusions I Overturned Myself"
- **Dwukierunkowy `alternateSlug`:** ✅ PL → `measured-not-assumed`, EN → `zmierzone-nie-zalozone`.
  Żadna strona nie wskazuje na samą siebie (pułapka z artykułu o Karpathym omijana świadomie).
- **Sitemap:** symetria przywrócona - 62 artykuły (31 PL + 31 EN), 100 URLi.
- **Linki wewnętrzne:** 3/3 zmapowane na odpowiedniki EN, zero pominiętych.
  Sprawdzone w renderze: zero linków `/blog/` bez prefiksu `/en`.
- **CTA:** wzorzec kanoniczny, przycisk „Book a free consultation".
- **Sekcja zasobów:** `## Useful Resources`.
- **`readTime`:** 16 min, dziedziczone z PL mimo 3865 słów wobec 3159. Zgodne z konwencją
  repozytorium - sprawdzone na dwóch istniejących parach (2191→2557 słów, oba 11 min;
  2823→3086 słów, oba 14 min).
- **Tagi:** nietłumaczone, zgodnie z konwencją (istniejące pary trzymają polskie tagi w EN).
- **hreflang:** `pl`, `en` i `x-default` wskazują poprawnie, canonical na wersję EN.
- **Schematy:** `BlogPosting` + `BreadcrumbList` + `FAQPage` z 6 pytaniami.
- **Bramy:** zero myślników Unicode, zero polskich cudzysłowów, blok kodu ze znacznikiem.
- **EN validation:** ✅ PASSED

### Odstępstwo: blok kodu przetłumaczony

Komenda `translate` nakazuje zostawiać bloki kodu nietknięte, „nawet jeśli zawierają polskie
lub angielskie napisy, bo kod traktujemy jak dane". Ten blok nie jest kodem ani wyjściem
narzędzia - to ręcznie narysowany diagram łańcucha pochodzenia, którego etykiety są prozą
(„warstwa aktywna", „składnik rodzica", „podpis dostawcy"). Zostawienie ich po polsku dałoby
czytelnikowi anglojęzycznemu nieczytelny rysunek w środku sekcji, która na nim stoi.
Przetłumaczone; struktura, wcięcia i znaczniki `text` bez zmian.

### Pułapka odczytu przy weryfikacji

Pierwszy odczyt schematów na stronie EN pokazał brak `FAQPage` i zgłosiłem to jako defekt.
Był to fałszywy alarm: `extractFAQ` działa na zamontowanym DOM-ie, więc schemat pojawia się
chwilę po pierwszym renderze. Powtórny odczyt pokazał komplet. Kto weryfikuje to samo,
niech czyta schematy po ustabilizowaniu strony, nie natychmiast po nawigacji.

## Pass DOX

Zmiana dodaje jeden artykuł zgodnie z istniejącym kontraktem `src/content/blog/AGENTS.md`.
Nie zmienia przeznaczenia folderu, kontraktu frontmatteru, kształtu FAQ, indeksu dokumentów
ani żadnego przepływu pracy. **Żaden `AGENTS.md` nie wymaga aktualizacji** i jest to decyzja
świadoma, nie pominięcie.

## Overall Status

✅ **VALIDATION PASSED** - treść, struktura, bramy, render i obraz OG przechodzą w komplecie.

⏸️ **SCALENIE WSTRZYMANE** do czasu publikacji bliźniaczego tekstu na blogu qamera.ai.
To nie jest wada artykułu, tylko kolejność wydania pary.

## Next Step

1. ~~`/blog-article-writer:translate`~~ - **zrobione**, patrz sekcja „EN Translation".
2. ~~Commit obejmujący artykuł, obraz OG i sitemap~~ - **zrobione**, PR #42 (draft).
3. **Przed scaleniem:** `curl` na adres bliźniaka musi zwrócić `200`, nie `404`.
   To jedyna pozostała pozycja.
