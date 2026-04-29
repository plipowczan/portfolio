# Blog Plan: PIT-38 Claude Code Case Study

**Phase:** PLAN — completed 2026-04-28
**Prime artifact:** `.claude/agents/context/blog-prime-pit38-claude-code.md`
**Next phase:** `/blog-article-writer:execute`

---

## 1. Frontmatter (final)

```yaml
---
id: 26
slug: pit-38-claude-code-case-study
title: "Miałem 3 dni do PIT-38 bez księgowej. Wystarczyły 2 godziny."
excerpt: >-
  5430 transakcji, 5 źródeł, 1 weekend z agentem Claude Code.
  Case study workflow, który zastąpił księgową przy rozliczeniu PIT-38.
category: AI
author: Pawel Lipowczan
date: 2026-04-28
readTime: 14 min
image: /images/og-pit-38-claude-code-case-study.webp
tags:
  - Claude Code
  - AI
  - Workflow
  - Case Study
  - Automatyzacja
  - PIT-38
lang: pl
---
```

**Decyzje:**
- **id 26** — następny po `spec-driven-seo-portfolio-qamera-ai` (id 25, 2026-04-26)
- **slug** — kluczowe słowa "PIT-38" + "Claude Code" + "case study"; SEO friendly, 5 słów; brak polonizacji ("case study" zostawione, jak w istniejącym `spec-driven-seo-portfolio-qamera-ai-case-study`)
- **title** — hook ⭐⭐ z input doc (kontrast czasowy + delegacja → automatyzacja); 56 znaków, mieści się w 50-60 limit
- **excerpt** — 145 znaków, działa jako meta description i SERP snippet
- **category: AI** — temat o agencie LLM; alternatywą Automatyzacja, ale sercem jest praca agentic, nie integracje no-code
- **readTime: 14 min** — szacunek dla ~2800 słów (~200 wpm)
- **lang: pl** — `alternateSlug` świadomie POMINIĘTE (EN counterpart powstanie później w deliberatnym kroku translate)
- **brak `modified`** — domyślnie = `date`

**OG image prompt:** generujemy w fazie `generate-og-prompt` po execute. Tematyka: terminal/dashboard z kategoryzacją 5430 → 11, paleta PLSoft (green accent), kontrastowy nagłówek "2h vs księgowa".

---

## 2. Word count target & section budget

**Total: ~2800 słów (czas czytania ~14 min).**

| Sekcja | Słowa | Notatka |
|---|---|---|
| Hook + intro (urgency) | 250 | Wariant D z input doc + 2-3 zdania osobiste |
| 1. Kontekst (przegapiłem księgową) | 350 | Real story line 50-58 |
| 2. Architektura projektu | 350 | Tree katalogów + insight o higienie kontekstu |
| 3. Workflow `/ingest` | 300 | Co robi 1 komenda + przykład PIT-8C → routing |
| 4. Konkretne odkrycia | 800 | 5 podpunktów A–E (najmocniejsza sekcja) |
| Mini-edukacja krypto-PL | 150 | Public-safe wstawka między 4 a 5 |
| 5. Decyzje interpretacyjne (META) | 200 | Public-safe formuła + safety net 5 lat |
| 6. Data hygiene (defense) | 250 | Anthropic API ≠ ChatGPT, lokalne repo, .gitignore |
| 7. Co bym zrobił inaczej | 150 | 3 bullety |
| 8. Wnioski + CTA dla spóźnialskich | 250 | Minimum-viable plan na 2-3h |
| CTA (HTML Tailwind block) | — | Kontekstowy CTA przed Przydatne zasoby |
| Przydatne zasoby | 100 | 5-7 linków zewnętrznych + wewnętrznych |
| FAQ | 450 | 5 pytań |

---

## 3. Section-by-section breakdown

### Hook (Lead, urgency variant D)

**Adaptacja line 39-40 input doc**, lekko skondensowana. Otwarcie pierwszą datą:

> Dziś jest 28 kwietnia 2026. Termin złożenia PIT-38 mija pojutrze. Wczoraj wieczorem wystartowałem od jednego zdania — "utwórz nowy projekt PIT-38". Dziś po południu deklaracja była w MF, podatek zapłacony, UPO w `output/`. Łącznie ~2 godziny aktywnej pracy. (...)

