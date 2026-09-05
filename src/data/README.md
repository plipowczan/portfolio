# 📚 Blog Data Loader

Jak artykuły bloga i lekcje kursu trafiają z plików markdown do aplikacji.

> Wiążącym kontraktem jest `AGENTS.md` w tym folderze. Ten plik to przewodnik po
> polsku dla człowieka.

---

## 🔄 Jak to działa

### Indeks budowany raz, przy buildzie

Markdown nie trafia już do bundla przeglądarki. `scripts/generate-content.mjs`
czyta `src/content/blog/*.md`, `src/content/blog/en/*.md` i
`src/content/kurs/*.md`, parsuje frontmatter i zapisuje do
`src/data/generated/`:

- `index.js` — lekki indeks (wszystkie pola **poza** treścią) plus mapy leniwych
  importów,
- `blog/<lang>-<slug>.js` i `kurs/<slug>.js` — po jednym module na artykuł
  i lekcję, z samą treścią.

Generator jest wtyczką Vite: leci w `buildStart` i pilnuje `src/content/**` w
`npm run dev`. `blogPosts.js` i `coursePosts.js` czytają wygenerowany indeks.

**Oznacza to:**

- ✅ Nowe artykuły są **automatycznie** wykrywane — wrzucasz plik, pojawia się
- ✅ Nie musisz niczego importować ani aktualizować żadnej listy
- ✅ Listing `/blog` i hub kursu renderują się z samego indeksu
- ✅ Treść artykułu pobiera się dopiero po jego otwarciu, osobnym chunkiem

`src/data/generated/` to artefakt buildu — jest w `.gitignore`. Generator jest
powtarzalny, więc nieaktualny katalog naprawia dowolny build.

### Filtrowanie plików

Generator automatycznie **pomija**:

- ❌ Pliki wsadowe: `*_wsad.md`
- ❌ Pliki template: `_*.md`
- ❌ Dokumentację: `README.md`, `AGENTS.md`, `CLAUDE.md`

**Ładuje tylko:**

- ✅ Regularne pliki: `artykul.md`

---

## ✅ Walidacja front matter

### Wymagane pola (artykuł)

Każdy artykuł **MUSI** zawierać następujące pola w front matter:

```yaml
---
id: 1 # Number - unikalne ID
slug: slug-artykulu # String - URL-friendly
title: Tytuł artykułu # String
excerpt: Krótki opis... # String (150-200 znaków)
category: Kategoria # String (Automatyzacja/No-Code/AI)
author: Pawel Lipowczan # String
date: 2025-11-15 # String (YYYY-MM-DD)
readTime: 10 min # String
image: /images/og-*.webp # String (ścieżka do obrazka)
tags: # Array (opcjonalne)
  - Tag1
  - Tag2
---
```

Lekcja kursu wymaga `slug`, `order` (liczba), `title` i `excerpt` (string).

### Walidacja

Generator sprawdza:

1. **Wymagane pola** — czy wszystkie istnieją
2. **Typ `id`** — czy jest liczbą (artykuł)
3. **Typ `order`** — czy jest liczbą (lekcja)
4. **`slug`** — czy jest niepustym stringiem
5. **Tagi** — brakujące lub nieprawidłowe dają ostrzeżenie i pustą tablicę `[]`

### Obsługa błędów

Nieprawidłowy front matter **przewraca build**:

```
❌ Generator treści: Missing required fields in nowy-artykul.md: excerpt
```

Wcześniej walidacja działała w przeglądarce i cicho pomijała zepsuty artykuł.
Walidacja odpalana w przeglądarce może zawieść dopiero po wypuszczeniu strony —
teraz problem widać w buildzie, z nazwą pliku i nazwą brakującego pola.

---

## 📝 Dodawanie nowego artykułu

### Krok po kroku

1. **Utwórz plik markdown** w `src/content/blog/`:

   ```
   src/content/blog/nowy-artykul.md
   ```

2. **Dodaj prawidłowy front matter** (wszystkie wymagane pola)

3. **Zapisz plik**

4. **Gotowe!** ✅
   - Artykuł automatycznie pojawi się na liście
   - Nie musisz modyfikować `blogPosts.js`
   - Przy włączonym `npm run dev` wystarczy zapis, bez restartu serwera

### Przykład minimalnego artykułu

```markdown
---
id: 4
slug: nowy-artykul
title: Nowy artykuł o automatyzacji
excerpt: Krótki opis tego co znajdziesz w artykule. Ok. 150-200 znaków.
category: Automatyzacja
author: Pawel Lipowczan
date: 2025-11-15
readTime: 5 min
image: /images/og-nowy-artykul.webp
tags:
  - Automatyzacja
  - AI
---

# Nowy artykuł o automatyzacji

Treść artykułu w markdown...
```

---

## 🐛 Debugging

### Sprawdzenie załadowanych artykułów

W konsoli przeglądarki:

```javascript
// Pokaż wszystkie artykuły (bez treści - indeks)
console.log(blogPosts);

// Sprawdź liczbę artykułów
console.log(blogPosts.length);

// Sprawdź konkretny artykuł
console.log(getPostBySlug("slug-artykulu"));
```

Treści w indeksie nie ma. Żeby ją zobaczyć:

```javascript
loadPostContent("pl", "slug-artykulu").then(console.log);
```

### Ręczne uruchomienie generatora

```bash
node scripts/generate-content.mjs
```

### Typowe problemy

#### Problem: build wywala się na `Missing required fields`

**Rozwiązanie:**
Dodaj brakujące pola do front matter. Komunikat mówi, w którym pliku i których:

