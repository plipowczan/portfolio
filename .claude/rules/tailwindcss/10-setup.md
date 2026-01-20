# Tailwind Setup

## Installation
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Configuration
`tailwind.config.js`:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#00ff9d',
      }
    },
  },
  plugins: [],
}
```

## Editor Integration
Install "Tailwind CSS IntelliSense" for VS Code for autocompletion and linting.
