// Shared source for the "Dla kogo jest ten kurs" section, rendered on the
// /llm-wiki landing and the /llm-wiki/kurs hub. Single copy so the two pages
// cannot drift. Definitions follow .claude/rules/content/10-prosty-polski.md
// (one plain-Polish sentence per term).

export const COURSE_AUDIENCE_HEADING = "Dla kogo jest ten kurs";

export const courseAudienceDescription =
  "Dla osób, które zbierają wiedzę (notatki, artykuły, transkrypty) i chcą, " +
  "żeby agent AI porządkował ją i odpowiadał na pytania z ich własnych źródeł. " +
  "Nie musisz programować - wystarczy, że nie boisz się terminala, masz konto " +
  "na GitHubie i dostęp do Claude Code.";

export const coursePrerequisitesIntro =
  "Te pojęcia wystarczy kojarzyć - każde z nich tłumaczymy też w lekcjach:";

export const coursePrerequisites = [
  {
    term: "LLM",
    definition:
      "duży model językowy - silnik narzędzi takich jak ChatGPT czy Claude, który rozumie i generuje tekst.",
  },
  {
    term: "agent",
    definition:
      "program oparty na LLM, który sam wykonuje kolejne kroki: czyta pliki, uruchamia komendy, zapisuje wyniki.",
  },
  {
    term: "Claude Code",
    definition:
      "agent od Anthropic działający w terminalu - w kursie to on buduje i utrzymuje Twoją bazę.",
  },
  {
    term: "markdown",
    definition:
      "prosty format tekstu (nagłówki przez #, listy przez -); pliki .md otworzysz w każdym edytorze.",
  },
  {
    term: "git + GitHub",
    definition:
      "system wersjonowania plików i serwis do trzymania repozytoriów; wystarczy, że umiesz sklonować repo i zapisać zmiany.",
  },
  {
    term: "RAG",
    definition:
      "technika, w której model przed odpowiedzią przeszukuje Twoje dokumenty; kurs pokazuje podejście, które ją odwraca.",
  },
  {
    term: "embeddings",
    definition:
      "liczbowe reprezentacje tekstu do wyszukiwania podobieństw; w tej bazie niepotrzebne - wystarczą indeksy.",
  },
];
