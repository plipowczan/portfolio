## Why

`react-helmet-async` 2.0.5 pod React 19 nie zatwierdza tagów `<meta>` ani `<link>`, gdy aplikacja siedzi w `<React.StrictMode>`: efekty montują się dwa razy, a sprzątanie wygrywa ze wstawianiem. Na serwerze deweloperskim strona nie ma więc ani opisu, ani canonicala, ani hreflang — na produkcji ma, bo `StrictMode` działa tylko w dev. Sprawdzone empirycznie: tymczasowe zdjęcie `StrictMode` przywraca komplet tagów.

To nie jest niedogodność, tylko cicha ślepota na całą warstwę SEO. Podczas zmiany `fix-seo-hreflang-canonical-meta` kosztowała cztery testy, wymusiła kierowanie testów metadanych na build produkcyjny zamiast na serwer deweloperski i zostawiła w trzech plikach testowych tolerancję na brakujące tagi. Każda następna praca nad SEO wejdzie w tę samą pułapkę.

React 19 sam przenosi `<title>`, `<meta>` i `<link>` renderowane w dowolnym komponencie do `<head>`, więc zależność jest zbędna. Usunięcie jej naprawia tryb deweloperski i pozbywa się paczki bez opiekuna.

## What Changes

- `SEO.jsx` zwraca tagi bezpośrednio, bez opakowania `<Helmet>`. Wartości i warunki emisji zostają bez zmian — zmienia się wyłącznie mechanizm dostarczania.
- `LocaleLayout.jsx` ustawia `<html lang>` przez `document.documentElement`, bo hoistowanie React 19 obejmuje `<title>`, `<meta>` i `<link>`, ale **nie** atrybuty `<html>`. To jedyne miejsce, które nie jest prostym zdjęciem opakowania.
- `main.jsx` traci `HelmetProvider`; `<React.StrictMode>` zostaje.
- `react-helmet-async` znika z `package.json`.
- Testy metadanych wracają na serwer deweloperski: `seo-metadata-invariants.spec.js` przestaje potrzebować własnego `baseURL` i bramki `PW_PREVIEW`. Sam serwer preview **zostaje** — po scaleniu PR #26 potrzebuje go bramka zgody na hoście produkcyjnym z `analytics-consent.spec.js`.
- Tolerancja na brakujący opis w `home.spec.js`, `blog.spec.js` i `policy-pages.spec.js` przestaje być potrzebna — asercje wracają do twardej postaci.
- `getSeoMetaTags` w `test-helpers.js` traci obejście oparte na `data-rh` (atrybut należał do Helmeta).
- `StructuredData.jsx` przestaje korzystać z Helmeta i renderuje `<script type="application/ld+json">` jako własny węzeł w drzewie Reacta. To wymuszone: PR #34 przepiął ten komponent na Helmeta dzień przed tą zmianą, więc bez migracji usunięcie zależności nie jest możliwe.
- Skrypty `build:test` i `preview:test` **zostają** — używa ich warunkowy serwer preview.

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
- `src/components/seo/StructuredData.jsx` — zdjęcie `<Helmet>`
- `src/utils/serializeJsonLd.js` — wydzielona ucieczka znaków dla JSON-LD (nowy plik)
- `package.json` — usunięcie zależności; naprawa skryptu `test:unit`
- `playwright.config.js` — komentarz o serwerze preview; sam serwer zostaje
- `scripts/verify-prerender-output.mjs` — bramka metadanych w wygenerowanym `dist/`
- `tests/e2e/seo-metadata-invariants.spec.js`, `home.spec.js`, `blog.spec.js`, `policy-pages.spec.js`, `tests/utils/test-helpers.js` — cofnięcie obejść

**Zmienione po drodze:** `StructuredData.jsx`. Propozycja zakładała, że komponent wstawia `application/ld+json` bezpośrednio do `document.head` i zostaje bez zmian. PR #34 (scalony 2026-09-06) przepiął go na Helmeta, żeby związać blok z trasą. Ponieważ ta zmiana usuwa Helmeta, blok wraca do drzewa Reacta — jako zwykły renderowany `<script>`. Związanie z trasą zostaje: odmontowanie komponentu zabiera węzeł ze sobą. React 19 nie hoistuje skryptów z treścią, więc element zostaje w `<body>`; dla JSON-LD jest to bez znaczenia.

**Ryzyko do potwierdzenia:** React 19 hoistuje, ale **nie** deduplikuje tagów po atrybucie `name`. Trzeba udowodnić, że przy zmianie trasy nie zostają tagi po poprzedniej stronie i że `scripts/prerender.mjs` (czeka na `og:title` i `description` przed zrzutem) nadal widzi komplet.

**Siatka bezpieczeństwa:** `tests/e2e/seo-metadata-invariants.spec.js` pilnuje czterech niezmienników metadanych i był czerwony na 11 z 12 przypadków przed poprzednią zmianą — wyłapie regresję wartości. Nowe wymaganie dotyczy parzystości dev/produkcja i braku duplikatów, więc potrzebuje własnych testów.

**Poza zakresem:** zmiana treści metadanych, `StructuredData.jsx`, przenoszenie `og:*` na inne API.
