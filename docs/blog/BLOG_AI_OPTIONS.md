# 🤖 Opcje generowania artykułów - Agent vs Skrypt

Porównanie różnych podejść do tworzenia treści blogowych z AI.

---

## 📊 Podsumowanie opcji

| Opcja                      | Elastyczność | Kontrola   | Koszty        | Czas         | Rekomendacja     |
| -------------------------- | ------------ | ---------- | ------------- | ------------ | ---------------- |
| **A. Agent (Ty w Cursor)** | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | 💰 Niskie     | ⚡ 10-20 min | ✅ **NAJLEPSZA** |
| **B. Skrypt Claude**       | ⭐⭐⭐       | ⭐⭐⭐     | 💰💰 Średnie  | ⚡⚡ 1-2 min | ✅ Dobra         |
| **C. Skrypt OpenAI**       | ⭐⭐⭐       | ⭐⭐⭐     | 💰💰💰 Wyższe | ⚡⚡ 1-2 min | ⚠️ Droższa       |
| **D. Hybrydowo**           | ⭐⭐⭐⭐     | ⭐⭐⭐⭐   | 💰💰 Zmienne  | ⚡ 5-15 min  | ✅ Uniwersalna   |

---

## A. 🎯 Agent w Cursor (REKOMENDOWANE)

### Jak to działa?

Ty (AI Agent w Cursor) generujesz artykuł bezpośrednio na podstawie pliku wsadowego.

**Workflow:**

```bash
# 1. Użytkownik tworzy plik wsadowy
src/content/blog/nowy-artykul_wsad.md

# 2. W chacie Cursor:
"Wygeneruj artykuł na podstawie pliku nowy-artykul_wsad.md"

# 3. Agent (Ty):
- Czyta plik wsadowy
- Generuje pełną treść markdown
- Tworzy plik .md z front matter
- Sugeruje następne kroki
```

### ✅ Zalety

1. **Maksymalna elastyczność**

   - Użytkownik może precyzować w trakcie
   - Natychmiastowe poprawki i iteracje
   - Dostosowanie tonu i stylu w locie

2. **Pełna kontrola**

   - Użytkownik widzi proces generowania
   - Może przerwać i zmienić kierunek
   - Łatwe A/B testing różnych wersji

3. **Kontekst projektu**

   - Agent zna cały codebase
   - Rozumie istniejące artykuły
   - Może zapewnić spójność stylu

4. **Niskie koszty**

   - Nie wymaga dodatkowych API calls
   - Używa już istniejącej subskrypcji Cursor

5. **Dodatkowe funkcje**
   - Agent może od razu wygenerować obrazek (MCP nano-banana)
   - Może zaktualizować wszystkie pliki (blogPosts.js, sitemap)
   - Może przetestować lokalnie

### ❌ Wady

1. Wymaga interakcji - nie jest w pełni automatyczne
2. Wolniejsze niż skrypt (10-20 min vs 1-2 min)
3. Zależne od jakości promptu użytkownika

### 💰 Koszty

- **$0** - wliczone w subskrypcję Cursor
- Nie wymaga dodatkowych API keys

### 📝 Przykładowy prompt

```
Wygeneruj artykuł blogowy na podstawie pliku:
src/content/blog/automatyzacja-wordpress_wsad.md

Wymagania:
- Format markdown z front matter
- Długość: ~2500 słów
- Styl: profesjonalny ale przystępny
- Dodaj konkretne liczby i case study
- Code snippets gdzie stosowne
- CTA na końcu
```

---

## B. 🤖 Skrypt z Claude Sonnet 4.5

### Jak to działa?

Autonomiczny skrypt Node.js który wywołuje Claude API.

**Workflow:**

```bash
# 1. Utwórz plik wsadowy
src/content/blog/nowy-artykul_wsad.md

# 2. Uruchom skrypt
node scripts/generate-blog-post-claude.js src/content/blog/nowy-artykul_wsad.md

# 3. Skrypt:
- Parsuje plik wsadowy
- Wywołuje Claude API
- Generuje artykuł
- Zapisuje do pliku
```

### ✅ Zalety

1. **Automatyzacja**

   - Jeden command line
   - Nie wymaga interakcji
   - Możliwe do zautomatyzowania (CI/CD)

2. **Szybkość**

   - 1-2 minuty na artykuł
   - Przetwarzanie równoległe możliwe

3. **Jakość Claude**

   - Świetne rozumienie kontekstu
   - Naturalny język
   - Duży context window (200K)

