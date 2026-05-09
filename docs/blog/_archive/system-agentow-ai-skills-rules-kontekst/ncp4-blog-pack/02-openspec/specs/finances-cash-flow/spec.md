## ADDED Requirements

### Requirement: Rozdzielenie P&L od cash flow i financing
System SHALL utrzymywać oddzielne tracking dla:
- P&L (accrual basis) — w `budget-<rok>.yaml` i `transactions/<mc>.yaml`
- Cash flow (timing płatności + financing) — w `cash-flow-<rok>.yaml`
- Accrued liabilities (zaległe zobowiązania) — w `accrued-liabilities.yaml`

Financing activities (emisja akcji, pożyczki wspólników) NIE MUSZĄ być traktowane jako revenue ani jako koszt P&L. Stanowią zmianę struktury kapitału i wpływają wyłącznie na cash position.

#### Scenario: Emisja akcji nie podnosi revenue
- **WHEN** użytkownik wpisuje emisję 100k PLN w czerwcu 2026 do `cash-flow-2026.yaml` jako `type: equity_issuance`
- **THEN** linia NIE pojawia się w sekcji `revenue/*` planu P&L
- **AND** EBITDA czerwca pozostaje bez wpływu emisji
- **AND** cash position w `_runway.md` rośnie o 100k w czerwcu

#### Scenario: Pożyczka wspólnika to financing
- **WHEN** użytkownik wpisuje pożyczkę 10k PLN od Pawła do `cash-flow-2026.yaml` jako `type: shareholder_loan`
- **THEN** wpis ma pola `lender`, `amount`, `date`, `status` (`confirmed` | `planned`)
- **AND** linia NIE jest revenue ani kosztem
- **AND** cash position rośnie w dniu wpływu

### Requirement: Ewidencja accrued liabilities (zaległych zobowiązań)
System SHALL przechowywać listę zobowiązań, dla których obowiązek powstał, ale płatność nie została jeszcze zrealizowana, w `context/finances/accrued-liabilities.yaml`. Każdy wpis MUSI zawierać: opis, kwotę, miesiąc accrual (kiedy powstał obowiązek), planowaną datę płatności, status (`pending` | `paid`).

#### Scenario: Zaległe UoD luty-kwiecień jako accrued liabilities
- **WHEN** system jest setupowany w maju 2026
- **THEN** `accrued-liabilities.yaml` zawiera 6 wpisów (UoD Paweł i Przemek za luty, marzec, kwiecień), każdy 4000 PLN, status `pending`, planned_payment `2026-05`
- **AND** każdy wpis ma `accrued_in: 2026-02` / `2026-03` / `2026-04` odpowiednio (już ujęte w P&L tych miesięcy)

#### Scenario: ACCRUALS CHECK podczas close oznacza jako paid
- **WHEN** w fazie ACCRUALS CHECK miesięcznego close system wykrywa transakcję pasującą do accrued liability (np. wypłata UoD)
- **THEN** odpowiedni wpis w `accrued-liabilities.yaml` zmienia status na `paid` z datą płatności
- **AND** transakcja w `transactions/<mc>.yaml` jest oznaczona jako payment dla danego accrual (cross-reference)

#### Scenario: Cash position uwzględnia zaległe płatności
- **WHEN** `_runway.md` jest regenerowany
- **THEN** sekcja "cash position over time" odejmuje od salda accrued liabilities z `planned_payment` w danym miesiącu (jeszcze nie opłacone)
- **AND** miesiąc rozliczenia zaległych pokazuje większy spadek cash niż wynika z burnu P&L tego miesiąca

### Requirement: Cash flow forecast jako pochodna źródeł
System SHALL generować forecast cash position (`_runway.md`) jako wynik formuły:
`cash_end[mc] = cash_start[mc] + revenue_accrual[mc] − costs_accrual[mc] + financing_inflows[mc] − accruals_payments[mc] + timing_adjustments[mc]`

gdzie `cash_start` to actual saldo na początku miesiąca lub forecast z poprzedniego miesiąca.

#### Scenario: Forecast pokazuje miesięczne saldo i runway
- **WHEN** `_runway.md` jest regenerowany po close miesiąca
- **THEN** plik zawiera tabelę z kolumnami: `Miesiąc`, `Cash start`, `+Revenue`, `-Costs`, `+Financing`, `-Accruals`, `Cash end`, `Runway (mc)`
- **AND** każdy miesiąc od bieżącego do końca roku jest wypełniony
- **AND** miesiące już zamknięte używają actuals; przyszłe używają planu

#### Scenario: Runway = cash_end / średni miesięczny burn
- **WHEN** `_runway.md` oblicza runway dla miesiąca
- **THEN** wartość = `cash_end[mc] / avg_burn_last_3_months` (lub `cash_end / planned_burn` jeśli mniej niż 3 mc actuals)
- **AND** wartość uwzględnia znane przyszłe financing inflows (jak emisja czerwiec) — pokazuje runway "z emisją" i opcjonalnie "bez emisji" jeśli status emisji to `planned`

#### Scenario: Confirmed vs planned financing
- **WHEN** financing event ma status `confirmed`
- **THEN** jest wliczane do bazowego forecast bez zastrzeżeń
- **WHEN** status to `planned`
- **THEN** `_runway.md` może opcjonalnie pokazać dwa scenariusze (z/bez), z domyślnym wykluczeniem z bazowego forecast
