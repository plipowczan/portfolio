# 🛠️ Skrypty automatyzacji bloga

Zbiór skryptów Node.js do zarządzania artykułami blogowymi.

> **Uwaga:** Od wersji 2.0 generowanie artykułów odbywa się automatycznie przez AI Agent w Cursor. Skrypty służą do generowania obrazów, konwersji obrazków i aktualizacji sitemap.

---

## 📋 Dostępne skrypty

### 1. `generate-image.js` - Generowanie obrazów przez Google Gemini API

Generuje obrazy używając Google Gemini API (modeli `gemini-3-pro-image-preview` lub `gemini-2.5-flash-image`).

**Użycie:**

```bash
# Podstawowe użycie (zapisuje do public/images/)
node scripts/generate-image.js "twój prompt tutaj"

# Lub przez npm:
npm run img:generate "twój prompt tutaj"

# Z wyborem modelu
npm run img:generate "prompt" -- --model gemini-2.5-flash-image

# Z własną nazwą pliku (dla obrazów OG)
node scripts/generate-image.js "prompt" --filename og-article-slug

# Z własnym folderem docelowym
node scripts/generate-image.js "prompt" --output custom-folder

# Pełny przykład: OG image z własną nazwą
node scripts/generate-image.js "Opis obrazu" --filename og-blog-post --output public/images
```

**Przykłady:**

```bash
# Prosty prompt (zapisuje do public/images/)
node scripts/generate-image.js "A beautiful sunset over mountains"

# Generowanie obrazu OG dla artykułu
node scripts/generate-image.js "Cyberpunk cityscape" --filename og-cyberpunk-article

# Szybszy model (Flash)
node scripts/generate-image.js "A robot in a garden" --model gemini-2.5-flash-image

# Własny folder docelowy
node scripts/generate-image.js "A sunset" --output generated-images
```

**Co robi:**

- Generuje obrazy na podstawie tekstowego promptu
- **Domyślnie zapisuje do `public/images/`** (idealne dla obrazów OG)
- Obsługuje wiele modeli Gemini
- Automatycznie wykrywa format obrazu (JPEG, PNG)
- Możliwość ustawienia własnej nazwy pliku i folderu docelowego

**Dostępne modele:**

- `gemini-3-pro-image-preview` (domyślny) - Wysoka jakość, lepsze renderowanie tekstu
- `gemini-2.5-flash-image` - Szybki, zoptymalizowany pod kątem prędkości

**Parametry:**

- `--output <path>` - Folder docelowy (domyślnie: `public/images/`)
- `--filename <name>` - Własna nazwa pliku (bez rozszerzenia)
- `--model <model>` - Model Gemini do użycia
- `--size <size>` - Tylko informacyjny (nie wpływa na rozmiar)

**Uwaga o rozmiarze:**

- Gemini API generuje obrazy w domyślnym rozmiarze modelu
- Parametr `--size` jest tylko informacyjny (nie wpływa na rozmiar)
- Do zmiany rozmiaru użyj zewnętrznych narzędzi (np. `convert-to-webp.js` lub `sharp`)

**Konfiguracja:**
Wymagana zmienna środowiskowa w `.env`:

```bash
GEMINI_API_KEY=twoj-klucz-api-tutaj
```

Opcjonalne zmienne:

```bash
GEMINI_MODEL=gemini-3-pro-image-preview  # Domyślny model
IMAGE_SIZE=1K                             # Tylko informacyjne
```

**Pomoc:**

```bash
node scripts/generate-image.js --help
```

