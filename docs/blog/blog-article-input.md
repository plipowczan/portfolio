# Wkład do artykułu — case study PIT-38 z Claude Code

> **Cel:** materiał źródłowy dla artykułu blog na portfolio PLSoft
> **Tone:** praktyczne, direct, mix PL/EN, "Technology as Leverage"
> **Forma docelowa:** long-form case study (~2000 słów) lub seria 3 krótszych postów

---

## Propozycja kąta (kąt narracyjny)

**Główny (rekomendowany — kontrast czasowy + delegacja → automatyzacja):**
> ⭐ **"Miałem 3 dni do PIT-38 bez księgowej. Wystarczyły 2 godziny."**

Dlaczego ten działa: pokazuje 3 rzeczy w 9 słowach — (1) presję czasu (3 dni), (2) brak zwykłej delegacji (bez księgowej = niespodziewana sytuacja), (3) zaskakujące rozwiązanie (2 godziny). Czytelnik chce wiedzieć JAK.

**Inne mocne warianty (wszystkie z kontrastem czasowym):**
- "3 dni do terminu PIT-38. 2 godziny pracy. 5430 transakcji."
- "PIT-38 z 5430 transakcji w 2 godziny — bo księgowa już nie wzięła"
- "Termin za 3 dni. Bez księgowej. Zamiast paniki — 2-godzinny weekend z agentem."
- "Zwykle robi to moja księgowa — w ten weekend zastąpił ją agent w 2 godziny"

**Alternatywne (bez kontrastu czasowego):**
- "4 commity, 9 plików w `data/`, 1 dopłata 172 PLN — anatomia podatkowego workflow z Claude Code"
- "Czemu wstydliwy temat (PIT-38 z LLM-em) jest dokładnie tym, o którym warto pisać"

---

## Hook / Lead (2-3 propozycje)

### Wariant A (liczby)
> 4096 transakcji Nexo. 1334 transakcji Crypto.com. 2 PIT-8C. 1 raport o dywidendach zagranicznych. 174 895 PLN niewykorzystanych kosztów krypto z 2024 do uwzględnienia. Termin: 30 kwietnia 2026. Zwykle robi to moja księgowa — w tym roku przegapiłem timing i musiałem sam. **Aktywnej pracy: ~2 godziny.** Złożone i przyjęte przez MF na 51 godzin przed deadline'em.

### Wariant B (kontrowersja)
> Świadomie wrzuciłem do agenta AI komplet swoich danych finansowych z 2025: konta brokerskie, krypto, dywidendy. Tak — wiem, że ktoś to teraz czyta i myśli "to jest nieprofesjonalne". Zaraz to obronię. Najpierw pokażę, dlaczego było warto.

### Wariant C (insight)
> Najbardziej wartościowa praca, jaką wykonał dla mnie LLM przy PIT-38, to nie sumowanie 5 tysięcy transakcji. To było zauważenie, że PIT-38 wersja (18) za 2025 ma przesunięte numery pozycji względem wersji (17) za 2024. Bez tego wpisałbym dane w stare poz. 34/35 zamiast 36/37 — i deklaracja zostałaby odrzucona.

### Wariant D (urgency — najsilniejszy CTA, jeśli publikacja 28-29.04) ⭐
> Dziś jest 28 kwietnia 2026. Jutro 29. Termin złożenia PIT-38 mija pojutrze, 30 kwietnia. Jeśli jeszcze nie złożyłeś — masz ~48 godzin. Wczoraj wieczorem wystartowałem od jednego zdania ("utwórz nowy projekt PIT-38"). Dziś po południu podatek był zapłacony. Łącznie ~2 godziny aktywnej pracy mojej + agenta. Nie obiecuję, że u Ciebie pójdzie tak samo szybko — ale jeśli przeczytasz ten artykuł do końca, masz konkretny workflow do skopiowania. Pokażę Ci wszystkie liczby, wszystkie pułapki i wszystkie decyzje interpretacyjne.

---

## Struktura artykułu (8 sekcji)

### 1. Kontekst (3-4 akapity) — REAL STORY ⭐

**Prawdziwa narracja (mocniejsza niż "zapomniałem o buforze"):**

PIT-38 składam co roku — papiery, fundusze, krypto, dywidendy. Nigdy sam. Zawsze robiła to moja księgowa: ja podsyłam dane, ona wypełnia, sprawdza, składa. Działa.

W tym roku przegapiłem timing. Termin 30 kwietnia, ja zacząłem ogarniać dokumenty 27 kwietnia wieczorem. Księgowa nie weźmie projektu z 3-dniowym buforem — i słusznie. Byłem zmuszony zrobić to sam.

Dwa wyjścia: (a) panika i prowizoryczna deklaracja na ostatni moment, albo (b) sprawdzenie, czy ten cały AI-workflow, którym buduję rzeczy dla klientów, może zastąpić księgową w jeden weekend. Wybrałem (b). Działało.

