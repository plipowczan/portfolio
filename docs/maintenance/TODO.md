# TODO - Dalsze ulepszenia SEO

## ✅ Zakończone

- [x] Zmieniono język w HTML na `pl`
- [x] Zaktualizowano sitemap.xml z wszystkimi postami blogowymi
- [x] Wygenerowano obrazki Open Graph (1200x630px) dla wszystkich stron
- [x] Dodano canonical URLs do wszystkich stron
- [x] Dodano pełne meta tagi OG z obrazkami
- [x] Zaktualizowano domenę w SITE_CONFIG
- [x] Zaktualizowano robots.txt

## 🔄 Do zrobienia - Ulepszenia SEO

### Wysoki priorytet

#### 0. 🔴 Uzupełnić linki do projektów (Live URL / Szablony)
- [ ] Dodać poprawne linki `liveUrl` do projektów, które miały `automation.house`
- [ ] Ewentualnie dodać linki do szablonów automatyzacji (Make/n8n)
- [ ] Przywrócić przyciski "Visit Live Site" po uzupełnieniu linków

#### 0. ✅ Lighthouse Performance Audit - COMPLETED (2025-11-23)

**Status:** ✅ **DONE**

**Wyniki Audytu Lighthouse:**

📊 **Metryki:**
- **First Contentful Paint (FCP):** 5.3s (❌ **słabo** - cel: <1.8s)
- **Largest Contentful Paint (LCP):** 5.8s (❌ **słabo** - cel: <2.5s)  
- **Total Blocking Time (TBT):** 78ms (✅ **doskonale** - cel: <200ms)
- **Cumulative Layout Shift (CLS):** 0 (✅ **perfekcyjnie** - cel: <0.1)
- **Time to Interactive (TTI):** 5.8s (⚠️ **wymaga poprawy**)
- **Speed Index:** 5.5s (⚠️ **średnio**)

⚠️ **Błędy znalezione:**
- 404 Error: `/_vercel/insights/script.js` (nie krytyczne, ale do naprawienia)

📦 **Bundle Analysis:**
- Total Bundle: ~231 KB (JS)
- Main Thread Work: 2.3s (wymaga optymalizacji)
- JavaScript Execution: 0.7s (akceptowalne)

🎯 **Kluczowe problemy:**
1. **Długi czas ładowania (FCP/LCP > 5s)** - GŁÓWNY PROBLEM
   - Font loading blocking render
   - Bundle size może być zoptymalizowany
   - Brak code-splitting

2. **Main-thread work (2.3s)** - do poprawy
   - Script evaluation: 677ms
   - Style & Layout: 628ms

✅ **Co działa świetnie:**
- TBT (78ms) - doskonałe
- CLS (0) - perfekcyjne (brak layout shifts!)
- No render-blocking resources detected
- Good server response time (10ms)

**Następne kroki:** Zobacz sekcję 12 (Performance optimization) poniżej

---

### Wysoki priorytet

#### 1. ✅ Pre-rendering / SSR dla lepszego crawlingu - UKOŃCZONE

**Status:** ✅ **WDROŻONE** (2025-11-16)

**Rozwiązanie:** Custom prerendering z Puppeteer

- ✅ Generuje statyczne HTML dla wszystkich stron
- ✅ Dynamiczne wykrywanie postów blogowych (pomija README.md i pliki zaczynające się od \_)
- ✅ Pełna kompatybilność z Vercel
- ✅ Automatyzacja przez `npm run build:prerender`
- ✅ 9 stron prerenderowanych: 4 posty blogowe + 5 stron statycznych (automatycznie więcej z nowymi postami)

**Rezultat:**

- Google widzi pełną treść HTML (nie pusty `<div id="root"></div>`)
- SEO znacząco poprawione
- Social media previews działają perfekcyjnie

**Dokumentacja:** Zobacz `../seo/PRERENDERING.md`

**Czas wdrożenia:** ~1h (jak planowano)

#### 2. ✅ Structured Data (Schema.org JSON-LD) - UKOŃCZONE

**Status:** ✅ **WDROŻONE** (2025-11-20)

