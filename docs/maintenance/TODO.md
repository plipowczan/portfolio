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

#### 2. Structured Data (Schema.org JSON-LD)

**Dlaczego:** Google używa structured data do Rich Snippets w wynikach wyszukiwania.

**Do dodania:**

```javascript
// Person Schema dla strony głównej
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Pawel Lipowczan",
  "jobTitle": "Software Architect & Technology Advisor",
  "url": "https://pawel.lipowczan.pl",
  "sameAs": [
    "https://github.com/pawellipowczan",
    "https://linkedin.com/in/pawellipowczan"
  ],
  "knowsAbout": ["AI", "Automation", "No-Code", "Software Architecture"],
  "email": "pawel@lipowczan.pl"
}

// BlogPosting Schema dla każdego posta
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Tytuł posta",
  "author": {
    "@type": "Person",
    "name": "Pawel Lipowczan"
  },
  "datePublished": "2025-11-10",
  "image": "URL_do_obrazka",
  "articleBody": "Treść..."
}

// BreadcrumbList Schema
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

**Implementacja:**

- Stwórz hook `useStructuredData.js`
- Dodaj do Helmet w odpowiednich komponentach
- Sprawdź w Google Rich Results Test

#### 3. Napraw strukturę nagłówków (H1)

**Problem:** W Navigation.jsx jest H1, a powinien być tylko jeden na stronę.

**Zmiany:**

```jsx
// Navigation.jsx - zmień H1 na div lub span
<div className="text-xl font-bold text-white">Pawel Lipowczan</div>

// Hero.jsx - dodaj H1
<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
  <span className="gradient-text glow-text">PAWEL</span>
  <br />
  <span className="gradient-text-alt glow-text">LIPOWCZAN</span>
</h1>
```

### Średni priorytet

#### 4. Breadcrumbs (okruszki)

Dodaj breadcrumbs do:

- Strona bloga: `Home > Blog`
- Post blogowy: `Home > Blog > Tytuł posta`

**Korzyści:**

- Lepsza nawigacja dla użytkownika
- Rich Snippets w Google
- Lepszy ranking SEO

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

- [ ] Dodaj Google Analytics 4
- [ ] Dodaj Google Search Console
- [ ] Dodaj Microsoft Clarity (heatmaps)
- [ ] Monitor pozycji w Google

#### 12. Performance optimization

- [ ] Code splitting (lazy loading stron)
- [ ] Minimize bundle size (obecnie 563 KB)
- [ ] Use dynamic imports
- [ ] Cache strategy (Service Worker)

#### 13. Accessibility (A11y)

- [ ] ARIA labels na wszystkich interaktywnych elementach
- [ ] Keyboard navigation testing
- [ ] Screen reader testing
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
