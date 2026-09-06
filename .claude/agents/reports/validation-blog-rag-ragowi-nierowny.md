# Blog Article Validation Report: RAG ragowi nierówny: do kodu graf, do notatek indeks

## Article Details

- **File**: src/content/blog/rag-ragowi-nierowny.md
- **Blog ID**: 30
- **Date**: 2026-07-08
- **Read Time**: 10 min
- **Word Count**: 2189 (wc -w, z frontmatterem i URL-ami)

## Validation Results

### ✅ PASSED

**Level 1 - struktura pliku**
- Plik istnieje, frontmatter YAML poprawny (fast build przeszedł - loader `blogPosts.js` przyjął plik)
- ID 30 unikalne (poprzednie max: 29), slug = nazwa pliku

**Level 2 - jakość treści**
- Tytuł: 52 znaki (limit 50-60) ✓
- Excerpt: 156 znaków (limit 150-160) ✓
- category: AI ✓ · author ✓ · date 2026-07-08 ✓ · readTime 10 min (~2100 słów) ✓
- image: `/images/og-rag-ragowi-nierowny.webp` ✓ · tags: 5 ✓
- Bloki kodu: 1, z tagiem `text` ✓
- Brama znaków (em/en dash, wielokropek): **pusta** ✓
- Brama słownikowa (prosty polski, pełne wyrażenie z `10-prosty-polski.md`): **pusta** ✓
- CTA kanoniczne: btn-primary 1× ✓ · wrapper `bg-dark-800/50 backdrop-blur-md` 1× ✓ · `href="/#contact"` ✓ · „Umów bezpłatną konsultację" ✓ · zero wzorców przestarzałych ✓
- Kolejność sekcji: Wnioski (l.126) → CTA (l.134) → Przydatne zasoby (l.144) → FAQ (l.156) ✓
- FAQ: 5 pytań w `<details open>` + `<summary>` z H3 ✓

**Level 3 - SEO**
- Primary keyword „RAG" w tytule, otwierającym H2 i leadzie ✓
- Linki wewnętrzne: id 24 (LLM Wiki), id 29 (OKF), /llm-wiki ✓
- Definicje terminów przy pierwszym użyciu: RAG, embeddings, token, BM25, AST, tree-sitter, LSP, Hybrid LSP, graf wywołań, MCP, SCIP/LSIF, SWE-bench-Lite, Roslyn ✓

**Level 4 - poprawność techniczna**
- Liczby zgodne ze źródłami (noty brain + opublikowany artykuł Pulse): kod 3 400 vs 412 000 (−99,2%, oznaczone jako deklaracja autorów) · proza ~35 tys. → ~3 tys. (~30×) - pary rozdzielone
- GrepRAG: ~13× średnio / 35× ekstremum, oznaczone jako preprint self-reported
- RepoGraph: +32,8% SWE-bench-Lite, ICLR 2025 (peer-reviewed)
- Linki zewnętrzne z kurowanych not (arXiv ×4, GitHub ×2, Cline, Aider)

**Level 5 - render (dev, chromium headless)**
- h1 = tytuł ✓ · 10× H2 ✓ · 5× details ✓ · 1× pre (blok kodu jako blok) ✓
- CTA button ✓ · kicker „Kod nie zapisuje intencji" ✓ · 6 linków wewnętrznych ✓
- Zero błędów konsoli i pageerror (po wygenerowaniu OG) ✓

### ⚠️ WARNINGS

- Grafika OG zawiera zarysy okien terminala z drobnym glifem „>_" - konwencja ikony, nie tekst; spójne z resztą serii OG. Do podmiany tylko, jeśli przeszkadza.
- MCP Playwright (channel chrome) niedostępny na tej maszynie - render sprawdzony bezpośrednio chromium z `@playwright/test` (równoważne).

### ❌ FAILURES

Brak.

## Post-Article Tasks Completed

- [x] Prompt OG wygenerowany: `.claude/agents/prompts/og-rag-ragowi-nierowny-prompt.txt`
- [x] Obrazek OG wygenerowany (gemini-3-pro-image-preview): jpeg 550,3 KB
- [x] Konwersja WebP: `public/images/og-rag-ragowi-nierowny.webp` (62,9 KB, −88,6%), źródłowy jpeg usunięty
- [x] Sitemap zaktualizowany: wpis `/blog/rag-ragowi-nierowny`, lastmod 2026-07-08, hreflang pl + x-default (bez EN - poprawnie, artykuł PL-only)
- [x] `llms.txt` + `llms-full.txt` przegenerowane (29 PL + 28 EN postów)
- [x] Test w dev serwerze przeszedł (http://localhost:3001/blog/rag-ragowi-nierowny)

## Poprawki po feedbacku (2026-07-09)

- „proza" usunięta z całego artykułu; teza przeformułowana na parsowalność („Kod parsuje się do symboli, notatki nie")
- Usunięta nieaktualna kotwica „.NET to mój główny język"; w zamian „kod piszą agenci, wsparcie języka dalej decyduje"
- CTA: dopisany link do kursu /llm-wiki + wzmianka o łączeniu szablonu z repo kodu
- Pogłębienie DOX: 6. wiersz tabeli substratów (drzewo `AGENTS.md`), akapit „trzy warstwy" w sekcji pamięci, FAQ #6, link DOX w zasobach
- readTime 10 → 12 min (2527 słów); `date` 2026-07-09

## EN Translation

- **EN file:** src/content/blog/en/not-all-rag-is-equal.md
- **EN slug:** not-all-rag-is-equal (zatwierdzony przez użytkownika)
- **EN title:** "Not All RAG Is Equal: a Graph for Code, an Index for Notes" (58 zn.) · excerpt 154 zn.
- **Bidirectional alternateSlug:** ✅ obie strony wskazują na siebie
- **Sitemap:** ✅ symetria PL ↔ EN (29+29 artykułów, 96 URLi, hreflang pl/en/x-default)
- **Internal links mapped:** 2/2 (`/en/blog/karpathy-llm-wiki-knowledge-base`, `/en/blog/okf-standard-portable-knowledge-base`); `/llm-wiki` zostawiony z dopiskiem "(in Polish)" - landing PL-only
- **CTA:** wzorzec kanoniczny, "Book a free consultation", `## Useful Resources` ✓
- **FAQ:** 6 pytań w `<details open>` ✓
- **Blok `text`:** przetłumaczony świadomie (ilustracja liczbowa, nie kod - polskie etykiety w EN artykule byłyby defektem; odstępstwo od litery reguły „preserve code blocks")
- **Bramy:** znaki Unicode - pusto; build ✓ (9,4 s)
- **EN validation:** ✅ PASSED

## Overall Status

✅ VALIDATION PASSED - PL + EN gotowe do jednego commita

## Next Step

Commit: `feat(blog): add post 30 (PL+EN) - RAG ragowi nierówny` → deploy.
