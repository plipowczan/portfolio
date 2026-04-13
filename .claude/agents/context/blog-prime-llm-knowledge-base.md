# Blog Prime: LLM Knowledge Base / Brain Vault

**Data:** 2026-04-12  
**Status:** Ready for planning  
**Next command:** `/blog-article-writer:plan "LLM Knowledge Base - jak Karpathy opisał to co zbudowałem"`

---

## Materiały źródłowe

| Plik | Typ | Zawartość |
|------|-----|-----------|
| `docs/blog/article-brain-kb-brief.md` | **Główny brief** | Kompletny wsad: struktura, cytaty, linki, screenshoty |
| `docs/blog/ode mnie.md` | Pomocniczy | Stary szkic, słabo rozwinięty — pomijamy |
| `src/content/blog/second-brain-obsidian-claude-code-skills.md` | Istniejący artykuł | POWIĄZANY — różny kąt, konieczne linkowanie |

---

## Kluczowe tematy do pokrycia

### Hook / Punkt wyjścia
Andrej Karpathy w kwietniu 2026 opisał "LLM Wiki" na X — i to dokładnie to, co Paweł zbudował samodzielnie jako codzienne narzędzie pracy (nie eksperyment). Ten déjà vu jest centralnym hookiem artykułu.

### Problem z klasycznym PKM (pain points)
- Maintenance burden rośnie szybciej niż wartość
- Cross-referencje zawsze niepełne
- Zettelkasten/BASB zakładają, że TY jesteś bottleneckiem
- Wikis giną z powodu maintenance, nie braku wartości

### Architektura systemu (konkretna, techniczna)
- Stack: Obsidian (frontend) + Quartz 4 (SSG) + GitHub Pages + GitHub Actions + Claude Code (agent)
- Trzy warstwy: Raw sources / Wiki / Schema — 1:1 z Karpathym (niezależnie wymyślone)
- Trzy indeksy: vault-map.md (~80 linii) + catalog.md (~650 linii) + graph.md
- Progressive disclosure dla agenta (zamiast grep całego katalogu)
- URL publiczny: brain.lipowczan.pl

### CLAUDE.md jako "schema document"
- 300+ linii, pisane ręcznie (nie przez LLM)
- Co zawiera: struktura katalogów, navigation protocol, writing style, frontmatter schema, workflows, safety rules
- Insight z harness engineering: LLM-generated agentfiles pogarszają performance (badanie ETH Zurich 2026)
- Less is more — universally applicable instructions

### Workflows agenta (konkretne, z liczbami)
- **INGEST**: drop file → 5 minut vs 2 godziny ręcznie, dotyka 10-15 plików na pass
- **COMPILE**: syntetyzuje artykuły z wielu notatek
- **Q&A**: natural language query → 30 sekund z cytowaniami
- **LINT**: health-check, broken wikilinks, orphan notes

### Skala i stan obecny
- 185 notatek, 13 kategorii (AI, BUSINESS, CODE, LIFE, PROJECTS, CRYPTO...)
- Breakdown: AI/19, LIFE/40, BUSINESS/26, CODE/23, PROJECTS/12

### Filozofia: agent jako bookkeeper, nie myślący
- Kontrast: agent zastępuje bookkeeping, nie myślenie
- Parallel z agentic coding: developer=architekt środowiska, agent=implementuje
- "You are responsible for sourcing, exploration, and asking good questions"

---

## Cytaty do wplecenia (gotowe)

> *"Nudna część utrzymania knowledge base to nie czytanie ani myślenie — to bookkeeping. LLMs don't get bored."* — Karpathy

> *"Wiki to persistent, compounding artifact — cross-references są gotowe, contradictions already flagged."*

> *"Kluczowy insight: większość failures agentów to nie problem modelu, lecz konfiguracji."*

> *"Shift: from 'developer who writes code' to 'architect who designs systems for agents to write code.'"*

---

## Profil docelowego czytelnika

