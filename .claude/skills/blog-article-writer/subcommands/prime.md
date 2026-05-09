# Subcommand: prime

## Purpose

Research and analyze source materials before writing blog article.

## Usage

```text
/blog-article-writer:prime

Source materials at docs/blog/{files}
Topic: {description}
Target audience: {who}
```

## Execution Steps

### Step 1: Identify Source Materials

Check `docs/blog/` directory — **top-level only, excluding `_archive/`**:

```bash
# Bash
ls -la docs/blog/ | grep -vE '(^total|/?_archive/?$)'
```

```powershell
# PowerShell
Get-ChildItem docs/blog -Force | Where-Object { $_.Name -ne '_archive' }
```

> **DO NOT READ FROM `docs/blog/_archive/`.** That folder holds archived source materials for **past, already-published** articles. Reading anything under `_archive/` (files, MANIFESTs, packs) pollutes the prime context with stale, off-topic content and produces a worse plan. Treat `_archive/` as if it does not exist for the duration of `prime`, `plan`, and `execute`. The only subcommand that ever touches `_archive/` is `/blog-article-writer:archive`, and it only writes (never reads).

Look for (only at the top level of `docs/blog/`):
- Transcripts (.md, .txt files)
- Research notes
- Outlines
- External links/resources

### Step 2: Analyze Existing Blog Articles

Read 2-3 recent articles from `src/content/blog/`:
```bash
ls -t src/content/blog/*.md | head -5
```

Analyze for:
- Pawel's writing style (direct, practical, personal)
- Frontmatter format and structure
- Typical article length (read time)
- FAQ section format

### Step 3: Review Copywriting Guidelines

Read skill guidelines:
- `.claude/skills/portfolio-copywriting/SKILL.md`
- `.claude/skills/portfolio-copywriting/references/writing-style.md`
- `.claude/skills/portfolio-copywriting/references/article-structure.md`

Note:
- Language guidelines (Polish + English technical terms)
- Formatting standards
- CTA structure

### Step 4: Analyze Source Content

From provided materials extract:
- Key topics and concepts
- Target audience and knowledge level
- Unique angles or value propositions
- Specific points to emphasize
- Code examples needed

### Step 5: Create Prime Artifact

Save to `.claude/agents/context/blog-prime-{topic}.md`:

```markdown
# Blog Prime: {Topic}

**Date:** {YYYY-MM-DD}
**Topic:** {description}
**Status:** PRIMED - Ready for planning

---

## Source Materials Analyzed

### 1. {Source Name}

Key points:
- Point 1
- Point 2
- ...

### 2. {Source Name}

...

---

## Target Audience Profile

### Primary Audience
- {description}

### Knowledge Level
- {what they know}

### Pain Points
- {problems they face}

---

## Unique Angle / Value Proposition

### Main Angle
{description}

### Key Differentiators
1. {point 1}
2. {point 2}

---

## Technical Concepts to Cover

### Core Concepts
1. {concept} - {brief explanation}
2. {concept} - {brief explanation}

### Code Examples Needed
1. {example description}
2. {example description}

---

## Existing Article Style Patterns

From analyzing recent articles:
- {pattern 1}
- {pattern 2}
- {pattern 3}

### Writing Style Characteristics
- First person perspective
- Direct tone
- Problem → Solution structure
- Concrete examples
- Bold for key terms

---

## Proposed Article Structure

### Title Ideas
- "{title 1}"
- "{title 2}"

### Main Sections
1. {section}
2. {section}
3. ...

### Estimated Length
- ~{n} words
- {n} min read time
- Category: {AI/Automatyzacja/No-Code}

---

## Resources to Reference

### External
- {link 1}
- {link 2}

### Internal (Pawel's blog)
- Link to {related article}

---

## Next Steps

1. `/blog-article-writer:plan "{topic}"` - Create detailed plan

---

## Notes for Writing

- {note 1}
- {note 2}
```

## Output

```text
✅ Prime Complete

Topic: {topic}
Artifact: .claude/agents/context/blog-prime-{topic}.md

Source Materials Analyzed:
- {source 1}
- {source 2}

Key Findings:
- Target Audience: {description}
- Main Angle: {angle}
- Technical Concepts: {n} identified
- Code Examples Needed: {n}

Next Step: /blog-article-writer:plan "{topic}"
```

## Success Criteria

- [ ] All source materials identified and read
- [ ] Pawel's writing style understood
- [ ] Portfolio copywriting guidelines reviewed
- [ ] Key topics extracted
- [ ] Target audience identified
- [ ] Prime artifact created
- [ ] Ready for planning phase
