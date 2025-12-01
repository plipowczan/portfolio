export const projects = [
  {
    id: 1,
    slug: "note-taker-addons",
    title: "Note Taker + Add-ons",
    description:
      "System do automatycznego przetwarzania notatek ze spotkań (Fireflies) poprzez Airtable. Umożliwia kompleksowe zarządzanie informacjami z rozmów biznesowych, analizę spotkań, wykorzystanie w innych narzędziach i procesowanie przez AI z różnymi promptami.",
    fullDescription: `
## O projekcie

System "Note Taker + Add-ons" to zaawansowane rozwiązanie automatyzujące proces przetwarzania notatek ze spotkań biznesowych. Integruje on narzędzie do transkrypcji Fireflies z bazą danych Airtable, tworząc centralne repozytorium wiedzy z rozmów.

Głównym celem projektu było wyeliminowanie ręcznego przepisywania notatek i zapewnienie łatwego dostępu do kluczowych informacji z każdego spotkania. System automatycznie pobiera transkrypcje, analizuje je przy użyciu modeli AI (Claude 3.5 Sonnet, GPT-4o) i wyciąga najważniejsze wnioski, zadania oraz decyzje.

## Jak to działa

1. **Nagrywanie i Transkrypcja**: Fireflies automatycznie dołącza do spotkań i tworzy transkrypcję.
2. **Synchronizacja**: Make (dawniej Integromat) pobiera dane i przesyła je do Airtable.
3. **Analiza AI**: Wykorzystując API OpenAI i Anthropic, system analizuje treść rozmowy pod kątem zdefiniowanych kryteriów (np. budżet, terminy, ryzyka).
4. **Dystrybucja**: Podsumowania są automatycznie wysyłane do odpowiednich osób lub systemów (np. Slack, CRM).
    `,
    features: [
      "Automatyczna synchronizacja z Fireflies",
      "Analiza sentymentu i kluczowych wątków przez AI",
      "Generowanie zadań w systemach Project Management",
      "Wyszukiwanie semantyczne w bazie wiedzy",
      "Automatyczne tagowanie spotkań",
    ],
    benefits: [
      "Oszczędność 5-10 godzin tygodniowo na notatkach",
      "Brak utraconych informacji z rozmów",
      "Szybsze wdrażanie nowych pracowników dzięki bazie wiedzy",
      "Lepsza jakość danych w CRM",
    ],
    image: "/images/og-note-taker-addons.webp",
    technologies: [
      "Make",
      "Airtable",
      "Fireflies",
      "Claude 3.5 Sonnet",
      "OpenAI GPT-4o",
      "AION",
    ],
    liveUrl: "https://automation.house",
    featured: true,
  },
  {
    id: 2,
    slug: "lead-generator",
    title: "Lead Generator",
    description:
      "System do automatycznego generowania bazy kontaktów na podstawie Google Search, Apollo, The Company API. Automatyczne generowanie leadów dla zadanych parametrów, szybkie budowanie bazy kontaktów i automatyczna weryfikacja danych.",
    fullDescription: `
## O projekcie

Lead Generator to narzędzie stworzone do automatyzacji procesu pozyskiwania klientów B2B. Agreguje dane z wielu źródeł, takich jak Google Search, Apollo czy The Company API, aby stworzyć spójną i zweryfikowaną bazę kontaktów.

System pozwala na zdefiniowanie profilu idealnego klienta (ICP), a następnie automatycznie wyszukuje pasujące firmy, znajduje osoby decyzyjne i weryfikuje ich dane kontaktowe. Dzięki temu zespół sprzedaży otrzymuje gotowe do wykorzystania leady, co znacząco zwiększa efektywność działań outboundowych.

## Proces

1. **Wyszukiwanie**: Określenie kryteriów i scraping wyników wyszukiwania.
2. **Wzbogacanie**: Pobieranie szczegółowych danych o firmach i pracownikach z API zewnętrznych.
3. **Weryfikacja**: Sprawdzanie poprawności adresów email i numerów telefonów.
4. **Eksport**: Przekazanie gotowych leadów do systemu CRM lub kampanii cold mailingowej.
    `,
    features: [
      "Agregacja danych z wielu źródeł (Google, Apollo, LinkedIn)",
      "Automatyczna weryfikacja adresów email",
      "Wzbogacanie danych o informacje finansowe i technologiczne",
      "Integracja z systemami CRM (Pipedrive, HubSpot)",
      "Skalowalne procesy scrapingu",
    ],
    benefits: [
      "Zwiększenie liczby leadów o 300%",
      "Redukcja czasu poświęconego na research o 90%",
      "Wyższa jakość danych kontaktowych",
      "Automatyzacja procesu prospectingowego",
    ],
    image: "/images/og-lead-generator.webp",
    technologies: ["n8n", "Snov.io", "Apollo", "The Company API", "Airtable"],
    liveUrl: "https://automation.house",
    featured: true,
  },
  {
    id: 3,
    slug: "context-based-chatbot",
    title: "Context-based Chatbot",
    description:
      "Inteligentny chatbot/voicebot do komunikacji na stronach www i messengerach wykorzystujący AI do kontekstowych rozmów. System rozumie intencje użytkownika, prowadzi naturalne konwersacje o ofercie i może wykonywać automatyczne akcje.",
    fullDescription: `
## O projekcie

Context-based Chatbot to rozwiązanie nowej generacji w obsłudze klienta. W przeciwieństwie do tradycyjnych chatbotów opartych na sztywnych drzewach decyzyjnych, ten system wykorzystuje zaawansowane modele językowe (LLM) i bazy wektorowe do prowadzenia naturalnych, kontekstowych rozmów.

System "uczy się" na podstawie dostarczonej bazy wiedzy (dokumenty, strona www, historia rozmów) i potrafi odpowiadać na skomplikowane pytania, rozumiejąc niuanse i intencje użytkownika. Może również działać jako voicebot, obsługując połączenia telefoniczne.

## Możliwości

- **Obsługa klienta 24/7**: Automatyczne odpowiedzi na pytania o każdej porze.
- **Generowanie leadów**: Kwalifikacja potencjalnych klientów w trakcie rozmowy.
- **Rezerwacja terminów**: Integracja z kalendarzami do umawiania spotkań.
- **Wsparcie techniczne**: Rozwiązywanie problemów na podstawie dokumentacji technicznej.
    `,
    features: [
      "Pamięć kontekstowa rozmowy",
      "Integracja z bazą wiedzy (RAG - Retrieval Augmented Generation)",
      "Obsługa głosowa (Voicebot) dzięki VAPI",
      "Wielojęzyczność",
      "Analiza sentymentu w czasie rzeczywistym",
    ],
    benefits: [
      "Redukcja kosztów obsługi klienta",
      "Zwiększenie konwersji na stronie",
      "Lepsze doświadczenie użytkownika (UX)",
      "Dostępność usług 24/7",
    ],
    image: "/images/og-context-based-chatbot.webp",
    technologies: ["VAPI", "n8n", "OpenAI", "Qdrant", "Meilisearch"],
    liveUrl: "https://automation.house",
    featured: true,
  },
  {
    id: 4,
    slug: "integracja-systemow-phu-impex",
    title: "Integracja Systemów - PHU Impex",
    description:
      "Kompleksowy system synchronizacji danych między SQL Server, Airtable i BigQuery. Umożliwia wygodne przetwarzanie danych finansowo-księgowych w nowoczesnym interfejsie, synchronizację na żądanie i automatyczną oraz przygotowanie do analityki BI.",
    fullDescription: `
## O projekcie

Projekt dla PHU Impex polegał na stworzeniu nowoczesnej warstwy danych integrującej systemy legacy (oparte na SQL Server) z nowoczesnymi narzędziami chmurowymi (Airtable, BigQuery). Celem było usprawnienie procesów finansowo-księgowych i umożliwienie zaawansowanej analityki biznesowej.

System działa dwukierunkowo: pobiera dane z systemów ERP do Airtable, gdzie pracownicy mogą je łatwo edytować i uzupełniać, a następnie synchronizuje zmiany z powrotem do bazy SQL oraz przesyła je do hurtowni danych BigQuery na potrzeby raportowania w Power BI.

## Wyzwania

Głównym wyzwaniem była zapewnienie spójności danych przy dużej wolumenie transakcji oraz obsługa specyficznych reguł biznesowych klienta. Zastosowano zaawansowane mechanizmy logowania błędów i walidacji danych.
    `,
    features: [
      "Dwukierunkowa synchronizacja SQL Server <-> Airtable",
      "Automatyczny pipeline ETL do BigQuery",
      "Interfejs użytkownika w Airtable do edycji danych",
      "Raportowanie w czasie rzeczywistym w Power BI",
      "Obsługa błędów i powiadomienia o awariach",
    ],
    benefits: [
      "Eliminacja ręcznego wprowadzania danych",
      "Dostęp do aktualnych raportów finansowych",
      "Zwiększenie kontroli nad procesami księgowymi",
      "Możliwość pracy zdalnej na danych z ERP",
    ],
    image: "/images/og-integracja-systemow-phu-impex.webp",
    technologies: [
      "Make Agent",
      "Python",
      "SQL Server",
      "Airtable",
      "BigQuery",
      "Power BI",
    ],
    featured: false,
  },
  {
    id: 5,
    slug: "frontdesk-ai",
    title: "Frontdesk AI",
    description:
      "System do automatycznego przetwarzania i kategoryzacji poczty przychodzącej. Analizuje wiadomości email, klasyfikuje według kategorii, automatycznie odpowiada na najczęstsze pytania i wykonuje routing do odpowiednich osób.",
    fullDescription: `
## O projekcie

Frontdesk AI to inteligentny asystent poczty email, który przejmuje rolę pierwszej linii wsparcia. System monitoruje skrzynkę odbiorczą, analizuje treść każdej wiadomości i podejmuje odpowiednie działania: od kategoryzacji, przez automatyczne odpowiedzi, aż po tworzenie zadań w systemach zewnętrznych.

Dzięki wykorzystaniu AI, system rozumie kontekst wiadomości, potrafi odróżnić fakturę od zapytania ofertowego czy reklamacji, i skierować sprawę do odpowiedniego działu.

## Funkcjonalności

- **Klasyfikacja**: Automatyczne przypisywanie etykiet i kategorii.
- **Auto-responder**: Inteligentne odpowiedzi na powtarzalne pytania.
- **Ekstrakcja danych**: Wyciąganie kluczowych informacji (np. numer zamówienia, NIP) z treści maila.
- **Routing**: Przekazywanie wiadomości do odpowiednich pracowników.
    `,
    features: [
      "Integracja z Gmail i Outlook",
      "Klasyfikacja oparta na AI",
      "Inteligentne szablony odpowiedzi",
      "Wykrywanie pilnych wiadomości",
      "Automatyczne tworzenie ticketów w systemach Helpdesk",
    ],
    benefits: [
      "Szybszy czas reakcji na zgłoszenia klientów",
      "Odciążenie pracowników od rutynowej obsługi poczty",
      "Lepsza organizacja skrzynki odbiorczej",
      "Brak przeoczonych wiadomości",
    ],
    image: "/images/og-frontdesk-ai.webp",
    technologies: ["Make", "OpenAI", "Gmail API", "Outlook"],
    liveUrl: "https://automation.house",
    featured: false,
  },
  {
    id: 6,
    slug: "automatyzacje-dokumentow",
    title: "Automatyzacje Dokumentów",
    description:
      "Kompleksowe systemy do przetwarzania, generowania i obiegu dokumentów. Automatyczne generowanie umów, dokumentacji projektowej, integracja z podpisem elektronicznym Autenti. Case studies: Energocentrum (fotowoltaika), Manufaktura Przygody (wycieczki szkolne).",
    fullDescription: `
## O projekcie

Projekt ten obejmuje serię wdrożeń systemów automatyzacji obiegu dokumentów dla różnych klientów. Głównym celem jest przyspieszenie procesu tworzenia, akceptacji i podpisywania dokumentów takich jak umowy, oferty, raporty czy protokoły.

Systemy te integrują dane z CRM lub formularzy, generują dokumenty PDF na podstawie szablonów, a następnie automatycznie wysyłają je do podpisu elektronicznego (np. przez Autenti). Po podpisaniu dokumenty są archiwizowane i przesyłane do odpowiednich stron.

## Przykłady wdrożeń

- **Energocentrum**: Automatyczne generowanie umów na instalacje fotowoltaiczne wraz z dokumentacją techniczną.
- **Manufaktura Przygody**: Generowanie umów i kart wycieczek dla szkół i organizatorów turystyki.
    `,
    features: [
      "Generowanie PDF z dynamicznymi danymi",
      "Integracja z platformami e-podpisu (Autenti, DocuSign)",
      "Automatyczna archiwizacja w chmurze (Google Drive, SharePoint)",
      "Powiadomienia o statusie dokumentu",
      "Obsługa warunkowych sekcji w dokumentach",
    ],
    benefits: [
      "Skrócenie czasu procesowania umowy z dni do minut",
      "Eliminacja błędów przy przepisywaniu danych",
      "Pełna cyfryzacja obiegu dokumentów",
      "Łatwe śledzenie statusu podpisów",
    ],
    image: "/images/og-automatyzacje-dokumentow.webp",
    technologies: [
      "Make",
      "n8n",
      "Airtable",
      "Google Docs",
      "htmlcsstoimage",
      "Autenti",
    ],
    featured: false,
  },
  {
    id: 7,
    slug: "system-hrm",
    title: "System HRM",
    description:
      "Kompleksowy system do zarządzania Human Resources obejmujący zarządzanie urlopami, zwolnieniami lekarskimi i dostępnością pracowników. Automatyzacja procesów HR, system wniosków i automatyczne powiadomienia.",
    fullDescription: `
## O projekcie

System HRM to dedykowane rozwiązanie stworzone w oparciu o narzędzia no-code (Airtable, Make) do zarządzania procesami kadrowymi w małych i średnich firmach. Zastępuje on skomplikowane arkusze kalkulacyjne i drogier systemy ERP, oferując elastyczność i łatwość obsługi.

System umożliwia pracownikom składanie wniosków urlopowych przez prosty formularz, automatyzuje proces akceptacji przez przełożonych i aktualizuje kalendarz dostępności zespołu. Obsługuje również zwolnienia lekarskie i inne nieobecności.

## Główne moduły

- **Zarządzanie urlopami**: Wnioski, limity urlopowe, akceptacje.
- **Ewidencja czasu pracy**: Raportowanie godzin i projektów.
- **Onboarding/Offboarding**: Listy zadań i procesy wdrażania pracowników.
- **Baza pracowników**: Centralne repozytorium danych kadrowych.
    `,
    features: [
      "Samoobsługowy portal dla pracowników",
      "Automatyczne powiadomienia na Slack/Email",
      "Integracja z Kalendarzem Google",
      "Raportowanie wykorzystania urlopów",
      "Elastyczne definiowanie typów nieobecności",
    ],
    benefits: [
      "Przejrzystość dostępności zespołu",
      "Usprawnienie komunikacji na linii pracownik-HR",
      "Redukcja biurokracji",
      "Szybki wgląd w statystyki nieobecności",
    ],
    image: "/images/og-system-hrm.webp",
    technologies: ["Airtable", "Make", "Slack", "Email"],
    featured: false,
  },
  {
    id: 8,
    slug: "lead-enrichment",
    title: "Lead Enrichment",
    description:
      "System automatycznego uzupełniania i wzbogacania danych kontaktowych w CRM. Pozyskuje dodatkowe informacje o firmach, decydentach i kontaktach biznesowych z różnych źródeł, aktualizuje dane w CRM.",
    fullDescription: `
## O projekcie

Lead Enrichment System to narzędzie wspierające działy sprzedaży poprzez automatyczne wzbogacanie danych w systemie CRM. Często dane wprowadzane przez handlowców są niekompletne – brakuje numeru telefonu, stanowiska, czy informacji o przychodach firmy. Ten system rozwiązuje ten problem.

Wykorzystując AI (Perplexity, GPT-4) oraz specjalistyczne bazy danych, system automatycznie wyszukuje brakujące informacje w internecie i aktualizuje rekordy w CRM. Dzięki temu handlowcy mają pełny obraz klienta przed wykonaniem pierwszego kontaktu.

## Jak to działa

System monitoruje nowe rekordy w CRM. Gdy pojawi się nowy lead, uruchamia proces researchu: sprawdza stronę www firmy, profil LinkedIn, rejestry KRS/CEIDG. Zebrane dane są analizowane, standaryzowane i zapisywane w odpowiednich polach w CRM.
    `,
    features: [
      "Automatyczny research firm i osób",
      "Weryfikacja aktualności danych",
      "Kategoryzacja firm (branża, wielkość)",
      "Wyszukiwanie technologii używanych przez firmę",
      "Scoring leadów na podstawie zebranych danych",
    ],
    benefits: [
      "Lepsze targetowanie sprzedaży",
      "Oszczędność czasu handlowców na research",
      "Wyższa skuteczność cold mailingu/callingu",
      "Aktualna i czysta baza danych CRM",
    ],
    image: "/images/og-lead-enrichment.webp",
    technologies: ["n8n", "Perplexity AI", "CRM Connectors"],
    liveUrl: "https://automation.house",
    featured: false,
  },
  {
    id: 9,
    slug: "ankiety-badania-satysfakcji",
    title: "Ankiety & Badania Satysfakcji",
    description:
      "System do automatycznej obsługi ankiet i badań satysfakcji klientów oraz pracowników. Automatyczna wysyłka w kluczowych momentach customer journey, zbieranie odpowiedzi, analiza wyników z AI i generowanie raportów.",
    fullDescription: `
## O projekcie

System do automatyzacji badań satysfakcji (NPS, CSAT) pozwala na bieżące monitorowanie opinii klientów i pracowników bez angażowania dodatkowych zasobów. System integruje się z narzędziami do ankiet (Tally) oraz systemami transakcyjnymi, aby wysyłać prośby o opinię w idealnym momencie (np. po zamknięciu zgłoszenia, po zakupie).

Kluczowym elementem jest analiza odpowiedzi otwarych przez AI. System automatycznie kategoryzuje opinie (pozytywna/negatywna), wyciąga główne tematy (np. "długi czas oczekiwania", "miła obsługa") i alarmuje menedżerów w przypadku negatywnych ocen.

## Zastosowania

- **Badanie NPS**: Po zakończeniu projektu lub okresowo.
- **Badanie CSAT**: Po kontakcie z obsługą klienta.
- **Feedback produktowy**: Zbieranie opinii o nowych funkcjach.
- **Ankiety pracownicze**: Badanie nastrojów w zespole.
    `,
    features: [
      "Triggerowanie ankiet zdarzeniami w systemie",
      "Analiza sentymentu odpowiedzi otwartych",
      "Automatyczne raporty i dashboardy",
      "Alerty o niezadowolonych klientach",
      "Personalizacja ankiet",
    ],
    benefits: [
      "Szybka identyfikacja problemów i zagrożeń",
      "Lepsze zrozumienie potrzeb klientów",
      "Automatyzacja procesu zbierania feedbacku",
      "Możliwość szybkiej reakcji na negatywne opinie",
    ],
    image: "/images/og-ankiety-badania-satysfakcji.webp",
    technologies: ["Tally", "Airtable", "Make", "OpenAI"],
    featured: false,
  },
];
