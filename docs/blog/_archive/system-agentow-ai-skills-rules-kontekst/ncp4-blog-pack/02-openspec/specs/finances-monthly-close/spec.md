## ADDED Requirements

### Requirement: Komenda close jako user-triggered workflow z 6 fazami
System SHALL dostarczyć komendę `/finances close YYYY-MM`, która wykonuje sekwencyjnie 6 faz: PULL → CLASSIFY → REVIEW → ACCRUALS CHECK → COMMIT → REGENERATE. Każda faza MUSI być idempotentna — restartowanie komendy po awarii jednej z faz NIE MUSI prowadzić do duplikatów ani utraty danych.

#### Scenario: Pierwsza faza pulluje dane ze źródeł
- **WHEN** użytkownik uruchamia `/finances close 2026-05`
- **THEN** PHASE 1 (PULL) agreguje transakcje ze: Stripe (revenue), Revolut (operacyjne wydatki), inFakt (faktury kosztowe + UoD), tech-stack/_dashboard.md (SaaS recurring)
- **AND** wynik zapisany do `transactions/2026-05.yaml` ze status `draft`

#### Scenario: Restart po awarii nie duplikuje
- **WHEN** PHASE 1 (PULL) uruchamia się drugi raz dla tego samego miesiąca
- **THEN** istniejące transakcje są deduplikowane po `(source, source_id)` lub `(date, amount, memo)` jeśli source_id niedostępny
- **AND** plik `transactions/2026-05.yaml` jest aktualizowany w miejscu, bez utraty wcześniej zatwierdzonych klasyfikacji

#### Scenario: Faza zakończona zmienia status pliku
- **WHEN** wszystkie 6 faz zakończą się sukcesem
- **THEN** status `transactions/<mc>.yaml` zmienia się na `closed`
- **AND** `_dashboard.md` w sekcji "Last close" pokazuje datę zamknięcia tego miesiąca

### Requirement: Hybrydowa klasyfikacja transakcji (rules-first + LLM fallback)
System SHALL klasyfikować każdą transakcję dwustopniowo:
1. Pattern matching po regułach z `rules.yaml` (deterministyczne)
2. Dla transakcji bez pasującej reguły — propozycja klasyfikacji przez LLM z few-shot examples z `examples.yaml`

Każda LLM-classification MUSI być przedstawiona użytkownikowi w fazie REVIEW z uzasadnieniem (`reasoning`).

#### Scenario: Reguła pattern-match auto-klasyfikuje
- **WHEN** PHASE 2 (CLASSIFY) napotka transakcję pasującą do reguły w `rules.yaml`
- **THEN** transakcja dostaje pola `category`, `unit` (opcjonalnie), `classified_by: rule:<id>`
- **AND** NIE pojawia się w PHASE 3 (REVIEW)

#### Scenario: Brak reguły = LLM proposal
- **WHEN** PHASE 2 napotka transakcję bez pasującej reguły
- **THEN** wywołuje LLM z few-shot examples i proponuje klasyfikację
- **AND** transakcja dostaje `classified_by: llm`, `proposed_category`, `proposed_unit`, `reasoning`
- **AND** pojawia się w PHASE 3 (REVIEW) jako wymagająca akceptacji

#### Scenario: Konflikt reguł raportowany do usera
- **WHEN** dwie reguły pasują do tej samej transakcji
- **THEN** PHASE 2 raportuje konflikt z listą pasujących reguł
- **AND** użytkownik MUSI zdecydować priorytet lub edytować jedną z reguł
- **AND** klasyfikacja nie jest finalizowana dopóki konflikt nie zostanie rozwiązany

### Requirement: REVIEW jako interaktywna pętla z opcjami accept/change/rule/skip
System SHALL prezentować każdą LLM-classified transakcję w PHASE 3 (REVIEW) z czterema opcjami:
- **accept**: zatwierdza propozycję LLM
- **change**: zmienia kategorię/unit ręcznie
- **rule**: zatwierdza propozycję LLM I tworzy nową regułę dla podobnych transakcji w przyszłości
- **skip**: zostawia jako nieklasyfikowaną (`classified_by: pending`), wraca w następnym close

#### Scenario: Opcja "rule" tworzy regułę z opcjonalnym uzasadnieniem
- **WHEN** użytkownik wybiera "rule" dla transakcji
- **THEN** system proponuje regułę na podstawie `memo`/`merchant`/`amount` transakcji
- **AND** prosi o opcjonalne uzasadnienie (komentarz dla `rules.yaml`)
- **AND** po zatwierdzeniu wpisuje regułę do `rules.yaml` z polami: `pattern`, `category`, `unit` (opcjonalnie), `note`, `created_at`

