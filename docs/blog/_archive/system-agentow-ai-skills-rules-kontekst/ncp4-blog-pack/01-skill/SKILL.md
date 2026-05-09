---
name: finances
description: "Pełny P&L tracker dla 200IQ LABS — planowanie budżetu i comiesięczny close.
  Triggers on '/finances', '/finances close', '/finances plan-bootstrap',
  '/finances plan-finalize', '/finances review', '/finances regenerate',
  'zamknij miesiąc', 'zaplanuj budżet', 'pokaż runway', 'pokaż dashboard finansowy'.
  Workflow 6-fazowy (PULL → CLASSIFY → REVIEW → ACCRUALS CHECK → COMMIT → REGENERATE)
  z hybrydową klasyfikacją rules + LLM oraz learning loop."
license: Apache-2.0
---

# /finances — Budget Plan & Monthly Close

System planowania budżetu i śledzenia jego egzekucji w `context/finances/`. Pełna dokumentacja konwencji: [`context/finances/README.md`](../../context/finances/README.md). Specyfikacja systemu: 4 capabilities w `openspec/specs/finances-*/spec.md`.

## Invocation

| Subkomenda | Co robi |
|------------|---------|
| `/finances close YYYY-MM` | Pełny 6-fazowy close miesiąca (PULL → CLASSIFY → REVIEW → ACCRUALS CHECK → COMMIT → REGENERATE) |
| `/finances plan-bootstrap YYYY` | Wygeneruj seed planu z run-rate dla nowego roku |
| `/finances plan-finalize YYYY` | Zmień `status: draft` → `active` po review każdej linii |
| `/finances review YYYY-MM` | Wróć do fazy REVIEW dla danego miesiąca (np. po skip) |
| `/finances regenerate` | Tylko PHASE 6 — odśwież `_dashboard.md`, `_alerts.md`, `_runway.md` |
| `/finances` (bez args) | Pokaż status systemu: ostatni close, status planu, pending alerty |

## Filozofia

- **P&L na accrual basis** (koszt = miesiąc obowiązku, nie miesiąc płatności). Cash flow oddzielnie.
- **Hybrydowa klasyfikacja**: rules-first (deterministycznie), LLM-fallback z learning loop.
- **Plan = żywy dokument**, korygowany po każdym close gdy run-rate się zmienia.
- **Manual first**, automate after pain — pierwsze 2-3 close'y manualnie.
- **Każda decyzja zarządcza ma trwałą pamięć** — `monthly/<mc>.md` jest obowiązkowy w PHASE 5.

## Workflow 6 faz close

### PHASE 1: PULL

Agreguje transakcje za zamykany miesiąc do `context/finances/transactions/<YYYY-MM>.yaml` (status: `draft`).

**Źródła i konkretne komendy:**

#### 1. Revolut (operacyjne wydatki + transfery)

Skrypt: `shared-skills/skills/cfo/scripts/get_transactions.py`. Używa OAuth refresh tokena z `tools/revolut/.env` (autoryzacja jednorazowa przez `tools/revolut/authorize.py`, refresh ważny 90 dni).

```bash
python shared-skills/skills/cfo/scripts/get_transactions.py \
  --from YYYY-MM-01 --to YYYY-MM-DD > /tmp/revolut-YYYY-MM.json
```

Output: JSON array transakcji (state, type, amount, currency, counterparty, leg.description, created_at, etc.). Filtruj po `state=completed`. Pomiń `type=topup` jeśli to wewnętrzne zasilenia (financing, nie koszty). Pomiń też `type=exchange` (księgowane jako neutralne FX, wpływ tylko na FX fee).

#### 2. Stripe (revenue)

Skrypt: `shared-skills/skills/cfo/scripts/get_revenue.py`. Używa `STRIPE_SECRET_KEY` z `tools/stripe/.env`.

```bash
python shared-skills/skills/cfo/scripts/get_revenue.py \
  --from YYYY-MM-01 --to YYYY-MM-DD --status paid > /tmp/stripe-YYYY-MM.json
```

Output: JSON z summary + invoice list (amount_paid, currency, customer, period). Klasyfikacja per typ:
- `subscription_cycle` → `revenue/subscriptions`
- `manual` lub `subscription_create` → `revenue/credits` (lub managed, zależy od opisu)

