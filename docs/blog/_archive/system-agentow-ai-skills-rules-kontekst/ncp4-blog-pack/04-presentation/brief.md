---
slug: "ncp4-2-zalozycieli"
title: "Jak 2 założycieli robi robotę całego zespołu"
context: "plsoft/projects/NOCODE_POLAND_4"
audience: "Praktycy automatyzacji, citizen developerzy, osoby chcące wdrożyć AI u siebie ale nie wiedzące jak zacząć (NoCode Poland #4, ~600 uczestników, Sala Warsztatowa)"
format: "talk"
duration: "30 minutes"
language: "pl"
theme: "plsoft-dark"
created: "2026-05-01"
status: built
---

# Jak 2 założycieli robi robotę całego zespołu

## Goal

Pokazać publiczności, że system agentów AI może realnie zastąpić działy (CFO, marketing, prawo, PM) w małym startupie — i dać im konkretne narzędzie żeby zacząć budować swój własny system **tego samego dnia po wyjściu z sali** (open-source repo `shared-skills`).

## Slajd 0 — Title slide (przed memem, ~5s) ✨ NEW

Statyczny slajd otwierający (zanim wystąpienie ruszy). Marp `<!-- _class: lead -->`.

**Zawartość:**
- **Tytuł:** *"Jak 2 założycieli robi robotę całego zespołu"*
- **Podtytuł:** *"System agentów AI w 200IQ LABS"*
- **Portret Pawła** (`sources/portrait-pawel.jpg`) — circle mask, rozmiar ~200px, prawy/lewy róg
- **Logo Qamera AI** (`sources/logo_white.png`) — mały, dolny róg lub pod tytułem
- **Stopka:** *"NoCode Poland #4  •  IKM Gdańsk  •  2026-05-07"*

Slajd wisi na ekranie zanim Paweł zacznie mówić — pełni rolę "tu jesteśmy" gdy publiczność siada. Po starcie prelekcji → kliknięcie → mem.

---

## Cold open + przedstawienie (łącznie ~2 min, max)

**Slajd 1 — mem "Śpieszmy się kochać technologię" (~30-45s)**

Slajd-jako-mem (czarne tło, jeden obraz + caption). Mem mówi sam za siebie — Paweł dorzuca jedno zdanie pointujące:

> "Pisałem to miesiąc temu — i już bałem się, że będzie nieaktualne. Wnioski: nie kopiujcie setupu, wyciągajcie zasady."

(Bez długiego framingu — mem + jedno zdanie + dalej.)

**Koncepcja mema (zatwierdzona): Distracted Boyfriend**

Labele na obrazku — **koncepty/paradygmaty, NIE wersje modeli**:

- **Obecna dziewczyna (z wyrzutem):** *No-code automations*
- **Nowa dziewczyna (mijana):** *AI agents*
- **Boyfriend (odwracający się):** *Ja / my* (opcjonalnie bez podpisu)

**Caption pod memem:**
> *"Śpieszmy się kochać technologię — tak szybko odchodzi."*

**Slajd 2 — przedstawienie (~30-45s, dwa zdania)**

> "Paweł Lipowczan, CTO 200IQ LABS i twórca Qamera AI. 17 lat w IT — od .NET-a, przez automatyzację, do agentów AI, których codziennie używam żeby ogarniać firmę w dwójkę."

## Hook (po przedstawieniu się)

"Prowadzę startup w dwójkę. Nie mamy działu finansów, marketingu, prawnego ani product managementu. A mimo to budujemy SaaS, świadczymy consulting i rozwijamy biznes. Zamiast rekrutować — zbudowaliśmy system agentów AI, który przejął te role."

### Evolution narrative — to nie nowa koncepcja, kolejna iteracja

> "Koncepcja agentów grających role specjalistów to **nie nowość** — pracuję z tym od lat. Jeszcze w **Automation House** (Franciszek Georgiew i ekipa) budowaliśmy 'board of advisors' — asystentów AI z konkretnymi rolami. Bez połączeń do zewnętrznych narzędzi, czysta logika promptów, ale koncepcja **tożsama**: każdy asystent = rola, każda rola = cel. Dzisiaj **Garry Tan** (CEO YC) wypuścił **gstack** — 23 agenty grające role CEO, Eng Manager, Designer, QA, ~89.4k gwiazdek na GitHubie. To dokładnie ten sam wzorzec — tylko z lepszymi narzędziami. To, co pokażę za chwilę, to **moja kolejna iteracja** — z lekcjami zebranymi po drodze."

