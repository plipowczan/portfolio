# Command: /blog-article-writer:prime

## Purpose

Research and analyze source materials before writing blog article.

## Phase

PRIME (Research) - Load context and analyze materials

## When to Use

- At the start of blog article creation workflow
- User provides notes, transcripts, outlines, or research materials
- Before planning article structure

## Steps

### 1. Identify Source Materials

- Check `docs/blog/` directory for related research files
- Note any transcripts (.md files)
- Identify reference documents
- List external links or resources mentioned

### 2. Analyze Existing Blog Articles

- Read 2-3 recent articles from `src/content/blog/`
- Understand Pawel's writing style (direct, practical, personal)
- Note frontmatter format and structure patterns
- Check typical article length (read time)

### 3. Read Portfolio Copywriting Skill

- Review `.claude/skills/portfolio-copywriting/SKILL.md`
- Check writing style guidelines in `.claude/skills/portfolio-copywriting/references/writing-style.md`
- Review article structure in `.claude/skills/portfolio-copywriting/references/article-structure.md`
- Note language guidelines (Polish + English technical terms)

### 4. Analyze Source Content

- Extract key topics and concepts
- Identify target audience and knowledge level
- Note unique angles or value propositions
- List specific points user wants emphasized
- Check for code examples that need including

### 5. Research Technical Accuracy

If article involves technical concepts:

- Use Context7 MCP to verify library versions/APIs
- Check official documentation for accuracy
- Validate code examples if provided

### 6. Create Prime Artifact

Save research summary to `.claude/agents/context/blog-prime-{topic}.md` with:

- Source materials analyzed
- Key topics identified
- Target audience profile
- Unique angle/value prop
- Technical concepts to cover
- Existing article style patterns observed
- Code examples needed

## Success Criteria

- [ ] All source materials identified and read
- [ ] Pawel's writing style understood
- [ ] Portfolio copywriting guidelines reviewed
- [ ] Key topics and technical concepts extracted
- [ ] Prime artifact created with comprehensive context
- [ ] Ready to proceed to planning phase

## Next Command

After prime completes: `/blog-article-writer:plan "<article topic>"`
