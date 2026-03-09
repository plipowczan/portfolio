# Blog Prime: Skills 2.0 i Multi-Agent System dla firmy

## Data priming: 2026-03-08

---

## 1. Materiały źródłowe

### Notatki autora (`docs/blog/notes.md`)
- Paweł pracuje nad nowym systemem zarządzania firmą opartym na agentach AI i koncepcji Skills 2.0
- Repozytorium: https://github.com/200iqlabs/shared-skills
- System = plugin/submodule do systemu zarządzania firmą
- Cel: agenci AI automatyzujący procesy biznesowe (zarządzanie projektami, obsługa klienta, analiza danych, marketing, finanse)
- Elastyczność i łatwość rozbudowy dzięki Skills 2.0
- Planowana seria artykułów o różnych aspektach systemu

### Transkrypt 1 (`transcript_RAZVk5NPNtE.txt`) — Film o Skill Creator 2.0
- **Autor:** YouTuber (AI-focused channel)
- **Temat:** Cloud Skills 2.0 + skill-creator od Anthropic
- **Kluczowe koncepcje:**
  - **Skills = przepisy (recipes)** — tekstowe instrukcje dla agenta, jak prompty/SOPy
  - **Dwa typy skills:**
    1. **Capability uplift** — uczy AI czegoś nowego (np. frontend design) — może się zdezaktualizować z nowymi modelami
    2. **Encoded preference** — koduje specyficzny workflow użytkownika — trwałe, bo specyficzne dla osoby
  - **Skill-creator skill** — oficjalny skill od Anthropic do budowania, testowania i ulepszania skills
  - **Evals** — automatyczna ocena jakości skill + iteracyjne ulepszanie
  - **Benchmarks** — pass rate, czas, tokeny — porównanie z/bez skill
  - **Trigger tuning** — optymalizacja description żeby skill triggerował się poprawnie
  - **Przyszłość:** natural language description → model figures out the rest
  - **Live demo:** YouTube Weekly Roundup skill — od opisu do działającego PDF reportu w 20 minut
  - **Plugin installation:** `/plugins` → search → install

### Transkrypt 2 (`transcript_yLhnJMM464c.txt`) — Skills 2.0 praktyczny tutorial
- **Autor:** Duncan Rogoff (ex-Art Director Apple/PlayStation, 6-figure AI agency)
- **Temat:** Praktyczne budowanie skill z skill-creatorem
- **Kluczowe koncepcje:**
  - Skills = system prompt na sterydach — ma dostęp do file system, web search, integracji, skryptów
  - **Skill-creator plugin** — instalacja: `/plugins` → search "skill" → install
  - **Demo:** Meeting Notes Processor skill — executive summary, action items, key decisions, open questions
  - **Input:** kopiuj/wklej transkrypt lub upload JSON z Fireflies
  - **Workflow:** `/meeting-notes` + tag transkrypt → przetworzone notatki w outputs/
  - **Interakcja z danymi:** po przetworzeniu można pytać o treść spotkań
  - Shared skills — link do pobrania i zainstalowania

### PRD: PLSoft Multi-Agent System (`shared-skills` repo)
- **Wersja:** 1.3 (2026-03-07)
- **Cel:** Modularny system wieloagentowy Claude Code + Git, zgodny z Agent Skills standard (agentskills.io)
- **Problem:** Wiedza rozproszona po Claude Projects, Obsidian, ad-hoc konwersacjach. Brak orkiestracji. Brak separacji kontekstów.
- **Rozwiązanie:** 3 repozytoria Git + shared skills jako submodule
- **8 agentów:**
  1. CFO (finanse) ✅ Active
  2. Tax Advisor (podatki) 🔲 Planned
  3. Legal (prawo) 🔲 Planned
  4. Marketing (content) 🔲 Planned
  5. Business Consultant ✅ Active
  6. Product Manager 🔲 Planned
  7. Coach The Five ✅ Active
  8. LinkedIn Content ✅ Active
- **Architektura:** 3 repo (shared-skills public, agentic-ai-system private/spółka, agentic-ai-private private/JDG)
- **Stack:** Claude Code CLI, Agent Skills standard, skill-creator, Git + GitHub, OpenSpec, Markdown
- **Dystrybucja:** Claude Code plugin marketplace
- **Komercjalizacja:** Community (Apache 2.0) + Business bundle (komercyjny) + Consulting

---

## 2. Kluczowe tematy do pokrycia

### Główny temat
**Budowa multi-agent system do zarządzania firmą z Claude Code Skills 2.0**

### Podtematy
1. **Co to są Skills 2.0** — ewolucja od promptów do modularnych, testowalnych agentów
2. **Agent Skills standard (agentskills.io)** — otwarty standard, przenośność, struktura SKILL.md
3. **Skill-creator** — oficjalne narzędzie do budowy agentów z evals i benchmarkami
4. **Architektura systemu** — 3 repo, git submodule, separacja kontekstów
5. **Praktyczne przykłady agentów** — CFO, Business Consultant, LinkedIn Content
6. **Progressive disclosure** — 3-level loading, oszczędność kontekstu
7. **Workflow budowy agenta** — intent → interview → draft → test → evaluate → iterate → package
8. **Komercjalizacja** — plugin marketplace, consulting, template repo

