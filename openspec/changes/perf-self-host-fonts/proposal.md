## Why

Audyt `claude-seo:seo-audit` z 28.07.2026 wskazał fonty ładowane przez `@import` w spakowanym CSS, bez `preconnect`. Łańcuch jest szeregowy i przechodzi przez dwie obce domeny:

```
HTML → CSS aplikacji → DNS+TLS do fonts.googleapis.com → CSS Google
     → DNS+TLS do fonts.gstatic.com → pliki .woff2
```

Przeglądarka dowiaduje się o domenie Google dopiero po pobraniu i sparsowaniu naszego CSS, więc dwa zimne połączenia HTTPS ustawiają się na samym końcu. Lighthouse na produkcji wycenił tę pozycję na ~1920–1950 ms.

Pierwsze podejście — `preconnect` plus jeden `<link rel="stylesheet">` — zostało napisane i **odrzucone** (zmiana `perf-blog-lazy-images-font-preconnect`, sekcja o fontach). Lokalnie pogarszało LCP, a lokalny `preview` nie umie uczciwie ocenić `preconnect`: oddaje pliki aplikacji bez opóźnienia sieci, więc okno, które `preconnect` miałby zrównoleglić, ma szerokość bliską zeru. Zostawał sam koszt.

Samodzielne hostowanie usuwa problem u źródła, zamiast go przyspieszać. Obca domena znika, więc nie ma czego rozgrzewać — i, co równie ważne, **zmianę da się zmierzyć lokalnie**: stan wyjściowy ma prawdziwe żądanie na zewnątrz, stan docelowy nie ma żadnego.

## What Changes

- `scripts/fetch-fonts.mjs` (nowy, `npm run fonts:fetch`) pobiera pliki i generuje `src/styles/fonts.css`. Pliki są zapisane w repozytorium; skrypt uruchamiamy tylko przy aktualizacji fontu.
- `public/fonts/` — cztery pliki `.woff2` plus obie licencje i `README.md`.
- `src/styles/index.css` — dwa `@import` do Google zastąpione lokalnym `@import "./fonts.css"`, który build wkleja w miejsce (bez żądania sieciowego).
- `index.html` — `preload` pliku `inter-latin.woff2` z `crossorigin`.
- `vercel.json` — z CSP znikają `https://fonts.googleapis.com` (`style-src`) i `https://fonts.gstatic.com` (`font-src`). Wpisy są martwe po tej zmianie, a węższa zasada to węższa zasada.
- `tests/e2e/perf-self-hosted-fonts.spec.js` (nowy) — 7 testów. Najważniejszy jest przeczący: zero żądań do domen Google na czterech typach stron. Zabłąkany `@import` albo dodany z powrotem `<link>` cofnąłby całą zmianę, a na ekranie nic by się nie zmieniło.

### Wybrane warianty i subsets

Wersje zmienne (jeden plik pokrywa cały zakres wag) zamiast osobnego pliku na wagę:

| Plik | Rodzina | Zakres | Subset | Rozmiar |
| --- | --- | --- | --- | --- |
| `inter-latin.woff2` | Inter | 300–700 | latin | 47,1 kB |
| `inter-latin-ext.woff2` | Inter | 300–700 | latin-ext | 83,1 kB |
| `fira-code-latin.woff2` | Fira Code | 400–600 | latin | 35,4 kB |
| `fira-code-latin-ext.woff2` | Fira Code | 400–600 | latin-ext | 13,0 kB |

Zakres 300–700 pokrywa wszystkie wagi realnie używane w kodzie: `font-light` (300), tekst podstawowy (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700). Stary `@import` ciągnął 300–900 — 800 i 900 nie są używane nigdzie.

`latin-ext` nie jest opcjonalny: niesie ą ć ę ł ń ó ś ź ż. Bez niego większość polskiego tekstu po cichu spadłaby na font systemowy, przy poprawnie wyglądającym ASCII. Osobny test to sprawdza (`document.fonts.check`).

Obie rodziny są na licencji SIL OFL 1.1, która pozwala na redystrybucję. Licencje leżą obok plików.

## Impact

**Kod:** `scripts/fetch-fonts.mjs`, `src/styles/fonts.css`, `public/fonts/*` (nowe); `index.html`, `src/styles/index.css`, `vercel.json`, `package.json` (zmienione); `tests/e2e/perf-self-hosted-fonts.spec.js` (nowy).

**Zasięg:** wszystkie 98 adresów.

**Zweryfikowane po zbudowaniu:** 0/98 stron odwołuje się do domen Google, 0 odwołań w zbudowanym CSS, 4 pliki fontów skopiowane do `dist/fonts/`, `preload` na 98/98 stron. Prerendering 98/98. Pełny zestaw E2E: 157 przechodzi, 0 błędów.

**Pomiar (Lighthouse mobile, lokalny `preview`, po 3 przebiegi, `/blog`, ta sama podstawa 893cd3d):**

| Metryka | Fonty Google | Własny hosting | Zmiana |
| --- | --- | --- | --- |
| FCP | 6,79 s | **5,61 s** | **−1,18 s** |
| TBT | 668 ms | **219 ms** | **−67%** |
| Wynik | 44,3 | 57,7 | +13,4 |
| LCP | 7,24 s | 7,64 s | +0,40 s |

FCP i TBT to czysty zysk i dokładnie to, co miało się poprawić — pierwsze malowanie nie czeka już na obcą domenę.

LCP rośnie o 0,40 s i nie mamy na to twardego wyjaśnienia. Najbardziej prawdopodobne: przy fontach Google tekst zdążył się namalować zastępczym krojem i to ten moment zapisywał się jako LCP, bo właściwy font przychodził za późno, żeby cokolwiek zmienić. Przy własnym hostingu font wchodzi w oknie pomiaru i późniejsze, poprawnie złożone malowanie zostaje nowym wpisem LCP. To lepsze doświadczenie zapisane jako gorsza liczba — ale **jest to hipoteza, nie pomiar**. Warto potwierdzić na produkcji.

Sprawdzone osobno: `preload` nie jest przyczyną tej różnicy. Po jego usunięciu FCP zostaje na 5,6 s, LCP staje się niestabilny (6,61–7,56 s), a TBT rośnie z 219 ms do 695–829 ms. `preload` zostaje.

W tle i tak wszystkie warianty stoją na LCP rzędu 7 s, bo trzyma je jedna paczka JavaScriptu 757 kB bez podziału na trasy (C6) i hero z `opacity: 0` w prerenderowanym HTML (H1). Ta zmiana ich nie dotyka.

**Efekt uboczny, nie główny cel:** żaden odwiedzający nie wysyła już adresu IP do Google przy samym wejściu na stronę.

**Poza zakresem:** podział paczki na trasy (C6), `opacity: 0` w prerenderowanym hero (H1), wymuszenie CSP zamiast trybu raportowania (H5).
