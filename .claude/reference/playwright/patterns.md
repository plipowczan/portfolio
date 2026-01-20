# Playwright Patterns

## Authenticated State
Reuse authentication state to avoid logging in for every test.

```javascript
// global-setup.js
async function globalSetup(config) {
  // login and save state to 'storageState.json'
}

// playwright.config.js
use: {
  storageState: 'storageState.json',
}
```

## Custom Assertions
Extend expect if needed (rarely needed with web-first assertions).
