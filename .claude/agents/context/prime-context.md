# Portfolio Prime Context

**Last Updated:** 2026-01-18
**Branch:** main
**Commit:** aed46b25975747ce722f14452015c7669c7e0f01

## Project Overview

- **Name:** Portfolio - Paweł Lipowczan
- **Purpose:** Personal portfolio website showcasing automation, no-code, and AI expertise
- **Live URL:** https://pawellipowczan.pl (Vercel)
- **Tech Stack:** React 19 + Vite 7 + Tailwind CSS 3 + Framer Motion 12
- **Type:** Single Page Application (SPA) with build-time prerendering for SEO
- **Current Version:** 1.0.0

---

## Architecture

### Frontend
- **Framework:** React 19.2.0 (functional components, hooks)
- **Build Tool:** Vite 7.2.2 (dev server on port 3000)
- **Styling:** Tailwind CSS 3.4.18 (utility-first, mobile-first)
- **Animations:** Framer Motion 12.23.24 (declarative animations)
- **Routing:** React Router DOM 7.9.6 (client-side routing)
- **SEO:** React Helmet Async 2.0.5 + Puppeteer prerendering
- **State Management:** Local state + props (Context API for global concerns)
- **HTTP Client:** Fetch API (native)

### Backend (Static Data)
- **Data Storage:** File-based (Markdown with Frontmatter, JavaScript objects)
- **Database:** None (static site)
- **Blog Content:** `src/content/blog/*.md` files with YAML frontmatter
- **Static Data:** `src/data/*.js` (projects, skills, testimonials)

### Build & Deployment
- **Build Commands:**
  - `npm run build` - Standard Vite build
  - `npm run build:prerender` - Full production build with Puppeteer prerendering
- **Prerendering:** Puppeteer-based (generates static HTML for SEO)
- **Deployment:** Vercel (automatic deployment on push to main)
- **Analytics:** Vercel Analytics + Speed Insights

---

## Key Patterns

### Frontend Patterns

**Component Architecture:**
- Functional components with arrow functions: `const Component = () => {}`
- Named exports over default exports
- Props destructuring: `const Component = ({ prop1, prop2 }) => {}`
- Hook-based logic (no class components)
- Component size limit: < 200 lines (extract to custom hooks if larger)

**Component Organization:**
```
src/components/
├── layout/         # Structural components (Header, Footer, Layout)
├── sections/       # Landing page sections (Hero, About, Projects)
├── ui/             # Reusable UI elements (Modal, Breadcrumbs, CookieBanner)
├── widgets/        # Third-party integrations (ZencalWidget)
├── booking/        # Booking modal components (BookingModalContent)
├── animations/     # Framer Motion animation wrappers
└── seo/            # SEO components (Meta, StructuredData)
```

**State Management:**
- Local state with `useState` for component-specific state
- Context API for global concerns (BookingContext for modal state)
- Props drilling for simple cases (max 2-3 levels)
- Custom hooks for reusable stateful logic (`useBooking`)

**Styling Approach:**
- Utility-first with Tailwind CSS
- Mobile-first responsive design: `text-sm md:text-base lg:text-lg`
- Custom utilities in `index.css` for complex animations/gradients
- Class ordering: Layout → Sizing → Typography → Visual → Effects
- Design tokens in `tailwind.config.js`:
  - Primary green: `#00ff9d` (accent color)
  - Secondary cyan: `#00b8ff` (highlights)
  - Dark theme: `#050810` to `#1f2937` (backgrounds)

**Routing Pattern:**
- Declarative routing with React Router
- Routes defined in `App.jsx`
- Page components in `src/pages/`
- Dynamic routes: `/blog/:slug`, `/projects/:slug`
- Hash navigation handled in Navigation and Home components

**SEO Pattern:**
- React Helmet Async for meta tags
- Unique title and description per page
- OpenGraph images for social media
- Prerendering for search engines (Puppeteer)
- Structured data (JSON-LD) for rich snippets

**Animation Pattern:**
- Framer Motion for complex animations
- CSS transitions for simple hover states
- `useReducedMotion` hook for accessibility
- Variants for orchestrated animations
- Animate `transform` and `opacity` only (performance)

