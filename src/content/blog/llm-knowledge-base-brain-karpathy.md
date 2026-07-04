---
id: 24
slug: llm-knowledge-base-brain-karpathy
title: "Jak LLM Wiki Karpathy'ego pomogła mi uporządkować moją bazę wiedzy"
excerpt: "Od ręcznych notatek w Obsidian do systemu, w którym agent pilnuje struktury, indeksów i standardów. Jak koncepcja LLM Wiki pomogła mi sformalizować to, co budowałem od lat."
category: AI
author: Pawel Lipowczan
date: 2026-04-12
modified: 2026-06-22
readTime: 15 min
image: /images/og-llm-knowledge-base-brain-karpathy.webp
tags:
  - AI
  - Claude Code
  - Obsidian
  - Second Brain
  - PKM
  - Knowledge Management
lang: pl
alternateSlug: karpathy-llm-wiki-knowledge-base
---

## Karpathy opisał framework. Ja miałem żywy system do uporządkowania

Andrej Karpathy w kwietniu 2026 opublikował na X [wątek o "LLM Wiki"](https://x.com/karpathy/status/2039805659525644595) - koncepcji, w której LLM buduje i utrzymuje persistent wiki z Twoich źródeł. Zamiast klasycznego RAG, który szuka fragmentów na żądanie, LLM aktywnie zarządza bazą wiedzy: tworzy notatki, aktualizuje cross-referencje, flaguje sprzeczności.

Czytam ten wątek i mam déjà vu. Nie dlatego, że zbudowałem to samo - ale dlatego, że od 2022 roku organicznie ewoluowałem w tym kierunku. Mój vault w Obsidian zaczynał jako klasyczny zbiór ręcznych notatek - kilkadziesiąt plików Markdown, ręcznie linkowanych, rosnących bez jasnej struktury. Z czasem **Claude Code** przejął coraz więcej pracy: najpierw proste formatowanie, potem indeksowanie, wreszcie pełne zarządzanie strukturą i standardami. W pewnym momencie zdałem sobie sprawę, że agent robi więcej maintenance niż ja.

Repozytorium Karpathy'ego - [LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) - nie było dla mnie odkryciem nowego świata. Było **katalizatorem porządkowania**. Karpathy dał nazwę warstwom, które u mnie istniały chaotycznie. Pomógł mi sformalizować separation między raw sources a przetworzoną wiki. Dopisać safety rules, które wcześniej miałem tylko w głowie. Opisał navigation protocol, który u mnie działał intuicyjnie, ale nigdy nie był udokumentowany.

> _"Boring part of maintaining a knowledge base isn't reading or thinking - it's bookkeeping."_ - Karpathy

To jest historia ewolucji od ręcznego PKM do agentowego systemu wiedzy. Z Karpathym jako katalizatorem, który pomógł mi uporządkować to, co budowałem od lat. I z jednym centralnym konceptem, który zmienił wszystko: **progressive disclosure** - organizacja notatek tak, żeby agent AI mógł je znaleźć bez zaśmiecania okna kontekstowego.

W tym artykule pokażę tę ewolucję: od chaosu ręcznych notatek, przez stopniowe przekazywanie maintenance agentowi, do systemu z 185 notatkami, trzema indeksami nawigacyjnymi i czterema workflow. Pokażę konkretną architekturę, konkretne procesy i konkretne liczby - nie teorię.

## Problem z klasycznym PKM

Każdy, kto próbował utrzymać bazę wiedzy przez dłużej niż kilka miesięcy, zna ten wzorzec: na początku jest entuzjazm, potem rośnie chaos, na końcu porzucasz system.

Dlaczego klasyczne podejścia nie skalują się:

- **Maintenance burden rośnie szybciej niż wartość.** Każda nowa notatka to potencjalne linki do dziesiątek istniejących. Przy 50 notatkach to jeszcze ogarniam. Przy 185 - nie ma szans. Koszt utrzymania porządku rośnie wykładniczo, a wartość z każdej dodanej notatki - liniowo.
- **Cross-referencje są zawsze niepełne.** Piszę notatkę o context engineering i zapominam, że trzy miesiące temu zapisałem coś powiązanego w zupełnie innym folderze. Link nigdy nie powstaje. A bez tego linku - wiedza jest rozproszona, jakby nie istniała.
- **Wikis giną z powodu maintenance, nie braku wartości.** Nikt nie porzuca bazy wiedzy bo jest bezwartościowa. Porzuca ją, bo utrzymanie staje się chore. Widziałem to nie raz - w firmach, w open-source, we własnych projektach.
- **Zettelkasten, BASB, Digital Garden - piękne filozofie.** Building a Second Brain Tiago Forte, Zettelkasten Luhmanna, Digital Garden - każda z tych metodologii ma sens na papierze. Ale wszystkie zakładają, że TY jesteś bottleneckiem maintenance. I mają rację - dlatego systemy umierają. Nie dlatego że ludzie są leniwi. Dlatego że bookkeeping to nie jest praca, na którą masz czas obok pisania kodu, prowadzenia firmy i czytania nowych rzeczy.

Karpathy ujął to precyzyjnie: nudna część utrzymania knowledge base to nie czytanie ani myślenie. To bookkeeping - aktualizowanie cross-referencji, pilnowanie aktualności podsumowań, notowanie sprzeczności. **LLMs don't get bored.** I to jest kluczowa obserwacja. Nie chodzi o to, że AI jest mądrzejszy w organizowaniu wiedzy. Chodzi o to, że AI nie ma problemu z powtarzalnymi, nudnymi zadaniami, które ludzie odkładają na "kiedyś".

Przez trzy lata z Obsidianem przeszedłem przez każdy z tych etapów. Zaczynałem z entuzjazmem, potem pojawiły się duplikaty i osierocone notatki, wreszcie doszedłem do punktu gdzie szukanie czegokolwiek zajmowało więcej czasu niż pisanie od nowa. Mój vault przetrwał, bo w pewnym momencie przestałem walczyć z maintenance ręcznie - i oddałem go agentowi.

## Architektura - jak to wygląda po uporządkowaniu

### Stack techniczny

System opiera się na pięciu elementach:

- **[Obsidian](https://obsidian.md/)** - edytor i frontend (lokalny, Git-based)
- **[Quartz 4](https://quartz.jzhao.xyz/)** - Static Site Generator → GitHub Pages
- **GitHub Actions** - automatyczny deploy na push do brancha `v4`
- **Claude Code** - agent utrzymujący vault
- **URL publiczny:** [brain.lipowczan.pl](https://brain.lipowczan.pl)

Obsidian to interfejs dla mnie - tu czytam, przeglądam graph view, robię ad hoc notatki. Quartz 4 to interfejs dla świata - statyczna strona na GitHub Pages, dostępna pod [brain.lipowczan.pl](https://brain.lipowczan.pl). Claude Code to silnik, który pilnuje porządku między jednym a drugim. Całość jest Git repo - każda zmiana tracked, każdy ingest to commit, historia jest pełna i revertable.

### Trzy warstwy - framework Karpathy'ego, który pomógł mi uporządkować

Te warstwy istniały u mnie organicznie od dawna. Miałem inbox na surowe materiały, przetworzony content i jakąś formę konfiguracji. Ale Karpathy dał im nazwy i formalną strukturę - i to pomogło mi je wyostrzyć.

| Warstwa     | Karpathy (LLM Wiki)     | Moja implementacja                                 |
| ----------- | ----------------------- | -------------------------------------------------- |
| Raw sources | Immutable drop zone     | `/content/_raw/inbox/` - drop zone, nie w buildzie |
| Wiki        | LLM-generated .md files | `/content/<TOPIC>/` - budowane i publikowane       |
| Schema      | Config document         | `CLAUDE.md` - 300+ linii konfiguracji agenta       |

Separacja raw sources od wiki to kluczowa zmiana, którą sformalizowałem po przeczytaniu Karpathy'ego. Wcześniej surowe materiały i przetworzone notatki mieszały się w jednym katalogu - czasem agent modyfikował źródło zamiast tworzyć nową notatkę. Teraz inbox jest immutable drop zone - agent przetwarza, ale oryginał zostaje nietknięty w `_raw/processed/`. Zawsze mogę wrócić do źródła i porównać z tym co agent z niego zrobił. To prosty safety mechanism, ale daje spokój ducha - wiem że nic nie jest tracone.

### Progressive disclosure - dlaczego notatki są ułożone DLA agenta

To centralny koncept całego systemu. Notatki nie są ułożone żeby ładnie wyglądały w Obsidian graph view. Są ułożone żeby **agent AI mógł je szybko znaleźć BEZ zaśmiecania okna kontekstowego** niepotrzebnymi informacjami.

Trzy indeksy nawigacyjne - od ogółu do szczegółu:

- **`vault-map.md`** (~80 linii) - bird's-eye view całego vault. Agent czyta ZAWSZE jako pierwszy. Wystarczy żeby zrozumieć strukturę i zdecydować gdzie szukać dalej.
- **`catalog.md`** (~650 linii) - jedna linia per notatka z tytułem, kategorią i krótkim opisem. Agent czyta gdy potrzebuje znaleźć konkretną notatkę.
- **`graph.md`** - wikilink graph (outgoing + incoming edges). Agent czyta gdy potrzebuje kontekstu powiązań między notatkami.

```text
_indexes/
├── vault-map.md   ← zawsze pierwszy (~80 linii)
├── catalog.md     ← 1 linia / notatka (~650 linii)
└── graph.md       ← wikilink edges
```

Agent nawiguje jak człowiek ze spisem treści - nie grep-uje 185 plików. Czyta vault-map (80 linii), decyduje który temat jest relevant, sięga do catalog po konkretne notatki, a jeśli potrzebuje kontekstu powiązań - otwiera graph. Dzięki temu okno kontekstowe zostaje czyste, a odpowiedzi są trafniejsze.

Porównaj to z naiwnym podejściem: "wrzuć wszystkie pliki do context window i pytaj". Przy 185 notatkach po ~500 słów to ~92 500 tokenów samych notatek. Większość modeli albo tego nie pomieści, albo "zgubi się" w połowie - zacznie odpowiadać na podstawie fragmentów, które akurat trafiły blisko zapytania w embedding space, ignorując resztę. Progressive disclosure rozwiązuje ten problem elegancko: agent czyta tyle ile potrzebuje, w kolejności od ogółu do szczegółu.

To jest **progressive disclosure** w praktyce. Minimalizacja zużycia context window to nie optymalizacja - to fundament, bez którego agent gubi się w szumie. Bez nawigacyjnych indeksów masz dwa wyjścia: albo dajesz agentowi cały vault (za dużo kontekstu), albo sam wskazujesz które pliki czytać (wraca ręczna praca). Indeksy eliminują oba problemy.

## CLAUDE.md - "schema" jako serce systemu

Karpathy nazywa to **"schema document"** - plik definiujący jak agent powinien traktować bazę wiedzy. W moim przypadku to `CLAUDE.md` - 300+ linii konfiguracji wstrzykiwanej do system promptu Claude Code przy każdej sesji.

Co zawiera moje CLAUDE.md - i dlaczego każda sekcja istnieje:

- **Struktura katalogów** i przeznaczenie każdego folderu - żeby agent wiedział gdzie tworzyć notatki i czego nie ruszać
- **Navigation protocol** - progressive disclosure, kolejność czytania indeksów, kiedy sięgać po pełne pliki - żeby agent nie zaśmiecał sobie context window
- **Writing style guidelines** - styl pisania notatek, mix PL/EN, emoji w nagłówkach, formatowanie - żeby wszystkie notatki wyglądały spójnie niezależnie od sesji
- **Frontmatter schema** - YAML metadane każdej notatki (wymagane pola, typy, walidacja) - żeby agent nie tworzył notatek z niekompletnym metadanymi
- **Workflow definitions** - INGEST, COMPILE, LINT, Q&A, ENHANCE z konkretnymi krokami - żeby każdy workflow był powtarzalny i deterministyczny
- **Safety rules** - czego agent nigdy nie powinien modyfikować ani usuwać (np. indeksy tylko aktualizować, nie przebudowywać od zera; nie zmieniać frontmatter istniejących notatek bez potwierdzenia)

```yaml
# Fragment frontmatter schema z CLAUDE.md
required_fields:
  - title # Tytuł notatki
  - category # Kategoria tematyczna (AI, BUSINESS, CODE...)
  - tags # Lista tagów
  - summary # 2-3 zdania podsumowania
  - created # Data utworzenia (YYYY-MM-DD)
  - updated # Data ostatniej aktualizacji
  - source # Skąd pochodzi wiedza (URL, książka, doświadczenie)
```

**Kluczowy insight:** CLAUDE.md nie jest generowane przez LLM. Jest pisane ręcznie i ewoluuje z doświadczenia. Badanie ETH Zurich (2026) pokazało, że LLM-generated agentfiles _pogarszały_ performance agentów przy **20%+ wyższym koszcie**. Powód jest prosty - LLM generuje verbose, redundantne instrukcje, które zaśmiecają context window. Ręcznie pisane instrukcje są precyzyjne i universally applicable.

To kontraintuicyjne. Wydaje się, że skoro LLM pisze lepszy tekst niż większość ludzi, to powinien pisać sobie konfigurację. W praktyce - LLM generuje "na wszelki wypadek" instrukcje, powtarza się, dodaje edge case'y które nigdy nie zachodzą. Efekt: 800 linii zamiast 300, context window zaśmiecone, agent wolniejszy i mniej precyzyjny.

> _"Kluczowy insight: większość failures agentów to nie problem modelu, lecz konfiguracji."_

Less is more. Każda linia w CLAUDE.md musi mieć uzasadnienie. Zaczynam od prostego, dodaję tylko co faktycznie potrzebuję, usuwam co się nie sprawdza. To żywy dokument - nie spec napisany raz i zapomniany. Moje CLAUDE.md przeszło przez kilkanaście iteracji - niektóre reguły dodałem po tym jak agent usunął ważne metadane, inne po tym jak zignorował istniejące powiązania. Każda reguła to lekcja z konkretnego failure.

## Workflows - co agent umie zrobić

### INGEST - od pliku do wiedzy w 5 minut

To najczęstszy workflow - i ten, który najlepiej pokazuje wartość systemu. Kiedyś przetworzenie jednego artykułu na notatkę zajmowało mi 20-30 minut. Przy 10 źródłach - cały wieczór. Z agentem? 5 minut + review.

Jak wygląda INGEST krok po kroku:

1. **Drop** - wrzucam plik do `_raw/inbox/` - artykuł, PDF, transkrypt, notatka z Web Clippera, cokolwiek w formacie tekstowym
2. **Trigger** - piszę `ingest` w Claude Code
3. **Navigate** - agent czyta `vault-map.md`, sprawdza `catalog.md` pod kątem nakładania się z istniejącymi notatkami. Jeśli temat już istnieje - proponuje aktualizację zamiast duplikatu
4. **Create** - tworzy notatkę z template'u, wypełnia frontmatter (kategoria, tagi, summary, source, data)
5. **Link** - dodaje wikilinki do powiązanych notatek - i aktualizuje te notatki żeby linkowały z powrotem (bidirectional linking)
6. **Archive** - przenosi source do `_raw/processed/YYYY-MM-DD_nazwa` - oryginał zostaje, ale poza inboxem
7. **Index** - aktualizuje wszystkie trzy indeksy (vault-map, catalog, graph)

Jeden source może dotknąć **10-15 plików** w jednym passie. Notatka + aktualizacje powiązanych notatek + trzy indeksy. Ręcznie - 2 godziny przy dbałości o cross-referencje. Z agentem - 5 minut + mój review, który sprawdza czy agent poprawnie zrozumiał materiał i umieścił go we właściwym kontekście.

Review to kluczowy element. Nie akceptuję wyniku INGEST na ślepo. Sprawdzam: czy kategoria jest poprawna? Czy tagi mają sens? Czy cross-referencje wskazują na faktycznie powiązane notatki, a nie na luźne skojarzenia? Czy summary oddaje istotę źródła? To zajmuje 2-3 minuty, ale daje pewność, że vault utrzymuje jakość. Agent robi 95% pracy - ja dbam o te kluczowe 5%, które wymagają ludzkiego judgmentu.

### COMPILE - syntetyzuj z wielu źródeł

Agent łączy wiele notatek w skompilowany artykuł. Przykład: notatka o LLM Knowledge Bases to skompilowany artykuł z wątku Karpathy'ego, moich notatek o RAG i kontekstu z vault. Agent czyta źródła, identyfikuje wspólne wątki, syntetyzuje i tworzy `compiled-note` z pełnymi cytatami.

Jak to wygląda w praktyce: mówię "compile everything I have about context engineering into a single note". Agent czyta catalog, identyfikuje 7 powiązanych notatek, czyta je, wyciąga kluczowe koncepcje i buduje spójny artykuł z sekcjami i cytatami. Rezultat: jedna comprehensive notatka zamiast 7 rozproszonych fragmentów, z wyraźnym attribution do źródeł.

To workflow, którego ręcznie nigdy bym nie robił regularnie - bo wymaga przeczytania i zestawienia wielu dokumentów naraz. Przy 7 notatkach po 500 słów to 3500 słów do przeczytania, zrozumienia i zsyntezowania. Agent robi to w minuty - i co ważne, nie pomija notatek które ja bym przeoczył bo zapomniałem o ich istnieniu.

### Q&A - odpowiedzi z cytowaniami w 30 sekund

"What do my notes say about context engineering?" - agent czyta indeksy, identyfikuje kandydatów, czyta notatki, syntetyzuje odpowiedź z cytowaniami. Dobre odpowiedzi mogą trafić z powrotem do wiki jako nowe compiled-notes.

To zamienia bazę wiedzy z pasywnego archiwum w **aktywne narzędzie myślenia**. Zamiast grzebać w folderach, zadaję pytanie i dostaję syntezę z moich własnych notatek - z linkami do źródeł. Co kluczowe: agent odpowiada na podstawie MOJEJ wiedzy, nie ogólnego internetu. Jeśli trzy miesiące temu zapisałem ważny insight z konferencji - Q&A go znajdzie i przywołuje, nawet jeśli ja sam zapomniałem że go zapisałem.

Inny przykład: "Compare what my notes say about RAG vs what Karpathy describes as LLM Wiki." Agent czyta obie notatki, identyfikuje punkty zbieżności i rozbieżności, prezentuje porównanie. To typ analizy, który ręcznie wymagałby otwarcia dwóch dokumentów i porównywania paragraf po paragrafie.

### LINT - health-check

Periodyczny health-check vault: broken wikilinks, orphan notes (notatki bez żadnych powiązań), brakujące summaries, TODO markery, niekompletny frontmatter. Agent generuje raport do `_outputs/reports/` i proponuje fixy.

Typowy raport LINT po miesiącu:

- 4 broken wikilinks (notatki zmienione/przeniesione bez aktualizacji referencji)
- 2 orphan notes (dodane ale nigdy nie zlinkowane z resztą vault)
- 7 brakujących summaries (notatki z pustym polem summary we frontmatter)
- 3 notatki z TODO markerami (niedokończone przetwarzanie)

LINT to workflow, o którym nie myślisz aż nie zobaczysz raportu z 23 broken wikilinks po miesiącu dodawania notatek. To hygiene - jak linting kodu. Nie jest sexy, ale bez niego vault degeneruje się w ciszy. Agent robi to za mnie - regularnie i bez zapominania.

## Od ręcznych notatek do 185 plików pilnowanych przez agenta

Ewolucja tego systemu nie była planowana. Nie usiadłem w 2022 roku z architekturą w głowie. To był organiczny proces, w którym każda faza rozwiązywała konkretny problem z poprzedniej.

**Faza 1 (2022-2024): Ręczne notatki w Obsidian.** Klasyczny setup - foldery tematyczne, wikilinki, tagi. Zapisywałem notatki z książek, konferencji, kursów. Działało do ~50 notatek. Potem zaczął rosnący chaos: niepełne cross-referencje, zapomniany content, duplikaty. Szukanie konkretnej informacji zaczęło trwać dłużej niż po prostu wyszukanie jej w Google od nowa. Typowa trajektoria PKM - entuzjazm, plateau, frustracja.

**Faza 2 (2024-2025): Agent zaczyna pomagać.** Kiedy zacząłem intensywnie pracować z Claude Code, naturalnie zacząłem go używać do prostych tasków w vault. Najpierw formatowanie i uzupełnianie frontmatter - nudna robota, idealna dla agenta. Potem linkowanie nowych notatek z istniejącymi - agent jest w tym lepszy ode mnie, bo czyta cały catalog za każdym razem. W końcu - pełne przetwarzanie źródeł od zera: drop plik, powiedz `ingest`, agent robi resztę. W tej fazie powstał pierwszy CLAUDE.md - jeszcze prosty, ~80 linii, ale już definiujący strukturę i podstawowe zasady.

**Faza 3 (2026): Karpathy LLM Wiki → formalizacja.** Wątek Karpathy'ego dał mi framework do nazwania tego co miałem. Trzy warstwy - raw sources, wiki, schema - nagle miały oficjalne nazwy. Navigation protocol przestał być "sposób w jaki to robię" i stał się udokumentowaną procedurą. Safety rules, które trzymałem w głowie, trafiły do CLAUDE.md. Sformalizowałem procesy, dopisałem brakujące elementy, uporządkowałem indeksy. CLAUDE.md urosło z 80 do 300+ linii.

Stan dziś: **185 notatek**, 13 kategorii tematycznych. Breakdown:

- `AI/` - 19 notatek (Claude Code, harness engineering, context engineering, skills)
- `LIFE/` - 40 notatek (książki, wiedza, narzędzia)
- `BUSINESS/` - 26 notatek
- `CODE/` - 23 notatki
- `PROJECTS/` - 12 notatek (Qamera AI, Brain, Agentic Systems)

Porównanie workflow - kiedyś i teraz:

- **Kiedyś:** przeczytam artykuł → może zapiszę link w bookmarkach → zapomnę gdzie i w jakim kontekście → szukam od nowa gdy potrzebuję → tracę 20 minut na odtworzenie kontekstu
- **Teraz:** klikam Obsidian Web Clipper → artykuł ląduje w `_raw/inbox/` → piszę `ingest` w Claude Code → agent wplata notatkę w sieć wiedzy z cross-referencjami → przy pytaniu: Q&A w 30 sekund z cytowaniami i linkami do źródeł

> _"Wiki to persistent, compounding artifact - cross-references gotowe, contradictions flagged."_

Co się compound-uje: agent pilnuje struktury i standardów, każda notatka automatycznie trafia we właściwe miejsce z właściwymi linkami. Wiedza się kumuluje, nie rozprasza. Im więcej notatek, tym bogatsza sieć powiązań - i tym cenniejsza każda następna notatka, bo agent ma więcej kontekstu do linkowania. To odwrócenie tradycyjnego problemu PKM, gdzie więcej notatek = więcej chaosu. Tutaj więcej notatek = bogatszy graph.

## Notatki ułożone dla agenta, nie dla estetyki

To jest kluczowy mindset shift, który zmienił moje podejście do PKM. Nie organizujesz notatek żebyś TY łatwiej szukał. Organizujesz je żeby **AGENT łatwiej znajdował**.

Agent jest primary consumer Twojej bazy wiedzy. Ty jesteś curator - odpowiadasz za sourcing (co wrzucasz do inbox), eksplorację (jakie pytania zadajesz) i decyzje (co kompilować, co archiwizować). Agent odpowiada za bookkeeping: tworzenie notatek, aktualizację indeksów, pilnowanie cross-referencji, flagowanie sprzeczności. To podział, który pozwala Ci skupić się na myśleniu, nie na administracji.

**Progressive disclosure** minimalizuje zużycie okna kontekstowego. Agent nie musi czytać 185 plików żeby odpowiedzieć na pytanie. Czyta 80 linii vault-map, identyfikuje relevant area, czyta kilka konkretnych notatek. Trafniejsze odpowiedzi, niższy koszt, szybsze działanie.

Żeby to zobaczyć w liczbach: gdyby agent czytał cały vault przy każdym zapytaniu, to ~185 plików × ~500 słów = ~92 500 słów wstrzykniętych do context window. Z progressive disclosure: vault-map (80 linii) + 3-5 relevantnych notatek = ~3000 słów. **30x mniej kontekstu, ale trafniejsze odpowiedzi** - bo agent wie co czyta i dlaczego.

Paralela z agentic coding jest bezpośrednia:

|       | Agentic Coding                                    | LLM Knowledge Base                   |
| ----- | ------------------------------------------------- | ------------------------------------ |
| Ty    | Architekt środowiska (specs, context, guardrails) | Curator (sourcing, pytania, decyzje) |
| Agent | Implementuje kod                                  | Bookkeeper, writer, cross-referencer |

Agent nie zastępuje myślenia - zastępuje bookkeeping. To nie jest subtelna różnica. Decyzja CO ingestować, jakie pytania zadać, co kompilować - to nadal Twoja robota. Agent jest maszyną do utrzymania porządku, nie maszyną do myślenia za Ciebie.

Kiedy próbujesz oddać agentowi decyzje - dostajesz generyczne, "bezpieczne" odpowiedzi. Kiedy oddajesz mu utrzymanie, a sam skupiasz się na kuratorstwie - dostajesz system, który się compound-uje z każdą nową notatką. Każde źródło wzbogaca istniejącą sieć wiedzy. Cross-referencje powstają automatycznie. Sprzeczności między notatkami są flagowane. Summary jest zawsze aktualne.

> _"Shift: from 'developer who writes code' to 'architect who designs systems for agents to write code.'"_

Ten sam shift dotyczy wiedzy: from "person who maintains notes" to "curator who designs systems for agents to maintain knowledge." Ty decydujesz co jest warte zapisania. Agent dba o to, żeby zapisane informacje były zawsze dostępne, powiązane i aktualne.

## Co z tego wynika

Pięć wniosków po trzech latach budowania tego systemu:

1. **Metodologia > narzędzie.** Zettelkasten, Building a Second Brain, LLM Wiki - to filozofie, nie aplikacje. Obsidian, Notion, Logseq - to narzędzia. Kluczowe jest zrozumienie _dlaczego_ organizujesz wiedzę w określony sposób, nie _w czym_. Możesz zbudować ten sam system w Notion z agentem, albo w czystym VS Code z plikami Markdown. Narzędzie jest wymienne - zasady nawigacji, indeksowania i progressive disclosure działają wszędzie.
2. **CLAUDE.md to kontrakt z agentem.** Ewoluuje z doświadczenia - zaczynasz od prostego, dodajesz na podstawie tego co agent robi źle, usuwasz co nie działa. Po miesiącu masz solidną konfigurację. Po roku - dojrzały system.
3. **Progressive disclosure działa.** Trzy poziomy indeksów (vault-map → catalog → graph) to nie over-engineering. To jedyne co pozwala agentowi działać sensownie na 185+ notatkach bez grep-owania całego katalogu i zaśmiecania context window.
4. **Agent nie zastępuje myślenia.** Zastępuje bookkeeping. To fundamentalna różnica. Kiedy próbujesz oddać agentowi _decyzje_ - dostaniesz generyczne odpowiedzi. Kiedy oddajesz mu _utrzymanie_ - dostaniesz system, który się compound-uje.
5. **Git repo jako fundament.** Version history, branching, collaboration - za darmo. Quartz 4 jako SSG daje Ci publiczny digital garden na GitHub Pages. Cały vault to repozytorium Git - każda zmiana jest tracked, revertable, diffable. Jeśli agent zrobi coś złego (a zrobi, szczególnie na początku) - `git diff` pokaże co zmienił, `git revert` cofnie. To safety net, bez którego nie oddałbym agentowi kontroli nad 185 plikami.

Jeśli chcesz zacząć od zera i nie masz jeszcze vault z agentem, przeczytaj [Second Brain z Obsidian i Claude Code](/blog/second-brain-obsidian-claude-code-skills) - tam opisuję jak wystartować od instalacji Obsidian po pierwsze Skills. Ten artykuł pokazuje gdzie możesz dojść po kilku latach iteracji - od prostego vault z kilkunastoma notatkami do systemu z 185 plikami, trzema warstwami i czterema workflow, pilnowanego przez agenta AI.

Nie musisz budować tego wszystkiego od razu. Zacznij od CLAUDE.md z 50 liniami, jednego workflow (INGEST) i jednego indeksu (vault-map). Reszta dojdzie organicznie - tak jak doszła u mnie.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz zbudować podobny system zarządzania wiedzą?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci zaprojektować architekturę bazy wiedzy z agentem AI - od struktury CLAUDE.md przez indeksy nawigacyjne po workflows dostosowane do Twoich potrzeb.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Zasoby

- [Wątek Karpathy'ego na X](https://x.com/karpathy/status/2039805659525644595) - oryginalny post o LLM Wiki (kwiecień 2026)
- [LLM Wiki gist na GitHub](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) - konfiguracja i dokumentacja
- [brain.lipowczan.pl](https://brain.lipowczan.pl) - mój vault publiczny (Quartz 4 + GitHub Pages)
- [Quartz 4](https://quartz.jzhao.xyz/) - Static Site Generator do Obsidian vault
- [Obsidian](https://obsidian.md/) - edytor notatek Markdown
- Powiązany artykuł: [Second Brain z Obsidian i Claude Code Skills](/blog/second-brain-obsidian-claude-code-skills) - jak zacząć od zera
- [second-brain-template](https://github.com/plipowczan/second-brain-template) - gotowy szablon do startu własnego second brain

## FAQ

<details open>
<summary>

### Czym różni się LLM Wiki od tradycyjnego RAG na dokumentach?

</summary>

RAG (Retrieval-Augmented Generation) szuka fragmentów tekstu na żądanie - dostajesz odpowiedź opartą o najbliższe embeddings, ale bez szerszego kontekstu. LLM Wiki to persistent baza wiedzy, w której agent aktywnie buduje i utrzymuje notatki: tworzy cross-referencje, syntetyzuje wiedzę z wielu źródeł i flaguje sprzeczności. Nie odpowiada na pojedyncze pytanie - utrzymuje kompletny, ewoluujący system wiedzy.

</details>

<details open>
<summary>

### Czy potrzebuję Obsidian żeby zbudować podobny system zarządzania wiedzą z AI?

</summary>

Nie - Obsidian to wygodny frontend z graph view i pluginami, ale nie jest wymagany. Wystarczy dowolny edytor tekstowy + Git repo z plikami `.md`. Kluczowe elementy to CLAUDE.md (schema document definiujący jak agent ma traktować vault) i indeksy nawigacyjne (vault-map, catalog, graph). Możesz zbudować ten sam system w VS Code, Cursor, albo nawet w terminalu.

</details>

<details open>
<summary>

### Ile czasu zajmuje napisanie CLAUDE.md dla knowledge base i jak zacząć?

</summary>

Pierwsza wersja zajmuje 1-2 godziny - definiujesz strukturę katalogów, podstawowy frontmatter schema i jeden workflow (najlepiej INGEST). Ale CLAUDE.md to żywy dokument, który ewoluuje z doświadczenia. Zaczynasz od prostych reguł, obserwujesz co agent robi źle, dodajesz korekty. Po miesiącu regularnego używania masz solidną konfigurację. Kluczowa zasada: pisz ręcznie, nie generuj przez LLM.

</details>

<details open>
<summary>

### Czym jest progressive disclosure i dlaczego jest kluczowe dla bazy wiedzy z agentem AI?

</summary>

Progressive disclosure to zasada organizacji notatek w warstwach - od ogólnego spisu treści (vault-map, ~80 linii) przez katalog (catalog, ~650 linii) do konkretnych plików. Agent czyta tylko tyle ile potrzebuje, nie zaśmiecając okna kontekstowego niepotrzebnymi informacjami. To kluczowa różnica między bazą wiedzy "która działa" a taką, gdzie agent gubi się w 185 plikach i zwraca generyczne odpowiedzi.

</details>

<details open>
<summary>

### Czy system LLM Wiki wymaga technicznego background'u do wdrożenia?

</summary>

Podstawowy setup wymaga znajomości Git, terminala i plików Markdown - nie musisz kodować. Najtrudniejsza część to napisanie dobrego CLAUDE.md, które precyzyjnie definiuje jak agent powinien traktować Twój vault. Ten artykuł opisuje dojrzały system po 3 latach iteracji, ale zacząć możesz prosto - od jednego folderu, prostego frontmatter schema i workflow INGEST. Artykuł [Second Brain z Obsidian i Claude Code](/blog/second-brain-obsidian-claude-code-skills) daje solidną bazę startową.

</details>
