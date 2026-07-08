---
slug: 3-pierwszy-ingest
order: 3
title: Pierwszy ingest
excerpt: Zamień surowe źródło w noty i indeksy komendą /ingest. To różnica między stertą plików a żywą wiki z linkami i frontmatterem OKF.
video: /videos/kurs/3-pierwszy-ingest.webm
videoMp4: /videos/kurs/3-pierwszy-ingest.mp4
poster: /images/kurs/3-pierwszy-ingest-poster.webp
---

Cel tej lekcji: zamienić surowe źródło w noty i indeksy. Po lekcji umiesz dokarmiać bazę nowymi elementami.

## Wrzuć źródło i odpal `/ingest`

Wrzuć dowolne źródło do `content/_raw/inbox/` (jest gotowy `sample-source.md` na rozgrzewkę) i odpal **`/ingest`**. Tyle - komenda bierze wszystko, co leży w inboxie.

`/ingest` przyjmuje też linki YouTube jako argument (`/ingest https://youtu.be/...`) - pobiera transkrypt (tekstowy zapis nagrania) i traktuje go jak zwykłe źródło.

W przykładzie: surowe źródło to `sample-source.md` - luźny tekst o metodzie **Zettelkasten**. Ingest rusza, czyta plik, widzi pojedyncze źródło (brak klastra, czyli innych plików o tym samym temacie) i ustala temat oraz typ noty.

![Surowe źródło (sample-source.md o Zettelkasten) i ingest w akcji: czyta plik, brak klastra, ustala temat i typ](/images/kurs/3-pierwszy-ingest-02.webp)

## Co się dzieje pod spodem (4 fazy)

`/ingest` nie „wkleja pliku do wiki”. Prowadzi źródło przez cztery fazy - trzy autonomiczne, jedna z jednym pytaniem do Ciebie.

### Faza 0 - Pobranie z YouTube (tylko dla URL)

Gdy podasz link YouTube, agent najpierw ściąga transkrypt (`yt-dlp`; przy braku napisów - awaryjnie Whisper przez `ffmpeg`) i archiwizuje go w `content/_raw/processed/`. Dla zwykłych plików ta faza jest pomijana. Jeśli to samo wideo już wczytałeś (ten sam `video_id`), agent nie pobiera drugi raz - dołoży do istniejącej noty.

### Faza 1 - Wstępne rozpoznanie

Zanim cokolwiek utworzy, agent:

1. czyta `vault-map.md` - żeby wiedzieć, co w bazie już jest (nie duplikować),
2. listuje inbox (+ ewentualne źródła z Fazy 0),
3. **wykrywa klastry** - pliki o wspólnym temacie (≥2 wspólne, wyróżniające słowa w tytułach/treści). Jeśli pliki układają się w grupę, dostajesz **jedno pytanie**: potraktować je jako osobne noty, czy jako notę nadrzędną + noty-dzieci z linkami.

To jedyny moment, w którym ingest Cię pyta - reszta idzie sama. Po co: żeby powiązane źródła (np. 5 plików o jednym produkcie) nie rozsypały się na oderwane noty bez wspólnego punktu.

### Faza 2 - Wykonanie (autonomiczne)

Dla każdego źródła agent po kolei:

1. **Klasyfikuje** - dobiera folder tematyczny i typ noty (`knowledge-note`, `tool`, `book-note`...) wg reguł z `CLAUDE.md`. Gdy nie jest pewny - daje najlepszy strzał + tag `#todo/classification`, żebyś to przejrzał.
2. **Sprawdza pokrywanie** z `catalog.md`: jest podobna nota → **scalenie** (dokłada, nie nadpisuje Twojej treści); brak → **nowa nota** z szablonu z `content/templates/`.
3. **Wypełnia frontmatter** (blok metadanych na początku pliku): `title`, `date`, `tags`, **`type`** (minimum OKF, standardu przenośnych baz wiedzy → przenośność + `/lint`), `source`, `summary` (jedna linia - to trafia do katalogu).
4. **Ujednolica język.** Baza trzyma jeden kanoniczny język (ten z onboardingu; przy konflikcie `CLAUDE.md`/Twoje ustawienia wygrywają nad domyślnym językiem skilla). Źródło w innym języku agent tłumaczy przy wsadzie; nazwy własne, kod, URL-e, daty i wikilinki zostają nietknięte.
5. **Rozstawia `[[wikilinki]]`** (linki między notami zapisywane w podwójnych nawiasach) do pokrewnych not i **dopisuje linki zwrotne** w tamtych notach - to zasila graf.
6. **Przenosi załączniki** (obrazki/PDF) do `content/ATTACHMENTS/` i poprawia odnośniki.
7. **Przenosi źródło** z `inbox/` do `_raw/processed/` (z datą). Pusty inbox = „zrobione”.
8. **Aktualizuje 3 indeksy**: `catalog.md` (linia noty), `vault-map.md` (licznik + tagi + „recent changes”), `graph.md` (linki wychodzące + linki zwrotne na celach).

Jedno źródło potrafi dotknąć kilkunastu not - bo dokłada linki i linki zwrotne po całym grafie.

