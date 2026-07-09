# Prime: RAG ragowi nierówny

> **Faza:** PRIME (research) ukończona 2026-07-08.
> **Następny krok:** `/blog-article-writer:plan "RAG ragowi nierówny"`

## Źródła przeanalizowane

| Źródło | Rola |
|--------|------|
| `docs/blog/rag-ragowi-nierowny/2026-07-08_rag-ragowi-nierowny-wsad.md` | Główny wsad: brief redakcyjny, 4 tytuły, 3 leady, szkielet 6 sekcji + FAQ, uwagi produkcyjne, linki |
| Nota brain „Structural Retrieval for Code (RAG ≠ RAG)" (2026-07-08) | Taksonomia 8 lane'ów, oś graph vs non-graph, kontr-teza grep, tabela zadanie→zwycięzca, blind spot .NET |
| Nota brain „Codebase Memory MCP" (2026-07-07) | Fakty o narzędziu: 3 warstwy retrievalu, 3 400 vs 412 000 tokenów (−99,2%), języki z pełnym LSP, vendor-reported |
| Nota brain „GrepRAG" (2026-07-08) | Kontr-teza z liczbami + zastrzeżenia konfidencji (preprint, self-reported, framing rozciągnięty) |
| Nota brain „HOMER" (2026-06-25) | Zdanie-oś: „similarity ≠ causality" (Duke + Snowflake) |
| Obiekcja 5 (rozmowy o kursie LLM Wiki, plik prywatny poza repo) | Łuk narracyjny: zgoda → szeroka definicja → kod≠proza → komplementarność; kicker „Kod nie zapisuje intencji. Brain tak." |
| Artykuł Pulse/GEO o LLM Wiki (2026-07-06, deliverable poza repo) | Spójność liczb prozy: 35k → 3k tokenów (~30×); wzorzec sekcji „Kiedy NIE używać" |

`docs/blog/` top-level: tylko folder `rag-ragowi-nierowny/` (bez `_archive/` - pominięte zgodnie z instrukcją).

## Kluczowe tematy

1. **RAG = rodzina, nie technika.** Baza wektorowa to jeden smak. Substraty: lexical (grep/BM25), semantic (wektory), structural (AST/LSP/SCIP/call-graph), kurowany indeks (LLM Wiki).
2. **Kod ≠ proza.** Kod ma parsowalną gramatykę → graf symboli jest dokładny i weryfikowalny. Proza nie ma AST → kurowany indeks + linki.
3. **Similarity ≠ causality.** Bliskość kosinusowa to nie graf wywołań; na „kto woła X" wektor zgaduje, graf odpowiada faktami.
4. **Studium: codebase-memory-mcp.** Hybryda 3 warstw (tree-sitter+Hybrid LSP, nomic-embed, BM25 FTS5); zaczyna od struktury, nie od wektorów; 3 400 vs 412 000 tokenów.
5. **Uczciwa kontr-teza.** GrepRAG + Cline + porzucony wektorowy RAG w Claude Code: index-free bije przeterminowany indeks przy lokalnej robocie. Rozstrzyga zadanie, nie ideologia (tabela zadanie→zwycięzca).
6. **Komplementarność (kicker).** Graf pamięta strukturę kodu; brain/LLM Wiki pamięta intencje, konwencje, odrzucone próby. „Kod nie zapisuje intencji. Brain tak."

## Profil odbiorcy

