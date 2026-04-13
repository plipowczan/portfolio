# Plan: LLM Knowledge Base — od ręcznych notatek do agentowego systemu wiedzy

**Data:** 2026-04-12
**Status:** PLAN v2 — po korekcie narracji (feedback autora)
**Prime:** `.claude/agents/context/blog-prime-llm-knowledge-base.md`
**Brief:** `docs/blog/article-brain-kb-brief.md`

---

## Frontmatter

```yaml
id: 24
slug: llm-knowledge-base-brain-karpathy
title: "Jak LLM Wiki Karpathy'ego pomogła mi uporządkować moją bazę wiedzy"
excerpt: "Od ręcznych notatek w Obsidian do systemu, w którym agent pilnuje struktury, indeksów i standardów. Jak koncepcja LLM Wiki pomogła mi sformalizować to, co budowałem od lat."
category: AI
author: Pawel Lipowczan
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
lang: pl
alternateSlug: llm-knowledge-base-brain-karpathy
```

**SEO keywords:**
- Primary: "LLM knowledge base", "LLM Wiki"
- Secondary: "Obsidian AI", "personal knowledge management AI", "second brain AI agent"
- Long-tail: "jak zbudować bazę wiedzy z AI", "Karpathy LLM Wiki"

---

## Narracja — korekta autora

**WAŻNE:** To NIE jest historia "zbudowałem to samo co Karpathy niezależnie". Prawdziwa narracja:
1. Vault istnieje od 2022 — początkowo ręczne notatki w Obsidian
2. Z czasem agent (Claude Code) zaczął pomagać w zarządzaniu — pilnowanie struktury, standardów, indeksów
3. Repozytorium Karpathy'ego (LLM Wiki, kwiecień 2026) **pomogło uporządkować** procesy: zasilanie, zbieranie, indeksowanie, pilnowanie poprawności
4. Kluczowa motywacja: notatki ułożone tak, żeby **agent AI mógł je łatwo znaleźć** bez zaśmiecania kontekstu
5. **Progressive disclosure** = centralny koncept — minimalizacja zużycia okna kontekstowego

Arc artykułu: ewolucja (ręczne → agentowe) + Karpathy jako katalizator formalizacji + progressive disclosure jako klucz

---

## Zróżnicowanie od artykułu id:16

| Aspekt | id:16 (Second Brain z Obsidian) | id:24 (ten artykuł) |
|--------|-------------------------------|----------------------|
| Kąt | Jak zacząć — intro do Obsidian + Claude Code Skills | Ewolucja systemu + jak Karpathy pomógł go sformalizować |
| Głębokość | Ogólny przewodnik, concept Skills | Konkretna architektura: CLAUDE.md, 3 indeksy, 4 workflows, progressive disclosure |
| Hook | "Claude Code to nie tylko do kodu" | Karpathy opisał framework — ja miałem żywy system do uporządkowania |
| Centralny koncept | Skills jako narzędzie | Progressive disclosure — notatki zorganizowane DLA agenta |
| Docelowy | Początkujący → chce zacząć | Zaawansowany → chce zobaczyć produkcyjny system |
| Linkowanie | — | Link do id:16 jako "jeśli zaczynasz od zera" |

---

## Struktura artykułu

### Sekcja 1: Hook — Karpathy opisał framework, ja miałem żywy system (~350 słów)

**H2:** *Karpathy opisał framework. Ja miałem żywy system do uporządkowania.*

Treść:
- Karpathy w kwietniu 2026 opisał "LLM Wiki" na X — cytat z wątku
- Czytam i widzę: on opisuje podejście, które ja budowałem organicznie od 2022
- ALE: nie twierdzę że "miałem to samo" — mój vault ewoluował z ręcznych notatek, stopniowo agent przejmował coraz więcej pracy
- Repozytorium Karpathy'ego **pomogło mi sformalizować** procesy — nazwać warstwy, uporządkować indeksowanie, dopisać safety rules
- To nie historia "zbudowałem to przed nim" — to historia ewolucji od ręcznego PKM do agentowego systemu, z Karpathym jako katalizatorem porządkowania
- Zapowiedź: pokażę tę ewolucję — od chaosu ręcznych notatek do systemu, w którym agent pilnuje struktury

**Cytat do wplecenia:**
> *"Boring part of maintaining a knowledge base isn't reading or thinking — it's bookkeeping."* — Karpathy

