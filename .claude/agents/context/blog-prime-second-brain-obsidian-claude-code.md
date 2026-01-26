# Blog Prime: Second Brain with Obsidian, Claude Code and Skills

**Date:** 2026-01-26
**Topic:** Building a Second Brain with Obsidian, Claude Code, and Claude Code Skills
**Status:** PRIMED - Ready for planning

---

## Source Materials Analyzed

### 1. User Notes (`docs/blog/content.md`)

Key points from Pawel's personal notes:

- Previously used Quartz concept for second brain with Obsidian
- Currently works extensively with Claude Code and wants similar knowledge organization
- The combination of Obsidian + Claude Code is excellent:
  - Obsidian provides convenient local and offline notes
  - Claude Code provides AI processing capabilities for those notes
- Claude Code Skills can connect second brain with other tools (calendar, email, task manager)
- File-based workflow is highly appealing
- Can easily create structured artifacts based on defined templates
- Has defined templates for specific documents
- Easy to link documents and create new ones from existing
- Can easily create documents from notes or summaries from larger documents
- Plans to return to regular updating and organizing knowledge
- Wants to experiment with different templates and document structures

### 2. YouTube Transcript (`docs/blog/transcript_jYMhDEzNAN0.txt`)

**Creator:** Cole Medin (Dynamist)
**Key concepts from the video:**

#### Why Claude Code for Second Brain

- Claude Code capabilities needed for second brain: file operations, search, terminal commands, web search
- Only "code intelligence" is coding-specific - rest is general assistant capabilities
- Research: web search + terminal execution
- Ideation: generating ideas
- Organization: terminal execution, file operations, file search

#### Why Obsidian

- Local and private knowledge base
- Files stored as markdown on computer
- Markdown = best format for LLM understanding
- Claude Code excels with file system
- Obsidian = good format + file system = perfect combination
- Acts as a canvas for all content (PowerPoints, YouTube scripts, ideas)
- Better than Notion - no need for MCP server, direct file access

#### Why Skills

- Brings everything together
- Gives capabilities, processes, and guidelines to Claude Code
- Context-efficient through progressive disclosure
- Flexible - agent specializes itself per session
- Description given upfront, skill.md loaded when needed
- Third layer: cookbook folders with specific scripts/references

#### Progressive Disclosure

- Only load context when needed
- Description → skill.md → reference files/scripts
- Prevents context window overload
- Allows dozens/hundreds of capabilities

#### MCP Integration

- MCP2skill approach - transforms MCP servers into skills
- Interacts with MCPs through Python script (deterministic)
- Prevents context bloat from MCP tool descriptions
- Example: Zapier MCP for Gmail, Calendar, Slack, Asana

#### Skills Demonstrated

- Brand and voice generator
- PowerPoint generator (code execution for slides)
- MCP client skill
- Skill creator (from Anthropic)
- Content engine
- YouTube script
- LinkedIn posts
- X posts
- Excalidraw diagrams
- Motion video generation

#### Template/Starter Available

- GitHub repo with skills
- Brand system documentation
- Workflow guidelines

---

## Target Audience Profile

### Primary Audience

- Knowledge workers who want to organize their ideas with AI assistance
- Developers/engineers already using Claude Code for coding
- Productivity enthusiasts interested in PKM (Personal Knowledge Management)
- Content creators who need to manage ideas, research, and output

### Knowledge Level

- Familiar with Obsidian basics or willing to learn
- Know Claude Code exists (may not know non-coding uses)
- Understand basic markdown
- Polish tech professionals (Polish article with English technical terms)

### Pain Points

- Information overload - too many notes, no structure
- Context switching between tools
- Difficult to connect ideas across documents
- Manual knowledge organization is time-consuming
- AI chat history lost, can't build on previous work

---

## Unique Angle / Value Proposition

### Main Angle

**"Claude Code to nie tylko narzędzie do kodowania - to potężny asystent do organizacji wiedzy, szczególnie w połączeniu z Obsidian i Skills"**

### Key Differentiators from Cole's Video

1. **Polish perspective** - Local adaptation for Polish audience
2. **Practical focus** - Less about capabilities, more about implementation
3. **Pawel's personal workflow** - How he specifically uses it
4. **Skills as connectors** - Emphasis on connecting to other tools
5. **Template-first approach** - Using document templates in brain

