# Blog Plan: Skille, które mam podłączone

> **Generated:** 2026-10-12
> **Phase:** PLAN
> **Prime artifact:** `.claude/agents/context/blog-prime-skille-ktore-mam-podlaczone.md`
> **Wsad:** `docs/blog/wsad-skille-ktore-mam-podlaczone.md` (struktura w 10 krokach, tabele 4.1 i 4.2, lista zakazów §5)
> **Next:** `/blog-article-writer:execute`, po odpowiedzi na punkt D1 (patrz sekcja 12)

---

## 1. Frontmatter specification

```yaml
---
id: 33
slug: skille-ktore-mam-podlaczone
title: "Skille Claude Code: kompetencję się instaluje, nie nabywa"
excerpt: >-
  Nie znam się na designie, a zbudowałem CRM dla branży nieruchomości.
  Skille przesunęły moją pracę z wykonania na ocenę. Lista skilli i dwie komendy instalacji.
category: AI
author: Pawel Lipowczan
date: 2026-10-12
readTime: 13 min
image: /images/og-skille-ktore-mam-podlaczone.webp
tags:
  - Agent Skills
  - Claude Code
  - Wtyczki
  - Open source
  - Rozwój zawodowy
lang: pl
---
```

- **id 33:** wynik polecenia z planu (`sort -n | tail -1` = 32); EN też ma maksimum 32.
- **slug:** wiążący ze wsadu; kanały zewnętrzne linkują na `/blog/skille-ktore-mam-podlaczone`. Nie zmieniać.
- **title, 57 znaków:** zawiera słowa kluczowe „Skille Claude Code" i roboczy tytuł autora w drugim członie. Alternatywy: „Skille, które mam podłączone: kompetencję się instaluje" (55, trzyma slug i tytuł razem, słabsze pod wyszukiwanie); „Kompetencję się instaluje, nie nabywa. Skille do Claude Code" (60, granica).
- **excerpt, 152 znaki:** hak (CRM) + teza (wykonanie → ocena) + obietnica (lista, instalacja). Nie obiecuje liczb.
- **category AI:** teza o kompetencji i planowaniu rozwoju, nie przegląd narzędzi. Sąsiedzi: `skills-2-0-...`, `system-agentow-...`, `srodowisko-agentowe-...` (wszystkie AI). `slabe-strony-claude-code` to Code, ale to przegląd narzędzi.
- **date:** dzień planu; w `execute` ustawić na dzień zapisu pliku. Artykuł wychodzi **przed** materiałami na innych kanałach.
- **readTime 15 min:** szacunek (patrz sekcja 3); w `execute` przeliczyć z `wc -w` przy ~200 słów/min, tak jak w `zmierzone-nie-zalozone` (3225 słów = 16 min).
- **alternateSlug:** *(zaktualizowane 2026-10-12)* ustawiony po `translate`: PL → `claude-code-skills-i-have-connected`, EN → `skille-ktore-mam-podlaczone`. Pierwotna decyzja „PL-only" wynikała ze starej reguły w `src/content/blog/AGENTS.md`, którą autor uznał za błędną i która została poprawiona (każdy artykuł to para PL+EN). **D1 rozstrzygnięte:** zdanie o ocenie SEO na własnej domenie weszło do sekcji 7.
- **OG:** plik `public/images/og-skille-ktore-mam-podlaczone.webp` musi istnieć przed publikacją. Potok ma trzy kroki (`generate-image.js` daje `.jpeg` 1424x752, potem zmiana rozmiaru, potem WebP); bez tego `npm run og:check` odrzuci. Osobny krok: `/blog-article-writer:generate-og-prompt`.

---

## 2. Kąt i teza nośna

**Teza (wsad §1), dwie połowy, obie muszą paść:**

1. *O narzędziu:* kompetencję się podłącza. Podstawa: cztery pozycje robią to, czego autor nie umie (design ×3, SEO ×1), oraz stan podłączenia.
2. *O pracy autora:* to zmienia planowanie rozwoju. Podstawa jedna: CRM dla branży nieruchomości, którego wcześniej by nie wziął. Pierwsze pytanie brzmi „co podłączyć i co dalej muszę umieć ocenić", nie „czego się nauczyć w tym kwartale".

**Granica tezy:** umiejętność nie przestała mieć znaczenia, **przesunęła się z wykonania na ocenę wyniku**. Mocniejszej tezy artykuł nie stawia.

