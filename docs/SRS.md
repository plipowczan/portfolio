# SRS - Software Requirements Specification
## Pawel Lipowczan Portfolio Website

**Version:** 1.0
**Date:** 2025-12-13
**Status:** Reference document for deployed application
**Author:** Pawel Lipowczan
**Audience:** AI agents, developers, technical reviewers

---

## 1. Introduction

### 1.1 Document Purpose

This Software Requirements Specification (SRS) describes the detailed functional and technical requirements for the Pawel Lipowczan portfolio website, currently deployed and operating in production.

This document serves as a comprehensive technical reference for:
- AI agents working on the project
- Developers maintaining or enhancing the application
- Technical reviewers assessing the implementation

### 1.2 Scope

This document covers:
- System architecture and component structure
- Functional requirements for all application features
- Non-functional requirements (performance, SEO, accessibility)
- External integrations and APIs
- Testing approach and quality assurance
- Deployment and monitoring procedures
- Known issues and future enhancements

### 1.3 Intended Audience

**Primary audience:**
- **AI agents** - For automated code generation, refactoring, and feature development
- **Software developers** - For maintenance, bug fixes, and feature additions
- **Technical reviewers** - For code quality assessment and architectural review

**Language:** English (technical documentation for AI agents)

**For user-facing documentation in Polish, see:** [README.md](../README.md)

---

## 2. System Architecture

### 2.1 Architecture Overview

**Application Type:** Single Page Application (SPA) with server-side prerendering

**Key characteristics:**
- Client-side React application with React Router for navigation
- Build-time prerendering using Puppeteer for SEO optimization
- Static file deployment to CDN (Vercel)
- No backend server (fully static after build)
- Dynamic content from markdown files and JavaScript data structures

**Rendering Strategy:**
1. **Build time:** Puppeteer generates static HTML for all routes
2. **First load:** Browser receives pre-rendered HTML (instant FCP)
3. **Hydration:** React takes over for interactivity
4. **Navigation:** Client-side routing (no page reloads)

### 2.2 Technology Stack

**Frontend Framework:**
```
React 19.2.0
├── react-dom 19.2.0
├── react-router-dom 7.9.6
└── framer-motion 12.23.24
```

**Build System:**
```
Vite 7.2.2
├── @vitejs/plugin-react 5.1.1
└── vite-plugin-node-polyfills 0.24.0
```

**Styling:**
```
Tailwind CSS 3.4.18
├── PostCSS 8.5.6
└── Autoprefixer 10.4.22
```

**Content & SEO:**
```
react-helmet-async 2.0.5
react-markdown 10.1.0
├── rehype-raw 7.0.0
└── gray-matter 4.0.3
```

**Prerendering:**
```
puppeteer-core 24.32.1
@sparticuz/chromium 133.0.0
```

**Testing:**
```
@playwright/test 1.56.1
```

**Analytics:**
```
@vercel/analytics 1.5.0
@vercel/speed-insights 1.3.0
```

### 2.3 System Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    User Browser                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Pre-rendered HTML (from Vercel CDN)              │  │
│  │  ↓                                                  │  │
│  │  React Hydration                                   │  │
│  │  ↓                                                  │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │   React Router                                │ │  │
│  │  │   ├── / (Home)                                │ │  │
│  │  │   ├── /blog                                   │ │  │
│  │  │   ├── /blog/:slug                             │ │  │
│  │  │   ├── /projects/:slug                         │ │  │
│  │  │   └── /legal pages                            │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                          ↓
              ┌───────────────────────┐
              │   Vercel Edge Network │
              │   (Global CDN)        │
              └───────────────────────┘
                          ↓
              ┌───────────────────────┐
              │   Static Files        │
              │   ├── HTML (prerendered)
              │   ├── JS bundles      │
              │   ├── CSS             │
              │   └── Images          │
              └───────────────────────┘
