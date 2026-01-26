# Blog Article Plan: Second Brain with Obsidian, Claude Code & Skills

**Plan Created:** 2026-01-26
**Status:** READY FOR EXECUTION
**Prime Artifact:** `.claude/agents/context/blog-prime-second-brain-obsidian-claude-code.md`

---

## Frontmatter Specification

```yaml
---
id: 15
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
```

**SEO Analysis:**
- **Title:** 61 chars (slightly over 60, acceptable) - contains main keywords
- **Excerpt:** 156 chars - hook + value proposition
- **Slug:** descriptive, keyword-rich, URL-friendly
- **Primary keyword:** "Second Brain", "Claude Code", "Obsidian"
- **Secondary keywords:** "Skills", "zarządzanie wiedzą", "AI"

---

## Article Structure

### Total Target: ~2800-3200 words (14 min read)

---

### 1. INTRODUCTION (~350 words)

**H1: Second Brain z Obsidian i Claude Code - jak AI zmienia organizację wiedzy**

**Hook (2-3 sentences):**
- Start with surprising insight: "Claude Code to nie tylko narzędzie do kodowania"
- Reference Cole Medin's insight about using Claude Code for everything
- Personal angle: Pawel's discovery of this use case

**Problem Statement:**
- Information overload problem
- Notes scattered across tools
- AI chat history lost, can't build on previous conversations
- Context switching kills productivity

**Value Preview:**
- What reader will learn
- Promise: functional second brain system by end of article
- Credit to Cole Medin as inspiration source

**Key phrases to include:**
- "second brain"
- "zarządzanie wiedzą"
- "produktywność"

---

### 2. CO TO JEST SECOND BRAIN (~300 words)

**H2: Czym jest Second Brain i dlaczego go potrzebujesz**

**Content:**
- Brief explanation of PKM (Personal Knowledge Management)
- Second brain concept (external system for knowledge)
- Three core functions: Capture, Organize, Retrieve
- Why AI changes the game (processing, connecting, generating)

**Key elements:**
- Bullet list: 3 functions of second brain
- Bold: **Second Brain**, **PKM**

---

### 3. DLACZEGO OBSIDIAN + CLAUDE CODE (~500 words)

**H2: Dlaczego Obsidian i Claude Code to idealne połączenie**

**Subsection H3: Obsidian jako fundament**
- Local, private, offline-capable
- Markdown files = best format for LLMs
- Files on your computer = Claude Code can access directly
- Graph view for connections
- No vendor lock-in

**Subsection H3: Claude Code jako mózg**
- Not just for coding - general AI assistant capabilities
- File operations, search, terminal commands, web search
- Only "code intelligence" is coding-specific
- Long-running, complex task handling

**Subsection H3: Razem - coś więcej niż suma części**
- Direct file access (vs. Notion needing MCP)
- AI processes your knowledge base
- Create structured outputs from messy notes
- Connect ideas across documents

**Code example - folder structure:**

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

---

### 4. SKILLS - TRZECI FILAR SYSTEMU (~600 words)

**H2: Skills - jak rozszerzyć możliwości swojego second brain**

**Intro paragraph:**
- Skills bring everything together
- Give capabilities, processes, guidelines to Claude Code
- Context-efficient through progressive disclosure

**Subsection H3: Co to są Skills**
- Markdown files defining workflows
- Loaded dynamically when needed
- Contain instructions, triggers, references

**Subsection H3: Progressive Disclosure - klucz do efektywności**
- Problem: MCP servers load all tools upfront → context bloat
- Solution: Skills load only when needed
- Three layers:
  1. Description (always visible)
  2. skill.md (loaded when triggered)
  3. Reference files (loaded when specific need)

**Code example - basic skill structure:**

```text
.claude/skills/
└── document-generator/
    ├── SKILL.md           # Main instructions
    ├── assets/
    │   └── templates/     # Document templates
    └── references/
        └── style-guide.md # Style guidelines
```

**Code example - SKILL.md format:**

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

**Key insight:**
- Skills allow hundreds of capabilities without context overload
- Agent specializes itself per session

---

### 5. PRAKTYCZNE PRZYKŁADY SKILLS (~600 words)

**H2: Praktyczne przykłady Skills dla second brain**

**Subsection H3: Research Engine**
- Web search + note creation
- Gather information on topic
- Save structured notes to vault
- Example use: "Research latest AI trends and save notes"

**Subsection H3: Document Generator**
- Transform notes into polished documents
- Apply templates and style guides
- Example: meeting notes → action items document

**Subsection H3: Daily Review**
- Scan today's notes
- Create daily summary
- Identify connections to existing knowledge
- Suggest next actions

**Subsection H3: Content Creator**
- Generate content ideas from notes
- Draft articles, posts, scripts
- Maintain consistent voice/style

**Code example - research skill trigger:**

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

---

### 6. INTEGRACJA Z INNYMI NARZĘDZIAMI (~400 words)

**H2: Łączenie second brain z innymi narzędziami przez MCP**

**Intro:**
- MCP (Model Context Protocol) connects to external services
- Problem: MCP loads all tools → context bloat
- Solution: MCP-to-skill conversion

