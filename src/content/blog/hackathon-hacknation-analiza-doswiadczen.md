---
id: 7
slug: hackathon-hacknation-analiza-doswiadczen
title: Hackathon Hacknation – Analiza Doświadczeń i Lekcja z Cyfryzacji
excerpt: Zobacz jak w 24h zespół nieprogramistów z pomocą AI stworzył działający system budżetowy i dlaczego technologia to nie wszystko. Szczera analiza sukcesów i porażek z Hacknation.
category: AI
author: Pawel Lipowczan
date: 2025-12-12
readTime: 10 min
image: /images/og-hackathon-hacknation-analiza-doswiadczen.webp
tags:
  - Hackathon
  - AI
  - GovTech
  - Case Study
  - Digitalizacja
---

# Hackathon Hacknation – Analiza Doświadczeń i Lekcja z Cyfryzacji

Hackathon Hacknation, organizowany przez GovTech Polska, to wydarzenie o ogromnym rozmachu. Ponad 1500 uczestników, 480 tysięcy złotych w puli nagród i jeden cel: stworzyć w 24 godziny działające rozwiązanie dla wyzwań administracji publicznej.

Dla naszego zespołu – który określiłbym mianem programistów juniorów – był to nie tylko rywalizacja, ale przede wszystkim poligon doświadczalny.

Jestem "emerytowanym" programistą. Porzuciłem aktywne programowanie około 4 lata temu, co w świecie technologii to niemal lata świetlne – narzędzia i frameworki zmieniły się na tyle, że trzeba w pewnym sensie zaczynać od zera. Choć doświadczenie w inżynierii oprogramowania jest bardzo pomocne, to bez znajomości współczesnych języków i środowisk czasami działa się po omacku.

Pozostali członkowie zespołu nigdy nie mieli zbyt wiele wspólnego z tradycyjnym programowaniem. Na co dzień wykorzystują technologie nocode wspierane przez modele językowe.

![Zespół Hacknation](/images/hacknation-team.webp)

Wspólnie zderzyliśmy nasze wyobrażenia o „inteligentnych" agentach sztucznej inteligencji z twardą rzeczywistością.

Oto historia o tym, jak technologia spotkała się z biurokracją, dlaczego brak walidacji może zabić najlepszy projekt i czego nauczyliśmy się o współpracy z AI pod presją czasu.

## 1. Pani Zosia i Tysiące Exceli – Analiza Problemu

Nasze zadanie dotyczyło procesu budżetowania w administracji publicznej. Brzmi nudno? Może, ale skala problemu jest ogromna.

Core problemem okazał się proces oparty na ręcznej wymianie setek tysięcy plików Excel. Błędy, chaos informacyjny, brak transparentności – to codzienność urzędników. Stworzyliśmy metaforę tego procesu, którą nazwaliśmy **„Pani Zosia i Tysiące Exceli”**:

1. **Start (Dół):** „Pani Zosia” w urzędzie gminy „wróży z fusów”, ręcznie wpisując dane budżetowe do Excela (np. zapotrzebowanie na nowy komputer).
2. **Eskalacja (Góra):** Plik wędruje w górę hierarchii: Urząd Miasta → Województwo → Ministerstwo Finansów.
3. **Konsolidacja:** Specjalna komórka w ministerstwie scala dane ze wszystkich plików (często ręcznie!).
4. **Decyzja i Powrót (Dół):** Limity budżetowe wracają tą samą drogą, często z arbitralnymi cięciami. W efekcie „Pani Zosia” dowiaduje się, że nie dostanie nowego komputera, ale nikt nie potrafi jej wyjaśnić dlaczego.

## 2. Rozwiązanie: Cyfrowy Budżet

Postawiliśmy na proste, ale radykalne rozwiązanie: **Cyfrowy Budżet**. Zamiast przesyłać pliki, przenieśmy cały proces do chmury.

Nasza koncepcja opierała się na scentralizowanej aplikacji webowej z kilkoma kluczowymi funkcjonalnościami:

* **Jedno źródło prawdy:** Wszystkie pozycje budżetowe są dodawane w jednym systemie, widocznym (z odpowiednimi uprawnieniami) dla każdego szczebla.
* **Transparentność i komunikacja:** Możliwość komentowania i dyskutowania nad każdą pozycją budżetową bezpośrednio w systemie, zamiast w mailach.
* **Workflow akceptacji:** Uproszczony proces zatwierdzania i konsolidacji budżetu.

Co ciekawe, do wyboru samego zadania również zatrudniliśmy AI. Przeanalizowaliśmy dostępne wyzwania pod kątem kompetencji naszego zespołu (głównie „nie-programistów”), aby zmaksymalizować nasze szanse. Wybór padł na budżetowanie, gdzie zrozumienie procesu biznesowego wydawało się ważniejsze niż skomplikowane algorytmy.

## 3. Atmosfera, Pot i Brak Snu

![Zakończenie Hackathonu](/images/hacknation-end.webp)

Atmosfera na Hacknation była niesamowita. Wielka hala, open space, scena, ciągłe prelekcje – energia tysiąca ludzi "zajaranych technologią" udzielała się każdemu. To właśnie ten klimat pozwalał nam działać, mimo że zmęczenie narastało z każdą godziną.

<video controls width="100%" style="max-width: 100%; height: auto;" playsinline>
  <source src="/videos/hacknation-start.mp4" type="video/mp4" />
  Twoja przeglądarka nie obsługuje odtwarzacza wideo.
