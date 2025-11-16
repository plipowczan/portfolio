# Weryfikacja SEO po wdrożeniu prerenderingu

## Checklist weryfikacji

Po wdrożeniu na Vercel z prerenderingiem, zweryfikuj:

### ✅ 1. View Page Source (podstawowa weryfikacja)

**Jak sprawdzić:**

1. Otwórz swoją stronę: <https://pawel.lipowczan.pl>
2. Kliknij prawym przyciskiem → **View Page Source** (Ctrl+U)
3. Szukaj w kodzie:
   - `<h1>` z twoim nazwiskiem "PAWEL LIPOWCZAN"
   - Treść sekcji "O mnie"
   - Listę projektów
   - Sekcję umiejętności

**✅ Sukces jeśli:**

- Widzisz pełną treść HTML
- Nie tylko `<div id="root"></div>` i `<script>`

**❌ Błąd jeśli:**

- Widzisz tylko pusty `<div id="root"></div>`
- Brak treści w HTML

**Rozwiązanie:** Sprawdź czy w Vercel ustawiłeś `npm run build:prerender`

---

### ✅ 2. Google Rich Results Test

**Jak sprawdzić:**

1. Idź na: <https://search.google.com/test/rich-results>
2. Wklej URL twojej strony: `https://pawel.lipowczan.pl`
3. Kliknij **Test URL**
4. Poczekaj na wyniki (30-60 sekund)

**✅ Sukces jeśli:**

- Google pokazuje **pełną treść** strony
- Widać nagłówki, paragrafy, listy
- Brak błędów związanych z brakiem treści

**⚠️ Uwaga:**

- Rich Results Test może nie pokazać structured data (to normalnie)
- Ważne że widzi treść HTML

---

### ✅ 3. Lighthouse SEO Score

**Jak sprawdzić:**

1. Otwórz stronę w Chrome
2. F12 → zakładka **Lighthouse**
3. Zaznacz **SEO**
4. Kliknij **Analyze page load**
5. Poczekaj na wyniki

**✅ Sukces jeśli:**

- SEO Score: **90-100**
- Brak błędów typu "Document doesn't have a meta description"
- Wszystkie linki działają

**Kluczowe metryki:**

- ✅ **Crawlable links:** Wszystkie linki działają
- ✅ **Meta description:** Jest ustawiony
- ✅ **Title:** Unikalny dla każdej strony
- ✅ **Canonical URL:** Ustawiony poprawnie

---

### ✅ 4. Sprawdź posty blogowe

**Jak sprawdzić:**

1. Otwórz post: <https://pawel.lipowczan.pl/blog/automatyzacja-email-frontdesk-ai>
2. View Page Source (Ctrl+U)
3. Szukaj w kodzie:
   - Tytuł artykułu w `<h1>`
   - Pełna treść artykułu
   - Meta tagi Open Graph (`og:title`, `og:description`, `og:image`)

**✅ Sukces jeśli:**

- Cała treść artykułu jest w HTML
- Meta tagi są wypełnione
- Obrazek OG jest ustawiony

---

### ✅ 5. Social Media Preview (opcjonalne)

**Jak sprawdzić:**

**LinkedIn:**

1. Idź na: <https://www.linkedin.com/post-inspector/>
2. Wklej URL: `https://pawel.lipowczan.pl`
3. Kliknij **Inspect**

**Twitter/X:**

1. Idź na: <https://cards-dev.twitter.com/validator>
2. Wklej URL
3. Sprawdź preview

**Facebook:**

1. Idź na: <https://developers.facebook.com/tools/debug/>
2. Wklej URL
3. Kliknij **Debug**

**✅ Sukces jeśli:**

- Pokazuje się obrazek (1200x630px)
- Tytuł i opis są poprawne
- Preview wygląda profesjonalnie

---

### ✅ 6. Google Search Console (7-14 dni po wdrożeniu)

**Jak sprawdzić:**

1. Dodaj stronę do Google Search Console: <https://search.google.com/search-console>
2. Zweryfikuj własność domeny
3. Czekaj 7-14 dni na indeksację
4. Monitoruj:
   - **Coverage** - ile stron zaindeksowano
   - **Performance** - impressions, clicks, CTR
   - **URL Inspection** - czy konkretne URL są zaindeksowane

