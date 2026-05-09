# 200IQ LABS — Finances System

> **Last updated:** 2026-05-04
> **Review cycle:** Monthly (po każdym close)

System planowania budżetu i śledzenia jego egzekucji w 200IQ LABS PSA. Pełny P&L tracker dla pre-revenue spółki z produktem Qamera AI.

**Entry point:** [`_dashboard.md`](_dashboard.md) — w 30 sekund pokazuje czy biznes idzie zgodnie z planem.

## Filozofia

- **P&L na accrual basis** (koszt = kiedy powstał obowiązek, nie kiedy płatność). Cash flow oddzielnie.
- **Plan = żywy dokument**, korygowany po każdym close gdy run-rate się zmienia.
- **Hybrydowa klasyfikacja**: rules-first, LLM-fallback. Każda korekta człowieka tworzy regułę. System konweruje do deterministyczności w czasie.
- **Manual first**, automate after pain. Pierwsze 2-3 close'y manualnie — wtedy wiemy CO automatyzować.
- **Upraszczać co się da bez utraty pełnego obrazu** — jeśli linia/wymiar nie zmienia decyzji, wycinamy.

## Struktura plików

```
context/finances/
├── README.md                  # Ten plik
│
├── budget-2026.yaml           # Plan P&L na rok (accrual basis)
├── cash-flow-2026.yaml        # Financing events + accruals payments
├── accrued-liabilities.yaml   # Zaległe zobowiązania (np. UoD)
├── caps.yaml                  # Limity per kategoria z tolerance band
├── rules.yaml                 # Reguły klasyfikacji (rośnie z time)
├── examples.yaml              # Few-shot examples dla LLM fallback
│
├── transactions/
│   ├── 2026-05.yaml           # Raw + classified, 1 plik/miesiąc
│   └── ...
│
├── monthly/
│   ├── 2026-05.md             # Komentarz zarządczy, decyzje, wnioski
│   └── ...
│
├── _dashboard.md              # AUTO: 5 sekcji (cash → P&L mc → YTD → forecast → alerts)
├── _alerts.md                 # AUTO: caps przekroczenia, pending klasyfikacje
└── _runway.md                 # AUTO: cash position over time
```

## Cele systemu

1. **Forecast tracking (A)** — runway monitoring: ile zostało miesięcy do zera
2. **Budget caps (B)** — limity per variable category z tolerance band
3. **Decision support (C)** — świadome tak/nie dla nowych wydatków

## P&L vs Cash flow vs Financing — rozdzielenie

| Pojęcie | Plik | Co tu trafia |
|---------|------|--------------|
| **P&L (accrual)** | `budget-2026.yaml`, `transactions/<mc>.yaml` | Revenue, COGS, OPEX — koszt w miesiącu obowiązku |
| **Cash flow** | `cash-flow-2026.yaml`, `_runway.md` | Timing płatności, financing inflows, accruals payments |
| **Accrued liabilities** | `accrued-liabilities.yaml` | Zobowiązania powstałe ale nieopłacone |
| **Financing** | `cash-flow-2026.yaml` (sekcja `financing`) | Emisja akcji, pożyczki wspólników — NIE revenue |

**Ważne:** Emisja akcji 100k PLN nie jest revenue. To zmiana struktury kapitału. EBITDA jej nie odzwierciedla, cash position — tak.

## Kategorie P&L

```
REVENUE
  ├─ revenue/subscriptions       (MRR Qamera)
  ├─ revenue/credits             (pay-per-use)
  └─ revenue/managed             (managed service per product)

COGS
  ├─ cogs/ai-generation          (Byteplus, Pollo, Replicate, Kling)
  ├─ cogs/hosting                (Cloudflare, Vercel, Hetzner — produktowe)
  └─ cogs/payment-fees           (Stripe fees)

OPEX
  ├─ opex/people                 (UoD Paweł + Przemek + ew. kontraktorzy)
  ├─ opex/marketing              (Meta ads, content, eventy)
  ├─ opex/saas                   (SaaS z tech-stack — narzędzia)
  ├─ opex/office                 (rent)
  ├─ opex/admin                  (inFakt, bank, biuro)
  └─ opex/legal                  (Creativa, kancelarie, notariusz)

BELOW THE LINE
  ├─ tax                         (CIT, VAT)
  └─ one-off                     (jednorazowe duże, nieklasyfikowalne)
```

