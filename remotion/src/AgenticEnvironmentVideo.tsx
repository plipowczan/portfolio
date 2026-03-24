import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadFiraCode } from "@remotion/google-fonts/FiraCode";
import { AE_DURATIONS } from "./agentic-env-constants";
import { HookScene } from "./scenes/agentic-env/HookScene";
import { LayersScene } from "./scenes/agentic-env/LayersScene";
import { SplitScene } from "./scenes/agentic-env/SplitScene";
import { CTAScene } from "./scenes/agentic-env/CTAScene";

loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});
loadFiraCode("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
});

export const AGENTIC_ENV_DURATION = AE_DURATIONS.agenticEnvironment;

export const AgenticEnvironmentVideo = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Global fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Scene 1: Hook — "2 firmy. 1 system. 8 agentów." — 0-4s */}
      <Sequence from={0} durationInFrames={4 * fps} premountFor={1 * fps}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Architecture layers — 4-12s */}
      <Sequence from={4 * fps} durationInFrames={8 * fps} premountFor={1 * fps}>
        <LayersScene />
      </Sequence>

      {/* Scene 3: Split into two companies — 12-20s */}
      <Sequence from={12 * fps} durationInFrames={8 * fps} premountFor={1 * fps}>
        <SplitScene />
      </Sequence>

      {/* Scene 4: CTA — 20-25s */}
      <Sequence from={20 * fps} durationInFrames={5 * fps} premountFor={1 * fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
