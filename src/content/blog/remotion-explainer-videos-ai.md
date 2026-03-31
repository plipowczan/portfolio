---
id: 18
slug: remotion-explainer-videos-ai
title: "Remotion + AI: Jak tworzyć profesjonalne wideo za pomocą kodu i Claude"
excerpt: "Stworzyłem 45-sekundowy explainer video w kilka minut. Bez Adobe, bez Canva - tylko React, Remotion i Claude Code. Zobacz jak."
category: AI
author: Pawel Lipowczan
date: 2026-01-31
readTime: 11 min
image: /images/og-remotion-explainer-videos-ai.webp
tags:
  - AI
  - Remotion
  - Video
  - Automatyzacja
  - Claude Code
lang: pl
alternateSlug: remotion-explainer-videos-ai
---

# Remotion + AI: Jak tworzyć profesjonalne wideo za pomocą kodu i Claude

Profesjonalne wideo za tysiące złotych? A może w kilka minut i za darmo?

Z własnego doświadczenia wiem, że produkcja wideo marketingowego to jedna z najbardziej frustrujących części prowadzenia biznesu. Albo płacisz studiu produkcyjnemu, albo spędzasz tygodnie ucząc się After Effects. Albo po prostu rezygnujesz.

Ja wybrałem inną drogę. Stworzyłem **45-sekundowy explainer video** dla mojej strony konsultingowej w kilka minut. Bez Adobe, bez Canvy, bez wiedzy o animacji. Tylko React, **Remotion** i **Claude Code**.

