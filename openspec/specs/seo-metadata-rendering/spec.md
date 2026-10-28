# seo-metadata-rendering Specification

## Purpose
Sposób, w jaki metadane trafiają do dokumentu: przez własne renderowanie Reacta, identycznie na serwerze deweloperskim i w buildzie produkcyjnym, bez duplikatów przy zmianie trasy, z atrybutem `lang` zgodnym z wersją językową, z blokami danych strukturalnych związanymi z trasą, która je deklaruje, i w postaci widocznej dla prerenderu.

## Requirements

### Requirement: Metadane widoczne w trybie deweloperskim

Tagi `<title>`, `<meta name="description">`, `<link rel="canonical">` i `<link rel="alternate" hreflang>` MUSZĄ trafiać do `<head>` na serwerze deweloperskim tak samo jak w buildzie produkcyjnym. Mechanizm dostarczania NIE MOŻE zależeć od tego, czy aplikacja jest opakowana w `<React.StrictMode>`.

#### Scenario: Strona główna na serwerze deweloperskim

- **WHEN** przeglądarka wczytuje `http://localhost:3000/` z włączonym `<React.StrictMode>`
- **THEN** dokument zawiera dokładnie jeden `<meta name="description">` z niepustą treścią
- **AND** zawiera `<link rel="canonical">` wskazujący na adres strony

#### Scenario: Parzystość dev i produkcji

- **WHEN** dla tej samej trasy porównamy zestaw metadanych z serwera deweloperskiego i z buildu produkcyjnego
- **THEN** oba zestawy zawierają te same nazwy tagów i te same wartości

#### Scenario: StrictMode zostaje włączony

- **WHEN** aplikacja renderuje się wewnątrz `<React.StrictMode>`, a efekty montują się dwukrotnie
- **THEN** żaden tag metadanych nie znika z `<head>`

### Requirement: Brak duplikatów po zmianie trasy

Po przejściu między trasami po stronie klienta dokument MUSI zawierać metadane wyłącznie bieżącej strony. Tagi poprzedniej strony NIE MOGĄ pozostać w `<head>`.

#### Scenario: Nawigacja między artykułami

- **WHEN** użytkownik przechodzi z `/blog/<slug-a>` na `/blog/<slug-b>` bez przeładowania strony
- **THEN** dokument zawiera dokładnie jeden `<meta name="description">`
- **AND** jego treść pochodzi z artykułu `<slug-b>`

#### Scenario: Nawigacja między wersjami językowymi

- **WHEN** użytkownik klika przełącznik języka i trafia na odpowiednik w drugim języku
- **THEN** dokument zawiera dokładnie jeden `<link rel="canonical">`
- **AND** wskazuje on na adres bieżącej wersji językowej

#### Scenario: Przejście na stronę bez tłumaczenia

- **WHEN** użytkownik przechodzi ze strony z parą hreflang na stronę, która jej nie ma
- **THEN** dokument nie zawiera żadnego `<link rel="alternate" hreflang>`

### Requirement: Atrybut lang na elemencie html

Element `<html>` MUSI nieść atrybut `lang` zgodny z bieżącą wersją językową. Ponieważ hoistowanie metadanych w React 19 obejmuje wyłącznie `<title>`, `<meta>` i `<link>`, atrybut ten MUSI być ustawiany innym mechanizmem.

#### Scenario: Trasa polska

- **WHEN** przeglądarka wczytuje adres bez prefiksu `/en`
- **THEN** `<html>` ma `lang="pl"`

#### Scenario: Trasa angielska

- **WHEN** przeglądarka wczytuje adres z prefiksem `/en`
- **THEN** `<html>` ma `lang="en"`

#### Scenario: Zmiana języka bez przeładowania

- **WHEN** użytkownik przełącza język po stronie klienta
- **THEN** atrybut `lang` na `<html>` zmienia się na język strony docelowej

### Requirement: Metadane widoczne dla prerenderu

Prerendering przez Puppeteer MUSI widzieć komplet metadanych w DOM przed zrzutem HTML. Każdy prerenderowany adres MUSI wygenerować się bez ostrzeżenia o braku metatagów.

#### Scenario: Pełny przebieg prerenderu

- **WHEN** uruchomimy `npm run build:prerender`
- **THEN** skrypt kończy się liczbą błędów równą zero
- **AND** nie zgłasza dla żadnej trasy braku metatagów SEO

#### Scenario: Statyczny plik artykułu

- **WHEN** odczytamy `dist/blog/<slug>/index.html` bez uruchamiania JavaScriptu
- **THEN** plik zawiera `<meta name="description">`, `<link rel="canonical">` i pary `hreflang` tego artykułu

#### Scenario: Powłoka SPA nie zatruwa pozostałych plików

