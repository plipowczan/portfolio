---
id: 21
slug: skills-2-0-multi-agent-system-zarzadzanie-firma
title: "Skills 2.0 - jak buduję system wieloagentowy do zarządzania firmą"
excerpt: "Jak przejść od rozproszonych promptów AI do zorganizowanego systemu agentów zarządzających finansami, prawem i marketingiem Twojej firmy."
category: AI
author: Pawel Lipowczan
date: 2026-03-08
readTime: 14 min
image: /images/og-skills-2-0-multi-agent-system.webp
tags:
  - AI
  - Claude Code
  - Skills
  - Automatyzacja
  - Multi-Agent System
  - Agent Skills
lang: pl
alternateSlug: skills-2-0-multi-agent-system-company-management
---

Od kilku dni buduję coś, czego szukałem od dawna — system, w którym agenci AI nie tylko odpowiadają na pytania, ale **zarządzają** konkretnymi obszarami moich firm. Zarówno 200IQ Labs (qamera.ai) jak i PLSoft.

Problem znasz, jeśli prowadzisz firmę i korzystasz z AI. Masz Claude Project z promptem dla CFO. Osobny z promptami marketingowymi. Obsidian z notatkami. Pięć ad-hoc konwersacji dziennie, w których tłumaczysz kontekst od zera. Każda sesja to tabula rasa. Każdy agent nie wie nic o tym, co robi drugi.

W [5 technikach pracy z Claude Code](/blog/5-technik-pracy-z-claude-code) opisywałem PRD-first development, modularność reguł i przekształcanie powtarzalnych zadań w komendy. To był fundament. Teraz przeskakuję na kolejny poziom — **Skills 2.0** + **Agent Skills standard** + **Git** = system wieloagentowy, który działa jak zespół specjalistów. Każdy agent zna swoją rolę, ma swoje narzędzia, i nie wchodzi drugiemu w paradę.

W tym artykule pokażę Ci jak to wygląda od środka — od problemu rozproszonych kontekstów, przez architekturę trzech repozytoriów, po praktyczny przykład budowy agenta CFO krok po kroku.

## Dlaczego AI w firmie to wciąż chaos

Każdy kto poważnie używa AI w biznesie prędzej czy później trafia na ten sam mur. Masz kilka Claude Projects — jeden z promptem dla CFO, drugi z promptami do tworzenia contentu, trzeci do analizy prawnej. Do tego Obsidian pełen notatek i ad-hoc czaty w przeglądarce. Wygląda to tak:

```text
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Claude Project│  │   Obsidian   │  │  Ad-hoc chat │
│   "CFO"      │  │  "Notatki"   │  │  "Pomóż mi"  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
               ❌ Zero orchestration
               ❌ No shared context
               ❌ No versioning
```

Cztery fundamentalne problemy tego podejścia:

- **Brak orkiestracji** — agenci nie wiedzą o sobie nawzajem. Agent CFO nie wie, że agent marketingowy właśnie zaplanował kampanię wymagającą budżetu. Każdy działa w próżni.
- **Brak wersjonowania** — zmieniasz prompt systemowy w Claude Project i nie masz pojęcia co było wcześniej. Nie wiesz, czy agent działa lepiej czy gorzej po zmianie. Nie ma historii, nie ma diff'ów.
- **Brak testów** — skąd wiesz, że Twój agent CFO generuje dobre raporty? Sprawdzasz ręcznie, za każdym razem. Zero automatyzacji, zero powtarzalności.
- **Brak separacji kontekstów** — prompt systemowy w Claude Project to tekst w polu. Nie ma struktury, nie ma modularności. Wszystko w jednym miejscu, bez izolacji danych między firmami.

To nie jest problem narzędzia. To problem **architektury**. A raczej — jej braku.

Pisałem o tym w kontekście zarządzania wiedzą w artykule o [Second Brain z Obsidian i Claude Code](/blog/second-brain-obsidian-claude-code-skills). Tam chodziło o organizację notatek i wiedzy osobistej. Teraz stawka jest wyższa — chodzi o zarządzanie firmą.

## Czym są Skills w Claude Code