Po hooku: **3-4 liczby w jednym akapicie** — 5430 transakcji, 174 895 PLN bufora kosztów, 51,5h przed terminem, dopłata 172 PLN. Kontrast: "zwykle robi to moja księgowa".

**Closing intro:** zdanie wyjaśniające o czym artykuł NIE jest ("to nie jest 'jak nauczyłem się rozliczać PIT-38'") i czym jest ("workflow, który odtwarza pracę usługi eksperckiej w 2h").

### Sekcja 1 — Kontekst: przegapiłem timing u księgowej (~350 słów)

H2: **"Zwykle PIT-38 robi mi księgowa"**

- Akapit 1: PIT-38 składam co roku (papiery, fundusze, krypto, dywidendy), zawsze przez księgową
- Akapit 2: w tym roku przegapiłem timing — 27.04 wieczorem, księgowa już nie weźmie z 3-dniowym buforem
- Akapit 3: dwa wyjścia (panika vs sprawdzenie własnego AI-stacku) — wybór + zapowiedź wyniku
- Akapit 4: stake artykułu — to nie lifehack, to case study o tym, kiedy automatyzacja AI realnie podchodzi pod usługę ekspercką

### Sekcja 2 — Architektura projektu (~350 słów)

H2: **"Architektura projektu: każdy katalog ma jedną odpowiedzialność"**

- Tree struktury (code block `text`):

```text
PIT_38/
  inbox/          # drop zone, raw files
  archive/        # po przetworzeniu (agent NIE czyta)
  data/           # knowledge — agent reads freely
  deliverables/   # checklist, blog inputs
  output/         # finalna deklaracja PDF, UPO
  project.md      # cel, status, decyzje
  catalog.md      # indeks plików
```

- Insight o **higienie kontekstu** (line 72 input doc): agent nie zagląda do `archive/` — to nie bezpieczeństwo, to higiena kontekstu. Praca na czystych `data/*.md`, nie na 4096 wierszach raw CSV.
- Konwencja `_template.md` — wewnętrzny format który zna z `CLAUDE.md`

### Sekcja 3 — Workflow `/ingest` (~300 słów)

H2: **"`/ingest`: jedna komenda, cztery kroki"**

- Krótki opis: wrzucam 7 plików do `inbox/`, komenda `/ingest PIT_38`, dzieje się:
  1. Identyfikacja typu pliku
  2. Routing (PIT-8C → sekcja C, raporty krypto → sekcja E, dywidendy → sekcja G)
  3. Ekstrakcja do `data/*.md`
  4. Archiwizacja do `archive/` + update `catalog.md`
- Konkretny przykład: PIT-8C od XTB i SFIO — oba do osobnych plików `data/xtb-pit8c-2025.md` i `data/sfio-pit8c-2025.md`, potem zsumowane w `pit38-calculation.md` w sekcji C zgodnie z PIT-38(18)
- Lekcja: **ingest workflow ≠ batch processing**. Wartość w pętli iteracyjnej (zapowiedź sekcji 4E0).

### Sekcja 4 — Konkretne odkrycia (~800 słów, najmocniejsza)

H2: **"Pięć rzeczy, których nie spodziewałem się od agenta"**

Każdy podpunkt jako **H3**:

#### A. Bufor 174 895,50 PLN — auto-pull z PIT-38 2024

- Standardowy mechanizm dla aktywnego inwestora w krypto (art. 22 ust. 16)
- Agent przy ingest poprosił o zeszłoroczną deklarację, sam wyciągnął z poz. 38, automatycznie wpisał w nowej (gdzie staje się "kosztami z lat ubiegłych")
- Insight: **automatyzacja "łatwo dostępnej pamięci kontekstu poprzednich lat"** — to robi księgowa, to robi agent z dostępem do `archive/`

#### B. Numeracja PIT-38(17) vs (18) — drobiazg, który psuje deklarację

- W 2024 strata krypto była w poz. 38, w 2025 to już poz. 40
- Sekcja C ma teraz wiersz 3 (zwolnienia art. 21 ust. 1 pkt 105a)
- Wiele blog-postów odnosi się do starej numeracji
- LLM wyłapał to po wgraniu pustego wzoru (18) jako referencji
- Lekcja: **zaufaj dokumentom referencyjnym, nie pamięci modelu**

#### C. 5430 transakcji → 11 zdarzeń podatkowych

