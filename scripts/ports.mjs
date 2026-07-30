import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

/**
 * Single source of truth for the dev and preview server ports.
 *
 * The repository is developed across several git worktrees. With hardcoded
 * ports, two worktrees cannot run tests or a prerender at the same time — and,
 * worse, `reuseExistingServer` lets a run in worktree A silently attach to the
 * server of worktree B and pass while testing the wrong application.
 *
 * Ports are therefore derived from the checkout's own location, so every
 * worktree gets its own pair with no per-worktree setup to remember. The
 * derivation is deterministic: the same directory always resolves to the same
 * pair, across processes and across machines.
 *
 * Consumers: vite.config.js, playwright.config.js, scripts/prerender.mjs, and
 * the two specs that need an absolute local URL. In runtime code, config and
 * tests, no port literal belongs anywhere else. (Generic examples in the
 * `.claude/rules/**` technology guides are prose about Vite and Playwright in
 * general, not about this repository's setup.)
 */

// Derived from this file's location, not process.cwd(): a command run from a
// subdirectory must still resolve to its own worktree's ports.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// 100 even slots, 3000–3198. Even base for dev, the next odd number for
// preview, so a pair never straddles another worktree's pair.
const PORT_BASE = 3000;
const PORT_SLOTS = 100;

/** FNV-1a, 32-bit. Chosen for being short and dependency-free, not for crypto. */
const hash = (text) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
};

// Windows reports drive letters inconsistently across tools (C:\ vs c:\), and
// an inconsistent case would hand the same worktree two different ports.
const slot = hash(REPO_ROOT.toLowerCase()) % PORT_SLOTS;

const parsePort = (value, name) => {
  if (value === undefined || value === "") return null;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      `${name}="${value}" is not a valid port. Use an integer 1-65535, or unset it to derive the port from the checkout location.`
    );
  }
  return port;
};

/**
 * Dev server port. `DEV_PORT` overrides the derived value — for external
 * tooling that needs to aim at a known URL.
 */
export const DEV_PORT = parsePort(process.env.DEV_PORT, "DEV_PORT") ?? PORT_BASE + slot * 2;

/**
 * Preview server port (production build, and the `dist-test/` build used by
 * the SEO metadata suite). `PREVIEW_PORT` overrides the derived value.
 */
export const PREVIEW_PORT =
  parsePort(process.env.PREVIEW_PORT, "PREVIEW_PORT") ?? DEV_PORT + 1;

export const DEV_URL = `http://localhost:${DEV_PORT}`;
export const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;
