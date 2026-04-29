---
id: 26
slug: pit-38-claude-code-case-study
title: "Miałem 3 dni do PIT-38 bez księgowej. Wystarczyły 2 godziny."
excerpt: >-
  5430 transakcji, 5 źródeł danych, 1 weekend z agentem Claude Code.
  Case study workflow, który zastąpił księgową przy rozliczeniu PIT-38.
category: AI
author: Pawel Lipowczan
date: 2026-04-29
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
alternateSlug: polish-pit-38-claude-code-case-study
---

Dziś jest 29 kwietnia 2026. Termin złożenia PIT-38 mija jutro. Przedwczoraj wieczorem wystartowałem od jednego zdania — _"utwórz nowy projekt PIT-38"_. Wczoraj po południu deklaracja była w MF, podatek zapłacony, UPO leży w `output/`. Łącznie **~2 godziny** aktywnej pracy.

**5 430 transakcji** z dwóch giełd krypto. **174 895,50 PLN** niewykorzystanych kosztów krypto z 2024 do uwzględnienia. **2 PIT-8C** z brokerów, **1 raport** o dywidendach zagranicznych. Złożone i przyjęte przez MF na **51,5 godziny** przed deadlinem. Końcowa dopłata: **172 PLN**.

Zwykle robi to moja księgowa. W tym roku przegapiłem timing — i to się okazało jednym z bardziej pouczających doświadczeń, jakie miałem z agentic workflow.

Ten artykuł nie jest o tym, jak nauczyłem się rozliczać PIT-38. Wiedziałem co robić, bo robię to od lat (przez księgową). Jest o tym, jak **2-godzinny weekend z dobrze poustawianym agentem** odtworzył pracę usługi eksperckiej — z lepszym poziomem dokumentacji niż dostawałem od księgowej.

## Zwykle PIT-38 robi mi księgowa

PIT-38 składam co roku. Papiery wartościowe, fundusze, krypto, dywidendy zagraniczne. Nigdy sam. Zawsze przez moją księgową — ja podsyłam dane, ona wypełnia, sprawdza, składa. Działa od lat.

W tym roku przegapiłem timing. Termin 30 kwietnia, ja zacząłem ogarniać dokumenty 27 kwietnia wieczorem. Księgowa nie weźmie projektu z 3-dniowym buforem — i słusznie. Byłem zmuszony zrobić to sam.

Dwa wyjścia: (a) panika i prowizoryczna deklaracja na ostatni moment, albo (b) sprawdzenie, czy ten cały AI-workflow, którym buduję rzeczy dla klientów, może zastąpić księgową w jeden weekend. Wybrałem (b). Działało.

To zmienia stake'a artykułu. To nie jest "lifehack dla osób, które nie chcą iść do księgowej". To **case study o tym, kiedy automatyzacja AI realnie podchodzi pod usługę ekspercką**, którą do tej pory robił człowiek.

## Architektura projektu: każdy katalog ma jedną odpowiedzialność

Wystartowałem od polecenia _"utwórz nowy projekt PIT-38"_. Bez briefu, bez dokumentu wymagań, bez listy zadań. Agent dopytał o rok podatkowy i termin, sięgnął po wewnętrzną konwencję `_template.md` (którą zna z `CLAUDE.md` repo) i postawił strukturę:

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

Każdy katalog ma jedną odpowiedzialność. Agent nie zagląda do `archive/` ani do `output/`, chyba że jawnie poproszę. To **nie bezpieczeństwo** — to **higiena kontekstu**. Agent pracuje na czystych, przetworzonych plikach `data/*.md`, a nie na 4096 wierszach raw CSV przy każdym pytaniu.

Brzmi banalnie. Nie jest. Bez tej separacji każde pytanie typu _"jakie były transakcje w marcu?"_ zaciągnęłoby cały surowy CSV do kontekstu — i albo wybiło mnie z limitu tokenów, albo zmusiło model do "sumowania na palcach". Z separacją: agent dostaje gotowy `data/crypto-summary-2025.md` z 11 pozycjami i pracuje na strukturze, nie na surowiznie.

