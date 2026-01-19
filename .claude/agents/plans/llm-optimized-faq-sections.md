# Feature: LLM-Optimized FAQ Sections for Blog Articles

**Created**: 2026-01-18
**Status**: Planned
**Priority**: High (SEO/AEO improvement)

## Context References

- `.claude/agents/context/prime-context.md` - Complete codebase overview
- `src/pages/BlogPostPage.jsx` - Current blog post rendering logic
- `src/components/seo/StructuredData.jsx` - Existing schema implementation
- `src/content/blog/*.md` - Existing blog posts (14 articles)

## Problem Statement

Current blog articles lack FAQ sections optimized for LLM/AI consumption. Modern search is shifting from traditional SEO to AEO (Answer Engine Optimization), where AI chatbots (ChatGPT, Perplexity, Claude, Gemini) and LLMs extract structured answers from content. Without proper FAQ sections and FAQPage schema, our content is invisible to these AI systems.

## Requirements

### Functional Requirements

- [ ] FR-1: Add FAQ section to markdown blog posts using HTML (H2 + H3 + p structure)
- [ ] FR-2: Implement FAQPage schema (JSON-LD) for each article with FAQ
- [ ] FR-3: Questions must be formatted as natural, conversational prompts (10-25 words)
- [ ] FR-4: Answers must be snippet-style (2-4 sentences, key info in first sentence)
- [ ] FR-5: FAQ sections must render correctly in BlogPostPage with proper styling
- [ ] FR-6: Ensure FAQ content is accessible to screen readers and DOM-parseable
- [ ] FR-7: Support Polish language with natural English technical terms (existing pattern)

### Non-Functional Requirements

- [ ] NFR-1: FAQ schema must be valid according to Google's structured data guidelines
- [ ] NFR-2: FAQ content must be synchronous between rendered HTML and schema JSON
- [ ] NFR-3: Performance: FAQ rendering should not add >100ms to page load
- [ ] NFR-4: SEO: FAQ sections must be crawlable (no JS-only accordions)
- [ ] NFR-5: Maintainability: FAQ structure should be easy to add/edit in markdown

### Content Guidelines (LLM Optimization)

**Question Structure:**

- Full, natural prompts (not keywords): "Jak zoptymalizować FAQ pod AI chatboty i LLM?" ✅
- Not: "AI FAQ" ❌
- One question = one clear intent (avoid mixing multiple topics)
- Long-tail queries (10-25 words, conversational language)
- Include follow-up questions readers would naturally ask after reading

**Answer Style:**

- Snippet-style: 2-4 sentences
- Most important information in the first sentence (bot-ready)
- Natural, conversational language
- Avoid unexplained jargon
- Include concrete facts, numbers, definitions, mini-how-tos
- Link to sources, case studies, research (authority signals)

**Technical Implementation:**

- Clean HTML: H2 for section header ("FAQ"), H3 for each question, p for answers
- No FAQ content solely in JS/accordions without DOM presence
- FAQPage schema (JSON-LD) with full question/answer pairs
- Consistency between HTML text and structured data (AI detects discrepancies)

## Technical Approach

### Architecture Decision: Markdown HTML + Schema Generation

**Chosen Approach**: FAQ content lives in markdown as HTML blocks, schema is auto-generated from FAQ content.

**Rationale**:

1. Single source of truth (markdown file)
2. Content-first workflow (editors write FAQ in markdown)
3. Schema generated automatically (no sync issues)
4. Easy to maintain and audit

**Alternative Considered**: YAML frontmatter with FAQ array

- **Rejected**: Requires maintaining two representations (YAML + rendered HTML)
- Risk of desynchronization between frontmatter and schema
- Less flexible for rich formatting in answers

### Pattern to Follow

**Existing Patterns in Codebase:**

- StructuredData component: Client-side schema injection via useEffect
- ReactMarkdown: Custom component renderers for h2, h3, p
- Blog post loading: Vite's `import.meta.glob` with gray-matter parsing

**New Pattern to Implement:**

- FAQ detection: Parse rendered HTML to extract FAQ sections
- Schema generation: Transform FAQ HTML into FAQPage schema
- Component lifecycle: Extract FAQ → Generate schema → Inject on mount

### Trade-offs

| Aspect | Trade-off | Decision |
|--------|-----------|----------|
| **Content Format** | HTML in markdown vs YAML frontmatter | HTML (easier to write/maintain) |
| **Schema Generation** | Static (build-time) vs Dynamic (runtime) | Dynamic (simpler implementation, no build changes) |
| **FAQ Detection** | Manual flag vs Auto-detection | Auto-detection (parse H2 with "FAQ") |
| **Styling** | Accordion UI vs Plain HTML | Plain HTML (LLM-friendly, accessible) |