- Developer lub founder, świadomy AI, 18–45 lat
- Zna Obsidian lub PKM (PARA, Zettelkasten, BASB) — ale nie wie jak połączyć z agentem
- Frustracja: ręczne notatki nie skalują się
- Motywacja: zobaczyć działający system, nie teorię

---

## Unikalny kąt / value proposition

**To nie jest kolejny "jak używać Obsidian z AI" tutorial.** To opis dojrzałego, produkcyjnego systemu vault z 3-letnim historycznym tłem (od 2022), który niezależnie zbiegł się z tym co Karpathy opisał jako przyszłość PKM. Autentyczność (budowane na potrzeby własne, nie jako eksperyment) + zbieżność z badaczem to silny hook.

Różnica od `second-brain-obsidian-claude-code-skills.md`:
- Tamten artykuł: jak zacząć + skills jako concept (ogólny przewodnik)
- Ten artykuł: konkretna, dojrzała architektura z CLAUDE.md, indeksami, workflows i liczbami

---

## Styl pisania (na podstawie analizy istniejących artykułów)

- **Język:** polski + angielskie terminy techniczne (LLM, vault, ingest, workflow, progressive disclosure)
- **Ton:** refleksyjny, first-person, "z własnego doświadczenia"
- **Format:** long-form (2500–3500 słów), ~14–16 min read
- **Struktura:** hook z osobistą historią → problem → architektura → workflows → filozofia → takeaways
- **Tabele:** do porównań (Karpathy vs moja implementacja — już jest w briefie)
- **Code blocks:** z tagiem języka (`text`, `yaml`, `bash`)
- **FAQ:** wymagane (4-6 pytań, `<details open>` format)
- **CTA:** HTML/Tailwind, kategoria AI

---

## Frontmatter planowany

```yaml
id: 24
slug: llm-knowledge-base-brain-karpathy
title: "Karpathy opisał LLM Wiki. Ja już to miałem."
# alternatywne:
# "Mój second brain z AI — jak Claude utrzymuje bazę wiedzy za mnie"
# "LLM Knowledge Base: jak przestałem ręcznie utrzymywać notatki"
category: AI
date: 2026-04-12
readTime: 15 min
image: /images/og-llm-knowledge-base-brain.webp
tags:
  - AI
  - Claude Code
  - Obsidian
  - Second Brain
  - PKM
  - Knowledge Management
```

---

## Linki do artykułu (z briefu)

- Wątek Karpathy'ego na X: https://x.com/karpathy/status/2039805659525644595
- LLM Wiki gist: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- brain.lipowczan.pl (publiczny vault)
- https://quartz.jzhao.xyz/
- Powiązany artykuł wewnętrzny: `/blog/second-brain-obsidian-claude-code-skills`

---

## Wizualia / screenshoty do zdobycia (notatka dla Pawła)

- [ ] Obsidian graph view — sieć notatek
- [ ] Fragment CLAUDE.md z workflow definition  
- [ ] Diagram: inbox → ingest → vault
- [ ] Struktura katalogów (drzewo)
- [ ] Porównanie RAG vs LLM Wiki (tabela — możemy to generować w artykule)

---

## Weryfikacja techniczna

- Quartz 4 jako SSG: aktualna wersja, GitHub Pages deploy — OK
- Claude Code jako agent (file operations): potwierdzone w istniejących artykułach
- Karpathy tweet/gist: kwiecień 2026, URL w briefie (do weryfikacji przez autora przed publikacją)
- ETH Zurich badanie 2026 (LLM-generated agentfiles): wzmianka w briefie autora — nie weryfikować niezależnie, autor zna źródło

---

## Status checklisty prime

- [x] Wszystkie materiały źródłowe zidentyfikowane i przeczytane
- [x] Styl Pawła zrozumiany (second-brain-obsidian + opsx-workflow jako referencje)
- [x] Wytyczne portfolio-copywriting przejrzane
- [x] Kluczowe tematy i koncepty wyekstrahowane
- [x] Artefakt prime stworzony z kompletnym kontekstem
- [x] Następny ID: 24
- [x] Gotowe do planowania
