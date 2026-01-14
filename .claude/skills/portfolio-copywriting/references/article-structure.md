# Struktura Artykulow na Blog Portfolio

## Front Matter (YAML)

Kazdy artykul musi zawierac kompletny front matter:

```yaml
---
id: 5 # Unikalny numer (inkrementuj od ostatniego)
slug: automatyzacja-crm-w-3-krokach # URL-friendly, male litery, myslniki
title: Jak zautomatyzowac CRM w 3 krokach
excerpt: >-
  Dowiedz sie jak zautomatyzowac procesy CRM i zaoszczedzic
  15 godzin tygodniowo dzieki prostym integracjom no-code.
category: Automatyzacja # Automatyzacja | No-Code | AI
author: Pawel Lipowczan
date: 2025-12-19 # Format: YYYY-MM-DD
readTime: 10 min # Szacowany czas czytania
image: /images/og-automatyzacja-crm.webp # Sciezka do obrazka OG
tags:
  - Automatyzacja
  - CRM
  - n8n
  - Make
---
```

## Bloki kodu - Wymagania

### Zawsze używaj tagu języka

**✅ POPRAWNIE:**

````markdown
```javascript
const greeting = "Hello";
```
````

````

**✅ Gdy brak konkretnego języka, użyj `text`:**
```markdown
```text
Workflow:
1. Krok pierwszy
2. Krok drugi
````

````

**❌ NIGDY bez tagu:**
```markdown
````

const greeting = "Hello"; ← To będzie źle renderowane!

```

```

### Dostępne tagi języków

- **Kod**: `javascript`, `typescript`, `python`, `java`, `go`, `rust`, `php`, `ruby`
- **Markup**: `html`, `xml`, `markdown`, `yaml`, `json`, `toml`
- **Shell**: `bash`, `sh`, `powershell`, `cmd`
- **Inne**: `sql`, `css`, `scss`, `dockerfile`
- **Uniwersalny**: `text` (gdy żaden powyższy nie pasuje)

### Długość bloków kodu

- **Krótkie przykłady** (< 10 linii): pokazują konkretną technikę
- **Średnie** (10-30 linii): kompletny komponent/funkcja
- **Długie** (> 30 linii): unikaj, podziel na sekcje z wyjaśnieniami

### Komentarze w kodzie

- Używaj tylko gdy wyjaśniają nieoczywistą logikę
- Polski lub angielski w zależności od kontekstu
- Nie komentuj oczywistego kodu

## Kategorie

Dostepne kategorie artykulow:

| Kategoria         | Tematyka                                                              | Przyklady                                                                                        |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Automatyzacja** | Procesy biznesowe, workflow, integracje                               | n8n, Make, Zapier, automatyzacja email                                                           |
| **No-Code**       | Narzedzia low-code/no-code, budowanie aplikacji                       | Bubble, Airtable, Notion, lead generation                                                        |
| **AI**            | Sztuczna inteligencja, chatboty, LLM                                  | ChatGPT, Claude, chatboty dla biznesu                                                            |
| **Code**          | Narzedzia programowania, Projektowanie aplikacji, budowanie aplikacji | Cursor, Visual Studio Code, Antigravity, Kiro, Zed, Cursor Hacks, SDLC, inżynieria programowania |

## Struktura Tresci

### Szablon standardowy (how-to/techniczny)

```markdown
# [Tytul Artykulu]

[1-2 zdania wprowadzenia - hook przyciagajacy uwage]

## Problem

[2-3 akapity opisujace problem biznesowy lub techniczny]

- Konkretne wyzwania
- Skutki niewdrozenia rozwiazania
- Skala problemu (liczby jesli dostepne)

## Rozwiazanie

[Opis podejscia i wyboru narzedzi]

### Krok 1: [Nazwa kroku]

[Szczegolowy opis z przykladami]

### Krok 2: [Nazwa kroku]

[Szczegolowy opis z przykladami]

### Krok 3: [Nazwa kroku]

[Szczegolowy opis z przykladami]

## Rezultaty

[Konkretne wyniki - liczby, metryki, ROI]

- **Oszczednosc czasu:** X godzin tygodniowo
- **Redukcja bledow:** X%
- **ROI:** X% w Y miesiecy

## Kluczowe wnioski

[Lista 3-5 najwazniejszych lekcji]

1. [Wniosek 1]
2. [Wniosek 2]
3. [Wniosek 3]

## Nastepne kroki

[Co czytelnik moze zrobic dzisiaj]

---

