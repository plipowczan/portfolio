# Blog Article Writer - Prime Context

**Generated:** 2026-01-26
**Purpose:** Research summary for blog article creation workflow

---

## Source Materials Analyzed

### Available Research Files

1. **`docs/blog/content.md`** - Notes about Framer Motion animations and Antigravity tool reference
2. **`docs/blog/transcript_8PPbu3pSgAE.txt`** - YouTube video transcript about Antigravity (AI website builder) for creating scroll animations similar to Apple's product pages

### Key Topic from Transcript

The transcript covers:
- Using **Antigravity** (AI website builder) for premium scroll animations
- Research phase: analyzing top brands (Artisan Chocolate, Cadbury, The Edible)
- Setting up custom materials in Antigravity agent settings
- Creating animated hero sections with Google WUSC and Google Flow
- Converting video to image sequences for scroll animations
- Adding dark/light mode toggle
- Deploying via Netlify

---

## Existing Blog Articles Analyzed (Style Patterns)

### Article 1: `second-brain-obsidian-claude-code-skills.md`
- **ID:** 16
- **Read Time:** 14 min
- **Category:** AI
- **Structure:** Hook → Problem → Solution explanation → Practical examples → How to start → Key takeaways → FAQ
- **Style Notes:**
  - Personal hook: "Claude Code to nie tylko narzędzie do kodowania. Brzmi jak clickbait, ale..."
  - Direct address: "Problem, który pewnie znasz..."
  - Code blocks with `text` language for folder structures
  - H2 for main sections, H3 for subsections
  - FAQ with accordion format (`<details open>`)

### Article 2: `5-technik-pracy-z-claude-code.md`
- **ID:** 10
- **Read Time:** 14 min
- **Category:** AI
- **Structure:** Hook with personal experience → 5 numbered techniques → PIV Skeleton framework → How to start → Key takeaways → FAQ
- **Style Notes:**
  - Opens with relatable problem: "Istnieje bardzo duże prawdopodobieństwo, że zostawiasz większość potencjału..."
  - Uses bold for key concepts: **PRD-first development**, **okno kontekstu**
  - Practical workflow diagrams with ASCII arrows
  - Code examples are contextual and actionable
  - Numbered techniques with clear subheadings

### Article 3: `vibe-coding-przewodnik.md`
- **ID:** 14
- **Read Time:** 12 min
- **Category:** AI
- **Structure:** Introduction → Definition → 3 Pillars → Step-by-step guide → Tools → Practical tips → Pitfalls → FAQ
- **Style Notes:**
  - Attribution to source: "Kilka tygodni temu trafiłem na materiał zespołu PageAI..."
  - Tables for structured information (Visual Style, Layout Structures, Color Themes)
  - Design tokens in JSON format
  - Pro tips highlighted
  - "Pułapki, których unikaj" section

---

## Pawel's Writing Style Summary

### Tone & Voice
- **Language:** Polish with natural English technical terms
- **Tone:** Direct, practical, personal, reflective
- **Perspective:** First person ("ja", "my")
- **Approach:** Experience-based with concrete examples

### Characteristic Elements

1. **Personal hooks:**
   - "Z wlasnego doswiadczenia wiem, że..."
   - "Problem, który pewnie znasz..."
   - "Kilka tygodni temu trafiłem na..."

2. **Direct reader address:**
   - "W tym artykule pokażę Ci..."
   - "Jeśli nie masz wykształcenia w UX/UI (jak ja)..."

3. **Bold for emphasis:**
   - Key numbers: "**15 godzin tygodniowo**"
   - Key concepts at first use: "**PRD (Product Requirement Document)**"
   - Important takeaways: "**nie naprawiaj buga - napraw system**"

4. **Practical endings:**
   - "## Co możesz zrobić dzisiaj" with numbered action steps
   - "## Kluczowe wnioski" with 5-7 bullet points
   - Contextual CTA leading to `/#contact`

### Technical Formatting
- Code blocks ALWAYS with language tag (`javascript`, `markdown`, `text`, `yaml`, `json`, `bash`)
- Folder structures use `text` tag
- Paragraphs: max 3-4 sentences
- Lists: bulleted for items, numbered for sequences
- Tables for comparisons and reference data

---

## Article Structure Templates

### How-to/Technical Article
```text
# [Title]
[Hook - 1-2 sentences, personal or problem-based]

## Problem / Context
[2-3 paragraphs describing the challenge]

## Solution / Approach
### Krok 1: [Name]
### Krok 2: [Name]
### Krok 3: [Name]

## Practical Tips / Tools
[Recommendations with reasoning]

## Pitfalls to Avoid
[What NOT to do]

## Kluczowe wnioski
[5-7 numbered takeaways]

## FAQ
[4-6 questions in accordion format]

---
[CTA - contextual HTML block]

## Przydatne zasoby
[Links with descriptions]
```

### Case Study
```text
# [Client]: [Result]

## Kontekst
[Client, challenge, solution summary]

## Problem
[Details + challenges list]

## Rozwiązanie
[Architecture + implementation]

## Rezultaty
[Metrics table before/after]
[Optional client quote]

## Wnioski
[Actionable insights]

---
[CTA]
```

---

## Categories Available
| Category | Topics |
|----------|--------|
| **Automatyzacja** | Processes, workflow, n8n, Make, Zapier |
| **No-Code** | Airtable, Notion, lead generation |
| **AI** | Chatbots, LLM, ChatGPT, Claude, AI implementations |
| **Code** | Dev tools, Cursor, VS Code, SDLC, engineering |

---

## Frontmatter Schema (Required Fields)
```yaml
---
id: [next incremental ID - currently 16 is latest]
slug: [url-friendly, 3-6 words, lowercase with hyphens]
title: [50-60 characters, includes keyword]
excerpt: [150-160 characters, answers "why read this?"]
category: [Automatyzacja | No-Code | AI | Code]
author: Pawel Lipowczan
date: [YYYY-MM-DD]
readTime: [X min - estimated]
image: /images/og-[slug].webp
tags:
  - [Tag1]
  - [Tag2]
  - [Tag3]
---
```

---

## FAQ Section Requirements

- **Heading:** `## FAQ`
- **Format:** Accordion with `<details open>` tags
- **Questions:** 4-6 natural Polish questions, 10-25 words each
- **Answers:** 2-4 sentences, key info first (snippet-style)
- **Structure:**
```markdown
<details open>
<summary>

### [Question in Polish?]

</summary>

[Answer paragraph]

</details>
```

---

## CTA Format (HTML + Tailwind)

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    [Contextual title related to article topic]
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    [How Pawel can help with this specific topic]
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

---

## File Locations
- **Blog articles:** `src/content/blog/{slug}.md`
- **OG images:** `public/images/og-{slug}.webp`
- **Sitemap update:** `npm run blog:sitemap`
- **Image conversion:** `npm run img:convert`

---

## Next Steps

1. User provides article topic or input materials
2. Run `/blog-article-writer:plan "<topic>"` to create implementation plan
3. Plan will include: title options, structure, key points, SEO strategy
4. Execute plan with `/blog-article-writer:execute`
5. Validate with `/blog-article-writer:validate`

---

## Ready for Planning Phase

Prime context loaded successfully. Awaiting user input for:
- Specific article topic
- Additional source materials (notes, transcripts, research)
- Target category (Automatyzacja / No-Code / AI / Code)
- Any specific angles or value propositions to emphasize
