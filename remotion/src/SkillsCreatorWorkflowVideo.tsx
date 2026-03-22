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
import { TimeComparisonScene } from "./scenes/skills/TimeComparisonScene";
import { WorkflowStepsScene } from "./scenes/skills/WorkflowStepsScene";
import { SkillCreatorTerminalScene } from "./scenes/skills/SkillCreatorTerminalScene";
import { SkillsCTAScene } from "./scenes/skills/SkillsCTAScene";

loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});
loadFiraCode("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
});

export const CREATOR_WORKFLOW_DURATION = SK_DURATIONS.creatorWorkflow;

export const SkillsCreatorWorkflowVideo = () => {
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
      {/* Scene 1: Time Comparison - 0-5s */}
      <Sequence from={0} durationInFrames={5 * fps}>
        <TimeComparisonScene />
      </Sequence>

      {/* Scene 2: Workflow Steps - 5-15s */}
      <Sequence from={5 * fps} durationInFrames={10 * fps}>
        <WorkflowStepsScene />
      </Sequence>

      {/* Scene 3: Terminal Demo - 15-20s */}
      <Sequence from={15 * fps} durationInFrames={5 * fps}>
        <SkillCreatorTerminalScene />
      </Sequence>

      {/* Scene 4: CTA - 20-25s */}
      <Sequence from={20 * fps} durationInFrames={5 * fps}>
        <SkillsCTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
