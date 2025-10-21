export const blogPosts = [
  {
    id: 1,
    slug: 'react-performance-optimization',
    title: 'React Performance Optimization: Best Practices',
    excerpt: 'Learn how to optimize your React applications for better performance with these proven techniques and best practices.',
    content: `# React Performance Optimization: Best Practices

React is an excellent library for building user interfaces, but as applications grow, performance can become a concern. In this article, we'll explore proven techniques to optimize React applications.

## 1. Use React.memo for Component Memoization

\`\`\`jsx
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})
\`\`\`

React.memo prevents unnecessary re-renders by memoizing the component output.

## 2. Implement useMemo and useCallback

\`\`\`jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b])
\`\`\`

These hooks help avoid expensive calculations and prevent function recreation on every render.

## 3. Code Splitting with React.lazy

\`\`\`jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'))
\`\`\`

Load components only when they're needed to reduce initial bundle size.

## 4. Virtual Scrolling for Long Lists

For long lists, use libraries like react-window or react-virtualized to render only visible items.

## Conclusion

Performance optimization is crucial for user experience. Start with these techniques and measure the impact using React DevTools Profiler.`,
    category: 'React',
    author: 'Pawel Lipowczan',
    date: '2025-10-15',
    readTime: '8 min read',
    image: '/images/blog-react-performance.jpg',
    tags: ['React', 'Performance', 'JavaScript', 'Optimization']
  },
  {
    id: 2,
    slug: 'modern-css-techniques',
    title: 'Modern CSS Techniques Every Developer Should Know',
    excerpt: 'Discover modern CSS features and techniques that will level up your styling skills and make your websites more responsive and maintainable.',
    content: `# Modern CSS Techniques Every Developer Should Know

CSS has evolved significantly in recent years. Let's explore modern techniques that every developer should know.

## 1. CSS Grid Layout

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}
\`\`\`

CSS Grid makes complex layouts simple and responsive.

## 2. Custom Properties (CSS Variables)

\`\`\`css
:root {
  --primary-color: #00ff9d;
  --spacing: 1rem;
}

.element {
  color: var(--primary-color);
  padding: var(--spacing);
}
\`\`\`

CSS variables make theming and maintenance easier.

## 3. Clamp for Responsive Typography

\`\`\`css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
\`\`\`

The clamp() function provides responsive sizing without media queries.

## Conclusion

Modern CSS is powerful and flexible. Embrace these techniques to write better, more maintainable stylesheets.`,
    category: 'CSS',
    author: 'Pawel Lipowczan',
    date: '2025-10-10',
    readTime: '6 min read',
    image: '/images/blog-css-modern.jpg',
    tags: ['CSS', 'Web Development', 'Responsive Design']
  },
  {
    id: 3,
    slug: 'typescript-advanced-patterns',
    title: 'Advanced TypeScript Patterns for Better Code',
    excerpt: 'Explore advanced TypeScript patterns and techniques that will help you write more type-safe and maintainable code.',
    content: `# Advanced TypeScript Patterns for Better Code

TypeScript provides powerful type system features. Let's explore advanced patterns for better code.

## 1. Utility Types

\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P]
}

type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
\`\`\`

Built-in utility types make type transformations easier.

## 2. Discriminated Unions

\`\`\`typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }
\`\`\`

Discriminated unions provide type-safe error handling.

## 3. Generic Constraints

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
\`\`\`

Generic constraints ensure type safety with flexibility.

## Conclusion

Master these patterns to write more robust TypeScript code.`,
    category: 'TypeScript',
    author: 'Pawel Lipowczan',
    date: '2025-10-05',
    readTime: '10 min read',
    image: '/images/blog-typescript.jpg',
    tags: ['TypeScript', 'Programming', 'Type Safety']
  }
]

