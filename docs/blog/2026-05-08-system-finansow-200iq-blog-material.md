# System finansów 200IQ LABS — materiał na bloga

> **Generated:** 2026-05-08
> **Źródła:** `context/finances/`, `context/operations/finances-budget-process.md`, `CLAUDE.md`, `openspec/changes/finances-budget-tracker/`
> **Status danych:** po pierwszym manualnym close (kwiecień 2026), wykonanym 2026-05-04

Kompilacja wszystkich informacji o systemie planowania budżetu i śledzenia P&L zbudowanym dla 200IQ LABS PSA. Materiał roboczy do bloga — konkrety, liczby, decyzje, mechanika.

---

## 1. Kontekst — po co to powstało

**200IQ LABS PSA** — pre-revenue spółka technologiczna (prosta spółka akcyjna) rozwijająca **Qamera AI** (wcześniej Shorts Lab), SaaS do generowania zdjęć i wideo produktowych ("virtual photo studio"). Cofounderzy: Paweł Lipowczan (CTO) i Przemek Trybała (CEO).

Najważniejsza liczba w pre-revenue spółce to **"kiedy umrę"** — runway. Bez systemu śledzącego P&L w czasie nie da się świadomie zarządzać runwayem. Formalna księgowość idzie przez inFakt + księgową — ale to compliance, nie zarządzanie. Dlatego powstał system **zarządczy**: dostarcza danych do decyzji "czy stać nas na X", "czy plan jest realny", "kiedy break-even".

**Trzy cele systemu:**
1. **Forecast tracking** — runway monitoring: ile zostało miesięcy do zera
2. **Budget caps** — limity per variable category z tolerance band
3. **Decision support** — świadome tak/nie dla nowych wydatków

---

## 2. Filozofia systemu

Pięć zasad projektowych, które kształtują wszystko poniżej:

- **P&L na accrual basis** — koszt zapisany w miesiącu powstania obowiązku, nie w miesiącu płatności. Cash flow trzymany oddzielnie. Bez tego nie da się porównać miesięcy (UoD luty-kwiecień zostały wypłacone dopiero w maju — w cash basis luty by wyglądał jak zerowy burn).
- **Plan = żywy dokument** — korygowany po każdym close gdy run-rate się zmienia. Plan nie jest święty. Złota zasada: **drift > 30% = wymaga rewizji**.
- **Hybrydowa klasyfikacja**: rules-first deterministycznie, LLM-fallback z few-shot examples. Każda korekta człowieka tworzy regułę — system konwerguje do deterministyczności w czasie.
- **Manual first, automate after pain** — pierwsze 2-3 close'y manualnie, dopiero potem skrypty Python. Bez manualnego close'a nie wiesz co automatyzować.
- **Upraszczać co się da bez utraty pełnego obrazu** — jeśli linia/wymiar nie zmienia decyzji, wycinamy.

**Wniosek dla blogu:** klasyczne grzechy systemów budżetowych to over-engineering na początku (Notion z 50 widokami) i automatyzacja przed zrozumieniem. Ten system idzie odwrotnie.

---

## 3. Struktura plików

```
context/finances/
├── README.md                  # Konwencje, filozofia, workflow close
│
├── budget-2026.yaml           # Plan P&L na rok (accrual basis), status: draft|active
├── cash-flow-2026.yaml        # Financing events + planowane payouts accruals
├── accrued-liabilities.yaml   # Zobowiązania powstałe (P&L), nieopłacone (cash)
├── caps.yaml                  # Limity per variable category z tolerance band
├── rules.yaml                 # Deterministyczne reguły klasyfikacji (rośnie z czasem)
├── examples.yaml              # Few-shot examples dla LLM fallback
│
├── transactions/
│   └── 2026-MM.yaml           # Raw + classified, 1 plik per miesiąc
│
├── monthly/
│   └── 2026-MM.md             # Komentarz zarządczy, decyzje, lessons learned
│
├── _dashboard.md              # AUTO entry point: cash → P&L mc → YTD → forecast → alerts
├── _alerts.md                 # AUTO caps przekroczenia, pending klasyfikacje
└── _runway.md                 # AUTO cash position over time
```

Pliki `_*` mają sekcje oznaczone markerami:

```markdown
<!-- AUTO:START -->
... treść regenerowana ...
<!-- AUTO:END -->
```

Treść poza markerami przetrwa regenerację — można dopisywać własne notatki.

---

## 4. Trzy oddzielne warstwy: P&L, cash flow, financing