### Faza 3 - Kontrola (lista kontrolna)

Na koniec agent sprawdza sam siebie: czy `total_notes` się zgadza, czy nowe noty są w „recent changes”, czy każda ma linię w `catalog.md`. Potem drukuje raport: ile źródeł, ile not powstało, ile scalono, stan indeksów (✅). Jak coś się nie zgadza - pokazuje rozbieżność, zanim powie „gotowe”.

## Co dokładnie się zmienia (diff)

Po `/ingest` zajrzyj w Source Control - widzisz **na oczy, co się zmieniło**. Jedno źródło o Zettelkasten dotknęło **7 plików**:

![Diff po /ingest: nowa nota Zettelkasten.md, zaktualizowane indeksy i link zwrotny w innej nocie](/images/kurs/3-pierwszy-ingest-01.webp)

- **Nowa nota** - `content/REFERENCE/Zettelkasten.md`: z frontmatterem, streszczeniem i wikilinkami.
- **Zaktualizowana inna nota** - `Wikilinks Explained.md` dostał **link zwrotny**, bo nowa nota do niego linkuje (`[[Wikilinks Explained]]`), a graf jest dwukierunkowy.
- **Trzy indeksy** - `catalog.md`, `graph.md`, `vault-map.md` odświeżone.
- **Źródło** - `sample-source.md` zniknął z inboxu i wylądował w `_raw/processed/` (z datą). Nic nie kasujesz; jest odwracalne.

Raport na końcu: _1 źródło → 1 nowa nota, 0 scalonych, indeksy ✅, inbox pusty._ Jeden wniosek: **pojedynczy plik wpiął się w graf i zaktualizował sąsiadów** - bez `/ingest` miałbyś tylko luźny plik w folderze.

## Surowe pliki vs wiki

To różnica „**surowe pliki vs wiki**”: bez `/ingest` nie ma linków ani indeksów - masz tylko stertę plików.

## Pułapki

- **Nie wrzucaj wszystkiego bez `/ingest`** - surowe pliki ≠ wiki (brak linków i indeksów).
- **Nie edytuj indeksów ręcznie** - buduje je ingest (i `/reindex`, lekcja 4). Ręczna edycja się rozjedzie.
- **Sprawdź `#todo/classification`** - jeśli agent nie był pewny folderu, oznaczy tak notę; przejrzyj ją.
- **Inbox po `/ingest` ma być pusty** - jak coś zostało, raport powie dlaczego (np. nieudany URL).

## FAQ

### Czym `/ingest` różni się od zwykłego wrzucenia pliku do folderu?

Wrzucony plik to luźny plik - bez frontmatteru, linków i wpisu w indeksie. `/ingest` klasyfikuje źródło, dobiera typ noty, wypełnia frontmatter OKF, rozstawia `[[wikilinki]]` i linki zwrotne, archiwizuje źródło i aktualizuje trzy indeksy. To różnica między stertą plików a żywą wiki.

### Co bierze `/ingest` - tylko wskazany plik?

Bierze **wszystko, co leży w `content/_raw/inbox/`** - nie podajesz nazwy pliku. Możesz też podać link YouTube jako argument (`/ingest https://youtu.be/...`); agent ściągnie transkrypt (`yt-dlp`, w razie braku napisów awaryjnie przez Whisper/`ffmpeg`) i potraktuje go jak zwykłe źródło.

### Czy ingest nadpisze albo skasuje moje istniejące noty?

Nie. Gdy w `catalog.md` znajdzie podobną notę, robi **scalenie** - dokłada treść, nie nadpisuje Twojej. Gdy podobnej nie ma, tworzy nową notę z szablonu. Źródło nie znika - wędruje z `inbox/` do `_raw/processed/` (z datą), więc wszystko jest odwracalne.

### W jakim języku powstaną noty, jeśli źródło jest po angielsku, a baza po polsku?

Baza trzyma **jeden kanoniczny język** ustalony przy onboardingu, a przy konflikcie `CLAUDE.md` / Twoje ustawienia wygrywają nad domyślnym językiem skilla. Źródło w innym języku agent tłumaczy przy wsadzie. Nazwy własne, kod, URL-e, daty i wikilinki zostają nietknięte.

### Skąd wiem, że ingest zrobił wszystko poprawnie?

Faza 3 to lista kontrolna: czy `total_notes` się zgadza, czy nowe noty są w „recent changes”, czy każda ma linię w `catalog.md`. Na koniec dostajesz raport (ile źródeł, ile not powstało, ile scalono, stan indeksów). Dodatkowo zajrzyj w Source Control - zobaczysz na oczy pełny diff.

### Jedno źródło zmieniło kilkanaście plików - czy to normalne?

Tak. Nowa nota dokłada `[[wikilinki]]` do pokrewnych not, a do każdej z nich dopisuje **link zwrotny** - graf jest dwukierunkowy. Do tego dochodzą trzy indeksy i przeniesienie źródła. Dlatego jeden mały plik potrafi dotknąć kilkunastu not: właśnie wpina się w graf i aktualizuje sąsiadów.
