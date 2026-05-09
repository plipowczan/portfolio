## 1. Setup struktury katalogów i konwencje

- [x] 1.1 Utworzyć katalog `context/finances/` z podkatalogami `transactions/` i `monthly/`
- [x] 1.2 Utworzyć `context/finances/README.md` z konwencjami: cel każdego pliku, accrual basis vs cash flow, status planu (draft/active), markery AUTO, workflow close
- [x] 1.3 Zaktualizować `CLAUDE.md` (sekcja "Context Files & Data Storage Rules") — dodać tabelę dla `context/finances/` i sekcję "Finances Management" wskazującą `_dashboard.md` jako entry-point
- [x] 1.4 Zaktualizować `context/finances.md` — dodać cross-reference do `context/finances/_dashboard.md` (entry-point dla bieżących liczb), zachować jako snapshot/overview

## 2. Schema danych — pliki strukturalne (puste szablony)

- [x] 2.1 Utworzyć `context/finances/budget-2026.yaml` z pełnym szkieletem: `year`, `status: draft`, `seeded_from`, sekcja `categories` z hierarchią (revenue/cogs/opex/tax/one-off), placeholdery dla 12 mc
- [x] 2.2 Utworzyć `context/finances/cash-flow-2026.yaml` ze szkieletem: sekcje `financing` (lista zdarzeń kapitałowych), `accruals_payments` (planowane płatności zaległych)
- [x] 2.3 Utworzyć `context/finances/accrued-liabilities.yaml` ze szkieletem listy: `description`, `amount`, `accrued_in`, `planned_payment`, `status` (`pending`/`paid`)
- [x] 2.4 Utworzyć `context/finances/rules.yaml` jako pustą listę reguł (z komentarzem-szablonem pokazującym format: `pattern`, `category`, `unit`, `note`, `created_at`)
- [x] 2.5 Utworzyć `context/finances/examples.yaml` z 5-10 zaczątkowymi few-shot examples dla LLM klasyfikacji (różne kategorie, z polem `reasoning`)
- [x] 2.6 Utworzyć `context/finances/caps.yaml` z domyślnymi caps dla kategorii variable (ads, AI, marketing one-offs, legal — quarterly), z `defaults.tolerance: 0.20`

## 3. Bootstrap planu na 2026 (maj-grudzień)

- [x] 3.1 Wpisać do `budget-2026.yaml` recurring values dla maja-grudnia: UoD Paweł 4000, UoD Przemek 4000, rent 615/mc, inFakt ~1044/mc, tech-stack SaaS (suma z `_dashboard.md`)
- [x] 3.2 Wpisać variable seed dla maja-grudnia: ads ~1500/mc, AI generation ~800/mc, one-off ~300/mc — każda linia z `note: "seed, wymaga review"`
- [x] 3.3 Wpisać planowany revenue dla maja-grudnia (Qamera): pesymistyczny baseline (np. 49 PLN/mc obecne sub do czerwca, potem 0 jeśli scheduled cancel; zaplanować wzrost subów od Q3 jako świadomy target z komentarzem)
- [ ] 3.4 Przejrzeć każdą linię budżetu mc po mc, zatwierdzić lub skorygować z komentarzem "dlaczego" — zmienić `status: draft` → `status: active`  ← **WYMAGA RĘCZNEGO REVIEW UŻYTKOWNIKA**

## 4. Wpis znanych accrued liabilities i financing events

- [x] 4.1 Wpisać do `accrued-liabilities.yaml` 6 zaległych UoD: Paweł × 3 mc (luty/marzec/kwiecień), Przemek × 3 mc, każda 4000 PLN, `planned_payment: 2026-05`, `status: pending`
- [x] 4.2 Wpisać do `cash-flow-2026.yaml` financing events: emisja akcji 100k czerwiec 2026 (`status: confirmed`), pożyczki Paweł 2× 10k luty/marzec 2026 (`status: confirmed`)
- [x] 4.3 Wpisać do `cash-flow-2026.yaml` accruals_payments: maj 2026 → 24k (rozliczenie zaległych UoD), z cross-reference do wpisów w `accrued-liabilities.yaml`

