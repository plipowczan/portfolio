# Blog Article Writing Workflow

Comprehensive guide for creating blog articles using the `blog-article-writer` agent with PIV methodology.

## Overview

The `blog-article-writer` agent automates blog article creation following PIV (Prime-Implement-Validate) methodology, ensuring consistent quality, proper formatting, and adherence to style guidelines.

**PIV Workflow:**
```
Prime → Plan → Execute → Validate
  ↓       ↓       ↓         ↓
Research → Structure → Write → Check Quality
```

---

## ⚠️ IMPORTANT: Use Commands, Not Agent

**DO NOT use Task tool with blog-article-writer agent** due to subagent file access restrictions.

**INSTEAD: Invoke commands sequentially:**

```
1. Run /blog-article-writer:prime
   ↓
2. Run /blog-article-writer:plan
   ↓
3. Review plan → Approve or request changes
   ↓
4. Run /blog-article-writer:execute
   ↓
5. /blog-article-writer:validate runs automatically
   ↓
6. Review validation report
```

**This approach ensures:**
- ✅ Full access to `.claude/agents/` directories
- ✅ Can read source materials from `docs/blog/`
- ✅ Skill tool works reliably
- ✅ PIV methodology followed correctly
- ✅ User has control at each phase

---

## Prerequisites

### Required Files
- Source material (transcript, notes, outline, or research)
- Placed in `docs/blog/` directory (recommended)

### Agent Commands
Located in `.claude/commands/blog-article-writer/`:
- `prime.md` - Research phase
- `plan.md` - Planning phase
- `execute.md` - Execution phase
- `validate.md` - Validation phase (automatic)

---

## Step-by-Step Guide

### Step 1: Prepare Source Material

Create or gather your source material in `docs/blog/`:

**Examples:**
- `docs/blog/transcript.md` - Transcript from video/podcast
- `docs/blog/notes-react-hooks.md` - Raw notes
- `docs/blog/outline-ai-trends.md` - Article outline

**What to include:**
- Main topics and key points
- Technical concepts to explain
- Code examples (if applicable)
- Target audience notes
- Unique angle or value proposition

---

### Step 2: Start PIV Workflow with Prime Command

Invoke the prime command using Skill tool:

```
Run /blog-article-writer:prime with source materials at docs/blog/[your-file].md
```

**Example:**
```
Run /blog-article-writer:prime

Source materials are at:
- docs/blog/transcript1.md
- docs/blog/transcript2.md
- docs/blog/cursor_hacks.md

Article topic: Cursor.sh tips and tricks for Polish developers
Target audience: Developers using AI coding tools
```

**What happens:**
- Claude invokes prime command
- Analyzes source materials
- Reviews existing blog style
- Creates prime artifact in `.claude/agents/context/`
- Proceeds to planning phase

---

### Step 3: Prime Phase (Automatic)

**What happens:**
The agent researches and loads context:

1. **Analyzes source materials** from `docs/blog/`
2. **Reviews existing blog articles** to understand style
3. **Reads portfolio-copywriting guidelines**
4. **Extracts key topics** and technical concepts
5. **Creates prime artifact** in `.claude/agents/context/blog-prime-{topic}.md`

**Output:**
```
✅ Source materials analyzed
✅ Writing style understood
✅ Key topics extracted: [list of topics]
✅ Prime artifact created

Moving to planning phase...
```

**Artifact location:** `.claude/agents/context/blog-prime-{topic}.md`

---

### Step 4: Plan Phase (Automatic)

**What happens:**
The agent creates a detailed implementation plan:

1. **Determines next blog ID** (scans existing articles)
2. **Designs frontmatter** (title, slug, excerpt, category, tags)
3. **Structures article** (sections, headings, word counts)
4. **Plans code examples** (WITH language tags)
5. **Defines SEO keywords**
6. **Creates plan artifact** in `.claude/agents/plans/blog-{slug}.md`

**Output:**
```
✅ Next blog ID: 11
✅ Slug: jak-zautomatyzowac-crm
✅ Title: Jak zautomatyzować CRM w 3 krokach
✅ Structure: Introduction → 3 main sections → Conclusion → CTA
✅ Plan artifact created

[Agent shows plan summary]

Would you like me to proceed with writing, or would you like any
adjustments to the plan?
```

**Artifact location:** `.claude/agents/plans/blog-{slug}.md`

---

### Step 5: Review & Approve Plan