**Link:** wątek Karpathy na X + LLM Wiki gist

---

### Sekcja 2: Dlaczego klasyczne PKM nie działa (~400 słów)

**H2:** *Problem z klasycznym PKM*

Treść:
- Maintenance burden rośnie szybciej niż wartość
- Cross-referencje zawsze niepełne (zapominamy linkować)
- Wikis giną z powodu maintenance, nie braku wartości
- Zettelkasten / BASB / Digital Garden — piękne filozofie, ale TY jesteś bottleneckiem
- Karpathy ujął to precyzyjnie: bookkeeping, nie myślenie

**Format:** lista bullet points z bold key phrases + blockquote Karpathy

---

### Sekcja 3: Architektura systemu (~600 słów)

**H2:** *Architektura — jak to wygląda po uporządkowaniu*

#### Podsekcja 3a: Stack techniczny
**H3:** *Stack techniczny*

Lista z bold:
- **Obsidian** — edytor/frontend (lokalny, Git-based)
- **Quartz 4** — SSG → GitHub Pages
- **GitHub Actions** — deploy na push do `v4`
- **Claude Code** — agent utrzymujący vault
- **URL:** brain.lipowczan.pl

#### Podsekcja 3b: Trzy warstwy
**H3:** *Trzy warstwy — framework Karpathy'ego, który pomógł mi uporządkować*

Tabela porównawcza:

| Warstwa | Karpathy (LLM Wiki) | Moja implementacja |
|---------|----------|-------------------|
| Raw sources | Immutable drop zone | `/content/_raw/inbox/` |
| Wiki | LLM-generated .md | `/content/<TOPIC>/` |
| Schema | Config document | `CLAUDE.md` — 300+ linii |

Komentarz: Te warstwy istniały u mnie organicznie, ale Karpathy dał im nazwę i strukturę. Jego framework pomógł mi sformalizować to co było rozproszone — szczególnie separation raw sources od przetworzonej wiki.

#### Podsekcja 3c: Progressive disclosure — klucz do całego systemu
**H3:** *Progressive disclosure — dlaczego notatki są ułożone DLA agenta*

**Centralny koncept artykułu.** Notatki nie są ułożone żeby ładnie wyglądały — są ułożone żeby agent AI mógł je szybko znaleźć BEZ zaśmiecania okna kontekstowego niepotrzebnymi informacjami.

Trzy indeksy nawigacyjne (od ogółu do szczegółu):
- `vault-map.md` (~80 linii) — bird's-eye view, agent czyta ZAWSZE pierwszy
- `catalog.md` (~650 linii) — jedna linia per notatka, agent czyta gdy potrzebuje konkretnej notatki
- `graph.md` — wikilink graph, agent czyta gdy potrzebuje kontekstu powiązań

Wyjaśnienie: agent nawiguje jak człowiek ze spisem treści — nie grep-uje 185 plików. Dzięki temu okno kontekstowe zostaje czyste, a odpowiedzi trafniejsze.

**Code block (text):**
```text
_indexes/
├── vault-map.md   ← zawsze pierwszy (~80 linii)
├── catalog.md     ← 1 linia / notatka (~650 linii)
└── graph.md       ← wikilink edges
```

---

### Sekcja 4: CLAUDE.md jako serce systemu (~500 słów)

**H2:** *CLAUDE.md — "schema" jako serce systemu*

Treść:
- Karpathy nazywa to "schema document" — w moim przypadku to CLAUDE.md
- 300+ linii, pisane ręcznie (nie przez LLM!)
- Co zawiera: struktura katalogów, navigation protocol, writing style, frontmatter schema, workflow definitions, safety rules
- ETH Zurich 2026: LLM-generated agentfiles pogarszają performance przy 20%+ wyższym koszcie
- Less is more — universally applicable instructions

**Code block (yaml):** fragment frontmatter schema z CLAUDE.md (przykładowy)

**Cytat:**
> *"Kluczowy insight: większość failures agentów to nie problem modelu, lecz konfiguracji."*

---

### Sekcja 5: Workflows — co agent umie zrobić (~700 słów)

**H2:** *Workflows — co agent umie zrobić*

#### 5a: INGEST (najczęstszy)
**H3:** *INGEST — od pliku do wiedzy w 5 minut*

