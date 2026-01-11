# React Patterns

## Compound Components
### Description
Build flexible components that share state implicitly.

### Example
```jsx
// Menu.jsx
const MenuContext = createContext();

const Menu = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

Menu.Toggle = ({ children }) => {
  const { open, setOpen } = useContext(MenuContext);
  return <button onClick={() => setOpen(!open)}>{children}</button>;
};

Menu.List = ({ children }) => {
  const { open } = useContext(MenuContext);
  return open ? <ul>{children}</ul> : null;
};

// Usage
<Menu>
  <Menu.Toggle>Options</Menu.Toggle>
  <Menu.List>
    <li>Item 1</li>
    <li>Item 2</li>
  </Menu.List>
</Menu>
```

## Custom Hooks
### Description
Extract state logic to reuse across components.

### Example
```jsx
const useToggle = (initial = false) => {
  const [state, setState] = useState(initial);
  const toggle = useCallback(() => setState(s => !s), []);
  return [state, toggle];
};
```
