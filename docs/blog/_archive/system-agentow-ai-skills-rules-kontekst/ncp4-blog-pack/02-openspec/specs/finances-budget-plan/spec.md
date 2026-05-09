## ADDED Requirements

### Requirement: Strukturalny plan P&L na rok kalendarzowy
System SHALL przechowywać plan P&L na rok kalendarzowy w pojedynczym pliku `context/finances/budget-<rok>.yaml` w accrual basis (koszt = miesiąc powstania obowiązku, nie miesiąc płatności). Plan MUSI zawierać wartości per miesiąc per kategoria, z opcjonalnym tagiem business unit i opcjonalnym komentarzem zarządczym wyjaśniającym wartość.

#### Scenario: Plan na rok zawiera wszystkie miesiące roku
- **WHEN** użytkownik tworzy `budget-2026.yaml`
- **THEN** plik zawiera wpisy dla wszystkich 12 miesięcy roku (lub od miesiąca bootstrap'u do grudnia, jeśli rok już trwa)
- **AND** każdy miesiąc per kategoria ma pole `value` (number, PLN) i opcjonalne `note` (string)

#### Scenario: Plan rozróżnia kategorie zgodnie ze strukturą P&L
- **WHEN** plan jest tworzony
- **THEN** kategorie są zgodne z hierarchią P&L SaaS: `revenue/<podtyp>`, `cogs/<podtyp>`, `opex/<podtyp>` (people, marketing, saas, office, legal, admin), `tax`, `one-off`
- **AND** kategorie służą agregacji do linii Revenue / COGS / Gross margin / OPEX / EBITDA w dashboardzie

#### Scenario: Status planu (draft vs active)
- **WHEN** plan jest świeżo wygenerowany przez bootstrap
- **THEN** ma status `draft` i nie jest źródłem dla `_dashboard.md` plan vs actuals comparison
- **WHEN** użytkownik finalizuje plan (`plan-finalize`)
- **THEN** status zmienia się na `active` i plan zaczyna być source of truth dla porównania

### Requirement: Bootstrap planu z hybrydy run-rate seed + bottom-up correction
System SHALL umożliwić wygenerowanie inicjalnego planu (`plan-bootstrap`), który łączy automatyczne wartości dla recurring (z istniejących danych — `tech-stack/_dashboard.md`, znane UoD, rent, inFakt) z wymogiem ręcznej decyzji dla variable categories (ads, AI, marketing/legal one-offs).

#### Scenario: Bootstrap generuje recurring automatycznie
- **WHEN** użytkownik uruchamia `plan-bootstrap` dla 2026
- **THEN** kategorie `opex/people`, `opex/office`, `opex/saas`, `opex/admin` mają wartości skopiowane z run-rate (analiza ostatnich 2-3 mc actuals + tech-stack)
- **AND** każda taka linia ma `note: "seed z run-rate, wymaga review"`

#### Scenario: Bootstrap zostawia variable do decyzji użytkownika
- **WHEN** bootstrap generuje plan
- **THEN** kategorie `opex/marketing`, `cogs/ai-generation`, `one-off`, `legal` mają domyślne wartości oznaczone `note: "wymaga świadomej decyzji"` lub są puste z komentarzem do uzupełnienia
- **AND** `plan-finalize` blokuje finalizację dopóki te kategorie nie są jawnie potwierdzone przez użytkownika

#### Scenario: Bootstrap udokumentowuje źródło seed'a
- **WHEN** bootstrap kończy działanie
- **THEN** `budget-<rok>.yaml` zawiera sekcję `seeded_from` z polami: `source` (np. `run-rate`), `period` (zakres miesięcy źródłowych), `generated` (data utworzenia)

### Requirement: Tag business unit (sparse)
System SHALL umożliwić oznaczenie linii planu i transakcji opcjonalnym tagiem `unit` (`qamera` | `200iq` | brak). Brak tagu MUSI oznaczać "koszt spółki / total" — domyślny stan. Tag używany tylko gdy przypisanie do business unit jest jednoznaczne (np. revenue Stripe, COGS produktowe Qamery).

#### Scenario: Brak tagu = domyślny stan dla shared kosztów
- **WHEN** linia dotyczy UoD, rent, inFakt, lub innych shared kosztów
- **THEN** tag `unit` jest pominięty (lub `null`)
- **AND** linia jest agregowana w "spółka total"

#### Scenario: Tag qamera dla revenue i COGS produktowe
- **WHEN** linia dotyczy revenue ze Stripe lub COGS związanych z produkcją Qamery (Byteplus, Pollo, Cloudflare)
- **THEN** linia ma tag `unit: qamera`
- **AND** może być zfiltrowana w view "Qamera unit economics" (revenue − COGS = gross margin produktu)

#### Scenario: Brak wymuszonej alokacji shared kosztów
- **WHEN** użytkownik klasyfikuje shared koszt (UoD, rent)
- **THEN** system NIE wymaga proporcjonalnej alokacji do BU
- **AND** linia pozostaje bez tagu jako "spółka total"

### Requirement: Caps na variable categories z tolerance band
System SHALL przechowywać limity miesięczne (lub kwartalne) per kategoria w `context/finances/caps.yaml` wyłącznie dla variable categories. Każdy cap MUSI mieć tolerance band (domyślnie ±20%, configurable). Recurring categories (people, office, saas) NIE są objęte caps.

#### Scenario: Cap definiowany tylko dla variable
- **WHEN** użytkownik dodaje cap dla `opex/marketing/ads`
- **THEN** cap jest zapisany w `caps.yaml` z polami `monthly_cap` (number, PLN) i opcjonalnie `tolerance` (float)
- **AND** próba dodania cap dla `opex/people` jest odrzucona z komunikatem "recurring categories nie wymagają cap"

#### Scenario: Tolerance band określa kiedy alert
- **WHEN** actuals miesiąca przekraczają `monthly_cap` o mniej niż `tolerance × monthly_cap`
- **THEN** kategoria jest oznaczona jako "powyżej cap, w toleracji" (warning ⚠️)
- **WHEN** actuals przekraczają cap o więcej niż tolerance
- **THEN** kategoria jest oznaczona jako "powyżej cap + toleracji" (alert 🚨)

#### Scenario: Cap kwartalny dla kategorii skokowych
- **WHEN** użytkownik definiuje cap dla `opex/legal` jako `quarterly_cap`
- **THEN** ewaluacja porównuje sumę 3 miesięcy actuals do cap'a kwartalnego
- **AND** alert jest emitowany na koniec kwartału (po close ostatniego miesiąca kwartału)

### Requirement: Plan jako żywy dokument z rewizją po close
System SHALL traktować plan jako mutable document podlegający korektom po każdym miesięcznym close, gdy run-rate zmienia się znacząco. Każda korekta MUSI zachować historię (komentarz w `note` z datą i powodem zmiany).

#### Scenario: Korekta planu po close z komentarzem
- **WHEN** użytkownik koryguje wartość w `budget-<rok>.yaml` po close miesiąca
- **THEN** `note` przy korygowanej linii dostaje suffix z datą zmiany i powodem (np. `"; 2026-06-01: zwiększono o 500 — testujemy nowy kreatyw"`)

#### Scenario: Dashboard pokazuje "plan ostatnio zmieniony"
- **WHEN** plan został skorygowany w trakcie roku
- **THEN** `_dashboard.md` w sekcji "Plan forecast" pokazuje datę ostatniej rewizji
- **AND** użytkownik widzi że plan nie jest niezmiennym dokumentem ze stycznia
