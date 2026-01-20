# Framer Motion Patterns

## Staggered Children
Animate children in sequence.

```jsx
const list = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  hidden: { opacity: 0 }
};

<motion.ul initial="hidden" animate="visible" variants={list}>
  <motion.li variants={item} />
  <motion.li variants={item} />
</motion.ul>
```

## Scroll Triggers
Animate when element enters viewport.
```jsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
/>
```
