# Prime: Skille, które mam podłączone

> **Faza:** PRIME (research) ukończona 2026-10-12.
> **Następny krok:** `/blog-article-writer:plan "Kompetencję się instaluje, nie nabywa"` (tytuł roboczy z wsadu; slug jest wiążący, tytuł nie).
> **Rola artykułu:** węzeł, do którego kierują materiały na pozostałych kanałach. Musi wyjść
> **przed** nimi (wymóg ze wsadu, nie preferencja) i musi unieść **całą** listę, bo kanały
> biorą z niej podzbiory. Adres PL: `https://pawel.lipowczan.pl/blog/skille-ktore-mam-podlaczone`.

## Źródła przeanalizowane

| Źródło | Rola |
|--------|------|
| `docs/blog/wsad-skille-ktore-mam-podlaczone.md` (jedyny plik w `docs/blog/` poza `.gitkeep`; nieśledzony w git) | **Główny wsad.** Teza w dwóch połowach, materiał dowodowy 2.1-2.8, struktura w 10 krokach, dwie tabele do wypisania w całości, lista tego, czego artykuł nie obiecuje |
| Publiczne repozytorium `200iqlabs/shared-skills`, `origin/master` | Zweryfikowane od nowa 2026-10-12 (po `git fetch`): nadal commit `16359dc`; README, LICENSE, `plugin.json`, `marketplace.json`, katalogi `skills/` i `commands/` |
| Lista zainstalowanych wtyczek na koncie autora | Przeliczona od nowa 2026-10-12 |
| `agentskills.io` (strona główna) | Źródło pierwotne dla tezy „otwarty standard" |
| Dokumentacja wtyczek Claude Code (`code.claude.com/docs/en/plugins`) | Definicja wtyczki, układ katalogu, koszt kontekstu, bezpieczeństwo |
| Rejestr npm | Aktualne wersje `impeccable`, `hyperframes`, OpenSpec |
| Istniejące artykuły: `zmierzone-nie-zalozone` (id 32), `slabe-strony-claude-code` (id 31), nagłówki i fragmenty `skills-2-0-...` (21), `srodowisko-agentowe-...` (22) | Styl, struktura końcówki, zakres nakładania się tematów |
| `.claude/skills/portfolio-copywriting/*`, `.claude/rules/content/10-prosty-polski.md`, `src/content/blog/AGENTS.md` | Reguły stylu, frontmatter, FAQ, brama słownikowa |

Context7 nie jest dostępny w tej sesji (wyszukiwanie narzędzi go nie znalazło), więc fakty
techniczne sprawdziłem na źródłach pierwotnych: repozytorium, `agentskills.io`, dokumentacja
Claude Code, npm.

## Teza i kąt

**Teza (wsad §1):** kompetencja przestała być czymś, co się zdobywa latami praktyki, a stała się
czymś, co się podłącza. Skill dodany agentowi jest kompetencją dodaną autorowi, i to zmienia
planowanie rozwoju: pierwsze pytanie brzmi „co podłączyć i co dalej muszę umieć ocenić", nie
„czego się nauczyć w tym kwartale".

- **Połowa 1 (o narzędziu):** podstawa to stan podłączenia + cztery pozycje robiące to, czego autor nie umie (projektowanie interfejsu ×3, SEO ×1).
- **Połowa 2 (o pracy autora):** podstawa jedna i konkretna, CRM dla branży nieruchomości, którego wcześniej by nie wziął. Umiejętność **nie przestała się liczyć**, przesunęła się z wykonania na ocenę wyniku. Wsad zabrania tezy mocniejszej.

**Co odróżnia ten tekst od reszty bloga:**

- Pierwszy artykuł, w którym skille są **pojęciem planowania rozwoju**, a nie opisem systemu (`system-agentow-ai-skills-rules-kontekst`) ani przeglądem narzędzi (`slabe-strony-claude-code`).
- **Pełna, sprawdzalna lista** (19 + 10 pozycji) z instalacją w dwóch komendach i uczciwym kosztem wejścia (plan ChatGPT dla Codexa).
- Wszystko jest w pierwszej osobie i ma datę odczytu. Ten sam nawyk co w `zmierzone-nie-zalozone`: liczba bez podstawy wygląda tak samo jak zmierzona.

