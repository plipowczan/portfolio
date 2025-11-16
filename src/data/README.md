# 📚 Blog Data Loader

System automatycznego ładowania artykułów blogowych z plików markdown.

---

## 🔄 Jak to działa

### Automatyczny import

Plik `blogPosts.js` używa **Vite glob imports** do automatycznego załadowania wszystkich plików markdown z folderu `src/content/blog/`.

```javascript
const blogFiles = import.meta.glob("../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
```

**Oznacza to:**
- ✅ Nowe artykuły są **automatycznie** wykrywane
- ✅ Nie musisz ręcznie importować każdego pliku
- ✅ Nie musisz aktualizować tablicy blogPosts

### Filtrowanie plików

System automatycznie **pomija**:
- ❌ Pliki wsadowe: `*_wsad.md`
- ❌ Pliki template: `_*.md`
- ❌ Dokumentację: `README.md`

**Ładuje tylko:**
- ✅ Regularne pliki: `artykul.md`

---

## ✅ Walidacja front matter

### Wymagane pola

Każdy artykuł **MUSI** zawierać następujące pola w front matter:

```yaml
---
id: 1                    # Number - unikalne ID
slug: slug-artykulu      # String - URL-friendly
title: Tytuł artykułu    # String
excerpt: Krótki opis...  # String (150-200 znaków)
category: Kategoria      # String (Automatyzacja/No-Code/AI)
author: Pawel Lipowczan  # String
date: 2025-11-15         # String (YYYY-MM-DD)
readTime: 10 min         # String
image: /images/og-*.webp # String (ścieżka do obrazka)
tags:                    # Array (opcjonalne)
  - Tag1
  - Tag2
---
```

### Walidacja

System wykonuje następujące sprawdzenia:

1. **Wymagane pola** - sprawdza czy wszystkie wymagane pola istnieją
2. **Typ ID** - weryfikuje czy `id` jest liczbą
3. **Tagi** - jeśli brakuje lub nieprawidłowe, używa pustej tablicy `[]`

### Obsługa błędów

Jeśli artykuł ma **nieprawidłowy front matter**:

1. ❌ Błąd zostaje wylogowany do konsoli:
   ```
   Error parsing blog post article.md: Missing required fields: excerpt, date
   ```

2. ⚠️ Artykuł jest **pomijany** (nie crashuje aplikacji)

3. ✅ Pozostałe artykuły ładują się normalnie

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
// Pokaż wszystkie artykuły
console.log(blogPosts);

// Sprawdź liczbę artykułów
console.log(blogPosts.length);

// Sprawdź konkretny artykuł
console.log(getPostBySlug('slug-artykulu'));
```

### Typowe problemy

#### Problem: Artykuł nie pojawia się na liście

**Rozwiązania:**
1. Sprawdź czy nazwa pliku nie kończy się na `_wsad.md`
2. Sprawdź czy nazwa nie zaczyna się od `_`
3. Sprawdź console - może być błąd walidacji
4. Sprawdź czy wszystkie wymagane pola są w front matter
5. Zrestartuj dev server (`npm run dev`)

#### Problem: Błąd "Missing required fields"

**Rozwiązanie:**
Dodaj brakujące pola do front matter. Komunikat błędu powie które:

```
Error parsing blog post article.md: Missing required fields: excerpt, date, image
```

#### Problem: Artykuł ładuje się ale ma undefined fields

**Rozwiązanie:**
To niemożliwe - walidacja zapobiega ładowaniu artykułów z brakującymi polami.

---

## 🔧 API funkcji

### `blogPosts`

**Typ:** `Array<Post>`

Główna tablica wszystkich artykułów, posortowana od najnowszych.

```javascript
import { blogPosts } from './data/blogPosts';

console.log(blogPosts[0]); // Najnowszy artykuł
```

### `getPostBySlug(slug)`

**Parametry:**
- `slug` (string) - Slug artykułu

**Zwraca:** `Post | null`

```javascript
import { getPostBySlug } from './data/blogPosts';

const post = getPostBySlug('automatyzacja-email');
if (post) {
  console.log(post.title);
}
```

### `getPostsByCategory(category)`

**Parametry:**
- `category` (string) - Nazwa kategorii

**Zwraca:** `Array<Post>`

```javascript
import { getPostsByCategory } from './data/blogPosts';

const aiPosts = getPostsByCategory('AI');
console.log(`Artykułów AI: ${aiPosts.length}`);
```

### `getPostsByTag(tag)`

**Parametry:**
- `tag` (string) - Nazwa tagu

**Zwraca:** `Array<Post>`

```javascript
import { getPostsByTag } from './data/blogPosts';

const n8nPosts = getPostsByTag('n8n');
```

### `getAllCategories()`

**Zwraca:** `Array<string>`

Tablica unikalnych kategorii.

```javascript
import { getAllCategories } from './data/blogPosts';

const categories = getAllCategories();
// ['Automatyzacja', 'No-Code', 'AI']
```

### `getAllTags()`

**Zwraca:** `Array<string>`

Tablica unikalnych tagów.

```javascript
import { getAllTags } from './data/blogPosts';

const tags = getAllTags();
// ['AI', 'n8n', 'OpenAI', 'Make', ...]
```

---

## 📊 Struktura Post

```typescript
interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;        // YYYY-MM-DD format
  readTime: string;    // "X min" format
  image: string;       // "/images/og-*.webp"
  tags: string[];
}
```

---

## ⚡ Performance

### Eager loading

System używa **eager imports** (`eager: true`), co oznacza:

✅ **Zalety:**
- Wszystkie artykuły ładują się przy starcie
- Brak opóźnień przy nawigacji
- Prostsza implementacja

⚠️ **Wady:**
- Initial bundle zawiera wszystkie artykuły
- Dla 100+ artykułów może być wolniejszy

### Optymalizacja dla dużej liczby artykułów

Jeśli masz > 50 artykułów, rozważ:

1. **Lazy loading** - ładuj artykuły na żądanie
2. **Pagination** - pokazuj 10-20 artykułów na stronę
3. **Virtual scrolling** - renderuj tylko widoczne artykuły

---

## 🔐 Bezpieczeństwo

### Walidacja

System **zawsze** waliduje front matter przed zwróceniem posta.

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

### v2.0 (2025-11-15)
- ✅ Automatyczny import przez `import.meta.glob`
- ✅ Walidacja front matter
- ✅ Error handling
- ✅ Filtrowanie plików wsadowych

### v1.0 (2025-11-10)
- Manualne importy
- Brak walidacji

---

**Ostatnia aktualizacja:** 2025-11-15


