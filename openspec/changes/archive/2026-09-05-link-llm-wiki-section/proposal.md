## Why

Audyt `claude-seo:seo-audit` z 28.07.2026 (pozycja C5) wykazał, że `/llm-wiki`, `/llm-wiki/kurs` i 8 lekcji — **10 adresów, w tym główny magnes na zapisy** — nie miały ani jednego linku wewnętrznego. Nie z nawigacji, nie ze stopki, nie ze strony głównej, nie z indeksu bloga. Jedyną drogą dojścia była sitemapa, czyli najsłabszy możliwy sygnał odkrycia.

Sprawdzenie pokazało dwie przyczyny, nie jedną:

1. Nawigacja i stopka nie miały pozycji dla kursu.
2. Link z `/llm-wiki` do `/llm-wiki/kurs` renderował się **wyłącznie po zapisie na listę** (gałąź `status === "success"`). Bramka niczego nie chroniła — `/llm-wiki/kurs` i każda lekcja zwracają 200 każdemu, kto zna adres — a ukrywała przed robotem 9 z 10 adresów.

Przy okazji: `/en/llm-wiki` zwracał **twarde 404**. Trasy `<Navigate>` w `App.jsx` są klienckie, więc przy zimnym wejściu nic ich nie wykonuje, a ta ścieżka nie jest prerenderowana. Przełącznik języka na 10 stronach kursu linkował dokładnie tam.

## What Changes

- `Navigation.jsx` — nowa pozycja `nav.llmWiki`. Sekcja istnieje tylko po polsku, więc pozycja **nie renderuje się na trasach EN** (`plOnly`), zamiast linkować poza język czytelnika albo w martwy adres.
- `Footer.jsx` — link w „Szybkie linki”, też tylko na trasach PL.
- `LlmWikiLanding.jsx` — drugie, odsłonięte wejście w kurs pod formularzem. Formularz zostaje głównym wezwaniem; ekran sukcesu zachowuje własny link.
- `resolveLanguageSwitchPath` — na trasach `/llm-wiki*` przełącznik prowadzi do `/en/` (strona istniejąca) zamiast do `/en/llm-wiki` (przekierowanie).
- `vercel.json` — 301 z `/en/llm-wiki` i `/en/llm-wiki/(.*)` na wersję PL. Rozstrzyga się na brzegu, więc działa przy zimnym wejściu, w odróżnieniu od tras klienckich. Zostaje jako siatka dla linków z zewnątrz.
- `pl/common.json` — etykieta `nav.llmWiki`.

## Impact

**Kod:** `src/components/layout/Navigation.jsx`, `Footer.jsx`, `src/pages/LlmWikiLanding.jsx`, `src/locales/pl/common.json`, `vercel.json`, `tests/e2e/llm-wiki-discoverable.spec.js` (nowy), `tests/e2e/llm-wiki-course.spec.js` (zaktualizowany).

**Zasięg:** 10 adresów przestaje być osieroconych; 56 stron PL linkuje teraz `/llm-wiki`.

**Zweryfikowane w prerenderowanym HTML:** 56 stron PL linkuje `/llm-wiki`; `/llm-wiki` linkuje `/llm-wiki/kurs`; hub linkuje wszystkie 8 lekcji; **0** stron linkuje `/en/llm-wiki`; nawigacja i stopka EN nie zawierają kursu. Prerendering 98/98. Pełny zestaw E2E: 171 przechodzi, 0 błędów.

**Świadomie zostawione:** dwa przetłumaczone wpisy (`en/blog/claude-code-weak-spots`, `en/blog/not-all-rag-is-equal`) linkują polski kurs z własnej treści. To decyzja redakcyjna w markdownie, nie logika nawigacji — nowy test celowo zawęża asercję do nawigacji i stopki, żeby nie nadpisywać jej po cichu.

**Zaktualizowane testy, nie obejścia:** `llm-wiki-course.spec.js` liczył linki do `/llm-wiki` w całym dokumencie, zakładając, że jedynym jest CTA w treści. Po dodaniu nawigacji i stopki asercje zawężono do `main`. Test `link do /llm-wiki/kurs pojawia się dopiero po zapisie` kodował samą bramkę — przepisany pod nową decyzję.

**Poza zakresem:** podział paczki 757 kB (C6) i `opacity: 0` w prerenderowanym hero (H1).
