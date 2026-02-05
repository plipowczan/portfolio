# Blog Plan: OPSX Workflow

**Date:** 2026-02-05
**Prime Artifact:** `.claude/agents/context/blog-prime-opsx.md`
**Status:** Ready for Execution

---

## Frontmatter Specification

```yaml
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
```

---

## Article Structure

### Word Count Targets
- **Total:** ~2400-2800 words
- **Introduction:** ~300 words
- **Main sections:** ~1800-2000 words (6 sections × 300-350 words)
- **Conclusion:** ~200 words
- **FAQ:** ~400 words (5 questions)

---

## Section-by-Section Breakdown

### 1. Introduction (~300 words)

**Hook:**
"Większość programistów traktuje AI coding assistants jak szybszy Stack Overflow — wrzucasz pytanie, dostajesz odpowiedź, wracasz do kodu. Problem? Tracisz kontekst między sesjami, powtarzasz te same wyjaśnienia, a AI za każdym razem startuje od zera."

**Content:**
- Problem z reaktywnym podejściem do AI
- Brak systemu = chaos przy większych zmianach
- Zapowiedź OPSX jako rozwiązania
- Personal angle: własne doświadczenia z legacy workflows

**Key points:**
- Reactive prompting vs systematic approach
- Lost context between sessions
- Inconsistent outputs

---

### 2. Co to jest OPSX (~350 words)

**H2:** Co to jest OPSX i dlaczego powstało

**Content:**
- Definicja: fluid, iterative workflow dla OpenSpec
- Porównanie z legacy workflow (diagram ASCII)
- 4 problemy legacy:
  1. Instrukcje hardcoded w TypeScript
  2. All-or-nothing approach
  3. Brak customizacji
  4. Black box przy złych outputach
- Jak OPSX to rozwiązuje

**Code block:** (language: `text`)
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

---

### 3. Komendy OPSX (~350 words)

**H2:** Komendy OPSX - przegląd

**Content:**
- Tabela wszystkich komend z opisami
- Wyjaśnienie "actions, not phases"
- Praktyczne przykłady użycia każdej komendy

**Table:** (Markdown)
| Komenda | Co robi |
|---------|---------|
| `/opsx:explore` | Myślenie, badanie problemu |
| `/opsx:new` | Start nowej zmiany |
| `/opsx:continue` | Tworzenie kolejnego artefaktu |
| `/opsx:ff` | Fast-forward - wszystkie artefakty naraz |
| `/opsx:apply` | Implementacja zadań |
| `/opsx:sync` | Synchronizacja specs |
| `/opsx:archive` | Archiwizacja po zakończeniu |

**Code examples:** (language: `text`)
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

---

### 4. Architektura - graf zależności (~400 words)

**H2:** Jak działa OPSX - architektura artefaktów

**Content:**
- Directed Acyclic Graph (DAG) wyjaśnienie
- Zależności jako enablers, nie gates
- Stany: BLOCKED → READY → DONE
- Topological sort dla ordering

**Diagram:** (language: `text`)
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

**State diagram:** (language: `text`)
```text
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

**Key concepts:**
- **Dependencies are enablers** - pokazują co możliwe, nie co wymagane
- **Filesystem as state** - istnienie pliku = DONE
- **Topological ordering** - system wie co tworzyć dalej

---

### 5. Schematy i konfiguracja (~350 words)

**H2:** Customizacja workflow - schematy i konfiguracja

**Content:**
- `schema.yaml` struktura
- Domyślny schemat `spec-driven`
- Tworzenie własnych schematów
- `config.yaml` dla projektu
- Context injection

**Code block - schema.yaml:** (language: `yaml`)
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

**Code block - config.yaml:** (language: `yaml`)
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

---

### 6. Kiedy aktualizować vs nowa zmiana (~350 words)

**H2:** Kiedy aktualizować istniejącą zmianę vs zacząć nową

**Content:**
- Co proposal definiuje: Intent, Scope, Approach
- Heurystyki decyzyjne
- Praktyczne przykłady

**Decision tree:** (language: `text`)
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

**Table:**
| Test | Aktualizuj | Nowa zmiana |
|------|------------|-------------|
| **Tożsamość** | "To samo, dopracowane" | "Inna praca" |
| **Overlap scope** | >50% pokrycia | <50% pokrycia |
| **Zamknięcie** | Nie można bez zmian | Można zamknąć, nowa stoi samodzielnie |

**Principle quote:**
> **Update zachowuje kontekst. Nowa zmiana daje klarowność.**

---

### 7. Jak zacząć - pierwsze kroki (~250 words)

**H2:** Jak zacząć z OPSX

**Content:**
- Instalacja i setup
- Pierwszy workflow
- Tips dla beginners

**Code block - setup:** (language: `bash`)
```bash
# Instalacja
openspec init

# Sprawdzenie dostępnych schematów
openspec schemas

