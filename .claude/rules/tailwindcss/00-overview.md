# Tailwind CSS Overview

## Core Principles
### 1. Utility-First
Build complex components from a constrained set of primitive utilities.

### 2. Mobile-First
Unprefixed utilities take effect on all screen sizes, while prefixed utilities (e.g., `md:`) take effect at the specified breakpoint and above.

### 3. Component Extraction
Extract repeated patterns into components (React components) rather than using `@apply` (unless necessary).

## When to Use Tailwind
✅ Good for:
- Rapid prototyping and development
- Design consistency (constrained scale)
- Maintaining small CSS bundle size (PurgeCSS)

❌ Avoid for:
- Projects where you can't control HTML structure
- If you prefer "Semantic CSS" (separation of concerns)
