## Why

Portfolio jest dostępne wyłącznie po polsku, co ogranicza zasięg do polskojęzycznych odbiorców. Dodanie angielskiej wersji językowej otworzy stronę na międzynarodowych użytkowników — klientów, rekruterów i czytelników bloga. Polski pozostaje językiem domyślnym, angielski jako dodatkowy pod prefixem `/en/`.

## What Changes

### Infrastruktura i18n
- Dodanie `react-i18next` + `i18next` + `i18next-browser-languagedetector` jako zależności
- Nowy provider `I18nextProvider` w drzewie komponentów
- Pliki tłumaczeń w `src/locales/{pl,en}/` z namespace'ami (common, home, projects, legal)
- Detekcja języka przeglądarki (`navigator.language`) z zapisem wyboru w `localStorage`

### Routing (bez breaking changes dla PL)
- **Wszystkie obecne polskie URL-e pozostają bez zmian** — zero wpływu na istniejące SEO i bookmarki
- Opcjonalny prefix `/:lang?` w React Router — PL bez prefixu, EN pod `/en/`
- `LocaleLayout` wrapper ustawiający kontekst i18n na podstawie URL
- Dynamiczny atrybut `lang` na `<html>` (pl/en)
- Przełącznik PL|EN w nawigacji (desktop + mobile)

### Blog — dwujęzyczny content
- **Istniejące pliki PL `.md` pozostają na swoim miejscu** — bez reorganizacji do subdirektorii
- Nowe tłumaczenia EN w `src/content/blog/en/` (osobny katalog tylko dla EN)
- Nowe pole frontmatter: `lang`, `alternateSlug` (mapowanie PL↔EN)
- Aktualizacja `blogPosts.js` loadera — filtrowanie po języku
- Tłumaczenie slugów (PL i EN mają osobne slugi)
- Tłumaczenie wszystkich 22 istniejących postów na angielski

### Dane statyczne — wersje dwujęzyczne
- `projects.js` — struktura z kluczami `pl`/`en` dla tekstów (opisy, features, benefits)
- `skills.js` — tłumaczenie labels (highlights: "Lat Doświadczenia" → "Years of Experience")
- `testimonials.js` — wykorzystanie istniejącego pola `contentOriginal` dla EN

### SEO
- `hreflang` alternate links na każdej stronie (pl + en + x-default)
- Aktualizacja sitemap.xml — alternate URLs dla obu języków
- Aktualizacja skryptu prerender — generowanie stron dla obu języków
- Osobne meta descriptions i titles per język

### Strony prawne
- Tłumaczenie Privacy Policy, Terms of Service, Cookie Policy na angielski
- Ekstrakcja treści do systemu i18n (namespace `legal`)

### UI komponentów
- Ekstrakcja ~50 hardcoded Polish strings do plików tłumaczeń
- Komponenty: Navigation, Footer, Hero, About, Skills, ContactForm, CookieBanner, BlogPostPage

## Capabilities

### New Capabilities
- `i18n-infrastructure`: Konfiguracja react-i18next, pliki tłumaczeń, provider, detekcja języka, localStorage persistence
- `i18n-routing`: Opcjonalny prefix językowy w routingu, LocaleLayout, przełącznik języka, przekierowania
- `i18n-blog`: Dwujęzyczna struktura bloga, loader z filtrowaniem po języku, alternateSlug mapowanie
- `i18n-seo`: Hreflang tags, dynamiczny lang attribute, dwujęzyczny sitemap, prerendering obu wersji
- `i18n-content-translation`: Tłumaczenie wszystkich treści (UI strings, blog posts, projekty, legal, dane statyczne)

### Modified Capabilities
_(brak istniejących specyfikacji do modyfikacji)_

## Impact

### Pliki do modyfikacji
- **Routing**: `src/App.jsx`, `src/main.jsx`
- **Komponenty**: Navigation, Footer, Hero, About, Skills, ContactForm, Testimonials, CookieBanner, BlogPostPage, Blog, ProjectPage, SEO
- **Dane**: `blogPosts.js`, `projects.js`, `skills.js`, `testimonials.js`, `constants.js`
- **Strony prawne**: PrivacyPolicy, TermsOfService, CookiePolicy
- **Build**: `scripts/prerender.mjs`, `scripts/update-sitemap.js`
- **Config**: `vercel.json`, `index.html`
- **Blog content**: dodanie pola `lang`/`alternateSlug` do istniejących 22 plików PL + 22 nowe tłumaczenia EN

### Nowe zależności
- `react-i18next`, `i18next`, `i18next-browser-languagedetector`

### Ryzyko
- Duży zakres zmian — dotyka praktycznie każdy komponent z tekstem
- Tłumaczenie 22 postów blogowych to znaczący nakład pracy contentowej
- Bez breaking changes dla PL — obecne URL-e, blog content i routing pozostają nietknięte
