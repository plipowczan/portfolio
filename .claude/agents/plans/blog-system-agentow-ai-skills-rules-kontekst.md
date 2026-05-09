# Blog Plan — System agentów AI: skills, rules, wspólny kontekst

> **Generated:** 2026-05-09
> **Phase:** PLAN
> **Prime artifact:** `.claude/agents/context/blog-prime-200iq-budget-tracker.md`
> **Next:** `/blog-article-writer:execute`

---

## 1. Frontmatter specification

```yaml
---
id: 27
slug: system-agentow-ai-skills-rules-kontekst
title: "Pre-revenue startup bez działu finansów. Anatomia systemu agentów AI."
excerpt: >-
  5 ról specjalistów, 2 założycieli. Jak skills, deterministyczne reguły
  i wspólny kontekst zastąpiły zespół w 200IQ LABS — case study i architektura.
category: AI
author: Pawel Lipowczan
date: 2026-05-09
readTime: 16 min
image: /images/og-system-agentow-ai-skills-rules-kontekst.webp
tags:
  - AI
  - Claude Code
  - Skills
  - Architektura
  - Case Study
  - 200IQ LABS
  - Workflow
lang: pl
---
```

### Title alternatives (rank 1 = recommended)

1. **"Pre-revenue startup bez działu finansów. Anatomia systemu agentów AI."** *(recommended — dramatic + architectural hook, 65 chars)*
2. "Skills, rules, wspólny kontekst — jak zbudować system agentów AI" (62 chars, more abstract)
3. "200IQ LABS: dział finansów w 2 dni. Anatomia systemu agentów." (60 chars, case-study-led)

### Slug alternatives

1. **`system-agentow-ai-skills-rules-kontekst`** *(recommended — keyword-clean, evergreen)*
2. `dzial-finansow-2-dni-system-agentow-ai` (case-study-led)
3. `architektura-agentow-ai-200iq-labs` (brand-led)

### Excerpt (target ~155 chars)

> 5 ról specjalistów, 2 założycieli. Jak skills, deterministyczne reguły i wspólny kontekst zastąpiły zespół w 200IQ LABS — case study i architektura.

Char count: 152. ✅

### Tags rationale

- `AI`, `Claude Code` — primary topical tags consistent with category=AI
- `Skills`, `Architektura` — distinguishes from generic "I built an agent" posts
- `Case Study` — matches pit-38 precedent
- `200IQ LABS` — brand tag for cross-linking with future Qamera/200IQ articles
- `Workflow` — secondary, matches the 6-phase close framing

---

## 2. Article spine — meta architecture, case study as proof

The article has **three pillars** mapped to the architecture diagram. Each pillar opens by referring back to a specific layer of the diagram, then proves the pillar with a concrete example from the budget tracker.

```
Hook (3-day timeline + the meta question)
  ↓
Architektura diagram (the spine — referenced throughout)
  ↓
Pillar 1: Skills automatyzują procesy
  └── Example: /finances close — 6 phases + video + diagram
  ↓
Pillar 2: Determinizm przez reguły
  └── Example: rules.yaml 0 → 30+, GCPLD double-rule, AUTO markers
  ↓
Pillar 3: Wspólny kontekst (substrate)
  └── Example: Python tools vs MCP, CLAUDE.md/MEMORY.md/context/
  ↓
Case study sidebar: real April numbers
  ↓
Limitations + lessons learned
  ↓
CTA → Przydatne zasoby → FAQ
```

---

## 3. Section-by-section outline

### §1 — Hook + intro (~400 words)

**Opening pattern:** date stamp + dramatic before/after, mirroring pit-38's "Dziś jest 29 kwietnia 2026..." opening.

```
Dziś jest 9 maja 2026. Dwa dni temu prowadziłem prelekcję
na NoCode Poland #4 o tym, jak we dwóch z Przemkiem prowadzimy
200IQ LABS bez działu finansów, marketingu, prawnego i PM-u.

Tydzień wcześniej, 1 maja, ten dział finansów jeszcze nie istniał.
2 maja powstał plan budżetowy i szkielet systemu zarządczego.
3 maja był pierwszy close kwietnia: 30+ reguł klasyfikacji
wytrenowanych z zera, 5 raportów zarządczych w `monthly/2026-04.md`,
real EBITDA −16 804 PLN udokumentowane z trzema decyzjami korekcyjnymi.

To nie jest artykuł o tym, że "zbudowaliśmy fajne narzędzie".
To jest artykuł o tym, **jak architektonicznie zbudować system
agentów AI, który realnie zastępuje role specjalistów**...
```

