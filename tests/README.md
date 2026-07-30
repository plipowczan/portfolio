# Testy E2E - Playwright

Dokumentacja testów funkcjonalnych (End-to-End) dla portfolio Pawła Lipowczana.

## 📋 Spis treści

- [Wprowadzenie](#wprowadzenie)
- [Struktura testów](#struktura-testów)
- [Instalacja](#instalacja)
- [Uruchamianie testów](#uruchamianie-testów)
- [Konfiguracja](#konfiguracja)
- [Pisanie testów](#pisanie-testów)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Wprowadzenie

Testy E2E w tym projekcie używają **Playwright** - nowoczesnego frameworka do testowania aplikacji webowych. Playwright oferuje:

- ✅ Wsparcie dla wielu przeglądarek (Chromium, Firefox, WebKit)
- ✅ Testy mobilne (viewport mobile)
- ✅ Automatyczne czekanie na elementy
- ✅ Screenshoty i nagrywanie video przy błędach
- ✅ Debug UI i trace viewer
- ✅ Równoległe wykonywanie testów

## 📁 Struktura testów

```
tests/
├── e2e/                      # Testy End-to-End
│   ├── home.spec.js         # Testy strony głównej
│   ├── blog.spec.js         # Testy bloga
│   └── contact-form.spec.js # Testy formularza kontaktowego
├── fixtures/                 # Dane testowe
│   └── test-data.js         # Definicje URL, danych formularza, etc.
├── utils/                    # Funkcje pomocnicze
│   └── test-helpers.js      # Helper functions dla testów
└── README.md                 # Ten plik

playwright.config.js          # Konfiguracja Playwright
playwright-report/            # Raporty HTML (generowane)
```

## 🚀 Instalacja

### Wymagania

- Node.js >= 18
- npm lub yarn

### Instalacja zależności

Jeśli jeszcze nie zainstalowałeś Playwright:

```bash
# Zainstaluj Playwright
npm install -D @playwright/test

# Zainstaluj przeglądarki
npx playwright install
```

## 🏃 Uruchamianie testów

### Podstawowe komendy

```bash
# Uruchom testy na domyślnym zestawie: chromium + Mobile Chrome
npm test

# Pełna macierz przeglądarek (chromium, edge, firefox, webkit, oba mobilne)
PW_ALL=1 npm test

# Dołóż serwer preview (produkcyjny build) - wymaga go seo-metadata-invariants
PW_PREVIEW=1 npm test

# Uruchom testy z interfejsem graficznym
npm run test:headed

# Uruchom testy w trybie UI (interaktywny)
npm run test:ui

# Uruchom testy w trybie debug
npm run test:debug

# Uruchom testy tylko w Chromium
npm run test:chrome

# Uruchom testy tylko w Firefox
npm run test:firefox

# Uruchom testy tylko w WebKit (Safari)
npm run test:webkit

# Uruchom testy mobilne
npm run test:mobile

# Pokaż raport HTML
npm run test:report
```

### Uruchamianie konkretnych testów

```bash
# Uruchom tylko testy strony głównej
npx playwright test home.spec.js

# Uruchom tylko testy bloga
npx playwright test blog.spec.js

# Uruchom konkretny test po nazwie
npx playwright test -g "powinna załadować się poprawnie"

# Uruchom testy w konkretnym pliku w trybie debug
npx playwright test home.spec.js --debug
```

### Uruchamianie testów dla konkretnej przeglądarki

```bash
# Tylko Chromium
npx playwright test --project=chromium

# Tylko Firefox
npx playwright test --project=firefox

# Tylko WebKit
npx playwright test --project=webkit

# Mobile Chrome
npx playwright test --project="Mobile Chrome"

# Mobile Safari
npx playwright test --project="Mobile Safari"
```

## ⚙️ Konfiguracja

### playwright.config.js

Główny plik konfiguracyjny znajduje się w katalogu głównym projektu. Zawiera:

- **testDir**: katalog z testami (`./tests`)
- **timeout**: maksymalny czas na test (60s)
- **globalTimeout**: górna granica całego przebiegu (20 min lokalnie, 25 w CI) - zawieszony przebieg kończy się sam, zamiast wisieć z serwerami Vite
- **retries**: liczba ponownych prób w CI (2)
- **workers**: 1 w CI (testy nawigacyjne są wrażliwe na czas)
- **baseURL**: serwer dev na porcie wyliczonym per worktree
- **projects**: domyślnie `chromium` + `Mobile Chrome`, pełna macierz pod `PW_ALL=1`
- **webServer**: dev zawsze, preview tylko pod `PW_PREVIEW=1`

### Porty

Porty serwera dev i preview liczy `scripts/ports.mjs` z położenia katalogu
roboczego. Dzięki temu każdy git worktree ma własną parę i dwa worktree mogą
testować równolegle - wcześniej `reuseExistingServer` potrafił po cichu podpiąć
przebieg pod aplikację serwowaną z innego worktree.

Nie wpisuj portu na sztywno w teście. Adres bezwzględny bierz z `baseURL` albo
importuj z tego modułu.

### Zmienne środowiskowe

| Zmienna | Działanie |
| --- | --- |
| `PW_ALL=1` | pełna macierz przeglądarek zamiast domyślnej pary |
| `PW_PREVIEW=1` | uruchamia serwer preview (produkcyjny build) |
| `PW_DEPLOYED=1` | nie stawia żadnego serwera lokalnego - cel jest zdalny |
| `SEO_HEADERS_URL` | adres wdrożenia dla testów nagłówków (`seo-security-headers`, `perf-font-cache-headers`) |
| `DEV_PORT`, `PREVIEW_PORT` | nadpisują wyliczone porty |

## ✍️ Pisanie testów

### Struktura testu

```javascript
import { test, expect } from "@playwright/test";
import { waitForAnimations } from "../utils/test-helpers.js";

test.describe("Nazwa grupy testów", () => {
  test.beforeEach(async ({ page }) => {
    // Przygotowanie przed każdym testem
    await page.goto("/");
    await waitForAnimations(page, 1000);
  });

  test("powinien testować konkretną funkcjonalność", async ({ page }) => {
    // Arrange - przygotowanie
    const element = page.locator("selector");

    // Act - akcja
    await element.click();

    // Assert - sprawdzenie
    await expect(element).toBeVisible();
  });
});
```

### Dobre praktyki

#### 1. Używaj helper functions

```javascript
import { scrollToElement, waitForAnimations } from "../utils/test-helpers.js";

// Zamiast:
await page.evaluate(() => window.scrollTo(0, 500));
await page.waitForTimeout(1000);

// Użyj:
await scrollToElement(page, "#section");
await waitForAnimations(page, 1000);
```

#### 2. Używaj danych testowych z fixtures

```javascript
import { testUrls, testContactForm } from "../fixtures/test-data.js";

await page.goto(testUrls.home);
await nameInput.fill(testContactForm.validData.name);
```

#### 3. Używaj semantycznych selektorów

```javascript
// ✅ Dobre - semantyczne
await page.locator('role=button[name="Wyślij"]').click();
await page.getByText("Kontakt").click();
await page.getByLabel("Email").fill("test@example.com");

// ❌ Złe - kruche
await page.locator(".btn-primary-123").click();
```

#### 4. Sprawdzaj dostępność (a11y)

```javascript
import { checkFormAccessibility } from "../utils/test-helpers.js";

const result = await checkFormAccessibility(page, "form");
expect(result.valid).toBeTruthy();
```

#### 5. Testuj responsywność

```javascript
test("powinien być responsywny na mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  const element = page.locator("selector");
  await expect(element).toBeVisible();
});
```

### Dostępne helper functions

#### `waitForAnimations(page, timeout)`

Czeka na zakończenie animacji Framer Motion.

```javascript
await waitForAnimations(page, 1000);
```

#### `scrollToElement(page, selector)`

Płynnie scrolluje do elementu.

```javascript
await scrollToElement(page, "#contact");
```

#### `getSeoMetaTags(page)`

Pobiera metatagi SEO strony.

```javascript
const meta = await getSeoMetaTags(page);
expect(meta.title).toBeTruthy();
expect(meta.description).toBeTruthy();
```

#### `testKeyboardNavigation(page, startSelector, tabCount)`

Testuje nawigację klawiaturą (Tab).

```javascript
const focused = await testKeyboardNavigation(page, "nav a", 5);
expect(focused.length).toBe(5);
```

#### `checkFormAccessibility(page, formSelector)`

Sprawdza dostępność formularza (labels, aria-required).

```javascript
const result = await checkFormAccessibility(page, "form");
console.log(result.errors);
```

## 🎨 Testy dostępności (A11y)

Testy zawierają podstawowe sprawdzenia dostępności:

- ✅ Etykiety dla pól formularza
- ✅ Nawigacja klawiaturą (Tab, Enter)
- ✅ ARIA attributes
- ✅ Alt text dla obrazów
- ✅ Focus indicators

Przykład:

```javascript
test("formularz powinien być dostępny", async ({ page }) => {
  const result = await checkFormAccessibility(page, "form");

  if (!result.valid) {
    console.log("Błędy dostępności:", result.errors);
  }

  expect(result.errors).toBeDefined();
});
```

## 📊 Raporty i debugging

### HTML Report

Po uruchomieniu testów, raport HTML jest automatycznie generowany:

```bash
npm run test:report
```

Raport zawiera:

- ✅ Szczegóły każdego testu
- ✅ Screenshoty przy błędach
- ✅ Trace viewer (krok po kroku)
- ✅ Logi konsoli i network

### Debug Mode

```bash
# Uruchom konkretny test w trybie debug
npx playwright test home.spec.js --debug

# Debug konkretnego testu po nazwie
npx playwright test -g "powinien załadować" --debug
```

W trybie debug możesz:

- Krok po kroku przechodzić przez test
- Inspektować elementy
- Zmieniać selektory na żywo
- Analizować network requests

### Trace Viewer

Jeśli test failuje, Playwright automatycznie zapisuje trace:

```bash
npx playwright show-trace trace.zip
```

Trace viewer pokazuje:

- Timeline wszystkich akcji
- Screenshoty przed/po każdej akcji
- Network requests
- Logi konsoli
- DOM snapshots

## 🐛 Troubleshooting

### Problem: Testy failują z timeout

**Rozwiązanie:**

- Zwiększ timeout w `playwright.config.js`
- Użyj `waitForAnimations()` po akcjach
- Sprawdź czy dev server się uruchomił

```javascript
// Zwiększ timeout dla konkretnego testu
test("powolny test", async ({ page }) => {
  test.setTimeout(60000); // 60 sekund
  await page.goto("/");
});
```

### Problem: Element nie jest widoczny

**Rozwiązanie:**

- Sprawdź czy animacje się zakończyły
- Użyj `scrollToElement()`
- Sprawdź viewport size

```javascript
await scrollToElement(page, "#element");
await waitForAnimations(page, 1000);
await expect(page.locator("#element")).toBeVisible();
```

### Problem: Testy działają lokalnie ale failują w CI

**Rozwiązanie:**

- Zwiększ timeout
- Zwiększ liczbę retries
- Sprawdź czy wszystkie przeglądarki są zainstalowane
- Użyj `page.waitForLoadState('networkidle')`

```javascript
await page.goto("/");
await page.waitForLoadState("networkidle");
```

### Problem: Form submission nie działa

**Rozwiązanie:**

- Sprawdź czy formularz nie używa zewnętrznego endpointu
- Mock network requests jeśli potrzeba
- Sprawdź console errors: `await page.on('console', msg => console.log(msg.text()))`

```javascript
// Mock form submission
await page.route("**/api/contact", (route) => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ success: true }),
  });
});
```

## 📝 Konwencje nazewnictwa

### Pliki testowe

- Używaj `.spec.js` dla plików testowych
- Nazwa powinna opisywać testowany obszar: `home.spec.js`, `blog.spec.js`

### Nazwy testów

- Używaj formy "powinien/powinna" + akcja
- Bądź opisowy i konkretny

```javascript
// ✅ Dobre
test('powinien wyświetlić komunikat błędu przy pustym emailu', ...)

// ❌ Złe
test('email validation', ...)
```

### Grupowanie testów

```javascript
test.describe('Strona główna', () => {
  test.describe('Hero section', () => {
    test('powinien wyświetlić gradient text', ...)
    test('powinien pokazać CTA buttons', ...)
  });

  test.describe('Responsywność', () => {
    test('powinien być responsywny na mobile', ...)
  });
});
```

## 🚦 Continuous Integration (CI)

Trzy przebiegi, każdy odpowiada na inne pytanie. Konfiguracja:
`.github/workflows/playwright.yml` i `.github/workflows/deployed-checks.yml`.

| Kiedy | Co leci | Po co |
| --- | --- | --- |
| Pull request | `chromium` + `Mobile Chrome`, każdy na 2 shardy (4 joby) | czy zmiana nie psuje niczego oczywistego, zanim wejdzie na main |
| Push na `main` | pełna macierz, jeden job na projekt (5 jobów) | czy nie psuje pozostałych silników |
| Po wdrożeniu Vercela | `seo-security-headers` + `perf-font-cache-headers` pod adresem wdrożenia | nagłówki z `vercel.json` istnieją tylko na wdrożeniu |

Szczegóły, które łatwo przeoczyć:

- **Jeden job = jedna przeglądarka.** Każdy instaluje tylko swoją binarkę, a
  czerwony job nazywa silnik zamiast numeru sharda.
- **Cache przeglądarek** kluczowany wersją `@playwright/test` i przeglądarką.
  Krok instalacji ma własny `timeout-minutes: 10` - kiedyś zawisł na 30 minut i
  zjadł cały budżet joba, przez co testy nie wystartowały wcale.
- **`PW_PREVIEW` tylko w jobie chromium.** Testy metadanych SEO są przypięte do
  chromium, więc pozostałe joby nie płacą za produkcyjny build.
- **Prerenderu nie ma w CI.** Kompletność `dist/` sprawdza sam
  `npm run build:prerender`, a to `buildCommand` z `vercel.json` - bramka działa
  na każdym wdrożeniu, bez minuty runnera.

## 📚 Dodatkowe zasoby

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## 🤝 Współpraca

Przy dodawaniu nowych testów:

1. Upewnij się, że testy przechodzą lokalnie
2. Dodaj dokumentację dla nowych helper functions
3. Używaj istniejących fixtures i helpers
4. Zachowaj konwencje nazewnictwa
5. Dodaj testy responsywności jeśli dotyczy UI

## 📄 Licencja

Testy są częścią projektu portfolio i podlegają tej samej licencji.

---

**Ostatnia aktualizacja:** Listopad 2025  
**Wersja Playwright:** 1.56+  
**Autor:** Pawel Lipowczan
