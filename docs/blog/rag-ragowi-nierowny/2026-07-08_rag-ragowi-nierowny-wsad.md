---
title: "Wsad blogowy: RAG ragowi nierówny"
date: 2026-07-08
type: answer-note
tags: ["output", "blog", "ai", "rag", "retrieval", "coding-agents", "llm-wiki"]
agent-created: true
summary: "Brief + szkielet artykułu o tym, że RAG to rodzina technik, nie jedna: do kodu wygrywa retrieval strukturalny (AST/LSP/graf), do prozy kurowany indeks (LLM Wiki), a wektory to tylko jeden smak. Zbudowany z obiekcji 5 (obiekcje-klientow) i not brain."
sources:
  - "Nota brain: Structural Retrieval for Code (RAG ≠ RAG) — 2026-07-08"
  - "Nota brain: Codebase Memory MCP — 2026-07-07"
  - "Nota brain: GrepRAG — 2026-07-08"
  - "Nota brain: HOMER — Structured Agent Memory — 2026-06-25"
  - "Obiekcja 5 z rozmów o kursie LLM Wiki (rozmówca techniczny)"
  - "Artykuł Pulse/GEO: LLM Wiki: jak zbudować drugi mózg dla AI bez RAG i baz wektorowych (2026-07-06)"
---

# Wsad blogowy: RAG ragowi nierówny

> **Status:** materiał wejściowy (brief + szkielet), nie gotowy tekst. Do przepisania przez `/blog-article-writer`.
> **Język docelowy:** PL.
> **Geneza:** obiekcja 5 z rozmów o kursie LLM Wiki — techniczny rozmówca w połowie się zgadza
> i dokłada celną nuansę (structural/LSP do kodu). Artykuł = rozwinięcie odpowiedzi na tę obiekcję.

---

## 🎯 Brief redakcyjny

