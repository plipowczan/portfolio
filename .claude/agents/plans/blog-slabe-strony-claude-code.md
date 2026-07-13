# Blog Plan — 5 słabych stron Claude Code i jak je nadrobić

> Phase: PLAN complete → next `/blog-article-writer:execute`.
> Prime: `.claude/agents/context/blog-prime-claude-code-tools-by-operation.md`
> Goal (user, sharpened): wskazać 5 obszarów gdzie Claude Code jest słaby + jak sobie z tym radzić.

## Frontmatter (final)

```yaml
---
id: 31
slug: slabe-strony-claude-code
title: "5 słabych stron Claude Code i jak je nadrobić"
excerpt: "Claude Code jest świetny w kodzie, ale ślepy przy wideo, designie, pamięci i researchu. Oto 5 słabych stron i narzędzia, których używam, żeby je nadrobić."
category: Code
author: Pawel Lipowczan
date: 2026-07-13
readTime: 13 min
image: /images/og-slabe-strony-claude-code.webp
tags:
  - Claude Code
  - Agent Skills
  - Developer Tools
  - Produktywność
  - AI
lang: pl
---
```

- **id 31** confirmed (max existing = 30).
- **excerpt** ~165 chars - trim to 150-160 at write time if needed. Answers "why read".
- **NO `alternateSlug`** - PL-only at creation. EN is a separate `/blog-article-writer:translate` step.
- **NO `modified`** at creation.
- OG image `/images/og-slabe-strony-claude-code.webp` - generated later (generate-og-prompt / execute).

## SEO

- **Primary keyword:** "Claude Code" + "słabe strony".
- **Secondary (in H2s):** wideo, design / AI slop, pamięć agenta, deep research, tokeny / kontekst.
- **Internal links (3-5, descriptive anchors):**
  - Video section -> `/blog/remotion-explainer-videos-ai` (id 18) - HyperFrames vs Remotion tradeoff.
  - Design section -> `/blog/5-repozytoriow-github-claude-code` (id 23) - UI UX Pro Max already covered there; link instead of re-teaching.
  - Memory section -> `/blog/second-brain-obsidian-claude-code-skills` (id 16) AND/OR `/blog/llm-knowledge-base-brain-karpathy` (id 24) - the second-brain build; don't re-explain.
  - Memory/Research nod -> `/blog/rag-ragowi-nierowny` (id 30) - LLM Wiki vs RAG.
- **External links:** each tool's GitHub/site (from dossier). Whisper/Groq, Firecrawl docs, Impeccable site, Karpathy LLM Wiki gist.

## Structure + word budget (~2600 words, ~13 min)

### Intro (~250 words)
- Hook: concrete - "Claude Code czyta kod, edytuje pliki, odpala komendy. Ale poproś go, żeby obejrzał wideo albo zaprojektował ładny front - i widać granice."
- Personal angle: "Testuję dziesiątki narzędzi. Pięć słabych stron wraca w każdej rozmowie o Claude Code." Own credibility (brain.lipowczan.pl, daily driver).
- Value preview: 5 obszarów, dla każdego gap + narzędzie, którego naprawdę używam. Honesty: co przetestowane, co na radarze.
- Nod to spark (optional, 1 sentence): framing zainspirowany filmem Chase AI, ale to mój własny stack.
- Define at first use: token (jednostka tekstu, którą model liczy i za którą płacisz), context window (okno kontekstowe - ile tekstu model widzi naraz).

### H2: 🎬 Wideo - Claude Code nie widzi i nie tworzy filmów (~400 words)
- **Gap:** nie potrafi obejrzeć wideo ani go wygenerować out of the box. Zwykle utknięty na samym transkrypcie (zapisie tekstu ścieżki dźwiękowej).
- **Fix (input): `Claude Video`** - skill `/watch` (bradautomates). Wkleję URL/plik + pytanie; agent pobiera napisy, wycina klatki (frames - pojedyncze obrazy z wideo), czyta je jako obrazy. Realnie *widzi* wideo. Używam do analizy cudzych treści + jako grabber transkryptów YT.
  - Code (`bash`): `/watch https://youtu.be/... co dzieje się w 30 sekundzie?`
  - `--detail` table (`text`): transcript / efficient / balanced / token-burner - klatki to obrazy = główny koszt tokenów. Define keyframe (klatka kluczowa).
