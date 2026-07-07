# Prosty polski - reguły treści

**Jedyne źródło prawdy dla słownictwa i stylu polskich treści.** Obowiązuje: artykuły bloga (`src/content/blog/*.md`), lekcje kursu (`src/content/kurs/*.md`), teksty landingów i sekcji. Skille `portfolio-copywriting` i `blog-article-writer` odwołują się do tego pliku - nie utrzymują własnych list.

---

## Zasady pisania

- **Zdanie ma średnio ≤ ~20 słów.** Dłuższe zdanie = kandydat do podziału.
- **Jedna myśl na zdanie.** Dygresję przenieś do osobnego zdania albo skreśl.
- **Strona czynna.** "Agent buduje indeks", nie "indeks jest budowany przez agenta".
- **Jeśli zdanie da się skreślić bez straty informacji - skreśl je.**

## Definicja przy pierwszym użyciu (WYMAGANE)

Każdy trudny lub specjalistyczny termin dostaje definicję przy **pierwszym wystąpieniu w danym artykule/lekcji** - jako wtrącenie w nawiasie. Gdy definicja jest za długa na nawias, dopuszczalne jest osobne zdanie zaraz po terminie. Kolejne wystąpienia - już bez definicji.

Zakres liczy się **per dokument**: termin objaśniony w lekcji 1 dostaje definicję ponownie przy pierwszym użyciu w lekcji 3 (lekcje czyta się niezależnie).

Terminy z keep-listy (niżej) **też** dostają definicję - to, że zostają po angielsku, nie zwalnia z objaśnienia.

```markdown
❌ Agent nie używa RAG ani embeddings.
✅ Agent nie używa RAG (techniki, w której model przed odpowiedzią
   przeszukuje surowe dokumenty) ani embeddings (liczbowych
   reprezentacji tekstu do wyszukiwania podobieństw).
```

## Granica słownika: test UI / systemu plików

Jedna sprawdzalna reguła zamiast wyczucia:

> **Termin zostaje po angielsku, jeśli czytelnik zobaczy go w interfejsie narzędzia albo w systemie plików. Jeśli istnieje tylko w naszej prozie - tłumaczymy.**

### Keep-lista (zostają po angielsku)

- **Nazwy komend i plików:** `/ingest`, `/onboard`, `/qa`, `render.py`, `vault-map.md`, `_graveyard/` (jako ścieżka w backtickach)
- **Terminy widoczne w narzędziach:** vault (Obsidian), frontmatter, markdown, commit, branch (git), inbox (jako nazwa folderu `inbox/`)
- **Nazwy technologii i standardów:** git, RAG, OKF, MCP, LLM, Claude Code, Obsidian, Quartz
- **Utrwalone koncepty bez odpowiednika:** progressive disclosure, second brain, skill/skille

Mianownik będący nazwą komendy lub operacji ("pierwszy ingest", "ingest rusza") traktujemy jak nazwę własną - zostaje. **Odmiana już nie**: "po ingeście", "bez ingestu" to spolszczenie - pisz "po `/ingest`" albo "po wczytaniu".

### Tabela zamian (proza)

| Zapożyczenie             | Pisz po polsku                          |
| ------------------------ | --------------------------------------- |
| ingestować, zingestować  | wczytać, wczytywać                      |
| po ingeście / bez ingestu| po `/ingest` / bez `/ingest`, po wczytaniu |
| mergować, robi merge     | scalać, robi scalenie                   |
| renderować, rendery      | wypełniać szablon, generowanie          |
| deployować               | wdrażać                                 |
| commitować               | robić commit                            |
| klastrować się           | układać się w grupę                     |
| fallback                 | awaryjnie, w razie braku                |
| stale (ang. *stale*)     | przeterminowany                         |
| graveyard (w prozie)     | `_graveyard/` (forma ścieżki)           |
| bundle                   | paczka                                  |
| health-check             | przegląd stanu                          |
| dry-run                  | próbny przebieg                         |
| pipeline                 | potok                                   |
| backlink                 | link zwrotny                            |
| handoff                  | przekazanie                             |
| tutorial                 | samouczek                               |
| checklist                | lista kontrolna                         |
| triage                   | segregacja                              |
| idempotencja             | powtarzalność                           |
| komendyfikacja           | przekształcanie w komendy (albo zostaw "commandification") |

Uwaga na fałszywego przyjaciela: polskie "stale" znaczy "ciągle". Angielskie *stale* (przeterminowany) nigdy nie zostaje w polskim zdaniu.

## Ozdobniki i epitety

- **Przymiotnik musi nieść informację**: liczbę, przykład albo sprawdzalną cechę. "Dopieszczone skille" → "sprawdzone skille"; "potężna komenda" → "komenda, która oszczędza X".
- **Maksymalnie jedna metafora na sekcję.** Dobra metafora zostaje ("to kompas, nie koparka"); piętrzenie metafor tnie.
- Rozszerza regułę "Puste wzmacniacze" z sekcji AI-tells w `portfolio-copywriting`.

## Walidacja (grep)

Brama słownikowa. Grep to detektor - sam nie odróżnia prozy od kodu, więc każde trafienie oceń ręcznie: trafienie **w prozie** = błąd (blokuje publikację); trafienie **w bloku kodu lub ścieżce w backtickach** jest dopuszczalne - odnotuj je jako sprawdzony wyjątek. Brak trafień = brama przechodzi bez ręcznego kroku.

```bash
grep -rniP '(komendyfik|ingestow|ingestuj|inge\x{15b}ci|ingestu\b|ingestem|mergow|merguj|robi\w* merge|renderow|renderuj|\brendery\b|\brenderu\b|deployow|deployuj|commitow|commituj|klastrow|klastruj|fallback|bundl|arsena\x{142}|z\x{17c}yt[aey]|dopieszczon|tre\x{15b}\x{107} stale|(?<!_)graveyard)' src/content/kurs/*.md
```

To wyrażenie jest wzorcem dla wszystkich bram słownikowych (m.in. `blog-article-writer:validate` uruchamia je 1:1 na walidowanym artykule). Zmieniasz listę - zmień ją **tutaj**, a kopie wyrównaj do tego pliku.

Dla artykułu bloga uruchamiaj to samo wyrażenie na walidowanym pliku (krok w `blog-article-writer:validate`). Brama znaków (em dash / en dash / wielokropek) działa niezależnie - patrz `portfolio-copywriting`.

Grep łapie słownictwo. **Nie łapie**: braku definicji przy pierwszym użyciu, piętrzenia metafor, zbyt długich zdań - to sprawdzasz przy pisaniu i w review.
