# React Router PIV Integration

## How PIV Works with React Router

### Implement Phase
- Suggests `Link` over `<a>` for internal navigation.
- Implements `useParams` for dynamic routes.
- Structures nested routes correctly.

### Validate Phase
- Checks for broken links (if E2E tests exist).
- Verifies `BrowserRouter` setup.
