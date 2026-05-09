## Context

200IQ LABS PSA jest pre-revenue spółką (~150k PLN cash, ~16-17k burn/mc, runway ~9-10 mc) z produktem Qamera AI, gdzie cofounders (Paweł, Przemek) sami zatwierdzają wszystkie wydatki — nie ma księgowej zarządzającej P&L w czasie rzeczywistym. Istniejąca struktura `context/finances.md` to statyczny snapshot bez wymiaru czasu, a `context/operations/tech-stack/` jest jedynym precedensem pracy z danymi strukturalnymi (YAML tools + auto-generated `_index.md`/`_dashboard.md` z markerami AUTO:START/END, regenerowane przez pre-commit hook). Kontekst jest mały i przewidywalny: ~kilkadziesiąt transakcji/mc, 2 cofounderów akceptujących klasyfikację, brak wymagań regulacyjnych dla tego systemu (księgowa formalna idzie przez inFakt). System ma być zarówno źródłem decyzji w tygodniowych operacjach, jak i bazą wiedzy dla CFO skill (który dostarcza analiz na żądanie).

## Goals / Non-Goals

**Goals:**
- Jeden czytelny obraz: w 30 sekund wiesz czy biznes idzie zgodnie z planem (`_dashboard.md` jako entry point)
- Plan na 8 mc 2026 (maj-grudzień) jako żywy dokument, korygowany po każdym close'ie
- Workflow zamknięcia miesiąca, który działa od dnia jeden bez żadnej infrastruktury cron/secrets (manual `/finances close YYYY-MM`)
- Klasyfikacja transakcji, która z czasem konweruje do deterministycznych reguł (90%+ pokrycia po 3-4 miesiącach), z LLM jako fallback
- Każda decyzja zarządcza ma trwałą pamięć (monthly narrative w MD) — dlaczego coś skoczyło, co planujemy zmienić
- Rozdzielenie P&L (accrual) od cash flow (timing) — bo emisja akcji i zaległe UoD inaczej rozjeżdżają każdą metrykę "łączoną"

**Non-Goals:**
- Nie zastępujemy księgowości formalnej — to robi inFakt + księgowa. System jest zarządczy, nie księgowy.
- Nie budujemy real-time monitoringu (mid-month polling, alerty push) — caps i alerty są post-close
- Nie generujemy planu automatycznie z optymalizacji — plan ustala człowiek, system pomaga seedować i śledzić
- Nie obsługujemy multi-currency w P&L — wszystko PLN. (Tech-stack ma multi-currency dla SaaS, ale do P&L wpada już skonwertowane.)
- Nie obsługujemy multi-entity — system jest dla 200IQ LABS PSA. (PLSoft, prywatne — osobne repozytorium.)
- Nie autopromujemy auto-pull/cron przed pierwszymi 2-3 udanymi manualnymi close'ami (manual first, automate after pain)

## Decisions

### Decision 1: P&L na accrual basis, cash flow oddzielnie

**Wybór**: P&L (`budget-2026.yaml`, `transactions/<mc>.yaml`) prowadzony jest w accrual basis — koszt wpada do miesiąca w którym powstał obowiązek. Cash flow (`cash-flow-2026.yaml`) tracking timing płatności i financing activities oddzielnie. Runway forecast w `_runway.md` łączy oba: `cash position = start + revenue (accrual) − costs (accrual) + financing − accruals_payments`.

**Alternatywy**:
- Cash basis dla P&L: prościej operacyjnie (koszt = wypłata), ale luty wyglądałby sztucznie tani, maj jak armagedon (24k zaległych UoD). Niemożliwe porównanie miesięcy.
- Tylko accrual, bez cash flow: traci się widoczność rzeczywistego salda banku w czasie. Decyzje "czy wystarczy gotówki w X" stają się trudne.

**Rationale**: Accrual P&L daje porównywalne miesiące i jest źródłem prawdy dla EBITDA/runway analysis. Osobne cash flow daje widoczność płynności. Koszt: dwa pliki zamiast jednego, ale każdy ma jeden cel i nie miesza pojęć.

### Decision 2: Klasyfikacja hybrydowa rules + LLM (rules-first)

