# Plan: 5 repozytoriów GitHub dla Claude Code

## Frontmatter

```yaml
---
id: 23
slug: 5-repozytoriow-github-claude-code
title: "5 repozytoriów GitHub, które zmienią Twoją pracę z Claude Code"
excerpt: "Testuję dziesiątki narzędzi — te 5 repozytoriów naprawdę zrobiło różnicę w mojej codziennej pracy z Claude Code. Oto moja sprawdzona lista."
category: Code
author: Pawel Lipowczan
date: 2026-03-31
readTime: 12 min
image: /images/og-5-repozytoriow-github-claude-code.webp
tags:
  - Claude Code
  - GitHub
  - Skills
  - Developer Tools
  - Produktywność
---
```

## Struktura artykułu

### Wprowadzenie (~250 słów)

**Hook:** Osobiste doświadczenie — Claude Code "vanilla" vs z ekosystemem. Analogia: to jak używanie smartfona bez aplikacji.

**Kontekst:** Ekosystem Claude Code rośnie — skills, MCP servers, frameworki. Trudno oddzielić sygnał od szumu.

**Value preview:** 5 repozytoriów, które Paweł faktycznie testował i używa w produkcji. Nie lista skopiowana z curated repo — osobisty filtr.

**Ważne:** Wspomnieć że inspiracją było wideo (community), ale lista jest przefiltrowana — 2 z 5 pozycji zamienione na narzędzia, które lepiej pasują do jego workflow.

### 1. UI/UX Pro Max — koniec z generycznym AI slop (~400 słów)

**H2:** `## 1. UI/UX Pro Max — koniec z generycznym AI slop`

- **Co to jest:** Skill do generowania design system'ów dopasowanych do typu projektu
- **Problem który rozwiązuje:** Wszystkie strony generowane przez AI wyglądają tak samo — ten sam layout, te same kolory, te same komponenty
- **Jak działa:** Inteligentna selekcja systemu designu na podstawie tego CO budujesz (portfolio vs SaaS vs e-commerce)
- **Osobiste doświadczenie:** Jak Paweł używa tego w połączeniu z Tailwind i React
- **Link:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

### 2. OpenSpec (OPSX) — strukturyzowany development z AI (~500 słów)

**H2:** `## 2. OpenSpec — strukturyzowany development zamiast chaosu`

- **Co to jest:** Spec-driven development framework żyjący na Claude Code
- **Problem który rozwiązuje:** Context window rot, brak struktury, chaotyczne sesje
- **Dlaczego OpenSpec zamiast GSD (z oryginalnego wideo):** Osobiste doświadczenie — OpenSpec lepiej pasuje do workflow, używa go codziennie
- **Kluczowe komendy:** `/opsx:new`, `/opsx:ff`, `/opsx:apply`, `/opsx:verify`
- **Blok kodu:** Przykład workflow (text/markdown)
- **Cross-link:** [pełny artykuł o OpenSpec](/blog/opsx-workflow-strukturyzowana-praca-z-ai)
- **Link:** https://openspec.dev/ + https://github.com/Fission-AI/OpenSpec/

### 3. Excalidraw — wizualna komunikacja prosto z terminala (~450 słów)

**H2:** `## 3. Excalidraw — diagramy i mapowanie procesów z AI`

- **Co to jest:** Narzędzie do tworzenia diagramów, z integracją Claude Code przez skills
- **Dlaczego Excalidraw zamiast n8n MCP (z oryginalnego wideo):** Paweł nie korzysta z n8n — preferuje pisanie kodu bezpośrednio. Excalidraw rozwiązuje inny problem: komunikację wizualną.
- **Wcześniej:** Mermaid — wyglądało średnio, brakowało informacji
- **Dwa zastosowania:**
  - Tłumaczenie koncepcji technicznych (excalidraw-diagram-skill)
  - Mapowanie procesów dla klientów (shared-skills)
- **Cross-link:** [porównanie narzędzi automatyzacji](/blog/zapier-vs-make-vs-n8n-wybor-narzedzia) — kontekst dlaczego kod zamiast no-code
- **Linki:**
  - https://plus.excalidraw.com/
  - https://github.com/coleam00/excalidraw-diagram-skill
  - https://github.com/200iqlabs/shared-skills

### 4. Obsidian Skills — second brain dla Claude Code (~400 słów)

**H2:** `## 4. Obsidian Skills — pamięć długoterminowa dla agenta AI`

- **Co to jest:** Zestaw skills łączących Claude Code z Obsidian
- **Problem który rozwiązuje:** Claude Code nie ma pamięci między sesjami (poza CLAUDE.md)
- **Wartość:** Obsidian jako "second brain" — pliki markdown dostępne bezpośrednio z terminala
- **Osobiste doświadczenie:** Link do pełnego artykułu o tym jak Paweł buduje swój second brain
- **Cross-link:** [artykuł o Obsidian + Claude Code](/blog/second-brain-obsidian-claude-code-skills)
- **Link:** https://github.com/kepano/obsidian-skills

