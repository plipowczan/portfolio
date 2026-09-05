# 📝 Blog Content Directory

Ten folder zawiera wszystkie artykuły blogowe w formacie Markdown.

---

## 📂 Struktura plików

Każdy artykuł składa się z dwóch plików:

```text
artykul-slug.md          # Pełna treść artykułu (generowana automatycznie)
artykul-slug_wsad.md     # Plik wsadowy z punktami kluczowymi (tworzony ręcznie)
```

### Przykład

```text
automatyzacja-email-frontdesk-ai.md          # Artykuł opublikowany
automatyzacja-email-frontdesk-ai_wsad.md     # Punkty wsadowe
```

---

## 📄 Format artykułu (.md)

Każdy artykuł ma **front matter** (metadane YAML) i **treść markdown**.

### Przykład struktury

```markdown
---
id: 1
slug: automatyzacja-email-frontdesk-ai
title: Automatyzacja poczty email z AI
excerpt: Krótki opis artykułu (150-200 znaków)
category: Automatyzacja
author: Pawel Lipowczan
date: 2025-11-10
readTime: 8 min
image: /images/og-automatyzacja-email-frontdesk-ai.webp
tags:
  - AI
  - Automatyzacja
  - Email
---

# Tytuł artykułu

Treść artykułu w markdown...
```

---

## 🛠️ Tworzenie nowego artykułu

### Krok 1: Skopiuj szablon

```bash
cp src/content/blog/_template_wsad.md src/content/blog/moj-nowy-artykul_wsad.md
```

### Krok 2: Wypełnij plik wsadowy

Edytuj `moj-nowy-artykul_wsad.md` i wypełnij wszystkie sekcje.

### Krok 3: Wygeneruj artykuł

```bash
node scripts/generate-blog-post.js src/content/blog/moj-nowy-artykul_wsad.md
```

### Krok 4: Dodaj obrazek i opublikuj

Zobacz: [BLOG_WORKFLOW.md](../../../BLOG_WORKFLOW.md) dla pełnej procedury.

---

## 📋 Istniejące artykuły

1. **Automatyzacja poczty email z AI** (`automatyzacja-email-frontdesk-ai.md`)

   - Kategoria: Automatyzacja
   - Data: 2025-11-10
   - Tagi: AI, Automatyzacja, Email, Make, OpenAI

2. **No-Code Lead Generation** (`no-code-lead-generation.md`)

   - Kategoria: No-Code
   - Data: 2025-11-05
   - Tagi: No-Code, Lead Generation, n8n, Airtable

3. **Chatboty oparte na AI** (`chatboty-ai-od-koncepcji-do-wdrozenia.md`)
   - Kategoria: AI
   - Data: 2025-11-01
   - Tagi: AI, Chatbots, VAPI, n8n, OpenAI, RAG

---

## ⚠️ Ważne zasady

1. **Nie usuwaj plików \_wsad.md** - służą jako dokumentacja i referencja
2. **Front matter jest wymagany** - bez niego artykuł nie załaduje się
3. **Slug musi być unikalny** - używany jako identyfikator w URLach
4. **Data w formacie YYYY-MM-DD** - np. 2025-11-15
5. **Tags to lista YAML** - używaj wcięć (2 spacje)
6. **Image path zaczyna się od /** - np. `/images/og-slug.webp`

---

## 🔍 Parsowanie artykułów

Artykuły parsuje `scripts/generate-content.mjs` **w trakcie builda**, biblioteką
`gray-matter`. Zapisuje z tego lekki indeks i po jednym module na treść do
`src/data/generated/`; `src/data/blogPosts.js` czyta ten indeks, a treść pobiera
się dopiero przy otwarciu artykułu.

W praktyce dla Ciebie: wrzucasz plik `.md`, artykuł się pojawia. Zepsuty front
matter przewraca build z nazwą pliku i nazwą brakującego pola — nie znika po
cichu z listy. Szczegóły: [src/data/README.md](../../data/README.md).

---

## 📚 Dokumentacja

- **Pełny workflow:** [BLOG_WORKFLOW.md](../../../BLOG_WORKFLOW.md)
- **Skrypty:** [scripts/README.md](../../../scripts/README.md)
- **Szablon wsadowy:** [\_template_wsad.md](./_template_wsad.md)

---

**Ostatnia aktualizacja:** 2025-11-15
