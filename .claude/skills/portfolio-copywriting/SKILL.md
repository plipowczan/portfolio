---
name: portfolio-copywriting
description: Copywriting dla bloga portfolio Pawla Lipowczana (pawel.lipowczan.pl). Uzyj przy tworzeniu nowych artykulow na blog, generowaniu tresci SEO, pisaniu case studies. Zawiera styl pisania autora (bezposredni, praktyczny, osobisty), strukture artykulow (front matter YAML, hierarchia H1-H3), kategorie (Automatyzacja/No-Code/AI), wytyczne SEO, szablony artykulow. Skill generuje artykuly zgodne z tonem i formatem istniejacych publikacji na blogu.
license: Apache-2.0
---

# Portfolio Copywriting

Skill do tworzenia artykulow na bloga portfolio pawel.lipowczan.pl w charakterystycznym stylu autora.

## Quick Reference

### Styl pisania

| Aspekt      | Charakterystyka                              |
| ----------- | -------------------------------------------- |
| Jezyk       | Polski + angielskie terminy techniczne       |
| Ton         | Bezposredni, praktyczny, osobisty            |
| Perspektywa | Pierwsza osoba (ja, my)                      |
| Podejscie   | Oparte na doswiadczeniu, konkretne przyklady |

### Kategorie artykulow

- **Automatyzacja** - procesy biznesowe, workflow, n8n, Make, Zapier
- **No-Code** - narzedzia low-code, Airtable, Notion, lead generation
- **AI** - chatboty, LLM, ChatGPT, Claude, wdrozenia AI

### Front matter

```yaml
---
id: 5
slug: automatyzacja-crm-przewodnik
title: Jak zautomatyzowac CRM w 3 krokach
excerpt: >-
  Dowiedz sie jak zaoszczedzic 15h tygodniowo
  dzieki automatyzacji CRM.
category: Automatyzacja
author: Pawel Lipowczan
date: 2025-12-19
readTime: 10 min
image: /images/og-automatyzacja-crm.webp
tags:
  - Automatyzacja
  - CRM
  - n8n
---
```

## Workflow tworzenia artykulu

1. **Zbierz dane wejsciowe** - tytul, kategoria, tagi, kluczowe punkty tresci
2. **Uzyj szablonu** - skopiuj `assets/templates/article-template.md`
3. **Wygeneruj tresc** - postepuj wedlug wytycznych stylu i struktury
4. **Zweryfikuj front matter** - sprawdz ID (inkrementuj), slug, date
5. **Zapisz artykul** - `src/content/blog/{slug}.md`
6. **Zaktualizuj sitemap** - `node scripts/update-sitemap.js`

## Struktura artykulu

### Standardowy artykul (how-to)

```
# [Tytul]
[Hook - 1-2 zdania]

## Problem
[Opis wyzwania + lista problemow]

## Rozwiazanie
### Krok 1: [Nazwa]
### Krok 2: [Nazwa]
### Krok 3: [Nazwa]

## Rezultaty
[Metryki, liczby, ROI]

## FAQ

<details open>
<summary>

### [Pytanie 1 - naturalne, 10-25 slow]

</summary>

[Snippet-style odpowiedz, 2-4 zdania. Kluczowa info na poczatku.]

</details>

<details open>
<summary>

### [Pytanie 2...]

</summary>

[Odpowiedz...]

</details>

## Kluczowe wnioski
[Lista 3-5 wnioskow]

## Nastepne kroki
[Akcje dla czytelnika]

---
[CTA do automation.house]
```

### Case study

```
# [Klient]: [Rezultat]

## Kontekst
[Klient, wyzwanie, rozwiazanie]

## Problem
[Szczegoly + lista wyzwan]

## Rozwiazanie
[Architektura + implementacja]

## Rezultaty
[Tabela metryk przed/po]
[Cytat klienta]

## Wnioski
---
[CTA]
```

## Wytyczne pisania

### Formatowanie

- **Akapity:** max 3-4 zdania
- **Listy punktowane:** dla wyliczen
- **Listy numerowane:** dla sekwencji krokow
- **Pogrubienia:** kluczowe pojecia i liczby
- **Code blocks:** przyklady kodu/konfiguracji

### Znaki interpunkcyjne - unikaj AI-tells (WYMAGANE)

Nie uzywaj znakow, ktore zdradzaja tekst pisany przez AI. Pisz tak, jak czlowiek pisze na klawiaturze.

| Zabroniony znak | Zamiast tego |
| --------------- | ------------ |
| `—` (em dash, U+2014) | `-` (zwykly myslnik) ze spacjami: ` - ` |
| `–` (en dash, U+2013) | `-` (zwykly myslnik); w zakresach `2020-2025` bez spacji |
| `…` (wielokropek, U+2026) | `...` (trzy kropki) |

**Zostaw** polskie cudzyslowy `„ "` - to poprawna typografia, uzywana w istniejacych artykulach (nie AI-tell).

Przed zapisem artykulu sprawdz: `grep -nP '[\x{2014}\x{2013}\x{2026}]' src/content/blog/{slug}.md` - wynik musi byc pusty.

