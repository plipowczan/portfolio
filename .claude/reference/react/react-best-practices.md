# React Best Practices

**Framework:** React 19.2.0
**Language:** JavaScript
**Build Tool:** Vite 7.2.2

## Overview

This document outlines React best practices and patterns for building type-safe, maintainable React applications.

## Table of Contents

1. [Component Design](#component-design)
2. [Props Validation](#props-validation)
3. [State Management](#state-management)
4. [Data Fetching](#data-fetching)
5. [Performance](#performance)
6. [Styling](#styling)
7. [Testing](#testing)
8. [Common Patterns](#common-patterns)

---

## Component Design

### Functional Components Only

```jsx
// ✅ GOOD: Functional component with hooks
const Button = ({ title, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleClick = async () => {
    setIsSaving(true);
    await onSave();
    setIsSaving(false);
  };

  return (
    <button onClick={handleClick} disabled={isSaving}>
      {isSaving ? 'Saving...' : title}
    </button>
  );
};

export default Button;

// ❌ BAD: Class component (outdated)
class Button extends React.Component {
  // Don't use class components anymore
}
```

### Component Structure

```jsx
// 1. Imports
import { useState, useEffect } from 'react';

// 2. Component
const ComponentName = ({ prop1, prop2 }) => {
  // 2a. Hooks
  const [state, setState] = useState(initialValue);

  // 2b. Event handlers
  const handleClick = () => {
    // ...
  };

  // 2c. Effects
  useEffect(() => {
    // ...
  }, []);

  // 2d. Derived values
  const derivedValue = useMemo(() => {
    // ...
  }, [dependency]);

  // 2e. Render
  return (
    <div>...</div>
  );
};

export default ComponentName;
```

---

## Props Validation

### PropTypes for Runtime Validation

```jsx
import PropTypes from 'prop-types';

// ✅ GOOD: PropTypes for validation
const UserCard = ({ user, onEdit, onDelete, showActions = true }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      {showActions && (
        <div>
          <button onClick={() => onEdit(user.id)}>Edit</button>
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  showActions: PropTypes.bool,
};

export default UserCard;

// ❌ BAD: No validation
const UserCard = ({ user, onEdit, onDelete, showActions }) => {
  // ...
};
```

### JSDoc Comments for Documentation

```jsx
/**
 * Button component with loading state
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Loading state
 * @param {React.ReactNode} props.children - Button content
 * @param {Object} props.rest - Additional button props
 */
const Button = ({ loading, children, ...rest }) => {
  return (
    <button disabled={loading} {...rest}>
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
```

---

## State Management

### When to Use What

| State Type | Solution | Scope |
|------------|----------|-------|
| Local component state | useState | Single component |
| Form state | useState + controlled inputs | Form component |
| Global UI state | Context API | Multiple components |
| Server cache | React Query / SWR | App-wide |
| Complex state | Zustand / Redux | App-wide |

### useState Patterns

```jsx
// ✅ GOOD: Simple state
const [count, setCount] = useState(0);

// ✅ GOOD: Object state with updates
const [user, setUser] = useState(null);

const updateUser = (field, value) => {
  setUser(prev => prev ? { ...prev, [field]: value } : null);
};

// ❌ BAD: Multiple related states
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [age, setAge] = useState(0);
// Should be single object or use reducer
```

### Context API for Global State

```jsx
// context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const user = await api.login(credentials);
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## Data Fetching

### React Query (Recommended)

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const UserProfile = ({ userId }) => {
  const queryClient = useQueryClient();

  // Fetch data
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
  });

  // Mutation
  const updateMutation = useMutation({
    mutationFn: (data) => api.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => updateMutation.mutate({ name: 'New Name' })}>
        Update Name
      </button>
    </div>
  );
};

export default UserProfile;
```

### useEffect for Fetching (Fallback)

```jsx
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await api.getUser(userId);
        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return null;

  return <div>{user.name}</div>;
};

export default UserProfile;
```

---

## Performance

### useMemo for Expensive Computations

```jsx
const ExpensiveList = ({ items }) => {
  const sortedItems = useMemo(() => {
    console.log('Sorting items...');
    return items.sort((a, b) => a.value - b.value);
  }, [items]);

  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

export default ExpensiveList;
```

### useCallback for Stable Function References

```jsx
const Parent = () => {
  const [count, setCount] = useState(0);

  // Without useCallback, Child re-renders on every parent render
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <Child onClick={handleClick} />;
};

export default Parent;
```

### Code Splitting with React.lazy

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
};

export default App;
```

---

## Styling

### TailwindCSS (Recommended)

```jsx
// ✅ GOOD: Utility classes
const Button = ({ variant = 'primary', children, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[variant];

  return (
    <button className={`${baseStyles} ${variantStyles}`} {...props}>
      {children}
    </button>
  );
};

export default Button;

// ❌ BAD: Inline styles
const Button = ({ children }) => {
  return (
    <button style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem' }}>
      {children}
    </button>
  );
};
```

### CSS Modules

```jsx
import styles from './Button.module.css';

const Button = ({ variant, children }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
};

export default Button;
```

---

## Testing

### Component Testing with React Testing Library

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading={true}>Submit</Button>);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### Hook Testing

```jsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

---

## Common Patterns

### Custom Hooks

```jsx
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
```

### Render Props

```jsx
const DataFetcher = ({ url, children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return <>{children(data, loading, error)}</>;
};

export default DataFetcher;

// Usage
<DataFetcher url="/api/user/1">
  {(user, loading, error) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return null;
    return <div>{user.name}</div>;
  }}
</DataFetcher>
```

---

## Summary

**Key Principles:**

1. **Functional components** - Use hooks, not classes
2. **JavaScript** - Use PropTypes or JSDoc for documentation
3. **Composition** - Prefer composition over inheritance
4. **Performance** - useMemo, useCallback, code splitting
5. **State management** - Use appropriate tool for scope
6. **Data fetching** - Prefer React Query over useEffect
7. **Styling** - TailwindCSS utility classes
8. **Testing** - Playwright for E2E, React Testing Library for unit tests

**External References:**
- [React Documentation](https://react.dev/)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [PropTypes Documentation](https://react.dev/reference/react/Component#static-proptypes)
- [React Query](https://tanstack.com/query/latest)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)
- [TailwindCSS](https://tailwindcss.com/docs)