Ten artykuł nie jest o tym, jak nauczyłem się rozliczać PIT-38 — wiedziałem co robić, bo robię to od lat (przez księgową). Jest o tym, jak **2-godzinny weekend z dobrze poustawianym agentem** odtworzył pracę, którą zwykle delegowałem, i to z lepszym poziomem dokumentacji niż dostawałem od księgowej.

**To zmienia stake'a artykułu:** to nie jest "lifehack dla osób które nie chcą iść do księgowej". To jest "case study o tym, kiedy automatyzacja AI realnie podchodzi pod usługę ekspercką, którą do tej pory robił człowiek".

### 2. Architektura projektu (najbardziej "techniczna" sekcja)
Pokaż strukturę katalogów:
```
PIT_38/
  inbox/          (drop zone, raw files)
  archive/        (po przetworzeniu)
  data/           (knowledge — agent reads freely)
  deliverables/   (checklist, blog inputs)
  output/         (finalna deklaracja PDF, UPO)
  project.md      (cel, status, decyzje)
  catalog.md      (indeks plików)
```
**Insight do akapitu:** każdy katalog ma jedną odpowiedzialność. Agent NIE zagląda do `output/` ani `archive/` chyba że jawnie poproszę. To nie jest "bezpieczeństwo" — to **higiena kontekstu**: agent pracuje na czystych, przetworzonych danych w `data/`, a nie na 4096 wierszach raw CSV przy każdym pytaniu.

### 3. Workflow `/ingest` (przykład działającej automatyki)
- Wrzucam 7 plików do `inbox/`
- Komenda: `/ingest PIT_38`
- Co się dzieje: identyfikacja typu pliku → routing → ekstrakcja → aktualizacja `data/*.md` → archiwizacja → update indeksów
- **Konkretny przykład:** PIT-8C od XTB i SFIO oba poszły do `data/xtb-pit8c-2025.md` i `data/sfio-pit8c-2025.md`, a następnie zostały zsumowane w `pit38-calculation.md` w sekcji C (poz. 20-29) zgodnie z logiką PIT-38(18)

### 4. Konkretne odkrycia (najważniejsza sekcja dla czytelnika)

**A. Agent automatycznie wyciągnął bufor 174 895,50 PLN z zeszłorocznej deklaracji**
- Ja wiedziałem, że ten bufor istnieje (rozliczam PIT-38 od lat — to standardowy mechanizm dla aktywnego inwestora w krypto, art. 22 ust. 16). Ale wiedziałem to z perspektywy "powiedzieć o tym księgowej" — nie z perspektywy "wpisać w konkretną pozycję formularza"
- Agent przy ingestach poprosił o zeszłoroczną deklarację. Wrzuciłem PDF z 2024. Sam wyciągnął kwotę z poz. 38 i automatycznie wpisał w poz. 38 nowej deklaracji (gdzie staje się "kosztami z lat ubiegłych")
- ⚠️ **Uwaga narracyjna:** to NIE jest strata inwestycyjna. To **udokumentowane wydatki na zakup krypto, którego jeszcze nie sprzedałem na fiat**. Aktywa są dalej w portfelu. Polska konstrukcja PIT-38 (art. 22 ust. 14 + 16) zakłada, że koszty nabycia czekają w buforze do momentu realnej sprzedaży — wtedy obniżają przyszły dochód
- **Wartość dla mnie:** zazwyczaj ten bufor "pamięta" księgowa (ma moją deklarację z poprzedniego roku). Bez niej musiałbym sam pamiętać o pobraniu PDF, otwarciu go i sprawdzeniu poz. 38. Agent zrobił to za jednym pytaniem
- **Insight:** automatyzacja wartości "łatwo dostępna pamięć kontekstu poprzednich lat" jest niedoceniana. To ROBI księgowa — i to ROBI agent z dostępem do historycznych plików w `archive/`

**B. Numeracja PIT-38(17) vs (18) — drobiazg, który psuje deklarację**
- W PIT-38 za 2024 strata krypto była w poz. 38, w 2025 to już poz. 40
- Dodatkowo: sekcja C ma teraz wiersz 3 (zwolnienia art. 21 ust. 1 pkt 105a) — wszystko poniżej przesunięte o +2
- Wiele blog-postów i forów internetowych odnosi się do starej numeracji
- **LLM wyłapał to po wgraniu pustego wzoru (18) jako referencji**

**C. Skala redukcji: 5430 transakcji → 11 zdarzeń podatkowych**
- 4096 transakcji z jednej platformy + 1334 z drugiej = 5430 transakcji raw
- Po klasyfikacji: **11 zdarzeń podatkowych**, które trafiają do deklaracji
- Pozostałe **5419 transakcji = operacje wewnętrzne** platform (transfery między portfelami, operacje techniczne, naliczenia, drobne korekty), które **nie podlegają wykazaniu** w PIT-38 zgodnie z obowiązującą interpretacją
- Wartość LLM: nie zliczanie, tylko **klasyfikacja** — każdy z ~25 typów transakcji w raporcie został przyporządkowany do jednej z 3 kategorii (zdarzenie podatkowe / operacja wewnętrzna / earn) z uzasadnieniem prawnym
- **Bez tej klasyfikacji** próba ręcznego rozliczenia 5430 wierszy CSV byłaby albo niemożliwa, albo prowadziłaby do dramatycznego zawyżenia podstawy (gdybym potraktował każdą transakcję jako zbycie)

