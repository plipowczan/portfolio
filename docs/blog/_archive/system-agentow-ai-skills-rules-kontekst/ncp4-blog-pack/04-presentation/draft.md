# Jak 2 założycieli robi robotę całego zespołu — draft

> Format: talk, 30 min, ~32 slajdy. Polski, theme plsoft-dark.
> Content only. Marp markup → /slides:build.

## Slide 1 — Title (intro, statyczny)

**Jak 2 założycieli robi robotę całego zespołu**

System agentów AI w 200IQ LABS

[obraz: portret-pawel.jpg, circle mask, prawy róg]
[obraz: logo_white.png, mały, dolny róg]

NoCode Poland #4  •  IKM Gdańsk  •  2026-05-07

> note: slajd wisi zanim ruszysz. Po starcie kliknięcie → mem.

## Slide 2 — Mem cold open

[obraz pełen ekranu: meme-distracted-boyfriend.png]

> note: ~30s. "Pisałem to miesiąc temu — i już bałem się, że będzie nieaktualne. Wnioski: nie kopiujcie setupu, wyciągajcie zasady."

## Slide 3 — Przedstawienie

**Paweł Lipowczan**

CTO 200IQ LABS · twórca Qamera AI

17 lat w IT — od .NET-a, przez automatyzację, do agentów AI

[obraz: portret-pawel.jpg, prawa strona slajdu]

> note: ~30s, dwa zdania. "...których codziennie używam żeby ogarniać firmę w dwójkę."

## Slide 4 — Hook

**Prowadzę startup w dwójkę.**

Bez działu finansów, marketingu, prawnego, PM-u.

A budujemy SaaS, świadczymy consulting, rozwijamy biznes.

**Zamiast rekrutować — zbudowaliśmy system agentów AI.**

> note: ~45s. Pauza po pierwszej linijce. Mocne wejście w temat.

## Slide 5 — Evolution narrative

**To nie nowa koncepcja. Kolejna iteracja.**

| Lata wcześniej | 2026 | Dziś u nas |
|---|---|---|
| **Automation House** | **gstack** (Garry Tan) | **shared-skills** |
| board of advisors | 23 agenty (CEO, Designer, QA) | agenty dla biznesu |
| prompt-only | DevOps stack | + Python skrypty |
| — | ~89.4k ⭐ | open-source |

> note: ~1.5 min. Disarmuje sceptyków. "To nie hype-driven — to ewolucja, która działa od lat. Pokażę MOJĄ wersję."

## Slide 6 — gstack social proof

[obraz pełen ekranu: gstack-screenshot.png]

**89.4k ⭐ na GitHubie**

Garry Tan (CEO Y Combinator) — ten sam wzorzec, lepsze narzędzia

> note: ~20s. Wzmacnia narrative. Garry Tan to autorytet, którego publiczność tech zna.

## Slide 7 — Key takeaway #1

# Context engineering  >  prompt engineering

Architektura systemu jest ważniejsza niż "jaki prompt wpisać do ChatGPT".

> note: ~30s. Pauza. Pozwól tej myśli usiąść. To **główny** takeaway prelekcji.

## Slide 8 — Architektura (diagram)

[obraz pełen ekranu: architecture.png]

Główny agent → subagenty (CFO, Marketing, Legal, Tax, BC) → kontekst → narzędzia (Python + MCP)

> note: ~2 min. Przejdź przez warstwy. Główny → subagenty → kontekst → narzędzia. Pokaż że hybryda Python/MCP jest świadomą decyzją, nie kompromisem.

## Slide 9 — Key takeaway #2

# Python skrypt zawsze, kiedy możemy.
# MCP, kiedy musimy.

> note: ~20s. Mocna pointa. Pauza.

## Slide 10 — Hybryda w praktyce

| Integracja | Podejście | Dlaczego |
|---|---|---|
| Stripe, Revolut, Airtable | **Python** | własny wrapper, deterministic |
| **infakt** (księgowość) | **MCP** | API wymusza — biuro księgowe blokuje |
| **Qamera AI** (nasz produkt) | **MCP** | my **wystawiamy** — żeby cudzy agent mógł |

**Python > MCP gdy mamy wybór:** mniej tokenów, determinizm, trywialne tworzenie.

> note: ~2.5 min. Najdłuższy slajd treściowy. Wytłumacz każdy wiersz. Punchline na końcu.

## Slide 11 — Case study budget tracker (intro)

# 🌟 1 maja 2026

Skończył się kwiecień.
**Zero raportu zarządczego. Zero kontroli kosztów. Zero spec-a.**

**2 dni później:**
działający system zarządczy, pierwszy close zrobiony, OpenSpec napisane, narrative dla zarządu.

