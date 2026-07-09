---
id: 30
slug: rag-ragowi-nierowny
title: "RAG ragowi nierówny: do kodu graf, do notatek indeks"
excerpt: >-
  RAG to rodzina technik, nie jedna. Do kodu wygrywa retrieval
  strukturalny (AST, LSP, graf), do notatek kurowany indeks.
  Mapa doboru mechanizmu do materiału.
category: AI
author: Pawel Lipowczan
date: 2026-07-09
readTime: 12 min
image: /images/og-rag-ragowi-nierowny.webp
tags:
  - AI
  - RAG
  - Claude Code
  - Second Brain
  - Retrieval
lang: pl
alternateSlug: not-all-rag-is-equal
---

## „RAG to głównie bazy wektorowe" - obiekcja, która ma rację

Przy okazji [darmowego kursu LLM Wiki](/llm-wiki) dostałem od technicznego rozmówcy uwagę, którą parafrazuję: „RAG kojarzy mi się głównie z bazami wektorowymi. Ale do kodu są ciekawsze rozwiązania, oparte na analizie składniowej - na przykład codebase-memory-mcp, który autorzy nazywają Hybrid LSP. Do notatek pewnie średnio, ale do kodowania sprawdza się nieźle."

Ma rację. W obu połowach zdania. Zamiast tę uwagę zbijać, wolę ją rozwinąć - siedzi w niej mapa, której brakuje większości dyskusji o **RAG** (Retrieval-Augmented Generation, czyli technice, w której model przed odpowiedzią dociąga treść z zewnętrznego źródła, zamiast polegać wyłącznie na pamięci z treningu).

„Dodaj RAG do projektu" brzmi jak decyzja. Nie jest nią. To tak, jakby powiedzieć „użyj bazy danych" i nie sprecyzować, czy chodzi o relacyjną, dokumentową czy graf. Po tym artykule dobierzesz mechanizm wyszukiwania do materiału: inny do kodu, inny do notatek. Dowiesz się też, kiedy zwykły grep (wyszukiwanie w plikach po dokładnym ciągu znaków) wygrywa z całą resztą.

## RAG to rodzina technik, nie jedna

Skojarzenie „RAG = baza wektorowa" wzięło się stąd, że przez dwa lata tak wyglądała większość wdrożeń. Baza wektorowa przechowuje **embeddings** (liczbowe reprezentacje tekstu, które pozwalają szukać po podobieństwie znaczenia, nie po dokładnym słowie). To jeden smak RAG, nie jego definicja.

Przyjmijmy szerszą definicję: RAG to każde rozwiązanie, które tnie zużycie **tokenów** (jednostek, w których model rozlicza tekst) i dryf odpowiedzi przez dociąganie właściwej treści. W tej definicji mieszczą się cztery substraty:

- **leksykalny** - grep i BM25 (klasyczny algorytm oceny trafności tekstu), szukanie po dokładnych słowach;
- **semantyczny** - wektory i podobieństwo znaczeń;
- **strukturalny** - grafy symboli, definicji i wywołań, zbudowane z samego kodu;
- **kurowany indeks** - utrzymywany przez agenta spis treści bazy, jak w [LLM Wiki](/blog/llm-knowledge-base-brain-karpathy).

Mój second brain (baza wiedzy w plikach markdown, utrzymywana przez agenta) też jest w tej definicji RAG-iem. Mechanizm ma tylko inny: zamiast liczyć podobieństwo wektorów, agent czyta lekki indeks i dociąga 2-3 trafne noty. Spór nie toczy się o cel. Toczy się o mechanizm - a **mechanizm ma pasować do materiału**.

## Kod parsuje się do symboli, notatki nie

