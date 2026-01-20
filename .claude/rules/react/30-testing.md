# React Testing

## Testing Philosophy

Focus on testing how the user interacts with your application (behavioral testing) rather than implementation details.

## Test Structure

```
tests/
├── e2e/               # End-to-End tests (Playwright)
├── components/        # Component integration tests
└── utils/             # Unit tests for helpers
```

## Writing Tests

### Component Testing (React Testing Library)

```jsx
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

test("calls onClick when clicked", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);
  fireEvent.click(screen.getByText("Click Me"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### E2E Testing (Playwright)

```javascript
import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Portfolio/);
});
```

## Test Coverage

- **Target**: 70% overall coverage
- **Critical paths**: 100% (Login, Checkout, Form submission)

## Tools

- **Unit/Integration**: Vitest + React Testing Library
- **E2E**: Playwright

## Running Tests

```bash
npm test         # Run E2E tests
npm run test:ui  # Interactive mode
```
