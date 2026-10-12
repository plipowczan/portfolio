# Wsad do artykułu na blogu portfolio

> **Kopia archiwalna w repozytorium publicznym.** Ścieżki i nazwy z prywatnych repozytoriów zostały pominięte (2026-10-12). Treść merytoryczna bez zmian.

**Tytuł roboczy:** Kompetencję się instaluje, nie nabywa
**Slug docelowy (wiążący):** `skille-ktore-mam-podlaczone`
**Repozytorium docelowe:** `portfolio`, katalog `docs/blog/`
**Język artykułu:** polski
**Reguły prozy:** `portfolio/.claude/rules/content/10-prosty-polski.md`. Ten wsad ich nie kopiuje i nie rozstrzyga za tamtą stronę.
**Data złożenia wsadu:** 2026-09-11

Tytuł artykułu po tamtej stronie może brzmieć inaczej. Slug nie może. Pozostałe materiały na innych kanałach będą linkować do tego adresu, więc slug jest ustalony, zanim powstanie proza.

## 1. Teza artykułu

**Kompetencja przestała być czymś, co się zdobywa latami praktyki, a stała się czymś, co się podłącza. Skill dodany agentowi jest kompetencją dodaną mnie, i to przewraca sposób, w jaki planuję własny rozwój.**

Teza ma dwie połowy i artykuł musi unieść obie.

**Połowa pierwsza: kompetencję się instaluje.** To jest twierdzenie o narzędziu. Podstawa: stan podłączenia i to, że żadna z podłączonych pozycji nie wymagała nauki dziedziny, której dotyczy.

**Połowa druga: to zmienia planowanie własnego rozwoju.** To jest twierdzenie o mojej pracy i bez własnej podstawy byłoby samym twierdzeniem. Podstawa jest jedna i konkretna: wziąłem zlecenie, którego wcześniej bym nie wziął. Cztery z podłączonych pozycji robią rzeczy, których sam nie umiem. Pytanie „czego się nauczyć w tym kwartale" przestało być pierwszym pytaniem. Pierwszym jest „co podłączyć i co dalej muszę umieć ocenić".

Połowa druga nie mówi, że umiejętność przestała mieć znaczenie. Mówi, że przesunęła się z wykonania na ocenę wyniku. Artykuł nie stawia tezy mocniejszej niż ta, bo nie ma na nią podstawy.

## 2. Materiał dowodowy

Podstawy są przepisane dosłownie. Fragmenty w cudzysłowie to cytaty, nie parafrazy. Proza po tamtej stronie może je skrócić w cytowaniu, ale nie może ich streścić i podać streszczenia jako faktu.

### 2.1. Stan podłączenia

29 wtyczek z 8 katalogów wtyczek podłączonych globalnie na moim koncie.

> Podstawa: lista zainstalowanych wtyczek z konfiguracji Claude Code na koncie autora (ścieżka pominięta w kopii publicznej), odczyt 2026-09-11.
> Katalogi: `anthropics/claude-plugins-official`, `anthropics/skills`, `openai/codex-plugin-cc`,
> `kepano/obsidian-skills`, `nextlevelbuilder/ui-ux-pro-max-skill`, `AgriciDaniel/claude-seo`,
> `getsentry/sentry-mcp`, `200iqlabs/shared-skills`.

Fakt, który z tego wynika i który niesie tezę: żadna z tych pozycji nie wymagała ode mnie nauki dziedziny, której dotyczy.

### 2.2. Cztery pozycje robią to, czego sam nie umiem

To jest najmocniejszy konkret pod tezę. Mocniejszy niż liczba podłączonych wtyczek, bo liczba mówi o narzędziu, a to mówi o mnie. Artykuł ma go postawić wcześnie i nie chować w tabeli.

Trzy pozycje do projektowania interfejsu: `frontend-design`, `ui-ux-pro-max`, `impeccable`. Jedna do SEO: `claude-seo`.

> Podstawa, cytat z 2026-09-11: „Nie znam się ani na tworzeniu designu, ani na SEO. Dlatego
> skille zarówno do projektowania designu — i to nie tylko UI/UX, ten skill, który tam był
> wymieniony, i Front-End Design — ale też skill impeccable. To są trzy skille, które używam
> do designu”. Oraz: „poza tym też nie jestem ekspertem SEO, i to też w tym akurat pomaga mi
> skill Claude SEO”.

