---
id: 16
slug: second-brain-obsidian-claude-code-skills
title: "Second Brain z Obsidian i Claude Code - jak AI zmienia organizację wiedzy"
excerpt: "Odkryj jak połączenie Obsidian, Claude Code i Skills tworzy potężny system zarządzania wiedzą. Praktyczny przewodnik po budowie prywatnego second brain."
category: AI
author: Pawel Lipowczan
date: 2026-01-26
readTime: 14 min
image: /images/og-second-brain-obsidian-claude-code-skills.webp
tags:
  - AI
  - Claude Code
  - Obsidian
  - Second Brain
  - Skills
  - Produktywność
---

Claude Code to nie tylko narzędzie do kodowania. Brzmi jak clickbait, ale to jedna z najważniejszych rzeczy, które zrozumiałem w ostatnich miesiącach. Odkryłem to dzięki Cole Medin i jego podejściu do używania Claude Code dosłownie do wszystkiego - od zarządzania notatkami po generowanie contentu.

Problem, który pewnie znasz: notatki rozrzucone po dziesiątkach narzędzi, historia czatów z AI znika po każdej sesji, a przełączanie między aplikacjami zabija produktywność. Szukałem sposobu na **organizację wiedzy**, który nie wymaga ciągłego ręcznego porządkowania.

W tym artykule pokażę Ci jak połączenie **Obsidian**, **Claude Code** i **Skills** tworzy potężny system zarządzania wiedzą. To nie teoria - używam tego setup'u codziennie. Na końcu będziesz mieć wszystko co potrzebne, żeby zbudować własny **second brain** z AI w centrum.

## Czym jest Second Brain i dlaczego go potrzebujesz

**Second Brain** to zewnętrzny system do przechowywania i organizacji wiedzy. Koncepcja wywodzi się z **PKM (Personal Knowledge Management)** - podejścia do świadomego zbierania, organizowania i wykorzystywania informacji.

Tradycyjny second brain opiera się na trzech funkcjach:

- **Capture** - szybkie przechwytywanie myśli, notatek, pomysłów
- **Organize** - kategoryzacja i łączenie informacji
- **Retrieve** - odnajdywanie wiedzy gdy jej potrzebujesz

Problem? Te trzy funkcje wymagają dużo manualnej pracy. Musisz sam decydować gdzie umieścić notatkę, jakie tagi dodać, jak połączyć z innymi dokumentami.

AI zmienia zasady gry. Zamiast ręcznie organizować, możesz **poprosić Claude Code o przetworzenie notatek**. Zamiast szukać połączeń samemu, AI analizuje Twój vault i znajduje powiązania. Zamiast tworzyć dokumenty od zera, generujesz je z istniejących notatek.

Second brain z AI to nie tylko miejsce do przechowywania wiedzy. To **system, który aktywnie pomaga Ci z tej wiedzy korzystać**.

## Dlaczego Obsidian i Claude Code to idealne połączenie

### Obsidian jako fundament

**Obsidian** to edytor notatek oparty na plikach markdown. Kluczowe cechy które czynią go idealnym fundamentem:

- **Pliki lokalne** - notatki to zwykłe pliki `.md` na Twoim komputerze
- **Offline-capable** - nie potrzebujesz internetu żeby pracować
- **Markdown** - format który LLM-y rozumieją najlepiej
- **Graph view** - wizualizacja połączeń między notatkami
- **Brak vendor lock-in** - pliki są Twoje, możesz je otworzyć w dowolnym edytorze

To ostatni punkt jest kluczowy. W przeciwieństwie do Notion czy Evernote, Twoje notatki w Obsidian to **zwykłe pliki tekstowe**. Claude Code może je bezpośrednio czytać, edytować i tworzyć nowe.

### Claude Code jako mózg

**Claude Code** to CLI do pracy z Claude. Ale to znacznie więcej niż narzędzie do kodowania. Jego możliwości wykraczają daleko poza pisanie kodu:

- **File operations** - czytanie, edycja, tworzenie plików
- **Search** - przeszukiwanie zawartości i struktury projektu
- **Terminal commands** - uruchamianie skryptów, narzędzi
- **Web search** - research bezpośrednio z terminala

Tylko **code intelligence** (rozumienie składni, sugestie refactoringu) jest specyficzne dla kodowania. Reszta? To uniwersalne możliwości asystenta AI który ma dostęp do Twojego systemu plików.

### Razem - coś więcej niż suma części

Połączenie Obsidian + Claude Code daje coś, czego nie osiągniesz z innymi narzędziami. Notion wymaga MCP servera żeby połączyć się z AI. Obsidian? Claude Code po prostu otwiera folder i czyta pliki.

To oznacza:

- **Bezpośredni dostęp** do wszystkich notatek bez dodatkowej konfiguracji
- **AI przetwarza Twoją bazę wiedzy** - tworzy podsumowania, łączy idee
- **Strukturyzowane outputy** z chaotycznych notatek
- **Automatyczne połączenia** między dokumentami

Przykładowa struktura folderu second brain:

```text
obsidian-vault/
├── 00-inbox/           # Quick captures
├── 01-projects/        # Active projects
├── 02-areas/           # Ongoing responsibilities
├── 03-resources/       # Reference material
├── 04-archive/         # Completed items
├── templates/          # Document templates
└── .claude/
    └── skills/         # Claude Code skills
```

Ta struktura oparta jest na **PARA method** (Projects, Areas, Resources, Archive). Folder `.claude/skills/` to miejsce gdzie definiujesz capabilities dla Claude Code.

## Skills - jak rozszerzyć możliwości swojego second brain

**Skills** to trzeci filar systemu który wszystko spaja. To sposób na dawanie Claude Code wiedzy, procesów i wytycznych specyficznych dla Twojego workflow.

### Co to są Skills

Skills to pliki markdown definiujące workflow. Zawierają:

- Opis kiedy skill ma być użyty (trigger)
- Instrukcje krok po kroku
- Referencje do innych plików (templates, style guides)
- Przykłady użycia

Skill jest **ładowany dynamicznie** gdy Claude Code wykryje że jest potrzebny. Nie musisz go wywoływać ręcznie - po prostu opisujesz co chcesz zrobić.

### Progressive Disclosure - klucz do efektywności

To koncepcja która odróżnia skills od innych podejść do rozszerzania AI.

Problem z MCP servers: ładują **wszystkie narzędzia z góry**. Jeśli masz 50 narzędzi, wszystkie ich opisy zajmują miejsce w context window. To **context bloat** - marnujesz cenne miejsce na rzeczy których nie używasz.

Skills działają inaczej dzięki **progressive disclosure**:

1. **Description** - krótki opis zawsze widoczny (jedna linijka)
2. **SKILL.md** - pełne instrukcje ładowane tylko gdy potrzebne
3. **Reference files** - dodatkowe zasoby ładowane dla konkretnych operacji

To oznacza że możesz mieć **setki skills** bez przytłaczania context window. Agent specjalizuje się per sesja - ładuje tylko to co potrzebuje.

### Struktura skill'a

```text
.claude/skills/
└── document-generator/
    ├── SKILL.md           # Main instructions
    ├── assets/
    │   └── templates/     # Document templates
    └── references/
        └── style-guide.md # Style guidelines
```

Przykładowy plik SKILL.md:

```yaml
---
name: document-generator
description: Generate structured documents from notes. Use when user asks to create summaries, outlines, or formatted documents from their knowledge base.
---

# Document Generator

## Triggers
- "create a summary of..."
- "generate a document from..."
- "summarize my notes on..."

## Workflow
1. Read source notes from specified location
2. Analyze key concepts and structure
3. Apply template from `assets/templates/`
4. Generate document following style guide
5. Save to specified location

## Templates Available
- `meeting-notes.md` - Meeting summary template
- `project-brief.md` - Project overview template
- `article-draft.md` - Blog article draft template
```

## Praktyczne przykłady Skills dla second brain

### Research Engine

