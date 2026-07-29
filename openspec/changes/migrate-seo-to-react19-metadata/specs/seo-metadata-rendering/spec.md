## ADDED Requirements

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

Prerendering przez Puppeteer MUSI widzieć komplet metadanych w DOM przed zrzutem HTML. Każdy z 98 adresów MUSI wygenerować się bez ostrzeżenia o braku metatagów.

#### Scenario: Pełny przebieg prerenderu

- **WHEN** uruchomimy `npm run build:prerender`
- **THEN** skrypt kończy się liczbą błędów równą zero
- **AND** nie zgłasza dla żadnej trasy braku metatagów SEO

#### Scenario: Statyczny plik artykułu

- **WHEN** odczytamy `dist/blog/<slug>/index.html` bez uruchamiania JavaScriptu
- **THEN** plik zawiera `<meta name="description">`, `<link rel="canonical">` i pary `hreflang` tego artykułu

### Requirement: Brak zależności react-helmet-async

Projekt NIE MOŻE zawierać `react-helmet-async` w zależnościach ani importować go w kodzie źródłowym.

#### Scenario: Zależności projektu

- **WHEN** sprawdzimy `package.json` oraz drzewo importów w `src/`
- **THEN** `react-helmet-async` nie występuje w żadnym z nich

#### Scenario: Testy nie potrzebują obejść

- **WHEN** testy E2E sprawdzają metadane
- **THEN** robią to na serwerze deweloperskim, bez własnego `baseURL` wskazującego na build produkcyjny
- **AND** nie zawierają tolerancji na brakujący opis uzasadnionej trybem deweloperskim