**Slajd:** prosta oś czasu / 3 pudełka:
- **Lata wcześniej:** Automation House — board of advisors (assistants, prompt-only)
- **2026:** Garry Tan / gstack — 23 agenty (devops, ~89.4k ⭐)
- **Dziś u nas:** shared-skills — agenty dla biznesu (CFO, Marketing, Legal, Tax) z dedykowanymi Python skryptami

## Key takeaway

Context engineering > prompt engineering. Architektura systemu (główny agent + subagenty + skille + baza wiedzy + **dedykowane Python skrypty**) jest ważniejsza niż "jaki prompt wpisać do ChatGPT". Repo `shared-skills` jest gotowym startem.

### Drugi takeaway — Python skrypty vs MCP (hybrydowa architektura)

**Reguła:** *Python skrypt zawsze, kiedy możemy. MCP, kiedy musimy.*

| Integracja | Podejście | Dlaczego |
|---|---|---|
| **Stripe** (subskrypcje Qamery) | Python (`tools/stripe/get_revenue.py`) | Pełne API → własny wrapper, deterministyczny, zero overhead |
| **Revolut** (transakcje firmowe) | Python (`tools/revolut/get_transactions.py`) | Tak samo — pełne API, własny wrapper |
| **Airtable** (CRM) | Python (`tools/airtable/*.py`) | Pełne API, własny wrapper |
| **infakt** (księgowość) | **MCP** | API blokuje koszty gdy biuro księgowe aktywne — MCP **wymuszone** |
| **Qamera AI** (własny produkt) | **MCP** | Ekspozycja na zewnątrz — to my wystawiamy MCP |

**Dlaczego Python skrypt > MCP, gdy mamy wybór:**
1. **Oszczędność tokenów** — MCP ładuje opisy do kontekstu, skrypt = zero overhead
2. **Determinizm** — skrypt robi dokładnie to, co napisano
3. **Trywialne tworzenie** — "agent, potrzebuję skrypt który X" → agent generuje
4. **Pełna kontrola** — kod w repo, w wersji, czytelny

## Structure (rough outline)

| Czas | Blok | Opis |
|------|------|------|
| 0-2 min | **Cold open + przedstawienie** | Mem + 2 zdania o sobie |
| 2-7 min | **Hook + evolution narrative** | "2 founderów, 0 pracowników" + Automation House → gstack → my |
| 7-13 min | **Architektura** | Główny agent → subagenty → skille → kontekst → **hybryda Python/MCP** |
| 13-22 min | **🌟 Case study: Budget Tracker (video)** | Pokaz nagranego close kwietnia (~6-8 min video) z lektorem live + diagram 6 faz po demo + lessons (~1 min) |
| 22-26 min | **Jak zacząć u siebie** | (A) Workflow `/ingest` + `/slides` (~2 min) + (B) **Wizytówki — krótko** (~1 min, 1-2 slajdy) + (C) Airtable sync wzmianka (~30s) + QR shared-skills (~30s) |
| 26-30 min | **Qamera bonus + CTA** | Logo + gif demo + 2 UI (before/after) + **one-pager LAVEL z numerami** + QR Qamera (~1.5 min) → soft hot take + CTA + Q&A (~2.5 min) |

---

## 🌟 Case study: Budget Tracker 200IQ LABS (recorded video) — szczegóły

**Status: GOTOWE** — Paweł nagrał już cały proces close kwietnia. Pliki:
- `C:\Users\pawel\Downloads\budget_process.mp4` (główne demo, lektor live w sali)
- `C:\Users\pawel\Downloads\budget_showcase.gif` (alternatywa / fallback)

**Dlaczego to flagship case study (a nie planowane demo CFO live):**
- Zero ryzyka on-stage (nagrane vs live)
- Pokazuje **WSZYSTKIE 4 źródła** w jednym demo: Stripe Python + Revolut Python + infakt MCP + tech-stack lokalny kontekst
- Demonstruje koncepty: hybryd Python/MCP, OpenSpec, learning loop (rules.yaml), accrual vs cash, accrued liabilities, idempotent regeneration
- Real numbers, real decisions, real value — *"2 dni od zera do działającego systemu zarządczego"*

