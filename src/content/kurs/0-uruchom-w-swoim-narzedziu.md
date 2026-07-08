---
slug: 0-uruchom-w-swoim-narzedziu
order: 0.3
title: Uruchom w swoim narzędziu
excerpt: Gdzie i jak odpalić szablon bez terminala i bez komend gita. Lista narzędzi z asystentem AI, jak wołać komendy, jak zapisać zmiany i jak pobrać przez ZIP.
---

Cel tej lekcji: pokazać, gdzie i jak to odpalić - bez terminala (czarnego okna z poleceniami) i bez komend gita. Po lekcji wiesz, że działa w Twoim narzędziu, jak wołać komendy, jak zapisać zmiany bez gita i jak pobrać szablon bez gita.

## Jeden warunek, reszta to szczegóły

Wystarczy narzędzie, w którym **asystent AI ma dostęp do Twoich plików**. Asystent AI to program, który czyta Twoje pliki i sam wykonuje zadania. Jak ma dostęp - działasz. Nie musisz używać terminala. Nie musisz pisać komend gita.

## Gdzie to działa

W każdym z tych narzędzi wpisujesz polecenia w oknie czatu asystenta:

- **Claude Code** - narzędzie, na którym powstał kurs.
- **Claude Desktop** (zakładka „Code") - to samo, ale w aplikacji z okienkami, bez terminala.
- **GitHub Copilot** (w edytorze VS Code) - bardzo popularny.
- **Codex** - wielu użytkowników pracuje właśnie na nim.
- **Cursor** i **Antigravity** - edytory z asystentem w bocznym panelu (jeden z użytkowników prowadzi na tym cały kurs).

## Jak wołasz komendy

Komenda to skrót, który uruchamia gotowe zadanie. W Claude Code i Claude Desktop (Code) piszesz wprost `/onboard`, `/ingest`. W pozostałych narzędziach albo tak samo w czacie, albo prosisz zwykłym zdaniem: *„wykonaj instrukcje z pliku `.claude/commands/ingest.md`"*. Efekt ten sam - bo te komendy to po prostu pliki z instrukcjami, które asystent czyta.

## Zapis bez komend gita - trzy drogi

Git to narzędzie, które zapisuje historię zmian w plikach. Nie musisz znać jego komend. Masz trzy drogi:

1. Powiedz asystentowi: *„zapisz zmiany"* - zrobi to za Ciebie.
2. Kliknij przyciski w panelu. Narzędzia oparte na edytorze VS Code (Copilot, Cursor, Antigravity) mają gotowy panel z guzikami.
3. W trybie chmury asystent sam przygotuje zmiany do zatwierdzenia jednym kliknięciem.

## Nie chcesz w ogóle gita na start?

Wejdź na stronę szablonu na GitHub: [github.com/plipowczan/second-brain-template](https://github.com/plipowczan/second-brain-template). Kliknij zielony przycisk **„Code" → „Download ZIP"**, rozpakuj folder i otwórz go w swoim narzędziu. Tyle.

## Uczciwa granica

Jedyne, co NIE zadziała, to zwykła aplikacja-czat **bez dostępu do Twoich plików**. Wtedy albo wybierz jedno z narzędzi wyżej, albo podłącz do niej folder - ale to już bardziej techniczne i na start niepotrzebne.

Gotowe? W następnej lekcji zakładasz katalog z szablonu i ruszamy z praktyką.
