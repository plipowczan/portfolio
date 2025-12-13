# Przewodnik Wdrożenia

Ten przewodnik obejmuje opcje wdrożenia dla strony portfolio Pawel Lipowczan.

## Checklist Przed Wdrożeniem

- [ ] Zaktualizuj informacje osobiste w `src/utils/constants.js`
- [ ] Dodaj prawdziwe dane projektów w `src/data/projects.js`
- [ ] Zaktualizuj umiejętności w `src/data/skills.js`
- [ ] Dodaj posty blogowe w `src/data/blogPosts.js`
- [ ] Dodaj zdjęcia projektów do `public/images/`
- [ ] Przetestuj build: `npm run build`
- [ ] Podejrzyj build: `npm run preview`
- [ ] Zaktualizuj URL-e w `public/sitemap.xml`
- [ ] Zaktualizuj domenę w `public/robots.txt`

## Opcja 1: Vercel (Zalecane)

### Dlaczego Vercel?

- Zerowa konfiguracja
- Automatyczny HTTPS
- Globalny CDN
- Natychmiastowe wdrożenia
- Darmowy dla projektów osobistych
- Doskonała wydajność

### Kroki

1. **Zainstaluj Vercel CLI**

```bash
npm install -g vercel
```

2. **Zaloguj się do Vercel**

```bash
vercel login
```

3. **Wdróż**

```bash
vercel
```

4. **Wdrożenie Produkcyjne**

```bash
vercel --prod
```

### Własna Domena

1. Przejdź do panelu Vercel
2. Wybierz swój projekt
3. Przejdź do Settings > Domains
4. Dodaj swoją własną domenę
5. Zaktualizuj rekordy DNS zgodnie z instrukcjami

### Zmienne Środowiskowe (jeśli potrzebne)

1. Przejdź do ustawień projektu w panelu Vercel
2. Nawiguj do Environment Variables
3. Dodaj wymagane zmienne (np. klucze API)

### ✨ SEO: Prerendering (Zalecane)

**⚠️ WAŻNE dla SEO:** Użyj `build:prerender` zamiast standardowego `build`

**W Vercel Dashboard:**

1. Idź do: Settings → General → Build & Development Settings
2. Zmień **Build Command** na:

   ```bash
   npm run build:prerender
   ```

3. **Output Directory** pozostaw: `dist`

**Co to robi?**

- Generuje statyczne HTML dla wszystkich stron
- Google widzi pełną treść (nie pusty `<div id="root"></div>`)
- Znacząco poprawia SEO i pozycje w wyszukiwarkach
- Automatycznie prerenderuje wszystkie posty blogowe

**Build time:** ~2-3 min (vs ~30s bez prerenderingu), ale warto dla SEO!

**Więcej:** Zobacz `../seo/PRERENDERING.md` dla szczegółów

## Opcja 2: Netlify

### Dlaczego Netlify?

- Łatwe wdrożenie metodą "przeciągnij i upuść"
- Wsparcie dla formularzy
- Darmowe certyfikaty SSL
- Ciągłe wdrażanie z Git

### Metoda 1: Przeciągnij i Upuść

1. Zbuduj projekt:

```bash
npm run build
```

