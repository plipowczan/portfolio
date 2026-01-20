# Feature: Blog Article Sidebar Navigation with Table of Contents

**Created:** 2026-01-16
**Status:** Planned
**Feature Type:** Enhancement
**Complexity:** Medium

---

## Context References

### Prime Context
- `.claude/agents/context/prime-context.md` - COMPLETE codebase overview
  - Component architecture patterns
  - Styling approach (Tailwind utility-first, mobile-first)
  - React patterns (functional components, hooks)
  - Framer Motion animation patterns

### Current Implementation
- **BlogPostPage**: `src/pages/BlogPostPage.jsx` - Single-column article layout
- **Blog**: `src/pages/Blog.jsx` - Grid layout for article cards
- **Layout**: Max-width 4xl (896px), centered content
- **Markdown Rendering**: react-markdown with custom components for H2, H3 headings
- **Current Navigation**: Single "View All Posts" link at bottom

---

## Requirements

### Functional Requirements

**Desktop View (≥1024px):**
- [ ] FR-1: Display fixed sidebar on the right side with Table of Contents (TOC)
- [ ] FR-2: Automatically generate TOC from H2 and H3 headings in markdown content
- [ ] FR-3: Implement smooth scrolling to sections when TOC links are clicked
- [ ] FR-4: Highlight active section in TOC based on scroll position (scroll spy)
- [ ] FR-5: Sidebar should be sticky and follow scroll within viewport bounds
- [ ] FR-6: TOC should show hierarchical structure (H2 as parent, H3 as children)

**Mobile/Tablet View (<1024px):**
- [ ] FR-7: Display floating bottom navigation bar (FAB-style)
- [ ] FR-8: Bottom nav opens TOC as a slide-up drawer/modal
- [ ] FR-9: Drawer shows same TOC structure with smooth scrolling
- [ ] FR-10: Close drawer after clicking a TOC link (smooth UX)
- [ ] FR-11: Drawer has backdrop overlay to close on outside click

**Universal:**
- [ ] FR-12: TOC should only appear if article has at least 2 headings
- [ ] FR-13: Maintain existing breadcrumbs, meta info, tags sections
- [ ] FR-14: Preserve all existing markdown rendering functionality

### Non-Functional Requirements

- [ ] NFR-1: **Performance** - TOC generation should not cause layout shifts
- [ ] NFR-2: **Accessibility** - Keyboard navigation support, proper ARIA labels
- [ ] NFR-3: **Responsiveness** - Smooth transitions between mobile/desktop layouts
- [ ] NFR-4: **SEO** - No impact on existing SEO/structured data
- [ ] NFR-5: **Animation** - Framer Motion animations consistent with site style
- [ ] NFR-6: **Browser Compatibility** - Works on all modern browsers (Chrome, Firefox, Safari, Edge)

### Edge Cases & Considerations

- [ ] EC-1: Articles with no headings (TOC should not render)
- [ ] EC-2: Articles with only H3 headings (should work, treat as flat list)
- [ ] EC-3: Very long TOC (should scroll independently within sidebar)
- [ ] EC-4: Headings with special characters or emojis (handle in slug generation)
- [ ] EC-5: Duplicate heading text (add unique identifiers)
- [ ] EC-6: Deep nesting (limit to H2/H3 only, ignore deeper levels)
- [ ] EC-7: Scroll spy with fast scrolling (debounce/throttle for performance)

---

## Technical Approach

### Architecture Decision

**Approach:** Single-component solution with custom hooks

**Why:**
- Keeps TOC logic co-located with BlogPostPage
- Easier to maintain and test
- No prop drilling needed
- Follows existing codebase patterns (hooks for reusable logic)

**Alternatives Considered:**
1. ❌ Separate TOC component in `src/components/blog/` - Over-engineering for single-use case
2. ❌ Context API for TOC state - Unnecessary complexity for component-local state
3. ✅ **Custom hooks + conditional rendering** - Simple, maintainable, performant

### Component Structure

```
BlogPostPage.jsx
├── useTableOfContents() hook      # Extract headings from markdown
├── useScrollSpy() hook             # Track active section
├── Desktop: TableOfContentsSidebar # Fixed right sidebar
└── Mobile: FloatingTOCButton       # Bottom FAB + Drawer
    └── TableOfContentsDrawer       # Slide-up modal
```