```
❌ Generator treści: Missing required fields in article.md: excerpt, date, image
```

#### Problem: Artykuł nie pojawia się na liście

**Rozwiązania:**

1. Sprawdź czy nazwa pliku nie kończy się na `_wsad.md`
2. Sprawdź czy nazwa nie zaczyna się od `_`
3. Sprawdź czy plik leży w `src/content/blog/` albo `src/content/blog/en/`
4. Uruchom `node scripts/generate-content.mjs` i przeczytaj wynik

#### Problem: strona artykułu pokazuje „Nie udało się wczytać treści"

**Rozwiązanie:**
Chunk z treścią nie doszedł — najczęściej wdrożenie w trakcie sesji albo
przerwana sieć. Odśwież stronę. Jeśli powtarza się lokalnie, przebuduj:
`npm run build`.

---

## 🔧 API funkcji

### `blogPosts`

**Typ:** `Array<PostIndexEntry>`

Główna tablica wszystkich artykułów **bez treści**, posortowana od najnowszych.

```javascript
import { blogPosts } from "./data/blogPosts";

console.log(blogPosts[0]); // Najnowszy artykuł
```

### `loadPostContent(lang, slug)`

**Parametry:**

- `lang` (`"pl" | "en"`) — język artykułu
- `slug` (string) — slug artykułu

**Zwraca:** `Promise<string>` — treść w markdown. Odrzuca się dla nieznanej pary.

```javascript
import { loadPostContent } from "./data/blogPosts";

const markdown = await loadPostContent("pl", "automatyzacja-email");
```

W komponentach nie wołaj tego wprost — użyj hooka `useContentBody`, który
obsługuje stan wczytywania, stan błędu i znacznik gotowości dla prerenderu.

### `getPostBySlug(slug)`

**Parametry:**

- `slug` (string) - Slug artykułu

**Zwraca:** `PostIndexEntry | null`

```javascript
import { getPostBySlug } from "./data/blogPosts";

const post = getPostBySlug("automatyzacja-email");
if (post) {
  console.log(post.title);
}
```

### `getPostsByCategory(category)`

**Parametry:**

- `category` (string) - Nazwa kategorii

**Zwraca:** `Array<PostIndexEntry>`

```javascript
import { getPostsByCategory } from "./data/blogPosts";

const aiPosts = getPostsByCategory("AI");
console.log(`Artykułów AI: ${aiPosts.length}`);
```

### `getPostsByTag(tag)`

**Parametry:**

- `tag` (string) - Nazwa tagu

**Zwraca:** `Array<PostIndexEntry>`

```javascript
import { getPostsByTag } from "./data/blogPosts";

const n8nPosts = getPostsByTag("n8n");
```

### `getAllCategories()`

**Zwraca:** `Array<string>`

Tablica unikalnych kategorii.

```javascript
import { getAllCategories } from "./data/blogPosts";

const categories = getAllCategories();
// ['Automatyzacja', 'No-Code', 'AI']
```

### `getAllTags()`

**Zwraca:** `Array<string>`

Tablica unikalnych tagów.

```javascript
import { getAllTags } from "./data/blogPosts";

const tags = getAllTags();
// ['AI', 'n8n', 'OpenAI', 'Make', ...]
```

---

## 📊 Struktura wpisu indeksu

```typescript
interface PostIndexEntry {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // YYYY-MM-DD format
  readTime: string; // "X min" format
  image: string; // "/images/og-*.webp"
  tags: string[];
  lang: "pl" | "en";
  alternateSlug: string | null;
  description: string | null;
  modified: string | null; // YYYY-MM-DD format
}
```

Pola `content` tu nie ma — treść pobiera `loadPostContent`.

---

## ⚡ Performance

Indeks 60 artykułów i 8 lekcji waży kilkadziesiąt kilobajtów i jedzie z
aplikacją, żeby listingi renderowały się synchronicznie i dały się
prerenderować. Treści — 722 kB markdownu — nie ma w pierwszym ładowaniu wcale.

Pierwszy ładunek JS strony głównej pilnuje bramka w buildzie:
`scripts/check-payload-budget.mjs`. Przekroczenie pułapu wywraca
`npm run build:prerender`, czyli też wdrożenie na Vercelu.

Publikacja kolejnego artykułu powiększa pierwszy ładunek o jego wpis w indeksie,
nie o jego treść.

---

## 🔐 Bezpieczeństwo

### Walidacja

Front matter jest walidowany w buildzie, zanim cokolwiek trafi do `dist/`.

### Brak XSS

Markdown content jest renderowany przez `react-markdown` który sanitizuje HTML.

### Error boundaries

Rozważ dodanie React Error Boundary wokół komponentów blogowych:

```jsx
<ErrorBoundary fallback={<div>Błąd ładowania artykułu</div>}>
  <BlogPost post={post} />
</ErrorBoundary>
```

---

## 📝 Changelog

### v3.0 (2026-09-05)

- ✅ Indeks i moduły treści generowane w buildzie (`scripts/generate-content.mjs`)
- ✅ Treść artykułu i lekcji pobierana na żądanie, osobnym chunkiem
- ✅ `gray-matter` zniknął z bundla przeglądarki
- ✅ Zepsuty front matter przewraca build zamiast po cichu gubić artykuł

### v2.0 (2025-11-15)

- ✅ Automatyczny import przez `import.meta.glob`
- ✅ Walidacja front matter
- ✅ Error handling
- ✅ Filtrowanie plików wsadowych

### v1.0 (2025-11-10)

- Manualne importy
- Brak walidacji

---

**Ostatnia aktualizacja:** 2026-09-05
