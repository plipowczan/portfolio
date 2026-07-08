# General Development Rules

**Universal rules applicable to all projects and technologies**

---

## Core Principles

### 1. Understand Before Changing

- **NEVER** make changes without understanding the existing code
- **ALWAYS** read relevant files before modifying
- **ASK** clarifying questions when uncertain
- **PRIME** the workspace before starting work

### 2. Follow Existing Patterns

- **MATCH** existing code style and conventions
- **REUSE** existing patterns and abstractions
- **CONSISTENCY** over personal preference
- **WHEN** adding new patterns, document the rationale

### 3. Minimal Changes

- **CHANGE** only what's necessary
- **AVOID** "while I'm here" changes
- **FOCUS** on the task at hand
- **REFACTOR** only when explicitly requested

### 4. Test as You Code

- **WRITE** tests alongside implementation
- **RUN** tests frequently
- **NEVER** leave testing for the end
- **FIX** failures immediately

---

## Code Quality & Style

### JavaScript/React Standards

- **Components**: Use functional components with hooks and arrow functions (`const Component = () => {}`).
- **Exports**: Prefer named exports over default exports.
- **Props**: Use destructuring (`const Component = ({ prop1 }) => {}`).
- **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`).
- **Complexity**: Keep components focused (< 200 lines). Extract logic to custom hooks.
- **Type Checking**: No PropTypes — `prop-types` is NOT a project dependency (importing it breaks the whole Vite module graph). Document props with JSDoc; validate data at module boundaries (see loaders in `src/data/`).

### Naming Conventions

- **Components**: PascalCase (e.g., `Hero.jsx`, `ProjectCard.jsx`)
- **Utilities/Hooks**: camelCase (e.g., `useScrollAnimation.js`, `formatDate.js`)
- **Pages**: PascalCase (e.g., `Home.jsx`, `BlogPost.jsx`)
- **Styles**: kebab-case (e.g., `global-styles.css`)
- **Constants**: UPPERCASE (e.g., `COLORS.js`, `API_ENDPOINTS.js`)

### CSS/Tailwind

- **Approach**: Utility-first with Tailwind CSS.
- **Responsiveness**: Mobile-first design (`text-sm md:text-base`).
- **Custom CSS**: Only for complex animations/gradients in `index.css`.
- **Order**: Layout -> Sizing -> Typography -> Visual -> Effects.

---

## File Organization

### Structure

- **FOLLOW** standard project structure: `src/components`, `src/pages`, `src/hooks`, `src/utils`.
- **GROUP** related files together.
- **SEPARATE** concerns (logic, presentation, data).

---

## Error Handling

### Principles

- **HANDLE** errors gracefully (no silent failures).
- **PROVIDE** meaningful error messages.
- **FAIL** safely (secure by default).

### What to Avoid

- ❌ Silent failures (catching and ignoring errors)
- ❌ Generic error messages ("Error occurred")
- ❌ Exposing sensitive data in errors

---

## Security

### Basic Principles

- **NEVER** trust user input.
- **VALIDATE** at system boundaries.
- **SANITIZE** data before use (especially in `dangerouslySetInnerHTML`).

---

## Performance

### Guidelines

- **OPTIMIZE** images (WebP, lazy loading).
- **ANIMATE** cheaply (transform, opacity).
- **SPLIT** code where appropriate (React.lazy).
- **MEASURE** before optimizing.

---

## Documentation

### When to Document

- **COMPLEX** logic (explain why, not what)
- **ALGORITHMS** (explain approach)
- **WORKAROUNDS** (explain why needed)
- **PUBLIC APIs** (describe usage)

### Documentation Standards

- **Components**: JSDoc style with props description.
- **README**: Maintain up-to-date READMEs in directories.

---

## Collaboration

### Git Workflow

- **BRANCH**: `feature/name` or `fix/name`.
- **COMMIT**: Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`).
- **PULL** before pushing.

---

## Summary

1. **Understand** before changing
2. **Follow** existing patterns
3. **Keep** it simple
4. **Test** as you code
5. **Handle** errors gracefully
6. **Secure** by default
7. **Document** the complex
