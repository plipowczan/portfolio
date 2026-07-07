# Styl Pisania Pawla Lipowczana

Szczegolowa charakterystyka stylu pisania dla artykulow na bloga portfolio.

## Jezyk i Ton

### Podstawowe cechy

- **Jezyk glowny:** Polski z naturalnymi wtrąceniami angielskich terminow technicznych
- **Ton:** Bezposredni, praktyczny, osobisty i refleksyjny
- **Perspektywa:** Pierwsza osoba ("ja", "my", "I" w kontekstach technicznych)
- **Podejscie:** Oparte na wlasnym doswiadczeniu, z konkretnymi przykladami

### Przyklad tonu osobistego

```
Moja profesjonalna przygoda z programowaniem zaczela sie na czwartym roku studiow.
Pamietam to jak dzis - jeden z moich znajomych podczas wakacji zaczal pracowac
w jednej z firm programistycznych. Juz wtedy zwrocilem uwage na kilka aspektow:

1. Nie wiedzialem nic - czesto nie mialem pojecia co robic
2. Nie ma nic lepszego niz dobry i pomocny zespol
3. Programowanie jest dla mnie - satysfakcja z ukonczonych projektow to swietne uczucie
```

## Struktura Dokumentow

### Hierarchia naglowkow

```markdown
# H1 - Tytul glowny (jeden na artykul)

## H2 - Glowne sekcje tematyczne

### H3 - Podsekcje i szczegoly

#### H4 - Rzadko, tylko gdy potrzeba glebszego podzialu
```

### Organizacja tresci

1. **Wstep/Kontekst** - Krotkie wprowadzenie w temat
2. **Problem/Wyzwanie** - Co rozwiazujemy
3. **Rozwiazanie** - Jak to rozwiazujemy
4. **Szczegoly implementacji** - Kroki, techniczne detale
5. **Rezultaty/Wnioski** - Co osiagnelismy, czego sie nauczylismy
6. **CTA** - Wezwanie do dzialania na koncu

## Formatowanie

### Listy

Preferuj listy punktowane dla latwego skanowania:

```markdown
**Korzysci rozwiazania:**
- Oszczednosc czasu: 15h tygodniowo
- Redukcja bledow: 90%
- Lepsza komunikacja z klientem
```

Numerowane listy dla sekwencji krokow:

```markdown
**Jak wdrozyc:**
1. Przeanalizuj obecny proces
2. Zidentyfikuj waskie gardla
3. Wybierz narzedzia automatyzacji
4. Przetestuj na malej skali
5. Wdroz i monitoruj
```

### Znaki interpunkcyjne - unikaj AI-tells

Nie uzywaj znakow zdradzajacych tekst generowany przez AI. Pisz tak, jak czlowiek pisze na klawiaturze - zwyklym myslnikiem i trzema kropkami.

```markdown
❌ Agentic engineering — to dyscyplina, ktora trzyma sufit…
✅ Agentic engineering - to dyscyplina, ktora trzyma sufit...
```

| Zabroniony znak     | Poprawnie                                              |
| ------------------- | ----------------------------------------------------- |
| `—` em dash (U+2014) | `-` zwykly myslnik ze spacjami: ` - `                 |
| `–` en dash (U+2013) | `-` myslnik; w zakresach bez spacji: `2020-2025`      |
| `…` wielokropek (U+2026) | `...` trzy kropki                                  |

**Wyjatek:** polskie cudzyslowy `„ "` zostaw - to poprawna typografia (nie AI-tell), spojna z istniejacymi artykulami.

Walidacja przed publikacja: `grep -nP '[\x{2014}\x{2013}\x{2026}]' <plik>` musi zwrocic pusty wynik.

### Zwroty i konstrukcje - unikaj AI-tells

Znaki to nie wszystko. Sa zwroty i konstrukcje zdaniowe, ktore czytelnik podswiadomie rozpoznaje jako "tak pisze AI". Pisz jak czlowiek, ktory ma cos do powiedzenia - nie jak model, ktory wypelnia szablon. Dotyczy to obu jezykow (artykuly PL i te w `en/`).

Zabronione konstrukcje (z przykladami PL + EN):

