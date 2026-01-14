# Feature: Complete CTA for All Blog Posts - Remove Automation House References

**Created**: 2026-01-13
**Status**: Planned
**Priority**: High

## Context

Currently, 10 out of 15 blog posts contain outdated CTA (Call-to-Action) sections referencing **Automation House** (external service). The portfolio has evolved to promote **direct consultation with Paweł Lipowczan** via the BookingCTA component (Zencal widget) available at `/#contact`.

Recent blog posts (2 articles) already use the new CTA format:
- `15-cursor-hacks-produktywnosc-ai.md`
- `5-technik-pracy-z-claude-code.md`

These posts demonstrate the target CTA structure using:
- HTML `<div>` with styled card
- Direct link to `/#contact`
- Personal branding (Paweł Lipowczan)
- Focus on consultation services

## Requirements

### Functional Requirements

- [ ] FR-1: Replace all Automation House CTA sections with personal consultation CTA
- [ ] FR-2: Maintain consistent CTA format across all 15 blog posts
- [ ] FR-3: Update article structure guidelines to reflect new CTA standard
- [ ] FR-4: Remove all Automation House references from blog content (except historical context mentions)
- [ ] FR-5: Preserve author bio if it contains valuable context (but remove Automation House affiliation)

### Non-Functional Requirements

- [ ] NFR-1: Maintain SEO value - don't change article slugs, titles, or core content
- [ ] NFR-2: Preserve frontmatter structure (no changes to metadata)
- [ ] NFR-3: Keep existing article quality and technical accuracy
- [ ] NFR-4: Ensure CTA renders correctly across mobile/desktop viewports

## Technical Approach

### Architecture

**Single-file updates approach:**
- Each blog post is an independent Markdown file
- Updates are isolated - no shared components to modify
- Changes are content-only (no code changes required)

**CTA Structure:**
- HTML `<div>` with Tailwind classes (already supported by `rehypeRaw` in BlogPostPage.jsx)
- Link to `/#contact` (uses hash routing to BookingCTA component)
- Three elements: title, description, button

### Patterns to Follow

Use the CTA pattern from `15-cursor-hacks-produktywnosc-ai.md` and `5-technik-pracy-z-claude-code.md`:

```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    [Context-specific title about consultation]
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    [Context-specific description of how Paweł can help with this topic]
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

**Customization per article:**
- Title: Reflects article topic (e.g., "Potrzebujesz pomocy z automatyzacją CRM?" for CRM article)
- Description: Specific value proposition related to article content
- Button: Always "Umów bezpłatną konsultację"

### Trade-offs

**Option A: Generic CTA (same for all posts)**
- ✅ Faster implementation
- ✅ Easy to maintain
- ❌ Less contextual relevance
- ❌ Lower conversion potential

**Option B: Context-specific CTA (customized per article)** ✅ CHOSEN
- ✅ Higher relevance and conversion
- ✅ Better user experience
- ❌ Requires more thoughtful writing
- ❌ Takes longer to implement

**Decision:** Use **Option B** - context-specific CTAs that align with each article's topic while maintaining visual consistency.

### Dependencies

- None - this is a content-only update
- BlogPostPage.jsx already supports HTML via `rehypeRaw` plugin

## Implementation Steps

### Step 1: Update Article Structure Guidelines
**Files:** `.claude/skills/portfolio-copywriting/references/article-structure.md`

Update the CTA section (lines 276-294) with new HTML-based CTA format and examples.

### Step 2: Update Blog Posts with Automation House CTAs (10 files)

For each of the following files, replace Automation House CTA with context-specific personal consultation CTA:

1. `src/content/blog/zapier-vs-make-vs-n8n-wybor-narzedzia.md`
2. `src/content/blog/dane-jako-paliwo-biznesu.md`
3. `src/content/blog/kazda-firma-dziala-nieoptymalnie.md`
4. `src/content/blog/hackathon-hacknation-analiza-doswiadczen.md`
5. `src/content/blog/airtable-vs-excel-migracja.md`
6. `src/content/blog/automatyzacja-email-frontdesk-ai.md`
7. `src/content/blog/chatboty-ai-od-koncepcji-do-wdrozenia.md`
8. `src/content/blog/el-padre-automatyzacja-ofert-ai.md`
9. `src/content/blog/no-code-lead-generation.md`
10. `src/content/blog/vibe-coding-przewodnik.md`

**Pattern:**
- Find section starting with `## Potrzebujesz pomocy` or `**Chcesz` or similar CTA text
- Remove Automation House references (links to automation.house, mentions of services)
- Remove author bio with Automation House affiliation (if present at end)
- Insert context-specific HTML CTA block

### Step 3: Standardize CTAs in Recent Posts (2 files)

Verify and potentially adjust CTA wording in recent posts that already use the new format:

1. `src/content/blog/15-cursor-hacks-produktywnosc-ai.md`
2. `src/content/blog/5-technik-pracy-z-claude-code.md`

Ensure consistency in:
- HTML structure and Tailwind classes
- Button text ("Umów bezpłatną konsultację")
- Link destination (`/#contact`)

### Step 4: Check Remaining Posts (3 files)

Review posts that don't have Automation House references to ensure they have proper CTAs:

1. `src/content/blog/kodowanie-w-2025-ai-portfolio.md`
2. `src/content/blog/trendy-ai-2026-od-eksperymentow-do-operacjonalizacji.md`
3. `src/content/blog/README.md` (likely meta file, exclude from CTA updates)

