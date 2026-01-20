# React Router Setup

## Installation
```bash
npm install react-router-dom
```

## Configuration
`src/main.jsx`:
```jsx
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```
