# Prime Context: 5 repozytoriów GitHub dla Claude Code

## Źródła

### Materiał główny
- Transkrypcja wideo (docs/blog/context.md) — angielskojęzyczne nagranie prezentujące 5 repozytoriów GitHub
- Notatki autora z modyfikacjami: zastąpienie GSD → OpenSpec, n8n MCP → Excalidraw

### Modyfikacje autora vs oryginał wideo

| # | Oryginał (wideo) | Wersja Pawła | Powód zmiany |
|---|---|---|---|
| 1 | UI/UX Pro Max | UI/UX Pro Max | Bez zmian — Paweł używa tego skilla |
| 2 | GSD (Get Stuff Done) | OpenSpec (OPSX) | Paweł korzysta z OpenSpec, ma osobny artykuł o OPSX |
| 3 | n8n MCP Server | Excalidraw | Paweł nie używa n8n (preferuje kod/backend), korzysta z Excalidraw do diagramów i mapowania procesów |
| 4 | Obsidian Skills | Obsidian Skills | Bez zmian — Paweł ma artykuł o Obsidian + Claude Code |
| 5 | Awesome Claude Code | Awesome Claude Code | Bez zmian |

## Linki do repozytoriów

1. **UI/UX Pro Max**: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
2. **OpenSpec**: https://openspec.dev/ + https://github.com/Fission-AI/OpenSpec/
3. **Obsidian Skills**: https://github.com/kepano/obsidian-skills
4. **Awesome Claude Code**: https://github.com/hesreallyhim/awesome-claude-code
5. **Excalidraw**:
   - Produkt: https://plus.excalidraw.com/
   - Skill do tłumaczenia koncepcji: https://github.com/coleam00/excalidraw-diagram-skill
   - Skill do mapowania procesów (shared-skills): https://github.com/200iqlabs/shared-skills

## Kluczowe tematy i koncepcje

### 1. UI/UX Pro Max
- Skill do projektowania frontend — "design system on steroids"
- Inteligentna generacja design system'ów dopasowanych do typu projektu
- Rozwiązuje problem "generic AI slop" — generyczny wygląd stron tworzonych przez AI
- **Wartość:** pozwala odejść od generycznych interfejsów na rzecz spersonalizowanych designów

### 2. OpenSpec (OPSX)
- Spec-driven development framework
- Zarządza sub-agentami i context window rot automatycznie
- Idealny do budowania projektów from scratch
- **Paweł ma już artykuł:** `/blog/opsx-workflow-strukturyzowana-praca-z-ai`
- **Wartość:** strukturyzowane podejście do rozwoju oprogramowania z AI

### 3. Excalidraw
- Narzędzie do tworzenia diagramów różnej maści
- Paweł wcześniej używał Mermaid, ale wyglądało "średnio" i brakowało informacji
- Dwa zastosowania:
  - **Tłumaczenie koncepcji** (excalidraw-diagram-skill od Cole'a Medina)
  - **Mapowanie procesów dla klientów** (shared-skills od 200iqlabs)
- **Wartość:** wizualna komunikacja idei i procesów bezpośrednio z terminala

### 4. Obsidian Skills
- Połączenie Claude Code + Obsidian jako "second brain"
- Pamięć długoterminowa dla agenta AI
- **Paweł ma artykuł:** `/blog/second-brain-obsidian-claude-code-skills`
- **Wartość:** AI, które pamięta i organizuje wiedzę

### 5. Awesome Claude Code
- Zbiór skills, workflows, toolings, commands
- "One-stop shop" dla rozszerzenia Claude Code
- **Wartość:** gotowe zasoby do natychmiastowego doładowania productivity

## Profil grupy docelowej

- **Główna:** Programiści i tech leads używający Claude Code, którzy chcą zwiększyć produktywność
- **Dodatkowa:** Osoby rozważające Claude Code, które chcą zobaczyć ekosystem i możliwości
- **Poziom wiedzy:** Średnio-zaawansowany — znają Claude Code, ale nie eksplorują ekosystemu GitHub
- **Ból:** Nie wiedzą gdzie szukać rozszerzeń, używają Claude Code "vanilla"

## Unikalny kąt / value proposition

- **Perspektywa praktyka:** Paweł nie poleca wszystkiego z wideo — zamienił 2/5 pozycji na narzędzia które SAM faktycznie używa
- **Osobista kuracja:** Nie jest to zwykła lista "top 5" — każde repo jest przetestowane w produkcyjnym workflow
- **Cross-referencing:** Artykuły o OpenSpec i Obsidian już istnieją na blogu — linkowanie wewnętrzne
- **Excalidraw jako zamiennik n8n MCP:** Pokazuje podejście "code-first" vs no-code (Paweł pisze o tym w artykule o Zapier/Make/n8n)

## Powiązane artykuły do cross-linkowania

- `/blog/5-technik-pracy-z-claude-code` (id: 10) — techniki Claude Code
- `/blog/second-brain-obsidian-claude-code-skills` (id: 16) — Obsidian + Claude Code
- `/blog/opsx-workflow-strukturyzowana-praca-z-ai` (id: 19) — OpenSpec workflow
- `/blog/srodowisko-agentowe-ai-dwie-firmy` (id: 22) — środowisko agentowe, skills, architektura
- `/blog/skills-2-0-multi-agent-system-zarzadzanie-firma` (id: 21) — Skills 2.0 multi-agent
- `/blog/zapier-vs-make-vs-n8n-wybor-narzedzia` (id: 5) — porównanie narzędzi automatyzacji (kontekst dla Excalidraw vs n8n)
- `/blog/vibe-coding-przewodnik` (id: 14) — vibe coding

## Wzorce stylu zaobserwowane w istniejących artykułach

- **Hook:** 1-2 zdania, często osobiste doświadczenie lub prowokacyjne stwierdzenie
- **Struktura:** Problem → Rozwiązanie → Szczegóły → Wnioski
- **Ton:** Bezpośredni, praktyczny, pierwsza osoba
- **Techniczny:** Angielskie terminy w kontekście technicznym, polskie wyjaśnienia
- **Długość:** 2000-3000 słów (14 min readTime dla dłuższych)
- **FAQ:** 4-6 pytań w `<details open>` z `<summary>`
- **CTA:** HTML z Tailwind, link do `/#contact`
- **Bloki kodu:** Zawsze z tagiem języka (text, markdown, yaml, javascript)

## Następny ID artykułu

- Najwyższy obecny ID: **22** (srodowisko-agentowe-ai-dwie-firmy)
- Nowy artykuł: **id: 23**

## Kod / przykłady do uwzględnienia

- Nie wymaga bloków kodu programistycznego — artykuł jest listowy/przegladowy
- Można pokazać strukturę folderów skills
- Screenshots lub opisy UI/UX Pro Max output vs generic AI
- Ewentualnie przykład komendy OpenSpec (`/opsx:new`, `/opsx:ff`)

## Notatki do planowania

- Artykuł typu "listicle" / curated list — kategoria **Code** (narzędzia programowania)
- Inspiracja wideo, ale z osobistym filtrem Pawła
- Każde repo powinno mieć: co to jest, dlaczego warto, link, osobiste doświadczenie
- Ważne: wyjaśnić DLACZEGO zamienił GSD na OpenSpec i n8n MCP na Excalidraw (autentyczność)
- readTime: ~10-12 min (artykuł listowy, krótszy niż full how-to)
