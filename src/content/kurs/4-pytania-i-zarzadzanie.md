---
slug: 4-pytania-i-zarzadzanie
order: 4
title: Pytania i zarządzanie
excerpt: Pytaj bazę, nie czat — /qa z cytowaniami, /lint i /reindex do utrzymania jakości. Pełna ściąga komend, zasady jakości i anty-wzorce.
---

Cel tej lekcji: pytać bazę (nie czat) i utrzymywać jakość. Po lekcji umiesz `/qa`, `/lint`, `/reindex` i rozróżniasz `qa` vs `research`.

## `/qa` — pytanie do bazy

**`/qa "twoje pytanie"`** — agent czyta indeks → wchodzi **tylko w trafne noty** → syntetyzuje odpowiedź **z cytowaniami** (zapis do `_outputs/answers/`). Różnica „pytanie do **bazy**" vs „do czatu": czat zgaduje, baza cytuje to, co masz.

## `/lint` — health-check

**`/lint`** — health-check: sprzeczności, stale claims, sieroty, brakujące cross-linki, luki → raport do `_outputs/reports/`. Odpalaj co jakiś czas, inaczej baza po cichu gnije.

## `/reindex` — przebuduj indeksy

**`/reindex`** — przebuduj indeksy, gdy się rozjadą.

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