| Pojęcie | Plik | Co tu trafia |
|---------|------|--------------|
| **P&L (accrual)** | `budget-2026.yaml`, `transactions/<mc>.yaml` | Revenue, COGS, OPEX — koszt w miesiącu obowiązku |
| **Cash flow** | `cash-flow-2026.yaml`, `_runway.md` | Timing płatności, financing inflows, accruals payments |
| **Accrued liabilities** | `accrued-liabilities.yaml` | Zobowiązania powstałe ale nieopłacone |
| **Financing** | `cash-flow-2026.yaml` (sekcja `financing`) | Emisja akcji, pożyczki wspólników — **NIE revenue** |

**Klasyczny błąd, którego unika ten system:** emisja akcji 100k PLN nie jest revenue. To zmiana struktury kapitału. EBITDA jej nie odzwierciedla, cash position — tak. Mieszanie tego w jednym worku jest najczęstszą przyczyną złudzenia "zarabiamy" w pre-revenue.

---

## 5. Kategorie P&L

```
REVENUE
  ├─ revenue/subscriptions       (MRR Qamera — Starter 49 PLN, Pro 399 PLN)
  ├─ revenue/credits             (pay-per-use credit packs)
  └─ revenue/managed             (managed service per produkt — pilot LAVEL 50 PLN/produkt)

COGS — koszty wytworzenia przychodu
  ├─ cogs/ai-generation          (Byteplus Kling, Pollo, Replicate, GCP compute)
  ├─ cogs/hosting                (faktycznie 0 — hosting w opex/saas, Cloudflare to opex/admin)
  └─ cogs/payment-fees           (Stripe waiver, FX cost ~20 PLN/przelew)

OPEX
  ├─ opex/people                 (UoD Paweł 4k + Przemek 4k = 8k/mc)
  ├─ opex/marketing              (Meta ads — wyłączane od maja, nowa strategia TBD)
  ├─ opex/saas                   (tech-stack: Cursor, Vercel, Supabase, ClickUp, Hunter, Workspace, ...)
  ├─ opex/office                 (rent przez PLSoft 615 PLN/mc)
  ├─ opex/admin                  (inFakt 1044 + Revolut 100 + domeny 50 ≈ 1194/mc)
  └─ opex/legal                  (Creativa, Smolski — Rejestr Akcjonariuszy, notariusz)

BELOW THE LINE
  ├─ tax                         (CIT 0 dopóki strata, VAT kompensowany)
  └─ one-off                     (jednorazowe duże, nieklasyfikowalne)
```

**Detale architektoniczne, które warto pokazać na blogu:**
- `cogs/hosting` ≈ 0 PLN — Vercel siedzi w `opex/saas`, Cloudflare to **domeny** (`opex/admin`), nie hosting. Dyscyplina nazewnicza zapobiega podwójnym księgowaniom.
- `opex/saas` ma single source of truth: `context/operations/tech-stack/_dashboard.md`. Plan to **1633 PLN/mc** = tech-stack total (2677) − inFakt (1044, w opex/admin). Cross-reference zamiast duplikacji.

---

## 6. Plan budżetu — `budget-2026.yaml`

Każda kategoria ma:
- `description` — co dokładnie wchodzi w skład
- tag business unit (`qamera` | `200iq` | `""` = shared)
- 12 miesięcy × `{ value, note }` — wartość + uzasadnienie

Status planu: `draft` (po bootstrap) lub `active` (po `/finances plan-finalize`). Przejście wymaga przeglądu linia po linii.

**Wybrane liczby z planu 2026 (po korekcie post-close kwiecień):**

| Mc | Plan revenue | Plan costs | Plan EBITDA |
|---|---:|---:|---:|
| 2026-05 | 1196 | 13742 | −12546 |
| 2026-06 | 1493 | 13742 | −12249 |
| 2026-07 | 4190 | 11912 | −7722 |
| 2026-08 | 7187 | 12312 | −5125 |
| **2026-09** | **12184** | **12842** | **−658 (target break-even)** |
| 2026-10 | 16181 | 13842 | +2339 |
| 2026-11 | 19178 | 14342 | +4836 |
| 2026-12 | 22175 | 15042 | +7133 |

Target break-even: **wrzesień 2026**. Plan agresywny — wymaga walidacji w kolejnych close'ach.

---

## 7. Workflow miesięcznego close — 6 faz

`/finances close YYYY-MM` — komenda skill'a `finances`. Każda faza jest **idempotentna** (restart po awarii nie duplikuje danych). Wykonywany w pierwsze 5 dni po końcu miesiąca.

### PHASE 1: PULL (~2 min)
Agreguje dane ze źródeł:
- **Revolut** → skrypt CFO (`get_transactions.py`)
- **Stripe** → skrypt CFO (`get_revenue.py --status paid`)
- **inFakt** → MCP `infakt_get_costs_list`
- **Tech-stack SaaS** → cross-ref z `context/operations/tech-stack/_dashboard.md`

