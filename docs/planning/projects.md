# Portfolio Projektów No-Code

Katalog zrealizowanych i oferowanych rozwiązań automatyzacji i sztucznej inteligencji.

---

## 🤖 Note Taker + Add-ons

### Opis

System do automatycznego przetwarzania notatek ze spotkań (np. Fireflies) poprzez Airtable, umożliwiający kompleksowe zarządzanie informacjami z rozmów biznesowych.

### Główne korzyści

- Analiza spotkań i szybkie przetwarzanie informacji
- Możliwość wykorzystania w innych narzędziach
- Przeprowadzanie zbiorczych analiz
- Procesowanie przez AI z różnymi promptami i kontekstami
- Łatwe wyszukiwanie i kategoryzacja informacji

### Opcje rozszerzenia (Add-ons)

- Połączenie z AION (konwersacyjny dostęp do notatek)
- Customowe procesy i automatyzacje
- Weekly podsumowania i analizy spotkań
- Integracja z systemami CRM

### Stack technologiczny

- **Automatyzacja:** Make
- **Baza danych:** Airtable
- **Nagrywanie i transkrypcja:** Fireflies
- **AI/LLM:** Claude 3.5 Sonnet/Haiku, OpenAI GPT-4o/o1
- **Interface konwersacyjny:** AION

### Uwagi

Przy zakresie szerszego wdrożenia realizowane są warsztaty dostosowujące system do specyfiki biznesu klienta.

---

## 📊 Lead Generator

### Opis

System do automatycznego generowania bazy kontaktów na podstawie Google Search z wizytówek, Apollo, The Company API i innych źródeł. Umożliwia budowanie targetowanych list potencjalnych klientów zgodnie z zadanymi parametrami kampanii.

### Główne korzyści

- Automatyczne generowanie leadów dla zadanych parametrów
- Szybkie budowanie bazy kontaktów
- Integracja z wieloma źródłami danych
- Automatyczna weryfikacja i wzbogacanie danych
- Gotowe listy do kampanii marketingowych

### Stack technologiczny

- **Automatyzacja:** n8n
- **Lead generation:** Snov.io
- **Baza danych:** Airtable
- **Źródła danych:** Google Search, Apollo, The Company API

---

## 📈 Lead Enrichment

### Opis

System automatycznego uzupełniania i wzbogacania danych kontaktowych w CRM. Pozyskuje dodatkowe informacje o firmach, decydentach i kontaktach biznesowych z różnych źródeł.

### Główne korzyści

- Automatyczne pozyskiwanie dodatkowych informacji o firmach
- Wzbogacanie profili kontaktów
- Aktualizacja danych w CRM
- Zwiększenie skuteczności sprzedaży dzięki lepszym danym

### Stack technologiczny

- **Automatyzacja:** n8n
- **AI Search:** Perplexity AI
- **Integracja:** Własne konektory do systemów CRM

---

## 🔄 Integracja Systemów i Synchronizacja Danych

### Opis

Kompleksowy system synchronizacji i integracji danych między różnymi platformami - od lokalnych baz SQL, przez środowiska przetwarzania w Airtable, aż do hurtowni danych i narzędzi Business Intelligence. Umożliwia płynny przepływ danych między systemami legacy a nowoczesnymi rozwiązaniami analitycznymi.

### Główne korzyści

- Możliwość wygodnego przetwarzania danych w nowoczesnym interfejsie
- Uporządkowanie i centralizacja danych z różnych źródeł
- Przygotowanie danych do wizualizacji i analityki BI
- Elastyczna kontrola nad synchronizacją (na żądanie i automatyczna)
- Transformacja danych dostosowana do potrzeb biznesowych
- Bridge między systemami legacy a nowoczesnymi narzędziami analitycznymi

### Stack technologiczny

- **Automatyzacja:** Make (z Make Agent na serwerze klienta)
- **Backend:** Python (custom API + synchronizator)
- **Baza źródłowa:** SQL Server (on-premise)
- **Środowisko przetwarzania:** Airtable
- **Data Warehouse:** BigQuery
- **Integracja:** Własne API i konektory

### Przykład wdrożenia: PHU Impex

System synchronizacji danych finansowo-księgowych do analizy rachunku zysków i strat:

**Architektura:**

1. **SQL Server → Airtable**

   - Make Agent na serwerze klienta
   - Custom Python API do pobierania danych z SQL Server
   - Synchronizacja na żądanie (przycisk w Airtable)
   - Transformacje na poziomie SQL query
   - Mapowanie do struktur Airtable

