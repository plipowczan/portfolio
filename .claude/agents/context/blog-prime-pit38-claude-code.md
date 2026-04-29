# Blog Prime: PIT-38 Case Study with Claude Code

**Phase:** PRIME (Research) — completed 2026-04-28
**Article topic:** Case study — solo PIT-38 declaration done with Claude Code agent in ~2 hours
**Time-sensitive:** YES — publication window is 28-29.04.2026 (deadline 30.04.2026)
**Next phase:** `/blog-article-writer:plan`

---

## Source Materials

### Primary input
- `docs/blog/blog-article-input.md` (423 lines) — comprehensive briefing document with:
  - 7 hook variants (A liczby, B kontrowersja, C insight, D urgency ⭐, plus titles)
  - Full 8-section article structure
  - Reference numbers table
  - Quotes/screenshots to include
  - 4 LinkedIn follow-up cuts proposed
  - **Critical guardrails** for what NOT to publish (decyzje interpretacyjne, konkretne typy transakcji platform, agresywne sformułowania)
  - Mini-edukacja (3-4 zdania) o opodatkowaniu krypto w PL — public-safe wstawka
  - Excalidraw diagram concept (left-to-right funnel: 5430 trx → /ingest → 11 zdarzeń)
  - Risk-check checklist before publication

### Style references analyzed
- `src/content/blog/spec-driven-seo-portfolio-qamera-ai.md` (id 25, 2026-04-26, 16 min) — most recent
- `src/content/blog/skills-2-0-multi-agent-system-zarzadzanie-firma.md` (id 21)
- `src/content/blog/llm-knowledge-base-brain-karpathy.md`
- `.claude/skills/portfolio-copywriting/SKILL.md`

---

## Pawel's Writing Style (observed patterns)

- **First person** ("ja", "buduję", "wystartowałem"), direct + practical
- **Polish + English technical terms** — `ingest`, `agent`, `workflow`, `commit`, `LLM`, `prerender`
- **Lead with concrete numbers** — opening paragraph hits with metrics (5430 transakcji, 174 895 PLN, 51,5h przed terminem)
- **Bold for key concepts/numbers**, code blocks for tree structures and config
- **Tables** for metrics and before/after comparisons
- **3-4 sentence paragraphs** max
- **Section headers** as full sentences, not just keywords ("Dlaczego AI w firmie to wciąż chaos", "Toolchain — pięć narzędzi, jedna pętla")
- **Personal anecdote → general lesson → actionable takeaway** rhythm
- Tech-savvy reader assumed (knows what `git`, `commit`, `.gitignore`, CSV mean)

---

## Frontmatter for this article

```yaml
id: 26                    # next after 25
slug: pit-38-claude-code-case-study   # tentative — confirm in plan phase
title: "Miałem 3 dni do PIT-38 bez księgowej. Wystarczyły 2 godziny." # hook ⭐
excerpt: "5430 transakcji, 5 źródeł danych, 1 weekend z agentem AI. Case study workflow z Claude Code, który zastąpił księgową przy rozliczeniu PIT-38."
category: AI             # primary; AI > Automatyzacja > Code
author: Pawel Lipowczan
date: 2026-04-28
readTime: ~12 min        # estimate; finalize after execute
image: /images/og-pit-38-claude-code-case-study.webp
tags:
  - Claude Code
  - AI
  - Workflow
  - Case Study
  - Automatyzacja
  - PIT-38
lang: pl
# alternateSlug: leave empty until EN counterpart exists
```

---

## Target Audience

- **Primary:** tech-savvy freelancers / solopreneurs / consultants who use AI tooling and have multi-source income (akcje + krypto + dywidendy + JDG)
- **Secondary:** developers curious about practical agentic workflows beyond "code completion"
- **Tertiary (urgency reader, 28-29.04 only):** anyone who hasn't filed PIT-38 yet — short window of intent

---

## Unique Angle / Value Prop

> **Delegacja → automatyzacja.** To nie jest "lifehack zamiast księgowej". To case study o tym, że dobrze ustawiony agent z konwencjami `CLAUDE.md` + struktura katalogów odtwarza pracę usługi eksperckiej w jeden weekend — z lepszą dokumentacją niż dostawałem od księgowej.

Najsilniejszy insight (sekcja 4E z input): wartość LLM rośnie **skokowo**, gdy struktury repo są dla niego czytelne. Bez `CLAUDE.md` + `_template.md` ten projekt zająłby tyle samo co ręczna praca. Z nimi — 2h.

---

## Key Topics to Cover (mapped to 8 sections)

1. **Kontekst** — przegapiłem księgową, 3 dni do terminu
2. **Architektura projektu** — `PIT_38/{inbox,archive,data,deliverables,output}` z higieną kontekstu
3. **Workflow `/ingest`** — 1 komenda → identyfikacja → routing → ekstrakcja → archiwizacja
4. **Konkretne odkrycia** — 5 podpunktów (A–E), w tym:
   - A. Auto-pull bufora 174 895,50 PLN z PIT-38 2024
   - B. Numeracja PIT-38(17) vs (18) — drobiazg, który psuje deklarację
   - C. 5430 trx → 11 zdarzeń podatkowych (klasyfikacja, nie sumowanie)
   - Cx. Konwersja walut z kursami NBP D-1 (10 edge cases — soboty, święta, 1 maja)
   - D. 6 groszy błędu arytmetycznego (lekcja: arytmetyka do Excela, struktura do LLM)
   - E0. Ingest jako progresywne odkrywanie (dywidendy zagraniczne) ⭐⭐
   - E. Agent czyta intent z `CLAUDE.md` + konwencji ⭐
