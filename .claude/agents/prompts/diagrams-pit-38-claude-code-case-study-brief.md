# Diagram brief: PIT-38 Claude Code case study

**Cel:** wygenerować 1-3 diagramy procesu do wbudowania w artykuł `pit-38-claude-code-case-study` (PL + EN). Brief samowystarczalny — sesja generująca nie potrzebuje kontekstu artykułu.

---

## Kontekst artykułu (1 akapit)

Case study: rozliczenie polskiego PIT-38 (zyski kapitałowe — akcje, fundusze, krypto, dywidendy) przez agenta Claude Code w ~2h zamiast przez księgową. Workflow: 5430 surowych transakcji z 5 źródeł danych → 11 zdarzeń podatkowych w deklaracji. Klucz: agent klasyfikuje, nie sumuje. Centralna komenda projektu: `/ingest` — jedna komenda, która identyfikuje typ pliku, kieruje do właściwej sekcji deklaracji, ekstraktuje dane, archiwizuje surowiznę.

Pliki artykułu:
- PL: `src/content/blog/pit-38-claude-code-case-study.md`
- EN: `src/content/blog/en/polish-pit-38-claude-code-case-study.md`

---

## Output expectations

**Format:** PNG/WebP gotowe do wbudowania w markdown jako `![alt](/images/{slug}.webp)`.
Stack rekomendowany: Excalidraw → export PNG → konwersja WebP przez `node scripts/convert-to-webp.js`. Alternatywa: Mermaid.js + custom CSS, albo SVG ręcznie. Excalidraw daje najbardziej "rysowany" feel, który pasuje do brand'u portfolio.

**Wymiary:**
- Diagram 1 (hero, horyzontalny): **1600×600 px** (lub 2:1 ratio)
- Diagram 2 (LinkedIn scroll-stopper, kwadratowy): **1080×1080 px**
- Diagram 3 (tree katalogów, opcjonalny): **800×900 px** lub elastyczny

**Tło:** transparentne (PNG z alpha) lub `#0a0e1a` (dark portfolio). Diagram będzie wyświetlany na ciemnym tle bloga — kolory muszą czytać się na `#0a0e1a`.

**Lokalizacja docelowa plików:** `public/images/`. Konwencja nazw:
- `diagram-pit-38-funnel.webp` (Diagram 1, hero)
- `diagram-pit-38-funnel-square.webp` (Diagram 2, LinkedIn)
- `diagram-pit-38-tree.webp` (Diagram 3, tree, opcjonalny)

---

## Paleta i semantyka kolorów

Bezpośrednio z portfolio brand (Tailwind tokens):

| Kolor | HEX | Semantyka w diagramie |
|---|---|---|
| Primary green | `#00ff9d` | Active flow, CZYTAJ, success endpoints |
| Secondary cyan | `#00b8ff` | Sekundarne ścieżki, akcenty, decyzje |
| Dark bg | `#0a0e1a` | Tło canvasu |
| Dark accent | `#151b2b` | Tło drugorzędnych kontenerów |
| Gray (inactive) | `#6b7280` lub `#9ca3af` | NIE czytaj, archive/, dashed lines |
| White / off-white | `#f3f4f6` | Tekst (główny) |
| Orange (start) | `#fb923c` | Punkt startowy (np. bufor 174k z 2024) |
| Yellow (attention) | `#fbbf24` | Pojedyncza decyzja/kwota wymagająca uwagi (np. 172 PLN dopłata) |

Font: sans-serif (Inter / system font). W Excalidraw użyj "Hand-drawn" lub "Normal" — najlepiej "Normal" dla czytelności.

---

## Diagram 1 — Pełny funnel (hero, horyzontalny)

