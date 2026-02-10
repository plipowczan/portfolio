import { COLORS, FPS } from "./constants";

// OpenClaw-specific colors
export const OPENCLAW_COLORS = {
  ...COLORS,
  alertRed: "#ff2222",
  alertRedGlow: "#ff222280",
  warningOrange: "#ff8800",
  terminalGreen: "#00ff41",
  matrixGreen: "#00ff41",
  darkTerminal: "#0d1117",
} as const;

// Scene timing (in seconds) - 50 second total
export const OPENCLAW_TIMING = {
  hype: { start: 0, end: 8 },
  vulnerabilities: { start: 8, end: 20 },
  moltbook: { start: 20, end: 30 },
  lessons: { start: 30, end: 42 },
  cta: { start: 42, end: 50 },
} as const;

// Total duration
export const OPENCLAW_DURATION = 50;

// Helper
export const secondsToFrames = (seconds: number): number => seconds * FPS;