**Wybór**: `rules.yaml` jako pierwszy klasyfikator — deterministyczne reguły pattern-matching (memo, merchant, amount range). LLM jako fallback dla transakcji bez pasującej reguły, z few-shot examples z `examples.yaml`. Każda korekta człowieka w fazie REVIEW może utworzyć nową regułę (z user-provided opcjonalnym uzasadnieniem). Z czasem rules pokrywa 90%+, LLM wywoływany rzadko.

**Alternatywy**:
- Pure rules: wymaga pisania reguł od zera, ból na start, edge case'e wymagają coraz bardziej skomplikowanych warunków.
- Pure LLM (z examples): elastyczne, ale niedeterministyczne — ten sam input może dać różny output. Trudniej audytować "dlaczego coś wpadło tu". Koszt LLM per zamknięcie.

**Rationale**: Finanse wymagają audytowalności ("dlaczego ta transakcja wpadła w X" → "bo reguła #14"). Hybryda daje deterministyczność dla większości + elastyczność dla edge case'ów. Konwergencja do reguł = system staje się tańszy i bardziej przewidywalny w czasie. Wzorzec human-in-the-loop z eksplicytnym tworzeniem reguł podczas review zachowuje świadomą kontrolę użytkownika.

### Decision 3: Layout — YAML dla danych, MD dla narracji, auto-generated dashboardy

**Wybór**: Wzorzec analogiczny do `context/operations/tech-stack/`:
- YAML dla strukturalnych danych (`budget-2026.yaml`, `cash-flow-2026.yaml`, `accrued-liabilities.yaml`, `rules.yaml`, `examples.yaml`, `caps.yaml`, `transactions/<mc>.yaml`)
- MD dla narracji zarządczej (`monthly/<mc>.md`)
- Auto-generated dashboardy (`_dashboard.md`, `_alerts.md`, `_runway.md`) z markerami `<!-- AUTO:START -->` / `<!-- AUTO:END -->`, regenerowane przez generator scripts (i potencjalnie pre-commit hook)

**Alternatywy**:
- Wszystko w YAML: trudno wpisać "dlaczego ads skoczyły w maju" (notatka zarządcza nie pasuje strukturalnie)
- Wszystko w MD z tabelami: agregaty, alerty, runway forecast wymagają parsowania tabel MD — overhead.
- Notion/Excel: out-of-tree, niedostępne dla skilli, brak version control.

**Rationale**: Wzorzec znany u użytkownika (tech-stack), niski koszt poznawczy. Każdy plik ma jeden cel: cyfry → YAML, decyzje → MD, raport → AUTO. CFO skill może czytać oba na żądanie i syntetyzować ("ads +30% — z notatki maja: 'testujemy nowy kreatyw'").

### Decision 4: Workflow close — user-triggered, 6 faz, idempotentny

**Wybór**: Komenda `/finances close YYYY-MM` uruchamiana ręcznie przez użytkownika. 6 faz w sekwencji:
1. **PULL** — agreguje dane ze Stripe / Revolut / inFakt / tech-stack do `transactions/YYYY-MM.yaml` (status: draft)
2. **CLASSIFY** — aplikuje `rules.yaml`, dla nieznanych proponuje LLM
3. **REVIEW** — interaktywna pętla per nieznana transakcja: accept / change / rule / skip; przy `rule` — utworzenie wpisu w `rules.yaml`
4. **ACCRUALS CHECK** — porównanie classified transactions z `accrued-liabilities.yaml`, oznaczenie jako `paid` z datą
5. **COMMIT** — otwarcie `monthly/YYYY-MM.md` w edytorze, obowiązkowy komentarz zarządczy
6. **REGENERATE** — odświeżenie `_dashboard.md`, `_alerts.md`, `_runway.md`

Każda faza idempotentna — jeśli pull padnie, restartujesz tylko phase 1; jeśli review przerwiesz, wracasz do tego samego miejsca przy następnym uruchomieniu.

**Alternatywy**:
- Cron-triggered (Wariant 3 z eksploracji): wymaga infrastruktury, secrets na serwerze, notyfikacji. Premature dla pierwszej iteracji.
- Single-shot (bez review): klasyfikacja LLM bez akceptacji człowieka — system "ucieka" od kontroli, learning loop nie działa.

**Rationale**: Manual-first działa od dnia jeden. Cron jako future iteration po 2-3 udanych manualnych close'ach (wtedy wiemy CO ma robić, by warto było automatyzować). Idempotencja to safety net dla błędów sieci, przerwanego review, edge case'ów w pull.