*Event Driven Development™ — eventem była ta prelekcja 😅*

Pokażę nagranie.

> note: ~60s. Hook do flagship case study + autentyczna anegdota. STORYTELLER MODE: "Powiem szczerze — robiłem ten flow w poniedziałek. Tak, na potrzeby tej prelekcji. Event Driven Development. *(pauza na śmiech)* Ale szczerze: ten system **od dawna** miał powstać — tylko zawsze było coś innego. **Wolę wdrażać PR-y na produkcję niż zajmować się liczbami** — taka prawda founderska. *(pauza)* No więc wziąłem się do roboty. I wiecie co — kilka PR-ów od poniedziałku też dowiozłem. Za sprawą tych samych agentów których Wam zaraz pokażę." Pauza po "2 dni później" — pozwól numerom usiąść. Pauza po EDD — daj publiczności moment na śmiech.

## Slide 12 — Video close kwietnia

[video pełen ekranu: budget-process.mp4, controls, autoplay]

> note: ~6-8 min. **Najdłuższy element prelekcji.** Komentuj NA ŻYWO każdą fazę. Wskazuj source data, klasyfikację, REVIEW interactive, narrative blocking close. 2 iteracje QA w nagraniu — meta-przekaz "można korygować rozmową z agentem".

## Slide 13 — Diagram 6 faz close

[obraz pełen ekranu: finances-close-process.png]

Idempotent · re-runnable · AUTO:START / AUTO:END markers protect manual content

> note: ~1 min. Strukturalne podsumowanie po video. Przebiegnij szybko: PULL → CLASSIFY → REVIEW → ACCRUALS → COMMIT → REGENERATE. PHASE 3 i 5 = human-in-the-loop.

## Slide 14 — Real numbers kwiecień

# Close 2026-04

**Revenue:** 347 PLN  *(plan 598 → −42%)*

**Costs:** 17 151 PLN  *(plan 14 242 → +20%)*

**EBITDA:** −16 804 PLN  *(plan −13 644 → variance −23%)*

> note: ~30s. Real numbers, real company. Bez bullshitu. Pauza — daj publiczności zobaczyć, że to NIE są mock-up dane.

## Slide 15 — Monthly report (screenshot)

[obraz pełen ekranu: screenshot-monthly-2026-04.png]

> note: ~30s. "To wygląda raport zarządczy. Generuje się automatycznie, ale narrative pisze człowiek — system nie zamknie close-a z pustym blokiem."

## Slide 16 — Dashboard (screenshot)

[obraz pełen ekranu: screenshot-dashboard.png]

> note: ~30s. Wskaż na czerwone kropki (marketing +100%, AI gen +144%). "Kolory robi system. Decyzje robimy my."

## Slide 17 — Rules learning loop

[obraz pełen ekranu: screenshot-rules-sample.png]

**1 reguła. Mamy ich 30. Powstały w trakcie pierwszego close.**

`[a]ccept · [c]hange · [r]ule · [s]kip` — agent uczy się w trakcie REVIEW.

> note: ~45s. "Każde [r]ule = nowa zasada deterministyczna. Następny miesiąc = mniej pracy. Klasyczny learning loop, ale w produktywnym workflow."

## Slide 18 — 3 takeaways z budget trackera

**1. OpenSpec przed kodem**
spec dla 4 capabilities → potem implementacja. Agent czyta spec za każdym razem.

**2. Learning loop**
30 reguł powstało w trakcie close-a. Następny miesiąc = mniej pracy.

**3. Mandatory narrative**
PHASE 5 wymaga 3 sekcji refleksji. **Refleksja jest częścią procesu, nie opcją.**

> note: ~1 min. Końcówka case study. Trzy rzeczy do zapamiętania — pauza między każdym.

## Slide 19 — /ingest video

[video pełen ekranu: ingest-process.mp4, controls, autoplay]

> note: ~30s. Lektor: "To nie demo. To rzecz z dziś rano — realny lead, realne notatki, realna potrzeba ustrukturyzowania. Codzienna rutyna, nie demo dla prelekcji."

## Slide 20 — Diagram /ingest

[obraz pełen ekranu: ingest-workflow.png]

**Każdy input ma kontekst od momentu wrzucenia.**
Nie ma globalnego inboxa — jak w gicie nie ma stash bez gałęzi.

> note: ~20s. Strukturalnie: 6 faz. Footer slajdu = punchline. Krótko, po prostu pokazujesz że workflow jest opinionated.

## Slide 21 — /slides (meta twist)

# Ta prezentacja powstała tym samym workflow.

`/slides:new ncp4-2-zalozycieli`
`/slides:draft`
`/slides:build --html`

**Eat your own dogfood.**