### 2.3. Zlecenie, którego wcześniej bym nie wziął

Zbudowałem CRM, czyli system do prowadzenia klientów i ofert, dla branży nieruchomości. Nie wziąłbym tej roboty wcześniej.

> Podstawa, cytat z 2026-09-11: „To choćby ten CRM, który zbudowałem dla [dwóch klientów
> z branży nieruchomości]. Tego bym generalnie nie zrobił wcześniej, pomijając fakt, że
> [sztuczna] inteligencja zajmuje się generowaniem dobrej jakości kodu, który wystarczy do tego,
> żeby przygotowywać fajny CRM. Do tego jeszcze trzeba przekonać klienta do tego, żeby
> przygotować design, który mu się spodoba. I tutaj zarówno Front-End Design, jak i ten UI/UX
> skill, jak i impeccable pomagają do tego, żeby ten design przygotować. Jakieś propozycje,
> choćby klientowi, z której klient może sobie wybrać. Ponadto jest też skill hyperframes,
> który pomaga mi w tworzeniu wideo oraz w przetwarzaniu tego wideo. Sam agent potrafi
> przetwarzać wideo, a Claude Code radzi sobie z tym bardzo dobrze. Te wszystkie skille pomogły
> mi właśnie w ogóle myśleć o takich zleceniach jak przygotowanie takiego skomplikowanego
> narzędzia, jakim jest CRM dla branży nieruchomości”.

Rozkład ról w tym zleceniu: kod pisze agent, propozycje wyglądu przygotowują `frontend-design`, `ui-ux-pro-max` i `impeccable`, klient wybiera z kilku propozycji, wideo obsługuje `hyperframes`.

**Zakres dozwolony w artykule: branża, skala, problem. Bez nazw klientów i bez liczb pozwalających ich odtworzyć. Zgody na nazwanie nie ma.**

### 2.4. Repozytorium jest publiczne i wolno z niego brać

> Podstawa: `gh repo view 200iqlabs/shared-skills`, odczyt 2026-09-11: `"visibility":"PUBLIC"`,
> 4 gwiazdki. `../shared-skills/.claude-plugin/marketplace.json`: `"license": "Apache-2.0"`,
> `"repository": "https://github.com/200iqlabs/shared-skills"`.

Instalacja, dwie komendy:

```
/plugin marketplace add 200iqlabs/shared-skills
/plugin install ss@shared-skills
```

### 2.5. Ile tego jest

W repozytorium stoi 20 gotowych skilli i 4 komendy.

> Podstawa, odczyt 2026-10-12, `200iqlabs/shared-skills`, `origin/master`, commit `16359dc`
> (2026-10-11): `git ls-tree -d origin/master skills/` daje 22 katalogi, a `commands/` ma 4 pliki
> `.md` (`decisions`, `explain-design`, `explain-diff`, `working-mode`; siedem komend prezentacji
> w `commands/slides/` należy do `/ss:slides`). Odpadają dwie atrapy: opis w
> `skills/marketing/SKILL.md` i `skills/product-manager/SKILL.md` brzmi dosłownie „TODO — to be
> defined with skill-creator in Phase 2”, a README oznacza oba „🔲 Planned”. Zostaje 20 skilli
> z pełnym opisem plus 4 komendy. Od 2026-09-11 z publicznego repozytorium zniknęły `/ss:ingest`
> (commit `5e512d0`: „the plugin stops shipping ss:ingest”) oraz `/ss:orientation`
> i `/ss:task-delegation` (commit `1ce536a`: „the plugin stops shipping them”).

**Ostatnie zdanie podstawy wyjaśnia zmianę liczb i nie wchodzi do artykułu.** Artykuł tych trzech pozycji nie wymienia i nie pisze, dokąd trafiły, bo czytelnik ich nie zainstaluje.

### 2.6. Agent Skills to otwarty standard

Skill nie jest funkcją jednego dostawcy ani sekretnym kodem Claude'a. Napisany raz działa poza Claude Code.

