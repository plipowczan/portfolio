---
id: 22
slug: srodowisko-agentowe-ai-dwie-firmy
title: "Moje środowisko agentowe - jak buduję AI OS dla dwóch firm"
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
lang: pl
alternateSlug: agentic-ai-environment-two-companies
---

# Moje środowisko agentowe - jak buduję AI OS dla dwóch firm

Siadam rano do komputera, otwieram terminal i mówię: "sprawdź stan konta firmowego i porównaj z planem finansowym". Agent CFO ładuje kontekst, łączy się z Revolut API, analizuje ostatnie faktury i zostawia trzy rekomendacje. Potem pytam innego agenta o monitorowanie konkurencji - i dostaję briefing. Trzeci sprawdza terminy prawne i przypomina o zbliżającym się deadline umowy z klientem.

To praktyczna wersja tego, co teoretycznie rozkładam w [Software 3.0 i agentic engineering](/blog/software-3-0-agentic-engineering).

Każdy z tych agentów działa pod moim nadzorem - świadomie nie puszczam ich jeszcze w pełni autonomicznie. Uważam, że na tym etapie warto kilka razy przejść operację pod kontrolą, zanim ustawisz scheduler do działań cyklicznych. Ale sam fakt, że mam **osiem wyspecjalizowanych agentów**, z których każdy zarządza innym obszarem - finansami, prawem, marketingiem, contentem, produktem - to już ogromna zmiana. I co najważniejsze - ten sam zestaw agentów obsługuje **dwie różne firmy jednocześnie**.

W artykule o [Skills 2.0](/blog/skills-2-0-multi-agent-system-zarzadzanie-firma) opisywałem jak zbudowałem system wieloagentowy. Teraz pokażę coś głębszego - **architekturę**, która za tym stoi. Bo to nie agenty są rewolucyjne. Rewolucyjna jest separacja warstw, która sprawia, że cały system jest przenośny, wersjonowany i niezależny od dostawcy AI.

W tym artykule zobaczysz:

- Architekturę trzech warstw (Skills → Context → Tools) i dlaczego ta separacja jest kluczowa
- Jak ten sam zestaw agentów obsługuje dwie firmy z kompletnie różnymi kontekstami
- Dlaczego Git jest fundamentem zaufania do AI - i dlaczego bez niego nie dałbym agentom swobody
- Jak moje podejście wypada na tle alternatyw: Perplexity Computer, OpenClaw, Claude Dispatch

## Dwie firmy, jeden system

Pracuję na co dzień z dwoma repozytoriami-hubami, które nie są typowymi projektami kodu. To **systemy doradcze oparte na agentach AI**, zbudowane wokół plików Markdown i skryptów CLI.

### 200IQ Labs - spółka technologiczna

**200IQ Labs** to prosta spółka akcyjna, która rozwija produkt **Qamera AI** (wirtualne studio fotograficzne AI dla e-commerce) i oferuje wdrożenia środowisk agentowych w firmach.

Repozytorium `agentic-ai-system` zawiera pełny kontekst firmowy - finanse, zespół, marka, operacje, klienci. Wszystko w Markdown z nagłówkami "Last updated", żeby agenty wiedziały czy dane są aktualne.

Agenci w tym repo to: **CFO** (z integracjami Revolut Business API, Stripe, inFakt), **Doradca Podatkowy**, **Prawnik**, **Konsultant Biznesowy**, **Product Manager**, **LinkedIn Content** i **Marketing**. Każdy ma swój `SKILL.md` z instrukcjami, referencjami i narzędziami.

### PLSoft - jednoosobowa działalność

**PLSoft** to moja JDG aktywna od 2008 roku - szkolenia, doradztwo i wdrożenia z zakresu automatyzacji i AI. Repozytorium `agentic-ai-private` ma tę samą architekturę, ale z innym kontekstem biznesowym.