→ `transactions/YYYY-MM.yaml` (raw)

### PHASE 2: CLASSIFY (auto, ~30s)
1. **Rules-first** (`rules.yaml`) — deterministyczne pattern matching
2. **LLM fallback** dla nieznanych — z few-shot examples z `examples.yaml`

Raport: "X auto-classified (Y%), Z wymaga review".

### PHASE 3: REVIEW (interactive, ~10-15 min)
Pętla per LLM-classified transakcja. Cztery decyzje:

| Opcja | Kiedy używać |
|-------|--------------|
| `[a]ccept` | LLM zgadł, ale to jednorazowy przypadek |
| `[c]hange` | LLM się pomylił, ręczna korekta |
| `[r]ule` | Akceptuje + tworzy regułę dla podobnych — **preferowane** |
| `[s]kip` | Nie wiesz co to, wracamy w następnym close |

**Złota zasada REVIEW:** jeśli transakcja prawdopodobnie się powtórzy → `[r]ule`. 30 sekund teraz, oszczędzasz minuty przez kolejne miesiące. To jest **learning loop**.

### PHASE 4: ACCRUALS CHECK (auto + verify, ~2 min)
System porównuje classified transactions z `accrued-liabilities.yaml`:
- Match (kategoria + kwota + payee) → `pending` → `paid` z datą
- Multi-match → user wybiera który accrual

### PHASE 5: COMMIT (~10-20 min — najważniejsza faza dla zarządu)
System otwiera `monthly/<YYYY-MM>.md` w edytorze. **Obowiązkowy komentarz zarządczy** w 3 sekcjach:

1. **Co się działo niespodziewanego (vs plan)** — konkrety
2. **Decyzje podjęte w trakcie miesiąca** — co robimy inaczej
3. **Plan na następny miesiąc / korekta planu** — co zmieniamy

**Pusty narrative blokuje close.** Bez tego za pół roku nie wiemy dlaczego coś było.

### PHASE 6: REGENERATE (auto, ~30s)
Odświeża 3 dashboardy (`_dashboard.md`, `_alerts.md`, `_runway.md`) wewnątrz markerów AUTO.

---

## 8. Learning loop — najważniejszy mechanizm

To jest serce systemu i prawdopodobnie najmocniejszy temat na blog.

**Problem klasyczny:** każdy miesiąc klasyfikujesz te same Cursory, Vercele, Meta Pay'e ręcznie. Praca rośnie liniowo z liczbą miesięcy.

**Rozwiązanie:** opcja `[r]ule` w REVIEW:
1. Akceptuje propozycję LLM dla bieżącej transakcji
2. Tworzy nową regułę w `rules.yaml` (pattern z `memo`/`merchant`)
3. Następny close — ta sama transakcja wpada w "auto-classified" deterministycznie

**Przykład reguły z `rules.yaml`:**

```yaml
- id: vercel-infakt
  pattern:
    memo: "7788D1EF"
    source: infakt
  classify:
    category: opex/saas
    unit: qamera
  note: "Faktury Vercel w inFakt mają prefix 7788D1EF (faktura nie zawsze ma 'vercel' w nazwie)"
  created_at: 2026-05-04
```

**Pierwszy close (kwiecień 2026)** wytworzył **30+ reguł** z zera — duży boost. Z czasem `rules.yaml` pokrywa 90%+, LLM wywoływany rzadko.

**Trzy typy reguł, które się ujawniły w pierwszym close:**
1. **Po memo** — czyste pattern matching (Byteplus, Cursor, Meta Pay)
2. **Po prefiksie faktury inFakt + kwocie** — np. `GCPLD` z `amount_range: [500, ∞]` to compute (cogs), z `[200, 500]` to Workspace (opex/saas). Ten sam vendor, dwie kategorie.
3. **Po reseller pattern** — Paddle 24 EUR ≈ 100 PLN to n8n cloud. Ale Paddle z inną kwotą = REVIEW (może być inny produkt).

System konwerguje od probabilistycznego (LLM zgaduje) do deterministycznego (rule matchuje). To rzadki design — większość narzędzi do kategoryzacji budżetu albo jest w 100% deterministyczna (sztywne reguły, dużo manuala) albo w 100% probabilistyczna (LLM/ML, brak audytowalności).

---

## 9. Caps z tolerance band — `caps.yaml`

Limity tylko dla variable categories (recurring jak SaaS, rent, UoD nie są objęte — tam plan = wartość, nie limit).