## Profil odbiorcy

- Główny: programiści, freelancerzy i konsultanci pracujący z Claude Code (lub innym agentem), którzy planują własny rozwój i zastanawiają się, które zlecenia mogą wziąć.
- Poboczny: właściciele małych firm szukający gotowych skilli (CFO, podatki, prawo, procesy). Dla nich ważne są lista i instalacja, nie teza.
- Znają agenta i terminal. Nie muszą znać pojęć: wtyczka, katalog wtyczek, skill, manifest, licencja Apache-2.0, OpenSpec, Codex. Każde dostaje definicję przy pierwszym użyciu.

## Materiał dopuszczony (z weryfikacją 2026-10-12)

| Fakt | Stan weryfikacji |
|------|------------------|
| 29 wtyczek z 8 katalogów podłączonych globalnie | **Potwierdzone dziś** (29 / 8). Katalogi: oficjalny Anthropic (22 wtyczki), `obsidian-skills`, `ui-ux-pro-max-skill`, `openai-codex`, `anthropic-agent-skills`, `agricidaniel-seo`, `sentry-mcp`, `shared-skills` |
| Repozytorium publiczne, 22 katalogi w `skills/` = **20 gotowych + 2 atrapy** (`marketing`, `product-manager`: opis „TODO", README „Planned"), `commands/` = 4 pliki + podkatalog `slides/` (7 komend należących do `/ss:slides`) | **Potwierdzone dziś** na `16359dc` |
| Instalacja: `/plugin marketplace add 200iqlabs/shared-skills`, potem `/plugin install ss@shared-skills` | **Potwierdzone.** README podaje też formę CLI `claude plugin marketplace add ...` / `claude plugin install ss@shared-skills`. Dokumentacja Claude Code używa obu form |
| `/ss:review-fix` i `/ss:review-loop` wymagają wtyczki Codex i planu ChatGPT z Codexem; „There is no Copilot path any more"; zweryfikowane na wtyczce 1.0.2 / codex-cli 0.144.1 | **Potwierdzone** w README (sekcja „Codex review prerequisite"). Wtyczka `codex@openai-codex` jest u autora zainstalowana |
| Agent Skills: format wymyślony przez Anthropic, wydany jako otwarty standard, przyjęty m.in. przez VS Code, GitHub Copilot, Cursor, Goose, Amp, OpenCode; skill = folder z `SKILL.md` (min. `name` i `description`) | **Potwierdzone na `agentskills.io`** (strona główna + lista klientów; tam też OpenAI Codex, Gemini CLI i wielu innych). Specyfikacja **nie** definiuje manifestu wtyczki ani ścieżki instalacji |
| Manifest wtyczki (`.claude-plugin/plugin.json`) to konwencja Claude Code | **Potwierdzone** w dokumentacji Claude Code; wtyczka to katalog skilli, agentów, hooków i serwerów MCP instalowany jako jedna całość |
| `impeccable` i `hyperframes`: Apache-2.0, adresy repozytoriów | **Potwierdzone** w npm (`pbakaus/impeccable`, `heygen-com/hyperframes`). **Wersje zmienione, patrz niżej** |
| Cytaty z 2026-09-11 (§2.2, §2.3) | Nie do zweryfikowania poza wsadem. To własne słowa autora z rozmowy, narrator artykułu to ten sam autor |

## Rozbieżności i ryzyka znalezione podczas prime

To najważniejsza część artykułu-kontekstu. Wszystko poniżej rozstrzyga `plan` albo autor.

