# Test Patterns for Portfolio Project

Common Playwright selectors, viewport sizes, and wait strategies for the portfolio project.

## Common Selectors

### Navigation

```javascript
// Desktop menu
const desktopNav = 'nav >> visible=true';
const menuLinks = 'nav >> a';
const menuItem = (text) => `nav >> text=${text}`;

// Mobile menu
const hamburgerButton = '[aria-label="Toggle menu"]';
const mobileMenu = '.mobile-menu, [data-mobile-menu]';
const mobileMenuOverlay = '.mobile-menu-overlay';

// Logo
const logo = 'nav >> img[alt*="Logo"], nav >> a[href="/"]';
```

### Page Sections

```javascript
// Section IDs (use # prefix)
const sections = {
  hero: '#hero, [data-section="hero"]',
  about: '#about, [data-section="about"]',
  projects: '#projects, [data-section="projects"]',
  skills: '#skills, [data-section="skills"]',
  contact: '#contact, [data-section="contact"]'
};

// Section headings
const sectionHeading = (section) => `${sections[section]} >> h2`;
```

### Forms

```javascript
// Contact form
const contactForm = 'form#contact-form, form[name="contact"]';
const nameInput = 'input[name="name"]';
const emailInput = 'input[name="email"]';
const subjectInput = 'input[name="subject"]';
const messageTextarea = 'textarea[name="message"]';
const submitButton = 'button[type="submit"]';

// Error messages
const errorMessage = '.error-message, [data-error], .text-red-500';
const successMessage = '.success-message, [data-success], .text-green-500';
```

### Blog

```javascript
// Blog listing
const blogPostCard = '.blog-post-card, article.post-card';
const postTitle = '.post-title, article h2, article h3';
const postExcerpt = '.post-excerpt, article p';
const postDate = '.post-date, time, [data-date]';
const postImage = '.post-image, article img';
const postTags = '.post-tags, [data-tags]';

// Single post
const articleContent = 'article, .prose, .post-content';
const articleTitle = 'article h1';
const readingTime = '.reading-time, [data-reading-time]';
const backToBlog = 'a[href="/blog"], text=Wróć, text=Blog';
```

### SEO Elements

```javascript
// Meta tags (use page.getAttribute)
const metaDescription = 'meta[name="description"]';
const ogTitle = 'meta[property="og:title"]';
const ogDescription = 'meta[property="og:description"]';
const ogImage = 'meta[property="og:image"]';
const ogUrl = 'meta[property="og:url"]';
const twitterCard = 'meta[name="twitter:card"]';
const canonical = 'link[rel="canonical"]';

// Structured data
const jsonLd = 'script[type="application/ld+json"]';
```

### UI Components

```javascript
// Cookie banner
const cookieBanner = '.cookie-banner, [data-cookie-banner]';
const acceptCookies = 'button:has-text("Akceptuję"), button:has-text("Accept")';

// Footer
const footer = 'footer';
const footerLinks = 'footer >> a';
const socialLinks = '.social-links >> a, footer >> a[target="_blank"]';
```

## Viewport Sizes

```javascript
const viewports = {
  // Mobile devices
  mobile: { width: 375, height: 667 },      // iPhone SE
  mobileL: { width: 414, height: 896 },     // iPhone XR

  // Tablets
  tablet: { width: 768, height: 1024 },     // iPad
  tabletL: { width: 1024, height: 768 },    // iPad Landscape

  // Desktop
  desktop: { width: 1280, height: 720 },    // Small desktop
  desktopL: { width: 1920, height: 1080 },  // Full HD
  desktopXL: { width: 2560, height: 1440 }  // 2K
};

// Recommended test viewports (cover most users)
const testViewports = [
  { name: 'mobile', ...viewports.mobile },
  { name: 'tablet', ...viewports.tablet },
  { name: 'desktop', ...viewports.desktopL }
];
```

## Wait Strategies

### Prefer waitForSelector over waitForTimeout

```javascript
// Bad - arbitrary wait
await page.waitForTimeout(1000);

// Good - explicit wait for element
await page.waitForSelector('#section', { state: 'visible' });
```

### Wait for network idle (after navigation)

```javascript
await page.goto('http://localhost:3000', {
  waitUntil: 'networkidle'
});
```

### Wait for animations (Framer Motion)

```javascript
// Framer Motion animations typically take 300-500ms
await page.click('nav >> text=Kontakt');
await page.waitForTimeout(500); // Only for animations
await expect(page.locator('#contact')).toBeInViewport();
```

### Wait for dynamic content (React state)

```javascript
// Wait for loading state to finish
await page.waitForSelector('.loading', { state: 'hidden' });

// Wait for content to appear
await page.waitForSelector('.blog-posts >> article', { state: 'visible' });
```

### Wait for SEO tags (react-helmet-async)

```javascript
// React Helmet updates title asynchronously
await page.waitForFunction(() => {
  return document.title !== '' &&
         document.title !== 'Loading...' &&
         !document.title.includes('{{');
});
```

## Assertion Patterns

### Element visibility

```javascript
// Element is visible
await expect(page.locator('#hero')).toBeVisible();

// Element is in viewport (scrolled into view)
await expect(page.locator('#contact')).toBeInViewport();

// Element exists but may be hidden
await expect(page.locator('.hidden-element')).toBeAttached();
```

### Text content

```javascript
// Contains text
await expect(page.locator('h1')).toContainText('Portfolio');

// Exact text
await expect(page.locator('.title')).toHaveText('Pawel Lipowczan');

// Text matches regex
await expect(page.locator('.date')).toHaveText(/\d{4}/);
```

### Attributes

```javascript
// Has attribute
await expect(page.locator('a')).toHaveAttribute('href', '/blog');

// Attribute contains
const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
expect(ogImage).toContain('.webp');
```

### Count elements

```javascript
// Exact count
await expect(page.locator('.blog-post')).toHaveCount(4);

// At least
const count = await page.locator('.blog-post').count();
expect(count).toBeGreaterThan(0);
```

## Project-Specific Patterns

### Test blog post by slug

```javascript
const testBlogPost = async (page, slug, expectedTitle) => {
  await page.goto(`http://localhost:3000/blog/${slug}`);
  await expect(page.locator('article h1')).toContainText(expectedTitle);
  await expect(page.locator('article')).toBeVisible();

  // Verify SEO
  const title = await page.title();
  expect(title).toContain(expectedTitle);
};
```

### Test all navigation links

```javascript
const testAllNavLinks = async (page) => {
  const links = page.locator('nav >> a');
  const count = await links.count();

  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute('href');
    if (href?.startsWith('#')) {
      const sectionId = href.substring(1);
      await page.click(`nav >> a[href="${href}"]`);
      await page.waitForTimeout(500); // Smooth scroll
      await expect(page.locator(`#${sectionId}`)).toBeInViewport();
    }
  }
};
```

### Test mobile menu complete flow

```javascript
const testMobileMenuFlow = async (page) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000');

  const menu = page.locator('.mobile-menu');
  const hamburger = page.locator('[aria-label="Toggle menu"]');

  // Open menu
  await hamburger.click();
  await expect(menu).toBeVisible();

  // Navigate
  await page.click('nav >> text=Kontakt');
  await expect(menu).not.toBeVisible();

  // Reopen and close with Escape
  await hamburger.click();
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
};
```