| Wzorzec                | ❌ Tak pisze AI                                                        | ✅ Napisz raczej                                             |
| ---------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| Antyteza-pauza         | "To nie jest zwykly skrypt - to system." / "It's not just X, it's Y." | Powiedz wprost czym to jest, bez kontrastu-na-sile.         |
| Puste otwarcia         | "W dzisiejszym cyfrowym swiecie..." / "In today's fast-paced world..." | Zacznij od konkretu: problemu, liczby, wlasnej sytuacji.    |
| Puste domkniecia       | "Podsumowujac..." / "In conclusion..." / "Warto pamietac, ze..."      | Zakoncz praktycznym krokiem albo osobista refleksja.        |
| Regula trojki na sile  | "szybko, tanio i skalowalnie" (wszystko w trojkach)                    | Uzyj tylu elementow, ile naprawde masz - czesto dwa.        |
| Meta-asekuracja        | "Warto zauwazyc, ze..." / "It's worth noting that..."                  | Jesli warto - po prostu to napisz, bez zapowiedzi.          |
| Zaproszenia            | "Zanurzmy sie w temat" / "Let's dive in" / "delve into"               | Przejdz do rzeczy.                                          |
| Puste wzmacniacze      | "kluczowy", "przelomowy", "istotny" bez konkretu                       | Zastap liczba lub przykladem ("oszczedza 15h/tydzien").     |
| Falszywa symetria      | "Z jednej strony... z drugiej strony..." jako wypelniacz              | Zajmij stanowisko; kontrast tylko gdy realny.               |

Zasada nadrzedna: jesli zdanie da sie skreslic bez straty informacji - skresl je. AI dodaje gladkie przejscia i asekuracje; czlowiek pisze rzeczowo.

### Wrazenia z emoji

Uzywaj oszczednie, glownie w naglowkach lub dla wyroznienia:

- Check: Ukonczono / Tak
- X: Nie / Problem
- Ogien: Kluczowa informacja
- Rakieta: Sukces / Start
- Strzalka: Wskazowka / Nastepny krok

### Pogrubienia i wyroznienia

```markdown
**Kluczowe liczby** zawsze pogrubione: oszczedzilismy **15 godzin tygodniowo**

**Wazne koncepcje** przy pierwszym uzyciu: **automatyzacja procesow biznesowych**

Cytaty z ksiazek rowniez pogrubione:
> **Leaders can do two things that bring almost instant benefit. First, think
> about execution more sequentially than in parallel.**
```

## Charakterystyczne Elementy

### Osobiste refleksje

Wplataj wlasne doswiadczenia i przemyslenia:

```markdown
Z wlasnego doswiadczenia wiem, ze najwiekszym bledem jest rozpoczynanie
automatyzacji bez jasnego zrozumienia obecnego procesu. Sam popelnilem
ten blad przy pierwszym projekcie...
```

### Praktyczne wskazowki

Zakonczenia zawsze praktyczne, nie teoretyczne:

```markdown
## Co mozesz zrobic dzisiaj

1. Spisz 3 najbardziej powtarzalne zadania w swojej pracy
2. Zmierz ile czasu na nie poswiecasz tygodniowo
3. Wybierz jedno i sprawdz czy mozna je zautomatyzowac
```

### Struktura "Co poszlo zle vs Co zadzialo"

Dla artykulow o lessons learned:

```markdown
## Czego sie nauczylismy

### Co nie zadzialo
1. Brak walidacji z uzytkownikiem koncowym
2. Zbyt optymistyczne zalozenia czasowe
3. Niedocenianie zlozonosci integracji

### Co zadzialo
1. Agenci AI jako "equalizer" dla mniej doswiadczonych
2. Szybkie prototypowanie zamiast planowania
3. Regularne demo dla interesariuszy
```

## Linki i Zasoby

### Linki wewnetrzne

Uzywaj linkow do powiazanych artykulow:

```markdown
Wiecej o tej technice znajdziesz w artykule [Automatyzacja email](/blog/automatyzacja-email)
```

### Sekcja Resources

Na koncu artykulow dodawaj sekcje z zasobami:

```markdown
## Przydatne zasoby

- [n8n Documentation](https://docs.n8n.io/) - oficjalna dokumentacja
- [Make Templates](https://www.make.com/en/templates) - gotowe scenariusze
- [Automatyzacja dla biznesu - kurs](/kurs) - moj kurs online
```

