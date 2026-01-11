# Vite Setup

## Configuration
`vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## Environment Variables
- Prefix with `VITE_` to expose to client
- Access via `import.meta.env`
