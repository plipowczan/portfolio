---
id: 10
slug: 5-technik-pracy-z-claude-code
title: "5 technik które zmienią sposób pracy z Claude Code"
excerpt: "Większość programistów wykorzystuje zaledwie 20% potencjału Claude Code. Poznaj 5 zaawansowanych technik używanych przez najlepszych inżynierów AI."
category: AI
author: Pawel Lipowczan
date: 2026-01-09
readTime: 14 min
image: /images/og-5-technik-pracy-z-claude-code.webp
tags:
  - AI
  - Claude Code
  - Automatyzacja
  - Developer Tools
  - PIV Methodology
---

Istnieje bardzo duże prawdopodobieństwo, że zostawiasz większość potencjału swojego asystenta kodowania AI na stole. Gdy zaczynałem pracę z Claude Code przy budowie tego portfolio, robiłem dokładnie to samo – wpisywałem proste prompty, otrzymywałem kod, czasami działał, czasami nie. Reaktywne promptowanie. Bez systemu.

Potem odkryłem, że najlepsi inżynierowie AI pracują zupełnie inaczej. Mają **system**. Wykorzystują metodologie, które sprawiają, że ich agenci kodowania stają się coraz potężniejsi z każdą iteracją.

W tym artykule pokażę Ci 5 konkretnych technik, które całkowicie zmieniają sposób pracy z Claude Code. To nie są teoretyczne koncepcje – to praktyczne metody używane przez zespoły, które budują produkcyjne aplikacje z pomocą AI. A najlepsze jest to, że wszystkie te techniki są już spakowane w gotowy do użycia framework, który możesz wdrożyć w swoim projekcie jeszcze dziś.

## PRD-first development: Gwiazda polarna Twojego projektu

Większość programistów po prostu nurkuje w kod. Otwierają Claude Code i zaczynają: "Dodaj przycisk logowania", "Zrób walidację formularza", "Napraw ten bug". Każda iteracja jest odseparowana od poprzedniej. Nie ma wizji całości.

**PRD (Product Requirement Document)** w kontekście pracy z AI to coś znacznie prostszego niż korporacyjny dokument na 50 stron. To po prostu **markdown z pełnym zakresem projektu**. Pojedynczy plik, który staje się gwiazdą polarną dla każdej feature'ki, którą budujesz.

### Zalety PRD-first development

Wcześniej korzystałem z asystenta, który generował PRD oraz rules dla agenta AI, ale to wymagało korzystania z dwóch różnych narzędzi. Musiałem przełączać się między kontekstami, synchronizować informacje ręcznie. To było frustrujące.

Teraz? Wszystko w jednym miejscu. PRD żyje w moim repozytorium. Claude Code czyta go na początku każdej sesji. I nagle wszystko ma sens.

### Jak to wygląda w praktyce

Dla nowych projektów (greenfield development), PRD zawiera:

- **Target Users** - dla kogo budujesz
- **Mission** - co ma robić ten produkt
- **In Scope / Out of Scope** - co jest w MVP, a co na później
- **Architecture** - high-level tech stack i struktura

Dla istniejących projektów (brownfield), PRD dokumentuje:

- **Co już mamy** - obecny stan systemu
- **Co budujemy dalej** - kolejne feature'ki w pipeline
- **Długoterminowa wizja** - gdzie zmierzamy

Przykładowa minimalna struktura PRD:

```markdown
# PRD: Habit Tracker Application

## Target Users

Osoby chcące budować lepsze nawyki przez konsekwentne trackowanie

## Mission

Prosta, elegancka aplikacja do śledzenia nawyków z wizualizacją postępów

## In Scope (MVP)

- Tworzenie nawyków z nazwą i częstotliwością
- Zaznaczanie wykonania nawyku dziennie
- Kalendarz pokazujący historię (streak tracking)
- Lokalne przechowywanie danych

## Out of Scope (v1)

- Współdzielenie z innymi użytkownikami
- Zaawansowane statystyki
- Powiadomienia push
- Integracje z innymi aplikacjami

## Architecture

- Frontend: React + TypeScript
- State: React Context
- Storage: localStorage
- Deploy: Vercel
```

### Magiczne pytanie

Gdy masz PRD, możesz zaczynać każdą sesję od pytania, które zmienia wszystko:

> "Based on PRD, what should we build next?"

