# 📝 Procedura dodawania nowych artykułów na blog

Kompletny przewodnik krok po kroku dla publikacji nowych artykułów na blogu portfolio z wykorzystaniem AI Agent.

---

## 📋 Spis treści

1. [Przegląd procesu](#przegląd-procesu)
2. [Krok 1: Przekaż dane artykułu do agenta AI](#krok-1-przekaż-dane-artykułu-do-agenta-ai)
3. [Krok 2: Weryfikacja wygenerowanego artykułu](#krok-2-weryfikacja-wygenerowanego-artykułu)
4. [Krok 3: Generowanie i konwersja obrazka OG](#krok-3-generowanie-i-konwersja-obrazka-og)
5. [Krok 4: Publikacja](#krok-4-publikacja)
6. [Troubleshooting](#troubleshooting)

---

## Przegląd procesu

🤖 **Agent AI automatycznie wykonuje za Ciebie:**

- ✅ Generowanie kompletnego artykułu z front matter
- ✅ Przydzielanie ID i daty publikacji
- ✅ Tworzenie excerpt i struktury SEO
- ✅ Aktualizację sitemap

👤 **Ty musisz tylko:**

- 📝 Dostarczyć dane artykułu (jako tekst lub dokument)
- 🎨 Wygenerować obrazek OG (zewnętrzne narzędzie)
- 🔄 Skonwertować PNG na WebP (jeden skrypt)
- ✅ Zweryfikować i opublikować

---

## Wymagania

### Software

- **Node.js** - wersja 18+
- **Cursor IDE** z agentem AI (Claude Sonnet)

### Opcjonalne narzędzia

- **Canva / Figma** - do tworzenia obrazków OG
- **AI Image Generator** - DALL-E, Midjourney, Gemini

---

## Krok 1: Przekaż dane artykułu do agenta AI

### 1.1. Przygotuj dane artykułu

Zbierz następujące informacje w dowolnym formacie (tekst, notatki, dokument):

**Wymagane:**

- Tytuł artykułu
- Kategoria (Automatyzacja / No-Code / AI)
- Czas czytania (np. 8 min)
- Główne tagi (3-6 tagów)

**Treść do rozwinięcia:**

- Problem biznesowy / wyzwanie
- Rozwiązanie / podejście
- Stack technologiczny (jeśli dotyczy)
- Implementacja / kroki
- Case study / przykłady (jeśli dotyczy)
- ROI / korzyści / rezultaty
- Kluczowe wnioski

**Opcjonalne:**

- Keywords SEO
- Cytaty klientów
- Konkretne liczby / metryki
- Call to Action

### 1.2. Uruchom agenta AI w Cursor

Otwórz Cursor i w czacie napisz:

```
Na podstawie poniższych danych przygotuj artykuł na bloga według workflow @BLOG_WORKFLOW.md

[Tu wklej swoje dane artykułu]
```

**Przykład:**

```
Na podstawie poniższych danych przygotuj artykuł na bloga według workflow @BLOG_WORKFLOW.md

Tytuł: Jak zautomatyzować CRM w 3 krokach
Kategoria: Automatyzacja
Czas czytania: 10 min
Tagi: Automatyzacja, CRM, n8n, Make

Problem: Firmy tracą czas na manualne wprowadzanie danych do CRM...
Rozwiązanie: Automatyzacja z n8n...
[itd.]
```

### 1.3. Agent AI wykona automatycznie

Agent utworzy pełny artykuł `src/content/blog/{slug}.md` z:

- ✅ Front matter (ID, slug, title, excerpt, itp.)
- ✅ Kompletną treścią w markdown
- ✅ Strukturą nagłówków H2/H3
- ✅ SEO keywords
- ✅ Call to Action

### 1.4. Powiedz agentowi, jeśli chcesz poprawki

Możesz poprosić o modyfikacje:

```
"Dodaj więcej szczegółów o ROI"
"Zmień ton na bardziej formalny"
"Rozwiń sekcję o implementacji"
"Dodaj kod przykładowy"
```

Agent automatycznie zaktualizuje artykuł.

---

## Krok 2: Weryfikacja wygenerowanego artykułu

### 2.1. Przeczytaj wygenerowany artykuł

Otwórz: `src/content/blog/{slug}.md`

Sprawdź:

- ✅ Czy treść jest poprawna merytorycznie
- ✅ Czy wszystkie dane są uwzględnione
- ✅ Czy struktura ma sens (H2 → H3)
- ✅ Czy front matter jest kompletny
- ✅ Czy excerpt jest zachęcający

**Front matter powinien wyglądać tak:**

```yaml
---
id: 4
slug: automatyzacja-crm
title: Jak zautomatyzować CRM w 3 krokach
excerpt: Dowiedz się jak zautomatyzować procesy CRM i zaoszczędzić 15 godzin tygodniowo...
category: Automatyzacja
author: Pawel Lipowczan
date: 2025-11-16
readTime: 10 min
image: /images/og-automatyzacja-crm.webp
tags:
  - Automatyzacja
  - CRM
  - n8n
---
```

### 2.2. Jeśli potrzebujesz poprawek

Po prostu powiedz agentowi w Cursor:

```
"Popraw sekcję o ROI - dodaj konkretne liczby"
"Zmień excerpt na krótszy"
"Dodaj przykład kodu dla n8n"
```

Agent zaktualizuje plik automatycznie.

---

## Krok 3: Generowanie i konwersja obrazka OG

### 3.1. Wygeneruj obrazek OG

**Wymagania obrazka OG:**

- Wymiary: **1200x630px** (aspect ratio 1.91:1)
- Format: PNG (później konwertowany na WebP)
- Zawartość:
  - Tytuł artykułu
  - Logo / branding
  - Wizualizacja tematu
  - Kolory zgodne z brandingiem (teal/green: #00ff9d, #00b8ff)

**Narzędzia do tworzenia:**

- **Canva** (szablony social media)
- **Figma** (design custom)
- **AI Generators:** DALL-E, Midjourney, Stable Diffusion, Gemini

### 3.2. Zapisz obrazek jako PNG

Nazwa pliku: `public/images/og-{slug}.png`

**Przykład:** `public/images/og-el-padre-automatyzacja-ofert-ai.png`

### 3.3. Konwertuj PNG na WebP

```bash
node scripts/convert-to-webp.js public/images/og-{slug}.png
```

**Przykład:**

```bash
node scripts/convert-to-webp.js public/images/og-el-padre-automatyzacja-ofert-ai.png
```

Skrypt:

- Skonwertuje PNG na WebP (oszczędność ~95% rozmiaru)
- Pokaże statystyki konwersji

**Oczekiwany wynik:**

```
✅ og-el-padre-automatyzacja-ofert-ai.png
   PNG:  1050.3 KB
   WebP: 45.8 KB
   Oszczędność: 95.6%
```

### 3.4. Usuń plik PNG

Po weryfikacji, że WebP działa poprawnie:

```bash
Remove-Item public/images/og-{slug}.png
```

**Lub poproś agenta AI w Cursor:**

```
"Usuń plik PNG: public/images/og-{slug}.png"
```

### 3.5. Agent AI zaktualizuje sitemap automatycznie

Możesz poprosić agenta:

```
"Zaktualizuj sitemap"
```

Agent wykona:

```bash
node scripts/update-sitemap.js
```

---

## Krok 4: Publikacja

### 4.1. Weryfikacja lokalnie

Uruchom dev server (jeśli nie działa):

```bash
npm run dev
```

Sprawdź:

- ✅ `http://localhost:5173/blog` - czy artykuł jest na liście
- ✅ `http://localhost:5173/blog/{slug}` - czy artykuł wyświetla się poprawnie
- ✅ Czy obrazek OG się ładuje
- ✅ Czy meta tagi są poprawne (F12 → Elements → sprawdź `<head>`)

> **Uwaga:** Artykuły ładują się automatycznie przez `import.meta.glob` - nie musisz nic importować ręcznie!

### 4.2. Commit i push

```bash
git add .
git commit -m "feat: dodaj artykuł [tytuł]"
git push origin main
```

**Lub poproś agenta AI:**

```
"Commituj zmiany z komunikatem: feat: dodaj artykuł [tytuł]"
```

### 4.3. Deploy (automatyczny)

Jeśli używasz automatycznego deploy (np. **Vercel**, **Netlify**):

- ✅ Deploy uruchomi się automatycznie po pushu do `main`
- ⏱️ Proces zazwyczaj trwa 1-3 minuty

### 4.4. Weryfikacja produkcji

Po wdrożeniu sprawdź:

- ✅ Artykuł jest widoczny na `/blog`
- ✅ Artykuł otwiera się poprawnie
- ✅ Obrazek OG się ładuje (WebP)
- ✅ Meta tagi Open Graph są poprawne
- ✅ Sitemap zawiera nowy artykuł

**Narzędzia do weryfikacji meta tagów:**

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

## 🔥 Quick Reference - Pełny workflow

### Wariant 1: Cursor AI Agent (zalecane)

```
1. W Cursor Chat napisz:
   "Na podstawie poniższych danych przygotuj post na bloga według @BLOG_WORKFLOW.md"
   [wklej dane artykułu]

2. Agent utworzy:
   ✅ Pełny artykuł (.md) z front matter

3. Wygeneruj obrazek OG (1200x630px) → zapisz jako PNG

4. Konwertuj: node scripts/convert-to-webp.js public/images/og-{slug}.png

5. Usuń PNG: Remove-Item public/images/og-{slug}.png

6. Powiedz agentowi: "Zaktualizuj sitemap"

7. Testuj: npm run dev

8. Powiedz agentowi: "Commituj i pushuj zmiany"
```

### Wariant 2: Szybki (bez agenta)

Jeśli chcesz zrobić to manualnie:

```bash
# 1. Stwórz ręcznie plik artykułu
# src/content/blog/moj-artykul.md (z front matter)

# 2. Wygeneruj obrazek OG → zapisz jako PNG

# 3. Konwertuj na WebP
node scripts/convert-to-webp.js public/images/og-moj-artykul.png

# 4. Usuń PNG
Remove-Item public/images/og-moj-artykul.png

# 5. Zaktualizuj sitemap
node scripts/update-sitemap.js

# 6. Testuj
npm run dev

# 7. Deploy
git add .
git commit -m "feat: dodaj artykuł [tytuł]"
git push origin main
```

---

## Troubleshooting

### Problem: Artykuł nie pojawia się na liście

**Rozwiązanie:**

1. ✅ Sprawdź czy plik znajduje się w `src/content/blog/{slug}.md`
2. ✅ Sprawdź czy front matter jest poprawny (YAML):
   - Separatory `---` na początku i końcu
   - Wszystkie wymagane pola (id, slug, title, excerpt, category, author, date, readTime, image, tags)
   - Wcięcia dla list (2 spacje)
3. ✅ Zrestartuj dev server: `npm run dev`
4. ✅ Sprawdź console w przeglądarce pod kątem błędów

### Problem: Obrazek OG nie wyświetla się

**Rozwiązanie:**

1. ✅ Sprawdź czy plik istnieje: `public/images/og-{slug}.webp`
2. ✅ Sprawdź ścieżkę w front matter: `image: /images/og-{slug}.webp`
3. ✅ Sprawdź console w przeglądarce (F12) pod kątem błędów 404
4. ✅ Upewnij się, że skonwertowałeś PNG na WebP

### Problem: Gray-matter parsing error

**Rozwiązanie:**

1. ✅ Front matter musi zaczynać się od `---` w linii 1
2. ✅ Front matter musi kończyć się na `---`
3. ✅ Listy w YAML muszą mieć wcięcie 2 spacji:

```yaml
tags:
  - Tag1
  - Tag2
```

4. ✅ Poproś agenta AI o naprawienie błędów YAML

### Problem: Sitemap nie zawiera nowego artykułu

**Rozwiązanie:**

```bash
# Uruchom ponownie skrypt
node scripts/update-sitemap.js

# Lub poproś agenta AI:
"Zaktualizuj sitemap"
```

### Problem: WebP conversion error

**Rozwiązanie:**

1. ✅ Upewnij się, że masz zainstalowany pakiet `sharp`: `npm install sharp`
2. ✅ Sprawdź czy obrazek PNG jest poprawny i nie jest uszkodzony
3. ✅ Sprawdź czy masz uprawnienia zapisu do folderu `public/images/`

---

## 📚 Dodatkowe zasoby

### Struktura projektu

```
portfolio/
├── src/
│   ├── content/
│   │   └── blog/
│   │       ├── artykul1.md              # Opublikowany artykuł
│   │       └── artykul2.md
│   ├── data/
│   │   └── blogPosts.js                 # Automatyczne ładowanie
│   └── pages/
│       ├── Blog.jsx
│       └── BlogPostPage.jsx
├── public/
│   ├── images/
│   │   ├── og-artykul1.webp             # Obrazki OG w WebP
│   │   └── og-artykul2.webp
│   └── sitemap.xml                      # Auto-generowany
├── scripts/
│   ├── convert-to-webp.js               # Konwersja PNG → WebP
│   └── update-sitemap.js                # Aktualizacja sitemap
└── BLOG_WORKFLOW.md                     # Ten plik
```

### Pomocne komendy

```bash
# Konwersja obrazka na WebP
node scripts/convert-to-webp.js public/images/og-{slug}.png

# Aktualizacja sitemap
node scripts/update-sitemap.js

# Uruchom dev server
npm run dev

# Lista artykułów
ls src/content/blog/*.md  # Windows/Linux/Mac

# Lista obrazków OG
ls public/images/og-*.webp
```

### Standardy artykułów (dla agenta AI)

**Agent AI generuje artykuły zgodnie z:**

- **Długość:** 2000-3000 słów
- **Ton:** Profesjonalny ale przystępny
- **Struktura:** H1 → H2 → H3 (hierarchia)
- **Code blocks:** \`\`\` dla przykładów kodu
- **Listy:** Punktowane i numerowane
- **CTA:** Zawsze na końcu (link do automation.house)
- **Keywords:** 3-5 głównych słów kluczowych SEO
- **Emotikony:** ✅ ❌ 🔥 (używaj oszczędnie)
- **Bold:** Pogrubienie dla kluczowych liczb i fraz

### SEO Best Practices

1. **Tytuł:** 50-60 znaków, zawiera główne słowo kluczowe
2. **Excerpt:** 150-160 znaków, zachęca do kliknięcia
3. **Slug:** Krótki, opisowy, tylko małe litery i myślniki
4. **Nagłówki:** H2/H3 z naturalnymi słowami kluczowymi
5. **Obrazek OG:** 1200x630px, max 200KB po konwersji WebP
6. **Meta tags:** Automatycznie generowane przez React Helmet
7. **Sitemap:** Aktualizuj po każdym nowym artykule

---

## 🤖 Praca z AI Agent (Cursor)

### Przydatne komendy dla agenta

```
"Wygeneruj post na bloga na podstawie danych: [dane]"
"Popraw artykuł {slug} - dodaj więcej szczegółów o ROI"
"Zmień ton artykułu na bardziej formalny"
"Dodaj sekcję z przykładami kodu"
"Zaktualizuj sitemap"
"Usuń plik PNG: public/images/og-{slug}.png"
"Commituj zmiany z komunikatem: feat: dodaj artykuł [tytuł]"
```

### Agent AI automatycznie wykona

- ✅ Parsowanie danych wejściowych
- ✅ Generowanie pełnego artykułu
- ✅ Tworzenie front matter z ID i datą
- ✅ Optymalizacja SEO (excerpt, keywords)
- ✅ Aktualizacja sitemap
- ✅ Commit i push (jeśli poprosisz)

---

## 🎉 Gotowe

Gratulacje! Masz teraz zautomatyzowany proces publikacji artykułów z pomocą AI Agent.

**Czas publikacji artykułu:**

- Bez agenta: ~2-4 godziny (pisanie + formatowanie + SEO)
- Z agentem AI: ~15-30 minut (dane + weryfikacja + obrazek)

**Pytania?** Zobacz [główny README.md](./README.md) lub [.cursorrules](./.cursorrules)

---

**Ostatnia aktualizacja:** 2025-11-16  
**Wersja:** 2.0.0 (AI Agent edition)
