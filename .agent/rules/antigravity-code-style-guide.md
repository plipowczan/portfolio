---
trigger: always_on
---

# Code Style Guide - Portfolio

> **Version:** 1.0.0 | **Updated:** Nov 20, 2025 | React + Vite + Tailwind + Framer Motion

## 1. JavaScript & React

### Core Rules
- **ES6+**: Arrow functions, destructuring, optional chaining (`user?.name ?? 'Guest'`)
- **Functional components** with hooks only
- **Named exports** preferred
- **Components < 200 lines**

### Component Pattern
```jsx
// ✅ GOOD
const Hero = ({ title, subtitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // side effects
  }, []);
  
  const handleClick = () => setIsOpen(!isOpen);
  
  return <section>...</section>;
};

export default Hero;

// ❌ BAD
function Hero(props) {
  return <section>{props.title}</section>;
}
```

### Hooks Order
1. State (`useState`)
2. Effects (`useEffect`)
3. Custom hooks
4. Event handlers
5. Render helpers

---

## 2. File Naming

- **Components**: PascalCase → `Hero.jsx`, `ProjectCard.jsx`
- **Utilities**: camelCase → `constants.js`, `useScrollAnimation.js`
- **Pages**: PascalCase → `Home.jsx`, `BlogPostPage.jsx`
- **Styles**: kebab-case → `index.css`
- **Data**: camelCase → `projects.js`, `skills.js`
- **Tests**: kebab-case → `home.spec.js`, `contact-form.spec.js`

---

## 3. Component Structure

```jsx
// 1. External imports
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 2. Internal imports
import Button from '../ui/Button';

// 3. Constants
import { FADE_IN_UP } from '../../utils/constants';

// 4. Component
const MyComponent = ({ title, data }) => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    setItems(data);
  }, [data]);
  
  const handleClick = (item) => {
    console.log(item);
  };
  
  return (
    <motion.section variants={FADE_IN_UP}>
      <h2>{title}</h2>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
    </motion.section>
  );
};

export default MyComponent;
```

**Folder Structure:**
```
src/components/
├── layout/      # Navigation, Footer, Layout
├── sections/    # Hero, About, Projects, Skills, Contact
├── ui/          # Button, Card, Input
├── animations/  # NetworkBackground
└── seo/         # StructuredData
```

---

## 4. CSS & Tailwind

### Class Order
1. Layout: `flex`, `grid`, `block`
2. Position: `relative`, `absolute`
3. Sizing: `w-*`, `h-*`
4. Spacing: `p-*`, `m-*`, `gap-*`
5. Typography: `text-*`, `font-*`
6. Colors: `text-*`, `bg-*`
7. Borders: `border`, `rounded-*`
8. Effects: `shadow-*`, `opacity-*`
9. Transitions: `transition-*`, `duration-*`
10. Transforms: `scale-*`, `rotate-*`
11. Interactivity: `hover:*`, `focus:*`

```jsx
// ✅ GOOD
<div className="flex items-center w-full px-4 text-xl font-bold text-white bg-primary-500 rounded-lg shadow-lg hover:scale-105 transition-transform">

// ❌ BAD
<div className="hover:scale-105 text-white w-full rounded-lg flex px-4 bg-primary-500">
```

### Responsive (Mobile-First)
```jsx
// ✅ GOOD
<h1 className="text-4xl md:text-5xl lg:text-6xl">

// ❌ BAD
<h1 className="text-6xl lg:text-5xl md:text-4xl">
```

### Custom Classes
```css
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-primary-500 text-dark-900 font-semibold rounded-lg
           hover:bg-primary-400 hover:shadow-lg transition-all duration-300;
  }
  
  .glass {
    @apply bg-dark-700/50 backdrop-blur-md border border-primary-500/20;
  }
}
```

### Color Tokens
```jsx
// ✅ GOOD - Use design tokens
<div className="bg-dark-900 text-primary-500">

// ❌ BAD - Hardcoded
<div style={{ backgroundColor: '#050810', color: '#00ff9d' }}>
```

---

## 5. Animations

### Variants (in constants.js)
```jsx
export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] } },
};

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
```

### Usage
```jsx
<motion.div
  variants={FADE_IN_UP}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
>
  Content
</motion.div>
```

### Best Practices
- Animate **only** `transform` and `opacity`
- Use `viewport={{ once: true }}`
- Duration: 0.3s - 0.8s
- Custom easing: `[0.6, 0.05, 0.01, 0.9]`
- **Avoid** animating `width`, `height`, `top`, `left`

---

