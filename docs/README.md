# 📚 Dokumentacja Portfolio

Dokumentacja projektu zorganizowana tematycznie dla łatwego odnajdywania informacji.

## 📁 Struktura dokumentacji

```
docs/
├── README.md                      # Ten plik - przegląd dokumentacji
├── PRD.md                         # Product Requirements Document (EN - dla AI)
├── SRS.md                         # Software Requirements Specification (EN - dla AI)
├── PROJECT_STATUS.md              # Stan projektu: pomiary, deployment, odrzucone pomysły (EN - dla AI)
├── TODO.md                        # Lista zadań i roadmap
├── QUICK_START.md                 # Szybki start
│
├── deployment/                    # 🚀 Deployment
│   └── DEPLOYMENT.md             # Kompletny przewodnik wdrożenia
│
├── seo/                          # 🔍 SEO & Optymalizacja
│   ├── PRERENDERING.md           # Dokumentacja prerenderingu (techniczna)
│   ├── PRERENDERING_SUMMARY.md   # Szybkie podsumowanie prerenderingu
│   └── SEO_VERIFICATION.md       # Checklist weryfikacji SEO
│
├── blog/                         # ✍️ System blogowy
│   ├── BLOG_WORKFLOW.md          # Workflow tworzenia postów
│   ├── BLOG_SYSTEM_SUMMARY.md    # Podsumowanie systemu blogowego
│   └── BLOG_AI_OPTIONS.md        # Opcje AI dla generowania treści
│
├── testing/                      # 🧪 Testy E2E
│   ├── README.md                 # Przegląd dokumentacji testów
│   └── TESTING_QUICKSTART.md     # Szybki start z Playwright
│
└── maintenance/                  # 🛠️ Utrzymanie projektu
    ├── TODO.md                   # Lista zadań do zrobienia
    └── BUGFIX_SUMMARY.md         # Podsumowania napraw bugów
```

---

## 🚀 Szybki start

### Nowy użytkownik? Zacznij tutaj

1. **[README.md](../README.md)** (katalog główny) - Przegląd projektu, instalacja
2. **[QUICK_START.md](./QUICK_START.md)** - 5-minutowy quickstart
3. **[deployment/DEPLOYMENT.md](./deployment/DEPLOYMENT.md)** - Jak wdrożyć

### Szukasz szczegółów technicznych (dla AI/deweloperów)?

- **[SRS.md](./SRS.md)** - Specyfikacja techniczna i architektura (EN - dla AI)
- **[PRD.md](./PRD.md)** - Wymagania produktowe i wizja (EN - dla AI)
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Pomiary, stan wdrożenia, świadomie odrzucone pomysły (EN - dla AI)
- **[TODO.md](./TODO.md)** - Otwarte zadania i roadmap

---

## 📖 Przewodnik po dokumentacji


### 🚀 Deployment - Wdrożenie

Wszystko o wdrażaniu aplikacji na różne platformy:

- **DEPLOYMENT.md** - Kompletny przewodnik:
  - Vercel (zalecane)
  - Netlify
  - GitHub Pages
  - Hostinger
  - Custom VPS
  - Konfiguracja domen
  - SSL/HTTPS
  - **Prerendering dla SEO**

**Kiedy używać:** Gdy chcesz wdrożyć aplikację do produkcji

---

### 🔍 SEO - Optymalizacja wyszukiwarek

Dokumentacja optymalizacji SEO i prerenderingu:

#### PRERENDERING.md

Kompletna dokumentacja techniczna prerenderingu:

- Jak działa prerendering
- Komendy (`npm run build:prerender`)
- Konfiguracja Vercel
- Troubleshooting
- Monitorowanie SEO

#### PRERENDERING_SUMMARY.md

Szybkie podsumowanie wdrożenia prerenderingu:

- Co zostało zrobione
- Jak używać
- Rezultaty SEO
- Następne kroki

#### SEO_VERIFICATION.md

Checklist weryfikacji po wdrożeniu:

- View Page Source
- Google Rich Results Test
- Lighthouse SEO Score
- Social Media Previews
- Google Search Console
- Timeline oczekiwanych rezultatów

**Kiedy używać:**

- Po wdrożeniu - użyj SEO_VERIFICATION.md
- Gdy chcesz zrozumieć prerendering - czytaj PRERENDERING.md
- Szybki przegląd - PRERENDERING_SUMMARY.md

---

### ✍️ Blog - System blogowy

Dokumentacja systemu blogowego i workflow:

#### BLOG_WORKFLOW.md

Pełny workflow tworzenia postów:

- Jak stworzyć nowy post
- Struktura plików markdown
- Front matter (metadane)
- Generowanie treści
- Obrazki OG
- Publikacja

#### BLOG_SYSTEM_SUMMARY.md

Podsumowanie architektury systemu blogowego:

- Jak działa system
- Struktura folderów
- Parsowanie markdown
- Routing

#### BLOG_AI_OPTIONS.md

Opcje użycia AI do generowania treści blogowych:

- Claude, OpenAI, inne
- Prompty
- Best practices

**Kiedy używać:**