| Pole | Wartość |
|------|---------|
| **Temat** | RAG to nie jedna technika, tylko rodzina — a członkowie nie są równi. Do kodu: retrieval strukturalny (AST/LSP/graf). Do prozy: kurowany indeks (LLM Wiki). Wektory: jeden smak, nie definicja. |
| **Źródło** | Obiekcja techniczna z rozmów o kursie + kompilacja researchu (taksonomia lane'ów, GrepRAG, RepoGraph, codebase-memory-mcp) |
| **Grupa docelowa** | Inżynierowie i technicy pracujący z agentami kodującymi; osoby, które słyszały "użyj RAG" i utknęły na bazach wektorowych |
| **Kąt (angle)** | Nie "RAG jest zły / dobry", tylko **mechanizm ma pasować do materiału**. Mapa decyzyjna: który substrat retrievalu do którego zadania. |
| **Obietnica dla czytelnika** | Po przeczytaniu wiesz, że "dodaj RAG" to nie decyzja, tylko unik decyzji — i umiesz dobrać substrat (lexical / vector / structural / kurowany indeks) do zadania. |
| **Długość** | 1400–1800 słów (~7–8 min) |
| **Ton** | Peer-to-peer, przyjacielski, techniczny żargon OK (rozmówca-adresat sam go używa). Bez zbijania obiekcji — przyznanie racji + jeden ruch dalej. |
| **CTA** | Dyskusja: "Jakim retrievalem karmisz swojego agenta?" + link do kursu LLM Wiki (komplementarność, nie konkurencja) |

### Słowa kluczowe / SEO

`RAG`, `retrieval strukturalny`, `structural retrieval`, `LSP`, `AST`, `tree-sitter`, `graf wywołań`, `codebase-memory-mcp`, `Hybrid LSP`, `agentic search`, `grep`, `LLM Wiki`, `baza wektorowa`, `embeddings`, `agent kodujący`

### Robocze tytuły (do wyboru)

1. **RAG ragowi nierówny: do kodu graf, do notatek indeks, wektory na końcu**
2. **"Dodaj RAG" to nie decyzja. Wybór substratu retrievalu — mapa**
3. **Kod ma AST, proza nie: dlaczego jeden RAG nie obsłuży obu**
4. **Similarity ≠ causality: czego baza wektorowa nie powie o Twoim kodzie**

---

## 🪝 Lead / hook (propozycje)

**Wariant A — z obiekcji (dialogowy):**
> "RAG to dla mnie głównie bazy wektorowe. Ale do kodu są ciekawsze rzeczy — analiza
> składniowa, LSP. Do notatek pewnie średnio, ale do kodowania sprawdza się nieźle."
> Taką uwagę dostałem od technicznego rozmówcy przy okazji kursu LLM Wiki. Ma rację.
> I właśnie dlatego warto ją rozwinąć, bo w tej racji siedzi mapa, której brakuje
> większości dyskusji o RAG.

**Wariant B — prowokacja:**
> "Użyj RAG do codebase'u" brzmi jak decyzja. Nie jest nią. To tak, jakby powiedzieć
> "użyj bazy danych" i nie sprecyzować: relacyjna, dokumentowa czy graf. RAG to rodzina
> technik — a członkowie tej rodziny nie są równi.

**Wariant C — liczbowy:**
> 3 400 tokenów zamiast 412 000. Tyle kosztuje to samo pytanie o kod, gdy zamiast
> greppować plik po pliku, agent odpytuje graf symboli. To nie magia wektorów —
> wektorów tam prawie nie ma. To struktura.

---

## 🧱 Szkielet treści (sekcja po sekcji)

### 1. Obiekcja, od której to się zaczęło (i dlaczego jest słuszna)

- Przytoczyć obiekcję 5 (parafraza): RAG kojarzony z bazami wektorowymi; do kodu
  lepsze rozwiązania składniowe (przykład: codebase-memory-mcp, "Hybrid LSP");
  "do notatek średnio, do kodowania nieźle".
- **Ruch 1 — zgoda:** RAG ragowi nierówny. Baza wektorowa = jeden smak, nie definicja.
- **Ruch 2 — szeroka definicja:** jeśli RAG = każde rozwiązanie tnące dryf i tokeny
  przez retrieval, to LLM Wiki też jest RAG-iem — tylko z innym mechanizmem
  (kurowany indeks vs podobieństwo wektorowe). Spór nie o cel, a o mechanizm.
- Teza artykułu: **mechanizm ma pasować do materiału.**

### 2. Dlaczego kod ≠ proza (rdzeń merytoryczny)

- Kod ma wymuszoną, parsowalną gramatykę: `user.profile.name()` ma jednoznaczne
  rozwiązanie — da się zbudować graf (definicje, referencje, wywołania, typy, importy,
  dziedziczenie). Struktura jest **dokładna i weryfikowalna**.
- Proza nie ma AST: "decyzja była dobra, bo…" nie parsuje się do symboli.
  Stąd dla notatek: kurowany indeks + linki (LLM Wiki), nie graf składniowy.
- Ostra wersja tezy (za HOMER, Duke + Snowflake): **similarity ≠ causality.**
  Bliskość kosinusowa w przestrzeni embeddingów to nie graf wywołań. Na pytanie
  "kto woła tę funkcję" wektor odpowiada wibracjami, graf — faktami.

### 3. Studium: codebase-memory-mcp (fakty do trzymania się)

- To NIE czysta analiza składniowa — **hybryda 3 warstw retrievalu**:
  1. graf symboli (tree-sitter AST, 158 języków + "Hybrid LSP" = lekka
     reimplementacja rozwiązywania typów/importów/dziedziczenia w C, bez procesu
     language servera),
  2. wektory (`nomic-embed-code`, 768d int8, wkompilowane — bez API key),
  3. full-text BM25 (SQLite FTS5).
- **Sam używa wektorów — tylko nie od nich zaczyna.** Zaczyna od struktury.
- Nagłówek narzędzia: **3 400 tokenów zamiast 412 000** przez grep plik-po-pliku
  (−99,2%). To dosłownie argument "indeks vs grep" z LLM Wiki przełożony na kod
  (w prozie: 35k → 3k, ~30×; równoległość liczb = most do sekcji 5).
- Limity uczciwie: pełna rozdzielczość LSP tylko dla Py/TS/JS/Go/Rust/Java/C/C++/C#/
  Kotlin/PHP; reszta → fallback tekstowy. Benchmarki vendor-reported (README +
  preprint arXiv:2603.27277) — cytować jako wynik autorów, nie ustaloną prawdę.

### 4. Mapa lane'ów (skrócona taksonomia — nie przepisywać całej noty)

Do artykułu wybrać 4–5 z 8 lane'ów, reszta jednym zdaniem:

| Lane | Co to | Przykład |
|------|-------|----------|
| Tree-sitter AST graf | parsuj → graf defs/refs/calls | codebase-memory-mcp, Graphify, Aider repo map |
| LSP-as-context | symbol/type tables language servera przez MCP | Serena, mcp-language-server |
| Persisted fact-graphs | fakty o kodzie jak baza danych (SCIP/LSIF) | Glean (Meta), srctx |
| Agentic grep (kontr-teza) | LLM sam generuje ripgrep, zero indeksu | GrepRAG, Cline, Claude Code |
| Wektory / semantic | podobieństwo embeddingów | klasyczny RAG |

- Oś porządkująca (za surveyem arXiv:2510.04905): graph-based vs non-graph
  (lexical / semantic).

### 5. Uczciwa kontr-teza: grep czasem bije graf (kluczowa dla wiarygodności)

- GrepRAG (arXiv:2601.23254): LLM generuje ~10 komend ripgrep, wykonuje, re-rankuje
  (Jaccard/BM25). Index-free → zero przeterminowanego indeksu. Na repo-level
  completion dorównał albo pobił graf i wektory; retrieval ~13× szybszy
  (ekstremum 35×). Preprint, self-reported — trzymać na poziomie "wynik autorów".
- Cline manifest + fakt: **Claude Code porzucił wczesny RAG z lokalną bazą wektorową**,
  bo agentic search (grep + nawigacja po plikach) działał lepiej i omijał problem
  nieświeżego indeksu.
- Konflikt z RepoGraph (ICLR 2025: graf +32,8% na SWE-bench-Lite) rozwiązuje się
  **zadaniem**, nie ideologią:

| Zadanie | Wygrywa | Dlaczego |
|---------|---------|----------|
| Lokalne uzupełnienie linii/fragmentu | agentic grep | tanio, bez indeksu, bez dryfu; odpowiedź jest blisko |
| Zmiana przez wiele plików / naprawa buga cross-module | graf strukturalny / LSP | potrzebny graf wywołań i typów, którego lokalne okno nie pokaże |
| "Kto woła X / blast radius zmiany" | LSP / def-ref graf | wyczerpujące i typowo-dokładne; grep daje false positives, wektory zgadują |
| Rozmyte "gdzie jest logika auth" | wektory / semantic | dopasowanie intencji bije dokładną strukturę |

- Puenta sekcji: harness nie wybiera "graf vs grep" — **grep do lokalnej roboty,
  struktura do zmian przez granice modułów, wektory tylko do rozmytej intencji.**
  codebase-memory-mcp po cichu się z tym zgadza: structural-first + wbudowane
  embeddingi + graph-augmented grep w jednym narzędziu.

### 6. Kicker — komplementarność, nie konkurencja

- W agencie kodującym chcesz OBU warstw pamięci:
  - **Graf/LSP pamięta:** jak wygląda kod, co się z czym woła, co pęknie po zmianie
    sygnatury.
  - **LLM Wiki / brain pamięta:** dlaczego tak zdecydowaliśmy, jaka konwencja
    obowiązuje, czego próbowaliśmy i co nie zadziałało.
- Graf da call tree — nie powie, że konwencję narzuciliśmy, bo poprzednia wysadziła
  proda w marcu.
- **Zdanie-kicker (zamknięcie artykułu): "Kod nie zapisuje intencji. Brain tak."**
- Domknięcie z obiekcją: rozmówca miał rację w obu połowach ("do kodu nieźle,
  do notatek średnio") — to nie dwa konkurencyjne RAG-i, to dwie warstwy pamięci
  jednego agenta.

### 7. FAQ (AEO — 3–4 pytania, styl snippet)

Kandydaci:
- Czy RAG to zawsze baza wektorowa? (nie — rodzina: lexical/semantic/structural/indeks)
- Kiedy do kodu wystarczy grep, a kiedy potrzebny graf? (tabela zadanie→zwycięzca w skrócie)
- Czym różni się retrieval do kodu od retrievalu do notatek? (AST vs brak AST)
- Czy LLM Wiki zastąpi narzędzia typu codebase-memory-mcp? (nie — komplementarne warstwy)

---

## ⚠️ Uwagi produkcyjne

- **Spójność liczb z opublikowanym artykułem Pulse/GEO:** proza 35k → 3k tokenów (~30×);
  kod 412k → 3,4k (−99%). Nie mieszać tych par.
- **Konfidencja źródeł:** GrepRAG i benchmarki codebase-memory-mcp = self-reported
  (preprinty/README) — w tekście sygnalizować ("wynik autorów", "deklaracja narzędzia").
  RepoGraph = peer-reviewed (ICLR 2025) — można cytować mocniej.
- **Żargon:** decyzja z obiekcji 5 — peer-level, jargon OK; ale reguły prostego
  polskiego dalej obowiązują (definicja przy pierwszym użyciu: AST, LSP, embeddings,
  BM25, tokeny). Keep-lista: RAG, LSP, AST, grep, tree-sitter, MCP.
- **Czego NIE robić:** nie zbijać obiekcji; nie robić z artykułu recenzji
  codebase-memory-mcp (to studium przypadku, nie temat); nie przepisywać wszystkich
  8 lane'ów (nota źródłowa to mapa — artykuł wybiera).
- **Link wewnętrzny:** artykuł OKF (przenośność) + artykuł Pulse/GEO o LLM Wiki
  (gdy będzie na blogu) + landing kursu /llm-wiki.
- **Blind spot .NET:** żadne z narzędzi nie zweryfikowane na C#/Roslyn — można
  wspomnieć jako uczciwą lukę (autor pracuje w .NET), buduje wiarygodność.

## 🔗 Źródła zewnętrzne (do linkowania w artykule)

- codebase-memory-mcp: https://github.com/DeusData/codebase-memory-mcp
  · preprint: https://arxiv.org/abs/2603.27277
- Survey taksonomii: https://arxiv.org/abs/2510.04905
- GrepRAG: https://arxiv.org/html/2601.23254v2
- RepoGraph (ICLR 2025): https://arxiv.org/abs/2410.14684
- Cline — why we don't index your codebase:
  https://cline.bot/blog/why-cline-doesnt-index-your-codebase-and-why-thats-a-good-thing
- Serena: https://github.com/oraios/serena
  · mcp-language-server: https://github.com/isaacphi/mcp-language-server
- Glean (Meta): https://engineering.fb.com/2024/12/19/developer-tools/glean-open-source-code-indexing/
- SCIP: https://sourcegraph.com/blog/announcing-scip
- Aider repo map: https://aider.chat/docs/repomap.html
- ast-grep: https://ast-grep.github.io/
