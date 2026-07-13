---
id: 31
slug: slabe-strony-claude-code
title: "5 słabych stron Claude Code i jak je nadrobić"
excerpt: "Claude Code jest świetny w kodzie, ale ślepy przy wideo, designie, pamięci i researchu. Oto 5 słabych stron i narzędzia, których używam, żeby je nadrobić."
category: Code
author: Pawel Lipowczan
date: 2026-07-13
readTime: 11 min
image: /images/og-slabe-strony-claude-code.webp
tags:
  - Claude Code
  - Agent Skills
  - Developer Tools
  - Produktywność
  - AI
lang: pl
alternateSlug: claude-code-weak-spots
---

Claude Code czyta kod, edytuje pliki i odpala komendy w terminalu. W tych zadaniach jest bardzo dobry. Ale poproś go, żeby obejrzał wideo albo zaprojektował ładny front - i od razu widać granice.

Testuję dziesiątki narzędzi wokół Claude Code. Za każdym razem wraca ten sam zestaw pięciu słabych stron: wideo, design, pamięć, research i tokeny (**token** - jednostka tekstu, którą model liczy i za którą płacisz). To nie są wady, które psują pracę z kodem. To obszary, w których Claude Code po prostu nie ma wbudowanej funkcji.

Dobra wiadomość: każdą z tych dziur da się załatać. Nie teorią, tylko konkretnym narzędziem. Dla każdego obszaru pokażę, czym posługuję się na co dzień. Będę uczciwy - część narzędzi sprawdziłem w codziennej pracy, część mam dopiero na radarze i wyraźnie to zaznaczę.

Pomysł na ten podział zainspirował film Chase AI o pięciu repozytoriach dla Claude Code. Ale to jest mój własny zestaw - narzędzia, które sam odpalam, z moimi zastrzeżeniami.

## 🎬 Wideo - Claude Code nie widzi i nie tworzy filmów

Claude Code nie potrafi obejrzeć wideo ani go wygenerować. Domyślnie utyka na transkrypcie (**transkrypt** - tekstowy zapis ścieżki dźwiękowej). A transkrypt nie wystarczy, gdy liczy się to, co realnie dzieje się na ekranie.

### Oglądanie: Claude Video

`Claude Video` to skill (**skill** - gotowy zestaw instrukcji, który rozszerza agenta o nową umiejętność) z komendą `/watch`. Wklejam adres albo plik plus pytanie. Agent pobiera napisy, wycina klatki (**klatka** - pojedynczy obraz z wideo) i czyta je jako obrazy. Zanim odpowie, naprawdę zobaczył wideo, a nie zgadł z tytułu.

Używam tego do dwóch rzeczy. Analizuję cudze treści szybciej niż odtwarzaniem na 2x i wyciągam wiedzę, która potem trafia do mojej bazy notatek. Wyciągam nim też transkrypty z YouTube.

```bash
/watch https://youtu.be/dQw4w9WgXcQ co dzieje sie w 30 sekundzie?
```

Koszt tokenów zależy głównie od klatek, bo każda to obraz. Dlatego skill ma cztery tryby, od najtańszego do najdroższego:

```text
transcript    - same napisy, zero klatek (najtaniej)
efficient     - klatki kluczowe, do 50
balanced      - po zmianach sceny, do 100 (domyslny)
token-burner  - bez limitu klatek (pelne pokrycie, drogo)
```

Tryb `efficient` bierze klatki kluczowe (**klatka kluczowa** - klatka, którą samo wideo oznacza jako punkt odniesienia). Gdy wideo nie ma napisów, skill zamienia mowę na tekst modelem whisper (**whisper** - model zamieniający mowę na tekst), za darmo przez Groqa.

### Tworzenie: HyperFrames

Odwrotny kierunek to generowanie wideo. `HyperFrames` tworzy wideo z plików HTML - kompozycja to zwykły HTML z atrybutami `data-*`, bez Reacta i bez własnego języka. „Marka" żyje w moich stylach CSS, więc każde wideo wychodzi spójne z moją identyfikacją wizualną, a nie generyczne.

```bash
npx skills add heygen-com/hyperframes
```

Wymaga Node.js >= 22 i FFmpeg. O generowaniu wideo z kodu pisałem już przy okazji [Remotion do filmów explainer](/blog/remotion-explainer-videos-ai). Różnica jest prosta: HyperFrames jest HTML-native i na licencji Apache 2.0 (komercyjne użycie bez limitów), a Remotion ma za to gotowy rendering rozproszony w chmurze.

## 🎨 Design - koniec z generycznym AI slop

