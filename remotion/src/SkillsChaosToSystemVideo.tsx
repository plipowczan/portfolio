import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadFiraCode } from "@remotion/google-fonts/FiraCode";
import { SK_DURATIONS } from "./skills-constants";
import { ChaosScene } from "./scenes/skills/ChaosScene";
import { SystemScene } from "./scenes/skills/SystemScene";
import { SkillsCTAScene } from "./scenes/skills/SkillsCTAScene";

loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});
loadFiraCode("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
});

export const CHAOS_TO_SYSTEM_DURATION = SK_DURATIONS.chaosToSystem;

export const SkillsChaosToSystemVideo = () => {
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
      {/* Scene 1: Chaos - 0-10s */}
      <Sequence from={0} durationInFrames={10 * fps}>
        <ChaosScene />
      </Sequence>

      {/* Scene 2: System - 10-20s */}
      <Sequence from={10 * fps} durationInFrames={10 * fps}>
        <SystemScene />
      </Sequence>

      {/* Scene 3: CTA - 20-25s */}
      <Sequence from={20 * fps} durationInFrames={5 * fps}>
        <SkillsCTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
