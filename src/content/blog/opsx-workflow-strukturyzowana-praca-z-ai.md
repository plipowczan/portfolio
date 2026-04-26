---
id: 19
slug: opsx-workflow-strukturyzowana-praca-z-ai
title: "OPSX Workflow - strukturyzowane podejście do pracy z AI coding assistants"
excerpt: "Jak przekształcić chaotyczne promptowanie w powtarzalny proces z artefaktami, zależnościami i iteracją."
category: Code
author: Pawel Lipowczan
date: 2026-02-05
readTime: 12 min
image: /images/og-opsx-workflow.webp
tags:
  - AI
  - Claude Code
  - OpenSpec
  - Workflow
  - Development
lang: pl
alternateSlug: opsx-workflow-structured-ai-work
---

# OPSX Workflow - strukturyzowane podejście do pracy z AI coding assistants

Większość programistów traktuje AI coding assistants jak szybszy Stack Overflow — wrzucasz pytanie, dostajesz odpowiedź, wracasz do kodu. Problem? Tracisz kontekst między sesjami, powtarzasz te same wyjaśnienia, a AI za każdym razem startuje od zera.

To **reaktywne podejście** działa przy małych zmianach. Gdy budujesz coś większego — feature wymagający zmian w kilku plikach, refactoring całego modułu, nowy system autoryzacji — chaos narasta. Zaczynasz od prompta, AI generuje kod, testujesz, coś nie działa, wracasz z kolejnym promptem, AI nie pamięta kontekstu z poprzedniej sesji.

Z własnego doświadczenia wiem, że legacy workflows dla AI development walczą z tym, jak praca naprawdę wygląda. Jesteś "w fazie planowania", potem "w fazie implementacji", potem "done". Ale prawdziwa praca tak nie działa. Implementujesz coś, orientujesz się że design był błędny, musisz zaktualizować specs, kontynuujesz implementację. Liniowe fazy walczą z rzeczywistością.

**OPSX** rozwiązuje ten problem. To fluid, iterative workflow dla OpenSpec — zamiast sztywnych faz dostajesz actions, które możesz wykonywać w dowolnej kolejności.

## Co to jest OPSX i dlaczego powstało

**OPSX** to standardowy workflow dla OpenSpec. Zamiast jednej wielkiej komendy która tworzy wszystko naraz, masz zestaw actions do użycia kiedy ich potrzebujesz.

Legacy workflow OpenSpec działa, ale jest zablokowany:

1. **Instrukcje hardcoded w TypeScript** — zagrzebane w kodzie, nie możesz ich zmienić
2. **All-or-nothing approach** — jedna komenda tworzy wszystko, nie możesz testować pojedynczych kawałków
3. **Brak customizacji** — ten sam workflow dla wszystkich, bez możliwości dostosowania
4. **Black box przy złych outputach** — gdy AI generuje słaby output, nie możesz poprawić promptów

OPSX to otwiera. Teraz każdy może eksperymentować z instrukcjami, testować granularnie każdy artefakt, customizować workflows i iterować szybko bez rebuild.

```text
Legacy workflow:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded in package  │           │  schema.yaml           │◄── You edit this
│  (can't change)        │           │  templates/*.md        │◄── Or this
│        ↓               │           │        ↓               │
│  Wait for new release  │           │  Instant effect        │
│        ↓               │           │        ↓               │
│  Hope it's better      │           │  Test it yourself      │
└────────────────────────┘           └────────────────────────┘
```

**Kluczowa różnica:** OPSX to **actions, nie phases**. Rób co potrzebujesz, kiedy potrzebujesz.

## Komendy OPSX - przegląd

OPSX daje Ci zestaw komend do różnych momentów pracy. Nie ma przymusu używania ich w określonej kolejności — to toolkit, nie checklist.

| Komenda | Co robi |
|---------|---------|
| `/opsx:explore` | Myślenie, badanie problemu, porównywanie opcji |
| `/opsx:new` | Start nowej zmiany |
| `/opsx:continue` | Tworzenie kolejnego artefaktu (na podstawie zależności) |
| `/opsx:ff` | Fast-forward — wszystkie planning artifacts naraz |
| `/opsx:apply` | Implementacja tasks |
| `/opsx:sync` | Synchronizacja delta specs do main |
| `/opsx:archive` | Archiwizacja po zakończeniu |

