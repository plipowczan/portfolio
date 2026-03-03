import { FPS } from "./constants";

// Agency Offer series – colors
export const AO_COLORS = {
  background: "#0a0e1a",
  darkSurface: "#151b2b",
  text: "#ffffff",
  mutedText: "#9ca3af",
  gold: "#f59e0b",
  goldGlow: "#f59e0b40",
  green: "#00ff9d",
  greenGlow: "#00ff9d40",
  red: "#ff4444",
  redGlow: "#ff444440",
  blue: "#60a5fa",
  blueGlow: "#60a5fa40",
} as const;

// Composition sizes
export const AO_SIZES = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
} as const;

// Durations in seconds
export const AO_DURATIONS = {
  process: 20,
  time: 15,
  transform: 25,
  automationEvolution: 30,
  fourWayDecision: 40,
  microTool: 30,
} as const;

// Helper
export const secondsToFrames = (seconds: number): number => seconds * FPS;