### Unikalny kąt (angle)
- **Nie kolejny tutorial "jak zrobić skill"** — Paweł buduje **kompletny system wieloagentowy dla firmy**
- Perspektywa właściciela dwóch firm (JDG + PSA) z realnymi potrzebami
- Połączenie koncepcji Skills 2.0 z praktyką biznesową
- Od rozproszonych promptów do zorganizowanego systemu decyzyjnego
- Open source + komercjalizacja

---

## 3. Profil grupy docelowej

### Primary audience
- **Przedsiębiorcy/właściciele firm** szukający sposobów na wykorzystanie AI w zarządzaniu
- **Programiści/technicy** budujący systemy z Claude Code
- **Osoby znające Claude Code** z poprzednich artykułów Pawła (5 technik, Second Brain, OPSX)

### Poziom wiedzy
- Średniozaawansowany — znają Claude Code, wiedzą co to skills
- Potrzebują: praktycznego przewodnika jak zbudować system wieloagentowy
- Nie potrzebują: wyjaśnień czym jest AI, jak działa LLM

---

## 4. Powiązania z istniejącymi artykułami

- **[5 technik pracy z Claude Code](/blog/5-technik-pracy-z-claude-code)** — PRD-first, modularność reguł, komendyfikacja → skills to ewolucja tych koncepcji
- **[Second Brain z Obsidian i Claude Code](/blog/second-brain-obsidian-claude-code-skills)** — skills w kontekście zarządzania wiedzą → teraz skills do zarządzania firmą
- **[OPSX Workflow](/blog/opsx-workflow-strukturyzowana-praca-z-ai)** — metodologia rozwoju → OpenSpec używany w tym projekcie
- **[Trendy AI 2026](/blog/trendy-ai-2026-od-eksperymentow-do-operacjonalizacji)** — operacjonalizacja AI → ten artykuł to konkretny przykład

---

## 5. Styl pisania (z analizy istniejących artykułów)

### Obserwacje z artykułów Pawła
- **Hook:** Zaczyna od problemu/kontry do powszechnych praktyk ("Większość programistów...", "Claude Code to nie tylko narzędzie do kodowania")
- **Osobiste doświadczenie:** "Z własnego doświadczenia wiem...", "Odkryłem to dzięki...", "Próbowałem obydwoma sposobami"
- **Struktura:** Problem → Rozwiązanie → Szczegóły implementacji → Kluczowe wnioski → FAQ → CTA → Zasoby
- **Kod/diagramy:** Dużo bloków kodu, diagramów ASCII, tabel
- **Angielskie terminy:** Swobodne mieszanie PL/EN ("feature'ka", "context window", "trigger", "skills")
- **Praktyczność:** Zawsze "Co możesz zrobić dzisiaj", konkretne kroki
- **Długość:** 2000-3000 słów, readTime 12-14 min
- **FAQ:** 5-7 pytań w `<details open>` accordion, snippet-style odpowiedzi
- **CTA:** HTML z Tailwind, kontekstowy do tematu

### Ton
- Bezpośredni, praktyczny, osobisty
- Nie boi się opinii ("To ogromna różnica", "Różnica jest gigantyczna")
- Dzieli się procesem budowy, nie tylko wynikiem
- Linkuje do poprzednich artykułów naturalnie

---

## 6. Sugerowane front matter

```yaml
---
id: 21
slug: skills-2-0-multi-agent-system-zarzadzanie-firma
title: "Skills 2.0 - jak buduję system wieloagentowy do zarządzania firmą"
excerpt: "Jak przejść od rozproszonych promptów AI do zorganizowanego systemu agentów zarządzających finansami, prawem i marketingiem Twojej firmy."
category: AI
author: Pawel Lipowczan
date: 2026-03-08
readTime: 14 min
image: /images/og-skills-2-0-multi-agent-system.webp
tags:
  - AI
  - Claude Code
  - Skills
  - Automatyzacja
  - Multi-Agent System
  - Agent Skills
---
```

---

## 7. Sugerowana struktura artykułu

1. **Hook** — Problem rozproszonych promptów i kontekstów w wielu Claude Projects
2. **Co to są Skills 2.0** — ewolucja od promptów, dwa typy (capability uplift vs encoded preference)
3. **Agent Skills standard** — otwarty standard, SKILL.md, progressive disclosure
4. **Skill-creator** — jak budować agentów iteracyjnie z evals i benchmarkami
5. **Mój system: PLSoft Multi-Agent** — architektura 3 repo, 8 agentów, separacja kontekstów
6. **Praktyczny przykład** — budowa agenta CFO lub Business Consultant krok po kroku
7. **Workflow budowy agenta** — intent → draft → test → iterate → package
8. **Jak zacząć** — od jednego agenta do pełnego systemu
9. **Kluczowe wnioski** — 5-7 punktów
10. **FAQ** — 5-6 pytań
11. **CTA** — kontekstowy AI/zarządzanie firmą
12. **Przydatne zasoby** — agentskills.io, skill-creator, shared-skills repo

---

## 8. Gotowość do planowania

- [x] Wszystkie materiały źródłowe przeanalizowane
- [x] Styl pisania Pawła zrozumiany
- [x] Portfolio copywriting guidelines przejrzane
- [x] Kluczowe tematy i techniczne koncepcje zidentyfikowane
- [x] Grupa docelowa określona
- [x] Unikalny kąt artykułu zdefiniowany
- [x] Powiązania z istniejącymi artykułami zmapowane
- [x] Front matter przygotowany
- [x] PRD projektu shared-skills szczegółowo przeanalizowany

**Gotowe do fazy planowania:** `/blog-article-writer:plan`
