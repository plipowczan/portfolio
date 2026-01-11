# Vite Patterns

## Path Aliases
Configure aliases to simplify imports.
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src')
  }
}
```

## Proxying API Requests
Avoid CORS issues in development.
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```
