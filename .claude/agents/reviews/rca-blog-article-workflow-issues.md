# Root Cause Analysis: Blog Article Workflow Issues

**Date:** 2026-01-26
**Issue:** Problemy z workflow tworzenia artykułu blogowego
**Severity:** Medium
**Status:** Analyzed

## Issue Summary

**Description:**
Podczas tworzenia artykułu `second-brain-obsidian-claude-code-skills.md` wystąpiły problemy z automatyzacją workflow:
1. Skill `blog-article-writer:validate` nie został rozpoznany
2. Skill `blog-article-writer:generate-og-prompt` nie został rozpoznany
3. Obrazek OG nie został automatycznie wygenerowany pomimo dostępności `scripts/generate-image.js`

**Expected Behavior:**
- Komendy `/blog-article-writer:validate` i `/blog-article-writer:generate-og-prompt` powinny działać
- Obrazek OG powinien być generowany automatycznie w ramach walidacji
- Workflow powinien być w pełni zautomatyzowany

**Actual Behavior:**
- Komendy zwracają błąd "Unknown skill"
- Walidacja musiała być wykonana ręcznie
- Obrazek OG wymaga ręcznego wygenerowania

**Impact:**
- Dodatkowa praca manualna
- Ryzyko pominięcia kroków workflow
- Niespójność procesu

## Analysis

### Root Cause 1: Commands vs Skills - Błędna architektura

**Problem:** Pliki w `.claude/commands/blog-article-writer/` są **command definitions** (markdown z instrukcjami), nie **skills** (kod wykonywalny).

**Evidence:**
```
.claude/commands/blog-article-writer/
├── execute.md       # ← Dokumentacja, nie kod
├── generate-og-prompt.md
├── plan.md
├── prime.md
└── validate.md
```

**Wyjaśnienie:**
- **Skills** (w `.claude/skills/`) to katalogi z `SKILL.md` które Claude Code ładuje dynamicznie
- **Commands** (w `.claude/commands/`) to tylko **dokumentacja workflow** - instrukcje dla użytkownika/agenta
- System `Skill()` tool szuka skills w `.claude/skills/`, nie w `.claude/commands/`
- Komendy `/blog-article-writer:validate` są zdefiniowane jako **dokumentacja**, a nie jako **executable skills**

### Root Cause 2: Missing Skill Definition

**Problem:** `blog-article-writer` nie istnieje jako skill w `.claude/skills/`:

```
.claude/skills/
├── file-to-markdown/
├── portfolio-code-review/
├── portfolio-copywriting/      ← Używane poprawnie w execute
├── portfolio-frontend-design/
└── portfolio-testing/

❌ BRAK: blog-article-writer/
```

### Root Cause 3: OG Image Generation - Manual by Design

**Problem:** `validate.md` definiuje OG image generation jako **dwuetapowy manualny proces**:

```markdown
**Step 1: Generate OG Image Prompt (AUTOMATED)**
Run: /blog-article-writer:generate-og-prompt {slug}

**Step 2: Use Generated Prompt with generate-image.js**
node scripts/generate-image.js "{GENERATED_PROMPT}" --filename og-{slug}
```

**Wyjaśnienie:**
1. Step 1 wymaga działającej komendy `generate-og-prompt` (która nie działa - RC1/RC2)
2. Step 2 wymaga **manualnego skopiowania** promptu i uruchomienia skryptu
3. Skrypt `generate-image.js` wymaga `GEMINI_API_KEY` w `.env`
4. **Brak automatyzacji end-to-end** - każdy krok wymaga interwencji

### Root Cause 4: Documentation Inconsistency

**Problem:** Dokumentacja w `blog-article-writer.md` mówi:

```markdown
## ⚠️ Important: Do NOT Use as Agent
This is workflow documentation, NOT an invokable agent.
**Correct Usage:** Invoke commands sequentially in main conversation
```

Ale jednocześnie workflow zakłada że komendy działają:
```
4. /blog-article-writer:execute
5. /blog-article-writer:validate (AUTOMATIC)
```

**Sprzeczność:** Dokumentacja mówi "nie używaj jako agenta" ale zakłada że komendy są wykonywalne.

## Code Flow Analysis

```
User: /blog-article-writer:validate
         ↓
Skill Tool: Szuka w systemie skill "blog-article-writer:validate"
         ↓
System: Sprawdza .claude/skills/ → NIE ZNALEZIONO
         ↓
Error: "Unknown skill: blog-article-writer:validate"

---

Oczekiwane (gdyby skill istniał):
User: /blog-article-writer:validate
         ↓
Skill Tool: Ładuje .claude/skills/blog-article-writer/validate/SKILL.md
         ↓
Skill: Wykonuje instrukcje z SKILL.md
         ↓
         ├── Waliduje artykuł
         ├── Generuje prompt OG
         ├── Uruchamia generate-image.js
         ├── Konwertuje do WebP
         └── Aktualizuje sitemap
```

## Root Cause Summary

| # | Root Cause | Severity | Fix Complexity |
|---|-----------|----------|----------------|
| 1 | Commands nie są Skills - błędna architektura | High | Medium |
| 2 | Brak skill definition dla blog-article-writer | High | Medium |
| 3 | OG generation jest manualny by design | Medium | Low |
| 4 | Sprzeczna dokumentacja | Low | Low |

