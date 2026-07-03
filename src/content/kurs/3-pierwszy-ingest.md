---
slug: 3-pierwszy-ingest
order: 3
title: Pierwszy ingest
excerpt: Zamień surowe źródło w noty i indeksy komendą /ingest. To różnica między stertą plików a żywą wiki z cross-linkami i frontmatterem OKF.
---

Cel tej lekcji: zamienić surowe źródło w noty i indeksy. Po lekcji umiesz dokarmiać bazę nowymi elementami.

## Wrzuć źródło i odpal `/ingest`

Wrzuć dowolne źródło do `content/_raw/inbox/` (jest gotowy `sample-source.md` na rozgrzewkę) i odpal **`/ingest`**.

## 🤖 Gotowy prompt — ingest

Sam `/ingest` wystarczy (bierze wszystko z inboxu). Jeśli chcesz, żeby Claude Code od razu pokazał, co zrobił, wklej w sesji otwartej na **swoim repo bazy**:

```text
Przetwórz pliki z content/_raw/inbox/ skillem ingest: dla każdego źródła utwórz
notę z frontmatterem (pole type wg OKF), rozstaw [[wikilinki]], zaktualizuj
wszystkie 3 indeksy (vault-map.md, catalog.md, graph.md) i przenieś źródło do
content/_raw/processed/. Na koniec wypisz: powstałe noty, dotknięte indeksy oraz
liczbę nowych linków.
```

## Co robi agent

Agent: czyta źródło → tworzy notę z **frontmatterem** (pole `type` — minimum wymagane przez OKF) → aktualizuje **wszystkie 3 indeksy** → przenosi źródło do `processed/`. Jedno źródło potrafi dotknąć kilkunastu not.

## Surowe pliki vs wiki

To różnica „**surowe pliki vs wiki**": bez `/ingest` nie ma cross-linków ani indeksów — masz tylko stertę plików.

## Pułapki

- Nie wrzucaj wszystkiego bez ingestu (surowe pliki ≠ wiki).
- Indeksy aktualizuj po każdym zapisie (ingest robi to sam — ale gdy edytujesz ręcznie, pamiętaj).