Kod różni się od notatek jedną cechą, która zmienia wszystko: jego gramatyka jest formalna i parser rozstrzyga ją jednoznacznie. Wywołanie `user.profile.name()` da się jednoznacznie rozwiązać - wiadomo, gdzie jest definicja, jaki typ wraca, kto jeszcze to woła. Z takiego materiału można zbudować **AST** (abstrakcyjne drzewo składniowe - strukturę, na którą parser rozkłada kod), a z wielu drzew **graf wywołań** (mapę „kto woła kogo" w całym repozytorium). Ta struktura jest dokładna i weryfikowalna.

Notatki też mają gramatykę - języka naturalnego - ale maszyna nie rozstrzygnie jej jednoznacznie. Zdanie „decyzja była dobra, bo klient miał już PostgreSQL" nie rozkłada się na symbole: nie ma definicji, typów ani jednoznacznych referencji. Dlatego do notatek działa kurowany indeks plus linki między notami, a nie graf składniowy.

Najostrzej ujęli to badacze z Duke i Snowflake w pracy HOMER o pamięci agentów: **similarity ≠ causality**. Bliskość dwóch fragmentów w przestrzeni embeddings to nie to samo, co zależność między nimi. Na pytanie „kto woła tę funkcję" wektor odpowiada zgadywaniem po podobieństwie, a graf faktami. Mój rozmówca zauważył to samo od strony praktyki: „do notatek średnio, do kodowania nieźle". Kod ma strukturę, którą da się zindeksować bez zgadywania - notatki nie.

## Studium: codebase-memory-mcp

Narzędzie z obiekcji dobrze pokazuje, jak wygląda dojrzały retrieval do kodu. `codebase-memory-mcp` (DeusData) to serwer **MCP** (Model Context Protocol - standard podpinania narzędzi do agenta AI), który indeksuje całe repozytorium do trwałego grafu wiedzy o kodzie.

Wbrew etykiecie „analiza składniowa" to hybryda trzech warstw:

1. **Graf symboli** - parser tree-sitter (rozkłada kod na AST, obsługuje 158 języków) plus „Hybrid LSP", czyli lekka reimplementacja tego, co robi **LSP** (Language Server Protocol - silnik, który w edytorze obsługuje „go to definition" i „find references"): rozwiązywanie typów, importów i dziedziczenia bez uruchamiania pełnego language servera.
2. **Wektory** - wkompilowane embeddings `nomic-embed-code`, bez klucza API.
3. **Pełny tekst** - wyszukiwanie BM25 po słowach.

Sedno: narzędzie samo używa wektorów, tylko nie od nich zaczyna. Zaczyna od struktury, a podobieństwo semantyczne zostawia na rozmyte pytania.

Liczba z nagłówka README robi wrażenie: **3 400 tokenów zamiast 412 000** na tym samym zadaniu. Pięć zapytań do grafu zamiast przeszukiwania repozytorium grep-em plik po pliku - redukcja o **99,2%**. Jedno zastrzeżenie: to deklaracja autorów (README plus preprint na arXiv), nie niezależny pomiar. Kierunek zgadza się jednak z tym, co znam z własnej bazy notatek: tam przejście z „przeszukaj wszystko" na „najpierw indeks" tnie koszt jednego pytania z ~35 tys. do ~3 tys. tokenów, około **30 razy**. Dwa różne materiały, dwie pary liczb, ten sam wzorzec: struktura przed siłowym czytaniem.

```text
Pytanie: „co pęknie, gdy zmienię sygnaturę update_profile()?"

grep plik po pliku:  dziesiątki wyszukiwań i odczytów  ->  ~412 000 tokenów
graf symboli:        5 zapytań strukturalnych          ->    ~3 400 tokenów

(liczby: deklaracja autorów codebase-memory-mcp)
```

Uczciwie o granicach: pełne rozwiązywanie typów działa dla Pythona, TypeScript/JavaScript, Go, Rusta, Javy, C, C++, C#, Kotlina i PHP. Dla pozostałych języków narzędzie przechodzi na dopasowanie tekstowe - odpowiedź dostaniesz, ale mniej precyzyjną.

## Mapa substratów retrievalu

codebase-memory-mcp to jeden punkt na większej mapie. Przegląd badań nad retrievalem do kodu (arXiv:2510.04905) dzieli metody na **graph-based** (rdzeniem jest jawnie zbudowany graf struktury kodu) i **non-graph** (repozytorium traktowane jak worek tekstu, przeszukiwany leksykalnie albo semantycznie). Na tej osi układa się pięć praktycznych podejść:

| Substrat | Jak działa | Przykłady |
|----------|-----------|-----------|
| Graf AST (tree-sitter) | parsuj kod, zbuduj graf definicji i wywołań | codebase-memory-mcp, Graphify, repo map Aidera |
| LSP jako kontekst | agent pyta language server o symbole i typy | Serena, mcp-language-server |
| Utrwalone fakty (SCIP/LSIF) | fakty o kodzie zapisane i odpytywane jak baza danych | Glean (Meta), srctx |
| Agentic grep | agent sam generuje i wykonuje wyszukiwania, zero indeksu | Claude Code, Cline, GrepRAG |
| Wektory (semantic) | podobieństwo embeddings | klasyczny RAG |
| Kurowany indeks przy kodzie | drzewo plików `AGENTS.md`, agent schodzi od korzenia do miejsca edycji | DOX |

**SCIP i LSIF** to formaty utrwalania faktów o kodzie (kto definiuje, kto używa), zapisywalne w repozytorium i współdzielone w zespole. Szósty wiersz wymaga słowa wyjaśnienia: `AGENTS.md` to plik instrukcji, który agent kodujący czyta automatycznie na starcie pracy w repozytorium. Wzorzec DOX (repo `agent0ai/dox`) mnoży go - jeden `AGENTS.md` w każdym folderze, z przeznaczeniem folderu, lokalnymi konwencjami i indeksem podfolderów - a agent schodzi tym drzewem od korzenia do miejsca edycji i po zmianie aktualizuje dokumentację. To ten sam kurowany indeks, co przy notatkach, tylko wersjonowany razem z kodem. Podejść jest więcej - grafy ścieżek wykonania, hybrydy z wiedzą zespołu - ale ta szóstka pokrywa większość decyzji, które realnie podejmiesz.

## Uczciwie: kiedy grep bije graf

Gdyby struktura zawsze wygrywała, ten artykuł byłby krótszy. Nie wygrywa.

Preprint GrepRAG (Uniwersytet Zhejiang, styczeń 2026) odwraca perspektywę. Zamiast budować jakikolwiek indeks, model sam generuje około 10 komend `ripgrep`, wykonuje je na surowym repozytorium i przestawia wyniki wagami BM25. Zero indeksu oznacza zero nieświeżego indeksu - nic nie rozjeżdża się z kodem. Według autorów podejście dorównało grafom i wektorom albo je pobiło na uzupełnianiu kodu, przy retrievalu średnio ~13 razy szybszym (w skrajnym przypadku 35 razy). To preprint z wynikami własnymi autorów - traktuję go jak deklarację, nie fakt.

Mocniejszy argument przyszedł z praktyki. Zespół Claude Code porzucił wczesną wersję opartą na RAG z lokalną bazą wektorową, bo wyszukiwanie agentowe - grep plus nawigacja po plikach - działało lepiej i nie miało problemu przeterminowanego indeksu. Cline, inny popularny agent kodujący, ogłosił to samo stanowisko w manifeście „why we don't index your codebase".

Po drugiej stronie stoi RepoGraph (ICLR 2025, praca recenzowana): dołożenie grafu repozytorium poprawiło wyniki czterech agentów średnio o **32,8%** na SWE-bench-Lite (benchmarku naprawiania prawdziwych błędów z projektów GitHub). Grep kontra graf - kto ma rację?

Oba obozy. Rozstrzyga zadanie:

| Zadanie | Wygrywa | Dlaczego |
|---------|---------|----------|
| Lokalne uzupełnienie fragmentu | agentic grep | tanio, bez indeksu, bez dryfu - odpowiedź jest blisko |
| Zmiana przechodząca przez wiele plików | graf / LSP | potrzebna mapa wywołań i typów, której lokalne okno nie pokaże |
| „Kto woła X? Co pęknie po zmianie?" | LSP / graf definicji | wynik wyczerpujący, nie ranking kandydatów |
| Rozmyte „gdzie jest logika logowania" | wektory | dopasowanie intencji, nie dokładnej struktury |

W praktyce nie wybierasz więc „graf albo grep". Grep bierze lokalną robotę, struktura zmiany przekraczające granice modułów, wektory rozmyte pytania o intencję. codebase-memory-mcp po cichu przyznaje to samo: w jednym narzędziu siedzi graf, embeddings i grep wzbogacony o kontekst z grafu.

Jedną lukę muszę odnotować. Wszystkie te narzędzia są zweryfikowane na Pythonie, TypeScript, Go czy Ruście. Na C# i Roslyn (kompilatorze .NET) nie znalazłem potwierdzonego wdrożenia żadnego z nich. Mosty LSP powinny zadziałać w teorii; w praktyce to test do zrobienia, nie fakt do zacytowania. Sam już prawie nie piszę kodu ręcznie - robią to agenci - ale to nie unieważnia problemu: retrieval, którym agent czyta repozytorium, wciąż zależy od wsparcia konkretnego języka. Jeśli Twój zespół siedzi w .NET, przetestuj, zanim zaufasz benchmarkom.

## Dwie warstwy pamięci agenta

Wróćmy do obiekcji. „Do kodu structural, do notatek średnio" - zgoda. Wniosek nie brzmi jednak „wybierz jedno". W agencie kodującym chcesz obu warstw naraz, bo pamiętają co innego.

**Graf i LSP pamiętają, jak wygląda kod**: co się z czym woła, gdzie jest definicja, co pęknie po zmianie sygnatury. **Second brain pamięta, dlaczego kod tak wygląda**: jaką konwencję przyjęliśmy, czego próbowaliśmy wcześniej i co nie zadziałało, dlaczego wybraliśmy tę bibliotekę, a nie tamtą.

Graf da Ci pełne drzewo wywołań. Nie powie, że obecną konwencję narzuciliśmy po tym, jak poprzednia wysadziła produkcję w marcu. Tej informacji nie ma w żadnym AST, bo nikt jej tam nie zapisał. Została w głowach, w wątkach na Slacku albo - jeśli prowadzisz bazę wiedzy - w jednej nocie z datą i uzasadnieniem.

Kod nie zapisuje intencji. Brain tak.

Gdzie w tym podziale mieszka drzewo `AGENTS.md`? Pomiędzy. Lokalne konwencje folderu - „tu testy piszemy tak, tego modułu nie ruszaj" - najlepiej trzymać tuż przy kodzie, wersjonowane razem z nim, i dokładnie to robi wzorzec DOX. Brain trzyma piętro wyżej to, czego pojedyncze repozytorium nie pomieści: decyzje i standardy wspólne dla wielu projektów, historię podejść, wnioski z porażek. Z dwóch warstw robią się trzy: graf pamięta strukturę, `AGENTS.md` lokalne konwencje, brain wiedzę ponad projektem.

Dlatego mój rozmówca miał rację w obu połowach zdania, a jego obiekcja opisuje nie konkurencję, tylko podział pracy między dwie warstwy pamięci jednego agenta. Strukturę kodu trzymaj w grafie. Decyzje, konwencje i wnioski w bazie notatek - [przenośnej i czytelnej dla agenta](/blog/okf-standard-przenosnosc-bazy-wiedzy-ai). Jak taką bazę zbudować od zera, pokazuję w [darmowym kursie LLM Wiki](/llm-wiki).

## Kluczowe wnioski

1. **RAG ragowi nierówny.** Wybieraj substrat: leksykalny (grep/BM25), semantyczny (wektory), strukturalny (AST/LSP/graf) albo kurowany indeks. Baza wektorowa to jeden smak, nie definicja.
2. **Kod parsuje się do symboli, notatki nie.** Do zmian przekraczających granice plików domyślnie używaj struktury; do notatek indeksu i linków.
3. **Grep to zawodnik, nie rezerwa.** Brak indeksu bije nieświeży indeks przy lokalnej robocie - Claude Code i Cline zbudowały na tym całe podejście.
4. **Dopasuj mechanizm do zadania, nie do mody.** Benchmarki z README i preprintów traktuj jak deklaracje autorów, dopóki ktoś ich niezależnie nie powtórzy.
5. **Agentowi kodującemu daj obie warstwy pamięci.** Graf pamięta strukturę, brain pamięta intencje, a lokalne konwencje folderu trzymaj przy kodzie (drzewo `AGENTS.md`). Dopiero razem odpowiadają i na „co pęknie", i na „dlaczego tak".

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Zastanawiasz się, jakim retrievalem karmić swojego agenta AI?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomagam dobrać warstwy pamięci agentów do realnego projektu: graf do kodu, bazę wiedzy do decyzji i konwencji. Powiem Ci, co zadziała w Twoim zespole, zanim kupisz kolejne narzędzie.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
  <p class="mt-4 text-sm text-gray-400">
    Warstwę wiedzy zbudujesz sam - w <a href="/llm-wiki" class="text-primary-500 hover:text-primary-400">darmowym kursie LLM Wiki</a> pokazuję jak, krok po kroku. Szablon z kursu połączysz z repozytorium kodu.
  </p>
</div>

## Przydatne zasoby

- [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) - graf kodu jako serwer MCP; preprint: [arXiv:2603.27277](https://arxiv.org/abs/2603.27277)
- [Retrieval-Augmented Code Generation - przegląd metod](https://arxiv.org/abs/2510.04905) - taksonomia graph vs non-graph
- [GrepRAG](https://arxiv.org/html/2601.23254v2) - retrieval bez indeksu: model sam generuje komendy ripgrep
- [RepoGraph](https://arxiv.org/abs/2410.14684) - recenzowany dowód, że graf repozytorium poprawia wyniki agentów
- [Cline: why we don't index your codebase](https://cline.bot/blog/why-cline-doesnt-index-your-codebase-and-why-thats-a-good-thing) - manifest podejścia agentic grep
- [Serena](https://github.com/oraios/serena) - LSP jako narzędzia agenta (symbole, referencje, refaktoryzacja)
- [DOX](https://github.com/agent0ai/dox) - samodokumentujące się drzewo `AGENTS.md`: kurowany indeks wersjonowany z kodem
- [Repo map Aidera](https://aider.chat/docs/repomap.html) - protoplasta map repozytorium z budżetem tokenów
- [Jak LLM Wiki Karpathy'ego pomogła mi uporządkować bazę wiedzy](/blog/llm-knowledge-base-brain-karpathy) - kurowany indeks w praktyce
- [Zbudowałem drugi mózg. Trafiłem w standard Google (OKF)](/blog/okf-standard-przenosnosc-bazy-wiedzy-ai) - przenośność bazy notatek

## FAQ

<details open>
<summary>

### Czy RAG to zawsze baza wektorowa i embeddings?

</summary>

Nie. Baza wektorowa to jeden z czterech substratów retrievalu, obok leksykalnego (grep, BM25), strukturalnego (grafy AST/LSP) i kurowanego indeksu. Jeśli definiować RAG jako dociąganie właściwej treści przed odpowiedzią modelu, to LLM Wiki z indeksem też jest RAG-iem - tylko bez wektorów.

</details>

<details open>
<summary>

### Kiedy do przeszukiwania kodu wystarczy grep, a kiedy potrzebny jest graf symboli?

</summary>

Grep wystarcza przy lokalnej robocie: uzupełnienie fragmentu, znany ciąg znaków, odpowiedź blisko miejsca edycji. Graf albo LSP potrzebujesz przy zmianach przekraczających granice plików i pytaniach „kto woła X, co pęknie po zmianie". Tam grep daje fałszywe trafienia, a wektory zgadują.

</details>

<details open>
<summary>

### Czym różni się retrieval do kodu od retrievalu do notatek?

</summary>

Kod ma gramatykę formalną, którą parser rozstrzyga jednoznacznie, więc można z niego zbudować dokładny graf definicji, typów i wywołań. Tekst notatki nie rozkłada się na symbole - zdanie „dlaczego podjęliśmy tę decyzję" nie ma definicji ani typów. Dlatego do notatek działa kurowany indeks i linki między notami, a do kodu struktura.

</details>

<details open>
<summary>

### Czy LLM Wiki zastępuje narzędzia typu codebase-memory-mcp?

</summary>

Nie, to komplementarne warstwy pamięci agenta. Graf kodu pamięta strukturę: wywołania, typy, zależności między plikami. LLM Wiki pamięta intencje: decyzje, konwencje, odrzucone podejścia. Agent kodujący korzysta z obu naraz.

</details>

<details open>
<summary>

### Co znaczy „similarity ≠ causality" przy bazach wektorowych?

</summary>

Bliskość dwóch fragmentów w przestrzeni embeddings nie oznacza, że jeden zależy od drugiego. Na pytania strukturalne, jak „kto woła tę funkcję", wektor odpowiada podobieństwem, czyli zgadywaniem, a graf wywołań faktami. Sformułowanie pochodzi z pracy HOMER (Duke + Snowflake) o pamięci agentów.

</details>

<details open>
<summary>

### Gdzie trzymać konwencje projektu - w plikach AGENTS.md czy w second brain?

</summary>

Lokalne konwencje folderu (styl testów, moduły, których nie wolno ruszać) trzymaj przy kodzie - w drzewie `AGENTS.md` wersjonowanym razem z plikami, jak we wzorcu DOX. W second brain trzymaj to, co przekracza jedno repozytorium: decyzje architektoniczne z uzasadnieniem, standardy wspólne dla projektów, historię odrzuconych podejść. Graf symboli uzupełnia oba - pamięta strukturę, której nie opisuje żaden markdown.

</details>
