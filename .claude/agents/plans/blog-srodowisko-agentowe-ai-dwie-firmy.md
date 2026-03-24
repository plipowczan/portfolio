# Plan: Moje środowisko agentowe — jak buduję AI OS dla dwóch firm

## Frontmatter

```yaml
---
id: 22
slug: srodowisko-agentowe-ai-dwie-firmy
title: "Moje środowisko agentowe — jak buduję AI OS dla dwóch firm"
excerpt: "Dwa repozytoria, osiem agentów, zero vendor lock-in. Jak zbudowałem system agentowy zarządzający finansami, prawem i marketingiem dwóch firm."
category: AI
author: Pawel Lipowczan
date: 2026-03-23
readTime: 14 min
image: /images/og-srodowisko-agentowe-ai-dwie-firmy.webp
tags:
  - AI
  - Claude Code
  - Agent Skills
  - Automatyzacja
  - Multi-Agent System
  - Git
---
```

## SEO Strategy

- **Primary keyword**: środowisko agentowe AI
- **Secondary keywords**: multi-agent system firma, agent skills standard, AI OS, Claude Code agenty
- **Long-tail**: jak zbudować środowisko agentowe dla firmy, agenci AI zarządzanie firmą
- **Internal links**: 4-5 links to related articles (Skills 2.0, Claude Code techniques, OpenClaw, OPSX, Second Brain)

## Article Structure

### Total target: ~3000 words (14 min read)

---

### 1. HOOK + INTRO (~350 words)

**Opening**: Start with the "morning scenario" — budzisz się, na telefonie czeka briefing od agenta. Ale zamiast jednego agenta, masz ośmiu — każdy zarządza innym obszarem Twojej firmy. To nie science fiction. Tak wygląda mój poranek od kilku tygodni.

**Bridge**: W [Skills 2.0](/blog/skills-2-0-multi-agent-system-zarzadzanie-firma) opisywałem jak zbudowałem system wieloagentowy. Teraz pokażę coś głębszego — jak to samo środowisko działa na **dwóch firmach jednocześnie** i dlaczego architektura za tym stojąca jest ważniejsza niż same agenty.

**Value preview**: W tym artykule zobaczysz:
- Architekturę trzech warstw (Skills → Context → Tools)
- Jak ten sam zestaw agentów obsługuje dwie różne firmy
- Dlaczego Git jest fundamentem zaufania do AI
- Jak to się ma do alternatyw (Perplexity Computer, OpenClaw, Claude Dispatch)

---

### 2. KONTEKST: DWIE FIRMY, JEDEN SYSTEM (~400 words) — H2

Krótkie przedstawienie dwóch repozytoriów:

**H3: 200IQ Labs (PSA)** — spółka technologiczna, produkt Qamera AI (wirtualne studio foto AI dla e-commerce), wdrożenia środowisk agentowych
- Agenci: CFO (z Revolut, Stripe, inFakt), Prawnik, Konsultant Biznesowy, Product Manager, LinkedIn Content, Marketing
- Integracje: Revolut Business API, Stripe API, inFakt API

**H3: PLSoft (JDG)** — jednoosobowa działalność, szkolenia/doradztwo/wdrożenia AI
- Te same shared-skills (CFO, Tax Advisor, Legal, Business Consultant)
- Dodatkowy: Coach The Five (Tomasz Karwatka)
- Newsletter Tech News Weekly (~700 subskrybentów)

**Kluczowy insight**: Te same agenty, różne konteksty. To nie jest copy-paste — to **architektura**.

---

### 3. ARCHITEKTURA: TRZY WARSTWY (~600 words) — H2

