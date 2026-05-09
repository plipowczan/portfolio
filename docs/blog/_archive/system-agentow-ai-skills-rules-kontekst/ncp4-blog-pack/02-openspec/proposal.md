## Why

200IQ LABS PSA prowadzi pre-revenue spółkę z produktem Qamera AI i ~150k PLN cash przy burnie ~16-17k PLN/mc — runway ~9-10 miesięcy. Obecny `context/finances.md` to statyczny snapshot bez wymiaru czasu (planu na przyszłe miesiące) ani wymiaru wykonania (rzeczywiste wydatki vs plan). Bez systemu śledzącego P&L w czasie nie da się ani świadomie zarządzać runway, ani podejmować decyzji o nowych wydatkach (hire, kampania, SaaS) z kontekstem ich wpływu na biznes. Czerwiec 2026 przynosi confirmed emisję akcji 100k PLN, w maju trzeba rozliczyć ~24k zaległych UoD — bez modelu accrual + cash flow te zdarzenia rozjadą każdą prymitywną metrykę.

## What Changes

- Wprowadzenie struktury `context/finances/` jako żywego systemu planowania budżetu i śledzenia jego egzekucji (P&L, cash flow, financing — rozdzielone)
- Plan na 8 miesięcy 2026 (maj-grudzień) w `budget-2026.yaml` z bootstrap'em hybrydowym (run-rate seed z marca-kwietnia + bottom-up correction)
- Ewidencja zobowiązań zaległych (`accrued-liabilities.yaml`) i aktywności kapitałowych (`cash-flow-2026.yaml`) — emisja akcji i pożyczki wspólników jako financing, NIE revenue
- Workflow miesięcznego close (`/finances close YYYY-MM`) — 6 faz: pull → classify → review → accruals check → commit → regenerate
- Hybrydowa klasyfikacja transakcji: deterministyczne reguły (`rules.yaml`) + LLM fallback z few-shot examples — z learning loop, gdzie korekta człowieka tworzy nową regułę
- Caps na variable categories (ads, AI usage, marketing/legal one-offs) z tolerance band ±20%, post-close (bez mid-month polling)
- Auto-generated dashboardy: `_dashboard.md` (5 sekcji: cash/runway → P&L mc → YTD → forecast → alerts), `_alerts.md`, `_runway.md`
- Manual-first podejście — auto-pull z Stripe/Revolut/inFakt i cron-trigger jako future iterations po 2-3 udanych close'ach
- Cross-reference z `context/operations/tech-stack/_dashboard.md` jako źródłem dla linii "OPEX SaaS" (nie duplikacja)
- CFO skill staje się czytelnikiem tych plików (generic skill, integracja przez dane — nie hardkod ścieżek)

## Capabilities

### New Capabilities
- `finances-budget-plan`: Wieloletni/wielomiesięczny plan P&L w accrual basis — struktura kategorii, business unit tagging, plan bootstrap z run-rate seed + bottom-up correction, caps z tolerance band na variable categories
- `finances-cash-flow`: Cash flow tracking rozdzielony od P&L — financing activities (emisja akcji, pożyczki wspólników), accrued liabilities (zaległe zobowiązania), runway forecast jako pochodna burn + financing − accruals payments
- `finances-monthly-close`: Workflow comiesięcznego zamknięcia okresu — 6 faz (pull, classify, review, accruals check, commit, regenerate), hybrydowa klasyfikacja transakcji rules+LLM z learning loop, monthly narrative w MD jako obowiązkowa decyzyjna pamięć firmy
- `finances-reporting`: Auto-generated dashboardy i alerty — `_dashboard.md` jako 30-sekundowy obraz kondycji biznesu, `_alerts.md` z przekroczeniami caps, `_runway.md` z cash position over time

### Modified Capabilities
<!-- Brak — pierwszy formalny system finansowy. context/finances.md pozostaje jako entry-point cross-referujący nowe pliki. -->

## Impact

- **Nowe pliki w repo**: `context/finances/` (10+ plików — yaml dane, md narracja, auto-generated dashboardy)
- **Cross-reference do istniejących**: `context/finances.md` (entry-point), `context/operations/tech-stack/_dashboard.md` (źródło SaaS recurring)
- **Skill changes**:
  - CFO skill (shared-skills) — extension żeby czytał nowe pliki na żądanie (generic, przez data paths)
  - Nowy skill/komenda `/finances` z subkomendami (`close`, `plan-bootstrap`, `review`, `regenerate`)
- **Tools**:
  - Generator skrypty pod `tools/finances/` (regen_dashboard.py, classify.py, pull_revolut.py, etc. — większość jako future iterations)
  - Pre-commit hook (analogicznie do tech-stack) regenerujący `_dashboard.md` przy zmianie plików yaml
- **External integracje** (planowane, future): Stripe (już obecne), Revolut OAuth (już w `tools/revolut/`), inFakt MCP, Santander manual
- **Convention update w `CLAUDE.md`**: Sekcja "Finances Management" — gdzie żyje plan, jak działa close, gdzie szukać runway
- **Brak breaking changes** — istniejący `finances.md` pozostaje, nowe pliki dochodzą obok
