# Blog Plan — Zmierzone, nie założone

> **Generated:** 2026-09-06
> **Phase:** PLAN
> **Prime artifact:** `.claude/agents/context/blog-prime-zmierzone-nie-zalozone.md`
> **Next:** `/blog-article-writer:execute`
> **Gałąź:** `blog/zmierzone-nie-zalozone` (worktree `.claude/worktrees/blog-zmierzone`)

---

## 1. Frontmatter specification

```yaml
---
id: 32
slug: zmierzone-nie-zalozone
title: "Zmierzone, nie założone. Trzy wnioski, które sam obaliłem"
excerpt: >-
  Sprawdziłem, co dzieje się z oznaczeniem pliku na dziewięciu kanałach.
  Trzy razy mój własny wniosek okazał się fałszywy. Pięć reguł, które z tego zostały.
category: Code
author: Pawel Lipowczan
date: 2026-09-06
readTime: 12 min
image: /images/og-zmierzone-nie-zalozone.webp
tags:
  - Testowanie
  - Metodyka
  - AI Act
  - C2PA
  - AI
lang: pl
---
```

**Tytuły alternatywne** (do decyzji przed execute):

1. „Zmierzone, nie założone. Trzy wnioski, które sam obaliłem" — 56 znaków, **rekomendowany**. Napięcie jest w drugim członie: tekst nie chwali się pomiarem, tylko pomyłkami.
2. „Zmierzone, nie założone. Pięć reguł pomiaru cudzego systemu" — 59 znaków. Mocniejsze obietnicą, słabsze hakiem.
3. „Kontrolka negatywna. Czego nauczył mnie pomiar dziewięciu kanałów" — 65 znaków, za długi, ale najbardziej konkretny.
4. „Trzy razy pomyliłem się o ten sam plik" — 38 znaków, najmocniejszy hak, najsłabszy w wyszukiwarce.

**`alternateSlug`:** NIE ustawiać. PL-only, tłumaczenie osobnym krokiem.

---

## 2. Kąt i teza nośna

**Teza:** każde założenie o tym, co przeżywa drogę pliku, było fałszywe, dopóki go nie zmierzyłem. I nie raz — wnioski odwracały się po domiarze.

**Czego artykuł NIE jest:** poradnikiem o AI Act. Regulacja jest poligonem, nie tematem. Czytelnik wychodzi z metodą, nie z listą obowiązków.

**Dla kogo:** inżynier, który musi komuś odpowiedzieć na pytanie „skąd wiesz". Nie musi znać C2PA ani regulacji.

**Zdanie-oś do wykorzystania w leadzie albo w kickerze:** *pewność agenta nie jest pomiarem.*

---

## 3. Struktura sekcji

| # | Sekcja (H2) | Cel | Słowa |
|---|---|---|---|
| 1 | *(lead, bez nagłówka)* | Geneza: regulacja wymusiła pytanie, które normalnie zbywa się machnięciem ręki — czy oznaczenie w ogóle dojeżdża. Zapowiedź pięciu reguł | 280 |
| 2 | Wszyscy wiedzieli, nikt nie zmierzył | Domena w dwóch akapitach: plik jedzie do odbiorcy przez sklep albo platformę, po drodze ktoś go przetwarza. Definicje: C2PA, manifest, znak wodny, XMP | 320 |
| 3 | Reguła 1: kontrolka negatywna waży więcej niż pomiar pozytywny | Meta. Ten sam materiał pozbawiony znaczników nie dostał etykiety na żadnej z dwóch platform. Bez tego „Meta oznacza nasze pliki" nie dowodzi niczego, bo etykietę mógł postawić klasyfikator obrazu — i zarzut był realny, bo inne narzędzie rozpoznało tę samą treść z pikseli | 400 |
| 4 | Reguła 2: pierwszy odczyt kłamie | TikTok. Po kilkunastu minutach brak etykiety, wniosek zapisany. Po dobie etykieta jest, **wniosek wycofany**. Systemy są asynchroniczne, a negatyw bez kontroli czasowej to fałszywy negatyw | 380 |
| 5 | Reguła 3: mierz na własnym artefakcie | WooCommerce. Pierwszy pomiar szedł na cudzym pliku, bo nasz nie miał jeszcze kompletu metadanych. Powtórka na własnym odwróciła wnioski. Tu wchodzi też najostrzejszy pojedynczy fakt: PrestaShop, te same wymiary, piąta część wagi, zero metadanych | 420 |
| 6 | Reguła 4: szukaj mechanizmu, nie korelacji | Osiem na osiem eksportów z edytora zgubiło oznaczenie, przypisano to przebudowie kontenera. TikTok kontener też przebudowuje i deklaruje to wprost, a łańcuch zostaje. Werdykt bez zmian, **uzasadnienie odwrócone**: zabija nieświadomość pochodzenia, nie przebudowa. Dopiero to jest przenośne | 420 |
| 7 | Reguła 5: zapisz, czego nie zmierzyłeś | Sekcja ograniczeń: jeden edytor a nie klasa edytorów, dwie platformy niezmierzone na drugiej osi, jeden wariant pominięty świadomie. Puste pole czytane jako zero jest gorsze niż brak tabeli | 320 |
| 8 | Warstwa krucha jest publiczna, odporna zamknięta | Kicker. Jedyna ścieżka weryfikacji bez konta czyta warstwę, którą kasuje pierwsza lepsza rekompresja. Warstwa przeżywająca przekształcenia wymaga zalogowania. Intuicyjny podział ról jest odwrócony | 300 |
| 9 | Kluczowe wnioski | Pięć reguł w postaci listy numerowanej, każda jednym zdaniem | 180 |
| — | CTA | Blok HTML, kontekstowy | — |
| 10 | Przydatne zasoby | Linki zewnętrzne z krótkim opisem | — |
| 11 | FAQ | 6 pytań | 500 |

