# Project Setup & Configuration

## Environment

### Node.js & Dependencies
- **Runtime**: Node.js 20.x
- **Package Manager**: npm
- **Installation**: `npm install`

### Environment Variables
- Create `.env` file based on `.env.example` (if exists) or usage context.
- Access via `import.meta.env.VITE_VARIABLE_NAME`.

**Common Variables:**
```
VITE_API_URL=https://api.example.com
VITE_FORM_ENDPOINT=https://formspree.io/f/...
```

---

## Development Workflow

### Commands
- **Start Dev Server**: `npm run dev` (localhost:5173)
- **Build**: `npm run build` (standard build)
- **Build & Prerender**: `npm run build:prerender` (production build with SEO)
- **Preview**: `npm run preview`
- **Test**: `npm test` (Playwright E2E)
- **Test UI**: `npm test:ui` (Interactive mode)

### Configuration Files
- **Vite**: `vite.config.js` - Build, proxy, and plugin settings.
- **Tailwind**: `tailwind.config.js` - Theme, colors, and content paths.
- **Playwright**: `playwright.config.js` - E2E test configuration.
- **ESLint**: `eslint.config.js` (or `.eslintrc`) - Linting rules.

---

## Directory Structure
```
src/
├── components/     # React components
│   ├── layout/     # Structural components
│   ├── sections/   # Landing page sections
│   ├── ui/         # Reusable UI elements
│   └── ...
├── content/        # Markdown content (blog)
├── data/           # Static data (projects, skills)
├── hooks/          # Custom React hooks
├── pages/          # Route components
├── styles/         # Global styles
└── utils/          # Helpers and constants
```

## Key Integration Points
- **Routing**: React Router 7 (`src/App.jsx`).
- **State**: Local state + Props (Context where necessary).
- **Animations**: Framer Motion (`src/components/animations/`).
- **SEO**: React Helmet Async + Puppeteer Prerendering.