Poproś Claude Code o stronę i dostajesz dokładnie to samo co wszyscy: sekcja hero na górze, zaokrąglone karty, fioletowy gradient. To **AI slop** (**AI slop** - generyczny wygląd, który od razu zdradza, że front wygenerował model). Powód jest prosty: modele trenowano na tych samych szablonach.

Nie łatam tego jednym narzędziem, tylko trzema skillami ustawionymi w kolejności: kto, system, strażnik.

### 1. UX RULER - dla kogo i po co

`UX RULER` wymusza pytanie „dla kogo to jest i jaką mierzalną wartość daje", zanim wskoczę w funkcje. Decyzje o odbiorcy i potrzebie zapisuje do repozytorium jako product memory (**product memory** - pliki w repo, które trzymają decyzje produktowe dla następnego człowieka albo agenta). Dzięki temu wybory są jawne i wielokrotnego użytku.

### 2. UI UX Pro Max - gotowy design system

`UI UX Pro Max` generuje spójny design system (**design system** - zestaw reguł koloru, typografii i komponentów) dopasowany do typu projektu. Portfolio dostaje inną logikę niż SaaS czy sklep. Uruchamiam go z Tailwind CSS i React jako bazę, którą potem dociągam, co oszczędza czas na prototyp. To narzędzie opisałem szerzej w [5 repozytoriach GitHub dla Claude Code](/blog/5-repozytoriow-github-claude-code), więc tu nie powtarzam.

### 3. Impeccable - strażnik języka designu

`Impeccable` to warstwa, która usuwa charakterystyczne znaki AI: Inter wszędzie, gradienty fioletu, karty w kartach, szary tekst na kolorowym tle. Ma deterministyczny linter (**linter** - narzędzie sprawdzające kod albo wygląd według sztywnych reguł), który działa bez modelu i bez klucza API:

```bash
npx impeccable detect src/
```

Skill daje **23 komendy** pod `/impeccable`, między innymi `craft`, `shape`, `critique` i `colorize`, oraz **27 reguł deterministycznych** plus dodatkowy przegląd modelu. To ta rzecz, która pilnuje, żeby front nie krzyczał „zrobił mnie AI".

Razem układa się to w linię: RULER mówi dla kogo, Pro Max buduje system, Impeccable pilnuje języka i ścina AI slop.

## 🧠 Pamięć - Claude Code zapomina po każdej sesji

Koniec sesji to zerowanie. Claude Code nie ma wbudowanej pamięci, która kumuluje się między rozmowami. Za każdym razem zaczyna od zera.

### Second brain jako pamięć

Mój sposób to **second brain** (**second brain** - tekstowa baza notatek, którą agent czyta, uzupełnia i przeszukuje). Repozytorium jest moją pamięcią: agent zapisuje do niego wiedzę, linkuje notatki i odpowiada na pytania z całości.

To wzorzec, który Andrej Karpathy nazwał **LLM Wiki** (**LLM Wiki** - baza, którą model sam buduje i utrzymuje z Twoich źródeł). Różni się od RAG (**RAG** - technika, w której model przed odpowiedzią przeszukuje surowe dokumenty). W RAG nic się nie kumuluje, bo model za każdym razem odkrywa wszystko na nowo. W LLM Wiki wiedza zostaje w plikach i rośnie.

Kluczowy element to **progressive disclosure** (**progressive disclosure** - układ notatek tak, żeby agent je znalazł bez zaśmiecania okna kontekstowego). Okno kontekstowe (**okno kontekstowe** - ile tekstu model widzi naraz) jest ograniczone, więc dobry indeks jest ważniejszy niż wrzucenie wszystkiego do jednego pliku.