## 5. Skill `/finances` — definicja komendy

- [x] 5.1 Utworzyć skill lokalny `tools/finances/SKILL.md` (lub `.claude/skills/finances/SKILL.md`) z trigger-words: "finances close", "/finances", "zamknij miesiąc"
- [x] 5.2 Zdefiniować subkomendy w SKILL.md: `close YYYY-MM`, `plan-bootstrap YYYY`, `plan-finalize YYYY`, `review YYYY-MM`, `regenerate`
- [x] 5.3 Zdokumentować w SKILL.md 6 faz close (PULL, CLASSIFY, REVIEW, ACCRUALS CHECK, COMMIT, REGENERATE) — co każda robi, jakie pliki czyta/pisze
- [x] 5.4 Zdokumentować w SKILL.md mechanikę learning loop (rules-first → LLM fallback → korekta tworzy regułę)

## 6. Pierwszy manual close — maj 2026 (kalibracja)

- [ ] 6.1 Wykonać manualny PULL dla maja: pobrać z Stripe (revenue), zapisać do `transactions/2026-05.yaml` (sekcja revenue)
- [ ] 6.2 Wykonać manualny PULL z Revolut: wyeksportować CSV za maj, ręcznie wpisać transakcje do `transactions/2026-05.yaml` (sekcja expenses)
- [ ] 6.3 Wykonać manualny PULL z inFakt: wyeksportować faktury kosztowe za maj + wypłaty UoD, wpisać do `transactions/2026-05.yaml`
- [ ] 6.4 Pulled SaaS recurring z `tech-stack/_dashboard.md` — agregacja per kategoria, wpisać do `transactions/2026-05.yaml`
- [ ] 6.5 Manualnie sklasyfikować wszystkie transakcje (CLASSIFY ręcznie, pierwszy raz) — przypisać `category`, `unit` (gdzie oczywiste qamera)
- [ ] 6.6 Dla każdej klasyfikacji rozważyć: czy dodać do `rules.yaml` jako trwałą regułę dla podobnych w przyszłości
- [ ] 6.7 Wykonać ACCRUALS CHECK ręcznie — porównać wypłaty UoD w maju z `accrued-liabilities.yaml`, oznaczyć 6 zaległych jako `paid` z datą wypłaty
- [ ] 6.8 Utworzyć `monthly/2026-05.md` z komentarzem zarządczym: co się działo, decyzje, plan na czerwiec
- [ ] 6.9 Manualnie wygenerować pierwszą wersję `_dashboard.md`, `_alerts.md`, `_runway.md` z markerami AUTO:START/END (na razie ręcznie, generator później)

## 7. Drugi manual close — czerwiec 2026 (walidacja)

- [ ] 7.1 Powtórzyć PULL dla czerwca (Stripe + Revolut + inFakt + tech-stack)
- [ ] 7.2 Aplikować `rules.yaml` ręcznie — sprawdzić ile transakcji łapie reguła vs wymaga decyzji
- [ ] 7.3 Dla nieznanych transakcji: ręcznie sklasyfikować + dodać reguły do `rules.yaml`
- [ ] 7.4 Zarejestrować emisję akcji 100k w `cash-flow-2026.yaml` jako rzeczywistą (zmiana `status: confirmed` → `status: realized` z datą)
- [ ] 7.5 ACCRUALS CHECK — sprawdzić czy są nowe accruals do dodania (np. nowe zobowiązania)
- [ ] 7.6 Utworzyć `monthly/2026-06.md` z komentarzem; rewizja planu na lipiec-grudzień jeśli run-rate się zmienił
- [ ] 7.7 Zregenerować dashboardy, sprawdzić czy plan vs actuals jest sensowny

