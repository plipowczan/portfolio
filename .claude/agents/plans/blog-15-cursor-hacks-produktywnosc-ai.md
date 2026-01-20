# Blog Article Plan: 15 hacków do Cursor.sh które zmienią sposób pracy z AI

**Plan Date:** 2026-01-11
**Target Completion:** 2026-01-15
**Estimated Length:** 3200-3400 words (16-17 min read)

---

## 📋 Frontmatter Specification

```yaml
---
id: 11
slug: 15-cursor-hacks-produktywnosc-ai
title: "15 hacków do Cursor.sh które zmienią sposób pracy z AI"
excerpt: "Większość użytkowników wykorzystuje tylko 20% możliwości Cursor. Odkryj ukryte funkcje od podstawowych skrótów po zaawansowane techniki jak worktrees i strukturyzacja promptów."
category: AI
author: Pawel Lipowczan
date: 2026-01-15
readTime: 17 min
image: /images/og-15-cursor-hacks-produktywnosc-ai.webp
tags:
  - AI
  - Cursor
  - Produktywność
  - Developer Tools
  - Claude Code
---
```

---

## 🎯 Article Objectives

### Primary Goal

Provide comprehensive guide to Cursor productivity features in Polish, from beginner to advanced level.

### Success Metrics

- All 15+ hacks clearly explained with practical examples
- Tiered progression (beginner → intermediate → advanced)
- Personal insights from Pawel's real usage
- Actionable takeaways reader can apply immediately
- Proper technical accuracy with code examples

### Target Audience

- Polish developers using Cursor (or considering it)
- Current AI coding assistant users (Claude Code, Copilot, etc.)
- Intermediate skill level - knows basics, wants to level up
- Pain: Wasting subscription credits, missing hidden features

---

## 📖 Article Structure & Content Breakdown

### Introduction (300-350 words)

**Hook:**
Open with relatable scenario - most Cursor users only scratching surface, wasting subscription value.

**Content:**

- Personal anecdote: Pawel's journey from basic Cursor usage to discovering hidden features
- The "20% problem" - most users utilize only fraction of capabilities
- Why this matters: ROI on subscription, productivity gains, competitive advantage
- What you'll learn: 15 hacks organized by difficulty level

**Tone:** Direct, personal, immediately actionable

**Code Examples:** None yet

---

### Section 1: Dlaczego warto znać Cursor w 100% (200-250 words)

**Purpose:** Build context and motivation before diving into hacks.

**Content:**

- Context window is expensive real estate
- Subscription costs ($20/mo) - get your money's worth
- Productivity multiplier: knowing hidden features = 3-5x faster
- Integration opportunities (Cursor + Claude Code + other tools)
- Personal note: "Pierwsze 3 miesiące używałem Cursor jak glorified VS Code..."

**Key Points:**

- Cost optimization angle (Polish market price-sensitive)
- Time savings quantified where possible
- Set expectations: beginner to pro progression

**Code Examples:** None

---

### Section 2: Poziom 1 - Podstawy (Każdy powinien znać) (600-700 words)

**Introduction to section:** "Te hacki powinien znać każdy użytkownik Cursor, niezależnie od poziomu zaawansowania."

#### Hack 1: Skróty klawiszowe które zaoszczędzą godziny

**Content:**

- `Cmd/Ctrl + B` - Toggle sidebar
- `Cmd/Ctrl + J` - Toggle terminal
- `Cmd/Ctrl + Shift + B` - Open browser preview
- `Cmd/Ctrl + E` - Switch editor/agent
- `Shift + Tab` - Cycle through modes (Ask/Agent/Plan/Background)
- `Cmd/Ctrl + /` - Quick model picker

**Personal note:** "Przez miesiąc klikałem myszką w terminal. Gdy odkryłem Cmd+J, poczułem się jak idiota."

**Code Example:**

```text
Podstawowe skróty:
Cmd+B - Sidebar on/off
Cmd+J - Terminal on/off
Cmd+E - Przełącz na agenta
Shift+Tab - Zmień tryb (Ask/Agent/Plan)
Cmd+/ - Wybierz model
```

**Word count target:** ~150 words

---

#### Hack 2: Pokaż zużycie subskrypcji - nie daj się zaskoczyć limitem

**Content:**

- Default: usage shown only when close to limit (too late!)
- Settings → Chat → Usage Summary → Always
- Monitor consumption in real-time
- When to switch models to conserve credits
- Personal experience: "Raz przekroczyłem limit w środku sprintu. Nigdy więcej."