## Przyklady Roznych Typow Artykulow

### Artykul techniczny/how-to

Fokus na:
- Konkretne kroki implementacji
- Przyklady kodu/konfiguracji
- Screenshots/diagramy
- Troubleshooting na koncu

### Case study

Fokus na:
- Kontekst biznesowy klienta
- Wyzwanie/problem
- Rozwiazanie z konkretnymi liczbami
- ROI i metryki sukcesu
- Cytat klienta (opcjonalnie)

### Artykul refleksyjny

Fokus na:
- Osobiste doswiadczenie
- Lessons learned
- Struktura "co zadzialo/nie zadzialo"
- Praktyczne wnioski do zastosowania

### Notatka z ksiazki/wydarzenia

Struktura:
- Krotkie streszczenie (3-5 zdan)
- Jak odkrylem/dlaczego wybralem
- Kluczowe wnioski (lista)
- Jak to zmienilo moje podejscie
- Komu polecam

## Język techniczny: Kiedy English vs Polish

**Pełne reguły słownictwa: [.claude/rules/content/10-prosty-polski.md](../../../rules/content/10-prosty-polski.md)** - tabela zamian, keep-lista, brama grep. Ten plik jest źródłem prawdy; poniżej tylko sedno.

### Zasada domyślna: po polsku

Gdy istnieje naturalny polski odpowiednik - pisz po polsku. Angielski zostaje tylko wtedy, gdy termin przechodzi **test UI / systemu plików**: czytelnik zobaczy go w interfejsie narzędzia albo w nazwie pliku.

**✅ Zostaje po angielsku (test UI/plików):**
- Nazwy technologii i produktów: React, TypeScript, Docker, Claude Code
- Nazwy komend i plików: `/prime`, `npm install`, `render.py`
- Terminy widoczne w narzędziach: commit, branch, frontmatter, markdown, vault (Obsidian)
- Skróty i standardy: API, SDK, CLI, REST, RAG, OKF, MCP

**✅ Po polsku (istnieje tylko w prozie):**
- wdrożenie (nie "deployment" ani "deployować")
- środowisko testowe / produkcyjne (nie "staging/production")
- scalanie (nie "mergowanie"), wczytywanie (nie "ingestowanie")
- walidacja, autoryzacja, potok (pipeline), paczka (bundle), awaryjnie (fallback)

**❌ NIGDY nie polonizuj czasowników:**
- "ingestować", "mergować", "renderować", "deployować", "commitować" → polski czasownik albo "robić <rzeczownik z keep-listy>" ("robić commit")
- "komendyfikacja" → "przekształcanie w komendy" LUB zostaw "commandification"

### Definicja przy pierwszym użyciu (WYMAGANE)

Każdy trudny termin - także z keep-listy - dostaje przy pierwszym wystąpieniu w artykule definicję w nawiasie (dla długich definicji: osobne zdanie zaraz po terminie). Kolejne wystąpienia bez definicji.

```markdown
❌ Baza działa bez RAG i embeddings.
✅ Baza działa bez RAG (techniki, w której model przed odpowiedzią
   przeszukuje surowe dokumenty) i bez embeddings (liczbowych
   reprezentacji tekstu do wyszukiwania podobieństw).
```

### Ozdobniki i epitety - unikaj

Rozszerzenie reguły "Puste wzmacniacze" z tabeli AI-tells:

- Przymiotnik musi nieść informację (liczbę, przykład, sprawdzalną cechę) - inaczej skreśl.
- Maksymalnie jedna metafora na sekcję.

```markdown
❌ Dopieszczone, potężne skille odmienią Twój workflow.
✅ Sprawdzone skille - każdy przeszedł 20+ uruchomień na realnej bazie.
```

### Formatowanie terminów technicznych

- **Nazwy produktów/technologii**: `React`, `Claude Code`, `TypeScript` (backticks pierwszym razem)
- **Komendy**: `/prime`, `npm install` (backticks zawsze)
- **Ścieżki plików**: `src/components/Header.jsx` (backticks zawsze)
- **Fragmenty kodu inline**: `const x = 5` (backticks zawsze)
