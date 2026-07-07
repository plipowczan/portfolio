## ADDED Requirements

### Requirement: Course lessons use plain Polish

Course lessons under `src/content/kurs/*.md` SHALL follow the shared plain-Polish rules (`.claude/rules/content/10-prosty-polski.md`): no Polonized verbs, no English false friends, consistent terminology for one concept, and no borrowed nouns in prose where a plain Polish equivalent exists. Command names, file names, code blocks, simulated tool output, and keep-list product terms (including "vault") SHALL remain unchanged. The lessons SHALL pass the shared forbidden-word grep.

#### Scenario: False friend "stale" is eliminated

- **WHEN** lesson 4's `/lint` class list is read
- **THEN** it says "przeterminowana treść (>1 rok bez przeglądu)" — not "treść stale", which a Polish reader parses as "constantly"

#### Scenario: One concept, one term

- **WHEN** lesson 3 describes combining a source with an existing note
- **THEN** both the phase description and the FAQ use "scalenie/scala" (no prose switch to "merge")

#### Scenario: Polonized verbs removed

- **WHEN** lesson 3 refers to a previously processed video
- **THEN** it uses a Polish verb ("jeśli to samo wideo już wczytałeś") — not "ingestowałeś" — while the command keeps its name (`/ingest`)

#### Scenario: Grammar error fixed

- **WHEN** lesson 3's diff summary is read
- **THEN** it says "Jeden wniosek" (not "Jedno wiadomość")

#### Scenario: Ornaments carry information or are cut

- **WHEN** lesson 5 is read
- **THEN** "arsenał komend" reads as "zestaw komend", "zżyta baza" as a concrete description (e.g. "baza dopracowana miesiącami"), and "dopieszczone skille" as "sprawdzone skille"

#### Scenario: Vocabulary gate passes

- **WHEN** the forbidden-word grep from the shared rules file runs over `src/content/kurs/*.md`
- **THEN** it returns no prose matches

### Requirement: Lessons define hard terms at first use

Each lesson SHALL define difficult or specialist terms at their first occurrence in that lesson, as a parenthetical gloss (or one follow-up sentence for long definitions). Keep-list English terms also receive a gloss at first use — e.g. lesson 1 introduces "vault (tak Obsidian nazywa folder z notatkami)" even though "vault" stays in English throughout.

#### Scenario: Keep-list term glossed at first use

- **WHEN** lesson 1 first mentions "vault"
- **THEN** the first occurrence carries a plain-Polish parenthetical definition and later occurrences appear bare

#### Scenario: Per-lesson scope

- **WHEN** a term already glossed in lesson 1 first appears in lesson 3
- **THEN** lesson 3 glosses it again at its own first occurrence (lessons are read independently)
