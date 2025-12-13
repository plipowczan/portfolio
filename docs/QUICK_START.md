# Szybki Start 🚀

Uruchom swoją stronę portfolio online w mniej niż 30 minut!

## ⚡ Szybka Ścieżka do Wdrożenia

### Krok 1: Personalizacja (15 minut)

**1.1 Zaktualizuj swoje informacje**

Edytuj `src/utils/constants.js`:

```javascript
export const SITE_CONFIG = {
  name: "Pawel Lipowczan",
  title: "Your Tech Guide",
  email: "your-email@example.com", // ← Zmień to
  url: "https://yoursite.com", // ← Zmień to
  social: {
    github: "https://github.com/yourusername", // ← Zmień te linki
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
  },
};
```

**1.2 Dodaj swoje projekty**

Edytuj `src/data/projects.js` - Zastąp przykładowymi swoimi prawdziwymi projektami lub zostaw przykładowe na razie.

**1.3 Zaktualizuj tekst O mnie**

Edytuj `src/components/sections/About.jsx` - Zaktualizuj akapity swoją historią.

**1.4 Skonfiguruj formularz kontaktowy** (Opcjonalnie na razie)

Formularz działa z walidacją, ale aby otrzymywać emaile:

- Zarejestruj się na [FormSpree.io](https://formspree.io/)
- Uzyskaj swój endpoint formularza
- Zaktualizuj Contact.jsx z endpointem

### Krok 2: Testowanie Lokalnie (5 minut)

```bash
# Uruchom serwer deweloperski
npm run dev

# Otwórz http://localhost:3000 w przeglądarce
# Poklikaj, przetestuj nawigację, sprawdź widok mobilny
```

**Szybkie sprawdzenia:**

- [ ] Logo się wyświetla
- [ ] Smooth scroll działa
- [ ] Menu mobilne działa
- [ ] Wszystkie sekcje są widoczne
- [ ] Linki w stopce działają

### Krok 3: Wdrożenie na Vercel (5 minut)

**Najłatwiejsze wdrożenie ever:**

```bash
# Zainstaluj Vercel CLI (jednorazowo)
npm install -g vercel

# Wdróż
vercel

# Postępuj zgodnie z instrukcjami:
# - Set up and deploy? Y
# - Which scope? (wybierz swoje konto)
# - Link to existing project? N
# - What's your project's name? (naciśnij enter)
# - In which directory is your code located? (naciśnij enter)
# - Want to override the settings? N

# 🎉 Twoja strona jest już online!
```

Otrzymasz URL typu: `https://your-project-name.vercel.app`

### Krok 4: Dodaj własną domenę (Opcjonalnie - 5 minut)

**Jeśli masz domenę:**

1. Przejdź do panelu Vercel
2. Wybierz swój projekt
3. Kliknij "Settings" → "Domains"
4. Dodaj swoją domenę (np. `pawellipowczan.com`)
5. Zaktualizuj rekordy DNS jak pokazuje Vercel
6. Poczekaj 5-10 minut na propagację DNS

**Nie masz jeszcze domeny?**

- Kup jedną z [Namecheap](https://www.namecheap.com/) (~40 zł/rok)
- Lub użyj darmowego URL-a Vercel na razie

## 🎨 Checklist Personalizacji

### Musisz Zrobić Przed Uruchomieniem

- [ ] Zaktualizuj email w `src/utils/constants.js`
- [ ] Zaktualizuj linki do mediów społecznościowych
- [ ] Zastąp przykładowe projekty (lub zostaw je na razie)
- [ ] Zaktualizuj tekst sekcji O mnie
- [ ] Przetestuj na urządzeniu mobilnym

### Powinieneś Zrobić Wkrótce Po Uruchomieniu

- [ ] Dodaj prawdziwe zdjęcia projektów do `public/images/`
- [ ] Napisz swój pierwszy post na blogu
- [ ] Dodaj profesjonalne zdjęcie do sekcji O mnie
- [ ] Skonfiguruj backend formularza kontaktowego (FormSpree/EmailJS)
- [ ] Zaktualizuj sitemap.xml swoją domeną
- [ ] Dodaj stronę do Google Search Console

### Możesz Zrobić Później

- [ ] Dodaj więcej projektów
- [ ] Napisz więcej postów na blogu
- [ ] Dodaj referencje/testimonials
- [ ] Skonfiguruj Google Analytics
- [ ] Utwórz bardziej szczegółowe case studies

## 🐛 Najczęstsze Problemy i Szybkie Rozwiązania

### "npm run dev" nie działa

```bash
# Usuń i przeinstaluj
rm -rf node_modules
npm install
npm run dev
```

### Build się nie udaje

```bash
# Upewnij się, że cała składnia jest poprawna
npm run build

# Sprawdź komunikat błędu i napraw wspomniany plik
```

### Strona wygląda źle po wdrożeniu

- Sprawdź konsolę przeglądarki pod kątem błędów (F12)
- Zweryfikuj, że obrazy są w folderze `public/`
- Sprawdź, czy wszystkie importy są poprawne

### Formularz kontaktowy nie wysyła emaili

- Normalne! Musisz skonfigurować FormSpree lub EmailJS
- Zobacz `src/components/sections/Contact.jsx` dla TODO
- Walidacja formularza nadal działa bez backendu

## 📱 Checklist Testowania

Przed uruchomieniem przetestuj:

**Desktop**

- [ ] Wszystkie elementy menu działają
- [ ] Smooth scroll do sekcji
- [ ] Efekty hover na kartach
- [ ] Walidacja formularza kontaktowego
- [ ] Posty blogowe otwierają się poprawnie

**Mobile** (użyj DevTools przeglądarki lub prawdziwego urządzenia)

- [ ] Menu hamburger otwiera/zamyka się
- [ ] Wszystkie sekcje układają się pionowo
- [ ] Przyciski są przyjazne dotykowi
- [ ] Tekst jest czytelny
- [ ] Obrazy nie wykraczają poza krawędzie

**Wszystkie Urządzenia**

- [ ] Linki w stopce działają
- [ ] Strony prawne się ładują
- [ ] Logo prowadzi do home
- [ ] Linki zewnętrzne otwierają się w nowych kartach

## 🚀 Alternatywne Opcje Wdrożenia

### Netlify (Drag & Drop)

```bash
npm run build
# Przejdź do app.netlify.com/drop
# Przeciągnij folder 'dist'
# Gotowe!
```

### GitHub Pages

```bash
npm install --save-dev gh-pages

# Dodaj do scripts w package.json:
# "deploy": "gh-pages -d dist"

npm run build
npm run deploy
```

Zobacz **[deployment/DEPLOYMENT.md](./deployment/DEPLOYMENT.md)** dla szczegółowych przewodników.

## 📚 Szybki Spis Kluczowych Plików

| Plik                                  | Co Zaktualizować                  |
| ------------------------------------- | --------------------------------- |
| `src/utils/constants.js`              | Imię, email, linki społecznościowe|
| `src/data/projects.js`                | Twoje projekty                    |
| `src/data/skills.js`                  | Twoje umiejętności                |
| `src/data/blogPosts.js`               | Artykuły blogowe                  |
| `src/components/sections/About.jsx`   | Biografia osobista                |
| `src/components/sections/Contact.jsx` | Konfiguracja backendu formularza  |

## 💡 Pro Tipy

1. **Użyj Najpierw Darmowego URL Vercel**

   - Wdróż i przetestuj przed kupnem domeny
   - Upewnij się, że wszystko działa

2. **Zacznij z Przykładową Treścią**

   - Uruchom z placeholder projektami
   - Dodawaj prawdziwą treść stopniowo

3. **Mobile First**

   - Większość odwiedzających będzie na mobile
   - Testuj na swoim telefonie!

4. **SEO Może Poczekać**

   - Najpierw uruchom stronę
   - Optymalizuj pod wyszukiwarki później

5. **Iteruj**
   - Uruchom → Zbierz feedback → Ulepsz
   - Nie czekaj na perfekcję

## 🎯 Metryki Sukcesu

**Tydzień 1:**

- [ ] Strona jest online
- [ ] Wszystkie sekcje działają
- [ ] Responsywna na mobile
- [ ] Formularz kontaktowy waliduje

**Tydzień 2:**

- [ ] Prawdziwe projekty dodane
- [ ] Pierwszy post na blogu opublikowany
- [ ] Formularz kontaktowy wysyła emaile
- [ ] Udostępniono w mediach społecznościowych

**Miesiąc 1:**

- [ ] 3+ posty na blogu
- [ ] Wszystkie projekty mają prawdziwe zdjęcia
- [ ] Google Search Console skonfigurowany
- [ ] Regularne aktualizacje

## 🆘 Potrzebujesz Więcej Pomocy?

Utknąłeś? Sprawdź te zasoby:

1. **[README.md](../README.md)** - Szczegółowy przewodnik konfiguracji
2. **[deployment/DEPLOYMENT.md](./deployment/DEPLOYMENT.md)** - Wszystkie opcje wdrożenia
3. **[AGENTS.md](../AGENTS.md)** - Przewodnik dla AI agents (EN)
4. **[PRD.md](./PRD.md)** - Pełne specyfikacje (EN dla AI)
5. **[SRS.md](./SRS.md)** - Specyfikacja techniczna (EN dla AI)

## 🎉 Gotowy do Uruchomienia?

Twoje portfolio jest gotowe do produkcji! Wystarczy:

1. ✅ Zaktualizuj swoje informacje (15 min)
2. ✅ Przetestuj lokalnie (5 min)
3. ✅ Wdróż na Vercel (5 min)
4. ✅ Podziel się ze światem! 🌍

**Całkowity czas: ~25 minut aby mieć działające, profesjonalne portfolio!**

```bash
# Do dzieła!
npm run dev      # Przetestuj to
vercel           # Wdróż to
                 # Podziel się tym! 🚀
```

---

**Pytania?** Sprawdź inne pliki dokumentacji lub wyszukaj komunikat błędu w Google - dasz radę! 💪