**Łącznie prozy:** ~3020 słów bez FAQ, ~3520 z FAQ. Przy ~200 słowach na minutę daje to `readTime: 12 min` z zapasem. Jeśli w execute tekst urośnie powyżej ~3800, ciąć sekcję 2, nie reguły.

---

## 4. Tabela faktów do wplecenia

Każdy fakt **z datą pomiaru**. Źródło wsadu wskazuje, że wnioski odwracały się dwukrotnie, więc fakt bez daty czyta się jako stan wieczysty i będzie nieprawdziwy.

| Fakt | Data | Sekcja |
|---|---|---|
| Meta oznacza post automatycznie, czyta manifest, nie czyta znaku wodnego; kontrolka bez znaczników bez etykiety na obu platformach | 2026-08-06 | 3 |
| TikTok: po kilkunastu minutach brak etykiety, po dobie etykieta; wniosek z 31.08 wycofany | 2026-09-01 | 4 |
| WooCommerce: próg 2560 px, poniżej plik bajt w bajt (zgodny hash), powyżej wariant pochodny bez manifestu; karta produktu renderuje 600 px i tak bez manifestu | 2026-08-06, powtórka 2026-08-22 | 5 |
| PrestaShop: „oryginał" ma te same wymiary 3712×4608, piątą część wagi (1 146 413 B wobec 5 666 168 B), zero metadanych | 2026-08-06, wersja 9 — 2026-08-22 | 5 |
| Eksport z konsumenckiego edytora wideo: oznaczenie ginie 8 na 8 | 2026-08-31 | 6 |
| TikTok zachowuje manifest i zagnieżdża go jako składnik rodzicielski pod własnym podpisem, deklarując transkodowanie; pliki walidują się jako poprawne | 2026-09-01 | 6 |
| YouTube oznacza post, ale serwuje plik zdjęty do zera | 2026-09-01 | 6 lub 7 |
| Jedyna publiczna ścieżka weryfikacji bez konta czyta wyłącznie warstwę kruchą; warstwa odporna wymaga zalogowania | 2026-08-05, domiar 2026-08-06 | 8 |

---

## 5. Bloki kodu

Jeden blok, znacznik `text`. Wszystkie kolejne to kandydaci do cięcia, nie do dokładania.

**Blok 1, sekcja 6** — łańcuch po transkodowaniu, uproszczony, bez prawdziwych identyfikatorów, certyfikatów i nazw wystawców:

````text
```text
plik pobrany z platformy
└─ warstwa aktywna      podpis platformy      akcje: otwarcie + transkodowanie
   └─ składnik rodzica  nasz podpis           akcja: utworzenie
      └─ składnik       podpis dostawcy       akcja: utworzenie
```
````

**Odrzucone:** porównanie hasha z manifestu z bajtami eksportu. Ilustruje regułę „dowód zamiast lektury kodu", ale wchodzi w okolice warstwy certyfikatu i klucza, którą wsad wyklucza w całości. Zostaje jako zdanie prozy, bez bloku.

---

## 6. Pojęcia i definicja przy pierwszym użyciu

Obowiązkowe, także dla terminów z keep-listy: **C2PA**, **manifest**, **składnik rodzicielski**, **znak wodny**, **XMP**, **hash SHA-256**, **kontener MP4**, **transkodowanie**, **rekompresja**, **pochodna**, **packshot**.

Pułapki nazewnicze, sprawdzane bramą słownikową:

- „znak wodny", nie „watermark"
- „pochodna", nie „rendition"
- „awaryjnie" / „w razie braku", nigdy „fallback"
- „paczka", nie „bundle"
- Nazwy standardów (`C2PA`, `XMP`, `SHA-256`) zostają po angielsku — czytelnik zobaczy je w narzędziu — ale każda dostaje definicję przy pierwszym użyciu.

---

## 7. Linkowanie

**Wewnętrzne:**

| Cel | Kontekst |
|---|---|
| `/blog/srodowisko-agentowe-ai-dwie-firmy` | środowisko, w którym ten pomiar powstał |
| `/blog/system-agentow-ai-skills-rules-kontekst` | jak prowadzone są takie projekty |
| `/blog/okf-standard-przenosnosc-bazy-wiedzy-ai` | opcjonalnie, przenośność zapisu ustaleń |

**Zewnętrzne (sekcja Przydatne zasoby):**

