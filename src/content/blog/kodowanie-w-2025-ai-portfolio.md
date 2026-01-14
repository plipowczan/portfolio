---
id: 9
slug: kodowanie-w-2025-ai-portfolio
title: "Kodowanie w 2025: Czy AI zbudowało moje portfolio? Case Study pawel.lipowczan.pl"
excerpt: "Czy w 2025 roku programowanie się kończy? Zbudowałem portfolio pawel.lipowczan.pl jako poligon doświadczalny współpracy z AI. Wnioski? AI to junior developer na sterydach, ale fundamenty inżynierskie są niezbędne."
category: AI
author: Pawel Lipowczan
date: "2025-12-02"
readTime: 8 min
image: /images/kodowanie-w-2025-hero.webp
tags:
  - AI
  - Portfolio
  - React
  - Vite
  - Case Study
---

Często słyszę, że programowanie się kończy. Że wystarczy „zvibecodować” aplikację w jednym z nowych narzędzi no-code, a AI zrobi resztę. Postanowiłem to sprawdzić na żywym organizmie.

Zbudowałem [pawel.lipowczan.pl](https://pawel.lipowczan.pl) – projekt, który miał być wizytówką, a stał się poligonem doświadczalnym dla współpracy na linii Doświadczony Inżynier – Agent AI.

Wnioski? Jeśli myślisz, że zbudujesz profesjonalny, bezpieczny i skalowalny serwis bez wiedzy technicznej, tylko „rozmawiając” z chatbotem – jesteś w błędzie. Ale jeśli masz fundamenty inżynierskie i potraktujesz AI jako junior developera na sterydach, efekty (i koszty) mogą Cię zaskoczyć.

Oto kulisy powstawania mojego portfolio w stacku React + Vite + Tailwind.

![hero](/images/hero.webp)

## 1. Fundament: Nowoczesny stack i SEO w świecie SPA

Mój cel był prosty: wyjście poza ramy statycznego CV. Chciałem estetyki, wydajności i miejsca na dzielenie się wiedzą. Wybór padł na **React 18 + Vite**.

Dlaczego? Bo Vite zapewnia błyskawiczny build. Jednak React to zazwyczaj Single Page Application (SPA), co bywa problematyczne dla SEO. Tutaj wchodzi inżynieria. Zastosowałem mechanizm **prerenderingu**. Mimo że pod maską działa React i Tailwind CSS, serwujemy robotom statyczne pliki HTML.

Efekt?
Strona jest błyskawiczna, a Google widzi ją tak, jak klasyczny dokument. Całość hostuję na **Vercel**, co okazało się strzałem w dziesiątkę. Wbudowana analityka i analiza Core Web Vitals pozwoliły mi wykręcić „zielone wyniki” niemal od razu po deployu.

![speed_insights](/images/speed_insights.webp)

![web_analytics](/images/web_analytics.webp)

## 2. Design dla nie-designera: Koniec z „wodotryskami” metodą prób i błędów

Bądźmy szczerzy: nie jestem designerem. Zawsze miałem problem z doborem palety barw, ułożeniem elementów czy animacjami. W tradycyjnym modelu spędziłbym godziny na przesuwaniu pikseli w CSS.

Tutaj ten problem zniknęł.
Mogłem wskazać AI przykłady stron, które mi się podobają, a agent adaptował ten styl do mojego projektu. Zamiast eksperymentować z kodem CSS, wskazywałem w IDE miejsce do poprawy, a AI korygowało layout w sekundy.

**Lovable vs. IDE**
Eksperymentowałem z różnymi narzędziami do „vibe codingu”, m.in. z Lovable, Vercel czy Firebase Studio. Lovable dawało świetne efekty wizualne, ale finalnie zdecydowałem się na generowanie kodu bezpośrednio w IDE (Cursor). Dlaczego? Bo zależało mi na pełnej kontroli i nowoczesnym, schludnym efekcie końcowym, który jest „moim” kodem, a nie zamkniętą czarną skrzynką.

## 3. Grafika: Spójność ponad perfekcję

W idealnym świecie każdy projekt w portfolio byłby opatrzony dedykowanymi zrzutami ekranu z konkretnych narzędzi i procesów. Ale przygotowanie setek takich screenów to tytaniczna praca.

Zastosowałem podejście: **Done is better than perfect.**
Zamiast tracić czas na robienie zrzutów czy szukanie zdjęć stockowych, postawiłem na grafikę generatywną.
*   Wykorzystałem **Nano Banana MCP**.
*   Ja dostarczam treść, agent generuje grafikę, a skrypt (konwerter) automatycznie zamienia PNG na WebP.

Dzięki temu strona jest spójna wizualnie, utrzymana w klimacie tech/cyber, a ja nie muszę martwić się o "dziury" w contencie.

![og-zapier-vs-make-vs-n8n-wybor-narzedzia](/images/og-zapier-vs-make-vs-n8n-wybor-narzedzia.webp)

## 4. Rzeczywistość: Doświadczenie vs Nowe Frameworki

Mam 15 lat doświadczenia w IT (.NET, Python, JS), ale frameworki takie jak React czy Vite były dla mnie nowością. Musiałem się ich poduczyć.

I tu kluczowa uwaga: **Wiedza programistyczna jest niezbędna.**
Dzięki doświadczeniu w projektowaniu systemów, kod generowany przez AI jest dla mnie zrozumiały. Potrafię ocenić jego poprawność, zanim trafi na produkcję. Bez tego utonąłbym w błędach.
*   Agenci (nawet Claude Sonnet 4.5 czy Gemini 3 Pro) potrafią się zapętlić.
*   Zdarzają się halucynacje nieistniejących bibliotek.

Gdybym nie rozumiał fundamentów, nie byłbym w stanie „odkręcić” błędów, które AI wprowadzało przy bardziej skomplikowanej logice.

### Pedantyzm w kodzie
Jestem pedantyczny, jeśli chodzi o porządek w plikach (Clean Code). Jasna struktura folderów i podział odpowiedzialności to dla mnie świętość. AI ma tendencję do wrzucania wszystkiego do jednego worka. Moja rola polegała na wymuszaniu tej struktury. Dzięki temu projekt jest łatwy w utrzymaniu i reorganizacji, a nie jest „spaghetti kodem” wyplutym przez maszynę.

## 5. Polisa ubezpieczeniowa: Testy i Code Review Agent

W projekcie hobbystycznym łatwo o chaos. Aby temu zapobiec, wdrożyłem dwa poziomy zabezpieczeń:

1.  **Bogate testy E2E (Playwright):** Każda zmiana jest weryfikowana przez automatyczne testy. Mam pewność, że nowa funkcja nie „rozsypała” starej.
2.  **Code Review Agent w Cursor.sh:** To genialna funkcja. Agent analizuje zmiany w ostatnim commicie *przed* wysłaniem do repozytorium. Wyłapał mi sporo błędów logicznych i potencjalnych problemów, które mogłem przeoczyć.

![playwright_report](/images/playwright_report.webp)

## 6. Koszty: Ile kosztuje „darmowy” programista?

To ciekawe zestawienie. Przez cały projekt przepuściłem około **60 milionów tokenów**.
Rozkład wejście/wyjście to mniej więcej 80/20.

Gdybym płacił cennikowo za API (np. Claude Sonnet 4.5 – $3 input / $15 output), koszt wyniósłby około **325 USD**.

Realny koszt?
*   Plan PRO+ w Cursor.sh: **60 USD**.
*   Antigravity (w ramach Google Workspace): **0 USD** (wliczone w pakiet firmowy).

Oszczędność jest kolosalna. Oczywiście są limity – przy intensywnej sesji zdarzało mi się zobaczyć komunikat o ich przekroczeniu. Wtedy po prostu zmieniałem model (skaczę między Gemini 3 Pro High a Claude Sonnet 4.5). Limity odnawiają się co kilka godzin, więc przy regularnej pracy nie stanowi to blokady.

![cursor_usage](/images/cursor_usage.webp)

## Podsumowanie

Projekt [pawel.lipowczan.pl](https://pawel.lipowczan.pl) to dowód na to, że w 2025 roku rola programisty ewoluuje. Przestajemy być rzemieślnikami od składni, a stajemy się architektami zarządzającymi zespołem cyfrowych agentów.

Możesz nie być designerem. Możesz nie znać na wylot najnowszego frameworka. Ale jeśli masz inżynierski umysł, dbałość o jakość (i testy!) oraz umiejętność orkiestracji AI – zbudujesz rzeczy, które wcześniej wymagałyby całego zespołu.

Zapraszam do sprawdzenia efektów i code review! Feedback mile widziany.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Potrzebujesz wsparcia w rozwoju produktu z AI?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci w wyborze technologii, projektowaniu architektury i wdrożeniu najlepszych praktyk. Od MVP przez skalowanie po optymalizację procesów deweloperskich z wykorzystaniem AI.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
