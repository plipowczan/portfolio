# Subcommand: plan

## Purpose

Create detailed implementation plan for blog article based on prime research.

## Usage

```text
/blog-article-writer:plan {topic}
```

**Example:**
```text
/blog-article-writer:plan "second brain obsidian claude code"
```

## Prerequisites

- Prime completed: `.claude/agents/context/blog-prime-{topic}.md` exists

## Execution Steps

### Step 1: Load Prime Context

Read prime artifact:
```bash
cat .claude/agents/context/blog-prime-{topic}.md
```

Review:
- Key topics
- Target audience
- Unique angle
- Technical concepts

### Step 2: Determine Next Blog ID

```bash
grep "^id:" src/content/blog/*.md | sort -t: -k2 -n | tail -1
```

Calculate: highest ID + 1

### Step 3: Design Frontmatter

```yaml
---
id: {next_id}
slug: {url-friendly-slug}
title: "{compelling title, 50-60 chars}"
excerpt: "{hook, 150-160 chars}"
category: {AI | Automatyzacja | No-Code}
author: Pawel Lipowczan
date: {YYYY-MM-DD}
readTime: {n} min
image: /images/og-{slug}.webp
tags:
  - Tag1
  - Tag2
  - Tag3
---
```

**Guidelines:**
- Title: 50-60 chars, keyword-rich
- Excerpt: 150-160 chars, compelling hook
- Slug: lowercase, hyphens, 3-6 words
- Read time: ~200 words/min

### Step 4: Plan Article Structure

```markdown
### 1. INTRODUCTION (~300 words)

**Hook:** {compelling opening}

**Problem Statement:**
- {problem 1}
- {problem 2}

**Value Preview:**
- What reader will learn

---

### 2. {MAIN SECTION 1} (~500 words)

**H2: {Section Title}**

**Content:**
- {point 1}
- {point 2}

**Code Example:**
```{language}
{code}
```

---

### 3. {MAIN SECTION 2} (~500 words)

...

---

### N. KLUCZOWE WNIOSKI (~200 words)

**Numbered list (5-6 points):**
1. {takeaway 1}
2. {takeaway 2}

---

### CTA SECTION

HTML CTA block with consultation offer.

---

### PRZYDATNE ZASOBY (~100 words)

- [Resource 1](link)
- [Resource 2](link)

---

### FAQ SECTION (~500 words)

**4-6 questions:**

Q1: {natural question}
A1: {2-4 sentence answer}

Q2: ...
```

### Step 5: Plan FAQ Questions

Design 4-6 questions:
- Natural Polish phrasing (10-25 words)
- Cover common reader questions
- Snippet-style answers (2-4 sentences)
- Optimize for LLM/AI consumption

### Step 6: Technical Accuracy Checklist

For each technical claim:
- [ ] Version numbers specified
- [ ] Code examples syntactically correct
- [ ] Links to official docs
- [ ] Best practices verified

### Step 7: Create Plan Artifact

Save to `.claude/agents/plans/blog-{slug}.md`:

```markdown
# Blog Article Plan: {Title}

**Plan Created:** {date}
**Status:** READY FOR APPROVAL
**Prime Artifact:** `.claude/agents/context/blog-prime-{topic}.md`

---

## Frontmatter Specification

```yaml
{complete frontmatter}
```

**SEO Analysis:**
- Title: {n} chars
- Excerpt: {n} chars
- Primary keyword: {keyword}

---

## Article Structure

### Total Target: ~{n} words ({n} min read)

---

### 1. INTRODUCTION (~{n} words)

{detailed plan}

---

### 2. {SECTION} (~{n} words)

{detailed plan with code examples}

---

...

---

## Technical Accuracy Checklist

- [ ] {item 1}
- [ ] {item 2}

## Style Guidelines Reminder

**Language:**
- Polish main text
- English: {technical terms to keep}
- Never polonize

**Tone:**
- First person (Pawel's voice)
- Direct, practical
- Short paragraphs

---

## Execution Checklist

- [ ] Create article file
- [ ] Write all sections
- [ ] Verify code blocks have language tags
- [ ] Add internal links
- [ ] Verify FAQ uses accordion format
- [ ] Verify CTA uses HTML format

---

## Ready for Execution

This plan is complete and ready for `/blog-article-writer:execute`
```

## Output

```text
✅ Plan Created

Article: {title}
Slug: {slug}
Blog ID: {id}
Target: ~{n} words ({n} min read)

Plan saved to: .claude/agents/plans/blog-{slug}.md

Structure:
1. Introduction (~{n} words)
2. {Section 1} (~{n} words)
3. {Section 2} (~{n} words)
...
N. FAQ ({n} questions)

⏳ Awaiting User Approval

Review the plan and provide feedback or approve.
After approval: /blog-article-writer:execute
```

## User Feedback

Plan supports user feedback before execution:

1. User reviews plan
2. User adds comments (HTML comments, blockquotes, or inline edits)
3. Execute command reads and incorporates feedback

**Example feedback section:**
```markdown
## User Feedback & Comments

> Add more focus on privacy aspects
> Include comparison table with Notion

<!-- Remove section about MCP, not relevant -->
```

## Success Criteria

- [ ] Prime context loaded
- [ ] Next blog ID determined
- [ ] Frontmatter specified
- [ ] All sections outlined with word targets
- [ ] FAQ questions planned (4-6)
- [ ] Code examples identified
- [ ] Language guidelines noted
- [ ] Plan artifact created
- [ ] Ready for user approval