Numbered list (7 kroków):
1. Drop do `_raw/inbox/`
2. `ingest` w Claude Code
3. Agent czyta vault-map, sprawdza catalog
4. Tworzy notatkę z template, wypełnia frontmatter
5. Dodaje wikilinki + aktualizuje powiązane notatki
6. Przenosi source do `_raw/processed/`
7. Aktualizuje trzy indeksy

**Liczby:** 10-15 plików w jednym passie. Ręcznie: 2h. Z agentem: 5 min + review.

#### 5b: COMPILE
**H3:** *COMPILE — syntetyzuj z wielu źródeł*

Krótki opis: agent łączy wiele notatek w skompilowany artykuł.

#### 5c: Q&A
**H3:** *Q&A — odpowiedzi z cytowaniami w 30 sekund*

Przykład: "What do my notes say about context engineering?" → odpowiedź z cytowaniami.

#### 5d: LINT
**H3:** *LINT — health-check*

Krótki opis: broken wikilinks, orphan notes, brakujące summaries, TODO markers.

---

### Sekcja 6: Ewolucja i obecny stan (~400 słów)

**H2:** *Od ręcznych notatek do 185 plików pilnowanych przez agenta*

Treść:
- **Faza 1 (2022-2024):** Ręczne notatki w Obsidian. Rosnący chaos, niepełne cross-referencje
- **Faza 2 (2024-2025):** Agent zaczyna pomagać — najpierw proste taski, potem coraz więcej maintenance
- **Faza 3 (2026):** Karpathy LLM Wiki → formalizacja procesów, 3 warstwy, 3 indeksy
- Stan dziś: 185 notatek, 13 kategorii (AI/19, LIFE/40, BUSINESS/26, CODE/23, PROJECTS/12)
- Porównanie:
  - **Kiedyś:** przeczytam → może zapiszę → zapomnę → szukam od nowa
  - **Teraz:** Web Clipper → inbox → `ingest` → agent wplata w sieć wiedzy
- Co się compound-uje: agent pilnuje struktury i standardów, każda notatka automatycznie trafia we właściwe miejsce z właściwymi linkami

**Cytat:**
> *"Wiki to persistent, compounding artifact — cross-references gotowe, contradictions flagged."*

---

### Sekcja 7: Filozofia — organizuj wiedzę DLA agenta (~350 słów)

**H2:** *Notatki ułożone dla agenta, nie dla estetyki*

Treść:
- Kluczowy mindset shift: nie organizujesz notatek żeby TY łatwiej szukał — organizujesz je żeby AGENT łatwiej znajdował
- Agent jest primary consumer Twojej bazy wiedzy — Ty jesteś curator
- Progressive disclosure minimalizuje zużycie okna kontekstowego → trafniejsze odpowiedzi, niższy koszt
- Paralela z agentic coding:

Tabela porównawcza:

| | Agentic Coding | LLM Knowledge Base |
|---|---|---|
| Ty | Architekt środowiska | Curator (sourcing, pytania, decyzje) |
| Agent | Implementuje kod | Bookkeeper, writer, cross-referencer |

- Agent nie zastępuje myślenia — zastępuje bookkeeping
- Ty decydujesz CO ingestować, jakie pytania zadać, co kompilować

**Cytat:**
> *"Shift: from 'developer who writes code' to 'architect who designs systems for agents to write code.'"*

---

### Sekcja 8: Wnioski (~300 słów)

**H2:** *Co z tego wynika*

Numbered list (5 takeaways):
1. **Metodologia > narzędzie.** Zettelkasten, BASB, LLM Wiki — filozofie, nie apps.
2. **CLAUDE.md to kontrakt z agentem.** Ewoluuje z doświadczenia. Zacznij prosto.
3. **Progressive disclosure działa.** Trzy indeksy to nie over-engineering.
4. **Agent nie zastępuje myślenia.** Zastępuje bookkeeping.
5. **Git repo jako fundament.** Version history, branching, Quartz 4 → digital garden.

**Link wewnętrzny:** do id:16 → "Jeśli chcesz zacząć od zera, przeczytaj [Second Brain z Obsidian i Claude Code](/blog/second-brain-obsidian-claude-code-skills)"

---

### Sekcja 9: CTA

**HTML div** z:
- "Chcesz zbudować podobny system?"
- Link do /#contact
- Styl: green accent, bez emoji

---