- 4096 + 1334 = 5430 raw → po klasyfikacji 11 zdarzeń, reszta operacje wewnętrzne
- Wartość LLM: **klasyfikacja, nie sumowanie** — każdy z ~25 typów transakcji przyporządkowany do 3 kategorii z uzasadnieniem prawnym
- Public-safe: nie wymieniam konkretnych typów ani platform po nazwie w tej sekcji
- Caveat box (cytat): nie wchodzę w szczegóły interpretacji, wymaga konsultacji z doradcą

#### D. Kursy NBP D-1 — 10 edge cases (najmocniejsza demonstracja "dużo małych decyzji")

- Każda transakcja w EUR/USD przeliczona na PLN po kursie średnim NBP z dnia roboczego poprzedzającego (art. 11a)
- Tabela edge cases:

| Data transakcji | Dzień tygodnia | Kurs z dnia |
|---|---|---|
| 2025-02-15 | sobota | piątek 14.02 |
| 2025-03-16 | niedziela | piątek 14.03 |
| 2025-05-02 | piątek | środa 30.04 (1 maja = święto) |
| 2025-05-18 | niedziela | piątek 16.05 |
| 2025-06-15 | niedziela | piątek 13.06 |

- Lekcja: **"dużo małych mechanicznych decyzji z subtelnymi regułami"** — mocna strona LLM. Człowiek robi 1-2 błędy na 10 transakcjach (zapomnienie 1 maja jest częste). Agent zrobił 0.

#### E. 6 groszy, których LLM nie umie sumować

- Moja kalkulacja sekcji C: 966,98 PLN
- Twój e-PIT: 966,92 PLN
- Różnica 6 groszy = błąd arytmetyczny LLM
- Lekcja: **LLM-y robią błędy w 6-cyfrowych dodawaniach**. Sumowanie zostaw kalkulatorowi/Excelowi. LLM ma wartość w **strukturze i interpretacji**, nie w arytmetyce.

#### F. Ingest jako progresywne odkrywanie (najmocniejszy beat ⭐⭐)

> ⚠️ **Kolejność:** sekcja F idzie OSTATNIA z konkretnych odkryć — to climax.

- Nie miałem listy "co potrzeba do PIT-38". Wrzucałem co miałem — agent po każdej iteracji mówił "OK, ale brakuje X" lub "to oznacza Y"
- Kluczowy moment: **dywidendy zagraniczne**
  - Nie wiedziałem, że mam dywidendy z 2025 (drobne ETF-y w XTB, ~958 PLN brutto)
  - Agent zapytał: "a co z dywidendami? PIT-8C ich nie zawiera, XTB wystawia osobny raport"
  - Pobrałem XTB Raport Dodatkowy → 182 PLN podatku 19% PL
  - Bez tego pytania złożyłbym deklarację bez sekcji G → niedopłata 172 PLN + ryzyko kontroli
- Inny moment: **historia 2024**
  - Agent przy pierwszym ingest zapytał o zeszłoroczną deklarację
  - 174 895,50 PLN bufora do przeniesienia
  - Bez tego ruchu zapłaciłbym ~2200 PLN podatku zamiast 0
- **Istota wartości:** nie "agent zsumował transakcje", tylko **"agent wiedział, czego nie wiem"**. Iteracyjne dopytywanie + klasyfikacja każdego dokumentu według taksonomii PIT-38 = niemożliwe ręcznie bez specjalistycznej wiedzy podatkowej.

### Wstawka — Mini-edukacja krypto-PL (~150 słów)

H3 lub blockquote (między sekcją 4F a 5).

**Public-safe, bezpośrednio z input doc line 322-327** (lekko zedytowana):

- art. 17 ust. 1 pkt 11 — zdarzenie podatkowe powstaje przy wymianie krypto na fiat lub towar
- Krypto-krypto neutralne (art. 17 ust. 1f)
- art. 22 ust. 14 + 16 — koszty nabycia czekają w buforze; nadwyżka kosztów przechodzi na kolejne lata bez ograniczenia czasowego
- Stąd "bufor 174k → 162k" w moim case'ie. **To nie strata** — to wydatki na zakupy, których jeszcze nie zamknąłem sprzedażą na fiat
- Caveat: uproszczenie, pełne rozumienie wymaga konsultacji z doradcą

### Sekcja 5 — Decyzje interpretacyjne (META, public-safe) (~200 słów)