**Beats:**
1. Date + dramatic timeline (1 maja → 3 maja)
2. Self-deprecating aside ("wolałbym wdrażać PR-y niż liczyć", parallel to pit-38 voice)
3. Why this matters: not "AI replaces accountants" hype — concrete architecture pattern
4. **Preview the 3 pillars** explicitly, with one-line teaser each

**Bold concepts to introduce:** `skill`, `rules`, `wspólny kontekst`, `subagenty`, `Python tools`, `MCP`

### §2 — Architektura: jeden diagram, trzy warstwy (~400 words)

**Visual:** Embed `architecture.png` immediately after the H2 (full width, captioned in Polish).

**Walk-through:**
1. **Główny agent (Claude Code orchestrator)** — punkt wejścia, routes do subagentów
2. **Subagenty (skille + persona)** — CFO, Marketing, Legal, Tax Advisor, Business Consultant. Każdy ma scoped `context/...`
3. **Warstwa narzędzi (hybryda Python + MCP)** — Python tools default, External MCP gdy wymuszone lub gdy MY wystawiamy
4. **Wspólny kontekst** — CLAUDE.md (instrukcje projektu), MEMORY.md (persistent), `context/` (baza wiedzy całej firmy)

**One-line per pillar setup:**
- *"Skills sprawiają, że proces staje się rzeczownikiem — `/finances close 2026-04` zamiast 'pamiętam, że trzeba ściągnąć Stripe, potem Revolut, potem zapisać raport'."*
- *"Rules zapewniają, że ten sam input daje ten sam output — i że LLM nie zgaduje gdy nie musi."*
- *"Wspólny kontekst sprawia, że subagenty nie są izolowanymi czatami — dzielą bazę wiedzy i konwencje."*

### §3 — Pillar 1: Skills automatyzują procesy (~700 words)

**Defining skill:** *skill = proces + persona + binding do narzędzi*. Skill jest jednostką, w której zamykasz workflow: trigger, kroki, decyzje, integracje.

**Subsections:**

**3.1 — Skill jako rzeczownik**

Bez skilla: *"hej, zaciągnij dane Stripe za kwiecień, potem Revolut, sklasyfikuj transakcje, sprawdź accruals, zapisz raport"*. Każdorazowo — improwizacja.

Z skillem `/finances close YYYY-MM`: jedna komenda, deterministyczna sekwencja 6 faz.

**3.2 — `/finances close` — 6 faz**

Embed `finances-close-process.png` (need to copy from NCP4 pack to `public/images/diagram-close-process.webp`).

Code block (text, not real bash) showing the phase list:

```text
PHASE 1: PULL          (~2 min)   Revolut + Stripe (Python) + inFakt (MCP) + tech-stack
PHASE 2: CLASSIFY      (~30s)     rules.yaml deterministic → LLM fallback
PHASE 3: REVIEW        (~10-15min interactive)  [a/c/r/s] learning loop
PHASE 4: ACCRUALS CHECK (~2 min)   accrued-liabilities.yaml matching
PHASE 5: COMMIT        (~10-20 min)   mandatory narrative blokuje close
PHASE 6: REGENERATE    (~30s)        3 dashboards, AUTO:START/END markers
```

Crucial point: każda faza jest **idempotentna** — restart po awarii nie duplikuje danych.

**3.3 — Wideo: jeden close na żywo**

Embed `<video>` with WebM + MP4 sources, generated poster, `preload="metadata"`.

Caption frame: *"Pełny close kwietnia 2026 — `/finances close 2026-04`. ~7 minut, 6 faz, 2 iteracje QA zostały w nagraniu jako meta-przekaz: można korygować rozmową z agentem, to nie skrypt jednoprzejściowy."*

**3.4 — Generalizacja: każdy proces może być skillem**

Krótko (3-4 zdania): `/ingest` (klasyfikacja inputu), `/slides:new` (wygenerowanie talku — meta-twist: ten artykuł powstaje w sąsiednim skillu `/blog-article-writer`).

**3.5 — Mandatory narrative blokuje close**

PHASE 5 wymaga, że człowiek napisze 3 sekcje (niespodzianki / decyzje / plan korekta) w `monthly/<YYYY-MM>.md`. Pusty narrative = close nie zamknie się.

