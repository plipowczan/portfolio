---
slug: 5-rozwoj-i-publikacja
order: 5
title: Rozwój i publikacja
excerpt: Opublikuj bazę przez Quartz, zrozum przenośność OKF i poznaj ścieżkę rozwoju — multi-brain, MCP, publikacja i wymiana bundli wiedzy.
---

Cel tej lekcji: opublikować bazę i poznać ścieżkę rozwoju. Po lekcji umiesz publikować przez Quartz, znasz drogę dalej i rozumiesz przenośność OKF.

## Publikacja (opcja)

`npx quartz build` → strona WWW (jak `brain.lipowczan.pl`). Markdown zostaje markdownem; Quartz to tylko warstwa publikacji.

## OKF / przenośność

Markdown + frontmatter + `index.md`/`log.md` = baza, którą da się wymienić. „If you can `git clone` it, you can ship it."

## Ścieżka rozwoju

- Podłącz brain do **systemu agentowego** (multi-brain): jeden agent odpytuje wiele baz (wzorzec `brain-query`).
- **MCP** (`brain-mcp`): udostępnij bazę dowolnemu klientowi (Claude Desktop / IDE).
- **Publikacja Quartz** → personal brand / portfolio wiedzy.
- **Wymiana bundli OKF** — eksport „zżytej" bazy (ekstrakt) jako produkt.

## 🤖 Gotowe prompty — co dalej

Znajdź, czego bazie brakuje, i przygotuj publikację. Wklej na **swoim repo bazy**:

```text
Odpal skill gaps: znajdź luki wiedzy — słabo połączone noty, brakujące tematy,
cienkie obszary. Zaproponuj 5 konkretnych źródeł lub pytań, którymi domknę luki.
```

```text
Zbuduj publiczną wersję bazy przez Quartz (npx quartz build) i wypisz krok po
kroku, jak wypchnąć ją na GitHub Pages. Nie publikuj niczego bez mojej zgody.
```

## Most do paid

To był pusty szablon. Pełniejsze akceleratory — gotowe, dopieszczone skille i **ekstrakt realnej, zżytej bazy** (gotowe bundle wiedzy do załadowania do swojego braina) — szykuję jako płatne bundle. Pomijasz tygodnie iteracji i tysiące spalonych tokenów.

Repo szablonu: [github.com/plipowczan/second-brain-template](https://github.com/plipowczan/second-brain-template).