To jest pierwszy multiplikator wartości — i działa **tylko dlatego**, że konwencja jest opisana w `CLAUDE.md`. Bez tego pliku ten projekt zająłby tyle samo czasu co praca ręczna.

![Workflow funnel: 5 niezależnych źródeł danych zbiega się w /ingest, agent klasyfikuje 5430 surowych transakcji do 11 zdarzeń podatkowych, deklaracja trafia do MF z buforem 174 895 PLN przeniesionym na 162 948 PLN](/images/diagram-pit-38-funnel-pl.webp)

## `/ingest`: jedna komenda, cztery kroki

Wrzuciłem 7 plików do `inbox/`: dwa PIT-8C (XTB i SFIO), trzy CSV-ki z giełd krypto, raport dywidend, zeszłoroczną deklarację jako referencję historyczną. Komenda: `/ingest PIT_38`.

Co dzieje się pod spodem:

1. **Identyfikacja typu pliku** — agent rozpoznaje PIT-8C po strukturze nagłówków, raport krypto po typowych kolumnach (timestamp, asset, type, amount).
2. **Routing** — PIT-8C trafia do sekcji C deklaracji, raporty krypto do sekcji E, dywidendy do sekcji G. Każdy plik dostaje osobny `data/{źródło}-{rodzaj}-2025.md` z normalizacją.
3. **Ekstrakcja** — z PDF-ów wyciągane są kluczowe pozycje (przychód, koszt, podatek u źródła), z CSV-ek klasyfikacja typów transakcji.
4. **Archiwizacja** — surowe pliki idą z `inbox/` do `archive/`, `catalog.md` dostaje update, `project.md` log zmian.

Konkretny przykład: PIT-8C od XTB i SFIO oba zostały zsumowane w `pit38-calculation.md` w sekcji C, z numerami pozycji zgodnymi z **PIT-38 wersja (18)** za 2025. Agent sam zauważył, że to nie ten sam wzór co w 2024 — o czym za chwilę.

Lekcja na tym etapie: `/ingest` to **nie batch processing**. Wartość jest w pętli iteracyjnej, którą zaraz pokażę.

## Sześć rzeczy, których nie spodziewałem się od agenta

To jest serce tego artykułu. Sześć konkretnych rzeczy, które agent zrobił w ten weekend, a których — gdybym pracował sam z Excelem — albo bym nie zrobił, albo zrobiłbym z błędem.

### 1. Bufor 174 895,50 PLN — auto-pull z PIT-38 2024

W polskim PIT-38 niewykorzystane koszty nabycia krypto przechodzą na kolejne lata bez ograniczenia czasowego (art. 22 ust. 16). Standardowy mechanizm dla aktywnego inwestora w krypto.

Ja wiedziałem, że ten bufor istnieje — rozliczam PIT-38 od lat. Ale wiedziałem to z perspektywy _"powiedzieć o tym księgowej"_, nie z perspektywy _"wpisać dokładnie w pozycję 38 nowego formularza"_.

Agent przy pierwszym ingest poprosił o zeszłoroczną deklarację. Wrzuciłem PDF z PIT-38 za 2024. Agent sam wyciągnął kwotę z konkretnej pozycji i wpisał w odpowiednie pole nowej deklaracji — tam, gdzie staje się "kosztami z lat ubiegłych".

Wartość dla mnie: zazwyczaj ten bufor _"pamięta"_ księgowa, bo ma moją deklarację z poprzedniego roku w swoim CRM. Bez niej musiałbym sam pamiętać o pobraniu PDF, otwarciu go, sprawdzeniu pozycji. **Agent zrobił to za jednym pytaniem.**

To jest niedoceniana klasa wartości — automatyzacja "łatwo dostępnej pamięci kontekstu poprzednich lat". Robi to księgowa. Robi to agent z dostępem do historycznych plików w `archive/`.

### 2. PIT-38 wersja (17) vs (18) — drobiazg, który psuje deklarację

