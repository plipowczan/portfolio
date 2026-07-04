## ADDED Requirements

### Requirement: Blog content is free of AI-tell typographic characters

Published blog markdown under `src/content/blog/**/*.md` (both Polish root and `en/` subdirectory) SHALL NOT contain the em dash `—` (U+2014), the en dash `–` (U+2013), or the horizontal-ellipsis character `…` (U+2026). These SHALL be replaced by their plain-keyboard equivalents. Polish quotation marks `„` and `"` SHALL be preserved as correct typography.

#### Scenario: Space-wrapped dash replaced with hyphen

- **WHEN** a post contains a sentence dash written as ` — ` or ` – ` (surrounded by spaces)
- **THEN** it is replaced with ` - ` (plain hyphen, surrounding spaces preserved)

#### Scenario: Numeric range dash replaced without spaces

- **WHEN** a post contains a numeric range such as `2020–2025` (dash directly between digits)
- **THEN** it is replaced with `2020-2025` (plain hyphen, no surrounding spaces introduced)

#### Scenario: Polish quotation marks left intact

- **WHEN** a post contains Polish quotes `„tekst"`
- **THEN** the quotation marks are not altered by the cleanup

#### Scenario: Validation gate passes

- **WHEN** `grep -nP '[\x{2014}\x{2013}\x{2026}]'` is run over `src/content/blog/**/*.md`
- **THEN** it returns no matches (empty result, exit code 1)

### Requirement: Copywriter skill forbids AI-tell phrasing constructions

The `portfolio-copywriting` skill (`.claude/skills/portfolio-copywriting/references/writing-style.md`) SHALL document a set of forbidden rhetorical AI-tell phrasing constructions, in addition to the existing punctuation rule, covering both Polish and English. The guidance SHALL use the same ✅/❌ example format as the existing "AI-tells" punctuation subsection so it is actionable at authoring time.

#### Scenario: Antithesis-dash construction is forbidden

- **WHEN** an author consults the writing-style guidance
- **THEN** it explicitly forbids the "It's not just X, it's Y" / "To nie X - to Y" antithesis construction with a ❌ example and a ✅ rewrite

#### Scenario: Empty openers and closers are forbidden

- **WHEN** an author consults the writing-style guidance
- **THEN** it forbids filler openers ("W dzisiejszym cyfrowym świecie...", "In today's fast-paced...") and filler closers ("Podsumowując...", "In conclusion...", "Warto pamiętać, że...") with examples

#### Scenario: Guidance covers both languages

- **WHEN** an author writes an EN post under `src/content/blog/en/`
- **THEN** the forbidden-phrasing list provides English examples, not only Polish