**Czym artykuł jest:** pierwszoosobowym zapisem jednej zmiany + kompletną, sprawdzalną listą do wzięcia. **Czym nie jest:** poradnikiem pisania skilli, recenzją narzędzi (te są w `slabe-strony-claude-code`), porównaniem OpenSpeca z superpowers, prognozą rynku pracy, wizytówką prywatnej maszynerii.

**Dla kogo:** programista, freelancer, konsultant pracujący z agentem, który planuje swoje zlecenia i rozwój. Poboczny: właściciel firmy szukający gotowych skilli (CFO, podatki, prawo, procesy).

**Zdanie-oś (do leadu lub części o planowaniu):** *skill dodany agentowi jest kompetencją dodaną mnie.* Użyć raz, nie powtarzać jako refrenu.

---

## 3. Struktura sekcji

Kolejność ze wsadu §3 jest wyliczona pod tezę (konkret, potem nazwa rzeczy, na końcu lista) i zostaje bez zmian. Dwie zmiany układu: kroki 1-2 wsadu schodzą w jeden lead; krok 10 („weź to") jest krótką sekcją przed `Kluczowe wnioski`, bo szablon bloga wymaga wniosków i CTA na końcu.

| # | Sekcja (H2) | Krok wsadu | Cel | Słowa |
|---|---|---|---|---|
| 0 | *(lead, bez nagłówka)* | 1+2 | CRM dla klientów z branży nieruchomości: robota, której wcześniej bym nie wziął. Nie znam się na designie ani SEO i żadnego z nich się nie nauczyłem. Podłączyłem cztery pozycje. **Pierwsze użycie słowa „skill" + zdanie definiujące.** Zapowiedź: dwie połowy tezy, pełna lista, granice | 350 |
| 1 | Agent Skills: otwarty format, który działa poza Claude Code | 3 | Skill = plik z instrukcją (rozwinięcie definicji z leadu). Standard Agent Skills: folder z `SKILL.md`, wymyślony przez Anthropic, wydany jako otwarty, przyjęty przez inne narzędzia. Link `agentskills.io` w zdaniu | 230 |
| 2 | Dlaczego ten format jest tani | 4 | Markdown i JSON, bez kroku budowania. Wtyczka jako paczka skilli. Własny skill kosztuje tyle, co napisanie instrukcji. **Zastrzeżenie:** manifest wtyczki to konwencja Claude Code, nie część specyfikacji; ścieżki instalacji różnią się między narzędziami | 300 |
| 3 | Stan podłączenia: 29 wtyczek z 8 katalogów | 5 | Liczba jako tło, nie teza. **Rozdzielenie populacji** (29 wtyczek ≠ 19 + 10 pozycji z tabel; trzy z 10 nie są wtyczkami). Koszt podłączenia: kontekst w każdej turze, kod z uprawnieniami użytkownika. Dlatego w tabelach tylko to, czego używam | 280 |
| 4 | Moje skille do wzięcia za darmo | 6 | Wprowadzenie, **blok instalacji (2 komendy)**, **tabela 4.1 (19 pozycji)**, warunek przy `/ss:review-fix` i `/ss:review-loop` (plan ChatGPT z Codexem), zdanie o licencji | 320 + tabela |
| 5 | Cudze skille i narzędzia, których używam | 7 | **Tabela 4.2 (10 pozycji)** z autorami. Jedno zdanie o OpenSpecu i superpowers: po co sięgam po które, **bez rozstrzygania, które lepsze** | 200 + tabela |
| 6 | Czego nie oddaję | 8 | Prywatna część maszyny jako wzorzec (zamknięcie sesji, rejestr zadań, kontrola spójności kontekstu), bez nazw i bez odnośnika. Uczciwość wobec czytelnika, który zapyta o resztę | 180 |
| 7 | Co to zmienia w planowaniu własnego rozwoju | 9 | Druga połowa tezy. Stary porządek pytań vs nowy. Rozkład ról w CRM (kod: agent; propozycje wyglądu: trzy skille; wybór: klient; wideo: `hyperframes`). **Mechanizm oceny dla SEO: D1.** Granica tezy. Mostek do `zmierzone-nie-zalozone` | 480 |
| 8 | Jak zacząć | 10 | Dwie komendy w zdaniu + link do repozytorium w zdaniu. **Bez zapisu, bez adresu, bez prośby o kontakt.** | 110 |
| 9 | Kluczowe wnioski | n/d | 5 punktów, lista numerowana, po jednym zdaniu | 170 |
| — | CTA | n/d | Blok HTML, kontekstowy (sekcja 9) | — |
| 10 | Przydatne zasoby | n/d | Linki zewnętrzne i wewnętrzne, opis po ` - ` | 120 |
| 11 | FAQ | n/d | 6 pytań, `<details open>` | 500 |

**Łącznie:** proza ~2620 słów + tabele ~450 + FAQ ~500 = ok. 3000-3300 słów. Przy ~200 słów/min: 15-16 min. Jeśli w `execute` tekst przekroczy ~3500 słów, ciąć sekcje 1 i 3, **nie** tabele ani część o planowaniu (7).

---

## 4. Lead: zapis uderzeń (nie proza)

1. Konkret: CRM, system do prowadzenia klientów i ofert, dla klientów z branży nieruchomości. Pisać **„z agentem"**, bo kod pisze agent (wsad §2.3). Zdanie: tej roboty wcześniej bym nie wziął.
2. Powód: „Nie znam się ani na tworzeniu designu, ani na SEO." Pisać w pierwszej osobie i **bliżej oryginału niż parafrazy**; autor jest narratorem, więc cytat z 2026-09-11 jest jego własnym zdaniem. Nie wzmacniać do „w ogóle się nie znam".
3. Co się zmieniło: nie nauczyłem się projektowania ani SEO. Podłączyłem skille: `frontend-design`, `ui-ux-pro-max`, `impeccable` do designu, `claude-seo` do SEO. **Tu pierwsze użycie „skill"** i zaraz po nim zdanie: plik z instrukcją, który agent czyta i dzięki któremu robi rzecz, której wcześniej nie robił.
4. Teza w dwóch zdaniach (patrz sekcja 2), z granicą: umiejętność się nie skończyła, przesunęła się na ocenę.
5. Obietnica: pełna lista do wzięcia z ceną wejścia, plus to, czego nie oddaję.

**Zakazy w leadzie:** puste otwarcie („w dzisiejszych czasach"), antyteza-pauza, „warto zauważyć", zapowiedź „zanurzmy się". Zdanie z tytułem („kompetencję się instaluje, nie nabywa") **raz** i nie jako refren: tytuł już jest antytezą.

---

## 5. Notatki do sekcji (fakty obowiązkowe i ograniczenia sformułowań)

**Sekcja 1 (Agent Skills).** Fakty: format wymyślił Anthropic i wydał jako otwarty; skill to folder z plikiem `SKILL.md` (min. pola `name` i `description`); przyjęty m.in. przez VS Code, GitHub Copilot, Cursor, Goose, Amp, OpenCode (lista na `agentskills.io`). **Bez** daty upublicznienia, **bez** liczby zgodnych wdrożeń (wsad §2.6). Źródło główne: `agentskills.io`. Dwa artykuły wtórne ze wsadu tylko po ponownym sprawdzeniu, że się otwierają (w prime: The New Stack bez treści, aibusiness 403). Można dodać za specyfikacją: agent na starcie ładuje tylko nazwę i opis skilla (specyfikacja szacuje to na ok. 100 tokenów na skill), całość dopiero przy użyciu.

**Sekcja 2 (tani format).** Fakty: wtyczka to katalog skilli, agentów, hooków i serwerów MCP instalowany jako całość (dokumentacja Claude Code); manifest `.claude-plugin/plugin.json`; paczka to markdown i JSON, bez kroku budowania (notatka własna ze wsadu §2.7; w repo `shared-skills` potwierdzone układem plików). **Zastrzeżenie wprost:** specyfikacja Agent Skills opisuje folder skilla, a **nie** manifest wtyczki ani katalog instalacji (potwierdzone na stronie specyfikacji). Ścieżki: podać **tylko zweryfikowane** `.claude/skills/` (Claude Code), `.agents/skills/` (Codex), `.cursor/skills/` i `.agents/skills/` (Cursor, czyta też `.claude/skills/`). **Nie podawać** `~/.gemini/antigravity/skills/` ze wsadu (nie potwierdzone). **Nie używać Gemini CLI jako przykładu:** jego dokumentacja informuje, że od 18 czerwca 2026 zastąpił go Antigravity CLI.
**Korekta wsadu §4.2 (autor `superpowers`):** manifest zainstalowanej wtyczki wskazuje **Jesse Vincent** (MIT, `github.com/obra/superpowers`), a nie Anthropic. W tabeli 4.2 wpisać Jessego Vincenta.

**Sekcja 3 (stan podłączenia).** Fakty: 29 wtyczek z 8 katalogów, odczyt 2026-10-12 (ten sam wynik co 2026-09-11). **Obowiązkowe zdanie o populacjach:** 29 wtyczek to paczki z ośmiu katalogów (w tym wiele narzędziowych, np. do repozytoriów, płatności, wdrożeń); tabele niżej to mój wybór tego, czego używam, a trzy pozycje drugiej tabeli (OpenSpec, `impeccable`, `hyperframes`) to skille instalowane osobno, nie wtyczki z katalogu. **Zawęzić tezę:** nie „żadna z 29 nie wymagała nauki", tylko „do designu i SEO nie musiałem uczyć się dziedziny". **Koszt:** nazwa i opis każdego włączonego skilla są w kontekście w każdej turze (dokumentacja Claude Code); wtyczka wykonuje kod z uprawnieniami użytkownika. Link wewnętrzny do wcześniejszego tekstu o bezpieczeństwie agentów jest tu naturalny. **Nie wymyślać** liczby „ile za dużo".

**Sekcja 4 (moje, do wzięcia).**
- Blok kodu (`text`): `/plugin marketplace add 200iqlabs/shared-skills` i `/plugin install ss@shared-skills`. W zdaniu obok forma terminalowa: `claude plugin marketplace add ...` / `claude plugin install ss@shared-skills` (README).
- Tabela 4.1: **19 wierszy ze wsadu (15 skilli + 4 komendy)**. Sprawdzić każdy opis względem README `origin/master` w momencie zapisu.
- **Liczba skilli (D2, domyślnie):** pisać „19 pozycji" i jedno zdanie, że warianty `research*` i `prepare-goal*` zwinięte są w jedne wiersze, bo to jeden przepływ. **Nie podawać sumy „20 skilli"** i **nie twierdzić, że lista jest pełna**. Dzięki temu pominięty `linkedin-content` nie tworzy rozbieżności ani nie wymaga wyjaśnień.
- **Warunek przy dwóch pozycjach, w tym samym miejscu co one:** `/ss:review-fix` i `/ss:review-loop` przeglądają kod przez wtyczkę Codex i wymagają planu ChatGPT z Codexem. Skille są darmowe, recenzent nie; każda runda zużywa limit planu.
- **Licencja (D4):** jeśli plik `LICENSE` w repozytorium ma już pełny tekst Apache-2.0 w dniu zapisu, pisać „Apache-2.0". Jeśli nie, pisać „deklaruje Apache-2.0". Sprawdzić `git show origin/master:LICENSE | wc -l` (w prime: 15 linii).
- Nie wymieniać `/ss:ingest`, `/ss:orientation`, `/ss:task-delegation` i nie pisać, dokąd trafiły.

**Sekcja 5 (cudze).**
- Tabela 4.2: 10 wierszy. Autorzy zweryfikowani: `impeccable` (pbakaus, Apache-2.0), `hyperframes` (HeyGen, Apache-2.0), **OpenSpec: Fission-AI, MIT** (lokalna instalacja to `@fission-ai/openspec`, npm wskazuje `github.com/Fission-AI/OpenSpec`; to rozstrzyga niejasne „openspec" ze wsadu). Anthropic: `frontend-design`, `commit-commands`, `document-skills`, `skill-creator`, `superpowers` (katalogi oficjalne). `ui-ux-pro-max`: nextlevelbuilder. `claude-seo`: AgriciDaniel.
- **Bez numerów wersji** (wsad ma nieaktualne: `impeccable` 4.1.0 vs 4.5.2, `hyperframes` 0.8.34 vs 0.8.149). Zostaje licencja i adres.
- Wiersz OpenSpec: link wewnętrzny `/blog/opsx-workflow-strukturyzowana-praca-z-ai`.
- Wiersze `impeccable`, `ui-ux-pro-max`, `hyperframes`: **jedno zdanie + odesłanie** do `/blog/slabe-strony-claude-code`, nie powtarzać recenzji.
- Zdanie o OpenSpecu i superpowers: po `/opsx:explore` sięgam, gdy trzeba przemyśleć rzecz przed napisaniem, bo zostawia plik zamiast rozmowy; superpowers używam rzadziej. **Bez słowa „lepszy".**

**Sekcja 6 (czego nie oddaję).** Wzorzec: zamknięcie sesji, rejestr zadań, kontrola spójności kontekstu, pętla publikacji, w prywatnym repozytorium, bez kanału dystrybucji. Wolno opisać jako wzorzec; **nie** obiecywać jako pozycji do wzięcia; **bez odnośnika**. Nie przytaczać nazw wewnętrznych skilli ze wsadu ani cytatu z prywatnego `CLAUDE.md` (repozytorium jest publiczne, więc ten plan też ich nie wymienia). Link wewnętrzny: `/blog/skills-2-0-multi-agent-system-zarzadzanie-firma` (tam wspólna/prywatna część; **uwaga**: tamten tekst opisuje `shared-skills` jako git submodule, obecnie instalacja to wtyczka; nie cytować tamtego stanu jako aktualnego).

**Sekcja 7 (planowanie rozwoju).** Struktura:
1. Stary porządek pytań (czego się nauczyć w kwartale) i nowy (co podłączyć; co dalej muszę umieć ocenić).
2. CRM jako przypadek: kod pisze agent, trzy skille przygotowują propozycje wyglądu, **klient wybiera z kilku propozycji**, `hyperframes` obsługuje wideo (wsad §2.3). Wniosek: zmieniły się zlecenia, które biorę pod uwagę, nie tempo pracy.
3. **D1:** akapit o ocenie SEO, napisany z faktu podanego przez autora. Bez tego akapitu druga połowa tezy stoi na jednej nodze (design ma sprawdzian w kliencie, SEO nie ma żadnego we wsadzie).
4. Granica: umiejętność się nie skończyła, przesunęła się. Jedno zdanie, bez „programiści przestaną być potrzebni".
5. Mostek: ocena wymaga pomiaru z kontrolką, link do `/blog/zmierzone-nie-zalozone`.
**Zakaz:** „zlecenia" w liczbie mnogiej jako fakt; wsad ma **jedno** udokumentowane zlecenie (CRM). Pisać „CRM dla klientów z branży nieruchomości", bez „jednego klienta" i bez liczby klientów.

**Sekcja 8 (jak zacząć).** Dwie komendy w zdaniu (inline code), link do `github.com/200iqlabs/shared-skills` w zdaniu. Ostatnie zdanie praktyczne (np. co zrobić po instalacji), nie podsumowanie ani zaproszenie do kontaktu.

---

## 6. Bloki kodu

Jeden blok w sekcji 4, tag `text` (komendy ukośnikowe sesji, nie powłoki):

````text
```text
/plugin marketplace add 200iqlabs/shared-skills
/plugin install ss@shared-skills
```
````

Forma terminalowa tylko w zdaniu (inline). **Bez kodu poza tym:** to nie poradnik pisania skilli (wsad §5). Układ `.claude-plugin/plugin.json` + `skills/<nazwa>/SKILL.md` + `commands/` opisać zdaniem, nie drzewem, chyba że po napisaniu sekcji 2 brakuje obrazu; wtedy jedno drzewo `text` na 5-6 linii.

---

## 7. Pojęcia: definicja przy pierwszym użyciu (WYMAGANE, także keep-lista)

| Pojęcie | Gdzie pierwsze użycie | Definicja |
|---|---|---|
| **skill** | lead | osobne zdanie tuż po terminie: plik z instrukcją, który agent czyta i dzięki któremu robi to, czego wcześniej nie robił (D5; keep-lista już zawiera „skill/skille") |
| **CRM** | lead | system do prowadzenia klientów i ofert (sformułowanie ze wsadu) |
| **SEO** | lead | pozycjonowanie strony w wyszukiwarce |
| **Agent Skills** | sekcja 1 | otwarty format opisu skilla |
| **wtyczka** | sekcja 2 | paczka skilli, komend, agentów i serwerów MCP instalowana jako całość |
| **katalog wtyczek** | sekcja 2 | katalog z plikiem `marketplace.json`; w komendzie zostaje `marketplace` |
| **manifest wtyczki** | sekcja 2 | plik `.claude-plugin/plugin.json` z nazwą i opisem |
| **MCP** | sekcja 2 (jeśli padnie) | protokół łączenia agenta z zewnętrznymi narzędziami |
| **komenda ukośnikowa** | sekcja 4 | polecenie wpisywane w sesji, zaczyna się od `/` |
| **licencja Apache-2.0** | sekcja 4 | pozwala używać, zmieniać i rozpowszechniać kod, z zachowaniem noty |
| **Codex** | sekcja 4 | wtyczka OpenAI do przeglądu kodu |
| **OpenSpec** | sekcja 5 | narzędzie do pisania specyfikacji przed kodem |
| **Marp, Excalidraw, Mermaid, IP Box, PRD** | tabela 4.1 | dopisać krótkie wyjaśnienie w opisie wiersza lub pod tabelą, jeśli występują |
| **Core Web Vitals** | tylko jeśli padnie przy `claude-seo` | wskaźniki szybkości i stabilności strony |

**Pułapki słownikowe** (brama grep z `.claude/rules/content/10-prosty-polski.md`; wynik musi być pusty albo każdy wynik oceniony ręcznie):
- „wtyczka" w tekście; „plugin" tylko w komendach i nazwach.
- **Nie pisać „proza" ani „prozy"** w tekście dla czytelnika (wsad używa słowa często; nie przenosić).
- Odpadają: ingest*, merge*, render*, deploy*, commitować, fallback, bundle, pipeline (→ „potok"), health-check, handoff, tutorial, checklist.
- „commit" jako rzeczownik zostaje (keep-lista): „robi commit".
- Znaki: **brak U+2014, U+2013, U+2026.** Cytaty z wsadu §2.2 mają em-dash (` — i to nie tylko UI/UX`); w tekście zamienić na ` - ` albo skrócić. Polskie cudzysłowy `„ "` zostają.
- Antytezy-pauzy i „X, nie Y" poza tytułem: unikać.

---

## 8. Linki

**Wewnętrzne (4-5, w zdaniach):**

| Link | Gdzie | Po co |
|---|---|---|
| `/blog/slabe-strony-claude-code` | sekcja 5 | recenzje `ui-ux-pro-max`, `impeccable`, `hyperframes` są tam; nie powtarzać |
| `/blog/skills-2-0-multi-agent-system-zarzadzanie-firma` | sekcja 6 | skąd podział na część wspólną i prywatną (uwaga na stan submodule) |
| `/blog/opsx-workflow-strukturyzowana-praca-z-ai` | sekcja 5, wiersz OpenSpec | opis OpenSpeca |
| `/blog/zmierzone-nie-zalozone` | sekcja 7 | ocena przez pomiar z kontrolką |
| `/blog/system-agentow-ai-skills-rules-kontekst` | sekcja 3 lub w zasobach | anatomia systemu, do którego wchodzą skille |

**Zewnętrzne ze wsadu §7 (każdy w zdaniu):** repozytorium `https://github.com/200iqlabs/shared-skills` (główny cel, w sekcjach 4 i 8), `https://agentskills.io` (sekcja 1), `https://github.com/pbakaus/impeccable` + `https://impeccable.style`, `https://github.com/heygen-com/hyperframes`, **`https://github.com/Fission-AI/OpenSpec`** (nowy, potwierdzony przez npm). Drugorzędne źródła o standardzie: tylko po sprawdzeniu, że się otwierają.

**`## Przydatne zasoby`:** lista z opisami po ` - ` (nie po em-dash, mimo że szablon polecenia tak sugeruje; zakaz znaków ma pierwszeństwo). Powtarza linki z tekstu: repozytorium, `agentskills.io`, dokumentacja wtyczek Claude Code (`https://code.claude.com/docs/en/plugins`), cztery linki wewnętrzne.

---

## 9. CTA (blok HTML, kolejność: Kluczowe wnioski → CTA → Przydatne zasoby → FAQ)

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz wiedzieć, które skille podłączyć w swojej pracy?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci dobrać skille do Twoich zleceń i ustalić, co dalej musisz umieć ocenić sam, zanim komuś pokażesz wynik.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

**D3 (domyślnie):** blok zostaje jako element szablonu bloga; **zamknięcie prozy (sekcja 8) nie zawiera żadnej prośby o kontakt**, zgodnie ze wsadem §3 pkt 10 i §5. Blok nie jest bramką: nie zbiera adresu, nie zamyka listy. Jeśli autor woli wsad dosłownie, usunąć blok i odnotować wyjątek od szablonu.

---

## 10. SEO

- **Słowo główne:** „skille Claude Code" (tytuł, lead, H2 sekcji 1 pośrednio).
- **Poboczne:** Agent Skills, wtyczki Claude Code, lista skilli, `shared-skills`, instalacja wtyczki Claude Code, przegląd kodu Codex (przy dwóch pozycjach).
- **H2 z naturalnymi słowami kluczowymi:** „Agent Skills: otwarty format...", „Dlaczego ten format jest tani", „Stan podłączenia: 29 wtyczek z 8 katalogów", „Moje skille do wzięcia za darmo", „Cudze skille i narzędzia...".
- **Slug:** 4 słowa, wiążący. **Excerpt:** 152 znaki. **Title:** 57 znaków.
- **AEO:** definicje w pierwszych zdaniach sekcji, tabele z nazwami pozycji, FAQ z odpowiedziami zaczynającymi się od kluczowej informacji. Schemat FAQPage generuje się z HTML.
- **Tabele** (19 + 10 wierszy) to treść cytowalna przez wyszukiwarki odpowiedzi; nagłówki kolumn pełnymi słowami („Pozycja", „Co robi", „Autor").

---

## 11. FAQ (6 pytań, `<details open>` + `<summary>` z H3, odpowiedź 2-4 zdania)

| # | Pytanie | Rdzeń odpowiedzi (fakt + źródło) |
|---|---|---|
| 1 | Czym jest skill w Claude Code i czym różni się od wtyczki? | skill = folder z `SKILL.md` (nazwa, opis, instrukcje); wtyczka = paczka skilli, komend, agentów i serwerów MCP instalowana jako całość (dok. Claude Code, `agentskills.io`) |
| 2 | Czy skille napisane dla Claude Code zadziałają w innych narzędziach, na przykład w Cursorze albo VS Code? | format tak (otwarty standard, wiele narzędzi na `agentskills.io`); manifest wtyczki i katalog instalacji nie, bo to konwencje narzędzia; przykład: Gemini CLI szuka w `.agents/skills/` |
| 3 | Czy mogę używać skilli z repozytorium shared-skills w projektach komercyjnych? | **zależy od D4**: jeśli `LICENSE` ma pełny tekst, „tak, Apache-2.0 na to pozwala przy zachowaniu noty"; jeśli nie, „repozytorium deklaruje Apache-2.0; sprawdź plik LICENSE" |
| 4 | Czy `/ss:review-fix` i `/ss:review-loop` są darmowe? | skille tak; przegląd robi Codex, wymaga planu ChatGPT z Codexem, każda runda zużywa limit planu (README repozytorium) |
| 5 | Czy instalowanie cudzych skilli i wtyczek jest bezpieczne? | wtyczka wykonuje kod z uprawnieniami użytkownika; przeczytaj przed instalacją; dokumentacja Claude Code ma stronę o zaufaniu; `/ss:find-skills` instaluje po audycie bezpieczeństwa |
| 6 | Ile skilli i wtyczek warto mieć podłączonych naraz? | brak magicznej liczby; nazwa i opis każdego włączonego skilla są w kontekście w każdej turze; trzymaj to, czego używasz; dokumentacja ma sposób mierzenia kosztu wtyczki |

Bez liczb, których nie ma w źródle. Odpowiedź 2 nie obiecuje, że „wszystko działa wszędzie".

---

## 12. Rejestr twierdzeń i otwarte decyzje

### Rejestr (technical accuracy checklist)

| Twierdzenie | Źródło | Stan 2026-10-12 | Ograniczenie |
|---|---|---|---|
| 29 wtyczek z 8 katalogów | lista zainstalowanych wtyczek | zweryfikowane | tło, nie teza |
| 19 pozycji w tabeli 4.1 | README `origin/master` `16359dc` | zweryfikowane | bez sumy „20", bez „pełna lista" |
| Instalacja dwiema komendami | README + dok. Claude Code | zweryfikowane | tag `text` |
| Dwie pozycje wymagają planu ChatGPT z Codexem | README, „Codex review prerequisite" | zweryfikowane | w tym samym miejscu co wiersze |
| Standard otwarty, adopcja | `agentskills.io` | zweryfikowane | bez daty i liczby |
| Specyfikacja nie definiuje manifestu ani katalogu instalacji | strona specyfikacji | zweryfikowane | wprost w sekcji 2 |
| Ścieżki `.claude/skills/`, `.agents/skills/` | repo + dok. Gemini CLI | zweryfikowane | bez ścieżki Antigravity |
| Koszt kontekstu, kod z uprawnieniami użytkownika | dok. Claude Code | zweryfikowane | bez liczby „za dużo" |
| Licencje `impeccable`, `hyperframes`, OpenSpec | npm | zweryfikowane | bez wersji |
| Apache-2.0 repozytorium `shared-skills` | README, `plugin.json`, `marketplace.json` | zadeklarowane; plik LICENSE niepełny | zależnie od D4 |
| CRM, trzy skille, wybór klienta, `hyperframes` | wsad §2.3 (własne słowa autora) | tylko wsad | bez nazw klientów, bez liczby klientów |
| „Nie znam się na designie ani SEO" | wsad §2.2 | tylko wsad | blisko oryginału |
| Mechanizm oceny SEO | brak we wsadzie | **brak** | D1 |

### Decyzje i domyślne ustawienia planu

| # | Sprawa | Domyślnie w tym planie | Kto rozstrzyga |
|---|---|---|---|
| **D1** | Czym autor sprawdza wynik SEO, skoro nie zna dziedziny? | **Brak domyślnej.** Akapit w sekcji 7 wymaga faktu od autora. Nie wymyślać metody | **Autor, przed `execute`** (jedyny bloker) |
| D2 | Liczba skilli (20 vs 19, pominięty `linkedin-content`) | „19 pozycji" + zdanie o zwiniętych wariantach; bez sumy i bez „pełna lista" | autor, jeśli chce inaczej |
| D3 | CTA vs „bez prośby o kontakt" | blok szablonu zostaje, zamknięcie bez prośby | autor |
| D4 | Licencja (LICENSE niepełny) | poprawić repozytorium przed publikacją; w artykule „Apache-2.0" tylko gdy plik poprawiony, inaczej „deklaruje" | autor (repozytorium `shared-skills`) |
| D5 | Definicja „skill": zdanie, nie nawias | osobne zdanie tuż po pierwszym użyciu (zgodne z `10-prosty-polski.md`) | domyślne bez pytania |
| D6 | Kategoria | `AI` | autor, jeśli woli `Code` |
| D7 | Tytuł | „Skille Claude Code: kompetencję się instaluje, nie nabywa" | autor |
| D8 | Źródła wtórne o standardzie | `agentskills.io` jako główne; dwa wtórne tylko po sprawdzeniu | domyślne bez pytania |
| D9 | OpenSpec: autor i link | Fission-AI, `github.com/Fission-AI/OpenSpec` (potwierdzone lokalną instalacją i npm) | domyślne bez pytania |

---

## 13. Lista kontrolna dla `execute`

**Przed pisaniem**
- [ ] Odpowiedź autora na D1. Bez niej nie pisać sekcji 7 pkt 3 (reszta artykułu może powstać).
- [ ] Odczytać łańcuch DOX: `AGENTS.md`, `src/AGENTS.md`, `src/content/AGENTS.md`, `src/content/blog/AGENTS.md` (w tej sesji załadowane; po `execute` w nowej sesji przeczytać ponownie).
- [ ] Ponowny odczyt `origin/master` repozytorium `shared-skills` (commit, README, LICENSE) tuż przed zapisem tabel.
- [ ] Przeczytać dokładnie jeden artykuł o podobnej strukturze dla rytmu: `zmierzone-nie-zalozone` (zakończenie: wnioski → CTA → zasoby → FAQ).

**Pliki**
- [ ] Utworzyć `src/content/blog/skille-ktore-mam-podlaczone.md` (nazwa = slug).
- [ ] Wygenerować OG `public/images/og-skille-ktore-mam-podlaczone.webp` (osobna komenda `generate-og-prompt` + trzy kroki potoku).
- [ ] **Nie** dodawać pliku w `src/content/blog/en/` i **nie** ustawiać `alternateSlug`.

**Po napisaniu**
- [ ] `grep -nP '[\x{2014}\x{2013}\x{2026}]' src/content/blog/skille-ktore-mam-podlaczone.md` pusty.
- [ ] Brama słownikowa z `10-prosty-polski.md` na tym pliku; każde trafienie oceniane ręcznie.
- [ ] Brak słów „proza", „prozy" w tekście dla czytelnika.
- [ ] Brak numerów wersji, brak nazw klientów, brak nazw prywatnych skilli, brak `ingest`.
- [ ] Każde pojęcie z sekcji 7 zdefiniowane przy pierwszym użyciu.
- [ ] Wszystkie bloki kodu mają tag języka.
- [ ] `npm run blog:sitemap`, `npm run og:check`, testy: `blog`, `language-switcher-blog`, `breadcrumbs` (mapa w `.claude/rules/playwright/30-testing.md`).
- [ ] Przejście DOX: ten artykuł nie zmienia kontraktu żadnego folderu, więc zapisać „bez zmian w `AGENTS.md`".

**Poza tym repozytorium (przed publikacją, wsad §9)**
- [ ] `shared-skills`: pełny tekst licencji, porządek w README (dwie atrapy `marketing` i `product-manager` oznaczone „Planned").
- [ ] Przed `blog-article-writer:archive`: zredagować we wsadzie ścieżki prywatne i nazwy prywatnych skilli (repozytorium portfolio jest publiczne).