> **Refleksja jest częścią procesu, nie opcją.**

To jest pattern szerszy niż finanse: za każdym razem gdy automatyzujesz coś, w czym wartość leży w **rozumieniu** a nie w **wykonaniu** — dodaj human-in-the-loop checkpoint który nie da się ominąć.

### §4 — Pillar 2: Determinizm przez reguły (~750 words)

**Cold start problem.**

Pure rules: każdy nowy vendor = manual setup, długie cold start. Pure LLM: niedeterministyczny, niedrogi w skali ale niedopuszczalny w finansach (audit, regulator).

**Hybrid: rules-first + LLM fallback + learning loop.**

**4.1 — Rules-first**

Code block (yaml):

```yaml
# rules.yaml — fragment
- id: gworkspace-via-gcp
  pattern:
    memo: "GCPLD"
    source: infakt
    amount_range: [200, 500]
  classify:
    category: opex/saas
    unit: null
  note: "Google Workspace billowane przez Google Cloud Poland (300-330 PLN/mc)"
  created_at: 2026-05-04

- id: gcp-infakt
  pattern:
    memo: "GCPLD"
    source: infakt
    amount_range: [500, 999999]
  classify:
    category: cogs/ai-generation
    unit: qamera
  note: "Faktury GCP w inFakt z prefiksem GCPLD i kwotą >500 PLN = compute"
  created_at: 2026-05-04
```

**Killer punchline:** ten sam vendor (`GCPLD`), dwie kategorie, jedna deterministyczna reguła. Różnica w `amount_range`. To jest typ niuansu który LLM zgaduje **zawsze inaczej** — a my tu mamy odpowiedź zaszytą jako kod.

**4.2 — LLM fallback z few-shot examples**

Code block (yaml):

```yaml
# examples.yaml — fragment
- transaction:
    date: 2026-04-10
    amount: -127.40
    memo: "BYTEPLUS API USAGE PAY-AS-YOU-GO"
    source: revolut
  classification:
    category: cogs/ai-generation
    unit: qamera
  reasoning: "Byteplus to provider Kling AI używany do generacji video w produkcie"
```

LLM dostaje tych przykładów ~15-25 i klasyfikuje to, czego nie wyłapały reguły. **`reasoning` jest tym, co user widzi** w REVIEW — to nie black box.

**4.3 — Learning loop: REVIEW [a]ccept / [c]hange / [r]ule / [s]kip**

Pętla per LLM-classified transakcja. Decyzje:

| Opcja | Co robi |
|---|---|
| `[a]ccept` | LLM zgadł, jednorazowy przypadek |
| `[c]hange` | LLM się pomylił, ręczna korekta |
| `[r]ule` | Akceptuje + tworzy regułę dla podobnych |
| `[s]kip` | Nie wiem, wracamy w następnym close |

**Złota zasada:** jeśli transakcja prawdopodobnie się powtórzy → `[r]ule`. 30 sekund teraz, oszczędzasz minuty przez kolejne miesiące. **System konwerguje od probabilistycznego do deterministycznego.**

**Real number:** pierwszy close (kwiecień 2026) wytworzył **30+ reguł z zera**.

**4.4 — Idempotent regeneration: ortogonalny mechanizm determinizmu**

Code block (markdown):

```markdown
# 200IQ LABS — Finances Dashboard

<!-- AUTO:START -->

## Cash position & runway

| Metryka | Wartość |
|---|---|
| Cumulative shareholder loans | 74 300 PLN |
| Confirmed financing (czerwiec) | +100 000 PLN |
| ...

<!-- AUTO:END -->

## Notatki ręczne (poza markerami — przetrwają regenerację)

- 2026-05-04: pierwszy close systemu...
```

Markery `AUTO:START` / `AUTO:END` ograniczają zasięg regeneracji. Ręczne notatki poza markerami **przeżywają każdą regenerację**. Bez tego nikt nie pisze ręcznych notatek w auto-generowanych dokumentach (bo "i tak zostaną nadpisane") — i te dokumenty stają się martwe.

### §5 — Pillar 3: Wspólny kontekst (substrate) (~700 words)

**5.1 — Trzy warstwy wspólnego kontekstu**

- **CLAUDE.md** (per-projekt) — instrukcje, konwencje, ścieżki, "co agent ma robić jak nie wie"
- **MEMORY.md** (cross-conversation) — auto-memory, persistent między sesjami
- **`context/`** (knowledge base) — strukturalna baza: `context/finances/`, `context/qamera/`, `context/clients/`, `context/projects/`