### Dependencies

**Internal:**

- `src/pages/BlogPostPage.jsx` - Add FAQ extraction and schema generation
- `src/components/seo/StructuredData.jsx` - Reuse for FAQPage schema
- `src/content/blog/*.md` - Add FAQ sections to existing articles

**External:**

- None (using existing dependencies: react-markdown, gray-matter)

## Implementation Steps

**IMPORTANT NOTE**: Implementation is organized in phases. Phases 1-3 build the technical infrastructure and guidelines. Phase 4 (adding FAQ content to existing articles) is OPTIONAL and can be executed later or independently once guidelines are ready.

### Phase 1: Core FAQ Infrastructure (Technical Foundation)

**Goal**: Build FAQ extraction, schema generation, and rendering system.

#### Step 1: Create FAQ extraction utility

**File**: `src/utils/faqExtractor.js` (new)
**Purpose**: Parse rendered content HTML, extract FAQ sections, generate FAQPage schema

```javascript
// Extract FAQ items from rendered content element
// Returns: { questions: [{question, answer}], hasFAQ: boolean }
export function extractFAQ(contentElement);

// Generate FAQPage schema from FAQ items
// Returns: JSON-LD schema object
export function generateFAQSchema(faqItems, postUrl);
```

**Implementation Details:**

- Query for H2 containing "FAQ" or "Najczęściej zadawane pytania"
- Extract all H3 (questions) + following p (answers) until next H3/H2
- Sanitize text (remove HTML tags, trim whitespace)
- Generate schema following Google's FAQPage spec

#### Step 2: Integrate FAQ extraction into BlogPostPage

**File**: `src/pages/BlogPostPage.jsx` (modify)
**Changes**:

- Import `extractFAQ` and `generateFAQSchema` utilities
- Add FAQ extraction in useEffect (after content renders)
- Conditionally render FAQPage schema if FAQ detected
- Add state: `const [faqSchema, setFaqSchema] = useState(null);`

**Integration Points:**

- After contentRef is populated and tocItems extracted
- Before final render (FAQ schema must be ready for StructuredData)

#### Step 3: Add FAQ styling to prose styles

**File**: `src/styles/index.css` (modify)
**Changes**:

- Add custom styles for FAQ section H2
- Style FAQ questions (H3) with visual distinction
- Ensure FAQ answers (p) are readable and well-spaced
- Add subtle hover effects for accessibility

#### Step 4: Test infrastructure with sample FAQ

**Purpose**: Verify FAQ extraction and schema generation work correctly
**Testing Strategy:**

- Create temporary test blog post with FAQ section
- Verify FAQ extracted correctly
- Check FAQPage schema in DevTools
- Validate with Google Rich Results Test
- Remove test post after verification

### Phase 2: Guidelines & Templates (Content Foundation)

**Goal**: Create comprehensive documentation for FAQ content creation.

#### Step 5: Create FAQ template and guidelines

**Files to Create:**

- `docs/blog/FAQ_TEMPLATE.md` - Reference template
- `docs/blog/FAQ_GUIDELINES.md` - Comprehensive LLM optimization guidelines

**FAQ_TEMPLATE.md Structure:**

```markdown
## FAQ

### [Natural question prompt in Polish, 10-25 words]

[Snippet-style answer, 2-4 sentences. Key info in first sentence. Concrete facts, numbers, how-to.]

### [Next question...]

[Answer...]
```

**FAQ_GUIDELINES.md Content:**

- Question formulation best practices (10-25 words, conversational)
- Answer structure and style (snippet-style, 2-4 sentences)
- LLM optimization techniques (concrete facts, natural language)
- Common pitfalls to avoid
- Examples of good vs bad FAQs
- Link to AEO research sources

#### Step 6: Update project documentation

**Files to Update:**

- `CLAUDE.md` - Add FAQ section to blog workflow
- `docs/BLOG_WORKFLOW.md` - Include FAQ creation step
- `.claude/rules/data-storage/00-overview.md` - Document FAQ structure in markdown

**Documentation Content:**

- FAQ structure and format
- LLM optimization principles
- Schema generation mechanism
- Reference to FAQ_TEMPLATE.md and FAQ_GUIDELINES.md

### Phase 3: Blog-Article-Writer Integration (Automation)

