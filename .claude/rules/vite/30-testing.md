# Vite Testing

## Integration
Vite works seamlessly with Vitest (unit) and Playwright (E2E).

## Configuration
Configure `test` property in `vite.config.js` for Vitest:
```javascript
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true
  }
})
```
