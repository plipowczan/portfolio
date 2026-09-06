# Prime: Zmierzone, nie założone

> **Faza:** PRIME (research) ukończona 2026-09-06.
> **Następny krok:** `/blog-article-writer:plan "Zmierzone, nie założone"`
> **Para:** artykuł ma bliźniaka biznesowego na blogu qamera.ai (kategoria „AI Act"),
> o tym, co z pomiaru wynika dla sklepu. Ten tekst jest o **metodzie**, tamten o skutkach.
> Wsad tamtego: prompt artykułu kanałowego w prywatnej bazie wiedzy.

## Źródła przeanalizowane

Wszystkie w prywatnej bazie wiedzy, w projekcie poświęconym zgodności z AI Act.
**Ścieżki i nazwy plików celowo nieprzytoczone** - to repozytorium jest publiczne,
a wsad zalicza wewnętrzną strukturę pracy do rzeczy wykluczonych z publikacji.
Opisy ról poniżej wystarczą, żeby odnaleźć źródła po stronie prywatnej.

| Źródło | Rola |
|--------|------|
| Inwentaryzacja eksportu (ok. 2000 linii) | **Główny wsad.** Pomiary przeżywalności oznaczeń przez sklepy, platformy i edytory, z datami, kontrolkami i sekcją ograniczeń |
| Definicja projektu | Cel projektu, dwie role (dostawca / podmiot stosujący), stan wiedzy przed i po lekturze tekstów źródłowych |
| Status projektu | Kalendarz terminów, historia wniosków wycofanych i odwróconych |
| Mapa treści i linkowania | Reguły publikacji, granica tego, co wolno powiedzieć publicznie |
| Ocena rozwiązania znakującego (nagłówki) | Cztery kryteria oceny; kontekst dla „solidność: nie spełnia" |

## Kluczowe tematy

1. **Pomiar zamiast lektury kodu.** Że plik wychodzi bajtami dostawcy, udowodniono nie
   czytaniem potoku, tylko zgodnością hasha z manifestu z bajtami eksportu. Lektura kodu
   mówi, co kod miał robić; hash mówi, co się stało.
2. **Kontrolka negatywna decyduje o wartości pomiaru.** Na Meta wgrano ten sam materiał
   pozbawiony wszystkich znaczników. Nie dostał etykiety na żadnej z dwóch platform, co
   dopiero czyni wynik dowodem: etykieta pochodzi z osadzonej deklaracji, nie z klasyfikatora
   obrazu. Zarzut o klasyfikator był realny, bo inne narzędzie rozpoznawało tę samą treść
   z samych pikseli.
3. **Pierwszy odczyt kłamie, bo systemy są asynchroniczne.** TikTok po kilkunastu minutach:
   brak etykiety, wniosek zapisany. Po dobie: etykieta jest, **wniosek wycofany**. Domiar
   czasowy zamienił jeden z negatywów w fałszywy negatyw.
4. **Mierz na własnym artefakcie.** Pierwsze pomiary sklepów szły na cudzym pliku, bo nasz
   nie miał jeszcze kompletu metadanych. Powtórka na własnym **odwróciła wnioski dla
   WooCommerce**.
5. **Mechanizm, nie korelacja.** Osiem na osiem eksportów z edytora zgubiło oznaczenie,
   i przypisano to przebudowie kontenera. TikTok kontener też przebudowuje, deklaruje to
   wprost, a łańcuch zostaje. Werdykt się nie zmienił, ale **uzasadnienie owszem**: zabójcza
   jest przebudowa przez narzędzie nieświadome pochodzenia. Dopiero to jest przenośne.
6. **Zapisz, czego nie zmierzyłeś.** Osobna sekcja ograniczeń: jeden edytor a nie klasa
   edytorów, dwie platformy niezmierzone na drugiej osi, świadomie pominięty wariant.
   Tabela z pustym polem czytanym jako zero jest gorsza niż brak tabeli.
7. **Kicker: krucha warstwa jest publiczna, odporna zamknięta.** Jedyna ścieżka weryfikacji
   działająca bez konta czyta wyłącznie warstwę, którą kasuje pierwsza lepsza rekompresja.
   Warstwa przeżywająca przekształcenia jest wykrywalna tylko po zalogowaniu. Intuicyjny
   podział ról jest odwrócony.

## Profil odbiorcy

- Inżynierowie i technicy, którzy prowadzą projekty z agentami i muszą komuś odpowiedzieć
  na pytanie „skąd wiesz".
- Nie muszą znać AI Act i artykuł ich tego nie uczy. Regulacja jest **poligonem**, nie tematem.
- Znają pojęcie metadanych; nie muszą znać C2PA, XMP ani manifestu.
- Żargon peer-level dopuszczalny, ale reguły prostego polskiego obowiązują: definicja przy
  pierwszym użyciu, także dla terminów z keep-listy.

## Unikalny kąt / wartość

- **Dane, których nikt inny nie ma.** To nie jest kompilacja cudzych obserwacji, tylko zapis
  własnego pomiaru na dziewięciu kanałach, z datami i kontrolkami.
- **Uczciwość jako oś, nie jako ozdoba.** Artykuł opowiada trzy sytuacje, w których **nasz
  własny wniosek okazał się fałszywy** i został wycofany. To jest treść, nie przyznanie się.
- **Lekcja przenośna poza domenę.** Pięć reguł pomiaru działa tak samo przy testowaniu
  integracji, migracji danych i zachowań cudzego API. Czytelnik nie musi mieć nic wspólnego
  z oznaczaniem treści.
- **Kontra dla trybu pracy z agentem**, który brzmi pewnie i nie mierzy. Zdanie-oś do
  rozważenia w leadzie albo kickerze: *pewność agenta nie jest pomiarem*.

## Materiał faktyczny dopuszczony do publikacji

Liczby i fakty, które wolno podać. **Każdy z datą pomiaru** — w źródle wnioski odwracały się
dwukrotnie, więc fakt bez daty czyta się jako stan wieczysty i będzie nieprawdziwy.

| Fakt | Data pomiaru |
|---|---|
| PrestaShop: plik zwany „oryginałem" ma te same wymiary (3712×4608), piątą część wagi (1 146 413 B wobec 5 666 168 B) i zero metadanych | 2026-08-06, Presta 9 — 2026-08-22 |
| WooCommerce: próg 2560 px; poniżej progu plik idzie bajt w bajt, hash SHA-256 identyczny; powyżej powstaje wariant `-scaled` i to on wychodzi jako „pełny rozmiar" | 2026-08-06, powtórka 2026-08-22 |
| Meta oznacza post automatycznie, czyta manifest, **nie** czyta znaku wodnego; kontrolka bez znaczników nie dostała etykiety na żadnej z dwóch platform | 2026-08-06 |
| TikTok zachowuje nasz manifest i zagnieżdża go jako składnik rodzicielski pod własnym podpisem, deklarując transkodowanie; oba pliki walidują się jako poprawne | 2026-09-01 |
| YouTube oznacza post, ale serwuje plik zdjęty do zera | 2026-09-01 |
| Eksport z konsumenckiego edytora wideo: oznaczenie ginie w ośmiu przypadkach na osiem | 2026-08-31 |
| Jedyna publiczna ścieżka weryfikacji bez konta czyta wyłącznie warstwę kruchą; warstwa odporna wymaga zalogowania | 2026-08-05, domiar 2026-08-06 |
| Wniosek o TikToku z 31.08 wycofany 01.09 po domiarze po dobie | 2026-09-01 |

## Czego NIE publikować

⚠️ **To repozytorium jest publiczne.** Lista niżej jest z tego powodu podana **kategoriami,
bez przykładów** — wyliczenie konkretów opublikowałoby dokładnie to, czego zakazuje.
Rozwinięcie z nazwami żyje w prywatnej bazie wiedzy, w sekcji „Czego NIE publikować" wsadu
qamerowego. Przed pisaniem przeczytaj tamtą wersję.

Kategorie wykluczone z artykułu, także jako aluzja i jako „pewien klient":

- **Otwarte błędy produkcyjne** i wszystko, co pozwala je zlokalizować.
- **Postawa bezpieczeństwa infrastruktury** — ekspozycja usług, panele, konfiguracja hosta.
- **Cała warstwa certyfikatu i klucza podpisującego.** Kusząca metodycznie, ale spięta ze
  stanem procesu certyfikacji i z dokumentem bezpieczeństwa. **Pominąć w całości** — zysk
  narracyjny nie jest wart ujawnienia postawy bezpieczeństwa.
- **Stan procesów certyfikacyjnych** i jakiekolwiek terminy ich zamknięcia.
- **Warunki handlowe** — ceny, nazwy wystawców i dostawców, zestawienia dostawców z ich wadami.
- **Osoby** — imiona, nazwiska i role, po naszej stronie i po stronie kontrahentów.
- **Klienci** — nazwy firm, adresy sklepów i kart produktu użytych w pomiarach.
- **Wewnętrzna struktura pracy** — identyfikatory zadań, nazwy plików bazy wiedzy, ścieżki.

Sklepy i platformy opisujemy jako **klasy kanałów**. Nazwa oprogramowania sklepowego
(WooCommerce, PrestaShop, IdoSell) jest w porządku, bo dotyczy produktu na rynku; nazwa
sklepu klienta nie.

## Koncepty techniczne do pokrycia (z definicjami przy pierwszym użyciu)

C2PA, manifest, asercja, składnik rodzicielski, znak wodny, XMP, IPTC, EXIF, hash SHA-256,
kontener MP4, transkodowanie, rekompresja, pochodna (rendition), lista zaufania, packshot.

Pułapki nazewnicze:

- **„Znak wodny", nie „watermark"** w prozie. Termin nie jest widoczny w interfejsie, więc
  reguła UI go nie chroni.
- **„Pochodna", nie „rendition".**
- **„Awaryjnie" / „w razie braku", nigdy „fallback".** Brama słownikowa to łapie.
- **„Paczka", nie „bundle".**
- Nazwy pól i standardów (`XMP`, `IPTC`, `C2PA`, `SHA-256`) zostają po angielsku — czytelnik
  zobaczy je w narzędziu — ale każde dostaje definicję przy pierwszym użyciu.

## Wzorce stylu z istniejących artykułów

Przeczytane: `slabe-strony-claude-code.md` (id 31, najnowszy, wzorzec struktury i FAQ),
`srodowisko-agentowe-ai-dwie-firmy.md` (temat-sąsiad: to samo środowisko, w którym pomiar
powstał).

- Pierwsza osoba, geneza osobista w leadzie, potem problem → metoda → wnioski.
- Akapity 3-4 zdania; tabele do porównań; pogrubione liczby.
- Bez em dash, en dash i wielokropka Unicode. Polskie cudzysłowy „ " zostają.
- Bez AI-tells: zero „warto zauważyć", antytez na siłę, pustych wzmacniaczy.
  Maksymalnie jedna metafora na sekcję.
- FAQ: 4-6 pytań, każde w `<details open>` + `<summary>` obejmującym H3.
- Kolejność końcówki, potwierdzona na id 31: `## Kluczowe wnioski` → CTA (blok `<div>`
  z linkiem `/#contact`) → `## Przydatne zasoby` → `## FAQ`.

## Frontmatter (ustalenia)

- **id:** 32 (maksimum obecnie: 31, `slabe-strony-claude-code`)
- **slug:** `zmierzone-nie-zalozone` (krótki, dwuczłonowy; alternatywa do decyzji w plan:
  `pomiar-zamiast-zalozen`)
- **category:** `Code` — to tekst o metodzie inżynierskiej. Alternatywa `AI` do decyzji w plan
- **date:** ustalić w execute
- **readTime:** ~11 min przy planowanej objętości
- **image:** `/images/og-zmierzone-nie-zalozone.webp` (do wygenerowania)
- **lang:** `pl`
- **alternateSlug:** NIE ustawiać. PL-only na start, tłumaczenie osobnym krokiem
- Tagi-kandydaci: AI, Compliance, C2PA, Testowanie, Metodyka, AI Act

## Linki wewnętrzne (do wplecenia)

- `/blog/srodowisko-agentowe-ai-dwie-firmy` — środowisko, w którym ten pomiar powstał
- `/blog/system-agentow-ai-skills-rules-kontekst` — jak prowadzone są takie projekty
- `/blog/okf-standard-przenosnosc-bazy-wiedzy-ai` — opcjonalnie, przenośność zapisu ustaleń
- `https://qamera.ai/tools/verify-image` — narzędzie, w którym czytelnik sprawdzi własny plik
- **Artykuł biznesowy na blogu qamery** — jeden link, w ramie „co z tego wynika dla sklepu".
  Adres znany dopiero po publikacji tamtego. **Nie wstawiać w ciemno**; jeśli tamten jeszcze
  nie wyszedł, zostawić miejsce i domknąć przy publikacji.

## Przykłady kodu

Artykuł metodyczny, bez implementacji. Dopuszczalne dwa bloki `text`:

- porównanie hasha z manifestu z hashem bajtów eksportu jako ilustracja „dowód zamiast
  lektury kodu",
- fragment odczytu manifestu pokazujący składnik rodzicielski po transkodowaniu.

Oba w postaci uproszczonej, bez realnych identyfikatorów, certyfikatów i nazw wystawców.
Do decyzji w plan, czy w ogóle wchodzą — tekst broni się bez nich.

## Weryfikacja techniczna

- Fakty pochodzą z jednego pliku pomiarowego z datami i sekcją ograniczeń. Context7
  niepotrzebny: nie ma tu API ani wersji bibliotek do sprawdzenia.
- Przy każdej liczbie sprawdzić w źródle, czy nie została później skorygowana. W tym pliku
  dwa wnioski zostały odwrócone, a jeden zawężony — przepisanie starszej wersji jest realnym
  ryzykiem, nie teoretycznym.
- Nie cytować podstaw prawnych. Ten artykuł jest o metodzie; tezy prawne należą do tekstu
  qamerowego, gdzie mają bramę wymuszającą numer przepisu. Jeśli któraś jest potrzebna dla
  kontekstu, ograniczyć się do jednego zdania i nie formułować jej jako porady.

## Czego NIE robić

- **Nie pisać poradnika o AI Act.** Regulacja jest poligonem. Czytelnik ma wyjść z metodą,
  nie z listą obowiązków.
- **Nie ukrywać wycofanych wniosków.** One są treścią. Artykuł, który pokazuje wyłącznie
  trafne pomiary, uczy dokładnie odwrotnego nawyku niż zamierzony.
- **Nie robić recenzji platform.** WooCommerce nie jest „gorszy" — ma inny próg. Ton
  opisowy, nie oceniający.
- **Nie obiecywać kompletności.** Dwie platformy są na drugiej osi niezmierzone i to musi
  zostać w tekście.
- **Nie sprzedawać Qamery.** Jeden link do narzędzia i jeden do artykułu biznesowego.
  CTA zostaje standardowe, portfolio'owe.
