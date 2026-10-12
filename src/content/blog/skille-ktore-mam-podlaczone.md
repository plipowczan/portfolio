---
id: 33
slug: skille-ktore-mam-podlaczone
title: "Skille Claude Code: kompetencję się instaluje, nie nabywa"
excerpt: >-
  Nie znam się na designie, a zbudowałem CRM dla branży nieruchomości.
  Skille przesunęły moją pracę z wykonania na ocenę. Lista skilli i dwie komendy instalacji.
category: AI
author: Pawel Lipowczan
date: 2026-10-12
readTime: 13 min
image: /images/og-skille-ktore-mam-podlaczone.webp
tags:
  - Agent Skills
  - Claude Code
  - Wtyczki
  - Open source
  - Rozwój zawodowy
lang: pl
alternateSlug: claude-code-skills-i-have-connected
---

Zbudowałem z agentem CRM dla klientów z branży nieruchomości. **CRM** to system do prowadzenia klientów i ofert. Wcześniej bym tego nie zrobił.

Kod napisał agent i to akurat nie było przeszkodą. Przeszkodą był wygląd, bo trzeba jeszcze przekonać klienta do interfejsu, który mu się spodoba. A ja nie znam się ani na tworzeniu designu, ani na **SEO** (pozycjonowaniu stron w wyszukiwarce).

Nie nauczyłem się ani projektowania, ani SEO. Podłączyłem **skille**. Skill to plik z instrukcją, który agent czyta i dzięki któremu zaczyna robić rzecz, której wcześniej nie robił.

Do designu używam trzech: `frontend-design`, `ui-ux-pro-max` i `impeccable`. Przy SEO pomaga mi `claude-seo`. Trzy pierwsze przygotowują propozycje wyglądu, z których klient wybiera.

Ten tekst opiera się na dwóch twierdzeniach. Pierwsze dotyczy narzędzia: kompetencję można dziś podłączyć, a nie tylko zdobywać latami praktyki. Drugie dotyczy mojej pracy: skill dodany agentowi jest kompetencją dodaną mnie, więc zmienia się to, jak planuję własny rozwój.

Pytanie „czego nauczyć się w tym kwartale" przestało być u mnie pierwsze. Pierwsze brzmi: co podłączyć i co dalej muszę umieć ocenić.

Drugie twierdzenie ma granicę. Umiejętność nie przestała się liczyć, tylko przesunęła się z wykonania na ocenę wyniku. Mocniejszej tezy nie postawię, bo nie mam na nią podstaw.

Dalej: czym jest skill i dlaczego ten format jest tani, co mam podłączone, dwie listy do wzięcia z instalacją, a na końcu to, czego nie oddaję.

## Agent Skills: otwarty format, który działa poza Claude Code

Skill nie jest funkcją jednego dostawcy ani ukrytym kodem Claude'a. Format nazywa się **Agent Skills** (otwarty standard opisu skilla). Wymyślił go Anthropic i wydał jako otwarty, a dziś obsługują go między innymi VS Code, GitHub Copilot, Cursor, Goose, Amp i OpenCode. Aktualną listę prowadzi [agentskills.io](https://agentskills.io).

Skill to folder z plikiem `SKILL.md`. W pliku są nazwa, opis i instrukcje zapisane w **markdownie** (zwykłym tekstem z prostymi znacznikami). Agent na starcie zna tylko nazwy i opisy skilli, a pełną instrukcję czyta dopiero wtedy, gdy zadanie do niej pasuje. Specyfikacja zakłada na te metadane około 100 tokenów na skill (**token** to jednostka tekstu, którą model liczy).

Sam format przenosi się między narzędziami. Instalacja już nie zawsze, o czym w następnej sekcji.

## Dlaczego ten format jest tani

Skill to markdown z kilkoma polami na górze pliku. Napisanie własnego kosztuje tyle, co napisanie instrukcji.

Kilka skilli, komend i innych dodatków pakuje się w **wtyczkę** (paczkę instalowaną jako całość). Najprostsza wtyczka składa się z samego markdownu i JSON-a (formatu zapisu danych w plikach tekstowych), bez kroku budowania. Bardziej rozbudowane dokładają własne skrypty.

```text
moja-wtyczka/
├── .claude-plugin/plugin.json   # nazwa, opis, licencja
├── skills/<nazwa>/SKILL.md     # instrukcje skilla
└── commands/                   # komendy wpisywane w sesji
```

