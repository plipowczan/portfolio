# Plan artykułu: RAG ragowi nierówny

> **Faza:** PLAN ukończona 2026-07-08.
> **Prime:** `.claude/agents/context/blog-prime-rag-ragowi-nierowny.md`
> **Wsad:** `docs/blog/rag-ragowi-nierowny/2026-07-08_rag-ragowi-nierowny-wsad.md`
> **Następny krok:** `/blog-article-writer:execute`

## Frontmatter (specyfikacja)

```yaml
---
id: 30
slug: rag-ragowi-nierowny
title: "RAG ragowi nierówny: do kodu graf, do notatek indeks"
excerpt: >-
  RAG to rodzina technik, nie jedna. Do kodu wygrywa retrieval
  strukturalny (AST, LSP, graf), do notatek kurowany indeks.
  Mapa, jak dobrać mechanizm do materiału.
category: AI
author: Pawel Lipowczan
date: 2026-07-08
readTime: 10 min
image: /images/og-rag-ragowi-nierowny.webp
tags:
  - AI
  - RAG
  - Claude Code
  - Second Brain
  - Retrieval
lang: pl
---
```

- Tytuł: 52 znaki, primary keyword „RAG" na początku. Bez `alternateSlug` (PL-only).
- `date` = data publikacji; jeśli execute innego dnia, zaktualizować.
- Excerpt ~158 znaków - w execute policzyć i dociąć do 150-160.

## Cel i ton

- **Długość:** 1900-2300 słów treści głównej + FAQ (~450) → readTime 10 min.
- **Ton:** peer-to-peer, pierwsza osoba, geneza dialogowa (obiekcja technicznego rozmówcy). Nie zbijamy obiekcji - przyznajemy rację i dokładamy jeden ruch.
- **Prosty polski:** definicja każdego trudnego terminu przy pierwszym użyciu (lista niżej); zero polonizacji czasowników; max 1 metafora na sekcję; ` - ` zamiast em dash; `...` zamiast `…`.

## Struktura sekcja po sekcji

### 1. Lead (bez H2, ~250 słów)

- Hook = wariant A z wsadu (dialogowy): parafraza obiekcji - „RAG to dla mnie głównie bazy wektorowe... do kodu ciekawsze są rozwiązania składniowe (codebase-memory-mcp, Hybrid LSP)... do notatek średnio, do kodowania nieźle".
- Przyznanie racji wprost + zapowiedź: w tej racji siedzi mapa, której brakuje dyskusjom o RAG.
- Definicje w leadzie: RAG (technika, w której model przed odpowiedzią dociąga treść z zewnętrznego źródła), baza wektorowa/embeddings (liczbowe reprezentacje tekstu do wyszukiwania podobieństw).
- Obietnica: po lekturze dobierasz substrat retrievalu do zadania, zamiast mówić „dodaj RAG".

### 2. H2: RAG to rodzina technik, nie jedna (~300 słów)

- Ruch 1 - zgoda: baza wektorowa = jeden smak, nie definicja.
- Ruch 2 - szeroka definicja: jeśli RAG = wszystko, co tnie dryf i tokeny przez retrieval, to LLM Wiki też jest RAG-iem - z kurowanym indeksem zamiast podobieństwa wektorowego.
- Cztery substraty (wyliczenie): lexical (grep/BM25), semantic (wektory), structural (AST/LSP/graf), kurowany indeks.
- Teza artykułu: **mechanizm ma pasować do materiału**.
- Definicje: BM25 (klasyczny algorytm trafności tekstowej), token (jednostka rozliczania tekstu przez model).
- Link wewnętrzny: `/blog/llm-knowledge-base-brain-karpathy` (LLM Wiki).

### 3. H2: Kod ma gramatykę, proza nie (~350 słów)