### 5. Awesome Claude Code — punkt startu dla każdego (~350 słów)

**H2:** `## 5. Awesome Claude Code — one-stop shop na start`

- **Co to jest:** Curated lista skills, workflows, narzędzi, komend
- **Dla kogo:** Idealny punkt startu — jeśli nie wiesz od czego zacząć, zacznij tutaj
- **Co znajdziesz:** Skills, MCP servers, workflows, prompts, community resources
- **Wartość:** Oszczędność czasu na research — ktoś już przefiltrował dostępne zasoby
- **Link:** https://github.com/hesreallyhim/awesome-claude-code

### Jak wybrać odpowiednie repo dla siebie (~300 słów)

**H2:** `## Jak wybrać — mapa decyzyjna`

- Tabela/lista decyzyjna:
  - Budujesz frontend? → UI/UX Pro Max
  - Zaczynasz nowy projekt? → OpenSpec
  - Potrzebujesz wizualizacji? → Excalidraw
  - Chcesz pamięć między sesjami? → Obsidian Skills
  - Nie wiesz od czego zacząć? → Awesome Claude Code

### Kluczowe wnioski (~200 słów)

**H2:** `## Kluczowe wnioski`

1. Claude Code "vanilla" to dopiero początek — ekosystem skills zmienia zasady gry
2. Nie instaluj wszystkiego naraz — wybierz 1-2 repo pasujące do Twojego aktualnego problemu
3. Skills > MCP servers dla większości use cases (progressive disclosure vs context bloat)
4. Testuj osobiście — każdy workflow jest inny, moja lista ≠ Twoja lista
5. Community jest kluczowe — najlepsze narzędzia powstają w open source

### CTA

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz skonfigurować Claude Code pod swój workflow?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci wybrać odpowiednie skills i narzędzia, skonfigurować środowisko agentowe i zbudować workflow, który naprawdę przyspieszy Twoją pracę.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

### Przydatne zasoby

**H2:** `## Przydatne zasoby`

- Linki do wszystkich 5 repozytoriów (z opisami)
- Linki do powiązanych artykułów na blogu
- Link do Claude Code dokumentacji

### FAQ (6 pytań)

**H2:** `## FAQ`

Każde w `<details open><summary>### pytanie</summary>odpowiedź</details>`

1. **Czy te repozytoria działają z najnowszą wersją Claude Code?**
   — Tak, wszystkie są aktywnie rozwijane. Sprawdź daty ostatnich commitów na GitHub.

2. **Czy mogę używać kilku skills jednocześnie w jednym projekcie?**
   — Tak, skills ładują się dynamicznie dzięki progressive disclosure. Nie bloatują context window.

3. **Czy UI/UX Pro Max zastępuje wiedzę o designie i CSS?**
   — Nie zastępuje, ale wyrównuje szanse. Programista bez doświadczenia w UI dostanie spójny, profesjonalny design zamiast generycznego.

4. **Czym różni się OpenSpec od innych frameworków jak GSD czy Claude Engineer?**
   — OpenSpec to spec-driven development — najpierw specyfikacja, potem implementacja. Inne frameworki często skupiają się na generowaniu kodu.

5. **Czy Excalidraw wymaga płatnej subskrypcji?**
   — Excalidraw jest open source i darmowy. Excalidraw+ ma dodatkowe funkcje, ale skill Claude Code działa z darmową wersją.

6. **Od którego repozytorium powinienem zacząć jeśli dopiero zaczynam z Claude Code?**
   — Od Awesome Claude Code — to curated lista z której możesz wybrać to co pasuje do Twoich potrzeb. Potem dodaj OpenSpec do strukturyzowania pracy.

## SEO

- **Primary keyword:** repozytoria GitHub Claude Code
- **Secondary:** skills Claude Code, produktywność Claude Code, narzędzia Claude Code
- **Internal links:** 4-5 cross-linków do istniejących artykułów
- **External links:** 5 linków do repozytoriów + dokumentacja

## Szacowana długość

- Wprowadzenie: ~250 słów
- 5 sekcji repo: ~2100 słów
- Mapa decyzyjna: ~300 słów
- Wnioski: ~200 słów
- Zasoby: ~100 słów
- FAQ: ~400 słów
- **Razem: ~3350 słów → readTime: 12 min**

## Bloki kodu zaplanowane

1. Przykład workflow OpenSpec (tag: `text`)
2. Struktura folderów skills (tag: `text`)
3. Ewentualnie: przykład komendy OpenSpec (tag: `bash`)
