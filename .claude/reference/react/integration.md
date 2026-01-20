# React PIV Integration

## How PIV Works with React

### Prime Phase
- Loads React rules from `.claude/rules/`
- Understands component structure and conventions
- Recognizes `src/components/`, `src/hooks/`, `src/pages/`

### Implement Phase
- Generates functional components with hooks
- Uses PropTypes for validation
- Follows file naming conventions (PascalCase for components)
- Suggests appropriate hooks (useState, useEffect)

### Validate Phase
- Checks for linting errors (ESLint)
- Verifies component structure
- Ensures PropTypes are present (if required)

## File Pattern Triggers

| Pattern | Rule Loaded | Purpose |
|---------|-------------|---------|
| `**/*.jsx` | All React Rules | Main component files |
| `**/*.js` | All React Rules | Utility/Hook files |
| `src/components/**/*` | 20-coding-standards.md | Component standards |
