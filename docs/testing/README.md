# 🧪 Dokumentacja Testów

Ten katalog zawiera dokumentację dotyczącą testów w projekcie portfolio.

## 📄 Pliki

### TESTING_QUICKSTART.md

Szybki przewodnik po testach E2E z Playwright:

- Jak uruchomić testy (2 minuty)
- Podstawowe komendy testowe
- Debugging testów
- Pisanie własnych testów
- AI-Assisted Testing z MCP Browser

## 🔗 Powiązane zasoby

### Testy Playwright

- **Główna dokumentacja:** [`tests/README.md`](../../tests/README.md)
- **Pliki testowe:** [`tests/e2e/`](../../tests/e2e/)
- **Helper functions:** [`tests/utils/test-helpers.js`](../../tests/utils/test-helpers.js)
- **Przykłady zaawansowane:** [`tests/examples/advanced-example.spec.js`](../../tests/examples/advanced-example.spec.js)
- **MCP Browser guide:** [`tests/examples/mcp-browser-example.md`](../../tests/examples/mcp-browser-example.md)

### Konfiguracja

- **Playwright config:** [`playwright.config.js`](../../playwright.config.js)
- **GitHub Actions:** [`.github/workflows/playwright.yml`](../../.github/workflows/playwright.yml)

## 🚀 Szybki start

```bash
# Uruchom dev server
npm run dev

# W nowym terminalu uruchom testy
npm test

# Zobacz raport HTML
npm run test:report
```

## 📊 Pokrycie testów

Aktualne testy obejmują:

- ✅ Stronę główną (home, nawigacja, sekcje)
- ✅ Blog (lista postów, routing, pojedyncze posty)
- ✅ Formularz kontaktowy (walidacja, accessibility)
- ✅ Responsywność (mobile, tablet, desktop)
- ✅ SEO (metatagi, strukturalne dane)
- ✅ Accessibility (keyboard navigation, ARIA)

## 📈 Statystyki

- **Łączna liczba testów:** 47+
- **Plików testowych:** 3
- **Helper functions:** 10+
- **Przeglądarki testowe:** 5 (Desktop + Mobile)
- **Lines of code:** 2000+

---

**Zobacz też:**

- [Quick Start Guide](./TESTING_QUICKSTART.md)
- [Główna dokumentacja testów](../../tests/README.md)