**Code Example:**

```text
Ścieżka w ustawieniach:
Settings → Chat → Usage Summary → "Always"
```

**Word count target:** ~120 words

---

#### Hack 3: Włącz dźwięki zakończenia - przestań czekać bezczynnie

**Content:**

- Why this matters: multitasking, context switching
- Settings → General → Completion sounds
- Real scenario: checking docs while agent works
- Avoid Instagram trap while waiting for AI

**Personal note:** "Ile razy sprawdziłem telefon podczas gdy agent skończył 5 minut temu? Za dużo."

**Code Example:** None

**Word count target:** ~100 words

---

#### Hack 4: Early Access - dostęp do nowych funkcji miesiące wcześniej

**Content:**

- Settings → Beta → Early Access
- Default vs Early Access vs Nightly (dev only)
- New features arrive months earlier
- Usually stable (author's experience)
- Why most users don't know about this

**Personal note:** "Custom modes pojawiły się w Early Access 2 miesiące przed oficjalną wersją."

**Code Example:**

```text
Settings → Beta → Early Access (włącz)
```

**Word count target:** ~120 words

---

#### Hack 5: Wiele okien - pracuj nad dwoma projektami jednocześnie

**Content:**

- **Jak:** File → New Window
- **Use cases:**
  - Reference old project while building new one
  - Copy patterns without switching contexts
  - Each window = independent conversation
  - Work on multiple clients simultaneously
- **Memory management consideration:** Każde okno = osobna instancja, więcej RAM

**Uwaga:** To standardowa funkcja w wielu aplikacjach, nie "sekretny hack". Ale wielu nie zdaje sobie sprawy, że może mieć kilka projektów otwartych jednocześnie z niezależnymi konwersacjami AI.

**Personal note:** "Nie jest to game changer jak worktrees, ale przydatne gdy pracujesz nad wieloma projektami. Szczególnie gdy chcesz skopiować pattern z jednego projektu do drugiego bez przełączania kontekstu."

**Code Example:** None

**Word count target:** ~130 words

---

**Section 1 Total:** ~600 words

---

### Section 3: Poziom 2 - Średniozaawansowany (700-800 words)

**Introduction to section:** "Tutaj zaczyna się magia. Te techniki odróżniają tych, którzy znają Cursor, od tych którzy go opanowali."

#### Hack 6: Zarządzaj MCP - nie marnuj context window

**Content:**

- What are MCPs (Model Context Protocols)
- Settings → Features → Check enabled MCPs
- Problem: MCPs eat huge context window chunks
- Strategy: disable all at project start, enable as needed
- Example: browser automation usually needed, others optional

**Personal insight:** "Raz miałem 6 MCP włączonych. Context window wypalał się w 10 wiadomości."

**Code Example:**

```text
Rekomendowany setup MCP:
✅ Browser Automation (często przydatne)
❌ Pozostałe (włącz tylko gdy potrzeba)

Ścieżka: Settings → Features → [MCP Name]
```

**Word count target:** ~150 words

---

#### Hack 7: Własne komendy - przestań powtarzać te same prompty

**Content:**

- Slash commands: reusable prompt templates
- How to create: type `/` → "Create command"
- Example: `/package-health` - check dependencies
- Import Claude Code commands: Settings → Rules for AI → Import Claude commands
- Store in `.cursor` folder, available across projects

**Personal workflow:** "Mam 8 custom commands. Najczęściej używam `/prime` i `/package-health`."

**Code Example:**

```bash
# Przykład custom command: Package Health Check
# Plik: .cursor/commands/package-health.md

Scan node_modules and package.json for:
- Security vulnerabilities
- Outdated dependencies
- Breaking changes in recent versions
Report findings with severity levels.
```

**Word count target:** ~180 words

---

#### Hack 8: Zarządzanie kontekstem - reguła 60%

**Content:**

- Context window indicator (bottom status bar)
- Reguła 60%: restart conversation when >60% full
- Why: AI remembers beginning and end well, middle poorly
- Natural breakpoints for new conversation
- Summary vs Fresh start strategy

**Personal experience:** "Powyżej 60% agent zaczyna 'zapominać' wcześniejszych instrukcji. Empirycznie sprawdzone."

**Code Example:**

```text
Strategia context management:
< 40% - Kontynuuj swobodnie
40-60% - Szukaj naturalnego breakpoint
> 60% - Rozważ restart (nowa konwersacja)
> 80% - Definitywnie restart
```

**Word count target:** ~140 words

---

#### Hack 9: Indeksuj dokumentację - pełna wiedza o bibliotekach w Cursor

**Content:**

- Settings → Indexing and Docs → Add docs
- Example: Add Convex docs (296 pages indexed)
- How to use: `@` command → Docs → Select library
- Cutoff window problem solved
- Updated API knowledge even for new frameworks

**Real scenario:** "Tailwind CSS v4 - AI często mylił składnię. Zaindeksowałem dokumentację, problem zniknął."

**Code Example:**

```text
Dodawanie dokumentacji:
1. Znajdź official docs URL (np. https://docs.convex.dev)
2. Settings → Indexing and Docs → Add docs
3. Wklej URL → Confirm
4. Użyj: @ → Docs → [Nazwa biblioteki]
```

**Word count target:** ~160 words

---

#### Hack 10: Agent steering - przejmij kontrolę w locie

**Content:**

- What is steering: send message while agent working
- **Gdzie znaleźć:** Agent pane → ... (trzy kropki) → Agent Settings → Queue Messages
- Dwie opcje dostępne:
  - **"Send after current message"** - czeka aż agent skończy obecne zadanie, potem wykonuje nowe
  - **"Stop & send right away"** - przerywa obecne zadanie i od razu zaczyna nowe
- Use cases for each mode
- When steering saves time vs creates confusion

**Personal tip:** "Send after current message używam najczęściej. Agent kończy zadanie, potem automatycznie robi kolejne z listy. Stop & send only gdy naprawdę chcę zmienić kierunek."

**Code Example:**

```text
Lokalizacja ustawienia:
Agent pane → ... (trzy kropki) → Agent Settings → Queue Messages

Dostępne opcje:
1. Send after current message
   → Agent kończy obecne zadanie, potem wykonuje nowe
   → Idealne dla dodawania zadań do kolejki

2. Stop & send right away
   → Natychmiastowe przerwanie i nowe zadanie
   → Używaj gdy kierunek pracy wymaga zmiany
```

**Word count target:** ~180 words

---

**Section 2 Total:** ~800 words

---

### Section 4: Poziom 3 - Pro Features (800-900 words)

**Introduction to section:** "To są funkcje, o których większość użytkowników nie wie że istnieją. Ale profesjonaliści używają ich codziennie."

#### Hack 11: Worktrees - testuj wiele rozwiązań równolegle

**Content:**

**Czym są worktrees:**
- Git worktrees = izolowane kopie projektu na osobnych branchach
- Cursor wykorzystuje to do równoległego testowania wielu modeli AI
- Każdy model pracuje w swojej kopii kodu, bez konfliktu
- Po zakończeniu wybierasz najlepsze rozwiązanie i aplikujesz do main branch

**Jak to działa krok po kroku:**
1. **Start:** Otwierasz Agent mode w Cursor
2. **Wybór modeli:** Klikasz w pole wyboru modelu
3. **Aktywacja worktrees:** Zaznaczasz opcję **"use multiple models"**
4. **Konfiguracja:** Wybierasz:
   - Różne modele (np. Composer + Sonnet + GPT-4o), LUB
   - Ten sam model z mnożnikiem 2x, 3x lub 4x (np. 4x Claude Sonnet dla różnorodności)
5. **Automatyczny setup:** Cursor tworzy git worktree dla każdego modelu/mnożnika, kopiuje projekt, uruchamia serwery na osobnych portach
6. **Równoległa praca:** Wszystkie instancje pracują jednocześnie nad tym samym zadaniem
7. **Preview:** Sprawdzasz rezultaty na różnych portach (localhost:3001, 3002, 3003)
8. **Apply:** Wybierasz najlepsze rozwiązanie → Apply → zmiany trafiają do main branch

**Dlaczego to game-changer:**
- Design choices: 3 modele = 3 różne podejścia wizualne, wybierasz najlepsze
- Refactoring: różne strategie implementacji, porównujesz jakość kodu
- Bug fixes: widzisz które podejście jest najbardziej eleganckie
- Nie tracisz czasu na kolejne iteracje - wszystko dzieje się równolegle

**Setup trick - autostart serwerów:**

**Code Example:**

```json
// .cursor/worktrees.json - automatyczny setup
// Umieść w głównym katalogu projektu
{
  "commands": [
    "npm install",     // Instaluje dependencies w worktree
    "npm run dev"      // Uruchamia dev server automatycznie
  ]
}
```

**Workflow:**

```bash
# Praktyczny przykład użycia worktrees:

# 1. Masz zadanie: "Add dark mode toggle with smooth transition"
# 2. Agent → kliknij wybór modelu → zaznacz "use multiple models"
# 3. Wybierz: Composer + Sonnet + GPT-4o (lub 3x Sonnet dla różnorodności)
# 4. Cursor automatycznie:
#    - Tworzy branch-wt-composer-xyz
#    - Tworzy branch-wt-sonnet-abc
#    - Tworzy branch-wt-gpt4o-def
#    - Uruchamia npm install + npm run dev w każdym
# 4. Po 2-3 minuty masz 3 działające wersje:
#    - localhost:3001 (Composer) - minimalistyczny przełącznik
#    - localhost:3002 (Sonnet) - animowany slider z ikonkami
#    - localhost:3003 (GPT-4o) - toggle z preview kolorów
# 5. Otwierasz wszystkie 3 w przeglądarce, porównujesz
# 6. Sonnet wygląda najlepiej → Review changes → Apply
# 7. Zmiany trafiają do main branch, worktrees są czyszczone
```

**Real use case:** "Design changes - puszczam 3 modele jednocześnie. W 5 minut widzę 3 różne podejścia wizualne. Bez worktrees musiałbym czekać 15 minut na kolejne iteracje."

**Kiedy NIE używać worktrees:**
- Proste bugfixy (overkill)
- Jasne wymagania (jeden model wystarczy)
- Ograniczone kredyty (3 modele = 3x koszt)

**Word count target:** ~350 words

---

#### Hack 12: Dwu-modelowy workflow - GPT-5.2 planuje, Claude wykonuje

**Content:**

- GPT-5.2 High = best planning, but SLOW execution
- Claude Sonnet = fast execution, decent planning
- Optimal: Plan mode with GPT-5 → switch to Claude for Build
- How: After plan generated, change model dropdown before "Build"
- Cost/speed optimization

**Personal workflow:** "GPT-5.2 do planu, Sonnet do kodu. Oszczędzam 70% czasu."

**Code Example:**

```text
Optymalny workflow:
1. Plan Mode → GPT-5.2 High (plan)
2. Po planie: Przełącz model → Claude 4.5 Sonnet
3. Kliknij "Build"
Rezultat: Najlepszy plan + szybka implementacja
```

**Word count target:** ~140 words

---

#### Hack 13: Strukturyzacja promptów - user stories i design patterns

**Content:**

**Problem:** Większość developerów pisze prompty ad-hoc: "Add login", "Fix this bug", "Make it prettier". Agent dostaje niejasne wymagania i generuje generyczny kod.

**Rozwiązanie:** Strukturyzuj prompty według wzorców, których AI są trenowane - user stories i design patterns.

**User Story Format (dla feature development):**

```text
As a [user type]
I want [goal/desire]
So that [benefit/value]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

Technical Context:
- Existing components: [list]
- Design system: [colors, spacing]
- Similar implementations: [reference files]
```

**Dlaczego to działa:**
- AI są trenowane na user stories z GitHub/Jira
- Format wymusza jasność wymagań
- Acceptance criteria = built-in testing checklist
- Technical context eliminuje halucynacje

**Design Pattern Prompts (dla architektury):**

```text
I need to implement [feature] using [pattern name] pattern.

Pattern Structure:
- Component A: [responsibility]
- Component B: [responsibility]
- Communication: [how they interact]

Constraints:
- Must work with existing [X]
- Performance requirement: [Y]
- Should follow project convention: [Z]

References in codebase:
- Similar pattern used in: [file path]
```

**Real Examples:**

**Bad prompt:**
```text
Add user authentication
```

**Good prompt (user story):**
```text
As a returning user
I want to log in with email/password
So that I can access my saved preferences

Acceptance Criteria:
- [ ] Login form with email + password fields
- [ ] Form validation (email format, password min 8 chars)
- [ ] Error handling for invalid credentials
- [ ] Success: redirect to dashboard
- [ ] Failure: show error message, keep user on page

Technical Context:
- Auth provider: Clerk (already configured)
- Similar form: src/components/ContactForm.jsx
- Design system: Tailwind with dark-800 backgrounds
- State management: React Context in src/context/AuthContext.jsx
```

**Personal experience:** "Zanim odkryłem user stories, 50% pierwszych iteracji z AI było do wyrzucenia. Teraz 80% kodu z pierwszej iteracji idzie do produkcji."

**Bonusowy trick - Image-to-code prompts:**

```text
[Załącz screenshot/mockup]

Recreate this design with following specifications:
- Framework: React + Tailwind
- Components to extract: [list]
- Interactive elements: [behaviors]
- Responsive breakpoints: mobile (< 768px), desktop (>= 768px)
- Color palette: [specify if different from image]

DO NOT: [lista czego unikać]
```

**Kiedy używać strukturyzacji:**
- ✅ Nowe features (user stories)
- ✅ Refactoring (design patterns)
- ✅ Design implementation (image-to-code)
- ❌ Proste bugfixy (overkill)
- ❌ Eksploracyjne zadania (za dużo strukty krępuje kreatywność)

**Word count target:** ~300 words

---

#### Hack 14: @ command power features - kontekst na wyciągnięcie ręki

**Content:**

- **Czym jest @ command:** Szybki sposób dodawania kontekstu do agenta
- **Dostępne opcje w @ menu:**
  - **Files & Folders** - dodaj konkretne pliki lub całe foldery
  - **Docs** - zindeksowana dokumentacja bibliotek
  - **Terminals** - output z terminala
  - **Branch (Diff with main)** - różnice między branchami, historia zmian
  - **Browser** - zawartość otwartej strony w przeglądarce
- **Use cases:**
  - Files: "Sprawdź ten plik zanim zasugerujesz zmiany"
  - Docs: "Użyj oficjalnej dokumentacji Tailwind v4"
  - Branch: "Pokaż co się zmieniło od main brancha"
  - Browser: "Zaimplementuj design z tej strony"

**Personal scenario:** "Zamiast opisywać słowami 'ten plik z auth', wpisuję @ → Files → AuthContext.jsx i agent od razu ma pełny kontekst."

**Pro tip:** Możesz dodać wiele kontekstów naraz - @ Files + @ Docs + @ Branch dla pełnego obrazu.

**Code Example:**

```text
@ command - dostępne opcje:

1. Files & Folders
   → Dodaj konkretne pliki do kontekstu
   → Przykład: @ Files → src/components/Header.jsx

2. Docs
   → Zindeksowana dokumentacja bibliotek
   → Przykład: @ Docs → Tailwind CSS

3. Terminals
   → Output z terminala (błędy, logi)
   → Przydatne przy debugowaniu

4. Branch (Diff with main)
   → Różnice między branchami
   → Zobacz co się zmieniło w feature branchu
   → Przykład: "Co dodałem w tym branchu?"

5. Browser
   → Zawartość otwartej strony
   → Design inspiration, dokumentacja online

Wszystkie opcje można łączyć dla pełnego kontekstu!
```

**Word count target:** ~200 words

---

#### Hack 15: Duplicate chat - klonuj dobrze przygotowany kontekst

**Content:**

- **Gdzie znaleźć:** Widok zarządzania agentami → wybierz agenta → ... (trzy kropki) → "Duplicate chat"
- **NIE** w menu ... bezpośrednio w agent pane podczas rozmowy
- **Use case:** Primed agent with docs + rules + context
- Want to implement 3 related features with same foundation
- Clone starting point instead of re-priming 3 times
- Massive time saver for parallel work

**⚠️ Ostrzeżenie:** W niektórych wersjach Cursor funkcja może być buggy:
- Zduplikowane chaty czasami nie mogą wysyłać wiadomości
- Duplikowanie może zatrzymać oryginalnego agenta
- Jeśli napotkasz problemy, restart Cursor zwykle pomaga

**Discovery story:** "Przez rok używałem Cursor i nie wiedziałem że to istnieje. Schowane głęboko w widoku zarządzania agentami."

**Code Example:**

```text
Workflow z duplicate chat:
1. Prime agent: załaduj docs, rules, kontekst projektu
2. Gdy agent dobrze rozumie codebase
3. Przejdź do widoku zarządzania agentami (lista wszystkich agentów)
4. Znajdź agenta którego chcesz sklonować
5. Kliknij ... (trzy kropki) obok tego agenta
6. Wybierz "Duplicate chat"
7. Nowy agent z identycznym kontekstem
8. Implementuj kolejną feature bez powtarzania primingu

⚠️ Jeśli duplikat nie działa: restart Cursor
```

**Word count target:** ~220 words

---

**BONUS Hack 16: .cursorignore manipulation - niebezpieczny ale przydatny**

**Content:**

- `.cursorignore` controls what AI can see
- By default: `.env`, `.env.local` blocked (for security)
- Hack: Use `!.env.local` to negate rule (expose to AI)
- ⚠️ ONLY in test environments
- Use case: AI can validate env variables setup
- Security warning prominent

**Personal warning:** "Nigdy nie rob tego w produkcji. Tylko w testowym repo gdzie klucze są dummy."

**Code Example:**

```bash
# .cursorignore file
# ⚠️ UWAGA: Używaj TYLKO w środowisku testowym

# Default (bezpieczne):
.env
.env.local

# Hack - odblokowanie (TYLKO DLA TESTÓW):
!.env.local

# Pozwala AI widzieć zmienne środowiskowe
# Użyj tylko z dummy/test credentials!
```

**Word count target:** ~180 words

---

**Section 3 Total:** ~1250 words

**Note:** Rozbudowane wyjaśnienia dla Hack 11 (worktrees mechanics + korekta workflow), Hack 13 (prompt structuring), Hack 14 (@ command pełna lista), Hack 15 (korekta lokalizacji + ostrzeżenia) zwiększają wartość merytoryczną i dokładność techniczną sekcji.

---

### Section 5: Bonus Tips - Szybkie Wskazówki (200-250 words)

**Content:**

- Split terminals (hover over terminal, click split icon)
- Auto theme switching (Editor Settings → Auto detect color scheme)
- Generate cursor rules from docs (slash command)
- Design mode for prototyping (custom command: mock data only)
- Agent review (automated code review on commit)

**Format:** Quick bullet list with 1-2 sentence explanations

**Personal note:** "Te nie zmieściły się w Top 15, ale używam ich regularnie."

**Word count target:** ~200 words

---

### Section 6: Kluczowe wnioski (150-200 words)

**Content (numbered list):**

1. **Skróty klawiszowe oszczędzają godziny** - Cmd+J, Cmd+E, Shift+Tab to absolutna podstawa
2. **Context window to cenny zasób** - Zarządzaj MCP, resetuj po 60%, bądź świadomy kosztów
3. **Custom commands eliminują powtarzanie** - Jeśli robisz coś więcej niż 2x, utwórz komendę
4. **Dokumentacja w Cursor = superpowers** - Zaindeksuj biblioteki których używasz
5. **Strukturyzuj prompty jak profesjonaliści** - User stories i design patterns = 80% kodu z pierwszej iteracji do produkcji
6. **Advanced features nie są intuicyjne** - Worktrees, strukturyzacja promptów, duplicate chat są ukryte, ale game-changing
7. **ROI z subskrypcji rośnie z wiedzą** - $20/miesiąc to mało lub dużo w zależności od tego jak używasz

**Tone:** Summarize key insights, reinforce value

**Word count target:** ~180 words

---

### Section 7: Następne kroki (100-120 words)

**Content:**
Actionable checklist reader can do TODAY:

1. **Dzisiaj:** Włącz usage summary, early access, completion sounds
2. **Ten tydzień:** Naucz się skrótów klawiszowych (Cmd+J, Cmd+E, Shift+Tab)
3. **Ten miesiąc:** Stwórz pierwszą custom komendę, zaindeksuj dokumentację głównej biblioteki, zacznij strukturyzować prompty w formacie user stories
4. **Za miesiąc:** Eksperymentuj z worktrees, dwu-modelowym workflow, advanced prompt patterns

**Personal closing:** "Te hacki zmieniły sposób w jaki pracuję z AI. Zaczynałem od podstaw i stopniowo odkrywałem kolejne. Ty możesz przejść tę drogę szybciej."

**Word count target:** ~120 words

---

### Section 8: CTA Section (HTML formatted)

**Content:**

```html
<div
  class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center"
>
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz maksymalnie wykorzystać AI w kodowaniu?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci zoptymalizować workflow z AI coding assistants, zbudować custom
    automation i szkolenia dla zespołu. Od strategii przez implementację po
    advanced techniques.
  </p>
  <a href="/#contact" class="btn-primary inline-block"
    >Umów bezpłatną konsultację</a
  >
</div>
```

---

### Section 9: Przydatne zasoby (Optional, 80-100 words)

**Content:**

- [Cursor Documentation](https://cursor.com/docs) - Oficjalna dokumentacja
- [5 technik pracy z Claude Code](/blog/5-technik-pracy-z-claude-code) - Komplementarny artykuł o Claude Code
- [Cursor Community Discord](https://discord.gg/cursor) - Społeczność użytkowników
- [GitHub: claude-piv-skeleton](https://github.com/plipowczan/claude-piv-skeleton) - Workflow methodology z custom commands

**Word count target:** ~80 words

---

## 📊 Total Word Count Breakdown

| Section                                  | Target Words  |
| ---------------------------------------- | ------------- |
| Introduction                             | 300-350       |
| Dlaczego warto znać Cursor               | 200-250       |
| Poziom 1 - Podstawy (5 hacks)            | 600-700       |
| Poziom 2 - Średniozaawansowany (5 hacks) | 700-800       |
| Poziom 3 - Pro Features (6 hacks)        | 1100-1200     |
| Bonus Tips                               | 200-250       |
| Kluczowe wnioski                         | 180-220       |
| Następne kroki                           | 120-140       |
| CTA Section                              | ~50 (HTML)    |
| Przydatne zasoby                         | 80-100        |
| **TOTAL**                                | **3160-3560** |

**Target:** ~3300 words = **16-17 min read time**

**Note:** Hack 11 (Worktrees) i Hack 13 (Strukturyzacja promptów) są bardziej rozbudowane z dokładnymi wyjaśnieniami i przykładami, co zwiększa całkowitą długość artykułu.

---

## 🎨 Code Block Specifications

### All Code Blocks MUST Include Language Tag

#### Bash/Shell Commands

```bash
npm install
git checkout -b feature
```

#### Configuration Files

```json
{
  "setting": "value"
}
```

#### Text/Generic

```text
Usage for plain text examples
```

#### Markdown

```markdown
# Example heading
```

### Locations for Code Examples

1. **Keyboard shortcuts** - `text` block (Hack 1)
2. **Settings paths** - `text` block (Hack 2, 4)
3. **Custom command** - `bash` block with comment (Hack 7)
4. **Context management strategy** - `text` block (Hack 8)
5. **Docs indexing steps** - `text` block (Hack 9)
6. **Message queuing modes** - `text` block (Hack 10)
7. **Worktrees JSON config** - `json` block (Hack 11)
8. **Worktrees workflow** - `bash` block with comments (Hack 11)
9. **Two-model workflow** - `text` block (Hack 12)
10. **User story format** - `text` block (Hack 13)
11. **Design pattern prompts** - `text` block (Hack 13)
12. **Good vs bad prompts** - `text` blocks (Hack 13)
13. **@ command features** - `text` block (Hack 14)
12. **Duplicate chat workflow** - `text` block (Hack 15)
13. **`.cursorignore` manipulation** - `bash` block with warning comments (Hack 16)

---

## ✍️ Writing Style Guidelines

### Language Rules

**Polish Primary:**

- All explanations, narrative, descriptions in Polish
- Natural conversational tone

**English Technical Terms (DO NOT TRANSLATE):**

- Cursor, worktrees, context window, MCP, user stories, design patterns
- Model names: Claude Sonnet, GPT-5.2, Composer, Opus, GPT-4o
- Technical concepts: agent, plan mode, ask mode, queue
- Tools: Claude Code, VS Code
- File names: `.cursorignore`, `.cursor/commands/`

**NEVER Polonize:**

- ❌ "komendyfikacja" → ✅ "przekształcanie w komendy" OR "commandification"
- ❌ "skomendyfikować" → ✅ "stworzyć komendę"
- ❌ "zworktree'ować" → ✅ "użyć worktrees"

### Formatting Standards

**Bold Key Terms:**

- First mention of important concept: **context window**, **worktrees**, **custom modes**
- Numbers and metrics: **60%**, **$20/miesiąc**, **3x szybciej**

**Lists:**

- Bullet points: Features, benefits, characteristics
- Numbered lists: Steps, sequential actions, priorities

**Paragraphs:**

- Max 3-4 sentences
- One main idea per paragraph
- Visual breathing room

**Personal Voice:**

- "Z własnego doświadczenia wiem..."
- "Pierwszych kilka miesięcy..."
- "Raz przekroczyłem limit i..."
- "Odkryłem to przez przypadek..."

---

## 🔍 SEO Optimization

### Primary Keywords

- Cursor productivity
- Cursor hacks
- AI coding assistant
- Cursor tips tricks

### Secondary Keywords

- Cursor worktrees
- prompt engineering
- user stories AI
- context window management
- Claude Code integration
- AI development workflow
- structured prompts

### Internal Links

- Link to: [5 technik pracy z Claude Code](/blog/5-technik-pracy-z-claude-code)
- Link to: [Vibe Coding przewodnik](/blog/vibe-coding-przewodnik) (w kontekście design mode)

### External Links

- Cursor official docs
- Claude PIV skeleton (GitHub)
- Cursor Discord community

---

## ✅ Technical Accuracy Checklist

**For Each Code Example:**

- [ ] Syntactically correct
- [ ] Language tag specified
- [ ] Comments explain non-obvious parts
- [ ] Tested or verified from source transcripts

**For Each Feature Description:**

- [ ] Settings path accurate
- [ ] Keyboard shortcuts correct (Mac/Windows variants if needed)
- [ ] Feature availability verified (not deprecated)

**For Security-Sensitive Content:**

- [ ] Clear warnings for `.cursorignore` hack
- [ ] Emphasis on test environment only
- [ ] No actual credentials in examples

---

## 🎯 Success Criteria

**Content Quality:**

- [ ] All 16 hacks explained with concrete examples
- [ ] Tiered progression clear (beginner → intermediate → advanced)
- [ ] Personal insights from Pawel's experience in each section
- [ ] Actionable - reader can apply immediately

**Technical Quality:**

- [ ] All code blocks have language tags
- [ ] Keyboard shortcuts accurate
- [ ] Settings paths verified
- [ ] Security warnings prominent

**Style Compliance:**

- [ ] Matches Pawel's voice (personal, direct, practical)
- [ ] Polish + English tech terms natural mix
- [ ] No polonized tech terms
- [ ] Short paragraphs (3-4 sentences max)

**SEO & Structure:**

- [ ] Frontmatter complete and correct
- [ ] Primary keyword in title, H2 headers
- [ ] Internal links to related articles
- [ ] Clear CTA at end

**Length:**

- [ ] 3200-3400 words
- [ ] 16-17 min read time
- [ ] Balanced across sections
- [ ] Detailed explanations for advanced hacks (worktrees, prompt structuring)

---

## 📝 Writing Order Recommendation

### Phase 1: Core Content (Execute First)

1. Section 2: Poziom 1 - Podstawy (5 hacks)
2. Section 3: Poziom 2 - Średniozaawansowany (5 hacks)
3. Section 4: Poziom 3 - Pro Features (6 hacks)

### Phase 2: Framing

1. Introduction (hook + context)
2. Dlaczego warto znać Cursor w 100%
3. Kluczowe wnioski
4. Następne kroki

### Phase 3: Supplementary

1. Bonus Tips
2. Przydatne zasoby
3. CTA Section (copy from existing articles)

### Phase 4: Polish

1. Add personal anecdotes throughout
2. Verify all code blocks have tags
3. Add bold formatting to key terms
4. Check paragraph lengths
5. Final read-through for tone

---

## 📌 Notes for Execution

### High Priority

- Personal anecdotes make this authentic - add Pawel's voice throughout
- Security warning for `.cursorignore` must be prominent
- Code examples must be tested/verified from transcripts
- Tiered structure must be clear visually

### Medium Priority

- Cross-reference to "5 technik Claude Code" article
- Cost optimization angle (Polish market)
- Concrete time/productivity savings where possible

### Low Priority

- Screenshots/images (can be added later)
- Additional external resources
- Extended bonus tips section

### Watch Out For

- Don't polonize tech terms
- Don't skip language tags on code blocks
- Don't make security hacks seem riskless
- Don't over-promise results without caveats

---

## 🚀 Ready for Execution

**All planning complete. Proceed to:**
`/blog-article-writer:execute`

**This plan includes:**
✅ Complete article structure (9 sections)
✅ Word count targets (2800 words total)
✅ All 16 hacks with descriptions
✅ Code examples with language tags specified
✅ Personal voice integration points
✅ SEO keywords and internal links
✅ Frontmatter fully specified
✅ Style guidelines comprehensive
✅ Success criteria defined

**Prime artifact location:**
`.claude/agents/context/blog-prime-cursor-hacks.md`

**Plan artifact location:**
`.claude/agents/plans/blog-15-cursor-hacks-produktywnosc-ai.md`
