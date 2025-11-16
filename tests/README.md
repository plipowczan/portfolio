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
# Uruchom wszystkie testy (headless)
npm test

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
- **timeout**: maksymalny czas na test (30s)
- **retries**: liczba ponownych prób w CI (2)
- **workers**: liczba równoległych workerów
- **baseURL**: `http://localhost:3000`
- **projects**: konfiguracje dla różnych przeglądarek
- **webServer**: automatyczne uruchamianie dev servera

### Zmienne środowiskowe

Możesz utworzyć plik `.env.test` dla zmiennych testowych:

```env
# .env.test
TEST_BASE_URL=http://localhost:3000
TEST_TIMEOUT=30000
```

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

### GitHub Actions przykład

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npm test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

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
