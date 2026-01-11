# React Router Coding Standards

## Route Definitions
Use `Routes` and `Route` components.
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="users" element={<Users />}>
    <Route path=":id" element={<UserProfile />} />
  </Route>
</Routes>
```

## Navigation
- Use `<Link>` for internal links.
- Use `<a>` for external links.
- Use `useNavigate` for programmatic navigation (e.g., after form submit).

```jsx
const navigate = useNavigate();
navigate('/success');
```

## Route Parameters
Access params via `useParams`.
```jsx
const { id } = useParams();
```
