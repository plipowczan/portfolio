---
slug: 1-zaloz-katalog
order: 1
title: Załóż katalog z szablonu
excerpt: Czym jest LLM Wiki (koncept Karpathy'ego) i jak z darmowego szablonu postawić uzbrojoną, pustą bazę wiedzy — architektura 3 warstw, 3 indeksy, zero RAG.
---

Cel tej lekcji: przejść od „Use this template" do gotowej, uzbrojonej struktury bazy. Po lekcji rozumiesz koncept LLM Wiki, masz własne repo z szablonu i znasz architekturę trzech warstw plus trzy indeksy.

## Po co to

LLM Wiki (koncept Karpathy'ego) odwraca RAG: zamiast za każdym razem przeszukiwać surowe dokumenty, agent **inkrementalnie buduje i utrzymuje** żywą bazę markdown — z cross-linkami, indeksami, syntezami. Wiedza **kumuluje się** (compounding) i jest czytelna **i dla agenta, i dla człowieka** (otwierasz plik, czytasz). Standard **OKF** (Google) formalizuje ten wzorzec → bazy są przenośne.

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

## 3 indeksy — dlaczego działa bez embeddings i RAG do ~500 źródeł

- `vault-map.md` (L0, z lotu ptaka)
- `catalog.md` (L1, 1 linia/nota)
- `graph.md` (L2, graf linków)

Agent czyta indeks → wchodzi tylko w trafne noty (**progressive disclosure**), zamiast ładować wszystko.

## Wzorzec — jak wygląda dobra nota

Zajrzyj do `REFERENCE/Example Note.md` i `Wikilinks Explained.md` — jak wygląda dobra nota i jak działają linki.

## Pułapka

Nie pisz wiki ręcznie — to robota agenta; Ty dostarczasz źródła i dobre pytania.