> *Uwaga w artykule:* nie wchodzę w szczegóły konkretnych typów transakcji ani interpretacji prawnej — to wykracza poza ten case study i wymaga indywidualnej konsultacji z doradcą podatkowym. Pokazuję jedynie SKALĘ pracy klasyfikacyjnej.

**Cx. Konwersja walut z kursami NBP D-1 — pełen edge cases**

Każdą transakcję w EUR/USD trzeba przeliczyć na PLN po **kursie średnim NBP z dnia roboczego poprzedzającego datę zbycia** (art. 11a ustawy o PIT). Brzmi prosto. W praktyce 10 transakcji wymagało indywidualnej obsługi:

- **Sobota 2025-02-15** → kurs z piątku 14.02
- **Niedziela 2025-03-16** → kurs z piątku 14.03 (sobota też nie jest robocza, cofamy się dalej)
- **Niedziela 2025-05-18** → kurs z piątku 16.05
- **Piątek 2025-05-02** → kurs ze **środy 30.04** (czwartek 1 maja to święto państwowe, też nie roboczy)
- **Niedziela 2025-06-15** → kurs z piątku 13.06
- Dla transakcji w czysty dzień roboczy: po prostu D-1

Agent zrobił to ręcznie dla każdej z 10 transakcji: wyliczył dzień tygodnia, sprawdził święta państwowe (1 maja, 3 maja, Boże Ciało, 15 sierpnia, 1 i 11 listopada, 25-26 grudnia), pobrał kurs z NBP API, przeliczył.

To jest **dokładnie** ten typ pracy, w którym ludzki mózg szybko popełnia błąd — bo każdy edge case wymaga osobnego sprawdzenia kalendarza. LLM systematycznie przeszedł przez wszystkie i nie pominął żadnego święta.

**Lekcja:** klasa zadań "dużo małych mechanicznych decyzji z subtelnymi regułami" to mocna strona LLM-a. Człowiek zrobi 1-2 błędy na 10 transakcjach (fakt: zapomnienie o 1 maja jest częste w polskich rozliczeniach). Agent zrobił 0.

---

**D. Drobny błąd, który system poprawił mi za darmo**
- Moja kalkulacja: strata sekcji C = 966,98 PLN
- System Twój e-PIT: 966,92 PLN
- Różnica 6 groszy — błąd arytmetyczny po stronie LLM (16 188,05 − 15 221,13)
- **Lekcja:** LLM-y robią błędy arytmetyczne w 6-cyfrowych dodawaniach. Sumowanie zostaw systemowi (lub Excelowi). LLM ma wartość w *strukturze* i *interpretacji*, nie w arytmetyce.

**E0. Ingest jako mechanizm progresywnego odkrywania** ⭐⭐ (najsilniejszy punkt)

To jest *meta-mechanizm*, który zadziałał lepiej niż cokolwiek innego. Nie miałem listy "co potrzeba do PIT-38". Wrzucałem co miałem pod ręką — agent po każdej iteracji mówił: "OK, to jest, ale brakuje X" lub "uwaga, to oznacza Y, sprawdź Z".

Kluczowy moment: **dywidendy zagraniczne**.
- Nie wiedziałem, że mam dywidendy z 2025 (drobne ETF-y w XTB, łącznie ~958 PLN brutto)
- Nie wiedziałem, że trzeba je rozliczać OSOBNO od reszty (sekcja G PIT-38, art. 30a, 19% PL minus podatek u źródła)
- Po ingest pierwszej partii danych agent zapytał: "a co z dywidendami? PIT-8C ich nie zawiera, XTB wystawia osobny raport"
- Pobrałem **XTB Raport Dodatkowy do PIT-38** — okazało się, że było 182 PLN podatku 19% PL od dywidend zagranicznych
- Bez tego pytania złożyłbym deklarację **bez sekcji G**. Skutek: niedopłata 172 PLN + ryzyko kontroli + odsetki

Inny moment: **historia 2024**.
- Agent przy pierwszym ingest zapytał, czy mam zeszłoroczną deklarację
- Wrzuciłem PDF — wyciągnął z niej **174 895,50 PLN niewykorzystanych kosztów krypto** do przeniesienia
- Bez tego ruchu zapłaciłbym ~2200 PLN podatku zamiast 0

**To jest istota wartości:** nie "agent zsumował transakcje", tylko "agent wiedział, czego nie wiem". Iteracyjne dopytywanie + klasyfikacja każdego dokumentu według taksonomii PIT-38 = niemożliwe do osiągnięcia ręcznie bez specjalistycznej wiedzy podatkowej.

