# React Setup

## Initial Setup
Using Vite (Recommended):
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

## Configuration
`vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

## Environment Variables
Create `.env` file in root:
| Variable | Purpose | Required |
|----------|---------|----------|
| VITE_API_URL | API Endpoint URL | No |
| VITE_APP_TITLE | Application Title | No |

## Dependencies
`package.json` (core):
```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.1",
    "vite": "^7.2.2"
  }
}
```

## Verification
```bash
npm run dev
# Open http://localhost:5173
```