**Goal**: Update blog-article-writer command to automatically include FAQ sections in new articles.

#### Step 7: Update blog-article-writer plan command

**File**: `.claude/commands/blog-article-writer/plan.md` (modify)
**Changes**:

- Add FAQ section to article structure template
- Include FAQ requirements in content guidelines
- Reference FAQ_TEMPLATE.md and FAQ_GUIDELINES.md
- Add FAQ as mandatory element in plan approval checklist

**Plan Template Addition:**

```markdown
## Article Structure

[existing sections...]

### FAQ Section
- 4-6 natural follow-up questions (10-25 words each)
- Snippet-style answers (2-4 sentences)
- Follow FAQ_GUIDELINES.md for LLM optimization
```

#### Step 8: Update blog-article-writer execute command

**File**: `.claude/commands/blog-article-writer/execute.md` (modify)
**Changes**:

- Add FAQ generation to execution steps
- Include FAQ validation in success criteria
- Reference FAQ_TEMPLATE.md in skill invocation

**Skill Invocation Update:**

```
Key requirements:
[existing requirements...]
- Include FAQ section following docs/blog/FAQ_TEMPLATE.md
- 4-6 questions optimized for LLM discovery
- FAQ must follow docs/blog/FAQ_GUIDELINES.md
```

#### Step 9: Update portfolio-copywriting skill (if needed)

**File**: `.claude/skills/portfolio-copywriting/...` (check and modify if needed)
**Purpose**: Ensure skill understands FAQ structure and LLM optimization
**Changes**:

- Add FAQ_TEMPLATE.md to skill context
- Include FAQ_GUIDELINES.md in skill knowledge base
- Update skill prompts to emphasize FAQ quality

### Phase 4: Content Creation for Existing Articles (OPTIONAL - Can be done later)

**Goal**: Add FAQ sections to 14 existing blog articles.

**IMPORTANT**: This phase can be executed:

- After Phases 1-3 are complete and tested
- Independently when time permits
- Incrementally (batch by batch)
- By another agent or team member using FAQ_GUIDELINES.md

#### Step 10: Add FAQ to existing blog posts (batch 1: 5 high-priority articles)

**Files**: 5 selected blog posts (high-traffic articles)
**Priority Order:**

1. `5-technik-pracy-z-claude-code.md` (highest traffic expected)
2. `15-cursor-hacks-produktywnosc-ai.md`
3. `vibe-coding-przewodnik.md`
4. `trendy-ai-2026-od-eksperymentow-do-operacjonalizacji.md`
5. `kodowanie-w-2025-ai-portfolio.md`

**Per Article (25-35 min each):**

- Research: Identify 4-6 natural follow-up questions readers would ask
- Write: Draft FAQ using FAQ_TEMPLATE.md (full prompts + snippet answers)
- Validate: Check against FAQ_GUIDELINES.md
- Test: Verify rendering and schema generation

#### Step 11: Add FAQ to remaining blog posts (batch 2: 9 articles)

**Files**: Remaining 9 blog posts
**Strategy**: Same as batch 1, lighter FAQ (4 questions each)
**Estimated Time**: 10-15 min per article

### Phase 5: Testing & Validation (Final Verification)

**Goal**: Comprehensive testing of FAQ system across all articles.

#### Step 12: Test FAQ extraction and schema generation

**Testing Strategy:**

- Unit test: `faqExtractor.js` functions with sample HTML
- Integration test: BlogPostPage with mock FAQ content
- Manual test: Verify schema in browser DevTools (check JSON-LD)
- Validation: Google Rich Results Test tool

**Test Cases:**

- Article with FAQ section → Schema generated correctly
- Article without FAQ → No FAQPage schema added
- Multiple FAQ sections (edge case) → Only first FAQ used
- Empty FAQ section → Graceful handling (no schema)

#### Step 13: Validate structured data compliance

**Tools:**

- Google Rich Results Test: <https://search.google.com/test/rich-results>
- Schema.org Validator: <https://validator.schema.org/>
- Manual inspection: Browser DevTools → Check JSON-LD scripts

**Validation Criteria:**

- FAQPage schema is valid
- Question/answer pairs match rendered content exactly
- No schema errors or warnings
- All required fields present

#### Step 14: Accessibility audit

**Areas to Test:**

- Screen reader navigation (NVDA/JAWS)
- Keyboard navigation (Tab, Enter)
- ARIA labels (if needed)
- Semantic HTML structure
- Focus management

**Acceptance Criteria:**