- **Fix (output): `HyperFrames`** (heygen) - kompozycje to pliki HTML → render do MP4. "Brand" żyje w moich stylach, więc render wychodzi spójny z identyfikacją. Install `npx skills add heygen-com/hyperframes` (Node >=22, FFmpeg).
  - Cross-link id 18 (Remotion): HyperFrames = HTML-native + Apache 2.0 vs Remotion licencja/Lambda. 1-2 zdania, link.
- Keep tight. Define: transkrypt, frame/klatka, keyframe, whisper (model zamieniający mowę na tekst, gdy brak napisów).

### H2: 🎨 Design - koniec z generycznym "AI slop" (~450 words)
- **Gap:** poproś o stronę → dostajesz ten sam hero + zaokrąglone karty + fioletowy gradient co wszyscy. **AI slop** (generyczny wygląd, który od razu zdradza, że front wygenerował AI). Define at first use.
- **Fix = pipeline 3 skilli (discovery → generation → guardrail):**
  1. **`UX RULER`** - kto i po co (odbiorca + mierzalna wartość) ZANIM wskoczysz w funkcje. Zapisuje decyzje do repo jako product memory.
  2. **`UI UX Pro Max`** - generuje spójny design system dopasowany do typu projektu + robi audyt UX. Uruchamiam z Tailwind + React jako bazę, potem dociągam. (Cross-link id 23 - tam pełny opis; tu skrót + link, bez powtarzania.)
  3. **`Impeccable`** (pbakaus) - język designu + deterministyczny linter anti-slop: `npx impeccable detect src/` (bez API key). Łapie fioletowe gradienty, Inter wszędzie, karty w kartach. 23 komendy pod `/impeccable`.
- One-liner framing: RULER = dla kogo, Pro Max = system, Impeccable = strażnik i usuwa AI-tells.
- Define: design system, linter (narzędzie sprawdzające kod/wygląd wg reguł), AI-tell.

### H2: 🧠 Pamięć - Claude Code zapomina po każdej sesji (~420 words)
- **Gap:** koniec sesji = amnezja. Brak kumulującej się pamięci długoterminowej.
- **Fix (mój żywy system): second brain / LLM Wiki.** Repo tekstowe, które agent czyta, uzupełnia, linkuje i przeszukuje. To wzorzec Karpathy'ego (LLM Wiki, kwiecień 2026): LLM buduje i utrzymuje trwałą wiki z Twoich źródeł - inaczej niż RAG (technika, w której model przed odpowiedzią przeszukuje surowe dokumenty), tu wiedza kumuluje się w plikach.
  - **Cross-link id 16 + id 24** - tam pełna architektura (brain.lipowczan.pl, 185 notatek). Tu skrót + link, NIE re-teach.
  - Nod id 30 (RAG) przy LLM Wiki vs RAG.
  - **TIE-IN KURSU (główne wiązanie):** link `[darmowy kurs LLM Wiki](/llm-wiki)` przy budowie second brain - "jak taką bazę zbudować od zera, pokazuję w darmowym kursie LLM Wiki". Wzorzec z posta id 30 (rag-ragowi-nierowny). Kurs `src/content/kurs/` = drugi mózg / LLM Wiki krok po kroku (co to drugi mózg → onboarding → pierwszy ingest → publikacja), route `/llm-wiki`.
  - Define: second brain, LLM Wiki, RAG, progressive disclosure (organizacja notatek tak, żeby agent je znalazł bez zaśmiecania okna kontekstowego).
- **Fix (świeży): `NotebookLM-py`** (teng-lin) - NotebookLM (grounded silnik Google: Gemini czyta Twoje źródła i odpowiada z cytatami) wewnątrz Claude Code. Nieoficjalne API - używać na własne ryzyko. Install `uv tool install "notebooklm-py[browser]"` + `notebooklm login`. Dla mnie na razie: alternatywa do grania transkryptów YT. Honesty: dopiero zacząłem.

