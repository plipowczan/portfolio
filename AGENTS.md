# AGENTS.md - Portfolio Project Guide for AI Agents

**Project:** Pawel Lipowczan Portfolio Website
**Version:** 1.0.0
**Status:** ✅ Completed and Deployed (Production)
**Last Updated:** 2025-12-13
**Deployment:** https://pawellipowczan.pl (Vercel)

---

## Purpose & Overview

This document is the **main entry point for AI agents** working on this portfolio project. It provides a comprehensive overview of the project structure, current state, and common tasks without requiring agents to read through all documentation.

**Key Points:**
- The project is a personal portfolio website built with React 19, Vite 7, and Tailwind CSS
- All features are implemented and deployed to production
- Current focus: Performance optimization and content expansion
- Documentation is split: **English for AI agents**, **Polish for human users**

**Related Documentation:**
- [PRD.md](./docs/PRD.md) - Product requirements and brand identity
- [SRS.md](./docs/SRS.md) - Technical specification and architecture
- [.cursorrules](./.cursorrules) - Development guidelines and coding standards
- [docs/maintenance/TODO.md](./docs/maintenance/TODO.md) - Current tasks and priorities (Polish)

---

## Quick Project Summary

### Tech Stack (Current Versions)

**Core:**
- React 19.2.0 - UI library
- Vite 7.2.2 - Build tool and dev server
- React Router 7.9.6 - Client-side routing

**Styling & UI:**
- Tailwind CSS 3.4.18 - Utility-first CSS framework
- Framer Motion 12.23.24 - Animation library
- PostCSS 8.5.6 + Autoprefixer 10.4.22

**SEO & Analytics:**
- React Helmet Async 2.0.5 - Dynamic meta tags
- Puppeteer Core 24.32.1 + @sparticuz/chromium 133.0.0 - Prerendering for SEO
- Vercel Analytics 1.5.0 + Speed Insights 1.3.0

**Content & Data:**
- React Markdown 10.1.0 - Markdown rendering for blog
- gray-matter 4.0.3 - Frontmatter parsing
- React Icons 5.5.0 - Icon components

**Testing:**
- Playwright 1.56.1 - End-to-end testing

**AI Integration:**
- @anthropic-ai/sdk 0.69.0 - Anthropic API
- openai 6.9.0 - OpenAI API

### Deployment & Infrastructure

- **Platform:** Vercel (production)
- **Domain:** https://pawellipowczan.pl
- **Build Command:** `npm run build:prerender`
- **Node Version:** 20.x
- **Deploy:** Automatic on push to main branch

### Performance Status

**Core Web Vitals (Current):**
- First Contentful Paint (FCP): 5.3s ⚠️ (Target: <1.8s)
- Largest Contentful Paint (LCP): 5.8s ⚠️ (Target: <2.5s)
- Total Blocking Time (TBT): 78ms ✅ (Target: <200ms)
- Cumulative Layout Shift (CLS): 0 ✅ (Target: <0.1)

**SEO Status:**
- ✅ Prerendering enabled (all pages)
- ✅ Structured data (JSON-LD: Person, BlogPosting)
- ✅ Meta tags (Open Graph, Twitter Cards)
- ✅ Dynamic sitemap.xml generation
- ✅ robots.txt configured

### Current Challenges & Priorities

**High Priority:**
1. 🔴 Performance optimization (font loading, bundle size reduction)
2. 🔴 Complete project live URLs (missing for automation projects)
3. 🟡 Core Web Vitals improvement (FCP/LCP targets)
4. 🟡 Internal linking in blog posts
5. 🟡 Image optimization (WebP conversion, lazy loading)

**See [docs/maintenance/TODO.md](./docs/maintenance/TODO.md) for detailed task list**

---

## Project Structure

### Folder Hierarchy