**Argumenty wizualne do udowodnienia:**
1. **Konwergencja źródeł** — 5 niezależnych źródeł danych zbiega się w jeden inbox.
2. **`/ingest` jako hero** — centralny węzeł zaznaczony semantycznie (kolor primary, glow), z którego rozchodzą się 2 strumienie: `archive/` (dashed, gray) i `data/` (solid, primary green).
3. **Redukcja klasyfikacyjna** — 5430 trx → 11 zdarzeń, oznaczone wyraźnie (stosunkiem rozmiarów albo dramatycznym zmniejszeniem szerokości pasa).
4. **Bufor wieloletni** — strzałka pomiędzy buforem 174k (orange, in) a 162k (green, out), opisana "art. 22 ust. 16 — bez ograniczenia czasowego".
5. **Endpoint** — MF accept ✓, dopłata 172 PLN.

**Layout (left → right):**

```text
┌─ ŹRÓDŁA ──────────────┐  ┌─ INBOX ─┐  ┌─ /INGEST ─┐  ┌─ KATALOGI ────────┐  ┌─ KALKULACJA ──────┐  ┌─ ZŁOŻENIE ─┐
│                       │  │         │  │  (LLM)    │  │ archive/  data/   │  │ Sekcja C / E / G  │  │ PDF + UPO  │
│ ● XTB PIT-8C          │  │ 12      │  │           │  │ NIE czyta CZYTAJ  │  │                   │  │            │
│ ● XTB Raport Dyw.     │→→│ plików  │→→│  agent    │→→│ (raw)     (md)    │→→│ strata 966,92     │→→│ MF accept  │
│ ● SFIO PIT-8C         │  │ raw     │  │  ingest   │  │           9 plików│  │ bufor 174k → 162k │  │ ✓          │
│ ● Crypto.com (3 CSV)  │  │         │  │           │  │ klasyfikacja:     │  │ dopłata 172 PLN   │  │            │
│ ● Nexo (CSV 4096 trx) │  └─────────┘  └───────────┘  │ 5430 trx → 11     │  │                   │  └────────────┘
│ ● mBank: oświadczenie │                              └───────────────────┘  └───────────────────┘
│ ● + PIT-38 2024 hist. │
│ ● + PIT-38(18) wzór   │
└───────────────────────┘
```

