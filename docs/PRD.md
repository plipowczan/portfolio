# Product Requirements Document (PRD)
## Pawel Lipowczan - Portfolio Website

**Version:** 1.0  
**Date:** October 21, 2025  
**Project Owner:** Pawel Lipowczan

---

## Executive Summary

A modern, responsive portfolio website for Pawel Lipowczan ("Your Tech Guide") showcasing professional work, technical skills, projects, and blog articles. The website will feature a distinctive green/teal color scheme with geometric network backgrounds and smooth animations.

---

## Goals & Objectives

### Primary Goals
1. Present professional portfolio to potential clients/employers
2. Share technical knowledge through blog articles
3. Showcase projects and technical expertise
4. Provide easy contact methods

### Success Metrics
- Page load time < 3 seconds
- Mobile responsive on all devices
- SEO optimized (meta tags, semantic HTML)
- 100% GDPR/RODO compliance for legal pages

---

## Brand Identity

### Logo
- **Design:** Green dashed circle with `</>` code icon
- **Usage:** Header, favicon, social media previews
- **Format:** SVG for scalability

### Color Palette
- **Primary:** Teal/Green/Cyan gradients (`#00ff9d`, `#00b8ff`, `#00ffa3`)
- **Background:** Dark navy to black (`#0a0e1a`, `#050810`)
- **Accent:** Bright green (`#00ff9d`)
- **Text:** White/light gray (`#ffffff`, `#e5e7eb`)

### Typography
- **Headings:** Bold, modern sans-serif (Inter, Poppins)
- **Body:** Clean, readable sans-serif (Inter)
- **Code:** Monospace font (Fira Code, JetBrains Mono)

### Visual Style
- Geometric network/mesh backgrounds
- Gradient text effects on headings
- Glassmorphism cards with backdrop blur
- Smooth scroll animations
- Hover effects with scale/glow transitions

---

## Technical Stack

### Frontend Framework
- **React 18** with Hooks
- **Vite** for build tooling and development server

### Styling & UI
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations
- Custom CSS for advanced gradient effects

### Routing & Navigation
- **React Router v6** for client-side routing
- Hash-based routing for GitHub Pages compatibility (if needed)

### Additional Libraries
- **React Helmet** for SEO meta tags
- **React Hook Form** for contact form validation
- **React Markdown** for blog content rendering
- **React Icons** for icon components

---

## Page Structure & Features

### 1. Home Page
**Sections:**
- Hero
- About
- Projects
- Skills
- Contact
- Footer

### 2. Blog Section
**Features:**
- Blog listing page with article cards
- Individual blog post pages
- SEO optimized meta tags
- Reading time estimates
- Categories/tags
- Social share buttons

### 3. Legal Pages
- Privacy Policy (Polityka Prywatności)
- Terms of Service (Regulamin)
- Cookie Policy (Polityka Ciasteczek)

---

## Detailed Feature Requirements

### Hero Section
**Must Have:**
- Full viewport height
- Animated gradient heading: "PAWEL LIPOWCZAN"
- Subtitle: "YOUR TECH GUIDE"
- Logo centered above heading
- Geometric network background animation
- CTA buttons: "View Projects", "Contact Me"
- Smooth scroll to next section

**Visual Reference:** Similar to Tech News Weekly Summary design

### About Section
**Must Have:**
- Professional photo or avatar
- 2-3 paragraph introduction
- Key highlights/statistics (animated counters)
- "Download CV" button
- Social media links

### Projects Section
**Must Have:**
- Grid layout (3 columns desktop, 2 tablet, 1 mobile)
- Project cards with:
  - Project thumbnail/screenshot
  - Project title
  - Short description
  - Tech stack badges
  - "View Demo" and "GitHub" links
  - Hover effects (lift, glow)

**Minimum 3-6 sample projects**

