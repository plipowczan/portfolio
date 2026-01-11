# Framer Motion Setup

## Installation
```bash
npm install framer-motion
```

## Basic Component
```jsx
import { motion } from 'framer-motion';

export const FadeIn = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {children}
  </motion.div>
);
```
