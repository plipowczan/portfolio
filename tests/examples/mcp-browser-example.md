# Przykłady użycia MCP Browser Tools z Playwright

Ten dokument pokazuje jak można używać MCP (Model Context Protocol) Browser Tools w połączeniu z testami Playwright.

## Co to jest MCP Browser?

MCP Browser to zestaw narzędzi dostępnych w Cursor IDE, które pozwalają na interakcję z przeglądarką:

- Nawigacja do stron
- Snapshot strony (lepsza alternatywa dla screenshota)
- Klikanie elementów
- Wypełnianie formularzy
- Wykonywanie akcji klawiaturowych

## Kiedy używać MCP Browser vs Playwright?

### Użyj MCP Browser gdy

- ✅ Eksplorujesz aplikację manualnie przez AI
- ✅ Debugujesz problemy z UI
- ✅ Chcesz szybko przetestować coś bez pisania kodu
- ✅ Chcesz aby AI zrobiło interaktywny test

### Użyj Playwright testów gdy

- ✅ Piszesz automatyczne testy do CI/CD
- ✅ Chcesz powtarzalne testy regresyjne
- ✅ Testujesz na wielu przeglądarkach
- ✅ Chcesz integrację z GitHub Actions

## Przykładowe scenariusze

### Scenariusz 1: Eksploracja strony

**Z MCP Browser:**

```
Użytkownik: "Otwórz moją stronę portfolio na localhost:3000 i zrób snapshot"

AI użyje:
1. mcp_cursor-ide-browser_browser_navigate(url: "http://localhost:3000")
2. mcp_cursor-ide-browser_browser_snapshot()
3. AI opisze co widzi i zasugeruje testy
```

**Z Playwright:**

```javascript
test("eksploracja strony", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.screenshot({ path: "homepage.png" });

  // Następnie piszesz asercje bazując na tym co widzisz
});
```

### Scenariusz 2: Test formularza kontaktowego

**Z MCP Browser (interaktywny):**

```
Użytkownik: "Przejdź do sekcji kontakt i wypełnij formularz"

AI użyje:
1. browser_snapshot() - żeby zobaczyć elementy
2. browser_click(element: "form input[name='name']")
3. browser_type(text: "Jan Kowalski")
4. browser_click(element: "form button[type='submit']")
5. browser_snapshot() - żeby zobaczyć rezultat
```

**Z Playwright (automatyczny test):**

```javascript
test("formularz kontaktowy", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("#contact").scrollIntoViewIfNeeded();

  await page.fill('input[name="name"]', "Jan Kowalski");
  await page.fill('input[name="email"]', "jan@example.com");
  await page.fill("textarea", "Test message");

  await page.click('button[type="submit"]');

  await expect(page.locator(".success")).toBeVisible();
});
```

### Scenariusz 3: Debugging problemu z nawigacją

**Z MCP Browser:**

```
Użytkownik: "Kliknij w link do bloga i zobacz co się stanie"

AI:
1. browser_snapshot() - znajdzie link
2. browser_click(element: "nav a", ref: "blog-link")
3. browser_wait_for(time: 2)
4. browser_snapshot() - sprawdzi czy strona się załadowała
5. browser_console_messages() - sprawdzi errory
```

**Z Playwright:**

```javascript
test.only("debug nawigacji do bloga", async ({ page }) => {
  await page.goto("http://localhost:3000");

  page.on("console", (msg) => console.log(msg.text()));

  const blogLink = page.locator('nav a[href="/blog"]');
  await blogLink.click();

  await page.waitForURL("**/blog");
  await page.pause(); // Otwiera Playwright Inspector
});
```

## Workflow: MCP Browser → Playwright Tests

Zalecany workflow to:

1. **Eksploracja z MCP Browser**

   - Użyj AI z MCP browser tools do eksploracji
   - Znajdź problemy, przetestuj scenariusze
   - AI pokaże Ci strukturę strony

2. **Zapisz jako Playwright test**

   - Scenariusze które chcesz automatyzować
   - Przekonwertuj na testy Playwright
   - Dodaj do CI/CD

3. **Regresja**
   - Playwright automatycznie testuje przy każdym pushu
   - Jeśli test failuje, użyj MCP Browser do debugowania

## Praktyczny przykład

### Krok 1: Eksploruj z AI

```
Ty: "Otwórz localhost:3000 i przetestuj czy wszystkie linki w nawigacji działają"

AI:
1. Nawiguje do strony
2. Robi snapshot
3. Znajduje wszystkie linki w nav
4. Klika każdy link i sprawdza czy działa
5. Raportuje wyniki

AI: "Znalazłem 5 linków w nawigacji:
- O mnie ✅
- Projekty ✅
- Umiejętności ✅
- Blog ✅
- Kontakt ✅

Wszystkie działają poprawnie."
```

### Krok 2: Zapisz jako Playwright test

```javascript
// tests/e2e/navigation.spec.js
import { test, expect } from "@playwright/test";

test("wszystkie linki nawigacyjne powinny działać", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const navLinks = [
    { selector: 'a[href*="about"]', expected: /#about/ },
    { selector: 'a[href*="projects"]', expected: /#projects/ },
    { selector: 'a[href*="skills"]', expected: /#skills/ },
    { selector: 'a[href="/blog"]', expected: /\/blog/ },
    { selector: 'a[href*="contact"]', expected: /#contact/ },
  ];

  for (const link of navLinks) {
    await page.goto("http://localhost:3000");
    await page.click(link.selector);
    await expect(page).toHaveURL(link.expected);
  }
});
```

### Krok 3: Uruchom automatycznie

```bash
npm test
```

## Tips & Tricks

### 1. Użyj MCP Browser dla jednorazowych testów

```
"Sprawdź czy obrazy w galerii projektów mają poprawne alt texty"
```

### 2. Użyj Playwright dla testów regresyjnych

```javascript
test("obrazy projektów mają alt text", async ({ page }) => {
  await page.goto("/");
  const images = await page.locator(".project img").all();

  for (const img of images) {
    const alt = await img.getAttribute("alt");
    expect(alt).toBeTruthy();
  }
});
```

### 3. Kombinuj oba podejścia

- MCP Browser do eksploracji i debugowania
- Playwright do automatyzacji i CI/CD

## Podsumowanie

| Aspekt         | MCP Browser            | Playwright              |
| -------------- | ---------------------- | ----------------------- |
| Użycie         | Interaktywne, z AI     | Automatyczne, kod       |
| Cel            | Eksploracja, debugging | Testy regresyjne, CI/CD |
| Szybkość setup | Bardzo szybka          | Wymaga kodu             |
| Powtarzalność  | Manualna               | Automatyczna            |
| Integracja CI  | Nie                    | Tak                     |
| Multi-browser  | Nie                    | Tak                     |
| Raportowanie   | Konwersacja z AI       | HTML report, artifacts  |

**Najlepszy workflow:** Eksploruj z MCP Browser → Automatyzuj z Playwright! 🚀

---

**Więcej informacji:**

- [Playwright Docs](https://playwright.dev)
- [MCP Documentation](https://modelcontextprotocol.io)