Claude Code czyta PRD, rozumie gdzie jesteś, co już zbudowałeś, i sugeruje kolejny logiczny krok. Nie musisz pamiętać. Nie musisz tłumaczyć kontekstu od nowa. **PRD pamięta za Ciebie**.

### Kluczowe korzyści

- **Single source of truth** - jedna definicja projektu dla całego zespołu (i dla AI)
- **Naturalna dekompozycja** - łatwo wyodrębniasz kolejne feature'ki do zaimplementowania
- **Context dla agenta** - Claude Code zawsze wie, nad czym pracujesz
- **Spojrzenie z lotu ptaka** - każda feature łączy się z większą wizją

PRD to fundament. Bez niego budujesz dom na piasku. Z nim - masz solidny fundament – każda linia kodu ma sens i kierunek.

## Modularność reguł: Lżejszy kontekst, mądrzejszy agent

Widziałem to dziesiątki razy. Programista tworzy `CLAUDE.md` albo `agents.md`, wrzuca tam wszystkie możliwe reguły, wytyczne, konwencje. Po dwóch miesiącach plik ma 1500 linijek. Ladowane jest to **na początku każdej rozmowy**.

Problem? **Przytłaczasz LLM nieistotnym kontekstem.**

### Problem długich reguł globalnych

Gdy pracujesz nad frontend'em, nie potrzebujesz znać wzorców projektowania API. Gdy pracujesz nad bazą danych, nie musisz mieć w kontekście konwencji nazewnictwa komponentów React. Ale jeśli wszystko jest w jednym pliku globalnych reguł? Claude Code ładuje to wszystko. Za każdym razem.

To marnowanie **okna kontekstu** - czegoś, co wielu programistów mocno niedocenia, a co jest absolutnie kluczowe dla jakości outputu agenta.

### Rozwiązanie: Architektura modularna

Zamiast jednego monstrualnego pliku, dzielisz reguły na dwie kategorie:

**1. Global rules (CLAUDE.md)** - maksymalnie lekkie, ~200 linijek

- Tech stack projektu
- Struktura folderów
- Komendy do uruchomienia (npm run dev, npm test)
- Strategia testowania (filozofia, nie szczegóły)
- Standardy logowania

**2. Reference folder** - szczegółowy kontekst ładowany tylko gdy potrzebny

- `reference/api-design.md` - wzorce REST API, error handling, ładowane tylko przy pracy nad API
- `reference/frontend-components.md` - component patterns, styling guidelines, tylko dla UI work
- `reference/database-patterns.md` - schema design, migrations, query optimization, tylko dla DB work
- `reference/testing-patterns.md` - szczegółowe przykłady testów, setup, mocking

### Jak to skonfigurować

W swoim głównym `CLAUDE.md` dodajesz sekcję reference:

```markdown
# CLAUDE.md

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS 3
- Vite 7

## Project Structure

src/
├── components/
├── pages/
├── utils/
└── data/

## Reference Documentation

When working on specific areas, consult these documents:

- **API endpoints**: `.claude/reference/api-design.md`
- **Frontend components**: `.claude/reference/frontend-components.md`
- **Database operations**: `.claude/reference/database-patterns.md`
- **Testing**: `.claude/reference/testing-patterns.md`
```

Claude Code jest wystarczająco inteligentny, żeby zrozumieć: "OK, pracuję teraz nad API endpoint'em, powinienem przeczytać api-design.md". I robi to automatycznie.

### Zalety modularności reguł

Posiadanie tego wszystkiego w jednym miejscu (jak w claude-piv-skeleton, o którym zaraz opowiem) vs. rozproszenie po różnych narzędziach to **ogromna różnica**. Wszystko jest w repo. Wszystko jest wersjonowane. Wszystko ewoluuje razem z projektem.

A najważniejsze? **Chronisz okno kontekstu** dla rzeczy, które naprawdę mają znaczenie podczas implementacji konkretnej feature'ki.

## Komendyfikacja: Skończ z powtarzaniem tych samych promptów

Jeśli wysyłasz ten sam prompt do swojego agenta kodowania więcej niż dwa razy, to krzyczący sygnał: **"Zamień mnie w komendę!"**

### Co to są komendy

Komendy to po prostu **pliki markdown, które definiują workflow**. Ładujesz je jako kontekst, a Claude Code wykonuje zdefiniowany proces krok po kroku. To jak makra dla promptów.

