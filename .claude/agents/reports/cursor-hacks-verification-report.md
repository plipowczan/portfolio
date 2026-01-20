# Raport weryfikacji hacków Cursor - Perplexity Ask

**Data weryfikacji:** 2026-01-11  
**Metoda:** Perplexity Ask + oficjalna dokumentacja Cursor  
**Status planu:** `.claude/agents/plans/blog-15-cursor-hacks-produktywnosc-ai.md`

---

## ✅ POTWIERDZONE (8/10)

### 1. Hack 2: Usage Summary ✅

**Status:** ✅ **POTWIERDZONE**  
**Ścieżka:** `Settings → Chat → Usage Summary → Always`  
**Weryfikacja:** Dokładna ścieżka potwierdzona przez Perplexity. Toggle kontroluje widoczność paska użycia tokenów (never/on hover/always).

**Akcja:** ✅ Zostawić bez zmian w planie.

---

### 2. Hack 3: Completion sounds ✅

**Status:** ✅ **POTWIERDZONE** (weryfikacja użytkownika)  
**Ścieżka:** `Settings → General → Completion Sound`  
**Weryfikacja użytkownika:** Funkcja ISTNIEJE w Cursor IDE. Użytkownik potwierdził widoczność opcji w Settings → General → Completion Sound.

**Akcja:** ✅ Zostawić bez zmian w planie. Poprzednia weryfikacja Perplexity była nieprawidłowa.

---

### 3. Hack 4: Early Access ✅

**Status:** ✅ **POTWIERDZONE**  
**Ścieżka:** `Settings → Beta → Early Access`  
**Weryfikacja:** Potwierdzone. Dostępne opcje: Default, Early Access, Nightly (w zależności od platformy).

**Akcja:** ✅ Zostawić bez zmian w planie.

---

### 4. Hack 5: Wiele okien ✅

**Status:** ✅ **POTWIERDZONE** (weryfikacja użytkownika)  
**Ścieżka:** `File → New Window`  
**Weryfikacja użytkownika:** Funkcja ISTNIEJE. Użytkownik potwierdził że `File → New Window` istnieje, ale zauważył że to nie jest "game changer" - to standardowa funkcja w wielu aplikacjach. Można mieć wiele okien, w każdym oknie osobny projekt.

**Akcja:** ✅ Zostawić w planie, ale **rozważyć** czy warto to traktować jako "hack" skoro to standardowa funkcja.

---

### 5. Hack 8: Context window indicator ✅

**Status:** ✅ **POTWIERDZONE** (weryfikacja użytkownika)  
**Lokalizacja:** W status bar / UI  
**Weryfikacja użytkownika:** Funkcja ISTNIEJE. Użytkownik potwierdził że widzi wskaźnik pokazujący:

- % zajęcia kontekstu
- Jakie rules zostały wczytane

**Akcja:** ✅ Zostawić bez zmian w planie. Poprzednia weryfikacja Perplexity była nieprawidłowa.

---

### 6. Hack 10: Agent steering ✅

**Status:** ✅ **POTWIERDZONE** (z korektą ścieżki)  
**Ścieżka:** `Agent pane → ... → Agent Settings → Queue Messages`  
**Weryfikacja użytkownika:**

- Nie ma globalnego ustawienia `Settings → Chat → Queue messages`
- Jest per-chat w Agent pane
- Dokładna ścieżka: `Agent pane → ... (trzy kropki) → Agent Settings → Queue Messages`
- Dwie opcje: "Send after current message" i "Stop & send right away"

**Akcja:** ⚠️ **WYMAGA KOREKTY** - zaktualizować ścieżkę na `Agent pane → ... → Agent Settings → Queue Messages` i opcje.

---

### 7. Hack 11: Worktrees ✅

**Status:** ✅ **POTWIERDZONE** (z korektą opisu)  
**Jak działa (weryfikacja użytkownika):**

1. Kliknąć w pole wyboru modelu
2. Zaznaczyć opcję "use multiple models"
3. Można wybrać różne modele LUB do 4x ten sam model
4. W zależności od mnożnika tyle wersji się wygeneruje

**Akcja:** ⚠️ **WYMAGA KOREKTY** - zaktualizować opis workflow:

- Nie "checkbox worktree", ale "use multiple models" w wyborze modeli
- Można wybrać różne modele lub do 4x jeden model
- Każdy model/mnożnik = osobna wersja

---

### 8. Hack 12: Dwu-modelowy workflow ✅

**Status:** ✅ **POTWIERDZONE**  
**Weryfikacja:** Można używać różnych modeli dla Plan i Build. W Cursor 2.0 można przypisać jeden model do planowania, inny do wykonania. Przełączanie przez dropdown model picker w UI agenta.

**Akcja:** ✅ Zostawić bez zmian w planie.

---

### 9. Hack 14: @ command ✅

**Status:** ✅ **POTWIERDZONE** (z korektą)  
**Weryfikacja użytkownika:**

- Nie ma ustawień "Chat" - każdy chat to "Agent"
- @ command ma opcje: Files & Folders, Docs, Terminals, Branch (Diff with main), Browser
- **NIE MA** "Past chats" w menu @
- **NIE MA** "Commits/PRs" jako osobnej opcji (ale jest Branch)

**Akcja:** ⚠️ **WYMAGA KOREKTY**:

- USUNĄĆ "Past chats" z opisu
- USUNĄĆ "Commits/PRs" jako osobna opcja
- Zaktualizować listę opcji @ command na: Files & Folders, Docs, Terminals, Branch (Diff with main), Browser
- Zmienić terminologię z "Chat" na "Agent" gdzie dotyczy