Te same **shared-skills** (CFO, Tax Advisor, Legal, Business Consultant) działają tu z danymi PLSoft zamiast 200IQ Labs. Do tego dochodzi unikalny skill **Coach The Five** - coaching biznesowy oparty na metodologii Tomasza Karwatki dla pierwszych 5 lat firmy. Jest też kontekst dla newslettera **Tech News Weekly** (~700 subskrybentów) i marki osobistej na LinkedIn.

**Kluczowy insight:** te same agenty, różne konteksty. Agent CFO wie jak analizować finanse - to jest skill. Ale **jakie** finanse analizuje - to jest context. Ta separacja jest fundamentem całej architektury.

## Architektura trzech warstw

Oba repozytoria opierają się na tym samym wzorcu architektonicznym. Wyobraź sobie to jako stos:

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

Każda warstwa ma jasno określoną odpowiedzialność i jest niezależna od pozostałych. Mogę podmienić IDE bez zmiany skills. Mogę dać klientowi te same skills z jego danymi firmowymi. Mogę dodać nowe narzędzie bez modyfikacji wiedzy domenowej.

### Skills - wiedza domenowa

**Skill** to modułowa instrukcja w pliku `SKILL.md` z katalogiem `references/` zawierającym szczegółowe materiały referencyjne. Struktura wygląda tak:

```yaml
---
name: cfo
description: >-
  Financial advisor and fractional CFO for business analysis.
  Use when analyzing cash flow, runway, costs, profitability.
---

# CFO Agent

## Quick Reference
| Aspekt     | Wartość                        |
|------------|--------------------------------|
| Rola       | Dyrektor finansowy             |
| Integracje | Revolut, Stripe, inFakt        |
| Triggery   | finanse, koszty, przychody     |

## Workflow
1. Sprawdź aktualność danych (Last updated)
2. Załaduj kontekst finansowy
3. Wykonaj analizę
4. Przygotuj rekomendacje
```

Kluczowe cechy skills:

- **Przenośność** - skill CFO działa identycznie w 200IQ Labs i PLSoft. Zmienia się tylko kontekst (dane firmowe), nie wiedza (jak analizować finanse).
- **Progressive disclosure** - `references/` ładowane są dopiero gdy rozmowa tego wymaga. Oszczędza context window, który jest ograniczony i drogi.
- **Podział na shared i private** - `shared-skills` (Apache 2.0, open-source) to wiedza domenowa, którą mogę udostępnić klientom. `private-skills` to proprietary logic specyficzny dla mojego biznesu.

### Context - dane firmowe

Kontekst to dane **unikalne dla każdej firmy**. Struktura katalogów wygląda tak:

```text
context/
├── company/
│   ├── overview.md          # Misja, struktura, dane rejestrowe
│   ├── team.md              # Zespół, role, kompetencje
│   └── operations.md        # Procesy operacyjne
├── finance/
│   ├── current-state.md     # Aktualne salda, runway
│   ├── budget-2026.md       # Plan finansowy
│   └── revenue-streams.md   # Źródła przychodów
├── clients/
│   ├── active/              # Aktywni klienci
│   └── pipeline/            # Potencjalni klienci
└── brand/
    ├── tone-of-voice.md     # Styl komunikacji
    └── linkedin-strategy.md # Strategia social media
```

Każdy plik Markdown zawiera nagłówek **"Last updated: YYYY-MM-DD"**. To minimum - agent widzi czy dane mają tydzień czy trzy miesiące i może ostrzec, że kontekst wymaga aktualizacji.

### Tools - integracje API

Trzecia warstwa to **lekkie skrypty CLI** (bash/Python) pobierające dane na żywo z zewnętrznych systemów. Świadomie wybrałem to podejście zamiast ciężkich frameworków MCP.

```bash
#!/bin/bash
# tools/revolut-balance.sh - pobierz aktualne salda z Revolut Business API
curl -s -H "Authorization: Bearer $REVOLUT_TOKEN" \
  "https://b2b.revolut.com/api/1.0/accounts" \
  | jq '.[] | {currency, balance}'
```

Dlaczego lekkie skrypty zamiast MCP? Trzy powody:

1. **Mniejsze zużycie context window** - definicje narzędzi MCP potrafią zajmować 40 000+ tokenów. Skrypt CLI to kilka linii.
2. **Łatwiejsze debugowanie** - `bash -x tools/revolut-balance.sh` i widzisz dokładnie co się dzieje.
3. **Zero zależności** - bash i curl są wszędzie. Nie potrzebuję specjalnych frameworków.

To nie znaczy, że MCP jest zły - dla dużych organizacji z dziesiątkami integracji ma sens. Ale dla mojej skali lekkie skrypty wygrywają pragmatyzmem.

## Jeden system, wiele IDE

Jednym z celów projektowych było **uniezależnienie od konkretnego IDE**. Skills w formacie Markdown działają w dowolnym narzędziu, które czyta pliki. Ale żeby to działało w praktyce, potrzebna jest synchronizacja.

Architektura opiera się na **Git submodules** i **symlinkach**:

- `shared-skills/` - submoduł Git z open-source skills (CFO, Legal, Tax, Business Consultant)
- `private-skills/` - osobne repozytorium z proprietary skills
- Symlinki do katalogów IDE: `.claude/skills/`, `.github/copilot/`, `.cursor/skills/`, `.agent/skills/`

Automatyczna synchronizacja odbywa się przez skrypt i git hooks:

```bash
#!/bin/bash
# tools/sync-skills.sh - synchronizuj skills do wszystkich IDE
SKILLS_DIR="shared-skills"
TARGETS=(".claude/skills" ".github/copilot" ".cursor/skills")

for target in "${TARGETS[@]}"; do
  mkdir -p "$target"
  for skill in "$SKILLS_DIR"/*/; do
    skill_name=$(basename "$skill")
    ln -sfn "../../$skill" "$target/$skill_name"
  done
done

echo "Skills synced to ${#TARGETS[@]} IDE targets"
```

Git hooks (`post-checkout`, `post-merge`) automatycznie uruchamiają ten skrypt po aktualizacji submodułów. Efekt? Aktualizujesz skill w jednym miejscu - zmiana propaguje się do Claude Code, Cursor, Copilot i Antigravity jednocześnie.

### Auto-triggering

Nie musisz ręcznie mówić "teraz chcę rozmawiać z CFO". Agenty **aktywują się automatycznie** na podstawie słów kluczowych w zapytaniu. Napisz "ile mamy na koncie?" albo "przeanalizuj koszty" - a agent CFO włącza się sam, ładuje kontekst finansowy i odpowiada z pozycji dyrektora finansowego.

To działa dzięki polu `description` w metadanych skilla. Dobre opisy z precyzyjnymi triggerami ("cash flow", "runway", "koszty", "przychody") sprawiają, że orkiestrator wybiera właściwego agenta bez interwencji użytkownika.

## Git jako fundament zaufania

To jest sekcja, którą uważam za najważniejszą w całym artykule. Bo technologia agentów zmienia się co tydzień. Ale **problem zaufania** zostanie z nami na lata.

Ludzie boją się dawać AI dostęp do swoich danych i plików. I mają rację - opisywałem realne zagrożenia w artykule o [OpenClaw](/blog/openclaw-bezpieczenstwo-agentow-ai), gdzie 28 tysięcy instancji było odsłoniętych na internet. Ale rozwiązaniem nie jest ograniczanie AI do bezużyteczności. Rozwiązaniem jest **budowanie systemów kontroli**.

Git daje mi dokładnie to:

- **`git diff`** - widzę dokładnie co agent zmienił w każdym pliku
- **`git revert`** - cofam w każdej chwili do dowolnego punktu
- **`git log`** - pełna historia zmian z timestampami i opisami
- **`git blame`** - wiem kto (lub co) zmodyfikowało konkretną linię

To tworzy pętlę zaufania: **im większa kontrola → im większa swoboda dla agenta → im szybciej dostarcza wartość → im więcej zyskuję**.

