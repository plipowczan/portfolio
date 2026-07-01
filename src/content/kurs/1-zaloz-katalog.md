---
slug: 1-zaloz-katalog
order: 1
title: Załóż katalog z szablonu
excerpt: Czym jest LLM Wiki (koncept Karpathy'ego) i jak z darmowego szablonu postawić uzbrojoną, pustą bazę wiedzy — architektura 3 warstw, 3 indeksy, progressive disclosure, zero RAG.
---

Cel tej lekcji: przejść od „Use this template" do gotowej, uzbrojonej struktury bazy. Po lekcji rozumiesz koncept LLM Wiki, masz własne repo z szablonu i wiesz, **dlaczego** ta baza działa bez embeddings i RAG — architektura trzech warstw, trzy indeksy i zasada progressive disclosure.

## Po co to

LLM Wiki (koncept Karpathy'ego) odwraca RAG: zamiast za każdym razem przeszukiwać surowe dokumenty, agent **inkrementalnie buduje i utrzymuje** żywą bazę markdown — z cross-linkami, indeksami, syntezami. Wiedza **kumuluje się** (compounding) i jest czytelna **i dla agenta, i dla człowieka** (otwierasz plik, czytasz). Standard **OKF** (Open Knowledge Format, Google) formalizuje ten wzorzec → bazy są przenośne.

## Weź szablon

Na GitHubie „Use this template" (albo `git clone`) → własne repo. Otwórz folder w Claude Code. Opcjonalnie `npm install` (Quartz, publikacja) i `pip install -r requirements.txt` (skille pythonowe) — **do pierwszego pytania niepotrzebne**.

Repo szablonu: [github.com/plipowczan/second-brain-template](https://github.com/plipowczan/second-brain-template).

## Co dostajesz (drzewo szablonu)

```text
kb-template/
  .claude/  commands (/onboard /ingest /qa /compile /enhance /lint /reindex /gaps /refactor /output)
            skills (research, research-deep, research-report, ...)
            hooks/load_vault_map.py  (auto-ładuje mapę vaultu na starcie)
  content/  _raw/inbox (drop zone, jest sample-source.md) · _raw/processed (archiwum)
            _indexes (vault-map.md + catalog.md + graph.md)
            _outputs (answers/ + reports/) · templates/ · REFERENCE/ (wzorce)
  package.json (Quartz) · requirements.txt
```

To „**pusty, ale uzbrojony**" brain — cała mechanika gotowa, brak tylko Twojej wiedzy.

## Architektura — 3 warstwy

| Warstwa | Gdzie | Kto włada |
|---|---|---|
| Raw sources | `_raw/inbox` → `_raw/processed` | Ty wrzucasz, agent czyta (immutable) |
| Wiki | `content/<TOPIC>/` | Agent tworzy/utrzymuje noty |
| Schema | `CLAUDE.md` (z onboardingu) | Ty + agent współ-ewoluujecie |

## Dlaczego to działa bez RAG: progressive disclosure

**Progressive disclosure** to jedna zasada: **najpierw pokaż, co istnieje i ile kosztuje pobranie — niech agent sam zdecyduje, co wczytać.** Tak jak człowiek skanuje spis treści przed rozdziałem albo nazwy plików, zanim któryś otworzy.

Porównaj dwa podejścia do tego samego pytania:

- **Klasyczny RAG — „wrzuć wszystko".** Do kontekstu ląduje np. 35 000 tokenów notatek i historii, z czego realnie trafne jest może 2 000. Efektywność ~6%. Reszta zabiera uwagę modelu i miejsce na właściwe zadanie.
- **Index-first — progressive disclosure.** Agent czyta najpierw **indeks** (~kilkaset tokenów): co istnieje, jakiego typu, z jakimi tagami. Na tej podstawie pobiera **tylko** 2–3 trafne noty (~kilkaset tokenów). Trafność bliska 100%, a okno kontekstu zostaje wolne na myślenie.

To dlatego baza działa **bez embeddings i bez RAG do ~500 źródeł**: nie trzeba liczyć wektorów, gdy dobry indeks pozwala agentowi zawęzić wyszukiwanie samą lekturą.

## 3 indeksy — trzy poziomy powiększenia

Trzy indeksy w `content/_indexes/` to ten sam vault widziany z trzech odległości. Agent zaczyna z lotu ptaka i **przybliża** dopiero tam, gdzie trzeba.

### vault-map.md — mapa z lotu ptaka (L0)

Co gdzie leży: tabela folderów (ile not, jakie typy, dominujące tagi), chmura tagów i lista ostatnich zmian. Jedna „strona", z której agent wybiera **folder**, nie notę.

```text
---
updated: 2026-06-30T12:00:00Z
total_notes: 330
---
# Vault Map

## Folders
| folder             | notes | types              | top-tags                            |
|--------------------|------:|--------------------|-------------------------------------|
| AI/KNOWLEDGE/INFO  |    28 | knowledge-note(27) | ai, agents, context-engineering     |
| AI/TOOLS           |    69 | tool(69)           | tool, claude-code, agents           |
| CODE/TOOLS         |    40 | tool(40)           | frontend, framework, infrastructure |

## Tag Cloud
agents:29  ai:119  claude-code:38  context-engineering:11  rag:10  skills:16 …

## Recent Changes
- 2026-06-30 AI/TOOLS/Ponytail (ingest — vibe-coding skill: YAGNI-first, −54% LOC)
- 2026-06-25 CODE/TOOLS/Git (enhance — uzupełniony stub + linki)
```

Czytając to, agent od razu wie: „temat o agentach i tokenach? → folder `AI/KNOWLEDGE/INFO`". Zawęża, zanim cokolwiek otworzy.

### catalog.md — jedna linia na notę (L1)

Katalog wszystkich not, pogrupowany folderami. Każda nota to **jedna linia**: tytuł, typ, data, tagi, jednozdaniowe streszczenie i lista wychodzących linków.

```text
## AI/KNOWLEDGE/INFO
- **Context Engineering** | knowledge-note | 2026-04-09 | [ai, context-engineering] | Zarządzanie tym, co trafia do okna kontekstu agenta — indeksy, kompresja, progressive disclosure. | → Progressive Disclosure, Agent Skills, Claude Code
- **Progressive Disclosure** | knowledge-note | 2026-04-30 | [ai, memory] | Pokaż najpierw co istnieje i ile kosztuje pobranie; agent sam decyduje, co wczytać. | → Context Engineering, Harness Engineering
```

Format linii: `**Tytuł** | typ | data | [tagi] | streszczenie | → linki`. Po streszczeniach agent wybiera **konkretne noty** do otwarcia — wciąż nie czytając ich treści.

### graph.md — graf połączeń (L2)

Kto z kim linkuje. Dzięki temu agent po otwarciu jednej noty wie, które sąsiednie **dociągnąć**, żeby spiąć temat.

```text
## Outgoing
AI/KNOWLEDGE/INFO/Context Engineering -> AI/KNOWLEDGE/INFO/Progressive Disclosure, AI/TOOLS/Agent Skills, AI/TOOLS/Claude Code
AI/KNOWLEDGE/INFO/Progressive Disclosure -> AI/KNOWLEDGE/INFO/Context Engineering, AI/KNOWLEDGE/INFO/Harness Engineering
```

## Jak agent tego używa — przykład `/qa`

Zapytanie: `/qa "jak ograniczyć zużycie tokenów w agencie?"`

1. **vault-map (L0):** agent czyta mapę (~jedna strona). Widzi, że temat pasuje do `AI/KNOWLEDGE/INFO` (tagi `context-engineering`, `token-optimization`). Zawęża do tego folderu.
2. **catalog (L1):** czyta tylko linie tego folderu. Po streszczeniach wybiera 2 noty: „Token Optimization for Claude Code" i „Progressive Disclosure".
3. **Pełne noty (Layer 2):** otwiera **tylko te 2** — nie 330.
4. **graph (L2):** widzi, że obie linkują do „Context Engineering", więc dociąga ją, bo spina temat.

Efekt: agent przeczytał ~3 noty zamiast całej bazy. Kilkaset tokenów indeksu + kilka trafnych not — zamiast wrzucania wszystkiego. To jest progressive disclosure w akcji.

## Wzorzec — jak wygląda dobra nota

Zajrzyj do `REFERENCE/Example Note.md` i `Wikilinks Explained.md` — jak wygląda dobra nota i jak działają linki. Dobra nota ma frontmatter z `type`, jednozdaniowe `summary` (to trafia do katalogu) i kilka celnych `[[wikilinków]]` (to zasila graf).

## Pułapka

Nie pisz wiki ręcznie — to robota agenta; Ty dostarczasz źródła i dobre pytania. Nie edytuj też indeksów z palca — buduje je `/ingest` i `/reindex` (o tym w lekcjach 3 i 4).