> note: ~30s. Mocny meta-twist. "Te slajdy które widzicie — wygenerował je Claude Code, korzystając ze skilla `slides`. Jutro dorzucę screenshot procesu w komentarzu na LinkedInie."

## Slide 22 — Case study wizytówki

[obraz: business_card_pawel_preview.png, lewa strona]
[obraz: business_card_przemek_preview.png, prawa strona]

**Środa.** Fotograf wydrukuje wizytówki, potrzebuje plików.

**Kilkanaście minut później** ma 2 wzory, gotowe do druku.

**159 linii Pythona.**

> note: ~45s. Namacalny use case. "Trigger biznesowy → execution w godzinach. Dodanie kolejnego foundera = jeden wpis w liście."

## Slide 23 — Wizytówki punchline

> Trigger biznesowy → execution w godzinach.
>
> **To nie demo. To była realna potrzeba w środę.**

Filozofia: **kod > narzędzia graficzne** dla powtarzalnych assetów brandu.

> note: ~15s. Krótko, mocno. Przejdź dalej.

## Slide 24 — Airtable sync (wzmianka dla nocode publiki)

**Airtable jako CRM + lokalny kontekst MD = bidirectional sync.**

Three-way merge (jak w gicie). Zero ręcznych konfliktów. **600 linii Pythona.**

Ten sam wzorzec działa dla Notion, ClickUp, HubSpot, Pipedrive.

> note: ~30s. Dla nocode publiki używającej Airtable. Krótko — to wzmianka, nie deep dive.

## Slide 25 — Qamera (logo intro)

[obraz centered: logo_white.png, duży]

# Qamera AI

*Nasz produkt — wystawiony przez MCP*

> note: ~5s. Build-up do bonusu. Wprowadzasz drugą stronę hybrydy.

## Slide 26 — Qamera demo gif

[video pełen ekranu: qamera-showcase.mp4, autoplay loop]

> note: ~25s. Kluczowy lektor: "17 narzędzi MCP. Agent znajduje produkt, zleca packshot, **sam ocenia wynik wizualnie** — `get_packshot_preview` zwraca obraz, agent go widzi. Zatwierdza, jak art director." BONUS WZMIANKA (jeśli starczy oddechu): "Tego nie pokażę dziś, ale agenci ciągną też **core engineering** Qamery — daily PR-y, code review, debug. Wracając do tego co mówiłem na początku: wolę wdrażać kod niż liczyć — i agenci pomagają mi w obu."

## Slide 27 — Qamera UI input

[obraz pełen ekranu: qamera-ui-1.png]

**Input:** 1 zdjęcie produktu od producenta.

> note: ~5s. Before/after #1. Krótko.

## Slide 28 — Qamera UI output

[obraz pełen ekranu: qamera-ui-3.png]

**Output:** 4 zdjęcia w pełnej sesji AI w plenerze.

> note: ~5s. Before/after #2. Wizualny WOW.

## Slide 29 — LAVEL killer numbers

# LAVEL — 1 kampania

💸 **549 PLN  vs  33 000 PLN**
*−98% kosztu produkcji*

📈 **+42% ROAS  •  +34% CTR**

⚡ **25× szybciej do rynku**

*Realny case study klienta. Nie marketing-deck.*

> note: ~20s. **NAJMOCNIEJSZY slajd outro.** Pauza po pierwszej linii. Numery zostają w głowie mocniej niż screen UI.

## Slide 30 — QR Qamera

[obraz centered: qr-qamera.png, duży 60% wysokości]

# qamera.ai

*AI photo & video studio*

> note: ~5s. Krótka ekspozycja. "Jeśli macie e-commerce — zeskanujcie i zobaczcie sami."

## Slide 31 — Soft hot take + wyzwanie

# To działa już dziś.

Bez magii, bez rocket-science.

**Wyzwanie:** zaautomatyzuj **jedną** rzecz w swojej firmie do końca tygodnia.

Daj znać na LinkedIn jak poszło — chętnie pogadamy.

> note: ~30s. Spokojnie, na zakończenie. Nie wojuje z nikim. Aktywuje publiczność.

## Slide 32 — CTA shared-skills

[obraz centered: qr-shared-skills.png, 60% wysokości]

# github.com/200iqlabs/shared-skills

*Klonuj, używaj, kontrybuuj.*

Paweł Lipowczan  ·  LinkedIn: lipowczan  ·  foyer 18:00–20:00

> note: ~30s. Jeden QR, jeden cel. Foyer = aktywne zaproszenie do networkingu.

## Slide 33 — Q&A

# Pytania?

Foyer 18:00–20:00 · jeśli nie zdążymy tutaj

> note: ~1.5 min buffer na Q&A. Jeśli braknie pytań — pointer na networking. Końcówka miękka, otwarta.
