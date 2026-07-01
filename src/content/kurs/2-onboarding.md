---
slug: 2-onboarding
order: 2
title: Onboarding
excerpt: Jeden wywiad /onboard konfiguruje całą bazę — schema, foldery tematów i indeksy generują się same. Krok po kroku, na konkretnym przykładzie. To Twój dzień zerowy.
---

Cel tej lekcji: przejść **cały onboarding krok po kroku** na konkretnym przykładzie. Po lekcji masz wygenerowaną schema (`CLAUDE.md`), foldery tematów i puste, ale gotowe indeksy — i wiesz dokładnie, co dzieje się pod spodem.

Prowadzę Cię przez przykład: **Anna** stawia bazę „Baza Anny" po polsku, na tematach `AI`, `BUSINESS`, `LIFE`. Twoje odpowiedzi będą inne — proces jest ten sam.

## Warunek startu

Onboarding odpalasz **raz**, na świeżym klonie. Kreator rozpoznaje świeży klon po obecności pliku `CLAUDE.template.md` w repo. Otwórz folder w Claude Code i wpisz:

```text
/onboard
```

Jeśli `CLAUDE.template.md` już nie istnieje (baza była konfigurowana), kreator nie nadpisze niczego — zaproponuje **reconfigure** (patrz „Idempotencja" niżej).

## Faza 1 — Wywiad (jedno pytanie na raz)

Kreator zadaje **sześć pytań, pojedynczo**. Odpowiadasz normalnym tekstem. Poniżej pytania i przykładowe odpowiedzi Anny.

**1. Nazwa bazy i właściciel.**
> Baza Anny · Anna Kowalska

> 📸 *[screenshot: pytanie 1 — nazwa bazy i właściciel]*

**2. Główny język.** Język, w którym agent pisze noty i streszczenia.
> Polski

> 📸 *[screenshot: pytanie 2 — język]*

**3. Tematy / domeny.** Twoje foldery najwyższego poziomu — szerokie działy, nie szczegóły.
> AI, BUSINESS, LIFE

> 📸 *[screenshot: pytanie 3 — tematy]*

**4. Typy not.** Domyślnie: `basic-note`, `knowledge-note`, `tool`, `book-note`, `answer-note`. Możesz coś dodać lub usunąć.
> Zostawiam domyślne

**5. Głos.** Osoba (pierwsza osoba czy neutralnie), formalność i czy zostawić **emoji w nagłówkach**.
> Pierwsza osoba, bezpośredni i praktyczny, emoji: tak

> 📸 *[screenshot: pytanie 5 — głos]*

**6. Główna gałąź.** Domyślnie `main`.
> main

## Faza 2 — Sprawdzenie zależności (nieblokujące)

Kreator sprawdza narzędzia i drukuje tabelkę ✅/⚠️ — **nie przerywa**, tylko ostrzega:

| Narzędzie | Do czego | Wymagane? |
|---|---|---|
| `python --version` | reindex / lint / render | tak |
| `yt-dlp --version` | ingest z YouTube | opcjonalnie |
| `ffmpeg -version` | fallback transkrypcji (Whisper) | opcjonalnie |

Brak `yt-dlp`/`ffmpeg` to nie problem — dołożysz je, gdy będą potrzebne.

## Faza 3 — Generowanie (deterministyczne)

Tu kreator działa sam, na podstawie Twoich odpowiedzi:

**1. Zapisuje odpowiedzi** do `.kb-onboard.json` w korzeniu repo:

```json
{
  "KB_NAME": "Baza Anny",
  "KB_OWNER": "Anna Kowalska",
  "PRIMARY_LANGUAGE": "Polish",
  "MAIN_BRANCH": "main",
  "VOICE_PERSON": "first-person",
  "VOICE_FORMALITY": "bezpośredni i praktyczny",
  "NOTE_TYPES": "basic-note | knowledge-note | tool | book-note | answer-note",
  "emoji_headings": true,
  "TOPIC_TABLE": "| `/content/AI/` | Narzędzia i wiedza o AI i agentach | Yes |\n| `/content/BUSINESS/` | Sprzedaż, marketing, procesy | Yes |\n| `/content/LIFE/` | Zdrowie, książki, nawyki | Yes |"
}
```

**2. Renderuje trzy pliki schematu** z szablonów (skryptem `render.py`):
- `CLAUDE.md` — schema bazy (dla Claude Code),
- `AGENTS.md` — ten sam kontrakt dla innych agentów,
- `content/WRITING_STYLE.md` — Twój głos (osoba, formalność, emoji).

**3. Kasuje szablony** (`CLAUDE.template.md`, `AGENTS.template.md`, `content/WRITING_STYLE.template.md`) — dopiero gdy wszystkie trzy renderowania się powiodą.

**4. Tworzy foldery tematów** pod `content/` (każdy z `.gitkeep`, żeby był śledzony w gicie).

**5. Proponuje usunięcie** przykładów: `content/REFERENCE/` i `content/_raw/inbox/sample-source.md` — zostawić jako tutorial czy skasować (Twój wybór).

**6. Przycina szablony not** w `content/templates/` do wybranych typów (np. usuwa `book.md`, jeśli odrzuciłeś `book-note`).

**7. Przebudowuje indeksy**, żeby pasowały do nowej struktury (`build_indexes.py`).

Po tej fazie repo Anny wygląda tak:

```text
content/
  AI/         .gitkeep
  BUSINESS/   .gitkeep
  LIFE/       .gitkeep
  _indexes/   vault-map.md · catalog.md · graph.md   (puste, przebudowane)
  templates/  (przycięte do wybranych typów)
CLAUDE.md                 ← wygenerowany (schema Twojej bazy)
AGENTS.md                 ← wygenerowany
content/WRITING_STYLE.md  ← wygenerowany (Twój głos)
```

Szablony `*.template.md` zniknęły — to znak, że baza jest zainicjalizowana.

> 📸 *[screenshot: podsumowanie Fazy 3 — utworzone foldery i pliki]*

## Faza 4 — Handoff

Na koniec kreator drukuje krótkie „co teraz":
- wrzuć plik do `content/_raw/inbox/` i odpal `/ingest` (lekcja 3),
- zadaj pytanie przez `/qa` (lekcja 4),
- odpal `/lint` na health-check (lekcja 4).

## Idempotencja

Odpowiedzi siedzą w `.kb-onboard.json`. Gdy odpalisz `/onboard` ponownie na już skonfigurowanej bazie (brak `CLAUDE.template.md`), kreator **nie nadpisze niczego po cichu** — zaproponuje **reconfigure**: wczyta `.kb-onboard.json`, pozwoli poprawić odpowiedzi i przegeneruje pliki, ostrzegając przed nadpisaniem istniejących.

## Dzień zerowy

To Twój „**dzień zerowy**" — jedyny moment konfiguracji. Potem już tylko używasz: `/ingest`, `/qa`, `/lint`. Przechodzimy do karmienia bazy w lekcji 3.
