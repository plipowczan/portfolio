# 200IQ LABS — Finances Dashboard

> **Last updated:** 2026-05-04 (po close 2026-02, 2026-03, 2026-04 — pełny YTD)
> **Last close:** 2026-04 ([monthly/2026-04.md](monthly/2026-04.md))
> **Plan status:** `draft` (budget-2026.yaml — Przemek review przed plan-finalize)

<!-- AUTO:START -->

## 1. Cash position & runway

| Metryka | Wartość |
|---|---|
| Cash on hand (est. po close 2026-04) | ~+44k PLN net miesięczny przyrost (cash-flow przed UoD payouts maj) |
| Cumulative shareholder loans (od Pawła) | **74300 PLN** (10k Feb + 10k Mar + 300+20k+34k Apr) |
| Confirmed financing (czerwiec emisja) | +100000 PLN |
| Accrued liabilities (UoD luty-kwiecień, payout maj) | −24000 PLN |
| Run-rate burn (post-Meta-off, est.) | ~6-7k PLN/mc bez UoD; ~14-14.5k z UoD (baza: April actual 17.1k − Meta 2.75k; pre Cursor→Claude migracji) |
| Runway szacowany | przed emisją: tight; po emisji 100k: ~5-7 mc |

→ Pełny breakdown po skonsolidowaniu cash position w maju.

## 2. P&L April 2026

| Linia | Actual | Plan | Δ |
|---|---:|---:|---:|
| **Revenue** | **347** | **598** | **−42%** |
| revenue/credits | 347 | 0 | +347 |
| revenue/subscriptions | 0 | 98 | −98 |
| revenue/managed | 0 | 500 | −500 |
| **Costs** | **17151** | **14242** | **+20%** |
| opex/people (accrual) | 8000 | 8000 | ✓ |
| opex/marketing | 2996 | 1500 | +100% 🔴 |
| opex/saas | 2112 | 1633 | +29% 🟡 |
| cogs/ai-generation | 1709 | 700 | +144% 🔴 |
| opex/admin | 1119 | 1194 | −6% |
| opex/office | 615 | 615 | ✓ |
| opex/legal | 600 | 600 | ✓ |
| **EBITDA** | **−16804** | **−13644** | **−3160** |

## 3. P&L YTD 2026 (Feb-April, accrual basis)

| Pozycja | Feb | Mar | Apr | **YTD** |
|---|---:|---:|---:|---:|
| **Revenue** | 0 | 2996 | 347 | **3343** |
| **Costs** | 17581 | 15152 | 17151 | **49884** |
| opex/people (UoD accrual) | 8000 | 8000 | 8000 | 24000 |
| opex/legal (Creativa setup) | 7380 | 0 | 600 | 7980 |
| opex/saas | 598 | 1915 | 2112 | 4625 |
| opex/admin | 1595 | 1646 | 1119 | 4360 |
| opex/marketing | 0 | 990 | 2996 | 3986 |
| cogs/ai-generation | 8 | 1986 | 1709 | 3703 |
| opex/office | 0 | 615 | 615 | 1230 |
| **EBITDA** | **−17581** | **−12156** | **−16804** | **−46541** |
| Plan EBITDA | −17807 | −9437 | −13644 | −40888 |
| **Variance vs plan** | +226 | −2719 | −3160 | **−5653** |

## 4. Forecast (rest of year)

| Miesiąc | Plan revenue | Plan costs | Plan EBITDA |
|---|---:|---:|---:|
| 2026-05 | 1196 | 13742 | −12546 |
| 2026-06 | 1493 | 13742 | −12249 |
| 2026-07 | 4190 | 11912 | −7722 |
| 2026-08 | 7187 | 12312 | −5125 |
| 2026-09 | 12184 | 12842 | −658 (target break-even) |
| 2026-10 | 16181 | 13842 | +2339 |
| 2026-11 | 19178 | 14342 | +4836 |
| 2026-12 | 22175 | 15042 | +7133 |

## 5. Alerts

| Alert | Severity | Źródło |
|---|---|---|
| GCP +144% vs plan (1709 vs 700) | 🔴 high | close 2026-04 |
| Meta Ads jeszcze on w Apr (2750 PLN) | 🟡 medium | close 2026-04 (znany — wyłączane od maja) |
| Cursor billowany 4×/mc (716 PLN) | 🟡 medium | rewizja planu opex/saas potrzebna |
| 6 pending UoD = 24k payout maj | 🟡 medium | cash przygotowane (loans Apr +54.3k) |
| Plan revenue/managed Apr = 500, actual 0 | 🟢 low | known (LAVEL via inna spółka) |

<!-- AUTO:END -->

## Notatki ręczne (poza markerami — przetrwają regenerację)

- 2026-05-04: pierwszy close systemu. Manual regeneracja dashboardów (brak skryptów Python). Po 2-3 closach zbudować generator.
- Plan finalize: nie wykonano — tryb `draft` świadomie do kolejnego close (manual-first philosophy).
