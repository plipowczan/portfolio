import { FPS } from "./constants";

// Agentic Environment series – reuses SK_COLORS palette from skills-constants
export const AE_SIZES = {
  square: { width: 1080, height: 1080 },
} as const;

export const AE_DURATIONS = {
  agenticEnvironment: 25,
} as const;

export const secondsToFrames = (seconds: number): number => seconds * FPS;
