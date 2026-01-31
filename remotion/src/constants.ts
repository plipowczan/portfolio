// Brand colors
export const COLORS = {
  primary: "#00ff9d",
  secondary: "#00b8ff",
  background: "#0a0e1a",
  darkSurface: "#151b2b",
  text: "#ffffff",
  mutedText: "#9ca3af",
  red: "#ff4444",
} as const;

// Typography
export const FONTS = {
  heading: "Inter",
  code: "Fira Code",
} as const;

// Scene timing (in seconds)
export const SCENE_TIMING = {
  problem: { start: 0, end: 8 },
  traditional: { start: 8, end: 16 },
  hero: { start: 16, end: 28 },
  workflow: { start: 28, end: 38 },
  cta: { start: 38, end: 45 },
} as const;

// FPS
export const FPS = 30;

// Helper to convert seconds to frames
export const secondsToFrames = (seconds: number): number => seconds * FPS;