Pisałem o podobnym podejściu w kontekście zarządzania wiedzą w artykule o [Second Brain z Obsidian i Claude Code](/blog/second-brain-obsidian-claude-code-skills). Tam chodziło o organizację notatek. Tutaj stawka jest wyższa - chodzi o dane finansowe, prawne i operacyjne dwóch firm.

### Claude.ai Dispatch - świadome ograniczanie uprawnień

Oprócz Claude Code używam też funkcji **Dispatch** w Claude.ai, która umożliwia pracę na plikach i podłączonych narzędziach. Ale **świadomie ograniczam autonomię i dostępy**:

- **Dostęp do odczytu:** ClickUp (zadania), Revolut (salda), Stripe (subskrypcje), repozytoria GitHub
- **Brak dostępu do zapisu** - agent może analizować dane, ale nie może nic modyfikować w tych systemach
- **Kontrola zakresu** - precyzyjnie dobieram jakie narzędzia są podłączone

Anthropic jest gwarantem bezpieczeństwa środowiska, ale ostateczna decyzja o zakresie dostępu leży po mojej stronie. To fundamentalna różnica wobec podejścia [OpenClaw](/blog/openclaw-bezpieczenstwo-agentow-ai), gdzie domyślnie agent ma pełny dostęp do systemu - i to od użytkownika wymaga się sandboxowania.

## Jak to się ma do rynku

Rynek "AI agents" eksplodował w pierwszym kwartale 2026. Żeby osadzić moje podejście w kontekście, porównajmy cztery różne modele:

| Aspekt | Moje środowisko | Claude Dispatch | Perplexity Computer | OpenClaw |
|--------|-----------------|-----------------|---------------------|----------|
| **Model wdrożenia** | Self-managed repos + IDE | Cloud + local hybrid | Fully managed SaaS | Self-hosted runtime |
| **Kontrola danych** | 100% lokalna (Git) | Hybrid (Anthropic servers + local) | Cloud provider | 100% lokalna |
| **Koszt** | $0 infrastruktury + API calls | $20-200/mies. | $200+/mies. | $0 + API calls |
| **Vendor lock-in** | Zero (Markdown, YAML) | Anthropic ecosystem | Perplexity ecosystem | Niski (open source) |
| **Bezpieczeństwo** | Git + świadome uprawnienia | Sandbox VM, ~50% niezawodności | Izolowany pod K8s | Wymaga własnego sandboxingu |
| **Multi-IDE** | Tak (symlinki) | Nie (tylko Claude) | Nie (web UI) | Nie (własny runtime) |
| **Dla kogo** | Tech leaders, developerzy | Użytkownicy Claude | Biznes bez DevOps | Power-userzy, self-hosted |

### Dlaczego wybrałem swoje podejście

**Pełna kontrola.** Moje dane nigdy nie opuszczają moich repozytoriów (poza wywołaniami API do modeli). Konteksty firmowe - finanse, klienci, strategia - żyją w Git, nie na serwerach dostawcy.

**Przenośność.** Gdyby jutro Claude Code przestał istnieć, moje skills działałyby dalej w Cursor, Copilot lub dowolnym innym narzędziu czytającym Markdown. Zero migracji.

**Markdown jako lingua franca.** Uniwersalny format, czytelny zarówno dla ludzi jak i LLM-ów. Bez vendor lock-in. Bez proprietary formats.

**Git jako warstwa audytu.** Każda zmiana jest śledzona. Mogę porównać stan przed i po działaniu agenta. Mogę wrócić do dowolnego punktu w czasie.

Perplexity Computer jest świetny dla firm, które chcą "plug and play" za $200/mies. OpenClaw daje niesamowitą elastyczność, ale wymaga solidnego DevOps. Claude Dispatch to ciekawy kierunek, ale wciąż research preview. Moje podejście wymaga więcej pracy na starcie, ale daje **pełną kontrolę i zero zależności**.

## Co działa, co nie

Po kilku tygodniach intensywnego użytkowania tego systemu na dwóch firmach, mam jasny obraz co się sprawdza, a co wymaga pracy.