**Primary Root Cause:**
Komendy w `.claude/commands/` są **dokumentacją workflow**, nie **executable skills**. System Skill() tool nie może ich wywołać, bo szuka skills w innym miejscu (`.claude/skills/`).

## Fix Options

### Option 1: Convert Commands to Skills (Recommended)

**Approach:**
- Przenieś logikę z `.claude/commands/blog-article-writer/*.md` do `.claude/skills/blog-article-writer/`
- Stwórz strukturę skill z `SKILL.md` dla każdej komendy

**Structure:**
```
.claude/skills/
└── blog-article-writer/
    ├── SKILL.md                    # Main skill entry
    └── subcommands/
        ├── prime.md
        ├── plan.md
        ├── execute.md
        ├── validate.md
        └── generate-og-prompt.md
```

**Pros:**
- Pełna automatyzacja workflow
- Skill() tool będzie działać
- Spójna architektura

**Cons:**
- Wymaga refactoringu
- Trzeba przetestować wszystkie komendy

**Risk:** Medium

### Option 2: Keep Documentation, Fix Expectations

**Approach:**
- Zachowaj commands jako dokumentację
- Usuń z dokumentacji sugestię że komendy są "wykonywalne"
- Zaakceptuj manualny workflow

**Pros:**
- Minimalne zmiany
- Dokumentacja jako reference

**Cons:**
- Brak automatyzacji
- Workflow pozostaje manualny

**Risk:** Low

### Option 3: Create Wrapper Skill for OG Generation

**Approach:**
- Stwórz tylko skill `og-image-generator` który:
  - Generuje prompt na podstawie artykułu
  - Wywołuje `generate-image.js`
  - Konwertuje do WebP
- Pozostaw resztę workflow manualną

**Pros:**
- Rozwiązuje główny pain point (OG images)
- Szybka implementacja

**Cons:**
- Częściowe rozwiązanie
- Niespójne z resztą workflow

**Risk:** Low

## Recommended Fix

**Option 1: Convert Commands to Skills**

Pełna automatyzacja workflow poprzez konwersję command definitions do executable skills.

### Implementation Steps

1. **Stwórz strukturę skill:**
   ```bash
   mkdir -p .claude/skills/blog-article-writer/subcommands
   ```

2. **Stwórz główny SKILL.md:**
   ```yaml
   ---
   name: blog-article-writer
   description: Create blog articles with automatic validation and OG image generation. Supports subcommands: prime, plan, execute, validate, generate-og-prompt.
   ---
   ```

3. **Przenieś logikę z commands:**
   - Przekształć instrukcje z markdown na executable workflow
   - Dodaj integrację z `generate-image.js`
   - Dodaj automatyczne wywołanie sitemap update

4. **Zintegruj z generate-image.js:**
   - Skill powinien wywoływać skrypt bezpośrednio
   - Sprawdzić obecność GEMINI_API_KEY
   - Obsłużyć błędy gracefully

5. **Zaktualizuj dokumentację:**
   - Usuń sprzeczne informacje
   - Dodaj przykłady użycia

### Files to Modify/Create

| Action | Path | Description |
|--------|------|-------------|
| CREATE | `.claude/skills/blog-article-writer/SKILL.md` | Main skill definition |
| CREATE | `.claude/skills/blog-article-writer/validate.md` | Validate subcommand |
| CREATE | `.claude/skills/blog-article-writer/generate-og-prompt.md` | OG prompt generator |
| UPDATE | `.claude/agents/blog-article-writer.md` | Fix documentation |
| DELETE | `.claude/commands/blog-article-writer/` | Remove after migration |

## Prevention Measures

1. **Architectural clarity:**
   - [ ] Dokumentuj różnicę między Commands (docs) a Skills (executable)
   - [ ] Użyj spójnego nazewnictwa

2. **Testing:**
   - [ ] Testuj skills przed dokumentowaniem ich jako "działające"
   - [ ] Dodaj smoke test dla workflow

3. **Documentation:**
   - [ ] Aktualizuj docs gdy zmieniasz architekturę
   - [ ] Unikaj sprzecznych informacji

## Next Steps

1. Zdecyduj którą opcję implementować (rekomendacja: Option 1)
2. Jeśli Option 1: Użyj `/bug_fix:implement-fix` z tym RCA
3. Przetestuj zmiany na nowym artykule
4. Zaktualizuj dokumentację

---

**RCA Status:** Approved - Ready for Implementation Decision

## Appendix: Current vs Expected Architecture

### Current (Broken)
```
.claude/
├── commands/                 # ← Dokumentacja (nieuruchamialna)
│   └── blog-article-writer/
│       ├── execute.md
│       ├── validate.md
│       └── ...
└── skills/                   # ← Executable skills
    ├── portfolio-copywriting/  ✓ działa
    └── portfolio-testing/      ✓ działa
    ❌ BRAK blog-article-writer
```

### Expected (Working)
```
.claude/
├── commands/                 # ← Dokumentacja reference (opcjonalnie)
│   └── blog-article-writer/
└── skills/                   # ← Executable skills
    ├── portfolio-copywriting/  ✓
    ├── portfolio-testing/      ✓
    └── blog-article-writer/    ← NOWY (executable)
        ├── SKILL.md
        └── subcommands/
            ├── validate.md
            └── generate-og-prompt.md
```
