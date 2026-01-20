# Vite PIV Integration

## How PIV Works with Vite

### Prime Phase
- Reads `vite.config.js` to understand build setup and plugins.

### Implement Phase
- Suggests optimized imports.
- Handles environment variables correctly (`import.meta.env`).

### Validate Phase
- Checks for build errors.