```
portfolio/
├── public/                      # Static assets
│   ├── logo.svg                # Main logo
│   ├── images/                 # Project and blog images
│   │   └── og/                 # Open Graph images (1200x630)
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── components/
│   │   ├── layout/             # Layout components
│   │   │   ├── Navigation.jsx  # Header with menu
│   │   │   ├── Footer.jsx      # Footer
│   │   │   └── Layout.jsx      # Main wrapper
│   │   ├── sections/           # Home page sections
│   │   │   ├── Hero.jsx        # Hero with network background
│   │   │   ├── About.jsx       # About section
│   │   │   ├── Projects.jsx    # Projects grid
│   │   │   ├── Skills.jsx      # Skills list
│   │   │   └── Contact.jsx     # Contact form
│   │   ├── animations/         # Animation components
│   │   │   └── NetworkBackground.jsx
│   │   ├── seo/                # SEO components
│   │   │   ├── SEO.jsx         # Meta tags wrapper
│   │   │   └── StructuredData.jsx  # JSON-LD schemas
│   │   └── ui/                 # Reusable UI components
│   │       ├── CookieBanner.jsx
│   │       └── Breadcrumbs.jsx
│   │
│   ├── pages/                  # Page components
│   │   ├── Home.jsx            # Main page
│   │   ├── Blog.jsx            # Blog listing
│   │   ├── BlogPostPage.jsx    # Individual blog post
│   │   ├── ProjectPage.jsx     # Individual project page
│   │   ├── PrivacyPolicy.jsx   # Legal page
│   │   ├── TermsOfService.jsx  # Legal page
│   │   └── CookiePolicy.jsx    # Legal page
│   │
│   ├── content/
│   │   └── blog/               # Markdown blog posts
│   │       ├── README.md       # Blog content guidelines
│   │       └── *.md            # Blog posts (8+ articles)
│   │
│   ├── data/                   # Static data
│   │   ├── projects.js         # Project list (6 projects)
│   │   └── skills.js           # Skills list (categorized)
│   │
│   ├── utils/
│   │   ├── constants.js        # Site config, animation variants
│   │   └── blogLoader.js       # Markdown blog post loader
│   │
│   ├── styles/
│   │   └── index.css           # Global styles, custom animations
│   │
│   ├── App.jsx                 # Root component with routes
│   └── main.jsx                # Entry point
│
├── scripts/                    # Build scripts
│   ├── prerender.mjs           # Puppeteer prerendering
│   ├── build-with-prerender.mjs # Build + prerender orchestrator
│   ├── update-sitemap.js       # Sitemap generator
│   └── convert-to-webp.js      # Image converter
│
├── tests/                      # E2E tests (Playwright)
│   ├── home.spec.js
│   ├── blog.spec.js
│   └── navigation.spec.js
│
├── docs/                       # Documentation
│   ├── PRD.md                  # Product requirements (English for AI)
│   ├── SRS.md                  # Technical specification (English for AI)
│   ├── README.md               # Docs navigation (Polish for users)
│   ├── QUICK_START.md          # Quick start guide (Polish)
│   ├── deployment/             # Deployment guides
│   ├── seo/                    # SEO documentation
│   ├── blog/                   # Blog workflow guides
│   ├── testing/                # Testing documentation
│   └── maintenance/            # TODO lists and bugfixes
│
├── AGENTS.md                   # This file (English for AI)
├── README.md                   # Project overview (Polish for users)
├── .cursorrules                # Development guidelines (English for AI)
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── playwright.config.js        # Playwright E2E testing config
├── vercel.json                 # Vercel deployment config
└── package.json                # Dependencies and scripts
```

### Component Hierarchy

```
App (Root)
└── Layout
    ├── Navigation (sticky header)
    └── Routes
        ├── Home
        │   ├── Hero (with NetworkBackground)
        │   ├── About
        │   ├── Projects
        │   ├── Skills
        │   └── Contact
        ├── Blog (listing)
        ├── BlogPostPage (individual post)
        ├── ProjectPage (individual project)
        └── Legal Pages (Privacy, Terms, Cookies)
    └── Footer
```

### Routing Structure

```
/ → Home page (all sections)
/blog → Blog listing
/blog/:slug → Individual blog post
/projects/:slug → Individual project page
/privacy-policy → Privacy Policy (GDPR/RODO)
/terms-of-service → Terms of Service
/cookie-policy → Cookie Policy
```

---

## Development Workflow

### Setup & Installation

```bash
# Clone repository
git clone <repo-url>
cd portfolio

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev
```

### Build & Preview

```bash
# Fast build (without prerendering)
npm run build

# Full production build with prerendering (recommended)
npm run build:prerender

# Preview production build
npm run preview
```

### Testing

```bash
# Run all E2E tests
npm test

# Run with browser visible
npm test:headed

# Interactive UI mode
npm test:ui

# Specific browser
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Deployment

```bash
# Automatic deployment
git push origin main  # Triggers Vercel deploy