**Tolerance band:**
- `actual ≤ cap` → ✅ w normie
- `cap < actual ≤ cap × (1 + tolerance)` → ⚠️ warning
- `actual > cap × (1 + tolerance)` → 🚨 alert

**Aktualne capy:**

| Kategoria | Cap | Tolerance | Note |
|---|---:|---:|---|
| `opex/marketing` | 1500/mc | 30% | Ads bywają zmienne — luz na testy |
| `cogs/ai-generation` | 1000/mc | 50% | AI usage zależy od user activity — duża tolerancja |
| `one-off` | 500/mc | 20% | Sygnał gdy systematycznie rośnie = ukryta nowa kategoria |
| `opex/legal` | 5000/Q | 30% | Legal idzie skokowo (kancelarie, notariusz, rejestr) |

**Brak mid-month polling** — caps są post-close (PHASE 6 REGENERATE). Świadoma decyzja: live monitoring zachęca do micro-decyzji "ojej, 80% capa, hamuję" — co zwykle jest gorsze niż świadome przekroczenie z uzasadnieniem w `monthly/<mc>.md`.

---

## 10. Konkretny snapshot — kwiecień 2026 (pierwszy close)

Realne liczby pokazują system w działaniu.

### Cash position
- Cumulative shareholder loans (Paweł): **74300 PLN** (10k Feb + 10k Mar + 300+20k+34k Apr)
- Confirmed financing czerwiec emisja: **+100000 PLN**
- Accrued liabilities (UoD luty-kwiecień, payout maj): **−24000 PLN**
- End cash kwiecień: **~+47540 PLN**
- Run-rate burn: ~14-14.5k PLN/mc z UoD
- Runway: przed emisją tight; po emisji 100k → ~5-7 mc

### P&L April 2026

| Linia | Actual | Plan | Δ |
|---|---:|---:|---:|
| **Revenue** | **347** | **598** | **−42%** |
| revenue/credits | 347 | 0 | +347 (3 pakiety: VMP GROUP 249+49 + Feba 49) |
| revenue/subscriptions | 0 | 98 | −98 (wszystkie pakiety to one-time) |
| revenue/managed | 0 | 500 | −500 (LAVEL via inna spółka — znane) |
| **Costs** | **17151** | **14242** | **+20%** |
| opex/people (accrual) | 8000 | 8000 | ✓ |
| opex/marketing | 2996 | 1500 | +100% 🔴 |
| opex/saas | 2112 | 1633 | +29% 🟡 |
| cogs/ai-generation | 1709 | 700 | +144% 🔴 |
| opex/admin | 1119 | 1194 | −6% |
| opex/office | 615 | 615 | ✓ |
| opex/legal | 600 | 600 | ✓ |
| **EBITDA** | **−16804** | **−13644** | **−3160** |

### Trzy decyzje wynikające z close'a

1. **GCP +144% vs plan** → Plan był błędny (700 PLN), realny run-rate to 1000-1600 PLN/mc. Plan May-Dec podniesiony do 1500-1800 PLN. **GCP nie będzie teraz optymalizowany** — świadoma decyzja, bo część tego to content marketingowy (own + materiały dla klientów). Klasyfikacja "to faktycznie marketing" nie zmienia kategorii (GCP zostaje w `cogs/ai-generation`), ale uzasadnia wyższy plan.

2. **Cursor billowany 4×/mc** (716 PLN vs plan 217) → decyzja: prawdopodobna **migracja Cursor → Claude** (sztywny cap ~90 EUR/mc = ~390 PLN). Przewidywalny koszt zamiast usage-based.

3. **Meta Ads off od maja** — strategia była błędna, kierunek do dopracowania. Action: potwierdzić w close maja że spend < 300 PLN.

---

## 11. Rola, kto co robi

| Rola | Odpowiedzialność |
|------|------------------|
| **Paweł (CTO)** | Wykonanie close (PHASE 1-4), edycja `budget-2026.yaml`, utrzymanie `rules.yaml` |
| **Przemek (CEO)** | Konsultacja przy klasyfikacji marketing/sales, walidacja revenue targets |
| **CFO skill (AI agent)** | Czytanie systemu na żądanie ("ile mam runway", "co z budżetem ads"). Generic — czyta pliki `context/finances/`, nie pisze |

CFO skill jest częścią shared-skills repo i nie hardkoduje ścieżek — integracja idzie przez dane (pliki YAML/MD), nie przez kod.

---

## 12. Roadmap