### Decision 5: Business unit tagging — Wariant 2 (sparse)

**Wybór**: Tag `unit` (`qamera` | `200iq` | `null`) opcjonalny per transakcja/linia planu. Domyślnie brak tagu = "koszt spółki / total". Tag `qamera` używany tylko gdy oczywiste (revenue Stripe, COGS produktowe Byteplus/Pollo/Cloudflare). Pełna alokacja shared kosztów (UoD, rent, SaaS) do BU NIE jest robiona.

**Alternatywy**:
- Pełny split (Wariant 1): każda transakcja klasyfikowana także na BU. Wymaga reguł alokacji shared kosztów (proporcjonalnie? 50/50?). Premature gdy 100% shared = obecnie Qamera, konsulting na pause.
- Brak tagów (Wariant 3): nie da się wyizolować unit economics Qamery (revenue − COGS Qamery → gross margin produktu).

**Rationale**: 200IQ LABS to JEDEN podmiot prawny — runway liczy się na poziomie spółki. Unit economics Qamery (revenue − COGS) to jedyny sensowny "view per unit" obecnie. Pełna alokacja shared = księgowy overhead bez decyzyjnej wartości na tym etapie. Upgrade do Wariantu 1 możliwy później bez zmian breaking — tag jest dodatkowym wymiarem.

### Decision 6: Caps — post-close, tolerance band, tylko variable

**Wybór**: `caps.yaml` definiuje miesięczne (lub kwartalne dla legal) limity dla **variable categories** (ads, AI usage, marketing one-offs, legal one-offs). Tolerance band domyślnie ±20%, configurable per kategoria. Ewaluacja w fazie REGENERATE — `_alerts.md` pokazuje przekroczenia. Brak mid-month polling.

**Alternatywy**:
- Hard caps (no tolerance): stresujące i nieelastyczne — przekroczenie o 1 PLN = alarm.
- Soft targets (info only): ignorowane, nie egzekwują dyscypliny.
- Caps na wszystkie kategorie: recurring (UoD, rent) i tak są planowane — cap = duplikat planu. Bezsensowne.

**Rationale**: Tolerance band daje "OK / OK / OK / ⚠️ uwaga" — spójna z naturą variable spend. Tylko variable, bo recurring nie potrzebują cap'a (jak chcesz zmienić — zmieniasz plan). Post-close bo mid-month polling wymaga infra (cron + secrets) — YAGNI dla pierwszej iteracji.

### Decision 7: Plan bootstrap — hybryda seed + correction

**Wybór**: `plan-bootstrap` skrypt generuje `budget-2026.yaml` ze seed'em z run-rate (recurring z tech-stack i znanych UoD/rent/inFakt) + variable jako średnia ostatnich 2 mc actuals. Każda kategoria oznaczona `note: "seed z run-rate, wymaga review"`. User przechodzi miesiąc po miesiącu, akceptuje lub koryguje + komentarz "dlaczego". Po `plan-finalize` status planu → `active`.

**Alternatywy**:
- Pure bottom-up: 2-3 godziny pracy na start; ryzyko "kopiujesz to co teraz" bez świadomej decyzji.
- Pure run-rate (bez correction): mało historii (~2 mc), ekstrapolacja niewiarygodna. Ignoruje znane wydarzenia (emisja czerwiec, planowane kampanie).
- Scenarios (base/aggressive/lean): premature, decision support na ten poziom nie potrzebny pre-revenue.

**Rationale**: 70% burnu to recurring (8k UoD × 2, 615 rent, ~3.5k SaaS, 1k inFakt) — to system wygeneruje. 30% wymaga decyzji (ads, AI, one-offs) — tu human-in-the-loop. Plan = żywy, korygowany po każdym close'ie gdy run-rate się zmieni.

## Risks / Trade-offs