**Review checklist:**
- [ ] Title is compelling (50-60 characters)
- [ ] Slug is SEO-friendly
- [ ] Excerpt hooks the reader (150-160 characters)
- [ ] Category is correct (AI | Automatyzacja | No-Code)
- [ ] Structure makes sense
- [ ] Word count targets are appropriate
- [ ] Code examples are planned with language tags

**Respond:**
- ✅ To proceed: `"OK, wykonaj"` or `"Wygląda dobrze, pisz artykuł"`
- 🔄 To adjust: Request specific changes to the plan

---

### Step 6: Execute Phase (After Approval)

**What happens:**
The agent writes the complete article:

1. **Loads plan artifact** from `.claude/agents/plans/`
2. **Invokes portfolio-copywriting skill** with strict requirements:
   - ALL code blocks MUST have language tags
   - NEVER polonize English technical terms
   - Use Pawel's voice (direct, practical, personal)
   - Polish language with natural English technical terms
3. **Writes article** to `src/content/blog/{slug}.md`
4. **Triggers validation automatically**

**Output:**
```
✅ Article written: src/content/blog/jak-zautomatyzowac-crm.md
✅ Word count: 2,847 words (~10 min read)
✅ Code blocks: 5 (all with language tags)

Starting automatic validation...
```

**File location:** `src/content/blog/{slug}.md`

---

### Step 7: Validate Phase (Automatic)

**What happens:**
The agent validates quality across 6 levels:

#### Level 1: File Structure
- ✅ Article file exists
- ✅ Frontmatter is valid YAML
- ✅ All required fields present
- ✅ Blog ID is unique

#### Level 2: Content Quality
- ✅ Frontmatter fields validated
- ✅ Code blocks have language tags
- ✅ No polonized terms (e.g., "komendyfikacja")
- ✅ Structure is correct (H2/H3 hierarchy)

#### Level 3: SEO Validation
- ✅ Title includes primary keyword
- ✅ Slug is SEO-friendly
- ✅ Headers use semantic structure

#### Level 4: Technical Accuracy
- ✅ Code examples are syntactically valid
- ✅ External links are valid

#### Level 5: Rendering Test
- ✅ Dev server started
- ✅ Article displays without errors
- ✅ Code blocks render correctly (not inline)

#### Level 6: Post-Article Tasks
- ✅ OG image generated (nano-banana)
- ✅ Converted to WebP
- ✅ Sitemap updated

**Output:**
```
🎉 VALIDATION PASSED

✅ All code blocks have language tags
✅ No polonized terms found
✅ Renders correctly in dev server
✅ OG image generated: public/images/og-jak-zautomatyzowac-crm.webp
✅ Sitemap updated

Validation report saved to:
.claude/agents/reports/validation-blog-jak-zautomatyzowac-crm.md

Next steps:
1. Review article in browser: http://localhost:3000/blog/jak-zautomatyzowac-crm
2. Create git commit: git commit -m "feat: Add blog article [title]"
3. Deploy to production
```

**Report location:** `.claude/agents/reports/validation-blog-{slug}.md`

---

## Critical Requirements

### Code Blocks - MANDATORY Language Tags

❌ **WRONG:**
```markdown
```
const greeting = "Hello";
```
```

✅ **CORRECT:**
```markdown
```javascript
const greeting = "Hello";
```
```

✅ **No specific language? Use `text`:**
```markdown
```text
Workflow:
1. Step one
2. Step two
```
```

**Available language tags:**
- **Code:** `javascript`, `typescript`, `python`, `java`, `go`, `rust`
- **Markup:** `html`, `xml`, `markdown`, `yaml`, `json`
- **Shell:** `bash`, `sh`, `powershell`
- **Other:** `sql`, `css`, `dockerfile`
- **Universal:** `text` (when no specific language applies)

---

### Language Guidelines

**✅ ALWAYS in English:**
- Technology names: React, Vue, TypeScript, Docker
- Frameworks: Next.js, Express, Django
- Concepts without Polish equivalent: hooks, props, middleware
- Industry terms: deployment, staging, production, CI/CD
- Abbreviations: API, SDK, CLI, REST, GraphQL

**✅ In Polish (with English in parentheses on first use):**
- Concepts with Polish equivalent:
  - autentykacja (authentication)
  - autoryzacja (authorization)
  - walidacja (validation)
  - testowanie (testing)

**❌ NEVER polonize:**
- ❌ "komendyfikacja" → use "commandification" OR "przekształcanie w komendy"
- ❌ "skomendyfikować" → use "przekształcić w komendę"
- ❌ "zvalidować" → use "zwalidować" OR "sprawdzić poprawność"