1. ✅ Setup struktury i schemas — May 2026
2. ✅ Plan bootstrap (recurring + variable seed) — May 2026
3. ✅ Wpis znanych accruals (UoD) i financing (emisja czerwiec) — May 2026
4. ✅ Pierwszy manual close (April 2026) — wykonany 2026-05-04
5. 🔜 Drugi manual close (May 2026) — początek czerwca
6. 🔜 Generator skrypty Python — po 2-3 manualnych close'ach
7. 🔜 Auto-pull (Stripe / Revolut / inFakt) — po stabilizacji generatorów
8. 🔜 CFO skill integration — po pierwszym dashboard

---

## 13. Możliwe wątki na bloga

W zależności od długości i kąta tekstu:

**Wątek A — "Manual first, automate after pain"**
Jak zbudować system finansowy w pre-revenue spółce, gdy nie wiesz jeszcze co automatyzować. Pierwsze close ujawniło 30+ patternów do zakodowania. Bez manualnego close'a połowa z nich byłaby zaprojektowana źle (np. założenie że GCP to tylko compute — okazało się że jest też Workspace billing, dwie kategorie z jednego źródła).

**Wątek B — "Hybrid classification: rules + LLM, konwergencja do deterministyczności"**
Architektura uczącego się systemu klasyfikacji wydatków. Dlaczego pure-LLM jest złym pomysłem (audyt, koszty, niedeterminizm), dlaczego pure-rules też (cold start, każdy nowy vendor = manual). Trzecia droga: LLM jako fallback, każda akceptacja LLM-a może natychmiast zostać zamrożona w regule.

**Wątek C — "P&L vs cash flow vs financing — trzy oddzielne księgi"**
Pre-revenue spółka, która miesza te trzy warstwy, żyje w iluzji. Emisja akcji 100k PLN to nie revenue. UoD wypłacone z 3-miesięcznym opóźnieniem to nie zerowy burn w lutym. Pokazanie konkretnych pułapek na konkretnych liczbach 200IQ.

**Wątek D — "Plan jako żywy dokument"**
Drift > 30% = rewizja. Pierwszy close pokazał plan GCP 700 PLN błędny — historyczny run-rate to 1000-1600. Plan May-Dec podniesiony retroaktywnie z komentarzem `note:` w YAMLu. To jest **inwersja** klasycznego "plan na rok, trzymamy się go" — plan jest hipotezą, każdy close ją weryfikuje.

**Wątek E — "Komentarz zarządczy jako obowiązek"**
PHASE 5 COMMIT wymaga narrative w `monthly/<mc>.md`. Pusty blokuje close. Dlaczego: za pół roku patrząc na variance EBITDA −3160 vs plan, sam dashboard nie powie ci dlaczego. Trzy obowiązkowe sekcje (niespodzianki / decyzje / plan na dalej) to minimalna ilość kontekstu, żeby decyzje miały trwałą pamięć.

**Wątek F — "Single source of truth dla SaaS — cross-references zamiast duplikacji"**
`opex/saas` w `budget-2026.yaml` nie ma listy narzędzi — ma cross-reference do `context/operations/tech-stack/_dashboard.md`. Dlaczego: lista narzędzi zmienia się co miesiąc (nowy SaaS, anulowany SaaS), aktualizować w dwóch miejscach = błąd zaprogramowany.

---

## 14. Cytaty / liczby kluczowe (do wyciągnięcia w blogu)

- "Najważniejsza liczba w pre-revenue spółce to **kiedy umrę**."
- "Plan = żywy dokument. Plan nie jest święty. **Drift > 30% = rewizja**."
- "Manual first, automate after pain. **Pierwsze 2-3 close'y manualnie** — wtedy wiemy CO automatyzować."
- "Pusty narrative **blokuje close**. Bez tego za pół roku nie wiemy dlaczego coś było."
- Pierwszy close wytworzył **30+ reguł** z zera.
- Target break-even: **wrzesień 2026** (revenue 12.2k vs costs 12.8k).
- Cumulative shareholder loans (Paweł, luty-kwiecień): **74300 PLN**.
- Confirmed financing czerwiec emisja: **+100000 PLN**.
- Cash flow w kwietniu: **inflow 58591 PLN** (4291 revenue + 54300 loans), **outflow ~14600 PLN** (recurring bez UoD pending), net **+44000 PLN** — przygotowanie cash na maj.

---

## 15. Code samples — konkretne snippety YAML

Realne fragmenty z systemu — gotowe do wklejenia w bloga jako ilustracja architektury.

### 15.1. Plan budżetu — `budget-2026.yaml`

Każda kategoria ma `description`, tag business unit (`qamera` | `200iq` | `""`), 12 miesięcy `{ value, note }`. Notki w polu `note` to **historia decyzji** — przetrwają korekty, dają kontekst za pół roku.

