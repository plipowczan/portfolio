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

Przez pierwsze trzy miesiące używałem Cursor jak zwykły VS Code z autocompletem. Płaciłem **$20 miesięcznie**, żeby agent odpisywał "sure, let me help you with that" i generował kod który i tak musiałem przepisać. Brzmi znajomo?

Dopiero gdy zacząłem zagłębiać się w ukryte funkcje, zrozumiałem że większość użytkowników - ja włącznie - wykorzystuje **zaledwie 20% możliwości** tego narzędzia. To jak kupić iPhone'a i używać go tylko do dzwonienia.

Problem nie leży w Cursor. Leży w tym, że **najlepsze funkcje są ukryte**, nieintuicyjne, albo schowane głęboko w ustawieniach. A każdy dzień bez ich znajomości to stracone pieniądze, zmarnowany **context window** i frustracja.

W tym artykule pokażę Ci **16 hacków** (tak, będzie bonus) które zmieniły sposób w jaki pracuję z AI. Od podstawowych skrótów klawiszowych, które oszczędzą Ci godziny klikania, przez zaawansowane techniki jak **worktrees** do równoległego testowania wielu modeli, aż po **strukturyzację promptów** która sprawia że 80% kodu z pierwszej iteracji idzie prosto do produkcji.

Podzieliłem je na trzy poziomy trudności, więc możesz zacząć od podstaw i stopniowo odkrywać kolejne warstwy. Gotowy żeby wycisnąć 100% z subskrypcji Cursor?

## Dlaczego warto znać Cursor w 100%

Zanim przejdziemy do hacków, porozmawiajmy o słoniu w pokoju: **czy naprawdę warto się w to zagłębiać?**

**Context window** to najcenniejsza nieruchomość w świecie AI. Za każdym razem gdy włączysz niepotrzebne MCP, za każdym razem gdy agent "zapomina" co robił 20 wiadomości temu, za każdym razem gdy przekraczasz limit subskrypcji w środku sprintu - to nie bug, to twoja niewiedza jak zarządzać tym zasobem.

Za **$20 miesięcznie** (niecałe 80 zł) możesz mieć drogi autocomplete. Albo **3-5x boost produktywności** który zwraca się w pierwszy dzień miesiąca. Różnica? Wiedza o ukrytych funkcjach.

Pierwsze trzy miesiące używałem Cursor jak amator. Klikałem myszką żeby otworzyć terminal. Czekałem bezczynnie aż agent skończy, sprawdzając Instagram. Przekraczałem limity, bo nie monitorowałem zużycia. Tracąc czas na powtarzalne prompty, bo nie wiedziałem o custom commands.

Odkrywając kolejne funkcje zrozumiałem że Cursor to nie tylko editor - to **ekosystem narzędzi**. Które - gdy użyte prawidłowo - integrują się z Claude Code, worktrees, dokumentacją bibliotek i własnymi workflow. To daje przewagę której reszta po prostu nie ma.

## Poziom 1 - Podstawy (Każdy powinien znać)

Te hacki powinien znać każdy użytkownik Cursor, niezależnie od poziomu zaawansowania. Jeśli nie znasz tych rzeczy, tracisz czas i pieniądze każdego dnia.

### Hack 1: Skróty klawiszowe które zaoszczędzą godziny

Przez miesiąc klikałem myszką w terminal. Serio. Za każdym razem gdy chciałem sprawdzić output. Potem odkryłem `Cmd+J` i poczułem się jak idiota.

Skróty klawiszowe to najszybszy sposób żeby przestać walczyć z interfejsem i zacząć walczyć z problemami. Te podstawowe skróty oszczędzą Ci dosłownie **godziny klików tygodniowo**:

```text
Podstawowe skróty:
Cmd+B (Ctrl+B) - Sidebar on/off
Cmd+J (Ctrl+J) - Terminal on/off
Cmd+E (Ctrl+E) - Przełącz na agenta
Shift+Tab - Zmień tryb (Ask/Agent/Plan/Debug)
Cmd+/ (Ctrl+/) - Wybierz model
```

Najważniejsze: **`Cmd+E`** przełącza Cię między edytorem a agentem natychmiast. Nie szukasz kursorem, nie klikasz. Piszesz kod → `Cmd+E` → dajesz agentowi zadanie → `Cmd+E` → wracasz do kodu.

**`Shift+Tab`** pozwala Ci cyklicznie przełączać między trybami Ask, Agent, Plan i Debug. Większość użytkowników klika dropdown. Ty będziesz robił to w ułamku sekundy.

Zainwestuj 10 minut żeby nauczyć się tych skrótów. Zwróci Ci się to w pierwszy dzień.