1. **Liczba 29 jest podwójnie myląca.** 19 pozycji `ss` + 10 pozycji ekosystemu = 29, czyli dokładnie tyle, ile jest zainstalowanych wtyczek. To **inne zbiory**. 29 wtyczek to paczki (w tym 22 z oficjalnego katalogu: `github`, `stripe`, `cloudflare`, serwery LSP...), a 10 z tabeli 4.2 to wybór autora; trzy z nich (OpenSpec, `impeccable`, `hyperframes`) **nie są wtyczkami z katalogu**, tylko skillami w katalogach `~/.claude/skills/` i `.claude/skills/`. Czytelnik, który doda 19 + 10, uzna listę za „te 29". Artykuł musi to rozdzielić wprost, jednym zdaniem.
2. **Teza o 29 pozycjach przesadza.** „Żadna z tych pozycji nie wymagała nauki dziedziny" obejmuje m.in. `ss` (napisane przez autora, więc wymagało wiedzy o podatkach, prawie, CFO) i wtyczki narzędziowe. Ciężar dowodowy niosą §2.2 i §2.3. Rekomendacja: zawęzić do „do projektowania interfejsu i SEO nie musiałem uczyć się dziedziny", a 29 zostawić jako tło (wsad §3 pkt 5 zresztą tak je opisuje).
3. **Instalacja nie jest darmowa, a wsad tego nie mówi.** Dokumentacja Claude Code: nazwa i opis każdego włączonego skilla są w kontekście **w każdej turze**, nawet gdy nic z wtyczki nie biegnie, a wtyczka wykonuje kod z uprawnieniami użytkownika. Wsad §4.2 mówi też, że z podłączonych autor „praktycznie nie używa" reszty. Uczciwe jedno zdanie o koszcie (kontekst, zaufanie) wzmacnia drugą połowę tezy (instalujesz, ale musisz umieć ocenić). Powiązane: wcześniejszy tekst o bezpieczeństwie agentów (`openclaw-bezpieczenstwo-agentow-ai`) i skill `/ss:find-skills`, który instaluje po audycie bezpieczeństwa.
4. **Brakuje mechanizmu oceny dla SEO.** Dla designu wsad ma mechanizm: klient wybiera z kilku propozycji. Dla SEO nie ma żadnego, a druga połowa tezy stoi na „co dalej muszę umieć ocenić". **Pytanie do autora w planie:** czym sprawdzasz wynik SEO, skoro nie znasz dziedziny? Bez odpowiedzi nie wolno wymyślać metody. Mostek do wcześniejszych tekstów: `zmierzone-nie-zalozone` (ocena przez pomiar) i `spec-driven-seo-portfolio-qamera-ai`.
5. **Licencja: README mówi Apache-2.0, plik LICENSE tego nie dowozi.** `plugin.json`, `marketplace.json` i README deklarują Apache-2.0, ale plik `LICENSE` ma 15 linii (krótka nota, nie pełny tekst licencji), a GitHub wykrywa licencję jako „Other". Wsad §2.4 podaje Apache-2.0 jako fakt. Opcje: (a) poprawić repozytorium **przed** publikacją (dodać pełny tekst), (b) napisać „deklaruje Apache-2.0". Rekomendacja: (a), bo artykuł kieruje tam ruch i hasło „wolno brać" stoi na tej licencji. Dopisuje się do uwagi operacyjnej wsadu §9 (dwie atrapy w README: `marketing`, `product-manager`, oznaczone „Planned" i dalej widoczne).
6. **Liczba skilli: 20, 19 wierszy, jeden pominięty.** W repozytorium jest 20 skilli i 4 komendy, a tabela ma 19 wierszy (15 skilli + 4 komendy), bo `research*` zwinięto do dwóch wierszy, `prepare-goal` z `prepare-openspec-goal` do jednego, a **`linkedin-content` pominięto celowo** (wsad §4.1), choć README publicznie oznacza go „Active". Czytelnik policzy 20 i znajdzie rozbieżność. `plan` musi wybrać: nie podawać sumy, albo podać 20 z jednym neutralnym zdaniem o pominiętej pozycji.
7. **Wersje we wsadzie są nieaktualne.** Dziś w npm: `impeccable` **4.5.2** (wsad 4.1.0), `hyperframes` **0.8.149** (wsad 0.8.34), `@fission-ai/openspec` **1.14.1**. Wsad twierdzi też, że `SKILL.md` OpenSpeca w tym repozytorium ma `generatedBy: "1.12.0"`; plik ma `"1.2.0"` (to wersja z chwili generowania, więc nie musi być błędem). Rekomendacja: **w artykule żadnych numerów wersji**; zostaje licencja i adres. Numer zestarzeje się przed publikacją.
8. **Dwa źródła wtórne z §2.6 nie dały się ponownie przeczytać.** The New Stack zwrócił stronę bez treści artykułu, aibusiness.com odpowiedział 403. Teza o otwartym standardzie jest za to potwierdzona **na źródle pierwotnym**. Rekomendacja: podlinkować `agentskills.io` (i listę klientów) jako źródło główne; dwa artykuły wtórne zostawić tylko po ręcznym sprawdzeniu, że się otwierają. Wsad zabrania daty upublicznienia i liczby wdrożeń. Zostaję przy tym.
9. **Konflikt: wsad zabrania prośby o kontakt, a szablon bloga wymaga CTA.** Wsad §3 pkt 10 i §5: „bez prośby o kontakt". `portfolio-copywriting` wymaga na końcu każdego artykułu bloku CTA do `/#contact` (kolejność: Wnioski → CTA → Przydatne zasoby → FAQ). **Decyzja dla autora w planie.** Rekomendacja: zamknięcie prozy bez żadnej prośby (zgodnie z wsadem), a standardowy blok CTA zostaje jako element szablonu, z treścią o pomocy w wyborze, co podłączyć, i co dalej oceniać, bez bramki i bez zapisu.
10. **Konflikt: definicja „skill" w tym samym zdaniu, nie w nawiasie (wsad §6) a reguła w `10-prosty-polski.md`.** Plik reguł dopuszcza nawias **albo** osobne zdanie zaraz po terminie. Wsad sam zastrzega, że nie rozstrzyga za reguły. Słowo „skill/skille" jest zresztą **już na keep-liście** reguł, więc wyjątek „wbrew tabeli zamian" jest zbędny. Rekomendacja: zdanie definiujące tuż po pierwszym użyciu w otwarciu; to spełnia intencję wsadu i brzmi naturalniej niż nawias.
11. **Publiczne repozytorium a wsad.** Wsad zawiera ścieżki do prywatnej bazy wiedzy i do prywatnego repozytorium oraz nazwy prywatnych skilli. `blog-article-writer:archive` przenosi wsad do `docs/blog/_archive/<slug>/`, czyli do repozytorium publicznego. Wcześniejszy prime ujął „wewnętrzną strukturę pracy" (ścieżki, nazwy plików bazy wiedzy) w kategorie wykluczone z publikacji. **Przed archiwizacją zredagować §2.1 (ścieżka pliku konta), §2.7 (ścieżka notatki), §2.8 i §8.** W tym prime ścieżek prywatnych świadomie nie przytaczam.
12. **Jeden klient czy dwóch.** §1 mówi „wziąłem zlecenie", a cytat w §2.3 „dla [dwóch klientów]". Pisać **„CRM dla klientów z branży nieruchomości"**, bez „jednego klienta" i bez „jednego zlecenia". Nie nazywać klientów (zakaz we wsadzie §5).

