---
id: 28
slug: software-3-0-agentic-engineering
title: "Software 3.0: dlaczego twoja aplikacja nie powinna istnieć"
excerpt: >-
  Trzy paradygmaty oprogramowania i nowa dyscyplina: agentic engineering.
  Mapa decyzyjna od Karpathy'ego - co budować, czego nie i czego nie da się
  outsourcować.
category: AI
author: Pawel Lipowczan
date: 2026-05-29
readTime: 9 min
image: /images/og-software-3-0-agentic-engineering.webp
tags:
  - AI
  - Agentic Engineering
  - Software 3.0
  - Karpathy
  - Vibe Coding
lang: pl
---

Człowiek, który ukuł termin **vibe coding**, powiedział, że „nigdy nie czuł się bardziej w tyle jako programista". To Andrej Karpathy - współzałożyciel OpenAI, były szef AI w Tesli. W grudniu agentowe modele przekroczyły dla niego pewien próg: kawałki kodu „po prostu wychodziły dobrze", więc przestał je poprawiać i zaufał systemowi.

To nie jest historia o tym, że kod pisze się szybciej. To historia o tym, że **programowanie zmieniło się w prompcie** - a jeśli czytasz „software" jako wszystkie cyfrowe biznesy, to znaczy, że twój produkt właśnie jest przebudowywany na AI-first, czy tego chcesz, czy nie.

Przez ostatnie miesiące buduję z agentami codziennie - całe portfolio, na którym czytasz ten tekst, i systemy w dwóch firmach. Im więcej z nimi pracuję, tym mocniej widzę, że to nie jest „kolejny hype o AI". To zmiana mapy: rośnie abstrakcja, a wraz z nią przesuwa się to, co faktycznie robi człowiek. Ten artykuł to próba narysowania tej mapy - żebyś wiedział, w którym paradygmacie działasz, gdzie jest twoja fosa i czego nie da się oddelegować.

![Diagram The Karpathy Paradigm - pięć pasów: ① trzy paradygmaty Software 1.0→2.0→3.0 (rosnąca abstrakcja), ② vibe coding podnosi podłogę vs agentic engineering trzyma sufit, ③ weryfikowalność i jagged intelligence (refactor 100k-line vs car wash), ④ co zostaje po stronie człowieka - taste, judgment, understanding, ⑤ buduj dla agentów: sensory, aktuatory, dane legible dla LLM](/images/karpathy-paradigm-software-3-0.webp)

Ten diagram to oś całego tekstu - wracam do każdego z pięciu pasów w kolejnych sekcjach.

## Trzy paradygmaty: jak „programujesz" maszynę

Karpathy układa ewolucję oprogramowania w trzy paradygmaty - i kluczem jest to, *jak* przekazujesz maszynie swoją intencję.

- **Software 1.0** - piszesz jawny kod, regułę po regule. Krok pierwszy, krok drugi, krok trzeci. Kruche, nie samonaprawialne: gdy coś wypadnie poza scenariusz, skrypt się wywraca.
- **Software 2.0** - „programujesz" przez **dane**. Nie piszesz reguł, tylko kurujesz zbiory i trenujesz wagi sieci neuronowej. Logika siedzi w wagach, nie w `if`-ach.
- **Software 3.0** - **prompting**. Okno kontekstu (context window) to twoja dźwignia nad interpreterem, którym jest LLM.

> „Software 3.0 is kind of about your programming now turns to prompting. And what's in the context window is your lever over the interpreter that is the LLM." - Andrej Karpathy

*(Programowanie zmienia się w pisanie promptów, a to, co masz w oknie kontekstu, jest twoją dźwignią nad LLM-em jako interpreterem.)*

I tu pada reframe, który zmienia ten tekst z „ciekawostki dla programistów" w coś, co dotyczy każdego, kto buduje produkt. Czytaj „software" jako **wszystkie cyfrowe biznesy**. LLM to silnik - a ty projektujesz samochód wokół niego.

> „All businesses are literally being restructured to be AI first... AI in the middle being the engine and driving them forward. But that is all the engine is. You get to design your own car."

*(Wszystkie biznesy są przebudowywane na AI-first - z AI jako silnikiem w środku. Ale to tylko silnik. To ty projektujesz swój samochód.)*

To nie jest abstrakcja. To samo widać w tym, jak firmy zaczynają działać jako systemy agentowe - z kontekstem jako trwałym aktywem i software'em jako warstwą, którą się regeneruje, gdy pojawia się lepszy model.

## Cztery przykłady, które to unaoczniają

Paradygmat brzmi abstrakcyjnie, dopóki nie zobaczysz, co robi z konkretnymi modelami biznesowymi. Karpathy daje cztery przykłady i każdy z nich to inny typ produktu, który właśnie się przesuwa.