W PIT-38 za 2024 koszty z lat ubiegłych miały jedną pozycję, w 2025 mają już inną. Sekcja C dostała w wersji (18) dodatkowy wiersz na zwolnienia z art. 21 ust. 1 pkt 105a — i wszystko poniżej przesunęło się o dwa wiersze.

Wiele blog-postów i forów internetowych wciąż odnosi się do **starej numeracji**. Gdybym wpisał dane w stare pozycje, deklaracja zostałaby odrzucona albo — gorzej — przyjęta z błędną kalkulacją, która wyszłaby przy kontroli.

Agent wyłapał to po wgraniu pustego wzoru PIT-38(18) jako referencji. Porównał strukturę z zeszłoroczną deklaracją, zaznaczył różnice w `data/sources.md`, użył nowej numeracji w finalnej kalkulacji.

Lekcja: **zaufaj dokumentom referencyjnym, nie pamięci modelu.** Wgrany aktualny wzór formularza > to, czego model nauczył się z internetu rok temu.

### 3. 5 430 transakcji → 11 zdarzeń podatkowych

4096 transakcji z jednej platformy plus 1334 z drugiej. Razem 5430 raw. Po klasyfikacji: **11 zdarzeń podatkowych**, które trafiają do deklaracji. Reszta to operacje wewnętrzne platform — transfery, korekty techniczne, naliczenia, drobne rozksięgowania, które nie podlegają wykazaniu.

Wartość LLM nie jest tutaj w **sumowaniu**. Wartość jest w **klasyfikacji**. Każdy z około 25 typów transakcji w raporcie został przyporządkowany do jednej z trzech kategorii: zdarzenie podatkowe / operacja wewnętrzna / neutralne. Każda kategoryzacja z udokumentowanym uzasadnieniem prawnym w `data/sources.md`.

> Nie wchodzę w szczegóły konkretnych typów transakcji ani interpretacji prawnej — to wykracza poza ten case study i wymaga indywidualnej konsultacji z doradcą podatkowym. Pokazuję jedynie skalę pracy klasyfikacyjnej.

Bez tej klasyfikacji próba ręcznego rozliczenia 5430 wierszy CSV byłaby albo niemożliwa w weekend, albo prowadziłaby do dramatycznego zawyżenia podstawy — gdybym potraktował każdą transakcję jako zbycie. Skala, którą LLM redukuje, jest nietrywialna.

### 4. Kursy NBP D-1 — 10 edge cases z kalendarzem świąt

Każdą transakcję w EUR/USD trzeba przeliczyć na PLN po **kursie średnim NBP z dnia roboczego poprzedzającego datę zbycia** (art. 11a ustawy o PIT). Brzmi prosto. W praktyce 10 z 11 transakcji wymagało indywidualnej obsługi, bo wypadły w dni nierobocze:

| Data transakcji | Dzień tygodnia | Kurs NBP z dnia |
| --- | --- | --- |
| 2025-02-15 | sobota | piątek 2025-02-14 |
| 2025-03-16 | niedziela | piątek 2025-03-14 |
| 2025-05-02 | piątek | środa 2025-04-30 (1 maja = święto) |
| 2025-05-18 | niedziela | piątek 2025-05-16 |
| 2025-06-15 | niedziela | piątek 2025-06-13 |

Agent zrobił to ręcznie dla każdej z 10 transakcji: wyliczył dzień tygodnia, sprawdził święta państwowe (1 maja, 3 maja, Boże Ciało, 15 sierpnia, 1 i 11 listopada, 25-26 grudnia), pobrał kurs z NBP, przeliczył.

To jest **dokładnie ten typ pracy, w którym ludzki mózg szybko popełnia błąd** — bo każdy edge case wymaga osobnego sprawdzenia kalendarza. Człowiek robi 1-2 błędy na 10 transakcjach (zapomnienie o 1 maja jest w polskich rozliczeniach częste). Agent zrobił 0.

