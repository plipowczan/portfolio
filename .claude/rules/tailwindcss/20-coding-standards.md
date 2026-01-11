# Tailwind Coding Standards

## Class Ordering
Follow the recommended order (use prettier-plugin-tailwindcss):
1. Layout (display, position)
2. Box Model (margin, padding, size)
3. Typography (font, text)
4. Visual (background, border, effects)
5. Interaction (hover, focus)

Example:
```jsx
// ✅ GOOD
<div className="flex items-center justify-between p-4 bg-white shadow-sm">

// ❌ BAD (Random order)
<div className="shadow-sm p-4 justify-between bg-white flex items-center">
```

## Responsive Design
Use mobile-first modifiers.
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
```