**Gdzie uzyskać klucz API:**
[Google AI Studio](https://aistudio.google.com/app/apikey)

---

### 2. `convert-to-webp.js` - Konwersja obrazów PNG → WebP

Konwertuje obrazy PNG na WebP z optymalizacją jakości i rozmiaru.

**Użycie:**

```bash
# Pojedynczy plik
node scripts/convert-to-webp.js <ścieżka-do-pliku.png>

# Cały folder
node scripts/convert-to-webp.js <ścieżka-do-folderu>

# Domyślnie (public/images)
node scripts/convert-to-webp.js

# Lub przez npm:
npm run img:convert <ścieżka>
```

**Przykłady:**

```bash
# Pojedynczy obrazek
node scripts/convert-to-webp.js public/images/og-home.png

# Wszystkie obrazy w folderze
node scripts/convert-to-webp.js public/images

# Domyślnie konwertuje public/images
node scripts/convert-to-webp.js
```

**Co robi:**

- Konwertuje PNG na WebP (jakość 85%)
- Pokazuje porównanie rozmiarów
- Oszczędność typowo 95%+
- Zachowuje oryginalną nazwę (zmienia tylko rozszerzenie)

**Parametry:**

- Quality: 85% (hardcoded, można zmienić w kodzie)
- Format: WebP

**Pomoc:**

```bash
node scripts/convert-to-webp.js --help
```

---

### 3. `update-sitemap.js` - Aktualizacja sitemap.xml

Automatycznie generuje sitemap.xml na podstawie wszystkich artykułów.

**Użycie:**

```bash
node scripts/update-sitemap.js

# Lub przez npm:
npm run blog:sitemap
```

**Co robi:**

- Skanuje wszystkie artykuły w `src/content/blog/`
- Parsuje metadane (slug, data)
- Generuje `public/sitemap.xml`
- Dodaje strony statyczne (home, blog, privacy, etc.)
- Sortuje według daty publikacji

**Konfiguracja:**
Zmień URL strony w pliku `scripts/update-sitemap.js`:

```javascript
const SITE_URL = "https://pawel.lipowczan.pl";
```

**Format sitemap:**

- Standard: XML Sitemap 0.9
- Priority: 0.3-1.0
- Changefreq: monthly/weekly
- Lastmod: Data publikacji artykułu

**Pomoc:**

```bash
node scripts/update-sitemap.js --help
```

---

## 🚀 Szybki start

### Instalacja

```bash
npm install
```

### Przykładowy workflow (z AI Agent)

```bash
# 1. W Cursor Chat napisz:
#    "Wygeneruj post na bloga na podstawie danych: [twoje dane]"
#    Agent utworzy plik wsadowy i artykuł

# 2. Wygeneruj obrazek OG przez Gemini API (bezpośrednio do public/images/)
node scripts/generate-image.js "Opis obrazu dla artykułu {slug}" --filename og-{slug}
# Obraz zostanie zapisany jako public/images/og-{slug}.jpeg

# 3. Konwertuj na WebP (opcjonalnie, jeśli potrzebujesz PNG najpierw przekonwertuj)
npm run img:convert public/images/og-{slug}.jpeg

# 4. Zaktualizuj sitemap
npm run blog:sitemap

# 5. Testuj
npm run dev
```

**Alternatywnie - ręczne tworzenie obrazu:**

```bash
# 2a. Stwórz obrazek OG manualnie lub przez inne narzędzie
#     Zapisz jako: public/images/og-{slug}.png

# 3a. Konwertuj na WebP
npm run img:convert public/images/og-{slug}.png
```

---

## 📁 Struktura plików

```
scripts/
├── generate-image.js         # Generowanie obrazów przez Gemini API
├── convert-to-webp.js        # Konwersja obrazów PNG → WebP
├── update-sitemap.js         # Generowanie sitemap.xml
└── README.md                 # Ten plik
```

---

## 🔧 Zależności

- `@google/generative-ai` - Google Gemini API (generowanie obrazów)
- `dotenv` - Ładowanie zmiennych środowiskowych
- `sharp` - Przetwarzanie obrazów (konwersja WebP)

Instalacja: `npm install`

---

## ⚙️ Konfiguracja

### Gemini API (Generowanie obrazów)

Wymagana zmienna środowiskowa w `.env`:

```bash
GEMINI_API_KEY=twoj-klucz-api-tutaj
```

Opcjonalne zmienne:

```bash
GEMINI_MODEL=gemini-3-pro-image-preview  # Domyślny model
IMAGE_SIZE=1K                             # Tylko informacyjne
```

**Uzyskaj klucz API:** [Google AI Studio](https://aistudio.google.com/app/apikey)

**Dostępne modele:**

- `gemini-3-pro-image-preview` - Wysoka jakość (domyślny)
- `gemini-2.5-flash-image` - Szybki

### Sharp (WebP)

Parametry konwersji WebP:

- Quality: `85`
- Format: `webp`

Możesz zmienić jakość w `scripts/convert-to-webp.js`.

### Sitemap

URL strony konfigurowany w `scripts/update-sitemap.js`:

```javascript
const SITE_URL = "https://pawel.lipowczan.pl";
```

---

## 📖 Dokumentacja

Pełna dokumentacja workflow: [BLOG_WORKFLOW.md](../BLOG_WORKFLOW.md)

---

## 🐛 Troubleshooting

### Błąd przy generowaniu obrazów

**"GEMINI_API_KEY environment variable is required"**

- Sprawdź czy masz plik `.env` w katalogu głównym projektu
- Upewnij się, że zawiera: `GEMINI_API_KEY=twoj-klucz-api`
- Uzyskaj klucz: [Google AI Studio](https://aistudio.google.com/app/apikey)

**"No image data found in response"**

- API może odrzucić prompt - spróbuj przepisać lub uprościć
- Sprawdź czy model jest dostępny (może być w preview)

**Błąd API (400 Bad Request)**

- Sprawdź czy używasz poprawnej nazwy modelu
- Upewnij się, że klucz API jest ważny i ma odpowiednie uprawnienia

### Błąd przy konwersji obrazów

Sprawdź czy `sharp` jest zainstalowany:

```bash
npm install sharp
```

### Sitemap nie zawiera nowego artykułu

Uruchom ponownie:

```bash
npm run blog:sitemap
```

### Artykuł nie pojawia się na blogu

1. Sprawdź czy plik jest w `src/content/blog/{slug}.md` (bez `_wsad.md`)
2. Sprawdź front matter (YAML)
3. Zrestartuj dev server: `npm run dev`

---

## 🤖 AI Agent

**Od wersji 2.0 wszystkie operacje generowania artykułów** wykonywane są przez AI Agent w Cursor.

Pełna dokumentacja: [BLOG_WORKFLOW.md](../BLOG_WORKFLOW.md)

---

## 📝 Licencja

Część projektu Pawel Lipowczan Portfolio.

---

**Ostatnia aktualizacja:** 2026-01-11  
**Wersja:** 2.1.0 (AI Agent edition + Image Generation)