**Content:**
- Concept of using skills to wrap MCP servers
- Deterministic Python script approach
- Only load MCP when actually needed

**Dwa podejścia do integracji:**

1. **MCP servers** - bezpośrednie połączenie z usługami
   - Gmail/Outlook - biblioteki lub serwery MCP
   - Google Calendar - MCP server
   - ClickUp - MCP server lub API

2. **Skills ze skryptami** (moje preferowane podejście)
   - Pisz własne skrypty w Python/Node.js
   - Dodawaj je do skills jako narzędzia
   - Pełna kontrola nad logiką
   - Brak zależności od zewnętrznych platform

**Dlaczego wolę skrypty w skills:**
- Make.com pozwala wystawić scenariusze jako narzędzia MCP, ale to dodatkowa warstwa
- Skrypty w skills są szybsze, prostsze do debugowania
- Wszystko w jednym miejscu (w vault)

**Code example - skill ze skryptem do ClickUp:**

```text
.claude/skills/
└── clickup-tasks/
    ├── SKILL.md
    └── scripts/
        └── get_tasks.py    # Skrypt pobierający taski
```

**Code example - SKILL.md z użyciem skryptu:**

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

---

### 7. MÓJ WORKFLOW (~400 words)

**H2: Mój osobisty workflow z Obsidian i Claude Code**

**Personal perspective from Pawel:**

**Morning routine:**
1. Open Obsidian + Claude Code
2. Run skill do przeglądu dnia - co mam w ClickUp, co w kalendarzu
3. Sprawdzam ważne maile (Gmail/Outlook) przez skill ze skryptem

**During work:**
- Quick capture do inbox w Obsidian
- Ask Claude to process and file
- Generate documents from notes
- Sync ważnych tasków z ClickUp do notatek projektu

**Research sessions:**
- Define topic
- Let Claude research and save
- Review and add personal insights

**Content creation:**
- Notes → drafts with skills
- Templates ensure consistency
- Human touch still essential

**Integracje które używam:**
- **ClickUp** - taski i projekty (przez skrypt w skill)
- **Gmail/Outlook** - ważne maile do przetworzenia (bezpośrednio przez biblioteki)
- **Google Calendar** - spotkania i deadline'y

**Key quote opportunity:**
> "Obsidian to moje płótno. Wszystko co mój second brain generuje - dokumenty, drafty, pomysły - zarządzam tutaj. To tutaj dodaję swój ludzki dotyk."

**Dlaczego skrypty zamiast Make.com/Zapier:**
- Make.com pozwala wystawić scenariusze jako narzędzia MCP
- Ale wolę pisać własne skrypty - są szybsze, mam pełną kontrolę
- Wszystko w jednym miejscu, łatwiej debugować

---

### 8. JAK ZACZĄĆ (~400 words)

**H2: Jak zacząć - pierwsze kroki**

**Step-by-step numbered list:**

1. **Zainstaluj narzędzia**
   - Obsidian (free)
   - Claude Code (requires subscription)

2. **Stwórz strukturę folderów**
   - Basic PARA structure (Projects, Areas, Resources, Archive)
   - Add `.claude/skills/` directory

3. **Stwórz pierwszy skill**
   - Start simple: document summarizer
   - Test and iterate

4. **Zbuduj workflow**
   - Define daily routines
   - Create templates for common documents

5. **Rozwijaj stopniowo**
   - Add skills as needs arise
   - Don't build everything at once

**Code example - minimal first skill:**

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

---

### 9. KLUCZOWE WNIOSKI (~200 words)

**H2: Kluczowe wnioski**

**Numbered list (5-6 points):**

1. **Claude Code to nie tylko kodowanie** - file operations, search, web search make it a powerful general assistant
2. **Obsidian + Claude Code = perfect match** - markdown files + local storage + AI processing
3. **Skills enable context-efficient extensibility** - progressive disclosure prevents context bloat
4. **Start simple, grow gradually** - one skill at a time, iterate based on real needs
5. **Human touch remains essential** - AI augments, doesn't replace your thinking
6. **File-based workflow is powerful** - everything version controlled, portable, private

---

### 10. CTA SECTION

**HTML CTA block (AI category template):**

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz zbudować własny system zarządzania wiedzą z AI?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci zaprojektować i wdrożyć second brain dopasowany do Twoich potrzeb. Od wyboru narzędzi przez konfigurację skills po optymalizację workflow.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

---

### 11. PRZYDATNE ZASOBY (~100 words)

**H2: Przydatne zasoby**