Nie wymaga to żadnych nowych narzędzi. To po prostu lepszy sposób organizacji pracy.

### Co warto skomendyfikować

Praktycznie wszystko, co robisz regularnie:

**Core workflow:**

- `/prime` - Załaduj kontekst projektu na początku sesji
- `/plan-feature` - Stwórz strukturalny plan implementacji feature'ki
- `/execute` - Zaimplementuj według planu
- `/validate` - Uruchom testy i zweryfikuj działanie

**Git operations:**

- `/commit` - Stwórz sensowny commit message na podstawie zmian
- `/review-pr` - Przeanalizuj pull request przed merge

**Maintenance:**

- `/update-docs` - Zaktualizuj dokumentację po zmianach w kodzie
- `/refactor` - Zrefaktoruj zgodnie z najlepszymi praktykami projektu

### Przykład: Komenda /prime

```markdown
# Command: /prime

Load codebase context to prepare for feature development work.

## Objective

Ensure Claude Code understands current project state before starting any development.

## Steps

1. Read PRD from `docs/PRD.md` to understand project scope and vision
2. Read architecture documentation from `docs/ARCHITECTURE.md`
3. Scan recent commits: `git log -10 --oneline` to see latest changes
4. List current todos from `docs/TODO.md` to understand priorities
5. Check git status to see any uncommitted work
6. Confirm context successfully loaded with summary of project state

## Expected Output

Brief summary including:

- Project name and current phase
- Last 3 features implemented
- Current priorities from TODO
- Any blockers or issues noted
```

Zamiast każdorazowo wypisywać: "Przeczytaj PRD, potem architecture, potem sprawdź co się ostatnio zmieniło..." - po prostu wywołujesz `/prime` i gotowe.

### Kluczowa obserwacja

Ponieważ asystent to praktycznie tylko prompt, można ten prompt wykorzystać jako command. To piękna właściwość markdown'owych komend – są przenośne, czytelne dla człowieka, i możesz je iteracyjnie ulepszać.

### Typowy workflow z komendami

Tak wygląda mój dzienny cykl pracy z Claude Code:

```text
/prime
↓
"Based on PRD, what should we build next?"
↓
/plan-feature "Add user authentication"
↓
[Context Reset - nowa konwersacja]
↓
/execute plan-auth.md
↓
/validate
↓
/commit
```

### Korzyści komendyfikacji

- **Konsystencja** - ten sam proces za każdym razem, zero pominięć kroków
- **Zero zapominania** - nie musisz pamiętać sekwencji, komenda pamięta
- **Onboarding** - nowy programista w zespole dostaje gotowe komendy i od razu działa produktywnie
- **Ciągłe ulepszanie** - komendy ewoluują, stają się lepsze z czasem

Oszczędzasz dosłownie **tysiące naciśnięć klawiszy** rocznie. A co ważniejsze - oszczędzasz energię mentalną na rzeczy, które naprawdę wymagają myślenia.

## Reset kontekstu: Najważniejszy krok którego nie robisz

To brzmi wbrew intuicji: **Zawsze resetuj konwersację między planowaniem a wykonaniem.**

Większość programistów robi to źle. Planują feature'kę w długiej rozmowie z Claude Code – czytają pliki, dyskutują o architekturze, eksplorują różne podejścia. A potem, w tej samej rozmowie, od razu zaczynają implementację.

Problem? **Okno kontekstu jest zaśmiecone** całym procesem eksploracji.

### Zalety resetu kontekstu

Podczas planowania ładujesz TONY kontekstu:

- Czytasz wiele plików z różnych części projektu
- Eksplorujesz istniejącą architekturę
- Dyskutujesz o różnych podejściach
- Przeglądasz podobne implementacje w codebase

Ale podczas egzekucji chcesz:

- **Maksymalną przestrzeń do rozumowania** dla LLM
- **Miejsce na self-validation** - agent powinien móc sprawdzać swoje własne rozwiązania
- **Czysty mental model** - tylko to, co jest potrzebne do implementacji tej konkretnej feature'ki

### Właściwy workflow