**✅ Sukces jeśli:**

- Wszystkie 9 stron są zaindeksowane (1 home + 1 blog list + 4 posty + 3 legal pages)
- Brak błędów typu "Discovered - currently not indexed"
- Rosnąca liczba impressions

---

### ✅ 7. Test wydajności (opcjonalne)

**PageSpeed Insights:**

1. Idź na: <https://pagespeed.web.dev/>
2. Wklej URL: `https://pawel.lipowczan.pl`
3. Sprawdź wyniki dla Mobile i Desktop

**Cel:**

- **Performance:** >90
- **SEO:** >95
- **Accessibility:** >90
- **Best Practices:** >90

---

## Częste problemy i rozwiązania

### Problem: View Source pokazuje pusty HTML

**Przyczyna:** Vercel nie używa `build:prerender`

**Rozwiązanie:**

1. Vercel Dashboard → Settings → Build & Development Settings
2. Build Command: `npm run build:prerender`
3. Redeploy

---

### Problem: Google Rich Results nie widzi treści

**Przyczyna 1:** Strona jeszcze nie została zaindeksowana
**Rozwiązanie:** Poczekaj 24-48h, Google potrzebuje czasu

**Przyczyna 2:** JavaScript errors
**Rozwiązanie:** Sprawdź console.log w przeglądarce, napraw błędy JS

---

### Problem: Social media nie pokazuje obrazków

**Przyczyna:** Cache social media platform

**Rozwiązanie:**

1. LinkedIn: Użyj Post Inspector → kliknij "Refresh"
2. Twitter: Poczekaj 24h lub wyczyść cache
3. Facebook: Debug Tool → kliknij "Scrape Again"

---

### Problem: Lighthouse SEO Score < 90

**Najczęstsze przyczyny:**

- Brak meta description → dodaj w Helmet
- Broken links → napraw linki 404
- Zbyt małe klikalne elementy → popraw CSS
- Brak alt text w obrazkach → dodaj alt=""

---

## Timeline oczekiwanych rezultatów

### Dzień 1 (natychmiast)

- ✅ View Page Source pokazuje pełny HTML
- ✅ Lighthouse SEO Score >90
- ✅ Social media previews działają

### Tydzień 1 (7 dni)

- ✅ Google Search Console pokazuje pierwsze zaindeksowane strony
- ✅ Pierwsze impressions w wynikach wyszukiwania
- ✅ Rich Results Test działa poprawnie

### Miesiąc 1 (30 dni)

- ✅ Wszystkie strony zaindeksowane
- ✅ Wzrost organic traffic
- ✅ Pojawianie się w wynikach dla kluczowych fraz
- ✅ Rich Snippets w Google

### Miesiąc 2-3 (60-90 dni)

- ✅ Stabilne pozycje w Google
- ✅ Rosnący CTR (Click-Through Rate)
- ✅ Wzrost authority domeny

---

## Narzędzia monitoring (polecane)

### Bezpłatne

- **Google Search Console** - podstawowy monitoring SEO
- **Google Analytics 4** - analiza ruchu
- **Bing Webmaster Tools** - monitoring w Bing
- **Lighthouse** - audyt wydajności

### Płatne (opcjonalne)

- **Ahrefs** ($99/mo) - analiza backlinks, pozycje
- **SEMrush** ($119/mo) - kompletny SEO toolkit
- **Screaming Frog** (free/paid) - technical SEO audit

---

## Następne kroki po weryfikacji

Po pozytywnej weryfikacji prerenderingu, rozważ:

1. **Structured Data (JSON-LD)** - Rich Snippets
2. **More blog posts** - więcej treści = lepsze SEO
3. **Internal linking** - linkowanie między postami
4. **Backlinks** - pozyskiwanie linków z innych stron
5. **Guest posting** - artykuły gościnne na innych blogach

Zobacz `../maintenance/TODO.md` dla pełnej listy następnych kroków SEO.

---

**Pytania? Problemy?**

Jeśli coś nie działa:

1. Sprawdź `PRERENDERING.md` - sekcja "Rozwiązywanie problemów"
2. Sprawdź logi build w Vercel
3. Sprawdź console.log w przeglądarce (F12)

---

**Ostatnia aktualizacja:** 2025-11-16