### Skills Section
**Must Have:**
- Technology categories (Frontend, Backend, Tools, etc.)
- Icon grid or tag cloud
- Animated entrance on scroll
- Skill levels or expertise indicators

**Technologies to highlight:**
- React, JavaScript, TypeScript
- Node.js, Python
- Tailwind CSS, Framer Motion
- Git, GitHub
- Other relevant technologies

### Contact Section
**Must Have:**
- Contact form with fields:
  - Name (required)
  - Email (required, validated)
  - Subject (optional)
  - Message (required, min 10 chars)
- Form validation with error messages
- Success/error notifications
- Email: display contact email
- Social media links
- Location (optional)

**Form Handling Options:**
- FormSpree, EmailJS, or custom backend API

### Blog Section
**Must Have:**
- Blog listing page at `/blog`
- Article preview cards with:
  - Featured image
  - Title
  - Excerpt (150 chars)
  - Publication date
  - Reading time
  - Category tags
- Individual post pages at `/blog/:slug`
- Markdown rendering for post content
- Syntax highlighting for code blocks
- SEO meta tags per article
- Previous/Next navigation

**Sample Articles:**
- Minimum 3 placeholder articles for demo
- Content can be markdown files or JSON data

### Navigation
**Must Have:**
- Fixed header on scroll
- Logo on left
- Menu items: Home, About, Projects, Skills, Blog, Contact
- Mobile hamburger menu
- Smooth scroll to sections
- Active section highlighting
- Semi-transparent backdrop blur

### Footer
**Must Have:**
- Copyright notice
- Social media links
- Links to legal pages
- "Made with React + Vite" credit
- Green accent line/border at top

### Legal Pages
**Must Have:**
- Privacy Policy (GDPR/RODO compliant)
  - Data collection details
  - Cookie usage
  - User rights
  - Contact for data requests
- Terms of Service
  - Website usage terms
  - Content rights
  - Liability disclaimers
- Cookie Policy
  - Types of cookies used
  - Purpose of each cookie
  - How to disable cookies

**All legal pages:**
- Clean, readable layout
- Table of contents
- Last updated date
- Easy navigation back to main site

---

## Technical Requirements

### Responsiveness (RWD)
- **Mobile-first approach**
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Touch-friendly interactions
- Hamburger menu for mobile
- Optimized images per device size

### Performance
**Target Metrics:**
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Lighthouse Score > 90

**Optimization Techniques:**
- Image optimization (WebP format, lazy loading)
- Code splitting with React.lazy()
- Minified CSS/JS bundles
- Efficient animations (transform, opacity only)
- Caching headers configuration

### SEO Requirements
**Must Have:**
- Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Meta tags:
  - Title (unique per page)
  - Description
  - Keywords
  - Open Graph tags (Facebook)
  - Twitter Card tags
- Structured data (JSON-LD):
  - Person schema
  - WebSite schema
  - BlogPosting schema for articles
- XML sitemap (`sitemap.xml`)
- Robots.txt
- Descriptive alt text for all images
- Clean URL structure
- Proper heading hierarchy (H1, H2, H3)
- Internal linking between pages

### Accessibility (A11y)
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- ARIA labels where needed
- Sufficient color contrast ratios
- Focus indicators on interactive elements
- Skip to content link

### Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

---

## Content Requirements

### Copy/Text Content
**To be provided:**
- Personal bio/about text
- Project descriptions
- Blog article content
- Contact information

**Placeholder content acceptable for:**
- Sample projects
- Sample blog posts
- Skills list (can be generic)

### Images/Media
**Required:**
- Logo SVG
- Professional photo (optional)
- Project screenshots (3-6 images)
- Blog featured images (3+ images)
- Favicon (16x16, 32x32, 192x192)

**All images must be:**
- Optimized for web
- Multiple sizes for responsive design
- WebP format preferred

---

## Development Phases

### Phase 1: Setup & Documentation ✓
- [x] Create PRD
- [x] Create .cursorrules
- [x] Initialize project structure

