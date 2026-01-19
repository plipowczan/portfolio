# Command: /blog-article-writer:plan

## Purpose

Create detailed implementation plan for blog article based on prime research.

## Phase

PLAN (Planning) - Design article structure and approach

## Prerequisites

- `/blog-article-writer:prime` must be completed
- Prime artifact exists in `.claude/agents/context/`

## Steps

### 1. Load Prime Context

- Read prime artifact: `.claude/agents/context/blog-prime-{topic}.md`
- Review key topics, audience, angle, technical concepts

### 2. Determine Next Blog ID

- List blog files: `ls src/content/blog/*.md`
- Grep for IDs: `grep "^id:" src/content/blog/*.md`
- Calculate next available ID (highest + 1)

### 3. Design Article Structure

**Frontmatter Planning:**

- id: [next available]
- slug: [url-friendly-slug]
- title: [compelling, 50-60 chars, keyword-rich]
- excerpt: [hook, 150-160 chars]
- category: [AI | Automatyzacja | No-Code]
- author: Pawel Lipowczan
- date: [today's date YYYY-MM-DD]
- readTime: [estimate based on ~200 words/min]
- image: /images/og-[slug].webp
- tags: [3-5 relevant tags]

**Content Structure:**

1. **Introduction** (~300 words)
   - Hook: compelling problem/question/scenario
   - Personal angle from Pawel's experience
   - Value preview

2. **Main Sections** (H2 headers)
   - [List main topics from prime]
   - Each section ~500-700 words
   - Include code examples with LANGUAGE TAGS
   - Bullet points and numbered lists
   - Practical examples

3. **Conclusion** (~200 words)
   - Summary of key takeaways (numbered list)
   - Personal closing from Pawel
   - Call to action

4. **CTA Section**
   - HTML div with consultation offer
   - Link to /#contact

5. **Resources** (optional)
   - External links with descriptions

6. **FAQ Section** (~400-600 words) **[REQUIRED]**
   - **Placement: ALWAYS at the very end of the article (after Conclusion, CTA, and Resources)**
   - H2 header: "FAQ"
   - 4-6 natural questions (10-25 words each)
   - Snippet-style answers (2-4 sentences)
   - Follow `docs/blog/FAQ_TEMPLATE.md` structure
   - Optimize for LLM/AI consumption (AEO)
   - FAQPage schema will auto-generate from content

### 4. Language & Style Plan

**Polish + English Technical Terms:**

- Keep English: technology names, frameworks, established terms
- Use Polish: explanations, descriptions, narrative
- Never polonize: "komendyfikacja" → "commandification" or describe in Polish

**Code Blocks:**

- ALL code blocks must have language tag
- Use `text` if no specific language applies
- Plan where code examples go
- Ensure proper formatting in markdown

**Tone:**

- Direct, practical, personal (Pawel's voice)
- First-person perspective
- Short paragraphs (2-4 sentences)
- Bold key concepts on first mention

### 5. SEO Planning

- Primary keyword in title
- Secondary keywords in H2 headers
- Internal links to other blog posts (if relevant)
- External links to authoritative sources

### 6. Technical Accuracy Checklist

For each technical claim/example:

- [ ] Version numbers specified (if relevant)
- [ ] Code examples syntactically correct
- [ ] Links to official docs included
- [ ] Best practices verified

### 7. Create Plan Artifact

Save to `.claude/agents/plans/blog-{slug}.md` with:

- Complete article structure outline
- Frontmatter specification
- Section-by-section breakdown
- Code example placeholders with language tags
- Word count targets
- Technical accuracy notes
- SEO keywords
- Style guidelines to follow

## Success Criteria

- [ ] Plan artifact created with full structure
- [ ] Next blog ID determined
- [ ] Frontmatter completely specified
- [ ] All main sections outlined with word targets
- [ ] FAQ section planned (4-6 questions)
- [ ] Code examples identified with language tags
- [ ] Language guidelines noted (no polonization)
- [ ] SEO keywords identified
- [ ] Ready for execution phase

## Next Command

After plan approved: `/blog-article-writer:execute`