### Dlugosc

| Typ         | Slowa     |
| ----------- | --------- |
| Standardowy | 2000-3000 |
| Case study  | 1500-2500 |
| Quick tip   | 800-1500  |

### SEO

- **Tytul:** 50-60 znakow, zawiera slowo kluczowe
- **Excerpt:** 150-160 znakow, odpowiada "dlaczego przeczytac"
- **Slug:** male litery, myslniki, 3-6 slow
- **Naglowki:** naturalne uzycie slow kluczowych

### FAQ (WYMAGANE)

Kazdy artykul musi zawierac sekcje FAQ zoptymalizowana pod AI/LLM (AEO - Answer Engine Optimization):

**Struktura z akordeonem:**

```markdown
## FAQ

<details open>
<summary>

### [Naturalne pytanie po polsku, 10-25 slow]

</summary>

[Snippet-style odpowiedz, 2-4 zdania. Kluczowa informacja w pierwszym zdaniu.]

</details>

<details open>
<summary>

### [Kolejne pytanie...]

</summary>

[Odpowiedz...]

</details>
```

**Wytyczne:**

- **Pytania:** 4-6 naturalnych pytan, pelnymi zdaniami (nie slowa kluczowe)
- **Dlugosc pytan:** 10-25 slow, konwersacyjne
- **Odpowiedzi:** 2-4 zdania, kluczowa info na poczatku
- **Konkretnosc:** liczby, definicje, fakty, mini how-to
- **Jezyk:** polski + angielskie terminy techniczne (jak w reszcie artykulu)
- **Accordion:** Kazde pytanie w `<details open>` (default expanded dla SEO)
- **Struktura:** H3 w `<summary>`, odpowiedz jako paragraf w details body

**Szczegolowe guidelines:** `docs/faq/FAQ_TEMPLATE.md` i `docs/faq/FAQ_GUIDELINES.md`

**Technical:** FAQPage schema auto-generuje sie z HTML (nie trzeba recznej konfiguracji)

### CTA

Kazdy artykul ma **kontekstowy CTA** PRZED sekcja "Przydatne zasoby" i FAQ.

**Format: HTML + Tailwind (NIE markdown).** Link ZAWSZE do `/#contact`, button ZAWSZE "Umów bezpłatną konsultację".

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    [Kontekstowy tytul - pytanie zwiazane z tematem, 8-12 slow]
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    [Wartosc - co Pawel oferuje w kontekscie tematu, 1-2 zdania]
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

**Zasady:**
- ❌ NIE uzywaj markdown CTA (stary format z `automation.house`)
- ✅ ZAWSZE HTML z Tailwind classes
- ✅ Kontekstualizuj tytul i opis do tematu artykulu
- ✅ Link ZAWSZE `/#contact` (nie zewnetrzne serwisy)
- ✅ Button text ZAWSZE "Umów bezpłatną konsultację"

**Kolejnosc na koncu artykulu:** Wnioski → CTA (HTML div) → `## Przydatne zasoby` → `## FAQ`

Pelne szablony per kategoria (Automatyzacja / No-Code / AI / Code) w [references/article-structure.md](references/article-structure.md) (sekcja "Call to Action (CTA)").

## Charakterystyczne elementy stylu

### Osobiste refleksje

```markdown
Z wlasnego doswiadczenia wiem, ze najwiekszym bledem jest
rozpoczynanie automatyzacji bez jasnego zrozumienia obecnego
procesu. Sam popelnilem ten blad przy pierwszym projekcie...
```

### Praktyczne wnioski

```markdown
## Co mozesz zrobic dzisiaj

1. Spisz 3 najbardziej powtarzalne zadania
2. Zmierz ile czasu na nie poswiecasz
3. Wybierz jedno do automatyzacji
```

### Lessons learned

```markdown
## Czego sie nauczylismy

### Co nie zadzialo

1. Brak walidacji z uzytkownikiem
2. Zbyt optymistyczne zalozenia

### Co zadzialo

1. Szybkie prototypowanie
2. Regularne demo
```

## Resources

### References

Szczegolowe wytyczne:

- **[writing-style.md](references/writing-style.md)** - pelna charakterystyka stylu pisania
- **[article-structure.md](references/article-structure.md)** - szablony, SEO, front matter

### Templates

Gotowe szablony:

- **[article-template.md](assets/templates/article-template.md)** - szablon artykulu

### Lokalizacja plikow w projekcie portfolio

```
portfolio/
├── src/content/blog/
│   └── {slug}.md              # Artykuly
├── public/images/
│   └── og-{slug}.webp         # Obrazki OG
└── scripts/
    ├── update-sitemap.js      # Aktualizacja sitemap
    └── convert-to-webp.js     # Konwersja PNG na WebP
```

### Workflow publikacji

Po utworzeniu artykulu:

1. Wygeneruj obrazek OG (1200x630px) jako PNG
2. Konwertuj: `node scripts/convert-to-webp.js public/images/og-{slug}.png`
3. Zaktualizuj sitemap: `node scripts/update-sitemap.js`
4. Przetestuj: `npm run dev`
5. Commit i push
