## ADDED Requirements

### Requirement: Dashboard jako 30-sekundowy obraz kondycji biznesu
System SHALL utrzymywać `context/finances/_dashboard.md` jako entry-point dla użytkownika, który w 30 sekund odpowiada na pytanie "czy biznes idzie zgodnie z planem". Plik MUSI zawierać 5 sekcji w stałej kolejności: (1) Cash & Runway, (2) P&L bieżący miesiąc, (3) P&L YTD, (4) P&L forecast, (5) Alerty & decyzje czekające.

#### Scenario: Sekcja Cash & Runway na górze
- **WHEN** użytkownik otwiera `_dashboard.md`
- **THEN** pierwsza widoczna sekcja to "Cash & Runway" z metrykami: cash position, monthly burn, runway w miesiącach, najbliższe znane cash event
- **AND** każda metryka ma kolumnę "vs plan" i wskaźnik trendu (↑/↓/—)

#### Scenario: P&L bieżącego miesiąca pokazuje plan vs actual
- **WHEN** miesiąc został zamknięty
- **THEN** sekcja 2 pokazuje tabelę kategorii P&L z kolumnami: Plan, Actual, Drift (%)
- **AND** linie agregowane (Gross margin, EBITDA) są wyróżnione

#### Scenario: Forecast obejmuje pozostałe miesiące roku
- **WHEN** dashboard jest regenerowany w maju
- **THEN** sekcja 4 pokazuje miesięczne wartości od czerwca do grudnia z kolumnami: Revenue, Costs, EBITDA, Cash end
- **AND** miesiące z confirmed financing events są wyraźnie oznaczone (np. "← +100k emisja" w czerwcu)

#### Scenario: Alerty linkują do szczegółów
- **WHEN** są otwarte alerty
- **THEN** sekcja 5 pokazuje listę z linkiem do szczegółów (np. `monthly/2026-05.md` lub `_alerts.md`)
- **AND** każdy alert ma typ (⚠️ warning, 🚨 alert) i jednolinijkowy opis

#### Scenario: Dashboard pokazuje datę ostatniego close
- **WHEN** użytkownik otwiera dashboard
- **THEN** w nagłówku jest "Last close: YYYY-MM"
- **AND** jeśli minęło >35 dni od ostatniego close, pojawia się warning "Close overdue"

### Requirement: Auto-generation z markerami AUTO:START/END
System SHALL regenerować `_dashboard.md`, `_alerts.md`, `_runway.md` przez generator skrypty (lub fazę REGENERATE close'u), zachowując treść poza markerami `<!-- AUTO:START -->` / `<!-- AUTO:END -->` nietkniętą. Każdy plik AUTO MUSI mieć w nagłówku `> Auto-generated. Last regenerated: YYYY-MM-DD HH:MM`.

#### Scenario: Treść poza markerami zachowana
- **WHEN** użytkownik dodał własną sekcję poniżej `<!-- AUTO:END -->`
- **THEN** regeneracja NIE nadpisuje tej treści
- **AND** sekcja AUTO jest aktualizowana w miejscu

#### Scenario: Brak markerów = pełne nadpisanie
- **WHEN** plik nie zawiera markerów AUTO (np. pierwsza generacja)
- **THEN** generator tworzy plik od zera z markerami obejmującymi całą treść AUTO
- **AND** dodaje template komentarz "dodaj własne sekcje poza markerami AUTO:START/END"

### Requirement: _alerts.md raportuje przekroczenia caps i pending klasyfikacje
System SHALL utrzymywać `context/finances/_alerts.md` jako oddzielny plik z listą wszystkich aktywnych alertów. Plik MUSI być regenerowany w PHASE 6 (REGENERATE) i zawierać sekcje: caps przekroczone, pending klasyfikacje, accruals bez płatności, anomalie.

#### Scenario: Cap przekroczenie jako warning lub alert
- **WHEN** kategoria w bieżącym miesiącu przekracza cap o mniej niż tolerance
- **THEN** `_alerts.md` zawiera wpis ⚠️ z kategorią, wartością actual, cap'em i procentem przekroczenia
- **WHEN** przekroczenie powyżej tolerance
- **THEN** wpis ma 🚨 i jest na górze listy

#### Scenario: Pending klasyfikacje raportowane
- **WHEN** w `transactions/<mc>.yaml` są transakcje ze status `classified_by: pending`
- **THEN** `_alerts.md` raportuje liczbę pending z linkiem do pliku
- **AND** użytkownik widzi że są transakcje wymagające decyzji w następnym close

#### Scenario: Accruals bez płatności po terminie
- **WHEN** accrual ma `planned_payment` w przeszłym miesiącu i status `pending`
- **THEN** `_alerts.md` raportuje to jako 🚨 "accrual przeterminowany — czy faktycznie nieopłacony, czy wymaga ręcznego oznaczenia paid?"

### Requirement: _runway.md pokazuje cash position over time
System SHALL utrzymywać `context/finances/_runway.md` z miesięczną tabelą cash position od bieżącego miesiąca do końca roku (lub dłużej jeśli plan istnieje). Tabela MUSI mieć kolumny: Miesiąc, Cash start, +Revenue, -Costs, +Financing, -Accruals, Cash end, Runway (mc).

#### Scenario: Tabela uwzględnia accruals payments
- **WHEN** miesiąc ma planowane accruals payments (np. maj 2026 → 24k zaległych UoD)
- **THEN** kolumna "-Accruals" pokazuje 24000 dla tego miesiąca
- **AND** Cash end odpowiednio niższy niż wynika z samego burnu P&L

#### Scenario: Runway calculation z średnią burn
- **WHEN** istnieje minimum 3 mc closed actuals
- **THEN** runway dla każdego miesiąca = `cash_end / avg(burn ostatnie 3 mc)`
- **WHEN** mniej niż 3 mc actuals
- **THEN** runway = `cash_end / planned_burn` z odpowiednim oznaczeniem "based on plan, not actuals"

#### Scenario: Confirmed financing wliczane do bazowego forecast
- **WHEN** financing event ma status `confirmed`
- **THEN** kolumna "+Financing" w odpowiednim miesiącu zawiera wartość
- **WHEN** status to `planned`
- **THEN** linia ma adnotację "(planned, not confirmed)" lub jest prezentowana jako dodatkowy scenariusz

### Requirement: Cross-references do innych źródeł danych
System SHALL w wygenerowanych dashboardach linkować do źródłowych plików (zamiast duplikacji wartości). Linki MUSZĄ być relative paths within repo, działające zarówno w GitHub UI jak i w edytorach.

#### Scenario: OPEX SaaS linkuje do tech-stack
- **WHEN** `_dashboard.md` pokazuje linię "OPEX SaaS"
- **THEN** wartość jest pulled z `context/operations/tech-stack/_dashboard.md`
- **AND** linia ma link `[szczegóły](../operations/tech-stack/_dashboard.md)`
- **AND** wartość NIE jest duplikowana (single source of truth zachowane)

#### Scenario: Alert linkuje do monthly narrative
- **WHEN** alert dotyczy decyzji podjętej w konkretnym miesiącu
- **THEN** alert zawiera link `[kontekst](monthly/2026-05.md#decyzje)` jeśli relevant