### Co działa dobrze

1. **Separacja skills od kontekstu** - mogę dać klientowi ten sam zestaw agentów, on podłącza swoje dane firmowe i działa. Przetestowane na dwóch firmach.
2. **Git jako warstwa bezpieczeństwa** - pełny audyt, rollback, porównywanie zmian. Fundamentalne dla zaufania.
3. **Markdown jako lingua franca** - uniwersalny, czytelny, bez vendor lock-in. Działa w każdym IDE i z każdym modelem.
4. **Lekkie integracje bash/Python** - mniejsze zużycie context window niż MCP, łatwiejsze debugowanie.
5. **Progressive disclosure** - skill ładuje referencje dopiero gdy są potrzebne. Krytyczne przy ograniczonym context window.
6. **Auto-triggering** - agenty aktywują się automatycznie. Nie trzeba ręcznie wybierać "teraz chcę rozmawiać z CFO".

### Co wymaga poprawy

1. **Przenośność pamięci między platformami** - skills działają w wielu IDE, ale pamięć i stan rozmów są locked per platforma. Claude Code nie wie co powiedziałem w Cursor.
2. **Freshness kontekstu** - nagłówki "Last updated" to absolutne minimum. Brakuje automatycznego ostrzegania gdy dane są stare i mechanizmu auto-aktualizacji.
3. **Onboarding klientów** - wdrożenie nowego klienta to ~4h pracy. Za dużo. Skill `environment-setup` pomaga, ale potrzebuję bardziej zautomatyzowanego procesu.
4. **Brak CI/CD dla skills** - weryfikacja jakości skills jest manualna (przez skill-creator evals). Brakuje automatycznego pipeline'u testującego czy skill nadal działa po zmianie.
5. **Sandbox** - Nanoclaw (sandbox od NVIDIA) ma potencjał na autonomiczne zadania nocne (analizy, raporty), ale model bezpieczeństwa wymaga dopracowania zanim dam mu prawdziwe dane.

## Sześć zasad projektowania środowiska agentowego

Na podstawie tych doświadczeń wykrystalizowało się sześć zasad, które traktuję jak fundamenty:

1. **Kontrola wersji jest fundamentem** - bez Git nie ma zaufania. Bez zaufania nie ma autonomii dla agenta. Bez autonomii agent jest bezużyteczny.
2. **Separuj wiedzę od danych** - skills (przenośne, open-source) vs context (unikalne per firma, prywatne). To jest ta sama zasada co separation of concerns w programowaniu.
3. **Ograniczaj uprawnienia świadomie** - odczyt tak, zapis z kontrolą, autonomia proporcjonalna do poziomu audytu. Nie dawaj agentowi pełnego dostępu "bo tak wygodniej".
4. **Buduj na otwartych formatach** - Markdown, YAML, skrypty CLI. Zero vendor lock-in. Jutro możesz zmienić dostawcę AI bez zmiany architektury.
5. **Progressive disclosure** - nie ładuj wszystkiego na raz. Context window jest ograniczony i drogi. Skill powinien ładować referencje dopiero gdy są potrzebne.
6. **Code-first, no-code gdy trzeba** - agenty mają być narzędziem dla ludzi technicznych, nie zastępstwem dla nich. Dla klientów bez zespołu technicznego - no-code alternatywy.

## Co dalej

To nie jest gotowy produkt - to **żywy system**, który ewoluuje każdego dnia. Kilka kierunków, nad którymi aktywnie pracuję:

- **Standaryzacja pamięci agenta** - jak zrobić, żeby pamięć i kontekst rozmów były przenośne między platformami? Dziś Claude Code, Cursor i Copilot mają osobne pamięci. To trzeba rozwiązać.
- **Sandbox dla autonomicznych zadań** - Nanoclaw od NVIDIA ma potencjał na nocne analizy i raporty. Ale model bezpieczeństwa wymaga więcej pracy zanim zaufam mu z prawdziwymi danymi.
- **Skalowanie na zespół** - wspólne skills, różne konteksty, różne poziomy uprawnień. Jak dać juniorowi read-only dostęp do agenta prawnego, a seniorowi pełne uprawnienia?
- **Mierzenie ROI** - ile czasu oszczędzam? Jaka jest jakość decyzji? O ile mniej context-switchingu? Potrzebuję metryk, nie przeczuć.

