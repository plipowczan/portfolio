# Component Patterns & Best Practices

This document outlines the standard patterns for building components in the Pawel Lipowczan Portfolio project.

## Tech Stack

- Framework:\*\* React 19
- Styling:\*\* Tailwind CSS 3.4
- Animations:\*\* Framer Motion 12
- Icons:\*\* React Icons

## Component Structure

All components should be functional components using named exports.

```jsx
import { motion } from "framer-motion";
import { FADE_IN_UP } from "../../utils/constants";

export const MyComponent = ({ title, children }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={FADE_IN_UP}
      className="p-6 bg-dark-800 rounded-xl border border-dark-700"
    >
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="text-gray-300">{children}</div>
    </motion.div>
  );
};
```

## Styling Guidelines

### 1. Colors

U the semantic color names defined in `tailwind.config.js`:

- ckgrounds: `bg-dark-900` (page), `bg-dark-800` (cards)
- Text: `text-white` (headings), `text-gray-300` (body), `text-primary-500` (accents)
- Borders: `border-dark-700`

# 2. Typography

- Headings: `font-bold font-sans`
- Body: `font-sans`

- de/Tech: `font-mono`

# 3. Spacing

- Section padding: `py-16` or `py-20`

- Container: `container mx-auto px-4`

- Card padding: `p-6` or `p-8`

### 4. Glassmorphism

To achieve the glass effect:

````css
bg-dark-800/50 backdrop-blur-sm border border-white/10
`


## Animation Patterns

Use the pre-defined variants from `src/utils/constants.js` to ensure consistency.


* Fade In Up:** For cards, sections, and text blocks.


    ```jsx
    import { FADE_IN_UP } from '../../utils/constants';
    // ...
    <motion.div variants={FADE_IN_UP} ... />
    ```

* **Stagger Children:** For lists and grids.

    ```jsx
  import { STAGGER_CONTAINER } from '../../utils/constants';
  // ...
  < ion.div variants={STAGGER_CONTAINER} ... >
    tems.map(item => <motion.div variants={FADE_IN_UP} ... />)}
  < tion.div>
  `

## Responsive Design


* **Mobile First:** Write base styles for mobile, then add breakpoints.
* **Breakpoints:**
  * `sm`: 640px
  * `md`: 768px (Tablets)
  * `lg`: 1024px (Desktop)
  * `xl`: 1280px (Large Desktop)

E ple:

` sx
<  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* ... */}
</div>
````

## Accessibility (A11y)

- Always include `alt` text for images.
- Use semantic HTML (`<section>`, `<article>`, `<nav>`, `<button>`).
- Ensure sufficient color contrast (check text on `primary-500` backgrounds).
- Focus states: Ensure interactive elements have visible focus states (Tailwind's `focus:ring`).