Add new CTA format if missing.

### Step 5: Validation

- [ ] Visual check: View all updated articles in browser (`npm run dev`)
- [ ] Responsive test: Check CTA renders correctly on mobile
- [ ] Link test: Verify `/#contact` navigates to BookingCTA component
- [ ] Content check: Ensure no Automation House references remain in CTA sections
- [ ] SEO check: Confirm no impact to titles, slugs, or meta descriptions

## Files to Create

None - this is a content update only.

## Files to Modify

| File | Changes |
|------|---------|
| `.claude/skills/portfolio-copywriting/references/article-structure.md` | Update CTA section with new HTML format and examples |
| `src/content/blog/zapier-vs-make-vs-n8n-wybor-narzedzia.md` | Replace Automation House CTA with context-specific personal CTA |
| `src/content/blog/dane-jako-paliwo-biznesu.md` | Replace Automation House CTA with context-specific personal CTA |
| `src/content/blog/kazda-firma-dziala-nieoptymalnie.md` | Replace Automation House CTA with context-specific personal CTA |
| `src/content/blog/hackathon-hacknation-analiza-doswiadczen.md` | Replace Automation House CTA with context-specific personal CTA |
| `src/content/blog/airtable-vs-excel-migracja.md` | Replace Automation House CTA with context-specific personal CTA |
| `src/content/blog/automatyzacja-email-frontdesk-ai.md` | Replace Automation House CTA with context-specific personal CTA |
| `src/content/blog/chatboty-ai-od-koncepcji-do-wdrozenia.md` | Replace Automation House CTA with context-specific personal CTA |
| `src/content/blog/el-padre-automatyzacja-ofert-ai.md` | Replace Automation House CTA with context-specific personal CTA |
| `src/content/blog/no-code-lead-generation.md` | Replace Automation House CTA with context-specific personal CTA |
| `src/content/blog/vibe-coding-przewodnik.md` | Replace Automation House CTA with context-specific personal CTA |
| `src/content/blog/kodowanie-w-2025-ai-portfolio.md` | Review and add CTA if missing |
| `src/content/blog/trendy-ai-2026-od-eksperymentow-do-operacjonalizacji.md` | Review and add CTA if missing |

## Testing Strategy

### Manual Testing

- [ ] Test 1: Open each updated blog post in browser
- [ ] Test 2: Verify CTA section displays correctly (styling, spacing, hover effects)
- [ ] Test 3: Click "Umów bezpłatną konsultację" button - should navigate to `/#contact`
- [ ] Test 4: Test responsive layout on mobile viewport (320px, 768px, 1024px)
- [ ] Test 5: Search for "automation.house" in all blog files - should return 0 results in CTA sections

### Automated Testing

- [ ] Run existing E2E tests: `npm test`
- [ ] Ensure blog navigation tests still pass
- [ ] No new tests needed (content-only change)

## Verification Criteria

- [ ] All 10 blog posts with Automation House CTAs have been updated
- [ ] All CTAs use consistent HTML structure and Tailwind classes
- [ ] All CTAs are context-specific to their article topics
- [ ] All CTAs link to `/#contact`
- [ ] No broken links or rendering issues
- [ ] Article structure guidelines reflect new CTA standard
- [ ] No Automation House references remain in CTA sections (historical context mentions OK in body content)
- [ ] Mobile responsiveness maintained
- [ ] All E2E tests pass

## CTA Content Templates

### Template 1: Automation/Process Optimization Articles
```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Potrzebujesz pomocy z automatyzacją?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci zidentyfikować procesy do automatyzacji, wybrać odpowiednie narzędzia i wdrożyć rozwiązania, które zaoszczędzą czas i pieniądze Twojej firmie.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

### Template 2: No-Code/Technical Tool Articles
```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz wdrożyć [topic] w swojej firmie?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci wybrać odpowiednie narzędzia, zaprojektować architekturę rozwiązania i wdrożyć je krok po kroku. Od analizy potrzeb przez implementację po szkolenia zespołu.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

### Template 3: AI/Chatbot Articles
```html
<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Chcesz wdrożyć AI w swojej organizacji?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    Pomogę Ci znaleźć realne zastosowania AI w Twoim biznesie, uniknąć popularnych pułapek i wdrożyć rozwiązania, które przynoszą mierzalne rezultaty.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Umów bezpłatną konsultację</a>
</div>
```

## Notes

### Historical Context Preservation

Some articles mention Automation House as part of case studies or historical context (e.g., "W Automation House wypracowaliśmy..."). These references should be evaluated case-by-case:

- **Keep:** References in body content that provide valuable context or case study details
- **Remove:** CTA sections, author bios, promotional content

### SEO Considerations

- No changes to article titles, slugs, or frontmatter
- CTA text is at bottom of page (low SEO impact)
- Internal links to `/#contact` are beneficial for site structure

### Future Maintenance

Update `.claude/skills/portfolio-copywriting/references/article-structure.md` to ensure all future articles use the new CTA format.

## Related Issues

None

## Risk Assessment

**Low Risk:**
- Content-only changes
- No code modifications
- Easy to revert if needed
- No impact on functionality or performance

**Potential Issues:**
- Inconsistent CTA quality if rushed
- Missing edge cases in historical references

**Mitigation:**
- Careful review of each article
- Test all links and rendering
- Run E2E tests to catch regressions

---

## Ready for Execution

This plan is ready for implementation. Use `/piv_loop:execute` to begin.