⚠️ Protip: Możesz sobie pomóc za pomocą urządzenia takiego jak [Stream Deck](https://www.elgato.com/us/en/p/stream-deck). Możesz na nim stworzyć przyciski dla każdego z trybów i używać ich jako skrótów klawiszowych. Mnie to bardzo pomaga nie tylko przy wykorzystaniu skrótów, ale także przy ich nauce.

### Hack 2: Pokaż zużycie subskrypcji - nie daj się zaskoczyć limitem

Raz przekroczyłem limit w środku tygodniowego sprintu. Cursor przestał działać. Deadline nie poczekał. Nigdy więcej.

Domyślnie Cursor pokazuje **zużycie subskrypcji dopiero gdy jesteś blisko limitu**. To za późno. Nie możesz zarządzać tym czego nie widzisz.

Rozwiązanie: włącz stałe wyświetlanie usage summary.

```text
Ścieżka w ustawieniach:
Settings → Agents → Usage Summary → "Always"
```

Teraz na dole interfejsu zawsze widzisz ile kredytów zużyłeś. Możesz **świadomie decydować** kiedy używać Opus (drogi, ale genialny), a kiedy przełączyć się na Sonnet (szybki, tańszy).

Monitoruj to regularnie. Gdy zbliżasz się do **60-70% limitu** w połowie miesiąca, to sygnał że musisz:

- Przełączyć się na lżejsze modele
- Wyłączyć niepotrzebne MCP (o tym za chwilę)
- Restart konwersacji zamiast dokładania wiadomości

To prosta zmiana która może uratować Ci cały sprint.

### Hack 3: Włącz dźwięki zakończenia - przestań czekać bezczynnie

Ile razy sprawdziłeś telefon podczas gdy agent skończył 5 minut temu? Ile razy przełączyłeś się na Instagrama "na chwilę" i wróciłeś po 15 minutach? Za dużo.

Problem nie jest w Tobie. Problem jest w tym że **Cursor nie mówi Ci gdy skończy**. Siedzisz, czekasz, patrzysz. Albo robisz coś innego i gubisz momentum.

Rozwiązanie: włącz **completion sound**.

```text
Settings → General → Completion sound (włącz)
```

Teraz gdy agent skończy zadanie, usłyszysz subtelny dźwięk. Możesz sprawdzać dokumentację, pisać notatki, nawet zrobić kawę - i wrócisz dokładnie gdy Cursor będzie gotowy.

To brzmi jak detal, ale w praktyce **zmienia sposób pracy**. Zamiast bezczynnie czekać, wykorzystujesz czas. Zamiast przełączać się na rozpraszacze (Instagram, Twitter), zostanjesz w flow.

Drobna zmiana, ogromna różnica w produktywności.

### Hack 4: Early Access - dostęp do nowych funkcji miesiące wcześniej

Custom modes pojawiły się w **Early Access** 2 miesiące przed oficjalną wersją. W tym czasie użytkownicy którzy wiedzieli o tej opcji mieli dostęp do funkcji o których inni nawet nie słyszeli.

Większość użytkowników siedzi na domyślnej wersji Cursor. Czekają miesiącami na nowe funkcje, które już są dostępne - tylko ukryte za jednym przełącznikiem.

```text
Settings → Beta → Update Access → Early Access
```

Dostępne opcje:

- **Default** - stabilna wersja, opóźnione updates
- **Early Access** - nowe funkcje miesiące wcześniej, zwykle stabilne
- **Nightly** - dla deweloperów, może być buggy

Z mojego doświadczenia, **Early Access to najlepsza opcja**. Dostajesz nowe funkcje znacznie wcześniej, a stabilność jest w 95% przypadków idealna. Jedyne co ryzykujesz to okazjonalny bug - który zwykle jest naprawiony w ciągu dni.

Dlaczego większość nie wie o tej opcji? Bo jest schowana w Beta settings. Bo Cursor nie krzyczy o tym. Bo zakłada się że jesteś zadowolony z domyślnych ustawień.

Nie bądź zadowolony z domyślnych ustawień. Przełącz się na Early Access i bądź o krok przed resztą.

### Hack 5: Wiele okien - pracuj nad dwoma projektami jednocześnie

To nie jest odkrywczy hack - większość editorów ma tę funkcję. Ale wiele osób nie zdaje sobie sprawy że mogą mieć **kilka projektów otwartych jednocześnie** z niezależnymi konwersacjami AI.

**File → New Window** otwiera nową instancję Cursor. Każda z własnym projektem, własnym agentem, własnym context window.

**Use cases:**

- Referencujesz stary projekt podczas budowy nowego
- Kopiujesz pattern z jednego projektu do drugiego bez przełączania kontekstu
- Pracujesz nad wieloma klientami jednocześnie
- Porównujesz implementacje między projektami

**Uwaga:** Każde okno = osobna instancja w pamięci. Jeśli masz **8GB RAM**, dwa okna mogą być już na granicy. Z **16GB+** możesz swobodnie otworzyć 3-4 projekty.

Nie robi to takiej różnicy jak worktrees (o tym później). Ale przydatne gdy pracujesz nad wieloma projektami. Szczególnie gdy chcesz **skopiować pattern** z jednego projektu do drugiego bez przełączania kontekstu i gubienia wątku konwersacji z agentem.

Proste, skuteczne, niedoceniane.

## Poziom 2 - Średniozaawansowany

Tutaj zaczyna się magia. Te techniki odróżniają tych, którzy znają Cursor, od tych którzy go **opanowali**.

### Hack 6: Zarządzaj MCP - nie marnuj context window

Raz miałem **6 MCP włączonych** jednocześnie. Context window wypalał się w 10 wiadomości. Agent "zapominał" co robiliśmy na początku konwersacji. Musiałem restartować co 15 minut.

**MCP** (Model Context Protocols) to integracje które rozszerzają możliwości agenta. Browser automation, terminal access, file operations - każde MCP dodaje nowe supermoce.

Problem? **Każde aktywne MCP zjada ogromny kawałek context window**. Nawet gdy go nie używasz. Po prostu swoją obecnością.

Strategia:

```text
Rekomendowany setup MCP:
✅ Browser Automation (często przydatne)
❌ Pozostałe (włącz tylko gdy potrzeba)

Ścieżka: Settings → Tools & MCP → [MCP Name] (wyłącz)
```

**Default approach (błędny):** Włącz wszystkie MCP "na wszelki wypadek". Miej pełną paletę narzędzi.

**Pro approach:** **Disable all** na starcie projektu. Włącz konkretne MCP dopiero gdy faktycznie je potrzebujesz. Agent powie Ci gdy będzie czegoś potrzebował.

Praktycznie jedyne MCP które zostawiam włączone zawsze to **Browser Automation** - bo często pracuję z UI testing i automatyzacją. Reszta? Włączam on-demand.

Ta zmiana w podejściu **zwiększyła długość moich konwersacji z agentem 2-3x**. Mniej restartów, lepsza pamięć kontekstu, płynniejszy flow.

### Hack 7: Własne komendy - przestań powtarzać te same prompty

Mam **8 custom commands**. Najczęściej używam `/prime` (ładuje kontekst projektu) i `/package-health` (sprawdza dependencies). Wcześniej wpisywałem te same prompty ręcznie. Teraz? Dwa znaki.

**Slash commands** to reusable prompt templates. Piszesz raz, używasz setki razy.

**Jak stworzyć:**

1. Wpisz `/` w agencie
2. Wybierz **"Create command"**
3. Napisz prompt template
4. Zapisz w `.cursor/commands/` lub `.claude/commands/`

Przykład:

```bash
# Przykład custom command: Package Health Check
# Plik: .cursor/commands/package-health.md

Scan node_modules and package.json for:
- Security vulnerabilities
- Outdated dependencies
- Breaking changes in recent versions
Report findings with severity levels.
```

Teraz wpisujesz `/package-health` i agent dokładnie wie co zrobić. Żadnych wyjaśnień, żadnego kontekstu - sam wykonuje rutynową inspekcję.

**Pro tip:** Możesz **importować commands z Claude Code**.

```text
Settings → Rules and Commands → Import Claude commands
```

Claude Code ma gotowe komendy które możesz zaadaptować. Nie wymyślaj koła na nowo.

**Kiedy stworzyć komendę?** Jeśli robisz coś więcej niż 2x, zamiast kopiować prompt - stwórz komendę. Proste. Efektywne. Game-changing.

### Hack 8: Zarządzanie kontekstem - reguła 60%

Powyżej **60% zapełnienia context window** agent zaczyna "zapominać" wcześniejszych instrukcji. To nie subiektywne wrażenie - to empirycznie sprawdzone.

AI świetnie pamięta **początek i koniec** konwersacji. Słabo pamięta **środek**. To tzw. "lost in the middle" problem.

Cursor pokazuje **context window indicator** poniżej pola tekstowego wiadomości, obok opcji agenta. Monitoruj go jak jastrząb:

```text
Strategia context management:
< 40% - Kontynuuj swobodnie
40-60% - Szukaj naturalnego breakpoint
> 60% - Rozważ restart (nowa konwersacja)
> 80% - Definitywnie restart
```

**Naturalny breakpoint** to moment gdy:

- Skończyłeś feature i commitowałeś
- Przełączasz się na inny obszar projektu
- Agent wykonał zadanie i jest "gotowy" na nowe wyzwanie

**Dwie strategie restartu:**

1. **Summary approach:** Poproś agenta o podsumowanie konwersacji, skopiuj do nowej. Dobre gdy masz skomplikowany kontekst który chcesz przenieść.
2. **Fresh start:** Po prostu zacznij nową konwersację. Dobre gdy kontekst był specyficzny dla jednego zadania i nie będzie potrzebny.

Ja używam głównie **fresh start**. Mniej overhead, czysty umysł, agent bez bagażu z przeszłości.

Pamiętaj: **60% to soft limit**. Możesz iść wyżej, ale jakość odpowiedzi zaczyna spadać. 80% to hard limit - poza tym wszystko się sypie.

### Hack 9: Indeksuj dokumentację - pełna wiedza o bibliotekach w Cursor

**Tailwind CSS v4** wyszedł kilka miesięcy temu. Agent ciągle mylił składnię, proponował przestarzałe klasy. Frustracja level max.

Zaindeksowałem oficjalną dokumentację Tailwind v4 w Cursor. Problem zniknął. Agent znał nową składnię lepiej niż ja.

**Dodawanie dokumentacji:**

```text
1. Znajdź official docs URL (np. https://tailwindcss.com/docs)
2. Settings → Indexing and Docs → Add Doc
3. Wklej URL → Confirm
4. Użyj: @ → Docs → [Nazwa biblioteki]
```

Cursor **zeskrapuje i indeksuje całą dokumentację**. Przykład: Tailwind docs to **439 stron** które agent ma w pamięci. Za każdym razem gdy użyjesz `@ Docs → Tailwind CSS`, agent ma dostęp do pełnej, aktualnej dokumentacji.

**Dlaczego to robi różnicę:**

- **Cutoff window problem solved:** Agent nie jest ograniczony do wiedzy sprzed stycznia 2025
- **Aktualne API:** Nowe frameworki, nowe wersje bibliotek - agent zna aktualną składnię
- **Zero halucynacji:** Zamiast "wymyślać" API, czyta z oficjalnej dokumentacji

**Pro tip:** Zaindeksuj dokumentację bibliotek których używasz regularnie. Dla mnie to:

- Tailwind CSS
- React (szczególnie nowe hooki)
- Convex
- Framer Motion

Agent przestaje być "ogólnym AI" i staje się **ekspertem w Twoim stack'u**.

### Hack 10: Agent steering - przejmij kontrolę w locie

Wyobraź sobie: agent pisze komponent. W połowie realizujesz że chcesz dodać jeszcze jedną funkcję. Czekasz aż skończy? Przerywasz i zaczynasz od nowa?

Są lepsze opcje.

**Agent steering** to możliwość wysyłania wiadomości gdy agent pracuje. Albo czekasz aż skończy, albo przerywasz natychmiast.

**Gdzie znaleźć:**

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

**"Send after current message"** używam **najczęściej**. Agent kończy obecne zadanie (np. komponent), potem automatycznie przechodzi do kolejnego z listy (np. testy do tego komponentu). Efektywny kolejkowanie bez mikro-managementu.

**"Stop & send right away"** używam **tylko** gdy:

- Agent poszedł w złym kierunku i każda sekunda to strata
- Zmieniły się wymagania i obecne zadanie już nie ma sensu
- Potrzebuję natychmiastowej odpowiedzi na pytanie

**Caveat:** Nadużywanie "Stop & send" powoduje chaos. Agent gubił się w kontekście. Frustracja rośnie. Używaj rzadko i tylko gdy naprawdę musisz zmienić kierunek.

**Pro workflow:** Planujesz listę zadań. Pierwszą wysyłasz normalnie. Kolejne queue'ujesz przez "Send after current message". Agent pracuje jak maszyna przez kolejne zadania, a Ty możesz przełączyć się na coś innego.

## Poziom 3 - Pro Features

To są funkcje, o których większość użytkowników nie wie że istnieją. Ale profesjonaliści używają ich **codziennie**.

### Hack 11: Worktrees - testuj wiele rozwiązań równolegle

**Worktrees** to funkcja która brzmi skomplikowanie, ale zmienia wszystko. Pozwala Ci **testować 3 różne podejścia jednocześnie** bez czekania na kolejne iteracje.

**Czym są worktrees:**

**Git worktrees** to izolowane kopie projektu na osobnych branchach. Cursor wykorzystuje ten mechanizm do równoległego testowania wielu rozwiązań. Każda wersja pracuje w swojej kopii kodu, bez konfliktów. Po zakończeniu wybierasz najlepsze rozwiązanie i przenosisz do głównego brancha.

**Jak to działa krok po kroku:**

1. **Start:** Otwierasz chat z agentem w Cursor
2. **Wybór trybu:** Poniżej pola tekstowego widzisz opcje: **Local / Worktree / Cloud** - wybierasz **Worktree**
3. **Wybór modelu:** Klikasz w pole wyboru modelu
4. **Multiple models lub mnożnik:** Teraz masz dwie opcje:
   - **Multiple models:** Zaznacz "use multiple models" i wybierz różne modele (np. Composer + Sonnet + GPT-4o)
   - **Mnożnik:** Wybierz jeden model i ustaw mnożnik 2x, 3x lub 4x (np. 3x Claude Sonnet - dostaniesz 3 różne wersje od tego samego modelu)
5. **Automatyczny setup:** Cursor tworzy git worktree dla każdej wersji, kopiuje projekt, uruchamia serwery na osobnych portach
6. **Równoległa praca:** Wszystkie wersje pracują jednocześnie nad tym samym zadaniem
7. **Preview:** Sprawdzasz rezultaty na różnych portach (localhost:3001, 3002, 3003)
8. **Apply:** Wybierasz najlepsze rozwiązanie → Apply → zmiany trafiają do głównego brancha

**Setup trick - autostart serwerów:**

```json
// .cursor/worktrees.json - automatyczny setup
// Umieść w głównym katalogu projektu
{
  "commands": [
    "npm install", // Instaluje dependencies w worktree
    "npm run dev" // Uruchamia dev server automatycznie
  ]
}
```

**Praktyczny workflow:**

```bash
# Praktyczny przykład użycia worktrees:

# 1. Masz zadanie: "Add dark mode toggle with smooth transition"
# 2. Chat z agentem → wybierz "Worktree" (zamiast Local/Cloud)
# 3. Kliknij wybór modelu → zaznacz "use multiple models"
# 4. Wybierz: Composer + Sonnet + GPT-4o (lub ustaw 3x Sonnet dla różnorodności)
# 5. Cursor automatycznie:
#    - Tworzy branch-wt-composer-xyz
#    - Tworzy branch-wt-sonnet-abc
#    - Tworzy branch-wt-gpt4o-def
#    - Uruchamia npm install + npm run dev w każdym
# 6. Po 2-3 minuty masz 3 działające wersje:
#    - localhost:3001 (Composer) - minimalistyczny przełącznik
#    - localhost:3002 (Sonnet) - animowany slider z ikonkami
#    - localhost:3003 (GPT-4o) - toggle z preview kolorów
# 7. Otwierasz wszystkie 3 w przeglądarce, porównujesz
# 8. Sonnet wygląda najlepiej → Review changes → Apply
# 9. Zmiany trafiają do głównego brancha, worktrees są czyszczone
```

**Dlaczego to robi różnicę:**

- **Design choices:** 3 modele = 3 różne podejścia wizualne, wybierasz najlepsze
- **Refactoring:** różne strategie implementacji, porównujesz jakość kodu
- **Bug fixes:** widzisz które podejście jest najbardziej eleganckie
- **Zero strat czasu:** Bez worktrees czekałbyś 15 minut na 3 iteracje. Z worktrees? 5 minut i masz wszystkie wersje jednocześnie.

**Real use case z mojego workflow:**

Design changes - puszczam 3 modele jednocześnie. W 5 minut widzę 3 różne podejścia wizualne. Bez worktrees musiałbym czekać 15 minut na kolejne iteracje, a każda następna byłaby "kontaminowana" feedbackiem z poprzedniej.

**Kiedy NIE używać worktrees:**

- Proste bugfixy (overkill)
- Jasne wymagania (jeden model wystarczy)
- Ograniczone kredyty (3 modele = 3x koszt)

Worktrees to bazooka. Używaj tylko gdy potrzebujesz bazooki 😉

### Hack 12: Dwu-modelowy workflow - GPT-5.2 planuje, Claude wykonuje

**GPT-5.2 High** to najlepszy model do planowania. Tworzy szczegółowe, przemyślane plany które uwzględniają edge case'y i architekturę.

Jest tylko jeden problem: jest **wolny jak cholera** przy implementacji.

**Claude Sonnet** jest szybki przy kodowaniu. Decent przy planowaniu, ale nie na poziomie GPT-5.

Rozwiązanie? **Użyj obu**.

```text
Optymalny workflow:
1. Plan Mode → GPT-5.2 High (plan)
2. Po planie: Przełącz model → Claude 4.5 Sonnet
3. Kliknij "Build"
Rezultat: Najlepszy plan + szybka implementacja
```

**Jak to działa:**

1. Dajesz zadanie w **Plan Mode**
2. Wybierasz **GPT-5.2 High** jako model
3. Czekasz (tak, to trwa) aż GPT stworzy szczegółowy plan
4. **ZANIM klikniesz "Build"** - przełączasz model na **Claude 4.5 Sonnet**
5. Teraz klikasz "Build"
6. Claude implementuje plan GPT - szybko i efektywnie

**Rezultat:** Dostajesz **dokładność planowania GPT** + **szybkość implementacji Claude**. Oszczędzam tym trickiem **70% czasu** w porównaniu do używania samego GPT do build, albo samego Claude do planu.

**Caveat:** GPT-5.2 zżera sporo kredytów. Używaj tej techniki do **większych features**, nie do mikro-tasków. Dla prostych rzeczy Claude sam wystarczy.

To najlepszy przykład tego że **wybór modelu nie musi być decyzją "albo-albo"**. Możesz łączyć silne strony różnych modeli w jednym workflow.

### Hack 13: Strukturyzacja promptów - user stories i design patterns

**Problem:** Większość developerów pisze prompty ad-hoc. "Add login". "Fix this bug". "Make it prettier". Agent dostaje niejasne wymagania i generuje generyczny kod.

Zanim odkryłem strukturyzację promptów, **50% pierwszych iteracji z AI było do wyrzucenia**. Kod działał technicznie, ale nie spełniał wymagań. Bo wymagania były niejasne.

**Rozwiązanie:** Strukturyzuj prompty według wzorców, których AI są trenowane - **user stories** i **design patterns**.

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

- AI są **trenowane na user stories** z GitHub/Jira - to ich native language
- Format **wymusza jasność wymagań** - nie możesz być vague
- **Acceptance criteria = built-in testing checklist** - agent wie kiedy skończył
- **Technical context eliminuje halucynacje** - agent referencuje istniejący kod

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

**Real Examples - Bad vs Good:**

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

Widzisz różnicę? **Bad prompt** to zgadywanka. Agent musi założyć 10 rzeczy. **Good prompt** to instrukcja obsługi. Agent wie dokładnie co zrobić, jak, i co znaczy "skończone".

Teraz **80% kodu z pierwszej iteracji idzie do produkcji**. Nie dlatego że AI stało się lepsze. Dlatego że ja stałem się lepszy w komunikacji z AI.

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

Agent dostaje visual reference + technical context. Rezultat? Pixel-perfect implementation z pierwszej próby.

**Kiedy używać strukturyzacji:**

- ✅ Nowe features (user stories)
- ✅ Refactoring (design patterns)
- ✅ Design implementation (image-to-code)
- ❌ Proste bugfixy (overkill)
- ❌ Eksploracyjne zadania (za dużo strukty krępuje kreatywność)

### Hack 14: @ command power features - kontekst na wyciągnięcie ręki

Zamiast opisywać słowami "ten plik z auth", wpisuję `@ → Files → AuthContext.jsx` i agent od razu ma pełny kontekst. Zero friction.

**@ command** to szybki sposób dodawania kontekstu do agenta. Nie musisz copy-paste kodu, nie musisz opisywać - po prostu wskazujesz.

**Dostępne opcje:**

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

**Use cases:**

- **Files:** "Sprawdź ten plik zanim zasugerujesz zmiany" → `@ Files → auth.js`
- **Docs:** "Użyj oficjalnej dokumentacji Tailwind v4" → `@ Docs → Tailwind CSS`
- **Branch:** "Pokaż co się zmieniło od main brancha" → `@ Branch (Diff with main)`
- **Browser:** "Zaimplementuj design z tej strony" → `@ Browser`

**Pro tip:** Możesz dodać **wiele kontekstów naraz**:

"Zaimplementuj authentication flow similar to auth.js, using Clerk docs, based on the changes in current branch"

`@ Files → auth.js` + `@ Docs → Clerk` + `@ Branch`

Agent ma **full picture**. Nie zgaduje, nie halucynuje. Po prostu implementuje zgodnie z tym co widzi.

### Hack 15: Duplicate - klonuj dobrze przygotowany kontekst

Przez **rok** używałem Cursor i nie wiedziałem że to istnieje. Schowane głęboko w widoku zarządzania agentami.

**Use case:** Spędziłeś 30 minut na "primingu" agenta. Załadowałeś docs, rules, kontekst projektu. Agent rozumie codebase idealnie. Teraz chcesz zaimplementować **3 powiązane features** z tym samym fundamentem.

Opcja A: Re-prime agenta 3 razy. 90 minut zmarnowanych.

Opcja B: **Duplicate**. 3 kliki.

**Gdzie znaleźć:**

```text
Workflow z duplicate:
1. Prime agent: załaduj docs, rules, kontekst projektu
2. Gdy agent dobrze rozumie codebase
3. Przejdź do widoku zarządzania agentami (lista wszystkich agentów)
4. Znajdź agenta którego chcesz sklonować
5. Kliknij ... (trzy kropki) obok tego agenta
6. Wybierz "Duplicate"
7. Nowy agent z identycznym kontekstem
8. Implementuj kolejną feature bez powtarzania primingu

⚠️ Jeśli duplikat nie działa: restart Cursor
```

**UWAGA:** NIE znajdziesz tej opcji w menu `...` bezpośrednio w agent pane podczas rozmowy. Musisz przejść do **widoku zarządzania agentami** (lista wszystkich agentów w sidebarze).

### BONUS Hack 16: .cursorignore manipulation - niebezpieczny ale przydatny

⚠️ **OSTRZEŻENIE: Używaj TYLKO w środowisku testowym. NIGDY w produkcji.**

`.cursorignore` kontroluje co AI może widzieć. Domyślnie blokuje pliki `.env` i `.env.local` dla bezpieczeństwa. I słusznie - **nie chcesz** żeby API keys trafiły do konwersacji z AI.

Ale czasami - w **testowym repo z dummy credentials** - chcesz żeby agent mógł **zwalidować setup zmiennych środowiskowych**.

**Hack:**

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

Prefiks `!` neguje regułę. Agent teraz widzi `.env.local`.

**Use case:** Agent może sprawdzić czy masz wszystkie potrzebne zmienne, czy nazwy są poprawne, czy wartości mają odpowiedni format (oczywiście nie widzi samych wartości produkcyjnych - bo to TEST REPO).

**Personal warning:** Nigdy nie rób tego w produkcji. Tylko w testowym repo gdzie klucze są dummy. Jeśli masz wątpliwości - **nie rób tego w ogóle**.

Pokazuję ten hack dla kompletności. Ale używaj z rozwagą.

## Bonus Tips - Szybkie Wskazówki

Te nie zmieściły się w Top 15, ale używam ich regularnie:

- **Split terminals:** Hover nad terminalem, kliknij ikonę split. Dwa terminale obok siebie - np. jeden dla dev server, drugi dla git commands.
- **Auto theme switching:** Editor Settings → Auto detect color scheme. Cursor przełącza się między jasnym/ciemnym motywem razem z systemem. Drobny detail, ale wygodny.
- **Generate cursor rules from docs:** Slash command który wyciąga rules bezpośrednio z dokumentacji projektu. Zamiast pisać ręcznie, agent sam buduje `.cursorrules` na bazie README i CONTRIBUTING.
- **Design mode for prototyping:** Custom command który każe agentowi używać tylko mock data. Idealne do prototypowania UI bez backendowej infrastruktury.
- **Agent review:** Automated code review on commit. Agent sprawdza kod przed commitem i flaguje potencjalne problemy. Działa jak pre-commit hook z AI.

Każdy z tych tricks to oszczędność kilku minut dziennie. Razem - godziny tygodniowo.

## Kluczowe wnioski

Po przejściu przez wszystkie 16 hacków, czas na podsumowanie tego co naprawdę ma znaczenie:

1. **Skróty klawiszowe oszczędzają godziny** - `Cmd+J`, `Cmd+E`, `Shift+Tab` to absolutna podstawa. Przestań klikać, zacznij używać klawiatury.
2. **Context window to cenny zasób** - Zarządzaj MCP, resetuj konwersację po 60%, bądź świadomy kosztów. Każda niewykorzystana wiadomość to zmarnowane pieniądze.
3. **Custom commands eliminują powtarzanie** - Jeśli robisz coś więcej niż 2x, stwórz komendę. Proste jak konstrukcja cepa.
4. **Dokumentacja w Cursor = superpowers** - Zaindeksuj biblioteki których używasz. Agent przestaje zgadywać i zaczyna **wiedzieć**.
5. **Strukturyzuj prompty jak profesjonaliści** - User stories i design patterns = 80% kodu z pierwszej iteracji do produkcji. Największa zmiana w moim workflow.
6. **Advanced features nie są intuicyjne** - Worktrees, strukturyzacja promptów, duplicate chat są **ukryte**, ale game-changing. Musisz ich świadomie szukać.
7. **ROI z subskrypcji rośnie z wiedzą** - **$20/miesiąc** to mało lub dużo w zależności od tego jak używasz. Po zastosowaniu tych hacków, zwrot pojawia się pierwszego dnia miesiąca.

## Następne kroki

Nie próbuj wdrożyć wszystkiego naraz. To droga do porażki. Zamiast tego:

**Dzisiaj (10 minut):**

- Włącz **usage summary** (Settings → Chat → Always)
- Włącz **early access** (Settings → Beta)
- Włącz **completion sounds** (Settings → General)

**Ten tydzień (1 godzina):**

- Naucz się skrótów: `Cmd+J`, `Cmd+E`, `Shift+Tab`
- Sprawdź które **MCP** masz włączone, wyłącz niepotrzebne
- Zacznij monitorować **context window** - resetuj po 60%

**Ten miesiąc (3-4 godziny):**

- Stwórz pierwszą **custom komendę** dla powtarzalnego zadania
- Zaindeksuj dokumentację głównej biblioteki z Twojego stacku
- Zacznij strukturyzować prompty w formacie **user stories**

**Za miesiąc (eksperymentuj):**

- Wypróbuj **worktrees** przy następnej design decision
- Przetestuj **dwu-modelowy workflow** (GPT plan + Claude build)
- Zagłęb się w **advanced prompt patterns**

Te hacki zmieniły sposób w jaki pracuję z AI. Zaczynałem od podstaw i stopniowo odkrywałem kolejne warstwy. **Ty możesz przejść tę drogę szybciej** - bo masz ten przewodnik.

Powodzenia. I pamiętaj - **$20 miesięcznie** to inwestycja, nie koszt. Pod warunkiem że wiesz jak to wykorzystać.

---

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz maksymalnie wykorzystać AI w kodowaniu?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci zoptymalizować workflow z AI coding assistants, zbudować custom automation i szkolenia dla zespołu. Od strategii przez implementację po advanced techniques.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Przydatne zasoby

- [Cursor Documentation](https://cursor.com/docs) - Oficjalna dokumentacja
- [5 technik pracy z Claude Code](/blog/5-technik-pracy-z-claude-code) - Komplementarny artykuł o Claude Code
- [Cursor Community Discord](https://discord.gg/cursor) - Społeczność użytkowników
- [GitHub: claude-piv-skeleton](https://github.com/plipowczan/claude-piv-skeleton) - Workflow methodology z custom commands

## FAQ

<details open>
<summary>

### Czy subskrypcja Cursor za $20 miesięcznie opłaca się początkującym programistom i jak szybko się zwraca?

</summary>

Tak, subskrypcja zwraca się błyskawicznie dzięki dostępowi do funkcji Pro jak worktrees, nielimitowany Claude 3.5 Sonnet i tryb Composer. Nawet początkujący zyskują godziny tygodniowo, unikając manualnego debugowania i pisania boilerplate kodu. Koszt $20 to inwestycja w produktywność, a nie tylko wydatek na narzędzie.

</details>

<details open>
<summary>

### Jakie skróty klawiszowe w Cursor są najważniejsze dla zachowania płynności pracy i flow z AI?

</summary>

Absolutnym minimum jest `Cmd+E` do przełączania między kodem a agentem oraz `Shift+Tab` do szybkiej zmiany trybów (Ask/Agent/Plan). Warto też używać `Cmd+J` do togglowania terminala, co eliminuje odrywanie rąk od klawiatury. Te skróty pozwalają traktować AI jak naturalne rozszerzenie edytora.

</details>

<details open>
<summary>

### Jak skutecznie zarządzać limitem context window w Cursor aby uniknąć problemów z pamięcią agenta?

</summary>

Kluczem jest monitorowanie wskaźnika użycia i resetowanie czatu po przekroczeniu 60% pojemności, co zapobiega halucynacjom modelu. Należy też wyłączać nieużywane MCP w ustawieniach, ponieważ każdy aktywny dodatek konsumuje cenne tokeny. Precyzyjne używanie `@Files` zamiast całych folderów również oszczędza kontekst.

</details>

<details open>
<summary>

### Na czym polega praca z worktrees w Cursor i w jakich sytuacjach najlepiej ją stosować?

</summary>

Worktrees umożliwiają równoległe generowanie i testowanie kilku wariantów kodu (np. przez różne modele AI) na izolowanych branchach. Cursor automatycznie stawia środowiska dla każdej wersji, co pozwala w kilka minut porównać np. trzy podejścia do UI. To idealne narzędzie do eksperymentowania i podejmowania decyzji architektonicznych.

</details>

<details open>
<summary>

### Dlaczego warto dodawać własną dokumentację do indeksu Cursor zamiast polegać na ogólnej wiedzy modelu?

</summary>

Modele AI często mają nieaktualną wiedzę o najnowszych wersjach bibliotek (np. Tailwind v4), co prowadzi do generowania błędnego kodu. Dodanie URL dokumentacji w "Docs" sprawia, że agent korzysta z "single source of truth" i nie zmyśla nieistniejących funkcji. To eliminuje problem "cutoff date" i poprawia jakość generowanego kodu.

</details>
