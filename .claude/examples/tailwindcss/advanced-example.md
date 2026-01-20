# Advanced Tailwind Component

## Responsive Grid with Custom Animations

`tailwind.config.js`:
```javascript
theme: {
  extend: {
    animation: {
      'fade-in': 'fadeIn 0.5s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      }
    }
  }
}
```

`Grid.jsx`:
```jsx
const Grid = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {items.map((item, index) => (
      <div 
        key={item.id}
        className="animate-fade-in bg-dark-800 p-6 rounded-lg"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <h3 className="text-xl font-bold text-white">{item.title}</h3>
      </div>
    ))}
  </div>
);
```
