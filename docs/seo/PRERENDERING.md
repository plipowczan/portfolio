# Prerendering - Dokumentacja

## Co to jest prerendering?

Prerendering to proces generowania statycznych plików HTML dla wszystkich stron aplikacji podczas buildu. Dzięki temu boty wyszukiwarek (Google, Bing) widzą pełną treść strony zamiast pustego `<div id="root"></div>`.

## Dlaczego poprawia SEO?

**Przed prerenderingiem:**

```html
<div id="root"></div>
<script src="/assets/index-xxx.js"></script>
```

**Po prerenderingu:**

```html
<div id="root">
  <h1>PAWEL LIPOWCZAN</h1>
  <p>Software Architect & Technology Advisor</p>
  <section>... cała treść strony ...</section>
</div>
<script src="/assets/index-xxx.js"></script>
```

## Implementacja

### Narzędzia

- **Puppeteer** - headless browser do renderowania React do HTML
- **Custom scripts** - `scripts/prerender.mjs` i `scripts/build-with-prerender.mjs`

### Jak działa?

1. `npm run build` - buduje aplikację React (normalny Vite build)
2. `npm run preview` - uruchamia lokalny serwer z zbudowaną aplikacją
3. **Puppeteer** otwiera każdą stronę w headless Chrome
4. Czeka na pełne załadowanie (networkidle0 + 2s)
5. Pobiera wyrenderowany HTML
6. Zapisuje do plików `dist/*/index.html`
7. Zamyka preview server

### Strony prerenderowane

System **automatycznie** wykrywa wszystkie strony do prerenderingu:

- `/` - strona główna
- `/blog` - lista postów
- `/blog/[slug]` - **dynamicznie** dla każdego posta z `src/content/blog/*.md`
- `/privacy-policy`
- `/terms-of-service`
- `/cookie-policy`

**Aktualnie: 9 stron** (4 posty blogowe + 5 stron statycznych)

**Posty blogowe:**

1. automatyzacja-email-frontdesk-ai
2. chatboty-ai-od-koncepcji-do-wdrozenia
3. el-padre-automatyzacja-ofert-ai
4. no-code-lead-generation

**Uwaga:** Plik `README.md` w folderze blog jest automatycznie pomijany.

### Dodawanie nowych postów

Kiedy dodajesz nowy post do `src/content/blog/`, jest **automatycznie prerenderowany** - nie musisz nic zmieniać w konfiguracji!

## Komendy

### Development (bez prerenderingu)

```bash
npm run dev
```

### Build bez prerenderingu (szybki)

```bash
npm run build
```

Używaj podczas development gdy testujesz zmiany i nie potrzebujesz SEO.

### Build z prerenderingiem (pełny, dla production)

```bash
npm run build:prerender
```

To uruchomi:

1. `vite build`
2. Uruchamia preview server w tle
3. Prerenderuje wszystkie strony
4. Zamyka preview server

**Czas: ~1-2 minuty** (zależy od liczby postów)

### Preview lokalny

```bash
npm run preview
```

Wyświetla zbudowaną aplikację na `http://localhost:4173`

### Tylko prerendering (wymaga działającego preview)

```bash
npm run prerender:run
```

⚠️ Wymaga aby preview server był już uruchomiony!

## Wdrożenie na Vercel

### Opcja 1: Automatyczne (bez prerenderingu)

Vercel wykrywa Vite automatycznie:

- Build Command: `npm run build`
- Output Directory: `dist`

**Wynik:** Szybki deployment, ale bez prerenderingu (SEO nie optymalne)

### Opcja 2: Z prerenderingiem (ZALECANE)

W ustawieniach projektu Vercel zmień:

**Build Command:**

```bash
npm run build:prerender
```

**Output Directory:**

```bash
dist
```

**Wynik:** Pełne SEO, wszystkie strony prerenderowane

⚠️ **Uwaga:** Build będzie trwał dłużej (~2-3 min zamiast ~30s), ale to jednorazowy koszt przy każdym deploy.

### Weryfikacja po deploy

1. **View Page Source** - prawym klikiem na stronie → "View Page Source"

   - Powinieneś widzieć pełny HTML z treścią
   - Nie tylko `<div id="root"></div>`

2. **Google Rich Results Test**

   - <https://search.google.com/test/rich-results>
   - Wklej URL swojej strony
   - Google powinien pokazać pełną treść

3. **Lighthouse SEO Score**
   - DevTools → Lighthouse → Run audit
   - SEO score powinien być >90

## Struktura plików

