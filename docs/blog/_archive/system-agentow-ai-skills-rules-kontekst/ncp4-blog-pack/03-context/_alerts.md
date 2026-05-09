# 200IQ LABS — Active Alerts

> **Last updated:** 2026-05-04 (after close 2026-04)
> Cross-ref: [_dashboard.md](_dashboard.md), [monthly/2026-04.md](monthly/2026-04.md)

<!-- AUTO:START -->

## 🔴 High severity

### GCP compute +144% vs plan (April 2026) — ✅ RESOLVED
- **Actual:** 1691.59 PLN (`cogs/ai-generation`)
- **Plan:** 700 PLN (BŁĘDNY — historyczny range 1000-1600 PLN)
- **Δ:** +991.59 PLN
- **Source:** inFakt GCPLD0004969734, Revolut card_payment 2026-04-02
- **Resolution (2026-05-04):** plan był błędny, GCP to normalny run-rate. Plan May-Dec podniesiony do 1500-1800 PLN/mc. Część kosztów to content marketingowy (own + materiały dla klientów). GCP nie będzie optymalizowany teraz — świadoma decyzja.

### Meta Ads +83% vs plan (April 2026)
- **Actual:** 2749.89 PLN (`opex/marketing`)
- **Plan:** 1500 PLN
- **Δ:** +1249.89 PLN
- **Source:** Revolut Meta Pay × 18 transakcji
- **Status:** **WYJAŚNIONE** — Meta Ads planowo wyłączone OD MAJA, kwiecień to ostatni full month. **Action:** potwierdzić że w maju wydatki spadną do <300 PLN (plan).

## 🟡 Medium severity

### Cursor billowany 4× w miesiącu
- **Actual:** 716.44 PLN (`opex/saas`)
- **Implikacja:** Plan opex/saas 1633 PLN niedoszacowany — Cursor ≈ 700 PLN/mc zamiast ~217 PLN.
- **Decyzja (2026-05-04):** **prawdopodobna migracja Cursor → Claude** (sztywny cap ~90 EUR/mc = ~390 PLN, przewidywalny koszt). Decision w maju.
- **Akcja:** Przemek analizuje co zostało wygenerowane przez Cursor (część szła w eksperymenty marketingowe).

### 6 pending accruals UoD (24000 PLN)
- **Items:** uod-pawel-2026-{02,03,04} + uod-przemek-2026-{02,03,04}
- **Planowana płatność:** maj 2026
- **Cash:** ✅ przygotowany (54.3k PLN shareholder loans od Pawła w kwietniu)
- **Akcja:** PHASE 4 ACCRUALS CHECK w close 2026-05 oznaczy jako `paid`.

## 🟢 Low severity

### Revenue/managed = 0 vs plan 500 (April)
- **Actual:** 0 PLN
- **Plan:** 500 PLN (LAVEL pilot)
- **Status:** **WYJAŚNIONE** — LAVEL fakturowany przez Przemka z poprzedniej spółki. Egzekucja w 200IQ LABS = 0 (znana sytuacja).
- **Akcja:** korekta planu retrospektywnie: revenue/managed Apr → 0; future months — zaktualizować jeśli LAVEL przejdzie do 200IQ.

## Pending classifications

- **2026-03 EJJF5A5F-0001 — 140 USD (~502 PLN)** — unknown vendor w inFakt, brak match w Revolut. Tymczasowo `opex/admin`. Wymaga wyjaśnienia: Cloudflare drugi / Hunter annual / inny dostawca / płatność z karty osobistej?

## Korekty planu (do plan-finalize)

- ✅ `cogs/ai-generation` May-Dec: 700→1500-1800 (zaktualizowane retro)
- ✅ `opex/marketing` Apr-Dec: flat 3000 PLN (Przemek dopracowuje strategię)
- ⚠️ `opex/office` Feb = 0 (umowa najmu od marca — plan zakładał 615 błędnie)
- ⚠️ `opex/saas` Feb = ~600 (większość SaaS jeszcze nieaktywna w spółce; plan 1633 błędny dla lutego)
- ⚠️ `revenue/managed` Apr = 0 (LAVEL przez inną spółkę — znane)

<!-- AUTO:END -->
