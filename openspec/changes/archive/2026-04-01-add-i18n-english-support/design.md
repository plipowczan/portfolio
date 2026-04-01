## Context

Portfolio SPA (React 19 + Vite 7 + Tailwind 3) jest w pełni po polsku — ~50 hardcoded stringów w komponentach, 22 posty blogowe, 9 projektów, 3 strony prawne. Brak jakiejkolwiek infrastruktury i18n. Strona jest prerenderowana Puppeteerem i deployowana na Vercel.

Kluczowe ograniczenie: **obecne polskie URL-e nie mogą się zmienić** — żadnych prefixów, reorganizacji, ani redirectów dla PL. Angielski dodajemy pod `/en/`.

## Goals / Non-Goals

**Goals:**
- Pełne wsparcie dwujęzyczne (PL + EN) dla całej strony
- Zero breaking changes dla istniejących polskich URL-i
- Automatyczna detekcja języka przeglądarki z zapisem preferencji
- Pełne SEO: hreflang, alternate links, dwujęzyczna sitemap, prerendering obu wersji
- Skalowalność — łatwe dodanie trzeciego języka w przyszłości

**Non-Goals:**
- Server-side language detection (Vercel edge functions) — na razie client-side wystarczy
- Osobne domeny/subdomeny per język
- CMS/backend do zarządzania tłumaczeniami — pliki JSON + markdown
- Automatyczne tłumaczenie maszynowe w runtime

## Decisions

### 1. Biblioteka i18n: `react-i18next`

**Wybór:** `react-i18next` + `i18next` + `i18next-browser-languagedetector`

**Alternatywy:**
- Custom React Context + JSON — prostsze, ale brak lazy loading namespace'ów, brak interpolacji, brak pluralizacji
- `react-intl` (FormatJS) — cięższy, API oparte na komponentach zamiast hooków, mniejszy ekosystem

**Uzasadnienie:** Standard branżowy, hook-based API (`useTranslation`), namespace'y, lazy loading, wsparcie dla interpolacji i pluralizacji. Użytkownik zna bibliotekę z innych projektów.

### 2. Routing: opcjonalny prefix z nested routes

**Wybór:** Parametr `/:lang?` jako opcjonalny segment w React Router

```
/                    → PL (domyślny, bez prefixu)
/blog                → PL
/blog/:slug          → PL
/en/                 → EN
/en/blog             → EN
/en/blog/:slug       → EN
```

**Implementacja w App.jsx:**

```jsx
<Routes>
  <Route path="/:lang?" element={<LocaleLayout />}>
    <Route index element={<Home />} />
    <Route path="blog" element={<Blog />} />
    <Route path="blog/:slug" element={<BlogPostPage />} />
    <Route path="projects/:slug" element={<ProjectPage />} />
    <Route path="privacy-policy" element={<PrivacyPolicy />} />
    <Route path="terms-of-service" element={<TermsOfService />} />
    <Route path="cookie-policy" element={<CookiePolicy />} />
  </Route>
</Routes>
```

`LocaleLayout` — wrapper component:
- Odczytuje `:lang` z URL (`useParams`)
- Jeśli `lang === "en"` → ustawia i18next na EN
- Jeśli `lang` jest undefined lub inne → ustawia PL (domyślny)
- Jeśli `lang` jest nieprawidłowe (np. `/fr/blog`) → redirect do PL equivalenta
- Ustawia `<html lang="...">` przez Helmet
- Renderuje `<Outlet />`

**Alternatywy:**
- Osobne Route definitions dla PL i EN — duplikacja, trudne utrzymanie
- Query parameter `?lang=en` — słabe SEO, niestandardowe
- Subdomeny `en.pawel.lipowczan.pl` — wymaga konfiguracji DNS, komplikuje Vercel

**Uzasadnienie:** Jeden zestaw routes, zero breaking changes dla PL URL-i, czyste URL-e dla EN, standard SEO.

### 3. Struktura plików tłumaczeń

**Wybór:** Namespace'owane JSON-y w `src/locales/`