Skill do zbierania informacji z internetu i zapisywania strukturyzowanych notatek.

**Co robi:**

- Przeszukuje web na zadany temat
- Zbiera kluczowe informacje i źródła
- Tworzy notatkę w formacie markdown
- Zapisuje do odpowiedniego folderu w vault

**Przykład użycia:** "Research the latest developments in AI agents and save notes to 03-resources/ai-agents/"

### Document Generator

Transformuje surowe notatki w dopracowane dokumenty.

**Co robi:**

- Czyta wskazane notatki źródłowe
- Analizuje strukturę i kluczowe koncepty
- Aplikuje template i style guide
- Generuje gotowy dokument

**Przykład:** Notatki ze spotkania → dokument z action items i podsumowaniem.

### Daily Review

Automatyzuje przegląd dnia.

**Co robi:**

- Skanuje notatki z dzisiaj
- Tworzy podsumowanie dnia
- Identyfikuje połączenia z istniejącą wiedzą
- Sugeruje next actions

### Content Creator

Generuje content na podstawie notatek z vault'a.

**Co robi:**

- Analizuje notatki na dany temat
- Generuje pomysły na content
- Tworzy drafty (artykuły, posty, scripts)
- Utrzymuje spójny głos i styl

Przykład jak wygląda trigger research skill:

```text
User: "Research the latest developments in AI agents and
       save notes to 03-resources/ai-agents/"

Claude Code:
1. Loads research-engine skill
2. Searches web for recent AI agent news
3. Creates structured note with sources
4. Saves to specified folder
5. Links to related existing notes
```

## Łączenie second brain z innymi narzędziami przez MCP

**MCP (Model Context Protocol)** to sposób na łączenie Claude Code z zewnętrznymi serwisami. Możesz połączyć się z Gmail, kalendarzem, task managerami.

Problem? MCP servers ładują wszystkie narzędzia z góry - to ten sam problem context bloat który rozwiązują skills.

### Dwa podejścia do integracji

**1. MCP servers** - bezpośrednie połączenie z usługami

- Gmail/Outlook - przez biblioteki lub serwery MCP
- Google Calendar - MCP server
- ClickUp - MCP server lub API

**2. Skills ze skryptami** (moje preferowane podejście)

- Piszesz własne skrypty w Python/Node.js
- Dodajesz je do skills jako narzędzia
- Pełna kontrola nad logiką
- Wszystko w jednym miejscu (w vault)

### Dlaczego wolę skrypty w skills

Make.com pozwala wystawić scenariusze jako narzędzia MCP. Ale to dodatkowa warstwa. Skrypty w skills są szybsze, prostsze do debugowania, i wszystko mam w jednym miejscu.

Przykład skill ze skryptem do ClickUp:

```text
.claude/skills/
└── clickup-tasks/
    ├── SKILL.md
    └── scripts/
        └── get_tasks.py    # Skrypt pobierający taski
```

Plik SKILL.md z użyciem skryptu:

```yaml
---
name: clickup-tasks
description: Pobierz i zarządzaj taskami z ClickUp. Użyj gdy user pyta o zadania, deadline'y lub status projektów.
---

# ClickUp Tasks

## Workflow
1. Uruchom `scripts/get_tasks.py` z odpowiednimi parametrami
2. Przetwórz wyniki i zapisz do notatki
3. Opcjonalnie: połącz z istniejącymi notatkami projektu

## Dostępne operacje
- Pobierz taski z listy/folderu
- Filtruj po statusie, assignee, deadline
- Sync tasków do notatek Obsidian
```

## Mój osobisty workflow z Obsidian i Claude Code

Pozwól że pokażę jak wygląda mój typowy dzień pracy z tym setup'em.

### Morning routine

1. Otwieram Obsidian + Claude Code
2. Uruchamiam skill do przeglądu dnia - sprawdzam co mam w ClickUp, co w kalendarzu
3. Sprawdzam ważne maile przez skill ze skryptem

### W trakcie pracy