- FAQ sections are announced correctly by screen readers
- All interactive elements are keyboard-accessible
- Semantic HTML validates (H2 → H3 → p hierarchy)
- WCAG 2.1 AA compliance maintained

#### Step 15: Performance testing

**Purpose**: Ensure FAQ system doesn't degrade performance
**Metrics:**

- Page load time (before vs after)
- FAQ extraction time (<100ms)
- Lighthouse scores (Performance, SEO, Accessibility)
- Core Web Vitals (LCP, FID, CLS)

**Acceptance Criteria:**

- No performance regression
- Lighthouse scores unchanged or improved
- FAQ extraction time <100ms

## Files to Create

### Phase 1: Infrastructure

| File | Purpose |
|------|---------|
| `src/utils/faqExtractor.js` | FAQ extraction and schema generation utilities |

### Phase 2: Guidelines & Documentation

| File | Purpose |
|------|---------|
| `docs/blog/FAQ_TEMPLATE.md` | Reference template for FAQ creation |
| `docs/blog/FAQ_GUIDELINES.md` | Comprehensive LLM optimization guidelines |

### Phase 4: Content (OPTIONAL - can be done later)

| File | Purpose |
|------|---------|
| `src/content/blog/*.md` | Add FAQ sections to existing 14 blog articles (optional) |

## Files to Modify

### Phase 1: Infrastructure

| File | Changes |
|------|---------|
| `src/pages/BlogPostPage.jsx` | Integrate FAQ extraction, add FAQPage schema rendering |
| `src/styles/index.css` | Add FAQ-specific styling (H2, H3, p in FAQ context) |

### Phase 2: Guidelines & Documentation

| File | Changes |
|------|---------|
| `CLAUDE.md` | Document FAQ workflow |
| `docs/BLOG_WORKFLOW.md` | Add FAQ creation step to blog article process |
| `.claude/rules/data-storage/00-overview.md` | Document FAQ structure in markdown files |

### Phase 3: Blog-Article-Writer Integration

| File | Changes |
|------|---------|
| `.claude/commands/blog-article-writer/plan.md` | Add FAQ section to article structure template |
| `.claude/commands/blog-article-writer/execute.md` | Add FAQ generation to execution steps |
| `.claude/skills/portfolio-copywriting/...` | Update skill to include FAQ generation (if needed) |

## Testing Strategy

### Unit Tests

- [ ] `faqExtractor.js` - `extractFAQ()` with various HTML structures
- [ ] `faqExtractor.js` - `generateFAQSchema()` output validation
- [ ] Edge cases: No FAQ, empty FAQ, malformed FAQ

### Integration Tests (Playwright)

- [ ] BlogPostPage renders FAQ section correctly
- [ ] FAQPage schema is injected into <head>
- [ ] FAQ content matches schema (no desynchronization)
- [ ] TOC includes FAQ section (if H2)
- [ ] Scroll-to-FAQ works correctly

### Manual Testing

- [ ] Visual inspection: FAQ styling across 5 sample articles
- [ ] Schema validation: Google Rich Results Test for 5 articles
- [ ] Screen reader: NVDA/JAWS navigation through FAQ
- [ ] Mobile: FAQ rendering on small screens
- [ ] Performance: Lighthouse audit (no regression)

### Validation Tools

- [ ] Google Rich Results Test: <https://search.google.com/test/rich-results>
- [ ] Schema.org Validator: <https://validator.schema.org/>
- [ ] Lighthouse: Accessibility & SEO scores
- [ ] Wave: Accessibility checker

## Verification Criteria

### Functionality

- [ ] FAQ sections render correctly in all blog posts with FAQ content
- [ ] FAQPage schema is generated and injected for articles with FAQ
- [ ] FAQ content is identical between HTML and schema (no drift)
- [ ] Articles without FAQ do not generate FAQPage schema
- [ ] FAQ section is included in TOC (Table of Contents)

### SEO/AEO Optimization

- [ ] Questions are natural, conversational prompts (10-25 words)
- [ ] Answers are snippet-style (2-4 sentences, key info first)
- [ ] FAQ section uses semantic HTML (H2 → H3 → p)
- [ ] FAQPage schema passes Google Rich Results Test
- [ ] All question/answer pairs are present in schema

### Accessibility

- [ ] FAQ sections are keyboard-navigable
- [ ] Screen readers announce FAQ structure correctly
- [ ] WCAG 2.1 AA compliance maintained
- [ ] Focus indicators visible on interactive elements (if any)

### Performance

