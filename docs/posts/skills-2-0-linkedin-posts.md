# Skills 2.0 — Posty LinkedIn (seria 3 postow)

Promocja artykulu: **"Skills 2.0 - jak buduje system wieloagentowy do zarzadzania firma"**
Blog: pawel.lipowczan.pl

---

## Mapowanie animacji

| # | Tytul posta | Animacja Remotion | Format | Czas | Build |
|---|---|---|---|---|---|
| 1 | Od chaosu do systemu | `SkillsChaosToSystem` | 1080x1080 | 25s | `npm run build:skills-chaos` |
| 2 | 8 agentow, 3 repozytoria | `SkillsAgentsArchitecture` | 1080x1350 | 30s | `npm run build:skills-agents` |
| 3 | 20 minut do produkcyjnego agenta | `SkillsCreatorWorkflow` | 1080x1080 | 25s | `npm run build:skills-creator` |

**Build all:** `cd remotion && npm run build:skills-series`

**Kolejnosc publikacji:** 1 → 2 → 3 (problem → architektura → rozwiazanie)

---

## POST 1: Od chaosu do systemu

**Animacja:** `SkillsChaosToSystem` | 1080x1080 | 25s

**Co widac w animacji:**
- 0-10s: "AI w Twojej firmie?" + 4 karty problemow z glitch effectem (Brak orkiestracji, Brak wersjonowania, Brak testow, Brak separacji kontekstow) — czerwona poswiate
- 10-20s: Tytul "Skills 2.0" gradient purple/blue + tabela Before/After (Prompty -> SKILL.md + evals, Zero testow -> Automatyczne benchmarks, Copy-paste -> Git + versioning, Brak wersji -> Trigger tuning) + badge "OTWARTY STANDARD"
- 20-25s: CTA — pawel.lipowczan.pl + "Zostaw SKILL w komentarzu"

### Tresc posta

AI w Twojej firmie to chaos?

Prompty rozrzucone po Claude Projects.
Notatki w Obsidian, ktore nikt nie otwiera.
Kazdy agent zaczyna od zera — bo nie ma czego dziedziczyc.

Tak wygladal moj system tydzien temu.

→ Brak orkiestracji
→ Brak wersjonowania
→ Brak testow
→ Brak separacji kontekstow

Kazdy nowy agent = nowy prompt od zera.
Kazda zmiana = modlitwa, ze nic sie nie zepsuje.

Dzis mam Skills 2.0 — otwarty standard, ktory zamienia chaos w inzynierie:

Prompty → SKILL.md + evals
Zero testow → Automatyczne benchmarks
Copy-paste → Git + versioning
Brak wersji → Trigger tuning

Kazdy skill ma testy, benchmarki i pelna historie zmian.

Jak w normalnym software — tylko ze dla agentow AI.

Roznica? Agent z evals nie "chyba dziala".
On ma 97.3% pass rate i 12/12 przejsciowych testow.

Pelny przewodnik (14 min czytania) na blogu:
pawel.lipowczan.pl

Chcesz zobaczyc repo? Zostaw SKILL w komentarzu — wysle link.

Repo jest w fazie rozwoju. Wiecej skilli w drodze.

#AI #AgentAI #Automatyzacja #Skills #OpenSource #MultiAgent

---

## POST 2: 8 agentow, 3 repozytoria

**Animacja:** `SkillsAgentsArchitecture` | 1080x1350 portrait | 30s

**Co widac w animacji:**
- 0-5s: "Ile agentow potrzebujesz do zarzadzania firma?" + counter animacja 0->8 z fioletowa poswiate
- 5-15s: 3 glassmorphism boxy repozytoriow (agentic-ai-system, agentic-ai-private, shared-skills) + animowana linia przerywana "git submodule -> shared-skills"
- 15-24s: siatka 2x4 kart agentow — CFO, Tax Advisor, Legal, Marketing (zielone = active), Business Consultant, Product Manager, Coach, LinkedIn (zolte = in dev) + legenda
- 24-30s: CTA — pawel.lipowczan.pl + "Zostaw SKILL w komentarzu"

