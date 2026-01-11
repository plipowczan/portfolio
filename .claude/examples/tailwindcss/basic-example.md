# Basic Tailwind Component

## Card Component
```jsx
const Card = ({ title, content }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="p-8">
      <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
        {title}
      </div>
      <p className="mt-2 text-gray-500">
        {content}
      </p>
    </div>
  </div>
);
```
