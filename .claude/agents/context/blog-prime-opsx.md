# Blog Prime: OPSX Workflow

**Date:** 2026-02-05
**Topic:** OpenSpec OPSX Workflow
**Source:** `docs/blog/opsx.md`

---

## Source Materials Analyzed

### Primary Source
- `docs/blog/opsx.md` - Complete OPSX documentation (645 lines)

### Reference Materials
- Portfolio copywriting skill: `.claude/skills/portfolio-copywriting/SKILL.md`
- Writing style guidelines: `.claude/skills/portfolio-copywriting/references/writing-style.md`
- Article structure: `.claude/skills/portfolio-copywriting/references/article-structure.md`

### Existing Articles Reviewed
- `5-technik-pracy-z-claude-code.md` - Similar topic (AI coding workflows)
- `second-brain-obsidian-claude-code-skills.md` - Similar structure (tool integration)

---

## Key Topics Identified

### 1. What is OPSX
- Standard workflow for OpenSpec
- Fluid, iterative workflow vs rigid legacy phases
- Actions, not phases approach

### 2. Problems with Legacy OpenSpec
- Instructions hardcoded in TypeScript
- All-or-nothing approach
- Fixed structure, no customization
- Black box when output is bad

### 3. OPSX Core Commands
| Command | Purpose |
|---------|---------|
| `/opsx:explore` | Think through ideas, investigate problems |
| `/opsx:new` | Start a new change |
| `/opsx:continue` | Create next artifact based on dependencies |
| `/opsx:ff` | Fast-forward - create all planning artifacts at once |
| `/opsx:apply` | Implement tasks |
| `/opsx:sync` | Sync delta specs to main |
| `/opsx:archive` | Archive when done |

### 4. Artifact Graph Model
- Directed acyclic graph (DAG)
- Dependencies as enablers, not gates
- State: BLOCKED → READY → DONE
- Topological sort for ordering

### 5. Schema System
- `spec-driven` default: proposal → specs → design → tasks
- Custom schemas via `schema.yaml`
- Schema management commands

### 6. Project Configuration
- `openspec/config.yaml` for defaults
- Context injection for project-specific info
- Per-artifact rules

### 7. When to Update vs Start Fresh
- Same intent = update existing
- Fundamentally different work = new change
- Heuristics based on identity, scope overlap, completion

---

## Target Audience Profile

### Primary Audience
- Developers using AI coding assistants (Claude Code, Cursor, Windsurf)
- Teams wanting structured development workflows
- Those frustrated with unstructured AI prompting

### Knowledge Level
- Intermediate to advanced developers
- Familiar with git workflows, PR processes
- May or may not know OpenSpec

### Pain Points
- Reactive prompting without system
- Lost context between sessions
- Inconsistent AI outputs
- Difficulty tracking changes across features

---

## Unique Angle / Value Proposition

### Main Angle
OPSX brings **software engineering discipline** to AI-assisted development:
- Structured artifacts (proposal → specs → design → tasks)
- Dependency management
- Iterative refinement without losing context

### Differentiation from PIV Article
- PIV = general methodology for any AI coding
- OPSX = specific OpenSpec implementation with CLI tooling
- OPSX has schema customization, artifact graphs

### Key Value Props
1. **Fluid iteration** - edit specs mid-implementation, no phase gates
2. **Dependency awareness** - system knows what's ready
3. **Customizable schemas** - define your own artifacts
4. **CLI integration** - `openspec` commands for status, validation

---

## Technical Concepts to Cover

### Must Include
1. Artifact dependency graph (DAG)
2. Commands overview (`/opsx:*`)
3. Schema structure (`schema.yaml`)
4. Project config (`openspec/config.yaml`)
5. Update vs new change decision tree

### Optional / Advanced
- Custom schema creation
- Information flow comparison (legacy vs OPSX)
- Iteration model diagrams

### Code Examples Needed
- `schema.yaml` example
- `config.yaml` example
- Typical workflow session transcript
- Dependency graph ASCII art

---

## Existing Article Style Patterns Observed

### From `5-technik-pracy-z-claude-code.md`
- Personal opening hook ("Istnieje bardzo duże prawdopodobieństwo...")
- Problem → Solution structure
- Practical code examples in code blocks
- FAQ section with `<details open>` accordion
- HTML CTA block at end
- "Kluczowe wnioski" section with numbered list
- "Przydatne zasoby" section with links

### From `second-brain-obsidian-claude-code-skills.md`
- Concept explanation before practical use
- Tool comparisons (Obsidian vs alternatives)
- Step-by-step "Jak zacząć" section
- Personal workflow description
- Progressive disclosure in explanation

### Writing Style
- Direct, practical tone
- First person ("Zacznij od...", "Mój workflow...")
- Polish with English technical terms (workflow, schema, artifacts)
- Short paragraphs (3-4 sentences max)
- Extensive use of lists and code blocks

---

## Article Structure Recommendation

### Suggested Outline
1. **Hook** - Problem z reaktywnym promptowaniem
2. **Co to jest OPSX** - Definicja, porównanie z legacy
3. **Dlaczego OPSX istnieje** - 4 problemy legacy + jak OPSX je rozwiązuje
4. **Komendy OPSX** - Przegląd wszystkich `/opsx:*`
5. **Architektura** - DAG, stany, zależności
6. **Schematy** - Customizacja workflow
7. **Konfiguracja projektu** - `config.yaml`
8. **Kiedy aktualizować vs nowa zmiana** - Decision tree
9. **Mój workflow z OPSX** - Praktyczny przykład
10. **Jak zacząć** - Pierwsze kroki
11. **Kluczowe wnioski**
12. **FAQ** (5-6 pytań)
13. **CTA** - Konsultacja
14. **Przydatne zasoby**

### Category
**Code** (narzędzia programowania, SDLC)

### Estimated Read Time
12-14 min (similar to PIV article)

---

## Notes for Planning Phase

### Potential Hooks
- "Większość programistów traktuje AI coding assistants jak szybszy Stack Overflow..."
- "Czy kiedykolwiek zaczynałeś feature z AI, tylko po to żeby zgubić się w chaosie zmian?"
- "Legacy workflows for AI development fight against how work actually happens."

### Connection to PIV Article
- OPSX can be seen as specific tooling that implements PIV-like principles
- Link to PIV article in "Przydatne zasoby"
- Don't repeat PIV content, focus on OPSX-specific features

### Diagrams to Consider
- Artifact dependency graph (proposal → specs/design → tasks)
- State transitions (BLOCKED → READY → DONE)
- Legacy vs OPSX comparison table

---

## Ready for Planning Phase

All source materials analyzed. Context loaded. Ready for `/blog-article-writer:plan "OPSX workflow"`.