Wtyczki instaluje się z **katalogu wtyczek** (ang. marketplace). To repozytorium z plikiem `marketplace.json`, który mówi, skąd pobrać każdą wtyczkę.

Jedno zastrzeżenie, łatwe do przegapienia. Manifest wtyczki, czyli plik `plugin.json`, to konwencja Claude Code, a nie część specyfikacji Agent Skills. Specyfikacja opisuje folder skilla i nie mówi nic o instalowaniu paczek ani o katalogu docelowym. Dlatego narzędzia szukają skilli w różnych miejscach: Claude Code w `.claude/skills/`, Codex w `.agents/skills/`, Cursor w `.cursor/skills/` i `.agents/skills/`.

Folder skilla da się więc wziąć i położyć w katalogu innego narzędzia. Manifest i komendy instalacji pochodzą z Claude Code.

## Stan podłączenia: 29 wtyczek z 8 katalogów

Na moim koncie mam globalnie podłączone **29 wtyczek z 8 katalogów wtyczek** (odczyt z 12 października 2026). Dwadzieścia dwie pochodzą z oficjalnego katalogu Anthropic. Wiele z nich to integracje z usługami, na przykład z GitHubem, Stripe czy Cloudflare.

Nie traktuję tej liczby jako dowodu. Dowodem jest co innego: do designu i SEO nie musiałem uczyć się dziedziny, bo pozycje, które to robią, po prostu podłączyłem.

Uwaga, żeby nie liczyć dwa razy. Tabele niżej to nie jest podział tych 29. To dwie osobne listy: 19 pozycji z mojego repozytorium i 10 cudzych, których sam używam. Że razem dają akurat 29, to przypadek.

Trzy z tych dziesięciu (OpenSpec, `impeccable` i `hyperframes`) to skille instalowane osobno, nie wtyczki z katalogu. **OpenSpec** to narzędzie do spisywania specyfikacji zmiany przed kodem.

Podłączenie ma koszt. Nazwa i opis każdego włączonego skilla są w kontekście agenta przy każdej turze, nawet gdy skill nie jest używany. Wtyczka wykonuje też kod z uprawnieniami użytkownika, więc przed instalacją warto ją przejrzeć. O ryzykach związanych z agentami pisałem w tekście [OpenClaw: lekcja bezpieczeństwa, której potrzebował świat agentów AI](/blog/openclaw-bezpieczenstwo-agentow-ai).

## Moje skille do wzięcia za darmo

