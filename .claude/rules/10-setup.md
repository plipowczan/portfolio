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

- **Start Dev Server**: `npm run dev`
- **Build**: `npm run build` (standard build)
- **Build & Prerender**: `npm run build:prerender` (production build with SEO, plus a check that the prerender output is complete)
- **Preview**: `npm run preview`
- **Test**: `npm test` (Playwright E2E — chromium + Mobile Chrome by default; `PW_ALL=1` for the full matrix)
- **Test UI**: `npm test:ui` (Interactive mode)

### Ports

Dev and preview ports are **derived from the checkout location** by
`scripts/ports.mjs`, so every git worktree gets its own pair and two worktrees
can run servers or tests at the same time. Nothing hardcodes a port; the server
prints the one it took at startup. Set `DEV_PORT` / `PREVIEW_PORT` to override
when external tooling needs a fixed address.

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
- **SEO**: natywne hoistowanie metadanych z React 19 + prerendering przez Puppeteer.
