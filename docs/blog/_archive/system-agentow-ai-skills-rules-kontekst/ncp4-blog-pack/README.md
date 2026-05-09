# Blog pack — Budget Tracker / Skill `finances`

Materiały do artykułu na bloga, oparte na prelekcji **"Jak 2 założycieli robi robotę całego zespołu"** (NoCode Poland #4, 2026-05-07). Flagship case study tej prelekcji to **system budżetowania 200IQ LABS** zbudowany w 2 dni od zera.

Wygenerowane: 2026-05-09. Źródło: `agentic-ai-system` (skill, openspec, kontekst, narzędzia) + `agentic-ai-private/slides/workspace/ncp4-2-zalozycieli` (prezentacja, assety).

---

## Co jest w pakiecie

### `01-skill/`
**`SKILL.md`** — definicja skilla `finances`. To jest "co agent wie i jak działa". Triggers, workflow, decyzje, integracje (Stripe Python, Revolut Python, infakt MCP). Najlepszy punkt startowy do bloga — opisuje cały paradygmat.

### `02-openspec/`
Pełny OpenSpec change `finances-budget-tracker` — **spec-driven development w akcji**.
- `proposal.md` — dlaczego i co
- `design.md` — jak (architektura, decyzje, alternatywy)
- `tasks.md` — checklist implementacji
- `specs/` — 4 capabilities (budget-plan, cash-flow, monthly-close, reporting)

To jest "spec, którą agent czyta zanim cokolwiek napisze". Materiał do osobnego rozdziału bloga o **OpenSpec przed kodem**.

### `03-context/`
Baza wiedzy systemu finansowego (read by agent every session):
- `README.md` — overview kontekstu
- `rules.yaml` — **30 reguł klasyfikacji** (deterministic), wytrenowane podczas pierwszego close. Showcase learning loopa.
- `_dashboard.md`, `_runway.md`, `_alerts.md` — auto-generowane raporty (markery `AUTO:START/END` → idempotent regeneration)
- `budget-2026.yaml`, `cash-flow-2026.yaml`, `caps.yaml`, `examples.yaml` — plan budżetowy + limity
- `monthly/2026-04.md` — **flagship narrative**: pełny raport zarządczy za kwiecień (pierwszy close), z mandatory sections (decisions, observations, plan correction)

### `04-presentation/`
- `brief.md` — pełen brief prelekcji z architekturą narracji (najbogatsze źródło dla bloga — wszystkie pointy, takeaways, real numbers)
- `draft.md` — finalny tekst prelekcji
- `assets/`:
  - **`budget-process.mp4`** — flagship video (close kwietnia od początku do końca, 6 faz, 2 iteracje QA)
  - `budget-showcase.gif` — alternatywa / fallback
  - `finances-close-process.png` (+ `.excalidraw`) — diagram 6 faz (PULL → CLASSIFY → REVIEW → ACCRUALS → COMMIT → REGENERATE)
  - `architecture.png` (+ `.excalidraw`) — architektura systemu (główny agent + skille + Python tools + MCP)
  - `screenshot-monthly-2026-04.png`, `screenshot-dashboard.png`, `screenshot-rules-sample.png` — screenshoty real outputs
  - `gstack-screenshot.png` — Garry Tan / gstack (kontekst evolution narrative)

### `05-tools/`
- `finances/README.md` — opis narzędzi finansowych
- `stripe/` — Python wrappery do Stripe API (showcase: "Python skrypt > MCP gdy mamy wybór")
- `revolut/` — Python wrappery do Revolut Business API

---

## Real numbers do wykorzystania w blogu

Z `monthly/2026-04.md` (pierwszy close, kwiecień 2026):
- Revenue: **347 PLN** (vs plan 598, **−42%**)
- Costs: **17 151 PLN** (vs plan 14 242, **+20%**)
- EBITDA: **−16 804 PLN** (vs plan −13 644, **−23% variance**)

Decyzje wynikłe z close-a:
- Meta off
- Cursor → Claude migration
- GCP plan recalibration 700 → 1700 PLN/mc

---

## Kluczowe takeaways (gotowe pointy do bloga)

1. **OpenSpec przed kodem** — 4 capabilities (budget-plan, cash-flow, monthly-close, reporting), potem implementacja. Agent czyta spec za każdym razem, nie zgaduje.
2. **Learning loop** — 30 reguł powstało podczas pierwszego close (`rules.yaml` 0→30). Każde [r]ule = nowa zasada deterministyczna. Następny miesiąc = mniej pracy.
3. **Mandatory narrative** — PHASE 5 wymaga, żeby człowiek napisał 3 sekcje narracji (decisions, observations, plan correction). System nie zamknie close-a z pustym blokiem. **Refleksja jest częścią procesu, nie opcją.**
4. **Hybryd Python/MCP** — *"Python skrypt zawsze, kiedy możemy. MCP, kiedy musimy."* Stripe/Revolut/Airtable = Python wrappers (zero overhead, deterministyczne); infakt = MCP (wymuszone bo API blokuje koszty); Qamera = MCP (eksponowane na zewnątrz).
5. **Idempotent regeneration** — markery `AUTO:START/END` w plikach kontekstowych — agent regeneruje deterministycznie, manualne sekcje są chronione.
6. **2 dni od zera do działającego systemu** — 1 maja 2026: zero raportu zarządczego. 3 maja: pierwszy close zrobiony, 30 reguł wytrenowanych, OpenSpec napisane, narrative dla zarządu.

---

## Czego NIE ma w pakiecie (świadomie)

- `context/finances/transactions/2026-*.yaml` — surowe transakcje bankowe (vendor names, amounts) — pomijam, sensitive
- `context/finances/accrued-liabilities.yaml` — zobowiązania per kontrahent — pomijam, sensitive
- `tools/revolut/privatecert.pem` — prywatny klucz Revolut — **NIGDY nie publikować**
- `.env`, klucze API — nie kopiowane

Jeśli któryś z tych plików chcesz w blogu (np. anonimizowany przykład transakcji) — dopowiedz, dorzucę z redakcją.

---

## Sugerowana struktura artykułu

1. **Hook** — "1 maja 2026, zero raportu zarządczego. 3 maja, działający system." (z `brief.md`, sekcja Backstory)
2. **Problem** — 2 founderów, brak działu finansów, ale potrzebny zarządczy raport miesięczny
3. **Architektura systemu** — diagram + opis (główny agent + skill `finances` + Python tools + infakt MCP + kontekst). Materiał: `01-skill/SKILL.md`, `architecture.png`
4. **Spec-driven development** — OpenSpec przed kodem. Materiał: `02-openspec/` (4 capabilities)
5. **6 faz monthly close** — diagram + opis każdej fazy. Materiał: `finances-close-process.png`, video `budget-process.mp4`
6. **Learning loop** — `rules.yaml` 0→30 reguł podczas pierwszego close. Materiał: `03-context/rules.yaml`, `screenshot-rules-sample.png`
7. **Mandatory narrative** — dlaczego refleksja jest częścią procesu. Materiał: `monthly/2026-04.md`, `screenshot-monthly-2026-04.png`
8. **Real numbers + decisions** — co wyszło, jakie decyzje. Materiał: `monthly/2026-04.md`
9. **Lessons learned** — 6 takeaways powyżej
10. **CTA** — repo `shared-skills` (open source skille CFO/finances szablon)
