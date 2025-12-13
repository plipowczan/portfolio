# Product Requirements Document (PRD)
## Pawel Lipowczan - Portfolio Website

**Version:** 2.0
**Created:** 2024-10-21
**Last Updated:** 2025-12-13
**Status:** ✅ COMPLETED AND DEPLOYED
**Project Owner:** Pawel Lipowczan
**Audience:** AI agents, product owners, technical reviewers

---

## Executive Summary

A modern, responsive portfolio website for Pawel Lipowczan ("Your Tech Guide") showcasing professional work, technical skills, projects, and blog articles. The website features a distinctive green/teal color scheme with geometric network backgrounds and smooth animations.

**Current Status:** All planned features have been implemented and deployed to production at [pawellipowczan.pl](https://pawellipowczan.pl). The project is in maintenance and optimization phase.

---

## Goals & Objectives

### Primary Goals
1. ✅ Present professional portfolio to potential clients/employers
2. ✅ Share technical knowledge through blog articles
3. ✅ Showcase projects and technical expertise
4. ✅ Provide easy contact methods

### Success Metrics
- ⚠️ Page load time < 3 seconds (CURRENT: 5.3s - optimization in progress)
- ✅ Mobile responsive on all devices
- ✅ SEO optimized (meta tags, semantic HTML, structured data)
- ✅ 100% GDPR/RODO compliance for legal pages

**Overall Status:** 3/4 goals achieved, 1 in optimization (performance)

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

**Version:** 2.0 (Current - December 2025)

### Frontend Framework

- **React 19.2.0** with Hooks
- **Vite 7.2.2** for build tooling and development server

### Styling & UI

- **Tailwind CSS 3.4.18** for utility-first styling
- **Framer Motion 12.23.24** for animations
- **PostCSS 8.5.6** + **Autoprefixer 10.4.22**
- Custom CSS for advanced gradient effects

### Routing & Navigation

- **React Router 7.9.6** for client-side routing
- Browser routing (BrowserRouter) for clean URLs

### Content & SEO

- **React Helmet Async 2.0.5** for dynamic SEO meta tags
- **React Markdown 10.1.0** for blog content rendering
- **gray-matter 4.0.3** for markdown frontmatter parsing
- **React Icons 5.5.0** for icon components

### Prerendering & Performance

- **Puppeteer Core 24.32.1** for SEO prerendering
- **@sparticuz/chromium 133.0.0** for Vercel-compatible prerendering
- **Vercel Analytics 1.5.0** for visitor analytics
- **Vercel Speed Insights 1.3.0** for Core Web Vitals monitoring

### Testing

- **Playwright 1.56.1** for end-to-end testing

### AI Integration (Optional)

- **@anthropic-ai/sdk 0.69.0** for AI-assisted content generation
- **openai 6.9.0** for OpenAI API integration

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

**Note:** Detailed technical requirements and implementation specifications have been moved to [SRS.md](./SRS.md) for AI agents and developers. This section provides high-level feature overview only.

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

**Overall Status:** All phases completed ✅ (October-November 2025)

### Phase 1: Setup & Documentation ✅ (October 2025)

- [x] Create PRD
- [x] Create .cursorrules
- [x] Initialize project structure

### Phase 2: Foundation ✅ (Week 1)

- [x] Initialize Vite + React project
- [x] Install dependencies
- [x] Configure Tailwind CSS
- [x] Set up routing
- [x] Create base layout and navigation

### Phase 3: Core Pages ✅ (Week 1-2)

- [x] Build Hero section
- [x] Implement About section
- [x] Create Projects section
- [x] Build Skills section
- [x] Add Contact form

### Phase 4: Blog System ✅ (Week 2)

- [x] Blog listing page
- [x] Individual blog post pages
- [x] Markdown rendering
- [x] SEO optimization for blog

### Phase 5: Legal & Polish ✅ (Week 2-3)

- [x] Legal pages (Privacy, Terms, Cookies)
- [x] Add animations and transitions
- [x] Responsive design testing
- [x] Performance optimization (ongoing)
- [x] SEO audit and fixes

### Phase 6: Testing & Deployment ✅ (Week 3)

- [x] Cross-browser testing
- [x] Mobile device testing
- [x] Accessibility audit
- [x] Performance testing
- [x] Deploy to hosting (Vercel)
- [x] Configure custom domain

### Phase 7: Advanced SEO ✅ (November 2025)

- [x] Implement prerendering with Puppeteer
- [x] Add structured data (JSON-LD schemas)
- [x] Implement E2E testing with Playwright
- [x] Configure Vercel Analytics
- [x] Dynamic sitemap generation
- [x] Open Graph images for all pages

**Project Status:** Deployed and operational. Currently in maintenance and optimization phase.

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

## Decisions & Assumptions

### Confirmed Decisions
1. ✅ Color scheme: Green/teal gradient confirmed and implemented
2. ✅ Logo usage: Centered in header, SVG format
3. ✅ Contact form backend: FormSpree (ready for integration, not yet connected)
4. ✅ Hosting platform: Vercel with automatic deployments
5. ✅ Blog content: Markdown files with gray-matter frontmatter
6. ✅ Multi-language: Polish only (English for technical documentation)

### Current Implementation
- **Language:** Polish for user-facing content, English for AI/technical docs
- **Architecture:** Static SPA with build-time prerendering
- **Blog system:** File-based markdown (8+ articles published)
- **Contact form:** Client-side validation ready, backend integration pending
- **Authentication:** Not required (public portfolio site)
- **CMS:** Not implemented (file-based content management)
- **Deployment:** Automated via Vercel (push to main branch)

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

**Last Updated:** 2025-12-13
**Next Review:** Quarterly (March 2026)
**Status:** Completed and deployed

**For detailed technical specifications, see:** [SRS.md](./SRS.md)
**For AI agents quick reference, see:** [AGENTS.md](../AGENTS.md)