2. **Przetwarzanie w Airtable**

   - Wygodny interfejs do ręcznej weryfikacji i uzupełniania danych
   - Kategoryzacja i tagowanie
   - Kontrola jakości danych

3. **Airtable → BigQuery**
   - Custom Python synchronizator
   - Automatyczna synchronizacja 2x dziennie
   - Synchronizacja tylko zmienionych rekordów (tracking daty modyfikacji)
   - Przygotowanie danych do wizualizacji w Power BI

**Skala:**

- Kilka tysięcy rekordów miesięcznie
- Dane finansowo-księgowe
- Real-time processing w Airtable, scheduled sync do BigQuery

---

## 💬 Context-based Chatbots/Voicebots

### Opis

Inteligentne boty do komunikacji na stronach www, messengerach oraz voiceboty wykorzystujące AI do kontekstowych rozmów. System rozumie intencje użytkownika i prowadzi naturalne konwersacje o ofercie.

### Główne korzyści

- Kontekstowa rozmowa o ofercie 24/7
- Odciążenie lub eliminacja obsługi klienta
- Możliwość ustawienia celu rozmowy (np. umówienie spotkania, wysłanie wiadomości)
- Automatyzacja akcji (bookowanie spotkań, sprawdzanie statusu zamówień)
- Redukcja kosztów obsługi klienta

### Stack technologiczny

- **Chatboty - hosting:** n8n, VAPI
- **Voiceboty:** VAPI
- **AI/LLM:** OpenAI
- **Bazy wiedzy:**
  - CAG (Context Augmented Generation) - dla mniejszych zbiorów danych
  - Meilisearch - wyszukiwarka semantyczna
  - Qdrant - baza wektorowa
  - Supabase Vector - baza wektorowa

### Przykłady wdrożeń