```yaml
year: 2026
status: draft

categories:

  revenue/subscriptions:
    description: |
      MRR Qamery — subskrypcje SaaS:
        - Starter: 49 PLN/mc
        - Pro: 399 PLN/mc
      Plan zakłada wzrost o 2 Starter + 1 Pro miesięcznie od czerwca.
    qamera:
      "04": { value: 98,   note: "2 suby Starter (49 × 2)" }
      "05": { value: 196,  note: "4 suby Starter — sprzedaż bezpośrednia rusza" }
      "06": { value: 693,  note: "6 Starter (294) + 1 Pro (399). Wzrost: +2 Starter +1 Pro" }
      "09": { value: 2184, note: "12 Starter (588) + 4 Pro (1596)" }
      "12": { value: 3675, note: "18 Starter (882) + 7 Pro (2793)" }

  cogs/ai-generation:
    description: |
      AI APIs używane w produkcji output-u Qamery — usage-based:
        - BytePlus (Kling AI dla video)
        - Pollo.ai, Replicate
        - GCP (compute usage) — 1000-1600 PLN/mc historycznie

      ✅ KOREKTA po close 2026-04: plan 700 PLN był błędny.
         Realny run-rate GCP = 1000-1600 PLN. Plan May-Dec podniesiony.
    qamera:
      "04": { value: 1700, note: "Actual: 1709 (1692 GCP + 18 BytePlus). Plan 700 błędny — skorygowane retro." }
      "05": { value: 1800, note: "GCP 1500 + ramp BytePlus + content marketingowy" }
      "12": { value: 3800, note: "" }
```

**Co warto zauważyć:**
- `description` w YAMLu (block scalar `|`) to **inline dokumentacja** — kategoria sama opisuje co w nią wchodzi. Bez tego po pół roku nie wiesz czy "opex/saas" obejmuje Cursora.
- Pole `note: "Actual: 1709. Plan 700 błędny — skorygowane retro."` — korekta planu zostawia ślad. Nie nadpisujesz historii, dopisujesz uzasadnienie.

### 15.2. Reguły klasyfikacji — `rules.yaml`

Pattern matching deterministyczny, audytowalny. Każda reguła ma `id`, `pattern` (memo / merchant / source / amount_range), `classify` (category + unit) i `note` (dlaczego).

```yaml
rules:

  # ============================================================
  # COGS — AI generation (usage-based)
  # ============================================================

  - id: byteplus
    pattern:
      memo: "byteplus"
    classify:
      category: cogs/ai-generation
      unit: qamera
    note: "Byteplus = provider Kling AI (video generation)"
    created_at: 2026-05-04

  - id: gcp-compute
    pattern:
      memo: "google cloud"
      source: revolut
      amount_range: [200, 999999]
    classify:
      category: cogs/ai-generation
      unit: qamera
    note: "Google Cloud >200 PLN = compute usage dla pipeline'u Qamery (nie Workspace)"
    created_at: 2026-05-04

  # ============================================================
  # OPEX SaaS — fixed monthly subscriptions
  # ============================================================

  - id: gworkspace-via-gcp
    pattern:
      memo: "GCPLD"
      source: infakt
      amount_range: [200, 500]
    classify:
      category: opex/saas
      unit: null
    note: "Google Workspace billowane przez Google Cloud Poland (300-330 PLN/mc)"
    created_at: 2026-05-04

  - id: gcp-infakt
    pattern:
      memo: "GCPLD"
      source: infakt
      amount_range: [500, 999999]
    classify:
      category: cogs/ai-generation
      unit: qamera
    note: "Faktury GCP w inFakt z prefiksem GCPLD i kwotą >500 PLN = compute"
    created_at: 2026-05-04

  - id: paddle-n8n
    pattern:
      memo: "paddle"
      source: revolut
      amount_range: [50, 200]
    classify:
      category: opex/saas
      unit: null
    note: "Paddle 24 EUR ≈ 100 PLN = n8n cloud. UWAGA: Paddle to reseller — gdy inna kwota, REVIEW."
    created_at: 2026-05-04
```

**Najmocniejszy wątek do pokazania na blogu:** dwie reguły dla tego samego vendora (`GCPLD` w inFakt) rozdzielone przez `amount_range`. 200-500 PLN → Workspace (opex/saas), >500 PLN → compute (cogs/ai-generation). Ten sam dostawca, dwie kategorie, jedna deterministyczna reguła. Konflikt reguł (dwie matchują tę samą transakcję) → REVIEW.

### 15.3. Few-shot examples dla LLM — `examples.yaml`

Gdy żadna reguła nie matchuje, LLM dostaje few-shot prompt z reprezentatywnymi przykładami per kategoria. Każdy example ma **`reasoning`** — LLM uczy się wzorców, nie tylko wartości, i to `reasoning` user widzi w REVIEW.

