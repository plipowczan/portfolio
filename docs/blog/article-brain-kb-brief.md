# Wsad do artykułu: Jak buduję swoją bazę wiedzy z AI

**Data:** 2026-04-12
**Status:** draft / wsad dla asystenta

---

## Meta informacje

**Roboczy tytuł:** _Mój „second brain" z AI — jak Claude utrzymuje moją bazę wiedzy za mnie_
**Alternatywne tytuły:**

- _LLM Knowledge Base — jak przestałem ręcznie utrzymywać notatki_
- _Obsidian + Claude Code = personal wiki, która rośnie sama_
- _Jak Karpathy opisał dokładnie to, co zbudowałem (nie wiedząc o tym)_

**Docelowy czytelnik:** developer/founder świadomy AI, który zna Obsidian lub PKM, ale nie wie jak połączyć to z agentem. 18–45 lat.

**Format:** long-form blog post, techniczny ale osobisty. Polski (z angielskim technicznym). Styl: refleksyjny, konkretny, first-person.

---

## Struktura artykułu — propozycja

### 1. Hook — zbieżność której nie planowałem

Andrej Karpathy w kwietniu 2026 opisał na X koncepcję "LLM Wiki": zamiast RAG, LLM buduje i utrzymuje persistent wiki z twoich źródeł. Czytam ten wątek i mam déjà vu — on opisuje dokładnie to, co ja zbudowałem. **Tyle że ja zbudowałem to nie jako eksperyment badacza, tylko jako codzienne narzędzie pracy.**

Ten vault (repozytorium `brain`) istnieje od 2022 roku. Przez lata był ręcznie utrzymywanym Obsidianem. Od kiedy weszłem głębiej w agentic coding — Claude Code przejął maintenance, a ja przestałem pisać notatki ręcznie.

### 2. Problem z klasycznym PKM

**Co nie działało w ręcznym modelu:**

- Maintenance burden rośnie szybciej niż wartość
- Cross-referencje były zawsze niepełne — zapominałem linkować nowe notatki do starych
- Wikis giną nie dlatego że ludzie przestają czytać — giną dlatego że maintenance staje się chore
- Zettelkasten, Building a Second Brain, Digital Garden — piękne metodologie, ale wszystkie zakładają że TY jesteś bottleneckiem

**Karpathy ujął to precyzyjnie:** _"Boring part of maintaining a knowledge base isn't reading or thinking — it's bookkeeping: updating cross-references, keeping summaries current, noting contradictions. LLMs don't get bored."_

### 3. Co zbudowałem — architektura

**Stack techniczny:**