- Chatbot na [automation.house](https://automation.house) - chatbot wspierający sprzedaż usług automatyzacji

---

## 📧 Frontdesk AI

### Opis

System do automatycznego przetwarzania i kategoryzacji poczty przychodzącej. Analizuje wiadomości email, klasyfikuje je według kategorii i automatycznie odpowiada na najczęstsze pytania.

### Główne korzyści

- Automatyczna obsługa zbiorczych skrzynek email
- Szybka reakcja na wiadomości
- Automatyczne odpowiedzi według FAQ
- Podstawowa automatyzacja dokumentów
- Routing wiadomości do odpowiednich osób
- Redukcja czasu obsługi korespondencji

### Stack technologiczny

- **Automatyzacja:** Make
- **AI/LLM:** OpenAI
- **Integracja:** Konektory email (Gmail, Outlook, IMAP)

---

## 📝 Ankiety & Badania Satysfakcji

### Opis

System do automatycznej obsługi ankiet i badań satysfakcji klientów oraz pracowników. Umożliwia automatyczną wysyłkę, zbieranie odpowiedzi i analizę wyników z wykorzystaniem AI.

### Główne korzyści

- Automatyczna wysyłka ankiet w kluczowych momentach customer journey
- Zbieranie i centralizacja odpowiedzi
- Analiza wyników z wykorzystaniem AI
- Generowanie raportów i insights
- Monitorowanie trendów w czasie

### Stack technologiczny

- **Formularze:** Tally (lub inne platformy)
- **Baza danych:** Airtable
- **Automatyzacja:** Make
- **AI/LLM:** OpenAI
- **Wizualizacja:** Dashboardy w Airtable

---

## 👥 HRM - System Zarządzania Zasobami Ludzkimi

### Opis

Kompleksowy system do zarządzania Human Resources obejmujący zarządzanie urlopami, zwolnieniami lekarskimi i dostępnością pracowników. Centralizuje procesy HR i automatyzuje przepływ wniosków.

### Główne korzyści

- Automatyzacja procesów HR
- Zarządzanie bazą pracowników
- System wniosków urlopowych i zwolnień
- Monitorowanie dostępności zespołu
- Automatyczne powiadomienia i przypomnienia
- Raporty i analityka HR

### Stack technologiczny

- **Baza danych:** Airtable
- **Automatyzacja:** Make
- **Powiadomienia:** Email, Slack (w zależności od konfiguracji)

---

## 📄 Customowe Automatyzacje Dokumentów

### Opis

Kompleksowe systemy do przetwarzania, generowania i obiegu dokumentów dostosowane do specyfiki biznesu klienta. Obejmują pełny cykl życia dokumentu - od generowania, przez przetwarzanie, po podpis elektroniczny i archiwizację.

### Główne korzyści

- Automatyczne generowanie dokumentów na podstawie danych z systemów
- Przetwarzanie i weryfikacja dokumentów
- Automatyczny obieg dokumentów między działami
- Integracja z systemami podpisu elektronicznego (np. Autenti)
- Archiwizacja i zarządzanie dokumentami
- Redukcja błędów manualnych
- Przyspieszenie procesów biznesowych

### Stack technologiczny

- **Automatyzacja:** Make, n8n
- **Baza danych:** Airtable
- **Generowanie dokumentów:** Google Docs
- **Generowanie grafik:** htmlcsstoimage (konwersja HTML → obraz → PDF)
- **Podpisy elektroniczne:** Autenti
- **Archiwizacja:** Integracja z systemami klienta

### Przykłady wdrożeń

#### Energocentrum - Dokumentacja Projektów Fotowoltaicznych

System do generowania różnorodnych dokumentów na kolejnych etapach realizacji projektów fotowoltaicznych:

- Automatyczne generowanie umów, specyfikacji technicznych
- Dokumentacja montażowa i odbiorcza
- Raporty i protokoły
- Synchronizacja z systemem zarządzania projektami

#### Manufaktura Przygody - Organizacja Wycieczek Szkolnych

Kompleksowy system dokumentacji dla organizacji wycieczek:

- Przetwarzanie zamówień od szkół
- Automatyczne generowanie umów
- Integracja z Autenti do elektronicznego podpisywania
- Obieg dokumentów między działami (sprzedaż, organizacja, finanse)
- Archiwizacja dokumentacji wycieczek

### Proces wdrożenia

1. **Warsztat mapowania procesu** - analiza obecnych procesów i wymagań
2. **Opcjonalnie:** PoC (Proof of Concept) dla bardziej złożonych wdrożeń
3. **Wdrożenie** - na podstawie mapy procesu lub dostarczonej dokumentacji
4. **Testy i szkolenia**

---

## Informacje Dodatkowe

### Proces Współpracy

1. **Konsultacja** - analiza potrzeb i dopasowanie rozwiązania
2. **Wdrożenie** - implementacja systemu
3. **Testy** - weryfikacja działania
4. **Szkolenia** - przeszkolenie zespołu klienta
5. **Wsparcie** - opieka powdrożeniowa

### Technologie

Projekty realizowane z wykorzystaniem narzędzi no-code/low-code:

#### Platformy automatyzacji

- **Make** - automatyzacja workflow, integracje
- **Make Agent** - agent lokalny do integracji z systemami on-premise
- **n8n** - zaawansowane automatyzacje, hosting chatbotów

#### Backend i API

- **Python** - custom API, synchronizatory danych, integracje z bazami SQL
- **FastAPI/Flask** - frameworki do budowania API

#### Bazy danych i storage

- **Airtable** - główna baza danych z dashboardami
- **Google Sheets** - alternatywne storage
- **SQL Server** - bazy danych on-premise klientów
- **BigQuery** - data warehouse do analityki

#### AI i Machine Learning

- **OpenAI** (GPT-4o, o1) - przetwarzanie języka naturalnego
- **Claude 4.5** (Sonnet, Haiku) - zaawansowane analizy i generowanie treści
- **Perplexity AI** - wyszukiwanie i wzbogacanie danych

#### Bazy wektorowe i wyszukiwarki

- **Qdrant** - baza wektorowa dla RAG
- **Meilisearch** - szybka wyszukiwarka semantyczna
- **Supabase Vector** - baza wektorowa w Supabase
- **CAG** (Context Augmented Generation) - dla mniejszych zbiorów

#### Chatboty i voiceboty

- **VAPI** - platforma voicebot i hosting chatbotów
- **AION** - konwersacyjny interfejs do danych

#### Lead generation i enrichment

- **Snov.io** - generowanie i weryfikacja leadów
- **Apollo, The Company API** - źródła danych biznesowych

#### Dokumenty i podpisy

- **Google Docs** - generowanie dokumentów tekstowych
- **htmlcsstoimage** - generowanie grafik i konwersja do PDF
- **Autenti** - podpisy elektroniczne

#### Formularze i komunikacja

- **Tally** - nowoczesne formularze
- **Typeform** - alternatywa dla formularzy
- **Fireflies** - nagrywanie i transkrypcja spotkań

#### Business Intelligence i wizualizacja

- **Airtable Dashboards** - wbudowane dashboardy analityczne
- **Power BI** - zaawansowana wizualizacja danych (integracja, przygotowanie danych)

_Uwaga: Zaawansowane wdrożenia Power BI i Business Intelligence wykraczają poza zakres standardowych usług no-code._

### Kontakt

Wszystkie projekty są realizowane z udziałem Pawła Lipowczana.

---

_Ostatnia aktualizacja: Listopad 2025_