#### Scenario: Opcja "change" pozwala na korektę unit
- **WHEN** LLM zaproponuje `category: cogs/ai-generation, unit: qamera`, ale użytkownik uważa że to shared koszt
- **THEN** "change" pozwala usunąć tag unit (`unit: null`)
- **AND** zmiana jest zapisana w `transactions/<mc>.yaml`
- **AND** opcjonalnie użytkownik może podpiąć "rule" dla podobnych w przyszłości

#### Scenario: Opcja "skip" przesuwa decyzję
- **WHEN** użytkownik wybiera "skip" dla transakcji (np. nie wie co to)
- **THEN** transakcja zostaje w pliku ze status `classified_by: pending`
- **AND** PHASE 6 (REGENERATE) raportuje liczbę pending w `_alerts.md`
- **AND** następny close ponownie pokazuje tę transakcję w REVIEW

### Requirement: ACCRUALS CHECK reconcyliuje płatności z accrued liabilities
System SHALL w PHASE 4 (ACCRUALS CHECK) porównać classified transactions z `accrued-liabilities.yaml` i automatycznie oznaczyć dopasowane jako `paid`. Dopasowanie MUSI być oparte na (kategoria, kwota, payee) — z heurystyką tolerancji (np. payee == lender/payee z accrual).

#### Scenario: Wypłata UoD pokrywa accrued liability
- **WHEN** w transakcjach maja jest wypłata UoD 4000 PLN do Pawła Lipowczana, sklasyfikowana jako `opex/people`
- **AND** w `accrued-liabilities.yaml` istnieje pending wpis "UoD Paweł — luty 2026" 4000 PLN
- **THEN** PHASE 4 oznacza accrual jako `paid`, dodaje pole `paid_date` i `payment_tx_ref`
- **AND** transakcja w `transactions/<mc>.yaml` dostaje pole `paid_accrual: <accrual-id>`

#### Scenario: Brak dopasowania nie blokuje close
- **WHEN** istnieje pending accrual ale nie znaleziono pasującej transakcji w miesiącu
- **THEN** PHASE 4 nie blokuje, ale raportuje "<N> pending accruals nie znalazły płatności w tym miesiącu"
- **AND** raport ląduje w `_alerts.md` jako informacja (nie alert)

#### Scenario: Wiele dopasowań wymaga decyzji
- **WHEN** jedna transakcja może pasować do wielu pending accruals (np. 4000 PLN do payee który ma 3 zaległe UoD)
- **THEN** PHASE 4 prosi użytkownika o wskazanie którego accrual'a to płatność
- **AND** wybór jest zapamiętany w cross-reference

### Requirement: COMMIT wymaga monthly narrative
System SHALL w PHASE 5 (COMMIT) wymagać od użytkownika edycji `monthly/<mc>.md` z komentarzem zarządczym. Plik MUSI zawierać minimum: co się działo niespodziewanego (vs plan), decyzje podjęte w trakcie miesiąca, planowane zmiany na następny miesiąc.

#### Scenario: COMMIT otwiera plik w edytorze
- **WHEN** PHASE 5 startuje
- **THEN** system tworzy `monthly/<mc>.md` z templateem (sekcje: "Co się działo", "Decyzje", "Plan na następny miesiąc")
- **AND** otwiera plik w edytorze użytkownika
- **AND** czeka na zapis pliku

#### Scenario: Pusty narrative blokuje close
- **WHEN** użytkownik zapisuje `monthly/<mc>.md` bez wypełnienia (tylko template)
- **THEN** PHASE 5 raportuje "narrative wymaga uzupełnienia"
- **AND** otwiera plik ponownie do edycji

#### Scenario: Narrative jest immutable po close
- **WHEN** PHASE 5 zakończy się sukcesem
- **THEN** `monthly/<mc>.md` zostaje oznaczony jako closed
- **AND** dalsze edycje są technicznie możliwe ale wymagają explicit `--reopen` flag (zachowanie historii decyzji)

### Requirement: REGENERATE odświeża wszystkie auto-generated dashboardy
System SHALL w PHASE 6 (REGENERATE) zaktualizować `_dashboard.md`, `_alerts.md`, `_runway.md` z najnowszych danych. Regeneracja MUSI używać markerów `<!-- AUTO:START -->` / `<!-- AUTO:END -->` (analogicznie do tech-stack) — treść poza markerami pozostaje nietknięta.

#### Scenario: Markery AUTO chronią treść użytkownika
- **WHEN** użytkownik dopisał własną sekcję poza markerami AUTO w `_dashboard.md`
- **THEN** PHASE 6 NIE nadpisuje tej treści
- **AND** regeneruje wyłącznie sekcje między markerami

#### Scenario: Regeneracja agreguje cross-references
- **WHEN** PHASE 6 generuje sekcję "OPEX SaaS" w `_dashboard.md`
- **THEN** wartość jest pulled z `context/operations/tech-stack/_dashboard.md` (nie wpisana ręcznie)
- **AND** istnieje cross-reference link do tech-stack dashboardu
