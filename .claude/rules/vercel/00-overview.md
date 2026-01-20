# Vercel Overview

## Core Principles
### 1. Zero Configuration
Optimal defaults for most frameworks, including Vite/React.

### 2. Global Edge Network
Static assets are served from the edge, close to users.

### 3. Serverless First
Backend logic (if any) runs as serverless functions.

## When to Use Vercel
✅ Good for:
- Deploying React/Next.js apps
- Static sites with dynamic features
- Projects needing preview deployments per PR

❌ Avoid for:
- Long-running server processes (WebSockets, heavy background jobs) - consider AWS/Heroku/DigitalOcean for those parts
- Docker-based deployments (Vercel is not a general purpose container platform)
