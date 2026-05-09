# tools/finances

Pomocnicze tooling dla `/finances close YYYY-MM` workflow.

**Stan:** lekki (MVP) — nie ma własnych pull skryptów, bo wykorzystujemy istniejące w `shared-skills/skills/cfo/scripts/` i MCP inFakt.

## Źródła danych dla PHASE 1 PULL

| Źródło | Mechanizm | Komenda |
|--------|-----------|---------|
| **Revolut** | shared-skills CLI | `python shared-skills/skills/cfo/scripts/get_transactions.py --from YYYY-MM-01 --to YYYY-MM-DD` |
| **Stripe** | shared-skills CLI | `python shared-skills/skills/cfo/scripts/get_revenue.py --from YYYY-MM-01 --to YYYY-MM-DD --status paid` |
| **inFakt** | MCP | `mcp__claude_ai_inFakt__infakt_get_costs_list` (filter: `gross_invoice_date_gte/lte`) |
| **Tech-stack SaaS** | Cross-ref | `context/operations/tech-stack/_dashboard.md` → fixed total minus inFakt (1044) = **1633 PLN/mc** |

Pełen workflow PULL: zobacz `skills/finances/SKILL.md` sekcja PHASE 1.

## Prerequisites

### Revolut OAuth (jednorazowo)

```bash
cd tools/revolut
cp .env.example .env  # uzupełnij REVOLUT_CLIENT_ID
python authorize.py    # OAuth flow w przeglądarce
# Refresh token zostaje zapisany do .env, ważny 90 dni
```

### Stripe API key

```bash
cd tools/stripe
cp .env.example .env  # uzupełnij STRIPE_SECRET_KEY
```

### inFakt MCP

Skonfigurowany w `~/.claude/settings.json` (mcpServers). Sprawdź dostępność:
- `mcp__claude_ai_inFakt__*` powinno być widoczne na liście tooli w sesji.

## Future iterations

Po 2-3 udanych manualnych close'ach (z OpenSpec change `finances-budget-tracker`, group 8):

- `pull.py` — orkiestrator wywołujący wszystkie 3 źródła i agregujący do `transactions/<mc>.yaml`
- `classify.py` — silnik klasyfikacji (rules-first + LLM fallback)
- `regen_dashboard.py`, `regen_runway.py`, `regen_alerts.py` — generatory dashboardów
- `close.py` — orkiestrator 6 faz close
- Pre-commit hook regenerujący `_dashboard.md`

Patrz `openspec/changes/finances-budget-tracker/tasks.md` group 8-9 dla pełnej listy.

## .env

Brak własnego `.env` — wykorzystujemy `tools/stripe/.env` i `tools/revolut/.env`. Jeśli w przyszłości dojdą własne kredencjały (np. inFakt API direct, jeśli MCP zawiedzie), dodać `tools/finances/.env.example`.
