# Blog Article Validation Report: Skille Claude Code: kompetencję się instaluje, nie nabywa

## Article Details

- **File**: `src/content/blog/skille-ktore-mam-podlaczone.md`
- **Blog ID**: 33 (poprzednie maksimum 32, PL i EN)
- **Slug**: `skille-ktore-mam-podlaczone` (wiążący ze wsadu)
- **Date**: 2026-10-12
- **Read Time**: 13 min (frontmatter). Plan szacował 15 min, ale tekst wyszedł krótszy.
- **Word Count**: 2458 słów treści (2526 z frontmatterem), czyli ok. 12,3 min przy 200 słów/min
- **Plan / prime**: `.claude/agents/plans/blog-skille-ktore-mam-podlaczone.md`, `.claude/agents/context/blog-prime-skille-ktore-mam-podlaczone.md`

## Validation Results

### ✅ PASSED

**Level 1-2: struktura, frontmatter, treść**
- Plik istnieje, frontmatter parsuje się (`gray-matter`), komplet 10 pól.
- `id` 33 unikalne wśród artykułów PL; `slug` unikalny, małe litery z myślnikami, równy nazwie pliku.
- `title` 57 znaków, `excerpt` 159 znaków, `category` AI, `author` zgodny, `date` poprawna, `image` w formacie `/images/og-{slug}.webp`, 5 tagów.
- `lang: pl`; `alternateSlug: claude-code-skills-i-have-connected` ustawiony po `translate` (symetria z plikiem EN potwierdzona).
- Bloki kodu: 2 bloki, oba z tagiem `text`; ogrodzenia zrównoważone.
- Struktura: bez H1 w treści, 11 sekcji H2, brak H3 poza FAQ (6 H3 w `<summary>`), 21 pogrubionych pojęć.
- Akapity: po poprawce maksimum **4 zdania** w akapicie (pierwszy przebieg wykrył 7 akapitów po 5-6 zdań, rozbite).
- Brama znaków: brak U+2014, U+2013, U+2026. Brama słownikowa z `.claude/rules/content/10-prosty-polski.md`: wynik pusty (uruchomiona w Node, bo `grep -P` w tej powłoce nie przyjmuje escape'ów Unicode; test kontrolny potwierdził, że wyrażenie wykrywa złe słowa).
- Brak słów „proza/prozy", `ingest`, nazw prywatnych skilli, ścieżek prywatnych, numerów wersji.
- **CTA**: dokładnie 1 przycisk `btn-primary inline-block`, kanoniczny wrapper, link `/#contact`, tekst „Umów bezpłatną konsultację", brak wzorców przestarzałych. Kolejność: Kluczowe wnioski (151) → CTA (159) → Przydatne zasoby (169) → FAQ (181).

**Level 3: SEO**
- Tytuł zawiera słowo główne „Skille Claude Code"; slug 4-wyrazowy; H2 z naturalnymi słowami kluczowymi.
- Dev server: JSON-LD `BlogPosting`, `BreadcrumbList`, `FAQPage (6 Q)`; kanoniczny adres i `og:image` ustawione poprawnie.

**Level 4: dokładność techniczna**
- 6 linków wewnętrznych (`/blog/...`) wskazuje istniejące pliki.
- 10 linków zewnętrznych zwraca HTTP 200 (`agentskills.io`, repozytoria GitHub, `impeccable.style`, dokumentacja wtyczek Claude Code).
- Fakty sprawdzone na źródłach pierwotnych 2026-10-12: stan repozytorium `shared-skills` (`16359dc`), 29 wtyczek z 8 katalogów, specyfikacja Agent Skills, katalogi skilli Claude Code / Codex / Cursor, autorzy z manifestów (**korekta wsadu: `superpowers` to Jesse Vincent, nie Anthropic**).

**Level 5: renderowanie**
- Strona `/blog/skille-ktore-mam-podlaczone` ładuje się bez błędów treści; obie tabele (19×2 i 10×3), 2 bloki kodu jako bloki, 6 akordeonów FAQ, CTA, spis treści.
- Mobile 375 px: brak poziomego przewijania strony; szersza tabela (druga) przewija się w obrębie własnego kontenera.

### ⚠️ WARNINGS

1. **Ocena SEO (decyzja D1): rozstrzygnięta 2026-10-12.** Autor wskazał domenę `pawel.lipowczan.pl` i wybrał wariant ze zdaniem o domenie. Do sekcji o planowaniu weszły dwa zdania: wynik `claude-seo` sprawdzany na własnej domenie, efekt widoczny dopiero po publikacji, więc bez wyników w tekście. To moja interpretacja jego odpowiedzi; do poprawienia, jeśli metoda jest inna (zmiana w PL i EN). Adres artykułu na produkcji zwraca dziś 404, więc audyt tej strony na żywo jest możliwy dopiero po wdrożeniu.
2. **Licencja.** README i oba manifesty wtyczki deklarują Apache-2.0, ale plik `LICENSE` w `shared-skills` ma 15 linii (nota, nie pełny tekst), a GitHub wykrywa „Other". Artykuł pisze „deklaruje licencję Apache-2.0". Po poprawieniu pliku w repozytorium można zmienić na „jest na licencji". **Sprawdzone ponownie 2026-10-12** po zleceniu poprawki przez autora: `origin/master` nadal `16359dc`, `LICENSE` ma 15 linii, GitHub pokazuje „Other", brak otwartego PR i gałęzi ze zmianą pliku. Do ponownej weryfikacji po scaleniu; zmiana obejmie akapit o licencji i FAQ 3 w PL oraz EN.
3. **Numery wersji celowo pominięte** (reguła Level 4 „version numbers where relevant"): wersje we wsadzie były nieaktualne (`impeccable` 4.1.0 vs 4.5.2 w npm, `hyperframes` 0.8.34 vs 0.8.149) i zestarzałyby się przed publikacją.
4. **Dwa źródła wtórne ze wsadu §2.6 nieużyte.** The New Stack zwrócił stronę bez treści, aibusiness.com odpowiedział 403. Teza o otwartym standardzie stoi na `agentskills.io`.
5. **Fakty ze wsadu bez niezależnej weryfikacji:** cytaty autora z 2026-09-11 (CRM, trzy skille, wybór klienta, `hyperframes`) i opis wierszy tabeli 1 (kopiowane ze wsadu, spot-check względem README repozytorium).
6. **Obraz OG po generowaniu nie został ponownie obejrzany w przeglądarce** (serwer zatrzymany przed krokiem zmiany rozmiaru). Plik istnieje, ma 1200x630 i przechodzi `npm run og:check`; pojedynczy błąd konsoli z przebiegu Level 5 (brak obrazu) dotyczył stanu sprzed generowania.
7. **Zmiany w katalogu roboczym spoza tej pracy:** zmodyfikowany `.gitignore` (wpis `/graft/`) i nowy `.ignore` pochodzą z narzędzia graft, nie z artykułu. Nie wchodzą do commita artykułu.
8. `npm run og:check` zgłasza 20 obrazów o złych wymiarach. To zaległość sprzed tej pracy (potok 1424x752), nie dotyczy tego artykułu.

### ❌ FAILURES

Brak krytycznych.

## Post-Article Tasks Completed

- [x] Prompt OG: `.claude/agents/prompts/og-skille-ktore-mam-podlaczone-prompt.txt` (kategoria AI, tokeny `#00ff9d`, `#00b8ff`, `#0a0e1a`, `#151b2b`)
- [x] Obraz wygenerowany (Gemini, `gemini-3-pro-image-preview`): abstrakcyjny, bez czytelnego tekstu
- [x] Potok trzykrokowy: `.jpeg` 1424x752 → WebP (588 KB → 63 KB) → zmiana rozmiaru do **1200x630**, wynik 59 KB. Krok zmiany rozmiaru zakończył się `EPERM` przy podmianie pliku, mimo zatrzymanego serwera; poprawny plik został jako `.webp.tmp` (potwierdzone 1200x630) i podmieniony `mv -f`. Plik pośredni `.jpeg` usunięty.
- [x] `public/images/og-skille-ktore-mam-podlaczone.webp` przechodzi `npm run og:check`
- [x] Sitemap zaktualizowana (`npm run blog:sitemap`): nowy wpis z `hreflang` pl i x-default; zmieniły się też `lastmod` czterech stron zbiorczych (strona główna i indeks bloga, PL i EN), co jest oczekiwane
- [x] Test renderowania w dev serwerze (serwer zatrzymany po teście)

## Przejście DOX

Sam artykuł nie zmienia kontraktu żadnego folderu. Zmiana DOX wynika z rozstrzygnięcia konfliktu wykrytego przy walidacji:

- `src/content/blog/AGENTS.md`, reguła `alternateSlug` pkt 2: z „każdy wpis jest domyślnie PL-only, tłumaczenie to osobny krok" na „każdy artykuł to para PL+EN; `translate` zamyka przebieg w tym samym podejściu co `validate`". Powód: 31 z 31 wcześniejszych artykułów PL ma bliźniaka EN, a „PL-only" wzięło się z poprawki błędu asymetrycznego `alternateSlug`, nie z decyzji, że para jest opcjonalna.
- `.claude/skills/blog-article-writer/subcommands/execute.md` i `validate.md`: usunięto powtórzenia starej reguły (`PL-only domyślnie`, „najczęstszy przypadek w tym projekcie"), zastąpiono odesłaniem do `AGENTS.md`, żeby reguła żyła w jednym miejscu.
- Indeks Child DOX bez zmian (nie dodano ani nie usunięto dokumentu).
- Zauważone, nienaprawione: `execute.md` nazywa błędem każdy `alternateSlug` równy własnemu slugowi, a `AGENTS.md` dopuszcza to, gdy plik EN o tej samej nazwie istnieje. Poza zakresem tej zmiany.

## Overall Status

✅ **VALIDATION PASSED** (PL i EN). Otwarte przed publikacją: poprawka pliku `LICENSE` w `shared-skills` (zlecona przez autora, jeszcze nie scalona), uporządkowanie README tamtego repozytorium (dwie atrapy `marketing`, `product-manager`), redakcja prywatnych ścieżek we wsadzie przed `archive`.

## EN Translation

- **EN file:** `src/content/blog/en/claude-code-skills-i-have-connected.md`
- **EN slug / title:** `claude-code-skills-i-have-connected` (6 słów, potwierdzony przez autora) / „Claude Code Skills: Competence Is Installed, Not Acquired" (57 znaków)
- **Bidirectional alternateSlug:** ✅ oba pliki wskazują na siebie; `id` 33 w obu
- **Sitemap:** 32 PL + 32 EN, łącznie 102 URL (+1 względem stanu przed tłumaczeniem); wpisy PL i EN mają wzajemne `hreflang` pl, en, x-default
- **Internal links mapped:** 6/6 przemapowane na odpowiedniki EN (`/en/blog/...`), wszystkie pliki istnieją, brak pozostałych linków `/blog/` w EN
- **CTA:** wzorzec kanoniczny, „Book a free consultation", link `/#contact`; sekcje `Key takeaways`, CTA, `Useful Resources`, `FAQ` w tej kolejności
- **Parytet z PL:** liczby (29, 19, 10, 8, 100), obie komendy instalacji, domena i data odczytu obecne w obu wersjach; 31 wierszy tabel w obu
- **Odstępstwo od reguły szablonu:** drzewo katalogów wtyczki (blok `text`) przetłumaczone, bo to ilustracja, nie kod; poprzedni artykuł EN (`measured-not-assumed`) zrobił tak samo. Dwie komendy ukośnikowe w drugim bloku bez zmian.
- **Dodatki objaśniające w EN:** PIT, ZUS, IP Box, NDA, PRD, a przy trzech komendach adnotacja „(in Polish)" (README repozytorium potwierdza, że `decisions`, `explain-diff`, `explain-design` odpowiadają po polsku)
- **EN validation:** ✅ PASSED (frontmatter, brak U+2014/2013/2026, bloki z tagami, max 4 zdania w akapicie, 6 akordeonów FAQ)
- **Testy Playwright** (chromium i Mobile Chrome): `blog`, `language-switcher-blog`, `breadcrumbs`, `seo-metadata-invariants`: **64 passed**. Ostrzeżenie `hrefLang` w logu pochodzi z istniejącego kodu serwisu, nie z artykułu.

## Next Step

1. Przejrzeć oba artykuły w przeglądarce: `http://localhost:3108/blog/skille-ktore-mam-podlaczone` i `http://localhost:3108/en/blog/claude-code-skills-i-have-connected` (port wyliczany z położenia katalogu).
2. Commit na gałęzi roboczej, nie na `main` (`blog/skille-ktore-mam-podlaczone`): oba pliki artykułu, obraz OG, sitemap, prompt, plan, prime, raport oraz zmiany DOX (`src/content/blog/AGENTS.md`, dwa pliki podpoleceń skilla). Bez `.gitignore` i `.ignore` od graft. Komunikat: `feat(blog): add post 33 (PL+EN) - skills I have connected`.
3. Kolejność publikacji ze wsadu: artykuł wychodzi **przed** materiałami na pozostałych kanałach.
4. Po wdrożeniu: audyt strony na żywo (`/seo page` na adresie artykułu) i ponowne sprawdzenie licencji w `shared-skills`.
