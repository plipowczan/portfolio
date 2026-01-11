# Tailwind Patterns

## Component Abstraction
Instead of `@apply`, create React components.

```jsx
// Button.jsx
const Button = ({ children }) => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    {children}
  </button>
);
```

## Dynamic Classes
Use `clsx` or string templates.
```jsx
<div className={`p-4 ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
```