### Backstory (1 zdanie hook):
> "1 maja 2026. Skończył się kwiecień. Zero raportu zarządczego, zero kontroli kosztów, zero spec-a. **2 dni później** mamy działający system: pierwszy close zrobiony, 30 reguł klasyfikacji wytrenowanych, OpenSpec napisane, narrative dla zarządu w `monthly/2026-04.md`. Pokażę nagranie."

### Format prezentacji video

**Wariant A (rekomendowany):** odtwarzamy CAŁOŚĆ video, Paweł komentuje **na żywo** (lektor) — wskazuje co się dzieje w każdej z 6 faz. Video ma w sobie 2 iteracje QA + decyzje korekcyjne — to **świadomie zostaje**, bo jest *meta-przekazem*: *"można w trakcie korygować rzeczy rozmową z agentem, to nie jest skrypt jednoprzejściowy"*.

**Po video — slajd-podsumowanie z diagramem 6 faz** (excalidraw, `sources/finances-close-process.png`). Paweł szybko przebiega przez fazy żeby publiczność miała w głowie strukturę:

```
PHASE 1: PULL          (~2 min)   ← Revolut + Stripe Python + infakt MCP + tech-stack
PHASE 2: CLASSIFY      (~30s)     ← rules.yaml (deterministic) → LLM fallback
PHASE 3: REVIEW        (~10-15min interactive) → [a/c/r/s] learning loop ✨
PHASE 4: ACCRUALS CHECK (~2 min)
PHASE 5: COMMIT        (~10-20 min) → mandatory narrative blokuje close ⚠️
PHASE 6: REGENERATE    (~30s)      → 3 dashboards (P&L, cash flow, financing)
```

### Punktem ciężkości narracji (~1 min lessons po diagramie)

3 takeaways do zapamiętania:

1. **OpenSpec przed kodem** — "spec dla 4 capabilities (budget-plan, cash-flow, monthly-close, reporting), potem implementacja. Agent czyta spec za każdym razem, nie zgaduje."
2. **Learning loop** — "30 reguł powstało w trakcie pierwszego close (`rules.yaml` 0→30). Każde [r]ule = nowa zasada deterministyczna. Następny miesiąc = mniej pracy."
3. **Mandatory narrative** — "PHASE 5 wymaga że człowiek napisze 3 sekcje narracji (decisions, observations, plan correction). System nie zamknie close-a z pustym blokiem. **Refleksja jest częścią procesu, nie opcją.**"

### Real outputs do pokazania na slajdach po video

- `monthly/2026-04.md` — pełny raport zarządczy (screenshot pierwszej strony lub mały scroll)
- `_dashboard.md` — wygenerowany dashboard (screenshot)
- `rules.yaml` diff 0→30 (screenshot diff lub VS Code split)
- Krótkie real numbers: revenue **347 PLN** (vs plan 598, **−42%**), costs **17151 PLN** (vs plan 14242, **+20%**), EBITDA **−16804** vs plan **−13644** (**−23% variance**)
- Decyzje wynikłe z close-a: Meta off, Cursor → Claude migration, GCP plan recalibration 700 → 1700 PLN/mc

### Drugi poziom przekazu (architecture lesson)

- ✨ **Hybryd Python/MCP w akcji** — 3 z 4 źródeł = Python, infakt = MCP (wymuszone). Realna decyzja architektoniczna, nie dogmat.
- ✨ **Idempotency** (markery `AUTO:START/END`) — agent regeneruje deterministycznie, manualne sekcje są chronione.
- ✨ **Spec-driven development** — OpenSpec daje ramę, agent nie improwizuje.
- ✨ **Człowiek w pętli, ale tam gdzie ma sens** — REVIEW (klasyfikacja) i COMMIT (narrative). Reszta automatyczna.

---

## Workflow demo (slot 22-26 min) — komendy + krótkie case studies

### Część A — codzienny workflow (~2-2.5 min)

**A1 — `/ingest` (video + diagram, ~1.5 min):**
- Video `sources/ingest-process.mp4` (~30s, lektor live) — realny case: podsumowanie spotkania + pomysły na delivery dla kontaktu zainteresowanego usługami PLSoft
- Diagram 6 faz `sources/ingest-workflow.png` (~15-20s) — strukturalne podsumowanie po video
- Punchline: *"To nie demo. To rzecz z dziś rano. Codzienna rutyna."*