### Sekcja 10: Zasoby

**H2:** *Zasoby*

Lista linków:
- Wątek Karpathy na X
- LLM Wiki gist na GitHub
- brain.lipowczan.pl
- Quartz 4
- Obsidian
- Powiązany: Second Brain z Obsidian i Claude Code Skills (id:16)

---

### Sekcja 11: FAQ (~500 słów)

**H2:** *FAQ*

**5 pytań:**

1. **Czym różni się LLM Wiki od tradycyjnego RAG na dokumentach?**
   → RAG szuka fragmentów, LLM Wiki buduje persistent wiki — cross-references, syntezy, flagowanie sprzeczności. Nie odpowiada na pytanie; utrzymuje kompletną bazę wiedzy.

2. **Czy potrzebuję Obsidian żeby zbudować podobny system?**
   → Nie — Obsidian to wygodny frontend, ale wystarczy dowolny edytor + Git repo z plikami .md. Kluczowe to CLAUDE.md (schema) i indeksy nawigacyjne.

3. **Ile czasu zajmuje konfiguracja CLAUDE.md dla knowledge base?**
   → Pierwsza wersja: 1-2 godziny. Ale to dokument, który ewoluuje — zaczynasz od prostych reguł i dodajesz na podstawie tego co agent robi źle. Po miesiącu masz solidną konfigurację.

4. **Czym jest progressive disclosure i dlaczego jest kluczowe dla bazy wiedzy z AI?**
   → Progressive disclosure to zasada organizacji notatek w warstwach — od ogólnego spisu treści (80 linii) przez katalog (650 linii) do konkretnych plików. Agent czyta tylko tyle ile potrzebuje, nie zaśmiecając okna kontekstowego. To kluczowa różnica między bazą wiedzy "która działa" a taką, gdzie agent gubi się w 185 plikach.

5. **Czy system wymaga technicznego background'u do wdrożenia?**
   → Podstawowy: Git, terminal, pliki Markdown. Nie musisz kodować. Najtrudniejsza część to napisanie dobrego CLAUDE.md — a ten artykuł + id:16 dają Ci solidną bazę startową.

---

## Word count targets

| Sekcja | Target | Cumulative |
|--------|--------|------------|
| Hook | ~350 | 350 |
| Problem PKM | ~400 | 750 |
| Architektura | ~600 | 1350 |
| CLAUDE.md | ~500 | 1850 |
| Workflows | ~700 | 2550 |
| Skala + workflow | ~400 | 2950 |
| Filozofia | ~350 | 3300 |
| Wnioski | ~300 | 3600 |
| CTA | ~50 | 3650 |
| Zasoby | ~50 | 3700 |
| FAQ | ~500 | 4200 |
| **Total** | **~4200** | **≈ 15 min read** |

---

## Techniczne notatki

### Code blocks (wszystkie z language tag)
- `text` — drzewo katalogów, indeksy
- `yaml` — frontmatter schema
- `bash` — komendy Claude Code (opcjonalne)

### Tabele
- Karpathy vs moja implementacja (3 warstwy)
- Agentic coding vs LLM KB (filozofia)

### Cytaty (blockquotes)
- 4 cytaty z briefu — rozmieszczone po sekcjach

### Linkowanie wewnętrzne
- Do id:16 (second-brain-obsidian-claude-code-skills) — w sekcji wnioski
- Opcjonalnie: do id:19 (opsx-workflow) jeśli pasuje kontekst

### Linkowanie zewnętrzne
- Karpathy wątek X
- LLM Wiki gist
- brain.lipowczan.pl
- Quartz 4
- Obsidian

---

## Checklist przed execution

- [x] Plan artifact stworzony z pełną strukturą
- [x] Next blog ID: 24
- [x] Frontmatter kompletnie wyspecyfikowany
- [x] Wszystkie sekcje z word targets
- [x] FAQ zaplanowane (5 pytań)
- [x] Code blocks z language tags
- [x] Wytyczne językowe (bez polonizacji)
- [x] SEO keywords zidentyfikowane
- [x] Zróżnicowanie od id:16 jasne
- [x] Narracja skorygowana: ewolucja + Karpathy jako katalizator (nie "niezależna zbieżność")
- [x] Progressive disclosure jako centralny koncept
- [x] Gotowe do execution

---

**Next command:** `/blog-article-writer:execute`
