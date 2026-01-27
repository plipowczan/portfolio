# Data Storage & Handling

## Overview

This project uses a file-based data storage approach for content, primarily leveraging Markdown files with Frontmatter for blog posts and JavaScript objects for static data.

## Blog Content System

### Architecture

The blog system is built on a static file architecture:

- **Source**: `src/content/blog/*.md`
- **Loader**: `src/data/blogPosts.js` (uses Vite's `import.meta.glob`)
- **Parser**: `gray-matter` for frontmatter extraction
- **Renderer**: `react-markdown`

### File Structure

Each blog post consists of two files in `src/content/blog/`:

1. `[slug].md`: The published article (auto-generated or manually created).
2. `[slug]_wsad.md`: Input file with key points/draft (source of truth for generation).

### Frontmatter Schema

Every `.md` file MUST contain a valid frontmatter block:

```yaml
---
id: 1 # Unique integer ID
slug: my-article-slug # URL-friendly identifier
title: Article Title # Display title
excerpt: Short summary (150-200 chars) # SEO & preview description
category: Automation # Single category
author: Pawel Lipowczan # Author name
date: 2025-11-15 # YYYY-MM-DD
readTime: 8 min # Estimated read time
image: /images/og-my-article.webp # Path to OG image (in public/)
tags: # List of tags
  - Tag1
  - Tag2
---
```

### FAQ Section Structure (Optional but Recommended)

Blog articles can include FAQ sections for AEO (Answer Engine Optimization):

```markdown
## FAQ

### [Natural question in Polish, 10-25 words]

[Snippet-style answer, 2-4 sentences. Key info first.]

### [Next question...]

[Answer...]
```

**Technical Details:**

- FAQ sections detected by H2 heading containing "FAQ" or "Najczęściej zadawane pytania"
- Questions formatted as H3 headings
- Answers as paragraph elements
- FAQPage schema auto-generated from content by `src/utils/faqExtractor.js`
- See `docs/faq/FAQ_TEMPLATE.md` and `docs/faq/FAQ_GUIDELINES.md` for full guidelines

### Loading Mechanism

Data is loaded eagerly at build time via `src/data/blogPosts.js`:

```javascript
const blogFiles = import.meta.glob("../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
```

- **Validation**: The loader validates required fields and types.
- **Filtering**: Files ending in `_wsad.md` or starting with `_` are automatically excluded.

## Static Data

Non-blog static data is stored in `src/data/`:

- `projects.js`: Portfolio projects list.
- `skills.js`: Technical skills categorization.

These files export standard JavaScript arrays/objects.

## Best Practices

1. **Immutability**: Treat loaded data as immutable.
2. **Images**: Store content images in `public/images/` and reference by absolute path (`/images/...`).
3. **IDs**: Maintain unique numerical IDs for posts to support legacy routing/references if needed.
4. **Dates**: Always use `YYYY-MM-DD` format for consistency.
