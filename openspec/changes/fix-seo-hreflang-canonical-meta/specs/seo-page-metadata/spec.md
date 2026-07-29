## ADDED Requirements

### Requirement: Pojedynczy opis strony

Każdy dokument HTML serwowany przez witrynę MUSI zawierać dokładnie jeden tag `<meta name="description">`. Jedynym źródłem tego tagu jest komponent `SEO` (react-helmet-async). Szablon `index.html` NIE MOŻE deklarować własnego opisu.

#### Scenario: Strona bloga serwuje własny opis

- **WHEN** robot pobiera prerenderowany HTML dowolnego artykułu bloga
- **THEN** dokument zawiera dokładnie jeden tag `<meta name="description">`
- **AND** jego treść pochodzi z pola `excerpt` tego artykułu, nie z ogólnego opisu witryny

#### Scenario: Strona bez własnego opisu

- **WHEN** komponent `SEO` renderuje się bez przekazanego `description`
- **THEN** dokument nadal zawiera dokładnie jeden tag `<meta name="description">`
- **AND** jego treścią jest domyślny opis z `SITE_CONFIG.description`

### Requirement: Canonical wskazuje na własny adres

Każdy adres MUSI deklarować `<link rel="canonical">` wskazujący na siebie, z zachowaniem prefiksu wersji językowej. Strona w wersji angielskiej NIE MOŻE kanonikalizować się do odpowiednika polskiego.

#### Scenario: Angielska strona główna

- **WHEN** robot pobiera `https://pawel.lipowczan.pl/en/`
- **THEN** canonical wskazuje na `https://pawel.lipowczan.pl/en/`

#### Scenario: Angielskie strony prawne

- **WHEN** robot pobiera `/en/privacy-policy`, `/en/terms-of-service` albo `/en/cookie-policy`
- **THEN** canonical każdej z nich zawiera prefiks `/en` i wskazuje na pobrany adres

#### Scenario: Polska strona główna

- **WHEN** robot pobiera `https://pawel.lipowczan.pl/`
- **THEN** canonical wskazuje na `https://pawel.lipowczan.pl/`
- **AND** nie zawiera prefiksu językowego

### Requirement: Hreflang wyłącznie na istniejące adresy

Tagi `<link rel="alternate" hreflang="...">` MUSZĄ wskazywać wyłącznie na adresy zwracające kod 200. Komponent `SEO` NIE MOŻE budować adresu alternatywnego przez dodanie ani usunięcie prefiksu `/en` ze ścieżki bieżącej. Gdy tłumaczenie nie istnieje, para hreflang NIE MOŻE zostać wyemitowana.

#### Scenario: Artykuł z istniejącym tłumaczeniem

- **WHEN** robot pobiera `/blog/slabe-strony-claude-code`, którego pole `alternateSlug` wskazuje na `claude-code-weak-spots`
- **THEN** `hreflang="en"` wskazuje na `https://pawel.lipowczan.pl/en/blog/claude-code-weak-spots`
- **AND** `hreflang="pl"` oraz `hreflang="x-default"` wskazują na `https://pawel.lipowczan.pl/blog/slabe-strony-claude-code`

#### Scenario: Artykuł bez tłumaczenia

- **WHEN** robot pobiera artykuł, który nie ma pola `alternateSlug` albo wskazany odpowiednik nie istnieje
- **THEN** dokument nie zawiera tagu `alternate` dla drugiej wersji językowej
- **AND** nie powstaje adres złożony z prefiksu drugiej wersji i bieżącego sluga

#### Scenario: Zgodność z sitemapą

- **WHEN** dla dowolnego adresu z `sitemap.xml` porównamy pary hreflang z HTML i z sitemapy
- **THEN** obie deklaracje wskazują na ten sam adres

#### Scenario: Odwrotny kierunek tłumaczenia

- **WHEN** robot pobiera `/en/blog/claude-code-weak-spots`
- **THEN** `hreflang="pl"` oraz `hreflang="x-default"` wskazują na `https://pawel.lipowczan.pl/blog/slabe-strony-claude-code`

### Requirement: Link do wersji alternatywnej w prerenderowanym HTML

Przełącznik języka MUSI renderować element kotwicy z atrybutem `href` wskazującym na wersję alternatywną bieżącej strony. Adres MUSI być wyliczony podczas renderowania, nie w obsłudze zdarzenia kliknięcia, żeby trafił do prerenderowanego HTML.

#### Scenario: Artykuł z tłumaczeniem

- **WHEN** robot pobiera prerenderowany HTML artykułu posiadającego odpowiednik w drugim języku
- **THEN** dokument zawiera element `<a>` z atrybutem `href` wskazującym na adres tego odpowiednika

#### Scenario: Strona bez tłumaczenia jeden do jednego

- **WHEN** robot pobiera stronę, dla której odpowiednik nie istnieje
- **THEN** przełącznik prowadzi do listy artykułów w drugim języku albo do odpowiadającej ścieżki z prefiksem
- **AND** wskazany adres zwraca kod 200

#### Scenario: Zachowanie nawigacji po stronie klienta

- **WHEN** użytkownik klika przełącznik języka w przeglądarce
- **THEN** przejście odbywa się bez pełnego przeładowania strony
- **AND** trafia pod ten sam adres, który widnieje w atrybucie `href`
