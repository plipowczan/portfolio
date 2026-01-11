# Playwright Overview

## Core Principles
### 1. Auto-waiting
Playwright waits for elements to be actionable before performing actions.

### 2. Web-First Assertions
Assertions retry until the necessary condition is met.

### 3. Tracing
Records execution traces for post-mortem debugging.

## When to Use Playwright
✅ Good for:
- End-to-End (E2E) testing
- Cross-browser testing (Chromium, Firefox, WebKit)
- Visual regression testing

❌ Avoid for:
- Unit testing (use Vitest/Jest)
- Simple component testing (though Playwright Component Testing exists, React Testing Library is often faster for logic)