**ASCII diagram** (```text block):

```text
┌─────────────────────────────────────┐
│  IDE (Claude Code / Cursor / etc.)  │  ← Interfejs użytkownika
├─────────────────────────────────────┤
│  Skills (SKILL.md + references/)    │  ← Wiedza domenowa (przenośna)
├─────────────────────────────────────┤
│  Context (context/*.md)             │  ← Dane firmowe (unikalne per firma)
├─────────────────────────────────────┤
│  Tools (scripts CLI)                │  ← Integracje z API
└─────────────────────────────────────┘
```

**H3: Skills — wiedza domenowa**
- Niezależne od firmy
- Przykład struktury SKILL.md (```yaml block — frontmatter + quick reference)
- Progressive disclosure — references/ ładowane on-demand
- Podział: shared-skills (Apache 2.0, open-source) vs private-skills (proprietary)

**H3: Context — dane firmowe**
- Unikalne per firma
- Markdown z nagłówkami "Last updated"
- Przykład struktury context/ (```text block — tree)
- Finanse, zespół, klienci, marka, operacje

**H3: Tools — integracje API**
- Lekkie skrypty bash/Python (nie ciężkie frameworki MCP)
- Przykład: skrypt pobierający saldo z Revolut (```bash block — conceptual)
- Dlaczego lekkie > ciężkie: mniejsze zużycie context window, łatwiejsze debugowanie

---

### 4. PRZENOŚNOŚĆ: JEDEN SYSTEM, WIELE IDE (~400 words) — H2

**Kluczowe elementy**:
- Git submodules: shared-skills jako submoduł, private-skills osobno
- Symlinki do `.claude/`, `.github/`, `.cursor/`, `.agent/`
- Automatyczna synchronizacja: `tools/sync-skills.sh` + git hooks (post-checkout, post-merge)

**Code example** (```bash block — sync script concept)

**H3: Auto-triggering**
- Agenty aktywują się na podstawie słów kluczowych
- Nie musisz ręcznie mówić "teraz chcę rozmawiać z CFO"
- Skill description i metadata determinują triggering

---

### 5. GIT JAKO FUNDAMENT ZAUFANIA (~400 words) — H2

**Kluczowy argument**: Ludzie boją się dawać AI dostęp do swoich danych. Rozwiązaniem nie jest ograniczanie AI, ale budowanie systemów kontroli.

- `git diff` — widzisz dokładnie co agent zmienił
- `git revert` — cofasz w każdej chwili
- `git log` — pełna historia zmian
- **Im większa kontrola → im większa swoboda → im szybciej agent dostarcza wartość**

**H3: Claude.ai Dispatch — świadome ograniczanie uprawnień**
- Dostęp do odczytu: ClickUp, Revolut, Stripe, GitHub
- Zero dostępu do zapisu
- Anthropic jako gwarant bezpieczeństwa, ale świadomy wybór zakresu

**Porównanie** z OpenClaw (link do artykułu `/blog/openclaw-bezpieczenstwo-agentow-ai`) — pełny dostęp do systemu vs kontrolowany dostęp

---

### 6. JAK TO SIĘ MA DO RYNKU (~500 words) — H2

**Tabela porównawcza** (markdown table) — 4 podejścia:

| Aspekt | Moje środowisko | Claude Dispatch | Perplexity Computer | OpenClaw |
|--------|----------------|-----------------|---------------------|----------|
| Model | Self-managed repos + IDE | Cloud + local hybrid | Fully managed SaaS | Self-hosted runtime |
| Kontrola danych | 100% lokalna | Hybrid | Cloud provider | 100% lokalna |
| Koszt | $0 (poza API) | $20-200/mies. | $200+/mies. | $0 (poza API) |
| Vendor lock-in | Zero (Markdown) | Anthropic | Perplexity | Niski |
| Bezpieczeństwo | Git + świadome uprawnienia | Sandbox VM | Izolowany pod K8s | Wymaga własnego sandboxingu |

**H3: Dlaczego wybrałem swoje podejście**
- Pełna kontrola nad kodem i danymi
- Przenośność między IDE i modelami
- Git jako warstwa audytu
- Markdown jako lingua franca — zero vendor lock-in

---

### 7. CO DZIAŁA, CO NIE (~350 words) — H2

**H3: Co działa dobrze** (lista)
1. Separacja skills od kontekstu — testujesz na dwóch firmach
2. Git jako warstwa bezpieczeństwa — pełny audyt
3. Markdown jako uniwersalny format
4. Lekkie integracje bash/Python
5. Progressive disclosure
6. Auto-triggering agentów

**H3: Co wymaga poprawy** (lista)
1. Przenośność pamięci/stanu między platformami
2. Freshness kontekstu — "Last updated" to minimum
3. Onboarding klientów — ~4h per klient to za dużo
4. Brak CI/CD dla skills — weryfikacja jakości jest manualna
5. Sandbox (Nanoclaw) — potencjał, ale model bezpieczeństwa wymaga pracy

---

### 8. ZASADY PROJEKTOWANIA (~250 words) — H2

Numbered list — 6 kluczowych zasad:
1. **Kontrola wersji jest fundamentem** — bez Git nie ma zaufania
2. **Separuj wiedzę od danych** — skills (przenośne) vs context (unikalne)
3. **Ograniczaj uprawnienia świadomie** — odczyt tak, zapis z kontrolą
4. **Buduj na otwartych formatach** — Markdown, YAML, CLI
5. **Progressive disclosure** — nie ładuj wszystkiego naraz
6. **Code-first, no-code gdy trzeba** — agenty dla ludzi technicznych

---

### 9. CO DALEJ (~200 words) — H2

- Standaryzacja formatu "pamięci agenta" (przenośność między platformami)
- Sandbox (Nanoclaw) — eksperyment z autonomicznymi zadaniami
- Skalowanie modelu na zespół (wspólne skills, różne konteksty, różne uprawnienia)
- Mierzenie ROI ze środowiska agentowego

---

### 10. CTA — H2 (AI category template)

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz zbudować środowisko agentowe dla swojej firmy?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci zaprojektować architekturę agentów AI dopasowaną do Twojego biznesu — od analizy procesów przez budowę skills po wdrożenie integracji z narzędziami, których już używasz.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

---

### 11. FAQ (~400 words) — H2

**5 questions planned:**

1. **Czym jest środowisko agentowe AI i czym różni się od pojedynczego chatbota?**
   → Środowisko agentowe to system wielu wyspecjalizowanych agentów AI z dostępem do narzędzi, danych i integracji. W przeciwieństwie do chatbota, agenty mają persistent memory, automatyczne triggery i mogą zarządzać konkretnymi obszarami firmy (finanse, prawo, marketing).

2. **Ile kosztuje zbudowanie własnego środowiska agentowego opartego na Agent Skills?**
   → Koszty infrastruktury to $0 — skills i konteksty to pliki Markdown w Git. Jedyny koszt to API calls do modeli AI (Claude, GPT). Przy typowym użyciu biznesowym to $20-200/mies. za API, zależnie od intensywności. Nie potrzebujesz specjalnego hardware'u.

3. **Czy potrzebuję umiejętności programowania, żeby wdrożyć system agentowy w firmie?**
   → Tak, podstawowe umiejętności techniczne (terminal, Git, edycja Markdown) są potrzebne. To podejście code-first — agenty są narzędziem dla ludzi technicznych. Dla firm bez zespołu technicznego lepszym wyborem mogą być gotowe rozwiązania jak Perplexity Computer ($200/mies.).

4. **Jak zapewnić bezpieczeństwo danych firmowych przy pracy z agentami AI?**
   → Trzy kluczowe elementy: Git jako warstwa audytu (widzisz każdą zmianę), świadome ograniczanie uprawnień (read-only dostęp do API, zero zapisu w zewnętrznych systemach) oraz separacja kontekstów (dane firmowe oddzielone od wiedzy domenowej skills). Kontrola wersji eliminuje strach.

5. **Czy ten system działa tylko z Claude Code, czy mogę użyć Cursor lub innego IDE?**
   → System jest celowo niezależny od IDE. Skills w formacie Markdown działają w Claude Code, Cursor, GitHub Copilot i Antigravity jednocześnie. Synchronizacja odbywa się przez symlinki i git hooks. Zmiana IDE nie oznacza utraty konfiguracji.

---

## Code Examples Summary

| Location in article | Language tag | Content |
|---------------------|-------------|---------|
| Section 3 | `text` | Architecture diagram (4 layers) |
| Section 3 | `yaml` | SKILL.md frontmatter example |
| Section 3 | `text` | Context directory tree |
| Section 3 | `bash` | Conceptual API script |
| Section 4 | `bash` | Sync script concept |
| Section 6 | markdown table | Market comparison |

## Technical Accuracy Notes

- Agent Skills Standard — reference agentskills.io
- Claude Code Skills 2.0 — current as of March 2026
- Perplexity Computer pricing — $200/mies. Max plan (verified in research)
- OpenClaw — 329K+ GitHub stars (per Compass report)
- Claude Dispatch — research preview, launched March 17, 2026
- MCP — Model Context Protocol, now under Linux Foundation

## Style Reminders

- First person throughout (Pawel's voice)
- Polish + English tech terms naturally mixed
- Bold for key concepts at first mention
- Short paragraphs (2-4 sentences max)
- ASCII diagrams in ```text blocks
- No forced polonization of tech terms
- Internal links to at least 4 related articles
- HTML CTA block (not markdown)
- FAQ with `<details open>` accordion structure

## Checklist

- [x] Plan artifact created with full structure
- [x] Next blog ID determined (22)
- [x] Frontmatter completely specified
- [x] All main sections outlined with word targets (~3000 words total)
- [x] FAQ section planned (5 questions with accordion structure)
- [x] Code examples identified with language tags
- [x] Language guidelines noted
- [x] SEO keywords identified
- [x] Internal links planned (5 articles)
- [x] CTA template selected (AI category)
- [x] Ready for execution phase
