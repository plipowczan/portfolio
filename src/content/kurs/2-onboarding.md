---
slug: 2-onboarding
order: 2
title: Onboarding
excerpt: Jeden wywiad /onboard konfiguruje całą bazę — schema, foldery tematów i indeksy generują się same. To Twój dzień zerowy, jedyny moment konfiguracji.
---

Cel tej lekcji: skonfigurować całą bazę jednym wywiadem. Po lekcji masz wygenerowaną schema, foldery tematów i indeksy.

## Odpal `/onboard`

Kreator wykrywa świeży klon (po obecności `CLAUDE.template.md`) i prowadzi **wywiad — jedno pytanie na raz**: nazwa bazy i właściciel, język, tematy/domeny (Twoje top-level foldery, np. `AI`, `BUSINESS`, `HEALTH`), typy not, „głos" (osoba/formalność/emoji w nagłówkach), gałąź główna.

## Co generuje się samo

Na końcu kreator **generuje z szablonów**:

- `CLAUDE.md` + `AGENTS.md` + `WRITING_STYLE.md` (warstwa schema),
- tworzy foldery tematów,
- przycina szablony not do wybranych typów,
- proponuje usunięcie `REFERENCE/` i `sample-source.md` (albo zostawia jako tutorial),
- przebudowuje indeksy.

## Idempotencja

Stan odpowiedzi zapisuje w `.kb-onboard.json` → **idempotentne**, można później `reconfigure`.

## Dzień zerowy

To Twój „**dzień zerowy**" — jedyny moment konfiguracji. Potem już tylko używasz.