1. **Instalator.** Zamiast pęczniejącego skryptu („krok pierwszy: zaakceptuj warunki, krok drogi: znajdź folder..."), wywołujesz agenta jedną komendą. On *posiada cel* („zainstaluj to") i sam debuguje w pętli problemy, których nigdy wcześniej nie widział. To mały, samonaprawialny „skill" - blob tekstu, który wklejasz swojemu agentowi.
2. **Aplikacja (MenuGen).** Karpathy zbudował apkę 2.0: robisz zdjęcie menu, a ona renderuje obrazy dań. Stała się „natychmiast bezużyteczna" - bo wystarczy podać zdjęcie do Gemini i powiedzieć „nałóż obrazy pozycji przez Nano Banana". Nie ma czego instalować. *„Ta aplikacja nie powinna istnieć."* I to samo nadchodzi po niemal każdą pojedynczą apkę.
3. **Kurs / wiedza ekspercka.** Od sekwencyjnych lekcji na Udemy, przez kurs przemodelowany danymi o zaangażowaniu, do agenta-coacha, który *robi to z tobą*, kiedy działasz. Nie „zadaj mi pytanie", tylko „zbuduj to ze mną".
4. **Usługa (montaż wideo).** Od ręcznego Premiere Pro, przez Descript wycinający ciszę, do pola tekstowego: „zmontuj to w wiralowym stylu MrBeast, poniżej 8 minut" - i gotowy render w kilka minut.

Wspólny mianownik jest brutalnie prosty: **Software 3.0 sprzedaje wynik (outcome), nie narzędzie.** Jeśli twój produkt jest narzędziem, które wykonuje krok, a nie dostarcza efektu - to jest na celowniku.

## Vibe coding podnosi podłogę. Agentic engineering trzyma sufit.

To jest moim zdaniem najważniejsze nowe rozróżnienie z całego wywiadu - i miejsce, gdzie najwięcej osób się myli. **Vibe coding** i **agentic engineering** to dwie różne rzeczy.

**Vibe coding podnosi PODŁOGĘ.** Każdy może teraz zbudować software. To demokratyzujące i naprawdę świetne - opisałem zresztą całe podejście w [przewodniku po vibe codingu](/blog/vibe-coding-przewodnik). Podłoga rośnie dla wszystkich.

**Agentic engineering trzyma SUFIT.** To realna dyscyplina inżynierska: utrzymać profesjonalną poprzeczkę jakości - żadnych nowych podatności, *to wciąż twój* software, ty za niego odpowiadasz - **jednocześnie** przyspieszając. Agenci to „spiky entities": zawodni, trochę stochastyczni, ale ekstremalnie potężni. Sztuką jest ich koordynować, nie obniżając przy tym poprzeczki.

> „Vibe coding is about raising the floor for everyone... agentic engineering is about preserving the quality bar of what existed before in professional software."

