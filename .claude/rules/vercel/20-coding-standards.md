# Vercel Coding Standards

## Environment Variables
- Store secrets in Vercel Dashboard.
- Prefix frontend-exposed vars with `VITE_` (for Vite).

## Routing
- Use `rewrites` for SPA fallback (if not handled by framework preset).
- Use `cleanUrls: true` for nicer URLs.

## Headers
- Configure security headers (HSTS, X-Frame-Options) in `vercel.json`.
- Configure caching for static assets.
