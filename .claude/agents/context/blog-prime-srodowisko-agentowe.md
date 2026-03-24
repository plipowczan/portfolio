# Blog Prime: Moje środowisko agentowe — jak buduję AI OS dla dwóch firm

## Source Materials Analyzed

### Primary Sources (docs/blog/)
1. **my_thoughts.md** — Pawel's personal draft notes about his agentic environment setup across two companies (200IQ Labs PSA + PLSoft JDG). Core source — covers architecture, philosophy, observations, and open questions.
2. **porównaj nowoczesne usługi_narzędzia AI_ Claude Di.md** — Perplexity research comparing Claude Dispatch, Perplexity Computer, OpenClaw, NemoClaw. Good for competitive context and positioning.
3. **compass_artifact_wf-...md** — Comprehensive 16-tool comparison report on sandboxed AI agents (E2B, Daytona, Modal, Browserbase, etc.). Deep technical analysis with pricing and architecture details.
4. **Porównanie Narzędzi AI do Automatyzacji.md** — Academic-style report on CUA (Computer-Using Agent) systems 2026. Covers MCP, A2A protocols, Claude Cowork/Dispatch, Perplexity Computer, OpenClaw/NemoClaw architecture.

### Existing Blog Articles Analyzed (for style)
- `skills-2-0-multi-agent-system-zarzadzanie-firma.md` (id:21, latest, 14min read)
- `5-technik-pracy-z-claude-code.md` (id:10, 14min)
- `openclaw-bezpieczenstwo-agentow-ai.md` (id:20, 14min)
- `opsx-workflow-strukturyzowana-praca-z-ai.md` (id:19, 12min)

### Copywriting Guidelines
- Writing style: `references/writing-style.md` — Polish + English tech terms, direct/practical/personal tone, first person
- Article structure: `references/article-structure.md` — YAML frontmatter, categories, CTA templates, SEO guidelines
- SKILL.md — Quick reference for workflow

## Key Topics Identified

### Core Narrative Arc
1. **Problem**: AI w firmie to wciąż chaos — rozproszone narzędzia, brak orkiestracji, zero wersjonowania (builds on Skills 2.0 article)
2. **Solution**: Środowisko agentowe oparte na trzech warstwach: Skills (wiedza), Context (dane firmowe), Tools (integracje API)
3. **Proof**: Działa na dwóch firmach — 200IQ Labs (PSA, produkt Qamera AI) i PLSoft (JDG, szkolenia/doradztwo)
4. **Philosophy**: Git jako fundament zaufania, Markdown jako lingua franca, niezależność od platformy
5. **Market context**: Porównanie z innymi podejściami (Perplexity Computer, OpenClaw, Claude Dispatch)

### Unique Angles / Value Props
- **Practitioner perspective** — nie teoria, ale działający system na dwóch firmach
- **Agent Skills Standard** — otwarty format, przenośny między IDE (Claude Code, Cursor, Copilot, Antigravity)
- **Separacja skills od kontekstu** — ten sam zestaw agentów, różne dane firmowe. Skalowalne na klientów
- **Git = bezpieczeństwo** — kluczowy insight: kontrola wersji eliminuje strach przed autonomią agenta
- **Lekkie integracje** — bash/Python scripts zamiast ciężkich frameworków MCP. Pragmatyzm
- **Progressive disclosure** — oszczędność context window przez ładowanie on-demand
- **Claude.ai Dispatch** — read-only access do Revolut, Stripe, ClickUp. Świadome ograniczanie uprawnień
- **Nanoclaw/sandbox** — eksperyment R&D, otwarte pytania o bezpieczeństwo

### Technical Concepts to Cover
- Architecture diagram: IDE → Skills → Context → Tools (4 layers)
- Git submodules for shared vs private skills
- Symlinks for multi-IDE support (sync-skills.sh + git hooks)
- Auto-triggering agents based on keywords
- Progressive disclosure pattern
- Comparison with market alternatives (table)

