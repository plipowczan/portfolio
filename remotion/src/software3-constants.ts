import { FPS } from "./constants";

// Software 3.0 — "Podłoga vs sufit" (vibe coding vs agentic engineering)
export const S3_COLORS = {
  background: "#0a0e1a",
  darkSurface: "#151b2b",
  text: "#ffffff",
  mutedText: "#9ca3af",
  // Floor = vibe coding (democratizing, everyone) — green
  floor: "#00ff9d",
  floorGlow: "#00ff9d40",
  // Ceiling = agentic engineering (quality bar held) — gold
  ceiling: "#f59e0b",
  ceilingGlow: "#f59e0b40",
  blue: "#60a5fa",
  red: "#ff4444",
} as const;

// LinkedIn portrait
export const S3_SIZE = {
  width: 1080,
  height: 1350,
} as const;

// Total duration in seconds
export const S3_DURATION_SEC = 31;

// Scene boundaries in seconds [start, end]
export const S3_SCENES = {
  intro: { start: 0, end: 4 },
  floor: { start: 4, end: 12 },
  ceiling: { start: 12, end: 20 },
  diverge: { start: 20, end: 27 },
  close: { start: 27, end: 31 },
} as const;

export const secondsToFrames = (seconds: number): number => seconds * FPS;
