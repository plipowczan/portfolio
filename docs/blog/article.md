### **Dopracowane Notatki: Hackathon Hacknation – Analiza Doświadczeń**

#### **1. Kontekst i Atmosfera Wydarzenia**

* **Wydarzenie:** Hackathon Hacknation, organizowany przez GovTech Polska.
* **Cel:** Stworzenie w 24h działającego rozwiązania dla jednego z wyzwań administracji publicznej.
* **Skala:** Ponad 1500 uczestników, głównie programistów. Ogromny rozmach.
* **Pula nagród:** Łącznie 480 tys. zł, rozłożone na ok. 10 zadań (zwycięstwo w kategorii = 25 tys. zł).
* **Atmosfera i Energia:**
  * Opisana jako „niesamowita” i „robiąca ogromne wrażenie”.
  * Duża hala, open space, scena, ciągłe prelekcje i ogłoszenia.
  * Uczestnicy określani jako „zajarani technologią”, co tworzyło unikalny klimat. Energia miejsca była kluczowym motywatorem, który pozwalał działać mimo zmęczenia.

#### **2. Analiza Problemu: „Pani Zosia i Tysiące Exceli”**

* **Wyzwanie:** Proces budżetowania w administracji publicznej.
* **Core Problem:** Proces oparty na ręcznej wymianie setek tysięcy plików Excel, co prowadzi do chaosu informacyjnego i braku transparentności.
* **Anegdota (metafora procesu):**
    1. **Start (Dół):** „Pani Zosia” w urzędzie gminy „wróży z fusów”, ręcznie wpisując dane budżetowe do Excela (np. zapotrzebowanie na nowy komputer).
    2. **Eskalacja (Góra):** Plik wędruje w górę hierarchii (urząd miasta -> województwo -> Ministerstwo Finansów).
    3. **Konsolidacja:** Specjalna komórka w ministerstwie scala dane ze wszystkich plików.
    4. **Decyzja i Powrót (Dół):** Limity budżetowe wracają tą samą drogą, często z cięciami. W efekcie „Pani Zosia” dowiaduje się, że nie dostanie nowego komputera, bez jasnego uzasadnienia.

#### **3. Rozwiązanie Zespołu: Cyfrowy Budżet**

* **Koncepcja:** Prosta, scentralizowana aplikacja webowa, która zastępuje obieg plików Excel.
* **Kluczowe Funkcjonalności:**
  * **Jedno źródło prawdy:** Wszystkie pozycje budżetowe dodawane w jednym systemie.
  * **Transparentność i komunikacja:** Możliwość komentowania i dyskutowania nad każdą pozycją.
  * **Uproszczony proces:** Łatwe zatwierdzanie i konsolidacja budżetu na wyższych szczeblach.
* **Wybór zadania:** Zespół użył AI do przeanalizowania dostępnych wyzwań i wybrania tego, które najlepiej pasowało do ich kompetencji (zespół „nie-programistów”), aby zmaksymalizować szanse.

#### **4. Przebieg Pracy i Dynamika Zespołu**

* **Początek:** Burza mózgów, analiza materiałów, stworzenie mapy procesu na podstawie dostępnych dokumentów.
* **Zwrot akcji:** Początkowo praca „na żywioł”, każdy tworzył coś osobno. Ostatecznie zespół skonsolidował się wokół prototypu Justyny, który był najbardziej zaawansowany i stał się fundamentem dalszych prac.
* **Doświadczenie "ludzkie":**
  * **Zmęczenie:** Praca non-stop przez 24 godziny.
  * **Warunki:** Spanie przez 2-3 godziny na korytarzu lub w dedykowanej salce sypialnianej, gdzie „co chwilę komuś dzwonił budzik”.

#### **5. Technologia i Rola AI**

* **Główna teza:** Agenci AI byli „equalizerem”, który pozwolił zespołowi „emerytowanego programisty juniora” i osoby z mniejszym doświadczeniem koderskim konkurować z profesjonalnymi zespołami programistów.
* **Stack technologiczny:**
  * **Frontend:** React, TypeScript.
  * **Backend:** Supabase.
  * **Prezentacja:** Wideo stworzone w HiGen.
* **Narzędzia AI w użyciu:**
  * **Paweł i Kuba:** Antigravity (modele Gemini Pro / Claude 4.5). **Zużycie:** Cały tygodniowy limit tokenów w kilkanaście godzin.
  * **Justyna:** Bolt (model Claude Code). **Zużycie:** 18 milionów tokenów.

#### **6. Wyzwania i Kontrariańskie Spojrzenie na AI**

* **Największa Słabość Projektu – Brak Walidacji:**
  * Zespół nie miał dostępu do praktyka (rzeczywistego urzędnika), który mógłby zweryfikować ich założenia dotyczące procesu.
  * Mentor przypisany do zadania nie był ekspertem dziedzinowym, co uniemożliwiło walidację logiki aplikacji.
  * **Wniosek:** Istniało duże ryzyko, że rozwiązanie było „przestrzelone” i nie odpowiadało na realne potrzeby.
