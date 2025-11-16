# 🛠️ Skrypty automatyzacji bloga

Zbiór skryptów Node.js do zarządzania artykułami blogowymi.

> **Uwaga:** Od wersji 2.0 generowanie artykułów odbywa się automatycznie przez AI Agent w Cursor. Skrypty służą tylko do konwersji obrazków i aktualizacji sitemap.

---

## 📋 Dostępne skrypty

### 1. `convert-to-webp.js` - Konwersja obrazów PNG → WebP

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

### 2. `update-sitemap.js` - Aktualizacja sitemap.xml

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
const SITE_URL = 'https://pawellipowczan.pl'; // <- Twoja domena
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

# 2. Stwórz obrazek OG (manualnie lub przez AI)
#    Zapisz jako: public/images/og-{slug}.png

# 3. Konwertuj na WebP
npm run img:convert public/images/og-{slug}.png

# 4. Zaktualizuj sitemap
npm run blog:sitemap

# 5. Testuj
npm run dev
```

---

## 📁 Struktura plików

```
scripts/
├── convert-to-webp.js        # Konwersja obrazów PNG → WebP
├── update-sitemap.js         # Generowanie sitemap.xml
└── README.md                 # Ten plik
```

---

## 🔧 Zależności

- `sharp` - Przetwarzanie obrazów (konwersja WebP)

Instalacja: `npm install`

---

## ⚙️ Konfiguracja

### Sharp (WebP)

Parametry konwersji WebP:
- Quality: `85`
- Format: `webp`

Możesz zmienić jakość w `scripts/convert-to-webp.js`.

### Sitemap

URL strony konfigurowany w `scripts/update-sitemap.js`:
```javascript
const SITE_URL = 'https://pawellipowczan.pl';
```

---

## 📖 Dokumentacja

Pełna dokumentacja workflow: [BLOG_WORKFLOW.md](../BLOG_WORKFLOW.md)

---

## 🐛 Troubleshooting

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

**Ostatnia aktualizacja:** 2025-11-16  
**Wersja:** 2.0.0 (AI Agent edition)