```text
[Planning Session]
↓
/prime - Załaduj kontekst codebase
↓
Rozmowa: "Based on PRD, let's plan authentication feature"
↓
/plan-feature - Output: structured plan jako markdown document
↓
[NOWA KONWERSACJA] ← To jest kluczowe!
↓
/execute plan-auth.md - JEDYNY kontekst to plan
↓
Implementacja z pełną przestrzenią do reasoning
```

### Co zawiera ten plan document

Plan musi być self-contained - zawierać WSZYSTKO, co potrzebne do implementacji:

```markdown
# Plan: User Authentication Feature

## Feature Description

Implement JWT-based authentication with email/password login.

## User Story

As a user, I want to securely log in to access personalized content.

## Context to Reference

- `src/utils/api.js` - API utility functions
- `src/context/AuthContext.jsx` - existing auth context (modify)
- `docs/reference/api-design.md` - API patterns

## Technical Approach

1. Backend: Create /api/auth/login and /api/auth/register endpoints
2. Frontend: Login form component with validation
3. State: Store JWT token in AuthContext
4. Protected routes: Add authentication middleware

## Task-by-Task Breakdown

### Task 1: Backend Auth Endpoints

- Create `src/api/auth.js` with login and register functions
- Implement JWT token generation
- Add password hashing with bcrypt
- Error handling for invalid credentials

### Task 2: Login Form Component

- Create `src/components/LoginForm.jsx`
- Form validation using Formik
- Connect to auth API
- Handle loading and error states

### Task 3: Auth Context Updates

- Modify `src/context/AuthContext.jsx`
- Add login/logout/register methods
- Persist token to localStorage
- Auto-refresh token logic

### Task 4: Protected Routes

- Create ProtectedRoute component
- Redirect to /login if not authenticated
- Update router configuration

## Testing Requirements

- Unit tests for auth API functions
- Integration tests for login flow
- E2E test: complete registration and login
- Error handling tests: invalid credentials, expired token

## Success Criteria

- User can register with email/password
- User can login and access protected pages
- Token persists across page refreshes
- Logout clears token and redirects to home
```

### Zalety planu self-contained

LLM ma **maksymalną liczbę tokenów** dla reasoning podczas krytycznej fazy kodowania. Nie ma kontaminacji kontekstem eksploracyjnym. A co najważniejsze – **zmusza Cię to do tworzenia kompletnych, self-contained planów**.

To dyscyplina. Ale dyscyplina, która czyni Twoje sesje kodowania z AI nieporównywalnie bardziej efektywnymi.

Próbowałem obydwoma sposobami. Różnica jest gigantyczna. Reset kontekstu to technika, której uczyłem się najdłużej, ale która dała największy boost w jakości outputu.

## Ewolucja systemu: Każdy bug to lekcja dla agenta

To najważniejsza technika ze wszystkich. I najczęściej pomijana. Dla mnie do niedawna nieznana. Być może dla Ciebie także, albo nie zdajesz sobie sprawy z jej znaczenia.

Tradycyjne podejście wygląda tak:

1. Agent AI popełnia błąd
2. Naprawiasz go ręcznie
3. Idziesz dalej
4. **Ten sam błąd powtarza się za tydzień**

Podejście ewolucyjne:

1. Agent AI popełnia błąd
2. Analizujesz: **Co w systemie pozwoliło na ten błąd?**
3. Aktualizujesz rules/commands/process
4. **Ta klasa bugów jest wyeliminowana na zawsze**

### Shift w mindset

Nie naprawiaj buga. **Napraw system, który pozwolił na buga.**

Twój agent AI to nie jest statyczne narzędzie. To **ewoluujący system**, który może stawać się coraz potężniejszy z każdą iteracją. Ale tylko jeśli Ty aktywnie go ulepszasz.

### Przykłady ewolucji systemu

**Scenario 1: Złe style importów**

```text
Bug: Agent używa require() zamiast import w projekcie ES6

Analiza: Brak jasnej reguły o module system

Fix: Dodaj do CLAUDE.md:
"Always use ES6 import/export syntax.
Never use require() or module.exports."

Rezultat: Nigdy więcej problem ze stylami importów
```

**Scenario 2: Zapomina uruchamiać testy**

```text
Bug: Agent implementuje feature bez testów

Analiza: Brak kroku "testing" w workflow

Fix: Zaktualizuj template /execute command:
## Testing Phase
1. Write tests first (TDD when appropriate)
2. Run full test suite: npm test
3. Ensure all tests pass before completion
4. Add test coverage report to plan

Rezultat: Testy stają się automatyczną częścią workflow
```