**Booking Modal Architecture:**
- Global modal state managed via BookingContext
- Custom hook `useBooking()` for accessing modal controls
- Modal component: `src/components/ui/Modal.jsx`
- Modal content: `src/components/booking/BookingModalContent.jsx`
- Zencal widget integration: `src/components/widgets/ZencalWidget.jsx`
- Can be triggered from anywhere in the app via `openBookingModal()`
- CTA buttons in Hero, BookingCTA section, and Navigation

### Backend Patterns (Static Data)

**Blog Content System:**
- Source: `src/content/blog/*.md`
- Loader: `src/data/blogPosts.js` (uses Vite's `import.meta.glob`)
- Parser: `gray-matter` for frontmatter extraction
- Renderer: `react-markdown` with `rehype-raw` and `remark-gfm`

**Frontmatter Schema (Required Fields):**
```yaml
---
id: 1                                   # Unique integer ID
slug: article-slug                      # URL-friendly identifier
title: Article Title                    # Display title (50-60 chars)
excerpt: Short summary                  # SEO & preview (150-200 chars)
category: Automatyzacja                 # Single category
author: Pawel Lipowczan                 # Author name
date: 2025-11-15                        # YYYY-MM-DD format
readTime: 8 min                         # Estimated read time
image: /images/og-article.webp          # OG image path
tags:                                   # List of tags
  - Tag1
  - Tag2
---
```

**Data Validation:**
- Automatic validation in `blogPosts.js`
- Required field checks
- Type validation (id must be number)
- Files starting with `_` or ending with `_wsad.md` are excluded
- Files named `README.md` are excluded

**Static Data Files:**
- `src/data/projects.js` - Portfolio projects (9 projects)
- `src/data/skills.js` - Technical skills categorization
- `src/data/testimonials.js` - Client testimonials

---

## Codebase Structure

### Directory Layout
```
portfolio/
├── .claude/                    # Agent-facing documentation
│   ├── agents/                 # Agent artifacts (context, plans, reports)
│   ├── commands/               # PIV workflow commands
│   ├── examples/               # Code examples
│   ├── reference/              # Technical reference docs
│   ├── rules/                  # Modular coding rules
│   └── skills/                 # Custom skills
│
├── docs/                       # User-facing documentation (Polish)
│   ├── BLOG_WORKFLOW.md        # Blog article workflow
│   └── blog/                   # Blog source materials (transcripts, notes)
│
├── public/                     # Static assets
│   └── images/                 # Images, OG images (WebP format)
│
├── scripts/                    # Build and maintenance scripts
│   ├── build-with-prerender.mjs
│   ├── prerender.mjs
│   ├── generate-image.js       # Gemini API OG image generation
│   ├── convert-to-webp.js
│   ├── update-sitemap.js
│   └── check-og-images.mjs
│
├── src/
│   ├── components/
│   │   ├── layout/             # Navigation, Footer, Layout
│   │   ├── sections/           # Hero, About, Projects, Skills, ContactForm, BookingCTA
│   │   ├── ui/                 # Modal, Breadcrumbs, CookieBanner
│   │   ├── widgets/            # ZencalWidget (third-party integrations)
│   │   ├── booking/            # BookingModalContent
│   │   ├── animations/         # NetworkBackground (Canvas-based)
│   │   └── seo/                # SEO, StructuredData
│   │
│   ├── content/
│   │   └── blog/               # Markdown blog posts
│   │
│   ├── data/                   # Static data files
│   │   ├── blogPosts.js        # Blog loader and parser
│   │   ├── projects.js
│   │   ├── skills.js
│   │   └── testimonials.js
│   │
│   ├── context/                # React Context providers
│   │   └── BookingContext.jsx  # Global booking modal state
│   │
│   ├── pages/                  # Route components
│   │   ├── Home.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPostPage.jsx
│   │   ├── ProjectPage.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── TermsOfService.jsx
│   │   └── CookiePolicy.jsx
│   │
│   ├── styles/
│   │   └── index.css           # Global styles, custom animations
│   │
│   ├── utils/                  # Helper functions
│   │   └── constants.js        # Navigation links, constants
│   │
│   ├── App.jsx                 # Route definitions
│   └── main.jsx                # Application entry point
│
├── tests/                      # Playwright E2E tests
│   ├── e2e/                    # End-to-end test suites
│   ├── fixtures/               # Test data
│   └── utils/                  # Test helpers
│
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind theme configuration
├── playwright.config.js        # Playwright test configuration
└── CLAUDE.md                   # Project instructions
```

---

## Configuration Files

### Key Configuration Files
- `vite.config.js` - Vite build configuration, dev server settings, node polyfills
- `tailwind.config.js` - Theme, colors, animations, content paths
- `playwright.config.js` - E2E test configuration (5 browsers: 3 desktop + 2 mobile)
- `vercel.json` - Vercel deployment configuration, routing, security headers
- `.claude/settings.local.json` - Claude Code settings (permissions, skills)
- `package.json` - Dependencies, scripts, project metadata

### Environment Variables
- `.env` file for sensitive data (not committed)
- Access via `import.meta.env.VITE_VARIABLE_NAME`
- Common variables:
  - `VITE_FORM_ENDPOINT` - Formspree endpoint for contact form
  - `GEMINI_API_KEY` - For OG image generation (server-side only)

---

## External APIs & Services

### Deployment & Analytics
- **Vercel** - Hosting and deployment
- **Vercel Analytics** - User analytics
- **Vercel Speed Insights** - Performance monitoring

### Content & Assets
- **Formspree** - Contact form handling (via VITE_FORM_ENDPOINT)
- **Google Gemini API** - OG image generation (gemini-3-pro-image-preview)
- **Zencal** - Booking widget for consultation scheduling

### Development Tools
- **Puppeteer** - Prerendering for SEO
- **Sharp** - Image optimization (WebP conversion)

---

## Testing

### E2E Testing (Playwright)
- **Framework:** Playwright 1.56.1
- **Test Directory:** `tests/`
- **Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Base URL:** http://localhost:3000
- **Configuration:** `playwright.config.js`

**Test Structure:**
- `tests/e2e/` - End-to-end test suites
- `tests/fixtures/` - Test data
- `tests/utils/` - Test helpers

**Test Coverage Areas:**
- Navigation and routing
- Forms (contact form)
- Blog system
- SEO meta tags
- Accessibility (WCAG 2.1 AA)
- Responsiveness (mobile + desktop)
- Booking CTA integration
- Breadcrumbs
- Policy pages
- Testimonials

**Running Tests:**
```bash
npm test                  # Run all tests
npm run test:headed       # Run with visible browser
npm run test:ui           # Interactive test UI
npm run test:chrome       # Chromium only
npm run test:firefox      # Firefox only
npm run test:webkit       # WebKit only
npm run test:mobile       # Mobile Chrome + Safari
```

---

## Build & Run

### Development
```bash
npm install               # Install dependencies
npm run dev               # Start dev server (localhost:3000)
```

### Production Build
```bash
npm run build             # Fast build (no prerender)
npm run build:prerender   # Full production build with SEO prerendering
npm run preview           # Preview production build (localhost:4173)
```

### Content Management
```bash
npm run blog:sitemap      # Update sitemap.xml with blog posts
npm run img:convert       # Convert images to WebP format
npm run img:generate      # Generate OG image (Gemini API)
npm run og:check          # Check OG image dimensions
npm run og:resize         # Resize OG images
npm run og:apply          # Apply OG image resize
npm run og:preview        # Preview OG image resize
```

### Testing
```bash
npm test                  # Run Playwright E2E tests
npm run test:ui           # Interactive test UI
npm run test:debug        # Debug mode
npm run test:report       # Show last test report
```

---

## Recent Activity

```
aed46b2 Enhance documentation and refactor BlogPostPage for improved slug generation
31ae407 Refactor BlogPostPage component for improved heading ID generation
febefd7 Refactor blog article IDs for improved organization and consistency
ec1994b Update blog article IDs for consistency and organization
d72a13e Implement global booking modal architecture and enhance CTA integration
b3be3d1 Enhance blog article workflow documentation and validation process
b5330ae Refactor BlogPostPage component to improve code readability and clarity
b79d103 updated blog workflow - moved from agent blog-article-writer to command based article generation in 4 steps flow prime, plan, execute, validate
7e3dc22 feat: add image generation script with configurable output directory
4b5ec8b moved BLOG_WORKFLOW.md out out blog folder which serves as a context data storage
ee1f360 updated blog-writer agent workflow using PIV
91c1d3c adjustments to piv methodology
57655a1 added gitkeep for scripts folder
611d1df Add new blog article: "5 technik pracy z Claude Code"
bc9afaf Update PRD, SRS, and documentation; enhance booking CTA tests
```

### Current State
- **Branch:** main
- **Status:** Clean working directory
- **Last Commit:** Enhance documentation and refactor BlogPostPage for improved slug generation

---

## Important Notes

### Critical Conventions

**Code Style:**
- Use arrow functions for all components
- Named exports over default exports
- Props destructuring
- Optional chaining (`?.`) and nullish coalescing (`??`)
- Keep components under 200 lines

**File Naming:**
- Components: PascalCase (`Hero.jsx`, `ProjectCard.jsx`)
- Utilities/Hooks: camelCase (`useScrollAnimation.js`, `formatDate.js`)
- Pages: PascalCase (`Home.jsx`, `BlogPost.jsx`)

**CSS/Tailwind:**
- Mobile-first responsive design
- Utility-first approach
- Custom CSS only for complex animations/gradients
- Order: Layout → Sizing → Typography → Visual → Effects

**Blog System:**
- ALL code blocks MUST have language tags (validation enforced)
- NEVER polonize English technical terms
- Use Pawel's voice (direct, practical, personal)
- Polish language with natural English technical terms
- Frontmatter validation is automatic and strict

**Testing:**
- Test coverage target: 70% overall
- Critical paths: 100% (forms, navigation, blog rendering)
- Use Playwright for E2E testing
- Accessibility testing included (WCAG 2.1 AA)

**Git Workflow:**
- Branch naming: `feature/name`, `fix/name`
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Never commit directly to main (except for updates that don't require a feature branch)
- Co-authored commits: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

### PIV Methodology

This project follows the **PIV (Prime-Implement-Validate)** methodology for all development work:

1. **Prime:** Load codebase context (`/piv_loop:prime`)
2. **Plan:** Create implementation plan (`/piv_loop:plan-feature`)
3. **Execute:** Implement the plan (`/piv_loop:execute`)
4. **Validate:** Run validation pipeline (`/validation:validate`)

**PIV Artifacts Storage:**
- Context: `.claude/agents/context/`
- Plans: `.claude/agents/plans/`
- Reports: `.claude/agents/reports/`
- Reviews: `.claude/agents/reviews/`

### Blog Article Workflow

**DO NOT use Task tool with blog-article-writer agent** due to subagent file access restrictions.

**INSTEAD: Invoke commands sequentially:**
1. `/blog-article-writer:prime`
2. `/blog-article-writer:plan`
3. Review plan → Approve or request changes
4. `/blog-article-writer:execute`
5. `/blog-article-writer:validate` (runs automatically)
6. Review validation report

See `docs/BLOG_WORKFLOW.md` for complete guide.

### Design Tokens

**Color Palette:**
- Primary green: `#00ff9d` (accent, CTAs)
- Secondary cyan: `#00b8ff` (highlights)
- Dark shades: `#050810` (darkest) to `#1f2937` (lighter)

**Typography:**
- Sans-serif: Inter, system-ui, sans-serif
- Monospace: Fira Code, monospace

**Animations:**
- Use `transform` and `opacity` for performance
- Avoid animating `width`, `height`, `top`, `left`
- Respect `prefers-reduced-motion`

---

## References

### Documentation
- **CLAUDE.md:** Project overview and tech stack
- **.claude/rules/:** Modular coding rules (React, Tailwind, Vite, etc.)
- **.claude/reference/:** Technical reference docs
- **docs/BLOG_WORKFLOW.md:** Complete blog article workflow
- **docs/TODO.md:** Pending features and improvements

### Skills
- **portfolio-code-review:** Code review for portfolio project
- **portfolio-copywriting:** Blog article writing in Pawel's style
- **portfolio-frontend-design:** Frontend design system
- **portfolio-testing:** E2E testing with Playwright

### Tools & Frameworks
- React 19: https://react.dev
- Vite 7: https://vitejs.dev
- Tailwind CSS 3: https://tailwindcss.com
- Framer Motion 12: https://www.framer.com/motion
- Playwright: https://playwright.dev

---

## Next Steps

After loading this context:

1. **For new features:** Use `/piv_loop:plan-feature "description"`
2. **For bug fixes:** Use `/bug_fix:rca` then `/bug_fix:implement-fix`
3. **For blog articles:** Use `/blog-article-writer:prime` then follow blog workflow
4. **For code review:** Use `/validation:code-review`
5. **For validation:** Use `/validation:validate` (automatic after execute)

**Remember:** Always reference this context file from implementation plans:
```markdown
## CONTEXT REFERENCES
- `.claude/agents/context/prime-context.md` - COMPLETE codebase overview
```