## Koncepty do zdefiniowania przy pierwszym użyciu

skill (plik z instrukcją, który agent czyta i zaczyna robić rzecz, której wcześniej nie robił) ·
wtyczka (paczka skilli, komend, agentów i serwerów MCP instalowana jako całość) ·
katalog wtyczek (marketplace: katalog z plikiem `marketplace.json`, w tekście „katalog wtyczek", w komendzie `marketplace`) ·
komenda ukośnikowa · Agent Skills (otwarty standard formatu skilla) · manifest wtyczki ·
licencja Apache-2.0 (zezwala na używanie, zmianę i dalsze rozpowszechnianie z zachowaniem noty) ·
OpenSpec (specyfikacja przed kodem) · Codex (wtyczka OpenAI do przeglądu kodu) · CRM ·
SEO · Core Web Vitals (jeśli wejdzie) · Marp, Excalidraw, Mermaid (jeśli wejdą w tabeli) ·
IP Box, RODO (jeśli wejdą w opisie `/ss:tax-advisor`, `/ss:legal`) · PRD · markdown, JSON.

**Pułapki słownikowe** (brama grep w `10-prosty-polski.md` łapie część z nich):

- „wtyczka", nie „plugin" w tekście; „plugin" tylko w nazwach komend i ścieżkach.
- **Nie pisać „proza"** (ani „prozy") w tekście dla czytelnika; zamiast tego „tekst", „notatki". We wsadzie słowo pada często, nie przenosić.
- Z opisu 2.5 nie przenosić `ingest`; `/ss:ingest`, `/ss:orientation`, `/ss:task-delegation` nie są wymieniane (wsad §2.5 i §5).
- Nie pisać „pipeline", „workflow" tam, gdzie jest polski odpowiednik („potok", „proces"); „fallback", „bundle", „deployować", „commitować" odpadają.
- Znaki: w cytatach z §2.2 są **półpauzy/pauzy U+2014** (` — i to nie tylko UI/UX`). Zamienić na ` - ` albo skrócić cytat. Wielokropek `…` nie. Polskie cudzysłowy `„ "` zostają.