# Manual deployment (if needed)
vercel --prod
```

---

## Common Tasks for AI Agents

### 1. Adding a New Project

**File:** `src/data/projects.js`

```javascript
{
  id: 7,
  title: "Project Name",
  description: "Short description (2-3 sentences)",
  technologies: ["React", "Node.js", "MongoDB"],
  image: "/images/projects/project-name.png",
  github: "https://github.com/username/project",
  liveUrl: "https://project-live-url.com",  // Optional
  featured: false,  // Set true for featured projects
}
```

**Then:**
1. Add project image to `public/images/projects/`
2. Optionally create detailed project page in `src/content/projects/`
3. Update sitemap if needed

### 2. Creating a Blog Post

**File:** `src/content/blog/new-post-slug.md`

```markdown
---
title: "Post Title"
date: "2025-12-13"
excerpt: "Short description for preview (150 chars)"
image: "/images/og/blog-new-post-slug.png"
tags: ["AI", "Automation", "React"]
readTime: "8 min"
author: "Pawel Lipowczan"
---

# Post Title

Post content in markdown...
```

**Then:**
1. Create Open Graph image: `public/images/og/blog-new-post-slug.png` (1200x630)
2. Run `npm run blog:sitemap` to update sitemap
3. Post automatically appears on `/blog` page

**See:** [docs/blog/BLOG_WORKFLOW.md](./docs/blog/BLOG_WORKFLOW.md) for detailed workflow

### 3. Updating Skills

**File:** `src/data/skills.js`

Add skills to appropriate category:
- Frontend Development
- Backend Development
- Database & Tools
- Development Tools

```javascript
{
  name: "New Technology",
  icon: <SiNewTech />,  // From react-icons
  level: 85,  // 0-100
  category: "Frontend Development"
}
```

### 4. Performance Optimization

**Current issues (from TODO.md):**
- Font loading blocking render (use `font-display: swap`)
- Large bundle size (implement code splitting)
- Main thread work: 2.3s (optimize expensive computations)

**Optimization steps:**
1. Analyze bundle with Vite build stats
2. Implement React.lazy() for route-based code splitting
3. Optimize images (WebP format, lazy loading)
4. Review and optimize animations (use `transform` and `opacity` only)
5. Consider font subsetting or system fonts

**Test:** Run Lighthouse audit after changes

### 5. SEO Improvements

**Already implemented:**
- ✅ Prerendering (static HTML for all pages)
- ✅ Structured data (Person, BlogPosting schemas)
- ✅ Meta tags (OG, Twitter Cards)
- ✅ Sitemap.xml automatic generation

**To improve:**
- Internal linking between blog posts (related posts section)
- More comprehensive blog content (10-15 posts minimum)
- FAQ sections
- Image alt texts optimization

### 6. Testing New Features

**Create E2E test:** `tests/feature-name.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test('feature description', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  // Test implementation
});
```

**Run:**
```bash
npm test:ui  # Interactive mode for development
```

---

## Critical Files Map

### Where to find what

**Configuration:**
- Build settings: `vite.config.js`
- Styling config: `tailwind.config.js`, `postcss.config.js`
- Deployment: `vercel.json`
- Testing: `playwright.config.js`
- Development guidelines: `.cursorrules`

**Data Sources:**
- Projects: `src/data/projects.js`
- Skills: `src/data/skills.js`
- Blog posts: `src/content/blog/*.md`
- Site config: `src/utils/constants.js`

**Components:**
- Layout: `src/components/layout/`
- Home sections: `src/components/sections/`
- SEO: `src/components/seo/`
- Animations: `src/components/animations/`
- UI elements: `src/components/ui/`

**Pages:**
- Routes: `src/App.jsx`
- Page components: `src/pages/`

**Build Scripts:**
- Prerendering: `scripts/prerender.mjs`
- Sitemap generation: `scripts/update-sitemap.js`
- Image conversion: `scripts/convert-to-webp.js`

**Documentation:**
- Product requirements: `docs/PRD.md` (English for AI)
- Technical spec: `docs/SRS.md` (English for AI)
- User guides: `docs/README.md` and subdirectories (Polish)
- Current tasks: `docs/maintenance/TODO.md` (Polish)

---

## Commands Reference

### Development

```bash
npm run dev              # Start dev server (localhost:5173)
npm run build            # Fast build (no prerender)
npm run build:prerender  # Full build with SEO prerendering
npm run preview          # Preview production build (localhost:4173)
```

### Blog Management

```bash
npm run blog:sitemap     # Update sitemap.xml with blog posts
npm run img:convert      # Convert images to WebP format
```

### Testing

```bash
npm test                 # Run all Playwright tests
npm run test:headed      # Run with visible browser
npm run test:ui          # Interactive test UI
npm run test:debug       # Debug mode with DevTools
npm run test:chrome      # Chrome only
npm run test:firefox     # Firefox only
npm run test:webkit      # WebKit only
npm run test:mobile      # Mobile devices
npm run test:report      # Show test report
```

### Code Quality

```bash
npm run lint             # Lint code (placeholder)
npm run format           # Format code (placeholder)
```

---

## Current State & Priorities

### Completed Features ✅

**Core Functionality:**
- Responsive design (mobile, tablet, desktop)
- All home page sections (Hero, About, Projects, Skills, Contact)
- Blog system with markdown support (8+ posts)
- Legal pages (Privacy, Terms, Cookies) - GDPR/RODO compliant
- Contact form with validation (ready for backend)
- SEO optimization with prerendering
- E2E testing suite with Playwright

**SEO & Performance:**
- Static HTML prerendering (Puppeteer)
- Structured data (JSON-LD schemas)
- Meta tags (Open Graph, Twitter Cards)
- Dynamic sitemap generation
- Canonical URLs
- robots.txt configured

**Design & UX:**
- Green/teal gradient brand identity
- Glassmorphism effects
- Network background animation (Canvas API)
- Smooth scroll animations (Framer Motion)
- Mobile hamburger menu
- Hover effects and transitions

### In Progress ⚠️

1. **Performance Optimization**
   - Font loading strategy (blocking render)
   - Bundle size reduction (483KB JS)
   - Code splitting implementation

2. **Content Expansion**
   - Adding more blog posts (target: 15+)
   - Completing project live URLs
   - Creating FAQ sections

3. **SEO Enhancement**
   - Internal linking between posts
   - Related posts sections
   - Image alt text optimization

### Planned Features 📋

**High Priority:**
- FormSpree or EmailJS integration for contact form
- Core Web Vitals improvements (FCP < 1.8s, LCP < 2.5s)
- Image optimization pipeline (WebP + lazy loading)

**Medium Priority:**
- Dark/Light mode toggle
- Multi-language support (Polish/English)
- Blog search functionality
- Blog category filtering
- Newsletter signup

**Low Priority:**
- Testimonials section
- Comments system for blog
- Google Analytics integration
- Admin panel for blog management

**See [docs/maintenance/TODO.md](./docs/maintenance/TODO.md) for detailed roadmap**

---

## Documentation Guidelines

### For AI Agents (English)

When updating documentation that AI agents will read:
- Use English language
- Be concise and technical
- Include code examples
- Reference file paths
- Update AGENTS.md if project structure changes significantly

**Files in English:**
- AGENTS.md (this file)
- docs/PRD.md
- docs/SRS.md
- .cursorrules

### For Human Users (Polish)

When updating user-facing documentation:
- Use Polish language
- Be clear and beginner-friendly
- Include step-by-step instructions
- Translate technical terms where appropriate

**Files in Polish:**
- README.md
- docs/README.md
- docs/QUICK_START.md
- docs/deployment/
- docs/seo/
- docs/blog/
- docs/testing/
- docs/maintenance/

---

## Quick Reference Links

**Key Documentation:**
- [Product Requirements (PRD)](./docs/PRD.md) - Business requirements, brand identity
- [Technical Specification (SRS)](./docs/SRS.md) - Architecture, functional requirements
- [Development Guidelines (.cursorrules)](./.cursorrules) - Coding standards, patterns
- [TODO List](./docs/maintenance/TODO.md) - Current tasks and priorities

**User Guides (Polish):**
- [Documentation Index](./docs/README.md) - Navigation for all docs
- [Quick Start Guide](./docs/QUICK_START.md) - 5-minute setup
- [Deployment Guide](./docs/deployment/DEPLOYMENT.md) - Multi-platform deployment
- [Blog Workflow](./docs/blog/BLOG_WORKFLOW.md) - Creating blog posts
- [Testing Guide](./docs/testing/TESTING_QUICKSTART.md) - Running tests

**Live URLs:**
- Production: https://pawellipowczan.pl
- GitHub: https://github.com/plipowczan/portfolio

---

## Contact & Support

**Project Owner:** Pawel Lipowczan
**Email:** pawel@lipowczan.pl
**GitHub:** plipowczan

For questions about the codebase, refer to:
1. This file (AGENTS.md) for overview
2. SRS.md for technical details
3. PRD.md for business context
4. .cursorrules for development guidelines

---

**Last Updated:** 2025-12-13
**Document Version:** 1.0.0
**Project Status:** Production Ready