4. **Niższe koszty vs OpenAI**
   - ~$3/1M input tokens
   - ~$15/1M output tokens
   - Typowy artykuł: $0.05-0.15

### ❌ Wady

1. Wymaga ANTHROPIC_API_KEY
2. Mniejsza elastyczność (prompt w kodzie)
3. Brak kontekstu projektu
4. Trudniejsze iteracje

### 💰 Koszty

**Typowy artykuł (2500 słów):**

- Input: ~2K tokens (plik wsadowy + prompt) = $0.006
- Output: ~3K tokens (artykuł) = $0.045
- **Razem: ~$0.05 per artykuł**

**100 artykułów/rok: ~$5**

### 📋 Konfiguracja

```bash
# 1. Zainstaluj SDK
npm install @anthropic-ai/sdk

# 2. Ustaw API key
export ANTHROPIC_API_KEY="sk-ant-..."

# 3. Użyj
node scripts/generate-blog-post-claude.js <plik-wsadowy>
```

---

## C. 🔷 Skrypt z OpenAI GPT-4o

### Jak to działa?

Podobnie jak Claude, ale używa OpenAI API.

**Już zaimplementowane:** `scripts/generate-blog-post.js`

### ✅ Zalety

1. Wszystkie zalety skryptu (automatyzacja, szybkość)
2. Może używać function calling
3. Vision API (analiza obrazków)
4. Duża społeczność i dokumentacja

### ❌ Wady

1. **Wyższe koszty:**

   - GPT-4o: $2.50 input / $10 output per 1M tokens
   - Typowy artykuł: $0.08-0.15
   - **3x drożej niż Claude**

2. Mniejszy context window (128K vs 200K)
3. Czasem mniej "naturalny" w dłuższych tekstach

### 💰 Koszty

**Typowy artykuł:**

- Input: ~2K tokens = $0.005
- Output: ~3K tokens = $0.030
- **Razem: ~$0.035 per artykuł**

Ale w praktyce często więcej przez tokenizację.

**100 artykułów/rok: ~$8-12**

---

## D. 🔀 Podejście hybrydowe (REKOMENDOWANE)

### Strategia

Łącz różne metody w zależności od potrzeb:

#### 1. **Agent dla kreatywnych/ważnych artykułów**

- Flagship content
- Case studies
- Artykuły wymagające dokładności
- Pierwsze artykuły (ustalenie stylu)

#### 2. **Skrypt dla rutynowych/masowych**

- Aktualizacje techniczne
- Tutoriale step-by-step
- Listy narzędzi
- FAQ articles

#### 3. **Skrypt + Agent refinement**

- Skrypt generuje draft
- Agent (Ty) poprawia i rozbudowuje
- Best of both worlds

### Przykładowy workflow

```bash
# Wersja 1: Szybki draft przez skrypt
node scripts/generate-blog-post-claude.js artykul_wsad.md

# Potem w Cursor:
"Przejrzyj wygenerowany artykuł artykul.md i:
- Dodaj konkretniejsze case study
- Rozbuduj sekcję ROI
- Popraw kod snippets"
```

---

## 🎯 Rekomendacje dla Ciebie

### Scenariusz 1: Początek (1-10 artykułów)

**Użyj: Agent (Ty w Cursor)**

**Dlaczego:**

- Ustalasz styl i tone of voice
- Uczysz się co działa
- Pełna kontrola jakości
- Bez dodatkowych kosztów

### Scenariusz 2: Skalowanie (10-50 artykułów)

**Użyj: Hybrydowo**

- **Agent:** Dla 30% najważniejszych artykułów
- **Skrypt Claude:** Dla 70% standardowych

**Dlaczego:**

- Równowaga jakość/prędkość
- Niskie koszty (~$2-3 dla 40 artykułów przez skrypt)
- Agent zapewnia high quality dla kluczowych

### Scenariusz 3: Produkcja masowa (50+ artykułów)

**Użyj: Skrypt Claude + Agent review**

1. Batch generation przez skrypt
2. Szybki review przez Agenta
3. Publikacja

**Dlaczego:**

- Najszybsze
- Skalowalne
- Relatywnie tanie

---

## 💡 Moja rekomendacja dla Ciebie

### ⭐ **Opcja A: Agent w Cursor** (Główna metoda)

**Uzasadnienie:**

1. **Nie potrzebujesz masowej produkcji**

   - Portfolio blog to 20-40 artykułów rocznie
   - Jakość > ilość