**Rozwiązanie:** Komponent `StructuredData` wstrzykujący JSON-LD przez `react-helmet-async`

- ✅ Dodano `Person` schema dla strony głównej
- ✅ Dodano `BlogPosting` schema dla postów blogowych
- ✅ Zweryfikowano poprawność generowania tagów w buildzie prerenderowanym

**Rezultat:**
- Google otrzymuje pełne dane strukturalne o autorze i artykułach
- Zwiększona szansa na Rich Snippets (gwiazdki, zdjęcia autora, data publikacji w wynikach wyszukiwania)

**Implementacja:**
- Stworzono komponent `src/components/seo/StructuredData.jsx`
- Zintegrowano z `Home.jsx` i `BlogPostPage.jsx`

#### 3. ✅ Napraw strukturę nagłówków (H1) - UKOŃCZONE

**Problem:** W Navigation.jsx jest H1, a powinien być tylko jeden na stronę.

**Zmiany:**

```jsx
// Navigation.jsx - zmień H1 na div lub span
<div className="text-xl font-bold text-white">Pawel Lipowczan</div>

// Hero.jsx - dodaj H1
<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
  <span className="gradient-text glow-text">PAWEL</span>
  <br />

#### 5. Internal linking (linkowanie wewnętrzne)

- Dodaj sekcję "Related Posts" na końcu każdego posta
- Linkuj do podobnych artykułów (po tagach)
- Dodaj linki do portfolio w postach blogowych

#### 6. Optymalizacja obrazków

- [ ] Dodaj atrybuty `alt` do wszystkich obrazków
- [ ] Użyj WebP format z fallback do PNG
- [ ] Implement lazy loading (`loading="lazy"`)
- [ ] Dodaj `srcset` dla różnych rozmiarów

#### 7. Sitemap dynamiczny

Obecnie sitemap jest statyczny. Rozważ:

- Generowanie sitemap.xml automatycznie przy buildzie
- Dodawanie nowych postów automatycznie
- Update `<lastmod>` dynamicznie

### Niski priorytet

#### 8. Core Web Vitals optimization

- Uruchom Lighthouse audit
- Sprawdź LCP (Largest Contentful Paint)
- Zoptymalizuj CLS (Cumulative Layout Shift)
- Popraw FID/INP (First Input Delay / Interaction to Next Paint)

**Narzędzia:**

- Chrome DevTools Lighthouse
- PageSpeed Insights
- web.dev/measure

#### 9. Content optimization

- Dodaj więcej postów blogowych (minimum 10-15)
- Dłuższe posty (2000+ słów)
- Aktualizuj stare posty regularnie
- Dodaj FAQ section
- Dodaj case studies

#### 10. Metadata improvements

- [ ] Dodaj `meta name="author"`
- [ ] Dodaj `meta name="keywords"` (opcjonalne, mało istotne)
- [ ] Dodaj `link rel="alternate" hreflang="pl"` jeśli planujesz wersje językowe
- [ ] Favicon w różnych rozmiarach (16x16, 32x32, 180x180, 192x192, 512x512)

#### 11. Analytics & Search Console
- [ ] Color contrast check (WCAG AA)
- [ ] Skip to content link

#### 14. Social Media optimization

- [ ] Dodaj przyciski share na postach
- [ ] Pre-fill text dla Twitter share
- [ ] Pinterest Rich Pins
- [ ] LinkedIn article sharing

## 📈 Metryki sukcesu

Po wdrożeniu powyższych zmian, monitoruj:

- Pozycje w Google (Search Console)
- Organic traffic (Google Analytics)
- Click-through rate (CTR)
- Bounce rate
- Time on page
- Core Web Vitals scores

## 🔗 Przydatne linki

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [web.dev Performance](https://web.dev/performance/)
- [A11y Project](https://www.a11yproject.com/)

---

**Aktualna ocena SEO:** 7/10  
**Cel:** 9/10 (10/10 jest praktycznie niemożliwe bez kampanii contentowej)

**Szacowany czas wdrożenia wszystkich high-priority tasks:** 1-2 tygodnie