5. **Decyzje interpretacyjne — META-poziom** (public-safe formuła, 5-letni safety net korekty)
6. **Pre-emptive defense / data hygiene** — Anthropic API ≠ consumer ChatGPT, repo lokalne, .gitignore CSV-ek
7. **Co bym zrobił inaczej / czego nie polecam** — 172 PLN ręcznie, nie dla nie-programisty, LLM nie zastępuje doradcy
8. **CTA / Rekomendacja** — minimum-viable plan na 2-3h dla spóźnialskich + dla różnych profili podatników

Plus **mini-edukacja** o krypto-opodatkowaniu w PL (3-4 zdania, public-safe) — żeby czytelnik nie odczytał "bufor 174k" jako "Paweł stracił 174k".

---

## Reference Numbers (use exactly)

| Metric | Value |
|---|---|
| Liczba źródeł danych | 5 |
| Surowe transakcje | 5 430 |
| Zdarzenia podatkowe po klasyfikacji | 11 |
| Bufor kosztów z 2024 | 174 895,50 PLN |
| Przychód krypto 2025 | 11 947,42 PLN |
| Strata sekcji C | 966,92 PLN |
| Dopłata (sekcja G) | 172 PLN |
| Bufor na 2026 | 162 948,08 PLN |
| Commity git | 4 |
| Aktywnej pracy | ~2 godziny |
| Czas przed terminem | 51,5h |
| Błąd arytmetyczny LLM | 6 groszy (1×) |
| Plików w `data/` | 9 |

---

## Critical Guardrails (from input doc)

**NIE pisz:**
- Konkretnych typów transakcji platform (Manual Sell, Card Purchase, earn, Exchange Liquidation)
- Nazw konkretnych decyzji interpretacyjnych ("opcja B", "opcja agresywna")
- Konkretnych kwot z kategorii spornych (~36k EUR z Card Purchases)
- PESEL / NIP / pełny adres / numerów dokumentów osobowych
- Sformułowań "wybrałem mniej restrykcyjną interpretację" — brzmi jak rekomendacja

**Public-safe substytuty zdefiniowane w input doc (tabela linia 287).**

**Powód:** branding PLSoft (technology consultant, nie portal podatkowy) + ryzyko prawne (UDDP licencja) + ryzyko kontroli US (publikacja konkretów = zaproszenie).

---

## Code Examples Needed

1. Tree struktury katalogów `PIT_38/` (line 62-71 input doc)
2. Możliwy fragment `/ingest` flow (text-art lub krótki snippet)
3. Tabela edge cases NBP (sobota, niedziela, święto)
4. Tabela kluczowych liczb

NIE potrzebuje: prawdziwego kodu skryptów (artykuł jest o workflow, nie o implementacji `/ingest`).

---

## Technical Accuracy Notes

- Powołania na ustawę o PIT: art. 17 ust. 1 pkt 11, art. 17 ust. 1f, art. 22 ust. 14, art. 22 ust. 16, art. 11a (kursy NBP), art. 30a (dywidendy 19%), art. 21 ust. 1 pkt 105a (zwolnienia w sekcji C(18))
- Termin 30.04.2026 ✓
- Korekta PIT-38 do 5 lat wstecz (do 2030 dla deklaracji 2025) ✓
- Anthropic / Claude Code: domyślnie nie używa danych do treningu — ten claim trzeba przy execute potwierdzić wobec aktualnych ToS Anthropic API (zostało potwierdzone w innych artykułach Pawla, ale warto sprawdzić)

---

## Hook Decision (recommended)

**Tytuł:** "Miałem 3 dni do PIT-38 bez księgowej. Wystarczyły 2 godziny." (input doc, hook ⭐⭐)

**Lead w artykule:** wariant **D** (urgency, line 39-40) — bo publikacja 28.04 wieczorem trafia w 51-godzinne okno przed deadline'em.

**Po 30.04:** plan zamiana hooka D na A (liczby) i edytowanie sekcji 8 CTA na evergreen — opcjonalnie, w osobnej sesji.

---

## Existing Style Patterns to Mirror

- **Pre-FAQ kontekstowe CTA:** HTML + Tailwind div (zob. SKILL.md linia 213) — tytuł kontekstowy, button "Umów bezpłatną konsultację", link `/#contact`
- **Sekcja "Przydatne zasoby"** przed FAQ z linkami: Twój e-PIT, Claude Code docs, ustawa o PIT, NBP API, ewentualnie poprzednie artykuły Pawla (`/blog/skills-2-0...`, `/blog/spec-driven-seo...`)
- **Sekcja FAQ obowiązkowa** — 4-6 pytań, accordion `<details open>`, H3 w `<summary>`, snippet-style odpowiedzi 2-4 zdania
- **Wnioski / Co bym zrobił inaczej** — krótkie, bullet, konkretne

---

## Ready to proceed

✅ All source materials identified and read
✅ Pawel's writing style understood (direct, first-person, numbers-first, Polish+EN tech terms)
✅ Portfolio copywriting guidelines reviewed
✅ Key topics + technical concepts extracted (8 sekcji + mini-edu krypto)
✅ Critical guardrails noted (NIE pisać konkretnych decyzji interpretacyjnych)
✅ Frontmatter sketched (id 26, hook ⭐, time-sensitive D-variant lead)
✅ Reference numbers consolidated

**Next:** `/blog-article-writer:plan "PIT-38 Claude Code case study"` to design article structure and pick exact slug, length, section ordering.