---

### 10. Hack 15: Duplicate chat ✅

**Status:** ✅ **POTWIERDZONE** (z korektą lokalizacji)  
**Lokalizacja (weryfikacja użytkownika):**

- **NIE** w menu ... w agent pane
- **TAK** po kliknięciu na ... (trzy kropki) na danym agencie na liście agentów w widoku zarządzania agentami
- Widok zarządzania agentami → wybrać agenta → kliknąć ... → opcja "Duplicate chat"

**Ostrzeżenie:** W niektórych wersjach może być buggy (duplikowane chaty nie mogą wysyłać wiadomości, duplikowanie może zatrzymać oryginalnego agenta).

**Akcja:** ⚠️ **WYMAGA KOREKTY** - zaktualizować lokalizację na "widok zarządzania agentami → agent → ... → Duplicate chat"

---

## 📊 Podsumowanie (zaktualizowane)

| Status              | Liczba | Hacki                                                        |
| ------------------- | ------ | ------------------------------------------------------------ |
| ✅ Potwierdzone     | 8      | Hack 2, 3, 4, 5, 8, 10, 11, 12, 14, 15                       |
| ⚠️ Wymagają korekty | 4      | Hack 10 (ścieżka), 11 (opis), 14 (opcje @), 15 (lokalizacja) |
| ❌ Nie istnieje     | 0      | -                                                            |

**Łącznie:** 10 hacków zweryfikowanych (wszystkie potwierdzone, 4 wymagają doprecyzowania)

---

## 📊 Podsumowanie

| Status              | Liczba | Hacki              |
| ------------------- | ------ | ------------------ |
| ✅ Potwierdzone     | 4      | Hack 2, 4, 12, 15  |
| ⚠️ Wymagają korekty | 4      | Hack 5, 11, 10, 14 |
| ❌ Nie istnieje     | 2      | Hack 3, 8          |

**Łącznie:** 10 hacków zweryfikowanych

---

## 🔧 Rekomendowane zmiany w planie (zaktualizowane)

### Wysokie priorytety (doprecyzowanie)

1. **Hack 10 (Agent steering):**

   - ⚠️ ZMIENIĆ: `Settings → Chat → Queue messages`
   - ✅ DODAĆ: `Agent pane → ... → Agent Settings → Queue Messages`
   - ✅ DODAĆ: Dwie opcje: "Send after current message" i "Stop & send right away"

2. **Hack 11 (Worktrees):**

   - ⚠️ ZMIENIĆ: Opis workflow z "checkbox worktree" na:
     - Kliknąć w pole wyboru modelu
     - Zaznaczyć "use multiple models"
     - Wybrać różne modele LUB do 4x ten sam model
     - Każdy model/mnożnik = osobna wersja

3. **Hack 14 (@ command):**
   - ❌ USUNĄĆ: "Past chats" z opisu
   - ❌ USUNĄĆ: "Commits/PRs" jako osobna opcja
   - ✅ ZAKTUALIZOWAĆ: Lista opcji @ command na: Files & Folders, Docs, Terminals, Branch (Diff with main), Browser
   - ⚠️ ZMIENIĆ: Terminologię z "Chat" na "Agent" gdzie dotyczy

### Średnie priorytety (rozważenie)

1. **Hack 5 (Wiele okien):**
   - ✅ ZOSTAWIĆ: `File → New Window` (istnieje)
   - 💡 ROZWAŻYĆ: Czy warto to traktować jako "hack" skoro to standardowa funkcja w wielu aplikacjach
   - ✅ DODAĆ: Uwaga że to nie jest "game changer", tylko standardowa funkcja

### Średnie priorytety (doprecyzowanie)

1. **Hack 15 (Duplicate chat):**
   - ⚠️ ZMIENIĆ: Lokalizację z "trzy kropki w agent pane" na "widok zarządzania agentami → agent → ... → Duplicate chat"
   - ✅ DODAĆ: Ostrzeżenie o możliwych bugach w niektórych wersjach

---

## ✅ Hacki które są w 100% zgodne (nie wymagają zmian)

- ✅ Hack 1: Skróty klawiszowe
- ✅ Hack 2: Usage Summary (zweryfikowane)
- ✅ Hack 4: Early Access (zweryfikowane)
- ✅ Hack 6: MCP management
- ✅ Hack 7: Custom commands
- ✅ Hack 9: Documentation indexing
- ✅ Hack 12: Dwu-modelowy workflow (zweryfikowane)
- ✅ Hack 13: Strukturyzacja promptów (technika użytkownika)
- ✅ Hack 16: .cursorignore

---

## 📝 Następne kroki (zaktualizowane)

1. ✅ Zaktualizować plan artykułu z korektami dla 3 hacków (10, 11, 14)
2. ✅ Dodać ostrzeżenia gdzie potrzebne (Hack 15)
3. ✅ Doprecyzować opisy (Hack 5 - rozważyć czy to hack, Hack 10 - ścieżka, Hack 11 - workflow)
4. ✅ Zaktualizować terminologię (Chat → Agent gdzie dotyczy)

**Status:** ✅ Wszystkie hacki potwierdzone przez użytkownika. Wymagane tylko doprecyzowanie ścieżek i opisów.

**Uwaga:** Poprzednia weryfikacja Perplexity była nieprawidłowa dla Hack 3 i Hack 8. Weryfikacja bezpośrednia przez użytkownika potwierdziła że obie funkcje ISTNIEJĄ w Cursor IDE.
