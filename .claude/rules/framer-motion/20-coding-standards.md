# Framer Motion Coding Standards

## Variants
Use variants for complex or orchestrated animations.
```jsx
const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
};

<motion.li variants={item} />
```

## Performance
- Animate `transform` (x, y, scale, rotate) and `opacity`.
- Avoid animating `width`, `height`, `top`, `left` (causes layout thrashing).
- Use `will-change` (handled automatically by Framer Motion usually).

## Accessibility
Respect `prefers-reduced-motion`.
```jsx
const shouldReduceMotion = useReducedMotion();
const variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: shouldReduceMotion ? 0 : 0.3 } 
  }
};
```