Repozytorium [`200iqlabs/shared-skills`](https://github.com/200iqlabs/shared-skills) jest publiczne i deklaruje licencję Apache-2.0 (pozwala używać, zmieniać i rozpowszechniać kod z zachowaniem noty o licencji). Instalacja to dwie **komendy ukośnikowe** (polecenia wpisywane w sesji, zaczynające się od `/`):

```text
/plugin marketplace add 200iqlabs/shared-skills
/plugin install ss@shared-skills
```

To samo w terminalu: `claude plugin marketplace add 200iqlabs/shared-skills` i `claude plugin install ss@shared-skills`. Po instalacji każda pozycja ma prefiks `ss:`.

Poniżej 19 pozycji. Warianty `research*` i `prepare-goal*` zwinąłem w jedne wiersze, bo każda grupa to jeden przepływ.

| Pozycja | Co robi |
|---|---|
| `/ss:cfo` | przepływ gotówki, zapas gotówki na kolejne miesiące, koszty, rentowność, budżet |
| `/ss:tax-advisor` | PIT, VAT, ZUS, składka zdrowotna, IP Box, ryczałt kontra liniowy |
| `/ss:legal` | umowy B2B i NDA, RODO, prawa autorskie do kodu, nieopłacone faktury |
| `/ss:business-consultant` | notatki ze spotkania na architekturę rozwiązania i wycenę wdrożenia |
| `/ss:process-mapping` | proces na diagram: kto, co i jakim narzędziem (Excalidraw albo Mermaid) |
| `/ss:slides` | markdown na gotową prezentację PDF: karuzele i slajdy na wystąpienie, przez Marpa |
| `/ss:prd` | opis produktu na dwie strony dla rozwiązania budowanego w tydzień |
| `/ss:research` | analiza z planem: pozycje, pola i struktura wyniku |
| `/ss:research-deep` | osobny agent na każdą pozycję planu, potem raport (`research-report`) |
| `/ss:review-fix` | jeden przegląd gałęzi przez Codex (wtyczkę OpenAI do przeglądu kodu, warunek pod tabelą): poprawia to, co się broni, resztę odrzuca z powodem, potem commit i wysłanie zmian |
| `/ss:review-loop` | pętla między Claude a Codexem na zgłoszeniu do przeglądu (pull request), aż nie zostanie nic ważnego. Kończy się zgłoszeniem, które zamyka człowiek |
| `/ss:prepare-goal` | luźny opis zadania na warunek ukończenia, sprawdzalny w zapisie sesji (wariant `prepare-openspec-goal` dla zmian OpenSpeca) |
| `/ss:find-skills` | szuka skilli w ekosystemie i instaluje po audycie bezpieczeństwa |
| `/ss:vibe-coding` | widoczna warstwa aplikacji bez wiedzy o projektowaniu: wytyczne, tokeny projektowe, komponenty |
| `/ss:environment-setup` | kreator konfiguracji plików kontekstu |
| `/ss:decisions` | wyciąga otwarte decyzje po jednej, z rekomendacją, i czeka na odpowiedź |
| `/ss:explain-diff` | omawia zmiany w kodzie plik po pliku, prostym polskim |
| `/ss:explain-design` | omawia dokument projektowy OpenSpeca temat po temacie |
| `/ss:working-mode` | przełącza sesję na polski i stały szkielet odpowiedzi |

Skróty z tabeli: **IP Box** to preferencyjna stawka podatku od dochodów z własności intelektualnej, **NDA** to umowa o poufności, **PRD** to dokument opisujący wymagania wobec produktu. Excalidraw i Mermaid to narzędzia do rysowania diagramów, a Marp zamienia markdown na prezentację. **Tokeny projektowe** to nazwane wartości kolorów, odstępów i czcionek.

**Warunek przy dwóch pozycjach.** `/ss:review-fix` i `/ss:review-loop` przeglądają kod przez wtyczkę Codex i wymagają planu ChatGPT, który obejmuje Codex. Skille są darmowe, recenzent nie: każda runda przeglądu zużywa limit tego planu. Bez zainstalowanej i zalogowanej wtyczki oba skille zatrzymują się i odsyłają do `/codex:setup`.

## Cudze skille i narzędzia, których używam

Druga tabela to ekosystem: cudze narzędzia, publiczne, z autorami. Zostawiłem w niej tylko to, czego używam. Resztę zainstalowanych skreśliłem, bo praktycznie jej nie używam.

| Pozycja | Autor | Co robi |
|---|---|---|
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | Fission-AI, MIT | specyfikacja przed kodem; zostawia plik, nie rozmowę |
| [claude-seo](https://github.com/AgriciDaniel/claude-seo) | AgriciDaniel | audyt SEO, Core Web Vitals (wskaźniki szybkości i stabilności strony), dane strukturalne (znaczniki opisujące treść strony dla wyszukiwarek), widoczność w odpowiedziach AI |
| `frontend-design` | Anthropic | warstwa wizualna interfejsu |
| [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | nextlevelbuilder | style, palety, pary fontów i wzorce projektowe |
| `commit-commands` | Anthropic | commit, wysłanie zmian i zgłoszenie do przeglądu jedną komendą |
| `document-skills` | Anthropic | xlsx, docx, pptx i pdf: czyta i pisze |
| [impeccable](https://github.com/pbakaus/impeccable) | pbakaus, Apache-2.0 | projektowanie i poprawianie interfejsu: hierarchia, typografia, kolor, ruch, dostępność. Strona: [impeccable.style](https://impeccable.style), uruchomienie: `npx impeccable` |
| [hyperframes](https://github.com/heygen-com/hyperframes) | HeyGen, Apache-2.0 | wideo w HTML: kompozycje, napisy zsynchronizowane z dźwiękiem, lektor, przejścia. Także przetwarzanie gotowego nagrania. Uruchomienie: `npx hyperframes` |
| `skill-creator` | Anthropic | robi skill z opisu zachowania |
| [superpowers](https://github.com/obra/superpowers) | Jesse Vincent, MIT | burza mózgów przed kodem, szukanie błędów po kolei, testy przed kodem, plany wdrożenia |

Trzy z nich opisałem osobno w tekście [5 słabych stron Claude Code i jak je nadrobić](/blog/slabe-strony-claude-code): `ui-ux-pro-max`, `impeccable` i `hyperframes`.

Z OpenSpeca i superpowers korzystam oba, ale do innych rzeczy. Do burzy mózgów przed kodem używam `/opsx:explore` z OpenSpeca, bo zostawia plik, a nie rozmowę. Szerzej o tym podejściu piszę w tekście [OPSX Workflow](/blog/opsx-workflow-strukturyzowana-praca-z-ai).

Po superpowers sięgam rzadziej. Nie mierzyłem, które lepiej się sprawdza, więc tych dwóch nie porównuję.

## Czego nie oddaję

Nie wszystko, co mam, da się oddać. Zamknięcie sesji, rejestr zadań, kontrola spójności kontekstu i pętla publikacji żyją w moim prywatnym repozytorium. Są wersjonowane prywatnie i nie mają kanału dystrybucji, więc nie ma ich w żadnej z tabel i nie będzie do nich odnośnika.

Piszę o nich tylko jako o wzorcu, nie jako o pozycjach do wzięcia. Nie chcę obiecywać czegoś, czego nie mogę dać.

Podział na część wspólną i prywatną opisałem wcześniej w tekście [Skills 2.0 - jak buduję system wieloagentowy do zarządzania firmą](/blog/skills-2-0-multi-agent-system-zarzadzanie-firma). Wspólne skille były tam podpięte jako submoduł git. W tym tekście pokazuję instalację jako wtyczkę, którą może zrobić każdy.

## Co to zmienia w planowaniu własnego rozwoju

Oba pytania zostały, zmieniła się ich kolejność. Najlepiej widać to na CRM-ie. Kod pisze agent.

Propozycje wyglądu przygotowują `frontend-design`, `ui-ux-pro-max` i `impeccable`, a klient wybiera z kilku z nich. Wideo obsługuje `hyperframes`. Cztery z podłączonych pozycji robią to, czego sam nie umiem: trzy projektują interfejs, jedna zajmuje się SEO.

Skille zmieniły nie tempo mojej pracy, tylko to, jakie zlecenia w ogóle biorę pod uwagę. Pomogły mi myśleć o zleceniach takich jak CRM dla branży nieruchomości, czyli o złożonym narzędziu, którego wcześniej bym się nie podjął.

Druga połowa pytania zostaje po mojej stronie. Nie muszę umieć zaprojektować interfejsu. Muszę umieć ocenić to, co podaje mi skill, zanim komuś to pokażę.

W projekcie CRM część tej oceny przejął klient, bo wybiera z kilku propozycji. Za resztę odpowiadam ja.

Wynik `claude-seo` sprawdzam na własnej domenie, pawel.lipowczan.pl. Efekt widać dopiero po publikacji, więc w tym tekście nie podaję wyników.

Ocena wymaga czegoś więcej niż poczucia, że wynik wygląda dobrze. Pisałem o tym w tekście [Zmierzone, nie założone. Trzy wnioski, które sam obaliłem](/blog/zmierzone-nie-zalozone), gdzie wnioski brzmiące pewnie trzeba było wycofać po kolejnym pomiarze. Dotyczy to tak samo mnie, jak agenta.

## Jak zacząć

Wpisz w sesji Claude Code `/plugin marketplace add 200iqlabs/shared-skills`, potem `/plugin install ss@shared-skills` i zajrzyj do [repozytorium shared-skills](https://github.com/200iqlabs/shared-skills), żeby zobaczyć, co ci się przyda. Zacznij od pozycji z dziedziny, w której potrafisz ocenić wynik. Dopiero potem sięgaj po taką, na której się nie znasz.

## Kluczowe wnioski

1. **Skill dodany agentowi jest kompetencją dodaną mnie.** Dlatego plan rozwoju zaczynam od pytania, co podłączyć.
2. **Podłączenie nie zwalnia z oceny.** Umiejętność przesuwa się z wykonania na ocenę wyniku.
3. **Format jest otwarty i tani.** Skill to folder z `SKILL.md`, a manifest wtyczki i ścieżki instalacji to konwencje konkretnego narzędzia.
4. **Podłączenie kosztuje.** Nazwa i opis skilla są w kontekście przy każdej turze, a wtyczka wykonuje kod z uprawnieniami użytkownika. Trzymaj to, czego używasz.
5. **Lista jest do wzięcia.** Dwie komendy instalują wtyczkę `ss`, a dwie pozycje wymagają jeszcze planu ChatGPT z Codexem.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz wiedzieć, które skille podłączyć w swojej pracy?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci dobrać skille do Twoich zleceń i ustalić, co dalej musisz umieć ocenić sam, zanim komuś pokażesz wynik.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Przydatne zasoby

- [shared-skills](https://github.com/200iqlabs/shared-skills) - repozytorium z wtyczką `ss`, instalacją i listą pozycji.
- [Agent Skills](https://agentskills.io) - specyfikacja formatu i lista narzędzi, które go obsługują.
- [Dokumentacja wtyczek Claude Code](https://code.claude.com/docs/en/plugins) - czym jest wtyczka i katalog wtyczek, koszt kontekstu, zaufanie do wtyczek.
- [impeccable](https://impeccable.style) - projektowanie i poprawianie interfejsu.
- [hyperframes](https://github.com/heygen-com/hyperframes) - wideo napisane w HTML.
- [OpenSpec](https://github.com/Fission-AI/OpenSpec) - specyfikacja przed kodem.
- [5 słabych stron Claude Code i jak je nadrobić](/blog/slabe-strony-claude-code) - trzy z cudzych skilli opisane osobno.
- [Zmierzone, nie założone](/blog/zmierzone-nie-zalozone) - jak oceniać wynik pomiarem, a nie przekonaniem.
- [Anatomia systemu agentów AI](/blog/system-agentow-ai-skills-rules-kontekst) - system, do którego wchodzą skille.

## FAQ

<details open>
<summary>

### Czym jest skill w Claude Code i czym dokładnie różni się od wtyczki, którą instaluje się z katalogu?

</summary>

Skill to folder z plikiem `SKILL.md`, w którym są nazwa, opis i instrukcje dla agenta. Wtyczka to paczka instalowana jako całość, która może zawierać wiele skilli, komend i innych dodatków. Skill jest więc jednostką wiedzy, a wtyczka sposobem jej dostarczenia.

</details>

<details open>
<summary>

### Czy skille napisane dla Claude Code zadziałają w innych narzędziach, na przykład w Cursorze albo w Codexie?

</summary>

Sam format tak, bo Agent Skills to otwarty standard obsługiwany przez wiele narzędzi. Manifest wtyczki i komendy instalacji to jednak konwencja Claude Code, a katalogi się różnią: Codex szuka w `.agents/skills/`, a Cursor w `.cursor/skills/` i `.agents/skills/`, ale czyta też `.claude/skills/`. Folder skilla przenosisz, instalator wtyczek zostaje w Claude Code.

</details>

<details open>
<summary>

### Czy mogę używać skilli z repozytorium shared-skills w projektach komercyjnych i dla klientów?

</summary>

Repozytorium deklaruje licencję Apache-2.0 w README i w manifestach wtyczki. Ta licencja pozwala używać, zmieniać i rozpowszechniać kod, także komercyjnie, z zachowaniem noty o licencji. Jeśli używasz skilli w firmie, przeczytaj plik `LICENSE` i warunki licencji przed wdrożeniem.

</details>

<details open>
<summary>

### Czy `/ss:review-fix` i `/ss:review-loop` są darmowe, skoro przeglądają kod przez Codex?

</summary>

Same skille są darmowe, ale recenzent nie. Przegląd robi wtyczka Codex, która wymaga planu ChatGPT zawierającego Codex, a każda runda przeglądu zużywa limit tego planu. Bez zainstalowanej i zalogowanej wtyczki oba skille zatrzymują się i odsyłają do `/codex:setup`.

</details>

<details open>
<summary>

### Czy instalowanie cudzych skilli i wtyczek do Claude Code jest bezpieczne i co sprawdzić przed instalacją?

</summary>

Wtyczka może uruchamiać kod z uprawnieniami użytkownika, więc nie jest tak niewinna jak zwykły plik tekstowy. Dokumentacja Claude Code zaznacza, że dotyczy to każdego katalogu wtyczek, i opisuje, jak przejrzeć wtyczkę przed instalacją. Skill `/ss:find-skills` szuka skilli w ekosystemie i instaluje je po audycie bezpieczeństwa.

</details>

<details open>
<summary>

### Ile skilli i wtyczek warto mieć podłączonych naraz, żeby agent nie tracił miejsca w kontekście?

</summary>

Nie ma jednej liczby, bo koszt zależy od liczby i długości opisów. Nazwa i opis każdego włączonego skilla są w kontekście agenta przy każdej turze, nawet gdy skill nie jest używany, a pełna instrukcja ładuje się dopiero przy użyciu. Dokumentacja pokazuje, jak zmierzyć koszt wtyczki i które wtyczki dawno nie były używane. W drugiej tabeli w tym tekście zostawiłem tylko te, z których korzystam.

</details>
