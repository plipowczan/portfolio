# React Coding Standards

## Code Style

### Naming Conventions

- **Components**: PascalCase (e.g., `Button.jsx`, `UserProfile.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.js`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Props**: camelCase (e.g., `isLoading`)

### Component Structure

```jsx
import { useState, useEffect } from "react";

/**
 * Short description of the component.
 * @param {{ prop1: string, prop2: number }} props
 */
const ComponentName = ({ prop1, prop2 }) => {
  // 1. Hooks
  const [state, setState] = useState(null);

  // 2. Effects
  useEffect(() => {
    // ...
  }, []);

  // 3. Event Handlers
  const handleClick = () => {
    // ...
  };

  // 4. Render
  return <div>{/* content */}</div>;
};

export default ComponentName;
```

> **No PropTypes**: `prop-types` is NOT a dependency of this project. Importing it
> fails module resolution in Vite dev and blanks the entire app. Describe props
> with a JSDoc comment instead.

## Design System Integration

See [Design Tokens](../../../reference/design/design-tokens.json) and [Component Patterns](../../../reference/design/component-patterns.md) for detailed design specifications.

## Best Practices

### 1. Use Functional Components

Always use functional components with hooks, not class components.

### 2. Destructure Props

```jsx
// ✅ GOOD
const Button = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

// ❌ BAD
const Button = (props) => (
  <button onClick={props.onClick}>{props.label}</button>
);
```

### 3. Conditional Rendering

Use logical AND (`&&`) or ternary operators.

```jsx
{
  isLoading ? <Spinner /> : <Content />;
}
{
  showError && <ErrorMessage />;
}
```

## Anti-Patterns

### ❌ Anti-Pattern 1: Props Drilling

Passing props through many levels of components.
✅ **Better**: Use Context API or Composition.

### ❌ Anti-Pattern 2: Indexes as Keys

Using array index as key in lists.

```jsx
{
  items.map((item, index) => <li key={index}>{item}</li>);
} // Bad if list changes
```

✅ **Better**: Use unique IDs.

```jsx
{
  items.map((item) => <li key={item.id}>{item.name}</li>);
}
```