- Inżynierowie i technicy pracujący z agentami kodującymi (Claude Code, Codex, Cursor).
- Poziom: zna RAG powierzchownie (= „baza wektorowa"), używa grep/agenta na co dzień.
- Żargon: peer-level OK (decyzja z obiekcji 5), ALE reguły prostego polskiego obowiązują - definicja przy pierwszym użyciu: AST, LSP, embeddings, BM25, tokeny, tree-sitter.

## Unikalny kąt / wartość

- Geneza dialogowa: artykuł = rozwinięcie realnej obiekcji technicznego rozmówcy, któremu autor **przyznaje rację** (nie zbija) i dokłada jeden ruch (komplementarność).
- Mapa decyzyjna zamiast ideologii: czytelnik wychodzi z tabelą zadanie→substrat.
- Uczciwość jako differentiator (wzorzec GEO z artykułu Pulse): sekcja o tym, kiedy grep wygrywa; sygnalizowanie konfidencji źródeł; blind spot .NET autora.

## Koncepty techniczne do pokrycia (z definicjami przy pierwszym użyciu)

- RAG (szeroka definicja), embeddings/wektory, AST, tree-sitter, LSP, „Hybrid LSP", BM25, graf wywołań / def-ref, SCIP/LSIF (jedno zdanie), agentic grep, progressive disclosure (link do artykułu Karpathy), tokeny.
- Liczby do pilnowania: **kod 412k → 3,4k (−99,2%)** vs **proza 35k → 3k (~30×)** - nie mieszać par.
- Konfidencja: GrepRAG + benchmarki codebase-memory-mcp = „wynik autorów" (preprinty/README); RepoGraph = ICLR 2025 peer-reviewed (można mocniej).

## Wzorce stylu z istniejących artykułów

Przeczytane: `llm-knowledge-base-brain-karpathy.md` (id 24, temat-sąsiad), `zapier-vs-make-vs-n8n-wybor-narzedzia.md` (id 5, wzorzec porównania/mapy decyzyjnej).

- Pierwsza osoba, geneza osobista w leadzie („dostałem taką uwagę..."), potem struktura problem→mapa→wnioski.
- Akapity 3-4 zdania; tabele do porównań; pogrubione liczby.
- Bez em dash/en dash/wielokropka Unicode (` - ` i `...`); polskie cudzysłowy „ " zostają.
- Bez AI-tells: zero „warto zauważyć", antytez-na-siłę, pustych wzmacniaczy; max 1 metafora na sekcję.
- FAQ: 4-6 pytań w `<details open>` + `<summary>` z H3 (schemat auto-FAQPage).
- Kolejność końcówki: Wnioski → CTA (HTML div, link `/#contact`, button „Umów bezpłatną konsultację") → `## Przydatne zasoby` → `## FAQ`.

## Frontmatter (ustalenia)

- **id:** 30 (max obecnie: 29, okf-standard)
- **slug:** `rag-ragowi-nierowny` (3 słowa, zwięzły; dłuższa alternatywa do decyzji w plan: `rag-ragowi-nierowny-retrieval-do-kodu`)
- **category:** AI (retrieval/LLM; alternatywa Code - do decyzji w plan)
- **date:** data publikacji (ustalić w execute)
- **image:** `/images/og-rag-ragowi-nierowny.webp` (do wygenerowania)
- **alternateSlug:** NIE ustawiać (PL-only na start; EN = osobny krok)
- Tagi-kandydaci: AI, RAG, Claude Code, Coding Agents, Retrieval, Second Brain

## Linki wewnętrzne (do wplecenia)

- `/blog/llm-knowledge-base-brain-karpathy` - LLM Wiki / progressive disclosure (id 24)
- `/blog/okf-standard-przenosnosc-bazy-wiedzy-ai` - przenośność bazy (id 29)
- `/llm-wiki` - landing kursu (CTA kontekstowe / komplementarność)
- Opcjonalnie `/blog/software-3-0-agentic-engineering` (id 28) - kontekst agentowy

## Przykłady kodu

- Artykuł koncepcyjny - bez bloków kodu implementacyjnego.
- Dopuszczalne bloki `text`: przykład zapytania strukturalnego vs grep (ilustracja 5 zapytań → 3,4k tokenów) - do decyzji w plan.

## Weryfikacja techniczna

- Linki zewnętrzne zweryfikowane w notach brain (arXiv:2603.27277, arXiv:2510.04905, arXiv:2601.23254, arXiv:2410.14684, repo DeusData/oraios/isaacphi, blog Cline, Glean, SCIP, Aider repo map, ast-grep).
- Context7 niepotrzebny: brak API/wersji bibliotek do sprawdzenia; fakty narzędziowe pochodzą z kurowanych not z datami i zastrzeżeniami konfidencji.
- Uwaga prywatności: obiekcje-klientow.md i deliverables Pulse są poza repo - w artykule parafraza obiekcji bez wskazywania pliku/ścieżki.

## Czego NIE robić (z wsadu)

- Nie zbijać obiekcji - przyznać rację i rozwinąć.
- Nie robić recenzji codebase-memory-mcp (studium, nie temat).
- Nie przepisywać wszystkich 8 lane'ów - artykuł wybiera 4-5, reszta zdaniem.
