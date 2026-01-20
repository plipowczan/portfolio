# React Router Overview

## Core Principles
### 1. Declarative Routing
Routing is part of your component hierarchy, not a separate configuration file.

### 2. Nested Routes
Routes can be nested to map URL segments to component hierarchy and data dependencies.

### 3. Dynamic Segments
URL parameters (like `:id`) are parsed and available to components.

## When to Use React Router
✅ Good for:
- Single Page Applications (SPA)
- Applications with multiple views/pages
- Managing browser history and deep linking

❌ Avoid for:
- Single-view applications (modals might be enough)
- Static sites where file-based routing (like Next.js) is preferred (though React Router fits well in Vite SPAs)