* **Realistyczna Ocena Modeli AI (Wątek Kontrariański):**
  * **Odczucie:** „Lekkie zawiedzenie” działaniem modeli.
  * **Konkretne problemy:**
    * AI często generowało kod, który nie działał.
    * Proponowane rozwiązania bywały „od czapy”, nieadekwatne do problemu.
    * Osiągnięcie poprawnego wyniku wymagało wielokrotnego, precyzyjnego promptowania i prowadzenia modelu „za rękę”.
  * **Przykład blokady:** Justyna napotkała błąd w kodzie (nieprawidłowe filtry `current user`), którego model AI nie był w stanie zdiagnozować. Problem wymagał ręcznego przeanalizowania kodu i znalezienia błędu.

#### **7. Wyniki i Kluczowe Wnioski (Lessons Learned)**

* **Wynik Końcowy:** 2.15 / 5 punktów. Zespół nie zakwalifikował się do finałowej trójki w swojej kategorii.
* **Główne Lekcje:**
    1. **Przygotowanie jest kluczowe:** Inne zespoły (np. twórcy aplikacji o Bydgoszczy) miały wcześniej przygotowane komponenty i frameworki. Podejście „na żywioł” jest znacznie trudniejsze i mniej efektywne.
    2. **Walidacja > Technologia:** Nawet najbardziej zaawansowane narzędzia AI nie zastąpią rozmowy z realnym użytkownikiem. Brak walidacji był fundamentalnym błędem.
    3. **AI to mnożnik siły, a nie magiczna różdżka:** Umożliwia szybkie prototypowanie i rywalizację, ale wciąż wymaga głębokiej wiedzy, umiejętności debugowania i krytycznego myślenia. Nie jest to w pełni autonomiczne narzędzie.

### Plan na kolejny hackaton

1. Wybór zadania
1. Zdefiniowanie zespołu - dla każdego członka zespołu zdefiniowanie jego roli w projekcie - mocnych i słabych stron
2. Dodanie treści zadań - scraping strony z zadaniami - podanie agentowi adresu strony i ocena zadań pod kątem zgodności z zespołem
3. Priorytetyzacja zadań - wstępna selekcja zadań do wyboru
 Wniosek: Ten etap mieliśmy dobrze zrealizowany - praktycznie nie traciliśmy czasu na wybór zadania bo od razu wiedzieliśmy mniej więcej jakie zadanie będziemy realizować.
2. Analiza biznesowa
1. Przygotowanie mapy obecnego procesu jeśli istnieje
2. Przygotowanie mapy docelowego procesu
3. Spisanie wymagań funkcjonalnych i niefunkcjonalnych (user stories)
4. Przygotowanie specyfikacji wymagań (SRS – Software Requirements Specification)
5. Przygotowanie wymagań produktu PRD
  Praktycznie:

* PRD﻿ odpowiada na: „Co budujemy i dlaczego? Dla kogo? Jakie ma mieć możliwości?﻿” – poziom produktu i biznesu.
* SRS﻿ odpowiada na: „Jaki dokładnie system trzeba zbudować, żeby ten produkt dowieźć? Jakie są wymagania systemowe, interfejsy, jakości?

 6. Przygotowanie reguł i skili dla AI lub wybór już posiadanych skili
 3. Development
 1. Wybranie/wygenerowanie boilerplate - można już mieć taki kod bazowy przygotowany takie niezbędne minimum jakie narzędzie powinno mieć - taki punkt wyjścia od dalszego developmentu
 2. Uruchomienie developmentu wymagania funkcjonalnego
 3. Testy manualne
 4. Wygenerowanie testów automatycznych
 5. Review kodu
 6. Commit
 7. Powrót do punktu 2
    Czy można zrównoleglić proces dodawania wymagań funkcjonalnych? - Pewnie tak tylko trzeba podzielić wymagania funkcjonalne na takie które sa od siebie niezależne, wymaga to też pewnego ułożenia wymagań i to dużo zależy od zależności między wymaganiami funkcjonalnymi
 4. Przygotowanie dokumentacji - opcjonalnie?
 5. Review pod kątem bezpieczeństwa i performance

### Dodatkowe wnioski

1. Dobrze zarządzać agentami - jakimi? Czy korzystać z wbudowanych? Da się ich jakoś spromptować? Może trzeba przygotować dokumenty z promptami tak żeby sprofilować agenta do danego typu zadania.
2. Skorzystannie ze skili Claude Code - w jaki sposób
3. Przygotować boilerplate
4. Przygotować plan działania krok po kroku (na podstawie wstępnego projektu)
5. Na podstawie treści zadania przygotować wstępny projekt