## 8. Generator skryptów (po 2-3 manualnych close'ach — future iteration)

- [ ] 8.1 Napisać `tools/finances/regen_dashboard.py` — generator `_dashboard.md` z budget-yyyy.yaml + transactions/*.yaml + cash-flow + accrued-liabilities
- [ ] 8.2 Napisać `tools/finances/regen_runway.py` — generator `_runway.md` z formulą cash position over time
- [ ] 8.3 Napisać `tools/finances/regen_alerts.py` — generator `_alerts.md` z porównania actuals vs caps i pending klasyfikacji
- [ ] 8.4 Napisać `tools/finances/classify.py` — silnik klasyfikacji (rules-first + LLM fallback) wywoływany przez fazę CLASSIFY
- [ ] 8.5 Napisać `tools/finances/close.py` — orchestrator 6 faz close, z idempotencją per faza
- [ ] 8.6 Dodać pre-commit hook (analogicznie do tech-stack) regenerujący `_dashboard.md` przy zmianie plików yaml w `context/finances/`
- [ ] 8.7 Dodać `tools/finances/.env.example` z wymaganymi ENV vars (Stripe key, Revolut OAuth, inFakt MCP) — analogicznie do `tools/airtable/.env.example`

## 9. Auto-pull integracje (POKRYTE przez istniejącą infrastrukturę)

- [x] 9.1 ~~Implementacja `pull_revolut.py`~~ — POKRYTE: `shared-skills/skills/cfo/scripts/get_transactions.py` używa OAuth z `tools/revolut/`
- [x] 9.2 ~~Implementacja `pull_stripe.py`~~ — POKRYTE: `shared-skills/skills/cfo/scripts/get_revenue.py` używa `tools/stripe/.env`
- [x] 9.3 ~~Implementacja `pull_infakt.py`~~ — POKRYTE: MCP `mcp__claude_ai_inFakt__infakt_get_costs_list` (preferowane nad CLI)
- [ ] 9.4 Aktualizacja `close.py` — phase PULL używa shared-skills scripts + MCP zamiast prompt o manual CSV. Może zostać jako Claude-orchestrated w trakcie sesji (bez orchestratora) — patrz `tools/finances/README.md`.
- [ ] 9.5 Test: pełny `close 2026-08` end-to-end z auto-pull (po sierpniu 2026)

## 10. CFO skill integration

- [ ] 10.1 Zaktualizować CFO skill (shared-skills) — dodać sekcję "Finances data sources" wskazującą paths: `context/finances/_dashboard.md`, `_runway.md`, `monthly/`
- [ ] 10.2 Skill MUSI być generic (nie hardkodować ścieżek) — integracja przez konwencję data paths z `CLAUDE.md`
- [ ] 10.3 Test: zapytanie "ile mam runway" — CFO czyta `_dashboard.md` i `_runway.md`, syntetyzuje z kontekstem z `monthly/<ostatni>.md`
- [ ] 10.4 Test: zapytanie "co z budżetem ads" — CFO czyta `caps.yaml` + `_alerts.md` + ostatnie `transactions/<mc>.yaml`

## 11. Dokumentacja i checkpoint

- [x] 11.1 Utworzyć `context/finances/README.md` (jeśli nie zrobione w 1.2) z pełnym przewodnikiem dla użytkownika: jak działa close, jak edytować plan, jak czytać dashboard  — done w 1.2
- [ ] 11.2 Po pierwszym close: zaktualizować `MEMORY.md` (project memory) o tym że `context/finances/` jest aktywne i jak działa workflow
- [ ] 11.3 Review po 3 close'ach (sierpień): czy struktura plików nadal sensowna, czy reguły rosną, czy potrzebne uproszczenia (filtr "jeśli nie zmienia decyzji — wycinamy")
- [ ] 11.4 Archive change po 3-4 udanych close'ach (`/opsx:archive finances-budget-tracker`)