Będę się dzielił postępami. Jeśli budujesz coś podobnego albo rozważasz wdrożenie środowiska agentowego w swojej firmie - opisuję też szczegóły techniczne w artykule o [OPSX Workflow](/blog/opsx-workflow-strukturyzowana-praca-z-ai) i [5 technikach pracy z Claude Code](/blog/5-technik-pracy-z-claude-code).

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz zbudować środowisko agentowe dla swojej firmy?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci zaprojektować architekturę agentów AI dopasowaną do Twojego biznesu - od analizy procesów przez budowę skills po wdrożenie integracji z narzędziami, których już używasz.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## FAQ

<details open>
<summary>

### Czym jest środowisko agentowe AI i czym różni się od pojedynczego chatbota?

</summary>

Środowisko agentowe to system wielu wyspecjalizowanych agentów AI z dostępem do narzędzi, danych firmowych i integracji z zewnętrznymi systemami. W przeciwieństwie od chatbota, agenty mają persistent memory (pamiętają kontekst między sesjami), automatyczne triggery (aktywują się na słowa kluczowe) i mogą zarządzać konkretnymi obszarami firmy - finansami, prawem, marketingiem. Chatbot odpowiada na pytania, środowisko agentowe **zarządza procesami**.

</details>

<details open>
<summary>

### Ile kosztuje zbudowanie własnego środowiska agentowego opartego na Agent Skills?

</summary>

Koszty infrastruktury wynoszą $0 - skills i konteksty to pliki Markdown w repozytorium Git, nie wymagają specjalnego hardware'u. Jedyny koszt to API calls do modeli AI (Claude, GPT, Gemini). Przy typowym użyciu biznesowym to $20-200/mies. za API, zależnie od intensywności i wybranego modelu. Do tego dochodzi czas na konfigurację - pierwsze wdrożenie wymaga ~4h pracy technicznej.

</details>

<details open>
<summary>

### Czy potrzebuję umiejętności programowania, żeby wdrożyć system agentowy w firmie?

</summary>

Tak, podstawowe umiejętności techniczne są potrzebne - obsługa terminala, Git i edycja plików Markdown. To podejście code-first, gdzie agenty są narzędziem dla ludzi technicznych. Dla firm bez zespołu technicznego lepszym wyborem mogą być gotowe rozwiązania SaaS jak Perplexity Computer ($200/mies.) lub Claude Dispatch - dają mniej kontroli, ale zero konfiguracji.

</details>

<details open>
<summary>

### Jak zapewnić bezpieczeństwo danych firmowych przy pracy z agentami AI?

</summary>

Trzy kluczowe elementy: Git jako warstwa audytu (widzisz dokładnie każdą zmianę agenta w plikach), świadome ograniczanie uprawnień (read-only dostęp do API, zero zapisu w zewnętrznych systemach bez zatwierdzenia) oraz separacja kontekstów (dane firmowe oddzielone od wiedzy domenowej skills). Kontrola wersji eliminuje strach - zawsze możesz cofnąć zmiany przez `git revert`.

</details>

<details open>
<summary>

### Czy ten system działa tylko z Claude Code, czy mogę użyć Cursor lub innego IDE?

</summary>

System jest celowo niezależny od konkretnego IDE. Skills w formacie Markdown działają w Claude Code, Cursor, GitHub Copilot i Antigravity jednocześnie dzięki symlinkom i git hooks. Zmiana IDE nie oznacza utraty konfiguracji ani wiedzy agentów. To kluczowa zaleta podejścia opartego na otwartych formatach - zero vendor lock-in.

</details>