**Scenario 3: Nie rozumie auth flow**

```text
Bug: Agent implementuje niepoprawną autentykację

Analiza: Brak dokumentacji authentication flow

Fix:
1. Stwórz reference/authentication.md z flow diagram
2. Dodaj do CLAUDE.md:
   "When working on authentication, read reference/authentication.md"

Rezultat: Implementacje auth konsekwentnie poprawne
```

### Workflow refleksji

Po zakończeniu każdej feature'ki, zamiast od razu lecieć do następnej:

```markdown
"Hey Claude, zauważyłem że XYZ nie działało poprawnie i musiałem to naprawić.

Przeanalizujmy:

1. Przeczytaj komendy, których użyliśmy
2. Przeczytaj obecne rules
3. Zidentyfikuj co możemy ulepszyć, żeby to się nie powtórzyło
4. Zasugeruj konkretne zmiany w rules/commands"
```

Claude Code przeanalizuje session, znajdzie luki w procesie, i zaproponuje poprawki. Czasami to nowa reguła. Czasami dodatkowy krok w komendzie. Czasami nowy reference document.

### Zalety ewolucji systemu

- **Twój agent staje się mądrzejszy z czasem** - reliability rośnie z każdą iteracją
- **Budujesz institutional knowledge** - cały zespół korzysta z nauki na błędach
- **Transformation z reactive do proactive** - zamiast gasić pożary, zapobiegasz im
- **Compound effect** - po 3 miesiącach masz system, który robi mniej błędów niż junior developer

To więcej niż technika. To **mindset**. Traktuj system swojego agenta AI jak kod produkcyjny, który wymaga ciągłego ulepszania.

Z własnego doświadczenia wiem, że największym błędem jest ignorowanie wzorców w błędach agenta. Pierwszy raz to przypadek. Drugi raz to sygnał. Trzeci raz to Twoja wina, że nie poprawiłeś systemu.

## Claude PIV Skeleton: Wszystko w jednym miejscu

Teraz najlepsza część. Wszystkie te techniki, o których mówię - PRD-first development, modularność reguł, komendyfikacja workflow, reset kontekstu, ewolucja systemu - są już zaimplementowane w gotowym do użycia framework.