- [ ] FAQ extraction adds <100ms to page render time
- [ ] No layout shift (CLS) from FAQ rendering
- [ ] Lighthouse Performance score unchanged
- [ ] Build time not significantly impacted

### Code Quality

- [ ] FAQ extraction logic is modular and testable
- [ ] Code follows existing patterns (React hooks, functional components)
- [ ] No console errors or warnings
- [ ] TypeScript/PropTypes validation (if applicable)

### Documentation

- [ ] FAQ template created and documented
- [ ] LLM optimization guidelines written
- [ ] Project documentation updated (CLAUDE.md, BLOG_WORKFLOW.md)
- [ ] Code comments explain FAQ extraction logic

## Implementation Timeline

**Core Implementation (Phases 1-3)**: 4-6 hours (required)
**Content Creation (Phase 4)**: 3-5 hours (optional, can be done later)
**Total if all phases**: 7-11 hours

### Phase 1: Core FAQ Infrastructure (2-3 hours)

- FAQ extractor utility: 1-1.5 hours
- BlogPostPage integration: 0.5-1 hour
- Styling: 0.5 hour
- Test infrastructure with sample FAQ: 0.5 hour

### Phase 2: Guidelines & Templates (1-1.5 hours)

- FAQ_TEMPLATE.md creation: 0.5 hour
- FAQ_GUIDELINES.md (comprehensive): 1 hour
- Update project documentation: 0.5 hour

### Phase 3: Blog-Article-Writer Integration (1-1.5 hours)

- Update plan command: 0.5 hour
- Update execute command: 0.5 hour
- Update portfolio-copywriting skill (if needed): 0.5 hour

### Phase 4: Content Creation (OPTIONAL - 3-5 hours)

- FAQ for batch 1 (5 high-priority articles): 2-3 hours (25-35 min per article)
- FAQ for batch 2 (9 articles): 1-2 hours (lighter FAQ, 10-15 min per article)

**Note**: Phase 4 can be:

- Skipped initially and done later
- Done incrementally (article by article)
- Delegated to another agent or team member
- Automated in future iterations

### Phase 5: Testing & Validation (1-2 hours)

- Unit & integration tests: 0.5-1 hour
- Schema validation: 0.5 hour
- Accessibility audit: 0.5 hour
- Performance testing: 0.5 hour

## Rollout Strategy

### Incremental Deployment

**Stage 1: Infrastructure (Phases 1-2)** - Deploy technical foundation

- Deploy FAQ extractor + BlogPostPage integration + styling
- Create FAQ_TEMPLATE.md and FAQ_GUIDELINES.md
- Verify no breaking changes (articles without FAQ still work)
- Monitor performance (no regressions)
- Test with sample FAQ article

**Stage 2: Automation (Phase 3)** - Enable FAQ for new articles

- Update blog-article-writer commands
- Test FAQ generation in new article workflow
- Verify FAQ appears in newly generated articles
- From this point, all NEW articles will automatically include FAQ

**Stage 3: Content (Phase 4 - OPTIONAL)** - Backfill existing articles

- Can be done immediately or deferred
- Can be done incrementally (batch by batch)
- Suggested approach:
  - Week 1: Add FAQ to batch 1 (5 high-priority articles)
  - Week 2-3: Add FAQ to batch 2 (9 remaining articles)
  - Monitor schema validation in Google Search Console
  - Gather feedback on question/answer quality

### Success Metrics

**Short-term (1-2 weeks):**

- 100% of articles have FAQ sections
- 100% FAQPage schema validation pass rate
- 0 accessibility regressions

**Medium-term (1-3 months):**

- AI bot citation rate increase (track mentions in ChatGPT, Perplexity)
- Featured snippet appearances in Google
- Organic traffic increase to blog articles

**Long-term (3-6 months):**

- Top 3 ranking for target FAQ keywords
- Measurable AEO performance improvement
- Positive user feedback on FAQ usefulness

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| FAQ extraction fails for some HTML structures | Medium | Low | Comprehensive testing, graceful fallback |
| Schema validation errors | High | Medium | Use schema validator, test with Google tool |
| Performance regression from FAQ parsing | Medium | Low | Profile performance, optimize if needed |
| Content desynchronization (HTML vs schema) | High | Medium | Automated tests, single source of truth |
| Poor FAQ quality (not LLM-optimized) | High | Medium | Clear guidelines, review process |
| Accessibility issues | Medium | Low | Accessibility audit, screen reader testing |

## Notes

### Key Design Decisions