- **Quick capture** do inbox w Obsidian - szybkie notatki, pomysły
- Proszę Claude o przetworzenie i umieszczenie w odpowiednim folderze
- Generuję dokumenty z notatek przez skills
- Sync ważnych tasków z ClickUp do notatek projektu

### Research sessions

- Definiuję temat który mnie interesuje
- Claude Code robi research i zapisuje notatki
- Przeglądam i dodaję własne przemyślenia

### Content creation

- Notatki → drafty przez skills
- Templates zapewniają spójność
- Ale **ludzki dotyk** pozostaje kluczowy

> "Obsidian to moje płótno. Wszystko co mój second brain generuje - dokumenty, drafty, pomysły - zarządzam tutaj. To tutaj dodaję swój ludzki dotyk."

### Integracje które używam

- **ClickUp** - taski i projekty (przez skrypt w skill)
- **Gmail/Outlook** - ważne maile do przetworzenia (bezpośrednio przez biblioteki)
- **Google Calendar** - spotkania i deadline'y

### Dlaczego skrypty zamiast Make.com/Zapier

Make.com pozwala wystawić scenariusze jako narzędzia MCP - to ciekawa opcja. Ale wolę pisać własne skrypty:

- Są szybsze - nie ma dodatkowej warstwy komunikacji
- Mam pełną kontrolę nad logiką
- Wszystko w jednym miejscu, łatwiej debugować

## Jak zacząć - pierwsze kroki

Nie musisz budować wszystkiego naraz. Zacznij od podstaw i rozwijaj stopniowo.

### 1. Zainstaluj narzędzia