- **WHEN** prerender zapisze `/` do `dist/index.html`, czyli do pliku oddawanego awaryjnie dla trasy bez własnego pliku
- **THEN** żaden inny wygenerowany plik nie niesie tytułu, opisu ani canonicala strony głównej
- **AND** każdy plik zawiera dokładnie jeden `<title>`, jeden `<meta name="description">` i jeden `<link rel="canonical">`
- **AND** ten canonical wskazuje na adres tego właśnie pliku

### Requirement: Dane strukturalne emitowane przez drzewo Reacta

Blok `<script type="application/ld+json">` MUSI powstawać jako renderowany węzeł komponentu, nie jako efekt uboczny wstawiający go do `document.head`. Dzięki temu blok należy do trasy, która go deklaruje, a odmontowanie trasy usuwa go razem z komponentem.

Treść bloku MUSI mieć ucieknięte wszystkie wystąpienia znaku `<`, ponieważ trafia do dokumentu dosłownie, a prerender zapisuje ją do pliku.

#### Scenario: Blok należy do swojej trasy

- **WHEN** użytkownik przechodzi na trasę, która nie deklaruje żadnego schematu
- **THEN** dokument nie zawiera bloku danych strukturalnych poprzedniej trasy

#### Scenario: Wartość zawierająca znacznik zamykający

- **WHEN** dowolna wartość schematu zawiera tekst `</script>`
- **THEN** zapisany blok nie zawiera surowego znaku `<`
- **AND** po sparsowaniu zwraca dokładnie te same wartości, które weszły

### Requirement: Brak zależności react-helmet-async

Projekt NIE MOŻE zawierać `react-helmet-async` w zależnościach ani importować go w kodzie źródłowym.

#### Scenario: Zależności projektu

- **WHEN** sprawdzimy `package.json` oraz drzewo importów w `src/`
- **THEN** `react-helmet-async` nie występuje w żadnym z nich

#### Scenario: Testy nie potrzebują obejść

- **WHEN** testy E2E sprawdzają metadane
- **THEN** robią to na serwerze deweloperskim, bez własnego `baseURL` wskazującego na build produkcyjny
- **AND** nie zawierają tolerancji na brakujący opis uzasadnionej trybem deweloperskim
- **AND** nie potrzebują zmiennej `PW_PREVIEW`

### Requirement: The mounted document replaces the prerendered head, never adds to it

When a prerendered page loads and the application mounts, the document SHALL end up holding exactly one copy of each metadata tag the page emits: one `<title>`, one `<meta name="description">`, one `<link rel="canonical">`, one of each Open Graph and Twitter tag, and one hreflang link per language. The tags written into the static file at build time SHALL NOT stay alongside the ones the application renders. After a client-side navigation, the document SHALL hold only the tags of the page now shown. None of the static tags of the page the visitor first loaded SHALL remain.

The static file already holds exactly one of each, and the build checks that. This requirement covers the document after JavaScript runs, which is what a rendering crawler indexes. Measured before this requirement existed: two of each on every route, and after `/` → `/blog` the home page's canonical still came first.

The application SHALL NOT leave the document without these tags while a route's code is still loading. Until the page renders its own set, the prerendered set stays.

#### Scenario: Direct load of a prerendered Polish page

- **WHEN** a visitor loads `/` or `/blog` from its prerendered file and the application has rendered its own metadata
- **THEN** the document contains exactly one `<title>`, one `<meta name="description">` and one `<link rel="canonical">`
- **AND** the canonical points at the loaded address

#### Scenario: Direct load of a prerendered English page

- **WHEN** a visitor loads `/en/` from its prerendered file and the application has rendered its own metadata
- **THEN** the document contains exactly one `<title>`, one `<meta name="description">` and one `<link rel="canonical">`
- **AND** the canonical points at the `/en/` address

#### Scenario: Direct load of a prerendered article

- **WHEN** a visitor loads a blog post from its prerendered file and the application has rendered its own metadata
- **THEN** no metadata tag the page emits appears more than once
- **AND** the document carries exactly three hreflang links, as the static file does

#### Scenario: Client-side navigation after a prerendered load

- **WHEN** a visitor loads `/` from its prerendered file and then moves to `/blog` without a document load
- **THEN** the document contains exactly one `<link rel="canonical">`, pointing at `/blog`
- **AND** no tag carrying the home page's title or description remains

#### Scenario: Client-side navigation in English

- **WHEN** a visitor loads `/en/` from its prerendered file and then moves to `/en/blog` without a document load
- **THEN** the document contains exactly one `<link rel="canonical">`, pointing at `/en/blog`

#### Scenario: Checked without a production build

- **WHEN** the automated suite verifies this requirement
- **THEN** it reproduces the prerendered file from the running application the way the prerender step captures it, and serves that file as the next document load
- **AND** it runs on the default development server, with no `PW_PREVIEW` and no read of `dist/`
- **AND** it counts the tags only after the application has inserted its own, so a document that has not mounted yet cannot pass