### H2: 🔎 Research - wbudowany web search jest płytki (~380 words)
- **Gap:** proste web search działa, ale powierzchownie; brak środka między "płytko" a "105 sub-agentów i 10 mln tokenów".
- **Fix (fallback): `Firecrawl`** - zamienia stronę na czysty markdown (albo JSON). Ratunek, gdy wbudowany scraper Claude Code nie daje rady. Install `pip install firecrawl-py`. Tryby: Scrape / Crawl / Map / Search / Extract. Działa jako MCP (Model Context Protocol - standard podłączania narzędzi do agenta) - define MCP at first use here or in memory, whichever comes first (memory doesn't use MCP term - put def here).
  - Code (`bash`): pip install + jednolinijkowy scrape.
- **Fix (do przetestowania): `NotebookLM-py` deep research** - grounded, tańsze (Gemini po stronie Google). Honesty: nie sprawdziłem jeszcze - kandydat, nie rekomendacja.
- **Fix (strukturalny): research swarm skill** (w tym repo) - jeden agent na pozycję, równolegle (agent swarm - rój niezależnych agentów pracujących równocześnie), wynik wpada do mojej wiki. Skrót.
- Define: scraper, MCP, agent swarm.

### H2: 🪙 Tokeny - gadatliwy output pali budżet i kontekst (~380 words)
- **Gap:** rozwlekłe odpowiedzi i napcompany kontekst kosztują pieniądze i zjadają okno kontekstowe.
- **Fix: `Caveman`** (JuliusBrussee) - skill, który każe agentowi mówić jak jaskiniowiec: bez rodzajników, waty, uprzejmości. Tnie ~65% tokenów outputu, zachowuje 100% treści technicznej. Install (`powershell` + `bash` bloki). Poziomy: `/caveman lite|full|ultra`.
  - **Honest caveat (kluczowy hook):** w trybie `full` opisy bywają nieczytelne, zwłaszcza po polsku. Używam `lite`, a do kodu/commitów/bezpieczeństwa - `normal mode`. (Meta, opcjonalnie: część tej rozmowy pisałem w trybie caveman - stąd wiem.)
  - Key caveat z README: tnie tylko output, nie tokeny myślenia (reasoning). Skraca usta, nie mózg.
- **Na radarze (nietestowane przeze mnie - kandydaci, nie rekomendacje):** `Headroom` (kompresja inputu/kontekstu, 60-95%), `Ponytail` (mniej kodu = mniej tokenów), `Graphify` (kod → graf wiedzy zamiast czytania plik po pliku). Krótka lista, wprost oznaczona jako niesprawdzone.
- Define: token (jeśli nie w intro), reasoning/thinking tokens.

### Kluczowe wnioski (~200 words)
- Numbered 5: jeden wniosek per obszar. Np.:
  1. Wideo - dodaj `/watch`, zanim znów będziesz czytał sam transkrypt.
  2. Design - trzy skille w kolejności: kto → system → strażnik.
  3. Pamięć - tekstowa wiki, którą utrzymuje agent, bije RAG na małej skali.
  4. Research - Firecrawl jako fallback, deep research tylko gdy naprawdę trzeba.
  5. Tokeny - Caveman tnie output, ale `lite` po polsku; reszta na radarze.
- Personal close: praktyczny, nie "podsumowując". Zaproszenie do własnego testu (najgorsze co się stanie - odinstalujesz).

### CTA (HTML + Tailwind, category=Code template) - HYBRYDA (konsultacja + kurs)
- Wrapper `div` canonical. H3 kontekstowy (np. "Chcesz wycisnąć więcej z Claude Code?").
- `<p>` wartość (wybór narzędzi, wdrożenie skilli, workflow) + **jedno zdanie o darmowym kursie jako niższym progu wejścia**: kto woli zacząć sam, buduje pamięć agenta w `<a href="/llm-wiki" class="text-primary-500 hover:text-primary-400">darmowym kursie LLM Wiki</a>`. (Wzorzec inline-linku z posta id 30, CTA sekcja.)
- Przycisk BEZ zmian: `<a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>` (reguła copywritingu wymaga tego linku+tekstu; kurs = dodatkowa ścieżka w akapicie, nie zamiast przycisku).

### ## Przydatne zasoby
- Claude Video (github bradautomates/claude-video) - `/watch` skill dający agentowi wzrok.
- HyperFrames (github heygen-com/hyperframes) - HTML → wideo.
- Impeccable (impeccable.style) - język designu + linter anti-slop.
- NotebookLM-py (github teng-lin/notebooklm-py) - NotebookLM w terminalu.
- Firecrawl (firecrawl.dev) - strona → czysty markdown.
- Caveman (github JuliusBrussee/caveman) - kompresja outputu.
- Karpathy LLM Wiki gist - wzorzec pamięci.
- [Darmowy kurs LLM Wiki](/llm-wiki) - jak zbudować pamięć agenta (drugi mózg) od zera, krok po kroku.

### ## FAQ (4-6 pytań, `<details open>` + H3 w `<summary>`)
1. W jakich obszarach Claude Code jest słaby out of the box? (5 obszarów - snippet answer)
2. Czy Claude Code potrafi obejrzeć wideo z YouTube? (Claude Video / `/watch`, klatki + transkrypt)
3. Jak dać agentowi AI pamięć między sesjami? (second brain / LLM Wiki, tekstowa wiki utrzymywana przez agenta; zamknij linkiem do `/llm-wiki` - darmowy kurs jak zbudować)
4. Czym jest "AI slop" i jak uniknąć generycznego designu? (definicja + Impeccable/UI UX Pro Max)
5. Czy Caveman naprawdę oszczędza tokeny i czy warto? (~65% output, caveat full/PL, użyj lite)
6. Które z tych narzędzi są darmowe? (wszystkie open source / free; niektóre wymagają kluczy API - Whisper, Firecrawl)

## Style / rules checklist (bind at write time)

- **Prosty polski** (`.claude/rules/content/10-prosty-polski.md`): zdania śr. <=20 słów, jedna myśl/zdanie, strona czynna, skreślaj zbędne.
- **Definicja przy pierwszym użyciu** dla KAŻDEGO trudnego terminu (także keep-lista): token, context window/okno kontekstowe, MCP, skill, RAG, embeddings, frontmatter (jeśli pada), `/watch`, transkrypt, frame/klatka, keyframe, whisper, AI slop, design system, linter, AI-tell, second brain, LLM Wiki, progressive disclosure, scraper, agent swarm, grounded, reasoning tokens.
- **Keep English** (test UI/plików): Claude Code, MCP, RAG, skill, `/watch`, `/caveman`, commit, vault, frontmatter, markdown, nazwy produktów (backticks pierwszy raz): `Claude Video`, `HyperFrames`, `UI UX Pro Max`, `UX RULER`, `Impeccable`, `NotebookLM-py`, `Firecrawl`, `Caveman`, `Headroom`, `Ponytail`, `Graphify`.
- **NIGDY nie polonizuj czasowników**: nie "ingestować/mergować/renderować/deployować/commitować/watchować". Użyj PL czasownika lub "robić <keep-list noun>". UWAGA: dossier używa spolszczeń - przepisz.
- **Znaki - brama AI-tell**: zero `—` (U+2014), zero `–` (U+2013), zero `…` (U+2026). Tylko `-` ze spacjami i `...`. Zostaw polskie `„ "`. Pre-save grep `[\x{2014}\x{2013}\x{2026}]` = pusto.
- **Frazy - brama AI-tell**: bez "to nie X, to Y", bez "W dzisiejszym świecie", bez "Podsumowując/Warto zauważyć", bez wymuszonej reguły trójki, bez "zanurzmy się".
- **Brama słownikowa (grep)**: po napisaniu odpal wyrażenie z reguł prosty-polski na pliku - proza musi być czysta (trafienia tylko w blokach kodu/ścieżkach OK).
- **Formatowanie**: akapity max 3-4 zdania; bullet dla wyliczeń, numerowane dla sekwencji; bold kluczowe pojęcia+liczby; WSZYSTKIE bloki kodu z tagiem języka (`bash`, `powershell`, `html`, `text`, `yaml`); emoji tylko w H2 (🎬🎨🧠🔎🪙 - spójne z dossier).
- **Kolejność końcówki**: Kluczowe wnioski → CTA (HTML div) → `## Przydatne zasoby` → `## FAQ`.

## Technical accuracy notes

- Wszystkie fakty/instalki/liczby brać z dossier (`docs/blog/2026-07-12_...md`) - to source of truth. Nie zmyślać wersji.
- Repos niszowe (nie ma ich w Context7) - nie weryfikować przez Context7, cytować za dossier + linki GitHub z dossier.
- Liczby do zachowania: Caveman ~65% output saved (range 22-87%), 100% accuracy; Claude Video 4 tryby --detail; Impeccable 23 komendy + 27 reguł deterministycznych; HyperFrames Node>=22.
- Oznacz WPROST co nietestowane: NotebookLM-py deep research, Headroom/Ponytail/Graphify = "kandydaci, nie rekomendacje".

## Scope guard

- 5 sekcji, hero-tool per obszar + krótkie wzmianki. NIE rozwlekać każdego z 11 narzędzi. Design ma 3 skille (pipeline) - to jedyny wyjątek, ale trzymać zwięźle (Pro Max = link do id 23).
- Cel: 2400-2800 słów. Jeśli przekracza 3000 - ciąć definicje-oczywistości i skracać wzmianki katalogowe.

## Next command

`/blog-article-writer:execute`
