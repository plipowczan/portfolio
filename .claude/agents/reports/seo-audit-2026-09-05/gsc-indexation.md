# Search Console: strona jest niezaindeksowana

Dane pobrane 2026-09-05, po podpięciu poświadczeń Google. To jedyna część audytu
oparta na danych od Google, a nie na pomiarach z zewnątrz.

## Stan

**Sitemap** (`sc-domain:pawel.lipowczan.pl`):

| pole | wartość |
|---|---|
| ścieżka | `https://pawel.lipowczan.pl/sitemap.xml` |
| ostatnio pobrany przez Google | 2026-08-14 |
| ostatnio zgłoszony | 2026-04-22 |
| błędy / ostrzeżenia | 0 / 0 |
| zgłoszonych URL | **98** |
| zaindeksowanych | **0** |

**Ruch z wyszukiwarki, ostatnie 90 dni** (2026-06-07 – 2026-09-02):

| metryka | wartość |
|---|---|
| kliknięcia | **1** |
| wyświetlenia | 57 |
| CTR | 1,75% |
| średnia pozycja | 6,6 |

Wszystkie 57 wyświetleń dotyczy jednego adresu: strony głównej. Żaden z 60
artykułów, 9 wdrożeń ani stron kursu nie zanotował ani jednego wyświetlenia.

Jedyne dwa zapytania, jakie w ogóle wystąpiły, są markowe: `lipowczan` (3
wyświetlenia, pozycja 4,7) i `plsoft` (3 wyświetlenia, pozycja 5,3). Zero
kliknięć na obu.

## Stan indeksacji pojedynczych adresów

Sprawdzone przez URL Inspection API:

| adres | werdykt | ostatnie pobranie |
|---|---|---|
| `/` | Crawled – currently not indexed | 2026-07-29 |
| `/blog` | Crawled – currently not indexed | 2026-07-29 |
| `/projects/frontdesk-ai` | Crawled – currently not indexed | **2026-01-11** |
| `/blog/rag-ragowi-nierowny` | **URL is unknown to Google** | nigdy |
| `/blog/software-3-0-agentic-engineering` | **URL is unknown to Google** | nigdy |
| `/en/blog/not-all-rag-is-equal` | **URL is unknown to Google** | nigdy |
| `/llm-wiki` | **URL is unknown to Google** | nigdy |

Dwa różne problemy naraz:

1. Strony, które Google zna (`/`, `/blog`, wdrożenia) — pobrał je i **świadomie
   nie zaindeksował**.
2. Artykuły i strony kursu — Google **nigdy ich nie pobrał**, mimo że są w
   sitemapie zgłoszonej w kwietniu i pobranej w sierpniu, i mimo że są linkowane
   z `/blog`.

`/projects/frontdesk-ai` nie był odwiedzony od stycznia. Google praktycznie
przestał tę stronę odwiedzać.

## Co to znaczy

„Crawled – currently not indexed" nie jest błędem technicznym. To decyzja
Google: adres został pobrany i uznany za niewart umieszczenia w indeksie.
Technicznie nic nie blokuje — robots.txt przepuszcza wszystko, nie ma nigdzie
`noindex`, kanoniczne są poprawne, sitemap bez błędów, 404 zwracają prawdziwy
status. To wszystko zostało zweryfikowane osobno w `technical.md`.

Znaczy to natomiast, że **cała reszta audytu opisuje optymalizację czegoś, co
nie bierze udziału w wyszukiwaniu**. Tytuły, dane strukturalne, linkowanie
wewnętrzne, szybkość — wszystko to ma sens dopiero po zaindeksowaniu.

## Prawdopodobne przyczyny, uczciwie uszeregowane

Nie da się tego rozstrzygnąć z zewnątrz. Poniżej hipotezy według
prawdopodobieństwa, z zaznaczeniem, co jest sprawdzalne.

1. **Brak autorytetu domeny.** Najmocniejszy kandydat. Domena nie występuje w
   grafie Common Crawl, a jedyne potwierdzone linki zewnętrzne to własne profile
   (GitHub z `rel="nofollow"`, X). Domena bez linków przychodzących regularnie
   dostaje dokładnie ten werdykt. Sprawdzalne: patrz `backlinks.md`.
2. **Ocena wartości treści.** Dziewięć wdrożeń po 156–234 słowa to klasyczny
   sygnał niskiej wartości. Ocena jest jednak dla całego serwisu, więc cienkie
   strony mogą ciągnąć w dół także te obszerne.
3. **Niewidoczny HTML.** Google renderuje JavaScript, więc treść ostatecznie
   zobaczy — ale budżet renderowania przydziela wg wartości serwisu. Strona,
   która bez wykonania skryptów wygląda na pustą, nie pomaga. To hipoteza
   najsłabiej potwierdzona: linki na `/blog` są w HTML niezależnie od `opacity`,
   więc to nie tłumaczy, czemu artykuły są „unknown to Google".

Punkt 3 jest i tak wart naprawy z powodu użytkowników — patrz
`prerender-invisible-html.md`. Ale nie należy zakładać, że sam z siebie odblokuje
indeksację.

## Co robić

Kolejność wynikająca z powyższego, nie z ogólnych dobrych praktyk:

1. **Zgłoś ręcznie kilka adresów do indeksacji** w Search Console (URL
   Inspection → Request Indexing): strona główna, `/blog`, dwa lub trzy najlepsze
   artykuły. To test: jeśli po ręcznym zgłoszeniu wejdą do indeksu i tam zostaną,
   problemem jest odkrywanie i budżet crawlowania. Jeśli wypadną, problemem jest
   ocena wartości. Odpowiedź zmienia dalszy plan.
   Nie używaj do tego Indexing API — Google przyjmuje przez nie wyłącznie
   ogłoszenia o pracę i transmisje na żywo.
2. **Zdobądź kilka prawdziwych linków zewnętrznych.** Konkretne kierunki są w
   `backlinks.md`. To najwolniejsza, ale najpewniejsza dźwignia przy hipotezie 1.
3. **Usuń cienkie strony albo je rozbuduj** — decyzja z 2026-09-05 zakłada cztery
   mocne wdrożenia i przekierowania 301 z reszty. To zdejmuje sygnał z punktu 2.
4. **Napraw niewidoczny HTML** — i tak zaplanowane, z powodu użytkowników.

## Zastrzeżenie

CrUX nie ma danych dla tej domeny (sprawdzone: 404 zarówno dla całego serwisu,
jak i dla strony głównej), co jest spójne z obrazem powyżej — ruch jest poniżej
progu raportowania. Wszystkie liczby o szybkości w tym audycie pozostają
pomiarami laboratoryjnymi.
