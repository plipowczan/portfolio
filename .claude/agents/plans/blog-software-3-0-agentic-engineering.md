# Plan artykułu: Software 3.0 i agentic engineering

> Faza PLAN ukończona 2026-05-29 (zaktualizowana po udostępnieniu notatek źródłowych). Wejście: `.claude/agents/context/blog-prime-software-3-0.md` + WSAD `docs/blog/2026-05-29_software-3-0-blog-wsad.md` + **oryginalne notatki w `C:\Projects\brain\content\AI\KNOWLEDGE\INFO\`** (Software 3.0, Agentic Engineering, Context Engineering, Agentic Coding, LLM Knowledge Bases, Self-Improving Company). Następny krok: `/blog-article-writer:execute`.

## 1. Frontmatter (spec)

```yaml
---
id: 28
slug: software-3-0-agentic-engineering
title: "Software 3.0: dlaczego twoja aplikacja nie powinna istnieć"
excerpt: >-
  Trzy paradygmaty oprogramowania i nowa dyscyplina: agentic engineering.
  Mapa decyzyjna — co budować, czego nie i czego nie da się outsourcować.
category: AI
author: Pawel Lipowczan
date: 2026-05-29
readTime: 9 min
image: /images/og-software-3-0-agentic-engineering.webp
tags:
  - AI
  - Agentic Engineering
  - Software 3.0
  - Karpathy
  - Vibe Coding
lang: pl
---
```

**Decyzje:**
- **Title** = wariant 1 z WSAD (prowokacyjny, ~57 zn., zawiera „Software 3.0"). Alternatywy do akceptacji: „Vibe coding podnosi podłogę. Agentic engineering trzyma sufit." / „1.0 → 2.0 → 3.0: nowa mapa dla każdego, kto buduje software". Keyword „agentic engineering" niesie slug + H2.
- **Excerpt** ~155 zn., odpowiada „dlaczego przeczytać" (mapa decyzyjna).
- **Bez `alternateSlug`** — PL-only na starcie. EN to osobny krok (`/blog-article-writer:translate`).
- **readTime 9 min** (~1600 słów treści + ~450 FAQ ≈ 2050 słów PL @ ~220 wpm).

## 2. Struktura treści (sekcja → H2 → cel słów)

Wątek przewodni: **rośnie abstrakcja → przesuwa się to, co robi człowiek.** Każdą sekcję otwieram konkretnym obrazem, potem uogólniam. Mapowanie 1:1 do szkieletu WSAD (7 pasów).

### Intro / hook (~250 słów)
- Wariant A z WSAD (osobisty Karpathy): autor terminu *vibe coding* „nigdy nie czuł się bardziej w tyle"; w grudniu modele przekroczyły próg.
- Twist: to nie historia o szybszym pisaniu kodu — *programowanie zmieniło się w prompcie*.
- Reframe: czytaj „software" jako wszystkie cyfrowe biznesy. Zapowiedź wartości: mapa decyzyjna + cztery fosy.
- Osobisty akcent Pawła (pierwsza osoba) — krótkie nawiązanie do własnej praktyki budowania z agentami (bez przeładowania).

### Diagram-spine (po intro, przed pierwszym H2)
- **Asset (gotowy w repo):** `/images/karpathy-paradigm-software-3-0.webp` (~800 KB, q85; rozważyć recompresję jeśli za ciężki) — skopiowany z `C:\Projects\brain\content\AI\KNOWLEDGE\INFO\Karpathy Paradigm.png` i skonwertowany do WebP.
- Osadzić w markdown po akapicie wprowadzającym jako oś wizualną całego tekstu (wzorzec: `architecture-system-agentow-ai.webp` w artykule id 27 — „Ten diagram to spine artykułu").
- **Alt-text (opisowy):** „Diagram The Karpathy Paradigm — pięć pasów: ① trzy paradygmaty Software 1.0→2.0→3.0 (rosnąca abstrakcja), ② vibe coding podnosi podłogę vs agentic engineering trzyma sufit, ③ weryfikowalność i jagged intelligence (refactor 100k-line vs car wash), ④ co zostaje po stronie człowieka — taste, judgment, understanding, ⑤ buduj dla agentów: sensory, aktuatory, dane legible dla LLM".
- Jedno zdanie pod diagramem: „Ten diagram to oś całego tekstu — wracam do każdego pasa w kolejnych sekcjach." Pasy ①–⑤ mapują się 1:1 na H2 2–7.

### H2: `## Trzy paradygmaty: jak „programujesz" maszynę` (~300) — pas ①
- 1.0 — jawny kod, reguła po regule (kruche, nie samonaprawialne).
- 2.0 — programujesz przez **dane**: kurujesz zbiory, trenujesz wagi.
- 3.0 — **prompting**: okno kontekstu to dźwignia nad interpreterem (LLM).
- Cytat EN + gloss PL: „Software 3.0 is kind of about your programming now turns to prompting…"
- Reframe biznesowy: LLM = silnik, ty projektujesz samochód. Cytat „All businesses are literally being restructured to be AI first… You get to design your own car." (opcjonalnie tu lub w zakończeniu). Wątek „firma jako system wokół silnika-LLM" wsparty notatką `Self-Improving Company.md`.