```yaml
examples:

  # ---- Revenue ----
  - transaction:
      date: 2026-04-15
      amount: 49.00
      memo: "Stripe payment: customer_xyz subscription Starter"
      source: stripe
    classification:
      category: revenue/subscriptions
      unit: qamera
    reasoning: "Stripe subscription płatność = recurring revenue Qamery (Starter 49 PLN/mc)"

  # ---- COGS ----
  - transaction:
      date: 2026-04-10
      amount: -127.40
      memo: "BYTEPLUS API USAGE PAY-AS-YOU-GO"
      source: revolut
    classification:
      category: cogs/ai-generation
      unit: qamera
    reasoning: "Byteplus to provider Kling AI używany do generacji video w produkcie"

  # ---- OPEX People (UoD) ----
  - transaction:
      date: 2026-05-12
      amount: -4000.00
      memo: "Wynagrodzenie UoD - Paweł Lipowczan"
      source: revolut
    classification:
      category: opex/people
      unit: null
    reasoning: "UoD cofounderowi = opex/people. Nie taguj qamera bo to shared spółki."
```

### 15.4. Caps z tolerance band — `caps.yaml`

Limity dla variable categories. Recurring (UoD, rent, SaaS) NIE są objęte — tam plan = wartość, nie limit.

```yaml
defaults:
  tolerance: 0.20   # ±20% domyślnie

caps:

  opex/marketing:
    monthly_cap: 1500
    tolerance: 0.30
    note: "Ads bywają zmienne (testy kreatywów, scaling), daję więcej luzu"
    applies_from: 2026-05

  cogs/ai-generation:
    monthly_cap: 1000
    tolerance: 0.50
    note: "AI usage zależy od user activity — duża tolerancja, monitoring trendu"
    applies_from: 2026-05

  one-off:
    monthly_cap: 500
    tolerance: 0.20
    note: "Sygnał gdy rośnie systematycznie (= ukryta nowa kategoria)"
    applies_from: 2026-05

  opex/legal:
    quarterly_cap: 5000
    tolerance: 0.30
    note: "Legal idzie skokowo (kancelarie, notariusz, rejestr). Q-wise sensowniejsze."
    applies_from: 2026-Q2
```

**Tolerance band logic:**
- `actual ≤ cap` → ✅ w normie
- `cap < actual ≤ cap × (1 + tolerance)` → ⚠️ warning
- `actual > cap × (1 + tolerance)` → 🚨 alert

Quarterly cap dla `opex/legal` to świadoma decyzja: kancelarie billują skokowo (notariusz w jeden miesiąc, rejestr akcjonariuszy w drugi), monthly cap byłby albo zawsze przekroczony albo bezsensownie wysoki.

### 15.5. Accrued liabilities — `accrued-liabilities.yaml`

Zobowiązania powstałe (P&L już je ujmuje), ale jeszcze nieopłacone. Po płatności → ACCRUALS CHECK podczas close oznacza jako `paid`.

```yaml
liabilities:

  - id: uod-pawel-2026-02
    description: "UoD Paweł Lipowczan — luty 2026"
    amount: 4000
    currency: PLN
    payee: "Paweł Lipowczan"
    category: opex/people
    accrued_in: 2026-02
    planned_payment: 2026-05
    status: pending

  - id: uod-pawel-2026-03
    description: "UoD Paweł Lipowczan — marzec 2026"
    amount: 4000
    currency: PLN
    payee: "Paweł Lipowczan"
    category: opex/people
    accrued_in: 2026-03
    planned_payment: 2026-05
    status: pending

  # ... (analogicznie kwiecień + Przemek × 3 mc)
  # 6 × 4000 PLN = 24000 PLN payout planowany na maj
```

**Najważniejsza pointa do pokazania:** w cash basis luty wyglądałby jak miesiąc z 0 PLN burnu na people. W accrual basis luty pokazuje 8000 PLN (UoD obowiązek powstał w lutym, niezależnie od kiedy zostanie wypłacony). Z perspektywy "ile naprawdę wydaje firma" — accrual jest jedyną prawdą.

### 15.6. Cash flow + financing — `cash-flow-2026.yaml`

Oddzielnie od P&L. Tu siedzą rzeczy, które wpływają na cash position bez wpływu na EBITDA: pożyczki wspólników, emisja akcji, payouts accruals.