- **Obsidian** — edytor/frontend (lokalny, Git-based)
- **Quartz 4** — Static Site Generator → GitHub Pages
- **GitHub Actions** — deploy na push do brancha `v4`
- **Claude Code** — agent utrzymujący vault
- **Publiczny URL:** [brain.lipowczan.pl](https://brain.lipowczan.pl)

**Trzy warstwy (1:1 z Karpathym, choć wymyślone niezależnie):**

| Warstwa     | Karpathy                | Moja implementacja                                 |
| ----------- | ----------------------- | -------------------------------------------------- |
| Raw sources | Immutable drop zone     | `/content/_raw/inbox/` — drop zone, nie w buildzie |
| Wiki        | LLM-generated .md files | `/content/<TOPIC>/` — budowane i publikowane       |
| Schema      | Config document         | `CLAUDE.md` — 300+ linii konfiguracji agenta       |

**Trzy indeksy nawigacyjne (navigation protocol):**

- `_indexes/vault-map.md` — bird's-eye view, zawsze czytany pierwszy (~80 linii)
- `_indexes/catalog.md` — jedna linia per notatka, ~650 linii
- `_indexes/graph.md` — wikilink graph (outgoing + incoming)

To "progressive disclosure" dla agenta — zamiast grep-ować cały katalog, agent czyta indeksy jak człowiek czyta spis treści.

### 4. CLAUDE.md — "schema" jako serce systemu

Karpathy nazywa to "schema document". W moim przypadku to `CLAUDE.md` — plik wstrzykiwany do system promptu Claude Code przy każdej sesji.

Co zawiera:

- Struktura katalogów i ich przeznaczenie
- Navigation protocol (progressive disclosure indeksów)
- Writing style guidelines (styl pisania, emoji w nagłówkach, mix PL/EN)
- Frontmatter schema (YAML metadane każdej notatki)
- Workflow definitions (INGEST, COMPILE, LINT, Q&A, ENHANCE)
- Safety rules (czego nigdy nie modyfikować)

**Kluczowy insight z harness engineering:** CLAUDE.md nie jest generowane przez LLM. Jest pisane ręcznie i ewoluuje z doświadczenia. Badanie ETH Zurich (2026) pokazało, że LLM-generated agentfiles _pogarszały_ performance przy 20%+ wyższym koszcie. Less is more, universally applicable instructions.

### 5. Workflows — co agent umie zrobić

**INGEST (najczęstszy workflow):**

1. Wrzucam plik do `_raw/inbox/`
2. Piszę `ingest` lub `process inbox`
3. Agent czyta vault-map, sprawdza catalog pod kątem nakładań
4. Tworzy notatkę z template'u, wypełnia frontmatter
5. Dodaje wikilinki do powiązanych notatek + aktualizuje te notatki żeby linkowały z powrotem
6. Przenosi source do `_raw/processed/YYYY-MM-DD_...`
7. Aktualizuje wszystkie trzy indeksy

Jeden source może dotknąć 10-15 plików w jednym passie. Ręcznie — 2 godziny. Z agentem — 5 minut + review.

**COMPILE:**
Agent syntetyzuje artykuł z wielu istniejących notatek. Tworzy `compiled-note`. Przykład: nota o LLM Knowledge Bases to skompilowany artykuł z wątku Karpathy'ego.

**Q&A:**
"What do my notes say about context engineering?" → agent czyta indeksy, identyfikuje kandydatów, czyta notatki, syntetyzuje odpowiedź z cytowaniami. Dobre odpowiedzi mogą trafić z powrotem do wiki.

**LINT:**
Periodyczny health-check: broken wikilinks, orphan notes, brakujące summaries, TODO markery. Generuje raport do `_outputs/reports/`.

### 6. Skala i obecny stan

Vault: **185 notatek**, 13 tematycznych kategorii (AI, BUSINESS, CODE, LIFE, PROJECTS, CRYPTO...), indeksy auto-aktualizowane po każdej operacji.

Breakdown folderów:

- `AI/` — 19 notatek (knowledge-notes + tools: Claude Code, harness engineering, context engineering, skills...)
- `LIFE/` — 40 notatek (books, knowledge, tools)
- `BUSINESS/` — 26 notatek
- `CODE/` — 23 notatki
- `PROJECTS/` — 12 notatek (projekty własne: Qamera AI, Brain, Agentic Systems...)

### 7. Jak to zmienia workflow z wiedzą

**Przed:** przeczytam artykuł → może zapiszę link → zapomnę gdzie → szukam od nowa gdy potrzebuję

**Po:**

1. Klikam "Obsidian Web Clipper" → artykuł ląduje w `/inbox/` jako `.md`
2. `ingest` w Claude Code → notatka w vault, powiązana z istniejącą wiedzą
3. Przy pytaniu: "co wiem o context engineering?" → Q&A w 30 sekund

**Co się compound-uje:** każda nowa notatka jest automatycznie wplatana w istniejący graph. Cross-referencje nie są zapomniane. Sprzeczności są flagowane. "Maintenance cost → ~0".

### 8. Relacja z agentic coding — ten sam paradygmat

Kluczowe połączenie: ten vault to _ta sama filozofia_ co podejście do kodu w agentic coding.

W agentic coding:

- Developer = architekt środowiska (specs, context, guardrails)
- Agent = implementuje

W LLM Knowledge Base:

- User = curator (sourcing, eksploracja, dobre pytania)
- Agent = bookkeeper, writer, cross-referencer

Obydwa podejścia: ty projektujesz system, agent go utrzymuje. "You are responsible for sourcing, exploration, and asking good questions."

### 9. Wnioski / takeaways

1. **Metodologia > narzędzie.** Zettelkasten, Building a Second Brain, LLM Wiki — to filozofie, nie apps. Kluczowe jest zrozumienie dlaczego, nie które narzędzie.

2. **CLAUDE.md to twój kontrakt z agentem.** Ewoluuje z doświadczenia. Zacznij od prostego, dodawaj tylko co faktycznie używasz.

3. **Progressive disclosure działa.** Trzy poziomy indeksów (vault-map → catalog → graph) to nie over-engineering — to jedyne co pozwala agentowi działać sensownie na 185+ notatkach bez grep-owania całego katalogu.

4. **Agent nie zastępuje myślenia.** Zastępuje bookkeeping. To różnica. Decyzja co ingestować, jakie pytania zadać, co kompilować — nadal twoja.

5. **Zrób to jako git repo.** Version history, branching, collaboration — za darmo. Quartz 4 jako SSG daje ci publiczny digital garden na GitHub Pages.

---

## Cytaty / fragmenty do wplecenia

Z notatki LLM Knowledge Bases:

> _"Wiki to persistent, compounding artifact — cross-references są gotowe, contradictions already flagged, synteza odzwierciedla wszystko."_

> _"User nigdy (lub rzadko) pisze wiki sam. LLM pisze i utrzymuje wszystko. User odpowiada za sourcing, eksplorację i zadawanie dobrych pytań."_

> _"Nudna część utrzymania knowledge base to nie czytanie ani myślenie — to bookkeeping. Maintenance cost → ~0."_

Z notatki Harness Engineering:

> _"Kluczowy insight: większość failures agentów to nie problem modelu, lecz konfiguracji."_

Z notatki Agentic Coding:

> _"Shift: from 'developer who writes code' to 'architect who designs systems for agents to write code.'"_ synteza odzwierciedla wszystko."\*

> _"User nigdy (lub rzadko) pisze wiki sam. LLM pisze i utrzymuje wszystko. User odpowiada za sourcing, eksplorację i zadawanie dobrych pytań."_

> _"Nudna część utrzymania knowledge base to nie czytanie ani myślenie — to bookkeeping. Maintenance cost → ~0."_

Z notatki Harness Engineering:

> _"Kluczowy insight: większość failures agentów to nie problem modelu, lecz konfiguracji."_

Z notatki Agentic Coding:

> _"Shift: from 'developer who writes code' to 'architect who designs systems for agents to write code.'"_

---

## Linki / zasoby do artykułu

- [Wątek Karpathy'ego na X](https://x.com/karpathy/status/2039805659525644595?s=46) (kwiecień 2026)
- [LLM Wiki gist na GitHubie](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [brain.lipowczan.pl](https://brain.lipowczan.pl) — vault publiczny
- [Quartz 4](https://quartz.jzhao.xyz/)
- [Obsidian](https://obsidian.md/)
- [claude-piv-skeleton](https://github.com/plipowczan/claude-piv-skeleton) — powiązany projekt (agentic coding workflow)

---

## Wizualia / screenshoty do artykułu

- Obsidian graph view — sieć notatek
- Fragment CLAUDE.md z workflow definition
- Diagram: inbox → ingest → vault (flow)
- Porównanie: RAG vs LLM Wiki (tabela lub diagram)
- Struktura katalogów (drzewo)