Klasa zadań _"dużo małych mechanicznych decyzji z subtelnymi regułami"_ to mocna strona LLM-a. Nie sumowanie. Nie kreatywność. Systematyczne stosowanie reguł do każdej z 10 sytuacji bez znudzenia i bez pomijania.

### 5. 6 groszy, których LLM nie umie sumować

Moja kalkulacja sekcji C: strata **966,98 PLN**. Twój e-PIT po wczytaniu danych: **966,92 PLN**. Różnica 6 groszy. Błąd arytmetyczny po stronie LLM przy odejmowaniu dwóch 6-cyfrowych liczb (16 188,05 − 15 221,13).

Lekcja: **LLM-y robią błędy arytmetyczne w 6-cyfrowych dodawaniach.** Zostaw sumowanie kalkulatorowi, Excelowi albo systemowi MF. LLM ma wartość w **strukturze i interpretacji**, nie w arytmetyce. To nie jest porażka — to mapa, gdzie używać tego narzędzia, a gdzie nie.

W tym konkretnym przypadku Twój e-PIT poprawił mi błąd za darmo. W innym scenariuszu — gdybym składał papierowo — różnica 6 groszy poszłaby do MF i prawdopodobnie nikt by się nie obraził, ale chodzi o zasadę: **arytmetyka do silnika obliczeniowego, nie do modelu językowego**.

### 6. Ingest jako progresywne odkrywanie — najmocniejszy beat

Najbardziej wartościowa rzecz, jaką agent zrobił w ten weekend, to nie sumowanie 5 tysięcy transakcji. To było **pytanie o rzeczy, których nie miałem na liście**.

Nie miałem listy _"co potrzeba do PIT-38"_. Wrzucałem to, co miałem pod ręką. Po każdej iteracji agent mówił: _"OK, to jest, ale brakuje X"_ albo _"uwaga, to oznacza Y, sprawdź Z"_.

Kluczowy moment: **dywidendy zagraniczne**.

- Nie wiedziałem, że mam dywidendy z 2025 (drobne ETF-y w XTB, łącznie ~958 PLN brutto).
- Nie wiedziałem, że trzeba je rozliczać osobno od reszty (sekcja G PIT-38, art. 30a, 19% PL minus podatek u źródła).
- Po pierwszej partii ingest agent zapytał: _"a co z dywidendami? PIT-8C ich nie zawiera, XTB wystawia osobny raport"_.
- Pobrałem **XTB Raport Dodatkowy do PIT-38** — okazało się, że było 182 PLN podatku 19% PL od dywidend zagranicznych do uwzględnienia.

Bez tego pytania złożyłbym deklarację **bez sekcji G**. Skutek: niedopłata 172 PLN, ryzyko kontroli, odsetki.

Drugi moment: **historia 2024**. Agent przy pierwszym ingest zapytał, czy mam zeszłoroczną deklarację. Wrzuciłem PDF — i wtedy wyłonił się bufor 174 895,50 PLN, który opisałem wyżej. Bez tego ruchu zapłaciłbym ~2200 PLN podatku zamiast 0.

To jest **istota wartości**: nie _"agent zsumował transakcje"_, tylko **"agent wiedział, czego nie wiem"**. Iteracyjne dopytywanie + klasyfikacja każdego dokumentu według taksonomii PIT-38 = niemożliwe do osiągnięcia ręcznie bez specjalistycznej wiedzy podatkowej.

Ingest workflow ≠ batch processing. Wartość jest w pętli: wrzucasz → agent klasyfikuje → identyfikuje braki → prosi o dodatkowe dane → wrzucasz znowu. Po 3-4 iteracjach masz komplet, którego sam byś nie zebrał.

## Krótkie wyjaśnienie: jak działa opodatkowanie krypto w PL

Drobne wyjaśnienie dla osób spoza tematu krypto-podatków, żeby _"bufor 174k"_ nie zabrzmiał jak _"Paweł stracił 174k"_.

