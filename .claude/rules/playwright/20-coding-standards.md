# Playwright Coding Standards

## Page Object Model (POM)
Encapsulate page mechanics in classes.

```javascript
// HomePage.js
export class HomePage {
  constructor(page) {
    this.page = page;
  }
  async goto() {
    await this.page.goto('/');
  }
}
```

## Selectors
Prefer user-facing selectors over CSS classes.
- ✅ `getByRole('button', { name: 'Submit' })`
- ✅ `getByText('Welcome')`
- ✅ `getByTestId('custom-element')`
- ❌ `css=.btn-primary`

## Test Structure
Use `test.describe` to group tests and `test.beforeEach` for setup.