Typowy flow wygląda tak:

```text
# Eksploracja pomysłu
/opsx:explore

# Start nowej zmiany
/opsx:new

# Iteracyjne tworzenie artefaktów
/opsx:continue  # powtórz aż wszystko gotowe

# Implementacja
/opsx:apply
```

**Pro tip:** Użyj `/opsx:ff` gdy masz jasny obraz tego co chcesz zbudować. `/opsx:continue` jest lepszy przy eksploracji, gdy chcesz iterować po jednym artefakcie naraz.

## Jak działa OPSX - architektura artefaktów

Pod spodem OPSX używa **Directed Acyclic Graph (DAG)** do zarządzania artefaktami. Brzmi skomplikowanie, ale koncept jest prosty: artefakty mają zależności które muszą być spełnione zanim można je utworzyć.

```text
                              proposal
                             (root node)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (requires:                  (requires:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requires:
                           specs, design)
```

Każdy artefakt może być w jednym z trzech stanów:

```text
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

**Kluczowe koncepty:**

- **Dependencies są enablers, nie gates** — pokazują co jest możliwe, nie co wymagane jako następne
- **Filesystem jako state** — istnienie pliku na dysku = artefakt DONE
- **Topological ordering** — system wie co tworzyć dalej dzięki sortowaniu topologicznemu grafu

To oznacza że `/opsx:continue` zawsze wie który artefakt jest następny do utworzenia. Nie musisz pamiętać co już istnieje.

## Customizacja workflow - schematy i konfiguracja

OPSX pozwala definiować własne workflows przez **schematy**. Domyślny schemat `spec-driven` wygląda tak: proposal → specs → design → tasks. Ale możesz stworzyć własny.

**Przykład własnego schematu:**

```yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

Ten schemat dodaje `research` przed `proposal` — przydatne gdy pracujesz nad czymś co wymaga zbadania przed commitment do konkretnego rozwiązania.

**Konfiguracja projektu** pozwala wstrzyknąć context do wszystkich artefaktów:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
```

**Context injection** sprawia że AI zna konwencje twojego projektu. Zamiast powtarzać "używamy TypeScript, REST API, Vitest" w każdym promcie, definiujesz to raz w configu.

## Kiedy aktualizować istniejącą zmianę vs zacząć nową

Możesz zawsze edytować proposal lub specs przed implementacją. Ale kiedy refinement staje się "to już inna praca"?

**Proposal definiuje trzy rzeczy:**
1. **Intent** — Jaki problem rozwiązujesz?
2. **Scope** — Co jest in/out of bounds?
3. **Approach** — Jak zamierzasz to rozwiązać?

```text
                        ┌─────────────────────────────────────┐
                        │     Czy to ta sama praca?           │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Same intent?      >50% overlap?      Można zamknąć
             Same problem?     Same scope?        oryginalną zmianę?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         TAK               NIE TAK          NIE NIE             TAK
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       UPDATE            NOWA  UPDATE      NOWA  UPDATE        NOWA
```

| Test | Aktualizuj | Nowa zmiana |
|------|------------|-------------|
| **Tożsamość** | "To samo, dopracowane" | "Inna praca" |
| **Overlap scope** | >50% pokrycia | <50% pokrycia |
| **Zamknięcie** | Nie można bez zmian | Można zamknąć, nowa stoi samodzielnie |

> **Update zachowuje kontekst. Nowa zmiana daje klarowność.**

Pomyśl o tym jak o git branches — commituj dopóki pracujesz nad tym samym feature, zacznij nowy branch gdy to genuinely nowa praca.

## Jak zacząć z OPSX

Setup jest prosty:

```bash
# Instalacja
openspec init

# Sprawdzenie dostępnych schematów
openspec schemas

