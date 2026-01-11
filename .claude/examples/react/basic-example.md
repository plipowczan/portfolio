# Basic React Component

## Overview
A simple counter component demonstrating `useState`.

## Implementation

### Counter.jsx
```jsx
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
};

export default Counter;
```

## Usage
```jsx
import Counter from './Counter';

const App = () => (
  <div>
    <h1>My App</h1>
    <Counter />
  </div>
);
```