### Value Props

- Local, private, offline-capable (Obsidian)
- AI-powered processing (Claude Code)
- Extensible through skills
- File-based = version controlled, portable
- Context-efficient (progressive disclosure)

---

## Technical Concepts to Cover

### Core Concepts

1. **Second Brain** - PKM system for capturing, organizing, retrieving knowledge
2. **Progressive Disclosure** - Loading context only when needed
3. **Skills** - Claude Code's capability system
4. **MCP (Model Context Protocol)** - Connecting to external services
5. **File-based workflow** - Everything as markdown files

### Technical Elements

- Obsidian vault structure
- `.claude/skills/` directory structure
- skill.md format and fields
- Skill triggers/descriptions
- MCP configuration (mcp-config.json)
- Document templates in Obsidian

### Code Examples Needed

1. Basic skill.md structure
2. Example skill trigger configuration
3. Document template example (markdown)
4. MCP to skill conversion concept
5. Folder structure for second brain

---

## Existing Article Style Patterns Observed

### From `5-technik-pracy-z-claude-code.md`

- Long-form article (14 min read, ~3500 words)
- Category: AI
- Strong hook in intro (problem → discovery → transformation)
- Numbered techniques as main structure
- Code blocks with proper language tags
- Tables for structured comparisons
- FAQ section with accordion format
- CTA with HTML/Tailwind styling
- "Przydatne zasoby" section at end
- Personal experience woven throughout
- Polish with English technical terms (Claude Code, skills, PRD, etc.)

### From `vibe-coding-przewodnik.md`

- Tutorial/how-to format
- Credit to original source (PageAI)
- Step-by-step approach
- Practical prompts to copy
- Tool recommendations
- "Kluczowe wnioski" summary
- "Pułapki, których unikaj" section
- FAQ at end

### Writing Style Characteristics

- First person ("Z doświadczenia wiem", "Mój workflow")
- Direct tone ("To jest sedno", "To brzmi wbrew intuicji")
- Problem → Solution structure
- Concrete examples over theory
- Lists for scanability
- Bold for key terms and numbers
- Code blocks with language tags
- Reflective insights ("Sam popełniłem ten błąd")

---

## Proposed Article Structure

### Title Ideas

- "Second Brain z Obsidian i Claude Code - jak AI zmienia organizację wiedzy"
- "Obsidian + Claude Code + Skills: Twój prywatny system zarządzania wiedzą"
- "Jak zbudować Second Brain z Claude Code i Obsidian"

### Main Sections

1. **Hook** - Claude Code to nie tylko kodowanie (surprise element)
2. **Co to jest Second Brain** - Brief intro to PKM concept
3. **Dlaczego Obsidian + Claude Code** - The power combination
4. **3 filary systemu** - Obsidian (local), Claude Code (AI), Skills (extensibility)
5. **Progressive Disclosure** - Why skills are context-efficient
6. **Praktyczny setup** - Folder structure, basic skill example
7. **Przykładowe skills** - Document generation, research, organization
8. **Integracja z innymi narzędziami** - MCP connection concept
9. **Mój workflow** - Pawel's personal usage patterns
10. **Jak zacząć** - First steps for reader
11. **FAQ** - 4-6 questions
12. **CTA** - AI consultation

### Estimated Length

- ~2500-3000 words
- 12-15 min read time
- Category: AI
- Tags: AI, Claude Code, Obsidian, Second Brain, Skills, Produktywność

---

## Resources to Reference

### External

- Cole Medin's YouTube channel (credit for inspiration)
- Obsidian official site
- Claude Code documentation
- Skills documentation (Anthropic)
- MCP documentation

### Internal (Pawel's blog)

- Link to `5-technik-pracy-z-claude-code` article (related content)
- Potentially link to automation articles

---

## Next Steps

1. `/blog-article-writer:plan "second brain obsidian claude code skills"` - Create detailed article plan
2. Generate article content following plan
3. Create OG image prompt
4. Validate and test

---

## Notes for Writing

- Credit Cole Medin as inspiration source
- Focus on practical implementation
- Include Pawel's personal perspective and workflow
- Use proper Polish with English technical terms
- Include working code examples (skill.md format, folder structure)
- FAQ should answer realistic reader questions
- CTA should focus on AI consultation (category: AI)