Przykład struktury (code block, text):

```text
agentic-ai-system/
├── CLAUDE.md             # instrukcje projektu
├── memory/
│   └── MEMORY.md         # auto-memory, persistent
├── context/
│   ├── finances/         # ← dla skilla CFO
│   ├── qamera/           # ← dla skilli marketingowych
│   ├── clients/          # ← dla skilla Business Consultant
│   └── operations/
├── skills/
│   ├── finances/SKILL.md
│   ├── ingest/SKILL.md
│   └── slides/SKILL.md
└── tools/
    ├── stripe/           # Python wrappers
    ├── revolut/          # Python wrappers
    └── airtable/         # Python wrappers
```

**5.2 — Python tools (default) vs External MCP (when forced)**

> **Reguła: Python skrypt zawsze, kiedy możemy. MCP, kiedy musimy.**

| Integracja | Podejście | Dlaczego |
|---|---|---|
| Stripe (subskrypcje Qamery) | Python | Pełne API → własny wrapper, deterministic, zero overhead |
| Revolut (transakcje firmowe) | Python | Pełne API, własny wrapper |
| Airtable (CRM) | Python | Pełne API, własny wrapper |
| **inFakt** (księgowość) | **MCP** | API blokuje koszty gdy biuro księgowe aktywne — MCP **wymuszone** |
| **Qamera AI** (nasz produkt) | **MCP** | Ekspozycja na zewnątrz — to my **wystawiamy** MCP dla cudzych agentów |

**Dlaczego Python > MCP gdy mamy wybór:**

1. **Oszczędność tokenów** — MCP ładuje opisy do kontekstu każdej rozmowy. Skrypt = zero overhead.
2. **Determinizm** — skrypt robi dokładnie to, co napisano. Bez "model zinterpretował narzędzie inaczej".
3. **Trywialne tworzenie** — *"agent, potrzebuję skrypt który X"* → agent generuje, ja code-review, commit.
4. **Pełna kontrola** — kod w repo, w wersji, czytelny dla innego dewelopera.

**5.3 — Subagenty czytają tylko swój scope**

Każdy subagent (skill + persona) ma scope w swojej linii kontekstu. CFO czyta `context/finances/` + `context/operations/` + (read-only) `context/qamera/` dla revenue. Nie czyta `context/clients/` (to zasięg Business Consultanta) — bo nie potrzebuje.

**Higiena kontekstu** to drugi multiplikator wartości po automatyzacji. Bez niej każde pytanie do CFO zaciąga połowę firmy do tokenów. Z nią — tylko to, co relevantne.

(Cross-link do pit-38 article: *"Pisałem o tym samym wzorcu w kontekście rozliczeń — `inbox/`, `archive/`, `data/` — [PIT-38 case study](/blog/pit-38-claude-code-case-study)."*)

### §6 — Case study sidebar: real numbers z kwietnia 2026 (~350 words)

**Cel sekcji:** dowód że to nie demo. Real EBITDA, real decyzje, real korekta planu.

**Tabela:**

| Linia | Actual | Plan | Δ |
|---|---:|---:|---:|
| Revenue | 347 PLN | 598 PLN | −42% |
| Costs | 17 151 PLN | 14 242 PLN | +20% |
| EBITDA | −16 804 PLN | −13 644 PLN | −23% |

**Trzy decyzje wynikające z close-a:**

1. **GCP +144% vs plan** → plan był błędny (700 PLN), realny run-rate 1000–1600 PLN. Plan May–Dec podniesiony retroaktywnie do 1500–1800. Świadoma decyzja **NIE optymalizować** — część tego to content marketingowy.
2. **Cursor billowany 4×/mc** (716 PLN vs plan 217) → planowana migracja **Cursor → Claude** (sztywny ~90 EUR/mc, predictable).
3. **Meta Ads off od maja** — strategia była błędna, nowa direction TBD.

**Pointa:** decyzje wynikają **z systemu, ale nie podejmuje ich system**. System pokazuje variance i wymaga w PHASE 5 narrative. Decyzję podejmuję ja — ale mam ją udokumentowaną w `monthly/2026-04.md` na wypadek gdy za pół roku zapomnę dlaczego.

### §7 — Czego nie polecam / limitations (~350 words)

Mirror pit-38 honest limitations section.