Zbudowałem to na Obsidian i Claude Code. Pełną architekturę, 185 notatek i trzy indeksy opisałem w [artykule o LLM Wiki Karpathy'ego](/blog/llm-knowledge-base-brain-karpathy) oraz w [budowie drugiego mózgu w Obsidian](/blog/second-brain-obsidian-claude-code-skills). Gdzie kończy się graf kodu, a zaczyna baza notatek, rozkładam w [tekście o RAG](/blog/rag-ragowi-nierowny).

Jak taką bazę zbudować od zera, pokazuję krok po kroku w [darmowym kursie LLM Wiki](/llm-wiki).

### NotebookLM-py - świeży dodatek

`NotebookLM-py` wkłada NotebookLM (**NotebookLM** - silnik Google, w którym Gemini czyta Twoje źródła i odpowiada z cytatami) do wnętrza Claude Code. To nieoficjalne API, więc używam go na własne ryzyko.

```bash
uv tool install "notebooklm-py[browser]"
notebooklm login
```

Na razie służy mi głównie jako druga droga do transkryptów z YouTube. Dopiero zaczynam, więc traktuję go jako dodatek, nie fundament.

## 🔎 Research - wbudowane wyszukiwanie jest płytkie

Wbudowane wyszukiwanie w Claude Code działa, ale powierzchownie. Brakuje środka między „płytko" a „sto agentów i 10 milionów tokenów na deep research" (**deep research** - głębokie, wieloźródłowe badanie tematu).

### Firecrawl - niezawodne pobieranie stron

Gdy wbudowany scraper (**scraper** - narzędzie, które pobiera treść strony) zawodzi, sięgam po `Firecrawl`. Zamienia dowolną stronę na czysty markdown albo strukturalny JSON, radząc sobie z JavaScriptem i podziałem na podstrony.

```bash
pip install firecrawl-py
```

Ma pięć trybów: Scrape (jedna strona), Crawl (cała witryna po linkach), Map (lista adresów), Search (wyszukiwanie z treścią) i Extract (dane według schematu). Działa jako MCP (**MCP** - Model Context Protocol, standard podłączania narzędzi do agenta), więc wpina się prosto w Claude Code.

### Deep research - do przetestowania

`NotebookLM-py` z sekcji o pamięci ma też tryb deep research po stronie Google, więc teoretycznie tańszy. Nie sprawdziłem go jeszcze na poważnie, dlatego traktuję to jako kandydata, nie rekomendację.

### Research swarm - struktura wpięta w wiki

Do ustrukturyzowanego researchu używam skilla, który odpala agent swarm (**agent swarm** - rój niezależnych agentów pracujących równolegle). Jeden agent na pozycję, w partiach. Każdy zapisuje zwalidowany rekord JSON, a gotowy raport wpada do mojej bazy notatek. To zamienia jednorazowy research na trwały wpis w wiki.

## 🪙 Tokeny - gadatliwy output pali budżet i kontekst

Rozwlekłe odpowiedzi (**output** - to, co agent wypisuje w odpowiedzi) kosztują podwójnie. Płacisz za tokeny i zapychasz okno kontekstowe. Im dłuższy output, tym szybciej agent traci miejsce na to, co ważne.

### Caveman - kompresja outputu

`Caveman` to skill, który każe agentowi mówić jak jaskiniowiec: bez rodzajników, waty i uprzejmości, samo mięso. Tnie średnio **~65% tokenów outputu** (zakres 22-87%), zachowując 100% treści technicznej.

```powershell
# Windows (PowerShell)
irm https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.ps1 | iex
```

```bash
# macOS / Linux / WSL
curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash
```

Ma trzy poziomy: `/caveman lite`, `/caveman full` i `/caveman ultra`. I tu moje szczere zastrzeżenie: w trybie `full` opisy bywają nieczytelne, zwłaszcza po polsku. Dlatego trzymam się `lite`, a przy kodzie, commitach i tekstach o bezpieczeństwie przełączam na `normal mode`.

Ważny szczegół z dokumentacji: Caveman ścina tylko output, nie tokeny myślenia (**reasoning** - tokeny, które model zużywa na wewnętrzne rozumowanie). Skraca usta, nie mózg. Największa korzyść to czytelność i szybkość, a oszczędność jest dodatkiem.

### Na radarze - kandydaci, nie rekomendacje

Reszta zestawu leży u mnie na liście do sprawdzenia. Wymieniam je, ale wyraźnie zaznaczam, że sam ich jeszcze nie przetestowałem.

- **Headroom** - kompresuje to, co agent czyta (input i kontekst) o 60-95%. Strona wejścia, tam gdzie Caveman zajmuje się wyjściem.
- **Ponytail** - zmusza agenta do minimalnego kodu, więc mniej linii i mniej tokenów.
- **Graphify** - zamienia kod w graf wiedzy, żeby agent nie czytał pliku po pliku.

## Kluczowe wnioski

Pięć słabych stron, pięć konkretnych ruchów:

1. **Wideo** - dodaj `/watch`, zanim znów zaczniesz czytać sam transkrypt. Do generowania sprawdź HyperFrames.
2. **Design** - ustaw trzy skille w kolejności: kto (UX RULER), system (UI UX Pro Max), strażnik (Impeccable).
3. **Pamięć** - tekstowa wiki utrzymywana przez agenta bije RAG na małej skali. Jeśli budujesz od zera, zacznij od kursu.
4. **Research** - Firecrawl, gdy wbudowany scraper zawiedzie, a deep research tylko wtedy, gdy naprawdę go potrzebujesz.
5. **Tokeny** - Caveman ścina output, ale po polsku wybierz `lite`. Resztę traktuj jako kandydatów do testu.

Najlepsze w tym wszystkim jest to, że każde z tych narzędzi jest darmowe i open source. Najgorsze, co się stanie, to że odpalisz jedno, nie spodoba Ci się i je odinstalujesz. Wybierz obszar, który najbardziej Cię boli, i zacznij od niego.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz wycisnąć więcej z Claude Code w swoim zespole?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci dobrać narzędzia i skille pod Twój sposób pracy, wdrożyć je i ustawić powtarzalny proces pracy z agentem. A jeśli wolisz zacząć sam, pamięć agenta zbudujesz krok po kroku w <a href="/llm-wiki" class="text-primary-500 hover:text-primary-400">darmowym kursie LLM Wiki</a>.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Przydatne zasoby

- [Claude Video](https://github.com/bradautomates/claude-video) - skill `/watch`, który daje agentowi wzrok.
- [HyperFrames](https://github.com/heygen-com/hyperframes) - generowanie wideo z plików HTML.
- [Impeccable](https://impeccable.style/) - język designu plus linter usuwający AI slop.
- [NotebookLM-py](https://github.com/teng-lin/notebooklm-py) - NotebookLM w terminalu Claude Code.
- [Firecrawl](https://www.firecrawl.dev/) - dowolna strona zamieniona w czysty markdown.
- [Caveman](https://github.com/JuliusBrussee/caveman) - kompresja tokenów w odpowiedziach agenta.
- [Darmowy kurs LLM Wiki](/llm-wiki) - jak zbudować pamięć agenta (drugi mózg) od zera.

## FAQ

<details open>
<summary>

### W jakich obszarach Claude Code jest słaby out of the box?

</summary>

Claude Code świetnie radzi sobie z kodem, plikami i komendami, ale ma pięć słabych stron: nie widzi ani nie tworzy wideo, generuje generyczny design, zapomina po sesji, ma płytkie wyszukiwanie i gadatliwy output. Każdą z tych dziur łata się osobnym narzędziem albo skillem. To luki w funkcjach, a nie wady w pracy z kodem.

</details>

<details open>
<summary>

### Czy Claude Code potrafi obejrzeć wideo z YouTube?

</summary>

Domyślnie nie, ale zmienia to skill Claude Video z komendą `/watch`. Wkleja adres i pytanie, pobiera napisy oraz klatki wideo i czyta je jako obrazy, więc realnie „widzi" nagranie. Gdy brakuje napisów, zamienia mowę na tekst modelem whisper. Sprawdza się też do szybkiego pobierania transkryptów.

</details>

<details open>
<summary>

### Jak dać agentowi AI pamięć między sesjami?

</summary>

Najprostszy sposób to second brain, czyli tekstowa baza notatek w repozytorium, którą agent czyta, uzupełnia i przeszukuje. To wzorzec LLM Wiki: wiedza kumuluje się w plikach, inaczej niż w RAG, gdzie model odkrywa wszystko od nowa. Jak zbudować taką bazę od zera, pokazuję krok po kroku w [darmowym kursie LLM Wiki](/llm-wiki).

</details>

<details open>
<summary>

### Czym jest „AI slop" i jak uniknąć generycznego designu?

</summary>

AI slop to generyczny wygląd strony, który od razu zdradza, że front wygenerował model: ten sam układ hero, zaokrąglone karty i fioletowe gradienty. Unikniesz go, dając agentowi prawdziwy design system i linter, który wyłapie te wzorce. Używam do tego skilli UI UX Pro Max i Impeccable, ten drugi ma komendę `npx impeccable detect`.

</details>

<details open>
<summary>

### Czy Caveman naprawdę oszczędza tokeny i czy warto go używać?

</summary>

Tak, Caveman ścina średnio około 65% tokenów outputu, zachowując pełną treść techniczną. Zastrzeżenie: w trybie `full` opisy bywają nieczytelne, zwłaszcza po polsku, więc lepiej ustawić `lite`. Pamiętaj, że skraca tylko output, a nie tokeny myślenia modelu.

</details>

<details open>
<summary>

### Czy te narzędzia dla Claude Code są darmowe?

</summary>

Tak, wszystkie pięć rozwiązań jest darmowych i open source. Część wymaga własnych kluczy albo dodatków: Claude Video może potrzebować klucza whisper przy wideo bez napisów, a Firecrawl konta do trybu API. Instalacja sprowadza się zwykle do jednej komendy w terminalu.

</details>
