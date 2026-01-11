# Framer Motion Testing

## Jest / React Testing Library
Framer Motion animations are js-driven. In tests, you might want to skip animations for speed.

## Mocking
Mock `framer-motion` in tests to render children directly without animation logic if causing issues.

```javascript
// __mocks__/framer-motion.js
const React = require('react');
const actual = jest.requireActual('framer-motion');

module.exports = {
  ...actual,
  AnimatePresence: ({ children }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    // ... other elements
  },
};
```