## Struktura i objętość (wejście do planu)

Wsad §3 daje już 10 kroków (konkret → nazwa rzeczy → lista), i ta kolejność jest uzasadniona.
Zachować ją. Do ustalenia w `plan`:

- **Objętość:** ok. 2400-3000 słów, 13-15 min czytania. Dwie tabele (19 i 10 wierszy) zajmują dużo miejsca, więc proza między nimi ma być krótka. Punkt odniesienia: `zmierzone-nie-zalozone` 3225 słów (16 min), `slabe-strony-claude-code` 2263 (11 min).
- **Kolejność końcówki (potwierdzona na id 31 i 32):** `## Kluczowe wnioski` → CTA (HTML, `/#contact`) → `## Przydatne zasoby` → `## FAQ`. Linki ze wsadu §7 wchodzą **w zdania**, a sekcja zasobów powtarza je listą.
- **Bloki kodu:** dwie komendy instalacji, tag `text` (to komendy ukośnikowe sesji, nie powłoki); ewentualnie wariant CLI w bloku `bash`. Bez dalszego kodu: to nie poradnik pisania skilli (wsad §5).
- **Tabele:** 4.1 i 4.2 wchodzą w całości. Ostrzeżenie o planie ChatGPT stoi **w tym samym miejscu** co dwa wiersze `/ss:review-fix` i `/ss:review-loop`.
- **Zastrzeżenie z §2.7** (manifest to konwencja Anthropic, nie część specyfikacji; ścieżki instalacji różnią się między narzędziami) musi paść wprost, i jest potwierdzone dokumentacją.
- **FAQ (4-6 pytań), kandydaci:** czym jest skill i czym różni się od wtyczki · czy skille z Claude Code działają w innych narzędziach (częściowo: format tak, instalacja i manifest nie) · czy wolno używać `shared-skills` komercyjnie (zależy od licencji, patrz pkt 5) · czy `/ss:review-fix` jest darmowe (skill tak, recenzent nie) · czy instalowanie cudzych skilli jest bezpieczne (kod z uprawnieniami użytkownika, dokumentacja Claude Code) · ile skilli naraz to za dużo (koszt kontekstu).

## Frontmatter (ustalenia)