2. Przejdź do [Netlify Drop](https://app.netlify.com/drop)
3. Przeciągnij folder `dist` do obszaru przesyłania
4. Twoja strona jest online!

### Metoda 2: Integracja z Git

1. Wypchnij kod do GitHub
2. Przejdź do [Netlify](https://www.netlify.com/)
3. Kliknij "New site from Git"
4. Połącz swoje repozytorium GitHub
5. Ustawienia buildu:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Kliknij "Deploy site"

### Własna Domena w Netlify

1. Przejdź do Site settings > Domain management
2. Kliknij "Add custom domain"
3. Postępuj zgodnie z instrukcjami konfiguracji DNS

## Opcja 3: GitHub Pages

### Konfiguracja

1. Zainstaluj gh-pages:

```bash
npm install --save-dev gh-pages
```

2. Zaktualizuj `vite.config.js`:

```js
export default defineConfig({
  base: "/repository-name/", // Zastąp nazwą swojego repo
  plugins: [react()],
});
```

3. Dodaj skrypt deploy do `package.json`:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

4. Wdróż:

```bash
npm run deploy
```

5. Włącz GitHub Pages w ustawieniach repozytorium:
   - Settings > Pages
   - Source: gh-pages branch
   - Kliknij Save

## Opcja 4: Własny Serwer (VPS/Dedykowany)

### Wymagania

- Zainstalowany Node.js
- Nginx lub Apache
- Certyfikat SSL (zalecany Let's Encrypt)

### Build dla Produkcji

```bash
npm run build
```

### Przykład Konfiguracji Nginx

```nginx
server {
    listen 80;
    server_name pawellipowczan.com www.pawellipowczan.com;

    root /var/www/portfolio/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cachowanie statycznych zasobów
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Kompresja Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### SSL z Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d pawellipowczan.com -d www.pawellipowczan.com
```

## Optymalizacja Wydajności

### Przed Wdrożeniem

1. **Optymalizuj Obrazy**

   - Skompresuj obrazy (użyj narzędzi jak TinyPNG, Squoosh)
   - Konwertuj do formatu WebP
   - Zmień rozmiar do odpowiednich wymiarów

2. **Code Splitting**

   - Już zaimplementowane z React.lazy()
   - Sprawdź rozmiar bundle: `npm run build -- --stats`

3. **Usuń Console Logi**

   - Szukaj instrukcji `console.log`
   - Usuń lub wyłącz w produkcji

4. **Przetestuj Wydajność**
   - Uruchom audyt Lighthouse
   - Sprawdź rozmiar bundle
   - Przetestuj na wolnej sieci 3G

### Po Wdrożeniu

1. **Włącz CDN** (jeśli używasz Vercel/Netlify, to automatyczne)

2. **Monitoruj Wydajność**

   - Google Analytics
   - Google Search Console
   - Monitorowanie Web Vitals

3. **Checklist SEO**
   - Prześlij sitemap do Google Search Console
   - Zweryfikuj czy meta tagi się renderują
   - Przetestuj tagi Open Graph (użyj [opengraph.xyz](https://www.opengraph.xyz/))
   - Przetestuj Twitter Cards (użyj [Twitter Card Validator](https://cards-dev.twitter.com/validator))

## Zmienne Środowiskowe

Jeśli potrzebujesz kluczy API lub wrażliwych danych:

1. Utwórz plik `.env` (już w .gitignore):

```
VITE_API_KEY=your_api_key_here
VITE_FORM_ENDPOINT=your_form_endpoint
```

2. Dostęp w kodzie:

```js
const apiKey = import.meta.env.VITE_API_KEY;
```

3. Ustaw na platformie wdrożeniowej:
   - **Vercel**: Settings > Environment Variables
   - **Netlify**: Site settings > Build & deploy > Environment

## Ciągłe Wdrażanie

### Automatyczne Wdrożenie przy Git Push

1. **Vercel**

   - Automatycznie wdraża przy pushu do gałęzi main
   - Skonfiguruj w ustawieniach projektu

2. **Netlify**
   - Automatyczne z integracją Git
   - Skonfiguruj wdrożenia gałęzi w ustawieniach

### Podglądy Gałęzi

Zarówno Vercel jak i Netlify automatycznie tworzą URL-e podglądu dla pull requestów.

## Rozwiązywanie Problemów

### Build Się Nie Udaje

- Sprawdź wersję Node.js (powinna być 16+)
- Wyczyść node_modules: `rm -rf node_modules && npm install`
- Sprawdź brakujące zależności

### Pusta Strona Po Wdrożeniu

- Sprawdź konsolę przeglądarki pod kątem błędów
- Zweryfikuj ścieżkę `base` w `vite.config.js`
- Sprawdź konfigurację routingu

### 404 Przy Odświeżeniu Strony

- Dla Netlify: plik `_redirects` już dołączony
- Dla innych hostów: Skonfiguruj serwer aby serwował index.html dla wszystkich ścieżek

### Obrazy Się Nie Ładują

- Sprawdź ścieżki obrazów (powinny być w folderze `public/`)
- Zweryfikuj czy pliki obrazów są włączone w build
- Sprawdź zakładkę network pod kątem błędów 404

## Po Wdrożeniu

1. **Przetestuj Wszystko**

   - [ ] Wszystkie linki nawigacji działają
   - [ ] Formularz kontaktowy się wysyła (skonfiguruj endpoint)
   - [ ] Posty blogowe ładują się poprawnie
   - [ ] Responsywny design na mobile
   - [ ] Strony prawne są dostępne

2. **Konfiguracja SEO**

   - [ ] Prześlij sitemap do Google Search Console
   - [ ] Prześlij sitemap do Bing Webmaster Tools
   - [ ] Skonfiguruj Google Analytics (opcjonalnie)
   - [ ] Zweryfikuj meta tagi z rozszerzeniem przeglądarki

3. **Media Społecznościowe**

   - [ ] Zaktualizuj profile w mediach społecznościowych linkiem do strony
   - [ ] Przetestuj podglądy udostępnień społecznościowych
   - [ ] Dodaj stronę do profilu LinkedIn

4. **Monitorowanie**
   - [ ] Skonfiguruj monitorowanie uptime (UptimeRobot, Pingdom)
   - [ ] Skonfiguruj śledzenie błędów (Sentry - opcjonalnie)
   - [ ] Monitoruj wydajność z Google PageSpeed Insights

## Konfiguracja Własnej Domeny

### Konfiguracja DNS

Dla większości dostawców hostingu, musisz ustawić te rekordy DNS:

**Rekordy A** (dla domeny głównej):

```
Type: A
Name: @
Value: [IP dostawcy hostingu]
```

**Rekord CNAME** (dla subdomeny www):

```
Type: CNAME
Name: www
Value: [domena dostawcy hostingu]
```

### Popularne Rejestratory Domen

- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)
- [Google Domains](https://domains.google/)
- [Cloudflare](https://www.cloudflare.com/) (zapewnia także DNS)

## Utrzymanie

### Regularne Aktualizacje

- Aktualizuj zależności co miesiąc: `npm update`
- Sprawdzaj luki bezpieczeństwa: `npm audit`
- Aktualizuj posty blogowe regularnie
- Dodawaj nowe projekty gdy są ukończone

### Kopie Zapasowe

- Kod jest zabezpieczony w repozytorium Git
- Treść bloga powinna być zabezpieczona osobno
- Kopie zapasowe bazy danych (jeśli używasz dynamicznej treści)

## Wsparcie

Dla problemów z wdrożeniem:

- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://www.netlify.com/support/)
- GitHub Pages: [docs.github.com](https://docs.github.com/en/pages)

---

**Gotowy do wdrożenia?** Wybierz swoją preferowaną platformę i postępuj zgodnie z powyższymi krokami!