```yaml
year: 2026

financing:

  # ---- Pożyczki wspólników (zrealizowane) ----
  - date: 2026-04-28
    type: shareholder_loan
    amount: 20000
    currency: PLN
    lender: "Paweł Lipowczan"
    status: realized
    reference: "Transfer Revolut 'From PAWEL L'"
    note: "Przygotowanie cash na rozliczenie zaległych UoD (planowane maj 24000 PLN)"

  - date: 2026-04-29
    type: shareholder_loan
    amount: 34000
    currency: PLN
    lender: "Paweł Lipowczan"
    status: realized
    reference: "Transfer Revolut 'From PAWEL L'"
    note: "Przygotowanie cash na maj (UoD payouts + bieżące koszty)"

  # ---- Emisja akcji (confirmed, czerwiec 2026) ----
  - date: 2026-06-30
    type: equity_issuance
    amount: 100000
    currency: PLN
    status: confirmed
    note: "Planowana emisja czerwiec 2026. Wpływ na cash, BEZ wpływu na EBITDA."

accruals_payments:

  - date: 2026-05
    amount: 24000
    currency: PLN
    status: planned
    note: "Rozliczenie 6 zaległych UoD: Paweł × 3 mc + Przemek × 3 mc"
    refs:
      - "accrued-liabilities.yaml::uod-pawel-2026-02"
      - "accrued-liabilities.yaml::uod-pawel-2026-03"
      - "accrued-liabilities.yaml::uod-pawel-2026-04"
      - "accrued-liabilities.yaml::uod-przemek-2026-02"
      - "accrued-liabilities.yaml::uod-przemek-2026-03"
      - "accrued-liabilities.yaml::uod-przemek-2026-04"
```

**Trzy statusy financing event:** `confirmed` (podpisane / pewne, wliczane do bazowego forecast), `planned` (intencja, opcjonalnie scenariusz "z/bez"), `realized` (cash już wpłynął/wypłynął).

**Pole `refs:`** to cross-references do `accrued-liabilities.yaml` przez ID. ACCRUALS CHECK podczas close używa ich do dopasowania faktycznej płatności do oczekiwanego accrual.

### 15.7. Auto-generated dashboard — `_dashboard.md`

Markery `<!-- AUTO:START -->` / `<!-- AUTO:END -->` chronią ręczne notatki przed nadpisaniem przy regeneracji.

```markdown
# 200IQ LABS — Finances Dashboard

> **Last updated:** 2026-05-04 (po close 2026-04)
> **Last close:** 2026-04 ([monthly/2026-04.md](monthly/2026-04.md))
> **Plan status:** `draft` (budget-2026.yaml — Przemek review przed plan-finalize)

<!-- AUTO:START -->

## 1. Cash position & runway

| Metryka | Wartość |
|---|---|
| Cumulative shareholder loans (od Pawła) | **74300 PLN** |
| Confirmed financing (czerwiec emisja) | +100000 PLN |
| Accrued liabilities (UoD luty-kwiecień, payout maj) | −24000 PLN |
| Run-rate burn (post-Meta-off, est.) | ~14-14.5k z UoD |
| Runway szacowany | po emisji 100k: ~5-7 mc |

## 5. Alerts

| Alert | Severity | Źródło |
|---|---|---|
| GCP +144% vs plan (1709 vs 700) | 🔴 high | close 2026-04 |
| Meta Ads jeszcze on w Apr (2750 PLN) | 🟡 medium | close 2026-04 (znany) |
| Cursor billowany 4×/mc (716 PLN) | 🟡 medium | rewizja planu opex/saas |

<!-- AUTO:END -->

## Notatki ręczne (poza markerami — przetrwają regenerację)

- 2026-05-04: pierwszy close systemu. Manual regeneracja dashboardów.
- Plan finalize: nie wykonano — tryb `draft` świadomie do kolejnego close.
```

**Kluczowy detal architektoniczny:** sekcja "Notatki ręczne" jest **poza** markerami AUTO. Każda regeneracja przepisuje tylko zawartość pomiędzy markerami, ręczne notatki przeżywają. To prosty pattern, ale w 90% systemów auto-generated docs go nie ma — i dlatego nikt tych dokumentów nie czyta (bo "i tak zostaną nadpisane").

---

## 16. Cross-references (do dalszego głębszego przeczytania)

- Konwencje + workflow techniczny: `context/finances/README.md`
- Procedura operacyjna (kto co kiedy, lessons learned): `context/operations/finances-budget-process.md`
- Snapshot finansowy (overview, linki do dashboardu): `context/finances.md`
- Source of truth dla SaaS: `context/operations/tech-stack/_dashboard.md`
- Specyfikacja systemu (4 capabilities — budget-plan, cash-flow, monthly-close, reporting): `openspec/changes/finances-budget-tracker/specs/`
- CFO skill (czyta system na żądanie): `shared-skills/skills/cfo/SKILL.md`
- Skill `/finances`: `skills/finances/SKILL.md` (auto-discoverable)
