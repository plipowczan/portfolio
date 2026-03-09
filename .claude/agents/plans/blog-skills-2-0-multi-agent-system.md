# Blog Plan: Skills 2.0 - Multi-Agent System

## Status: READY FOR EXECUTION

## Frontmatter

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

## SEO

- **Primary keyword:** Skills 2.0 multi-agent system
- **Secondary keywords:** Claude Code Skills, Agent Skills standard, system wieloagentowy, zarządzanie firmą AI, skill-creator
- **Internal links:** 5 technik pracy z Claude Code, Second Brain, OPSX Workflow, Trendy AI 2026

---

## Article Structure

### 1. Introduction / Hook (~300 words)

**Hook:** Problem rozproszonych kontekstów — wiedza w Claude Projects, Obsidian, ad-hoc konwersacjach. Każda sesja zaczyna się od zera. Każdy agent nie zna kontekstu drugiego.

**Personal angle:** "Od kilku dni buduję coś, czego szukałem od dawna — system, w którym agenci AI nie tylko odpowiadają na pytania, ale **zarządzają** konkretnymi obszarami moich firm — zarówno 200IQ Labs (qamera.ai) jak i PLSoft."

**Value preview:** Skills 2.0 + Agent Skills standard + git = system wieloagentowy, który działa jak zespół specjalistów.

**Link do:** [5 technik pracy z Claude Code](/blog/5-technik-pracy-z-claude-code) — ewolucja tych koncepcji.

---

### 2. Problem: rozproszony AI w firmie (~400 words) `## Dlaczego AI w firmie to wciąż chaos`

- Claude Projects z promptami CFO, osobne z promptami marketingowymi, Obsidian z notatkami
- Brak orkiestracji — agenci nie wiedzą o sobie nawzajem
- Brak wersjonowania — nie wiesz co zmieniłeś w promptach i kiedy
- Brak testów — nie wiesz czy agent działa lepiej czy gorzej po zmianie

```text
ASCII diagram:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Claude Project│  │   Obsidian   │  │  Ad-hoc chat │
│   "CFO"      │  │  "Notatki"   │  │  "Pomóż mi"  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
               ❌ Zero orchestration
               ❌ No shared context
               ❌ No versioning
```

---

### 3. Co to są Skills 2.0 (~500 words) `## Skills 2.0 — od promptów do modularnych agentów`

- Ewolucja: prompt → CLAUDE.md rules → skills → Skills 2.0
- **Dwa typy skills:**
  - **Capability uplift** — uczy AI nowych umiejętności (np. frontend design) — może się zdezaktualizować
  - **Encoded preference** — koduje specyficzny workflow użytkownika — trwałe, bo specyficzne
- Skills = przepisy (recipes) — tekstowe instrukcje z dostępem do file system, web search, skryptów
- Porównanie: system prompt vs skill

```text
System prompt:               Skill:
─────────────               ─────
Tekst w polu                SKILL.md + pliki
Brak testów                 Evals + benchmarks
Copy-paste                  Git + versioning
Jedna sesja                 Persistent across sessions
```

**Link do:** [Second Brain z Obsidian i Claude Code](/blog/second-brain-obsidian-claude-code-skills)

---

### 4. Agent Skills Standard (~400 words) `## Agent Skills — otwarty standard dla AI agentów`

- agentskills.io — otwarty standard, nie vendor lock-in
- Struktura SKILL.md — name, description, triggers, instructions
- Progressive disclosure — 3-level loading (opis → kontekst → pełne instrukcje)
- Oszczędność context window
- Przenośność między narzędziami

```yaml
# Przykład SKILL.md (kod)
name: "CFO Agent"
description: "Financial analysis and reporting for PLSoft"
triggers:
  - "financial report"
  - "budget analysis"
  - "cash flow"
instructions: |
  You are the CFO agent for PLSoft...
```

---

### 5. Skill-creator (~500 words) `## Skill-creator — buduj agentów jak profesjonalista`

- Oficjalne narzędzie od Anthropic
- Instalacja: `/plugins` → search → install
- Workflow: intent → interview → draft → test → evaluate → iterate → package
- **Evals** — automatyczna ocena jakości
- **Benchmarks** — pass rate, czas, tokeny
- **Trigger tuning** — optymalizacja description
- Live example: od opisu do działającego agenta w 20 minut

```bash
# Instalacja skill-creatora
/plugins
# → search "skill-creator"
# → install
```

---

### 6. Mój system: PLSoft Multi-Agent (~600 words) `## Mój system — 8 agentów, 3 repozytoria, zero chaosu`

- **Architektura 3 repo:**
  - `shared-skills` (public, Apache 2.0) — wspólne skills dla obu firm
  - `agentic-ai-system` (private, 200IQ Labs / qamera.ai) — skills specyficzne dla spółki
  - `agentic-ai-private` (private, PLSoft / JDG) — skills osobiste i freelance