Zanim przejdziemy do systemu wieloagentowego, wyjaśnijmy fundamenty. **Skills** w Claude Code to modułowe instrukcje — przepisy (recipes) — które uczą agenta AI konkretnych workflow, procesów i umiejętności. To nie są zwykłe prompty. Skill ma dostęp do file system, web search, skryptów i narzędzi. Żyje jako plik `SKILL.md` w repozytorium, jest wersjonowany przez Git i ładowany automatycznie gdy agent go potrzebuje.

Ewolucja wyglądała tak:

1. **Prompt** — tekst wpisywany ad-hoc w czat. Zero trwałości, zero struktury.
2. **CLAUDE.md rules** — instrukcje w repozytorium. Trwałe, ale monolityczne — jeden plik ze wszystkim.
3. **Skills 1.0** — modularność, ładowanie on-demand. Krok naprzód, ale z poważnymi ograniczeniami.
4. **Skills 2.0** — pełna standaryzacja z evals, benchmarks, trigger tuning i dystrybucją.

Różnica między 1.0 a 2.0 to nie kosmetyczna aktualizacja. To zmiana paradygmatu.

### Skills 1.0 — era eksperymentalna

Skills 1.0 pojawiły się w pierwszych wersjach Claude Code i miały charakter **nieudokumentowany**. System opierał się na ukrytych mechanizmach rozpoznawania wzorców — "magic bootstrappy parts" — które interpretowały pliki markdown, pod warunkiem idealnego skonfigurowania metadanych.

Główne problemy:

- **Zero testów** — cykl życia skill opierał się na zgadywaniu. Pisałeś instrukcje, uruchamiałeś ręcznie kilka promptów i zakładałeś że działa. Nie było żadnej empirycznej metody na ocenę czy zmiana w instrukcjach poprawiła czy pogorszyła zachowanie agenta.
- **Niezwalidowany kontekst** — kontekst dostarczany modelowi miał status "unvalidated". W połączeniu z naturalną tendencją modeli do halucynacji, niezweryfikowane instrukcje prowadziły do błędów systemowych.
- **Brak taksonomii** — wszystkie skills były traktowane jednakowo. Nie istniał podział na typy, co utrudniało zarządzanie i deprecjację.
- **Context bleed** — pojedyncze, sekwencyjne uruchomienia powodowały wyciek kontekstu między zadaniami.

### Skills 2.0 — era standaryzacji

Skills 2.0, wdrożone na początku marca 2026, wprowadzają standardy zaczerpnięte z dojrzałej inżynierii oprogramowania. Kluczowe zmiany:

| Wymiar | Skills 1.0 | Skills 2.0 |
|--------|-----------|-----------|
| **Testowanie** | Ręczne próby, zgadywanie | Automatyczne evals, benchmarks, blind A/B testing |
| **Walidacja** | Brak — kontekst niezweryfikowany | Deterministyczny, testowany kontekst |
| **Triggering** | Ręczna modyfikacja opisów | Zautomatyzowany trigger tuning |
| **Taksonomia** | Płaska, bez podziału | Capability uplift vs encoded preference |
| **CI/CD** | Brak wsparcia | Natywna integracja z pipeline'ami |
| **Izolacja testów** | Context bleed między uruchomieniami | Multi-agent testing (Executor, Grader, Comparator, Analyzer) |

To ostatni punkt jest szczególnie ciekawy. Skill-creator w wersji 2.0 nie testuje skill'a w jednej instancji. Powołuje **cztery izolowane sub-agenty**:

1. **Executor** — uruchamia skill w sterylnym środowisku, bez historii poprzednich konwersacji
2. **Grader** — ocenia output na podstawie zdefiniowanych asercji, zwraca pass rate
3. **Comparator** — przeprowadza ślepe testy A/B między wersjami skill'a — nie wie który wynik jest nowy, a który stary
4. **Analyzer** — analizuje setki wyników, szuka ukrytych wzorców i anomalii w zużyciu tokenów

To nie jest "sprawdź czy działa". To **inżynieria jakości na poziomie produkcyjnego oprogramowania**.

### Dwa typy skills — i dlaczego to ma znaczenie

Skills 2.0 wprowadza formalną **taksonomię** — podział na dwie kategorie o radykalnie różnym cyklu życia:

- **Capability uplift** — uczy AI nowej umiejętności, np. frontend design, code review, analiza danych. Kluczowa cecha: **podlega planowanej deprecjacji**. Gdy bazowy model staje się lepszy (skok z Sonnet 4.5 na Opus 4.6 to różnica 190 punktów Elo w testach GDPval-AA), skill traci rację bytu. Evals automatycznie to wykrywają — gdy agent bez skill'a osiąga te same wyniki co z nim, dostajesz sygnał do deprecjacji.
- **Encoded preference** — koduje Twój specyficzny workflow. Jak tworzysz raporty, jak analizujesz dane, jak piszesz content. **Trwałe, bo specyficzne dla Ciebie.** Nowy model nie zmieni tego, że chcesz raporty w konkretnym formacie. Deprecjacja następuje tylko gdy Ty zmienisz swój proces.

```text
System prompt:               Skill 2.0:
─────────────               ──────────
Tekst w polu                SKILL.md + pliki + evals
Brak testów                 Automatyczne benchmarks
Copy-paste                  Git + versioning
Jedna sesja                 Persistent across sessions
Brak walidacji              Validated context
Ręczne triggery             Trigger tuning
```

**Pro tip:** Jeśli budujesz system dla firmy, zacznij od encoded preference. Twój workflow, Twoje formaty, Twoje procesy — to się nie zdezaktualizuje. Capability uplift dodaj później, gdy potrzebujesz rozszerzyć umiejętności agenta.

## Agent Skills — otwarty standard dla AI agentów

Skills 2.0 to feature Claude Code. Ale co z przenośnością? Co jeśli jutro pojawi się lepsze narzędzie?

