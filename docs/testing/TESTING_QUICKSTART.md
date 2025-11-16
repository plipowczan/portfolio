# 🚀 Quick Start - Testy Playwright

Szybki przewodnik po testach E2E w projekcie portfolio.

## ⚡ Szybki start (2 minuty)

### 1. Uruchom dev server

```bash
npm run dev
```

### 2. W nowym terminalu uruchom testy

```bash
npm test
```

To wszystko! Testy uruchomią się automatycznie w trybie headless.

## 📊 Zobacz wyniki

```bash
npm run test:report
```

Otworzy raport HTML z wynikami testów, screenshotami i szczegółami.

## 🎯 Szybkie komendy

```bash
# Testy z widoczną przeglądarką
npm run test:headed

# Interaktywny UI mode
npm run test:ui

# Debug konkretnego testu
npm run test:debug

# Tylko Chrome
npm run test:chrome

# Tylko testy mobilne
npm run test:mobile
```

## 📝 Dostępne testy

### ✅ Strona główna (`home.spec.js`)

- Ładowanie strony i wszystkich sekcji
- SEO metatagi
- Nawigacja i linki
- Responsywność (mobile, tablet, desktop)
- Dostępność (keyboard navigation)

### ✅ Blog (`blog.spec.js`)

- Lista postów blogowych
- Pojedyncze posty
- Routing między postami
- SEO dla postów
- Markdown rendering
- Responsywność

### ✅ Formularz kontaktowy (`contact-form.spec.js`)

- Walidacja pól
- Wysyłanie formularza
- Komunikaty błędów
- Dostępność (labels, ARIA)
- Nawigacja klawiaturą

## 🐛 Debugging

### Jeśli test failuje

1. **Zobacz screenshot błędu**

   ```bash
   npm run test:report
   ```

   Raport pokaże screenshot w momencie błędu.

2. **Uruchom w trybie debug**

   ```bash
   npx playwright test home.spec.js --debug
   ```

   Otwiera się Playwright Inspector - możesz krok po kroku przejść przez test.

3. **Uruchom z widoczną przeglądarką**

   ```bash
   npm run test:headed
   ```

   Zobacz co dzieje się w przeglądarce.

### Typowe problemy

**Timeout:**

```
Error: Test timeout of 30000ms exceeded
```

Rozwiązanie: Dev server może nie działać. Sprawdź czy `npm run dev` jest uruchomione.

**Element not found:**

```
Error: Locator.click: Timeout 30000ms exceeded
```

Rozwiązanie: Element może mieć inny selektor. Użyj `--debug` żeby zobaczyć stronę.

## 📖 Więcej informacji

- **Pełna dokumentacja:** `tests/README.md`
- **Zaawansowane przykłady:** `tests/examples/advanced-example.spec.js`
- **MCP Browser guide:** `tests/examples/mcp-browser-example.md`

## 🎨 Pisanie własnych testów

### Szablon nowego testu

```javascript
// tests/e2e/my-test.spec.js
import { test, expect } from "@playwright/test";

test.describe("Moja funkcjonalność", () => {
  test("powinien robić coś", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Twoje testy tutaj
    const element = page.locator("selector");
    await expect(element).toBeVisible();
  });
});
```

### Uruchom nowy test

```bash
npx playwright test my-test.spec.js --headed
```

## 🤖 AI-Assisted Testing z MCP Browser

Możesz też używać AI z MCP Browser Tools w Cursor:

```
Ty: "Otwórz localhost:3000 i przetestuj nawigację"

AI otworzy stronę, kliknie wszystkie linki i sprawdzi czy działają.
```

Zobacz `tests/examples/mcp-browser-example.md` po więcej.

## 🚀 CI/CD

Testy są automatycznie uruchamiane na GitHub Actions przy każdym push/PR.

Zobacz `.github/workflows/playwright.yml`

## 💡 Tips

1. **Pisz testy dla najważniejszych scenariuszy** - nie wszystkiego
2. **Używaj helper functions** z `tests/utils/test-helpers.js`
3. **Testuj na mobile** - większość użytkowników to mobile
4. **Sprawdzaj dostępność** - używaj `checkFormAccessibility()`
5. **Mockuj API** jeśli potrzeba (zobacz `tests/examples/advanced-example.spec.js`)

## 📚 Przydatne linki

- [Playwright Docs](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging](https://playwright.dev/docs/debug)

---

**Pytania?** Sprawdź `tests/README.md` lub dokumentację Playwright.

**Gotowy do testowania? 🚀**

```bash
npm test
```