W polskim prawie (art. 17 ust. 1 pkt 11 ustawy o PIT) zdarzenie podatkowe powstaje dopiero przy **wymianie krypto na walutę tradycyjną lub na towar**. Dopóki trzymasz pozycję w krypto — ile by się nie zmieniała wartość rynkowa — nic nie wykazujesz. Wymiana krypto-krypto też jest neutralna (art. 17 ust. 1f).

Jeśli kupisz krypto za 100 000 zł i nie sprzedasz na fiat przez kilka lat, te 100 000 zł istnieje jako **udokumentowany koszt nabycia** (art. 22 ust. 14) i czeka. W roku, w którym sprzedasz krypto na fiat, ten koszt obniża podstawę opodatkowania. Jeśli koszty > przychody w danym roku — nadwyżka **przechodzi na kolejne lata bez ograniczenia czasowego** (art. 22 ust. 16).

Stąd _"bufor 174 895 PLN z 2024 → 162 948 PLN na 2026"_ w moim case'ie. To **nie strata** — to wydatki na zakupy krypto, których jeszcze nie zamknąłem sprzedażą na fiat. Bufor zmniejsza się dopiero wtedy, gdy realnie sprzedaję krypto na PLN/EUR/USD.

To jest mocno uproszczony opis mechanizmu. Pełne rozumienie wymaga konsultacji z doradcą — to nie jest porada podatkowa.

## Decyzje interpretacyjne: gdzie człowiek wraca do gry

Przy 5400+ transakcjach z różnych platform część kategorii zdarzeń ma **niejednoznaczną kwalifikację podatkową**. Istnieją różne interpretacje KIS, opinie doradców, wyroki sądów administracyjnych dotyczące zbliżonych konstrukcji.

Dla każdej takiej kategorii LLM wyciągnął argumenty obu stron, oszacował ekspozycję ryzyka i pokazał mi **trade-off liczbowy** — ile podatku oznacza interpretacja konserwatywna, ile mniej restrykcyjna, jakie jest ryzyko sporu z US. **Decyzję podejmowałem ja**, nie agent. Agent zostawił uzasadnienie w `data/sources.md` w repo — gdyby kiedyś przyszła kontrola, mam udokumentowaną ścieżkę myślenia.

I jeszcze jeden klucz, który warto powtórzyć każdemu, kto stoi przed pierwszą samodzielną deklaracją: **korekta PIT-38 jest możliwa do 5 lat wstecz** (do 2030 dla deklaracji za 2025). Złożenie z dobrą wiarą plus dokumentacja decyzji = bezpieczna ścieżka. Gdy nie jesteś pewien — interpretacja konserwatywna w pierwszej deklaracji zawsze działa, można potem skorygować na korzyść podatnika.

LLM w tej części nie podejmuje decyzji za mnie. **Mapuje opcje, dokumentuje argumenty, czeka na input.** To dokładnie ten podział pracy, który chcę.

## "Wrzuciłeś dane finansowe do LLM?" — świadomy wybór, nie nieostrożność

Wiem, że dla części czytelników już samo _"wrzuciłem dane finansowe do LLM"_ jest dyskwalifikujące. Trzy rzeczy do rozważenia.

**a) Claude Code (Anthropic API) nie używa danych do treningu modeli domyślnie.** To jest inny model biznesowy niż consumer ChatGPT — i jakościowa różnica. Aktualne zasady przetwarzania zawsze warto sprawdzić w [polityce Anthropic](https://www.anthropic.com/privacy), ale baseline jest taki: API to środowisko produkcyjne dla developerów i firm, nie zbieracz danych treningowych.

**b) Repo jest prywatne, lokalne.** Nie ma `git push` do GitHuba. CSV-ki są w `.gitignore` — nie wchodzą nawet do historii commitów. Bazowe dane finansowe siedzą tylko na moim dysku. Kontekst LLM-a kończy się z konwersacją.

**c) Realny benchmark.** Alternatywą był księgowy z biurka, Excel na pendrive lub Twój e-PIT przeglądany w przeglądarce — w każdym z tych scenariuszy moje dane przechodzą przez czyjeś ręce, czyjąś pamięć albo czyjeś serwery. **Wybór nie jest między "bezpieczne" a "ryzykowne". Jest między różnymi rodzajami zaufania.**