```
scripts/
├── prerender.mjs              # Główny skrypt prerenderingu
└── build-with-prerender.mjs   # Wrapper: build + prerender

dist/                          # Folder po buildzie
├── index.html                 # ✅ Prerenderowany
├── blog/
│   ├── index.html                                # ✅ Prerenderowany
│   ├── automatyzacja-email-frontdesk-ai/
│   │   └── index.html                            # ✅ Prerenderowany
│   ├── chatboty-ai-od-koncepcji-do-wdrozenia/
│   │   └── index.html                            # ✅ Prerenderowany
│   ├── el-padre-automatyzacja-ofert-ai/
│   │   └── index.html                            # ✅ Prerenderowany
│   └── no-code-lead-generation/
│       └── index.html                            # ✅ Prerenderowany
├── privacy-policy/
│   └── index.html            # ✅ Prerenderowany
└── ... (inne strony)
```

## Rozwiązywanie problemów

### Problem: "page.waitForTimeout is not a function"

**Przyczyna:** Stara wersja Puppeteer

**Rozwiązanie:** Używamy `new Promise(resolve => setTimeout(resolve, ms))`

✅ **Naprawione** w obecnej wersji

### Problem: "import.meta.glob is not a function"

**Przyczyna:** `import.meta.glob` to funkcja Vite, nie działa w czystym Node.js

**Rozwiązanie:** Skrypt `prerender.mjs` czyta pliki `.md` bezpośrednio z folderu

✅ **Naprawione** w obecnej wersji

### Problem: Build trwa bardzo długo

**Przyczyna:** Puppeteer renderuje każdą stronę osobno

**Opcje:**

1. Akceptuj dłuższy czas (2-3 min to norma dla 9 stron)
2. Użyj `npm run build` podczas development
3. Zrób prerendering tylko przed production deploy

### Problem: Strona nie ładuje się poprawnie w Puppeteer

**Sprawdź:**

1. Czy preview server działa (`http://localhost:4173`)
2. Czy nie ma błędów w konsoli (`npm run preview` i sprawdź logi)
3. Zwiększ `RENDER_TIMEOUT` w `scripts/prerender.mjs`

### Problem: HTML jest pusty po prerenderingu

**Możliwe przyczyny:**

1. Animacje Framer Motion blokują renderowanie
2. Błędy JavaScript na stronie
3. Za krótki timeout

**Rozwiązanie:**

- Sprawdź console.log w przeglądarce
- Zwiększ `RENDER_TIMEOUT` z 2000ms na 3000ms lub więcej

## Wydajność

### Aktualnie (9 stron)

- **Build time:** ~7-8 sekund
- **Prerender time:** ~30-40 sekund
- **Total:** ~50 sekund

### Z 20 postami (~26 stron)

- **Build time:** ~7-8 sekund
- **Prerender time:** ~60-80 sekund
- **Total:** ~90 sekund

### Optymalizacja

Jeśli będzie za wolno (>50 postów), można:

1. Renderować strony równolegle (obecnie sekwencyjnie)
2. Cache'ować niezmienione strony
3. Użyć `vike` (vite-plugin-ssr) dla bardziej zaawansowanego SSR

## Monitoring SEO

Po wdrożeniu prerenderingu monitoruj:

### Google Search Console (7-14 dni)

- **Impressions** - ile razy strona pokazała się w wynikach
- **Clicks** - ile razy użytkownicy kliknęli
- **CTR** - Click-Through Rate
- **Average Position** - średnia pozycja w wynikach

### Google Analytics

- **Organic Search Traffic** - ruch z wyszukiwarek
- **Bounce Rate** - czy użytkownicy zostają na stronie
- **Time on Page** - jak długo czytają

### Lighthouse

Uruchom co tydzień i śledź:

- **SEO Score** - cel: >95
- **Performance** - cel: >90
- **Accessibility** - cel: >90

## Następne kroki SEO

1. ✅ **Prerendering** - ZROBIONE!
2. ⏭️ **Structured Data (JSON-LD)** - Rich Snippets w Google
3. ⏭️ **Internal Linking** - linkowanie między postami
4. ⏭️ **Breadcrumbs** - okruszki nawigacyjne
5. ⏭️ **More Content** - więcej postów = lepsze SEO

Zobacz `../maintenance/TODO.md` dla pełnej listy ulepszeń SEO.

## Pytania?

Jeśli coś nie działa:

1. Sprawdź logi build (`npm run build:prerender`)
2. Sprawdź czy preview działa (`npm run preview`)
3. Przeczytaj sekcję "Rozwiązywanie problemów" powyżej

---

**Ostatnia aktualizacja:** 2025-11-16
**Wersja:** 1.0.0