```text
┌─────────────────────────────────────────────┐
│     agentic-ai-system (200IQ Labs)         │
│     → qamera.ai product                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   CFO    │  │   Legal  │  │ Marketing│  │
│  └──────────┘  └──────────┘  └──────────┘  │
│         ▲                                   │
│         │ git submodule                     │
│  ┌──────┴───────────────────────────────┐   │
│  │         shared-skills (public)       │   │
│  │  Templates, Utilities, Standards     │   │
│  └──────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│     agentic-ai-private (PLSoft / JDG)      │
│     → freelance, portfolio, consulting     │
│  ┌──────────┐  ┌──────────┐                 │
│  │  Coach   │  │ LinkedIn │                 │
│  └──────────┘  └──────────┘                 │
│         ▲                                   │
│         │ git submodule                     │
│  ┌──────┴───────────────────────────────┐   │
│  │         shared-skills (public)       │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

- **8 agentów** z krótkim opisem każdego:
  1. CFO (finanse) ✅
  2. Tax Advisor (podatki) 🔲
  3. Legal (prawo) 🔲
  4. Marketing (content) 🔲
  5. Business Consultant ✅
  6. Product Manager 🔲
  7. Coach The Five ✅
  8. LinkedIn Content ✅

- Separacja kontekstów — agent CFO nie wie o treściach marketingowych
- Separacja firm — 200IQ Labs (produkt qamera.ai) i PLSoft (freelance/consulting) mają osobne repo, ale współdzielą skills
- Git = wersjonowanie, code review, historia zmian

**Link do:** [OPSX Workflow](/blog/opsx-workflow-strukturyzowana-praca-z-ai) — OpenSpec używany do budowy

---

### 7. Praktyczny przykład (~500 words) `## Praktyczny przykład — budowa agenta CFO krok po kroku`

- Intent: "Agent do analizy finansowej i raportowania"
- Skill-creator interview — pytania o specyfikę
- Draft SKILL.md
- Test z rzeczywistymi danymi
- Evals — co mierzyć
- Iteracja — poprawki na podstawie wyników
- Package i dystrybucja

```yaml
# CFO Agent - fragment SKILL.md
name: "CFO Agent"
version: "1.0.0"
description: "Financial analysis, reporting, and advisory for 200IQ Labs & PLSoft"
triggers:
  - "analyze financials"
  - "monthly report"
  - "budget review"
  - "cash flow projection"
```

---

### 8. Jak zacząć (~300 words) `## Jak zacząć — od jednego agenta do pełnego systemu`

1. Zidentyfikuj **jedną powtarzalną rolę** w firmie
2. Zainstaluj **skill-creator**: `/plugins` → search → install
3. Opisz intent — co agent ma robić
4. Przejdź przez interview
5. Testuj z realnymi danymi
6. Iteruj na podstawie evals
7. Dodaj kolejnych agentów

**Tip:** Zacznij od encoded preference (Twój specyficzny workflow), nie od capability uplift.

---

### 9. Kluczowe wnioski (~200 words) `## Kluczowe wnioski`

Numerowana lista 5-7 punktów:

1. Skills 2.0 to przeskok od promptów do modularnych, testowalnych agentów
2. Agent Skills standard zapewnia przenośność i brak vendor lock-in
3. Skill-creator zamienia 10h ręcznej pracy w 20-minutowy workflow
4. Git + skills = wersjonowanie, code review, historia zmian dla AI
5. Zacznij od jednego agenta, nie od pełnego systemu
6. Encoded preference > capability uplift dla specyficznych workflow
7. Open source + komercjalizacja — nie musisz wybierać

---

### 10. CTA Section

```html
<div class="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-6 my-8 border border-green-500/20">
  <h3 class="text-xl font-bold text-white mb-2">Chcesz zbudować system wieloagentowy dla swojej firmy?</h3>
  <p class="text-gray-300 mb-4">Pomagam firmom projektować i wdrażać systemy AI agents — od jednego agenta do pełnej orkiestracji. Sprawdź shared-skills na GitHubie lub umów się na konsultację.</p>
  <a href="/#contact" class="inline-block bg-green-500 hover:bg-green-400 text-black font-semibold py-2 px-6 rounded-lg transition-colors">Umów konsultację →</a>
</div>
```

---

### 11. Resources `## Przydatne zasoby`