Świadomie wybrałem zaufanie do Anthropic plus lokalnego workflow. Ktoś inny wybierze inaczej i to OK. Dyskusja _"czy LLM jest bezpieczny dla finansów"_ traci sens, jeśli nie porównujemy go z konkretną alternatywą.

## Czego nie polecam

- **Nie automatyzowałem zapłaty 172 PLN.** Przelew na mikrorachunek poszedł ręcznie. Nie ma sensu robić tego przez LLM — to jedna kwota, jeden numer rachunku, 30 sekund w aplikacji bankowej.
- **Nie polecam tego setupu osobie bez programistycznego komfortu.** `/ingest`, struktura katalogów, git, `.gitignore`, edycja markdown — wymaga rozumienia narzędzi. Bez tego strata czasu na setup zje wszystkie zyski.
- **LLM nie zastępuje doradcy podatkowego.** W sytuacjach niejednoznacznych — a takich jest sporo przy multi-source krypto + akcje + dywidendy — finalna decyzja musi należeć do człowieka, idealnie po konsultacji z doradcą. LLM dostarcza argumenty i mapuje ryzyko. Doradca daje rekomendację dostosowaną do Twojej sytuacji i bierze za nią odpowiedzialność.

## Jeśli czytasz to dziś — masz jeszcze ~30 godzin

Jeśli jeszcze nie złożyłeś PIT-38, a masz multi-source przychody, oto minimum-viable plan na **2-3 godziny** przed deadlinem 30.04:

1. Pobierz wszystkie PIT-8C ze swoich brokerów (XTB, mBank, etc.) i raporty z giełd krypto.
2. Wejdź na Twój e-PIT — sekcja C (papiery + fundusze) jest dla większości osób auto-wypełniona.
3. Sekcję E (krypto) i G (dywidendy zagraniczne) wypełniasz ręcznie. To tutaj Twój e-PIT nie pomoże.
4. **Sprawdź swoje PIT-38 z 2024.** Czy odpowiednia pozycja zawiera niewykorzystane koszty krypto z lat ubiegłych. To może być wart **kilka-kilkadziesiąt tysięcy PLN bufor**, o którym nie pamiętasz.
5. Złóż przez profil zaufany. Zapłać mikrorachunek do 30.04.
6. **Najgorszy scenariusz: korekta PIT-38 możliwa do 2030.** Złożenie z grubsza poprawnej deklaracji w terminie jest zawsze lepsze niż brak deklaracji + czynny żal.

**Po terminie**, w trzech profilach:

- **Prosty PIT (1 PIT-37 z pracy)** — Twój e-PIT i tyle. Nie kombinuj.
- **2-3 źródła (akcje + krypto)** — warto rozważyć weekend na setup workflow zbliżony do tego.
- **5+ źródeł i historia strat z lat ubiegłych** — to **TWÓJ scenariusz**. Bufor kosztów krypto może być wart 5-50k PLN przeoczonego podatku rocznie. Setup się zwraca.

Wartość LLM rośnie nie liniowo, ale **skokowo**, gdy struktury repo są dla niego czytelne. Bez `CLAUDE.md` i konwencji projektowych ten projekt zająłby tyle samo czasu co praca z księgowym. Z nimi — dwie godziny. To jest dokładnie ten zakres ROI, którego nie da się sprzedać generic content marketingiem — bo wymaga, żeby najpierw stała tam infrastruktura.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Masz multi-source podatki i myślisz "ja też tak chcę"?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomagam freelancerom i konsultantom technologicznym ustawiać AI workflow do
    rzeczy, które do tej pory delegowali ekspertom. Pokażę, jak taki setup mógłby
    wyglądać u Ciebie.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Przydatne zasoby

