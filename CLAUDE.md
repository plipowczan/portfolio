# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Pawel Lipowczan. React 19 + Vite 7 + Tailwind CSS 3 SPA with build-time prerendering for SEO.

**Live:** https://pawellipowczan.pl (Vercel)

## Commands

```bash
# Development
npm run dev              # Start dev server (localhost:5173)
npm run build            # Fast build (no prerender)
npm run build:prerender  # Full production build with SEO prerendering
npm run preview          # Preview production build (localhost:4173)

# Testing
npm test                 # Run all Playwright E2E tests
npm run test:headed      # Run with visible browser
npm run test:ui          # Interactive test UI

# Content
npm run blog:sitemap     # Update sitemap.xml with blog posts
npm run img:convert      # Convert images to WebP format
```

## Architecture

### Tech Stack
- **React 19** + **Vite 7** - UI and build
- **Tailwind CSS 3** - Styling (utility-first)
- **Framer Motion 12** - Animations
- **React Router 7** - Client-side routing
- **React Helmet Async** - Dynamic meta tags
- **Puppeteer** - Build-time prerendering for SEO

### Key Directories
```
src/
├── components/
│   ├── layout/      # Navigation, Footer, Layout
│   ├── sections/    # Hero, About, Projects, Skills, Contact
│   ├── animations/  # NetworkBackground (Canvas)
│   ├── seo/         # SEO, StructuredData
│   └── ui/          # Breadcrumbs, CookieBanner
├── pages/           # Route components (Home, Blog, BlogPostPage, ProjectPage)
├── content/blog/    # Markdown blog posts with frontmatter
├── data/            # projects.js, skills.js, blogPosts.js
└── utils/           # constants.js (SITE_CONFIG, animations)

scripts/
├── prerender.mjs         # Puppeteer prerendering
├── build-with-prerender.mjs  # Build orchestrator
└── update-sitemap.js     # Sitemap generator
```

### Routing
```
/                    → Home (all sections)
/blog                → Blog listing
/blog/:slug          → Individual blog post
/projects/:slug      → Individual project page
/privacy-policy      → Legal pages
/terms-of-service
/cookie-policy
```

## Code Patterns

### Component Structure
- Functional components with hooks
- Arrow functions: `const Component = () => {}`
- Framer Motion for animations with variants
- Tailwind classes (mobile-first responsive)

### Styling
- Use Tailwind utility classes
- Colors: `primary-500` (#00ff9d), `secondary-500` (#00b8ff), `dark-700/800/900`
- Custom gradients in `src/styles/index.css`

### SEO Requirements
- Every page needs `<SEO>` component with title, description, path
- Blog posts need `<StructuredData>` with BlogPosting schema
- OG images: 1200x630px WebP in `public/images/`
- New routes must be added to `scripts/prerender.mjs`
- Update `public/sitemap.xml` for new pages

### Blog Posts
Create markdown in `src/content/blog/` with frontmatter:
```yaml
---
id: 1
slug: post-slug
title: Post Title
excerpt: Short description
category: AI
author: Pawel Lipowczan
date: 2025-12-14
readTime: 8 min
image: /images/og-post-slug.webp
tags:
  - Tag1
  - Tag2
---
```

## External Links
All external links in markdown must render with `target="_blank"` and `rel="noopener noreferrer"` (handled in BlogPostPage.jsx).

## Documentation
- **AGENTS.md** - Detailed guide for AI agents (English)
- **docs/PRD.md** - Product requirements (English)
- **docs/SRS.md** - Technical specification (English)
- **.cursorrules** - Coding standards (English)
- **docs/maintenance/TODO.md** - Current tasks (Polish)
