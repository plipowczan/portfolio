# Playwright Testing Strategies

## Isolation
Tests should run in isolation. Each test gets a fresh browser context.

## State Management
Don't share state between tests. If you need a logged-in state, do it in `beforeEach` or use global setup/storage state.

## Debugging
Use `--debug` flag or VS Code extension.
```bash
npx playwright test --debug
```
