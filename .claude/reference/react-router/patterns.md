# React Router Patterns

## Layout Route
Share UI (like Navigation) across multiple routes.

```jsx
<Route element={<Layout />}>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Route>

// Layout.jsx
const Layout = () => (
  <div>
    <nav>...</nav>
    <Outlet /> {/* Child route renders here */}
  </div>
);
```

## Protected Route
Redirect unauthenticated users.

```jsx
const ProtectedRoute = ({ children }) => {
  const user = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};
```
