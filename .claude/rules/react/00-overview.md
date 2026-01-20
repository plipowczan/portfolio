# React Overview

## Core Principles
### 1. Component-Based
Build encapsulated components that manage their own state, then compose them to make complex UIs.

### 2. Declarative
Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.

### 3. Learn Once, Write Anywhere
We don't make assumptions about the rest of your technology stack, so you can develop new features in React without rewriting existing code.

## Philosophy
- **Unidirectional Data Flow**: Data flows down, actions flow up.
- **Immutability**: Prefer immutable data structures for predictable state changes.
- **Composition over Inheritance**: Reuse code using composition rather than inheritance.

## When to Use React
✅ Good for:
- Single Page Applications (SPA)
- Complex, interactive UIs
- Large scale applications with many state changes

❌ Avoid for:
- Simple, static websites (unless using SSG/prerendering like in this project)
- Projects where SEO is critical but prerendering/SSR is not an option (React is client-side by default)