**A2 — `/slides` (~30-45s):**
- Wzmianka że TA prezentacja powstała tym samym workflow (`/slides:new`, `/slides:draft`, `/slides:build --html`)
- Opcjonalnie screenshot z workspace `ncp4-2-zalozycieli/` — meta-twist eat-your-own-dogfood

**Cel:** pokazać że to nie jest demo-tylko-dla-demo, ale codzienny workflow — i że ten sam workflow właśnie tworzy slajdy które publiczność ogląda.

### Część B — case study wizytówki (1-2 slajdy, ~1 min) ✨ NAMACALNY USE CASE

**Skrócone do minimum** (po pivocie na budget tracker jako flagship). Forma: **2 slajdy, 1 minuta**:

**Slajd 1:** preview wizytówki (`business_card_pawel_preview.png`) + jedno zdanie hook:
> "Środa. Fotograf wydrukuje wizytówki, potrzebuje plików. **Kilkanaście minut później** ma 2 wzory (mój + Przemka), gotowe do druku. 159 linii Pythona."

**Slajd 2:** punchline + meta-lesson:
> "Trigger biznesowy → execution w godzinach. Dodanie kolejnego foundera = jeden wpis w liście, regeneracja w 2 sekundy. **To nie demo. To była realna potrzeba w środę.**"

(Filozofia "kod > narzędzia graficzne" dla powtarzalnych assetów brandu — bez rozwijania, publiczność łapie to z 2 zdań.)

**Pliki:** `business_card_pawel_preview.png` + `business_card_przemek_preview.png` (już skopiowane do `sources/`).

## Outro 26-30 min — Qamera bonus + soft hot take + CTA + Q&A ✨ NEW

### Sekwencja (4 min total)

```
26:00-26:55  Qamera bonus     [Q1 logo → Q2 gif demo → Q3 UI input → Q4 UI output → Q5 one-pager LAVEL → Q6 QR Qamera]
26:55-28:30  Soft hot take + wyzwanie    [1 slajd, mocna pointa]
28:30-29:15  Slajd CTA / linki   [QR shared-skills + foyer]
29:15-30:00  Q&A buffer       [otwarcie na pytania, pointer na networking po prelekcji]
```

### Q5 — one-pager LAVEL ✨ KILLER NUMBERS (najmocniejszy slajd outro)

Po before/after UI screen, przed QR — slajd z **REAL NUMBERS** z one-pagera PrestaShop:

> **LAVEL — 1 kampania**
>
> 💸 **549 PLN vs 33 000 PLN** *(−98% kosztu produkcji)*
> 📈 **+42% ROAS  •  +34% CTR**
> ⚡ **25× szybciej do rynku**
>
> *"To nie marketing-deck, to faktyczny case study klienta."*

**Dlaczego najmocniejszy:** numery zostają w głowie mocniej niż screen UI. Publiczność wychodzi pamiętając "549 zamiast 33 tys" — to jest "zaczepka pamięci" na networking.

**Źródło:** `C:\PROJEKTY\agentic-ai-system\context\projects\ECOMMERCE_WARSAW_2026\deliverables\onepager-prestashop.md` (Section 4)

### Soft hot take + wyzwanie (slajd)

> *"To działa już dziś — bez magii, bez rocket-science. **Wyzwanie**: zaautomatyzuj **jedną** rzecz w swojej firmie do końca tygodnia. Daj znać na LinkedIn jak poszło — chętnie pogadamy."*

Lektor: 30 sek, spokojnie, na zakończenie. Nie wojuje z nikim ("większość firm przestanie zatrudniać"), tylko zachęca do działania.

### Slajd CTA / linki (1 slajd, 1 QR)

- QR shared-skills (centrum slajdu, duży) — `sources/qr-shared-skills.png`
- Tekst pod QR: *"github.com/200iqlabs/shared-skills"*
- Stopka mała: *"Pawel Lipowczan • LinkedIn: lipowczan • foyer 18:00-20:00"*

(QR Qamera już był w Q6 — tu zostaje tylko shared-skills, zgodnie z zasadą 1 QR/slajd.)

---

### Część C — case study Airtable sync (~30s wzmianka, 1 slajd)

> "Dla nocode publiki: spinamy Airtable jako CRM z lokalnym kontekstem MD przez **bidirectional sync z three-way merge**. Zero ręcznych konfliktów. 600 linii Pythona. Ten sam wzorzec działa dla Notion, ClickUp, HubSpot, Pipedrive."

**Slajd:** prosty diagram (Airtable ↔ Region ↔ Local MD) lub fragment MD z markerem `<!-- AIRTABLE:START -->`.