> Podstawa: Anthropic wydał specyfikację Agent Skills jako otwarty standard; kod w repozytorium
> `anthropics/skills` na licencji Apache-2.0, specyfikacja i referencyjny SDK opublikowane
> na agentskills.io. Przyjęły go Microsoft (VS Code i GitHub), Cursor, Goose, Amp i OpenCode.
> Za: The New Stack, „Agent Skills: Anthropic's Next Bid to Define AI Standards”,
> https://thenewstack.io/agent-skills-anthropics-next-bid-to-define-ai-standards/ oraz
> aibusiness.com, „Anthropic Launches Skills Open Standard for Claude”,
> https://aibusiness.com/foundation-models/anthropic-launches-skills-open-standard-claude
> (odczyt 2026-09-11). Nasze repozytorium deklaruje ten standard wprost,
> `../shared-skills/README.md`: „Modular AI agent library built on the
> [Agent Skills](https://agentskills.io) standard”.

**Nie podawać daty upublicznienia specyfikacji ani liczby zgodnych wdrożeń.** Potwierdzone jest samo otwarcie standardu, licencja, adres i lista wdrożeń wymieniona wyżej. Data i liczba nie.

### 2.7. Napisanie własnego skilla kosztuje tyle, co napisanie instrukcji

> Podstawa: notatka własna z 28.08.2026, sekcja „Anatomia wtyczki”: „Paczka to wyłącznie
> markdown i JSON, bez kroku budowania”, układ `.claude-plugin/plugin.json`,
> `skills/<nazwa>/SKILL.md`, `commands/`. Tamże, werdykt: „nie zamknięte technicznie,
> zamknięte komercyjnie przez niepublikowanie”.
> Źródło: notatka w prywatnej bazie wiedzy autora (ścieżka pominięta w kopii publicznej).

**Zastrzeżenie, które ma paść wprost i którego nie wolno pominąć:** manifest wtyczki jest konwencją Anthropic i nie należy do specyfikacji Agent Skills. Specyfikacja ustala format pliku, ale nie ustala ścieżki instalacji. Różne narzędzia szukają skilli gdzie indziej: `.claude/skills/`, `.agents/skills/`, `~/.gemini/antigravity/skills/`.

### 2.8. Część mojej maszyny nie jest do oddania

Zamknięcie sesji, rejestr zadań, kontrola spójności kontekstu i pętla publikacji żyją w repozytorium prywatnym.

> Podstawa: katalog `.claude/skills/` repozytorium prywatnego zawiera m.in. skille zamknięcia
> sesji, rejestru zadań i kontroli spójności kontekstu oraz pętlę publikacji (nazwy pominięte
> w kopii publicznej). Są wersjonowane prywatnie i nie mają kanału dystrybucji. Cytat
> z prywatnego CLAUDE.md pominięty.

**Wolno je opisać jako wzorzec. Nie wolno ich obiecać jako pozycji do wzięcia i nie wolno przy nich postawić odnośnika.**

## 3. Proponowana struktura

Kolejność jest wyliczona pod tezę: najpierw konkret, potem nazwa rzeczy, dopiero na końcu lista. Lista postawiona na początku zamienia artykuł w spis narzędzi i gubi obie połowy tezy.

1. **Otwarcie na zleceniu, nie na tezie.** CRM dla branży nieruchomości. Robota, której wcześniej bym nie wziął, bo nie umiem projektować interfejsów. Materiał: 2.3.
   *Dlaczego tu:* czytelnik dostaje powód, zanim dostanie twierdzenie.
2. **Co się zmieniło.** Nie nauczyłem się projektowania ani SEO. Podłączyłem cztery pozycje, które to robią. Materiał: 2.2.
   *Dlaczego tu:* to jest cała teza w jednym akapicie, postawiona na faktach z punktu 1.
3. **Czym jest skill.** Pierwsze użycie słowa i jedno zdanie, czym ta rzecz jest: plikiem z instrukcją, który agent czyta i zaczyna robić rzecz, której wcześniej nie robił. Zaraz potem: to otwarty standard, nie funkcja jednego dostawcy. Materiał: 2.6.
   *Dlaczego tu:* czytelnik już wie, po co mu to, więc definicja nie wisi w próżni.
4. **Dlaczego format jest tani.** Markdown i JSON, bez kroku budowania. Napisanie własnego kosztuje tyle, co napisanie instrukcji. Tu pada zastrzeżenie o manifeście i o ścieżce instalacji. Materiał: 2.7.
   *Dlaczego tu:* zamyka pytanie o trudność zrobienia tego samemu, zanim zdąży urosnąć.
5. **Stan podłączenia.** 29 wtyczek z 8 katalogów. Materiał: 2.1.
   *Dlaczego tu:* liczba działa jako tło dla listy, nie jako teza sama w sobie.
6. **Lista pierwsza: nasze, do wzięcia za darmo.** 19 pozycji, licencja Apache-2.0, dwie komendy instalacji. Przy `/ss:review-fix` i `/ss:review-loop` pada warunek z sekcji 4.1: przegląd robi Codex, a ten wymaga planu ChatGPT. Materiał: 2.4, 2.5 oraz sekcja 4.1 tego wsadu.
   *Dlaczego tu:* czytelnik ma już powód i ma już cenę wejścia równą zeru.
7. **Lista druga: cudze, publiczne.** 10 pozycji z ekosystemu, z autorami. Sekcja 4.2.
   *Dlaczego tu:* pokazuje, że to nie jest zamknięty ogródek jednego autora.
8. **Czego nie oddaję.** Prywatna część maszyny, opisana jako wzorzec. Materiał: 2.8.
   *Dlaczego tu:* uczciwość wobec czytelnika, który zaraz zapyta o resztę.
9. **Druga połowa tezy: co to robi z planowaniem własnego rozwoju.** Pytanie przesunęło się z „czego się nauczyć" na „co podłączyć i co dalej muszę umieć ocenić". Skille zmieniły nie tempo pracy, tylko to, jakie zlecenia biorę pod uwagę. Materiał: 2.2 i 2.3.
   *Dlaczego tu:* to jest wniosek, a wniosek stoi po dowodach, nie przed nimi.
10. **Zamknięcie: weź to.** Dwie komendy i odnośnik do repozytorium wpisany w zdanie. Bez zapisu na newsletter, bez bramki mailowej, bez prośby o kontakt.
    *Dlaczego tu:* artykuł ma być powodem, żeby go podlinkować, a nie stroną sprzedażową.

## 4. Lista do wypisania w całości

Artykuł niesie całość listy. To jest jego zadanie: pozostałe materiały biorą podzbiór i kierują tutaj, więc tu nic nie może zostać ucięte.

### 4.1. Nasze: `200iqlabs/shared-skills`, publiczne, Apache-2.0

Instalacja: `/plugin marketplace add 200iqlabs/shared-skills`, potem `/plugin install ss@shared-skills`.

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
| `/ss:review-fix` | jeden przegląd gałęzi przez Codex: poprawia to, co się broni, resztę odrzuca z powodem, potem commit i wysłanie zmian |
| `/ss:review-loop` | pętla między Claude a Codexem na zgłoszeniu do przeglądu, aż nie zostanie nic ważnego. Kończy się zgłoszeniem, które zamyka człowiek |
| `/ss:prepare-goal` | luźny opis zadania na warunek ukończenia sprawdzalny w zapisie sesji (wariant `prepare-openspec-goal` dla zmian OpenSpeca) |
| `/ss:find-skills` | szuka skilli w ekosystemie i instaluje po audycie bezpieczeństwa |
| `/ss:vibe-coding` | widoczna warstwa aplikacji bez wiedzy o projektowaniu: wytyczne, tokeny, komponenty |
| `/ss:environment-setup` | kreator konfiguracji plików kontekstu |
| `/ss:decisions` | wyciąga otwarte decyzje po jednej, z rekomendacją, i czeka na odpowiedź |
| `/ss:explain-diff` | omawia zmiany w kodzie plik po pliku, prostym polskim |
| `/ss:explain-design` | omawia dokument projektowy OpenSpeca temat po temacie |
| `/ss:working-mode` | przełącza sesję na polski i stały szkielet odpowiedzi |

**19 pozycji: 15 skilli i 4 komendy.** Lista wypisuje tyle wierszy, bo pięć katalogów `research*` zwinięte jest do dwóch wierszy, a `prepare-goal` i `prepare-openspec-goal` do jednego. To jeden przepływ, nie osobne pozycje. Jednego gotowego skilla lista celowo nie wymienia.

**Warunek dwóch pozycji.** `/ss:review-fix` i `/ss:review-loop` przeglądają kod przez wtyczkę Codex i wymagają planu ChatGPT z Codexem. Same skille są darmowe, recenzent nie. Ten warunek pada w artykule przy liście, w tym samym miejscu co obie pozycje.

> Podstawa: README `200iqlabs/shared-skills`, `origin/master` (commit `16359dc`, odczyt
> 2026-10-12), sekcja „Codex review prerequisite”: „`review-fix` and `review-loop` review through
> the Codex plugin for Claude Code” oraz „It needs a ChatGPT plan that includes Codex; every review
> round spends that plan's allowance”. Tamże: „There is no Copilot path any more.” Zmiana
> z Copilota na Codex: commit `bf8a30d` „review-fix i review-loop przechodzą z Copilota na Codex”.

### 4.2. Ekosystem: cudze i publiczne

| Pozycja | Autor | Co robi |
|---|---|---|
| OpenSpec | `openspec`, MIT | specyfikacja przed kodem. Po `/opsx:explore` sięgam, gdy trzeba przemyśleć rzecz przed napisaniem: zostawia plik, nie rozmowę |
| claude-seo | AgriciDaniel | audyt SEO, Core Web Vitals, dane strukturalne, widoczność w odpowiedziach AI |
| frontend-design | Anthropic | warstwa wizualna interfejsu |
| ui-ux-pro-max | nextlevelbuilder | style, palety, pary fontów i wzorce projektowe |
| commit-commands | Anthropic | commit, wysłanie zmian i zgłoszenie do przeglądu jedną komendą |
| document-skills | Anthropic | xlsx, docx, pptx i pdf: czyta i pisze |
| impeccable | pbakaus, Apache-2.0 | projektowanie i poprawianie interfejsu: hierarchia, typografia, kolor, ruch, dostępność. `npx impeccable`, impeccable.style, wersja 4.1.0 |
| hyperframes | HeyGen, Apache-2.0 | wideo w HTML: kompozycje, napisy zsynchronizowane z dźwiękiem, lektor, przejścia. Także przetwarzanie gotowego nagrania. `npx hyperframes`, wersja 0.8.34 |
| skill-creator | Anthropic | robi skill z opisu zachowania |
| superpowers | Anthropic | burza mózgów przed kodem, szukanie błędów po kolei, testy przed kodem, plany wdrożenia |

**10 pozycji.**

> Podstawa listy: wskazana przeze mnie 2026-09-11 po skreśleniu reszty zainstalowanych,
> cytat: „reszty praktycznie nie używam z tej tabeli”. OpenSpec dopisany na uwagę:
> „superpowers - rzadko bo do brainstormingu używam openspec explore”. Pochodzenie OpenSpeca
> potwierdzone w `.claude/skills/openspec-explore/SKILL.md`: `license: MIT`, `author: openspec`,
> `generatedBy: "1.12.0"`; `npx openspec --version` zwraca 1.12.0. `impeccable` 4.1.0
> (https://github.com/pbakaus/impeccable, https://impeccable.style) oraz `hyperframes` 0.8.34
> (https://github.com/heygen-com/hyperframes) potwierdzone w rejestrze npm, oba Apache-2.0.

**Zdanie o OpenSpecu i superpowers ma mówić, po co sięgam po które, a nie które jest lepsze.** Używam obu. Przewagi żadnego nie zmierzyłem, więc porównanie nie wchodzi do artykułu.

## 5. Czego artykuł nie obiecuje

Granica jest po to, żeby proza po tamtej stronie nie dopisała zakresu, którego nie mamy czym pokryć.

- **Nie jest to poradnik pisania skilli.** Mówimy, że format jest tani, i pokazujemy, z czego się składa. Nie prowadzimy nikogo za rękę przez pisanie własnego.
- **Nie ma żadnej liczby bez podstawy.** Ani „trzy razy szybciej", ani „oszczędza X godzin", ani „większość konsultantów". Liczba wzięta z pamięci wygląda identycznie jak zmierzona.
- **Nie porównujemy narzędzi bez przebiegu.** Ani OpenSpeca z superpowers, ani żadnej innej pary z tabel wyżej.
- **Nie ma prognoz o rynku pracy.** Żadnego wariantu zdania o tym, że programiści przestaną być potrzebni.
- **Nie nazywamy klientów.** CRM dla branży nieruchomości opisujemy bezimiennie: branża, skala, problem.
- **Nie obiecujemy prywatnej części maszyny.** Opisujemy ją jako wzorzec, bez odnośnika.
- **Nie wymieniamy pozycji, których w publicznym repozytorium już nie ma**, i nie piszemy, dokąd trafiły. Czytelnik ich nie zainstaluje.
- **Nie robimy pokazu własnej maszynerii do treści.** Tematem są kompetencje instalowane agentowi, nie nasz sposób publikowania.
- **Nie ma bramki.** Bez zapisu na newsletter, bez adresu mailowego w zamian za listę, bez prośby o kontakt.

## 6. Nazewnictwo

- Słowo **„skill" i „skille" zostaje po angielsku i nieprzetłumaczone**, wbrew tabeli zamian obowiązującej w pozostałych treściach. Rozstrzygnięcie z 2026-09-11: „to słowo traktowałbym jako nazwę własną, bo w tym środowisku mówimy »skills«, nie »umiejętności« — tego nikt nie powiąże ze sztuczną inteligencją”. W zamian obowiązuje reguła: **przy pierwszym użyciu powiedz, czym skill jest**, w tym samym zdaniu i nie w nawiasie.
- **Pierwsza osoba albo sam czasownik.** Nigdy „Paweł zbudował". Autor pisze o sobie w pierwszej osobie albo w ogóle nie nazywa podmiotu.
- **Agent Skills** to nazwa standardu i zostaje w oryginale.

## 7. Odnośniki do wpisania w zdanie

Ten kanał nie publikuje wpisu i nie ma miejsca, w którym odnośnik mógłby wisieć osobno. Każdy z poniższych ma trafić w zdanie prozy.

- Repozytorium, główny cel artykułu: https://github.com/200iqlabs/shared-skills
- Standard: https://agentskills.io
- `impeccable`: https://github.com/pbakaus/impeccable oraz https://impeccable.style
- `hyperframes`: https://github.com/heygen-com/hyperframes
- Źródło o otwarciu standardu: https://thenewstack.io/agent-skills-anthropics-next-bid-to-define-ai-standards/
- Drugie źródło: https://aibusiness.com/foundation-models/anthropic-launches-skills-open-standard-claude

## 8. Materiały do przeniesienia

- **Pełna lista z opisami, z notatką o tym, czego na niej celowo nie ma i czego w repozytorium już nie ma:** plik w repozytorium prywatnym (ścieżka pominięta w kopii publicznej). To jest źródło obu tabel z sekcji 4.
- **Plakat listy 1080×1350:** jeszcze nie istnieje. Powstanie przy materiałach wizualnych tego samego tematu i wtedy wejdzie tutaj. Artykuł na niego nie czeka.
- **Diagramów ani zrzutów ekranu ten wsad nie niesie.** Jeżeli proza po tamtej stronie ich potrzebuje, to jest zamówienie z powrotem do nas, a nie rzecz do dorysowania na miejscu.

## 9. Uwaga operacyjna, nie do artykułu

Dwie pozycje w tabeli README repozytorium nie mają opisu i są widoczne dla każdego, kogo artykuł tam wyśle. Artykuł ich nie wymienia i nie ma o nich zdania. Warto je uporządkować po stronie repozytorium, zanim artykuł skieruje tam ruch.

**Kolejność publikacji jest wymogiem, nie preferencją.** Artykuł powstaje i wychodzi przed materiałami na pozostałe kanały. Dopóki nie ma adresu, tamte nie mają czego wskazać.