</video>

Praca trwała non-stop przez 24 godziny. Spaliśmy po 2-3 godziny na korytarzu lub w dedykowanej sali sypialnianej, gdzie co chwilę kogoś budził alarm telefonu.

Początkowo każdy z nas rzucił się do pracy "na żywioł", tworząc własne kawałki kodu. Szybko jednak zrozumieliśmy, że to droga donikąd. Zwrot akcji nastąpił, gdy zdecydowaliśmy się skonsolidować siły wokół prototypu Justyny, który był najbardziej zaawansowany. Stał się on fundamentem naszego finalnego rozwiązania.

## 4. AI jako "Equalizer" – Technologia w Praktyce

Główna teza, którą chcieliśmy sprawdzić, brzmiała: **AI to equalizer**. Narzędzie, które pozwala zespołowi z mniejszym doświadczeniem koderskim (nieprogramistom) konkurować z profesjonalnymi dev teamami.

Nasz stack technologiczny:

* **Frontend:** React, TypeScript
* **Backend:** Supabase
* **Prezentacja:** Wideo wygenerowane w HiGen

Używaliśmy ciężkiej artylerii AI:

* **Paweł i Kuba:** Antigravity (modele Gemini Pro / Claude 4.5). Zużyliśmy cały tygodniowy limit tokenów w kilkanaście godzin.
* **Justyna:** Bolt (model Claude Code). Rekordowe zużycie **18 milionów tokenów**.

### Kontrariańskie spojrzenie na AI

Czy AI napisało aplikację za nas? Nie do końca. Mimo entuzjazmu, czuliśmy lekkie zawiedzenie.

* **Kod często nie działał:** AI generowało rozwiązania, które wyglądały poprawnie, ale sypały się przy uruchomieniu.
* **Halucynacje:** Proponowane biblioteki nie istniały, a fragmenty logiki były "od czapy".
* **Potrzeba prowadzenia za rękę:** Osiągnięcie poprawnego wyniku wymagało precyzyjnego promptowania i ciągłego korygowania kursu.
* **Blokady:** Justyna napotkała błąd w filtrach _current user_, którego model nie potrafił zdiagnozować. Musieliśmy wrócić do korzeni – czytać kod i debugować ręcznie.

AI to potężny mnożnik siły, ale nie magiczna różdżka. Bez umiejętności technicznych i krytycznego myślenia utknęlibyśmy w połowie drogi.

## 5. Największa Słabość – Brak Walidacji

Nasz wynik końcowy to **2.15 / 5 punktów**. Nie weszliśmy do finału. Dlaczego?

Technologia działała. Prezentacja była świetna. Zabrakło jednego, kluczowego elementu: **WALIDACJI**.

Zespół nie miał dostępu do praktyka – urzędnika, który na co dzień pracuje z budżetem. Mentor przypisany do zadania nie był ekspertem dziedzinowym. W efekcie stworzyliśmy system, który nam wydawał się logiczny, ale mógł być kompletnie oderwany od realiów administracji („przestrzelony”).

To najważniejsza lekcja: **Walidacja > Technologia**. Nawet najlepszy kod nie obroni rozwiązania, które nie odpowiada na realne potrzeby użytkownika.

## 6. Plan na Kolejny Hackathon

Nauczeni doświadczeniem, przygotowaliśmy ulepszony proces na przyszłość:

### 1. Wybór zadania

* Zdefiniowanie ról w zespole (mocne/słabe strony).
* Scraping zadań i analiza przez agenta AI pod kątem dopasowania do zespołu.
* _Wniosek:_ Ten etap mieliśmy opanowany dobrze.

### 2. Analiza biznesowa (Tutaj polegliśmy!)

* Przygotowanie mapy obecnego procesu (AS-IS).
* Projekt procesu docelowego (TO-BE).
* Spisanie User Stories.
* **PRD (Product Requirements Document):** Co budujemy i dlaczego?
* **SRS (Software Requirements Specification):** Jak to zbudujemy?
* Przygotowanie "skilli" dla agentów AI.

### 3. Development

* Start z przygotowanym boilerplate'm (nie trać czasu na setup!).
* Iteracyjny development wymagań funkcjonalnych.
* Generowanie testów automatycznych przez AI.
* Ciągłe Code Review.

### 4. Dokumentacja i Weryfikacja

* Review pod kątem bezpieczeństwa i wydajności.
* Przygotowanie dokumentacji (opcjonalnie).

## Podsumowanie i Wnioski

Hacknation był dla nas bezcenną lekcją. Potwierdził, że AI pozwala robić rzeczy niemożliwe jeszcze rok temu – mały zespół w 24h stworzył działającą aplikację webową. Jednocześnie obnażył brutalną prawdę: w świecie produktu **technologia jest wtórna wobec zrozumienia problemu**.

Inne zespoły, które przyszły z gotowymi komponentami i lepiej odrobiły pracę domową z analizy biznesowej, wygrały. Podejście "na żywioł" jest romantyczne, ale w starciu z przygotowaniem – przegrywa.

AI to przyszłość programowania, ale to człowiek wciąż musi być pilotem, który wie, dokąd leci.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz wdrożyć AI w swojej organizacji?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci znaleźć realne zastosowania AI w Twoim biznesie, uniknąć popularnych pułapek i wdrożyć rozwiązania, które przynoszą mierzalne rezultaty. Od koncepcji przez prototyp po produkcję.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