---

## Sources

Główne źródło: `context/plsoft/projects/NOCODE_POLAND_4/` (project.md + data/).

Materiały do `sources/` przed `/slides:draft`:
- `meme-distracted-boyfriend.png` ✅
- `architecture.png` (z `architecture.excalidraw`) ✅
- `qr-shared-skills.png` ✅
- `business_card_pawel_preview.png` + `business_card_przemek_preview.png` ✅
- `logo_white.{png,svg}` + `logo_dark.{png,svg}` ✅
- `budget_process.mp4` (skopiować z `~/Downloads/`) — flagship video
- `finances-close-process.excalidraw` + PNG export — diagram 6 faz (do utworzenia)
- screenshoty: `monthly/2026-04.md`, `_dashboard.md`, `rules.yaml` diff 0→30
- screenshoty workflow `/ingest`
- portrait Pawła (z bio eventu)
- screenshot gstack README

## Resolved (2026-05-04 — runda czwarta — PIVOT na budget tracker)

- ✅ **Live demo CFO OUT** — zastąpione nagranym video close kwietnia (`budget_process.mp4`). Zero ryzyka on-stage, mocniejsza treść.
- ✅ **Budget tracker flagship** — sekcja 13-22 min (~9 min) = video + diagram 6 faz + lessons.
- ✅ **Wizytówki skrócone** do 1-2 slajdów / ~1 min (z poprzednich ~2 min). Budget tracker zabiera scenę.
- ✅ **Format video:** odtwarzamy całość, Paweł komentuje na żywo (lektor). 2 iteracje QA w nagraniu zostają — meta-przekaz "można korygować rozmową z agentem".
- ✅ **Diagram 6 faz** w Excalidraw — pokazany **po video** jako podsumowanie strukturalne.
- ✅ **Materiały do screenshotów:** `monthly/2026-04.md`, `_dashboard.md`, `rules.yaml` diff. Real numbers do mention: revenue 347 PLN, costs 17151 PLN, EBITDA −16804 (−23% vs plan).

## Resolved (poprzednie rundy — skondensowane)

- ✅ Mem Distracted Boyfriend z labelami No-code automations / AI agents / Ja
- ✅ Evolution narrative: Automation House (Franciszek Georgiew) → gstack (89.4k ⭐) → my
- ✅ Hybryd Python/MCP — Python default, MCP gdy wymuszone (infakt) lub eksponowane (Qamera)
- ✅ Stripe / Revolut / Airtable = Python wrappers; infakt = MCP; Qamera MCP istnieje (do bonus 25-30 min)
- ✅ Logo Qamery: `outputs/brand/logo_{white,dark}.{png,svg}` — skopiowane do `sources/`
- ✅ Brak osobnych logo dla shared-skills i 200IQ LABS (nazwy tekstowe + parent brand Qamera)

## Open questions (pozostałe)

1. **Diagram architektury (`architecture.excalidraw`)** — wciąż wymaga edycji ręcznej:
   - Usunąć "Stripe MCP" zieloną pigułkę (Stripe = Python teraz)
   - Dodać blok "Python tools" jako rozszerzenie skilla CFO (Stripe, Revolut, Airtable, tech-stack regen, brand assets)
   - Dodać "MCP zewnętrzne" jako osobny mniejszy blok (infakt, Qamera) — pokazać hybrydę

2. **Budget tracker video** — czy chcemy pokazać CAŁOŚĆ czy edytowany cut?
   - **Decyzja Pawła (2026-05-04):** CAŁOŚĆ z lektorem live. 2 iteracje QA zostają (meta-przekaz: korekta rozmową z agentem).
   - **Risk:** czas video — jeśli >8 min, zjada blok. Do zmierzenia długości pliku przed eventem.
   - **Mitigation:** mieć w kieszeni opcję skipowania fragmentów (timestamps) gdyby tempo siadło.

3. **Skopiowanie video** do `sources/` — Paweł kopiuje `budget_process.mp4` z `~/Downloads/` do `sources/budget-process.mp4`. Marp **nie embeduje video do PDF** — w PDF będzie placeholder, video uruchamiamy z osobnego okna (lub HTML build).

4. **Render HTML zamiast PDF dla video** — `/slides:build --html` da plik HTML z embedowanym video. Decyzja: render OBA (PDF jako backup, HTML jako primary do prezentacji).
