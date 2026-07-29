## Why

`react-helmet-async` 2.0.5 pod React 19 nie zatwierdza tagów `<meta>` ani `<link>`, gdy aplikacja siedzi w `<React.StrictMode>`: efekty montują się dwa razy, a sprzątanie wygrywa ze wstawianiem. Na serwerze deweloperskim strona nie ma więc ani opisu, ani canonicala, ani hreflang — na produkcji ma, bo `StrictMode` działa tylko w dev. Sprawdzone empirycznie: tymczasowe zdjęcie `StrictMode` przywraca komplet tagów.

To nie jest niedogodność, tylko cicha ślepota na całą warstwę SEO. Podczas zmiany `fix-seo-hreflang-canonical-meta` kosztowała cztery testy, wymusiła kierowanie testów metadanych na build produkcyjny zamiast na serwer deweloperski i zostawiła w trzech plikach testowych tolerancję na brakujące tagi. Każda następna praca nad SEO wejdzie w tę samą pułapkę.

React 19 sam przenosi `<title>`, `<meta>` i `<link>` renderowane w dowolnym komponencie do `<head>`, więc zależność jest zbędna. Usunięcie jej naprawia tryb deweloperski i pozbywa się paczki bez opiekuna.

## What Changes

- `SEO.jsx` zwraca tagi bezpośrednio, bez opakowania `<Helmet>`. Wartości i warunki emisji zostają bez zmian — zmienia się wyłącznie mechanizm dostarczania.
- `LocaleLayout.jsx` ustawia `<html lang>` przez `document.documentElement`, bo hoistowanie React 19 obejmuje `<title>`, `<meta>` i `<link>`, ale **nie** atrybuty `<html>`. To jedyne miejsce, które nie jest prostym zdjęciem opakowania.
- `main.jsx` traci `HelmetProvider`; `<React.StrictMode>` zostaje.
- `react-helmet-async` znika z `package.json`.
- Testy metadanych wracają na serwer deweloperski: znika drugi `webServer` (preview na 4173) z `playwright.config.js`, a `seo-metadata-invariants.spec.js` przestaje potrzebować własnego `baseURL`.
- Tolerancja na brakujący opis w `home.spec.js`, `blog.spec.js` i `policy-pages.spec.js` przestaje być potrzebna — asercje wracają do twardej postaci.
- `getSeoMetaTags` w `test-helpers.js` traci obejście oparte na `data-rh` (atrybut należał do Helmeta).
- Skrypty `build:test` i `preview:test` znikają, jeśli nic innego ich nie potrzebuje.

Bez zmian łamiących zgodność: żaden adres, żaden tag ani żadna wartość metadanych się nie zmienia. Zmiana jest niewidoczna dla robota — widoczna wyłącznie dla osoby pracującej lokalnie.

## Capabilities

### New Capabilities

- `seo-metadata-rendering`: sposób, w jaki metadane trafiają do `<head>` — przez własne renderowanie Reacta, identycznie w trybie deweloperskim i produkcyjnym, bez duplikatów przy zmianie trasy i w postaci widocznej dla prerenderu.

### Modified Capabilities

<!-- Brak. `seo-page-metadata` z fix-seo-hreflang-canonical-meta opisuje, jakie wartości mają mieć metadane; ta zmiana nie rusza ani jednego wymagania, tylko warstwę dostarczania. Spec nie jest jeszcze w openspec/specs/ (zmiana niezarchiwizowana). -->

## Impact

**Kod:**

- `src/components/seo/SEO.jsx` — zdjęcie `<Helmet>`
- `src/components/layout/LocaleLayout.jsx` — `<html lang>` poza Reactem
- `src/main.jsx` — usunięcie `HelmetProvider`
- `package.json` — usunięcie zależności, ewentualnie skryptów `build:test` / `preview:test`
- `playwright.config.js` — powrót do jednego serwera
- `tests/e2e/seo-metadata-invariants.spec.js`, `home.spec.js`, `blog.spec.js`, `policy-pages.spec.js`, `tests/utils/test-helpers.js` — cofnięcie obejść

**Bez zmian:** `StructuredData.jsx` nigdy nie korzystał z Helmeta (wstawia `application/ld+json` bezpośrednio i sprząta po sobie, więc działa także pod `StrictMode`). React 19 nie hoistuje `<script type="application/ld+json">`, więc obecne podejście zostaje.

**Ryzyko do potwierdzenia:** React 19 hoistuje, ale **nie** deduplikuje tagów po atrybucie `name`. Trzeba udowodnić, że przy zmianie trasy nie zostają tagi po poprzedniej stronie i że `scripts/prerender.mjs` (czeka na `og:title` i `description` przed zrzutem) nadal widzi komplet.

**Siatka bezpieczeństwa:** `tests/e2e/seo-metadata-invariants.spec.js` pilnuje czterech niezmienników metadanych i był czerwony na 11 z 12 przypadków przed poprzednią zmianą — wyłapie regresję wartości. Nowe wymaganie dotyczy parzystości dev/produkcja i braku duplikatów, więc potrzebuje własnych testów.

**Poza zakresem:** zmiana treści metadanych, `StructuredData.jsx`, przenoszenie `og:*` na inne API.