### Tresc posta

8 agentow. 3 repozytoria. Jeden system.

Kiedy mowisz "wdroze AI w firmie" — co to wlasciwie znaczy?

Dla mnie znaczy architekture, ktora:
- skaluje sie bez chaosu
- separuje dane miedzy kontekstami
- pozwala testowac kazdego agenta osobno

Moja architektura wieloagentowa:

shared-skills (publiczne, open source)
→ Reuzywalne SKILL.md — otwarty standard, kazdy moze uzyc

agentic-ai-system (prywatne)
→ Orkiestracja agentow, konfiguracja, pipeline'y

agentic-ai-private (prywatne)
→ Dane klientow, klucze API, konteksty biznesowe

Polaczone git submodulami.
Kazdy agent widzi tylko to, co powinien widziec.
Zero wycieku kontekstu miedzy klientami.

Aktywni agenci:
→ CFO — analiza finansowa, runway, cash flow
→ Tax Advisor — optymalizacja podatkowa JDG/PSA
→ Legal — umowy, RODO, compliance
→ Marketing — content, strategia, kampanie

W budowie:
→ Business Consultant, Product Manager, Coach, LinkedIn

Wazne: nie zaczalem od osmiu.
Zaczalem od jednego — CFO.
Reszte dodawalem kiedy widzialem realna potrzebe, nie kiedy brzmialo fajnie.

Pelny opis architektury na blogu:
pawel.lipowczan.pl

Chcesz zobaczyc repo? Zostaw SKILL — wysle link.

#AI #MultiAgent #SystemDesign #Automatyzacja #GitOps #OpenSource

---

## POST 3: 20 minut do produkcyjnego agenta

**Animacja:** `SkillsCreatorWorkflow` | 1080x1080 | 25s

**Co widac w animacji:**
- 0-5s: Split screen — counter 0->120 min (czerwony, "Reczna praca") vs 0->20 min (zielony, "Skill-creator")
- 5-15s: 7-krokowy pipeline (Intent -> Interview -> Draft -> Test -> Evaluate -> Iterate -> Package) z animowanymi polaczeniami i zielonym pulsem
- 15-20s: Terminal z wpisywanymi komendami: `/skill-creator`, intent, "Generating SKILL.md...", "Running evals...", "12/12 evals passed", "Pass rate: 97.3%"
- 20-25s: CTA — pawel.lipowczan.pl + "Zostaw SKILL w komentarzu"

### Tresc posta

2 godziny recznej pracy vs 20 minut z skill-creatorem.

Budowanie agenta AI recznie:
- piszesz prompt
- testujesz recznie
- poprawiasz
- testujesz znowu
- modlisz sie zeby dzialal na edge case'ach

Rezultat: 2h pracy i agent ktory "chyba dziala".

Skill-creator to plugin Anthropic, ktory prowadzi Cie przez 7 krokow:

1. Intent — opisujesz co agent ma robic
2. Interview — AI dopytuje o edge case'y i granice
3. Draft — generuje SKILL.md z pelna struktura
4. Test — uruchamia na prawdziwych danych
5. Evaluate — mierzy accuracy, completeness, actionability
6. Iterate — poprawia to co nie przeszlo
7. Package — gotowy skill do wdrozenia

Na koncu dostajesz agenta z testami, benchmarkami i pass rate.

Moj CFO agent:
→ 12/12 evals passed
→ 97.3% pass rate
→ Gotowy w 20 minut

Nie "chyba dziala". Dziala — i mam na to dowod.

Caly proces krok po kroku na blogu:
pawel.lipowczan.pl

Chcesz zobaczyc jak to wyglada w praktyce?
Zostaw SKILL — wysle link do repo.

#AI #AgentAI #Automation #SkillCreator #Productivity #NoCode