- **Nie polecam tego setupu osobie bez programistycznego komfortu.** Markdown, YAML, git, terminal, edycja convention files — wymaga rozumienia. Bez tego strata czasu na setup zje wszystkie zyski.
- **Manual first, automate after pain.** Pierwsze 2-3 close-y MUSZĄ być manualne. Pierwszy close ujawnił 30+ patternów do zakodowania. Bez ręcznego wykonania połowa byłaby zaprojektowana źle.
- **System zarządczy ≠ księgowość formalna.** inFakt + księgowa robią compliance. Ten system robi decyzje. Nie podmieniaj jednego za drugie — uzupełniają się, nie zastępują.
- **LLM-y robią błędy arytmetyczne.** Sumowanie do silnika obliczeniowego (Excel, kalkulator, narzędzie). LLM ma wartość w strukturze i interpretacji.
- **Nie skaluje się liniowo poza 1 firmę.** System zaprojektowany dla 200IQ LABS. Wzorce się generalizują (skills, rules, kontekst); konkretne YAML-e nie. *"Nie kopiujcie setupu, wyciągajcie zasady"* — to było motto talku.

### §8 — Kluczowe wnioski (~250 words)

3-5 numbered takeaways:

1. **Skills sprawiają że proces staje się rzeczownikiem.** `/finances close YYYY-MM` zamiast 6 manualnych kroków. Każdy powtarzalny workflow zasługuje na własny skill.
2. **Determinizm budujesz iteracyjnie.** Rules-first + LLM fallback + opcja `[r]ule` w REVIEW = system konwerguje z probabilistycznego do deterministycznego. Po pierwszym close mieliśmy 30+ reguł.
3. **Wspólny kontekst (CLAUDE.md, MEMORY.md, `context/`) to substrate, nie ozdoba.** Bez niego subagenty są izolowanymi czatami. Z nim — system, który pamięta firmę.
4. **Python skrypt > MCP gdy mamy wybór.** Token-efficient, deterministic, in-repo. MCP gdy API wymusza lub gdy MY wystawiamy.
5. **Refleksja jest częścią procesu, nie opcją.** Mandatory narrative blokuje close. Bez tego za pół roku nie wiesz dlaczego coś było.

Personal closing (1-2 zdania): *"Wolę wdrażać kod niż liczyć — i agenty pomagają mi w obu. Ten system od dawna miał powstać. Eventem napędzającym była prelekcja. Działa."*

### §9 — CTA (HTML + Tailwind, REQUIRED)

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Prowadzisz pre-revenue startup i myślisz o systemie zarządczym AI?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomagam founderom i konsultantom technologicznym projektować architekturę
    agentów AI dla operacji firmy — skills, deterministyczne reguły, wspólny
    kontekst. Pokażę, jak taki setup mógłby wyglądać u Ciebie.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

### §10 — Przydatne zasoby