```
src/locales/
├── pl/
│   ├── common.json      # nav, footer, buttons, cookie banner
│   ├── home.json        # hero, about, skills, testimonials, contact
│   ├── projects.json    # opisy projektów (9 obiektów)
│   └── legal.json       # privacy, terms, cookies (3 strony)
└── en/
    ├── common.json
    ├── home.json
    ├── projects.json
    └── legal.json
```

**Klucze w JSON:** Flat, z prefixem sekcji:

```json
{
  "hero.tagline": "Your Tech Guide",
  "hero.description": "Software architect and technology advisor...",
  "hero.cta.projects": "See Projects",
  "hero.cta.contact": "Get in Touch"
}
```

**Alternatywy:**
- Nested JSON (`hero: { tagline: "..." }`) — trudniejsze w wyszukiwaniu kluczy
- Jeden duży plik per język — brak lazy loading, trudne zarządzanie

### 4. Blog: dwujęzyczny z mapowaniem slugów

**Wybór:** Pliki PL pozostają w `src/content/blog/`, EN w `src/content/blog/en/`

```
src/content/blog/
├── vibe-coding-przewodnik.md          # PL (obecny, bez zmian)
├── 5-repozytoriow-github-claude-code.md  # PL
├── ...                                 # 22 plików PL
└── en/
    ├── vibe-coding-guide.md           # EN (nowy)
    ├── 5-github-repos-claude-code.md  # EN
    └── ...                            # 22 plików EN
```

**Frontmatter — nowe pola w PL i EN:**

```yaml
# PL post
---
lang: pl
alternateSlug: vibe-coding-guide
---

# EN post
---
lang: en
alternateSlug: vibe-coding-przewodnik
---
```

**Modyfikacja `blogPosts.js`:**
- Glob pattern rozszerzony o `../content/blog/en/*.md`
- Parsowanie pola `lang` (domyślnie `pl` jeśli brak)
- Parsowanie `alternateSlug` dla hreflang linkowania
- Nowe eksporty: `getPostsByLang(lang)`, `getAlternatePost(slug)`
- Istniejące eksporty (`getPostBySlug`, `blogPosts`) zachowują kompatybilność — zwracają posty z bieżącego języka

**Alternatywy:**
- Reorganizacja do `blog/pl/` i `blog/en/` — breaking change dla istniejących importów i ewentualnych referencji
- Pole `lang` w nazwie pliku (`slug.en.md`) — mniej intuicyjne, komplikuje glob pattern

### 5. Dane statyczne: projekty i skills

