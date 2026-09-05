# Tasks

## 1. Nawigacja i stopka

- [x] 1.1 Pozycja `nav.llmWiki` w `NAV_ITEMS` z flagą `plOnly`
- [x] 1.2 `visibleNavItems()` filtruje po języku; oba miejsca renderowania (desktop, mobile) używają listy przefiltrowanej
- [x] 1.3 Link w „Szybkie linki” w stopce, tylko na trasach PL
- [x] 1.4 Etykieta `nav.llmWiki` w `pl/common.json`

## 2. Odbramkowanie kursu

- [x] 2.1 Odsłonięty link do `/llm-wiki/kurs` pod formularzem zapisu
- [x] 2.2 Formularz zostaje głównym wezwaniem; ekran sukcesu zachowuje własny link

## 3. Martwy adres /en/llm-wiki

- [x] 3.1 Potwierdzone, że `/en/llm-wiki` zwraca 404 na żywo (trasy `<Navigate>` są klienckie)
- [x] 3.2 301 w `vercel.json` dla `/en/llm-wiki` i `/en/llm-wiki/(.*)`
- [x] 3.3 `resolveLanguageSwitchPath` prowadzi z `/llm-wiki*` do `/en/`, żeby nie linkować w przekierowanie

## 4. Testy

- [x] 4.1 `tests/e2e/llm-wiki-discoverable.spec.js` — napisany przed poprawką, potwierdzony jako czerwony
- [x] 4.2 Zaktualizowane asercje w `llm-wiki-course.spec.js` (zawężone do `main`)
- [x] 4.3 Przepisany test bramki pod nową decyzję produktową
- [x] 4.4 Pełny zestaw: 171 przechodzi, 0 błędów, 0 niestabilnych
- [x] 4.5 `npm run build:prerender` — 98/98

## 5. Do zrobienia po wdrożeniu

- [x] 5.1 Sprawdzić w Search Console, czy 10 adresów kursu zaczyna być odwiedzanych przez robota — **sprawdzone 2026-09-05 przez URL Inspection API: 0 z 10 odwiedzonych, wszystkie „URL is unknown to Google", żaden nigdy nie pobrany.** Linkowanie działa (kod na produkcji od 2026-07-30, `href="/llm-wiki"` obecny w nawigacji na żywo, `/en/llm-wiki` zwraca 301), więc to nie jest porażka tej zmiany. Przyczyna jest szersza: cała witryna ma 98 adresów zgłoszonych i 0 zaindeksowanych, a sama strona główna to „Crawled – currently not indexed". Pięć tygodni z linkiem w nawigacji i w sitemapie bez jednego pobrania to mocna przesłanka, że problemem nie jest odkrywanie, tylko ocena wartości domeny. Źródło danych: Search Console URL Inspection API dla właściwości `sc-domain:pawel.lipowczan.pl`, odpytana 2026-09-05; sitemap w tym samym dniu raportuje 98 adresów zgłoszonych i 0 zaindeksowanych
- [x] 5.2 Rozważyć sekcję kursu na stronie głównej — **rozważone i odrzucone**, zgodnie z zakresem tej zmiany. Zadanie brzmiało „rozważyć", nie „wdrożyć", a wariant był świadomie odłożony jako szerszy zakres. Jeśli ma powstać, należy mu się własna zmiana — tym bardziej że pozycjonowanie strony głównej jest przedmiotem osobnej decyzji z 2026-09-05 (dwie role równolegle: konsulting PLSoft i praca agentowa)
