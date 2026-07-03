---
slug: 5-rozwoj-i-publikacja
order: 5
title: Rozwój i publikacja
excerpt: Opublikuj bazę przez Quartz, zrozum przenośność OKF i poznaj ścieżkę rozwoju — multi-brain, MCP, publikacja i wymiana bundli wiedzy.
---

Cel tej lekcji: domknąć arsenał komend, opublikować bazę i poznać ścieżkę rozwoju. Po lekcji znasz **pozostałe komendy** (porządki, generowanie, analiza), umiesz publikować przez Quartz, rozumiesz przenośność OKF i wiesz, dokąd baza rośnie dalej.

## Pełny arsenał — pozostałe komendy

Rdzeń masz z lekcji 1–4: `/onboard`, `/ingest`, `/qa`, `/lint`, `/reindex`, plus `/compile` i `/enhance`. Zostały komendy, po które sięgasz rzadziej — do porządków, generowania i analizy. Wszystkie trzymają się tej samej zasady: **czytaj indeksy, aktualizuj indeksy, nie kasuj bez potwierdzenia.**

### `/gaps` — co zbudować dalej

Analiza **luk wiedzy** — nie mechanicznych problemów (tym zajmuje się `/lint`), tylko braków merytorycznych: noty słabo połączone (stopień linków ≤ 1), tematy implikowane, lecz nieopisane, cienkie foldery i tagi, przeterminowane klastry. Zwraca priorytetyzowaną listę „do zbudowania / do połączenia" i proponuje zapis do `content/_outputs/reports/`. Nie mutuje bazy — to kompas, nie koparka. Odpalaj, gdy nie wiesz, co notować następne.

### `/curate` — sprzątanie (staleness)

Okresowa higiena: ocenia każdą notę (wiek, izolacja, martwe linki, duplikaty), pisze raport triage do `content/_outputs/reports/` i **dopiero po Twoim potwierdzeniu** wycofuje przeterminowane noty do `content/_graveyard/`. Motto: *„`/lint` diagnozuje; `/curate` leczy"*. Domyślnie to dry-run — sam raport. Akcje na notę: `archive` (→ graveyard), `merge` (→ `/refactor`), `refresh` (→ `/enhance`), `keep`. Wycofanie jest **odwracalne** (przeniesienie, nigdy `git rm`; graveyard jest wykluczony z indeksów i publikacji). Kadencja: raz na kwartał.

### `/refactor` — przebuduj bez psucia linków

Rename / move / merge / split not z automatyczną naprawą **wszystkich** `[[wikilinków]]` i przebudową indeksów. Linki rozwiązują się po nazwie pliku, więc ręczne przenoszenie je psuje — `/refactor` robi to bezpiecznie (zachowuje aliasy `[[A|B]]` i kotwice `[[A#nagłówek]]`). Po każdej operacji odpala reindex i proponuje `/lint`. Używaj do zmian strukturalnych, których nie chcesz robić ręcznie.

### `/output` — artefakty pochodne

Generuje **pochodny** artefakt z bazy: podsumowanie, listę lektur, mapę tematu albo oś czasu. Domyślnie zapisuje do `content/_outputs/<format>/`. Różnica wobec `/compile`: `/compile` tworzy pełny **artykuł** (notę `compiled-note` w folderze tematu — wchodzi do wiki i indeksów), a `/output` daje raport/zestawienie **obok** wiki. Krótko: compile publikuje wiedzę, output ją eksportuje.

### Rodzina `research` — przedsmak (osobna lekcja)

`/research`, `/research-add-items`, `/research-add-fields`, `/research-deep`, `/research-report` to pipeline, który **dokłada nową wiedzę z zewnątrz**. Buduje szkielet badania (`outline.yaml` + `fields.yaml`) w `content/_raw/research-workspaces/`, odpala po jednym agencie na element (ustrukturyzowany JSON per element), a na końcu składa raport i wrzuca go do `content/_raw/inbox/` — gotowy pod `/ingest`. To najmocniejsza dźwignia „baza rośnie sama". Rozbijemy ją w **osobnej lekcji** — tu tylko sygnalizuję, że istnieje.

### `excalidraw-diagram` (skill) — diagramy

Skill generujący diagramy `.excalidraw` (workflow, architektura, koncept) z pętlą samo-walidacji przez Playwright. Wymaga jednorazowego setupu (`uv` + Playwright/Chromium). Opcjonalny dodatek, gdy chcesz do noty wrzucić schemat, a nie tylko tekst.

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

## FAQ

### Czym jest OKF i dlaczego baza jest przenośna?

OKF (Open Knowledge Format) to standard opisany przez Google, który formalizuje wzorzec „wiedza jako plain markdown z frontmatterem". Twoja baza to zwykłe pliki `.md` z polem `type` — czytelne i dla agenta, i dla człowieka, bez lock-inu do konkretnej aplikacji. Stąd „jeśli możesz to `git clone`, możesz to wysłać": przenosisz repo i cała wiedza działa dalej.

### Czy muszę publikować bazę?

Nie. Publikacja przez Quartz jest w pełni opcjonalna — baza świetnie działa jako **prywatne** repo markdown, którego używasz tylko przez Claude Code. Quartz to warstwa na wierzchu; dokładasz ją tylko, jeśli chcesz mieć publiczną stronę wiedzy.

### Czy publikacja Quartz ujawni moje prywatne noty?

Publikujesz tylko to, co sam zbudujesz i wypchniesz — Ty kontrolujesz zakres. Foldery robocze (`_raw/`) i wycofane noty (`_graveyard/`) są wykluczone, a przed dzieleniem robisz scrub wrażliwych treści i atrybucji. Nic nie trafia na zewnątrz bez Twojej wyraźnej zgody.

### Czym różni się `/gaps` od `/lint`?

`/lint` szuka **mechanicznych** problemów: martwe linki, brakujący frontmatter, sieroty, niespójne tagi — 10 klas higieny. `/gaps` szuka **luk wiedzy**: słabo połączonych not, brakujących tematów, cienkich obszarów. Skrótowo: `/lint` to higiena, `/gaps` to strategia — co napisać następne.

### Czy `/curate` skasuje moje noty?

Nie kasuje. Domyślnie robi dry-run — sam raport triage. Przeterminowane noty wycofuje do `content/_graveyard/` **dopiero po Twoim potwierdzeniu**, i to odwracalnie (przeniesienie, nigdy `git rm`). Cofnięcie = przeniesienie noty z graveyard z powrotem.

### Kiedy użyć `/output`, a kiedy `/compile`?

`/compile` tworzy pełny **artykuł** — nową notę `compiled-note` w folderze tematu, która wchodzi do wiki i indeksów. `/output` generuje **pochodny** artefakt obok wiki (podsumowanie, lista lektur, oś czasu) do `content/_outputs/`. Chcesz trwały wpis w bazie → compile; chcesz zestawienie na wynos → output.

## Most do paid

To był pusty szablon. Pełniejsze akceleratory — gotowe, dopieszczone skille i **ekstrakt realnej, zżytej bazy** (gotowe bundle wiedzy do załadowania do swojego braina) — szykuję jako płatne bundle. Pomijasz tygodnie iteracji i tysiące spalonych tokenów.

Repo szablonu: [github.com/plipowczan/second-brain-template](https://github.com/plipowczan/second-brain-template).
