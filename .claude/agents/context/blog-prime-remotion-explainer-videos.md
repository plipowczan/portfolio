# Blog Prime: Remotion Explainer Videos with AI

## Source Materials Analyzed

### 1. User Notes (`docs/blog/Informacje ode mnie.md`)
- Pawel used Remotion to create animations for his consulting services website
- Result: 45-second explainer video at https://konsultacje.lipowczan.pl/explainer
- Time investment: "kilka minut" (a few minutes)
- Used prompt-based approach with brand colors extraction

**Prompt used:**
```markdown
For the current project create a 45-second explainer video based on the content.

The video should:
- Extract and use the brand colors from the site
- Highlight the main services/products
- Include key selling points
- Use professional, elegant animations
- End with a clear call-to-action

Aspect ratio: [16:9/9:16/1:1]
Style: [PROFESSIONAL/MODERN/PLAYFUL]
```

### 2. Tutorial from skool.com (`docs/blog/Tutorial from skool.com.md`)
Comprehensive tutorial covering:
- Installation via `npx skills add remotion-dev/skills`
- Use cases: Video editors, SaaS founders, Business owners
- Prompt templates for:
  - Animated title sequences
  - Lower thirds
  - Custom transitions
  - Product demo videos
  - Website-to-video explainers
  - Social media content
  - Logo animations
  - Testimonial displays
- Pro tips for better results
- Integration into apps
- Common mistakes to avoid
- What Remotion is best for (vs limitations)

## Key Topics Identified

1. **What is Remotion** - React-based video creation tool
2. **Claude + Remotion integration** - Using AI to generate video code
3. **Use cases by audience**:
   - Video editors (titles, lower thirds, transitions)
   - SaaS/App founders (product demos, explainers)
   - Business owners (website-to-video, marketing)
4. **Prompt engineering** for video generation
5. **Practical workflow** - from prompt to rendered video
6. **Tips for better results** (timing, brand assets, vibe description, aspect ratio)
7. **Integration possibilities** - embedding video generation in apps
8. **Limitations and workarounds**

## Target Audience Profile

**Primary**:
- Polish-speaking entrepreneurs and business owners
- SaaS founders needing marketing materials
- Consultants wanting to create professional video content
- Marketers looking to automate video production

**Knowledge Level**:
- Intermediate: familiar with AI tools (Claude, ChatGPT)
- Basic coding awareness but not professional developers
- Looking for practical, quick solutions

**Pain Points**:
- Video production is expensive (agencies, freelancers)
- Learning video editing tools takes too long
- Need for quick iterations on marketing materials
- Personalization at scale is challenging

## Unique Angle / Value Proposition

1. **Personal experience story** - Pawel created his own explainer video in minutes
2. **Polish market context** - First comprehensive Polish guide to Remotion + AI
3. **Practical prompts** - Ready-to-use templates in Polish context
4. **Business focus** - Not for video editors, but for business owners/founders
5. **Integration with existing article** - Links to Apple-style animations article (already published)

## Technical Concepts to Cover

1. **Remotion basics** - React-based, code-driven video
2. **Remotion Skills installation** - `npx skills add remotion-dev/skills`
3. **Prompting strategies**:
   - Scene-by-scene breakdown
   - Brand color specification
   - Timing and duration
   - Style descriptors
4. **Iteration workflow** - refining outputs
5. **Export options** - MP4, GIF, sequences
6. **Platform-specific formats** (16:9, 9:16, 1:1)

## Existing Article Style Patterns Observed

### From `animacje-apple-ai-cursor.md`:
- Hook: Problem + solution teaser
- Structure: Clear workflow steps
- Technical depth: Specific tool names, prompts, configs
- Personal voice: "Ja też nie jestem animatorem"
- Practical resources section at end
- HTML CTA with Tailwind styling
- FAQ with `<details open>` accordion format
- Cross-links to related articles (vibe-coding-przewodnik)
- Approximately 12 min read time, ~2500 words

### From `5-technik-pracy-z-claude-code.md`:
- Hook: Challenge the reader's current approach
- Structure: Numbered techniques with detailed explanations
- Code examples in markdown blocks
- "Moje doświadczenie" personal sections
- Longer format (~14 min, ~3500 words)
- Detailed FAQ section (6 questions)
- Resources with GitHub links

### Common Patterns:
- **Frontmatter**: Standard YAML with all required fields
- **Language**: Polish main + English technical terms
- **Tone**: Direct, practical, personal ("Z własnego doświadczenia wiem...")
- **Structure**: Hook → Problem → Solution (Steps) → Results → Conclusions → Resources → CTA → FAQ
- **Code blocks**: Always with language tag
- **CTA**: HTML with Tailwind, contextual text, link to `/#contact`
- **FAQ**: 4-6 questions in `<details open>` format

## Code Examples Needed

1. **Installation command**:
```bash
npx skills add remotion-dev/skills
```

2. **Example prompts** (translated/adapted to Polish context):
- Product demo prompt
- Explainer video prompt
- Social media content prompt

3. **Configuration examples** if applicable

## Article Metadata Suggestions

- **ID**: 18 (next after id: 17 for animacje-apple-ai-cursor.md)
- **Category**: AI (fits with Remotion + Claude integration)
- **Suggested slug**: `remotion-explainer-videos-ai`
- **Estimated read time**: 10-12 min
- **Tags**: AI, Remotion, Video, Automatyzacja, Claude Code

## Cross-Linking Opportunities

- Link TO: `/blog/animacje-apple-ai-cursor` (Apple-style animations)
- Link TO: `/blog/vibe-coding-przewodnik` (vibe coding approach)
- Potential: `/blog/5-technik-pracy-z-claude-code` (Claude Code techniques)

## CTA Context

Topic: AI + Video generation for business
Suggested CTA theme: Help with AI implementation for marketing automation

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz tworzyć profesjonalne wideo dla swojego biznesu?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci wdrożyć AI w procesie tworzenia treści marketingowych - od strategii przez implementację po automatyzację produkcji.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

## Ready for Planning Phase

- [x] All source materials identified and read
- [x] Pawel's writing style understood
- [x] Portfolio copywriting guidelines reviewed
- [x] Key topics and technical concepts extracted
- [x] Prime artifact created with comprehensive context

## Next Step

Run `/blog-article-writer:plan "Remotion + AI: Jak tworzyć profesjonalne wideo za pomocą kodu i Claude"` to create the article structure and outline.
