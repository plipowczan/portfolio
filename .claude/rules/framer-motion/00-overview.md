# Framer Motion Overview

## Core Principles
### 1. Declarative Animations
Describe states, not transitions. Let the library handle the interpolation.

### 2. Physical Models
Uses spring physics by default for natural-feeling motion.

### 3. Layout Animations
Shared layout animations allow elements to animate between different positions in the DOM.

## When to Use Framer Motion
✅ Good for:
- Complex UI transitions
- Gesture-based interactions (drag, pan)
- Scroll-linked animations

❌ Avoid for:
- Simple CSS transitions (hover states can be done in CSS/Tailwind)
- Performance-critical animations on low-end devices (CSS is lighter)
