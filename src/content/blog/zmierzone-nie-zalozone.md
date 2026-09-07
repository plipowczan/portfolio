---
id: 32
slug: zmierzone-nie-zalozone
title: "Zmierzone, nie założone. Trzy wnioski, które sam obaliłem"
excerpt: >-
  Sprawdziłem, co dzieje się z oznaczeniem pliku na dziewięciu kanałach.
  Trzy razy mój własny wniosek okazał się fałszywy. Pięć reguł, które z tego zostały.
category: Code
author: Pawel Lipowczan
date: 2026-09-06
readTime: 16 min
image: /images/og-zmierzone-nie-zalozone.webp
tags:
  - Testowanie
  - Metodyka
  - AI Act
  - C2PA
  - AI
lang: pl
alternateSlug: measured-not-assumed
---

W [Qamerze](https://qamera.ai) budujemy system, który generuje zdjęcia i wideo produktowe dla sklepów internetowych: packshoty i sesje z modelkami, bez studia i bez fotografa. Odpowiadam w niej za warstwę techniczną, w tym za to, żeby każdy wygenerowany plik niósł zapis swojego pochodzenia.

Taki plik nie trafia do kupującego wprost. Najpierw idzie do sklepu, sklep robi z niego własne miniatury i warianty, a potem ten sam materiał ląduje na Instagramie, w reklamie i w porównywarce cen. Na każdym z tych przystanków ktoś zapisuje go od nowa. Pytanie, które z tego wynika, brzmi banalnie: czy oznaczenie, które wkładamy do pliku, dociera do człowieka po drugiej stronie.

Normalnie zbywa się je machnięciem ręki, bo przecież metadane siedzą w pliku, a plik idzie do odbiorcy. W połowie lipca to przestało wystarczać, bo do projektu wszedł nam AI Act, czyli unijne rozporządzenie wymagające oznaczania treści generowanych przez AI. Nie piszę tu o samej regulacji i nie jest to tekst prawny. Liczy się to, co przepis zrobił z naszą pracą: zamienił „powinno działać" w pytanie „skąd wiesz".

Analizy ruszyły na przełomie lipca i sierpnia, ostatni domiar zrobiłem 5 września. Przez ten czas zmierzyliśmy dziewięć kanałów: trzy silniki sklepowe, cztery platformy społecznościowe i dwa edytory. Każdy pomiar dostał datę, wsad i kontrolkę.

Piszę „zmierzyliśmy", bo większości tej roboty nie wykonałem ręcznie. Zrobił ją agent: postawił sklepy lokalnie, przepuścił pliki przez pełną ścieżkę wgrywania, odczytał manifesty, przeskanował bajty pod kątem trzynastu wzorców naraz. To zadania, które opisuje się w trzech zdaniach, a wykonuje w kilkuset krokach. Moje było zaprojektowanie pomiaru i przeczytanie wyników. Jednej rzeczy agent zrobić nie mógł: wgrać materiału na platformy i sprawdzić, czy pod postem stanęła etykieta. Do tej odpowiedzi trzeba opublikować, a publikacja wymaga człowieka z kontem.

Wyszło z tego kilkanaście tabel i pięć reguł, które przenoszą się daleko poza ten temat. Wyszły też trzy sytuacje, w których zapisałem wniosek, a potem sam go wycofałem. Nie po miesiącach, tylko po jednym domiarze. Raz wystarczyło poczekać dobę. Raz wystarczyło powtórzyć pomiar na własnym pliku zamiast na cudzym. Raz werdykt został ten sam, a rozsypało się uzasadnienie, którym go tłumaczyłem.

Każdy z tych trzech wniosków brzmiał pewnie w chwili zapisu. O tym chcę napisać, bo pewność nie jest pomiarem. Dotyczy to tak samo mnie, jak agenta, który ten projekt ze mną prowadzi: agent formułuje wnioski gładko i szybko, w tym takie, które nie mają pokrycia w żadnym odczycie.

Poniżej pięć reguł. Wszystkie wyszły z pomyłek, nie z podręcznika.

## Wszyscy wiedzieli, nikt nie zmierzył

Jeszcze dwa akapity domeny, bo bez nich reguły wiszą w powietrzu. Znać jej nie trzeba, żeby wziąć z tekstu metodę.

Oznaczenie ma dwie warstwy i to rozróżnienie wraca w całym tekście. Pierwsza to **manifest C2PA**. [C2PA](https://spec.c2pa.org/specifications/specifications/2.1/index.html) to otwarty standard zapisu pochodzenia pliku, a manifest to blok danych osadzony w pliku, który mówi, czym plik jest i kto to poświadcza. Druga warstwa to **znak wodny**, czyli sygnał wpisany w same piksele, niewidoczny dla oka i odporny na przekształcenia samego pliku. Obok nich jedzie jeszcze `XMP` (standardowy pakiet metadanych, ten sam, w którym siedzi autor i tytuł zdjęcia).

Warstwy różnią się odpornością i czytelnikiem, i w tym siedzi cały problem. Manifest kasuje **rekompresja**, czyli ponowny zapis obrazu, po którym piksele wyglądają tak samo, a bajty są inne. Znak wodny rekompresję przeżywa, tylko prawie nikt go nie czyta.

Przed pomiarem wszyscy w projekcie mieliśmy to samo zdanie: metadane są w pliku, plik idzie dalej, więc metadane idą dalej. Nikt tego nie sprawdził, bo wydawało się zbyt oczywiste, żeby sprawdzać.

Pomiar pokazał, że to zdanie jest prawdziwe w jednym przypadku: kiedy plik idzie bajt w bajt, czyli kiedy po drodze nikt go nie zapisuje od nowa. Wszędzie indziej trzeba sprawdzać osobno, kanał po kanale.

## Reguła 1: kontrolka negatywna waży więcej niż pomiar pozytywny

Pierwszy pomiar na Meta wyglądał na sukces. Wgrałem materiał niosący oznaczenie na Instagram i na Facebooka, i oba posty dostały etykietę o treściach utworzonych przez SI. Automatycznie, bez dotykania pola samodeklaracji przy wgrywaniu.

Wniosek nasuwa się sam: platforma czyta nasze oznaczenie. Tyle że z tego pomiaru on nie wynika. Etykietę mógł postawić klasyfikator obrazu, czyli model oceniający sam kadr, któremu wszystko jedno, co siedzi w metadanych.

Zarzut nie był teoretyczny. Dokładnie tę samą treść inne narzędzie rozpoznało jako wygenerowaną z samych pikseli, bez zaglądania do metadanych. Gdyby platforma robiła to samo, wynik pozytywny nie mówiłby nic o naszym oznaczeniu.

Rozstrzyga kontrolka negatywna. Wziąłem ten sam materiał, ten sam kadr, te same piksele, w postaci, którą wcześniej zmierzyłem bajtowo jako pozbawioną wszystkich znaczników. Wgrałem go tak samo, na obie platformy.

**Etykiety nie dostał na żadnej z nich** (pomiar 31 sierpnia 2026, kontrola po dobie 1 września). Dopiero to czyni wynik dowodem: etykieta bierze się z osadzonej deklaracji, a nie z rozpoznania obrazu.

Ta sama konstrukcja zadziałała wcześniej na obrazach, 6 sierpnia 2026. Dwa posty, to samo zdjęcie produktu (**packshot**, czyli zdjęcie produktu na jednolitym tle), różniące się wyłącznie warstwą metadanych. Plik z manifestem dostał etykietę w około dwie minuty. Plik z samym znakiem wodnym, po przejściu przez sklep, nie dostał jej ani od razu, ani w kontroli po dobie.

Przy okazji wypadł z tego fakt, którego się nie spodziewałem: platforma czyta manifest i nie czyta znaku wodnego. Warstwa odporna przeżyła całą drogę i nie wywołała żadnego skutku, bo nikt po tej stronie jej nie sprawdza.

Reguła jest prosta w zapisie i kosztowna w wykonaniu. Pomiar pozytywny bez kontrolki pokazuje, że coś się dzieje. Nie pokazuje, z czego to coś wynika. Kontrolka kosztuje drugi przebieg i zwykle nie ma jej w planie, bo plan pisze się pod pytanie „czy działa", a nie pod pytanie „dlaczego działa".

## Reguła 2: pierwszy odczyt kłamie

31 sierpnia wgrałem dwa filmy na TikToka i sprawdziłem posty kilkanaście minut później. Żaden nie miał etykiety. Zapisałem wniosek: platforma nie czyta pochodzenia osadzonego w pliku.

Wniosek był konkretny, pasował do reszty obrazu i miał konsekwencje. Wychodziło z niego, że na tym kanale nasze oznaczenie nie daje żadnego skutku widocznego dla odbiorcy.

1 września wróciłem do tych samych postów. Jeden z nich miał etykietę o multimediach generowanych przez AI. Pole samodeklaracji jest na tej platformie domyślnie wyłączone i nie dotknąłem go w żadnym poście, więc etykieta przyszła z pliku.

**Wniosek z 31 sierpnia poszedł do kosza.** Platforma czyta pochodzenie. Robi to wolniej, niż zdążyłem sprawdzić. Dlaczego etykieta stanęła akurat na jednym z dwóch plików, to osobny wątek i nie otwieram go tutaj.

Dla reguły ważne jest co innego: **negatyw bez kontroli czasowej nie jest negatywem.** Jest zdaniem o tym, co widziałem w konkretnej minucie.

Ten sam domiar wzmocnił inny wynik i to jest druga połowa reguły. Kontrolki na Meta po dobie **nadal** nie miały etykiety. Gdyby dostały ją z opóźnieniem, cały wniosek z reguły 1 by się posypał. Kontrola czasowa raz zabija wniosek, raz zamienia poszlakę w dowód, a z góry nie wiadomo, który raz jest który.

Czego nie wiem do dziś: kiedy dokładnie ta etykieta się pojawiła. Wiem tyle, że po kilkunastu minutach jej nie było, a po dobie była. Okno jest szerokie i nie zawęziłem go. To też jest wynik, tylko mniej wygodny w tabeli.

## Reguła 3: mierz na własnym artefakcie

6 sierpnia zmierzyłem, co robią z metadanymi zdjęć produktowych dwa popularne silniki sklepowe. Pomiar był porządny: lokalne instancje, pełna ścieżka wgrywania, wszystkie pochodne (**pochodna** to mniejsza wersja obrazu, którą sklep generuje sam, na przykład miniatura na listingu).

Miał jedną wadę, o której wiedziałem od początku. Szedł na cudzym pliku. Nasze własne eksporty nie niosły wtedy jeszcze kompletu metadanych, więc wsadem był plik z innego źródła, o innej strukturze.

Wyniki wyglądały jednoznacznie.

WooCommerce ma próg **2560 px** na dłuższej krawędzi. Poniżej progu plik idzie bajt w bajt: **hash SHA-256** pliku serwowanego zgadza się z wgranym co do znaku (hash to skrót kryptograficzny, identyczny wyłącznie dla identycznych bajtów). Powyżej progu WordPress tworzy wariant przeskalowany i to on wychodzi jako „pełny rozmiar", już bez manifestu.

PrestaShop nie ma ani progu, ani ścieżki kopiującej. Najostrzejszy pojedynczy fakt z całego pomiaru siedzi w wierszu, który sklep nazywa „oryginałem": **te same wymiary 3712x4608, piąta część wagi (1 146 413 B wobec 5 666 168 B), zero metadanych.** Plik, którego nikt nie skalował, i tak został zapisany od nowa. Wersja 9, zmierzona 22 sierpnia, zachowuje się identycznie.

Do wyników dopisałem zdanie, które wydawało się oczywistym wnioskiem: karta produktu pokazuje pochodną 600 px, bez manifestu, więc kupujący i tak ogląda plik nieoznaczony w warstwie metadanych.

22 sierpnia powtórzyłem pomiar na naszym pliku produkcyjnym, z naszą strukturą metadanych. **To zdanie jest prawdziwe wyłącznie o manifeście.** Nasz pakiet `XMP` przechodzi do każdej pochodnej, łącznie z tą kartą produktu, która pokazuje 600 px. Że to nasz pakiet, a nie coś dokładanego przez sklep, widać po jego treści.

Pierwszy pomiar nie mógł tego zobaczyć. Cudzy plik nie niósł naszego `XMP`, więc pytanie „czy `XMP` dojeżdża do pochodnych" w ogóle nie zostało zadane. Mierzyłem obiekt podobny do naszego i wyciągałem wnioski o naszym.

Reguła: pomiar na cudzym artefakcie odpowiada na pytanie o cudzy artefakt. Jeśli własnego jeszcze nie masz, zapisz to przy wyniku i wróć, kiedy będziesz miał. Ja wróciłem po szesnastu dniach i dostałem inną odpowiedź.

## Reguła 4: szukaj mechanizmu, nie korelacji

31 sierpnia przepuściłem dwa filmy z oznaczeniem przez konsumencki edytor wideo, w ośmiu wariantach: przelot bez żadnej zmiany, przycięcie kadru, wycięcie dwóch sekund i zmiana rozdzielczości.

**Oznaczenie zginęło w ośmiu przypadkach na osiem.** Skan objął trzynaście wzorców bajtowych, od nazw standardu po nazwy narzędzi. W eksportach zero trafień na każdym wzorcu, w oryginałach od ośmiu do jedenastu.

Najważniejszy jest wiersz „przelot bez żadnej zmiany". Nie trzeba agresywnej obróbki. Wystarczy wczytać plik do edytora i wyeksportować go nietkniętym.

Mechanizm wyglądał na oczywisty. **Kontener MP4**, czyli struktura pliku wideo złożona z pudełek, w których osobno siedzą obraz, dźwięk i metadane, jest w wyjściu zbudowany od nowa. Pudełka niosące oznaczenie po prostu nie istnieją: nie zostały okrojone ani przesunięte, nie ma ich wcale. Zapisałem więc, że zabija przebudowa kontenera.

1 września zmierzyłem drugą oś, czyli to, co platformy serwują dalej. I tu uzasadnienie się posypało.

TikTok kontener też przebudowuje. Deklaruje to wprost, osobną akcją **transkodowania** (ponownego zakodowania strumienia wideo do ustawień platformy). A łańcuch pochodzenia zostaje. Platforma zagnieżdża nasz manifest jako **składnik rodzicielski**, czyli zapis mówiący „ten plik powstał z tamtego", pod własnym nowym podpisem:

```text
plik pobrany z platformy
└─ warstwa aktywna       podpis platformy      akcje: otwarcie + transkodowanie
   └─ składnik rodzica    nasz podpis           akcja: utworzenie
      └─ składnik         podpis dostawcy       akcja: utworzenie
```

Oba pliki walidują się jako poprawne. Platforma nie zgubiła łańcucha przy przebudowie, tylko odbudowała go razem z plikiem.

**Werdykt się nie zmienił, uzasadnienie owszem.** Oznaczenie nadal ginie osiem na osiem w edytorze. Ale zabija je nie przebudowa kontenera, tylko przebudowa przez narzędzie nieświadome pochodzenia. Narzędzie, które o pochodzeniu wie, przebudowuje plik i łańcuch przenosi.

Różnica jest praktyczna, nie akademicka. Z pierwszej wersji wynikało „unikaj przekodowania". Z drugiej wynika „sprawdź, czy narzędzie w łańcuchu zna standard", a to zdanie przenosi się na narzędzia, których jeszcze nie zmierzyłem. Korelacja opisuje osiem plików. Mechanizm opisuje dziewiąty.

## Reguła 5: zapisz, czego nie zmierzyłeś

Tabela z pustym polem jest gorsza niż brak tabeli, bo puste pole czyta się jak zero. W tym pomiarze pustych pól jest sporo i każde ma osobne zdanie w sekcji ograniczeń.

**Jeden edytor, nie klasa edytorów.** Wybrałem najpopularniejszy edytor konsumencki na tym rynku. Mechanizm z reguły 4 jest własnością sposobu składania pliku, a nie tego programu, więc wynik powinien przenosić się na każde narzędzie, które nie przenosi nieznanych sobie pudełek. „Powinien" to argument, nie pomiar, i tak został zapisany.

**Dwie platformy niezmierzone na drugiej osi.** Wiem, że oznaczają post. Nie wiem, czy plik, który serwują dalej, nadal niesie pochodzenie, bo materiał wgrany tam przeszedł wcześniej przez edytor i stracił oznaczenie przed wgraniem. Nie było czego zachowywać. To nie to samo co „sprawdzone i nie zachowuje".

**Jeden wariant pominięty świadomie.** Uboższy z dwóch plików już przeszedł, więc bogatszy mógł tylko potwierdzić wynik. Pominięcie z uzasadnieniem jest w porządku. Pominięcie bez zapisu wygląda po miesiącu tak samo jak wynik negatywny.

Osobno zapisuję pułapki metody. YouTube oznacza post automatycznie, a plik, który serwuje dalej, jest zdjęty do zera: żadnego manifestu, żadnego markera w surowych bajtach. Tyle że pierwsze podejście do tego pomiaru dałoby wynik fałszywie negatywny z winy narzędzia, którym pobierałem plik, bo automatyczne sklejanie strumieni nadpisuje metadane kontenera. Kto powtarza ten pomiar, musi powtórzyć też ten warunek, więc warunek stoi w notatce obok wyniku.

Te dwie osie mieszają się najłatwiej ze wszystkiego, co tu zmierzyłem. „Platforma oznacza post" i „platforma przekazuje pochodzenie dalej" to dwie różne obietnice. Z czterech mierzonych platform obie dowozi jedna.

## Warstwa krucha jest publiczna, odporna zamknięta

Na koniec wynik, który podoba mi się najmniej, bo nie da się go naprawić po naszej stronie.

Sprawdziłem cztery powierzchnie, na których człowiek może zweryfikować plik. Interesowała mnie jedna kolumna: czy da się to zrobić bez konta.

Trzy z czterech wymagają zalogowania. Jedna, [publiczny weryfikator Content Authenticity](https://verify.contentauthenticity.org), działa bez konta i czyta **wyłącznie manifest**, czyli tę warstwę, którą kasuje pierwsza lepsza rekompresja. W tym rekompresja w sklepie, przez który jedzie zdjęcie produktu.

Odporność obu warstw zmierzyliśmy osobno i wypada odwrotnie do ich dostępności. Manifest zginął na **dziesięciu przekształceniach na dziesięć**, łącznie z konwersją do formatu bezstratnego, gdzie piksele zostały identyczne co do bitu. Znak wodny przeszedł **pięć na pięć**: rekompresję bez zmiany wymiarów, skalowanie, mocną kompresję, nałożenie elementu graficznego i odbicie poziome, czyli klasyczny atak na tę warstwę. Wykryć go można wyłącznie w narzędziu, które wymaga zalogowania.

Zbudowaliśmy własny [odczyt oznaczeń w przeglądarce](https://qamera.ai/tools/verify-image), też bez konta i bez instalowania czegokolwiek. Ma dokładnie to samo ograniczenie, bo czyta tę samą warstwę. Publiczna ścieżka sprawdzenia nie robi się pełniejsza od tego, że dokłada się do niej kolejne narzędzie po tej samej stronie.

Podział ról wychodzi odwrotny do intuicyjnego:

- warstwa **krucha** jest publicznie czytelna,
- warstwa **odporna** jest zamknięta za kontem.

Obie razem działają technicznie. Nie składają się w jedną publiczną ścieżkę sprawdzenia. Człowiek bez konta, który chce zweryfikować plik po tym, jak plik przeszedł przez sklep, nie ma czym.

Tego nie wymyśliłem przy planowaniu pomiaru. Wyszło z tabeli, kiedy postawiłem obok siebie kolumnę „co czyta" i kolumnę „bez konta". Dwie kolumny, które w osobnych notatkach nie znaczyły nic.

## Kluczowe wnioski

Pięć reguł, każda kupiona pomyłką:

1. **Kontrolka negatywna waży więcej niż pomiar pozytywny.** Bez przebiegu, w którym wynik ma nie wystąpić, nie wiesz, skąd bierze się ten, który wystąpił.
2. **Pierwszy odczyt kłamie.** Systemy po drugiej stronie działają asynchronicznie, więc negatyw bez kontroli czasowej jest zdaniem o konkretnej minucie, nie o systemie.
3. **Mierz na własnym artefakcie.** Pomiar na cudzym pliku odpowiada na pytanie o cudzy plik, choćby procedura była identyczna.
4. **Szukaj mechanizmu, nie korelacji.** Korelacja opisuje przypadki, które zmierzyłeś. Dopiero mechanizm mówi cokolwiek o następnym.
5. **Zapisz, czego nie zmierzyłeś.** Puste pole w tabeli czyta się po miesiącu jako zero, także przez ciebie.

Żadna z nich nie jest nowa. Wszystkie znałem, zanim zacząłem. Trzy wnioski wycofałem mimo to, więc znajomość reguły i jej stosowanie to dwie różne rzeczy. Pomaga jedno: zapisywać przy każdym wyniku datę, wsad i kontrolkę, bo dopiero wtedy widać, którego z tych trzech elementów brakuje.

Środowisko, w którym ten pomiar powstał, opisałem w tekście [jak buduję AI OS dla dwóch firm](/blog/srodowisko-agentowe-ai-dwie-firmy). O tym, jak taki projekt prowadzi się z agentem na co dzień, piszę w [anatomii systemu agentów AI](/blog/system-agentow-ai-skills-rules-kontekst).

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Nie wiesz, czy Twój system robi to, co myślisz?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Różnica między „powinno działać" a „zmierzone" kosztuje najwięcej wtedy, gdy wychodzi późno. Pomogę Ci zaprojektować pomiar, przeprowadzić go z kontrolkami i zapisać wyniki tak, żeby dało się z nich korzystać za pół roku.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Przydatne zasoby

- [Weryfikator obrazu Qamera](https://qamera.ai/tools/verify-image) - odczyt oznaczeń dowolnego pliku w przeglądarce, bez zakładania konta.
- [Content Authenticity Verify](https://verify.contentauthenticity.org) - druga niezależna ścieżka odczytu manifestu, też bez konta.
- [Specyfikacja C2PA](https://spec.c2pa.org/specifications/specifications/2.1/index.html) - podstawa formatu manifestu i nazw akcji, na które powołuję się w tekście.
- [Co zostaje z oznaczenia zdjęcia na drodze do kupującego](https://qamera.ai/blog/co-zostaje-z-oznaczenia-zdjecia-na-drodze-do-kupujacego) - te same pomiary od strony sklepu: co z nich wynika dla karty produktu, feedu i kampanii.
- [Moje środowisko agentowe](/blog/srodowisko-agentowe-ai-dwie-firmy) - stos, w którym ten pomiar powstał.
- [Anatomia systemu agentów AI](/blog/system-agentow-ai-skills-rules-kontekst) - jak prowadzę projekty z agentem.
- [Zbudowałem drugi mózg, trafiłem w standard Google](/blog/okf-standard-przenosnosc-bazy-wiedzy-ai) - jak zapisuję ustalenia, żeby dało się je czytać za pół roku.

## FAQ

<details open>
<summary>

### Czym różni się oznaczenie postu na platformie od przeniesienia pochodzenia w samym pliku?

</summary>

To dwie różne obietnice i trzeba je mierzyć osobno. „Platforma oznacza post" znaczy, że widz zobaczy etykietę pod materiałem. „Platforma przekazuje pochodzenie dalej" znaczy, że plik pobrany z platformy nadal niesie manifest, więc ktoś z zewnątrz odtworzy z niego historię. Z czterech platform, które zmierzyłem, obie rzeczy dowozi jedna: druga oznacza post, ale serwuje plik zdjęty do zera.

</details>

<details open>
<summary>

### Dlaczego pierwszy odczyt po publikacji na platformie społecznościowej potrafi dać fałszywie negatywny wynik?

</summary>

Bo systemy po stronie platformy działają asynchronicznie i etykieta pojawia się z opóźnieniem. Sprawdziłem post kilkanaście minut po publikacji, nie zobaczyłem etykiety i zapisałem wniosek, że platforma nie czyta oznaczenia z pliku. Po dobie etykieta była, a wniosek trzeba było wycofać. Każdy negatyw powtarzaj po dobie, zanim wpiszesz go do tabeli.

</details>

<details open>
<summary>

### Po co w pomiarze kontrolka negatywna, skoro wynik pozytywny już pokazuje, że mechanizm działa?

</summary>

Wynik pozytywny pokazuje, że coś się dzieje, ale nie mówi, z czego to wynika. W moim pomiarze etykietę mógł postawić klasyfikator obrazu zamiast osadzonej deklaracji, i zarzut był realny, bo inne narzędzie rozpoznało tę samą treść z samych pikseli. Dopiero drugi przebieg na materiale pozbawionym wszystkich znaczników, który etykiety nie dostał, zamienił obserwację w dowód.

</details>

<details open>
<summary>

### Czy sklep internetowy kasuje metadane ze zdjęć produktowych i czy zależy to od silnika?

</summary>

Zależy od silnika i od progu, a różnice są duże. WooCommerce przepuszcza plik bajt w bajt poniżej progu 2560 px na dłuższej krawędzi, a powyżej podmienia go na wariant przeskalowany bez manifestu. PrestaShop zapisuje od nowa nawet plik, którego nie skaluje: te same wymiary, piąta część wagi, zero metadanych. Warstwy też zachowują się różnie, bo pakiet `XMP` przeżywa tam, gdzie manifest ginie.

</details>

<details open>
<summary>

### Jak sprawdzić, czy mój własny plik graficzny niesie oznaczenie o pochodzeniu z AI?

</summary>

Najprościej wrzucić plik do weryfikatora działającego w przeglądarce, na przykład [qamera.ai/tools/verify-image](https://qamera.ai/tools/verify-image) albo [verify.contentauthenticity.org](https://verify.contentauthenticity.org). Oba czytają manifest C2PA i pokazują, kto podpisał plik i jakie akcje zadeklarował. Pamiętaj o ograniczeniu: czytają wyłącznie warstwę metadanych, więc plik po rekompresji wyjdzie z nich jako nieoznaczony, nawet jeśli niesie znak wodny w pikselach.

</details>

<details open>
<summary>

### Czy te reguły pomiaru przydają się poza tematem oznaczania treści generowanych przez AI?

</summary>

Tak, bo żadna z nich nie mówi o metadanych. Kontrolka negatywna, kontrola czasowa negatywu, pomiar na własnym artefakcie, mechanizm zamiast korelacji i zapis luk działają tak samo przy testowaniu integracji, migracji danych i zachowań cudzego API. Wszędzie tam pytanie brzmi „skąd wiesz", a odpowiedzią jest odczyt z datą i kontrolką, a nie przekonanie o tym, jak system powinien działać.

</details>