H2: **"Decyzje interpretacyjne: gdzie człowiek wraca do gry"**

Bezpieczna formuła z input doc line 168-171:

- Część kategorii zdarzeń ma niejednoznaczną kwalifikację — różne interpretacje KIS, opinie doradców
- Dla każdej takiej kategorii LLM wyciągnął argumenty obu stron, oszacował ryzyko, pokazał trade-off liczbowy
- **Decyzję podejmowałem ja**, nie agent. Agent zostawił uzasadnienie w `data/sources.md`
- **Korekta PIT-38 możliwa do 5 lat wstecz** (do 2030 dla deklaracji 2025) — safety net

### Sekcja 6 — Data hygiene / pre-emptive defense (~250 słów)

H2: **"'Wrzuciłeś dane finansowe do LLM?' — świadomy wybór, nie nieostrożność"**

Trzy punkty z input doc line 187-193:

- a) **Anthropic API ≠ consumer ChatGPT** — Claude Code domyślnie nie używa danych do treningu (inny model biznesowy)
- b) **Repo prywatne, lokalne** — brak `git push`, CSV-ki w `.gitignore`, kontekst LLM kończy się z konwersacją
- c) **Realny benchmark** — alternatywą był księgowy z biurka, Excel na pendrive lub Twój e-PIT w przeglądarce. Wybór nie jest między "bezpieczne" a "ryzykowne", **jest między różnymi rodzajami zaufania**
- Closing: świadomie wybrałem zaufanie do Anthropic + lokalnego workflow. Ktoś inny wybierze inaczej i to OK.

### Sekcja 7 — Co bym zrobił inaczej (~150 słów)

H2: **"Czego nie polecam"**

3 bullety:

- **Nie automatyzowałem zapłaty 172 PLN** — przelew na mikrorachunek poszedł ręcznie. Nie ma sensu robić tego przez LLM
- **Nie polecam tego setupu osobie bez programistycznego komfortu** — `/ingest`, struktura katalogów, git, .gitignore wymaga rozumienia narzędzi
- **LLM nie zastępuje doradcy podatkowego** — w sytuacjach niejednoznacznych finalna decyzja musi należeć do człowieka, idealnie po konsultacji z doradcą

### Sekcja 8 — Wnioski + CTA dla spóźnialskich (~250 słów)

H2: **"Jeśli czytasz to dziś — masz jeszcze ~50 godzin"**

Minimum-viable plan z input doc line 203-209:

1. Pobierz wszystkie PIT-8C ze swoich brokerów + raporty z giełd krypto
2. Wejdź na Twój e-PIT — sekcja C auto-wypełniona
3. Sekcję E (krypto) i G (dywidendy zagraniczne) wypełniasz ręcznie
4. **Sprawdź swoje PIT-38 z 2024** — czy poz. 38 zawiera niewykorzystane koszty krypto. Może być wart kilka-kilkadziesiąt tysięcy PLN bufor
5. Złóż przez profil zaufany. Zapłać mikrorachunek do 30.04
6. Najgorszy scenariusz: korekta PIT-38 możliwa do 2030

Po terminie (3 profile):
- Prosty PIT (1 PIT-37 z pracy) — Twój e-PIT, nie kombinuj
- 2-3 źródła (akcje + krypto) — warto rozważyć weekend na setup
- 5+ źródeł i historia strat z lat ubiegłych — TWÓJ scenariusz

Zamknięcie: jedno zdanie o tym, że wartość LLM rośnie skokowo z dobrze opisanym `CLAUDE.md` i konwencjami repo. Bez nich — tyle samo czasu co księgowy. Z nimi — 2 godziny.

### CTA (HTML + Tailwind)

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Masz multi-source podatki i myślisz "ja też tak chcę"?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomagam freelancerom i konsultantom technologicznym ustawiać AI workflow do
    rzeczy, które do tej pory delegowali ekspertom. Pokażę, jak wygląda taki
    setup u Ciebie.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

### Przydatne zasoby (~100 słów)

H2: **"Przydatne zasoby"**