- **id:** 33 (maksimum obecnie 32, `zmierzone-nie-zalozone`; sprawdzone skanem wszystkich plików PL i EN)
- **slug:** `skille-ktore-mam-podlaczone` (**wiążący**, ze wsadu; kanały będą na niego linkować)
- **title:** do ustalenia w planie, 50-60 znaków; roboczy „Kompetencję się instaluje, nie nabywa"
- **category:** `AI` albo `Code`. Sąsiedzi tematyczni: `skills-2-0-...`, `system-agentow-...`, `srodowisko-agentowe-...` to `AI`; `slabe-strony-claude-code` to `Code`. Rekomendacja: `AI` (teza o kompetencji, nie przegląd narzędzi). Decyzja w planie.
- **date:** ustalić w `execute`; artykuł wychodzi przed materiałami na pozostałych kanałach
- **readTime:** wyliczyć z objętości
- **image:** `/images/og-skille-ktore-mam-podlaczone.webp` (do wygenerowania; potok OG ma trzy kroki: `generate-image.js` daje `.jpeg` 1424x752, trzeba dołożyć zmianę rozmiaru, inaczej `npm run og:check` odrzuci)
- **lang:** `pl`
- **alternateSlug:** **NIE ustawiać** (PL-only; tłumaczenie to osobny krok, `blog-article-writer:translate`)
- **tags (kandydaci):** Agent Skills, Claude Code, Wtyczki, Open source, Rozwój zawodowy, AI. Wzorzec: `slabe-strony-claude-code` używa „Agent Skills", „Claude Code".

## Linki wewnętrzne (2-5)

- `/blog/slabe-strony-claude-code`: `ui-ux-pro-max`, `impeccable`, `hyperframes` są tam opisane osobno; **nie powtarzać recenzji**, tylko odesłać.
- `/blog/zmierzone-nie-zalozone`: mostek do „co dalej muszę umieć ocenić".
- `/blog/skills-2-0-multi-agent-system-zarzadzanie-firma`: źródło podziału na część wspólną i prywatną (§2.8). Uwaga: tamten tekst opisuje `shared-skills` jako git submodule; **obecny sposób instalacji to wtyczka**. Nie cytować stanu z tamtego tekstu jako aktualnego.
- `/blog/system-agentow-ai-skills-rules-kontekst`: anatomia systemu, do którego wchodzą skille.
- `/blog/opsx-workflow-strukturyzowana-praca-z-ai` (id 19): wiersz OpenSpec w tabeli 4.2.
- Zewnętrzne ze wsadu §7: repozytorium `shared-skills`, `agentskills.io`, `impeccable` (GitHub + impeccable.style), `hyperframes` (GitHub). OpenSpec: strona projektu do potwierdzenia (npm wskazuje `Fission-AI/OpenSpec`; wsad podaje autora „openspec"), więc **nie wstawiać adresu bez potwierdzenia**.

## Czego NIE robić

(Zbiorczo ze wsadu §5 i z tego prime. Nie dopisywać zakresu, którego nie ma czym pokryć.)

- Poradnik pisania własnego skilla. Format jest tani i tyle.
- Liczby bez podstawy: „x razy szybciej", „oszczędza X godzin", „większość konsultantów".
- Porównanie OpenSpeca z superpowers (autor używa obu i niczego nie zmierzył). Zdanie ma mówić, po co sięga po które.
- Prognozy o rynku pracy, w dowolnym wariancie „programiści przestaną być potrzebni".
- Nazwy klientów i liczby pozwalające ich odtworzyć.
- Odnośnik do prywatnej części maszyny; zostaje wzorzec bez linku.
- Pozycje usunięte z publicznego repozytorium i informacja, dokąd trafiły.
- Pokaz własnej maszynerii publikacji. Tematem są kompetencje instalowane agentowi.
- Bramka: newsletter, adres w zamian za listę.
- Wersje, daty upublicznienia standardu, liczba gwiazdek, liczba zgodnych wdrożeń.

## Kolejne kroki

1. Autor rozstrzyga w `plan` punkty **4, 5, 6, 9** (mechanizm oceny SEO, licencja, liczba 20 vs 19, CTA) i potwierdza **10** (definicja skilla).
2. Przed publikacją po stronie repozytorium `shared-skills`: pełny tekst licencji, porządek w README (dwie atrapy), bo artykuł kieruje tam ruch (wsad §9).
3. Przed `archive`: zredagować ścieżki prywatne we wsadzie (pkt 11).
4. Po `execute`: `npm run blog:sitemap`, `npm run og:check`, grep słownikowy z `10-prosty-polski.md` i grep znaków (`[\x{2014}\x{2013}\x{2026}]`) na pliku artykułu. Doc DOX: artykuł nie zmienia kontraktów, więc zapis „bez zmian" w pass DOX.