Tu wchodzi **Agent Skills standard** — otwarty standard opublikowany na [agentskills.io](https://agentskills.io). Nie jest powiązany z żadnym vendorem. Definiuje strukturę pliku SKILL.md, sposób ładowania kontekstu i mechanizm trigger'ów.

Kluczowa koncepcja to **progressive disclosure** — trzypoziomowe ładowanie kontekstu:

1. **Description** — krótki opis (jedna linijka) widoczny zawsze w context window
2. **SKILL.md** — pełne instrukcje ładowane tylko gdy skill jest potrzebny
3. **Reference files** — dodatkowe zasoby (templates, dane) ładowane dla konkretnych operacji

Dzięki temu możesz mieć **dziesiątki agentów** bez przytłaczania context window. Każdy agent jest opisany jedną linijką. Dopiero gdy go potrzebujesz, ładowane są pełne instrukcje.

Struktura SKILL.md wygląda tak:

```yaml
name: "CFO Agent"
description: "Financial analysis and reporting for PLSoft"
triggers:
  - "financial report"
  - "budget analysis"
  - "cash flow"
instructions: |
  You are the CFO agent for PLSoft.
  Your role is to analyze financial data,
  generate reports, and provide advisory...
```

To nie jest skomplikowane. **SKILL.md to Markdown z YAML header** — dokładnie jak frontmatter w postach blogowych. Jeśli potrafisz napisać notatkę w Obsidian, potrafisz stworzyć agenta.

Przenośność i brak vendor lock-in to główne cele standardu. Obecnie najlepiej wspierany przez Claude Code, ale specyfikacja jest publiczna. Inne narzędzia mogą ją zaimplementować bez żadnych ograniczeń.

## Skill-creator — buduj agentów jak profesjonalista

Ręczne pisanie SKILL.md działa, ale jest jak pisanie kodu bez IDE. Możesz, ale po co?

**Skill-creator** to oficjalny plugin od Anthropic, który prowadzi Cię przez cały proces budowy agenta. Instalacja jest prosta:

```bash
# W Claude Code
/plugins
# → search "skill-creator"
# → install
```

Od tego momentu masz dostęp do workflow, który zamienia luźny opis intencji w przetestowanego, zoptymalizowanego agenta. Proces wygląda tak:

1. **Intent** — opisujesz co agent ma robić ("Agent do analizy finansowej i raportowania")
2. **Interview** — skill-creator zadaje pytania o specyfikę Twojego workflow
3. **Draft** — generuje pierwszą wersję SKILL.md
4. **Test** — uruchamiasz agenta z realnymi danymi
5. **Evaluate** — evals mierzą jakość outputu
6. **Iterate** — poprawiasz na podstawie wyników
7. **Package** — gotowy skill do dystrybucji

Trzy elementy wyróżniają ten workflow:

- **Evals** — automatyczna ocena jakości. Definiujesz co jest dobrym wynikiem, skill-creator testuje i mierzy. Nie zgadujesz czy agent działa — **wiesz**.
- **Benchmarks** — pass rate, czas wykonania, zużycie tokenów. Porównujesz wersje agenta, widzisz co się poprawiło, co się pogorszyło.
- **Trigger tuning** — optymalizacja description żeby skill uruchamiał się we właściwych momentach. Za szerokie triggery = false positives. Za wąskie = agent się nie aktywuje.

Od opisu intencji do działającego agenta — **20 minut**. To nie przesada. Widziałem live demo, w którym od zera do działającego skill'a generującego PDF raporty minęło dokładnie tyle.

## Mój system — 8 agentów, 3 repozytoria, zero chaosu

Teoria to jedno. Pokażę Ci jak wygląda mój system w praktyce.

Prowadzę dwie firmy — **200IQ Labs** (spółka, produkt qamera.ai) i **PLSoft** (JDG, freelance i consulting). Każda ma inne potrzeby, inne dane, inne procesy. Ale pewne elementy są wspólne — templates raportów, standardy formatowania, utilities.

Architektura opiera się na **trzech repozytoriach Git**:

```text
┌─────────────────────────────────────────────┐
│     agentic-ai-system (200IQ Labs)          │
│     → qamera.ai product                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   CFO    │  │   Legal  │  │ Marketing│   │
│  └──────────┘  └──────────┘  └──────────┘   │
│         ▲                                   │
│         │ git submodule                     │
│  ┌──────┴───────────────────────────────┐   │
│  │         shared-skills (public)       │   │
│  │  Templates, Utilities, Standards     │   │
│  └──────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│     agentic-ai-private (PLSoft / JDG)       │
│     → freelance, portfolio, consulting      │
│  ┌──────────┐  ┌──────────┐                 │
│  │  Coach   │  │ LinkedIn │                 │
│  └──────────┘  └──────────┘                 │
│         ▲                                   │
│         │ git submodule                     │
│  ┌──────┴───────────────────────────────┐   │
│  │         shared-skills (public)       │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

- **`shared-skills`** (public, Apache 2.0) — wspólne skills, templates, utilities. Open source, każdy może użyć i kontrybuować.
- **`agentic-ai-system`** (private) — skills specyficzne dla 200IQ Labs. Dane spółki, procesy wewnętrzne, strategie produktowe.
- **`agentic-ai-private`** (private) — skills osobiste i freelance PLSoft. Coaching, content LinkedIn, consulting.

`shared-skills` jest podpięte jako **git submodule** w obu prywatnych repozytoriach. Zmiana w shared-skills propaguje się do obu firm.

System obejmuje **8 agentów**, z których 4 już działają:

1. **CFO** (finanse) ✅ — raporty finansowe, analiza cash flow, budżetowanie
2. **Tax Advisor** (podatki) 🔲 — optymalizacja podatkowa, rozliczenia
3. **Legal** (prawo) 🔲 — analiza umów, compliance, regulacje
4. **Marketing** (content) 🔲 — strategie contentowe, kampanie, analityka
5. **Business Consultant** ✅ — doradztwo strategiczne, analiza rynku
6. **Product Manager** 🔲 — roadmap qamera.ai, user stories, priorytety
7. **Coach The Five** ✅ — coaching oparty na metodologii The Five
8. **LinkedIn Content** ✅ — generowanie i planowanie postów LinkedIn

Kluczowa jest **separacja kontekstów**. Agent CFO dla 200IQ Labs nie widzi treści marketingowych dla PLSoft. Nie dlatego, że mu zabraniam — dlatego, że operuje w innym repozytorium. Fizyczna izolacja przez Git.

A Git daje mi coś, czego żaden Claude Project nie da — **wersjonowanie, code review, historia zmian**. Każda modyfikacja agenta to commit. Każda większa zmiana to pull request. Mogę wrócić do dowolnej wersji. Mogę porównać, co się zmieniło i kiedy.

Do budowy tego systemu używam [OPSX Workflow](/blog/opsx-workflow-strukturyzowana-praca-z-ai) — tego samego podejścia, które opisywałem wcześniej. OpenSpec daje mi strukturyzowany proces tworzenia artefaktów, zamiast ad-hoc promptowania.

## Praktyczny przykład — budowa agenta CFO krok po kroku

Teoria jest ważna, ale pokażę Ci jak wygląda budowa agenta od A do Z. Weźmy agenta CFO — pierwszego, którego uruchomiłem.

### 1. Intent

Zaczynam od opisu intencji w skill-creatorze:

> "Agent do analizy finansowej i raportowania dla 200IQ Labs i PLSoft. Generuje miesięczne raporty, analizuje cash flow, porównuje plan vs wykonanie budżetu."

### 2. Interview

Skill-creator zadaje mi pytania:

- Jakie dane finansowe masz dostępne? (CSV z banku, faktury w folderze)
- Jaki format raportów preferujesz? (Markdown z tabelami, wykresy ASCII)
- Jak często generujesz raporty? (Miesięcznie, ad-hoc na żądanie)
- Jakie metryki są kluczowe? (Revenue, expenses, runway, MRR)

### 3. Draft SKILL.md

Na podstawie interview skill-creator generuje draft:

```yaml
# CFO Agent - fragment SKILL.md
name: "CFO Agent"
version: "1.0.0"
description: "Financial analysis, reporting, and advisory for 200IQ Labs & PLSoft"
triggers:
  - "analyze financials"
  - "monthly report"
  - "budget review"
  - "cash flow projection"
```

Dalej idą pełne instrukcje — format raportów, jakie pliki czytać, jak formatować output, jakie metryki liczyć.

### 4. Test z realnymi danymi

Wrzucam faktyczne dane finansowe i proszę o raport. Porównuję z tym, co robiłem ręcznie. Sprawdzam czy:

- Liczby się zgadzają
- Format jest czytelny
- Wnioski mają sens
- Nic nie pominął

### 5. Evals — co mierzę

Definiuję kryteria oceny:

- **Accuracy** — czy kwoty i wyliczenia są poprawne
- **Completeness** — czy raport zawiera wszystkie wymagane sekcje
- **Actionability** — czy wnioski są konkretne i przydatne
- **Format compliance** — czy output pasuje do moich templates

### 6. Iteracja

Pierwsze dwie iteracje zawsze wymagają poprawek. Agent pomijał kategoryzację wydatków. Dodałem instrukcje o grupowaniu kosztów. Agent generował za ogólne wnioski. Doprecyzowałem prompty o specificity. Po trzeciej iteracji — raport na poziomie, który wcześniej zajmował mi 2 godziny ręcznej pracy.

### 7. Package

Gotowy skill ląduje w repo `agentic-ai-system`. Commit, push, done. Od tego momentu agent CFO jest dostępny w każdej sesji Claude Code otwartej w tym repozytorium.

## Jak zacząć — od jednego agenta do pełnego systemu

Nie musisz budować systemu z 8 agentami na start. To najprostszy sposób żeby się zniechęcić. Zacznij od jednego.

1. **Zidentyfikuj jedną powtarzalną rolę** w firmie — coś co robisz regularnie i co można opisać zestawem reguł
2. **Zainstaluj skill-creator** — `/plugins` → search → install
3. **Opisz intent** — co agent ma robić, z jakimi danymi pracować, jaki output generować
4. **Przejdź przez interview** — skill-creator zada Ci właściwe pytania
5. **Testuj z realnymi danymi** — nie z przykładowymi. Realne dane szybko pokażą luki w instrukcjach
6. **Iteruj na podstawie evals** — mierz, poprawiaj, mierz znowu
7. **Dodaj kolejnych agentów** — dopiero gdy pierwszy stabilnie działa

Jedno repo na start. Jeden agent. Jeden workflow. Rozbudowuj gdy masz fundament.

**Tip:** Zacznij od **encoded preference** — Twój specyficzny workflow, Twój format raportów, Twój proces analizy. To nie zdezaktualizuje się z nowym modelem. Capability uplift dodasz później.

Pisałem o operacjonalizacji AI w artykule o [trendach AI 2026](/blog/trendy-ai-2026-od-eksperymentow-do-operacjonalizacji). Tamte koncepcje były teoretyczne — ten system to ich praktyczna realizacja.

## Kluczowe wnioski

1. **Skills 2.0 to przeskok od promptów do modularnych, testowalnych agentów** — nie kolejna iteracja, a zmiana paradygmatu w pracy z AI
2. **Agent Skills standard zapewnia przenośność i brak vendor lock-in** — otwarty standard na agentskills.io, nie jesteś zamknięty w jednym narzędziu
3. **Skill-creator zamienia godziny ręcznej pracy w 20-minutowy workflow** — od intencji do działającego agenta z evals i benchmarks
4. **Git + skills = wersjonowanie, code review i historia zmian dla AI** — każdy agent to plik w repozytorium, każda zmiana to commit
5. **Zacznij od jednego agenta, nie od pełnego systemu** — jeden workflow, jedno repo, jeden agent, potem skaluj
6. **Encoded preference > capability uplift** dla specyficznych workflow — Twoje procesy się nie zdezaktualizują z nowym modelem
7. **Open source + komercjalizacja — nie musisz wybierać** — shared-skills publiczne, firmowe skills prywatne

---

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz zbudować system wieloagentowy dla swojej firmy?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomagam firmom projektować i wdrażać systemy AI agents — od jednego agenta do pełnej orkiestracji. Sprawdź shared-skills na GitHubie lub umów się na konsultację.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Przydatne zasoby

- [Agent Skills Standard](https://agentskills.io) — otwarty standard dla AI agentów
- [Skill Creator Plugin](https://github.com/anthropics/skill-creator) — oficjalne narzędzie Anthropic do budowy skills
- [shared-skills repo](https://github.com/200iqlabs/shared-skills) — open source multi-agent starter kit
- [Claude Code Skills docs](https://docs.anthropic.com/en/docs/claude-code/skills) — dokumentacja Skills 2.0

## FAQ

<details open>
<summary>

### Czym różnią się Skills 2.0 od zwykłych promptów systemowych w Claude Projects?

</summary>

Skills 2.0 to modularni agenci z dostępem do file system, web search i skryptów — nie tylko tekst w polu. Mają wersjonowanie przez Git, automatyczne testy (evals) i mogą być współdzielone między projektami. Prompt systemowy znika po zamknięciu sesji, skill jest persistent i działa w każdej sesji Claude Code.

</details>

<details open>
<summary>

### Czy potrzebuję umiejętności programowania żeby zbudować system wieloagentowy ze Skills 2.0?

</summary>

Nie musisz pisać kodu — skill-creator prowadzi Cię przez cały proces od opisu intencji do gotowego agenta. Podstawowa znajomość terminala i Git jest przydatna, ale nie wymagana. SKILL.md to Markdown z YAML header, nie język programowania.

</details>

<details open>
<summary>

### Ile kosztuje utrzymanie systemu wieloagentowego opartego na Claude Code i Skills 2.0?

</summary>

Sam Claude Code wymaga subskrypcji Claude Max lub Pro. Skills i Agent Skills standard są darmowe — to pliki Markdown w repozytorium Git. Typowy system z 4-8 agentami nie generuje dodatkowych kosztów poza subskrypcją Claude, bo skills to po prostu pliki tekstowe, nie osobne usługi.

</details>

<details open>
<summary>

### Jak zapewnić separację danych między agentami żeby nie mieli dostępu do informacji których nie powinni widzieć?

</summary>

Separacja kontekstów przez oddzielne repozytoria Git. Agent CFO dla 200IQ Labs operuje w repo spółki, agent dla PLSoft w osobnym repo — fizycznie nie widzą się nawzajem. Wspólne skills (shared-skills) zawierają tylko uniwersalne narzędzia i templates, nie dane firmowe. Każdy SKILL.md definiuje scope i ograniczenia dostępu agenta.

</details>

<details open>
<summary>

### Czy Agent Skills standard działa tylko z Claude Code czy też z innymi narzędziami AI?

</summary>

Agent Skills to otwarty standard opublikowany na agentskills.io, zaprojektowany jako vendor-agnostic. Obecnie najlepiej wspierany przez Claude Code, ale specyfikacja jest publiczna i inne narzędzia mogą ją zaimplementować. Brak vendor lock-in to jeden z głównych celów standardu — Twoje skills nie są zamknięte w jednym ekosystemie.

</details>

<details open>
<summary>

### Od czego najlepiej zacząć budowę systemu wieloagentowego w małej firmie lub jednoosobowej działalności?

</summary>

Zacznij od jednego agenta dla najczęściej powtarzanej roli — np. analiza finansowa, tworzenie contentu lub obsługa klienta. Zainstaluj skill-creator w Claude Code, opisz co agent ma robić i przetestuj z realnymi danymi. Dodawaj kolejnych agentów dopiero gdy pierwszy stabilnie działa i przynosi realną wartość.

</details>