- [Twój e-PIT](https://www.podatki.gov.pl/pit/twoj-e-pit/) — automatyczne wypełnienie sekcji C dla papierów i funduszy
- [Ustawa o PIT — ISAP](https://isap.sejm.gov.pl/) — art. 17 ust. 1 pkt 11, art. 22 ust. 14, 16, art. 11a (kursy), art. 30a (dywidendy)
- [NBP — kursy średnie](https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/) — D-1 dla transakcji walutowych
- [Anthropic — Privacy & Data Usage](https://www.anthropic.com/privacy) — domyślne zasady przetwarzania w API
- [Skills 2.0 — multi-agent system do zarządzania firmą](/blog/skills-2-0-multi-agent-system-zarzadzanie-firma) — kontekst, jak zbudowane są konwencje `CLAUDE.md`
- [Spec-driven SEO na portfolio i Qamera AI](/blog/spec-driven-seo-portfolio-qamera-ai) — inny case study, ten sam typ workflow

## FAQ

<details open>
<summary>

### Czy mogę zrobić PIT-38 z Claude Code, jeśli nie jestem programistą?

</summary>

Krótka odpowiedź: niekoniecznie warto. Setup wymaga znajomości git, terminala, struktury katalogów, edycji markdown i `.gitignore`. Bez tego strata czasu na konfigurację zje wszystkie zyski. Bezpieczniejsza ścieżka dla osób nietechnicznych to księgowy lub Twój e-PIT z ręcznym uzupełnieniem sekcji E i G.

</details>

<details open>
<summary>

### Czy Anthropic używa moich danych finansowych do trenowania modeli?

</summary>

Domyślnie nie — Claude Code (Anthropic API) działa na innym modelu biznesowym niż consumer ChatGPT. Dane przesyłane przez API nie są używane do treningu modeli bez wyraźnej zgody klienta. To inna kategoria niż darmowe narzędzia konsumenckie. Aktualne zasady warto sprawdzić w [polityce prywatności Anthropic](https://www.anthropic.com/privacy).

</details>

<details open>
<summary>

### Co to jest "bufor kosztów krypto" i czemu może być wart kilkadziesiąt tysięcy PLN?

</summary>

Bufor to udokumentowane wydatki na zakup krypto, których jeszcze nie zamknąłeś sprzedażą na walutę tradycyjną. W polskim PIT (art. 22 ust. 14, 16) koszty czekają w buforze do roku, w którym sprzedasz krypto na fiat — wtedy obniżają podstawę opodatkowania. Nadwyżka kosztów nad przychodami w danym roku przechodzi na kolejne lata **bez ograniczenia czasowego**. Dlatego sprawdzenie zeszłorocznej deklaracji potrafi być warte kilka-kilkadziesiąt tysięcy PLN przeoczonego bufora.

</details>

<details open>
<summary>

### Co zrobić, jeśli czytam to po 30 kwietnia i jeszcze nie złożyłem PIT-38?

</summary>

Złóż jak najszybciej z czynnym żalem (art. 16 KKS) — kara za niezłożenie deklaracji rośnie z czasem, a sam czynny żal w wielu przypadkach pozwala uniknąć grzywny. Korekta PIT-38 jest możliwa do 5 lat wstecz, więc lepiej złożyć z grubsza poprawną deklarację z opóźnieniem niż w ogóle. Po fakcie warto skonsultować się z doradcą podatkowym, jeśli sytuacja jest złożona.

</details>

<details open>
<summary>

### Czy LLM zastępuje doradcę podatkowego przy multi-source PIT?

</summary>

Nie. LLM dobrze radzi sobie z klasyfikacją typów transakcji, ekstrakcją danych z PDF-ów i mechaniczną konwersją kursów NBP, ale w sytuacjach niejednoznacznej kwalifikacji prawnej finalna decyzja musi należeć do człowieka. Idealnie — po konsultacji z doradcą, który weźmie odpowiedzialność za rekomendację dostosowaną do Twojej sytuacji. LLM mapuje opcje i ryzyka. Doradca podejmuje decyzję, którą podpisuje swoim nazwiskiem.

</details>
