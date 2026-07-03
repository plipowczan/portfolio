---
slug: 3-pierwszy-ingest
order: 3
title: Pierwszy ingest
excerpt: Zamień surowe źródło w noty i indeksy komendą /ingest. To różnica między stertą plików a żywą wiki z cross-linkami i frontmatterem OKF.
video: /videos/kurs/3-pierwszy-ingest.webm
videoMp4: /videos/kurs/3-pierwszy-ingest.mp4
poster: /images/kurs/3-pierwszy-ingest-poster.webp
---

Cel tej lekcji: zamienić surowe źródło w noty i indeksy. Po lekcji umiesz dokarmiać bazę nowymi elementami.

## Wrzuć źródło i odpal `/ingest`

Wrzuć dowolne źródło do `content/_raw/inbox/` (jest gotowy `sample-source.md` na rozgrzewkę) i odpal **`/ingest`**. Tyle — komenda bierze wszystko, co leży w inboxie.

`/ingest` przyjmuje też linki YouTube jako argument (`/ingest https://youtu.be/…`) — pobiera transkrypt i traktuje go jak zwykłe źródło.

W przykładzie: surowe źródło to `sample-source.md` — luźny tekst o metodzie **Zettelkasten**. Ingest rusza, czyta plik, widzi pojedyncze źródło (brak klastra) i ustala temat oraz typ noty.

![Surowe źródło (sample-source.md o Zettelkasten) i ingest w akcji: czyta plik, brak klastra, ustala temat i typ](/images/kurs/3-pierwszy-ingest-02.webp)

## Co się dzieje pod spodem (4 fazy)

`/ingest` nie „wkleja pliku do wiki". Prowadzi źródło przez cztery fazy — trzy autonomiczne, jedna z jednym pytaniem do Ciebie.

### Faza 0 — Pobranie z YouTube (tylko dla URL)

Gdy podasz link YouTube, agent najpierw ściąga transkrypt (`yt-dlp`; przy braku napisów — fallback Whisper przez `ffmpeg`) i archiwizuje go w `content/_raw/processed/`. Dla zwykłych plików ta faza jest pomijana. Jeśli to samo wideo już ingestowałeś (ten sam `video_id`), agent nie pobiera drugi raz — dołoży do istniejącej noty.

### Faza 1 — Pre-scan (rozpoznanie)

Zanim cokolwiek utworzy, agent:

1. czyta `vault-map.md` — żeby wiedzieć, co w bazie już jest (nie duplikować),
2. listuje inbox (+ ewentualne źródła z Fazy 0),
3. **wykrywa klastry** — pliki o wspólnym temacie (≥2 wspólne, wyróżniające słowa w tytułach/treści). Jeśli coś się klastruje, dostajesz **jedno pytanie**: potraktować je jako osobne noty, czy jako notę-hub + dzieci z linkami.

To jedyny moment, w którym ingest Cię pyta — reszta idzie sama. Po co: żeby powiązane źródła (np. 5 plików o jednym produkcie) nie rozsypały się na oderwane noty bez wspólnego punktu.

### Faza 2 — Wykonanie (autonomiczne)

Dla każdego źródła agent po kolei:

1. **Klasyfikuje** — dobiera folder tematyczny i typ noty (`knowledge-note`, `tool`, `book-note`…) wg reguł z `CLAUDE.md`. Gdy nie jest pewny — daje najlepszy strzał + tag `#todo/classification`, żebyś dojrzał.
2. **Sprawdza pokrywanie** z `catalog.md`: jest podobna nota → **merge** (dokłada, nie nadpisuje Twojej treści); brak → **nowa nota** z szablonu z `content/templates/`.
3. **Wypełnia frontmatter**: `title`, `date`, `tags`, **`type`** (minimum OKF → przenośność + `/lint`), `source`, `summary` (jedna linia — to trafia do katalogu).
4. **Ujednolica język.** Baza trzyma jeden kanoniczny język (ten z onboardingu; przy konflikcie `CLAUDE.md`/Twoje ustawienia wygrywają nad domyślnym językiem skilla). Źródło w innym języku agent tłumaczy przy wsadzie; nazwy własne, kod, URL-e, daty i wikilinki zostają nietknięte.
5. **Rozstawia `[[wikilinki]]`** do pokrewnych not i **dopisuje backlinki** w tamtych notach — to zasila graf.
6. **Przenosi załączniki** (obrazki/PDF) do `content/ATTACHMENTS/` i poprawia odnośniki.
7. **Przenosi źródło** z `inbox/` do `_raw/processed/` (z datą). Pusty inbox = „zrobione".
8. **Aktualizuje 3 indeksy**: `catalog.md` (linia noty), `vault-map.md` (licznik + tagi + „recent changes"), `graph.md` (linki wychodzące + backlinki na celach).

Jedno źródło potrafi dotknąć kilkunastu not — bo dokłada linki i backlinki po całym grafie.

### Faza 3 — Kontrola (checklist)

Na koniec agent sprawdza sam siebie: czy `total_notes` się zgadza, czy nowe noty są w „recent changes", czy każda ma linię w `catalog.md`. Potem drukuje raport: ile źródeł, ile not powstało, ile scalono, stan indeksów (✅). Jak coś się nie zgadza — pokazuje rozbieżność, zanim powie „gotowe".

## Co dokładnie się zmienia (diff)

Po ingeście zajrzyj w Source Control — widzisz **na oczy, co się zmieniło**. Jedno źródło o Zettelkasten dotknęło **7 plików**:

![Diff po ingeście: nowa nota Zettelkasten.md, zaktualizowane indeksy i backlink w innej nocie](/images/kurs/3-pierwszy-ingest-01.webp)

- **Nowa nota** — `content/REFERENCE/Zettelkasten.md`: z frontmatterem, streszczeniem i wikilinkami.
- **Zaktualizowana inna nota** — `Wikilinks Explained.md` dostał **backlink**, bo nowa nota do niego linkuje (`[[Wikilinks Explained]]`), a graf jest dwukierunkowy.
- **Trzy indeksy** — `catalog.md`, `graph.md`, `vault-map.md` odświeżone.
- **Źródło** — `sample-source.md` zniknął z inboxu i wylądował w `_raw/processed/` (z datą). Nic nie kasujesz; jest odwracalne.

Raport na końcu: *1 źródło → 1 nowa nota, 0 scalonych, indeksy ✅, inbox pusty.* Jedno wiadomość: **pojedynczy plik wpiął się w graf i zaktualizował sąsiadów** — bez ingestu miałbyś tylko luźny plik w folderze.

## Surowe pliki vs wiki

To różnica „**surowe pliki vs wiki**": bez `/ingest` nie ma cross-linków ani indeksów — masz tylko stertę plików.

## Pułapki

- **Nie wrzucaj wszystkiego bez ingestu** — surowe pliki ≠ wiki (brak linków i indeksów).
- **Nie edytuj indeksów ręcznie** — buduje je ingest (i `/reindex`, lekcja 4). Ręczna edycja się rozjedzie.
- **Sprawdź `#todo/classification`** — jeśli agent nie był pewny folderu, oznaczy tak notę; dojrzyj ją.
- **Inbox po ingeście ma być pusty** — jak coś zostało, raport powie dlaczego (np. nieudany URL).