### H2: `## Cztery przykłady, które to unaoczniają` (~260) — sekcja 2 WSAD
- Lista 4: instalator (self-healing skill), **MenuGen** (apka 2.0 „natychmiast bezużyteczna"), kurs → agent-coach, usługa montażu wideo → pole tekstowe.
- Puenta pogrubiona: **Software 3.0 sprzedaje wynik (outcome), nie narzędzie.**

### H2: `## Vibe coding podnosi podłogę. Agentic engineering trzyma sufit.` (~300) — pas ②
- Najważniejsze nowe rozróżnienie.
- Vibe coding → PODŁOGA (demokratyzacja). Agentic engineering → SUFIT (poprzeczka jakości + przyspieszenie; *to wciąż twój software*).
- Agenci = „spiky entities" — zawodni, stochastyczni, potężni; sztuka to koordynacja bez obniżania poprzeczki.
- Cytat EN + gloss: „Vibe coding is about raising the floor for everyone… agentic engineering is about preserving the quality bar…"
- Akcent: „10× engineer" wzmocniony daleko poza 10×.
- **Cross-link wewnętrzny:** do `/blog/vibe-coding-przewodnik` przy słowie „vibe coding".

### H2: `## Weryfikowalność — nowe ograniczenie` (~250) — pas ③
- Dawniej automatyzujesz co umiesz **zaprogramować (specify)**; dziś co umiesz **zweryfikować (verify)**.
- Cytat (potwierdzony w `Agentic Engineering.md`) EN + gloss: „The previous generation of computers automated what you could specify. This generation automates what you can verify."
- **Jagged intelligence**: szczyty w domenach weryfikowalnych (kod, matematyka), doliny gdzie indziej. Jaggedness = weryfikowalne + to, na czym laby trenują (RL z nagrodami za weryfikację).
- Cytat-haczyk EN + gloss: „How is it possible that a state-of-the-art model will refactor a 100,000-line codebase… and yet tell me to walk to a car wash 50 metres away?"
- Founder takeaway: problem weryfikowalny = wykonalny → własne środowiska RL / fine-tune = fosa niezależna od labów.

### H2: `## Czego nie da się outsourcować` (~250) — pas ④ (rdzeń emocjonalny)
- Smak, osąd, nadzór — ty trzymasz spec/plan/top-level design, agent „wypełnia luki".
- Fundamenty > trivia API (stażysta z idealną pamięcią `keepdim` vs `axis`; ty rozumiesz, co pod spodem).
- Cytat-pointa EN + gloss: „You can outsource your thinking, but you can't outsource your understanding."
- Anegdota zawodności: MenuGen dopasowywał użytkowników po **adresach e-mail** Stripe vs Google zamiast po trwałym user ID — błąd do wyłapania przez człowieka.

### H2: `## Buduj dla agentów, nie dla ludzi` (~200) — pas ⑤
- Opisuj systemy najpierw agentom; rozkładaj na **sensory** (czytają świat) i **aktuatory** (działają); dane **legible dla LLM**.
- Kierunek: „mój agent rozmawia z twoim agentem".
- Rekrutacja do przebudowy: duży projekt (np. bezpieczny Twitter-clone dla agentów + 10 agentów próbuje go złamać), obserwacja *jak* kandydat włada narzędziami.
- **Cross-link wewnętrzny:** do `/blog/llm-knowledge-base-brain-karpathy` przy „legible / baza wiedzy" (fosa danych).

### H2: `## Nie zwierzęta, lecz duchy` (~220) — zakończenie
- Framing: nie budujemy zwierząt, *przywołujemy duchy* — statystyczne obwody symulacji. Cytat EN + gloss: „We're not building animals. We are summoning ghosts."
- Wartość metafory = nastawienie: zdrowa podejrzliwość, empiryczna weryfikacja.
- Klamra z czytelnikiem: w którym paradygmacie jest twój produkt? **Cztery fosy** (rozpisane wg `Software 3.0.md`): **dane** (zastrzeżone zbiory, własne środowiska RL) / **prompty-kontekst** (wypracowane systemy kontekstu, knowledge base) / **system design** (sensory, aktuatory, pętle weryfikacji) / **zaufanie** (marka, odpowiedzialność za wynik — model tego nie kupi).

### CTA (HTML + Tailwind — kategoria AI)
Kontekstowy nagłówek dot. AI-first / agentic engineering. Wariant:
```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz przebudować swój produkt na agentic engineering?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci ocenić, w którym paradygmacie działasz, gdzie jest Twoja fosa i jak wdrożyć agentów bez obniżania poprzeczki jakości.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

### `## Przydatne zasoby`
- 📺 [Andrej Karpathy: From Vibe Coding to Agentic Engineering](https://www.youtube.com/watch?v=96jN2OCOfLs) — Sequoia Capital (źródło pierwotne).
- 📺 [Software 3.0 — breakdown](https://www.youtube.com/watch?v=hJNp9RwK-Uw) — Dream Labs AI (ujęcie biznesowe).
- Linki wewnętrzne (jeśli nie wplecione w treść): vibe coding, baza wiedzy Karpathy'ego.

### `## FAQ` (5 pytań, akordeon `<details open>`, ~450 słów)
1. Czym różni się Software 3.0 od Software 1.0 i 2.0? *(definicyjne, snippet)*
2. Czym różni się vibe coding od agentic engineering? *(rozróżnienie podłoga/sufit)*
3. Co to jest jagged intelligence w modelach AI? *(definicja + car wash przykład)*
4. Czego nie da się outsourcować agentom AI przy budowie produktu? *(zrozumienie, osąd, weryfikacja)*
5. Jak budować produkt „agent-native" / dla agentów, a nie tylko dla ludzi? *(sensory/aktuatory, legible data)*

Format wg `docs/faq/FAQ_TEMPLATE.md`: H3 w `<summary>`, puste linie wokół, odpowiedź 2-4 zdania, kluczowa info pierwsza.

**Kolejność końcówki:** Zakończenie (Nie zwierzęta, lecz duchy) → CTA → Przydatne zasoby → FAQ.

## 3. Język i styl
- Polski + EN terminy techniczne (prompting, context window, fine-tune, RL, sensory/aktuatory, legible, jagged intelligence, spiky entities — zostawić EN, krótki gloss przy pierwszym użyciu jeśli trzeba).
- **Cytaty Karpathy'ego w EN (blockquote) + krótki gloss PL** w nawiasie/kursywą pod spodem (instrukcja WSAD).
- Pierwsza osoba, akapity 3-4 zdania, pogrubienia kluczowych pojęć przy pierwszym użyciu.
- **Brak code blocks** — to esej o modelu myślenia, nie tutorial. Nie dodawać sztucznych snippetów.
- **NIE** robić listy „10 narzędzi AI".

## 4. SEO
- Primary keyword: „Software 3.0" (title, H2, intro). Secondary: „agentic engineering", „vibe coding", „jagged intelligence", „Andrej Karpathy", „AI-first".
- Keywords naturalnie w H2 (są).
- Linki wewnętrzne: 2 (`vibe-coding-przewodnik`, `llm-knowledge-base-brain-karpathy`).
- Linki zewnętrzne: 2 wideo (autorytatywne źródło — wywiad Sequoia).
- Atrybucja cytatów: Andrej Karpathy, wywiad dla Sequoia Capital.

## 5. Checklist dokładności
- [ ] Cytaty przepisane 1:1 z banku cytatów WSAD (sekcja „Bank cytatów").
- [ ] Atrybucja: Karpathy / Sequoia Capital.
- [x] Diagram „Karpathy Paradigm" osadzony jako spine: `/images/karpathy-paradigm-software-3-0.webp` (asset w repo). OG image to osobna grafika (`og-software-3-0-agentic-engineering.webp`, faza OG).
- [ ] Brak code blocks bez language tagu (tu w ogóle bez kodu).
- [ ] Linki wewnętrzne wskazują istniejące slugi (zweryfikowane: id 14, id 24).

## 6. Po EXECUTE
1. `/blog-article-writer:validate`
2. Generacja OG: `/blog-article-writer:generate-og-prompt` → Gemini → `convert-to-webp`.
3. `npm run blog:sitemap`
4. `npm run dev` (sprawdzenie renderu FAQ/CTA).
5. (Opcjonalnie później) `/blog-article-writer:translate` → wersja EN + `alternateSlug` po obu stronach.

---

## Następny krok
```
/blog-article-writer:execute
```