### Key Patterns to Follow

**From Prime Context:**
- Functional components with arrow functions: `const Component = () => {}`
- Hooks for stateful logic: `useState`, `useEffect`, `useRef`
- Tailwind utility classes: mobile-first, `lg:` prefix for desktop
- Framer Motion: `motion.div` with variants for animations
- Props destructuring

**Styling:**
- Desktop sidebar: `sticky top-24` positioning
- Mobile FAB: `fixed bottom-6 right-6 z-50`
- Drawer: Full-width modal with backdrop
- Active link: Primary green color (#00ff9d)
- Hover states: Smooth transitions

### Data Flow

1. **Markdown Parsing** (Build time):
   - ReactMarkdown renders content with custom H2/H3 components
   - Custom components add `id` attributes to headings (slug-based)

2. **TOC Generation** (Runtime):
   - `useTableOfContents()` hook extracts headings from rendered DOM
   - Returns array: `[{ id, text, level }]`

3. **Scroll Tracking** (Runtime):
   - `useScrollSpy()` hook uses IntersectionObserver
   - Updates `activeId` state based on visible heading
   - Debounced for performance

4. **Navigation** (User interaction):
   - Click TOC link → Smooth scroll to heading
   - Mobile: Auto-close drawer after navigation

### Dependencies

**Existing (No new installs):**
- `framer-motion` - Drawer animations
- `react-icons` - FAB icon (FaList, FaTimes)
- `react-markdown` - Already used for rendering

**Browser APIs:**
- `IntersectionObserver` - Scroll spy
- `scrollIntoView({ behavior: 'smooth' })` - Smooth scrolling

---

## Implementation Steps

### Step 1: Add ID attributes to markdown headings
**Files:** `src/pages/BlogPostPage.jsx`

**Actions:**
- Modify H2 and H3 custom components in ReactMarkdown config
- Generate slug from heading text: `text.toLowerCase().replace(/\s+/g, '-')`
- Add `id={slug}` attribute to heading elements
- Handle duplicate IDs by appending counter suffix

**Notes:**
- Reuse existing heading components, just add ID prop
- Use simple slug generation (no external library needed)

### Step 2: Create useTableOfContents hook
**Files:** `src/pages/BlogPostPage.jsx` (co-located)

**Actions:**
- Create custom hook: `const useTableOfContents = (contentRef)`
- Use `useEffect` to query all H2/H3 elements from DOM
- Extract: `id`, `textContent`, `tagName` (for level detection)
- Return array of TOC items: `[{ id, text, level }]`
- Memoize with `useMemo` to avoid re-renders

**Notes:**
- Run after content renders (dependency on post data)
- Handle case where content hasn't rendered yet (return empty array)

### Step 3: Create useScrollSpy hook
**Files:** `src/pages/BlogPostPage.jsx` (co-located)

**Actions:**
- Create custom hook: `const useScrollSpy = (tocItems)`
- Use `IntersectionObserver` to track visible headings
- Set `rootMargin: '-20% 0px -35% 0px'` for natural feel
- Update `activeId` state when heading enters top 20% of viewport
- Cleanup observer on unmount

**Notes:**
- Only observe headings that exist in TOC
- Throttle updates to avoid performance issues
- Fall back to first heading if none are visible

### Step 4: Create Desktop TOC Sidebar Component
**Files:** `src/pages/BlogPostPage.jsx` (inline component)

**Actions:**
- Create `TableOfContentsSidebar` component
- Accept props: `tocItems`, `activeId`
- Render sticky sidebar: `sticky top-24 max-h-screen overflow-y-auto`
- Nest H3 items under H2 items (indentation with `pl-4`)
- Highlight active link with primary color
- Add smooth scroll on click: `element.scrollIntoView({ behavior: 'smooth' })`

**Styling:**
- Width: `w-64` (256px)
- Background: `bg-dark-800/50 backdrop-blur-sm`
- Border: `border border-white/10 rounded-xl`
- Padding: `p-6`
- Typography: `text-sm text-gray-400`
- Active link: `text-primary-500 font-medium`

### Step 5: Create Mobile FAB and Drawer Components
**Files:** `src/pages/BlogPostPage.jsx` (inline components)

**Actions:**
- Create `FloatingTOCButton`: Fixed bottom-right FAB
  - Icon: `FaList` from react-icons
  - Position: `fixed bottom-6 right-6 z-50`
  - Style: Circular, primary gradient background
  - Click: Opens drawer (toggle state)

- Create `TableOfContentsDrawer`: Slide-up modal
  - Framer Motion: `initial={{ y: '100%' }}`, `animate={{ y: 0 }}`
  - Backdrop: Semi-transparent overlay
  - Content: Same TOC structure as desktop
  - Close button: Top-right corner
  - Close on backdrop click
  - Close after link click

**Notes:**
- Use `AnimatePresence` for mount/unmount animations
- Prevent body scroll when drawer is open (`overflow-hidden`)

### Step 6: Update BlogPostPage Layout
**Files:** `src/pages/BlogPostPage.jsx`

**Actions:**
- Change layout from single column to grid on desktop
- Desktop: `lg:grid lg:grid-cols-[1fr_280px] lg:gap-8`
- Main content: Keep existing max-w-4xl wrapper
- Sidebar: New right column (280px fixed width)
- Mobile: Keep single column, show FAB instead
- Conditionally render TOC only if `tocItems.length >= 2`

**Layout structure:**
```jsx
<div className="section-container">
  <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
    {/* Main Article Content */}
    <article>{/* existing content */}</article>

    {/* Desktop TOC Sidebar */}
    {tocItems.length >= 2 && (
      <aside className="hidden lg:block">
        <TableOfContentsSidebar />
      </aside>
    )}
  </div>

  {/* Mobile FAB + Drawer */}
  {tocItems.length >= 2 && (
    <div className="lg:hidden">
      <FloatingTOCButton />
      <TableOfContentsDrawer />
    </div>
  )}
</div>
```

### Step 7: Add Accessibility Features
**Files:** `src/pages/BlogPostPage.jsx`

**Actions:**
- Add ARIA labels: `aria-label="Table of Contents"`
- Keyboard navigation: Focus styles on TOC links
- Skip link: Optional "Skip to content" for screen readers
- Semantic HTML: Use `<nav>` for TOC wrapper
- Button roles: Proper roles for FAB and drawer close button

**WCAG 2.1 AA Compliance:**
- Color contrast: Ensure 4.5:1 ratio for text
- Focus indicators: Visible outline on keyboard focus
- Screen reader: Announce active section changes

### Step 8: Test and Refine
**Files:** Manual testing across devices

**Actions:**
- Test on real blog posts (5-technik-pracy-z-claude-code.md)
- Verify scroll spy accuracy with different scroll speeds
- Test drawer animations on mobile devices
- Verify no layout shifts on load
- Test with articles of varying lengths (short, medium, long)
- Test edge cases: no headings, only H3s, duplicate text

---

## Files to Create

| File | Purpose |
|------|---------|
| None | All implementation inline in existing BlogPostPage.jsx |

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/BlogPostPage.jsx` | Add TOC sidebar, mobile FAB/drawer, custom hooks, update layout, modify heading components to add IDs |

---

## Testing Strategy

### Manual Testing

**Desktop (≥1024px):**
- [ ] TOC sidebar appears on right side
- [ ] Sidebar is sticky and follows scroll
- [ ] Active section highlights correctly while scrolling
- [ ] Clicking TOC link scrolls smoothly to section
- [ ] TOC shows hierarchical structure (H2 parent, H3 children)
- [ ] Long TOC scrolls independently within sidebar
- [ ] No layout shifts on page load

**Mobile (<1024px):**
- [ ] FAB button appears at bottom-right
- [ ] Clicking FAB opens drawer with smooth animation
- [ ] Drawer shows full TOC with backdrop
- [ ] Clicking TOC link scrolls to section and closes drawer
- [ ] Clicking backdrop closes drawer
- [ ] Close button (X) closes drawer
- [ ] Body scroll is prevented when drawer is open

**Edge Cases:**
- [ ] Article with no headings: TOC does not render
- [ ] Article with only H3 headings: TOC renders as flat list
- [ ] Duplicate heading text: IDs are unique (append suffix)
- [ ] Fast scrolling: Scroll spy updates correctly (no lag)
- [ ] Very long TOC: Sidebar scrolls independently

**Accessibility:**
- [ ] Keyboard navigation: Tab through TOC links
- [ ] Focus indicators: Visible outline on keyboard focus
- [ ] Screen readers: ARIA labels announce properly
- [ ] Color contrast: 4.5:1 ratio for all text

**Browser Compatibility:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Playwright E2E Tests (Future)

**Test Suite:** `tests/e2e/blog-toc.spec.js`

```javascript
test.describe('Blog TOC Navigation', () => {
  test('should display TOC on desktop', async ({ page }) => {
    await page.goto('/blog/5-technik-pracy-z-claude-code');
    await expect(page.locator('[aria-label="Table of Contents"]')).toBeVisible();
  });

  test('should scroll to section on click', async ({ page }) => {
    await page.goto('/blog/5-technik-pracy-z-claude-code');
    await page.click('text=PRD-first development');
    // Verify scroll position
  });

  test('should highlight active section', async ({ page }) => {
    await page.goto('/blog/5-technik-pracy-z-claude-code');
    // Scroll and verify active link changes
  });

  test('should show FAB on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile);
    await page.goto('/blog/5-technik-pracy-z-claude-code');
    await expect(page.locator('button[aria-label="Open Table of Contents"]')).toBeVisible();
  });
});
```

---

## Verification Criteria

**Functional:**
- [ ] VC-1: TOC appears on desktop with all H2/H3 headings
- [ ] VC-2: Active section highlights correctly while scrolling
- [ ] VC-3: Smooth scroll works on TOC link click
- [ ] VC-4: Mobile FAB opens drawer with TOC
- [ ] VC-5: Drawer closes after clicking TOC link
- [ ] VC-6: TOC does not render for articles with <2 headings

**Non-Functional:**
- [ ] VC-7: No layout shifts on page load (CLS = 0)
- [ ] VC-8: Scroll spy performs smoothly (no lag)
- [ ] VC-9: Animations are smooth (60fps)
- [ ] VC-10: Keyboard navigation works correctly
- [ ] VC-11: WCAG 2.1 AA compliant (color contrast, focus indicators)

**Integration:**
- [ ] VC-12: Existing breadcrumbs, meta info, tags unchanged
- [ ] VC-13: SEO/structured data unaffected
- [ ] VC-14: Markdown rendering works as before
- [ ] VC-15: No console errors or warnings

---

## Notes

### Design Decisions

**Why inline components instead of separate files?**
- TOC components are highly specific to BlogPostPage
- Single-use components don't benefit from file separation
- Co-location improves maintainability
- Reduces cognitive overhead (everything in one file)

**Why custom hooks instead of external library?**
- Heading extraction is simple (querySelector)
- IntersectionObserver is well-supported (98% browser coverage)
- No need for additional bundle size
- Full control over behavior

**Why sticky sidebar instead of fixed?**
- Sticky allows natural flow with content
- Avoids overlap with footer
- Better UX for long articles

**Why drawer instead of accordion for mobile?**
- Drawer provides more space for long TOCs
- Better UX pattern for mobile (familiar from apps)
- Consistent with modern mobile UI patterns

### Performance Considerations

- **IntersectionObserver**: More performant than scroll event listeners
- **Debouncing**: Scroll spy updates throttled to 100ms
- **Memoization**: TOC items memoized to avoid recalculation
- **Lazy rendering**: TOC only renders if ≥2 headings exist

### Accessibility Considerations

- **Semantic HTML**: `<nav>` for TOC wrapper
- **ARIA labels**: Descriptive labels for screen readers
- **Keyboard navigation**: Tab order and focus management
- **Color contrast**: 4.5:1 ratio for WCAG AA
- **Focus indicators**: Visible outlines for keyboard users

### Future Enhancements (Out of Scope)

- Progress bar showing reading progress
- "Back to top" button
- Estimated time to read each section
- Copy link to section (share specific heading)
- Print-friendly version (hide TOC)
- Dark/light mode toggle for TOC

---

## Related Issues

- None (proactive enhancement)

---

## Success Metrics

**User Experience:**
- Reduced scroll time to find specific sections
- Improved article readability and navigation
- Increased time on page (better engagement)

**Technical:**
- Zero layout shift (CLS = 0)
- Smooth animations (60fps)
- Fast TOC generation (<50ms)
- Accessible to all users (WCAG 2.1 AA)

---

**Ready to Execute:** Yes
**Estimated Complexity:** Medium (4-6 hours implementation)
**Risk Level:** Low (no breaking changes, additive feature)