1. **HTML in Markdown**: FAQ content lives directly in markdown as HTML blocks, not in frontmatter. This ensures single source of truth and easy maintenance.

2. **Dynamic Schema Generation**: FAQPage schema is generated at runtime from rendered HTML, not statically at build time. This simplifies implementation and ensures synchronization.

3. **Auto-detection**: FAQ sections are detected automatically (H2 with "FAQ" text), not via explicit frontmatter flag. This reduces configuration burden.

4. **Plain HTML Rendering**: FAQ sections render as plain HTML (no accordions, no JS-only content) to maximize LLM accessibility and SEO value.

5. **Polish + English Technical Terms**: Following existing blog pattern, FAQ uses Polish for natural language, English for technical terms (unchanged).

### Edge Cases to Handle

- **Multiple FAQ sections**: Only extract first H2 FAQ section (warn in console if multiple detected)
- **Empty FAQ section**: H2 exists but no questions → Don't generate schema
- **Malformed FAQ**: Missing H3 or p → Log warning, skip malformed Q/A pairs
- **Special characters in questions**: Sanitize for schema (escape quotes, etc.)
- **Very long answers**: No length limit, but guidelines recommend 2-4 sentences

### Future Enhancements

- **FAQ Analytics**: Track which FAQ questions are most engaging (click tracking)
- **User-submitted questions**: Allow readers to suggest FAQ questions
- **AI-generated FAQ**: Auto-generate FAQ from article content using LLM
- **FAQ Search**: Site-wide FAQ search across all articles
- **FAQ Translations**: English FAQ versions for international audience

### References

**LLM SEO & AEO Optimization:**

- [LLM SEO Optimization Guide](https://llmrefs.com/blog/llm-seo-optimization)
- [How to Create FAQs that AI LLMs Will Actually Use](https://nowspeed.com/blog/how-to-create-faqs-that-ai-llms-will-actually-use/)
- [Do FAQ Sections Improve AEO Performance in LLMs?](https://www.team4.agency/post/do-faq-sections-improve-aeo-performance-in-llms)
- [Structured Data: Secret Weapon for SEO](https://www.digidop.com/blog/structured-data-secret-weapon-seo)
- [LLM SEO Guide](https://www.tripledart.com/guides/llm-seo)
- [LLM-Powered SEO](https://datasciencedojo.com/blog/llm-powered-seo/)

**Google Structured Data:**

- [Google FAQPage Structured Data](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [FAQ Schema Guide](https://studiohawk.com.au/blog/faq-schema/)

**AEO Best Practices:**

- [AI SEO FAQ](https://42dm.net/ai-seo-faq/)

## Related Issues

- Epic: AEO Optimization Roadmap
- Issue: Improve blog SEO performance
- Issue: Add structured data to all content types
- Issue: AI/LLM content discovery strategy

---

## Execution Strategy Summary

Based on user feedback, the implementation follows this prioritized approach:

### 1. Infrastructure First (Phases 1-2) - REQUIRED

**Build the technical foundation and documentation**

- FAQ extraction and schema generation
- BlogPostPage integration and styling
- FAQ_TEMPLATE.md and FAQ_GUIDELINES.md
- Test with sample FAQ article

**Deliverable**: Working FAQ system that can handle articles with FAQ sections

### 2. Automation Next (Phase 3) - REQUIRED

**Ensure all NEW articles include FAQ**

- Update blog-article-writer plan command
- Update blog-article-writer execute command
- Update portfolio-copywriting skill (if needed)

**Deliverable**: Automated FAQ generation for future articles

### 3. Content Last (Phase 4) - OPTIONAL

**Backfill existing articles when ready**

- Can be done later or incrementally
- Can be delegated to another agent
- Guidelines will be ready for independent execution

**Deliverable**: FAQ sections in existing 14 blog articles

### Why This Order?

1. **Technical foundation enables everything else** - Without infrastructure, we can't render or validate FAQ
2. **Guidelines enable independent work** - Once FAQ_GUIDELINES.md exists, content creation can be done by anyone
3. **Automation prevents future work** - New articles will automatically have FAQ, no manual backfill needed
4. **Content can wait** - Existing articles can be updated incrementally without blocking other phases

---

**Plan Status**: Ready for review and approval

**Next Step**: Review this plan, provide feedback or approve, then execute with `/piv_loop:execute`

**Recommended Execution**:

- Execute Phases 1-3 immediately (core infrastructure + automation)
- Defer Phase 4 (content creation) to a separate session or delegate to another agent