Efekt możesz zobaczyć na [konsultacje.lipowczan.pl/explainer](https://konsultacje.lipowczan.pl/explainer).

Tradycyjnie tworzenie explainera wygląda tak: wymyślasz koncepcję, piszesz scenariusz, tworzysz storyboard, projektujesz grafiki, animujesz każdy element frame-by-frame, eksportujesz, poprawiasz, eksportujesz znowu. Minimum kilka dni pracy. Realnie - tygodnie.

Moja metoda? Opisuję co chcę zobaczyć, AI generuje kod, renderuję wideo. Całość w czasie lunchu.

W tym artykule pokażę Ci kompletny workflow - od instalacji przez pisanie promptów po eksport gotowego wideo. Jeśli prowadzisz biznes i potrzebujesz wideo marketingowego, ale nie masz budżetu na studio produkcyjne ani czasu na naukę narzędzi - ten przewodnik jest dla Ciebie.

## Co to jest Remotion?

**Remotion** to biblioteka do tworzenia wideo w React. Zamiast przeciągać elementy na timeline jak w Premiere, opisujesz je kodem. Zamiast animować ręcznie, definiujesz reguły - a Remotion generuje płynne przejścia.

Brzmi technicznie? W praktyce to prostsze niż tradycyjna edycja wideo.

```text
Tradycyjne podejście: Pomysł → Storyboard → Nagranie → Edycja → Eksport (dni/tygodnie)
Remotion + AI: Pomysł → Prompt → Kod → Renderowanie (minuty)
```

Różnica jest fundamentalna. W tradycyjnych narzędziach mówisz **jak** animować każdą klatkę. W Remotion opisujesz **co** chcesz zobaczyć - narzędzie samo oblicza interpolację, timing i przejścia.

Co więcej, wszystko jest **programowalne**. Chcesz zmienić kolor brandowy? Jedna zmienna. Chcesz wygenerować 50 wersji wideo z różnymi nazwami produktów? Loop w JavaScript. Chcesz dodać dynamiczne dane z API? Import i render.

To idealne narzędzie dla podejścia **vibe coding**, które opisywałem [w osobnym artykule](/blog/vibe-coding-przewodnik). Nie musisz być ekspertem od React - wystarczy opisać co chcesz, a AI wygeneruje działający kod.

Remotion jest open-source i darmowy do użytku osobistego. Płatna licencja wymagana tylko dla firm z przychodami powyżej $1M rocznie - czyli prawdopodobnie nie musisz się tym przejmować.

## Zobacz efekt: Przykładowy explainer

Zanim przejdziemy do instalacji, zobacz co możesz stworzyć. To wideo wygenerowałem w kilka minut używając Claude Code i Remotion:

<video controls width="100%" style="max-width: 100%; height: auto;" playsinline>
  <source src="/videos/remotion-explainer.mp4" type="video/mp4" />
  Twoja przeglądarka nie obsługuje odtwarzacza wideo.
</video>

### Prompt użyty do stworzenia

Oto dokładny prompt, którym opisałem wideo:

```markdown
Stwórz 45-sekundowe explainer video o tworzeniu wideo z Remotion i AI.

**Sceny:**

1. (0-8s) **Problem**
   - Tekst "Profesjonalne wideo?" z efektem glitch
   - Pod spodem animowane ikony: zegar + znak dolara + znak zapytania
   - Fade out do ciemności

2. (8-16s) **Tradycyjne podejście (przekreślone)**
   - Pozioma timeline z ikonami: Pomysł → Storyboard → Edycja → Export
   - Czerwona linia przekreśla całość
   - Tekst "Tygodnie pracy" zanika

3. (16-28s) **Nowe podejście - hero moment**
   - Duży napis "Remotion + AI" z gradient glow (#00ff9d → #00b8ff)
   - Trzy animowane karty wlatują od dołu (staggered, 0.3s delay):
     - "React" z ikoną
     - "Remotion" z ikoną wideo
     - "Claude Code" z ikoną AI
   - Subtelny particle effect w tle

4. (28-38s) **Workflow demo**
   - Symulacja terminala z kodem (font: Fira Code)
   - Typing animation: `npx remotion render...`
   - Progress bar 0% → 100%
   - Tekst "45 sekund → Gotowe wideo" z pulsującym glow

5. (38-45s) **CTA**
   - Logo/tekst "pawel.lipowczan.pl" z gradient underline
   - Tekst "Więcej na blogu" fade in
   - Subtelna animacja network mesh w tle

**Styl wizualny:**

- Dark mode, tło: #0a0e1a
- Primary accent: #00ff9d (gradient do #00b8ff)
- Glassmorphism na kartach (backdrop-blur, border-white/10)
- Typography: Inter (headers), Fira Code (kod)
- Animacje: smooth easing, spring physics dla wejść elementów

**Format:** 16:9 (1920x1080)
**Tempo:** Dynamiczne, tech-forward
**Muzyka:** Brak (opcjonalnie ambient synth loop)

**Brand colors (hex):**

- Primary: #00ff9d
- Secondary: #00b8ff
- Background: #0a0e1a
- Dark surface: #151b2b
- Text: #ffffff
- Muted text: #9ca3af
```

Widzisz jak szczegółowy jest prompt? Każda scena ma timing, opis elementów i efektów. To klucz do dobrych wyników.

### Ważna uwaga: Używaj skilla explicite

Podczas testowania zauważyłem istotny szczegół. Gdy wysłałem prompt bez jawnego wskazania skilla `remotion-best-practices`, Claude zaczął skanować całe repozytorium i przygotowywać zbędny plan. Dopiero gdy explicite wywołałem skill (`/remotion-best-practices`), Claude od razu zaczął poprawnie budować projekt z animacjami.

**Wniosek:** Jeśli masz zainstalowany skill Remotion, zawsze uruchamiaj go świadomie zamiast liczyć na automatyczne wykrycie kontekstu.

### Komendy do pracy z Remotion

Po wygenerowaniu kodu masz trzy opcje:

| Komenda             | Co robi                                                  |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Uruchamia Remotion Studio - podgląd na żywo z hot reload |
| `npm run build`     | Renderuje wideo do MP4 (domyślnie out/video.mp4)         |
| `npm run build:gif` | Renderuje animowany GIF (mniejszy plik, niższa jakość)   |

Remotion Studio to najlepszy sposób na iterację - widzisz zmiany natychmiast i możesz scrubować timeline.

## Instalacja i pierwsze kroki

Zanim zaczniesz, potrzebujesz **Claude Code** (CLI Anthropica) lub **Claude Desktop z MCP**. Jeśli jeszcze nie masz skonfigurowanego środowiska, zajrzyj do mojego artykułu o [5 technikach pracy z Claude Code](/blog/5-technik-pracy-z-claude-code).

Instalacja składa się z dwóch kroków. Najpierw tworzysz projekt Remotion:

```bash
npx create-video@latest
```

To standardowa komenda Remotion, która tworzy nowy projekt z całą strukturą plików - komponenty React, konfigurację i przykładowe wideo.

Następnie instalujesz skill dla Claude Code:

```bash
npx skills add remotion-dev/skills
```

Co się dzieje podczas instalacji? **Skills** to rozszerzenia Claude Code, które dodają specjalistyczną wiedzę. Skill `remotion-best-practices` uczy AI najlepszych praktyk tworzenia animacji w Remotion - struktury komponentów, timing, interpolacji i eksportu.

Jak to działa w praktyce? Po prostu opisujesz wideo, które chcesz stworzyć. Claude automatycznie rozpoznaje kontekst Remotion i wykorzystuje wiedzę ze skilla do wygenerowania kodu. Nie ma specjalnych komend do zapamiętania - piszesz prompt naturalnym językiem.

Przykładowy workflow:

```text
1. Otwórz projekt Remotion w Claude Code
2. Opisz wideo: "Stwórz 30-sekundową animację logo z efektem glow"
3. Claude generuje komponenty React z animacjami
4. Uruchom podgląd: npx remotion studio
5. Wyrenderuj: npx remotion render src/index.ts MyVideo out/video.mp4
```

**Ważne:** Nie musisz znać React na zaawansowanym poziomie. Wystarczy podstawowe zrozumienie komponentów i props. Resztę zrobi AI. W praktyce moje prompty nie zawierają ani linijki kodu - opisuję tylko efekt wizualny.

## Prompt engineering dla wideo

Tu zaczyna się właściwa praca. Jakość wideo zależy bezpośrednio od jakości promptu. AI nie czyta w myślach - potrzebuje konkretnych instrukcji.

### Anatomia dobrego promptu

Każdy dobry prompt do wideo zawiera cztery elementy:

1. **Podział na sceny z timingiem** - AI musi wiedzieć co dzieje się w której sekundzie
2. **Styl wizualny** - kolory, nastrój, estetyka
3. **Brand assets** - konkretne wartości hex, nie "zielony"
4. **Format i przeznaczenie** - 16:9 dla YouTube, 9:16 dla Stories

Przykład strukturalnego promptu:

```markdown
Stwórz 45-sekundowe video explainer dla strony konsultingowej.

**Sceny:**

1. (0-10s) Logo animacja z gradientem #00ff9d → #00cc7d
2. (10-25s) 3 główne usługi jako animowane karty
3. (25-40s) Testimonial lub statystyka
4. (40-45s) CTA z kontaktowym przyciskiem

**Styl:** Profesjonalny, minimalistyczny, dark mode
**Format:** 16:9 (YouTube/website)
**Tempo:** Spokojne, business-oriented
```

Widzisz różnicę między "zrób ładne wideo o mojej firmie" a tym promptem? Pierwszy da losowe wyniki. Drugi da dokładnie to, czego potrzebujesz.

### Szablon promptu Pawła

Ten prompt użyłem do stworzenia explainera dla mojej strony. Możesz go skopiować i dostosować:

```markdown
For the current project create a 45-second explainer video based on the content.

The video should:

- Extract and use the brand colors from the site
- Highlight the main services/products
- Include key selling points
- Use professional, elegant animations
- End with a clear call-to-action

Aspect ratio: 16:9
Style: PROFESSIONAL
```

Ten prompt działa szczególnie dobrze, gdy masz już stronę lub design system. Claude Code analizuje kontekst projektu i wyciąga kolory, typografię i styl z istniejących plików.

Kluczowe frazy, które pomagają:

- **"Extract from site"** - AI przeszuka projekt i użyje istniejących wartości
- **"Professional, elegant"** - vibe descriptors są skuteczniejsze niż szczegółowe instrukcje
- **"Clear call-to-action"** - AI wie, że końcówka ma skłaniać do działania

## Przypadki użycia

Remotion + AI to nie tylko explainery. Oto praktyczne zastosowania, które przetestowałem lub widziałem w akcji.

### Dla przedsiębiorców i konsultantów

**Explainer videos** - krótkie wideo wyjaśniające usługę. Idealne na landing page, gdzie 30-60 sekund animacji może zastąpić paragraf tekstu.

**Product demos** - pokaż jak działa Twój produkt bez nagrywania ekranu. Animowane mockupy wyglądają profesjonalniej i nie starzeją się przy każdej aktualizacji UI.

**Case study visualizations** - zamiast nudnej prezentacji PowerPoint, animuj statystyki i wykresy. "Revenue increased 340%" ma większy impact jako animacja niż jako bullet point.

### Dla twórców treści

**Animated title sequences** - intro do YouTube videos. Zamiast kupować template na Envato, wygenerujesz unikalny opener pasujący do Twojego brandu.

**Lower thirds** - napisy z imieniem i tytułem. Raz wygenerowane, możesz używać wielokrotnie z różnymi danymi.

**Social media content** - Stories i Reels w formacie 9:16. Remotion renderuje w dowolnym aspect ratio.

### Dla SaaS i produktów

**Feature announcements** - nowa funkcja zasługuje na więcej niż post na blogu. 15-sekundowy teaser wygląda profesjonalnie i generuje zaangażowanie.

```markdown
Stwórz 15-sekundowy teaser nowej funkcji dla LinkedIn.

Scena 1: Nazwa funkcji jako duży napis z glow effect
Scena 2: 3 bullet points z korzyściami (staggered animation)
Scena 3: "Już dostępne" z logo produktu

Format: 1:1 (LinkedIn feed)
Kolory: Paleta produktu (#1a1a2e, #16213e, #0f3460, #e94560)
```

**Onboarding videos** - krótkie animacje wyjaśniające kolejne kroki. Łatwiejsze w aktualizacji niż nagrania z lektorem.

**Release notes as video** - changelog w formie animowanej listy. Użytkownicy chętniej obejrzą 30-sekundowe wideo niż przeczytają listę zmian.

## Wskazówki dla lepszych wyników

Po kilkunastu projektach wideo z AI zebrałem zestaw praktyk, które konsekwentnie poprawiają wyniki.

1. **Zawsze podawaj timing** - AI domyślnie robi za długie sceny. Bez konkretnych sekund dostaniesz 3-minutowe wideo zamiast 45-sekundowego.
2. **Opisuj brand assets konkretnie** - kolory hex (#00ff9d), nie "zielony". AI interpretuje "niebieski" na 50 różnych sposobów.
3. **Używaj "vibe" opisów** - "Apple-like minimalism" jest bardziej skuteczne niż szczegółowe instrukcje o kerning i leading. AI zna estetykę topowych brandów.
4. **Iteruj małymi krokami** - jedno wideo, jedna zmiana. Nie próbuj naprawiać wszystkiego jednym promptem. "Make the logo animation faster" > "Fix the video".
5. **Testuj różne formaty** - 16:9 ≠ 9:16 w strukturze treści. Pionowe wideo wymaga innego układu elementów, nie tylko przycięcia.
6. **Eksportuj w odpowiedniej jakości** - 1080p dla web, 4K dla prezentacji. Większa rozdzielczość = dłuższy render, ale YouTube i tak kompresuje.

Jeśli chcesz więcej o AI-driven animations, sprawdź mój artykuł o [tworzeniu animacji w stylu Apple](/blog/animacje-apple-ai-cursor). Opisuję tam podobny workflow z Google Flow i Cursor.

## Czego Remotion nie zrobi

Bądźmy realistami - Remotion + AI nie zastępuje studia produkcyjnego w każdym scenariuszu.

**Ograniczenia:**

- **Complex motion graphics** - zaawansowane efekty 3D, particle systems, morphing są poza zasięgiem. To nie After Effects.
- **Real footage editing** - Remotion nie jest edytorem wideo. Nie przytnie Ci nagrania z kamery.
- **Voice generation** - biblioteka nie generuje głosu. Potrzebujesz zewnętrznego TTS (ElevenLabs, Murf, etc.).
- **Photo-realistic graphics** - generujesz animacje, nie filmy. Bez kamer, aktorów, planu zdjęciowego.

**Obejścia:**

- **Łącz z zewnętrznymi narzędziami** - ElevenLabs generuje lektor, Remotion animację. Scalasz w Premiere lub DaVinci.
- **Używaj jako warstwa animacji** - Remotion świetnie nakłada animowane elementy na istniejące wideo.
- **Hybrid approach** - proste sceny w Remotion, złożone w tradycyjnych narzędziach. Mieszaj i łącz.

Remotion jest idealny dla: explainers, motion graphics, data visualization, UI animations, product teasers. Nie jest idealny dla: filmów dokumentalnych, vlogów, content z real footage.

## Podsumowanie

Stworzenie profesjonalnego wideo marketingowego nie musi kosztować tysięcy złotych ani zabierać tygodni. Z Remotion i Claude Code możesz mieć gotowy explainer w czasie lunchu.

**Kluczowe wnioski:**

1. **Remotion + AI = wideo w minutach zamiast dni** - deklaratywne podejście eliminuje ręczną animację
2. **Nie musisz być animatorem ani programistą** - AI generuje kod, Ty opisujesz efekt
3. **Dobre prompty = dobre wyniki** - struktura scen, timing, kolory hex, vibe descriptors
4. **Zaczynaj od prostych projektów** - logo animation, title card, potem explainer
5. **Iteruj** - AI nie musi trafić za pierwszym razem, ale trafi za trzecim
6. **Format ma znaczenie** - 16:9 vs 9:16 vs 1:1 wymaga różnego podejścia do layoutu

Demokratyzacja produkcji wideo to jeden z najciekawszych trendów AI. Jeszcze rok temu byłem przekonany, że wideo to domena specjalistów z Adobe. Dziś wiem, że każdy z dostępem do Claude Code może stworzyć coś, co wygląda profesjonalnie.

Zacznij od czegoś małego - animowane logo, 10-sekundowy teaser. Poczuj narzędzie. Potem rozbudowuj.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz tworzyć profesjonalne wideo dla swojego biznesu?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci wdrożyć AI w procesie tworzenia treści marketingowych - od strategii przez implementację po automatyzację produkcji.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Zasoby

**Oficjalne źródła:**

- [Remotion Official Docs](https://remotion.dev/docs) - Oficjalna dokumentacja biblioteki
- [Remotion Skills Repository](https://github.com/remotion-dev/skills) - Instalacja i przykłady Skills dla Claude Code
- [Mój explainer video](https://konsultacje.lipowczan.pl/explainer) - Efekt końcowy workflow z tego artykułu

**Powiązane artykuły:**

- [Animacje w stylu Apple z AI](/blog/animacje-apple-ai-cursor) - Podobny workflow z Google Flow i Cursor
- [Vibe Coding przewodnik](/blog/vibe-coding-przewodnik) - Filozofia kodowania z AI, która leży u podstaw tego podejścia

## FAQ

<details open>
<summary>

### Czy muszę znać programowanie żeby używać Remotion z AI?

</summary>

Nie, Claude Code generuje kod za Ciebie. Wystarczy umiejętność pisania dobrych promptów i podstawowe zrozumienie efektu, który chcesz osiągnąć. React działa "pod maską" - Ty opisujesz sceny, timing i styl, AI tłumaczy to na działający kod.

</details>

<details open>
<summary>

### Ile kosztuje tworzenie wideo w Remotion i czy potrzebuję płatnej licencji?

</summary>

Remotion jest open-source i darmowy do użytku osobistego oraz komercyjnego dla firm z przychodami poniżej $1M rocznie. Płatna licencja wymagana tylko dla większych organizacji. Claude Code wymaga subskrypcji Claude Pro ($20/miesiąc) lub używania przez API z własnym kluczem.

</details>

<details open>
<summary>

### Czy mogę użyć wygenerowanego wideo komercyjnie i kto jest właścicielem praw?

</summary>

Tak, wideo stworzone w Remotion należy w pełni do Ciebie. Możesz używać go komercyjnie bez ograniczeń. Upewnij się tylko, że używane assets (czcionki, ikony, muzyka) mają odpowiednie licencje - AI może zasugerować zasoby wymagające dodatkowych praw.

</details>

<details open>
<summary>

### Jak długo trwa renderowanie 45-sekundowego wideo i od czego to zależy?

</summary>

Typowo 2-5 minut dla prostych animacji na nowoczesnym laptopie z 8GB+ RAM. Czas zależy od złożoności efektów, rozdzielczości (4K dłużej niż 1080p) i liczby elementów. Dla dużych projektów można renderować w chmurze przez Remotion Lambda - szybciej, ale płatne.

</details>

<details open>
<summary>

### Czy Remotion może wygenerować wideo z lektorem i jak dodać głos do animacji?

</summary>

Remotion nie generuje głosu - to biblioteka do animacji, nie TTS. Możesz połączyć go z ElevenLabs, Murf lub innymi usługami text-to-speech, wygenerować plik audio, a następnie zsynchronizować go z animacją w Remotion. AI pomoże Ci napisać kod synchronizacji audio z scenami.

</details>

<details open>
<summary>

### Czym różni się Remotion od Canva czy CapCut i kiedy wybrać które narzędzie?

</summary>

Canva i CapCut to edytory wizualne z gotowymi szablonami - świetne dla jednorazowej szybkiej edycji bez pisania kodu. Remotion to narzędzie programistyczne dające pełną kontrolę, powtarzalność i automatyzację. Wybierz Remotion gdy potrzebujesz generować wiele wariantów wideo, integrować z danymi z API lub budować spójny system produkcji wideo.

</details>
