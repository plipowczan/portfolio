# Debugging Flaky Tests

Guide for debugging and fixing flaky E2E tests in the portfolio project.

## Common Issues and Solutions

### 1. Timing Issues

**Symptom:** Test passes locally, fails in CI

**Causes:**
- CI is slower than local machine
- Missing explicit waits
- Race conditions

**Solutions:**

```javascript
// Bad - no wait
await page.click('.menu-item');
await expect(page.locator('#section')).toBeVisible();

// Good - explicit wait
await page.click('.menu-item');
await page.waitForSelector('#section', { state: 'visible' });
await expect(page.locator('#section')).toBeVisible();
```

### 2. Animation Timing (Framer Motion)

**Symptom:** Element not interactable, clicks don't work

**Cause:** Framer Motion animations take 300-500ms

**Solution:**

```javascript
// Wait for animation to complete
await page.click('.trigger');
await page.waitForTimeout(300); // Match animation duration

// Or wait for specific state
await page.waitForSelector('.menu', { state: 'visible' });
await page.waitForFunction(() => {
  const menu = document.querySelector('.menu');
  return getComputedStyle(menu).opacity === '1';
});
```

### 3. Mobile Viewport Issues

**Symptom:** Mobile menu doesn't appear, wrong layout

**Cause:** Viewport must be set BEFORE page.goto()

**Solution:**

```javascript
// Bad - viewport after navigation
await page.goto('http://localhost:3000');
await page.setViewportSize({ width: 375, height: 667 });

// Good - viewport before navigation
await page.setViewportSize({ width: 375, height: 667 });
await page.goto('http://localhost:3000');
```

### 4. SEO Tags Not Found

**Symptom:** Meta tags return null

**Cause:** react-helmet-async updates DOM asynchronously

**Solution:**

```javascript
// Wait for Helmet to update
await page.waitForFunction(() => {
  return document.title !== '' &&
         document.title !== 'Loading...';
});

// Then check meta tags
const description = await page.getAttribute('meta[name="description"]', 'content');
```

### 5. Element Click Intercepted

**Symptom:** "Element click intercepted by another element"

**Causes:**
- Overlay/modal covering element
- Sticky header covering element
- Cookie banner covering element

**Solutions:**

```javascript
// Force click (use sparingly)
await page.click('.button', { force: true });

// Scroll into view first
await page.locator('.button').scrollIntoViewIfNeeded();
await page.click('.button');

// Close overlays first
const cookieBanner = page.locator('.cookie-banner');
if (await cookieBanner.isVisible()) {
  await page.click('button:has-text("Akceptuję")');
}
```

### 6. Flaky Selector

**Symptom:** Element sometimes found, sometimes not

**Causes:**
- Dynamic class names (CSS modules, Tailwind JIT)
- Multiple matching elements
- Element removed/re-added to DOM

**Solutions:**

```javascript
// Bad - too generic
await page.click('.button');

// Good - more specific
await page.click('button[type="submit"]');
await page.click('button:has-text("Wyślij")');
await page.click('form >> button');
```

### 7. Network-Related Failures

**Symptom:** Content doesn't load, images missing

**Cause:** Network requests not completed

**Solution:**

```javascript
// Wait for network idle
await page.goto('http://localhost:3000', {
  waitUntil: 'networkidle'
});

// Or wait for specific request
await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/api/posts')),
  page.click('.load-more')
]);
```

## Debugging Commands

### Step-through debugging

```bash
# Opens Playwright Inspector
npm run test:debug

# Debug specific test
npx playwright test -g "test name" --debug
```

### Generate trace

```bash
# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Headed mode

```bash
# See browser during test
npm run test:headed

# Slow motion
npx playwright test --headed --slow-mo=500
```

### Screenshots and videos

```javascript
// Take screenshot
await page.screenshot({ path: 'debug.png', fullPage: true });

// In playwright.config.js
export default {
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
};
```

## Debugging Checklist

When a test fails:

1. [ ] Run with `--debug` flag to step through
2. [ ] Check if dev server is running (`npm run dev`)
3. [ ] Verify selector with Inspector (click "Pick locator")
4. [ ] Check for timing issues (add waits)
5. [ ] Check viewport size (mobile vs desktop)
6. [ ] Look for overlays (cookie banner, modals)
7. [ ] Check network tab for failed requests
8. [ ] Run test in isolation (`-g "test name"`)
9. [ ] Check if test passes on retry (might be flaky)

## Test Isolation

When tests affect each other:

```javascript
// Reset state before each test
test.beforeEach(async ({ page }) => {
  // Clear cookies
  await page.context().clearCookies();

  // Navigate fresh
  await page.goto('http://localhost:3000');
});

// Or use separate context
test('isolated test', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  // ... test
  await context.close();
});
```

## CI-Specific Issues

### GitHub Actions timeouts

```yaml
# Increase timeout in workflow
- name: Run tests
  run: npm test
  env:
    PLAYWRIGHT_TIMEOUT: 60000
```

### Headless differences

```javascript
// Some things behave differently in headless
test('should work in headless', async ({ page, browserName }) => {
  // Skip if known headless issue
  test.skip(browserName === 'webkit', 'Known WebKit headless issue');

  // Or adjust behavior
  if (process.env.CI) {
    await page.waitForTimeout(1000); // Extra time in CI
  }
});
```

## Quick Fixes Reference

| Issue | Quick Fix |
|-------|-----------|
| Timeout | Add `waitForSelector` before assertion |
| Click intercepted | Add `scrollIntoViewIfNeeded()` |
| Mobile test fails | Set viewport BEFORE `goto()` |
| Animation issues | Add `waitForTimeout(300)` |
| SEO tags null | Add `waitForFunction()` for title |
| Flaky selector | Use more specific selector |
| CI slower | Increase timeouts in config |
