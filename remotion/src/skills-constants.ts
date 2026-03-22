import { FPS } from "./constants";

// Skills 2.0 series – purple/blue AI theme palette
export const SK_COLORS = {
  background: "#0a0e1a",
  darkSurface: "#151b2b",
  text: "#ffffff",
  mutedText: "#9ca3af",
  purple: "#a855f7",
  purpleGlow: "#a855f740",
  blue: "#3b82f6",
  blueGlow: "#3b82f640",
  cyan: "#06b6d4",
  cyanGlow: "#06b6d440",
  green: "#00ff9d",
  greenGlow: "#00ff9d40",
  amber: "#f59e0b",
  amberGlow: "#f59e0b40",
  red: "#ff4444",
  redGlow: "#ff444440",
} as const;

// Composition sizes
export const SK_SIZES = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
} as const;

// Durations in seconds
export const SK_DURATIONS = {
  chaosToSystem: 25,
  agentsArchitecture: 30,
  creatorWorkflow: 25,
} as const;

// Helper
export const secondsToFrames = (seconds: number): number => seconds * FPS;