```

### 2.4 Folder Structure (Detailed)

```
portfolio/
├── public/                           # Static assets served as-is
│   ├── logo.svg                      # Brand logo (SVG)
│   ├── images/
│   │   ├── og/                       # Open Graph images (1200x630)
│   │   │   ├── home.png
│   │   │   ├── blog-*.png
│   │   │   └── legal-*.png
│   │   └── projects/                 # Project screenshots
│   │       ├── project1.png
│   │       └── ...
│   ├── robots.txt                    # Search engine directives
│   └── sitemap.xml                   # Dynamic sitemap (generated)
│
├── src/
│   ├── components/
│   │   ├── layout/                   # Layout components
│   │   │   ├── Navigation.jsx        # Header, menu, mobile nav
│   │   │   ├── Footer.jsx            # Footer with links
│   │   │   └── Layout.jsx            # Main wrapper with SEO
│   │   │
│   │   ├── sections/                 # Home page sections
│   │   │   ├── Hero.jsx              # Hero with gradient text
│   │   │   ├── About.jsx             # About with stats
│   │   │   ├── Projects.jsx          # Projects grid
│   │   │   ├── Skills.jsx            # Skills list
│   │   │   └── Contact.jsx           # Contact form
│   │   │
│   │   ├── animations/               # Animation components
│   │   │   └── NetworkBackground.jsx # Canvas network animation
│   │   │
│   │   ├── seo/                      # SEO components
│   │   │   ├── SEO.jsx               # react-helmet-async wrapper
│   │   │   └── StructuredData.jsx    # JSON-LD schema generator
│   │   │
│   │   └── ui/                       # Reusable UI components
│   │       ├── CookieBanner.jsx      # GDPR cookie banner
│   │       └── Breadcrumbs.jsx       # Breadcrumb navigation
│   │
│   ├── pages/                        # Route-level components
│   │   ├── Home.jsx                  # Main page (all sections)
│   │   ├── Blog.jsx                  # Blog listing
│   │   ├── BlogPostPage.jsx          # Individual blog post
│   │   ├── ProjectPage.jsx           # Individual project
│   │   ├── PrivacyPolicy.jsx         # GDPR/RODO privacy policy
│   │   ├── TermsOfService.jsx        # Terms of service
│   │   └── CookiePolicy.jsx          # Cookie policy
│   │
│   ├── content/
│   │   └── blog/                     # Markdown blog posts
│   │       ├── README.md             # Blog authoring guide
│   │       ├── react-performance.md
│   │       ├── modern-css.md
│   │       └── ... (8+ posts)
│   │
│   ├── data/                         # Static data structures
│   │   ├── projects.js               # Project list (6 projects)
│   │   └── skills.js                 # Skills by category
│   │
│   ├── utils/                        # Utility functions
│   │   ├── constants.js              # Site config, animation variants
│   │   └── blogLoader.js             # Markdown file loader
│   │
│   ├── styles/
│   │   └── index.css                 # Global CSS, custom animations
│   │
│   ├── App.jsx                       # Root component, route definitions
│   └── main.jsx                      # Entry point, providers
│
├── scripts/                          # Build and utility scripts
│   ├── prerender.mjs                 # Puppeteer prerendering
│   ├── build-with-prerender.mjs      # Build orchestration
│   ├── update-sitemap.js             # Sitemap generator
│   └── convert-to-webp.js            # Image optimization
│
├── tests/                            # End-to-end tests (Playwright)
│   ├── home.spec.js                  # Home page tests
│   ├── blog.spec.js                  # Blog tests
│   └── navigation.spec.js            # Navigation tests
│
├── docs/                             # Documentation
│   ├── PRD.md                        # Product Requirements (English)
│   ├── SRS.md                        # This file (English)
│   └── ... (user docs in Polish)
│
├── AGENTS.md                         # AI agent guide (English)
├── README.md                         # Project overview (Polish)
├── .cursorrules                      # Development guidelines (English)
│
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── playwright.config.js              # Playwright E2E test config
├── vercel.json                       # Vercel deployment config
└── package.json                      # Dependencies and scripts
```

### 2.5 Data Flow

```
1. BUILD TIME (Local/CI)
   ├── Vite builds React app → dist/
   ├── Puppeteer prerender script:
   │   ├── Starts local server
   │   ├── Opens each route
   │   ├── Waits for full render
   │   └── Saves HTML to dist/*/index.html
   └── Deploy dist/ to Vercel

2. RUNTIME (User Browser)
   ├── Request: https://pawellipowczan.pl/
   ├── Vercel CDN returns pre-rendered HTML
   ├── Browser displays content (FCP)
   ├── React hydrates (adds interactivity)
   ├── User clicks link → React Router handles navigation
   └── No full page reload (SPA behavior)

3. DATA SOURCES (Static)
   ├── Projects: src/data/projects.js (imported at build)
   ├── Skills: src/data/skills.js (imported at build)
   ├── Blog Posts: src/content/blog/*.md (loaded via import.meta.glob)
   └── Constants: src/utils/constants.js (imported at build)
```

### 2.6 Component Hierarchy

```
<App>
  └─ <Layout>
      ├─ <SEO> (react-helmet-async)
      ├─ <StructuredData> (JSON-LD)
      ├─ <Navigation>
      │   ├─ Logo
      │   ├─ Desktop Menu
      │   └─ Mobile Menu (hamburger)
      ├─ <Routes>
      │   ├─ <Home>
      │   │   ├─ <Hero>
      │   │   │   └─ <NetworkBackground> (Canvas)
      │   │   ├─ <About> (stats, CV button)
      │   │   ├─ <Projects> (grid of project cards)
      │   │   ├─ <Skills> (categorized list)
      │   │   └─ <Contact> (form with validation)
      │   ├─ <Blog> (post listing)
      │   ├─ <BlogPostPage> (markdown rendering)
      │   ├─ <ProjectPage> (project details)
      │   └─ Legal Pages (Privacy, Terms, Cookies)
      ├─ <Footer>
      │   ├─ Links
      │   ├─ Social media
      │   └─ Legal links
      └─ <CookieBanner> (GDPR consent)
```

---

## 3. Functional Requirements

### 3.1 Navigation Component

**File:** `src/components/layout/Navigation.jsx`

**Functional Requirements:**

FR-NAV-001: **Sticky Header**
- Navigation must remain fixed at top of viewport during scroll
- Background must have semi-transparent backdrop blur effect
- Must add shadow when scrolled past 50px

FR-NAV-002: **Desktop Menu**
- Display horizontal menu on screens > 1024px
- Menu items: Home, About, Projects, Skills, Blog, Contact
- Clicking menu item must smooth-scroll to section (homepage) or navigate to page
- Active section must be highlighted during scroll

FR-NAV-003: **Mobile Menu**
- Display hamburger icon on screens ≤ 1024px
- Clicking hamburger opens full-screen overlay menu
- Menu must animate in from right
- Clicking menu item closes mobile menu
- Clicking outside menu closes it

FR-NAV-004: **Logo**
- Logo must link to homepage (/)
- Logo must be visible on all pages
- Logo must be same SVG as brand identity

**Implementation Details:**
- Uses `useState` for mobile menu open/close state
- Uses `useEffect` for scroll detection and active section highlighting
- Smooth scroll implemented with `element.scrollIntoView({ behavior: 'smooth' })`
- Active section detected by comparing `window.scrollY` with section `offsetTop`

---

### 3.2 Hero Section

**File:** `src/components/sections/Hero.jsx`

**Functional Requirements:**

FR-HERO-001: **Full Viewport Height**
- Section must be 100vh (minus navigation height)
- Content must be vertically and horizontally centered

FR-HERO-002: **Animated Gradient Text**
- Main heading: "PAWEL LIPOWCZAN" with gradient text effect
- Gradient colors: green (#00ff9d) to cyan (#00b8ff)
- Text must have glow animation on hover

FR-HERO-003: **Subtitle**
- Display "YOUR TECH GUIDE" below main heading
- Smaller font size, uppercase
- Light gray color

FR-HERO-004: **Logo with Glow**
- Display logo above heading
- Logo must have pulsating glow animation (0-10px green shadow)
- Animation duration: 2s, infinite

FR-HERO-005: **Network Background Animation**
- Canvas-based particle system
- Particles connected by lines when distance < 120px
- Particles respond to mouse position (repel effect)
- Animation must be 60fps smooth
- Must be responsive (resize with viewport)

FR-HERO-006: **CTA Buttons**
- Two buttons: "View Projects" and "Contact Me"
- Buttons scroll to respective sections
- Hover effect: scale(1.05) + green shadow

FR-HERO-007: **Scroll Indicator**
- Display scroll down arrow icon at bottom
- Animated bounce effect
- Clicking scrolls to About section

**Implementation:**
- NetworkBackground component uses HTML5 Canvas API
- Particle positions updated every frame using `requestAnimationFrame`
- Mouse tracking with `mousemove` event listener
- Particles are objects with x, y, vx, vy properties
- Lines drawn using canvas `lineTo()` with gradient stroke

---

### 3.3 About Section

**File:** `src/components/sections/About.jsx`

**Functional Requirements:**

FR-ABOUT-001: **Personal Introduction**
- 2-3 paragraphs of bio text
- Content must be editable directly in component
- Text must be readable (white/light gray on dark background)

FR-ABOUT-002: **Animated Statistics**
- Display 4 key statistics:
  - Years of experience (5+)
  - Projects completed (50+)
  - Happy clients (30+)
  - Articles written (100+)
- Numbers must animate from 0 to target value when section enters viewport
- Animation duration: 2 seconds
- Use easing function for smooth animation

FR-ABOUT-003: **Download CV Button**
- Button labeled "Download CV" or "Pobierz CV"
- Links to PDF file in `/public` folder
- Opens in new tab (`target="_blank"`)
- Hover effect: green glow + scale

FR-ABOUT-004: **Gradient Decorative Elements**
- Background decorative elements with blur effects
- Positioned absolutely, do not affect layout
- Green/cyan gradient colors

**Implementation:**
- Statistics animation uses Framer Motion `useInView` hook
- Counter animation implemented with `motion.span` and `animate` prop
- IntersectionObserver triggers animation when section is 50% visible
- CV file path: `/public/cv.pdf` (to be added by user)

---

### 3.4 Projects Section

**File:** `src/components/sections/Projects.jsx`
**Data:** `src/data/projects.js`

**Functional Requirements:**

FR-PROJ-001: **Project Grid Layout**
- Responsive grid:
  - Mobile (< 640px): 1 column
  - Tablet (640px - 1024px): 2 columns
  - Desktop (> 1024px): 3 columns
- Grid gap: 2rem

FR-PROJ-002: **Project Card Structure**
Each card must display:
- Project image (aspect ratio 16:9)
- Project title (H3 heading)
- Short description (2-3 sentences)
- Technology badges (pills with tech names)
- GitHub link (if available)
- Live demo link (if available)

FR-PROJ-003: **Hover Effects**
- Card lifts on hover (`translateY(-10px)`)
- Green glow shadow appears
- Transition duration: 300ms
- Cursor changes to pointer

FR-PROJ-004: **Technology Badges**
- Each technology displayed as pill badge
- Green background with semi-transparency
- Badges wrap to multiple lines if needed
- Font size: small (0.875rem)

FR-PROJ-005: **External Links**
- GitHub and Live Demo buttons at bottom of card
- Icons from react-icons (FiGithub, FiExternalLink)
- Links open in new tab
- Buttons have hover effect (scale, color change)

FR-PROJ-006: **Featured Projects**
- Projects with `featured: true` displayed first
- Featured projects have special badge or styling (optional)

FR-PROJ-007: **View More Button**
- "View More on GitHub" button below grid
- Links to GitHub profile
- Opens in new tab

**Data Structure (projects.js):**
```javascript
{
  id: number,
  title: string,
  description: string,
  technologies: string[],
  image: string,  // path in /public/images/
  github: string,  // GitHub URL
  liveUrl?: string,  // Live demo URL (optional)
  featured?: boolean  // Featured project flag
}
```

**Implementation:**
- Project list imported from `src/data/projects.js`
- Framer Motion `stagger` animation for cards entering viewport
- Cards use `motion.div` with `whileHover` for lift effect
- Image lazy loading with `loading="lazy"` attribute

---

### 3.5 Skills Section

**File:** `src/components/sections/Skills.jsx`
**Data:** `src/data/skills.js`

**Functional Requirements:**

FR-SKILL-001: **Category Organization**
Skills must be organized into categories:
- Frontend Development
- Backend Development
- Database & Tools
- Development Tools
- Other (if needed)

FR-SKILL-002: **Skill Display**
Each skill displays:
- Skill name
- Icon (from react-icons)
- Optional: Proficiency level (0-100)
- Optional: Progress bar visualization

FR-SKILL-003: **Grid Layout**
- Responsive grid within each category
- Mobile: 2 columns
- Tablet: 3 columns
- Desktop: 4 columns

FR-SKILL-004: **Icons**
- Use react-icons (Simple Icons: SiReact, SiJavascript, etc.)
- Icon size: 2rem (32px)
- Icon color: Green (#00ff9d) on dark background

FR-SKILL-005: **Animated Entrance**
- Skills fade in and slide up when section enters viewport
- Stagger animation (each skill animates sequentially)
- Uses Framer Motion `variants` with `staggerChildren`

FR-SKILL-006: **Hover Effect**
- Skill cards scale slightly on hover (scale(1.05))
- Icon color intensifies
- Card background lightens

**Data Structure (skills.js):**
```javascript
{
  name: string,  // "React"
  icon: JSX.Element,  // <SiReact />
  level?: number,  // 0-100 (optional)
  category: string  // "Frontend Development"
}
```

**Implementation:**
- Skills grouped by category using `reduce()` or `filter()`
- Each category rendered as separate section
- Framer Motion `motion.div` with `initial`, `whileInView`, `viewport` props
- `staggerChildren: 0.1` for sequential animation

---

### 3.6 Contact Section

**File:** `src/components/sections/Contact.jsx`

**Functional Requirements:**

FR-CONTACT-001: **Contact Form Fields**
- Name (required, min 2 characters)
- Email (required, must be valid email format)
- Subject (optional)
- Message (required, min 10 characters)

FR-CONTACT-002: **Form Validation**
- Real-time validation on blur (field loses focus)
- Display error messages below invalid fields
- Error message color: red
- Prevent submission if validation fails

FR-CONTACT-003: **Validation Rules**
- Name: Required, min 2 chars, max 100 chars
- Email: Required, valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Message: Required, min 10 chars, max 1000 chars
- Subject: Optional, max 200 chars

FR-CONTACT-004: **Form Submission**
- Submit button disabled if validation fails
- On submit: Show loading state (spinner + "Sending..." text)
- After submission: Show success or error message
- Success: Form resets, show green success message
- Error: Show red error message, keep form data

FR-CONTACT-005: **Form State Management**
- Use `useState` for form data (name, email, subject, message)
- Use `useState` for errors object
- Use `useState` for submission status (idle, loading, success, error)

FR-CONTACT-006: **Contact Information Display**
- Display email address: `pawel@lipowczan.pl`
- Email must be clickable (`mailto:` link)
- Display social media links (GitHub, LinkedIn, Twitter)
- Social icons from react-icons

FR-CONTACT-007: **Form Backend Integration (Pending)**
- Form ready for FormSpree or EmailJS integration
- Form action can be set to external service endpoint
- Alternative: Custom API endpoint

**Current Implementation:**
- Form validation implemented with custom hooks
- No backend yet (submissions not sent anywhere)
- Form displays validation errors correctly
- Ready for backend integration (just add action URL or API call)

---

### 3.7 Blog System

**Files:**
- `src/pages/Blog.jsx` - Blog listing page
- `src/pages/BlogPostPage.jsx` - Individual post page
- `src/content/blog/*.md` - Blog post markdown files
- `src/utils/blogLoader.js` - Blog post loader utility

**Functional Requirements:**

FR-BLOG-001: **Blog Listing Page (/blog)**
- Display all blog posts in reverse chronological order (newest first)
- Grid layout:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
- Each post card displays:
  - Featured image (16:9 aspect ratio)
  - Title
  - Excerpt (first 150 characters)
  - Publication date (formatted: "13 grudnia 2025")
  - Reading time ("8 min read")
  - Category tags (pills)

FR-BLOG-002: **Post Card Interaction**
- Entire card clickable (navigates to `/blog/:slug`)
- Hover effect: lift + green shadow
- Image has slight zoom effect on hover

FR-BLOG-003: **Individual Post Page (/blog/:slug)**
- Display full post content from markdown file
- Components:
  - Breadcrumbs (Home / Blog / Post Title)
  - Featured image (full width)
  - Post title (H1)
  - Post metadata (date, author, reading time)
  - Tags
  - Full markdown content (rendered as HTML)
  - Back to blog button

FR-BLOG-004: **Markdown Rendering**
- Support standard markdown:
  - Headings (H1-H6)
  - Paragraphs
  - Lists (ordered, unordered)
  - Links
  - Images
  - Code blocks (inline and fenced)
  - Blockquotes
  - Bold, italic, strikethrough
- Allow HTML in markdown (`rehype-raw`)
- Syntax highlighting for code blocks (with language tags)

FR-BLOG-005: **Frontmatter Parsing**
Each blog post markdown file must have frontmatter:
```yaml
---
title: "Post Title"
date: "2025-12-13"
excerpt: "Short description"
image: "/images/og/blog-slug.png"
tags: ["AI", "Automation"]
readTime: "8 min"
author: "Pawel Lipowczan"
---
```

FR-BLOG-006: **Dynamic Post Loading**
- Blog posts loaded using Vite's `import.meta.glob()`
- Posts auto-discovered from `src/content/blog/*.md`
- Files starting with `_` or `README.md` are ignored
- Posts parsed with `gray-matter` library

FR-BLOG-007: **SEO for Blog Posts**
- Each post has unique meta tags:
  - Title: Post title + " - Pawel Lipowczan"
  - Description: Post excerpt
  - OG Image: Post featured image
  - URL: Canonical URL
- Structured data (BlogPosting schema) for each post
- Breadcrumbs for navigation

FR-BLOG-008: **404 Handling**
- If blog post slug not found → display 404 message
- Provide link back to blog listing

**Implementation:**
- Blog posts: `src/content/blog/*.md`
- Loader uses `import.meta.glob('../content/blog/*.md', { eager: true })`
- Frontmatter extracted with `gray-matter`
- Content rendered with `react-markdown` + `rehype-raw`
- Slug generated from filename (remove `.md`)
- Reading time calculated from word count (average 200 wpm)

---

### 3.8 Legal Pages

**Files:**
- `src/pages/PrivacyPolicy.jsx`
- `src/pages/TermsOfService.jsx`
- `src/pages/CookiePolicy.jsx`

**Functional Requirements:**

FR-LEGAL-001: **Privacy Policy (/privacy-policy)**
Must include:
- Data collection details (what data is collected)
- Purpose of data collection
- Data storage and security
- User rights under GDPR/RODO
- Contact information for data requests
- Last updated date

FR-LEGAL-002: **Terms of Service (/terms-of-service)**
Must include:
- Website usage terms
- Content rights and intellectual property
- Liability disclaimers
- Governing law
- Contact information
- Last updated date

FR-LEGAL-003: **Cookie Policy (/cookie-policy)**
Must include:
- Types of cookies used (essential, analytics, marketing)
- Purpose of each cookie
- Third-party cookies (if any)
- How to disable cookies
- Last updated date

FR-LEGAL-004: **Common Requirements for All Legal Pages**
- Clean, readable layout
- Table of contents (jump links to sections)
- Breadcrumbs (Home / Legal Page)
- Easy navigation back to main site
- Mobile-responsive
- Print-friendly

FR-LEGAL-005: **Cookie Banner (GDPR Compliance)**
- Display cookie consent banner on first visit
- User can accept or decline cookies
- User choice stored in localStorage
- Banner doesn't appear if user already made choice
- Link to Cookie Policy in banner

**Implementation:**
- Legal content hardcoded in JSX (editable by developer)
- Content in Polish (primary language)
- English version can be added (future enhancement)
- Cookie banner: `src/components/ui/CookieBanner.jsx`
- Cookie choice stored: `localStorage.getItem('cookieConsent')`

---

## 4. Non-Functional Requirements

### 4.1 Performance

**NFR-PERF-001: Core Web Vitals Targets**

Current vs Target:
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| First Contentful Paint (FCP) | 5.3s | < 1.8s | ❌ Needs optimization |
| Largest Contentful Paint (LCP) | 5.8s | < 2.5s | ❌ Needs optimization |
| Total Blocking Time (TBT) | 78ms | < 200ms | ✅ Achieved |
| Cumulative Layout Shift (CLS) | 0 | < 0.1 | ✅ Achieved |
| Time to Interactive (TTI) | 5.8s | < 3.5s | ⚠️ Needs improvement |
| Speed Index | 5.5s | < 3.0s | ⚠️ Needs improvement |

**NFR-PERF-002: Bundle Size**
- Total JS bundle: 483.84 KB (gzip: 155.43 KB)
- Target: < 300 KB (ungzipped)
- CSS bundle: 26.86 KB (gzip: 4.97 KB) ✅

**NFR-PERF-003: Optimization Strategies**
- ✅ Prerendering (static HTML)
- ✅ Image optimization (responsive sizes)
- ⏳ Code splitting (implement React.lazy())
- ⏳ Font loading optimization (font-display: swap)
- ⏳ Tree shaking (ensure unused code removed)
- ✅ CSS purging (Tailwind PurgeCSS)
- ✅ Animations optimized (transform/opacity only)

**NFR-PERF-004: Caching Strategy**
- Static assets: Cache-Control headers set by Vercel
- HTML: No-cache (always fetch latest)
- JS/CSS: Immutable (filename hashing)
- Images: Long cache (1 year)

### 4.2 SEO

**NFR-SEO-001: Meta Tags**
All pages must have:
- ✅ Unique `<title>` tag (< 60 characters)
- ✅ Meta description (< 160 characters)
- ✅ Open Graph tags (og:title, og:description, og:image, og:url)
- ✅ Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- ✅ Canonical URL (`<link rel="canonical">`)
- ✅ Language tag (`<html lang="pl">`)

**NFR-SEO-002: Structured Data (JSON-LD)**
- ✅ Person schema on homepage
- ✅ BlogPosting schema on blog posts
- ✅ WebSite schema (search action)
- ⏳ FAQ schema (future enhancement)
- ⏳ Organization schema (future enhancement)

**NFR-SEO-003: Sitemap & Robots**
- ✅ sitemap.xml generated dynamically
- ✅ robots.txt configured
- ✅ All pages indexed (no noindex tags)
- ✅ Clean URL structure (no query parameters)

**NFR-SEO-004: Semantic HTML**
- ✅ Proper heading hierarchy (H1 → H2 → H3)
- ✅ Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ✅ Alt text for all images
- ✅ Descriptive link text (avoid "click here")

**NFR-SEO-005: Prerendering**
- ✅ All routes prerendered at build time
- ✅ Puppeteer waits for `networkidle0` + 2s
- ✅ Full HTML content in source (not empty `<div id="root">`)
- ✅ Social media crawlers see full content

### 4.3 Accessibility (A11y)

**NFR-A11Y-001: WCAG 2.1 Level AA Compliance**
Target: Level AA compliance

Current implementation:
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators visible
- ✅ Color contrast ratios > 4.5:1 (text)
- ✅ Color contrast ratios > 3:1 (UI components)
- ✅ Alt text for images
- ✅ ARIA labels where needed
- ✅ Skip to content link
- ✅ Semantic HTML structure
- ⏳ Screen reader testing (to be completed)
- ⏳ Form error announcements (to be improved)

**NFR-A11Y-002: Keyboard Navigation**
- All interactive elements accessible via Tab
- Logical tab order (top to bottom, left to right)
- Mobile menu closable with Escape key
- Focus trapped in modal/overlay when open

**NFR-A11Y-003: Screen Reader Support**
- Descriptive labels for form inputs
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Proper heading structure for navigation

### 4.4 Responsiveness

**NFR-RESP-001: Breakpoints**
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md, lg)
- Desktop: > 1024px (xl, 2xl)

**NFR-RESP-002: Mobile-First Approach**
- Base styles for mobile
- Media queries add styles for larger screens
- Touch-friendly tap targets (min 44x44px)

**NFR-RESP-003: Tested Devices**
- ✅ iPhone SE, 12, 13, 14
- ✅ iPad, iPad Pro
- ✅ Desktop (1920x1080, 2560x1440)
- ✅ Various Android devices (Chrome DevTools)

**NFR-RESP-004: Responsive Images**
- Images scale with container
- Aspect ratios preserved
- Responsive sizing with `srcset` (future enhancement)

### 4.5 Browser Support

**NFR-BROWSER-001: Supported Browsers**
- ✅ Chrome/Edge (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ❌ Internet Explorer (not supported)

**NFR-BROWSER-002: Polyfills**
- Modern JavaScript features used (ES6+)
- Vite handles transpilation for supported browsers
- No additional polyfills needed

---

## 5. External Integrations

### 5.1 Vercel (Hosting & CDN)

**Integration:** Hosting platform, CDN, analytics

**Configuration:**
- Build command: `npm run build:prerender`
- Output directory: `dist`
- Node version: 20.x
- Environment variables: None currently

**Features Used:**
- ✅ Automatic deployments (git push to main)
- ✅ Preview deployments (pull requests)
- ✅ Vercel Analytics (@vercel/analytics)
- ✅ Speed Insights (@vercel/speed-insights)
- ✅ Edge Network (global CDN)
- ✅ HTTPS/SSL (automatic)

**Configuration File:** `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 5.2 FormSpree (Contact Form) - Pending

**Status:** Not yet integrated (form ready)

**Purpose:** Handle contact form submissions

**Integration steps:**
1. Sign up at formspree.io
2. Get form endpoint ID
3. Update Contact.jsx:
   ```jsx
   <form action="https://formspree.io/f/{FORM_ID}" method="POST">
   ```
4. Test form submission

**Alternative:** EmailJS or custom backend API

### 5.3 Google Analytics - Optional

**Status:** Not integrated

**Purpose:** Track visitor analytics

**Integration:** Add Google Analytics 4 tag

### 5.4 Anthropic API / OpenAI API

**Status:** Available (dependencies installed)

**Purpose:** AI-assisted content generation for blog posts

**Dependencies:**
- @anthropic-ai/sdk 0.69.0
- openai 6.9.0

**Usage:** Can be used in scripts to generate blog post drafts

---

## 6. Testing

### 6.1 End-to-End Testing (Playwright)

**Test Files:**
- `tests/home.spec.js`
- `tests/blog.spec.js`
- `tests/navigation.spec.js`

**Test Coverage:**
- ✅ Navigation menu (desktop and mobile)
- ✅ Smooth scrolling to sections
- ✅ Form validation
- ✅ Blog post listing
- ✅ Blog post page rendering
- ✅ Responsive design (mobile viewports)
- ✅ Accessibility (basic checks)

**Browsers Tested:**
- Chromium (headless)
- Firefox (headless)
- WebKit (headless)

**Commands:**
```bash
npm test              # All tests
npm run test:headed   # Visible browser
npm run test:ui       # Interactive mode
```

**Configuration:** `playwright.config.js`
- 3 browsers configured
- Mobile viewports included
- Screenshots on failure
- Test timeout: 30s

### 6.2 Manual Testing Checklist

**Before deployment:**
- [ ] All navigation links work
- [ ] Smooth scroll functions correctly
- [ ] Mobile menu opens/closes
- [ ] Contact form validation works
- [ ] Blog posts load and render
- [ ] Images load (or show placeholders)
- [ ] Legal pages accessible
- [ ] External links open in new tabs
- [ ] Keyboard navigation works
- [ ] No console errors
- [ ] Performance acceptable (Lighthouse > 70)

**Testing Tools:**
- Lighthouse (Chrome DevTools)
- Google Rich Results Test
- Mobile-Friendly Test
- WAVE (accessibility)
- axe DevTools

---

## 7. Deployment & Monitoring

### 7.1 Deployment Process

**Automatic Deployment (Recommended):**
1. Push to main branch: `git push origin main`
2. Vercel detects push and triggers build
3. Build runs: `npm run build:prerender`
4. Prerender script generates static HTML
5. Deploy to Vercel Edge Network
6. Purge CDN cache
7. Deployment live (~2-3 minutes)

**Manual Deployment:**
```bash
npm run build:prerender
vercel --prod
```

**Build Timeline:**
- Vite build: ~4 seconds
- Prerendering (9+ pages): ~2 minutes
- Total: ~2-3 minutes

### 7.2 Environment Variables

**Vercel Dashboard:**
- `NODE_VERSION`: 20.x (set in dashboard)
- Future: API keys if integrations added

**Local (.env - not committed):**
- Not currently used
- Add if API keys needed

### 7.3 Monitoring

**Active:**
- Vercel Analytics (pageviews, visitors)
- Vercel Speed Insights (Core Web Vitals)
- Vercel deployment logs

**To Implement:**
- Google Search Console (SEO monitoring)
- Error tracking (Sentry - optional)
- Uptime monitoring (Uptime Robot - optional)

### 7.4 Maintenance Tasks

**Weekly:**
- Check Vercel logs for errors
- Review analytics

**Monthly:**
- Update dependencies (`npm update`)
- Security patches (`npm audit fix`)
- Performance audit (Lighthouse)

**Quarterly:**
- Content refresh (update About section)
- New blog posts
- Review and update TODO list
- Feature additions

---

## 8. Known Issues & TODOs

### 8.1 Critical Issues

**ISSUE-001: Performance - Slow FCP/LCP**
- **Current:** FCP 5.3s, LCP 5.8s
- **Target:** FCP < 1.8s, LCP < 2.5s
- **Cause:** Font loading blocking render, large bundle size
- **Solution:**
  - Implement `font-display: swap` in Google Fonts URL
  - Code splitting with React.lazy()
  - Reduce bundle size (tree shaking, remove unused deps)
  - Consider system fonts as fallback

**ISSUE-002: Missing Project Live URLs**
- **Status:** Some projects missing `liveUrl`
- **Impact:** "Visit Live Site" button disabled
- **Solution:** Add live URLs or link to templates/repositories

### 8.2 High Priority TODOs

**TODO-001: Internal Linking**
- Add "Related Posts" section at end of blog posts
- Link to similar posts by tags
- Link to portfolio from blog posts

**TODO-002: Image Optimization**
- Convert images to WebP format
- Implement lazy loading for all images
- Add `srcset` for responsive images
- Compress images (target: < 200KB per image)

**TODO-003: Form Backend**
- Integrate FormSpree or EmailJS
- Test form submissions
- Add success/error handling

### 8.3 Medium Priority

**TODO-004: SEO Enhancements**
- Add FAQ schema
- Create more blog content (target: 15+ posts)
- Implement breadcrumbs on all pages
- Add internal linking strategy

**TODO-005: Accessibility Improvements**
- Complete screen reader testing
- Add skip navigation links
- Improve form error announcements
- Test with keyboard-only navigation

**TODO-006: Content Expansion**
- Write more blog posts (weekly cadence)
- Add case studies for projects
- Create portfolio project pages

### 8.4 Low Priority

**TODO-007: Features**
- Dark/light mode toggle
- Multi-language (Polish/English)
- Blog search functionality
- Blog category filtering
- Newsletter signup
- Testimonials section

**Full TODO list:** [docs/maintenance/TODO.md](../maintenance/TODO.md)

---

## 9. Appendix

### 9.1 Configuration Files

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
```

**tailwind.config.js:**
- Custom green/teal color palette
- Custom animations
- PurgeCSS for production

**vercel.json:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 9.2 Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Fast build
npm run build:prerender        # Full build with prerender
npm run preview                # Preview build

# Blog
npm run blog:sitemap           # Update sitemap
npm run img:convert            # Convert images to WebP

# Testing
npm test                       # E2E tests
npm run test:ui                # Interactive test UI
npm run test:debug             # Debug tests

# Deployment
git push origin main           # Trigger Vercel deploy
vercel --prod                  # Manual deploy
```

### 9.3 Resource Links

**Documentation:**
- [Vite](https://vitejs.dev/)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)
- [Playwright](https://playwright.dev/)

**SEO & Performance:**
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

**Accessibility:**
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAVE](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

**Document End**

**Version:** 1.0
**Last Updated:** 2025-12-13
**Next Review:** After implementing major features from TODO.md
**Maintained by:** Pawel Lipowczan

**For AI Agents:** This document should be your primary technical reference when working on functional requirements and architecture. For business context, see [PRD.md](./PRD.md). For quick overview, see [AGENTS.md](../AGENTS.md).