- **[Mała historia (~2 mc actuals) → seed niskiej jakości]** → Pierwsze 2-3 close'y traktować jako kalibracyjne; po nich revisit planu na resztę roku z lepszymi danymi.
- **[Manual close wymaga dyscypliny — można zaniedbać]** → Komentarz w `monthly/<mc>.md` obowiązkowy (faza COMMIT); jeśli zaniedbany, dashboard jasno pokazuje "ostatni close: 2026-MM" → wstyd jest motywatorem. Future: cron przygotowuje draft.
- **[LLM klasyfikuje błędnie → użytkownik akceptuje przez nieuwagę]** → Każda LLM-classification w REVIEW musi pokazywać reasoning ("Reasoning: ..."). User widzi *dlaczego* LLM tak myśli, łatwiej wyłapać błąd.
- **[Reguły puchną w `rules.yaml`, stają się sprzeczne]** → Generator klasyfikujący raportuje "rule conflict" gdy dwie reguły matchują tę samą transakcję; user musi zdecydować priorytet. Po 6 mc revisit reguł.
- **[Accrual basis wymaga dyscypliny przy nowych zobowiązaniach (UoD, kontrakty)]** → User musi pamiętać dodać do `accrued-liabilities.yaml` przy podpisaniu nowego zobowiązania. Future: integracja z inFakt MCP może to robić automatycznie.
- **[Revolut/inFakt API change → pull padnie]** → Manual fallback zawsze dostępny (CSV export → manual yaml). Pull jest wygodą, nie wymaganiem.
- **[Pre-commit hook regenerujący dashboard może spowalniać commity]** → Hook tylko gdy zmieniają się pliki yaml w `context/finances/`; failure mode: warning + exit 0 (jak w tech-stack).
- **[Multi-currency edge cases (np. faktury w EUR z Cloudflare)]** → V1: wpisujesz w PLN po kursie z dnia płatności (manual). V2: tabela kursów + auto-konwersja (jak `exchange_rates.yaml` w tech-stack).
- **[Confidential dane finansowe w repo]** → Repo jest prywatne, kontrolowane (200iqlabs/agentic-ai-system). Brak dodatkowych czynności potrzebnych. Secrets do API w `.env` (gitignored).

## Migration Plan

System jest greenfield — brak migracji z istniejącego rozwiązania.

**Kolejność rolloutu:**
1. Manualne utworzenie struktury katalogów + plików yaml/md (bez generatora skryptów)
2. Bootstrap planu na maj-grudzień 2026 (jednorazowo)
3. Wpisanie znanych accrued liabilities (zaległe UoD luty-kwiecień) i financing (emisja czerwiec, pożyczki marzec)
4. Pierwszy manual close maja 2026 (dane ze Stripe/Revolut/inFakt wpisywane ręcznie do `transactions/2026-05.yaml`) — kalibracja workflow
5. Po pierwszym close: pierwsze reguły w `rules.yaml`, pierwszy dashboard w `_dashboard.md`
6. Drugi close (czerwiec) — sprawdzić ile reguł zadziałało, ile potrzebowało LLM
7. Skrypty generatorów (`regen_dashboard.py`, `classify.py`) jako future iteration po 2-3 manualnych close'ach
8. Auto-pull (Revolut/Stripe/inFakt) jako future iteration

**Rollback**: usunięcie katalogu `context/finances/` i przywrócenie poprzedniego stanu `finances.md`. Brak zewnętrznych systemów do rollbackowania.

## Open Questions

- **Czy `_dashboard.md` ma być sekcją w `finances.md`, czy oddzielnym plikiem?** — Roboczo: oddzielny plik (jak w tech-stack), a `finances.md` cross-referuje. Do potwierdzenia podczas implementacji.
- **Format `transactions/<mc>.yaml` — czy jeden plik per miesiąc wystarczy, czy potrzebne źródło per transakcja (origin: revolut, stripe, ...)?** — Roboczo: yes, jedno pole `source` per transakcja w pliku miesiąca.
- **Pre-commit hook regenerujący — od kiedy?** — Roboczo: dopiero gdy istnieją skrypty generatorów (future iteration). Pierwsze close'y bez hooka.
- **Komenda `/finances` — implementacja jako skill lokalny w repo czy w shared-skills?** — Roboczo: lokalny w repo (specyficzny dla 200IQ LABS). CFO skill (shared) pozostaje generic, czyta dane przez paths.
- **Jak obsługiwać one-off pre-close (np. user wie że dziś podpisał umowę 5k)?** — Roboczo: user dopisuje ręcznie do `accrued-liabilities.yaml` w dowolnym momencie. Close to potwierdzi.
- **Forecasting beyond 2026-12 — co z 2027?** — Roboczo: w grudniu 2026 bootstrap nowego `budget-2027.yaml`. Pojedynczy plik per rok kalendarzowy.