## 6. Data Management

### Data Files (src/data/)
```javascript
// projects.js
export const projects = [
  {
    id: 1,
    title: "Project Title",
    description: "Description",
    image: "/images/project.jpg",
    technologies: ["React", "Node.js"],
    liveUrl: "https://example.com",
    featured: true,
  },
];
```

### Constants (src/utils/constants.js)
```javascript
export const SITE_CONFIG = {
  name: "Pawel Lipowczan",
  email: "pawel@lipowczan.pl",
  url: "https://pawel.lipowczan.pl",
  social: {
    github: "https://github.com/plipowczan",
    linkedin: "https://linkedin.com/in/pawellipowczan",
  },
};

export const NAV_LINKS = [
  { name: "Start", href: "/" },
  { name: "O mnie", href: "/#about" },
];
```

---

## 7. Testing (Playwright)

```javascript
import { expect, test } from "@playwright/test";
import { waitForAnimations } from "../utils/test-helpers.js";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForAnimations(page, 1000);
  });

  test("should display hero section", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();
  });
});
```

**Best Practices:**
- Descriptive names in Polish
- AAA pattern: Arrange, Act, Assert
- Wait for animations
- Use semantic selectors (IDs, ARIA)
- Test user flows, not implementation

---

## 8. SEO

### Meta Tags
```jsx
import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>{post.title} | Pawel Lipowczan</title>
  <meta name="description" content={post.excerpt} />
  <meta property="og:title" content={post.title} />
  <meta property="og:image" content={post.image} />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href={`https://pawel.lipowczan.pl/blog/${post.slug}`} />
</Helmet>
```

### Structured Data
```jsx
const structuredData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "author": { "@type": "Person", "name": "Pawel Lipowczan" },
  "datePublished": post.date,
};

<StructuredData data={structuredData} />
```

### Semantic HTML
```jsx
// ✅ GOOD
<article>
  <header>
    <h1>Title</h1>
    <time dateTime="2025-11-20">Nov 20, 2025</time>
  </header>
  <section><p>Content</p></section>
</article>

// ❌ BAD - Div soup
<div><div><div>Title</div></div></div>
```

---

## 9. Performance

### Images
```jsx
// ✅ GOOD
<img src="/images/project.webp" alt="Dashboard interface" loading="lazy" width="800" height="600" />

// ❌ BAD
<img src="/images/project.png" />
```

### Code Splitting
```jsx
import { lazy, Suspense } from 'react';

const Blog = lazy(() => import('./pages/Blog'));

<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/blog" element={<Blog />} />
  </Routes>
</Suspense>
```

### Memoization
```jsx
const filteredProjects = useMemo(() => 
  projects.filter(p => p.category === filter), 
  [projects, filter]
);

const handleClick = useCallback((id) => {
  console.log(id);
}, []);
```

---

## 10. Accessibility

### Keyboard Navigation
```jsx
// ✅ GOOD
<button type="button" onClick={handleClick} aria-label="Close menu">
  <HiX />
</button>

// ❌ BAD
<div onClick={handleClick}><HiX /></div>
```

### ARIA Labels
```jsx
<button aria-label="Toggle mobile menu" aria-expanded={isOpen}>
  {isOpen ? <HiX /> : <HiMenu />}
</button>

<nav aria-label="Main navigation">...</nav>
```

### Focus
```css
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary-500;
}
```

### Alt Text
```jsx
// ✅ GOOD
<img src="/project.jpg" alt="Chatbot interface showing AI conversation flow" />

// ❌ BAD
<img src="/project.jpg" alt="chatbot" />
```

---

## 11. Git Workflow

### Branches
- `main` - Production
- `develop` - Development
- `feature/name` - Features
- `fix/name` - Fixes
- `refactor/name` - Refactoring
- `docs/name` - Documentation

### Commit Format
```
type: brief description

Optional details.
```

**Types:** `feat`, `fix`, `style`, `refactor`, `docs`, `perf`, `test`, `chore`

**Examples:**
```bash
feat: add hero section with gradient text
fix: resolve mobile menu z-index issue
style: update color scheme to green/teal
refactor: extract animation variants to constants
docs: update README with deployment guide
test: add e2e tests for contact form
```

---

## Code Review Checklist

- [ ] Components < 200 lines
- [ ] Props destructured
- [ ] Tailwind classes ordered correctly
- [ ] Animations use `transform`/`opacity` only
- [ ] Images have descriptive alt text
- [ ] Forms validated properly
- [ ] No console.log in production
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] SEO meta tags present
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Commit messages formatted