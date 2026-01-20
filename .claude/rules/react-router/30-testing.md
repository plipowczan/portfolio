# React Router Testing

## Testing Navigation
Wrap components in `MemoryRouter` for testing.

```jsx
import { MemoryRouter } from 'react-router-dom';

test('renders user profile', () => {
  render(
    <MemoryRouter initialEntries={['/users/123']}>
      <Routes>
        <Route path="/users/:id" element={<UserProfile />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByText('User 123')).toBeInTheDocument();
});
```