**Wybór:** Tłumaczenia w `projects.json` i `home.json` (namespace'y i18next), dane techniczne zostają w JS

```js
// projects.js — zachowuje strukturę, ale teksty przeniesione do i18n
export const projects = [
  {
    id: "note-taker",
    slug: "note-taker-add-ons",          // PL slug
    slugEn: "note-taker-add-ons",         // EN slug (może być ten sam)
    featured: true,
    image: "/images/projects/note-taker.webp",
    technologies: ["Make", "Notion API", "OpenAI"],
    category: "Automation",
    // Teksty (title, description, features, benefits) → i18n JSON
  },
];
```

```json
// locales/en/projects.json
{
  "note-taker.title": "Note Taker + Add-ons",
  "note-taker.description": "Automated meeting notes...",
  "note-taker.features.0": "Automatic meeting recording",
  "note-taker.benefits.0": "Save 5-10 hours/week on notes"
}
```

### 6. Przełącznik języka

**Wybór:** Toggle PL|EN w nawigacji

- **Desktop:** Obok ostatniego nav linka (przed CTA jeśli istnieje)
- **Mobile:** W hamburger menu, na górze lub na dole
- Kliknięcie → nawigacja do odpowiednika w drugim języku
- Dla stron z `alternateSlug` (blog, projekty) — mapowanie na odpowiedni slug
- Dla stron statycznych — zamiana prefixu (`/about` ↔ `/en/about`)
- Zapis wyboru w `localStorage` key: `i18nextLng`

### 7. Detekcja języka

**Wybór:** `i18next-browser-languagedetector` z kolejnością:

1. URL path (`/en/` → EN)
2. `localStorage` (zapisana preferencja)
3. `navigator.language` (język przeglądarki)
4. Fallback: `pl`

**Zachowanie przy pierwszej wizycie na `/`:**
- Jeśli `navigator.language` zaczyna się od `en` → **nie** robimy automatycznego redirectu (to by zaburzyło UX i SEO)
- Zamiast tego: wyświetlamy stronę PL, ale przełącznik jest widoczny
- Opcjonalnie: subtle banner "This site is also available in English" (do rozważenia)

**Uzasadnienie:** Automatyczny redirect na podstawie browser language jest kontrowersyjny — Google tego nie zaleca, a użytkownicy często mają ustawiony język OS inny niż preferowany język treści.

### 8. SEO: hreflang i sitemap

**Komponent SEO — rozszerzenie o hreflang:**

```jsx
<Helmet>
  <html lang={currentLang} />
  <link rel="alternate" hreflang="pl" href={plUrl} />
  <link rel="alternate" hreflang="en" href={enUrl} />
  <link rel="alternate" hreflang="x-default" href={plUrl} />
</Helmet>
```

**Sitemap — format z alternates:**

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://pawel.lipowczan.pl/blog/vibe-coding-przewodnik</loc>
    <xhtml:link rel="alternate" hreflang="pl" href="https://pawel.lipowczan.pl/blog/vibe-coding-przewodnik"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://pawel.lipowczan.pl/en/blog/vibe-coding-guide"/>
  </url>
</urlset>
```

### 9. Prerendering — rozszerzenie o EN

Skrypt `prerender.mjs` rozszerzony o:
- Generowanie EN routes: `/en/`, `/en/blog`, `/en/blog/:slug`, `/en/projects/:slug`, `/en/privacy-policy`, etc.
- Odczyt EN blog postów z `src/content/blog/en/`
- Podwójna liczba stron do prerenderowania (~66 zamiast ~33)

### 10. Strony prawne — ekstrakcja do i18n

**Wybór:** Treść prawna w namespace `legal` (JSON), komponenty stają się template'ami

Obecne strony (PrivacyPolicy, TermsOfService, CookiePolicy) mają ~200 linii hardcoded tekstu każda. Ekstrakcja do JSON z kluczami per sekcja:

```json
{
  "privacy.title": "Privacy Policy",
  "privacy.section1.title": "Information We Collect",
  "privacy.section1.content": "We collect information..."
}
```

Komponenty zachowują layout i animacje, ale pobierają treść z `useTranslation('legal')`.

## Risks / Trade-offs

**[Podwojenie stron do prerendera] → Mitygacja:** Czas build'u wzrośnie ~2x (z ~33 do ~66 stron). Akceptowalne — build i tak trwa kilkadziesiąt sekund. Monitorujemy czy Vercel build timeout nie zostanie przekroczony.

**[Duży zakres zmian — dotyka ~30 plików] → Mitygacja:** Implementacja w fazach — infrastruktura i18n → routing → UI strings → blog → projekty → legal → SEO/prerender. Każda faza testowalna niezależnie.

**[Synchronizacja treści PL↔EN] → Mitygacja:** `alternateSlug` w frontmatter tworzy jawne powiązanie. Brak runtime validation czy wszystkie posty mają tłumaczenie — posty bez tłumaczenia po prostu nie mają alternate link. Można dodać skrypt CI do walidacji kompletności.

**[Stale translations] → Mitygacja:** Przy aktualizacji tekstu PL trzeba pamiętać o EN. Brak automatyzacji — decyzja procesowa, nie techniczna. Rozważyć skrypt sprawdzający daty modyfikacji PL vs EN.

**[Detekcja języka bez auto-redirect] → Trade-off:** Użytkownicy EN na `/` widzą stronę PL i muszą sami przełączyć. Lepsze niż nieoczekiwany redirect — zgodne z zaleceniami Google. Przełącznik musi być dobrze widoczny.

## Open Questions

1. **Banner "Available in English"?** — Czy wyświetlać dyskretny banner dla użytkowników z `navigator.language` EN na stronie PL? Może poprawić discoverability wersji EN.

2. **Walidacja kompletności tłumaczeń w CI?** — Skrypt sprawdzający czy każdy post PL ma odpowiednik EN i odwrotnie. Nice-to-have na start, ale warto zaplanować.

3. **OG images per język?** — Obecnie OG images mają polski tekst. Czy generujemy osobne OG images dla EN? Duży scope addition.
