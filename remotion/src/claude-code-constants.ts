import { COLORS, FPS } from "./constants";

// Claude Code specific colors
export const CC_COLORS = {
  ...COLORS,
  amber: "#f59e0b",
  amberGlow: "#f59e0b80",
  green: "#22c55e",
  greenGlow: "#22c55e80",
  cyan: "#06b6d4",
  purple: "#a855f7",
  blue: "#3b82f6",
  red: "#ef4444",
  redGlow: "#ef444480",
  gradientGreenCyan: "linear-gradient(135deg, #22c55e, #06b6d4)",
} as const;

// Composition durations in seconds
export const CC_DURATIONS = {
  problem: 20,
  contextReset: 20,
  pivWorkflow: 22,
} as const;

// Square format for LinkedIn
export const CC_SIZE = {
  width: 1080,
  height: 1080,
} as const;

// Helper
export const secondsToFrames = (seconds: number): number => seconds * FPS;