# Status aktywnych zmian
openspec status
```

`openspec init` tworzy skills w `.claude/skills/` które AI coding assistants automatycznie wykrywają.

**Typowy workflow od zera:**

```text
1. /opsx:explore    → przemyśl pomysł
2. /opsx:new        → zacznij zmianę
3. /opsx:continue   → stwórz proposal
4. /opsx:continue   → stwórz specs
5. /opsx:continue   → stwórz design
6. /opsx:continue   → stwórz tasks
7. /opsx:apply      → implementuj
8. /opsx:archive    → zakończ
```

**Tips dla startu:**
- Użyj `/opsx:explore` przed commitment do zmiany — przemyśl opcje
- `/opsx:ff` gdy wiesz co chcesz, `/opsx:continue` przy eksploracji
- Podczas `/opsx:apply` — jeśli coś nie tak, edytuj artefakt i kontynuuj (brak phase gates!)

## Kluczowe wnioski

1. **OPSX to actions, nie phases** — rób co potrzebujesz, kiedy potrzebujesz
2. **Artefakty tworzą graf zależności** — system wie co jest ready do utworzenia
3. **Iteracja jest naturalna** — edytuj specs podczas implementacji, to nie bug to feature
4. **Schematy są customizable** — zdefiniuj własny workflow dopasowany do twojego procesu
5. **Context injection** — AI zna konwencje twojego projektu bez powtarzania w każdym promcie

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz wdrożyć OPSX w swoim zespole?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomagam zespołom przejść od chaotycznego promptowania do strukturyzowanego workflow z AI. Napisz, a ustalimy czy OPSX pasuje do waszego procesu.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Przydatne zasoby

- [OpenSpec GitHub](https://github.com/Fission-AI/openspec) — oficjalne repo projektu
- [OpenSpec Discord](https://discord.gg/YctCnvvshC) — community i feedback
- [5 technik pracy z Claude Code](/blog/5-technik-pracy-z-claude-code) — powiązany artykuł o AI coding
- [Second Brain z Obsidian i Claude Code](/blog/second-brain-obsidian-claude-code-skills) — jak zarządzać kontekstem i skills

## FAQ

<details open>
<summary>

### Czy OPSX działa tylko z Claude Code czy też z Cursor i innymi AI coding assistants?

</summary>

OPSX generuje skills do `.claude/skills/` które są cross-editor compatible. Działa z Claude Code, Cursor, Windsurf i innymi asystentami wspierającymi format skills. Kluczowe jest że `openspec init` tworzy odpowiednie pliki dla każdego edytora automatycznie.

</details>

<details open>
<summary>

### Jaka jest różnica między komendą /opsx:continue a /opsx:ff i kiedy używać której?

</summary>

`/opsx:continue` tworzy jeden artefakt na raz, co jest idealne przy eksploracji gdy chcesz iterować i weryfikować każdy krok. `/opsx:ff` (fast-forward) tworzy wszystkie planning artifacts naraz. Użyj `ff` gdy masz jasny obraz tego co budujesz, `continue` gdy chcesz iterować i przemyśleć każdy artefakt osobno.

</details>

<details open>
<summary>

### Czy mogę stworzyć własny schemat OPSX dostosowany do workflow mojego zespołu?

</summary>

Tak, użyj `openspec schema init my-workflow` do stworzenia nowego schematu od zera lub `openspec schema fork spec-driven my-workflow` żeby zacząć od istniejącego. Schematy to pliki YAML w `openspec/schemas/` gdzie definiujesz artefakty, ich output i zależności między nimi.

</details>

<details open>
<summary>

### Jak OPSX radzi sobie z sytuacją gdy podczas implementacji okazuje się że design jest błędny?

</summary>

To jest core feature OPSX — po prostu edytujesz `design.md` bezpośrednio i kontynuujesz. `/opsx:apply` kontynuuje od miejsca gdzie skończyłeś. Brak "phase gates" oznacza że możesz wrócić do dowolnego artefaktu kiedy chcesz bez restartowania całego procesu.

</details>

<details open>
<summary>

### Czy potrzebuję zainstalowanego CLI openspec żeby używać komend OPSX w edytorze?

</summary>

Tak, skills (`/opsx:*`) wywołują CLI `openspec` w tle. Komendy slash to interface dla użytkownika, CLI to engine który wykonuje faktyczną pracę. Instalacja przez `npm install -g openspec` lub zgodnie z instrukcjami w repo projektu.

</details>