**Adnotacje (bardzo ważne — to są value prop'y diagramu):**
1. Pod strzałką "5430 → 11": **"klasyfikacja interpretacyjna z udokumentowanym uzasadnieniem prawnym"**
2. Strzałka między bufor 174k → 162k: **"art. 22 ust. 16 — bez ograniczenia czasowego"**
3. Pod `/ingest` (boxem): **"1 komenda → identyfikacja + routing + ekstrakcja + archiwizacja"**
4. Linia czasowa pod całością (subtelna, gray): **"2026-04-27 (start) ── 2026-04-28 21:36 (złożone) ── 30.04.2026 (termin)"**

**Kolory w diagramie 1:**
- ŹRÓDŁA, INBOX, KATALOGI, KALKULACJA, ZŁOŻENIE — neutralne kontenery (`#151b2b` tło z `#00b8ff` border)
- `/INGEST` (hero) — `#00ff9d` border + subtle glow
- `archive/` — gray dashed border, `#6b7280`
- `data/` — `#00ff9d` solid border
- Bufor 174k — `#fb923c` (orange = start/origin)
- Bufor 162k → 2026 — `#00ff9d` (green = success/handoff)
- 172 PLN dopłata — `#fbbf24` (yellow = attention)
- MF accept ✓ — `#00ff9d`

**Lokalizacja w artykule:**
- **PL:** Po sekcji "## Architektura projektu: każdy katalog ma jedną odpowiedzialność" przed sekcją "## `/ingest`: jedna komenda, cztery kroki" — to naturalny moment, w którym czytelnik już zna katalogi, a jeszcze nie wie co `/ingest` robi. Diagram domyka kontekst.
- **EN:** identyczne miejsce — między sekcją "Project architecture: every directory has one responsibility" a "`/ingest`: one command, four steps".

**Markdown insertion:**
```markdown
![Workflow funnel: 5 źródeł danych → /ingest → klasyfikacja 5430 → 11 zdarzeń → złożenie deklaracji](/images/diagram-pit-38-funnel.webp)
```

**Alt-text PL:** `Workflow funnel: 5 źródeł danych zbiega się w /ingest, agent klasyfikuje 5430 surowych transakcji do 11 zdarzeń podatkowych, deklaracja trafia do MF z buforem 174k przeniesionym na 162k`

**Alt-text EN:** `Workflow funnel: 5 data sources converge into /ingest, the agent classifies 5,430 raw transactions into 11 taxable events, the return is filed with the tax office, and the 174k buffer rolls forward to 162k`

---

## Diagram 2 — Mini funnel pionowy (LinkedIn scroll-stopper)

**Cel:** scroll-stopper bez kontekstu — pokazuje dramatyczną redukcję, ma sens jako standalone na LinkedIn share, nie wymaga czytania artykułu.

**Layout (top → bottom):**

```text
       ┌──────────────────┐
       │   5 430          │   ← top, duży font, primary green
       │   transakcji     │
       │   (5 źródeł)     │
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐
       │    /ingest       │   ← middle, hero, primary green + glow
       │    (LLM agent)   │
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐
       │   11 zdarzeń     │   ← bottom, primary green
       │   podatkowych    │
       └──────────────────┘

   ┌─ adnotacja boczna ──────────────────────────┐
   │ bufor kosztów: 174 895 PLN → 162 948 PLN    │
   │ podatek od krypto: 0 PLN                    │
   │ dopłata sekcji G (dywidendy): 172 PLN       │
   │ czas: ~2 godziny aktywnej pracy             │
   └─────────────────────────────────────────────┘
```

**Wymiary:** 1080×1080 (LinkedIn square). Górna 1/3: liczba 5430. Środek 1/3: `/ingest` jako hero. Dolna 1/3: liczba 11 + adnotacje.

**Kolory:**
- Liczby (5430, 11) — `#00ff9d`, bardzo duży font (~120-140px)
- `/ingest` — `#00ff9d` border + glow, `#151b2b` fill
- Strzałki — `#00b8ff` z gradientem do `#00ff9d`
- Adnotacje boczne — `#9ca3af` (subdued)

**Wersje językowe:** dwa pliki — `diagram-pit-38-funnel-square-pl.webp` i `diagram-pit-38-funnel-square-en.webp` (różnice tylko w tekście). EN: "transactions", "5 sources", "taxable events", "cost basis buffer", "crypto tax", "section G top-up", "active work".

**Użycie:** **NIE w artykule** — jako załącznik do LinkedIn share post (29-30.04). Opcjonalnie można umieścić w sekcji 8 "Jeśli czytasz to dziś" jako wizualny CTA.

---

## Diagram 3 — Tree katalogów z anotacjami (deep dive, opcjonalny)

**Cel:** czysto techniczny diagram dla bardziej technicznego czytelnika. Pokazuje strukturę `PIT_38/` jako drzewo z anotacjami "agent reads / doesn't read" i odpowiedzialnościami.

**Layout (vertical tree):**

```text
PIT_38/
├── inbox/          ─── drop zone — Ty wrzucasz, agent klasyfikuje                    [neutral]
├── archive/        ─── post-processing — agent NIE czyta (higiena kontekstu)         [gray, dashed]
├── data/           ─── knowledge base — agent czyta swobodnie (markdown)             [PRIMARY GREEN]
│    ├── xtb-pit8c-2025.md
│    ├── sfio-pit8c-2025.md
│    ├── crypto-summary-2025.md
│    ├── pit38-calculation.md
│    └── sources.md  ─── uzasadnienia decyzji interpretacyjnych                       [cyan accent]
├── deliverables/   ─── checklist, blog inputs                                         [neutral]
├── output/         ─── finalna deklaracja PDF + UPO (agent NIE czyta)                 [gray, dashed]
├── project.md      ─── cel, status, decyzje                                           [cyan]
└── catalog.md      ─── indeks plików                                                  [cyan]
```

**Kolory:**
- `data/` (cała gałąź) — `#00ff9d`, solid
- `archive/`, `output/` — `#6b7280`, dashed border
- `inbox/`, `deliverables/` — `#9ca3af` (neutral)
- `project.md`, `catalog.md`, `data/sources.md` — `#00b8ff` (cyan, meta-files)

**Adnotacja na dole diagramu (kluczowy insight):**
> "Każdy katalog ma jedną odpowiedzialność. To nie bezpieczeństwo — to higiena kontekstu."

**Lokalizacja w artykule (opcjonalna):** w sekcji "## Architektura projektu: każdy katalog ma jedną odpowiedzialność" — zamiast prostego `text` code block-a (linia 41 PL / linia 41 EN). Diagram zastępuje tree, dorzucając kolor i semantykę.

**Decyzja:** Diagram 3 jest **opcjonalny**. Tekstowy tree w artykule już niesie informację. Diagram 3 ma sens, gdy chcesz mocniejszy wizualny argument na "higienę kontekstu". Jeśli budżet czasu pozwala — zrób. Jeśli nie — pomiń.

---

## Konstrukcja tekstu w diagramach (PL i EN)

**Wszystkie diagramy mają wersję PL i EN.** Etykiety w diagramach 1 i 3:

| PL | EN |
|---|---|
| ŹRÓDŁA | DATA SOURCES |
| INBOX | INBOX |
| KATALOGI | DIRECTORIES |
| KALKULACJA | CALCULATION |
| ZŁOŻENIE | FILING |
| NIE czyta | does NOT read |
| CZYTAJ | reads freely |
| klasyfikacja | classification |
| 5430 trx → 11 zdarzeń | 5,430 trx → 11 events |
| bufor | buffer |
| dopłata | top-up |
| MF accept ✓ | filed ✓ |
| 1 komenda → identyfikacja + routing + ekstrakcja + archiwizacja | 1 command → identify + route + extract + archive |
| art. 22 ust. 16 — bez ograniczenia czasowego | Art. 22 §16 — no time limit |
| 12 plików raw | 12 raw files |
| 9 plików | 9 files |

**Liczby (5430, 11, 174 895, 162 948, 966,92, 172) są UNIWERSALNE** — w EN tylko separator z przecinka na kropkę: `174,895` zamiast `174 895`.

---

## Pliki output do wygenerowania (priorytet)

**Must-have (priorytet 1):**
1. `public/images/diagram-pit-38-funnel-pl.webp` — Diagram 1 PL, hero do PL artykułu
2. `public/images/diagram-pit-38-funnel-en.webp` — Diagram 1 EN, hero do EN artykułu

**Nice-to-have (priorytet 2):**
3. `public/images/diagram-pit-38-funnel-square-pl.webp` — Diagram 2 PL, LinkedIn share
4. `public/images/diagram-pit-38-funnel-square-en.webp` — Diagram 2 EN, LinkedIn share

**Optional (priorytet 3):**
5. `public/images/diagram-pit-38-tree-pl.webp` — Diagram 3 PL
6. `public/images/diagram-pit-38-tree-en.webp` — Diagram 3 EN

---

## Po wygenerowaniu — jak wbudować w artykuł

### Krok 1: konwersja PNG → WebP

Jeśli skill produkuje PNG:
```bash
node scripts/convert-to-webp.js public/images/diagram-pit-38-funnel-pl.png
node scripts/convert-to-webp.js public/images/diagram-pit-38-funnel-en.png
# powtórz dla pozostałych
rm public/images/diagram-pit-38-funnel-*.png
```

### Krok 2: wstawka w PL artykule

Plik `src/content/blog/pit-38-claude-code-case-study.md`, między sekcją Architektura a `/ingest` (po linii kończącej sekcję 2, przed `## /ingest`):

```markdown
![Workflow funnel: 5 źródeł danych → /ingest → klasyfikacja 5430 → 11 zdarzeń → złożenie deklaracji](/images/diagram-pit-38-funnel-pl.webp)
```

### Krok 3: wstawka w EN artykule

Plik `src/content/blog/en/polish-pit-38-claude-code-case-study.md`, identyczne miejsce:

```markdown
![Workflow funnel: 5 data sources converge into /ingest, agent classifies 5,430 raw transactions into 11 taxable events, return filed with tax office](/images/diagram-pit-38-funnel-en.webp)
```

### Krok 4 (opcjonalny): zamiana tekstowego tree na diagram

Jeśli generujesz Diagram 3, zamień w obu artykułach blok ```text z drzewem `PIT_38/` na obrazek:

```markdown
![Tree katalogów PIT_38/: data/ czytane przez agenta, archive/ i output/ poza zasięgiem (higiena kontekstu)](/images/diagram-pit-38-tree-pl.webp)
```

### Krok 5: regeneracja sitemapy (nie jest potrzebna dla obrazów)

Sitemap nie listuje obrazów. Po wstawce wystarczy commit.

### Krok 6: smoke test

```bash
npm run dev
# otwórz: http://localhost:5173/blog/pit-38-claude-code-case-study
# otwórz: http://localhost:5173/en/blog/polish-pit-38-claude-code-case-study
# zweryfikuj: czy diagramy się renderują, czy alt-texty są poprawne, czy responsywne na mobile (max-width: 100%)
```

### Krok 7: commit

Sugerowana wiadomość:
```text
feat(blog): add workflow diagrams to post 26 (PL+EN)

Hero funnel diagram (5 sources → /ingest → 11 events → filed) inserted
between architecture and ingest sections in both language versions.
```

---

## Failure modes / common pitfalls

- **Tekst za mały na thumbnailach.** Diagram 1 będzie często widziany w 600-800px szerokości na mobile. Sprawdź czytelność liczb (5430, 11, 174k) na połowie szerokości.
- **Za dużo elementów.** Diagram funnel ma sześć boxów + adnotacje + linia czasowa. Łatwo przekroczyć limit poznawczy. Jeśli czujesz, że jest gęsto — usuń linię czasową albo połącz "KALKULACJA" i "ZŁOŻENIE".
- **Mismatch palety.** Jeśli używasz Excalidraw built-in colors zamiast `#00ff9d`/`#00b8ff`, diagram nie będzie pasować do reszty bloga. Custom colors są must-have.
- **Tekst PL w EN diagramie.** Pamiętaj o oddzielnych plikach per locale. "ŹRÓDŁA" w EN diagramie to fail.
- **Liczby z formatowaniem PL w EN.** "174 895" w EN diagramie wygląda jak literówka; powinno być "174,895".
- **OG image ≠ diagram.** OG image (`og-pit-38-claude-code-case-study.webp`) już istnieje i jest abstrakcyjny — nie myl go z diagramami procesu. Diagramy idą w body artykułu, OG image idzie do meta tagów.

---

## TL;DR dla sesji generującej

1. **Generuj 2 pliki priorytetu 1** (Diagram 1 PL + EN, hero funnel, 1600×600).
2. Paleta: `#00ff9d` primary, `#00b8ff` secondary, `#0a0e1a` bg, `#fb923c` start, `#fbbf24` attention, `#6b7280` inactive/dashed.
3. **Hero diagram** (priorytet 1): konwergencja 5 źródeł → `/ingest` → split do `archive/` (gray, dashed) i `data/` (primary green) → kalkulacja → MF accept. Klucz: redukcja 5430 → 11 z adnotacją "klasyfikacja".
4. Format: PNG → WebP via `scripts/convert-to-webp.js`. Output do `public/images/diagram-pit-38-funnel-{pl,en}.webp`.
5. Po wstawce: alt-text per locale, lokalizacja między sekcją "Architektura" a "/ingest" w obu artykułach.
6. Commit razem z aktualizacją artykułów: `feat(blog): add workflow diagrams to post 26 (PL+EN)`.
