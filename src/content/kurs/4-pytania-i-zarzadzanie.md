---
slug: 4-pytania-i-zarzadzanie
order: 4
title: Pytania i zarządzanie
excerpt: Pytaj bazę, nie czat — /qa z cytowaniami, /lint i /reindex do utrzymania jakości. Pełna ściąga komend, zasady jakości i anty-wzorce.
video: /videos/kurs/4-pytania-i-zarzadzanie.webm
videoMp4: /videos/kurs/4-pytania-i-zarzadzanie.mp4
poster: /images/kurs/4-pytania-i-zarzadzanie-poster.webp
---

Cel tej lekcji: pytać bazę (nie czat) i utrzymywać jakość. Po lekcji umiesz `/qa`, `/lint`, `/reindex` i rozróżniasz `qa` vs `research`.

Onboarding (L2) i ingest (L3) masz za sobą — baza żyje. Teraz ją **używasz**: pytasz i pilnujesz jakości. Wszystkie komendy siedzą w `.claude/commands/`.

![Komendy zarządzania bazą w .claude/commands/ i start /lint w terminalu](/images/kurs/4-pytania-i-zarzadzanie-01.webp)

## `/qa` — pytaj bazę, nie czat

`/qa "twoje pytanie"` to sedno. Agent nie zgaduje — **czyta bazę** przez progressive disclosure: `vault-map` → `catalog` → `graph` → otwiera **tylko trafne noty** → syntetyzuje odpowiedź **z `[[cytowaniami]]`** i **oznacza luki**, gdzie baza milczy.

Różnicę wobec czatu najlepiej widać, gdy pytasz o coś, **czego w bazie nie ma**. Zapytaj `/qa OKF` na bazie o samych notatkach o notowaniu:

![/qa o OKF — brak pokrycia: baza mówi „nie mam tego", nie zmyśla](/images/kurs/4-pytania-i-zarzadzanie-05.webp)

Baza sprawdza wszystkie noty, widzi **zero pokrycia** i mówi wprost: *„nie zmyślam odpowiedzi"*. Zamiast halucynacji dostajesz uczciwe „nie mam" + co dalej (`/ingest`, web research, `/gaps`). **Czat zgaduje; baza cytuje albo przyznaje, że nie wie.**

Teraz to samo dla tematu, który **jest** w bazie — `/qa` o Zettelkasten:

![/qa o Zettelkasten — synteza z cytowaniami źródeł, oznaczone luki i follow-upy](/images/kurs/4-pytania-i-zarzadzanie-06.webp)

Dostajesz syntezę z **cytowaniami** (`[[Zettelkasten]]`, `[[Wikilinks Explained]]`, `[[Example Note]]`), listę **luk** (czego bazie brakuje) i trzy follow-upy: zapis do `_outputs/answers/`, `/compile`, `/enhance`. Odpowiedź jest osadzona w **Twojej** wiedzy, nie w treningu modelu.

## `/compile` i `/enhance` — z odpowiedzi w trwałą notę

`/qa` daje odpowiedź; te dwie komendy zamieniają ją w **trwały** kawałek bazy:

- **`/compile <temat>`** — składa **nową notę zbiorczą / artykuł** z wielu istniejących not (synteza wyższego rzędu). Dobre, gdy materiał jest rozsypany po notach i chcesz go spiąć w jedno.
- **`/enhance <nota>`** — **poprawia/rozbudowuje jedną notę**: dokłada sekcje, wikilinki, łata luki wskazane przez `/qa` lub `/lint`.

W skrócie: `/compile` **tworzy** syntezę z wielu źródeł, `/enhance` **ulepsza** pojedynczą notę.

## `/lint` — health-check

Baza po cichu gnije: martwe linki, sieroty, niespójne tagi, przeterminowane noty. `/lint` to audyt — sprawdza **10 klas problemów** i zapisuje raport do `_outputs/reports/`.

Zaczyna, jak każda operacja, od indeksów (progressive disclosure — nie skanuje całości na ślepo):

![/lint startuje: czyta indeksy zgodnie z Navigation Protocol](/images/kurs/4-pytania-i-zarzadzanie-02.webp)

Potem raportuje znaleziska po klasach — tu baza zdrowa, 3 drobne znaleziska:

![/lint — raport: 2 martwe linki, 1 brakujące połączenie, reszta czysta](/images/kurs/4-pytania-i-zarzadzanie-03.webp)

Raport ląduje jako nota w `_outputs/reports/`, z tabelą wszystkich 10 klas i licznikiem:

![Raport zdrowia bazy: tabela 10 klas problemów z liczbami](/images/kurs/4-pytania-i-zarzadzanie-04.webp)

Co sprawdza (10 klas): brakujący/niepełny frontmatter · zepsute wikilinki · sieroty · stuby · niespójne tagi · `#todo` · brak `summary` · brakujące połączenia semantyczne · treść stale (>1 rok bez review) · zgodność `type` z `CLAUDE.md`. Na koniec proponuje naprawę (tu: martwe linki → `/reindex`, brakujący link → `/enhance`). **Odpalaj co jakiś czas** — inaczej problemy się kumulują.

## `/reindex` — przebuduj indeksy

Gdy indeksy się rozjadą (ręczna edycja, przerwany ingest), `/reindex` **buduje je od zera** z not: `vault-map.md`, `catalog.md`, `graph.md`.

![/reindex — deterministyczny rebuild indeksów ze spot-checkiem liczb](/images/kurs/4-pytania-i-zarzadzanie-07.webp)

To **deterministyczny** rebuild: odtwarza indeksy z aktualnego stanu not i sprawdza liczby (`total_notes`, węzły, krawędzie). Ważne: jeśli problem siedzi w **skrypcie** (np. parser policzył `[[...]]` ze środka bloku kodu jako realny link), reindex go **nie naprawi** — wiernie odtworzy ten sam wynik. Wtedy fix idzie do skryptu, nie do danych. Reindex leczy rozjazd indeks↔noty, nie bugi parsera.

## `qa` vs `research` — czemu osobno

`/qa` odpowiada **z tego, co już masz**. Skille research **dokładają nową wiedzę z zewnątrz** i odkładają ją do bazy (compounding): `/research` (ukierunkowany), `/research-deep` (wieloźródłowy + weryfikacja), `/research-report` (research + raport), `/research-add-fields|items` (rozszerzanie list). Pointa: `qa` = czytasz bazę; `research` = baza rośnie.

## Pełna ściąga komend

| Komenda | Do czego |
|---|---|
| `/onboard` | Konfiguracja bazy |
| `/ingest` | Źródło → nota + indeksy |
| `/qa` | Pytanie → synteza z cytowaniami |
| `/compile` | Artykuł/nota zbiorcza z wielu źródeł |
| `/enhance` | Popraw/rozbuduj notę |
| `/lint` | Health-check jakości |
| `/reindex` | Przebuduj indeksy |
| `/gaps` | Znajdź luki / brakujące tematy |
| `/refactor` | Przebuduj strukturę/noty |
| `/output` | Wygeneruj raport/eksport |
| `/research*` | Autonomiczny research |

## Zasady jakości

- index-first / progressive disclosure (start od `vault-map`, nie skanuj całości),
- frontmatter z `type` (OKF, przenośność),
- aktualizuj indeksy po każdym zapisie,
- zgodność z OKF (`git clone` → masz),
- scrub przed dzieleniem (usuń wrażliwe + atrybucje).

## Anty-wzorce

Ręczne pisanie wiki · wrzucanie wszystkiego bez ingestu · olewanie `/lint` · skanowanie całego `content/` zamiast indeksów (pali tokeny).