*(Vibe coding podnosi podłogę dla każdego; agentic engineering chroni poprzeczkę jakości, która istniała w profesjonalnym software'rze.)*

I tu jest druga strona medalu. Sufit jest bardzo wysoko. Stary „10× engineer" jest teraz wzmocniony *daleko* poza 10× - dla tych, którzy są w tym dobrzy. To nie jest gra o zerowej sumie między „AI" a „człowiekiem". To dźwignia, która rozjeżdża różnicę między kimś, kto umie kierować agentami, a kimś, kto tylko klika „akceptuj".

## Weryfikowalność - nowe ograniczenie

Skąd biorą się mocne i słabe strony tych modeli? Karpathy daje na to jedno z najlepszych wyjaśnień, jakie słyszałem, i sprowadza się ono do jednego słowa: **weryfikowalność**.

> „The previous generation of computers automated what you could specify. This generation automates what you can verify."

*(Poprzednia generacja komputerów automatyzowała to, co umiałeś zaprogramować. Ta generacja automatyzuje to, co umiesz zweryfikować.)*

Modele frontierowe trenuje się w gigantycznych środowiskach RL (reinforcement learning, uczenie ze wzmocnieniem) z nagrodami za weryfikację. Dlatego ich możliwości są **jagged** - postrzępione: szczyty tam, gdzie wynik da się zweryfikować (kod, matematyka), doliny gdzie indziej. Jaggedness = to, co *weryfikowalne*, **plus** to, na czym laby akurat zdecydowały się trenować.

> „How is it possible that a state-of-the-art model will refactor a 100,000-line codebase or find zero-day vulnerabilities, and yet tell me to walk to a car wash 50 metres away?"

*(Jak to możliwe, że topowy model zrefaktoruje kod na 100 tysięcy linii albo znajdzie podatność zero-day, a jednocześnie każe mi iść do myjni oddalonej o 50 metrów?)*

Dla foundera płynie z tego konkretny wniosek. Problem **weryfikowalny** jest dziś wykonalny - możesz rzucić w niego RL, zbudować własne środowiska RL albo zrobić fine-tune. To jest twoja fosa, niezależna od tego, co akurat priorytetyzują wielkie laby. Jeśli umiesz tanio i automatycznie sprawdzić, czy wynik jest dobry, masz dźwignię, której konkurencja bez tej weryfikacji nie ma.

## Czego nie da się outsourcować

To jest emocjonalny rdzeń całej tezy. Skoro agent zrefaktoruje 100 tysięcy linii, to co właściwie zostaje po stronie człowieka?

Zostaje **smak, osąd i nadzór**. Ty trzymasz spec, plan i top-level design - agent „wypełnia luki". Zostają też **fundamenty ponad trivia API**. Karpathy nie pamięta już, czy to `keepdim` czy `axis`, `reshape` czy `permute` - „stażysta" ma do tego idealną pamięć. Ale ty wciąż musisz rozumieć, co dzieje się pod spodem (np. jak działają widoki tensora i pamięć), żeby nie kopiować po cichu danych w niewłaściwym miejscu.

A na samym dnie jest jedna rzecz, której nie oddasz nigdy:

> „You can outsource your thinking, but you can't outsource your understanding."

*(Myślenie możesz oddelegować. Zrozumienia - nie.)*

Karpathy mówi wprost, że czuje się teraz **wąskim gardłem** - to on wie, co zbudować i dlaczego, i to on kieruje agentami. I dobrze ilustruje to anegdota o zawodności: agent w MenuGenie próbował dopasowywać użytkowników, korelując **adresy e-mail** ze Stripe i Google, zamiast użyć trwałego ID użytkownika. To błąd typu „dlaczego miałbyś to w ogóle zrobić" - taki, który musi wyłapać człowiek, bo agent nie ma osądu, żeby zauważyć, że to bez sensu.

To samo widzę u siebie: agent przyspiesza wszystko, ale to ja jestem reviewerem, który decyduje, co jest poprawne. Zbudowanie własnej bazy wiedzy, którą agent utrzymuje, to dokładnie inwestycja w **zrozumienie** - opisałem ten proces w tekście o [bazie wiedzy w stylu Karpathy'ego](/blog/llm-knowledge-base-brain-karpathy).

## Buduj dla agentów, nie dla ludzi

Jeśli agenci stają się głównym „użytkownikiem" twoich systemów, to logiczna konsekwencja jest taka, że trzeba zacząć projektować *dla nich*. Karpathy ma z tym swój prywatny problem (pet peeve - rzecz, która szczególnie go drażni): dokumentacja wciąż jest pisana dla ludzi. „Dlaczego ludzie wciąż mówią mi, co mam zrobić? Co jest tą rzeczą, którą mam wkleić mojemu agentowi?"

Kierunek jest taki:

- Opisuj systemy **najpierw agentom**.
- Rozkładaj pracę na **sensory** (czytają świat) i **aktuatory** (działają na świecie).
- Trzymaj struktury danych **legible** - czytelne dla LLM-a.

Docelowo zmierzamy do świata, w którym „mój agent rozmawia z twoim agentem" - żeby np. umówić spotkanie. A skoro tak, to nawet **rekrutacja** wymaga przebudowy. Zamiast łamigłówek algorytmicznych dajesz kandydatowi duży projekt - np. „zbuduj bezpiecznego Twitter-clone'a dla agentów, a potem niech 10 agentów próbuje go złamać" - i obserwujesz, *jak* włada narzędziami. Bo to władanie narzędziami, a nie recytowanie z pamięci, jest teraz prawdziwą kompetencją.

## Nie zwierzęta, lecz duchy

Na koniec metafora, która porządkuje całe nastawienie. Karpathy mówi, że nie budujemy zwierząt - *przywołujemy duchy*.

> „We're not building animals. We are summoning ghosts."

*(Nie budujemy zwierząt. Przywołujemy duchy.)*

To statystyczne obwody symulacji - substrat z pre-treningu z doklejonym RL - a nie inteligencje ukształtowane przez ciekawość i ewolucję. Krzyczenie na nie nic nie da. Wartość tej metafory jest praktyczna: to *nastawienie*. Bądź odpowiednio podejrzliwy i sprawdzaj empirycznie, co działa, zamiast zakładać, że model „rozumie" tak jak człowiek.

I tu wracam do ciebie. **W którym paradygmacie jest twój produkt** - 1.0, 2.0 czy 3.0? A kiedy wielkie LLM-y będą umiały zrobić twoje zadanie wprost, **co zostanie twoją fosą?** Karpathy zostawia cztery odpowiedzi:

1. **Dane** - zastrzeżone zbiory, własne środowiska RL, model wytrenowany na *twojej* wiedzy i stylu.
2. **Prompty i kontekst** - wypracowane systemy kontekstu i baza wiedzy, którymi sterujesz silnikiem.
3. **System design** - sensory, aktuatory, UX i pętle weryfikacji wokół modelu. Silnik to tylko silnik; ty projektujesz samochód.
4. **Zaufanie** - marka i odpowiedzialność za wynik. „Wytrenowałem LLM na całej wiedzy Elona" brzmi inaczej od przypadkowej osoby, a inaczej od samego Elona. Tego model nie kupi.

Jeśli twoja przewaga nie siedzi w żadnej z tych czterech fos, to warto zadać sobie to niewygodne pytanie wcześniej niż później.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz przebudować swój produkt na agentic engineering?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci ocenić, w którym paradygmacie działasz, gdzie jest Twoja fosa i jak wdrożyć agentów bez obniżania poprzeczki jakości - od architektury kontekstu po pętle weryfikacji.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>

## Przydatne zasoby

- [Andrej Karpathy: From Vibe Coding to Agentic Engineering](https://www.youtube.com/watch?v=96jN2OCOfLs) - Sequoia Capital, 29:49. Źródło pierwotne całej tezy: vibe→agentic, weryfikowalność, jagged intelligence.
- [Kaparthy revealed the most profitable business to build (Software 3.0)](https://www.youtube.com/watch?v=hJNp9RwK-Uw) - Dream Labs AI, 14 min. Ujęcie biznesowe paradygmatów i czterech fos.
- [Vibe coding: przewodnik](/blog/vibe-coding-przewodnik) - jak podnieść podłogę, czyli druga strona tego rozróżnienia.
- [Baza wiedzy w stylu Karpathy'ego](/blog/llm-knowledge-base-brain-karpathy) - jak budować fosę danych i kontekstu.

## FAQ

<details open>
<summary>

### Czym różni się Software 3.0 od Software 1.0 i 2.0 według Karpathy'ego?

</summary>

Software 1.0 to pisanie jawnego kodu reguła po regule, Software 2.0 to programowanie przez kurowanie danych i trenowanie wag sieci neuronowej, a Software 3.0 to **prompting** - sterowanie LLM-em przez okno kontekstu. W 3.0 to, co wpisujesz w context window, staje się twoją dźwignią nad modelem traktowanym jak interpreter. Praktyczna konsekwencja: zamiast budować narzędzie, projektujesz system wokół silnika-LLM, który dostarcza gotowy wynik.

</details>

<details open>
<summary>

### Czym różni się vibe coding od agentic engineering?

</summary>

Vibe coding „podnosi podłogę" - sprawia, że każdy może zbudować software, co jest demokratyzujące. Agentic engineering „trzyma sufit" - to dyscyplina inżynierska polegająca na utrzymaniu profesjonalnej poprzeczki jakości (brak nowych podatności, odpowiedzialność za kod) przy jednoczesnym przyspieszeniu z pomocą agentów. Krótko: vibe coding to dostępność, agentic engineering to jakość pod presją tempa.

</details>

<details open>
<summary>

### Co to jest jagged intelligence w modelach AI?

</summary>

Jagged intelligence (postrzępiona inteligencja) to zjawisko, w którym model ma szczyty możliwości w domenach weryfikowalnych, jak kod czy matematyka, i doliny w innych zadaniach. Wynika to z treningu w środowiskach RL z nagrodami za weryfikację - model jest świetny tam, gdzie wynik da się automatycznie sprawdzić. Stąd paradoks: ten sam model zrefaktoruje 100 tysięcy linii kodu, a pomyli się przy prostym zadaniu z życia codziennego.

</details>

<details open>
<summary>

### Czego nie da się outsourcować agentom AI przy budowie produktu?

</summary>

Nie da się oddelegować zrozumienia, osądu i nadzoru - jak ujmuje to Karpathy, „myślenie możesz oddelegować, zrozumienia nie". Człowiek zostaje właścicielem specyfikacji, planu i top-level designu, a agent wypełnia luki. Liczą się też fundamenty (rozumienie, co dzieje się pod spodem), bo agent potrafi popełnić bezsensowny błąd, którego sam nie wychwyci.

</details>

<details open>
<summary>

### Jak budować produkt „agent-native", czyli dla agentów, a nie tylko dla ludzi?

</summary>

Opisuj systemy najpierw agentom (np. blok instrukcji do wklejenia, a nie dokumentacja dla człowieka), rozkładaj pracę na sensory czytające świat i aktuatory działające na świecie oraz trzymaj dane w formie legible dla LLM. Celem jest świat, w którym „mój agent rozmawia z twoim agentem". Warto też przebudować rekrutację: zamiast łamigłówek dawaj realny projekt i obserwuj, jak kandydat włada narzędziami.

</details>