**Potrzebujesz pomocy z automatyzacja?**
[Umow sie na bezplatna konsultacje](https://automation.house)
```

### Szablon case study

```markdown
# [Nazwa klienta/projektu]: [Rezultat]

## Kontekst

**Klient:** [Branza, wielkosc firmy]
**Wyzwanie:** [Glowny problem]
**Rozwiazanie:** [Wdrozone narzedzia/procesy]

## Problem

[Szczegolowy opis sytuacji przed wdrozeniem]

### Wyzwania

- [Wyzwanie 1]
- [Wyzwanie 2]
- [Wyzwanie 3]

## Rozwiazanie

[Opis wdrozenego rozwiazania]

### Architektura

[Diagram lub opis techniczny]

### Implementacja

[Kroki wdrozenia]

## Rezultaty

| Metryka            | Przed | Po  | Zmiana |
| ------------------ | ----- | --- | ------ |
| Czas przetwarzania | X     | Y   | -Z%    |
| Bledy              | X     | Y   | -Z%    |
| Koszty             | X     | Y   | -Z%    |

### Cytat klienta

> "Cytat od klienta opisujacy korzysci z wdrozenia..."
> — [Imie, Stanowisko, Firma]

## Wnioski

[Co mozna zastosowac u siebie]

---

**Chcesz osiagnac podobne rezultaty?**
[Skontaktuj sie z nami](https://automation.house)
```

## SEO Best Practices

### Tytul

- Dlugosc: 50-60 znakow
- Zawiera glowne slowo kluczowe
- Zachecajacy do klikniecia
- Przyklady:
  - "Jak zautomatyzowac CRM w 3 prostych krokach"
  - "5 sposobow na automatyzacje email w firmie"
  - "Chatboty AI: Kompletny przewodnik wdrozenia"

### Excerpt

- Dlugosc: 150-160 znakow
- Zawiera slowo kluczowe
- Odpowiada na pytanie "dlaczego powinienem to przeczytac?"
- Przyklady:
  - "Dowiedz sie jak zaoszczedzic 15h tygodniowo dzieki automatyzacji CRM. Praktyczny przewodnik z przykladami."
  - "Chatboty AI moga obslugiwac 80% zapytan klientow. Sprawdz jak je wdrozyc krok po kroku."

### Slug

- Male litery
- Slowa oddzielone myslnikami
- Krotki i opisowy (3-6 slow)
- Zawiera glowne slowo kluczowe
- Przyklady:
  - `automatyzacja-crm-przewodnik`
  - `chatboty-ai-wdrozenie`
  - `no-code-lead-generation`

### Naglowki

- H1: Tylko tytul (jeden na strone)
- H2: Glowne sekcje (zawieraja slowa kluczowe)
- H3: Podsekcje
- Naturalne uzycie slow kluczowych

### Struktura linkow wewnetrznych

- Linkuj do powiazanych artykulow
- Uzywaj opisowych anchor textow
- 2-5 linkow wewnetrznych na artykul

```markdown
Wiecej o automatyzacji email znajdziesz w
[przewodniku po automatyzacji korespondencji](/blog/automatyzacja-email).
```

## Dlugosc i Formatowanie

### Zalecana dlugosc

- **Standardowy artykul:** 2000-3000 slow
- **Case study:** 1500-2500 slow
- **Quick tip/tutorial:** 800-1500 slow

### Formatowanie dla czytelnosci

- Akapity: max 3-4 zdania
- Listy punktowane dla wyliczen
- Listy numerowane dla sekwencji
- Pogrubienia dla kluczowych pojec i liczb
- Code blocks dla przykladow kodu/konfiguracji
- Tabele dla porownand i metryk
- Obrazki z opisami alt

## Call to Action (CTA)

Kazdy artykul konczy sie **kontekstowym CTA** prowadzacym do konsultacji z Pawlem Lipowczanem.

### Format CTA (HTML + Tailwind)

Wszystkie artykuly uzywaja **tego samego formatu wizualnego**, ale z **kontekstowym tekstem** dopasowanym do tematu artykulu.

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    [Kontekstowy tytul - pytanie lub stwierdzenie zwiazane z tematem]
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    [Kontekstowy opis - jak Pawel moze pomoc w tym konkretnym temacie]
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

### Wytyczne tworzenia CTA

**Tytul (H3):**
- Pytanie lub stwierdzenie zwiazane z tematem artykulu
- 8-12 slow
- Konkretny, nie generyczny
- Przyklady:
  - "Potrzebujesz pomocy z automatyzacją?"
  - "Chcesz wdrożyć chatboty AI w swojej firmie?"
  - "Szukasz rozwiązań no-code dla biznesu?"

**Opis (paragraph):**
- Jasna wartosc - jak Pawel moze pomoc
- 2-3 zdania
- Konkretne benefity (np. "od analizy potrzeb przez implementacje po szkolenia zespolu")
- Ton: pomocny, kompetentny, bezposredni

**Przycisk:**
- Zawsze: "Umów bezpłatną konsultację"
- Link zawsze: `/#contact` (prowadzi do BookingCTA w sekcji kontakt)

### Szablony CTA wedlug kategorii

#### Automatyzacja

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Potrzebujesz pomocy z automatyzacją?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci zidentyfikować procesy do automatyzacji, wybrać odpowiednie narzędzia i wdrożyć rozwiązania, które zaoszczędzą czas i pieniądze Twojej firmie.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

#### No-Code

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz wdrożyć rozwiązania no-code w firmie?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci wybrać odpowiednie narzędzia, zaprojektować architekturę rozwiązania i wdrożyć je krok po kroku. Od analizy potrzeb przez implementację po szkolenia zespołu.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

#### AI

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz wdrożyć AI w swojej organizacji?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci znaleźć realne zastosowania AI w Twoim biznesie, uniknąć popularnych pułapek i wdrożyć rozwiązania, które przynoszą mierzalne rezultaty.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

#### Code

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Potrzebujesz wsparcia w rozwoju produktu?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci w wyborze technologii, projektowaniu architektury i wdrożeniu najlepszych praktyk. Od MVP przez skalowanie po optymalizację procesów deweloperskich.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

### Zasady

- **NIE** uzywaj markdown CTA (starych wersji)
- **ZAWSZE** uzywaj HTML z Tailwind classes (jak w przykladach powyzej)
- **Kontekstualizuj** tresc CTA do tematu artykulu
- **ZAWSZE** linkuj do `/#contact` (nie do zewnetrznych serwisow)
- **ZAWSZE** uzywaj tekstu przycisku: "Umów bezpłatną konsultację"