# Status aktywnych zmian
openspec status
```

**Workflow example:** (language: `text`)
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

**Tips:**
- Użyj `/opsx:explore` przed commitment do zmiany
- `/opsx:ff` gdy wiesz co chcesz, `/opsx:continue` przy eksploracji
- Podczas `/opsx:apply` - jeśli coś nie tak, edytuj artefakt i kontynuuj

---

### 8. Kluczowe wnioski (~150 words)

**H2:** Kluczowe wnioski

**Numbered list:**
1. **OPSX to actions, nie phases** - rób co potrzebujesz, kiedy potrzebujesz
2. **Artefakty tworzą graf zależności** - system wie co jest ready
3. **Iteracja jest naturalna** - edytuj specs podczas implementacji
4. **Schematy są customizable** - zdefiniuj własny workflow
5. **Context injection** - AI zna konwencje twojego projektu

---

### 9. CTA Section

**HTML block:**
```html
<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; padding: 32px; margin: 32px 0; border: 1px solid #00ff9d33;">
  <h3 style="color: #00ff9d; margin-top: 0;">Chcesz wdrożyć OPSX w swoim zespole?</h3>
  <p style="color: #e0e0e0; margin-bottom: 20px;">Pomagam zespołom przejść od chaotycznego promptowania do strukturyzowanego workflow z AI. Napisz, a ustalimy czy OPSX pasuje do waszego procesu.</p>
  <a href="/#contact" style="display: inline-block; background: #00ff9d; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Umów bezpłatną konsultację</a>
</div>
```

---

### 10. Przydatne zasoby

**H2:** Przydatne zasoby

**Links:**
- [OpenSpec GitHub](https://github.com/Fission-AI/openspec) - oficjalne repo
- [OpenSpec Discord](https://discord.gg/YctCnvvshC) - community i feedback
- [5 technik pracy z Claude Code](/blog/5-technik-pracy-z-claude-code) - powiązany artykuł
- [Second Brain z Obsidian i Claude Code](/blog/second-brain-obsidian-claude-code-skills) - kontekst i skills

---

### 11. FAQ Section (~400 words)

**H2:** FAQ

**Questions (5):**

1. **Czy OPSX działa tylko z Claude Code czy też z Cursor i innymi AI coding assistants?**
   - OPSX generuje skills do `.claude/skills/` które są cross-editor compatible
   - Działa z Claude Code, Cursor, Windsurf i innymi asystentami wspierającymi skills
   - Kluczowe: `openspec init` tworzy odpowiednie pliki dla każdego edytora

2. **Jaka jest różnica między `/opsx:continue` a `/opsx:ff` i kiedy używać którego?**
   - `/opsx:continue` tworzy jeden artefakt na raz, dobre przy eksploracji
   - `/opsx:ff` (fast-forward) tworzy wszystkie planning artifacts naraz
   - Użyj `ff` gdy masz jasny obraz, `continue` gdy chcesz iterować

3. **Czy mogę stworzyć własny schemat OPSX dostosowany do workflow mojego zespołu?**
   - Tak, użyj `openspec schema init my-workflow` lub `openspec schema fork spec-driven my-workflow`
   - Schematy to pliki YAML w `openspec/schemas/`
   - Definiujesz artefakty, ich output i zależności

4. **Jak OPSX radzi sobie z sytuacją gdy podczas implementacji okazuje się że design jest błędny?**
   - To jest core feature OPSX - edytujesz `design.md` bezpośrednio
   - `/opsx:apply` kontynuuje od miejsca gdzie skończyłeś
   - Brak "phase gates" - możesz wrócić do dowolnego artefaktu kiedy chcesz

5. **Czy potrzebuję CLI openspec żeby używać OPSX czy mogę używać tylko komend slash?**
   - Skills (`/opsx:*`) wywołują CLI `openspec` w tle
   - Potrzebujesz zainstalowanego `openspec` CLI
   - Komendy slash to interface, CLI to engine

---

## SEO Keywords

**Primary:**
- OPSX workflow
- AI coding workflow
- strukturyzowana praca z AI

**Secondary:**
- OpenSpec
- Claude Code workflow
- artifact dependency graph
- AI coding assistant
- development workflow

**Long-tail:**
- jak strukturyzować pracę z AI coding assistant
- fluid iterative workflow AI development
- customizable AI development schemas

---

## Technical Accuracy Checklist

- [ ] Wszystkie komendy `/opsx:*` poprawne
- [ ] Schema YAML syntax correct
- [ ] Config YAML syntax correct
- [ ] Dependency graph accurate
- [ ] State transitions correct (BLOCKED → READY → DONE)
- [ ] CLI commands verified (`openspec init`, `openspec schemas`, etc.)

---

## Style Guidelines

### Language
- Polish narrative with English technical terms
- Keep: workflow, schema, artifacts, dependencies, CLI, skills
- Keep: BLOCKED, READY, DONE (states)
- Keep: DAG, topological sort

### Tone
- Direct, practical (Pawel's voice)
- First person where appropriate
- Short paragraphs (2-4 sentences)
- Bold key concepts on first mention

### Code Blocks
- ALL code blocks have language tags
- Use `text` for ASCII diagrams
- Use `yaml` for schema/config files
- Use `bash` for CLI commands

---

## Ready for Execution

**Checklist:**
- [x] Plan artifact created with full structure
- [x] Next blog ID determined: **19**
- [x] Frontmatter completely specified
- [x] All main sections outlined with word targets
- [x] FAQ section planned (5 questions)
- [x] Code examples identified with language tags
- [x] Language guidelines noted (no polonization)
- [x] SEO keywords identified
- [x] CTA HTML prepared
- [x] Resources/links identified

**Next Command:** `/blog-article-writer:execute`