## Target Audience Profile
- **Primary**: Właściciele firm / tech leaders / CTO eksperymentujący z AI w biznesie
- **Secondary**: Developerzy budujący agentic systems
- **Knowledge level**: Intermediate — znają AI tools (ChatGPT, Claude), ale nie budowali systematycznego środowiska agentowego
- **Pain point**: Mają wiele rozproszonych AI narzędzi, brak systemu, brak wersjonowania, context switching

## Existing Article Style Patterns

### Opening Pattern
Pawel starts with a relatable problem or bold statement, then bridges to personal experience:
- "Od kilku dni buduję coś, czego szukałem od dawna..."
- "150 tysięcy gwiazdek na GitHubie w dwa tygodnie..."
- "Większość programistów traktuje AI coding assistants jak szybszy Stack Overflow..."
- "Istnieje bardzo duże prawdopodobieństwo, że zostawiasz większość potencjału..."

### Structure Pattern
1. Hook (1-2 paragraphs)
2. Problem statement with ASCII diagram
3. Solution architecture (layered explanation)
4. Step-by-step walkthrough with code/config examples
5. Lessons learned / observations
6. CTA

### Formatting Conventions
- ASCII diagrams in ```text blocks for architecture
- Bold for key concepts at first mention
- Internal links to related articles
- 12-14 min read time typical
- Polish with natural English tech terms (no forced translations)
- H2 for main sections, H3 for subsections
- Lists for enumerations, numbered for sequences

### Tone Markers
- First person throughout
- "Z własnego doświadczenia wiem..."
- Acknowledges what doesn't work alongside successes
- Direct, no fluff, practical
- References to specific tools/versions
- Self-referential links to previous articles

## Internal Links to Include
- `/blog/skills-2-0-multi-agent-system-zarzadzanie-firma` — Skills 2.0 article (predecessor, foundation)
- `/blog/5-technik-pracy-z-claude-code` — Claude Code techniques
- `/blog/openclaw-bezpieczenstwo-agentow-ai` — OpenClaw security (context for market comparison)
- `/blog/second-brain-obsidian-claude-code-skills` — Second Brain article (knowledge management predecessor)
- `/blog/opsx-workflow-strukturyzowana-praca-z-ai` — OPSX workflow

## Code/Config Examples Needed
- Architecture diagram (ASCII/text block): 4-layer stack
- Example SKILL.md structure (truncated)
- Example context file structure
- Git submodule setup commands
- Symlink sync script concept
- Claude.ai Dispatch permissions setup (conceptual)

## Article Metadata (Proposed)
- **id**: 22 (next after 21)
- **slug**: `srodowisko-agentowe-ai-dwie-firmy` (or similar)
- **category**: AI
- **readTime**: 14 min (consistent with similar depth articles)
- **tags**: AI, Claude Code, Agent Skills, Automatyzacja, Multi-Agent System, Git

## Key Decisions for Planning Phase
1. **Scope**: Focus on Pawel's own setup (my_thoughts.md) or also include market comparison (Perplexity/OpenClaw)?
   - Recommendation: Primarily own setup, with short market context section using research materials
2. **Depth**: How much architecture detail vs philosophy/principles?
   - Recommendation: Balance — enough detail to be actionable, enough philosophy to be inspiring
3. **Nanoclaw section**: Include or leave for future article?
   - Recommendation: Brief mention as "what's next" section, not deep dive
4. **Code examples**: Real examples from repos or sanitized/simplified?
   - Recommendation: Simplified/conceptual — real repos are private

## Readiness Assessment
- [x] All source materials identified and read
- [x] Pawel's writing style understood
- [x] Portfolio copywriting guidelines reviewed
- [x] Key topics and technical concepts extracted
- [x] Prime artifact created with comprehensive context
- [x] Ready to proceed to planning phase