- [Agent Skills Standard](https://agentskills.io) — otwarty standard
- [Skill Creator Plugin](https://github.com/anthropics/skill-creator) — oficjalne narzędzie Anthropic
- [shared-skills repo](https://github.com/200iqlabs/shared-skills) — open source multi-agent starter
- [Claude Code Skills docs](https://docs.anthropic.com/en/docs/claude-code/skills) — dokumentacja

---

### 12. FAQ Section (~500 words) `## FAQ`

Format: `<details open>` accordion, H3 pytania w `<summary>`.

**Q1:** Czym różnią się Skills 2.0 od zwykłych promptów systemowych w Claude Projects?
**A1:** Skills 2.0 to modularni agenci z dostępem do file system, web search i skryptów — nie tylko tekst w polu. Mają wersjonowanie (Git), automatyczne testy (evals) i mogą być współdzielone między projektami. Prompt systemowy znika po zamknięciu sesji, skill jest persistent.

**Q2:** Czy potrzebuję umiejętności programowania, żeby zbudować system wieloagentowy ze Skills 2.0?
**A2:** Nie musisz pisać kodu — skill-creator prowadzi Cię przez cały proces od opisu intencji do gotowego agenta. Podstawowa znajomość terminala i Git jest przydatna, ale nie wymagana. SKILL.md to Markdown z YAML header, nie język programowania.

**Q3:** Ile kosztuje utrzymanie systemu wieloagentowego z Claude Code?
**A3:** Sam Claude Code wymaga subskrypcji (Claude Max/Pro). Skills i Agent Skills standard są darmowe — to pliki Markdown w repozytorium Git. Koszty zależą od intensywności użycia, ale typowy system z 4-8 agentami nie generuje dodatkowych kosztów poza subskrypcją Claude.

**Q4:** Jak zapewnić, że agenci nie mają dostępu do danych, których nie powinni widzieć?
**A4:** Separacja kontekstów przez oddzielne repozytoria Git. Agent CFO dla 200IQ Labs operuje w repo spółki, agent dla PLSoft w osobnym repo. Nie widzą się nawzajem. Wspólne skills (shared-skills) zawierają tylko uniwersalne narzędzia, nie dane firmowe. Każdy SKILL.md definiuje scope i ograniczenia dostępu agenta.

**Q5:** Czy Agent Skills standard działa tylko z Claude Code, czy też z innymi narzędziami AI?
**A5:** Agent Skills to otwarty standard (agentskills.io), zaprojektowany jako vendor-agnostic. Obecnie najlepiej wspierany przez Claude Code, ale specyfikacja jest publiczna i inne narzędzia mogą ją implementować. Brak vendor lock-in to jeden z głównych celów standardu.

**Q6:** Od czego najlepiej zacząć budowę systemu wieloagentowego w małej firmie?
**A6:** Zacznij od jednego agenta dla najczęściej powtarzanej roli — np. analiza finansowa, obsługa klienta lub tworzenie contentu. Zainstaluj skill-creator, opisz co agent ma robić, przetestuj z realnymi danymi. Dodawaj kolejnych agentów dopiero gdy pierwszy stabilnie działa.

---

## Word Count Targets

| Section | Target |
|---------|--------|
| Introduction | ~300 |
| Problem | ~400 |
| Skills 2.0 | ~500 |
| Agent Skills Standard | ~400 |
| Skill-creator | ~500 |
| Mój system | ~600 |
| Praktyczny przykład | ~500 |
| Jak zacząć | ~300 |
| Kluczowe wnioski | ~200 |
| CTA | ~50 |
| Resources | ~50 |
| FAQ | ~500 |
| **Total** | **~4300** |

## Style Guidelines

- **Language:** Polish + English technical terms (never polonize)
- **Tone:** Direct, practical, personal (Pawel's voice, first-person)
- **Paragraphs:** Short (2-4 sentences)
- **Bold:** Key concepts on first mention
- **Code blocks:** ALL with language tags (`yaml`, `text`, `bash`, `html`)
- **Internal links:** Natural mentions of previous articles (min 4)
- **ASCII diagrams:** For architecture visualization

## Technical Accuracy Notes

- Skills 2.0 = Claude Code feature, not general AI concept
- Agent Skills standard = agentskills.io, open standard
- Skill-creator = official Anthropic plugin
- SKILL.md structure = per Agent Skills spec
- Progressive disclosure = 3-level context loading
- Verify: plugin installation flow (`/plugins` → search → install)

## Ready for Execution

- [x] Prime context loaded and analyzed
- [x] Next blog ID: 21
- [x] Frontmatter completely specified
- [x] 12 sections outlined with word targets
- [x] FAQ section planned (6 questions, accordion format)
- [x] Code examples identified with language tags
- [x] Language guidelines set (no polonization)
- [x] SEO keywords identified
- [x] Internal links mapped (4 articles)
- [x] ASCII diagrams planned (3)
- [x] CTA section designed
- [x] Style consistent with existing articles

**Next command:** `/blog-article-writer:execute`
