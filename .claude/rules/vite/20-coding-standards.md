# Vite Coding Standards

## Imports
- Use ES Modules syntax (`import`/`export`)
- Use absolute imports with alias `@` for `src`
```javascript
import Button from '@/components/Button' // Good
import Button from '../../components/Button' // Avoid deep nesting
```

## Assets
- Place static assets in `public/`
- Import images in JS
```javascript
import logo from './assets/logo.png'
```