2. **Maksymalna kontrola jakości**

   - Każdy artykuł reprezentuje Cię
   - Możesz iterować w czasie rzeczywistym
   - Pełna spójność z brandem

3. **Zero dodatkowych kosztów**

   - Wliczone w Cursor
   - Nie musisz konfigurować API keys
   - Nie martw się o limity

4. **Bonus features**

   - Mogę od razu wygenerować obrazek
   - Zaktualizować wszystkie pliki
   - Przetestować lokalnie
   - Zrobić SEO check

5. **Elastyczność**
   - "Więcej technicznych szczegółów"
   - "Zmień ton na bardziej casual"
   - "Dodaj case study z metrykami"

### 🔧 Skrypt Claude jako backup

**Użyj gdy:**

- Potrzebujesz szybkiego draftu (brak czasu)
- Artykuł jest bardzo standardowy (tutorial)
- Chcesz wygenerować kilka wersji na raz
- Testujesz nowy format

**Konfiguracja (opcjonalna):**

```bash
# Dodaj do .env
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 📋 Praktyczne wskazówki

### Przygotowanie pliku wsadowego (dla obu metod)

Klucz do sukcesu to **dobry plik wsadowy**:

✅ **Dobrze:**

```markdown
### 3. Stack technologiczny

- **n8n** - workflow automation, open-source, self-hosted
  - Używany do orchestration wszystkich integracji
  - Visual workflow builder
  - 300+ pre-built nodes
- **Airtable** - baza danych i CRM
  - Tabele: Companies, Contacts, Campaigns
  - Automations dla powiadomień
  - API integration
```

❌ **Źle:**

```markdown
### 3. Stack

- n8n
- Airtable
- API
```

**Im więcej szczegółów w wsadzie, tym lepszy artykuł!**

### Instrukcje dla Agenta

Kiedy używasz mnie (Agenta), bądź konkretny:

```
"Wygeneruj artykuł na podstawie automation-wordpress_wsad.md

Styl:
- Jak artykuł o Frontdesk AI (praktyczny, z liczbami)
- Mniej technicznie niż artykuł o Chatbotach
- Case study z konkretną firmą

Struktura:
- Problem → Rozwiązanie → Implementacja → ROI
- Przynajmniej 2 code snippets
- Case study na 300-400 słów
"
```

---

## 🎬 Podsumowanie - Twój wybór

### 🥇 Rekomendacja #1: Agent (Ty)

**Używaj domyślnie dla wszystkich artykułów**

Workflow:

```
1. Stwórz _wsad.md (20-30 min)
2. Prompt w Cursor (5 min)
3. Agent generuje + aktualizuje wszystko (10-15 min)
4. Ready to publish!
```

### 🥈 Rekomendacja #2: Skrypt Claude (backup)

**Miej skonfigurowane jako opcję B**

```bash
# Kiedy bardzo szybko potrzebujesz:
node scripts/generate-blog-post-claude.js article_wsad.md
```

### ❌ Nie polecam: Skrypt OpenAI

GPT-4o jest dobry, ale Claude lepszy w długich tekstach i tańszy.

---

## 📊 Porównanie kosztów (100 artykułów)

| Metoda             | Koszt / artykuł | Razem (100) | Czas / artykuł |
| ------------------ | --------------- | ----------- | -------------- |
| **Agent (Cursor)** | $0              | **$0**      | 15-20 min      |
| **Skrypt Claude**  | $0.05           | **$5**      | 1-2 min        |
| **Skrypt OpenAI**  | $0.08-0.15      | **$10-15**  | 1-2 min        |

**Wniosek:** Dla 20-40 artykułów rocznie, różnica to $1-2. Nieistotna.

---

## ✅ Akcje do podjęcia

### Minimum (Wystarczy na start):

- [x] ✅ Masz strukturę plików wsadowych
- [x] ✅ Masz szablony i dokumentację
- [ ] ⏳ Przetestuj workflow z Agentem (stwórz testowy artykuł)

### Opcjonalnie (Jeśli chcesz skrypt):

- [x] ✅ Zainstalowany `@anthropic-ai/sdk`
- [x] ✅ Skrypt Claude gotowy (`generate-blog-post-claude.js`)
- [ ] ⏳ Dodaj `ANTHROPIC_API_KEY` do `.env`
- [ ] ⏳ Przetestuj skrypt z przykładowym plikiem wsadowym

---

**Pytania?** Możemy przetestować wybraną metodę na przykładowym artykule! 🚀

---

**Autor:** AI Assistant  
**Data:** 2025-11-15  
**Wersja:** 1.0.0