**Lekcja:** ingest workflow ≠ batch processing. Wartość jest w pętli: wrzucasz → agent klasyfikuje → identyfikuje braki → prosi o dodatkowe dane → wrzucasz znowu. Po 3-4 iteracjach masz komplet, którego sam byś nie zebrał.

---

**E. Najbardziej zaskakujące — agent łatwo odczytał intent i cel projektu** ⭐
- Wystartowałem od jednego zdania: "utwórz nowy projekt PIT-38". Bez briefu, bez dokumentu wymagań, bez listy zadań.
- Agent sam:
  - dopytał o rok podatkowy i termin
  - zaproponował strukturę katalogów per `_template.md` (wewnętrzna konwencja repo, którą zna z `CLAUDE.md`)
  - rozpoznał, że PIT-38 = zyski kapitałowe (a nie JDG/PSA jak wcześniejsze projekty)
  - przy ingest 7 plików sam zaklasyfikował je: PIT-8C → sekcja C, raporty krypto → sekcja E, dywidendy → sekcja G
  - wyciągnął *historyczny* kontekst (bufor 174k z 2024) bez instrukcji
  - postawił kluczową decyzję interpretacyjną (opcja B vs konserwatywna) jako zewnętrzną i czekał na *moją* odpowiedź zamiast wybrać sam
- **To jest ten "moment, kiedy widzisz ROI",** którego nie da się sprzedać generic content marketingiem. To wymaga: (1) dobrze opisanego `CLAUDE.md`, (2) konwencji projektowej (`_template.md`, `_index.md`, `catalog.md`), (3) zaufania do procesu przy pierwszej iteracji.
- **Lekcja:** wartość LLM rośnie nie liniowo, ale skokowo, gdy struktury repo są czytelne dla niego. Bez `CLAUDE.md` + konwencji ten projekt zająłby tyle samo czasu co księgowy. Z nimi — 2 godziny.

### 5. Decyzje interpretacyjne — generic case (PUBLIC-SAFE)

⚠️ **Ważna uwaga edytorska:** ta sekcja w artykule pozostaje na poziomie META, bez ujawniania konkretnych decyzji interpretacyjnych mojego case'u. Powód: każda agresywna lub kreatywna interpretacja podatkowa wymaga indywidualnej konsultacji z doradcą; udostępnienie konkretnej decyzji w treści brandowej PLSoft mogłoby być błędnie zinterpretowane jako "rekomendacja Pawła".

**Co napisać w artykule (bezpieczna formuła):**

> Przy 5400+ transakcjach z różnych platform część kategorii zdarzeń ma niejednoznaczną kwalifikację podatkową — istnieją różne interpretacje KIS i opinie doradców. Dla każdej takiej kategorii LLM wyciągnął argumenty obu stron, oszacował ekspozycję ryzyka i pokazał mi trade-off liczbowy. **Decyzję podejmowałem ja**, nie agent. Agent zostawił uzasadnienie w pliku `data/sources.md` w repo — gdyby kiedyś przyszła kontrola, mam udokumentowaną ścieżkę myślenia.

> Klucz, który warto powtórzyć każdemu: **korekta PIT-38 jest możliwa do 5 lat wstecz** (do 2030 r. dla deklaracji za 2025). Czyli złożenie z dobrą wiarą + dokumentacja decyzji = bezpieczna ścieżka. Złożenie "konserwatywne" gdy nie jesteś pewien też zawsze działa — można potem skorygować na korzyść podatnika.

**Czego NIE pisać:**
- Konkretnych nazw platform i typów transakcji
- Konkretnych liczb przychodów z kategorii spornych
- Nazwy decyzji (np. "wybrałem opcję X" — to brzmi jak rekomendacja)
- Kwalifikacji prawnej konkretnych instrumentów

**Wartość dla czytelnika** mimo zachowania ostrożności: pokazujesz, że LLM **sprawnie obsługuje pracę interpretacyjną** — to jest insight wystarczający dla 99% audytorium.

### 6. Pre-emptive defense — sekcja "data hygiene"

**Pisz wprost:**

> Wiem, że dla części czytelników już samo "wrzuciłem dane finansowe do LLM" jest dyskwalifikujące. Trzy rzeczy do rozważenia:

> **a)** Claude Code (i Anthropic API) nie używa danych do treningu modeli domyślnie — to jest inny model biznesowy niż consumer ChatGPT. Dla mnie różnica jakościowa.

> **b)** Repo jest **prywatne, lokalne**. Nie ma `git push` do GitHuba. CSV-ki są w `.gitignore` — nie wchodzą nawet do historii. Bazowe dane finansowe siedzą tylko na moim dysku, kontekst LLM-a kończy się z konwersacją.

> **c)** Realny benchmark: alternatywą był księgowy z biurka, Excel na pendrive lub Twój e-PIT przeglądany w przeglądarce — w każdym z tych scenariuszy moje dane przechodzą przez czyjeś ręce/serwery. **Wybór nie jest między "bezpieczne" a "ryzykowne". Jest między różnymi rodzajami zaufania.**