### Phase 2: Foundation (Week 1)
- [ ] Initialize Vite + React project
- [ ] Install dependencies
- [ ] Configure Tailwind CSS
- [ ] Set up routing
- [ ] Create base layout and navigation

### Phase 3: Core Pages (Week 1-2)
- [ ] Build Hero section
- [ ] Implement About section
- [ ] Create Projects section
- [ ] Build Skills section
- [ ] Add Contact form

### Phase 4: Blog System (Week 2)
- [ ] Blog listing page
- [ ] Individual blog post pages
- [ ] Markdown rendering
- [ ] SEO optimization for blog

### Phase 5: Legal & Polish (Week 2-3)
- [ ] Legal pages (Privacy, Terms, Cookies)
- [ ] Add animations and transitions
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] SEO audit and fixes

### Phase 6: Testing & Deployment (Week 3)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Accessibility audit
- [ ] Performance testing
- [ ] Deploy to hosting

---

## Future Enhancements (Post-Launch)

### Phase 2 Features
- Dark/Light mode toggle
- Multi-language support (English/Polish)
- Blog search functionality
- Blog categories and filtering
- Newsletter signup
- Comments system for blog
- Portfolio project filters/sorting
- Testimonials section
- Analytics integration (Google Analytics)
- Contact form backend integration

### Phase 3 Features
- Admin panel for blog management
- CMS integration (Strapi, Sanity)
- Interactive project demos/previews
- Case studies for projects
- Video content integration
- Resume/CV page (HTML version)

---

## Deployment & Hosting

### Hosting Options
1. **Vercel** (Recommended)
   - Zero config deployment
   - Automatic HTTPS
   - Global CDN
   - Free for personal projects

2. **Netlify**
   - Easy deployment
   - Form handling
   - Custom domain support

3. **GitHub Pages**
   - Free hosting
   - Requires hash routing

### Domain
- Custom domain: `pawellipowczan.com` (or similar)
- SSL certificate (automatic with Vercel/Netlify)

### CI/CD
- Automatic deployment on git push to main branch
- Preview deployments for pull requests

---

## Maintenance & Updates

### Regular Updates
- Blog articles: Weekly/bi-weekly
- Projects: Add new work as completed
- Dependencies: Monthly security updates
- Content refresh: Quarterly review

### Monitoring
- Uptime monitoring
- Performance monitoring (Lighthouse CI)
- Error tracking (Sentry optional)
- Analytics review

---

## Legal Compliance

### GDPR/RODO Requirements
- Cookie consent banner (if using tracking cookies)
- Clear privacy policy
- Data processing transparency
- User rights information
- Contact for data requests

### Required Legal Pages
- Privacy Policy (Polityka Prywatności)
- Terms of Service (Regulamin)
- Cookie Policy (Polityka Ciasteczek)

All legal pages must be:
- Easily accessible from footer
- Written in clear language
- Updated with current date
- Compliant with EU regulations

---

## Questions & Decisions

### Pending Decisions
1. ✓ Color scheme: Green/teal confirmed
2. ✓ Logo usage: Centered in header confirmed
3. ? Contact form backend: FormSpree, EmailJS, or custom?
4. ? Hosting platform: Vercel or Netlify?
5. ? Blog content: Markdown files or CMS?
6. ? Multi-language: English only or Polish + English?

### Assumptions
- Single language version (Polish with English technical terms)
- Static site (no backend required initially)
- Blog content stored as markdown files
- Contact form uses third-party service
- No user authentication needed

---

## Appendix

### Design Inspiration
- [heyalice.app](https://heyalice.app/) - Gradient text, animations
- Tech News Weekly Summary #51 - Color scheme, background
- Modern developer portfolio trends

### Resources
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Router Documentation](https://reactrouter.com/)
- [GDPR Compliance Guide](https://gdpr.eu/)

---

**Document End**

