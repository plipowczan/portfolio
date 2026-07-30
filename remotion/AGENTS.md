# AGENTS.md — remotion/

## Purpose

Remotion video compositions used for social and explainer clips. A separate
project that happens to live in this repository.

## Ownership

**Owns:** `src/` compositions and scenes, `remotion.config.ts`, `tsconfig.json`,
and its own `package.json`.

**Does not own:** anything the website ships.

## Local Contracts

- **Separate build with its own dependencies.** `remotion/package.json` is
  independent of the root one; install and run inside this folder. Nothing here
  is part of `npm run build` or `npm run build:prerender`, and no site code
  imports from it.
- TypeScript and `.tsx` here, unlike the JavaScript site source. Do not carry
  the site's no-TypeScript convention into this folder, or its conventions out.
- Compositions are registered in `src/Root.tsx`. A composition not registered
  there does not exist.
- Per-video constants live in a sibling `*-constants.ts` file rather than inline
  in the composition.

## Work Guidance

- Rendered output is not committed. Only sources belong here.
- A change in this folder never requires a site rebuild or a redeploy.

## Verification

Run Remotion's own preview and render from inside this folder. No root npm
script covers it, and the Playwright suite does not touch it.

## Child DOX Index