> Świadomie wybrałem zaufanie do Anthropic + lokalnego workflow. Ktoś inny wybierze inaczej i to OK.

### 7. Co bym zrobił inaczej / czego nie polecam

- **Nie automatyzowałem zapłaty 172 PLN** — przelew na mikrorachunek poszedł ręcznie. Nie ma sensu robić tego przez LLM
- **Nie polecam tego setupu osobie bez programistycznego komfortu** — `/ingest`, struktura katalogów, git, .gitignore wymaga rozumienia narzędzi
- **LLM nie zastępuje doradcy podatkowego** — w sytuacjach niejednoznacznych (a takich jest sporo przy multi-source krypto+akcje+dywidendy) finalna decyzja musi należeć do człowieka, idealnie po konsultacji z doradcą. LLM dostarcza argumenty i mapuje ryzyko, doradca daje rekomendację dostosowaną do Twojej sytuacji

### 8. Rekomendacja / CTA

**Jeśli czytasz to 28-29 kwietnia 2026 i jeszcze nie złożyłeś PIT-38** — masz realną szansę zdążyć przed 30.04. Konkretny minimum-viable plan na ~2-3 godziny:
1. Pobierz wszystkie PIT-8C ze swoich brokerów (XTB, mBank, etc.) i raporty z giełd krypto
2. Wejdź na Twój e-PIT — sekcja C (papiery+fundusze) jest auto-wypełniona
3. Sekcję E (krypto) i G (dywidendy zagraniczne) wypełniasz ręcznie
4. **Sprawdź swoje PIT-38 z 2024** — czy poz. 38 zawiera niewykorzystane koszty krypto z lat ubiegłych. To może być wart kilka-kilkadziesiąt tysięcy PLN bufor
5. Złóż przez profil zaufany. Zapłać mikrorachunek do 30.04
6. Najgorszy scenariusz: korekta PIT-38 możliwa do 2030 — czyli złożenie z grubsza poprawnej deklaracji w terminie jest *zawsze* lepsze niż brak deklaracji + czynny żal

**Po terminie:**
- Dla osób z prostym PIT (1 PIT-37 z pracy) — Twój e-PIT i tyle. Nie kombinuj.
- Dla osób z 2-3 źródłami (akcje + krypto) — warto rozważyć weekend na setup workflow jak ten
- Dla osób z 5+ źródłami i historią strat z lat ubiegłych — to TWÓJ scenariusz. Bufor kosztów krypto może być wart 5-50k PLN przeoczonego podatku rocznie
- **CTA:** jeśli pomyślisz "ja też tak chcę" — repo prywatne, więc nie udostępniam, ale checklist (`deliverables/checklist-twoj-e-pit.md`) zostawiam w gist'cie / mogę napisać template projektu jako follow-up

---

## Kluczowe liczby do artykułu (referencyjne)

| Element | Wartość |
|---------|---------|
| Liczba źródeł danych | 5 (XTB, mBank brak, SFIO, Crypto.com, Nexo) |
| Liczba surowych transakcji | 5 430 |
| Liczba zbyć krypto na fiat (po filtracji) | 11 |
| Bufor kosztów z 2024 | 174 895,50 PLN |
| Przychód krypto 2025 | 11 947,42 PLN |
| Strata sekcji C | 966,92 PLN |
| Dopłata (sekcja G) | 172 PLN |
| Bufor na 2026 | 162 948,08 PLN |
| Liczba commitów git | 4 |
| Liczba dni od pierwszego ingestu do złożenia | 2 (2026-04-27 → 2026-04-28) |
| **Aktywnej pracy (mojej + agenta razem)** | **~2 godziny** |
| Czas złożenia przed terminem | 51,5h przed |
| Liczba błędów arytmetycznych LLM (6-cyfrowych) | 1 (6 groszy) |
| Plików w `data/` | 9 |
| Plików w `output/` | 2 (deklaracja + UPO) |

---

## Cytaty/screenshoty z konwersacji (do wstawienia w artykule)

Warto zachować te konkretne fragmenty z transkryptu:

1. **Moment odkrycia bufora 174k** — kiedy LLM przeczytał historyczny PDF i powiedział: "Krytyczne odkrycie. `pit.pdf` to PIT-38 za 2024, nie wstępna deklaracja za 2025 — to historyczna referencja, ale daje bardzo ważną informację."

2. **Moment wyłapania zmiany numeracji** — "PIT-38(18) ma teraz dodatkowy wiersz 3 dla zwolnień (...) wszystko poniżej przesunięte o +2"

3. **Moment kategoryzacji 5430 transakcji** — kompletny breakdown typów Crypto.com i Nexo z kwalifikacją "WYKAZUJEMY / NIE WYKAZUJEMY / neutralne"