---

## File Structure

After running the workflow, you'll have:

```
.claude/
└── agents/
    ├── context/
    │   └── blog-prime-{topic}.md          # Research context
    ├── plans/
    │   └── blog-{slug}.md                 # Implementation plan
    └── reports/
        └── validation-blog-{slug}.md      # Validation report

src/
└── content/
    └── blog/
        └── {slug}.md                      # Published article

public/
└── images/
    └── og-{slug}.webp                     # OG image (optimized)
```

---

## Common Issues & Solutions

### Issue: "Agent didn't execute"
**Cause:** Usage limit reached or agent not properly invoked
**Solution:**
- Wait for usage reset (check time displayed)
- OR use direct command invocation (manual PIV workflow)

### Issue: "Code blocks rendering as inline"
**Cause:** Missing language tags in markdown
**Solution:**
- Ensure ALL code blocks have language tags
- Use `text` if no specific language applies
- Validation will catch this automatically

### Issue: "Polonized terms in article"
**Cause:** Skill generated inappropriate Polish forms
**Solution:**
- Validation will detect patterns like "komendyfik"
- Review and replace with English or Polish description
- Update source material to be clearer about terminology

### Issue: "OG image generation failed"
**Cause:** Missing GEMINI_API_KEY or script error
**Solution:**
```bash
# Check if API key is configured
grep GEMINI_API_KEY .env

# If not present, add it:
echo "GEMINI_API_KEY=your-api-key-here" >> .env

# Test script manually
node scripts/generate-image.js "test prompt" --filename test-og
```

### Issue: "Validation failed - ID not unique"
**Cause:** Blog ID collision
**Solution:**
- Check existing IDs: `grep "^id:" src/content/blog/*.md`
- Update frontmatter with next available ID

### Issue: "Agent couldn't access .claude/ folders"
**Cause:** blog-article-writer agent ran as subagent with restricted file access
**Solution:**
- DO NOT use `@agent-blog-article-writer`
- Use sequential commands instead: `/blog-article-writer:prime` → `/plan` → `/execute` → `/validate`
- Commands run in main context with full file access

### Issue: "OG image generated with text"
**Cause:** Validation command didn't specify "NO TEXT" clearly enough
**Solution:**
- Updated validate.md command now explicitly states "NO TEXT AT ALL"
- Script prompt includes multiple reminders
- If image still has text, regenerate with clearer prompt

### Issue: "Image quality not good enough"
**Cause:** Using wrong Gemini model
**Solution:**
- Ensure scripts/generate-image.js uses --model gemini-3-pro-image-preview
- Check GEMINI_API_KEY is set in .env file
- Default model in script is gemini-3-pro-image-preview (high quality)

---

## Manual Workflow (Advanced)

If you need to run commands manually (e.g., for debugging):

### 1. Prime Command
```
Run /blog-article-writer:prime with source materials at docs/blog/[file].md
```

### 2. Plan Command
```
Run /blog-article-writer:plan for "[article topic]"
```

### 3. Review Plan
Open `.claude/agents/plans/blog-{slug}.md` and review structure

### 4. Execute Command
```
Run /blog-article-writer:execute
```

### 5. Validate Command (Automatic)
Validation runs automatically after execute. To run manually:
```
Run /blog-article-writer:validate for article at src/content/blog/{slug}.md
```

---

## Quality Checklist

Before considering article complete:

### Content
- [ ] Title is compelling and SEO-friendly (50-60 chars)
- [ ] Excerpt hooks the reader (150-160 chars)
- [ ] Introduction has strong hook
- [ ] Structure follows plan
- [ ] Code examples are practical and correct
- [ ] Technical accuracy verified
- [ ] Call-to-action included

### Code Blocks
- [ ] ALL code blocks have language tags
- [ ] Language tags are appropriate
- [ ] Code is syntactically correct
- [ ] Code has helpful comments (if needed)

