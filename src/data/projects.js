export const projects = [
  {
    id: 1,
    title: "Note Taker + Add-ons",
    description:
      "System do automatycznego przetwarzania notatek ze spotkań (Fireflies) poprzez Airtable. Umożliwia kompleksowe zarządzanie informacjami z rozmów biznesowych, analizę spotkań, wykorzystanie w innych narzędziach i procesowanie przez AI z różnymi promptami.",
    image: "/images/project-notetaker.jpg",
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
    title: "Lead Generator",
    description:
      "System do automatycznego generowania bazy kontaktów na podstawie Google Search, Apollo, The Company API. Automatyczne generowanie leadów dla zadanych parametrów, szybkie budowanie bazy kontaktów i automatyczna weryfikacja danych.",
    image: "/images/project-leadgen.jpg",
    technologies: ["n8n", "Snov.io", "Apollo", "The Company API", "Airtable"],
    liveUrl: "https://automation.house",
    featured: true,
  },
  {
    id: 3,
    title: "Context-based Chatbot",
    description:
      "Inteligentny chatbot/voicebot do komunikacji na stronach www i messengerach wykorzystujący AI do kontekstowych rozmów. System rozumie intencje użytkownika, prowadzi naturalne konwersacje o ofercie i może wykonywać automatyczne akcje.",
    image: "/images/project-chatbot.jpg",
    technologies: ["VAPI", "n8n", "OpenAI", "Qdrant", "Meilisearch"],
    liveUrl: "https://automation.house",
    featured: true,
  },
  {
    id: 4,
    title: "Integracja Systemów - PHU Impex",
    description:
      "Kompleksowy system synchronizacji danych między SQL Server, Airtable i BigQuery. Umożliwia wygodne przetwarzanie danych finansowo-księgowych w nowoczesnym interfejsie, synchronizację na żądanie i automatyczną oraz przygotowanie do analityki BI.",
    image: "/images/project-integration.jpg",
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
    title: "Frontdesk AI",
    description:
      "System do automatycznego przetwarzania i kategoryzacji poczty przychodzącej. Analizuje wiadomości email, klasyfikuje według kategorii, automatycznie odpowiada na najczęstsze pytania i wykonuje routing do odpowiednich osób.",
    image: "/images/project-frontdesk.jpg",
    technologies: ["Make", "OpenAI", "Gmail API", "Outlook"],
    liveUrl: "https://automation.house",
    featured: false,
  },
  {
    id: 6,
    title: "Automatyzacje Dokumentów",
    description:
      "Kompleksowe systemy do przetwarzania, generowania i obiegu dokumentów. Automatyczne generowanie umów, dokumentacji projektowej, integracja z podpisem elektronicznym Autenti. Case studies: Energocentrum (fotowoltaika), Manufaktura Przygody (wycieczki szkolne).",
    image: "/images/project-documents.jpg",
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
    title: "System HRM",
    description:
      "Kompleksowy system do zarządzania Human Resources obejmujący zarządzanie urlopami, zwolnieniami lekarskimi i dostępnością pracowników. Automatyzacja procesów HR, system wniosków i automatyczne powiadomienia.",
    image: "/images/project-hrm.jpg",
    technologies: ["Airtable", "Make", "Slack", "Email"],
    featured: false,
  },
  {
    id: 8,
    title: "Lead Enrichment",
    description:
      "System automatycznego uzupełniania i wzbogacania danych kontaktowych w CRM. Pozyskuje dodatkowe informacje o firmach, decydentach i kontaktach biznesowych z różnych źródeł, aktualizuje dane w CRM.",
    image: "/images/project-enrichment.jpg",
    technologies: ["n8n", "Perplexity AI", "CRM Connectors"],
    liveUrl: "https://automation.house",
    featured: false,
  },
  {
    id: 9,
    title: "Ankiety & Badania Satysfakcji",
    description:
      "System do automatycznej obsługi ankiet i badań satysfakcji klientów oraz pracowników. Automatyczna wysyłka w kluczowych momentach customer journey, zbieranie odpowiedzi, analiza wyników z AI i generowanie raportów.",
    image: "/images/project-surveys.jpg",
    technologies: ["Tally", "Airtable", "Make", "OpenAI"],
    featured: false,
  },
];