- [Twój e-PIT](https://www.podatki.gov.pl/pit/twoj-e-pit/) — automatyczne wypełnienie sekcji C
- [Ustawa o PIT — art. 22 ust. 14, 16](https://isap.sejm.gov.pl/) — koszty nabycia krypto, bufor wieloletni
- [NBP — kursy średnie](https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/) — D-1 dla transakcji walutowych
- [Anthropic — Privacy & Data Usage](https://www.anthropic.com/privacy) — domyślne zasady przetwarzania w API
- Skills 2.0 — multi-agent system → [/blog/skills-2-0-multi-agent-system-zarzadzanie-firma](/blog/skills-2-0-multi-agent-system-zarzadzanie-firma)
- Spec-driven SEO — [/blog/spec-driven-seo-portfolio-qamera-ai](/blog/spec-driven-seo-portfolio-qamera-ai)

### FAQ (~450 słów, 5 pytań)

H2: **"FAQ"**

Każde pytanie w `<details open>`, H3 w `<summary>`, snippet 2-4 zdania:

1. **Czy mogę zrobić PIT-38 z Claude Code, jeśli nie jestem programistą?**
   Krótka odpowiedź: niekoniecznie warto. Setup wymaga znajomości git, terminala, struktury katalogów i `.gitignore`. Bez tego bezpieczniejszy jest księgowy lub Twój e-PIT z ręcznym uzupełnieniem sekcji E i G.

2. **Czy Anthropic używa moich danych finansowych do trenowania modeli?**
   Domyślnie nie — Claude Code (Anthropic API) działa na innym modelu biznesowym niż consumer ChatGPT. Dane z API nie są używane do treningu modeli bez wyraźnej zgody. Zawsze warto sprawdzić aktualne zasady w [polityce Anthropic](https://www.anthropic.com/privacy).

3. **Co to jest "bufor kosztów krypto" i czemu może być wart kilkadziesiąt tysięcy PLN?**
   Bufor to udokumentowane wydatki na zakup krypto, których jeszcze nie zamknąłeś sprzedażą na walutę tradycyjną. W polskim PIT (art. 22 ust. 14, 16) koszty czekają w buforze do roku, w którym sprzedasz krypto na fiat — wtedy obniżają podstawę opodatkowania. Nadwyżka kosztów nad przychodami w danym roku przechodzi na kolejne lata bez ograniczenia czasowego.

4. **Co zrobić, jeśli czytam to po 30 kwietnia i jeszcze nie złożyłem PIT-38?**
   Złóż jak najszybciej z czynnym żalem (art. 16 KKS) — kara za niezłożenie deklaracji rośnie z czasem. Korekta PIT-38 jest możliwa do 5 lat wstecz, więc lepiej złożyć z grubsza poprawną deklarację z opóźnieniem niż w ogóle. Po fakcie skonsultuj się z doradcą podatkowym.

5. **Czy LLM zastępuje doradcę podatkowego przy multi-source PIT?**
   Nie. LLM dobrze radzi sobie z klasyfikacją, ekstrakcją z PDF-ów i konwersją kursów NBP, ale w sytuacjach niejednoznacznych kwalifikacji prawnej finalna decyzja musi należeć do człowieka. Idealnie — po konsultacji z doradcą, który weźmie odpowiedzialność za rekomendację dostosowaną do Twojej sytuacji.

---

## 4. Code blocks plan (with language tags)

| # | Sekcja | Język tagu | Długość | Cel |
|---|---|---|---|---|
| 1 | 2. Architektura | `text` | 9 linii | Tree katalogów PIT_38/ |
| 2 | 4D. Kursy NBP | (markdown table) | 6 wierszy | Edge cases |
| 3 | 4 lub 5 | `text` (opcjonalnie) | 4-5 linii | Skrót flow `/ingest` jeśli potrzebny |

**Bez** snippetów kodu w sensie programistycznym — artykuł jest o workflow, nie o implementacji `/ingest`.

---

## 5. Language & style guidelines

- **Pierwsza osoba** — "wystartowałem", "wrzuciłem", "wybrałem"
- **PL + EN tech terms** — `agent`, `ingest`, `commit`, `archive/`, `data/`, `LLM`, `workflow`, `case study` (NIE polonizuj)
- **Bold** — kluczowe pojęcia i wszystkie liczby z tabeli referencyjnej
- **Akapity 2-4 zdania**
- **Sekcje H2** — pełne zdania lub mocne frazy ("Zwykle PIT-38 robi mi księgowa", "5430 transakcji → 11 zdarzeń podatkowych")
- **Tone** — bezpośredni, praktyczny, "Technology as Leverage"; bez sprzedaży
- **Numbers first** — gdzie to możliwe, zaczynaj akapity od konkretnych liczb

---

## 6. SEO planning

**Primary keyword:** "PIT-38 Claude Code"
**Secondary:** "case study", "AI workflow", "rozliczenie krypto", "agent AI", "automatyzacja PIT"

**Keyword placement:**
- W tytule ✓ ("PIT-38" + "2 godziny")
- W slug ✓
- W H2 jednej sekcji ("Zwykle PIT-38 robi mi księgowa")
- W excerpt ✓
- W tags ✓ (Claude Code, PIT-38)

**Internal links** (poprzednie artykuły Pawla):
- `/blog/skills-2-0-multi-agent-system-zarzadzanie-firma` — sekcja Przydatne zasoby + 1× w body (kontekst CLAUDE.md i konwencji)
- `/blog/spec-driven-seo-portfolio-qamera-ai` — Przydatne zasoby

**External authoritative links:**
- podatki.gov.pl (Twój e-PIT) — gov, autorytet maksymalny
- isap.sejm.gov.pl (ustawa) — gov
- nbp.pl (kursy) — gov
- anthropic.com/privacy — vendor source

---

## 7. Technical accuracy checklist

- [x] Przepisy: art. 17 ust. 1 pkt 11, art. 17 ust. 1f, art. 22 ust. 14, art. 22 ust. 16, art. 11a, art. 30a, art. 21 ust. 1 pkt 105a — spójne z input doc, do walidacji w execute
- [x] Termin 30.04.2026 — potwierdzony
- [x] Korekta PIT-38 do 5 lat (do 2030 dla deklaracji 2025)
- [ ] Anthropic API ≠ training data — sprawdzić aktualną wersję ToS w execute (link do anthropic.com/privacy)
- [x] Numery pozycji PIT-38(17) → (18) — z input doc, brak konieczności weryfikacji w skill
- [x] Kursy NBP D-1 dla świąt (1 maja) — logika kalendarzowa stała
- [x] Liczby z tabeli referencyjnej (line 219-237 input doc) — używam dokładnie

---

## 8. Critical guardrails — execution-time enforcement

**Egzekwowane w fazie execute:**

1. **NIE wymieniam** typów transakcji platform (Manual Sell, Card Purchase, earn, Liquidation)
2. **NIE używam** sformułowań "opcja B", "wybrałem agresywną interpretację", "zaakceptowałem ryzyko zaniżenia podstawy"
3. **NIE podaję** konkretnych kwot z kategorii spornych
4. **NIE publikuję** PESEL, NIP, numeru domu, numeru UPO
5. **TAK używam** public-safe substytutów z tabeli line 287 input doc
6. **TAK wstawiam** mini-edukację krypto-PL między sekcją 4 a 5 (żeby "bufor 174k" nie został zinterpretowany jako "strata")
7. **TAK zachowuję** liczby z tabeli referencyjnej — anonimizacja zabija tekst

---

## 9. Time-sensitive note

- **Publish 28.04 wieczorem** z urgency hook D
- **Optional follow-up** po 30.04: edytuj hook D na hook A (liczby) i sekcję 8 CTA na evergreen ("ten case zrobiłem w terminie — Ty zdążysz na PIT za 2026")
- **EN translation** — osobna sesja, po publikacji PL. Wtedy `alternateSlug` dodawany symetrycznie po obu stronach.

---

## 10. Success criteria (for execute phase)

- [ ] ~2800 słów, ~14 min read
- [ ] Hook D zaadaptowany do leadu (urgency 28.04)
- [ ] Wszystkie 8 sekcji obecne, w kolejności z planu
- [ ] 5 podpunktów A–F w sekcji 4 (F = climax)
- [ ] Mini-edukacja krypto-PL między 4 a 5
- [ ] CTA — HTML + Tailwind block, kontekstowy headline, link `/#contact`
- [ ] Przydatne zasoby — 5-7 linków, w tym 2 internal
- [ ] FAQ — 5 pytań, accordion `<details open>`, snippet style
- [ ] Wszystkie liczby zgodne z tabelą referencyjną
- [ ] Zero przekroczeń guardraili (typy transakcji, opcja B, PESEL)
- [ ] Wszystkie code blocks z language tags

---

## Ready to execute

Run `/blog-article-writer:execute` aby wygenerować plik `src/content/blog/pit-38-claude-code-case-study.md` zgodnie z planem.