Dodatkowo `get_subscriptions.py` daje aktualną listę aktywnych subów (dla unit economics, nie dla close'u).

#### 3. inFakt (faktury kosztowe + UoD)

MCP: `mcp__claude_ai_inFakt__infakt_get_costs_list` (i `_get_cost` dla szczegółów). Filtry: `gross_invoice_date_gte`, `gross_invoice_date_lte` na okres miesiąca.

Wywołanie przez Claude w trakcie sesji (nie subprocess — MCP). Output: lista kosztów z payee, amount, VAT, kategoria z inFakt.

**Mapowanie do P&L:**
- `Czynsz` / `Najem` → `opex/office`
- `Usługi księgowe` (inFakt sam o sobie) → `opex/admin`
- `Usługi prawne` (Creativa, Smolski) → `opex/legal`
- `Wynagrodzenia umowy o dzieło` → `opex/people` (z accruals check w PHASE 4)
- Reszta → propozycja LLM w CLASSIFY

#### 4. Tech-stack SaaS (recurring)

Agregat z `context/operations/tech-stack/_dashboard.md` — total fixed monthly minus inFakt. Na ten moment: **1633 PLN/mc**. Dodawane jako **jedna agregowana linia** (`category: opex/saas`, `source: tech-stack`) zamiast per-tool transakcji (które i tak są w Revolut).

⚠️ Uwaga deduplikacji: większość SaaS jest opłacana z Revolut → pojawi się też w `get_transactions.py`. Klasyfikator MUSI rozpoznać to i NIE liczyć dwa razy. Reguły w `rules.yaml` powinny mieć kategorię `opex/saas` dla znanych merchantów (Vercel, Cursor, Workspace, etc.) — wtedy agregacja z tech-stack staje się tylko **sanity-check** (czy suma actuals z Revolut na opex/saas zgadza się z 1633 ±10%).

**Workflow PHASE 1:**

1. Pull Revolut → `/tmp/revolut-<mc>.json`
2. Pull Stripe → `/tmp/stripe-<mc>.json`
3. Pull inFakt costs (MCP) → trzymaj w pamięci sesji
4. Agreguj do `context/finances/transactions/<mc>.yaml` (status: `draft`):
   - Każda transakcja: `id` (np. `rev-<source_id>` lub `stripe-<invoice_id>`), `date`, `amount`, `currency` (PLN convert if needed), `memo`, `source`, `source_id`, `counterparty`
   - Brak na początku: `category`, `unit`, `classified_by` (uzupełni PHASE 2)
5. Status pliku: `draft` → ready do PHASE 2

**Idempotencja:** restart deduplikuje po `(source, source_id)`. Wcześniej zatwierdzone klasyfikacje zachowane (merge-not-overwrite).

**Manual fallback:** jeśli któryś source nie działa (np. expired token), faza raportuje brak i pozwala dopisać ręcznie z CSV/dashboard. NIE blokuje całego close'u.

### PHASE 2: CLASSIFY

Dwustopniowo:
1. **Rules pattern matching** (`rules.yaml`) — deterministyczne, szybkie, darmowe
2. **LLM fallback** dla transakcji bez pasującej reguły — z few-shot z `examples.yaml`

Każda LLM-classification dostaje pole `reasoning` (widoczne dla użytkownika w PHASE 3).

**Konflikt reguł:** gdy 2+ reguły matchują tę samą transakcję, faza raportuje do REVIEW z listą — user musi zdecydować priorytet lub edytować jedną.

### PHASE 3: REVIEW (interactive)

Pętla per LLM-classified transakcja. Cztery opcje:

| Opcja | Co robi |
|-------|---------|
| `[a]ccept` | Zatwierdza propozycję LLM |
| `[c]hange` | Zmień ręcznie kategorię/unit |
| `[r]ule` | Akceptuje **I** tworzy nową regułę dla podobnych w `rules.yaml` |
| `[s]kip` | Zostawia jako `classified_by: pending`, wraca w następnym close |

**Learning loop:** opcja `[r]ule` jest sercem systemu. Każda korekta-z-regułą = w przyszłości deterministyczne, mniej pracy.

### PHASE 4: ACCRUALS CHECK

Porównuje classified transactions z `accrued-liabilities.yaml`. Dopasowanie po `(category, amount, payee)`. Match → status `pending` → `paid` z datą i cross-ref do transakcji.

**Multi-match:** gdy 1 transakcja może pasować do wielu pending accruals (np. wypłata 4000 do payee z 3 zaległymi UoD), faza prosi o wskazanie który accrual.

**Brak match nie blokuje** close — tylko raportuje "<N> pending accruals nie znalazły płatności w tym miesiącu" do `_alerts.md`.

### PHASE 5: COMMIT

Otwiera `monthly/<YYYY-MM>.md` w edytorze. Użytkownik MUSI uzupełnić **obowiązkowy** komentarz zarządczy:
- Co się działo niespodziewanego (vs plan)
- Decyzje podjęte w trakcie miesiąca
- Plan na następny miesiąc / korekta planu jeśli potrzebna

**Pusty narrative blokuje close** — system ponownie otwiera plik. To jest decyzyjna pamięć firmy.

### PHASE 6: REGENERATE

Odświeża 3 dashboardy:
- `_dashboard.md` — 5 sekcji (cash/runway, P&L mc, P&L YTD, forecast, alerts)
- `_alerts.md` — caps przekroczenia, pending klasyfikacje, accruals bez płatności
- `_runway.md` — cash position over time z formulą `start + revenue − costs + financing − accruals_payments`

**Markery `<!-- AUTO:START -->` / `<!-- AUTO:END -->`** — treść poza markerami zachowana.

## Hybrydowa klasyfikacja — szczegóły

### Rules (deterministyczne)

Format reguły w `rules.yaml`:
```yaml
rules:
  - id: meta-ads
    pattern:
      memo: "META PLATFORMS"
      source: revolut
    classify:
      category: opex/marketing
      unit: qamera
    note: "Wszystkie wydatki na Meta Ads to marketing Qamery"
    created_at: 2026-06-01
```

Aplikowane w PHASE 2 BEFORE LLM. Bardziej specyficzne reguły wygrywają (więcej pól w `pattern`).

### LLM fallback (few-shot)

Gdy żadna reguła nie matchuje:
1. System wczytuje `examples.yaml` jako few-shot prompt
2. LLM proponuje `category`, `unit`, `reasoning`
3. Wynik trafia do PHASE 3 REVIEW

LLM wywoływany TYLKO dla nieznanych transakcji. Z czasem (rules rosną) — coraz rzadziej.

### Learning loop

Każda iteracja zwiększa pokrycie regułami:

```
Miesiąc 1: 60% rules, 40% LLM (dużo nowych transakcji)
Miesiąc 2: 80% rules, 20% LLM (większość już znana)
Miesiąc 4: 95% rules, 5% LLM (tylko edge case'e)
Miesiąc 6+: 99% rules, 1% LLM (stabilizacja)
```

System konweruje do deterministyczności — finanse stają się audytowalne ("dlaczego ta transakcja wpadła w X" → "bo reguła #14").

## Pliki czytane / pisane przez subkomendy

| Subkomenda | Czyta | Pisze |
|------------|-------|-------|
| `close YYYY-MM` | wszystkie pliki | `transactions/<mc>.yaml`, `monthly/<mc>.md`, `rules.yaml`, `accrued-liabilities.yaml`, `_dashboard.md`, `_alerts.md`, `_runway.md` |
| `plan-bootstrap YYYY` | `tech-stack/_dashboard.md`, ostatnie 2-3 `transactions/*.yaml` | `budget-<rok>.yaml` (status: draft) |
| `plan-finalize YYYY` | `budget-<rok>.yaml` | `budget-<rok>.yaml` (status: active) |
| `review YYYY-MM` | `transactions/<mc>.yaml`, `rules.yaml`, `examples.yaml` | `transactions/<mc>.yaml`, `rules.yaml` |
| `regenerate` | wszystkie pliki yaml + `monthly/*.md` | `_dashboard.md`, `_alerts.md`, `_runway.md` |

## Prerequisites

1. **Struktura plików** — `context/finances/` musi istnieć z plikami yaml. Jeśli brakuje: prowadź użytkownika przez bootstrap.
2. **Status planu** — `budget-<rok>.yaml` musi mieć `status: active` żeby plan vs actuals miał sens. Jeśli `draft`: zaproponuj `plan-finalize`.
3. **API credentials** (gdy auto-pull dostępny) — `.env` w `tools/finances/` z kluczami Stripe, Revolut OAuth, inFakt MCP. Pierwsze close'y nie wymagają — manual eksport CSV.

## Ograniczenia (V1)

- **Brak mid-month polling** — caps i alerty są post-close
- **Brak multi-currency** w P&L — wszystko PLN; wpisuj po kursie z dnia płatności (manual)
- **Brak scenariuszy** alternatywnych planu (base/aggressive/lean) — jeden plan
- **Brak API integracji** w pierwszych close'ach — manual eksport CSV/wpis ręczny

Te ograniczenia są świadome (manual first). Future iterations po 2-3 udanych manualnych close'ach.

## Cross-references

- **Konwencje i schemas:** [`context/finances/README.md`](../../context/finances/README.md)
- **Specyfikacja:** `openspec/specs/finances-{budget-plan,cash-flow,monthly-close,reporting}/spec.md`
- **Source of truth dla SaaS recurring:** [`context/operations/tech-stack/_dashboard.md`](../../context/operations/tech-stack/_dashboard.md)
- **Overview/snapshot:** [`context/finances.md`](../../context/finances.md) (linkuje tutaj)
- **Komplementarne skille:** CFO (analizy), tax-advisor (CIT/VAT)
