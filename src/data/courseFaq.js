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
];