- [Anthropic — Claude Code docs](https://docs.claude.com/en/docs/claude-code/overview) — referencja do skills, settings, MCP
- [Model Context Protocol — spec](https://modelcontextprotocol.io/) — czym jest MCP i kiedy ma sens
- [OpenSpec — strukturyzowany workflow specyfikacji](https://github.com/200iqlabs/openspec) (lub odpowiedni link wewnętrzny / blog post jeśli istnieje)
- [PIT-38 case study](/blog/pit-38-claude-code-case-study) — ten sam wzorzec architektoniczny w kontekście rozliczeń podatkowych
- [Skills 2.0 — multi-agent system do zarządzania firmą](/blog/skills-2-0-multi-agent-system-zarzadzanie-firma) — szerszy kontekst Skills 2.0
- [Spec-driven SEO na portfolio i Qamera AI](/blog/spec-driven-seo-portfolio-qamera-ai) — inny case study, ten sam typ workflow

(Trzeba zweryfikować że cross-linki istnieją w execute phase.)

### §11 — FAQ (REQUIRED, 4-6 questions)

**Format:** `<details open>` accordion, H3 in `<summary>`, snippet-style answer (2-4 zdań, key info first).

Planned questions:

1. **Czy Skills + rules + wspólny kontekst działa tylko w Claude Code, czy w innych agentach też?**
   Pattern jest agent-agnostic. Skills mapują się na funkcje/komendy w innych systemach (Cursor commands, n8n workflows, custom CLI). Rules + few-shot examples to standardowa technika ML. Wspólny kontekst (markdown + struktura katalogów) działa wszędzie gdzie agent ma dostęp do plików. **Konkretne mechanizmy** (`CLAUDE.md`, MCP, MEMORY.md) są specyficzne dla Anthropic, ale **wzorzec** się generalizuje.

2. **Ile czasu zajmuje zbudowanie takiego systemu od zera?**
   Pierwszy działający close (z OpenSpec, schemami, 30+ regułami) zajął nam 2 dni intensywnej pracy w dwie osoby. Pełna stabilizacja (auto-pull skrypty, scheduled close, integracja z formalną księgowością) zakłada się na 4-6 tygodni przy regularnej kadencji. Ale **każdy dzień, w którym używasz manualnie zaprojektowanego skilla, jest dniem produktywnym** — nie czekasz aż system będzie kompletny.

3. **Dlaczego Python skrypt zamiast MCP, jeśli MCP jest standardem?**
   MCP ładuje opisy narzędzi do kontekstu każdej rozmowy — to koszt tokenów i potencjalna niejednoznaczność interpretacji. Python skrypt to zero overhead, deterministyczny output, kod w repo do code-review. **MCP używamy gdy API wymusza** (inFakt zablokowany dla bezpośrednich requestów gdy księgowa loguje się w tle) **lub gdy MY wystawiamy** narzędzie dla cudzych agentów (Qamera). W innych przypadkach Python wygrywa.

4. **Czy LLM nie pomyli się przy klasyfikacji finansowej? Co z audytem?**
   Hybrid (rules-first + LLM fallback) projektujemy specjalnie po to, żeby zminimalizować LLM-classified transakcje. Każda LLM-classified transakcja przechodzi przez REVIEW — człowiek widzi `reasoning` i decyduje [a]ccept/[c]hange/[r]ule/[s]kip. Po pierwszym close mieliśmy 30+ reguł, które deterministycznie wyłapują 80%+ kolejnych transakcji. **Audit trail leży w `rules.yaml` + `monthly/<YYYY-MM>.md`** — każda decyzja udokumentowana.

5. **Co robi `mandatory narrative` jeśli mam awaryjny close i nie zdążę napisać 3 sekcji?**
   Trzy sekcje (niespodzianki / decyzje / plan korekta) blokują close-a do momentu wypełnienia — to świadoma decyzja. W skrajnym przypadku możesz wypełnić każdą sekcję jednym zdaniem (*"brak niespodzianek vs plan", "brak decyzji", "kontynuujemy"*) — system nie ocenia jakości narrative, tylko jego obecność. Punkt jest taki, że za pół roku patrząc na variance EBITDA potrzebujesz **dowolnego** kontekstu, lepiej krótkiego niż żadnego.

6. **Czy to działa dla firmy na revenue, nie tylko pre-revenue?**
   Tak, wzorzec się skaluje — kategorie P&L i caps trzeba dopasować, mandatory narrative staje się jeszcze ważniejszy (więcej transakcji = więcej decyzji do udokumentowania), learning loop daje większy ROI (więcej powtarzalnych vendorów). Ale **w post-revenue spółce z dużym wolumenem prawdopodobnie potrzebujesz pełnoprawnego ERP** — system zarządczy z markdownem i YAML-em ma sufit przy ~setkach transakcji/miesiąc i kilku osobach decyzyjnych. **Nasz scope:** pre-revenue → early-revenue, 1-5 osób.

---

## 4. Word count summary

| Sekcja | Target |
|---|---:|
| §1 Hook + intro | 400 |
| §2 Architektura | 400 |
| §3 Pillar 1: Skills | 700 |
| §4 Pillar 2: Determinizm | 750 |
| §5 Pillar 3: Wspólny kontekst | 700 |
| §6 Case study sidebar | 350 |
| §7 Czego nie polecam | 350 |
| §8 Kluczowe wnioski | 250 |
| §9 CTA | (HTML, ~50) |
| §10 Przydatne zasoby | (link list, ~80) |
| §11 FAQ | 600 |
| **Total prose** | **~4 580** |

Przy 200 słów/min → **~23 min read.** Plan na frontmatter `readTime: 16 min` jest zachowawczy — w execute phase przelicz po draftcie i ewentualnie skoryguj. Może też wymagać **trimmingu** (0.7-0.8× redukcji) jeśli draft wyjdzie powyżej 4500 słów. **Reduction targets** (jeśli trzeba ciąć): §4 i §5 mają największy luz; §6 sidebar może być krótszy.

---

## 5. Code blocks plan (with required language tags)

| § | Code block | Language tag | Source |
|---|---|---|---|
| §3.2 | 6-phase list | `text` | brief.md (already formatted) |
| §3.3 | (video, not code) | — | `public/videos/budget-process.{webm,mp4}` |
| §4.1 | rules.yaml — GCPLD double rule | `yaml` | source compilation §15.2 |
| §4.2 | examples.yaml — Byteplus few-shot | `yaml` | source compilation §15.3 |
| §4.4 | _dashboard.md AUTO markers | `markdown` | source compilation §15.7 |
| §5.1 | directory tree | `text` | adapted from CLAUDE.md / source compilation §3 |
| §5.2 | (table, not code) | — | brief.md |

**No language-tag-less blocks allowed.** Verified.

---

## 6. Images / diagrams plan

| Position | File | Source | Alt text (Polish) |
|---|---|---|---|
| Hero (after intro) | `architecture.webp` | `docs/blog/ncp4-blog-pack/04-presentation/assets/architecture.png` | "Architektura systemu agentów AI w 200IQ LABS — główny agent (Claude Code orchestrator) → 5 subagentów (CFO, Marketing, Legal, Tax Advisor, Business Consultant) → warstwa narzędzi (Python tools + External MCP) → wspólny kontekst (CLAUDE.md, MEMORY.md, context/)" |
| §3.2 | `diagram-close-process.webp` | `docs/blog/ncp4-blog-pack/04-presentation/assets/finances-close-process.png` | "6 faz miesięcznego close w skill `/finances`: PULL → CLASSIFY → REVIEW → ACCRUALS CHECK → COMMIT → REGENERATE. PHASE 3 i 5 to human-in-the-loop." |
| OG image | `og-system-agentow-ai-skills-rules-kontekst.webp` | NEW — to be generated in execute / og-prompt phase | (n/a — OG-only) |

**Pre-execute step:** copy + WebP-convert both PNG sources from NCP4 pack to `public/images/`.

---

## 7. Video deployment plan

**Source:** `docs/blog/ncp4-blog-pack/04-presentation/assets/budget-process.mp4` (5.0 MB)

**Target outputs:**
- `public/videos/budget-process.webm` — VP9, target ~3 MB (transcode in execute phase)
- `public/videos/budget-process.mp4` — copy of original, fallback for browsers without WebM
- `public/images/poster-budget-process.webp` — generated poster frame (extract first non-blank frame, ~1080p, WebP)

**Transcoding command (to be run in execute):**

```bash
# WebM (VP9, audio stripped — talk video has no useful audio)
ffmpeg -i docs/blog/ncp4-blog-pack/04-presentation/assets/budget-process.mp4 \
  -c:v libvpx-vp9 -crf 32 -b:v 0 -an \
  public/videos/budget-process.webm

# Poster (frame at 2s, WebP)
ffmpeg -i docs/blog/ncp4-blog-pack/04-presentation/assets/budget-process.mp4 \
  -ss 00:00:02 -frames:v 1 -c:v libwebp -q:v 80 \
  public/images/poster-budget-process.webp

# MP4 copy (no re-encode)
cp docs/blog/ncp4-blog-pack/04-presentation/assets/budget-process.mp4 \
   public/videos/budget-process.mp4
```

**Embed markup (placed in §3.3):**

```html
<video controls preload="metadata" poster="/images/poster-budget-process.webp" class="w-full rounded-lg my-6 aspect-video">
  <source src="/videos/budget-process.webm" type="video/webm" />
  <source src="/videos/budget-process.mp4" type="video/mp4" />
  Twoja przeglądarka nie obsługuje wideo HTML5.
  <a href="/videos/budget-process.mp4">Pobierz wideo</a>.
</video>
<p class="text-sm text-gray-400 text-center -mt-4 mb-8">
  Pełny close kwietnia 2026 uruchomiony jako <code>/finances close 2026-04</code>.
  ~7 minut, 6 faz, 2 iteracje QA zostały w nagraniu — meta-przekaz: można korygować rozmową z agentem.
</p>
```

**Validation in `:validate`:** verify Puppeteer prerenderer doesn't hang on `<video>`; `preload="metadata"` should be sufficient since it doesn't fetch the full file.

---

## 8. Language & style notes

- **Polish base + English technical terms** — skill, rule, deterministic, idempotent, run-rate, accrual, close, EBITDA, MCP, fallback, learning loop, human-in-the-loop, hybrid, scope, substrate, orchestrator, subagent, persona, LLM, Python wrapper, prerenderer
- **First-person perspective** consistently (ja / my, gdzie my = ja + Przemek lub ja + agenty)
- **Short paragraphs** (2-4 zdania)
- **Bold on first introduction of key concept**, plus key numbers
- **No polonization** of technical terms (NIE: "skille" jako osobna rzecz, ale "skill" / "skille" akceptowalne jako naturalne polskie odmiany; NIE "regułowanie" — używaj "tworzenie reguł")
- **One-line emphatic punchlines** as standalone paragraphs, mirror pit-38 voice (e.g., *"Działa."*, *"To zmienia stake'a."*)
- **Self-deprecating asides** (1-2 razy w artykule) — humanizes
- **Italic** rare, only for verbatim quotes from talk / from manuals

---

## 9. SEO plan

**Primary keyword:** `system agentów AI` (Polish, head term)
**Secondary keywords:**
- `skills Claude Code` (long-tail, technical)
- `Claude Code architektura` (brand + topic)
- `MCP Python wrappers` (technical, low volume but high intent)
- `hybrid classification rules LLM` (English, niche)
- `pre-revenue startup zarządzanie` (Polish, business audience)

**H2 keyword placement:**
- "Pillar 1: Skills automatyzują procesy" — `skills`, `automatyzacja`
- "Pillar 2: Determinizm przez reguły" — `determinizm`, `reguły`, `klasyfikacja`
- "Pillar 3: Wspólny kontekst" — `kontekst`, `CLAUDE.md`, `MCP`

**Internal links (to verify in execute):**
- `/blog/pit-38-claude-code-case-study` (same architectural pattern, different domain)
- `/blog/skills-2-0-multi-agent-system-zarzadzanie-firma` (Skills 2.0 wider context)
- `/blog/spec-driven-seo-portfolio-qamera-ai` (similar workflow on portfolio)
- `/blog/opsx-workflow-strukturyzowana-praca-z-ai` (OpenSpec workflow)

**External links:**
- `https://docs.claude.com/en/docs/claude-code/overview`
- `https://modelcontextprotocol.io/`
- (no links to specific 200iqlabs/shared-skills repo unless URL is confirmed public; brief.md mentions it but verify)

**FAQ → AEO:** 6 questions, full sentences, answers lead with answer + 2-4 sentence support. FAQPage schema auto-generates.

---

## 10. Technical accuracy checklist

- [ ] Real numbers (revenue 347, costs 17 151, EBITDA −16 804, variance −23%) match source compilation §10 verbatim
- [ ] Rule examples (`gworkspace-via-gcp`, `gcp-infakt`) match source §15.2 verbatim
- [ ] Few-shot example (Byteplus) matches source §15.3 verbatim
- [ ] AUTO marker example matches source §15.7 (with truncation OK)
- [ ] Phase names + timings (PULL ~2min, CLASSIFY ~30s, REVIEW ~10-15min, ACCRUALS ~2min, COMMIT ~10-20min, REGENERATE ~30s) match source §7
- [ ] Python/MCP table matches brief.md
- [ ] No promises about features that don't exist (e.g., "auto-pull from Stripe" — that's roadmap, not present)
- [ ] No exposing sensitive data (no per-payee accruals, no transaction-level data, no `.env` references with values)
- [ ] Cross-link slugs verified to exist via `ls src/content/blog/`

---

## 11. Pre-execute prerequisites

Before running `/blog-article-writer:execute`, confirm:

- [ ] User signed off on title alternative #1 (or chose another)
- [ ] User signed off on slug alternative #1 (or chose another)
- [ ] `ffmpeg` is available locally for WebM transcode + poster extraction (else fall back to MP4-only + pick a poster manually)
- [ ] `public/videos/` directory may be created (no protections in place — should be fine)

---

## 12. Success criteria — PLAN phase

- [x] Plan artifact created with full structure
- [x] Next blog ID determined (id: 27)
- [x] Frontmatter completely specified
- [x] All main sections outlined with word targets
- [x] FAQ section planned (6 questions)
- [x] Code examples identified with language tags
- [x] Language guidelines noted (no polonization)
- [x] SEO keywords identified
- [x] Video deployment plan written
- [x] Image/diagram plan written
- [x] Technical accuracy checklist defined
- [x] Ready for execution phase pending user sign-off on title + slug