- Tworzysz nowy post - czytaj BLOG_WORKFLOW.md
- Chcesz zrozumieć system - BLOG_SYSTEM_SUMMARY.md
- Chcesz użyć AI - BLOG_AI_OPTIONS.md

---

### 🧪 Testing - Testy E2E

Dokumentacja testów funkcjonalnych z Playwright:

#### TESTING_QUICKSTART.md

Szybki przewodnik (2 minuty):

- Jak uruchomić testy
- Podstawowe komendy
- Debugging testów
- Pisanie własnych testów
- AI-Assisted Testing z MCP Browser

**Kiedy używać:**

- Chcesz szybko uruchomić testy
- Uczysz się Playwright
- Potrzebujesz referencji komend

**Pełna dokumentacja:** `tests/README.md` (katalog główny projektu)

---

### 🛠️ Maintenance - Utrzymanie

Zadania do zrobienia i historia napraw:

#### TODO.md

Lista zadań do zrobienia:

- ✅ Ukończone (np. prerendering)
- 🔄 W toku
- ⏭️ Do zrobienia (np. structured data, internal linking)

**Zawiera:**

- Priorytetyzację zadań
- Szacowany czas
- Instrukcje implementacji
- Linki do zasobów

#### BUGFIX_SUMMARY.md

Historia naprawionych bugów:

- Co było nie tak
- Jak naprawiono
- Czego się nauczono

**Kiedy używać:**

- Planujesz dalszy rozwój - czytaj TODO.md
- Chcesz zobaczyć historię - BUGFIX_SUMMARY.md

---

## 🎯 Najczęściej używane dokumenty

### Top 5 dokumentów

1. **[SRS.md](./SRS.md)** - Specyfikacja techniczna i architektura (NOWE - dla AI)
2. **[deployment/DEPLOYMENT.md](./deployment/DEPLOYMENT.md)** - Jak wdrożyć na Vercel
3. **[PRD.md](./PRD.md)** - Wymagania produktowe (dla AI)
4. **[maintenance/TODO.md](./maintenance/TODO.md)** - Roadmap i zadania do zrobienia
5. **[QUICK_START.md](./QUICK_START.md)** - Szybki start dla nowych użytkowników

---

## 🔗 Powiązania między dokumentami

```
README.md (root) ──────────────────┐
    ↓                              ↓
    ├─→ PRD.md (Biznes & Wizja - EN dla AI)
    ├─→ SRS.md (Technika & Architektura - EN dla AI) ← NOWE
    ├─→ QUICK_START.md ──→ deployment/DEPLOYMENT.md
    └─→ maintenance/TODO.md
            ↓
        seo/SEO_VERIFICATION.md
            ↓
        seo/PRERENDERING.md
```

---

## 📝 Konwencje dokumentacji

### Emoji w nagłówkach

- 📚 Dokumentacja główna
- 🚀 Deployment/Wdrożenie
- 🔍 SEO/Optymalizacja
- ✍️ Blog/Content
- 🧪 Testing/Testy
- 🛠️ Maintenance/Narzędzia
- 📝 Planning/Notatki
- ✅ Ukończone
- 🔄 W toku
- ⏭️ Do zrobienia

### Format linków

- Linki wewnętrzne: relatywne (`../seo/PRERENDERING.md`)
- Linki zewnętrzne: pełne URL z https://

### Struktura plików MD

1. Tytuł H1 (# )
2. Krótki opis
3. Spis treści (opcjonalnie)
4. Główna treść z H2, H3
5. Linki do powiązanych dokumentów
6. Data ostatniej aktualizacji

---

## 🔄 Aktualizowanie dokumentacji

### Kiedy aktualizować?

- **Po każdej większej zmianie** - zaktualizuj odpowiedni dokument
- **Po wdrożeniu** - uzupełnij TODO.md o nowe zadania
- **Po naprawie buga** - dodaj wpis do BUGFIX_SUMMARY.md
- **Po dodaniu featury** - zaktualizuj PROJECT_SUMMARY.md

### Jak aktualizować?

1. Znajdź odpowiedni dokument w strukturze
2. Edytuj markdown
3. Zaktualizuj datę na dole dokumentu
4. Sprawdź czy linki wewnętrzne działają
5. Commit z opisem: `docs: update [nazwa pliku]`

---

## 📞 Potrzebujesz pomocy?

**Nie wiesz którego dokumentu użyć?**

- Deployment → `deployment/DEPLOYMENT.md`
- SEO → `seo/SEO_VERIFICATION.md` lub `seo/PRERENDERING.md`
- Blog → `blog/BLOG_WORKFLOW.md`
- Testy → `testing/TESTING_QUICKSTART.md`
- Planowanie → `maintenance/TODO.md`
- Przegląd projektu → `../README.md` (katalog główny)
- Specyfikacja techniczna (AI) → `SRS.md`
- Wymagania biznesowe (AI) → `PRD.md`

**Nadal nie wiesz?**

Zacznij od **QUICK_START.md** - to 5-minutowy przewodnik po wszystkim.

---

**Ostatnia aktualizacja:** 2025-11-16  
**Wersja dokumentacji:** 2.0.0  
**Struktura:** Zorganizowana tematycznie
