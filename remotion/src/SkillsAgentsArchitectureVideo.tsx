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
import { AgentCounterScene } from "./scenes/skills/AgentCounterScene";
import { ArchitectureScene } from "./scenes/skills/ArchitectureScene";
import { AgentCardsScene } from "./scenes/skills/AgentCardsScene";
import { SkillsCTAScene } from "./scenes/skills/SkillsCTAScene";

loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});
loadFiraCode("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
});

export const AGENTS_ARCHITECTURE_DURATION = SK_DURATIONS.agentsArchitecture;

export const SkillsAgentsArchitectureVideo = () => {
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
      {/* Scene 1: Counter - 0-5s */}
      <Sequence from={0} durationInFrames={5 * fps}>
        <AgentCounterScene />
      </Sequence>

      {/* Scene 2: Architecture - 5-15s */}
      <Sequence from={5 * fps} durationInFrames={10 * fps}>
        <ArchitectureScene />
      </Sequence>

      {/* Scene 3: Agent Cards - 15-24s */}
      <Sequence from={15 * fps} durationInFrames={9 * fps}>
        <AgentCardsScene />
      </Sequence>

      {/* Scene 4: CTA - 24-30s */}
      <Sequence from={24 * fps} durationInFrames={6 * fps}>
        <SkillsCTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