## Status planu

`budget-<rok>.yaml` ma jeden z dwóch statusów:
- `draft` — świeżo wygenerowany przez bootstrap, nie używany do plan vs actuals
- `active` — finalizowany, source of truth dla porównania w `_dashboard.md`

Przejście `draft` → `active` przez `/finances plan-finalize <rok>` po przejrzeniu każdej linii.

## Workflow miesięcznego close

`/finances close YYYY-MM` — 6 faz, idempotentny:

1. **PULL** — agreguje dane ze źródeł (Stripe, Revolut, inFakt, tech-stack) → `transactions/YYYY-MM.yaml`
2. **CLASSIFY** — aplikuje `rules.yaml` (deterministycznie), reszta → LLM proposal
3. **REVIEW** — interaktywna pętla per nieznana transakcja: `accept` / `change` / `rule` / `skip`
4. **ACCRUALS CHECK** — porównuje płatności z `accrued-liabilities.yaml`, oznacza jako `paid`
5. **COMMIT** — otwiera `monthly/<mc>.md` w edytorze, obowiązkowy komentarz zarządczy
6. **REGENERATE** — odświeża `_dashboard.md`, `_alerts.md`, `_runway.md`

Każda faza idempotentna — restart po awarii nie duplikuje danych.

## Learning loop

W fazie REVIEW, opcja `[r]ule`:
1. Akceptuje propozycję LLM dla bieżącej transakcji
2. Tworzy nową regułę w `rules.yaml` (pattern z `memo`/`merchant`)
3. Następny close ta sama transakcja wpada w "auto-classified" (deterministycznie)

Z czasem `rules.yaml` pokrywa 90%+, LLM wywoływany rzadko.

## Markery AUTO:START / AUTO:END

Auto-generated pliki (`_dashboard.md`, `_alerts.md`, `_runway.md`) mają sekcje oznaczone:

```markdown
<!-- AUTO:START -->
... treść regenerowana ...
<!-- AUTO:END -->
```

Treść poza markerami **przetrwa regenerację** — można dopisywać własne notatki/sekcje.

## Cross-references

- `context/finances.md` — overview/snapshot, linkuje tutaj dla aktualnych liczb
- `context/operations/tech-stack/_dashboard.md` — source of truth dla linii `opex/saas`
- CFO skill (shared-skills) — czyta te pliki na żądanie, generic (nie hardkoduje ścieżek)

## Komenda /finances

| Subkomenda | Co robi |
|------------|---------|
| `/finances close YYYY-MM` | Pełny 6-fazowy close miesiąca |
| `/finances plan-bootstrap YYYY` | Wygeneruj seed planu z run-rate |
| `/finances plan-finalize YYYY` | `draft` → `active` po review |
| `/finances review YYYY-MM` | Wróć do fazy REVIEW (np. po skip) |
| `/finances regenerate` | Tylko PHASE 6 — odśwież dashboardy |

## Roadmap (kolejność implementacji)

1. ✅ Setup struktury i schemas (puste szablony) — May 2026
2. ✅ Plan bootstrap (recurring + variable seed) — May 2026
3. ✅ Wpis znanych accruals (zaległe UoD) i financing (emisja czerwiec) — May 2026
4. 🔜 Pierwszy manual close (May 2026) — początek czerwca
5. 🔜 Drugi manual close (June 2026) — początek lipca
6. 🔜 Generator skrypty (Python) — po 2-3 manualnych close'ach
7. 🔜 Auto-pull (Stripe / Revolut / inFakt) — po stabilizacji generatorów
8. 🔜 CFO skill integration — po pierwszym dashboard

## Specyfikacja

Pełna specyfikacja systemu: [`openspec/specs/finances-*/spec.md`](../../openspec/specs/) (4 capabilities: budget-plan, cash-flow, monthly-close, reporting).

## Procedura operacyjna

Kto co kiedy robi, lessons learned z konkretnych close'ów: [`context/operations/finances-budget-process.md`](../operations/finances-budget-process.md).