4. **Decyzja opcji B + jej dokumentacja** — "Mniejszy podatek za 2025; ryzyko sporu z US (zaniżenie podstawy) akceptowane. Możliwa korekta PIT-38 w ciągu 5 lat."

---

## Zalecane wycięcia (4 krótsze posty na LinkedIn jako follow-up)

1. **"6 groszy, których LLM nie umie sumować"** — punkt o błędzie arytmetycznym (uczciwość + lekcja: gdzie LLM ma wartość, a gdzie kalkulator)
2. **"Zwykle robi to moja księgowa — w ten weekend zrobił to agent"** — narracja delegacja → automatyzacja (insight biznesowy o tym, kiedy AI realnie podchodzi pod usługę ekspercką)
3. **"Dlaczego pokazuję Wam moje dane finansowe"** — defense-post, prowokacyjny, świetny na engagement
4. **"PIT-38 w 2 godziny. Bez briefu. Bez listy zadań. Jedno zdanie."** — punkt E: agent rozumie intent, jeśli `CLAUDE.md` + konwencje są na miejscu. To jest najsilniejszy hook dla audytorium devów-konsultantów rozważających podobny setup.

---

## Co świadomie POMINĄŁEM w artykule (i czemu) — KRYTYCZNE GUARDRAIL'E

### Dane osobowe
- **Konkretny PESEL/NIP** — w artykule używam X-ów lub anonimizuję
- **Adres** — Ustroń OK (publiczne), numer domu maskuję
- **Numer dokumentu UPO** — zostawiam, to wewnętrzny ID systemu MF i nie wycieka żadnej wartości
- **Kursy NBP** — zostawiam, są publiczne dane
- **Przybliżone kwoty 174k / 162k** — zostawiam, bo to jest *istota* historii, ANONIMIZACJA TUTAJ ZABIJA TEKST

### ⚠️ Decyzje interpretacyjne — nie ujawniaj konkretów
- **NIE pisz** o konkretnych typach transakcji, których "nie wykazujemy"
- **NIE pisz** o nazwie konkretnej platformy lendingowej z jej typami zdarzeń (Manual Sell Order, Exchange Liquidation, Card Purchase, earn etc.)
- **NIE używaj** sformułowań typu "opcja agresywna", "wybrałem mniej restrykcyjną interpretację", "zaakceptowałem ryzyko zaniżenia podstawy"
- **NIE pisz** o konkretnych kwotach z kategorii spornych (np. ~36 000 EUR z Nexo Card Purchases)

### Powód guardrail'ów
1. **Branding PLSoft:** to jest blog brandowy konsultanta technologicznego, nie portal podatkowy. Treści, które brzmią jak "Paweł rekomenduje, jak nie płacić podatku od krypto" psują pozycjonowanie i zwiększają ekspozycję na regulacje
2. **Ryzyko prawne:** rozpowszechnianie konkretnych interpretacji podatkowych może wymagać licencji doradcy podatkowego (UDDP). Ja takiej nie mam.
3. **Ryzyko kontroli US:** publiczne udokumentowanie *konkretnych* agresywnych decyzji to dosłownie zaproszenie. Jeden audytor czytający tekst, wpisujący "PESEL 5482378017" w wyszukiwarkę systemu — i mamy temat.
4. **Etyka content-marketingu:** artykuł brandowy nie powinien promować zachowań, które wymagają indywidualnej konsultacji prawnej. To inna kategoria niż case study o produktywności

### Public-safe substytuty
| Zamiast tego | Pisz |
|--------------|------|
| "5419 transakcji nie wykazujemy bo to wymiana USDX→xUSD" | "5419 transakcji to operacje wewnętrzne platform — neutralne podatkowo" |
| "Nexo Card Purchase = opcja B = nie zbycie" | (nie pisz nic — Nexo Card nie pojawia się w artykule) |
| "Earn w krypto traktujemy jako neutralne" | (nie pisz nic — earn nie pojawia się) |
| "Wybrałem agresywną interpretację" | "Każdą kategorię klasyfikowaliśmy z udokumentowanym uzasadnieniem prawnym" |
| "Ryzyko opcji B = możliwa korekta do 2030" | "Korekta PIT-38 jest możliwa do 5 lat — to safety net dla każdego, kto składa pierwszą deklarację z mniej oczywistymi źródłami" |

---

## Tytuły alternatywne do A/B testowania na LinkedIn

1. **"Miałem 3 dni do PIT-38 bez księgowej. Wystarczyły 2 godziny."** ⭐⭐ — najmocniejszy hook (kontrast czasowy + delegacja → automatyzacja, prawdziwa narracja)
2. "Zwykle PIT-38 robi mi księgowa. W ten weekend zastąpił ją agent — w 2 godziny."
3. "3 dni do terminu PIT-38. 2 godziny pracy. 5430 transakcji."
4. "PIT-38 w 2 godziny. Bez briefu. Jedno zdanie." — intent recognition
5. "Przegapiłem termin u księgowej. Sprawdziłem, czy mój własny AI-stack to udźwignie."
6. "Dane finansowe + Claude Code = nieprofesjonalne? Świadoma odpowiedź"
7. "Wystartowałem od jednego zdania. Agent zrobił resztę."