- `https://qamera.ai/tools/verify-image` — odczyt oznaczeń dowolnego pliku w przeglądarce, bez konta
- Specyfikacja C2PA — podstawa formatu manifestu
- Publiczny weryfikator Content Authenticity — druga niezależna ścieżka odczytu

**Artykuł biznesowy na qamera.ai:** jeden link, w ramie „co z tego wynika dla sklepu". **Adres nieznany do czasu publikacji tamtego tekstu — nie wstawiać w ciemno.** Jeśli w chwili execute tamten nie wyszedł, zostawić miejsce i domknąć przy publikacji.

---

## 8. CTA

Kontekstowy, blok HTML z `article-structure.md`. Propozycja treści:

- **H3:** „Nie wiesz, czy Twój system robi to, co myślisz?"
- **Opis:** o tym, że różnica między „powinno działać" a „zmierzone" kosztuje najwięcej wtedy, gdy wychodzi późno; pomoc od zaprojektowania pomiaru po zapis wyników, z którego da się korzystać za pół roku.
- **Przycisk:** „Umów bezpłatną konsultację", link `/#contact`.

---

## 9. FAQ (6 pytań)

Format: `<details open>` + `<summary>` obejmujący H3, zgodnie z id 31.

1. Czym różni się oznaczenie postu od przeniesienia pochodzenia pliku?
2. Dlaczego pierwszy pomiar na platformie społecznościowej bywa mylący?
3. Po co w pomiarze kontrolka negatywna, skoro wynik pozytywny już coś pokazuje?
4. Czy sklep internetowy kasuje metadane ze zdjęć produktowych?
5. Jak sprawdzić, czy mój własny plik niesie oznaczenie AI?
6. Czy te reguły pomiaru działają poza tematem oznaczania treści?

---

## 10. SEO

- **Fraza główna:** pomiar oznaczania treści AI
- **Frazy poboczne w H2:** kontrolka negatywna, przeżywalność metadanych, C2PA, metadane zdjęć produktowych
- Tytuł niesie frazę główną w drugim członie; nagłówki reguł niosą frazy poboczne naturalnie, bez upychania.

---

## 11. Czego NIE robić

- **Nie pisać poradnika o AI Act.** Regulacja jest poligonem.
- **Nie ukrywać wycofanych wniosków.** One są treścią; artykuł pokazujący wyłącznie trafne pomiary uczy odwrotnego nawyku niż zamierzony.
- **Nie robić recenzji platform.** WooCommerce nie jest „gorszy", ma inny próg. Ton opisowy, nie oceniający.
- **Nie obiecywać kompletności.** Dwie platformy są na drugiej osi niezmierzone i to zostaje w tekście.
- **Nie sprzedawać Qamery.** Jeden link do narzędzia, jeden do artykułu biznesowego, CTA standardowe.
- **Nie cytować podstaw prawnych.** Tezy prawne należą do tekstu qamerowego, gdzie mają bramę wymuszającą numer przepisu.
- **Nie naruszać listy wykluczeń** z sekcji „Czego NIE publikować" wsadu. **To repozytorium jest publiczne.**

---

## 12. Bramy przed zamknięciem

```bash
# słownictwo prostego polskiego
grep -rniP '(komendyfik|ingestow|mergow|renderow|deployow|commitow|klastrow|fallback|bundl|dopieszczon)' src/content/blog/zmierzone-nie-zalozone.md

# myślniki i wielokropek Unicode
grep -n '[—–…]' src/content/blog/zmierzone-nie-zalozone.md

# nazwy własne i identyfikatory, których nie wolno opublikować.
# Wzorce celowo NIE są tu wypisane: to repozytorium jest publiczne, więc wyliczenie
# listy opublikowałoby dokładnie te nazwy, których ma bronić - a to jest ten sam błąd,
# przed którym wsad ostrzega w sekcji „Czego NIE publikować".
# Lista żyje w prywatnej bazie wiedzy; przed uruchomieniem bramy przeczytaj ją stamtąd.
grep -niP '(<wzorce z prywatnej listy: klienci, osoby, wystawcy, dostawcy, identyfikatory zadań>)' src/content/blog/zmierzone-nie-zalozone.md

# bloki kodu bez znacznika języka
grep -nE '^```[[:space:]]*$' src/content/blog/zmierzone-nie-zalozone.md
```

Pierwsze trzy przechodzą na zero trafień w prozie. Czwarta to lista do obejrzenia, nie licznik.

Dalej: `npm run og:check`, `npm run blog:sitemap`, `npm test`.

⚠️ **`npm run og:check` nie jest bramą na obecność obrazu.** Skrypt iteruje po plikach
`og-*.webp` leżących w `public/images/` i sprawdza ich wymiary; **nie czyta pola `image:`
z frontmatteru**, więc brakujący obraz artykułu przechodzi z kodem 0. Obecność sprawdź
osobno: `test -f public/images/og-<slug>.webp`. Wymiary muszą wyjść 1200x630 - generator
zapisuje 1424x752, więc potrzebny jest krok skalujący (`scripts/resize-og-image.mjs`).
