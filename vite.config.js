import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    })
  ],
  server: {
    port: 3000,
    open: true,
    fs: {
      // Allow serving files with UTF-8 encoding
      strict: false
    }
  },
  // Ensure proper charset handling
  build: {
    charset: 'utf8'
  }
})