- **Obsidian** - darmowy, pobierz z [obsidian.md](https://obsidian.md)
- **Claude Code** - wymaga subskrypcji Claude Pro lub API

### 2. Stwórz strukturę folderów

Zacznij od prostej struktury PARA:

```text
obsidian-vault/
├── 00-inbox/       # Wszystko nowe trafia tutaj
├── 01-projects/    # Aktywne projekty
├── 02-areas/       # Stałe obszary odpowiedzialności
├── 03-resources/   # Materiały referencyjne
├── 04-archive/     # Zakończone rzeczy
└── .claude/
    └── skills/     # Tu będą Twoje skills
```

### 3. Stwórz pierwszy skill

Zacznij prosto - np. skill do podsumowywania notatek:

```yaml
---
name: note-summarizer
description: Summarize long notes into key points. Use when user asks to summarize or extract key points from notes.
---
# Note Summarizer

## Workflow
1. Read the specified note
2. Extract key concepts (5-7 points)
3. Create bullet-point summary
4. Add to top of note or save separately
```

### 4. Zbuduj workflow

- Zdefiniuj rutyny dnia (morning review, end-of-day)
- Stwórz templates dla powtarzalnych dokumentów
- Testuj i iteruj

### 5. Rozwijaj stopniowo

- Dodawaj skills gdy pojawia się realna potrzeba
- Nie próbuj budować wszystkiego na start
- Każdy skill to inwestycja - upewnij się że będziesz go używać

## Kluczowe wnioski

1. **Claude Code to nie tylko kodowanie** - file operations, search, web search czynią go potężnym asystentem ogólnego przeznaczenia
2. **Obsidian + Claude Code = perfect match** - pliki markdown + lokalne przechowywanie + AI processing to idealna kombinacja
3. **Skills dają context-efficient extensibility** - progressive disclosure zapobiega context bloat
4. **Start simple, grow gradually** - jeden skill na raz, iteruj bazując na realnych potrzebach
5. **Human touch remains essential** - AI augmentuje, nie zastępuje Twojego myślenia
6. **File-based workflow is powerful** - wszystko pod version control, przenośne, prywatne

---

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz zbudować własny system zarządzania wiedzą z AI?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci zaprojektować i wdrożyć second brain dopasowany do Twoich potrzeb. Od wyboru narzędzi przez konfigurację skills po optymalizację workflow.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Przydatne zasoby

- [Obsidian](https://obsidian.md) - oficjalna strona
- [Claude Code Documentation](https://docs.anthropic.com/claude-code) - dokumentacja Claude Code
- [Cole Medin / Dynamist](https://www.youtube.com/@ColeMedin) - inspiracja dla tego artykułu
- [5 technik pracy z Claude Code](/blog/5-technik-pracy-z-claude-code) - powiązany artykuł
- [PARA Method](https://fortelabs.com/blog/para/) - system organizacji wiedzy

## FAQ

<details open>
<summary>

### Czy potrzebuję umiejętności programowania żeby używać Claude Code jako second brain?

</summary>

Nie, Claude Code obsługuje się przez naturalny język. Wystarczy opisać co chcesz zrobić - "stwórz podsumowanie moich notatek z folderu projekty" - a Claude wykona resztę. Znajomość markdown jest pomocna, ale nie wymagana. Skills piszesz również w markdown, nie w kodzie programistycznym.

</details>

<details open>
<summary>

### Czym różni się to podejście od używania ChatGPT lub Claude.ai bezpośrednio w przeglądarce?

</summary>

Kluczowa różnica to dostęp do plików lokalnych. Claude Code działa na Twoim komputerze i ma bezpośredni dostęp do plików w Obsidian - może je czytać, edytować, tworzyć nowe. W przeglądarce musisz ręcznie kopiować treść. Dodatkowo skills pozwalają na automatyzację powtarzalnych workflow bez utraty kontekstu między sesjami.

</details>

<details open>
<summary>

### Jak połączyć second brain z innymi narzędziami jak email czy task manager?

</summary>

Masz dwa podejścia: MCP servers (bezpośrednie połączenie z Gmail, Outlook, ClickUp przez biblioteki lub serwery MCP) lub skrypty w skills (moje preferowane). Skrypty w Python/Node.js dodajesz do folderu skills i Claude Code je uruchamia. Make.com pozwala wystawić scenariusze jako narzędzia MCP, ale wolę skrypty - są szybsze, prostsze do debugowania i wszystko mam w jednym miejscu.

</details>

<details open>
<summary>

### Czy moje notatki są bezpieczne i prywatne przy używaniu Claude Code?

</summary>

Tak, notatki pozostają na Twoim komputerze - Obsidian nie wymaga chmury. Claude Code przetwarza pliki lokalnie i wysyła do API tylko to, co jest potrzebne do danego zadania. Nie musisz synchronizować całego vault'a z zewnętrznym serwisem jak w przypadku Notion. Masz pełną kontrolę nad swoimi danymi.

</details>

<details open>
<summary>

### Od czego najlepiej zacząć jeśli nigdy nie używałem Obsidian ani Claude Code?

</summary>

Zacznij od zainstalowania Obsidian i stworzenia prostej struktury folderów (inbox, projekty, zasoby). Następnie zainstaluj Claude Code i przetestuj podstawowe operacje - poproś o podsumowanie pliku, stworzenie nowej notatki. Dopiero gdy poczujesz się komfortowo, dodaj pierwszy prosty skill. Cały proces można rozłożyć na tydzień nauki po 30 minut dziennie.

</details>

<details open>
<summary>

### Czy mogę używać tego systemu z innymi edytorami markdown zamiast Obsidian?

</summary>

Tak, Claude Code działa z dowolnymi plikami markdown. Obsidian jest rekomendowany ze względu na graph view (wizualizacja połączeń), wbudowane linkowanie i rozbudowany ekosystem pluginów. Alternatywy jak Logseq czy Foam również zadziałają, ale mogą wymagać dostosowania workflow. Kluczowe jest używanie lokalnych plików markdown, nie aplikacji chmurowych.

</details>

<details open>
<summary>

### Ile kosztuje taki setup i jakie są wymagania sprzętowe?

</summary>

Obsidian jest darmowy do użytku osobistego. Claude Code wymaga subskrypcji Claude Pro ($20/miesiąc) lub dostępu przez API. Wymagania sprzętowe są minimalne - każdy współczesny komputer z 8GB RAM wystarczy. Vault Obsidian może mieć tysiące notatek bez problemów z wydajnością.

</details>