- Kod: wymuszona, parsowalna gramatyka - `user.profile.name()` ma jednoznaczne rozwiązanie → graf definicji, referencji, wywołań, typów. Struktura dokładna i weryfikowalna.
- Definicje: AST (drzewo składniowe - reprezentacja kodu, którą rozumie parser), LSP (Language Server Protocol - silnik „go to definition" w edytorach), graf wywołań.
- Proza: „decyzja była dobra, bo..." nie parsuje się do symboli → kurowany indeks + linki.
- Oś sekcji (za HOMER, Duke + Snowflake): **similarity ≠ causality** - bliskość kosinusowa to nie graf wywołań. Na „kto woła tę funkcję" wektor odpowiada zgadywaniem, graf faktami.
- Rozmówca sam to zauważył („do notatek średnio") - domknięcie pętli z leadem.

### 4. H2: Studium: codebase-memory-mcp (~350 słów)

- NIE recenzja - studium jednego narzędzia z obiekcji.
- Hybryda 3 warstw: (1) graf symboli (tree-sitter - parser 158 języków + „Hybrid LSP" - lekka reimplementacja rozwiązywania typów), (2) wektory (nomic-embed-code, wkompilowane), (3) full-text BM25.
- Puenta: **samo używa wektorów - tylko nie od nich zaczyna.** Zaczyna od struktury.
- Liczba-kotwica: **3 400 tokenów zamiast 412 000** (−99,2%) na tym samym pytaniu o kod (5 zapytań strukturalnych vs grep plik-po-pliku). Wyraźnie oznaczyć: deklaracja autorów narzędzia (README + preprint arXiv), nie niezależny pomiar.
- Most do LLM Wiki: ta sama logika co indeks vs grep w prozie (35k → 3k, ~30×) - dwie pary liczb, nie mieszać.
- Limity uczciwie: pełne LSP tylko Py/TS/JS/Go/Rust/Java/C/C++/C#/Kotlin/PHP; reszta fallback tekstowy.
- Opcjonalny blok `text` (jedyny w artykule): ilustracja „grep plik-po-pliku vs jedno zapytanie o graf" - 5-8 linii.

### 5. H2: Mapa substratów retrievalu (~300 słów)

- Tabela 5 wierszy (wybór z 8 lane'ów; reszta jednym zdaniem pod tabelą):

| Substrat | Jak działa | Przykłady |
|----------|-----------|-----------|
| Graf AST (tree-sitter) | parsuj → graf definicji/wywołań | codebase-memory-mcp, Graphify, repo map Aidera |
| LSP-as-context | tabele symboli language servera przez MCP | Serena, mcp-language-server |
| Utrwalone fakty (SCIP/LSIF) | fakty o kodzie odpytywane jak baza danych | Glean (Meta), srctx |
| Agentic grep | LLM sam generuje wyszukiwania, zero indeksu | Claude Code, Cline, GrepRAG |
| Wektory (semantic) | podobieństwo embeddingów | klasyczny RAG |

- Oś porządkująca (survey arXiv:2510.04905): graph vs non-graph.
- Definicje: MCP (protokół podpinania narzędzi do agenta), SCIP/LSIF (formaty zapisu faktów o kodzie) - po jednym zdaniu.

### 6. H2: Uczciwie: kiedy grep bije graf (~400 słów)

- Kontr-teza z liczbami: GrepRAG (preprint, Zhejiang) - LLM generuje ~10 komend ripgrep, re-rankuje; index-free; dorównał/pobił graf i wektory na uzupełnianiu kodu; retrieval ~13× szybszy (ekstremum 35×). Oznaczyć: wynik autorów, preprint.
- Fakt mocniejszy: **Claude Code porzucił wczesny RAG z lokalną bazą wektorową** - agentic search działał lepiej i omijał nieświeży indeks; manifest Cline to samo stanowisko.
- Konflikt z RepoGraph (ICLR 2025, peer-reviewed: graf +32,8% na SWE-bench-Lite) rozstrzyga **zadanie**:

| Zadanie | Wygrywa | Dlaczego |
|---------|---------|----------|
| Lokalne uzupełnienie fragmentu | agentic grep | tanio, bez indeksu, bez dryfu |
| Zmiana przez wiele plików | graf / LSP | potrzebny graf wywołań i typów |
| „Kto woła X / co pęknie po zmianie" | LSP / def-ref | wyczerpujący wynik, nie ranking kandydatów |
| Rozmyte „gdzie jest logika auth" | wektory | dopasowanie intencji, nie struktury |

- Puenta: nie „graf vs grep", tylko grep do lokalnej roboty, struktura przez granice modułów, wektory do rozmytej intencji. codebase-memory-mcp po cichu się zgadza (structural-first + embeddingi + graph-augmented grep w jednym).
- Blind spot .NET: żadne narzędzie niezweryfikowane na C#/Roslyn - uczciwa luka (autor pracuje w .NET).

### 7. H2: Dwie warstwy pamięci agenta (~250 słów, kicker)

- Komplementarność, nie konkurencja: w agencie kodującym chcesz OBU warstw.
- Graf/LSP pamięta: jak wygląda kod, co się z czym woła, co pęknie po zmianie sygnatury.
- LLM Wiki / second brain pamięta: dlaczego tak zdecydowaliśmy, jaka konwencja obowiązuje, czego próbowaliśmy i co nie zadziałało.
- Konkret: graf da drzewo wywołań - nie powie, że konwencję narzuciliśmy, bo poprzednia wysadziła produkcję w marcu.
- **Kicker (ostatnie zdania sekcji): „Kod nie zapisuje intencji. Brain tak."**
- Domknięcie z obiekcją: rozmówca miał rację w obu połowach - to dwie warstwy pamięci jednego agenta.
- Link wewnętrzny: `/llm-wiki` (kurs - naturalnie, bez nachalności) + `/blog/okf-standard-przenosnosc-bazy-wiedzy-ai` (przenośność notatek).

### 8. H2: Kluczowe wnioski (~150 słów)

Lista numerowana, 5 punktów:
1. RAG ≠ RAG - wybieraj substrat: lexical, semantic, structural albo kurowany indeks.
2. Do kodu domyślnie struktura przy zmianach cross-file; kod ma AST, proza nie.
3. Grep to poważny zawodnik, nie fallback - index-free bije nieświeży indeks przy lokalnej robocie.
4. Dopasuj retrieval do zadania (tabela), nie do mody; benchmarki self-reported traktuj jako deklaracje.
5. Graf pamięta strukturę, brain pamięta intencje - agentowi kodującemu daj obie warstwy.

### 9. CTA (HTML + Tailwind, kanoniczny blok)

- H3: „Zastanawiasz się, jakim retrievalem karmić swojego agenta AI?" (pytanie kontekstowe, 8 słów)
- P: wartość - doradzam dobór warstw pamięci agentów (kod + wiedza) na realnych wdrożeniach.
- Link `/#contact`, button „Umów bezpłatną konsultację".
- Wrapper dokładnie: `<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">`.

### 10. H2: Przydatne zasoby

Format `- [Nazwa](url) - krótki opis`:
- codebase-memory-mcp (GitHub, DeusData) + preprint arXiv:2603.27277
- Survey: Retrieval-Augmented Code Generation (arXiv:2510.04905)
- GrepRAG (arXiv:2601.23254)
- RepoGraph (arXiv:2410.14684, ICLR 2025)
- Cline: why we don't index your codebase (blog)
- Serena (GitHub) · Aider repo map (docs)
- Wewnętrzne: artykuł LLM Wiki (id 24), artykuł OKF (id 29)

### 11. H2: FAQ (na samym końcu, ~450 słów)

5 pytań w `<details open>` + `<summary>` z H3 (auto-FAQPage):

1. **Czy RAG to zawsze baza wektorowa i embeddings?** (nie - rodzina: lexical/semantic/structural/kurowany indeks; wektory to jeden smak)
2. **Kiedy do przeszukiwania kodu wystarczy grep, a kiedy potrzebny graf symboli?** (grep: lokalna robota, znany string; graf: zmiany cross-file, „kto woła X"; skrót tabeli)
3. **Czym różni się retrieval do kodu od retrievalu do notatek?** (kod ma parsowalną gramatykę → graf; proza nie ma AST → kurowany indeks + linki)
4. **Czy LLM Wiki zastępuje narzędzia typu codebase-memory-mcp?** (nie - komplementarne warstwy: graf pamięta strukturę kodu, brain intencje i konwencje)
5. **Co znaczy „similarity ≠ causality" przy bazach wektorowych?** (bliskość embeddingów ≠ zależność przyczynowa/wywołanie; na pytania strukturalne wektor zgaduje, graf odpowiada faktami)

## Definicje przy pierwszym użyciu (checklist do execute)

RAG · embeddings/wektory · token · BM25 · AST · tree-sitter · LSP · „Hybrid LSP" · graf wywołań · MCP · SCIP/LSIF · agentic grep · index-free · SWE-bench (jedno zdanie przy RepoGraph)

Keep-lista (zostają EN, z definicją): RAG, LSP, AST, grep, tree-sitter, MCP, second brain, embeddings.
Zakazy słownikowe: bez „ingestować/mergować/renderować..."; „fallback tekstowy" → „awaryjnie schodzi do trybu tekstowego"; „pipeline" → „potok".

## SEO

- Primary: RAG (w tytule, H1, leadzie).
- Secondary w H2/treści: retrieval strukturalny, graf wywołań, LSP, baza wektorowa, agent kodujący, agentic grep, LLM Wiki.
- Linki wewnętrzne: id 24 (LLM Wiki), id 29 (OKF), `/llm-wiki`.
- Zewnętrzne: arXiv ×4, GitHub ×3, Cline blog, Aider docs.

## Poprawność techniczna (checklist)

- [ ] Liczby: 3 400 vs 412 000 (kod, deklaracja autorów) · 35k vs 3k (proza) - osobne pary
- [ ] GrepRAG: ~13× średnio, 35× ekstremum - nie podawać 35× jako średniej
- [ ] RepoGraph: +32,8%, SWE-bench-Lite, ICLR 2025 (peer-reviewed)
- [ ] Języki pełnego LSP w codebase-memory-mcp: Py/TS/JS/Go/Rust/Java/C/C++/C#/Kotlin/PHP
- [ ] Claude Code porzucił wektorowy RAG - fakt potwierdzony (Graphify/Cline)
- [ ] Jedyny blok kodu: `text` (ilustracja grep vs graf) - z tagiem języka

## Walidacja przed zapisem (execute)

- `grep -nP '[\x{2014}\x{2013}\x{2026}]'` → pusty
- Brama słownikowa z `.claude/rules/content/10-prosty-polski.md` → pusta (trafienia tylko w code blocks dopuszczalne)
- AI-tells: zero „warto zauważyć", antytez-na-siłę, pustych wzmacniaczy
- Kolejność końcówki: Wnioski → CTA → Przydatne zasoby → FAQ