### Language & Style
- [ ] Polish language with natural English technical terms
- [ ] No inappropriately polonized terms
- [ ] Direct, practical, personal tone (Pawel's voice)
- [ ] Short paragraphs (2-4 sentences)
- [ ] Key concepts are bolded

### Technical
- [ ] Frontmatter is complete and valid
- [ ] Blog ID is unique
- [ ] Slug matches filename
- [ ] Category is correct
- [ ] Tags are relevant (3-5 tags)
- [ ] OG image exists and is optimized (WebP)
- [ ] Sitemap updated
- [ ] Article renders correctly in browser

---

## Example: Complete Workflow

### User Input:
```
@agent-blog-article-writer napisz artykuł o 5 technikach pracy z Claude Code
na podstawie @docs/blog/transcript.md

Artykuł ma być praktyczny, z przykładami kodu, dla programistów którzy
już używają Claude Code ale chcą być bardziej produktywni.
```

### Agent Response:

**Phase 1 - Prime:**
```
✅ Analyzed transcript.md (5,847 words)
✅ Identified 5 main techniques:
   1. PRD-first development
   2. Modular rules architecture
   3. Commandifying workflows
   4. Context reset strategy
   5. System evolution
✅ Target audience: Experienced Claude Code users
✅ Tone: Practical, example-driven
✅ Prime artifact created
```

**Phase 2 - Plan:**
```
✅ Next blog ID: 10
✅ Slug: 5-technik-pracy-z-claude-code
✅ Title: 5 technik które zmienią sposób pracy z Claude Code (59 chars)
✅ Excerpt: Większość programistów wykorzystuje zaledwie 20% potencjału... (158 chars)
✅ Structure:
   - Introduction (~300 words)
   - Technique 1: PRD-first (~700 words)
   - Technique 2: Modular rules (~700 words)
   - Technique 3: Commandifying (~700 words)
   - Technique 4: Context reset (~700 words)
   - Technique 5: System evolution (~700 words)
   - PIV Skeleton presentation (~600 words)
   - Quick start (~400 words)
   - Conclusion (~300 words)
✅ Estimated: 4,800 words (~14 min read)
✅ Plan artifact created

Would you like me to proceed with writing?
```

**User:** "OK, wykonaj"

**Phase 3 - Execute:**
```
✅ Article written (4,682 words, 14 min read)
✅ All code blocks have language tags (javascript, bash, markdown, text)
✅ No polonized terms
✅ File saved: src/content/blog/5-technik-pracy-z-claude-code.md
```

**Phase 4 - Validate (Automatic):**
```
🎉 VALIDATION PASSED

✅ File structure: Valid
✅ Frontmatter: Complete and correct
✅ Code blocks: 12 blocks, all with language tags
✅ Language: No polonized terms found
✅ SEO: Optimized (title, slug, headers)
✅ Rendering: Displays correctly in dev server
✅ OG image: Generated and optimized to WebP (93.5% size reduction)
✅ Sitemap: Updated with new article

Next steps:
1. Review: http://localhost:3000/blog/5-technik-pracy-z-claude-code
2. Commit: git commit -m "feat: Add blog article about 5 Claude Code techniques"
3. Deploy to production
```

---

## Tips for Best Results

### 1. Prepare Good Source Material
- Be specific about target audience
- Include key points to emphasize
- Note any technical details or versions
- Provide code examples if available

### 2. Review Plans Carefully
- Check title and excerpt before approving
- Ensure structure matches your vision
- Verify word count targets are appropriate
- Confirm SEO keywords are relevant

### 3. Trust the Validation
- Validation catches most quality issues
- Review validation report thoroughly
- Fix any warnings before publishing
- Don't skip manual browser testing

### 4. Iterate on Source Material
- If article doesn't match expectations, improve source material
- Add more context or examples
- Clarify technical details
- Rerun workflow with updated sources

---

## Post-Publication

After article is validated and published:

### 1. Git Commit
```bash
git add .
git commit -m "feat: Add blog article [title]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 2. Deploy
```bash
git push origin main
# Vercel automatically deploys
```

### 3. Verify Production
- Check article URL: https://pawellipowczan.pl/blog/{slug}
- Verify OG image displays in social media previews
- Test all links (internal and external)
- Check mobile responsiveness

### 4. Update TODO
Mark article topic as complete in `docs/TODO.md`

---

## Summary

The blog-article-writer agent with PIV methodology ensures:

✅ **Consistent Quality** - Every article follows same high standards
✅ **Proper Formatting** - Code blocks, language, structure
✅ **SEO Optimization** - Title, slug, headers, keywords
✅ **Automatic Validation** - 6-level quality check
✅ **Complete Workflow** - From research to deployment-ready article

**Remember:** PIV methodology = Quality through systematic process

Prime (research) → Plan (structure) → Execute (write) → Validate (check)

Every phase builds on the previous one, ensuring nothing is missed.