Nazywa się **Claude PIV Skeleton** i jest dostępny na GitHub: [https://github.com/plipowczan/claude-piv-skeleton](https://github.com/plipowczan/claude-piv-skeleton) (fork od [galando](https://github.com/galando/claude-piv-skeleton))

### Problem, który rozwiązuje

Wcześniej korzystałem z asystenta, który generował PRD oraz rules dla agenta AI, ale to wymagało korzystania z dwóch różnych narzędzi. Musiałem kopiować output między aplikacjami, synchronizować manualne, tracić kontekst.

Posiadanie tego wszystkiego w jednym miejscu jest **ogromną zaletą**. A ponieważ asystent to praktycznie tylko prompt, można ten prompt wykorzystać jako command – i dokładnie to robi PIV Skeleton.

### Czym jest PIV Methodology

PIV to akronim od **Prime-Implement-Validate** - metodologia stworzona przez [Cole Medin](https://github.com/coleam00) specjalnie dla development z asystentami AI:

- **Prime**: Załaduj i zrozum kontekst codebase
- **Implement**: Zaplanuj feature'ki i wykonaj implementację
- **Validate**: Automatycznie testuj i weryfikuj

To nie abstrakcja. To konkretny workflow, który Cole udowodnił w produkcyjnych projektach jak [woningscoutje.nl](https://woningscoutje.nl).

### Co dostajemy w claude-piv-skeleton

Repository implementuje wszystkie 5 technik jako ready-to-use framework:

**Universal methodology** - działa z każdym tech stackiem (Spring Boot, Node.js, React, Python FastAPI, etc.)

**Modular rules system** - path-based loading reguł w zależności od tego, nad czym pracujesz

**Pre-built commands** - kompletny zestaw komend dla całego PIV workflow

**Technology templates** - gotowe konfiguracje dla popularnych stacków

### Struktura repozytorium

```text
.claude/
├── CLAUDE.md                  # Lightweight global rules
├── PIV-METHODOLOGY.md         # Pełna dokumentacja metodologii
├── commands/                  # Wszystkie workflows jako komendy
│   ├── piv_loop/              # Core PIV workflow
│   │   ├── prime.md           # Prime phase command
│   │   ├── plan-feature.md    # Planning command
│   │   └── execute.md         # Execution command
│   ├── validation/            # Validation & testing
│   │   ├── validate.md        # Full validation pipeline
│   │   ├── code-review.md     # Technical review
│   │   └── system-review.md   # Process improvement
│   └── bug_fix/               # Bug fix workflow
│       ├── rca.md             # Root cause analysis
│       └── implement-fix.md   # Fix implementation
├── rules/                     # Modular rules by technology
│   ├── 00-general.md          # Universal principles
│   ├── 10-git.md              # Git workflow
│   ├── 20-testing.md          # Testing philosophy
│   └── backend/               # Backend-specific rules
└── reference/                 # Best practices loaded on-demand
    └── patterns/              # Design patterns reference
```

### Workflow, który umożliwia

Kompletny cykl development z PIV Skeleton:

```bash
# 1. Prime workspace
"Run /piv_loop:prime to load the project context"

# 2. Plan feature
"Use /piv_loop:plan-feature to create a plan for adding user authentication"

# 3. Execute (automatic context reset!)
"Use /piv_loop:execute to implement the plan"

# 4. Validation runs automatically
# No manual step needed - testing happens in the workflow

# 5. Bug fix with system evolution built in
"Run /bug_fix:rca for issue #123"
"Use /bug_fix:implement-fix to implement the fix"
```

### Zalety PIV Skeleton

- **Nie musisz budować od zera** - gotowa struktura, przetestowana w produkcji
- **Battle-tested patterns** - workflow wypracowany przez najlepszych AI engineers
- **Community-driven** - wkład wielu programistów, ciągłe ulepszenia
- **Extensible** - łatwo dostosować do swojego tech stacku i potrzeb

PIV Skeleton to nie tylko kod. To **system myślenia** o pracy z AI agents, zapakowany w reusable framework.

## Jak zacząć: Pierwsze kroki

Świetnie, znasz już 5 technik i wiesz, że istnieje gotowy framework. Ale jak to wszystko wdrożyć w praktyce?

### Ścieżka 1: Użyj PIV Skeleton (Recommended)

Jeśli zaczynasz nowy projekt albo możesz przenieść istniejący:

```bash
# Sklonuj repozytorium
git clone https://github.com/plipowczan/claude-piv-skeleton.git my-project
cd my-project

# Usuń historię git, żeby zacząć od czystej kartki
rm -rf .git
git init

# Zainstaluj swój tech stack
# (Postępuj według technology-specific guides w technologies/ directory)

# Rozpocznij pierwszą feature'kę
# Otwórz Claude Code i:
```

1. `"Run /piv_loop:prime to load project context"`
2. `"Based on PRD, what should we build first?"`
3. `"Use /piv_loop:plan-feature to plan it"`
4. `"Use /piv_loop:execute to implement"`

I to wszystko. Masz gotowy system z pierwszą feature'ką w produkcji.

### Ścieżka 2: Implementuj Inkrementalnie

Jeśli masz istniejący projekt i nie chcesz wszystkiego przenosić naraz, wdrażaj techniki krok po kroku:

**Tydzień 1: Stwórz PRD**

- Udokumentuj obecny stan projektu
- Zdefiniuj kolejne feature'ki do zbudowania
- Uczyń PRD swoją gwiazdą polarną

**Tydzień 2: Stwórz komendę Prime**

- Jaki kontekst powinien być zawsze ładowany?
- Stwórz `/prime` command w `.claude/commands/`
- Używaj na początku każdej sesji

**Tydzień 3: Modularyzuj Rules**

- Podziel swój CLAUDE.md na global + reference
- Przenieś task-specific rules do `reference/`
- Dodaj sekcję reference w global rules

**Tydzień 4: Dodaj Feature Workflow**

- Stwórz `/plan-feature` command
- Ćwicz context reset między planem a wykonaniem
- Stwórz `/execute` command

**Tydzień 5: System Evolution**

- Po każdym bugu, zrób refleksję
- Aktualizuj rules/commands na podstawie wniosków
- Trackuj improvement w CHANGELOG

### Kluczowe czynniki sukcesu

1. **Start small** - Nie próbuj wdrożyć wszystkich 5 technik naraz. Zacznij od PRD, potem dodaj prime command, etc.
2. **Dokumentuj na bieżąco** - Zapisuj co działa, co nie. Twoje notatki staną się częścią ewolucji systemu.
3. **Iteruj na komendach** - Twoje workflows będą się ulepszać. To normalne. Po miesiącu Twój `/prime` będzie lepszy niż na początku.
4. **Bądź konsekwentny** - Używaj systemu za każdym razem. Nie wracaj do starych nawyków "szybkiego fix'a" bez procesu.
5. **Udostępnij zespołowi** - Jeśli pracujesz w zespole, upewnij się że wszyscy używają tych samych komend i procesów. Mnożysz korzyści.

### Twój pierwszy feature z PIV

Konkretny przykład – załóżmy, że budujesz habit tracker i chcesz dodać streak tracking:

```text
Session 1 - Planning:
→ /prime
→ "Based on PRD, let's plan streak tracking feature"
→ /plan-feature "Streak tracking - show consecutive days"
→ Plan zapisany: .claude/agents/plans/streak-tracking.md

[Restart konwersacji]

Session 2 - Execution:
→ /execute .claude/agents/plans/streak-tracking.md
→ [Implementation happens with tests]
→ /validate
→ All tests pass ✓

Session 3 - Commit:
→ /commit
→ "feat: Add streak tracking with visual indicators"
```

Po godzinie masz feature'kę w produkcji. Z testami. Z poprawnym commit message. Z wszystkim.

## Kluczowe wnioski

1. **PRD-first development** zapewnia spójność i kierunek dla wszystkich iteracji z agentem AI. To gwiazda polarna, która sprawia, że każda feature ma sens w kontekście całości.
2. **Modularyzacja reguł** chroni okno kontekstu i ładuje tylko potrzebną wiedzę. Przestań marnować tokeny na nieistotny kontekst – ładuj to, co ważne, wtedy gdy ważne.
3. **Komendyfikacja workflow** oszczędza tysiące naciśnięć klawiszy i zapewnia konsystencję. Jeśli robisz coś więcej niż dwa razy, to powinno być komendą.
4. **Reset kontekstu** między planowaniem a wykonaniem daje agentowi maksymalną przestrzeń do rozumowania. Counterintuitive, ale to jedna z najbardziej impactowych technik.
5. **Ewolucja systemu** przekształca każdy bug w lekcję, która sprawia że agent staje się mądrzejszy. Nie naprawiaj buga – napraw system, który na niego pozwolił.
6. **PIV Skeleton** oferuje gotową implementację wszystkich technik w jednym miejscu. Nie musisz budować od zera – możesz zacząć już dziś.
7. Najważniejsze: **systematyczne podejście** vs. reaktywne promptowanie to różnica między wykorzystaniem 20% a 80% potencjału Claude Code.

### Moje doświadczenie

Gdy zaczynałem budować to portfolio z pomocą AI, nie miałem systemu. Proste prompty, ad-hoc fixes, zero procesów. Potem odkryłem te techniki. I wszystko się zmieniło.

Teraz mój workflow z Claude Code jest przewidywalny. Efektywny. I co najważniejsze – **agent staje się lepszy z każdą sesją**, zamiast popełniać te same błędy w kółko.

To transformacja, którą możesz mieć w swoim zespole. Wymaga to zmiany mindset z "AI to szybszy Google" na "AI to evolving development partner". Ale jeśli to zrobisz? Różnica będzie gigantyczna.

---

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">Chcesz wdrożyć AI w swoim zespole?</h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci zbudować system pracy z agentami AI, który zwiększy produktywność Twojego zespołu. Od strategii przez implementację po szkolenia.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Przydatne zasoby

- **[claude-piv-skeleton](https://github.com/plipowczan/claude-piv-skeleton)** - Gotowy framework implementujący PIV methodology
- **[habit-tracker](https://github.com/coleam00/habit-tracker)** - Oryginalny projekt demo PIV od Cole Medin
- **[context-engineering-intro](https://github.com/coleam00/context-engineering-intro)** - Wprowadzenie do context engineering od Cole Medin
- **[Claude Code Documentation](https://claude.ai/code)** - Oficjalna dokumentacja Claude Code