**Bullet list with links:**
- [Obsidian](https://obsidian.md) - oficjalna strona
- [Claude Code Documentation](https://docs.anthropic.com/claude-code) - dokumentacja Claude Code
- [Cole Medin / Dynamist](https://www.youtube.com/@ColeMedin) - inspiracja dla tego artykułu
- [5 technik pracy z Claude Code](/blog/5-technik-pracy-z-claude-code) - powiązany artykuł (internal link)
- [PARA Method](https://fortelabs.com/blog/para/) - system organizacji wiedzy

---

### 12. FAQ SECTION (~550 words)

**H2: FAQ**

**7 questions with accordion format:**

**Q1:** Czy potrzebuję umiejętności programowania żeby używać Claude Code jako second brain?

**A1:** Nie, Claude Code obsługuje się przez naturalny język. Wystarczy opisać co chcesz zrobić - "stwórz podsumowanie moich notatek z folderu projekty" - a Claude wykona resztę. Znajomość markdown jest pomocna, ale nie wymagana. Skills piszesz również w markdown, nie w kodzie programistycznym.

---

**Q2:** Czym różni się to podejście od używania ChatGPT lub Claude.ai bezpośrednio w przeglądarce?

**A2:** Kluczowa różnica to dostęp do plików lokalnych. Claude Code działa na Twoim komputerze i ma bezpośredni dostęp do plików w Obsidian - może je czytać, edytować, tworzyć nowe. W przeglądarce musisz ręcznie kopiować treść. Dodatkowo skills pozwalają na automatyzację powtarzalnych workflow bez utraty kontekstu między sesjami.

---

**Q3:** Jak połączyć second brain z innymi narzędziami jak email czy task manager?

**A3:** Masz dwa podejścia: MCP servers (bezpośrednie połączenie z Gmail, Outlook, ClickUp przez biblioteki lub serwery MCP) lub skrypty w skills (moje preferowane). Skrypty w Python/Node.js dodajesz do folderu skills i Claude Code je uruchamia. Make.com pozwala wystawić scenariusze jako narzędzia MCP, ale wolę skrypty - są szybsze, prostsze do debugowania i wszystko mam w jednym miejscu.

---

**Q4:** Czy moje notatki są bezpieczne i prywatne przy używaniu Claude Code?

**A4:** Tak, notatki pozostają na Twoim komputerze - Obsidian nie wymaga chmury. Claude Code przetwarza pliki lokalnie i wysyła do API tylko to, co jest potrzebne do danego zadania. Nie musisz synchronizować całego vault'a z zewnętrznym serwisem jak w przypadku Notion. Masz pełną kontrolę nad swoimi danymi.

---

**Q5:** Od czego najlepiej zacząć jeśli nigdy nie używałem Obsidian ani Claude Code?

**A5:** Zacznij od zainstalowania Obsidian i stworzenia prostej struktury folderów (inbox, projekty, zasoby). Następnie zainstaluj Claude Code i przetestuj podstawowe operacje - poproś o podsumowanie pliku, stworzenie nowej notatki. Dopiero gdy poczujesz się komfortowo, dodaj pierwszy prosty skill. Cały proces można rozłożyć na tydzień nauki po 30 minut dziennie.

---

**Q6:** Czy mogę używać tego systemu z innymi edytorami markdown zamiast Obsidian?

**A6:** Tak, Claude Code działa z dowolnymi plikami markdown. Obsidian jest rekomendowany ze względu na graph view (wizualizacja połączeń), wbudowane linkowanie i rozbudowany ekosystem pluginów. Alternatywy jak Logseq czy Foam również zadziałają, ale mogą wymagać dostosowania workflow. Kluczowe jest używanie lokalnych plików markdown, nie aplikacji chmurowych.

---

**Q7:** Ile kosztuje taki setup i jakie są wymagania sprzętowe?

**A7:** Obsidian jest darmowy do użytku osobistego. Claude Code wymaga subskrypcji Claude Pro ($20/miesiąc) lub dostępu przez API. Wymagania sprzętowe są minimalne - każdy współczesny komputer z 8GB RAM wystarczy. Vault Obsidian może mieć tysiące notatek bez problemów z wydajnością.

---

## Technical Accuracy Checklist

- [ ] Claude Code capabilities described correctly
- [ ] Obsidian features accurate
- [ ] Skills format matches actual implementation
- [ ] MCP concept explained correctly
- [ ] Folder structures are practical and tested
- [ ] Links to external resources verified

## Style Guidelines Reminder

**Language:**
- Polish main text
- English: Claude Code, Skills, SKILL.md, MCP, second brain, workflow, inbox
- Never polonize (no "komendyfikacja")
- Code blocks ALWAYS have language tags

**Tone:**
- First person (Pawel's voice)
- Direct, practical
- Personal anecdotes where relevant
- Short paragraphs (2-4 sentences)

**Formatting:**
- Bold key concepts on first mention
- Bullet lists for features/benefits
- Numbered lists for steps/sequences
- Code blocks with proper language tags
- Tables where comparing options

---

## Execution Checklist

- [ ] Create article file: `src/content/blog/second-brain-obsidian-claude-code-skills.md`
- [ ] Write all sections following this plan
- [ ] Verify all code blocks have language tags
- [ ] Add internal link to `5-technik-pracy-z-claude-code`
- [ ] Verify FAQ uses accordion format with `<details open>`
- [ ] Verify CTA uses HTML format (not markdown)
- [ ] Update sitemap after creation
- [ ] Generate OG image prompt

---

## Ready for Execution

This plan is complete and ready for `/blog-article-writer:execute`
