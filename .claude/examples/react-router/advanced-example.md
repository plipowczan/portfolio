# Advanced Routing (Protected)

## Protected Route Component
```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

const ProtectedLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <header>Dashboard Header</header>
      <Outlet />
    </div>
  );
};
```

## Usage
```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  
  <Route element={<ProtectedLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
</Routes>
```