---

## Czego nie ma w tym wkładzie i co dopiszesz sam(a)

- Twój głos / osobiste anegdoty (np. moment paniki przy obliczaniu Nexo)
- Konkretne zdjęcia/screenshoty (musimy je wybrać z transkryptu)
- Linki do narzędzi (Claude Code, Anthropic, Twój e-PIT)
- Ewentualne CTA do PLSoft offering (np. "konsultuję wdrożenia takich workflow dla freelancerów-tech")

---

## ⚠️ Mini-edukacja w artykule: jak działa opodatkowanie krypto w PL

Warto wstawić w artykule **krótką (3-4 zdania)** edukacyjną wstawkę, żeby czytelnik nie zinterpretował "bufor 174k" jako "Paweł stracił 174k na krypto".

### Public-safe wstawka do artykułu:

> Drobne wyjaśnienie dla osób spoza tematu krypto-podatków: w polskim prawie (art. 17 ust. 1 pkt 11 ustawy o PIT) zdarzenie podatkowe powstaje dopiero przy **wymianie krypto na walutę tradycyjną lub na towar**. Dopóki trzymasz pozycję w krypto — ile by się nie zmieniała wartość rynkowa — nic nie wykazujesz. Wymiana krypto-krypto też jest neutralna (art. 17 ust. 1f).
>
> Co to oznacza praktycznie: jeśli kupisz krypto za 100 000 zł i nie sprzedasz na fiat przez kilka lat, te 100 000 zł istnieje jako **udokumentowany koszt nabycia** (art. 22 ust. 14) i czeka. W roku, w którym sprzedasz krypto na fiat, ten koszt obniża podstawę opodatkowania. Jeśli koszty > przychody w danym roku — nadwyżka **przechodzi na kolejne lata bez ograniczenia czasowego** (art. 22 ust. 16).
>
> Stąd "bufor 174 895 PLN z 2024 → 162 948 PLN na 2026" w moim case'ie. To nie strata — to wydatki na zakupy krypto, których jeszcze nie zamknąłem sprzedażą na fiat. Bufor zmniejsza się wtedy, gdy realnie sprzedaję krypto na PLN/EUR/USD.

### Czego nie wstawiać:
- Nie ujawniaj **konkretnej kwoty Twoich aktywów krypto** ("mam X bitcoinów" / "mam aktywa za Y PLN") — bufor 174k mówi o *kosztach historycznych*, nie o aktualnej wartości portfela
- Nie zachęcaj wprost do "kupuj i nie sprzedawaj żeby uniknąć podatku" — to nie porada, to opis mechanizmu prawnego

### Caveat dla artykułu:
> Ta wstawka jest mocno uproszczona — pełne rozumienie wymaga konsultacji z doradcą. Nie jest to porada podatkowa, a opis ogólnego mechanizmu z mojej praktyki rozliczeniowej.

---

## Diagram-explainer (Excalidraw, do wbudowania w artykuł)

Pomysł na centralną grafikę artykułu — funnel wizualizujący transformację chaosu (5430 trx) w czystą deklarację (1 PDF + 172 PLN dopłaty).

### Visual argument (co diagram ma "udowodnić")
**Convergence + reduction pattern.** Lewy bok: 4 źródła i 12 plików raw + ~5400 transakcji. Środek: workflow `/ingest` (hero) rozdziela strumień na `archive/` (NIE czytaj) i `data/` (czytaj swobodnie). Prawy bok: kalkulacja → 1 finalna deklaracja PDF. Argument: **redukcja 5430 → 11 zdarzeń podatkowych** to nie sumowanie — to **klasyfikacja interpretacyjna**, którą wykonuje LLM przy pomocy struktury katalogów.

### Layout (left-to-right horizontal flow)

```
┌─ ŹRÓDŁA ──────────────┐  ┌─ INBOX ─┐  ┌─ /INGEST ─┐  ┌─ KATALOGI ────────┐  ┌─ KALKULACJA ──────┐  ┌─ ZŁOŻENIE ─┐
│                       │  │         │  │  (LLM)    │  │ archive/  data/   │  │ Sekcja C / E / G  │  │ PDF + UPO  │
│ ● XTB PIT-8C          │  │ 12      │  │           │  │ NIE czyta CZYTAJ  │  │                   │  │            │
│ ● XTB Raport Dyw.     │→→│ plików  │→→│  agent    │→→│ (raw)     (md)    │→→│ strata 966,92     │→→│ MF accept  │
│ ● SFIO PIT-8C         │  │ raw     │  │  ingest   │  │           9 plików│  │ bufor 174k → 162k │  │ ✓          │
│ ● Crypto.com (3 CSV)  │  │         │  │           │  │ klasyfikacja:     │  │ dopłata 172 PLN   │  │            │
│ ● Nexo (CSV 4096 trx) │  └─────────┘  └───────────┘  │ 5430 trx → 11     │  │                   │  └────────────┘
│ ● mBank: oświadczenie │                              └───────────────────┘  └───────────────────┘
│ ● + PIT-38 2024 hist. │
│ ● + PIT-38(18) wzór   │
└───────────────────────┘
```

