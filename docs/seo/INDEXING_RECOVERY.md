# Indexing Recovery — kroki manualne

> **Kontekst:** 2026-05-09 Google Search Console (property `https://pawel.lipowczan.pl/` dodana 2026-04-17) raportował **0 zaindeksowanych stron** z dwóch przyczyn: "Strona zeskanowana, ale jeszcze nie zindeksowana" oraz "Nie znaleziono (404)". Diagnoza w trybie `/opsx:explore` dała 6-punktowy plan naprawczy.
>
> **Punkty 1 i 5 są poza tym dokumentem:**
> - Punkt 1 (301 redirecty dla legacy URL-i) → realizowany przez change `openspec/changes/seo-legacy-redirects/`.
> - Punkt 5 (soft-404 hardening) → **dezaktualizowany** — sprawdzono, że nieistniejące URL-e zwracają prawdziwe `HTTP 404`. Brak czego naprawiać.
>
> **Ten dokument opisuje punkty 2, 3, 4 i 6 — operacyjne, nie kod.**

---

## Spis treści

1. [Punkt 2 — Domain property w GSC (opcjonalne)](#punkt-2--domain-property-w-gsc-opcjonalne)
2. [Punkt 3 — Request indexing dla priorytetowych URL-i](#punkt-3--request-indexing-dla-priorytetowych-url-i)
3. [Punkt 4 — External link signals](#punkt-4--external-link-signals)
4. [Punkt 6 — Monitoring przez 4 tygodnie](#punkt-6--monitoring-przez-4-tygodnie)
5. [Co robić, jeśli po 4 tygodniach dalej 0 zaindeksowanych](#co-robić-jeśli-po-4-tygodniach-dalej-0-zaindeksowanych)

---

## Punkt 2 — Domain property w GSC (opcjonalne)

### Status: niski priorytet

Sprawdzono `curl -I https://lipowczan.pl/` — root domain nie odpowiada (brak DNS / brak strony). Domain property `lipowczan.pl` w GSC złapałby wszystkie subdomeny i protokoły (`http://`, `https://`, `www.`, `pawel.`, etc.), ale skoro pod root domeną nic nie ma, to dodatkowa property nie da nowych danych względem istniejącej `https://pawel.lipowczan.pl/`.

### Kiedy zrealizować

- Jeśli kiedykolwiek będziesz hostować coś pod `lipowczan.pl` (np. landing page, redirect na `pawel.lipowczan.pl`), wtedy dodaj.
- Inaczej — pomiń.

### Jak dodać (gdy będzie sens)

1. GSC → lewy górny dropdown z property → "Add property"
2. Wybierz **"Domain"** (nie "URL prefix")
3. Wpisz `lipowczan.pl` (bez protokołu, bez subdomeny, bez slasha)
4. Zweryfikuj przez DNS (TXT record u dostawcy DNS)
5. Czekaj 1–3 dni na pierwsze dane

---

## Punkt 3 — Request indexing dla priorytetowych URL-i

### Cel

Wymusić recrawl wybranych URL-i, żeby skrócić "discovery phase" o tygodnie. Limit GSC: ~10 requestów dziennie per property.

### Jak to zrobić — krok po kroku

1. Zaloguj się do [Google Search Console](https://search.google.com/search-console).
2. Wybierz property `https://pawel.lipowczan.pl/`.
3. Na górze ekranu znajdź pasek **"Sprawdź dowolny URL w pawel.lipowczan.pl"** (Inspect any URL).
4. Wklej pierwszy URL z listy poniżej → Enter.
5. Poczekaj na pełny wynik (~10–30 s). Powinieneś zobaczyć "Adres URL nie znajduje się w Google" lub "URL is on Google".
6. Niezależnie od wyniku, kliknij **"Poproś o zaindeksowanie"** (Request indexing).
7. Poczekaj ~1 min na walidację — GSC sprawdza, czy URL nie ma `noindex`, czy się ładuje, czy jest crawlowalny. Komunikat sukcesu: *"Adres URL został dodany do priorytetowej kolejki indeksowania"*.
8. Zamknij okno i powtórz dla kolejnego URL.

### Lista priorytetowych URL-i (kolejność wykonania)

#### Sesja 1 (dziś, 8 URL-i)

```
1.  https://pawel.lipowczan.pl/
2.  https://pawel.lipowczan.pl/blog
3.  https://pawel.lipowczan.pl/en/
4.  https://pawel.lipowczan.pl/en/blog
5.  https://pawel.lipowczan.pl/blog/pit-38-claude-code-case-study
6.  https://pawel.lipowczan.pl/blog/spec-driven-seo-portfolio-qamera-ai
7.  https://pawel.lipowczan.pl/blog/skills-2-0-multi-agent-system-zarzadzanie-firma
8.  https://pawel.lipowczan.pl/blog/opsx-workflow-strukturyzowana-praca-z-ai
```

#### Sesja 2 (jutro lub pojutrze, kolejne ~8)

```
9.  https://pawel.lipowczan.pl/blog/system-agentow-ai-skills-rules-kontekst
10. https://pawel.lipowczan.pl/blog/srodowisko-agentowe-ai-dwie-firmy
11. https://pawel.lipowczan.pl/blog/trendy-ai-2026-od-eksperymentow-do-operacjonalizacji
12. https://pawel.lipowczan.pl/blog/vibe-coding-przewodnik
13. https://pawel.lipowczan.pl/en/blog/polish-pit-38-claude-code-case-study
14. https://pawel.lipowczan.pl/en/blog/spec-driven-seo-portfolio-qamera-ai-case-study
15. https://pawel.lipowczan.pl/en/blog/skills-2-0-multi-agent-system-company-management
16. https://pawel.lipowczan.pl/en/blog/opsx-workflow-structured-ai-work
```

> **Uwaga:** lista to top blog posts — case studies i flagowe artykuły, które chcesz, żeby ludzie znaleźli przez Google. Jeśli wolisz inne, podstaw — zasada jest: priorytetyzuj treści unikalne, z konkretnym keyword-em długoogonowym.

### Czego NIE wpisuj jako URL do indeksacji

- ❌ `/about`, `/projects`, `/contact` — to są **sekcje na home**, nie osobne strony (zwracają `404`).
- ❌ `/sitemap.xml`, `/robots.txt` — te się indeksują same.
- ❌ Stare URL-e z 404 (po deployu changeu `seo-legacy-redirects` te URL-e zwrócą `301`; Google sam przeprocesuje przekierowanie przy najbliższym crawlu).

---

## Punkt 4 — External link signals

### Cel

Dać Google sygnał, że ktoś poza Twoją domeną wskazuje na te URL-e. Property ma 3 tygodnie i prawdopodobnie zerowy zewnętrzny graf linków pod tą subdomeną. Nie potrzeba dużo — wystarczy 3–5 prawdziwych linków w pierwszych tygodniach.

### Konkretne ruchy (kolejność: najszybsze najpierw)

#### 4.1 LinkedIn — pole Website na profilu (5 min)

1. Wejdź na [linkedin.com/in/pawellipowczan](https://linkedin.com/in/pawellipowczan).
2. **"Edit profile"** → sekcja **"Contact info"** (lub "Edit intro").
3. Pole **"Website"** → wpisz `https://pawel.lipowczan.pl` z etykietą np. "Portfolio" lub "Personal".
4. Save.

#### 4.2 GitHub profile README (10 min)

Pełen content i instrukcja w **[`docs/seo/github-profile-readme-template.md`](./github-profile-readme-template.md)** (3 warianty: PL, EN, hybrydowy — rekomendowany EN-first solo).

Skrót:
1. Utwórz repo `plipowczan/plipowczan` (Public, dokładnie taka nazwa = Twój username).
2. Wklej treść z templatu do `README.md`.
3. Commit & push.
4. Sprawdź `https://github.com/plipowczan` — README pojawia się na profilu.

#### 4.3 GitHub — pole "Website" w każdym public repo (5 min)

Dla każdego public repo na Twoim koncie:
1. Repo → ⚙️ ikonka koło tytułu repo (Settings dla repo) → **NIE settings, tylko ikona "About"** → Edit.
2. Pole **"Website"** → wpisz `https://pawel.lipowczan.pl`.
3. Save.

To daje "weak" linki z każdego repo do Twojej domeny. Dziesięć repo = dziesięć słabych sygnałów = wciąż niezerowo.

#### 4.4 LinkedIn post o jednym z artykułów (10 min)

1. Wybierz **jeden** post blogowy, który najlepiej pasuje do tego, co publikujesz na LinkedInie (np. case study PIT-38, OpsX workflow, lub Skills 2.0).
2. Napisz krótki post na LinkedInie (2–4 akapity), kończący linkiem do pełnego artykułu na blogu.
3. Linki na LinkedIn są `nofollow`, ale dają **crawl signal** (Googlebot widzi link i często go followuje pomimo nofollow w celu odkrywania) i przede wszystkim **organic traffic** — który sam w sobie jest sygnałem rankingowym.

#### 4.5 Mastodon / X / Bluesky

Pełen content per platforma (bio, hashtagi, pinned post, strategia) w osobnych plikach:

- **[`docs/seo/social-profile-mastodon.md`](./social-profile-mastodon.md)** — bio 500zn + 4 metadata pola + verification trick (rel="me")
- **[`docs/seo/social-profile-x.md`](./social-profile-x.md)** — bio 160zn + pinned tweet + workaround na link-downranking
- **[`docs/seo/social-profile-bluesky.md`](./social-profile-bluesky.md)** — bio 256zn + starter packs + opcjonalny custom domain handle (`@pawel.lipowczan.pl`)

Każdy plik ma gotowe teksty PL i EN, hashtagi dopasowane do branży i instrukcje krok-po-kroku.

#### 4.6 (Opcjonalnie) Komentarz pod artykułem branżowym

Jeśli czytujesz jakieś polskie blogi / fora o AI / no-code / automatyzacji i widzisz artykuł, do którego masz **realnie wartościowy** komentarz powiązany z jednym z Twoich postów — zostaw komentarz z linkiem. Tylko jeśli wnosi wartość; spam jest gorszy niż brak linku.

### Czego NIE rób

- ❌ Nie kupuj backlinków (PBN, fivverr, blog comments paid). Google to wykrywa i zalicza karę.
- ❌ Nie spamuj komentarzy z linkami pod losowymi artykułami.
- ❌ Nie dodawaj linków do katalogów stron typu "katalog SEO Polska" — to dawno martwa technika i ryzyko spam-flag.

---

## Punkt 6 — Monitoring przez 4 tygodnie

### Cel

Mierzyć, czy redirecty i request indexing działają. Jeśli po 4 tygodniach dalej 0 zaindeksowanych, wracamy do explore i kopiemy głębiej.

### Co tygodniowo zapisuj

Co 7 dni o tej samej porze (np. niedziela rano) wejdź w GSC → **Pages** i zapisz 4 liczby do tabelki poniżej.

| Tydzień | Data | Indexed | Crawled – not indexed | Discovered – not indexed | Not found (404) |
|---------|------|---------|-----------------------|--------------------------|-----------------|
| T+0 | 2026-05-10 | 0 | 25 | 0 | 6 |
| T+1 | 2026-05-17 | | | | |
| T+2 | 2026-05-24 | | | | |
| T+3 | 2026-05-31 | | | | |
| T+4 | 2026-06-07 | | | | |

> **T+0 baseline notes (2026-05-10):**
> - Niezindeksowane łącznie: 31 (= 25 Crawled + 6 Not found, brak kategorii Discovered).
> - Sitemap zawiera 73 URL-e → ~42 URL-i wciąż poza GSC processing queue.
> - Stan zaraz po deployu: 301 redirects (active), bio update z worksFor Qamera AI (active), Mastodon rel="me" verification (active), 8 URL-i zgłoszonych do Request Indexing w sesji 1.
> - **Hipoteza na T+1:** 6 (404) → 0-2 (po przeprocesowaniu redirectów Google przeklasyfikuje URL-e jako "Page with redirect"); 25 (Crawled-not-indexed) → 18-23 (kilka URL-i z requested indexing przejdzie do Indexed); 0 (Indexed) → 3-8.

### Co powinno się dziać (zdrowy trend)

```
Indexed:                   ↑↑  rośnie (cel: ≥10 do T+4)
Crawled – not indexed:     ↓   spada (URL-e przechodzą do Indexed)
Discovered – not indexed:  ~   fluktuuje, normalne
Not found (404):           ↓↓  spada do 0 (po deployu redirectów)
```

### Czerwone flagi (wracamy do `/opsx:explore`)

- Po **T+4** dalej `Indexed: 0`.
- Pojawia się nowa kategoria "Page with redirect" w dużej liczbie (>20) — może oznaczać problem z konfiguracją redirectów (zbyt agresywny wildcard).
- Pojawia się "Duplicate without user-selected canonical" w dużej liczbie — problem z hreflangami / canonical (mało prawdopodobne, sprawdzone OK).
- "Not found (404)" rośnie zamiast maleć (Google odkrywa kolejne legacy URL-e szybciej, niż my dodajemy redirecty).
- "Soft 404" pojawia się jako kategoria — coś rendereuje pustą treść / "Not found" page z `200`.

### Pozostałe zakładki GSC do zerknięcia raz na tydzień

- **Performance** → Total clicks / impressions. Jeśli impressions ≠ 0, znaczy, że Twoje URL-e zaczynają pojawiać się w SERP — nawet bez kliknięć to dobry sygnał.
- **Sitemaps** → status "Success" + liczba "Discovered URLs" rośnie do ~73 (lub aktualna liczba postów).
- **Manual actions** → puste (zawsze).
- **Security issues** → puste (zawsze).

---

## Co robić, jeśli po 4 tygodniach dalej 0 zaindeksowanych

Wróć do `/opsx:explore` z tabelką T+0…T+4 wypełnioną i sprawdzonymi:

1. **URL Inspection** dla `/` na produkcji — co dokładnie pokazuje GSC w sekcji "Coverage" / "Live test"?
2. **Lista konkretnych URL-i** w "Crawled – not indexed" — pełna lub top 20.
3. **Czy zmieniła się jakaś kategoria** (np. "Discovered" → "Crawled", co byłoby dobrym znakiem że coś idzie do przodu).
4. **Backlink inventory** — `site:pawel.lipowczan.pl` w Google + `link:pawel.lipowczan.pl` w paru darmowych narzędziach (Ahrefs Backlink Checker free tier, Ubersuggest, Moz Link Explorer free).

Wtedy diagnozujemy głębiej. Możliwe kierunki: thin content audit, Core Web Vitals (jest pending change `pending_perf_bundle_optimization` w pamięci agenta), E-E-A-T signals, struktura linków wewnętrznych, autorzy w schema.

---

## Powiązane dokumenty

- `openspec/changes/seo-legacy-redirects/` — kod (301 redirecty)
- `docs/seo/SEO_VERIFICATION.md` — istniejący checklist SEO
- `docs/seo/PRERENDERING.md` — jak działa prerender
- `public/robots.txt`, `public/sitemap.xml` — pliki, które GSC parsuje
