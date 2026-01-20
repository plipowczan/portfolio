# Tailwind Testing

## Visual Regression Testing
Tailwind relies on visual output. Use tools like Playwright or Storybook to verify styles visually.

## Unit Testing
Generally not needed for utility classes themselves. Test that conditional classes are applied correctly.

```jsx
test('applies active class', () => {
  render(<Button active />);
  expect(screen.getByRole('button')).toHaveClass('bg-blue-500');
});
```