### Kluczowe elementy do zaznaczenia kolorem

| Element | Kolor (semantyka) | Czemu |
|---------|-------------------|-------|
| **/ingest agent** | fioletowy (AI/LLM) | To jest "magia" — hero diagramu |
| **archive/** | szary, dashed stroke | Inactive/disabled — agent nie czyta |
| **data/** | niebieski (primary) | Active — agent czyta swobodnie |
| **Bufor 174k** | pomarańczowy (start/origin) | Wchodzi z 2024 |
| **Bufor 162k** | zielony (end/success) | Wychodzi na 2026 (przeniesienie) |
| **MF accept ✓** | zielony (end/success) | Finalny endpoint |
| **172 PLN dopłata** | żółty (decision/attention) | Jedyna kwota do zapłaty |

### Co warto zaznaczyć adnotacjami

1. Strzałka pod "5430 → 11" z notką: "klasyfikacja interpretacyjna (opcja B)"
2. Strzałka pomiędzy bufor 174k a 162k z notką: "art. 22 ust. 16 — bez ograniczenia czasowego"
3. Pod /ingest: "1 komenda → ekstrakcja + routing + archiwizacja + indeksy"
4. Linia czasowa pod całością: "2026-04-27 (start) ── 2026-04-28 21:36:17 (złożone) ── 30.04.2026 (termin)"

### Alternatywna wersja (mini-diagram do LinkedIn)

Krótszy pionowy funnel (800×800) bez sekcji ŹRÓDŁA i ZŁOŻENIE, tylko:
- 5430 trx (top)
- /ingest (purple, middle)
- 11 zdarzeń (bottom)
- + adnotacja boczna: "bufor 174k → 162k = podatek 0 od krypto"

To jest grafika typu "scroll-stopper" — pokazuje dramatyczną redukcję bez kontekstu.

### Trzecia wersja (architektura katalogów — czysto techniczna)

Tylko struktura PIT_38/ jako tree z annotacjami "agent reads / agent doesn't read". Bez liczb. To może być załącznikiem typu "deep dive" dla bardziej technicznych czytelników.

### Stack do generacji

Excalidraw JSON z lokalnego skill `excalidraw-diagram` w tym repo. Kolory: paleta z `references/color-palette.md` (PLSoft brand). Render do PNG via lokalny Playwright. **Build w osobnej sesji** — nie wbudowujemy go w ten ingest, tylko gdy artykuł będzie gotowy do publikacji.

---

## ⏰ Time-sensitive publication window

**Data publikacji: 28 lub 29 kwietnia 2026 (wąskie okno).**

Artykuł ma podwójną wartość:
- **Krótkoterminowa (28-29.04):** ratunek dla osób, które *jeszcze nie* złożyły PIT-38. Każdy spóźnialski to potencjalny czytelnik z silnym intentem ("muszę to zrobić TERAZ"). Hook D (urgency) najlepiej rezonuje w tym oknie.
- **Długoterminowa (po 30.04):** evergreen case study o workflow z LLM-em. Hook A/B/C działa lepiej, hook D trzeba zamienić na np. "Ten case zrobiłem w terminie — Ty zdążysz na PIT za 2026".

**Rekomendacja:** opublikuj 28.04 wieczorem **z hookiem D** (urgency) + LinkedIn post promujący artykuł 29.04 rano ("zostały ~30 godzin"). Po 30.04 zedytuj artykuł: zamień hook D na hook A i zaktualizuj sekcję CTA na evergreen.

**Alternatywnie:** publikuj 29.04 rano z dwoma wariantami (hook D + hook A) — sklejone w jeden lead. Czytelnicy z urgency dostają natychmiast wartość, czytelnicy bez deadline'u wciąż mają strukturalny insight.

**Najgorsza opcja:** publikacja 30.04 wieczorem lub 1.05. Wtedy hook D jest żałosny ("za późno"), a evergreen content jest osłabiony przez kontekst "to był deadline-rush post".

---

## Risk check przed publikacją

- [ ] Sprawdzić, czy nie zostawiam pełnego PESEL/NIP w artykule
- [ ] Sprawdzić, czy żadne nazwy klientów PLSoft nie wpadły do tła
- [ ] Decyzja: konkretne kwoty (174k, 162k, 172) — zostawiam czy redukuję rzędy wielkości?
- [ ] Decyzja: wymienić Nexo/Crypto.com z nazwy czy "platforma krypto X / Y"? (rekomendacja: po nazwie — konkret > anonimowość)
- [ ] Pokazać artykuł doradcy podatkowemu PRZED publikacją (sanity check że nic z opcji B nie zostało zinterpretowane jako "porada")
