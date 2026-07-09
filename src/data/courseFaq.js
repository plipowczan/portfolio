// Shared source for the objections FAQ, rendered on the /llm-wiki/kurs hub
// (open list + FAQPage JSON-LD) and the /llm-wiki landing (collapsed
// accordion, no schema). Single copy so the two pages cannot drift. The
// `surfaces` field stays per entry so a future item can target one page only.
//
// Source of truth for the objections themselves: the internal
// "obiekcje-klientow.md" notes in the (private, out-of-repo) course project
// docs. New objections land there first; entries here are plain-Polish adaptations
// following .claude/rules/content/10-prosty-polski.md (terms defined at first
// use per page; hub and landing both render the prerequisites list earlier,
// so LLM/agent/markdown/git/RAG/embeddings are already glossed on-page).

export const COURSE_FAQ_HEADING = "Najczęstsze obiekcje";

export const courseFaq = [
  {
    id: "po-co-baza",
    question: "Po co mi taka baza? Notatki mam, pamięć też.",
    answer:
      "Wiedza zdobyta raz zwykle się ulatnia: rozwiązujesz problem z agentem, " +
      "a miesiąc później zaczynasz od zera. Baza zamienia ten jednorazowy koszt " +
      "w zasób, który rośnie z każdym źródłem. Korzystasz z niej w dwie strony: " +
      "Ty dostajesz pamięć, która nie zapomina, a agent - kontekst, dzięki " +
      "któremu pracuje według Twoich decyzji i standardów. Mózg zostaje od " +
      "intuicji i ocen; baza przejmuje dokładne przypominanie i objętość.",
    surfaces: ["hub", "landing"],
  },
  {
    id: "co-gdy-padnie",
    question: "Co, gdy narzędzie padnie albo zniknie internet?",
    answer:
      "Baza to zwykłe pliki markdown w repozytorium git na Twoim dysku - bez " +
      "chmury, bez dodatkowej bazy danych, bez zamkniętego formatu. Bez " +
      "internetu otwierasz noty w dowolnym edytorze i czytasz je jak każdy " +
      "tekst. Bez AI baza staje się dobrze zorganizowanym katalogiem notatek - " +
      "nadal użytecznym. A gdy jakiś serwis zniknie, git clone oznacza, że " +
      "masz wszystko u siebie.",
    surfaces: ["hub", "landing"],
  },
  {
    id: "grep-vs-indeks",
    question: "Agent ma grep - po co mu jeszcze indeks?",
    answer:
      "Grep (wyszukiwanie w plikach po dokładnym słowie) wystarcza, gdy baza " +
      "jest mała, a Ty znasz szukane słowo - i agent wciąż go używa. Przy " +
      "setkach not częste słowo zwraca dziesiątki trafień, agent wczytuje je " +
      "wszystkie i jedno pytanie kosztuje dziesiątki tysięcy tokenów " +
      "(jednostek, w których model rozlicza tekst). Indeks najpierw zawęża " +
      "zakres do 2-3 właściwych not, a grep szuka już tylko wewnątrz nich. To " +
      "nie konkurencja - indeks naprawia skalowanie grepa.",
    surfaces: ["hub", "landing"],
  },
  {
    id: "po-co-placic",
    question: "Po co płacić, skoro sam to zbuduję?",
    answer:
      "Masz rację - metodę, szablon i kurs dostajesz za darmo, bo chcę, żebyś " +
      "umiał zbudować bazę samodzielnie. Płatne będą tylko gotowe paczki " +
      "wiedzy: setki obrobionych not, na które ktoś poświęcił miesiące " +
      "czytania, destylacji i porządkowania. Kupujesz zapełnioną półkę, nie " +
      "instrukcję jej budowy. Wolisz zapełnić ją sam - zbuduj, kurs w " +
      "zupełności wystarczy.",
    surfaces: ["hub", "landing"],
  },
  {
    id: "projekty-per-model",
    question:
      "Mam osobne Projekty w Claude, ChatGPT i Gemini i porównuję wyniki - " +
      "po co mi baza?",
    answer:
      "Porównywanie kilku modeli to dobry nawyk, zostaw go. Problem jest gdzie " +
      "indziej: dziś każdy Projekt (osobne miejsce na wiedzę wewnątrz danego " +
      "czatu) karmisz osobną kopią tej samej wiedzy, a te kopie z czasem się " +
      "rozjeżdżają. Wtedy różnica w odpowiedziach może brać się nie z modelu, " +
      "tylko z tego, że jeden Projekt był nieaktualny. Trzymaj wiedzę raz - w " +
      "plikach - i ładuj ten sam wsad do wszystkich trzech. Porównanie robi się " +
      "uczciwe, bo różni się tylko model. A w bonusie: te same pliki czyta agent " +
      "pracujący za Ciebie i zostają u Ciebie, gdy któryś dostawca zniknie.",
    surfaces: ["hub"],
  },
  {
    id: "agents-md-i-narzedzia-kodu",
    question:
      "Mam już AGENTS.md i narzędzia do analizy kodu - po co mi jeszcze " +
      "osobna baza wiedzy?",
    answer:
      "Te narzędzia robią co innego, więc się nie wykluczają. Graf symboli albo " +
      "LSP (narzędzia, które automatycznie czytają strukturę kodu) pamiętają, JAK " +
      "kod wygląda: co się z czym wywołuje i co pęknie po zmianie. Plik AGENTS.md " +
      "pamięta lokalne zasady jednego folderu i znika razem z tym repozytorium " +
      "(repo - katalog projektu w gicie). Baza wiedzy dokłada trzecią warstwę, " +
      "której żadne z nich nie ma: DLACZEGO kod tak wygląda - jakie decyzje " +
      "podjęliśmy, co odrzuciliśmy, jaki standard obowiązuje ponad jednym " +
      "projektem. Ta warstwa jest przenośna (git clone i masz ją w każdym repo). " +
      "Efekt: agent przed przebudową kodu czyta 'czemu tak zdecydowaliśmy', a po " +
      "naprawie błędu zapisuje 'czego próbowaliśmy i co nie zadziałało' - i ta " +
      "wiedza nie ginie między projektami. Kod nie zapisuje intencji. Baza wiedzy " +
      "tak.",
    surfaces: ["hub"],
  },
];
